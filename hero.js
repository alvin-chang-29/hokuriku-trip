/* Local animation preference only: no trip/auth/cloud data is changed. */
(function(){
 'use strict';const scene=document.getElementById('hero-scene'),button=document.getElementById('hero-run-toggle');if(!scene||!button)return;
 const key='hokuriku_hero_running_v1',reduced=matchMedia('(prefers-reduced-motion: reduce)');let wantsRun=true,visible=true;
 try{wantsRun=localStorage.getItem(key)!=='false'}catch{/* Preference remains in memory. */}
 function update(){const allowed=wantsRun&&!reduced.matches;scene.dataset.running=String(allowed);scene.dataset.visible=String(visible&&!document.hidden);button.setAttribute('aria-pressed',String(allowed));button.setAttribute('aria-label',reduced.matches?'兩位 Mii 動畫已依減少動態效果設定暫停':allowed?'暫停兩位 Mii 的慢跑動畫':'開始兩位 Mii 的慢跑動畫')}
 button.addEventListener('click',()=>{if(reduced.matches){update();return}wantsRun=!wantsRun;try{localStorage.setItem(key,String(wantsRun))}catch{/* Animation still works when storage is unavailable. */}update()});
 document.addEventListener('visibilitychange',update);
 if(reduced.addEventListener)reduced.addEventListener('change',update);else reduced.addListener(update);
 if(typeof IntersectionObserver!=='undefined'){const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;update()},{threshold:0});observer.observe(scene)}
 update();
})();
