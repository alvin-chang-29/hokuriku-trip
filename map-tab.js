(function(root){
 'use strict';
 const C=TripMapCore,colors=['#c46089','#b0793d','#4f8c69','#478da3','#7864a1','#b45154','#687c36','#427486'];
 const dates=['12/03（四）','12/04（五）','12/05（六）','12/06（日）','12/07（一）','12/08（二）','12/09（三）','12/10（四）'];
 const $=id=>document.getElementById(id),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let filter='all',active=null,map=null,layer=null,observer=null,position=null,lastSignature='',data=[],editItem=null,linkFor=null;
 function color(item){return colors[dates.indexOf(item.day)]||'#727e87'}
 function render(){return `<section class="active card trip-map-section"><h2>景點地圖</h2><div class="trip-map-controls"><label for="trip-map-day">選擇日期<select id="trip-map-day">${[['all','全部行程'],...dates.map(d=>[d,d]),['unscheduled','備用行程']].map(([k,v])=>`<option value="${k}" ${filter===k?'selected':''}>${v}</option>`).join('')}</select></label><button class="btn alt" id="trip-map-fit">顯示當日全部景點</button></div><p class="note">線上地圖需要網路。單點數字是行程順序；「N 個景點」代表附近群組，點一下即可列出全部；相對位置不代表行車路線。未能定位的項目保留在下方清單。</p><p id="trip-map-status" class="trip-map-status" role="status">載入地圖中…</p><div id="trip-map-canvas" class="trip-map-canvas" aria-label="當日景點地圖"></div><div id="trip-map-details" class="trip-map-details" aria-live="polite"></div><p id="trip-map-count" class="map-count"></p><div id="trip-map-points" class="trip-map-points"></div><p class="note trip-map-source">底圖：<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">國土地理院</a>。部分景點座標：<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>。設施代表點未必是入口。</p><dialog id="trip-map-group" class="trip-map-group" aria-labelledby="map-group-title"><div class="map-group-heading"><h2 id="map-group-title">附近景點</h2><button class="btn alt" id="map-group-close" aria-label="關閉景點群組">關閉</button></div><p class="note">編號是目前清單順序。直接選擇景點，不需要先放大地圖。</p><div id="map-group-list"></div></dialog></section>`}
 function dispose(){if(map){position={center:map.getCenter(),zoom:map.getZoom()};map.remove();map=null}observer?.disconnect();observer=null;layer=null}
 function chosen(){return C.rows(data,filter,MapLocations)}
 function fit(){if(!map)return;const points=chosen().filter(x=>x.point).map(x=>[x.point.lat,x.point.lng]);if(points.length)map.fitBounds(points,{padding:[35,35],maxZoom:15,animate:false});else map.setView([36.7,136.9],8)}
 function status(text,error=false){if($('trip-map-status')){$('trip-map-status').textContent=text;$('trip-map-status').classList.toggle('map-tile-warning',error)}}
 function select(id,pan){active=id;paint();const x=chosen().find(x=>x.item.id===id);if(pan&&x?.point&&map)map.setView([x.point.lat,x.point.lng],Math.max(13,map.getZoom()),{animate:false})}
 function paint(){
  if(!$('trip-map-points'))return;const rows=chosen();if(!rows.some(x=>x.item.id===active))active=null;
  markers();
  $('trip-map-count').textContent=`${rows.length} 個行程項目 · ${rows.filter(x=>x.point).length} 個已定位 · ${rows.filter(x=>!x.point).length} 個待定位`;
  $('trip-map-points').innerHTML=rows.length?rows.map(({item,point},i)=>`<div class="trip-map-point ${item.id===active?'is-selected':''}"><span class="trip-map-number" style="background:${color(item)}">${i+1}</span><button class="map-select" data-map-select="${escape(item.id)}"><strong>${escape(item.name)}</strong><small>${item.day==='unscheduled'?'備用行程':escape(item.day)} · ${point?point.label:'待定位'}</small></button><button class="btn alt mini map-edit" data-map-edit="${escape(item.id)}">編輯</button></div>`).join(''):'<p class="note">這一天尚未安排行程。</p>';
  const x=rows.find(x=>x.item.id===active),detail=$('trip-map-details');detail.innerHTML='';if(!x)return;
  const {item,point}=x;
  detail.innerHTML=`<h3>${escape(item.name)}</h3><p class="note">${escape(item.note||'')}</p><p class="note">${point?`${point.label}：${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}。${escape(point.note||'')}`:'此項目沒有可靠座標。可編輯 Google Maps 網址，使用包含景點座標的完整網址；短網址及只有名稱的連結暫時無法自動定位。'}</p><div class="toolbar"><a class="btn alt" href="${escape(linkFor(item))}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a><button class="btn alt" id="trip-map-edit-selected">編輯景點</button>${point?.source?`<a class="btn alt" href="${escape(point.source)}" target="_blank" rel="noopener noreferrer">位置來源 ↗</a>`:''}</div>`;
  $('trip-map-edit-selected').onclick=()=>editItem(item.id);
 }

 function openGroup(group){
  const dialog=$('trip-map-group');$('map-group-title').textContent=group.length+' 個景點';
  $('map-group-list').innerHTML=group.map(({item,index})=>`<button class="map-group-item" data-group-id="${escape(item.id)}"><span class="trip-map-number" style="background:${color(item)}">${index+1}</span><span><strong>${escape(item.name)}</strong><small>${item.day==='unscheduled'?'備用行程':escape(item.day)}</small></span><span>›</span></button>`).join('');
  dialog.showModal();
 }
 function markers(){
  if(!map||!layer)return;layer.clearLayers();
  C.clusters(chosen(),p=>map.latLngToLayerPoint([p.lat,p.lng])).forEach(group=>{
   if(group.length>1){
    const center=[group.reduce((s,x)=>s+x.point.lat,0)/group.length,group.reduce((s,x)=>s+x.point.lng,0)/group.length];
    const label=group.length+' 個景點';const icon=L.divIcon({className:'trip-map-icon',html:`<span class="map-cluster"><b>${group.length}</b><small>個景點</small></span>`,iconSize:[60,60],iconAnchor:[30,30]});
    L.marker(center,{icon,title:label,keyboard:true}).addTo(layer).on('click',()=>openGroup(group));
   }else{const {item,point,index}=group[0];const icon=L.divIcon({className:'trip-map-icon',html:`<span class="trip-map-pin ${item.id===active?'selected-pin':''}" style="background:${color(item)}">${index+1}</span>`,iconSize:[36,36],iconAnchor:[18,18]});L.marker([point.lat,point.lng],{icon,title:item.name,keyboard:true}).addTo(layer).bindTooltip(escape(item.name)).on('click',()=>openGroup(group));}
  });
 }
 function mount(items,onEdit,mapsHref){
  if(!$('trip-map-canvas'))return;data=items;editItem=onEdit;linkFor=mapsHref;
  const signature=JSON.stringify(chosen().map(x=>[x.item.id,x.item.day,x.point]));
  if(root.L){map=L.map('trip-map-canvas',{minZoom:7,maxZoom:18,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false}).setView(position?.center||[36.7,136.9],position?.zoom||8);layer=L.layerGroup().addTo(map);map.on('zoomend',markers);
   const tiles=L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',{minZoom:7,maxZoom:18,attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">國土地理院</a>'});let errors=0;
   tiles.on('loading',()=>{errors=0;status('載入線上底圖…')}).on('tileerror',()=>{errors++;status('部分底圖載入失敗。請檢查網路；行程資料仍保留。',true)}).on('load',()=>status(errors?'部分底圖未載入，請連網後重新開啟地圖。':'線上地圖 · 可拖動、雙指縮放，點數字查看景點',errors>0)).addTo(map);
   L.control.scale({imperial:false}).addTo(map);observer=new ResizeObserver(()=>map?.invalidateSize({pan:false}));observer.observe($('trip-map-canvas'));
  }else status('地圖元件未載入，請確認更新包中的 vendor 資料夾已上傳。',true);
  paint();if(!position||signature!==lastSignature)fit();lastSignature=signature;
  $('trip-map-day').onchange=e=>{filter=e.target.value;active=null;paint();fit();lastSignature=JSON.stringify(chosen().map(x=>[x.item.id,x.item.day,x.point]))};
  $('trip-map-fit').onclick=fit;
  $('map-group-close').onclick=()=>$('trip-map-group').close();
  $('map-group-list').onclick=e=>{const b=e.target.closest('[data-group-id]');if(!b)return;$('trip-map-group').close();select(b.dataset.groupId,false);$('trip-map-details').scrollIntoView({block:'nearest',behavior:'smooth'})};
  $('trip-map-points').onclick=e=>{const edit=e.target.closest('[data-map-edit]');if(edit){editItem(edit.dataset.mapEdit);return}const selectButton=e.target.closest('[data-map-select]');if(selectButton)select(selectButton.dataset.mapSelect,true)};
 }
 root.TripMap={render,mount,dispose};
})(globalThis);
