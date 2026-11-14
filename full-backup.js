(function() {
  'use strict';
  const core=FullBackupCore;
  function deviceName() {
    return prompt('請輸入裝置名稱，例如 Alvin-iPhone、Emily-iPhone 或 iPad','我的裝置');
  }
  function stamp() {
    const date=new Date();
    return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')+
      '_'+[date.getHours(),date.getMinutes(),date.getSeconds()].map(n=>String(n).padStart(2,'0')).join('');
  }
  function download(device,prefix) {
    const backup=core.create(localStorage,state,device);
    core.validateEntries(backup.entries,validate);
    const name=device.replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,50)||'裝置';
    downloadBackup(JSON.stringify(backup,null,2),prefix+'-'+name+'-'+stamp()+'.json');
  }
  window.exportFullLocalBackup=function() {
    const device=deviceName();
    if(device===null)return;
    if(!confirm('完整備份包含護照與預訂資料。請保存到私人位置，勿上傳GitHub。'))return;
    try {download(device,'hokuriku-V24完整備份');notify('完整備份已送出下載，請確認檔案已保存。');}
    catch(error){notify('完整備份未完成：'+error.message);}
  };
  window.importFullLocalBackup=async function(event) {
    const file=event.target.files[0];
    if(!file)return;
    try {
      if(file.size>20*1024*1024)throw Error('檔案超過20 MB');
      const imported=core.parse(await file.text(),validate);
      const scope=imported.full?'主行程、護照、12/3、12/10、自訂子項目與動畫偏好':'主行程與護照；兩個交通分頁與自訂子項目保留目前資料';
      if(!confirm('即將還原「'+file.name+'」。\n範圍：'+scope+'。\n請先關閉此網站的其他視窗。下一步會下載目前裝置的完整備份。'))return;
      const device=deviceName();
      if(device===null)return;
      download(device,'hokuriku-還原前完整備份');
      if(!confirm('請先確認剛剛下載的「還原前完整備份」已保存。\n確認後將取代上述範圍的資料並重新載入App。家庭同步需要重新登入。'))return;
      core.restore(localStorage,imported.entries);
      location.reload();
    }catch(error){notify('還原未完成：'+error.message);}
    finally{event.target.value='';}
  };
  const footer=document.querySelector('.footer');
  const panel=document.createElement('div');
  panel.className='full-backup-actions';
  panel.innerHTML='<button type="button" class="btn" onclick="exportFullLocalBackup()">完整本機備份</button><button type="button" class="btn alt" onclick="document.getElementById(\'fullLocalImport\').click()">還原完整備份</button><input id="fullLocalImport" type="file" accept=".json,application/json" hidden onchange="importFullLocalBackup(event)">';
  footer.append(panel);
})();
