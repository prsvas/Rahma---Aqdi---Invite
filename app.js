(()=>{'use strict';
const $=id=>document.getElementById(id),stage=$('stage'),intro=$('intro'),viewer=$('viewer');
const labels=['Wrapper','Mosque gates','Bismillah','Qur’an 30:21','AQDI invitation','Our Journey','Date / time / venue','Serena Hotel','Dress code','Programme 1','Programme 2','Programme 3','Gallery','RSVP','Security Pass','Closing'];
let current=0,timers=[],startY=null,lastStep=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
for(let i=0;i<3;i++){const bird=document.createElement('div');bird.className='bird';bird.innerHTML='<svg viewBox="0 0 100 70"><path class="wing back" fill="#e7e9e3" d="M49 42 Q33 9 9 5 Q14 27 43 48Z"/><path class="wing" fill="#fffef5" d="M46 44 Q57 5 83 2 Q85 18 68 37 L58 47Z"/><path fill="#fffff9" d="M27 46 L8 40 L23 55 Q45 61 68 43 Q83 48 87 40 Q89 33 83 31 Q76 29 71 36 L48 45Z"/><path fill="#d4b37a" d="M86 35 L97 39 L86 40Z"/><circle cx="83" cy="35" r="1.2" fill="#263831"/></svg>';$('birds').append(bird);}
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function later(fn,ms){timers.push(setTimeout(fn,ms));}
function finish(){clearTimers();stage.className='stage done';$('open').hidden=true;$('intro-status').textContent='Bismillah · opening checkpoint';$('replay').disabled=false;}
async function play(){clearTimers();$('open').hidden=true;$('replay').disabled=true;$('intro-status').textContent='Preparing the opening';try{await Promise.all([...stage.querySelectorAll('img')].map(im=>im.decode()));}catch{ $('intro-status').textContent='An opening image could not load. Extract the complete ZIP and retry.';$('replay').disabled=false;return;}clearTimers();stage.className='stage';$('open').hidden=true;$('replay').disabled=true;if(reduce.matches){finish();return;}void stage.offsetWidth;stage.classList.add('running');$('intro-status').textContent='The wrapper opens';later(()=>$('intro-status').textContent='The mosque gates open',3400);later(()=>$('intro-status').textContent='Through the entrance into the illuminated interior',6600);later(finish,12000);}
function showPanel(n){current=Math.max(0,Math.min(15,n));const replacements={0:'wrapper',1:'gates',2:'bismillah',7:'venue-final'};$('panel').src=current in replacements ? `assets/reconstructed/${replacements[current]}.png` : `assets/slides/slide-${String(current+1).padStart(2,'0')}.png`;$('maps-link').hidden=current!==7;$('maps-link').href=window.AQDI_VENUE_URL||'#';$('panel').alt=`Storyboard reference ${current+1}: ${labels[current]}`;$('counter').textContent=`${String(current+1).padStart(2,'0')} / 16 · ${labels[current]}`;$('previous').disabled=current===0;$('next').disabled=current===15;try{sessionStorage.setItem('aqdi-reference-panel',String(current));}catch{}}
function browse(){clearTimers();if(stage.classList.contains('running'))finish();intro.hidden=true;viewer.hidden=false;showPanel(current);}
function step(delta){if(viewer.hidden)return;const now=performance.now();if(now-lastStep<400)return;lastStep=now;showPanel(current+delta);}
$('venue').onclick=()=>{browse();showPanel(7);};$('open').onclick=play;$('replay').onclick=play;$('skip').onclick=finish;$('browse').onclick=browse;
$('previous').onclick=()=>showPanel(current-1);$('next').onclick=()=>showPanel(current+1);
$('intro-back').onclick=()=>{viewer.hidden=true;intro.hidden=false;};$('info').onclick=()=>$('notes').showModal();
window.addEventListener('keydown',e=>{if($('notes').open||viewer.hidden)return;if(['ArrowDown','PageDown','ArrowRight'].includes(e.key)){e.preventDefault();step(1);}if(['ArrowUp','PageUp','ArrowLeft'].includes(e.key)){e.preventDefault();step(-1);}if(e.key==='Home')showPanel(0);if(e.key==='End')showPanel(15);});
viewer.addEventListener('wheel',e=>{if($('notes').open)return;e.preventDefault();if(Math.abs(e.deltaY)>15)step(e.deltaY>0?1:-1);},{passive:false});
viewer.addEventListener('touchstart',e=>{startY=e.touches[0].clientY;},{passive:true});
viewer.addEventListener('touchend',e=>{if(startY===null)return;const diff=startY-e.changedTouches[0].clientY;startY=null;if(Math.abs(diff)>45)step(diff>0?1:-1);},{passive:true});
reduce.addEventListener('change',()=>{if(reduce.matches&&stage.classList.contains('running'))finish();});
try{const saved=Number(sessionStorage.getItem('aqdi-reference-panel'));if(Number.isInteger(saved)&&saved>=0&&saved<16)current=saved;}catch{}
function fitStage(){if(intro.hidden)return;const controls=intro.querySelector('.intro-controls');const available=Math.max(120,intro.clientHeight-controls.offsetHeight-34);const width=Math.min(intro.clientWidth-24,available*2/3);stage.style.width=width+'px';stage.style.height=(width*1.5)+'px';}new ResizeObserver(fitStage).observe(intro);window.addEventListener('resize',fitStage);fitStage();
})();
