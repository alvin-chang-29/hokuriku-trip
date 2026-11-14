const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),B=require('../full-backup-core.js');
function storage(initial={}) {
 const entries=new Map(Object.entries(initial));
 return {entries,get length(){return entries.size},key:i=>[...entries.keys()][i],getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.delete(k)};
}
const app=vm.createContext({structuredClone,console,URL,Blob,setTimeout,clearTimeout,location:{protocol:'file:'},navigator:{},addEventListener(){},document:{getElementById:()=>({textContent:''}),addEventListener(){}},localStorage:storage()});
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8').replace(/render\(\);\s*$/,''),app);
const defaults=JSON.parse(vm.runInContext('JSON.stringify(state)',app));
const validate=data=>{app.input=data;return vm.runInContext('validate(input)',app)};
const returnContext=vm.createContext({});
for(const file of ['return-data.js','return-core.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),returnContext);
const returnState=returnContext.ReturnCore.defaults(returnContext.HOKURIKU_RETURN);
function fixture(){
 const main=structuredClone(defaults);
 main.passports[0].passportNumber='LOCAL-TEST-ONLY';
 main.itinerary[0].name='備份測試景點';
 main._cloudSync={account:'test'};
 const day={version:1,checks:{'step:land:0':true},route:'taxi',stationArrival:'19:30',arrivalDate:'2026-12-03',bufferMin:20};
 return storage({
 [B.MAIN]:JSON.stringify(main),
 'hokuriku_dayone_20261203_v1':JSON.stringify(day),
 'hokuriku2026.day8.state.v1_3':JSON.stringify(returnState),
 'hokuriku.execution.items.v1':JSON.stringify({custom:{names:{title:'我的報到'},children:[{id:'kid',text:'四本護照',done:true}]}}),
 'hokuriku_hero_running_v1':'false',
 'hokuriku2026.day8.bookings':'{"private_transfer":{"reference":"KEEP"}}',
 [B.SESSION]:'DO_NOT_EXPORT_ACCESS_TOKEN',
 hokuriku_cloud_config_v1:'CONFIG_DO_NOT_EXPORT',
 unrelated:'KEEP'
 });
}
test('complete backup round-trip includes passport, both execution pages, custom children and legacy bookings without auth',()=>{
 const source=fixture(),file=B.create(source,defaults,'iPhone');
 const text=JSON.stringify(file);
 assert.ok(!text.includes('DO_NOT_EXPORT'));assert.ok(!text.includes('_cloudSync'));
 const parsed=B.parse(text,validate),target=storage({unrelated:'KEEP',[B.SESSION]:'logged-in'});
 B.restore(target,parsed.entries);
 for(const key of B.keys)if(key!==B.MAIN)assert.equal(target.getItem(key),source.getItem(key));
 assert.equal(JSON.parse(target.getItem(B.MAIN)).passports[0].passportNumber,'LOCAL-TEST-ONLY');
 assert.equal(target.getItem(B.SESSION),null);assert.equal(target.getItem('unrelated'),'KEEP');
 assert.equal(target.getItem(B.JOURNAL),null);
});
test('legacy main JSON restores only main and keeps local traffic edits',()=>{
 const target=fixture(),before=target.getItem('hokuriku.execution.items.v1');
 const parsed=B.parse(JSON.stringify({version:1,data:defaults}),validate);
 assert.equal(parsed.full,false);B.restore(target,parsed.entries);
 assert.equal(target.getItem('hokuriku.execution.items.v1'),before);
});
test('validation rejects missing groups, credentials, invalid checklist and unsafe main data before mutation',()=>{
 const source=fixture(),file=B.create(source,defaults,'iPad'),baseline=JSON.stringify([...source.entries]);
 for(const mutate of [
 x=>delete x.entries[B.keys[1]],
 x=>x.entries[B.SESSION]='secret',
 x=>x.entries[B.keys[1]]='{"version":1}',
 x=>x.entries[B.keys[3]]='{"x":{"names":{},"children":[{}]}}',
 x=>x.entries[B.MAIN]='{"itinerary":[]}',
 x=>x.version=99
 ]){const broken=structuredClone(file);mutate(broken);assert.throws(()=>B.parse(JSON.stringify(broken),validate));}
 assert.equal(JSON.stringify([...source.entries]),baseline);
});
test('partial storage failure rolls back every replaced key and session',()=>{
 const target=fixture(),baseline=[...target.entries],set=target.setItem;let failed=false;
 target.setItem=(k,v)=>{if(k===B.keys[2]&&!failed){failed=true;throw Error('quota')}set(k,v)};
 const file=B.create(fixture(),defaults,'source');file.entries[B.MAIN]=JSON.stringify(defaults);
 assert.throws(()=>B.restore(target,B.parse(JSON.stringify(file),validate).entries));
 assert.deepEqual([...target.entries],baseline);
});
test('journal capacity failure occurs before any data replacement',()=>{
 const target=fixture(),before=[...target.entries];target.setItem=()=>{throw Error('quota')};
 assert.throws(()=>B.restore(target,{[B.MAIN]:JSON.stringify(defaults)}));assert.deepEqual([...target.entries],before);
});
test('interrupted restore recovers exact pre-restore data on next startup',()=>{
 const target=fixture(),original=target.getItem(B.MAIN);
 target.setItem(B.JOURNAL,JSON.stringify({[B.MAIN]:original,[B.SESSION]:target.getItem(B.SESSION)}));
 target.setItem(B.MAIN,JSON.stringify(defaults));target.removeItem(B.SESSION);B.recover(target);
 assert.equal(target.getItem(B.MAIN),original);assert.equal(target.getItem(B.SESSION),'DO_NOT_EXPORT_ACCESS_TOKEN');
});
test('complete restore removes absent old local records so they cannot resurrect after restore',()=>{
 const target=fixture(),empty=B.create(storage(),defaults,'fresh');
 B.restore(target,B.parse(JSON.stringify(empty),validate).entries);
 assert.equal(target.getItem('hokuriku2026.day8.bookings'),null);
 assert.equal(target.getItem('hokuriku.execution.items.v1'),null);
});
test('recovery loads before app modules and UI loads after main app',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.ok(html.indexOf('full-backup-core.js')<html.indexOf('dayone.js'));
 assert.ok(html.indexOf('full-backup.js')>html.indexOf('app.js'));
 assert.ok(html.indexOf('full-backup.js')<html.indexOf('sync.js'));
});
test('UI export and restore require verified pre-restore download and reload only after success',async()=>{
 const source=fixture(),downloads=[],messages=[],footer={append(){}};
 const context=vm.createContext({FullBackupCore:B,localStorage:source,state:defaults,validate,
   prompt:()=> 'iPad',confirm:()=>true,notify:t=>messages.push(t),
   downloadBackup:(text,name)=>downloads.push({text,name}),
   location:{reload(){context.didReload=true}},
   document:{querySelector:()=>footer,createElement:()=>({})}
 });context.window=context;
 vm.runInContext(fs.readFileSync(path.join(root,'full-backup.js'),'utf8'),context);
 context.exportFullLocalBackup();
 assert.equal(downloads.length,1);assert.match(downloads[0].name,/iPad/);
 const payload=downloads[0].text;
 const input={files:[{size:payload.length,name:'restore.json',text:async()=>payload}],value:'file'};
 await context.importFullLocalBackup({target:input});
 assert.equal(downloads.length,2);assert.match(downloads[1].name,/還原前完整備份/);
 assert.equal(context.didReload,true);assert.equal(input.value,'');
});
test('UI cancellation after pre-restore download leaves current contents and session untouched',async()=>{
 const source=fixture(),before=[...source.entries],payload=JSON.stringify(B.create(source,defaults,'source'));
 let confirmations=0,downloaded=0;
 const context=vm.createContext({FullBackupCore:B,localStorage:source,state:defaults,validate,
 prompt:()=> 'iPad',confirm:()=>++confirmations===1,notify(){},
 downloadBackup(){downloaded++},location:{reload(){throw Error('must not reload')}},
 document:{querySelector:()=>({append(){}}),createElement:()=>({})}});
 context.window=context;vm.runInContext(fs.readFileSync(path.join(root,'full-backup.js'),'utf8'),context);
 await context.importFullLocalBackup({target:{files:[{size:payload.length,name:'b.json',text:async()=>payload}],value:'x'}});
 assert.equal(downloaded,1);assert.deepEqual([...source.entries],before);
});
