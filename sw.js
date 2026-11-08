const PREFIX='hokuriku-sakura-shell-'+new URL(self.registration.scope).pathname+'-';
const CACHE=PREFIX+'v12';
const SHELL=['./','./index.html','./styles.css','./hero.css','./hero.js','./sync-status.css','./app.js','./cloud-config.js','./sync-core.js','./sync.js','./manifest.webmanifest',"./apple-touch-icon-v10.png","./apple-touch-icon.png","./app-icon-192-v10.png","./app-icon-512-v10.png","./app-icon-maskable-v10.png","./favicon-v10.png",'./icon-check-v10.html','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable.png','./icons/icon-192-v9.png','./icons/icon-512-v9.png','./icons/icon-maskable-v9.png','./icons/apple-touch-icon-v9.png','./icons/favicon-v9.png',"./assets/pikmin-banner.jpg","./assets/pikmin-garden.png","./assets/pokemon.json","./assets/pokemon/658.png","./assets/pokemon/448.png","./assets/pokemon/778.png","./assets/pokemon/006.png","./assets/pokemon/197.png","./assets/pokemon/700.png","./assets/pokemon/445.png","./assets/pokemon/384.png","./assets/pokemon/282.png","./assets/pokemon/094.png","./assets/pokemon/887.png","./assets/pokemon/248.png","./assets/pokemon/001.png","./assets/pokemon/849.png","./assets/pokemon/249.png","./assets/pokemon/722.png","./assets/pokemon/681.png","./assets/pokemon/609.png","./assets/pokemon/025.png","./assets/pokemon/133.png"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
// 等所有舊視窗關閉才啟用，避免開啟中的編輯介面混用新舊版本。
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 const scope=new URL(self.registration.scope);if(!url.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate'&&(url.pathname===scope.pathname||url.pathname===new URL('./index.html',scope).pathname)){event.respondWith(caches.match(new URL('./index.html',scope)).then(cached=>cached||fetch(event.request)));return;}
 if(!SHELL.some(path=>new URL(path,scope).pathname===url.pathname))return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
