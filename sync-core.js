(function(root){
 'use strict';
 const fields={itinerary:['id','name','area','note','day','mapUrl'],prep:['id','name','area','done'],arrival:['id','name','area','done'],restaurants:['id','name','area','cuisine','note'],shopping:['id','name','area','place','qty','price','done','note']};
 const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
 const equal=(a,b)=>{if(a===b)return true;if(a===undefined||b===undefined)return false;if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>equal(v,b[i]));if(a&&b&&typeof a==='object'&&typeof b==='object'){const keys=[...new Set([...Object.keys(a),...Object.keys(b)])];return keys.every(k=>equal(a[k],b[k]))}return false};
 function shared(state){const result={};for(const [type,allowed] of Object.entries(fields)){result[type]=(state[type]||[]).map(item=>{const row={};for(const key of allowed)if(item[key]!==undefined&&['string','number','boolean'].includes(typeof item[key]))row[key]=item[key];return row})}return result}
 function merge(base,local,remote,choices={}){
  const conflicts=[];
  const conflict=(path,b,l,r)=>{const choice=choices[path];if(!choice)conflicts.push({path,base:clone(b),local:clone(l),remote:clone(r)});return clone(choice==='remote'?r:l)};
  function value(b,l,r,path){if(equal(l,r))return clone(l);if(equal(l,b))return clone(r);if(equal(r,b))return clone(l);
   if(b===undefined||l===undefined||r===undefined)return conflict(path,b,l,r);
   if(b&&l&&r&&typeof b==='object'&&typeof l==='object'&&typeof r==='object'&&!Array.isArray(b)&&!Array.isArray(l)&&!Array.isArray(r)){const out={};for(const k of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){const next=value(b[k],l[k],r[k],path+'/'+k);if(next!==undefined)out[k]=next}return out}
   return conflict(path,b,l,r);
  }
  const data={};
  for(const type of Object.keys(fields)){
   const b=base[type]||[],l=local[type]||[],r=remote[type]||[];const bm=new Map(b.map(x=>[x.id,x])),lm=new Map(l.map(x=>[x.id,x])),rm=new Map(r.map(x=>[x.id,x]));const items=new Map();
   for(const id of new Set([...bm.keys(),...lm.keys(),...rm.keys()])){const next=value(bm.get(id),lm.get(id),rm.get(id),type+'/'+id);if(next!==undefined)items.set(id,next)}
   const common=b.filter(x=>lm.has(x.id)&&rm.has(x.id)&&items.has(x.id)).map(x=>x.id);const project=a=>a.map(x=>x.id).filter(id=>common.includes(id));const lp=project(l),rp=project(r);
   let first=r,second=l;
   if(!equal(lp,common)){if(!equal(rp,common)&&!equal(lp,rp)){const selected=conflict(type+'/$order',common,lp,rp);if(equal(selected,lp)){first=l;second=r}}else{first=l;second=r}}
   const order=first.map(x=>x.id).filter(id=>items.has(id));
   for(let i=0;i<second.length;i++){const id=second[i].id;if(!items.has(id)||order.includes(id))continue;let prev=i-1;while(prev>=0&&!order.includes(second[prev].id))prev--;if(prev>=0)order.splice(order.indexOf(second[prev].id)+1,0,id);else{let next=i+1;while(next<second.length&&!order.includes(second[next].id))next++;if(next<second.length)order.splice(order.indexOf(second[next].id),0,id);else order.push(id)}}
   for(const id of items.keys())if(!order.includes(id))order.push(id);
   data[type]=order.map(id=>items.get(id));
  }
  return {data,conflicts};
 }
 const api={shared,merge,equal,clone,types:Object.keys(fields),fieldNames:fields};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TripSyncCore=api;
})(typeof globalThis==='undefined'?this:globalThis);
