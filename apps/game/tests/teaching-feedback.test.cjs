'use strict';
// Pure UI and handler tests; no real DOM, browser layout or grading replacement.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const UI=require('../src/teaching-feedback-ui.js');
const B=require('../../../packages/learning-design/teaching-logic.v5.cjs');
const logic=require('../../../packages/learning-design/generated/teaching-logic.v5.json');
const legacy=require('../../../packages/learning-design/generated/legacy-teaching-logic.v5.json');
const {feedback}=require('../../../packages/learning-design/generate-feedback-v5.cjs').prepareFeedback();
const C=require('../../../packages/contracts');
const rounds=[...logic.sections.flatMap(s=>[s.guidedPractice.round,...s.independentApplication.rounds.map(e=>e.round)]),...legacy.chapters.flatMap(c=>c.sections.flatMap(s=>s.independentActivity.rounds))];
const round=rounds.find(r=>r.type==='sort');
function actualDiagnostic(r=round,answer=B.initialAnswer(r)){
 const entry=feedback.activeEntries.find(e=>e.roundId===r.id&&e.roundHash===C.digest(JSON.stringify(r)));
 assert.ok(entry,'bound B feedback entry');return B.diagnoseRound(r,answer,entry);
}
class El{
 constructor(attrs={}){this.attrs={...attrs};this.dataset={};for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.innerHTML='';this.hidden='hidden'in attrs;this.value='unchanged';}
 getAttribute(k){return this.attrs[k]??null;}setAttribute(k,v){this.attrs[k]=String(v);}removeAttribute(k){delete this.attrs[k];}
}
class Host{
 constructor(html){this.nodes=[...html.matchAll(/<[\w-]+\b([^>]*)>/g)].map(m=>{const a={};for(const n of m[1].matchAll(/([\w-]+)(?:="([^"]*)")?/g))a[n[1]]=n[2]||'';return new El(a);});}
 querySelectorAll(q){return this.nodes.filter(e=>q.slice(1,-1)in e.attrs);}
 first(q){return this.querySelectorAll(q)[0];}
}
test('browser global and CommonJS expose the same small candidate API without DOM setup',()=>{
 const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../src/teaching-feedback-ui.js'),'utf8'),context);
 assert.equal(context.TeachingFeedback.version,2);assert.deepEqual(Object.keys(context.TeachingFeedback).sort(),Object.keys(UI).sort());
});
test('real B5 diagnostics cover all available controls, never print expected, internal IDs or case-message answers',()=>{
 const samples=[...new Map(rounds.map(r=>[r.type,r])).values()];assert.ok(samples.length>=7);
 for(const r of samples){const d=actualDiagnostic(r),before=JSON.stringify(d);d.expected='SECRET_EXPECTED';d.checks.forEach(c=>{c.message={zh:'SECRET_CASE_ANSWER',en:'SECRET_CASE_ANSWER'};});
  const submitted=JSON.stringify(d),html=UI.render(d,{language:'bi',explanation:r.reason});
  assert.equal(JSON.stringify(d),submitted);assert.ok(!html.includes('SECRET_'));assert.ok(!html.includes('<pre'));
  for(const check of d.checks)assert.ok(!html.includes('data-tf-check="'+check.id+'"'));
  assert.ok(html.includes('data-locale-fixed="true"'));assert.ok(html.includes('仍需正式测验确认'));
  assert.notEqual(before.length,0);
 }
});
test('partial correct classifications and the entire submitted draft survive render, review and reveal',async()=>{
 const answer=B.initialAnswer(round);answer.placements[round.items[0].id]=round.items[0].target;
 const d=actualDiagnostic(round,answer),before=JSON.stringify(d),options={language:'zh',explanation:round.reason};
 const html=UI.render(d,options),host=new Host(html);let viewed,help=0,reveals=0;
 const cleanup=UI.bind(host,d,{...options,onReview:id=>{viewed=id;},onAssistance:()=>{help++;},onReveal:()=>{reveals++;}});
 assert.ok(html.includes('tf-correct'));assert.ok(html.includes('tf-review'));assert.ok(!html.includes(round.reason.zh));
 host.first('[data-tf-review]').onclick();assert.ok(viewed);assert.equal(reveals,0);assert.equal(help,1,'knowledge review adds no solution help');
 await host.first('[data-tf-reveal]').onclick();assert.equal(reveals,1);assert.equal(help,2);
 assert.equal(host.first('[data-tf-explanation]').hidden,false);assert.ok(host.first('[data-tf-explanation]').innerHTML.includes(round.reason.zh));
 assert.equal(JSON.stringify(d),before);assert.deepEqual(d.draft,answer);cleanup();
});
test('control annotations aggregate errors, preserve values and restore preexisting accessibility attributes',()=>{
 const d={correct:false,checks:[{id:'budget',label:{zh:'预算',en:'Budget'},correct:false},{id:'allowed',label:{zh:'可用',en:'Allowed'},correct:true}]};
 const host=new Host(UI.render(d)),control=new El({'aria-invalid':'grammar'});control.value='keep this correct draft';
 const cleanup=UI.bind(host,d,{findControl:()=>control});assert.equal(control.getAttribute('aria-invalid'),'true');assert.equal(control.getAttribute('data-teaching-feedback'),'review');assert.equal(control.value,'keep this correct draft');
 cleanup();assert.equal(control.getAttribute('aria-invalid'),'grammar');assert.equal(control.getAttribute('data-teaching-feedback'),null);
});
test('revealing waits for host assistance acknowledgement, respects refusal and cannot update a disposed round',async()=>{
 const d=actualDiagnostic(),options={explanation:round.reason};let release;
 const host=new Host(UI.render(d,options));
 const cleanup=UI.bind(host,d,{...options,onReveal:()=>new Promise(resolve=>{release=resolve;})});
 const pending=host.first('[data-tf-reveal]').onclick();await Promise.resolve();assert.ok(release);assert.equal(host.first('[data-tf-explanation]').hidden,true);
 cleanup();release(true);await pending;assert.equal(host.first('[data-tf-explanation]').hidden,true);
 const refused=new Host(UI.render(d,options));UI.bind(refused,d,{...options,onReveal:()=>false});await refused.first('[data-tf-reveal]').onclick();assert.equal(refused.first('[data-tf-explanation]').hidden,true);
});
test('UI never awards independent credit, including guided success and restored solution-revealed state',()=>{
 const correct=actualDiagnostic(round,B.witness(round));assert.equal(correct.correct,true);
 assert.equal(UI.evidence(correct).independentCreditClaimed,false);
 const html=UI.render(correct,{stage:'guided',language:'en'});assert.ok(html.includes('not independent application evidence'));
 const restored=UI.render(correct,{fullReasonRevealed:true,language:'bi',explanation:round.reason});assert.ok(restored.includes('不能据此标为独立掌握'));assert.ok(restored.includes(round.reason.en));
 assert.deepEqual(UI.evidence({...correct,fullReasonRevealed:true}),{assistanceRevealed:true,solutionRevealed:true,fullReasonRevealed:true,independentCreditClaimed:false});
});
test('malicious labels, titles and prose are escaped and routing IDs never become HTML attributes',()=>{
 const payload='<img src=x onerror="boom">',d={correct:false,checks:[{id:payload,label:{zh:payload,en:payload},correct:false,reviewLinks:[{unitId:payload,title:{zh:payload,en:payload}}]}]};
 const html=UI.render(d,{explanation:{zh:payload,en:payload},fullReasonRevealed:true});assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('data-tf-review="<'));
 let reviewed;const host=new Host(html);UI.bind(host,d,{onReview:id=>{reviewed=id;}});host.first('[data-tf-review]').onclick();assert.equal(reviewed,payload);
});
test('empty diagnostics and reveal failures retain the draft and give recoverable feedback',async()=>{
 assert.ok(UI.render(null).includes('未收到可显示的逐项诊断'));
 const d=actualDiagnostic(),before=JSON.stringify(d),host=new Host(UI.render(d,{explanation:round.reason}));let error;
 UI.bind(host,d,{explanation:round.reason,onReveal:()=>{throw new Error('host save failed');},onError:e=>{error=e;}});
 await host.first('[data-tf-reveal]').onclick();assert.equal(error.message,'host save failed');assert.equal(host.first('[data-tf-reveal]').disabled,false);assert.ok(host.first('[data-tf-error]').innerHTML.includes('当前作答保留'));assert.equal(JSON.stringify(d),before);
});
test('item feedback links to real controls for keyboard repair, preserves old descriptions and uses unique IDs',()=>{
 const d={correct:false,checks:[{id:'field',label:{zh:'待核验字段',en:'Field to review'},correct:false},{id:'missing',label:{zh:'另一个字段',en:'Another field'},correct:false}]};
 const control=new El({'aria-describedby':'original-hint'});let focused=0,scrolled=0;
 control.focus=()=>{focused++;};control.scrollIntoView=options=>{assert.equal(options.behavior,'auto');scrolled++;};
 const options={language:'bi',findControl:id=>id==='field'?control:null};
 const host=new Host(UI.render(d,options)),cleanup=UI.bind(host,d,options);
 const descriptions=host.querySelectorAll('[data-tf-description]');
 assert.ok(control.getAttribute('aria-describedby').includes('original-hint'));
 assert.ok(control.getAttribute('aria-describedby').includes(descriptions[0].getAttribute('id')));
 const locate=host.querySelectorAll('[data-tf-locate]');assert.equal(locate[1].disabled,true);
 locate[0].onclick();assert.equal(focused,1);assert.equal(scrolled,1);assert.equal(control.value,'unchanged');
 const second=new Host(UI.render(d,options)),disposeSecond=UI.bind(second,d,{});
 assert.notEqual(descriptions[0].getAttribute('id'),second.first('[data-tf-description]').getAttribute('id'));
 cleanup();assert.equal(control.getAttribute('aria-describedby'),'original-hint');assert.equal(descriptions[0].getAttribute('id'),null);assert.equal(locate[0].onclick,null);disposeSecond();
});
test('B5 gradeStage receives conservative assistance without automatically exposing the full explanation',()=>{
 const d=actualDiagnostic(),meta=UI.evidence(d);
 assert.equal(meta.assistanceRevealed,true);assert.equal(meta.solutionRevealed,true);assert.equal(meta.fullReasonRevealed,false);
 const retry=B.gradeStage('independent',round,B.witness(round),meta);
 assert.equal(retry.applicationCompleted,true);assert.equal(retry.applicationCredit,false);assert.equal(retry.formalAssessmentStillRequired,true);
 const html=UI.render(d,{...meta,explanation:round.reason});assert.ok(!html.includes(round.reason.zh));assert.ok(html.includes('data-tf-reveal'));
 const fresh=actualDiagnostic(round,B.witness(round));
 assert.equal(B.gradeStage('independent',round,B.witness(round),UI.evidence(fresh)).applicationCredit,true,'unassisted grading remains B-owned');
 const restored=UI.render(fresh,{assistanceRevealed:true,explanation:round.reason});assert.ok(!restored.includes(round.reason.zh));assert.ok(restored.includes('不能据此标为独立掌握'));
});
test('refused or cancelled reveal requests never persist full-explanation visibility across refresh',async()=>{
 const d=actualDiagnostic(),options={explanation:round.reason};let saved={},shown=0;
 const host=new Host(UI.render(d,options));
 UI.bind(host,d,{...options,onAssistance:meta=>Object.assign(saved,meta),onReveal:meta=>{Object.assign(saved,meta);return false;},onExplanationShown:meta=>{shown++;Object.assign(saved,meta);}});
 await host.first('[data-tf-reveal]').onclick();assert.equal(saved.fullReasonRevealed,false);assert.equal(shown,0);
 assert.ok(!UI.render(d,{...options,...saved}).includes(round.reason.zh),'refreshed refused state stays hidden');
 const cancelled=new Host(UI.render(d,options));let release;
 const dispose=UI.bind(cancelled,d,{...options,onAssistance:meta=>Object.assign(saved,meta),onReveal:()=>new Promise(resolve=>{release=resolve;}),onExplanationShown:meta=>{shown++;Object.assign(saved,meta);}});
 const pending=cancelled.first('[data-tf-reveal]').onclick();await Promise.resolve();dispose();release(true);await pending;
 assert.equal(saved.fullReasonRevealed,false);assert.equal(shown,0);assert.ok(!UI.render(d,{...options,...saved}).includes(round.reason.zh));
 const accepted=new Host(UI.render(d,options));UI.bind(accepted,d,{...options,onAssistance:meta=>Object.assign(saved,meta),onReveal:()=>true,onExplanationShown:meta=>{shown++;Object.assign(saved,meta);}});
 await accepted.first('[data-tf-reveal]').onclick();assert.equal(saved.fullReasonRevealed,true);assert.equal(shown,1);
 assert.ok(UI.render(d,{...options,...saved}).includes(round.reason.zh),'only actually displayed reasoning restores as visible');
});
test('explicit reviewed item feedback explains actual B5 training/inference errors while keeping full reasoning hidden',()=>{
 const matrix=rounds.find(r=>r.id==='inspect-model-work'&&r.type==='matrix');assert.ok(matrix);
 const d=actualDiagnostic(matrix),before=JSON.stringify(d),opts={itemFeedback:true,language:'zh',explanation:matrix.reason};
 const detailed=UI.render(d,opts),generic=UI.render(d,{...opts,itemFeedback:false});
 assert.ok(detailed.includes('属于训练'));assert.ok(detailed.includes('属于推理'));
 assert.ok(!generic.includes('属于训练'));assert.ok(!generic.includes('属于推理'));
 assert.ok(detailed.includes('此项符合题目证据，保留当前操作'));
 assert.ok(!detailed.includes(matrix.reason.zh));assert.ok(detailed.includes('data-tf-reveal'));
 assert.equal(UI.evidence(d).solutionRevealed,true);assert.equal(UI.evidence(d).fullReasonRevealed,false);
 assert.equal(JSON.stringify(d),before);
 const english=UI.render(d,{...opts,language:'en'}),bilingual=UI.render(d,{...opts,language:'bi'});
 assert.ok(english.includes('training'));assert.ok(english.includes('inference'));assert.ok(!/[\u3400-\u9fff]/.test(english));assert.ok(bilingual.includes('tf-secondary'));
});
test('item explanations require literal true, escape authored prose and fall back safely when missing',()=>{
 const d={correct:false,checks:[{label:{zh:'项目',en:'Item'},correct:false,message:{zh:'<img src=x onerror="bad">',en:'<script>bad</script>'}},{label:{zh:'正确项',en:'Correct item'},correct:true,message:'DO_NOT_SHOW'},{label:{zh:'缺解释',en:'Missing explanation'},correct:false}]};
 assert.ok(!UI.render(d,{itemFeedback:'true'}).includes('&lt;img'));
 const html=UI.render(d,{itemFeedback:true,language:'bi'});assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('DO_NOT_SHOW'));
 assert.ok(html.includes('Check this item against the scenario evidence'));assert.ok(!html.includes('[object Object]'));
});
