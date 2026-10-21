'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../../contracts'),D=require('..'),W=require('../../contracts/runtime/task-workshop-engine.js');
const {compileCourse}=require('../../course-compiler');
const pack=require('../../knowledge/generated/knowledge.v1.json'),bundle=require('../../knowledge/generated/materials.v1.json');
const plan=require('../generated/aib-learning-plan.v1.json'),blueprint=require('../generated/aib-blueprint.v1.json');
const audit=require('../generated/aib-unit-audit.v1.json');
function solution(r){
 if(r.type==='sort')return {placements:Object.fromEntries(r.items.map(i=>[i.id,i.target]))};
 if(r.type==='order')return {order:[...r.expected]};
 if(r.fields)return {values:Object.fromEntries(r.fields.map(f=>[f.id,f.expected]))};
 if(r.type==='allocate'){
  for(let mask=0;mask<2**r.items.length;mask++){
   const a={selected:r.items.filter((_,i)=>mask&(1<<i)).map(i=>i.id)};if(W.grade(r,a))return a;
  }throw Error('Unsolvable '+r.id);
 }
 return {selected:[...r.expected]};
}
function mistake(r){
 const a=solution(r);
 if(r.type==='sort'){const i=r.items[0];a.placements[i.id]=r.bins.find(b=>b.id!==i.target).id;}
 else if(r.type==='order')a.order.reverse();
 else if(r.fields){const f=r.fields[0];a.values[f.id]=typeof f.expected==='number'?f.expected+(f.tolerance||0)+10:'incorrect';}
 else if(r.type==='allocate')a.selected=[];
 else {const all=(r.options||r.rows.flatMap(row=>r.columns.map(c=>({id:row.id+':'+c.id})))).map(i=>i.id);a.selected=all.filter(id=>!r.expected.includes(id));}
 return a;
}
test('A actual pack: all 139 units and 58 objectives have authored bilingual assessment and feedback',()=>{
 assert.equal(pack.units.length,139);assert.equal(pack.objectives.length,58);
 assert.deepEqual(C.validateKnowledge(pack,bundle).filter(d=>d.severity==='error'),[]);
 assert.deepEqual(C.validateLearningPlan(pack,plan),[]);
 const covered=new Set(plan.chapters.flatMap(c=>c.sections.flatMap(s=>s.learnUnitIds)));
 assert.equal(covered.size,139);assert.equal(audit.length,139);
 for(const u of pack.units){
  assert.ok(covered.has(u.id));const spec=blueprint.units[u.id];
  for(const field of ['rationale','misconception'])for(const lang of ['zh','en'])assert.ok(spec[field][lang].trim());
  assert.ok(plan.chapters.some(c=>c.sections.some(s=>s.questions.some(q=>q.unitIds.includes(u.id)))));
  for(const q of spec.questions){assert.ok(u.evidence.some(e=>e.quote.includes(q.quote)));assert.equal(q.wrong.length,q.en.wrong.length);}
 }
 for(const o of pack.objectives)assert.ok(o.unitIds.every(id=>covered.has(id)));
});
test('every chapter has local ordered prerequisites and stays below frozen section/round limits',()=>{
 const units=new Map(pack.units.map(u=>[u.id,u]));
 for(const ch of plan.chapters){
  assert.ok(ch.sections.length<=20);assert.deepEqual(ch.sections[0].prerequisiteSectionIds,[]);
  const learned=new Set(),sections=new Set();
  for(const s of ch.sections){
   assert.ok(s.prerequisiteSectionIds.every(id=>sections.has(id)));
   for(const id of s.learnUnitIds){assert.ok(units.get(id).prerequisiteIds.every(req=>learned.has(req)),`${id}: missing local prerequisite`);learned.add(id);}
   assert.ok(s.activity.rounds.length<=20);assert.ok(s.learnUnitIds.length<=4);sections.add(s.id);
  }
 }
 const fourth=plan.chapters[3].sections.flatMap(s=>s.learnUnitIds);
 assert.ok(fourth.includes('3.3-lesson-1'));assert.equal(fourth.length,41);
});
test('all 142 activity instances have passing witnesses and reject meaningful wrong answers in both languages',()=>{
 const types=new Set();let count=0;
 for(const ch of plan.chapters)for(const s of ch.sections)for(const r of s.activity.rounds){
  count++;types.add(r.type);assert.equal(W.grade(r,solution(r)),true);assert.equal(W.grade(r,mistake(r)),false);
  if(r.type==='order')assert.notDeepEqual(r.items.map(i=>i.id),r.expected,'An ordering task must not open already solved');
  for(const lang of ['zh','en']){
   assert.ok(r.prompt[lang].trim());assert.ok(r.reason[lang].trim());
   assert.equal(W.grade({...r,prompt:{zh:r.prompt[lang],en:r.prompt[lang]}},solution(r)),true);
  }
  assert.match(r.reason.zh,/回看/);assert.match(r.reason.en,/Revisit|Review/);
 }
 assert.equal(count,142);assert.equal(types.size,7);
});
test('actual A→B→compiler preserves knowledge links, answers, language and executable workshop mastery',()=>{
 const course=compileCourse(pack,plan,{materialBundle:bundle});
 assert.equal(course.chapters.length,4);assert.equal(C.validateKnowledge(pack,bundle).filter(d=>d.severity==='warning').length,139);
 const cards=course.chapters.flatMap(c=>c.sections.flatMap(s=>s.lessons));assert.equal(cards.length,142);
 for(const ch of course.chapters)for(const s of ch.sections){
  const state={};assert.equal(W.mastered(state,s),false);
  for(const r of s.activity.rounds){assert.equal(W.submit(state,s,mistake(r)),false);assert.equal(W.submit(state,s,solution(r)),true);assert.ok(r.skills.every(id=>s.lessons.some(l=>l.sourceUnitId===id)));}
  assert.equal(W.mastered(state,s),true);assert.equal(W.validate(state,course),true);
  for(const q of s.questions){assert.ok(q.en.q);assert.equal(q.en.wrong.length,q.wrong.length);assert.ok(q.sourceUnitIds.every(id=>s.lessons.some(l=>l.sourceUnitId===id)));}
 }
});
test('injected full-pack adapter is deterministic and rejects changed knowledge or versions',async()=>{
 const actual=await D.designLearning(pack,{design:D.createAibDesignAdapter()});assert.deepEqual(actual,plan);
 for(const change of [p=>p.revision++,p=>p.units[0].explanation.zh+=' 修订']){
  const p=structuredClone(pack);change(p);await assert.rejects(D.designLearning(p,{design:D.createAibDesignAdapter()}),/snapshot changed/);
 }
 const ctrl=new AbortController();ctrl.abort();await assert.rejects(D.designLearning(pack,{design:D.createAibDesignAdapter(),signal:ctrl.signal}),{name:'AbortError'});
});
test('negative contracts reject missing unit checks, wrong evidence and missing translation',()=>{
 for(const [mutate,code]of [
  [p=>{p.chapters[0].sections[0].activity.rounds.pop();},'plan.activity-coverage'],
  [p=>{p.chapters[0].sections[0].questions[0].quote='这个引文不是关联单元的依据';},'plan.question-evidence'],
  [p=>{p.chapters[0].sections[0].activity.rounds[0].reason.en='';},'plan.activity']
 ]){const bad=structuredClone(plan);mutate(bad);assert.ok(C.validateLearningPlan(pack,bad).some(d=>d.code===code));}
});
test('runtime rejects a mixed teaching blueprint even when knowledge input is unchanged',async()=>{
 const original=blueprint.title.zh;
 try{
  blueprint.title.zh+=' 未配套修订';
  await assert.rejects(D.designLearning(pack,{design:D.createAibDesignAdapter()}),/reviewed output manifest/);
 }finally{blueprint.title.zh=original;}
});
module.exports={solution,mistake};
