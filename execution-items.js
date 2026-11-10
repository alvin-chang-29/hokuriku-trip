(() => {
  'use strict';
  const storageKey = 'hokuriku.execution.items.v1';
  const read = () => JSON.parse(localStorage.getItem(storageKey) || '{}');
  const el = (tag, text) => Object.assign(document.createElement(tag), {textContent:text || ''});
  function button(text, action) {
    const b = el('button', text);
    b.type = 'button'; b.className = 'btn alt mini'; b.onclick = action;
    return b;
  }
  function save(id, change) {
    try {
      const all = read();
      all[id] = change(all[id] || {names:{},children:[]});
      localStorage.setItem(storageKey, JSON.stringify(all));
      return true;
    } catch { alert('本機紀錄無法儲存，請保留畫面並檢查儲存空間。'); return false; }
  }
  function describe(node) {
    const day = node.closest('#dayone-root');
    const checks = [...node.querySelectorAll(day?'input[data-dayone-check]':'input[data-return-check]')];
    if (!checks.length) return;
    const key = day ? checks[0].dataset.dayoneCheck : checks[0].dataset.returnCheck;
    if (day && node.tagName==='LI') {
      return {id:'day1.'+key.split(':').slice(0,2).join(':'),title:node.querySelector('h3'),
        subtitles:checks.map(c=>c.parentElement.querySelector('span'))};
    }
    const strong = node.matches('[data-step-row]') && node.querySelector('strong');
    return {id:(day?'day1.':'day8.')+key,title:strong || checks[0].parentElement.querySelector('span'),subtitles:[]};
  }
  function decorate(node, definition) {
    const {id,title,subtitles}=definition;
    if (!title) return;
    const hasTime=node.matches('[data-step-row],.return-boarding') || (!node.hasAttribute('data-step-row') && node.matches('.return-step') && /　\d\d:\d\d$/.test(title.textContent));
    function parts(){const text=title.textContent, i=hasTime?text.lastIndexOf('　'):-1;return i<0?[text,'']:[text.slice(0,i),text.slice(i)];}
    const original=parts()[0], defaults=subtitles.map(n=>n.textContent);
    let state;
    try {state=read()[id] || {names:{},children:[]};}catch{return;}
    const host=el('div');host.className='execution-item-controls';
    if(node.tagName==='LABEL')node.after(host);else node.append(host);
    const paintTitle=()=>{const value=(state.names.title||original)+parts()[1];if(title.textContent!==value)title.textContent=value;};
    paintTitle();
    if(hasTime && state.names.title)new MutationObserver(paintTitle).observe(title,{childList:true});
    subtitles.forEach((n,i)=>n.textContent=state.names['sub'+i]||defaults[i]);
    function paint(){
      host.replaceChildren();
      for(const child of state.children){
        const label=el('label');label.className='return-check';
        const box=el('input');box.type='checkbox';box.checked=child.done;
        box.onchange=()=>{if(save(id,current=>{const item=current.children.find(x=>x.id===child.id);if(item)item.done=box.checked;return current;}))child.done=box.checked;else box.checked=child.done;};
        label.append(box,document.createTextNode(child.text));host.append(label);
      }
      host.append(button('編輯項目',edit));
    }
    function edit(){
      const dialog=el('dialog');dialog.className='execution-editor';
      const form=el('form');form.append(el('h3','編輯項目'));
      function field(label,value){const wrap=el('label',label),input=el('input');input.required=true;input.value=value;wrap.append(input);form.append(wrap);return input;}
      const name=field('項目名稱',state.names.title||original);
      const builtins=defaults.map((v,i)=>field('子項目 '+(i+1),state.names['sub'+i]||v));
      const children=[];
      const actions=el('div');actions.className='toolbar';
      function add(child){const input=field('子項目 '+(builtins.length+children.length+1),child.text);children.push({child,input});form.append(actions);return input;}
      state.children.forEach(add);
      actions.append(button('＋ 新增子項目',()=>add({id:crypto.randomUUID(),text:'',done:false}).focus()),button('取消',()=>dialog.close()));
      const submit=el('button','儲存');submit.type='submit';submit.className='btn';actions.append(submit);form.append(actions);
      form.onsubmit=event=>{
        event.preventDefault();
        for(const input of form.querySelectorAll('input'))if(!input.value.trim()){input.focus();return;}
        const names={title:name.value.trim()};builtins.forEach((v,i)=>names['sub'+i]=v.value.trim());
        const next={names,children:children.map(({child,input})=>({...child,text:input.value.trim()}))};
        if(!save(id,()=>next))return;
        state=next;paintTitle();subtitles.forEach((n,i)=>n.textContent=names['sub'+i]);
        if(hasTime)new MutationObserver(paintTitle).observe(title,{childList:true});
        paint();dialog.close();
      };
      dialog.append(form);document.body.append(dialog);dialog.onclose=()=>dialog.remove();dialog.showModal();name.focus();
    }
    paint();
  }
  const seen=new WeakSet();
  function scan(){
    const items=document.querySelectorAll('#dayone-root .dayone-timeline li,#dayone-root .dayone-check:has([data-dayone-check^="prep:"]),.return-page .return-step,.return-page .return-check:has([data-return-check^="checklist."])');
    for(const node of items){if(seen.has(node))continue;seen.add(node);const definition=describe(node);if(definition)decorate(node,definition);}
  }
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
