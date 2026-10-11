(()=>{'use strict';
const $=id=>document.getElementById(id),stage=$('stage'),intro=$('intro'),invitation=$('invitation');
let timers=[];
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
for(let i=0;i<3;i++){const bird=document.createElement('div');bird.className='bird';bird.innerHTML='<svg viewBox="0 0 100 70"><path class="wing back" fill="#e7e9e3" d="M49 42 Q33 9 9 5 Q14 27 43 48Z"/><path class="wing" fill="#fffef5" d="M46 44 Q57 5 83 2 Q85 18 68 37 L58 47Z"/><path fill="#fffff9" d="M27 46 L8 40 L23 55 Q45 61 68 43 Q83 48 87 40 Q89 33 83 31 Q76 29 71 36 L48 45Z"/><path fill="#d4b37a" d="M86 35 L97 39 L86 40Z"/><circle cx="83" cy="35" r="1.2" fill="#263831"/></svg>';$('birds').append(bird);}
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function later(fn,ms){timers.push(setTimeout(fn,ms));}
function finish(){clearTimers();stage.className='stage done';$('open').hidden=true;$('intro-status').textContent='Bismillah';later(begin,1500);}
async function play(){clearTimers();$('open').hidden=true;$('intro-status').textContent='Preparing the opening';try{await Promise.all([...stage.querySelectorAll('img')].map(im=>im.decode()));}catch{ $('intro-status').textContent='An opening image could not load. Please tap to retry.';$('open').hidden=false;return;}clearTimers();stage.className='stage';$('open').hidden=true;if(reduce.matches){finish();return;}void stage.offsetWidth;stage.classList.add('running');$('intro-status').textContent='The wrapper opens';later(()=>$('intro-status').textContent='The mosque gates open',3400);later(()=>$('intro-status').textContent='Through the entrance into the illuminated interior',6600);later(finish,12000);}

function begin(){buildInvitation();intro.hidden=true;invitation.hidden=false;document.body.classList.add('invitation-open');invitation.scrollTop=0;}
function buildInvitation(){if(invitation.dataset.ready)return;invitation.dataset.ready='true';
const fx=document.createElement('div');fx.className='gold-effects';fx.setAttribute('aria-hidden','true');
for(let i=0;i<20;i++){const star=document.createElement('i');star.className='gold-star';star.style.cssText=`left:${(i*37+7)%100}%;top:${(i*23+11)%100}%;animation-delay:${-i*.73}s;animation-duration:${4+i%4}s`;fx.append(star);}
for(let i=0;i<5;i++){const butterfly=document.createElement('div');butterfly.className='gold-butterfly';butterfly.style.cssText=`top:${12+i*17}%;animation-delay:${-i*4.3}s;animation-duration:${20+i*3}s`;butterfly.innerHTML='<svg viewBox="0 0 80 60"><g class="butterfly-wings"><path d="M39 30C17-9 0 0 7 22C-1 34 10 51 36 34C17 45 27 66 40 39C53 66 63 45 44 34C70 51 81 34 73 22C80 0 63-9 41 30" fill="#e7c56b" stroke="#fff0b0" stroke-width="1"/></g><path d="M40 22V43M40 25L34 17M40 25L46 17" stroke="#b68b35" fill="none" stroke-width="2"/></svg>';fx.append(butterfly);}invitation.append(fx);
for(let n=4;n<=18;n++){const section=document.createElement('section');section.className='invitation-slide';section.dataset.slide=n;section.setAttribute('aria-label','Invitation slide '+n);const frame=document.createElement('div');frame.className='slide-frame';const canvas=document.createElement('div');canvas.className='slide-canvas';frame.append(canvas);section.append(frame);invitation.append(section);
const custom=window.AQDI_CONTENT.render(n,canvas);
if(n===8){canvas.hidden=true;const image=document.createElement('img');image.className='venue-art';image.src='assets/reconstructed/venue-final.png';image.alt='Serena Hotel';image.loading='lazy';frame.append(image);const link=document.createElement('a');link.className='venue-action';link.href=window.AQDI_VENUE_URL;link.target='_blank';link.rel='noopener';link.setAttribute('aria-label','Open Serena Hotel in Google Maps');frame.append(link);}
if(n===16||n===17){canvas.hidden=true;const guest=document.createElement('section');guest.className='guest-content';guest.id='guest-content';frame.append(guest);renderGuest(n);guest.removeAttribute('id');}
if(n>=10&&n<=12){const button=document.createElement('button');button.className='programme-read';button.type='button';button.textContent='Read programme';button.onclick=()=>window.AQDI_CONTENT.readProgramme(n);frame.append(button);}
const scale=()=>canvas.style.setProperty('--p2-scale',frame.clientWidth/941);new ResizeObserver(scale).observe(frame);scale();}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.12});invitation.querySelectorAll('.invitation-slide').forEach(el=>observer.observe(el));
}
function renderGuest(n){const guest=$('guest-content');guest.hidden=false;
if(n===16){guest.innerHTML='<h1>RSVP</h1><p lang="ar" dir="rtl">تأكيد الحضور</p><p>Please enter your details to confirm your attendance.</p><form id="rsvp-form"><label>Full name<input name="name" autocomplete="name" maxlength="100" required></label><label>Mobile number<input name="mobile" type="tel" autocomplete="tel" maxlength="25" pattern="[+0-9 ()-]{7,25}" required></label><button type="submit">Submit RSVP & Open WhatsApp</button></form><p id="rsvp-status" role="status"></p><p>One invitation admits one guest. Entry pass is issued after coordinator approval.</p>';
$('rsvp-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),name=String(f.get('name')).trim(),mobile=String(f.get('mobile')).trim();if(!name)return;try{localStorage.setItem('aqdi-rsvp',JSON.stringify({name,mobile}));}catch{}const msg='AQDI RSVP – Sevvri & Rahma\nName: '+name+'\nMobile: '+mobile+'\nI confirm my attendance on 23 October 2026. Please verify and approve my entry pass.';window.open('https://wa.me/'+window.AQDI_CONFIG.productionCoordinator+'?text='+encodeURIComponent(msg),'_blank','noopener');$('rsvp-status').textContent='Please send the message in WhatsApp to complete your RSVP.';};
}else{guest.innerHTML='<h1>Security Pass</h1><p lang="ar" dir="rtl">بطاقة الدخول</p><div class="pass-status"><p>Pending coordinator approval</p><p>Your QR code and passcode will be issued by Kareem after verification.</p></div><p>One approved pass admits one guest.</p><a href="https://wa.me/'+window.AQDI_CONFIG.productionCoordinator+'" target="_blank" rel="noopener">Contact Kareem<br>+255 692 450 555</a>';}}
$('open').onclick=play;
reduce.addEventListener('change',()=>{if(reduce.matches&&stage.classList.contains('running'))finish();});
function fitStage(){if(intro.hidden)return;const controls=intro.querySelector('.intro-controls');const available=Math.max(120,intro.clientHeight-controls.offsetHeight-34);const width=Math.min(intro.clientWidth-24,available*2/3);stage.style.width=width+'px';stage.style.height=(width*1.5)+'px';}new ResizeObserver(fitStage).observe(intro);window.addEventListener('resize',fitStage);fitStage();
})();

(()=>{'use strict';
const $=id=>document.getElementById(id);let canvas;
const art={4:'slide04_quran_verse',5:'slide05_invitation',6:'slide06_our_journey',7:'slide07_wedding_details',9:'slide09_dress_code',10:'slide10_programme_1',11:'slide11_programme_2',12:'slide12_programme_3',13:'slide13_gallery_1',14:'slide14_gallery_2',15:'slide15_gallery_3',18:'slide18_thank_you'};
const cfg=window.AQDI_CONTENT_CONFIG;
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
let ticker=null,width=941;
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function place(el,rect){const [x,y,w,h]=rect;Object.assign(el.style,{left:(x/width*100)+'%',top:(y/1672*100)+'%',width:(w/width*100)+'%',height:(h/1672*100)+'%'});canvas.append(el);}
function photo(src,rect,position,clip){const slot=node('button','p2-slot');slot.type='button';slot.setAttribute('aria-label','View full photograph');const im=node('img','p2-photo');im.alt='Original wedding photograph';im.src=src;im.decoding='async';im.loading='lazy';im.style.objectPosition=position;slot.append(im);if(clip)slot.style.clipPath=clip;place(slot,rect);slot.onclick=()=>{$('p2-full-photo').src=src;$('p2-photo-view').showModal();};}
const frameClip='polygon(10% 0,43% 0,50% 5%,57% 0,90% 0,90% 6%,100% 12%,100% 88%,93% 91%,89% 100%,58% 100%,50% 94%,42% 100%,10% 100%,10% 93%,0 88%,0 12%,8% 8%)';
function countdownValues(now=Date.now()){const seconds=Math.max(0,Math.floor((new Date(cfg.countdownTarget).getTime()-now)/1000));return [Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];}
function updateCountdown(){const v=countdownValues();document.querySelectorAll('[data-p2-unit]').forEach(e=>e.textContent=String(v[Number(e.dataset.p2Unit)]).padStart(2,'0'));const c=$('p2-countdown');if(c)c.setAttribute('aria-label',`${v[0]} days, ${v[1]} hours, ${v[2]} minutes, ${v[3]} seconds until 23 October 2026 at 4:30 PM`);}
function countdownGrid(cls){const grid=node('div',cls);['Days','Hours','Minutes','Seconds'].forEach((label,i)=>{const cell=node('div','p2-count-cell'),num=node('strong');num.dataset.p2Unit=i;cell.append(num,node('span',null,label));grid.append(cell);});return grid;}
function readProgramme(slide){const body=$('p2-reader-body');body.replaceChildren();$('p2-reader-title').textContent='Programme · Part '+(slide-9);const ar=node('p','p2-arabic','برنامج الحفل');ar.lang='ar';ar.dir='rtl';body.append(ar);for(const [time,title,details] of programme[slide]){const sec=node('section','p2-programme-item');sec.append(node('p','p2-time',time),node('h2',null,title));if(details.length>1){const ul=node('ul');details.forEach(s=>ul.append(node('li',null,s)));sec.append(ul);}else if(details.length)sec.append(node('p',null,details[0]));body.append(sec);}$('p2-reader').showModal();$('p2-reader-title').tabIndex=-1;$('p2-reader-title').focus({preventScroll:true});$('p2-reader').scrollTop=0;}
function render(n,target){canvas=target;canvas.replaceChildren();canvas.hidden=!(n in art);if(canvas.hidden)return false;width=n===5?940:941;canvas.dataset.slide=n;const img=node('img','p2-art');img.alt=`Slide ${String(n).padStart(2,'0')}`;img.src=`assets/reconstructed/${art[n]}.png`;img.decoding='async';img.loading=n===4?'eager':'lazy';canvas.append(img);
 if(n===6)photo('assets/couple/our_journey.jpg',[279,535,376,448],'50% 10%');
 if(n===7){const button=node('button','p2-countdown');button.id='p2-countdown';button.type='button';button.append(countdownGrid('p2-count-grid'));place(button,[393,912,155,125]);button.onclick=()=>{$('p2-reader-title').textContent='Until 23 October 2026 · 4:30 PM';$('p2-reader-body').replaceChildren(countdownGrid('p2-count-large'));updateCountdown();$('p2-reader').showModal();$('p2-reader-title').tabIndex=-1;$('p2-reader-title').focus({preventScroll:true});$('p2-reader').scrollTop=0;};updateCountdown();ticker=setInterval(updateCountdown,1000);}
 if(n===9){const palette=node('div','p2-palette');const im=node('img');im.alt='Approved dress-code colour palette';im.src='assets/dresscode/approved_palette.jpg';im.decoding='async';palette.append(im);palette.style.clipPath='polygon(4% 0,96% 0,100% 4%,100% 96%,96% 100%,4% 100%,0 96%,0 4%)';place(palette,[226,510,488,568]);}
 if(n===13){photo('assets/gallery/photo01.jpg',[159,342,363,481],'48% 30%',frameClip);photo('assets/gallery/photo02.jpg',[438,879,394,458],'50% 28%',frameClip);}
 if(n===14){photo('assets/gallery/photo03.jpg',[137,350,369,492],'50% 30%',frameClip);photo('assets/gallery/photo04.jpg',[410,896,394,455],'50% 25%',frameClip);}
 if(n===15){photo('assets/gallery/photo02.jpg',[137,350,369,492],'50% 30%',frameClip);photo('assets/gallery/photo04.jpg',[410,896,394,455],'50% 25%',frameClip);}
 return true;
}
window.AQDI_CONTENT=Object.freeze({render,countdownValues,readProgramme});
})();
