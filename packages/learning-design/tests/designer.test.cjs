'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const D=require('..'),pack=require('../../contracts/fixtures/knowledge.v1.json');
const blueprint=require('../examples/blueprint.v1.json');
const W=require('../../contracts/runtime/task-workshop-engine.js');
const build=(p=pack,b=blueprint)=>D.designLearning(p,{design:D.createDesignAdapter(b)});
function answer(r){
 if(r.type==='sort')return {placements:Object.fromEntries(r.items.map(i=>[i.id,i.target]))};
 if(r.type==='order')return {order:r.expected};
 if(r.fields)return {values:Object.fromEntries(r.fields.map(f=>[f.id,f.expected]))};
 return {selected:r.expected};
}
test('four independently enterable chapters, grounded bilingual questions, and executable thinking tasks',async()=>{
 const before=JSON.stringify(pack),plan=await build();
 assert.deepEqual(D.validateLearningPlan(pack,plan),[]);
 assert.equal(JSON.stringify(pack),before);
 const types=new Set();
 for(const ch of plan.chapters){
  assert.deepEqual(ch.sections[0].prerequisiteSectionIds,[]);
  for(const s of ch.sections){
   assert.ok(s.activity.brief.zh.includes('先阅读'));
   for(const r of s.activity.rounds){types.add(r.type);assert.equal(W.grade(r,answer(r)),true);assert.equal(W.grade(r,{}),false);assert.ok(r.reason.zh.includes('回看'));}
   for(const q of s.questions){assert.equal(q.en.wrong.length,q.wrong.length);assert.ok(pack.units.find(u=>u.id===q.unitIds[0]).evidence.some(e=>e.quote.includes(q.quote)));}
  }
 }
 assert.equal(types.size,5);
 const rounds=plan.chapters.flatMap(c=>c.sections.flatMap(s=>s.activity.rounds));
 assert.equal(W.grade(rounds.find(r=>r.type==='number'),{values:{cost:40,net:110,roi:150}}),false);
 assert.equal(W.grade(rounds.find(r=>r.type==='matrix'),{selected:['support:policy','support:logs','ops:logs']}),false);
 assert.equal(W.grade(rounds.find(r=>r.type==='order'),{order:['release','baseline','compare']}),false);
});
test('cross-chapter prerequisites are taught locally and question IDs/text stay unique',async()=>{
 const p=structuredClone(pack);p.units[3].prerequisiteIds=['unit-2'];
 const plan=await build(p),sections=plan.chapters[3].sections;
 assert.deepEqual(sections.map(s=>s.learnUnitIds[0]),['unit-2','unit-4']);
 assert.deepEqual(sections[0].prerequisiteSectionIds,[]);
 assert.deepEqual(sections[1].prerequisiteSectionIds,[sections[0].id]);
 assert.deepEqual(D.validateLearningPlan(p,plan),[]);
});
test('unknown content fails closed rather than borrowing fixture facts',async()=>{
 const b=structuredClone(blueprint);delete b.units['unit-3'];
 await assert.rejects(build(pack,b),/Missing knowledge or authored activity/);
});
test('invalid source quotes, translations and objective links are rejected',async()=>{
 const b=structuredClone(blueprint);b.units['unit-1'].questions[0].quote='并不存在的知识依据';
 await assert.rejects(build(pack,b),e=>e.diagnostics.some(d=>d.code==='plan.question-evidence'));
 const p=structuredClone(pack);p.objectives[0].unitIds=['missing'];await assert.rejects(build(p));
 const x=structuredClone(blueprint);x.units['unit-1'].activity.rounds[0].reason.en='';await assert.rejects(build(pack,x));
});
test('revision binding, cancellation and reusable immutable blueprint',async()=>{
 const p=structuredClone(pack);p.revision=2;assert.equal((await build(p)).knowledgeRevision,2);
 const ctrl=new AbortController();ctrl.abort();await assert.rejects(D.designLearning(pack,{design:D.createDesignAdapter(blueprint),signal:ctrl.signal}),{name:'AbortError'});
 const b=structuredClone(blueprint),design=D.createDesignAdapter(b);b.units={};assert.equal((await D.designLearning(pack,{design})).chapters.length,4);
});
test('changed knowledge explanations or evidence invalidate the fixed authored answers',async()=>{
 for(const key of ['explanation','evidence']){
  const p=structuredClone(pack);
  if(key==='explanation')p.units[0].explanation.zh+='（修订）';
  else p.units[0].evidence[0].locator='修订定位';
  await assert.rejects(build(p),/Knowledge changed/);
 }
});
