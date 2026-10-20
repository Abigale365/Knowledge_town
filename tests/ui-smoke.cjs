// Minimal DOM adapter: checks application event wiring, not browser layout/rendering.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class El{
 constructor(tag,attrs={}){this.tag=tag;this.attrs=attrs;this.id=attrs.id;this.dataset={};for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,a)=>a.toUpperCase())]=v;this.value=attrs.value||'';this.checked='checked'in attrs;this.disabled='disabled'in attrs;this.style={};this.children=[];this.files=[];this.classList={add(){},remove(){},toggle(){}};}
 set innerHTML(v){this.html=v;this.children=parse(v);}get innerHTML(){return this.html||'';}
 setAttribute(k,v){this.attrs[k]=v;}querySelectorAll(q){return walk(this.children).filter(e=>match(e,q));}focus(){document.activeElement=this;}click(){this.onclick?.({target:this});}showModal(){this.open=true;}close(){this.open=false;}scrollIntoView(){}
}
function parse(html){const out=[];for(const m of html.matchAll(/<([a-zA-Z][\w:-]*)\b([^>]*)>/g)){const a={};for(const x of m[2].matchAll(/([\w-]+)(?:="([^"]*)"|='([^']*)')?/g))a[x[1]]=x[2]??x[3]??'';out.push(new El(m[1],a));}return out;}
function walk(list){return list.flatMap(e=>[e,...walk(e.children)]);}
function match(e,q){const m=q.match(/^\[([\w-]+)\]$/);return m&&m[1]in e.attrs;}

const roots=parse(fs.readFileSync('dist/adventure.html','utf8')),data=new Map(),timers=new Map();let timerId=0;
const document={body:new El('body'),getElementById:id=>walk(roots).find(e=>e.id===id)||null,querySelectorAll:q=>walk(roots).filter(e=>match(e,q)),createElement:tag=>new El(tag)};
const context={document,console,TextEncoder,setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),Blob,URL,localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},matchMedia:()=>({matches:true}),navigator:{clipboard:{writeText:async()=>{}}}};context.window=context;vm.createContext(context);
for(const f of ['engine.js','packs.js','journey.js','app.js','materials.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),context,{filename:f});
const run=x=>vm.runInContext(x,context),get=id=>document.getElementById(id),click=id=>{assert.ok(get(id),'missing '+id);get(id).click();},objects=id=>{const e=document.querySelectorAll('[data-object]').find(e=>e.dataset.object===id);assert.ok(e,'missing object '+id);e.click();},chooseTool=id=>{const e=document.querySelectorAll('[data-tool]').find(e=>e.dataset.tool===id);assert.ok(e,'missing tool '+id);e.click();};
run('QuestApp.boot()');assert.equal(get('welcome').hidden,false);assert.equal(get('game').hidden,true);click('start');assert.equal(run('j.room'),'tutorial');assert.ok(get('objective').textContent.includes('米拉'));
objects('mentor');assert.equal(run('j.tutorial'),1);objects('practice');chooseTool('generate');click('tryPractice');assert.equal(run('j.tutorial'),2);assert.equal(run('s.xp'),0);chooseTool('rules');click('tryPractice');assert.equal(run('j.tutorial'),3);assert.equal(run('s.attempts.reduce((a,b)=>a+b)'),0);click('finishTutorial');assert.equal(run('j.room'),'map');assert.equal(run('j.tutorialDone'),true);
// Do the full investigation → action → observed failure → repair → reward loop in both content packs.
for(const index of [0,1]){
 if(index){run('load(packs[1]);j.welcome=true;j.tutorialDone=true;save();');click('continue');}
 objects('room3');assert.equal(run('j.room'),'map');assert.ok(get('toast').textContent.includes('徽章'));
 click('enterNext');assert.equal(run('j.room'),'archive');const archiveArt=get('sceneArt').src;
 click('showLetters');
 for(let i=0;i<4;i++){
   assert.equal(run('j.letter'),i);assert.equal(get('dispatch'),null);click('findEvidence');click('useClue');
   if(i===0){chooseTool('generate');click('dispatch');assert.equal(run('j.feedback.ok'),false);assert.equal(run('j.letterFirst[0]'),false);click('afterLetter');assert.equal(run('j.evidence.includes(0)'),true);}
   chooseTool(run('pack.routes[j.letter].answer'));click('dispatch');assert.equal(run('j.feedback.ok'),true);click('afterLetter');
 }
 assert.equal(run('s.completed.length'),1);assert.equal(run('s.first[0]'),false);assert.equal(run('s.xp'),65);click('goNext');assert.equal(run('j.room'),'workshop');assert.notEqual(get('sceneArt').src,archiveArt);
 objects('run');assert.equal(run('s.attempts[1]'),0);click('inspectMachine');click('findTokens');
 while(run('s.order.join()')!=='0,1,2,3'){
   const arr=run('[...s.order]'),target=arr.findIndex((v,i)=>v!==i),pos=arr.indexOf(target);
   document.querySelectorAll('[data-tile]').find(e=>+e.dataset.tile===target).click();document.querySelectorAll('[data-tile]').find(e=>+e.dataset.tile===pos).click();
 }
 click('checkLock');click('toMachine');assert.equal(run('j.feedback.ok'),false);click('repairAgain');click('checkLock');get('guard').checked=true;get('guard').onchange({target:get('guard')});click('toMachine');assert.equal(run('s.completed.length'),2);click('goNext');assert.equal(run('j.room'),'garden');assert.ok(get('sceneArt').src.includes('garden'));
 objects('crystal');assert.equal(get('runExperiment'),null);click('inspectSurvey');click('inspectQuality');click('openExperiment');const slider=get('adoption');
 for(const v of [100,80,60]){slider.value=v;slider.oninput({target:slider});assert.equal(get('adoption'),slider);assert.equal(run('s.budget.adoption'),v);}
 get('review').checked=false;get('review').onchange({target:get('review')});assert.equal(get('adoption'),slider);click('runExperiment');assert.equal(run('j.feedback.ok'),false);click('repairAgain');
 get('adoption').value=run('pack.economics.adoption');get('adoption').oninput({target:get('adoption')});get('review').checked=true;get('review').onchange({target:get('review')});click('runExperiment');assert.equal(run('s.completed.length'),3);click('goNext');assert.equal(run('j.room'),'tower');assert.ok(get('sceneArt').src.includes('tower'));
 objects('plans');assert.equal(run('j.inspected.includes("plans")'),false);click('readBrief');click('inspectPlans');
 function plan(n,checked){const e=document.querySelectorAll('[data-plan]').find(e=>+e.dataset.plan===n);e.checked=checked;e.onchange();}
 const bad=run('pack.boss.flatMap((b,i)=>!b.required?[i]:[])'),good=run('pack.boss.flatMap((b,i)=>b.required?[i]:[])');bad.forEach(n=>plan(n,true));click('testBeacon');assert.equal(run('j.feedback.ok'),false);click('repairAgain');bad.forEach(n=>plan(n,false));good.forEach(n=>plan(n,true));click('testBeacon');assert.equal(run('s.completed.length'),4);click('showEnding');assert.equal(get('modal').open,true);assert.ok(get('modalBody').innerHTML.includes('学院重新亮起灯'));
 click('closeModal');const earned=run('s.xp');run('enterRoom("garden")');click('revisit');click('runExperiment');assert.equal(run('s.xp'),earned);
 run('load(pack)');assert.equal(get('continue').hidden,false);click('continue');assert.equal(run('j.room'),'garden');assert.equal(run('s.completed.length'),4);
}
// Help can replay the tutorial without erasing earned progress.
const earned=run('s.xp');click('guide');click('replayTutorial');assert.equal(run('s.xp'),earned);assert.equal(run('j.room'),'tutorial');click('menu');click('skipTutorial');assert.equal(run('j.room'),'map');assert.equal(run('s.xp'),earned);
// Cancel a pending map transition before switching content.
run('still=false');get('player').animate=()=>({cancel(){}});run('travel(0)');run('load(packs[0])');for(const fn of [...timers.values()])fn();assert.equal(get('welcome').hidden,false);assert.notEqual(run('j.room'),'archive');
click('menu');click('materialsMenu');get('packJson').value='{broken';click('importPack');assert.ok(get('importError').textContent.includes('格式'));
run('materials()');const custom=JSON.parse(get('packJson').value);custom.id='custom-journey';custom.title='新的学习冒险';get('packJson').value=JSON.stringify(custom);get('reviewed').checked=true;click('importPack');assert.equal(run('pack.id'),'custom-journey');assert.equal(get('welcomeTitle').textContent,'新的学习冒险');
get('sceneArt').onerror();assert.equal(get('sceneArt').hidden,true);click('menu');click('resetMenu');click('confirmReset');assert.equal(run('s.xp'),0);assert.equal(run('j.tutorialDone'),false);assert.equal(get('welcome').hidden,false);
console.log('PASS: first launch, four-step hands-on tutorial, tutorial mistakes without score, map doors, four distinct room images, evidence gates, per-letter consequences, physical step swap, permission failure/repair, live experiment, transfer failure/repair, ending, replay, progress resume, optional skip, cancelled travel, content import, image failure and reset.');
console.log('LIMIT: simulated DOM and event handlers, not a real browser/device interaction test.');
