(()=>{'use strict';
const $=id=>document.getElementById(id),stage=$('stage'),intro=$('intro'),viewer=$('viewer');
const labels=['Wrapper','Mosque gates','Bismillah','Quran Verse','Invitation','Our Journey','Wedding Details','Serena Hotel','Dress Code','Programme Part 1','Programme Part 2','Programme Part 3','Gallery I','Gallery II','Gallery III','RSVP','Security Pass','Thank You & Dua'];
let current=0,timers=[],startY=null,lastStep=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
for(let i=0;i<3;i++){const bird=document.createElement('div');bird.className='bird';bird.innerHTML='<svg viewBox="0 0 100 70"><path class="wing back" fill="#e7e9e3" d="M49 42 Q33 9 9 5 Q14 27 43 48Z"/><path class="wing" fill="#fffef5" d="M46 44 Q57 5 83 2 Q85 18 68 37 L58 47Z"/><path fill="#fffff9" d="M27 46 L8 40 L23 55 Q45 61 68 43 Q83 48 87 40 Q89 33 83 31 Q76 29 71 36 L48 45Z"/><path fill="#d4b37a" d="M86 35 L97 39 L86 40Z"/><circle cx="83" cy="35" r="1.2" fill="#263831"/></svg>';$('birds').append(bird);}
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function later(fn,ms){timers.push(setTimeout(fn,ms));}
function finish(){clearTimers();stage.className='stage done';$('open').hidden=true;$('intro-status').textContent='Bismillah';$('replay').disabled=false;}
async function play(){clearTimers();$('open').hidden=true;$('replay').disabled=true;$('intro-status').textContent='Preparing the opening';try{await Promise.all([...stage.querySelectorAll('img')].map(im=>im.decode()));}catch{ $('intro-status').textContent='An opening image could not load. Extract the complete ZIP and retry.';$('replay').disabled=false;return;}clearTimers();stage.className='stage';$('open').hidden=true;$('replay').disabled=true;if(reduce.matches){finish();return;}void stage.offsetWidth;stage.classList.add('running');$('intro-status').textContent='The wrapper opens';later(()=>$('intro-status').textContent='The mosque gates open',3400);later(()=>$('intro-status').textContent='Through the entrance into the illuminated interior',6600);later(finish,12000);}
function showPanel(n){current=Math.max(0,Math.min(17,n));const frozen={0:'assets/reconstructed/wrapper.png',1:'assets/reconstructed/gates.png',2:'assets/reconstructed/bismillah.png',7:'assets/reconstructed/venue-final.png',15:'assets/slides/slide-14.png',16:'assets/slides/slide-15.png'};const custom=window.AQDI_PHASE2.render(current+1);$('panel').hidden=custom;if(!custom){$('panel').src=frozen[current];$('panel').alt=labels[current];}$('maps-link').hidden=current!==7;$('maps-link').href=window.AQDI_VENUE_URL||'#';$('counter').textContent=`${String(current+1).padStart(2,'0')} / 18 · ${labels[current]}`;$('previous').disabled=current===0;$('next').disabled=current===17;try{sessionStorage.setItem('aqdi-production-panel',String(current));}catch{}}

function browse(){clearTimers();if(stage.classList.contains('running'))finish();intro.hidden=true;viewer.hidden=false;showPanel(current);}
function step(delta){if(viewer.hidden)return;const now=performance.now();if(now-lastStep<400)return;lastStep=now;showPanel(current+delta);}
$('venue').onclick=()=>{browse();showPanel(7);};$('open').onclick=play;$('replay').onclick=play;$('skip').onclick=finish;$('browse').onclick=browse;
$('previous').onclick=()=>showPanel(current-1);$('next').onclick=()=>showPanel(current+1);
$('intro-back').onclick=()=>{viewer.hidden=true;intro.hidden=false;};$('info').onclick=()=>$('notes').showModal();
window.addEventListener('keydown',e=>{if($('notes').open||document.querySelector('#p2-reader[open],#p2-photo-view[open]')||viewer.hidden)return;if(['ArrowDown','PageDown','ArrowRight'].includes(e.key)){e.preventDefault();step(1);}if(['ArrowUp','PageUp','ArrowLeft'].includes(e.key)){e.preventDefault();step(-1);}if(e.key==='Home')showPanel(0);if(e.key==='End')showPanel(17);});
viewer.addEventListener('wheel',e=>{if($('notes').open||document.querySelector('#p2-reader[open],#p2-photo-view[open]'))return;e.preventDefault();if(Math.abs(e.deltaY)>15)step(e.deltaY>0?1:-1);},{passive:false});
viewer.addEventListener('touchstart',e=>{startY=e.touches[0].clientY;},{passive:true});
viewer.addEventListener('touchend',e=>{if(startY===null)return;const diff=startY-e.changedTouches[0].clientY;startY=null;if(Math.abs(diff)>45)step(diff>0?1:-1);},{passive:true});
reduce.addEventListener('change',()=>{if(reduce.matches&&stage.classList.contains('running'))finish();});
try{const saved=Number(sessionStorage.getItem('aqdi-production-panel'));if(Number.isInteger(saved)&&saved>=0&&saved<18)current=saved;}catch{}
function fitStage(){if(intro.hidden)return;const controls=intro.querySelector('.intro-controls');const available=Math.max(120,intro.clientHeight-controls.offsetHeight-34);const width=Math.min(intro.clientWidth-24,available*2/3);stage.style.width=width+'px';stage.style.height=(width*1.5)+'px';}new ResizeObserver(fitStage).observe(intro);window.addEventListener('resize',fitStage);fitStage();
})();

/* Phase 2: artwork integration and dynamic content. No opening logic below. */
(()=>{'use strict';
const $=id=>document.getElementById(id),canvas=$('p2-canvas'),holder=document.querySelector('#viewer .panel-holder'),tools=$('p2-tools');
const art={4:'slide04_quran_verse',5:'slide05_invitation',6:'slide06_our_journey',7:'slide07_wedding_details',9:'slide09_dress_code',10:'slide10_programme_1',11:'slide11_programme_2',12:'slide12_programme_3',13:'slide13_gallery_1',14:'slide14_gallery_2',15:'slide15_gallery_3',18:'slide18_thank_you'};
const cfg=window.AQDI_PHASE2_CONFIG;
const programme={10:[
 ['4:30 PM – 5:30 PM','GUEST ARRIVAL & WELCOME RECEPTION',['Music • Refreshments • Mingling']],
 ['5:30 PM – 6:00 PM','AQDI OPENING & DUA',[]],
 ['6:00 PM – 6:30 PM','MAGHRIB PRAYER BREAK',[]]
],11:[
 ['6:30 PM – 7:00 PM','AQDI CEREMONY',['AQDI Ceremony','Kusainiwa kwa nyaraka','Dua ya ndoa','Congratulations']],
 ['7:00 PM – 7:15 PM','FIRST GRAND EXIT',['Rahma & Sevvri make their first grand exit as husband and wife.']],
 ['7:15 PM – 8:45 PM','HURAIRAH CLASSICS – BAITUL HALAL',['1 HOUR 30 MINUTES']]
],12:[
 ['8:45 PM – 9:15 PM','DINNER & WEDDING TOASTS',[]],
 ['9:15 PM – 9:30 PM','SECOND GRAND ENTRANCE',[]],
 ['9:30 PM – 10:00 PM','JAHAZI MODERN TAARAB',[]],
 ['10:00 PM – 10:30 PM','CAKE CUTTING & COUPLE’S MOMENT',['Cake Cutting','Couple’s Dance','Special Couple Moment','Photos']],
 ['10:30 PM – 12:00 AM','GRAND FINALE – FINAL ENTRANCE',['Final Outfit','Grand Reveal','Final Entrance','Celebration','Entertainment']],
 ['12:00 AM','FAREWELL',[]]
]};
let slide=0,ticker=null,width=941;
function fit(){if(canvas.hidden)return;const w=Math.min(holder.clientWidth,holder.clientHeight*width/1672);canvas.style.width=w+'px';canvas.style.height=(w*1672/width)+'px';canvas.style.setProperty('--p2-scale',w/width);}
new ResizeObserver(fit).observe(holder);
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function place(el,rect){const [x,y,w,h]=rect;Object.assign(el.style,{left:(x/width*100)+'%',top:(y/1672*100)+'%',width:(w/width*100)+'%',height:(h/1672*100)+'%'});canvas.append(el);}
function photo(src,rect,position,clip){const slot=node('button','p2-slot');slot.type='button';slot.setAttribute('aria-label','View full photograph');const im=node('img','p2-photo');im.alt='Original wedding photograph';im.src=src;im.decoding='async';im.style.objectPosition=position;slot.append(im);if(clip)slot.style.clipPath=clip;place(slot,rect);slot.onclick=()=>{$('p2-full-photo').src=src;$('p2-photo-view').showModal();};}
const frameClip='polygon(10% 0,43% 0,50% 5%,57% 0,90% 0,90% 6%,100% 12%,100% 88%,93% 91%,89% 100%,58% 100%,50% 94%,42% 100%,10% 100%,10% 93%,0 88%,0 12%,8% 8%)';
function countdownValues(now=Date.now()){const seconds=Math.max(0,Math.floor((new Date(cfg.countdownTarget).getTime()-now)/1000));return [Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];}
function updateCountdown(){const v=countdownValues();document.querySelectorAll('[data-p2-unit]').forEach(e=>e.textContent=String(v[Number(e.dataset.p2Unit)]).padStart(2,'0'));const c=$('p2-countdown');if(c)c.setAttribute('aria-label',`${v[0]} days, ${v[1]} hours, ${v[2]} minutes, ${v[3]} seconds until 23 October 2026 at 4:30 PM`);}
function countdownGrid(cls){const grid=node('div',cls);['Days','Hours','Minutes','Seconds'].forEach((label,i)=>{const cell=node('div','p2-count-cell'),num=node('strong');num.dataset.p2Unit=i;cell.append(num,node('span',null,label));grid.append(cell);});return grid;}
function addTool(label,fn){tools.hidden=false;const b=node('button',null,label);b.type='button';b.onclick=fn;tools.append(b);}
function readProgramme(){const body=$('p2-reader-body');body.replaceChildren();$('p2-reader-title').textContent='Programme · Part '+(slide-9);const ar=node('p','p2-arabic','برنامج الحفل');ar.lang='ar';ar.dir='rtl';body.append(ar);for(const [time,title,details] of programme[slide]){const sec=node('section','p2-programme-item');sec.append(node('p','p2-time',time),node('h2',null,title));if(details.length>1){const ul=node('ul');details.forEach(s=>ul.append(node('li',null,s)));sec.append(ul);}else if(details.length)sec.append(node('p',null,details[0]));body.append(sec);}$('p2-reader').showModal();$('p2-reader-title').tabIndex=-1;$('p2-reader-title').focus({preventScroll:true});$('p2-reader').scrollTop=0;}
function render(n){slide=n;clearInterval(ticker);ticker=null;canvas.replaceChildren();tools.replaceChildren();tools.hidden=true;canvas.hidden=!(n in art);if(canvas.hidden)return false;width=n===5?940:941;canvas.dataset.slide=n;const img=node('img','p2-art');img.alt=`Slide ${String(n).padStart(2,'0')}`;img.src=`assets/reconstructed/${art[n]}.png`;img.decoding='async';canvas.append(img);
 if(n===6)photo('assets/couple/our_journey.jpg',[279,535,376,448],'50% 10%');
 if(n===7){const button=node('button','p2-countdown');button.id='p2-countdown';button.type='button';button.append(countdownGrid('p2-count-grid'));place(button,[393,912,155,125]);button.onclick=()=>{$('p2-reader-title').textContent='Until 23 October 2026 · 4:30 PM';$('p2-reader-body').replaceChildren(countdownGrid('p2-count-large'));updateCountdown();$('p2-reader').showModal();$('p2-reader-title').tabIndex=-1;$('p2-reader-title').focus({preventScroll:true});$('p2-reader').scrollTop=0;};updateCountdown();ticker=setInterval(updateCountdown,1000);}
 if(n===9){const palette=node('div','p2-palette');const im=node('img');im.alt='Approved dress-code colour palette';im.src='assets/dresscode/approved_palette.jpg';im.decoding='async';palette.append(im);palette.style.clipPath='polygon(4% 0,96% 0,100% 4%,100% 96%,96% 100%,4% 100%,0 96%,0 4%)';place(palette,[226,510,488,568]);}
 if(n===13){photo('assets/gallery/photo01.jpg',[159,342,363,481],'48% 30%',frameClip);photo('assets/gallery/photo02.jpg',[438,879,394,458],'50% 28%',frameClip);}
 if(n===14){photo('assets/gallery/photo03.jpg',[137,350,369,492],'50% 30%',frameClip);photo('assets/gallery/photo04.jpg',[410,896,394,455],'50% 25%',frameClip);}
 if(n===15){if(cfg.galleryPhoto05Available)photo('assets/gallery/photo05.jpg',[131,354,369,495],'50% 30%',frameClip);if(cfg.galleryPhoto06Available)photo('assets/gallery/photo06.jpg',[439,898,372,473],'50% 30%',frameClip);}
 if(n in programme)addTool('Read programme',readProgramme);
 requestAnimationFrame(fit);return true;
}
window.AQDI_PHASE2=Object.freeze({render,countdownValues});
})();
