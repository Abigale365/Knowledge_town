// Simulated DOM tests exercise wiring and state transitions, not browser layout or touch behavior.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function harness(data=new Map()){
 let document;
 class El{constructor(tag,attrs={}){this.attrs=attrs;this.id=attrs.id;this.dataset={};for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5)]=v;this.style={setProperty(k,v){this[k]=v;}};this.children=[];this.disabled='disabled'in attrs;this.hidden='hidden'in attrs;this.clientWidth=900;this.clientHeight=600;const set=new Set();this.classList={add:k=>set.add(k),remove:k=>set.delete(k),contains:k=>set.has(k),toggle:(k,v)=>v?set.add(k):set.delete(k)};this.events={};this.isConnected=true;}set innerHTML(v){this.html=v;this.children=parse(v);}get innerHTML(){return this.html||'';}addEventListener(n,f){this.events[n]=f;}focus(){document.activeElement=this;}click(){if(!this.disabled)this.onclick?.({target:this});}showModal(){this.open=true;}close(){this.open=false;}scrollIntoView(){}setPointerCapture(){}}
 function parse(s){return [...s.matchAll(/<([\w-]+)\b([^>]*)>/g)].map(m=>{const a={};for(const n of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g))a[n[1]]=n[2]||'';return new El(m[1],a);});}function all(a){return a.flatMap(x=>[x,...all(x.children)]);}
 const roots=parse(fs.readFileSync('dist/expedition.html','utf8'));document={getElementById:id=>all(roots).find(x=>x.id===id),querySelectorAll:q=>{const key=q.slice(1,-1);return all(roots).filter(x=>key in x.attrs);},activeElement:null,addEventListener(){}};
 const context={document,console,Date,Uint32Array,innerWidth:1200,setTimeout:()=>1,clearTimeout(){},addEventListener(){},localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}};context.window=context;vm.createContext(context);for(const file of ['expedition-engine.js','expedition.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});const run=s=>vm.runInContext(s,context),get=id=>document.getElementById(id),click=id=>{assert.ok(get(id),id);get(id).click();},item=id=>{const b=document.querySelectorAll('[data-item]').find(x=>x.dataset.item===id);assert.ok(b,id);b.click();};return{run,get,click,item,data,document};
}
let h=harness(),{run,get,click,item}=h;assert.equal(get('mapView').hidden,false);assert.equal(get('playView').hidden,true);run('enter(7)');assert.equal(run('view'),'map');assert.ok(get('toast').textContent.includes('前一站'));click('continueJourney');assert.equal(get('dialog').open,true);click('startGuide');assert.equal(run('state.guide'),true);click('zoomIn');assert.equal(run('zoom'),1.5);for(let i=0;i<8;i++)click('zoomIn');assert.equal(run('zoom'),4);assert.equal(get('zoomIn').disabled,true);click('resetView');assert.equal(run('zoom'),1);
for(let stage=0;stage<8;stage++){
 assert.equal(run('state.current'),stage);assert.equal(get('playView').hidden,false);const t=run('task');
 if(t.kind==='select'){
   const bad=t.items.find(x=>!x.valid);item(bad.id);click('collect');assert.ok(get('decisionFeedback').innerHTML.includes('重新判断'));click('leave');
   for(const x of t.items.filter(x=>x.valid)){item(x.id);click('collect');}
 }else if(t.kind==='multi'){
   assert.equal(get('verify').disabled,true);
   for(const x of t.items){item(x.id);if(x.valid)click('choose');else click('returnScene');}
   assert.equal(get('verify').disabled,false);click('verify');assert.ok(get('panelFeedback').innerHTML.includes('完成'));
 }else{
   const bad=t.items.find(x=>x.tag!==t.recipes[0][2]);get('dropSlot').ondrop({preventDefault(){},dataTransfer:{getData:()=>bad.id}});assert.ok(get('panelFeedback').innerHTML.includes('不匹配'));
   for(let i=0;i<4;i++){const x=t.items.find(x=>x.tag===t.recipes[i][2]);if(i===0)get('dropSlot').ondrop({preventDefault(){},dataTransfer:{getData:()=>x.id}});else{item(x.id);click('putItem');}}
   assert.equal(run('run().solved.length'),4);
 }
 assert.equal(get('finish').disabled,false);click('finish');assert.ok(get('dialogBody').innerHTML.includes('最佳'));assert.equal(run('state.best[state.current]'),3);if(stage<7)click('resultNext');else click('resultNext');
}
assert.equal(run('state.collections.length'),31);assert.equal(run('state.best.reduce((a,b)=>a+b)'),24);assert.ok(get('dialogBody').innerHTML.includes('探索者'));click('closeCollection');click('mapButton');assert.equal(get('mapView').hidden,false);assert.ok(get('journeyProgress').textContent.includes('8 / 8'));run('enter(0)');assert.ok(get('dialogBody').innerHTML.includes('最佳星级'));click('startReplay');assert.equal(run('run().accepted.length'),0);assert.equal(run('state.collections.length'),31);const first=run('task.items.find(x=>x.valid).id');item(first);click('collect');assert.equal(run('run().accepted.length'),1);click('hint');assert.equal(get('hintRegion').hidden,false);assert.equal(run('run().hints'),1);click('mapButton');assert.equal(get('playView').hidden,true);
// A new runtime restores the partial run and keeps all prior stars/collections.
h=harness(h.data);({run,get,click,item}=h);assert.equal(run('state.best.reduce((a,b)=>a+b)'),24);assert.equal(run('state.collections.length'),31);run('enter(0)');assert.equal(get('dialog').open,undefined);assert.equal(run('run().accepted.length'),1);assert.equal(run('run().hints'),1);assert.equal(get('count').textContent,'1 / 3');click('replayLevel');click('keepProgress');assert.equal(run('run().accepted.length'),1);click('replayLevel');click('confirmReplay');assert.equal(run('run().accepted.length'),0);assert.equal(run('state.best[0]'),3);assert.equal(run('state.collections.length'),31);
console.log('PASS: map lock and progression, introduction, all 8 stages via real handlers, wrong choices, ten-pick-four, drag/drop and click combination, 24 stars/31 collections, replay preserves best, partial reload, hint, zoom limits. LIMIT: simulated DOM, not browser/device QA.');
