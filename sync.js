/* Supabase Auth + revision-checked REST synchronization. No third-party runtime. */
(function(){
 'use strict';
 const Core=TripSyncCore,CONFIG='hokuriku_cloud_config_v1',SESSION='hokuriku_cloud_session_v1';
 const $=id=>document.getElementById(id);let config=null,session=null,busy=false,pending=false,timer=0,conflicts=[],status='尚未設定雲端同步',errorPaused=false;
 const account=()=>config.url+'|'+session.user.id;
 const meta=()=>state._cloudSync?.account===account()?state._cloudSync:null;
 const safe=()=>!storageBlocked&&!document.hidden&&!$('editor').open&&!document.body.classList.contains('is-dragging');
 let visualState='signedout';
 function message(text,phase){
  status=text;$('cloud-status').textContent=text;$('cloud-detail').textContent=text;
  if(phase)visualState=phase;
  const labels={syncing:'同步',synced:'同步',pending:'等待同步',offline:'未連線Server',error:'未連線Server',signedout:'尚未登入',setup:'尚未連接共用行程',conflict:'需要確認',paused:'同步暫停'};
  $('cloud-panel').dataset.syncState=visualState;
  const label=$('cloud-label');if(label.textContent!==labels[visualState])label.textContent=labels[visualState];
 }
 function showControls(){
  const logged=Boolean(session);$('cloud-login').hidden=logged;$('cloud-account').hidden=!logged;
  $('cloud-email-label').textContent=logged?session.user.email||'家庭帳號':'';
  $('cloud-logout').disabled=busy;$('cloud-now').disabled=busy;
 }
 function storeSession(value){localStorage.setItem(SESSION,JSON.stringify(value));session=value}
 function checkConfig(url,key){
  const parsed=new URL(url);if(parsed.protocol!=='https:'||!/^[-a-z0-9]+\.supabase\.co$/.test(parsed.hostname)||parsed.port||parsed.username||parsed.password)throw Error('請輸入 https://專案編號.supabase.co 格式的 Project URL');
  if(key.startsWith('sb_secret_'))throw Error('不可使用 secret key，請改用 publishable key');
  if(!key.startsWith('sb_publishable_')){try{const payload=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));if(payload.role!=='anon')throw Error()}catch{throw Error('請使用 publishable key 或 anon public key；不可使用 service_role')}}
  return {url:parsed.origin,key};
 }
 async function request(path,{method='GET',body,token,auth=true}={}){
  if(auth)await freshSession();
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  try{const response=await fetch(config.url+path,{method,headers:{apikey:config.key,...(auth?{Authorization:'Bearer '+session.access_token}:token?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,cache:'no-store'});
   const result=await response.json().catch(()=>null);if(!response.ok){if(result?.code==='PGRST202'&&path.includes('save_family_trip_v12'))throw Error('請先在 Supabase SQL Editor 執行 cloud/upgrade-v12.sql，以啟用備用行程與地圖網址同步');if(response.status===401)throw Error('登入已過期，請登出後重新登入；本機修改仍保留');throw Error(result?.msg||result?.message||result?.error_description||'雲端請求失敗（'+response.status+'）')}return result;
  }finally{clearTimeout(timeout)}
 }
 async function freshSession(){
  if(!session)throw Error('請先登入');if((session.expires_at||0)*1000>Date.now()+60000)return;
  const old=session;const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',auth:false,body:{refresh_token:old.refresh_token}});
  storeSession({...next,expires_at:Math.floor(Date.now()/1000)+next.expires_in});
 }
 async function readCloud(){const rows=await request('/rest/v1/family_trip?select=data,revision,updated_at&user_id=eq.'+encodeURIComponent(session.user.id));if(!Array.isArray(rows))throw Error('雲端回應格式錯誤');if(!rows.length)return null;validate(rows[0].data);return {...rows[0],data:Core.shared(rows[0].data)}}
 async function upload(data,revision){return request('/rest/v1/rpc/save_family_trip_v12',{method:'POST',body:{expected_revision:revision,new_data:Core.shared(data)}})}
 function persistMetadata(base,revision){state._cloudSync={version:1,account:account(),base:Core.clone(base),revision};save()}
 function applyCloud(data,base,revision){
  if(!safe())return false;const next=Core.clone(state);
  for(const type of Core.types){const old=new Map(state[type].map(x=>[x.id,x]));next[type]=data[type].map(x=>{const extra={...old.get(x.id)};for(const key of Core.fieldNames[type])delete extra[key];return {...extra,...x}})}
  next._cloudSync={version:1,account:account(),base:Core.clone(base),revision};validate(next);
  const text=JSON.stringify(next);if(text===JSON.stringify(state))return true;localStorage.setItem(KEY,text);state=next;lastSaved=text;passportVisible=false;render();return true;
 }
 function backupLocal(){const text=JSON.stringify({version:1,exportedAt:new Date().toISOString(),data:state},null,2);localStorage.setItem('hokuriku_before_cloud_v1',text);downloadBackup(text,'hokuriku-before-cloud.json')}
 function clearConflicts(){conflicts=[];$('cloud-conflicts').replaceChildren()}
 function showConflicts(found){
  conflicts=found;cloudConflictLocal=Core.shared(state);$('cloud-panel').open=true;const box=$('cloud-conflicts');box.replaceChildren();
  const heading=document.createElement('h3');heading.textContent='同時修改的內容需要選擇';box.append(heading);
  const info=document.createElement('p');info.textContent='尚未上傳這些衝突。請逐項選擇要保留的版本；其他不衝突的修改會一起合併。';box.append(info);
  for(const c of found){const card=document.createElement('div');card.className='cloud-conflict';const label=document.createElement('strong');label.textContent=c.path;card.append(label);
   for(const [choice,title,value] of [['local','此裝置',c.local],['remote','雲端',c.remote]]){const row=document.createElement('label');const input=document.createElement('input');input.type='radio';input.name='conflict-'+c.path;input.value=choice;row.append(input,document.createTextNode(title+'：'+(value===undefined?'刪除':JSON.stringify(value))));card.append(row)}box.append(card);
  }
  const button=document.createElement('button');button.className='btn';button.textContent='依以上選擇合併並同步';button.onclick=()=>{
   const choices={};for(const c of conflicts){const selected=[...box.querySelectorAll('input')].find(input=>input.name==='conflict-'+c.path&&input.checked);if(!selected){message('請為每一筆衝突選擇版本');return}choices[c.path]=selected.value}
   // Choices are bound to exact local/remote versions. Never reuse after either changed.
   synchronize({choices,expectedLocal:cloudConflictLocal,expectedRemote:cloudConflictRemote});
  };box.append(button);message('有 '+found.length+' 筆同時修改，請選擇保留版本','conflict');
 }
 let cloudConflictRemote=null,cloudConflictLocal=null;
 function onboarding(cloud){$('cloud-onboarding').hidden=false;$('cloud-create').hidden=Boolean(cloud);$('cloud-adopt').hidden=!cloud;message(cloud?'雲端已有行程。請先選擇使用雲端內容；此裝置會先備份。':'雲端尚無行程。請在資料最完整的裝置建立共用行程。','setup')}
 async function synchronize(options={}){
  if(busy){pending=true;return}if(!session||!config||errorPaused)return;
  if(!navigator.onLine){message('離線中：修改已留在此裝置，連線後自動同步','offline');return}
  if(!safe()){message(storageBlocked?'本機資料已鎖定，請重新載入':'編輯完成後會繼續同步',storageBlocked?'paused':visualState);return}
  busy=true;showControls();message('正在與 Server 同步行程…','syncing');
  try{
   for(let attempt=0;attempt<4;attempt++){
    const cloud=await readCloud();if(!safe())return;
    const baseline=meta();if(!baseline){onboarding(cloud);return}
    if(!cloud)throw Error('雲端行程不存在；為避免意外重建，請先確認雲端設定');
    const local=Core.shared(state);let choices={};
    if(options.choices&&Core.equal(options.expectedLocal,local)&&Core.equal(options.expectedRemote,cloud.data))choices=options.choices;
    const merged=Core.merge(baseline.base,local,cloud.data,choices);
    if(merged.conflicts.length){cloudConflictRemote=Core.clone(cloud.data);showConflicts(merged.conflicts);return}
    clearConflicts();$('cloud-onboarding').hidden=true;
    let acknowledged=cloud;
    if(!Core.equal(merged.data,cloud.data)){
     acknowledged=await upload(merged.data,cloud.revision);if(!acknowledged.ok){options={};continue}
     // Remember the snapshot that was successfully sent even if another local edit happened in flight.
     if(!safe()){persistMetadata(local,acknowledged.revision);pending=true;message('已上傳；結束編輯後會套用最新內容','pending');return}
    }
    const latest=Core.shared(state),rebased=Core.merge(local,latest,acknowledged.data);
    if(rebased.conflicts.length){persistMetadata(local,acknowledged.revision);cloudConflictRemote=Core.clone(acknowledged.data);showConflicts(rebased.conflicts);return}
    applyCloud(rebased.data,acknowledged.data,acknowledged.revision);
    const dirty=!Core.equal(rebased.data,acknowledged.data);
    message(dirty?'此裝置有新修改，繼續上傳中…':'已同步 · '+new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),dirty?'syncing':'synced');
    if(dirty){options={};continue}return;
   }
   message('其他裝置正在修改，稍後自動重試','pending');
  }catch(error){message('尚未完成同步：'+(error.name==='AbortError'?'連線逾時，稍後重試':error.message)+'。本機內容保留','error');}
  finally{busy=false;showControls();if(!navigator.onLine)message('離線中：修改保留，連線後自動同步','offline');if(pending){pending=false;schedule(1200)}}
 }
 function schedule(ms=700){clearTimeout(timer);timer=setTimeout(()=>synchronize(),ms)}
 async function initializeCloud(useLocal){
  if(busy||!session)return;if(!safe()){message('請先關閉編輯視窗');return}busy=true;showControls();
  try{
   const cloud=await readCloud();if(!safe())throw Error('請先完成編輯再連接雲端');
   if(useLocal&&cloud){onboarding(cloud);return}if(!useLocal&&!cloud){onboarding(null);return}
   if(!confirm(useLocal?'將此裝置的行程與清單建立為三個裝置共用的內容？護照不會上傳。':'此裝置會先下載備份，再採用雲端行程與清單。護照資料保留在本機。確定繼續？'))return;
   backupLocal();
   if(useLocal){const local=Core.shared(state);const result=await upload(local,0);if(!result.ok){message('另一裝置已建立雲端行程，請改選使用雲端內容');return}persistMetadata(local,result.revision)}
   else if(!applyCloud(cloud.data,cloud.data,cloud.revision))throw Error('請先完成編輯再連接雲端');
   $('cloud-onboarding').hidden=true;message('已連接家庭行程，開始自動同步','syncing');pending=true;
  }catch(error){message('連接失敗：'+error.message+'；本機資料仍保留','error')}finally{busy=false;showControls();if(pending){pending=false;schedule()}}
 }
 $('cloud-login').addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;busy=true;showControls();$('cloud-login-button').disabled=true;
  try{
   const selected=checkConfig($('cloud-url').value.trim(),$('cloud-key').value.trim());const prior=config;config=selected;
   let next;try{next=await request('/auth/v1/token?grant_type=password',{method:'POST',auth:false,body:{email:$('cloud-email').value.trim(),password:$('cloud-password').value}})}catch(error){config=prior;throw error}
   localStorage.setItem(CONFIG,JSON.stringify(selected));storeSession({...next,expires_at:Math.floor(Date.now()/1000)+next.expires_in});$('cloud-password').value='';message('已登入，正在確認共用行程','syncing');pending=true;
  }catch(error){message('登入失敗：'+error.message,'error')}finally{busy=false;$('cloud-login-button').disabled=false;showControls();if(pending){pending=false;schedule()}}
 });
 $('cloud-logout').onclick=async()=>{
  if(busy)return;if(!confirm('登出此裝置？尚未上傳的修改仍保留在本機，登入原帳號後可繼續同步。'))return;
  busy=true;showControls();try{if(navigator.onLine)await request('/auth/v1/logout?scope=local',{method:'POST'})}catch{/* Local sign-out still removes this device's session. */}
  finally{localStorage.removeItem(SESSION);session=null;clearTimeout(timer);clearConflicts();$('cloud-onboarding').hidden=true;busy=false;message('已登出；本機內容保留','signedout');showControls()}
 };
 $('cloud-now').onclick=()=>synchronize();$('cloud-create').onclick=()=>initializeCloud(true);$('cloud-adopt').onclick=()=>initializeCloud(false);
 addEventListener('trip-local-save',()=>{if(session){message('已儲存在此裝置 · 等待上傳',!navigator.onLine?'offline':meta()?'pending':'setup');schedule()}});
 addEventListener('online',()=>schedule(100));addEventListener('offline',()=>message(session?'離線中：可繼續編輯，連線後自動上傳':'尚未登入雲端；內容只在此裝置','offline'));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(100)});
 $('editor').addEventListener('close',()=>schedule());
 setInterval(()=>{if(!document.hidden&&session&&!conflicts.length)synchronize()},5000);
 try{
  const stored=localStorage.getItem(CONFIG);if(stored)config=checkConfig(JSON.parse(stored).url,JSON.parse(stored).key);
  else if(window.TRIP_CLOUD_CONFIG?.url)config=checkConfig(window.TRIP_CLOUD_CONFIG.url,window.TRIP_CLOUD_CONFIG.key);
  const saved=localStorage.getItem(SESSION);if(saved&&config){const parsed=JSON.parse(saved);if(!parsed.user?.id||!parsed.access_token||!parsed.refresh_token)throw Error('登入狀態無效');session=parsed}
  $('cloud-url').value=config?.url||'';$('cloud-key').value=config?.key||'';
 }catch{errorPaused=true;message('同步設定無法讀取。請保留本機備份，清除同步設定後再登入。','error')}
 $('cloud-reset').onclick=()=>{if(busy)return;if(!confirm('只清除本機的雲端設定與登入狀態，保留所有行程及護照資料？'))return;localStorage.removeItem(CONFIG);localStorage.removeItem(SESSION);session=null;config=null;errorPaused=false;clearConflicts();$('cloud-onboarding').hidden=true;showControls();message('同步設定已清除，可重新登入','signedout')};
 showControls();if(session){message(navigator.onLine?'正在確認 Server 連線…':'離線中：連線後自動同步',navigator.onLine?'pending':'offline');schedule(100)}else message(status,errorPaused?'error':navigator.onLine?'signedout':'offline');
})();
