(function(root){
 'use strict';
 function valid(lat,lng){return Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-85&&lat<=85&&lng>=-180&&lng<=180}
 function coordinates(value){
  try{
   const u=new URL(value),host=u.hostname.toLowerCase();
   if(u.protocol!=='https:'||u.username||u.password||!(/^(www\.)?google\.(com|co\.jp|com\.tw)$/.test(host)||/^maps\.google\.(com|co\.jp|com\.tw)$/.test(host)))return null;
   const full=decodeURIComponent(u.href);const pair=full.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
   // @lat,lng is the camera position, NOT necessarily the selected place.
   const q=u.searchParams.get('query')||u.searchParams.get('q')||'';
   const direct=q.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
   const m=pair||direct;if(!m)return null;const lat=Number(m[1]),lng=Number(m[2]);return valid(lat,lng)?{lat,lng,kind:'link',label:'地圖網址中的座標'}:null;
  }catch{return null}
 }
 const aliases={
  '富山機場抵達':'富山機場','抵達富山機場':'富山機場','能登機場':'能登機場（航廈）','能登島水族館（備選）':'能登島水族館',
  '三井 OUTLET PARK 北陸小矢部':'三井 OUTLET 北陸小矢部','白川鄉合掌村':'白川鄉（巴士總站）'
 };
 function locate(item,catalog){
  // An explicit user URL wins. Never silently replace an unresolved custom link with a guessed location.
  if(item.mapUrl?.trim()){
   const direct=coordinates(item.mapUrl);if(direct)return direct;
   const known=(root.TripMapLinks||[]).find(p=>p.url===item.mapUrl.trim());
   return known&&valid(known.lat,known.lng)?{lat:known.lat,lng:known.lng,kind:'link',label:'分享連結的景點座標'}:null;
  }
  const cleaned=item.name.trim().replace(/^\d{1,2}:\d{2}\s*/,''),name=aliases[cleaned]||cleaned;const x=catalog.find(p=>p.name===name);
  return x?{lat:x.lat,lng:x.lng,kind:'catalog',label:'景點參考座標',source:x.source,note:x.note}:null;
 }
 function rows(items,day,catalog){return items.filter(x=>day==='all'||x.day===day).map(item=>({item,point:locate(item,catalog)}))}
 function clusters(rows,project,radius=66){
 const points=rows.map((row,index)=>({...row,index})).filter(x=>x.point).map(x=>({...x,pixel:project(x.point)}));
 const groups=[];const seen=new Set();
 for(let i=0;i<points.length;i++){if(seen.has(i))continue;const queue=[i],group=[];seen.add(i);
  while(queue.length){const n=queue.shift(),a=points[n];group.push(a);for(let j=0;j<points.length;j++){if(seen.has(j))continue;const b=points[j];if(Math.hypot(a.pixel.x-b.pixel.x,a.pixel.y-b.pixel.y)<radius){seen.add(j);queue.push(j)}}}
  groups.push(group.sort((a,b)=>a.index-b.index));
 }return groups;
 }
 const api={valid,coordinates,locate,rows,clusters};root.TripMapCore=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
