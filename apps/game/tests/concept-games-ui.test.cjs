'use strict';
// Lightweight DOM/event simulation, not a browser, native focus, touch or visual test.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const UI=require('../src/concept-games-ui.js'),E=require('../../../packages/learning-design/candidates/concept-games/engine.js');
const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'../../../packages/learning-design/candidates/concept-games/catalog.json'),'utf8'));
const decode=s=>String(s).replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
function surface(){
 let doc;const classes=new Set();
 class Element{
  constructor(tag,attrs={}){this.tag=tag;this.attrs=attrs;this.id=attrs.id;this.value=decode(attrs.value||'');this.disabled='disabled'in attrs;this.dataset={};this.listeners={};this.scrollTop=0;this.open=false;for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;}
  set innerHTML(html){this.html=html;this.nodes=[...html.matchAll(/<([\w-]+)\b([^>]*)>/g)].map(m=>{const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=decode(a[2]||'');return new Element(m[1],attrs);});}
  get innerHTML(){return this.html||'';}
  querySelectorAll(q){return(this.nodes||[]).filter(el=>q.startsWith('[')&&q.slice(1,-1)in el.attrs);}
  addEventListener(type,callback,capture=false){(this.listeners[type]??=[]).push({callback,capture});}
  removeEventListener(type,callback){this.listeners[type]=(this.listeners[type]||[]).filter(x=>x.callback!==callback);}
  emit(type){const event={target:this,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};for(const x of [...this.listeners[type]||[]]){x.callback(event);if(event.stopped)break;}return event;}
  click(){if(this.disabled)return;const event=this.emit('click');if(!event.stopped)this.onclick?.(event);}
  focus(){doc.activeElement=this;}
 }
 const body=new Element('div',{id:'dialogBody'}),dialog=new Element('dialog',{id:'dialog'}),closeButton=new Element('button',{id:'close'});
 const host={body,dialog,closeButton,shows:0,closes:0};
 doc={body:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},activeElement:null,getElementById:id=>[body,dialog,closeButton,...body.nodes||[]].find(el=>el.id===id)};
 host.document=doc;host.show=html=>{host.shows++;body.innerHTML=html;dialog.open=true;};host.close=()=>{host.closes++;dialog.open=false;dialog.emit('close');};closeButton.onclick=host.close;
 host.get=id=>{const found=doc.getElementById(id);assert.ok(found,'missing '+id);return found;};host.click=id=>host.get(id).click();return host;
}
function descriptor(kind){return clone(catalog.games.find(d=>d.kind===kind));}
function clone(value){return JSON.parse(JSON.stringify(value));}
function context(d){return {...d.bindings[0],knowledgeHash:d.knowledge.hash};}
function mount(kind,handlers={},options={}){
 const host=options.host||surface(),d=options.descriptor||descriptor(kind),c=options.context||context(d);
 const controller=UI.open({descriptor:d,context:c,engine:options.engine||E,language:options.language||'zh',draft:options.draft,document:host.document,body:host.body,dialog:host.dialog,show:host.show,close:host.close},handlers);
 return {host,d,c,controller,state:()=>(options.engine||E).restore(d,c,controller.getDraft().serialized)};
}
async function click(game,id){game.host.click(id);await game.controller.whenIdle();}
async function input(game,value){const field=game.host.get('cgInput');field.value=String(value);field.oninput();field.onchange();await game.controller.whenIdle();}
test('real rule runner requires teaching and operation evidence before notifying completion; mistakes retain runs',async()=>{
 const saved=[],completed=[];const game=mount('rule-runner',{onDraft:draft=>{saved.push(clone(draft));return true;},onComplete:draft=>{completed.push(draft);return true;}});
 assert.equal(game.state().phase,'teaching');assert.ok(!game.host.document.getElementById('cgRun'));assert.equal(E.collection(game.d,game.c,game.state(),{found:true}).canNewCollect,false);
 await click(game,'cgStart');assert.equal(game.state().phase,'playing');assert.equal(completed.length,0);
 const cfg=game.d.config,below=cfg.outputs.findIndex(o=>o.id===cfg.below),above=cfg.outputs.findIndex(o=>o.id===cfg.atOrAbove);
 await click(game,'cgConclude'+cfg.conclusions.findIndex(o=>o.id==='stable'));assert.equal(game.state().passed,false);
 await input(game,cfg.threshold-1);await click(game,'cgPredict'+below);await click(game,'cgRun');await click(game,'cgPredict'+below);await click(game,'cgRun');
 await input(game,cfg.threshold);await click(game,'cgPredict'+above);await click(game,'cgRun');
 const observations=clone(game.state().data.runs);await click(game,'cgConclude'+cfg.conclusions.findIndex(o=>o.id==='always-same'));
 assert.equal(game.state().passed,false);assert.deepEqual(game.state().data.runs,observations);assert.ok(game.host.body.innerHTML.includes(game.state().feedback[0].message.zh));
 await click(game,'cgConclude'+cfg.conclusions.findIndex(o=>o.id==='stable'));assert.equal(game.state().passed,true);assert.equal(completed.length,0,'passing does not automatically collect or notify');
 assert.equal(E.collection(game.d,game.c,game.state(),{found:true}).formalMastery,false);assert.ok(game.host.body.innerHTML.includes('尚未自动收藏'));
 await click(game,'cgFinish');assert.equal(completed.length,1);assert.equal(E.restore(game.d,game.c,completed[0].serialized).passed,true);
 assert.deepEqual(Object.keys(saved[0]).sort(),['serialized','ui']);assert.ok(saved.every(d=>!('passed'in d)));assert.equal(game.host.closes,1);
});
test('parameter lab shows actual parameter records, retains other judgments and uses engine feedback',async()=>{
 const completed=[];const game=mount('parameter-lab',{onDraft:()=>true,onComplete:draft=>completed.push(draft)});
 await click(game,'cgStart');await click(game,'cgInfer');await click(game,'cgTrain');await input(game,2);await click(game,'cgInfer');
 const data=clone(game.state().data);assert.notEqual(data.operations[1].before,data.operations[1].after);assert.equal(game.state().passed,false);
 const training=game.d.config.judgmentOptions.findIndex(o=>o.id==='training'),inference=game.d.config.judgmentOptions.findIndex(o=>o.id==='inference');
 await click(game,'cgClassify0_'+inference);await click(game,'cgClassify1_'+inference);
 assert.equal(game.state().data.classifications[data.operations[0].id],'inference');assert.equal(game.state().data.classifications[data.operations[1].id],'inference');assert.equal(game.state().feedback[0].correct,false);
 assert.deepEqual(game.state().data.operations,data.operations);assert.ok(!game.host.body.innerHTML.includes('"kind"'));assert.ok(!game.host.body.innerHTML.includes(data.operations[0].id));
 await click(game,'cgResetModel');assert.equal(game.state().data.weight,game.d.config.initialWeight);assert.deepEqual(game.state().data.operations,data.operations);
 await click(game,'cgClassify1_'+training);assert.equal(game.state().passed,true);assert.equal(game.state().assisted,true);assert.equal(completed.length,0);
 await click(game,'cgFinish');assert.equal(completed.length,1);assert.equal(E.collection(game.d,game.c,E.restore(game.d,game.c,completed[0].serialized),{found:true}).formalMastery,false);
});
test('back, invalid input text, reading and three languages preserve the replayable draft',async()=>{
 let saved,back;const game=mount('rule-runner',{onDraft:d=>{saved=clone(d);return true;},onBack:d=>{back=clone(d);return true;}});
 await click(game,'cgStart');await click(game,'cgRead');await input(game,game.d.config.threshold-1);await click(game,'cgPredict0');await click(game,'cgRun');
 const field=game.host.get('cgInput');field.focus();field.value='';field.oninput();await game.controller.whenIdle();const stateBefore=game.controller.getDraft().serialized;
 for(const language of ['en','bi','zh']){game.controller.setLanguage(language);assert.equal(game.controller.getDraft().serialized,stateBefore);assert.equal(game.host.document.activeElement,game.host.get('cgInput'));}
 game.controller.setLanguage('bi');assert.ok(game.host.body.innerHTML.includes(game.d.teaching.explanation.zh));assert.ok(game.host.body.innerHTML.includes(game.d.teaching.explanation.en));
 await click(game,'cgBack');assert.ok(back);assert.equal(back.ui.inputRaw,'');assert.equal(back.ui.reading,true);
 const restored=mount('rule-runner',{onDraft:()=>true},{draft:saved,language:'en'});assert.equal(restored.controller.getDraft().serialized,stateBefore);assert.equal(restored.host.get('cgInput').value,'');
 assert.equal(restored.state().phase,'playing');assert.equal(E.collection(restored.d,restored.c,restored.state(),{found:true}).canNewCollect,false);restored.controller.dispose();
});
test('refused saves and returns retain work; native close capture waits for persistence',async()=>{
 let accept=false,allowBack=false,backCalls=0;const game=mount('rule-runner',{onDraft:()=>accept,onBack:()=>{backCalls++;return allowBack;}});
 await click(game,'cgStart');assert.ok(game.host.body.innerHTML.includes('草稿暂未保存'));assert.equal(game.state().phase,'playing');
 game.host.closeButton.click();await game.controller.whenIdle();assert.equal(game.host.closes,0);assert.equal(backCalls,0);
 accept=true;await click(game,'cgRetrySave');assert.equal(game.state().events.length,1);
 await click(game,'cgBack');assert.equal(game.host.closes,0);assert.equal(backCalls,1);assert.ok(game.host.body.innerHTML.includes('尚未返回物件'));
 allowBack=true;game.host.closeButton.click();await game.controller.whenIdle();assert.equal(game.host.closes,1);assert.equal(backCalls,2);
});
test('asynchronous work cannot repaint a newer session or call stale completion',async()=>{
 let release;const returned=[];const old=mount('rule-runner',{onDraft:()=>new Promise(resolve=>{release=resolve;}),onComplete:d=>returned.push(d)});
 old.host.click('cgStart');await new Promise(resolve=>setImmediate(resolve));assert.equal(typeof release,'function');
 const next=mount('parameter-lab',{onDraft:()=>true},{host:old.host});const html=next.host.body.innerHTML;
 release(true);await old.controller.whenIdle();assert.equal(next.host.body.innerHTML,html);assert.equal(returned.length,0);
 next.controller.dispose();
});
test('invalid bindings never silently reset the draft; authored prose is escaped without serializing answers',async()=>{
 const game=mount('rule-runner',{onDraft:()=>true});await click(game,'cgStart');const draft=game.controller.getDraft();game.controller.dispose();
 const d=descriptor('rule-runner'),wrong={...context(d),lessonHash:'different'};let writes=0;
 const invalid=mount('rule-runner',{onDraft:()=>{writes++;}},{descriptor:d,context:wrong,draft});assert.ok(invalid.host.body.innerHTML.includes('无法核验'));assert.ok(!invalid.host.document.getElementById('cgStart'));assert.equal(writes,0);invalid.controller.dispose();
 d.teaching.explanation={zh:'<img src=x onerror="bad()">',en:'<script>bad()</script>'};d.config.hiddenExpected='DO_NOT_DISPLAY_EXPECTED';d.signature=E.signature(d);
 const safe=mount('rule-runner',{}, {descriptor:d,language:'bi'});assert.ok(safe.host.body.innerHTML.includes('&lt;img'));assert.ok(!safe.host.body.innerHTML.includes('<script>bad'));assert.ok(!safe.host.body.innerHTML.includes('DO_NOT_DISPLAY_EXPECTED'));safe.controller.dispose();
});
test('browser language bridge repaints the same session without invoking draft persistence',async()=>{
 const host=surface(),d=descriptor('rule-runner');let writes=0;
 const runtime={document:host.document,modal:host.show,close:host.close,state:{language:'zh'},ConceptGames:E};runtime.globalThis=runtime;
 runtime.changeTownLanguage=language=>{runtime.state.language=language;};vm.createContext(runtime);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/concept-games-ui.js'),'utf8'),runtime);
 const controller=runtime.ConceptGamesUI.open({descriptor:d,context:context(d),engine:E,language:'zh'},{onDraft:()=>{writes++;return true;},render:host.show,getRoot:()=>host.body});
 host.click('cgStart');await controller.whenIdle();const before=controller.getDraft().serialized,count=writes;
 runtime.changeTownLanguage('en');assert.ok(host.body.innerHTML.includes(d.title.en));runtime.changeTownLanguage('bi');assert.ok(host.body.innerHTML.includes(d.title.zh));assert.ok(host.body.innerHTML.includes(d.title.en));
 assert.equal(controller.getDraft().serialized,before);assert.equal(writes,count);controller.dispose();
});
test('pending exit freezes edits and serializes exactly the displayed draft',async()=>{
 let release,hold=false,back;
 const game=mount('rule-runner',{onDraft:()=>hold?new Promise(resolve=>{release=resolve;}):true,onBack:d=>{back=d;return true;}});
 await click(game,'cgStart');const oldInput=game.host.get('cgInput'),before=game.controller.getDraft().serialized;
 hold=true;game.host.click('cgBack');await new Promise(resolve=>setImmediate(resolve));
 assert.equal(typeof release,'function');assert.equal(game.host.get('cgInput').disabled,false,'fieldset supplies native disabling');
 oldInput.value='9';oldInput.oninput();oldInput.onchange();
 assert.equal(game.controller.getDraft().serialized,before);assert.equal(game.controller.getDraft().ui.inputRaw,String(game.state().data.input));
 release(true);await game.controller.whenIdle();assert.equal(back.serialized,before);assert.equal(game.host.closes,1);
});
test('external native close followed by rejected save reopens a visible retry surface',async()=>{
 let accept=true,backs=0;
 const game=mount('rule-runner',{onDraft:()=>accept,onBack:()=>{backs++;return true;}});
 await click(game,'cgStart');accept=false;game.host.close();await game.controller.whenIdle();
 assert.equal(game.host.dialog.open,true);assert.ok(game.host.body.innerHTML.includes('草稿暂未保存'));assert.ok(game.host.document.getElementById('cgRetrySave'));assert.equal(backs,0);
 accept=true;await click(game,'cgRetrySave');await click(game,'cgBack');assert.equal(backs,1);
});

const nextEngine=require('../../../packages/learning-design/candidates/concept-games/staging/engine.js'),nextCatalog=require('../../../packages/learning-design/candidates/concept-games/staging/catalog.json');
function nextGame(kind,handlers={},options={}){return mount(kind,handlers,{...options,engine:nextEngine,descriptor:nextCatalog.games.find(d=>d.kind===kind)});}
async function doAction(game,a){const node=game.host.body.querySelectorAll('[data-cg-action]').find(el=>JSON.stringify(JSON.parse(el.dataset.cgAction))===JSON.stringify(a));assert.ok(node,'missing visible action '+JSON.stringify(a));node.click();await game.controller.whenIdle();}
test('evidence board requires inspecting records and lets each claim retain distinct evidence',async()=>{
 const g=nextGame('evidence-board',{onDraft:()=>true});await click(g,'cgStart');
 assert.ok(!g.host.body.innerHTML.includes(g.d.config.claims[0].feedback.zh));
 for(const e of g.d.config.evidence)await doAction(g,{type:'inspect',evidenceId:e.id});
 for(const q of g.d.config.claims){for(const id of q.evidenceIds){const node=g.host.body.querySelectorAll('[data-cg-evidence]').find(el=>el.dataset.cgEvidence===q.id&&el.dataset.cgEvidenceId===id);node.click();await g.controller.whenIdle();}await doAction(g,{type:'judge',claimId:q.id,decision:q.expected,evidenceIds:q.evidenceIds});}
 assert.equal(g.state().passed,true);g.controller.dispose();
});
test('sample fitting, unlabeled grouping and delayed reward require different visible operations',async()=>{
 const t=nextGame('sample-trainer',{onDraft:()=>true});await click(t,'cgStart');
 assert.ok(!t.host.body.innerHTML.includes('holdout'));for(const sample of t.d.config.samples.filter(v=>v.y!==null))await doAction(t,{type:'select',sampleId:sample.id});
 await doAction(t,{type:'fit'});assert.ok(t.host.body.innerHTML.includes(String(t.state().data.k)));await doAction(t,{type:'predict',value:t.d.config.holdout.y});await doAction(t,{type:'test'});assert.equal(t.state().passed,true);t.controller.dispose();
 const g=nextGame('cluster-builder',{onDraft:()=>true});await click(g,'cgStart');for(const [i,p]of g.d.config.points.entries())await doAction(g,{type:'place',pointId:p.id,groupId:g.d.config.groups[i<2?0:1].id});await doAction(g,{type:'check'});await doAction(g,{type:'describe',decision:g.d.config.supportedDescription});assert.equal(g.state().passed,true);g.controller.dispose();
 const r=nextGame('reward-path',{onDraft:()=>true});await click(r,'cgStart');assert.ok(!r.host.body.innerHTML.includes('rewards'));
 for(const p of r.d.config.paths){for(let i=0;i<r.d.config.rounds;i++)await doAction(r,{type:'advance',pathId:p.id});const node=r.host.body.querySelectorAll('[data-cg-local]').find(el=>el.dataset.cgLocal===p.id);node.value=String(p.rewards.reduce((a,b)=>a+b,0));node.oninput();await r.controller.whenIdle();}
 await click(r,'cgCompare');const best=r.d.config.paths.reduce((a,b)=>a.rewards.reduce((x,y)=>x+y,0)>b.rewards.reduce((x,y)=>x+y,0)?a:b);await doAction(r,{type:'policy',pathId:best.id});assert.equal(r.state().passed,true);r.controller.dispose();
});

async function localNumber(g,key,value){const node=g.host.body.querySelectorAll('[data-cg-local]').find(el=>el.dataset.cgLocal===key);assert.ok(node);node.value=String(value);node.oninput();await g.controller.whenIdle();}
test('model mapping exposes input-to-output changes without treating manager actions as outputs',async()=>{
 const g=nextGame('model-flow',{onDraft:()=>true});await click(g,'cgStart');await doAction(g,{type:'feed',choice:g.d.config.observationId});for(const v of g.d.config.inputs)await doAction(g,{type:'execute',inputId:v.id});
 assert.equal(g.state().data.runs.length,2);for(const q of g.d.config.judgments)await doAction(g,{type:'judge',itemId:q.id,choice:q.expected});assert.equal(g.state().passed,true);g.controller.dispose();
});
test('inventory commits before revealing demand, then calculates consequences from learner stock',async()=>{
 const g=nextGame('inventory-sim',{onDraft:()=>true});await click(g,'cgStart');assert.ok(!g.host.body.innerHTML.includes('实际需求: '+g.d.config.actual));assert.ok(!g.host.document.getElementById('cgNumber'));
 await localNumber(g,'stock',10);await click(g,'cgStock');assert.equal(g.state().data.stock,10);await doAction(g,{type:'reveal'});assert.ok(g.host.body.innerHTML.includes(String(g.d.config.actual)));
 for(const [key,value]of Object.entries({shortage:Math.max(0,g.d.config.actual-10),excess:Math.max(0,10-g.d.config.actual)})){await localNumber(g,key,value);const node=g.host.body.querySelectorAll('[data-cg-number]').find(el=>el.dataset.cgNumber===key);node.click();await g.controller.whenIdle();}
 await doAction(g,{type:'answer',itemId:'meaning',value:'estimate'});assert.equal(g.state().passed,true);g.controller.dispose();
});
test('record cleaning retains row decisions and subtotal, rather than treating neat fields as accuracy',async()=>{
 const g=nextGame('data-cleaner',{onDraft:()=>true});await click(g,'cgStart');for(const r of g.d.config.rows)await doAction(g,{type:'mark',rowId:r.id,choice:r.expected});await localNumber(g,'subtotal',g.d.config.knownSubtotal);await click(g,'cgSubtotal');if(g.d.config.conclusion)await doAction(g,{type:'conclude',choice:g.d.config.conclusion.expected});assert.equal(g.state().passed,true);g.controller.dispose();
});
test('text extraction requires both meaning and source; drafts survive reload and languages',async()=>{
 const g=nextGame('text-extractor',{onDraft:()=>true});await click(g,'cgStart');
 for(const f of g.d.config.fields){for(const [key,value]of Object.entries({value:f.expected,evidenceId:f.evidenceId})){const node=g.host.body.querySelectorAll('[data-cg-extract-field]').find(el=>el.dataset.cgExtractField===f.id&&el.dataset.cgExtractKey===key&&el.dataset.cgExtractValue===value);node.click();await g.controller.whenIdle();}g.controller.setLanguage('bi');const node=g.host.body.querySelectorAll('[data-cg-extract-submit]').find(el=>el.dataset.cgExtractSubmit===f.id);node.click();await g.controller.whenIdle();}
 assert.equal(g.state().passed,true);const draft=g.controller.getDraft();g.controller.dispose();const back=nextGame('text-extractor',{onDraft:()=>true},{draft});assert.equal(back.state().passed,true);assert.deepEqual(back.controller.getDraft().ui.local,draft.ui.local);back.controller.dispose();
});
test('image inspection renders the actual contours and requires location plus bounded conclusion',async()=>{
 const g=nextGame('image-inspector',{onDraft:()=>true});await click(g,'cgStart');for(const p of g.d.config.image.paths)assert.ok(g.host.body.innerHTML.includes(escapeForTest(p.d)));assert.ok(g.host.body.innerHTML.includes('role="group"'));
 await doAction(g,{type:'inspect',regionId:g.d.config.suspectRegion});await doAction(g,{type:'conclude',choice:'needs-investigation'});assert.equal(g.state().passed,true);g.controller.dispose();
});
function escapeForTest(value){return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;');}

test('image accessibility exposes raw geometry without naming a correct region',async()=>{
 const g=nextGame('image-inspector',{onDraft:()=>true});await click(g,'cgStart');
 const svg=g.host.body.nodes.find(n=>n.tag==='svg'),label=svg.attrs['aria-label'];
 assert.ok(!label.includes('中格内有可见空隙'));assert.ok(!label.includes('middle trace contains a visible gap'));
 for(const path of g.d.config.image.paths)assert.ok(label.includes(path.d));
 for(const region of g.d.config.regions)assert.ok(label.includes('x='+region.x+'…'+(region.x+region.width)));
 g.controller.setLanguage('en');const en=g.host.body.nodes.find(n=>n.tag==='svg').attrs['aria-label'];assert.ok(en.includes('origin is at the top left'));assert.ok(en.includes('M10 50 L95 50'));g.controller.dispose();
});
test('semantic controls retain focus through actions, evidence changes and locale repaint',async()=>{
 const g=nextGame('evidence-board',{onDraft:()=>true});await click(g,'cgStart');
 const inspect=g.host.body.querySelectorAll('[data-cg-action]')[0];inspect.focus();const inspectId=inspect.id;inspect.click();await g.controller.whenIdle();assert.equal(g.host.document.activeElement,g.host.get(inspectId));
 const evidence=g.host.body.querySelectorAll('[data-cg-evidence]')[0];evidence.focus();const evidenceId=evidence.id;evidence.click();await g.controller.whenIdle();assert.equal(g.host.document.activeElement,g.host.get(evidenceId));
 const judge=g.host.body.querySelectorAll('[data-cg-action]').find(el=>JSON.parse(el.dataset.cgAction).type==='judge');judge.focus();const judgeId=judge.id;
 for(const language of ['en','bi','zh']){g.controller.setLanguage(language);assert.equal(g.host.document.activeElement,g.host.get(judgeId));}
 judge.click();await g.controller.whenIdle();assert.equal(g.host.document.activeElement,g.host.get(judgeId));g.controller.dispose();
 const t=nextGame('text-extractor',{onDraft:()=>true});await click(t,'cgStart');const choice=t.host.body.querySelectorAll('[data-cg-extract-field]')[0];choice.focus();const choiceId=choice.id;choice.click();await t.controller.whenIdle();assert.equal(t.host.document.activeElement,t.host.get(choiceId));t.controller.setLanguage('en');assert.equal(t.host.document.activeElement,t.host.get(choiceId));t.controller.dispose();
 const r=nextGame('reward-path',{onDraft:()=>true});await click(r,'cgStart');const total=r.host.body.querySelectorAll('[data-cg-local]')[0];total.focus();const totalId=total.id;r.controller.setLanguage('bi');assert.equal(r.host.document.activeElement,r.host.get(totalId));r.controller.dispose();
});

test('rule process follows actual records and animates only a newly recorded run',async()=>{
 const g=mount('rule-runner',{onDraft:()=>true});await click(g,'cgStart');assert.ok(!g.host.body.innerHTML.includes('data-cg-process="rule"'));
 await input(g,g.d.config.threshold-1);const run=g.host.get('cgRun');run.focus();await click(g,'cgPredict0');await click(g,'cgRun');
 const actual=g.state().data.runs.at(-1);assert.ok(g.host.body.innerHTML.includes('data-cg-process="rule"'));assert.ok(g.host.body.innerHTML.includes('cg-process-motion'));assert.ok(g.host.body.innerHTML.includes(actual.ruleVersion));assert.ok(g.host.body.innerHTML.includes('记录中的输入'));
 const saved=g.controller.getDraft();assert.ok(!JSON.stringify(saved.ui).includes('motion'));g.controller.setLanguage('en');assert.ok(!g.host.body.innerHTML.includes('cg-process-motion'));assert.ok(g.host.body.innerHTML.includes('Latest observed process'));assert.equal(g.controller.getDraft().serialized,saved.serialized);
 await click(g,'cgRead');assert.ok(!g.host.body.innerHTML.includes('cg-process-motion'));g.controller.dispose();const r=mount('rule-runner',{onDraft:()=>true},{draft:saved});assert.ok(r.host.body.innerHTML.includes('data-cg-process="rule"'));assert.ok(!r.host.body.innerHTML.includes('cg-process-motion'));r.controller.dispose();
});
test('parameter process uses observed before-after values and preserves static equivalents',async()=>{
 const g=mount('parameter-lab',{onDraft:()=>true});await click(g,'cgStart');assert.ok(!g.host.body.innerHTML.includes('data-cg-process="parameter"'));
 await click(g,'cgInfer');assert.ok(g.host.body.innerHTML.includes('cg-process-fixed'));assert.ok(g.host.body.innerHTML.includes('参数保持不变'));
 const old=g.controller.getDraft().serialized;await click(g,'cgTrain');const actual=g.state().data.operations.at(-1);assert.notEqual(actual.before,actual.after);assert.ok(g.host.body.innerHTML.includes('cg-process-changed'));assert.ok(g.host.body.innerHTML.includes('cg-process-motion'));assert.ok(g.host.body.innerHTML.includes('cg-parameter-before">'+actual.before));assert.ok(g.host.body.innerHTML.includes('cg-parameter-after">'+actual.after));
 assert.notEqual(g.controller.getDraft().serialized,old);const saved=g.controller.getDraft();g.controller.setLanguage('bi');assert.ok(!g.host.body.innerHTML.includes('cg-process-motion'));assert.equal(g.controller.getDraft().serialized,saved.serialized);g.controller.dispose();
 const css=fs.readFileSync(path.join(__dirname,'../src/concept-games-ui.css'),'utf8');assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));assert.ok(css.includes('animation:none!important'));assert.ok(css.includes('animation:cg-transfer .42s ease-out 1 both'));
});

test('inventory cargo appears only after actual reveal; locale and restore keep static evidence',async()=>{
 const g=nextGame('inventory-sim',{onDraft:()=>true});await click(g,'cgStart');assert.equal(g.host.body.querySelectorAll('[data-cg-stock-row]').length,0);
 await localNumber(g,'stock',10);await click(g,'cgStock');assert.equal(g.host.body.querySelectorAll('[data-cg-stock-row]').length,0);assert.ok(!g.host.body.innerHTML.includes('cg-inventory-motion'));
 await doAction(g,{type:'reveal'});assert.equal(g.host.body.querySelectorAll('[data-cg-stock-row]').length,2);assert.ok(g.host.body.innerHTML.includes('cg-inventory-motion'));assert.ok(g.host.body.innerHTML.includes('cg-cargo-unpaired'));
 assert.ok(g.host.body.innerHTML.includes('缺货与多备的数值仍由你核算'));assert.equal(g.state().data.answers.shortage,undefined,'visuals do not answer calculation fields');const saved=g.controller.getDraft();
 for(const language of ['en','bi','zh']){g.controller.setLanguage(language);assert.ok(!g.host.body.innerHTML.includes('cg-inventory-motion'));assert.equal(g.controller.getDraft().serialized,saved.serialized);}
 g.controller.dispose();const r=nextGame('inventory-sim',{onDraft:()=>true},{draft:saved});assert.equal(r.host.body.querySelectorAll('[data-cg-stock-row]').length,2);assert.ok(!r.host.body.innerHTML.includes('cg-inventory-motion'));r.controller.dispose();
});
test('large inventory uses a bounded common quantity scale and true per-cell numbers',async()=>{
 const d=clone(nextCatalog.games.find(d=>d.kind==='inventory-sim'));d.config.actual=170;d.config.maxStock=300;d.signature=nextEngine.signature(d);
 const g=mount('inventory-sim',{onDraft:()=>true},{engine:nextEngine,descriptor:d});await click(g,'cgStart');await localNumber(g,'stock',140);await click(g,'cgStock');await doAction(g,{type:'reveal'});
 const rows=g.host.body.querySelectorAll('[data-cg-stock-row]');assert.equal(rows.length,2);assert.ok(g.host.body.innerHTML.includes('每格最多 15'));const slots=g.host.body.nodes.filter(n=>n.attrs.class?.includes('cg-cargo-slot'));assert.equal(slots.length,24,'at most twelve aligned cells in each row');assert.ok(g.host.body.innerHTML.includes('已提交备货 140'));assert.ok(g.host.body.innerHTML.includes('引擎已揭示需求 170'));g.controller.dispose();
});

function transfer(){const data={};return {get types(){return Object.keys(data);},setData(k,v){data[k]=v;},getData(k){return data[k]||'';}};}
function dragEvent(dataTransfer){return {dataTransfer,preventDefault(){this.prevented=true;}};}
function pointNode(g,id){return g.host.body.querySelectorAll('[data-cg-point]').find(el=>el.dataset.cgPoint===id);}
function groupNode(g,id){return g.host.body.querySelectorAll('[data-cg-drop-group]').find(el=>el.dataset.cgDropGroup===id);}
test('cluster board supports click-then-target, keyboard buttons, reallocation and restored placements',async()=>{
 const g=nextGame('cluster-builder',{onDraft:()=>true});await click(g,'cgStart');assert.equal(g.host.body.querySelectorAll('[data-cg-point]').length,g.d.config.points.length,'each numeric point appears once on the main board');
 const p=g.d.config.points[0],first=g.d.config.groups[0],second=g.d.config.groups[1];const point=pointNode(g,p.id);point.focus();const id=point.id;point.click();await g.controller.whenIdle();assert.equal(g.host.document.activeElement,g.host.get(id));
 let target=g.host.body.querySelectorAll('[data-cg-place-selected]').find(el=>el.dataset.cgPlaceSelected===first.id);target.focus();target.click();await g.controller.whenIdle();assert.equal(g.state().data.placements[p.id],first.id);
 pointNode(g,p.id).click();await g.controller.whenIdle();g.host.body.querySelectorAll('[data-cg-place-selected]').find(el=>el.dataset.cgPlaceSelected===second.id).click();await g.controller.whenIdle();assert.equal(g.state().data.placements[p.id],second.id);
 const saved=g.controller.getDraft();for(const language of ['en','bi','zh']){g.controller.setLanguage(language);assert.equal(g.controller.getDraft().serialized,saved.serialized);}g.controller.dispose();const r=nextGame('cluster-builder',{onDraft:()=>true},{draft:saved});assert.equal(r.state().data.placements[p.id],second.id);assert.equal(r.controller.getDraft().ui.local.point,p.id);r.controller.dispose();
});
test('cluster native drag data accepts same-session moves and rejects foreign, malformed and stale drops',async()=>{
 const g=nextGame('cluster-builder',{onDraft:()=>true});await click(g,'cgStart');const p=g.d.config.points[0],first=g.d.config.groups[0],second=g.d.config.groups[1];
 const dt=transfer();pointNode(g,p.id).ondragstart(dragEvent(dt));const over=dragEvent(dt);groupNode(g,first.id).ondragover(over);assert.equal(over.prevented,true);groupNode(g,first.id).ondrop(dragEvent(dt));await g.controller.whenIdle();assert.equal(g.state().data.placements[p.id],first.id);
 const moved=transfer();pointNode(g,p.id).ondragstart(dragEvent(moved));groupNode(g,second.id).ondrop(dragEvent(moved));await g.controller.whenIdle();assert.equal(g.state().data.placements[p.id],second.id);
 const before=g.controller.getDraft().serialized,bad=transfer();bad.setData('application/x-knowledge-town-concept-point','{broken');groupNode(g,first.id).ondrop(dragEvent(bad));const external=transfer();external.setData('text/plain',p.id);groupNode(g,first.id).ondrop(dragEvent(external));await g.controller.whenIdle();assert.equal(g.controller.getDraft().serialized,before);
 const oldDrop=groupNode(g,first.id).ondrop;const next=nextGame('cluster-builder',{onDraft:()=>true},{host:g.host});await click(next,'cgStart');oldDrop(dragEvent(moved));groupNode(next,first.id).ondrop(dragEvent(moved));await next.controller.whenIdle();assert.equal(next.state().events.length,1,'cross-object payload and old callback do not write');next.controller.dispose();
});
test('cluster drag and selection cannot mutate during a pending save or exit',async()=>{
 let hold=false,release;const g=nextGame('cluster-builder',{onDraft:()=>hold?new Promise(resolve=>{release=resolve;}):true,onBack:()=>true});await click(g,'cgStart');const p=g.d.config.points[0],group=g.d.config.groups[0],point=pointNode(g,p.id),drop=groupNode(g,group.id).ondrop,dt=transfer();point.ondragstart(dragEvent(dt));
 hold=true;point.click();await new Promise(resolve=>setImmediate(resolve));const before=g.controller.getDraft().serialized;drop(dragEvent(dt));const stopped=dragEvent(transfer());point.ondragstart(stopped);assert.equal(stopped.prevented,true);release(true);await g.controller.whenIdle();assert.equal(g.controller.getDraft().serialized,before);
 g.host.click('cgBack');await new Promise(resolve=>setImmediate(resolve));drop(dragEvent(dt));point.onclick();release(true);await g.controller.whenIdle();assert.equal(g.controller.getDraft().serialized,before);
});

test('independently loaded UI modules reject each other first-controller drag gestures',async()=>{
 function isolated(){const runtime={module:{exports:{}},console};runtime.globalThis=runtime;vm.createContext(runtime);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/concept-games-ui.js'),'utf8'),runtime);return runtime.module.exports;}
 const firstUI=isolated(),secondUI=isolated(),d=clone(nextCatalog.games.find(d=>d.kind==='cluster-builder'));
 function start(api){const host=surface(),controller=api.open({descriptor:d,context:context(d),engine:nextEngine,document:host.document,body:host.body,dialog:host.dialog,show:host.show,close:host.close},{onDraft:()=>true});return {host,controller,state:()=>nextEngine.restore(d,context(d),controller.getDraft().serialized)};}
 const a=start(firstUI),b=start(secondUI);await click(a,'cgStart');await click(b,'cgStart');const point=d.config.points[0],group=d.config.groups[0],dt=transfer();pointNode(a,point.id).ondragstart(dragEvent(dt));
 groupNode(b,group.id).ondrop(dragEvent(dt));await b.controller.whenIdle();assert.equal(b.state().data.placements[point.id],undefined,'a different module instance does not share the initial controller gesture');
 groupNode(a,group.id).ondrop(dragEvent(dt));await a.controller.whenIdle();assert.equal(a.state().data.placements[point.id],group.id);a.controller.dispose();b.controller.dispose();
});

test('sample plot shows only public labeled samples, linked selection and recorded fit parameter',async()=>{
 const d=clone(nextCatalog.games.find(d=>d.kind==='sample-trainer'));d.config.holdout.y=987654;d.signature=nextEngine.signature(d);
 const g=mount('sample-trainer',{onDraft:()=>true},{engine:nextEngine,descriptor:d});await click(g,'cgStart');
 assert.equal(g.host.body.querySelectorAll('[data-cg-sample-point]').length,d.config.samples.filter(p=>p.y!==null).length);assert.equal(g.host.body.querySelectorAll('[data-cg-fitted-parameter]').length,0);assert.ok(!g.host.body.innerHTML.includes('987654'));assert.ok(g.host.body.innerHTML.includes('无目标'));
 for(const sample of d.config.samples.filter(p=>p.y!==null)){await doAction(g,{type:'select',sampleId:sample.id});const dot=g.host.body.querySelectorAll('[data-cg-sample-point]').find(el=>el.dataset.cgSamplePoint===sample.id);assert.equal(dot.attrs.class,'cg-sample-chosen');}
 assert.equal(g.host.body.querySelectorAll('[data-cg-fitted-parameter]').length,0);await doAction(g,{type:'fit'});assert.equal(g.host.body.querySelectorAll('[data-cg-fitted-parameter]')[0].dataset.cgFittedParameter,String(g.state().data.k));
 assert.ok(!g.host.body.innerHTML.includes('987654'));const svg=g.host.body.innerHTML.split('class="cg-sample-plot"')[1].split('</svg>')[0];assert.equal((svg.match(/<path /g)||[]).length,1,'only axes; no extrapolated prediction line');assert.ok(!svg.includes('<span'));
 const saved=g.controller.getDraft();g.controller.setLanguage('bi');assert.equal(g.controller.getDraft().serialized,saved.serialized);assert.ok(g.host.body.innerHTML.includes('Public training examples'));assert.equal(g.state().passed,false,'drawing the fit never passes prediction');g.controller.dispose();
 const restored=mount('sample-trainer',{onDraft:()=>true},{engine:nextEngine,descriptor:d,draft:saved});assert.equal(restored.host.body.querySelectorAll('[data-cg-fitted-parameter]')[0].dataset.cgFittedParameter,String(restored.state().data.k));restored.controller.dispose();
});

test('reward trail reveals only visited engine steps and never fills totals or marks best policy',async()=>{
 const d=clone(nextCatalog.games.find(d=>d.kind==='reward-path'));d.config.paths[0].rewards=[314159,-271828];d.config.paths[1].rewards=[161803,141421];d.signature=nextEngine.signature(d);
 const g=mount('reward-path',{onDraft:()=>true},{engine:nextEngine,descriptor:d});await click(g,'cgStart');
 assert.ok(!g.host.body.innerHTML.includes('314159'));assert.ok(!g.host.body.innerHTML.includes('-271828'));assert.ok(!g.host.body.innerHTML.includes('161803'));assert.equal(g.host.body.nodes.filter(n=>n.attrs.class?.split(' ').includes('cg-reward-step')).length,0);
 await doAction(g,{type:'advance',pathId:d.config.paths[0].id});assert.ok(g.host.body.innerHTML.includes('314159'));assert.ok(!g.host.body.innerHTML.includes('-271828'));assert.ok(!g.host.body.innerHTML.includes('161803'));assert.equal(g.host.body.nodes.filter(n=>n.attrs.class?.split(' ').includes('cg-reward-new')).length,1);
 const saved=g.controller.getDraft();assert.equal(saved.ui.local[d.config.paths[0].id],undefined,'no calculated answer stored');assert.equal(g.state().data.comparison,null);assert.equal(g.state().data.policy,null);
 g.controller.setLanguage('bi');assert.ok(!g.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-reward-new')));assert.equal(g.controller.getDraft().serialized,saved.serialized);await click(g,'cgRead');assert.ok(!g.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-reward-new')));
 const before=clone(g.state().data.visits);await doAction(g,{type:'advance',pathId:d.config.paths[1].id});assert.deepEqual(g.state().data.visits,before,'rejected switch creates no new observed marker');assert.ok(!g.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-reward-new')));
 g.controller.dispose();const restored=mount('reward-path',{onDraft:()=>true},{engine:nextEngine,descriptor:d,draft:saved});assert.ok(restored.host.body.innerHTML.includes('314159'));assert.ok(!restored.host.body.innerHTML.includes('-271828'));assert.ok(!restored.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-reward-new')));restored.controller.dispose();
});

test('image regions are direct semantic SVG controls with keyboard and old-button equivalents',async()=>{
 const g=nextGame('image-inspector',{onDraft:()=>true});await click(g,'cgStart');const regions=g.host.body.querySelectorAll('[data-cg-region]');assert.equal(regions.length,g.d.config.regions.length);
 const first=g.d.config.regions[0],node=regions[0];assert.equal(node.attrs.role,'button');assert.equal(node.attrs.tabindex,'0');assert.equal(node.attrs.x,String(first.x));assert.equal(node.attrs.width,String(first.width));assert.equal(node.attrs['aria-pressed'],'false');node.focus();const focusId=node.id;node.click();await g.controller.whenIdle();assert.equal(g.state().data.answers.region,first.id);assert.equal(g.state().passed,false,'location alone never passes');assert.equal(g.host.document.activeElement,g.host.get(focusId));
 for(const mode of ['en','bi','zh']){g.controller.setLanguage(mode);assert.equal(g.host.document.activeElement,g.host.get(focusId));assert.equal(g.host.get(focusId).attrs['aria-pressed'],'true');}
 const second=g.host.body.querySelectorAll('[data-cg-region]')[1];let prevented=false;second.onkeydown({key:' ',preventDefault(){prevented=true;}});await g.controller.whenIdle();assert.equal(prevented,true);assert.equal(g.state().data.answers.region,g.d.config.regions[1].id);
 const third=g.host.body.querySelectorAll('[data-cg-region]')[2];third.onkeydown({key:'Enter',preventDefault(){}});await g.controller.whenIdle();assert.equal(g.state().data.answers.region,g.d.config.regions[2].id);
 await doAction(g,{type:'inspect',regionId:first.id});assert.equal(g.state().data.answers.region,first.id);g.controller.dispose();
});
test('SVG region events respect pending persistence, exit and disposed-context boundaries',async()=>{
 let hold=false,release;const g=nextGame('image-inspector',{onDraft:()=>hold?new Promise(resolve=>{release=resolve;}):true,onBack:()=>true});await click(g,'cgStart');const controls=g.host.body.querySelectorAll('[data-cg-region]');hold=true;controls[0].click();await new Promise(resolve=>setImmediate(resolve));const before=g.controller.getDraft().serialized;controls[1].click();controls[2].onkeydown({key:'Enter',preventDefault(){}});assert.equal(g.controller.getDraft().serialized,before);release(true);await g.controller.whenIdle();
 g.host.click('cgBack');await new Promise(resolve=>setImmediate(resolve));controls[1].click();assert.equal(g.controller.getDraft().serialized,before);release(true);await g.controller.whenIdle();
 const next=nextGame('image-inspector',{onDraft:()=>true},{host:g.host});await click(next,'cgStart');controls[2].onkeydown({key:' ',preventDefault(){}});await next.controller.whenIdle();assert.equal(next.state().data.answers.region,undefined);next.controller.dispose();
});

test('evidence numbers link source cards to only the selected references without inspecting or judging',async()=>{
 const g=nextGame('evidence-board',{onDraft:()=>true});await click(g,'cgStart');for(let i=0;i<g.d.config.evidence.length;i++)assert.ok(g.host.body.innerHTML.includes('打开证据 '+(i+1)));
 const q=g.d.config.claims[0],wrong=g.d.config.evidence.find(e=>!q.evidenceIds.includes(e.id))||g.d.config.evidence[0];const selected=g.host.body.querySelectorAll('[data-cg-evidence]').find(el=>el.dataset.cgEvidence===q.id&&el.dataset.cgEvidenceId===wrong.id);selected.focus();const id=selected.id;selected.click();await g.controller.whenIdle();
 assert.equal(g.host.document.activeElement,g.host.get(id));assert.deepEqual(g.state().data.opened,[]);assert.deepEqual(g.state().data.judgments,{});assert.ok(g.host.body.innerHTML.includes('这条记录尚未打开'));assert.ok(!g.host.body.innerHTML.includes(wrong.text.zh));
 await doAction(g,{type:'inspect',evidenceId:wrong.id});const ref=g.host.body.innerHTML.split('class="cg-reference-list"')[1].split('</details>')[0];assert.ok(ref.includes(wrong.text.zh));for(const e of g.d.config.evidence.filter(e=>e.id!==wrong.id))assert.ok(!ref.includes(e.text.zh));
 const saved=g.controller.getDraft();g.controller.setLanguage('en');assert.ok(g.host.body.innerHTML.includes('Inspect evidence 1'));assert.ok(g.host.body.innerHTML.includes(wrong.text.en));assert.equal(g.controller.getDraft().serialized,saved.serialized);g.controller.dispose();
 const r=nextGame('evidence-board',{onDraft:()=>true},{draft:saved});assert.ok(r.host.body.innerHTML.includes(wrong.text.zh));assert.equal(r.state().passed,false);assert.deepEqual(r.state().data.judgments,{});r.controller.dispose();
});
test('revealing a selected source after a premature guess does not silently validate that judgment',async()=>{
 const g=nextGame('evidence-board',{onDraft:()=>true});await click(g,'cgStart');const q=g.d.config.claims[0];for(const id of q.evidenceIds){const el=g.host.body.querySelectorAll('[data-cg-evidence]').find(el=>el.dataset.cgEvidence===q.id&&el.dataset.cgEvidenceId===id);el.click();await g.controller.whenIdle();}
 await doAction(g,{type:'judge',claimId:q.id,decision:q.expected,evidenceIds:q.evidenceIds});assert.equal(g.state().data.judgmentRead[q.id],false);for(const id of q.evidenceIds)await doAction(g,{type:'inspect',evidenceId:id});assert.equal(g.state().data.judgmentRead[q.id],false);assert.equal(g.state().passed,false);await doAction(g,{type:'judge',claimId:q.id,decision:q.expected,evidenceIds:q.evidenceIds});assert.equal(g.state().data.judgmentRead[q.id],true);g.controller.dispose();
});

test('model machine paths show only executed results, animate the acted lane and retain run history',async()=>{
 const d=clone(nextCatalog.games.find(d=>d.kind==='model-flow'));d.config.inputs[0].value=777;d.config.inputs[1].value=888;d.signature=nextEngine.signature(d);
 const g=mount('model-flow',{onDraft:()=>true},{engine:nextEngine,descriptor:d});await click(g,'cgStart');assert.ok(!g.host.body.innerHTML.includes('1554'));assert.ok(!g.host.body.innerHTML.includes('1776'));
 const first=d.config.inputs[0],other=d.config.inputs[1];await doAction(g,{type:'execute',inputId:first.id});assert.equal(g.state().data.runs.length,0);assert.ok(!g.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-model-motion')));assert.ok(!g.host.body.innerHTML.includes('1554'));
 await doAction(g,{type:'feed',choice:d.config.observationId});await doAction(g,{type:'execute',inputId:first.id});assert.ok(g.host.body.innerHTML.includes('1554'));assert.ok(!g.host.body.innerHTML.includes('1776'));const animated=g.host.body.nodes.filter(n=>n.attrs.class?.split(' ').includes('cg-model-motion'));assert.equal(animated.length,1);assert.equal(animated[0].dataset.cgModelInput,first.id);
 const saved=g.controller.getDraft();g.controller.setLanguage('bi');assert.equal(g.controller.getDraft().serialized,saved.serialized);assert.ok(!g.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-model-motion')));await click(g,'cgRead');assert.ok(!g.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-model-motion')));
 await doAction(g,{type:'execute',inputId:first.id});assert.ok(g.host.body.innerHTML.includes('cg-model-history'));assert.equal(g.state().data.runs.length,2);assert.equal(g.state().passed,false);
 g.controller.dispose();const restored=mount('model-flow',{onDraft:()=>true},{engine:nextEngine,descriptor:d,draft:saved});assert.ok(restored.host.body.innerHTML.includes('1554'));assert.ok(!restored.host.body.innerHTML.includes('1776'));assert.ok(!restored.host.body.nodes.some(n=>n.attrs.class?.split(' ').includes('cg-model-motion')));restored.controller.dispose();
});

test('cleaner ledger aligns original IDs, quantities, provenance and learner decisions without preclassification',async()=>{
 const g=nextGame('data-cleaner',{onDraft:()=>true});await click(g,'cgStart');const html=g.host.body.innerHTML;
 assert.ok(html.includes('<table class="cg-ledger">'));assert.equal((html.match(/scope="col"/g)||[]).length,4);assert.equal((html.match(/scope="row"/g)||[]).length,g.d.config.rows.length);
 for(const r of g.d.config.rows){assert.ok(html.includes(r.orderId));assert.ok(html.includes(r.source.zh));if(r.quantity===null){const row=html.split('<th scope="row">'+r.orderId+'</th>')[1].split('</tr>')[0];assert.ok(row.includes('未知'));}}
 assert.deepEqual(g.state().data.answers,{});assert.equal(g.controller.getDraft().ui.local.subtotal,undefined);assert.ok(!g.host.body.querySelectorAll('[data-cg-action]').some(el=>el.attrs['aria-pressed']==='true'));
 const row=g.d.config.rows[1],decision=g.d.config.options[0];const control=g.host.body.querySelectorAll('[data-cg-action]').find(el=>{const a=JSON.parse(el.dataset.cgAction);return a.type==='mark'&&a.rowId===row.id&&a.choice===decision.id;});control.focus();const id=control.id;control.click();await g.controller.whenIdle();assert.equal(g.state().data.answers[row.id],decision.id);assert.equal(g.host.document.activeElement,g.host.get(id));assert.equal(g.host.get(id).attrs['aria-pressed'],'true');
 const saved=g.controller.getDraft();for(const mode of ['en','bi','zh']){g.controller.setLanguage(mode);assert.equal(g.host.document.activeElement,g.host.get(id));assert.equal(g.controller.getDraft().serialized,saved.serialized);}g.controller.dispose();const restored=nextGame('data-cleaner',{onDraft:()=>true},{draft:saved});assert.equal(restored.state().data.answers[row.id],decision.id);assert.equal(restored.state().data.answers.subtotal,undefined);restored.controller.dispose();
 const css=fs.readFileSync(path.join(__dirname,'../src/concept-games-ui.css'),'utf8');assert.ok(css.includes('.cg-ledger-scroll{overflow-x:auto'));assert.ok(css.includes('min-width:760px'));
});

test('ledger horizontal position survives decisions, language, reading and pending-save exit paints',async()=>{
 let hold=false,release;const g=nextGame('data-cleaner',{onDraft:()=>hold?new Promise(resolve=>{release=resolve;}):true,onBack:()=>false});await click(g,'cgStart');g.host.get('cgLedgerScroll').scrollLeft=237;
 const row=g.d.config.rows[0];await doAction(g,{type:'mark',rowId:row.id,choice:g.d.config.options[0].id});assert.equal(g.host.get('cgLedgerScroll').scrollLeft,237);
 for(const lang of ['en','bi','zh']){g.controller.setLanguage(lang);assert.equal(g.host.get('cgLedgerScroll').scrollLeft,237);}await click(g,'cgRead');assert.equal(g.host.get('cgLedgerScroll').scrollLeft,237);
 hold=true;g.host.click('cgBack');await new Promise(resolve=>setImmediate(resolve));assert.equal(g.host.get('cgLedgerScroll').scrollLeft,237);release(true);await g.controller.whenIdle();assert.equal(g.host.get('cgLedgerScroll').scrollLeft,237,'rejected handoff remains at the current column');
 const draft=g.controller.getDraft();const next=nextGame('data-cleaner',{onDraft:()=>true},{host:g.host,draft});assert.notEqual(next.host.get('cgLedgerScroll').scrollLeft,237,'a different controller does not inherit the ledger position');next.controller.dispose();
});
