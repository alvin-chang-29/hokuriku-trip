(function(root) {
  'use strict';
  const MAIN = 'hokuriku2026_v1';
  const JOURNAL = 'hokuriku_full_restore_journal_v1';
  const SESSION = 'hokuriku_cloud_session_v1';
  const keys = [
    MAIN, 'hokuriku_dayone_20261203_v1', 'hokuriku2026.day8.state.v1_3',
    'hokuriku.execution.items.v1', 'hokuriku_hero_running_v1'
  ];
  const legacy = ['selectedPlan','completedSteps','checklist','bookings','fareQuotes','state','data','schemaVersion']
    .map(name => 'hokuriku2026.day8.' + name);
  const allowed = [...keys, ...legacy];
  const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  function cleanMain(raw) {
    const value = JSON.parse(raw);
    delete value._cloudSync;
    return JSON.stringify(value);
  }
  function collect(storage, fallback) {
    const entries = {};
    for (const key of allowed) {
      let value = storage.getItem(key);
      if (key === MAIN && value === null) value = JSON.stringify(fallback);
      entries[key] = key === MAIN && value !== null ? cleanMain(value) : value;
    }
    return entries;
  }
  function create(storage, fallback, device) {
    return {format:'hokuriku-full-local-backup',version:1,appVersion:'V24-backup',
      exportedAt:new Date().toISOString(),device,entries:collect(storage,fallback)};
  }
  function validateEntries(entries, validateMain) {
    if (!plain(entries)) throw Error('備份資料區塊缺失');
    for (const key of Object.keys(entries)) {
      if (!allowed.includes(key)) throw Error('備份含不支援的資料欄位');
      const raw = entries[key];
      if (raw === null) continue;
      if (typeof raw !== 'string') throw Error('本機資料必須為文字');
      if (legacy.includes(key)) continue; // Preserve the exact archived V1.2 representation.
      const value = JSON.parse(raw);
      if (key === MAIN) validateMain(value);
      if (key === keys[1]) {
        if (!plain(value) || value.version !== 1 || !plain(value.checks) ||
            !['bus','taxi'].includes(value.route) ||
            !['2026-12-03','2026-12-04'].includes(value.arrivalDate) ||
            ![20,30,40].includes(value.bufferMin) ||
            (value.stationArrival && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value.stationArrival)) ||
            Object.values(value.checks).some(v=>typeof v !== 'boolean')) throw Error('12/3紀錄格式不符');
      }
      if (key === keys[2]) {
        if (!plain(value) || value.schemaVersion !== '1.3') throw Error('12/10紀錄版本不符');
        for (const field of ['inputs','completedSteps','checklist','bookings','fareQuotes','legacy'])
          if (!plain(value[field])) throw Error('12/10紀錄缺少 '+field);
        for (const plan of ['rental_car','local_train_two_taxis','local_train_airport_bus'])
          for (const field of ['completedSteps','checklist','bookings','fareQuotes'])
            if (!plain(value[field][plan])) throw Error('12/10方案資料不完整');
      }
      if (key === keys[3]) {
        if (!plain(value)) throw Error('自訂項目格式不符');
        for (const item of Object.values(value)) {
          if (!plain(item) || !plain(item.names) || !Array.isArray(item.children) ||
              Object.values(item.names).some(name=>typeof name !== 'string') ||
              item.children.some(c=>!plain(c)||typeof c.id!=='string'||typeof c.text!=='string'||typeof c.done!=='boolean') ||
              new Set(item.children.map(c=>c.id)).size !== item.children.length) throw Error('自訂子項目格式不符');
        }
      }
      if (key === keys[4] && typeof value !== 'boolean') throw Error('動畫偏好格式不符');
    }
  }
  function parse(text, validateMain) {
    if (text.length > 20*1024*1024) throw Error('檔案超過20 MB');
    const file = JSON.parse(text);
    if (file.format === 'hokuriku-full-local-backup') {
      if (file.version !== 1) throw Error('不支援的完整備份版本');
      if (!plain(file.entries) || allowed.some(k=>!Object.hasOwn(file.entries,k)))
        throw Error('完整備份缺少資料區塊，請勿手動刪改');
      validateEntries(file.entries, validateMain);
      if (!file.entries[MAIN]) throw Error('完整備份缺少主行程');
      const entries = {...file.entries, [MAIN]:cleanMain(file.entries[MAIN])};
      return {entries,device:String(file.device||''),full:true};
    }
    if (file.version !== undefined && file.version !== 1) throw Error('不支援的舊備份版本');
    const data = validateMain(file.data || file);
    return {entries:{[MAIN]:cleanMain(JSON.stringify(data))},device:'舊版主行程備份',full:false};
  }
  function write(storage, key, value) {
    if (value === null) storage.removeItem(key);
    else storage.setItem(key,value);
  }
  function recover(storage) {
    const raw = storage.getItem(JOURNAL);
    if (!raw) return;
    const before = JSON.parse(raw);
    if (!plain(before) || Object.keys(before).some(k=>!allowed.includes(k)&&k!==SESSION))
      throw Error('還原復原紀錄格式異常');
    for (const [key,value] of Object.entries(before)) write(storage,key,value);
    storage.removeItem(JOURNAL);
  }
  function restore(storage, entries) {
    const before = {};
    for (const key of [...Object.keys(entries), SESSION]) before[key]=storage.getItem(key);
    storage.setItem(JOURNAL,JSON.stringify(before)); // Durable rollback is written before any replacement.
    try {
      for (const [key,value] of Object.entries(entries)) write(storage,key,value);
      storage.removeItem(SESSION); // New local data requires an explicit cloud sign-in/merge decision.
      storage.removeItem(JOURNAL);
    } catch (error) {
      try { recover(storage); }
      catch { throw Error('還原中斷，復原紀錄已保留。請關閉並重開App以復原，並保留還原前備份。'); }
      throw Error('還原未完成，已回復原本資料：'+error.message);
    }
  }
  const api={MAIN,JOURNAL,SESSION,keys:allowed,create,parse,restore,recover,validateEntries};
  root.FullBackupCore=api;
  if(typeof module!=='undefined') module.exports=api;
  else {
    try {recover(localStorage);}
    catch(error) {
      // Stop startup before modules can load or overwrite a partial restore.
      document.body.innerHTML='';
      const p=document.createElement('p');p.textContent=error.message+'。請保留網站資料並重新開啟。';document.body.append(p);
      window.stop();
      throw error;
    }
  }
})(globalThis);
