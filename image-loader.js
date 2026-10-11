/* Load only requested artwork, with two concurrent transfers and recoverable failures. */
(()=>{'use strict';
const queue=[];let active=0;const jobs=new WeakMap();
function pump(){while(active<2&&queue.length){const task=queue.shift();active++;task().finally(()=>{active--;pump();});}}
function ready(image){
 if(image.complete&&image.naturalWidth)return Promise.resolve();
 if(jobs.has(image))return jobs.get(image);
 const promise=new Promise((resolve,reject)=>{queue.push(async()=>{
  try{for(let attempt=0;;attempt++){try{await transfer(image,attempt);break;}catch(error){if(attempt>=1)throw error;}}resolve();}
  catch(error){reject(error);}finally{jobs.delete(image);}
 });pump();});jobs.set(image,promise);return promise;
}
function transfer(image,attempt){return new Promise((resolve,reject)=>{
 const source=image.dataset.src||image.getAttribute('src');if(!source){reject(new Error('Missing image'));return;}
 let timer;const clean=()=>{clearTimeout(timer);image.removeEventListener('load',loaded);image.removeEventListener('error',failed);};
 const loaded=()=>{if(!image.naturalWidth)return failed();clean();resolve();};
 const failed=()=>{clean();reject(new Error('Image could not load'));};
 image.addEventListener('load',loaded);image.addEventListener('error',failed);
 timer=setTimeout(()=>{clean();image.removeAttribute('src');reject(new Error('Image loading timed out'));},45000);
 image.loading='eager';image.decoding='async';image.dataset.src=source;
 image.src=attempt?source+(source.includes('?')?'&':'?')+'retry='+Date.now():source;
 if(image.complete&&image.naturalWidth)loaded();
 });}
window.AQDI_IMAGES=Object.freeze({ready});
})();
