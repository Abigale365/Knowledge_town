'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const T=require('../teaching-logic.v5.cjs'),{prepareFeedback}=require('../generate-feedback-v5.cjs'),W=require('../../contracts/runtime/task-workshop-engine.js');
const r=prepareFeedback();
test('screenshot error diagnoses A as inference and B as training without erasing correct input/output',()=>{
 const old=require('../templates/core-foundations.cjs').activity.rounds.find(r=>r.id==='repair-mapping'),entry=r.feedback.archivedEntries[0];
 const answer={values:{input:'history',output:'forecast',eventA:'train',eventB:'infer'}},d=T.diagnoseRound(old,answer,entry);
 assert.deepEqual(d.draft,answer);assert.deepEqual(d.checks.filter(c=>c.correct).map(c=>c.id),['input','output']);
 assert.match(d.checks.find(c=>c.id==='eventA').message.zh,/A 没有更新参数.*属于推理/);assert.match(d.checks.find(c=>c.id==='eventB').message.zh,/B 根据样本调整参数.*属于训练/);
 assert.equal(d.checks.find(c=>c.id==='eventA').reviewLinks[0].unitId,'1.1-lesson-4');assert.equal(d.checks.find(c=>c.id==='eventB').reviewLinks[0].unitId,'1.1-lesson-3');assert.equal(entry.archiveOnly,true);assert.equal(d.assistanceRevealed,true);
});
test('all active guided and independent rounds have item-level feedback, goals and source-linked review',()=>{
 assert.equal(r.feedback.activeEntries.length,323);assert.equal(new Set(r.feedback.activeEntries.map(e=>e.key)).size,323);
 for(const e of r.feedback.activeEntries){assert.ok(e.learnerGoals.length);assert.ok(Object.keys(e.checks).length);for(const check of Object.values(e.checks)){for(const lang of ['zh','en'])assert.ok(check.expectedExplanation[lang]);assert.ok(check.reviewLinks.length);for(const link of check.reviewLinks)assert.ok(link.unitId&&link.explanation&&link.evidence.length);}}
});
test('new conceptual matrix preserves right rows, explains parameter evidence and rejects mixed feedback',()=>{
 const s=require('../generated/legacy-teaching-logic.v5.json').chapters[0].sections[0],round=s.independentActivity.rounds.find(r=>r.id==='inspect-model-work'),entry=r.feedback.activeEntries.find(e=>e.key==='legacy/1.1/inspect-model-work');
 const answer={selected:['sensor:input','estimate:output','change:use','run:learn']},d=T.diagnoseRound(round,answer,entry);assert.deepEqual(d.draft,answer);assert.equal(W.grade(round,answer),false);
 assert.match(d.checks.find(c=>c.id==='run:learn').message.zh,/没有更新参数.*推理/);assert.match(d.checks.find(c=>c.id==='change:use').message.zh,/参数发生学习变化.*训练/);
 assert.ok(d.checks.filter(c=>c.id.startsWith('sensor:')||c.id.startsWith('estimate:')).every(c=>c.correct));
 assert.throws(()=>T.diagnoseRound({...round,id:'wrong'},answer,entry),/snapshot differs/);
});
test('replacement register retains historical rubrics and isolates obsolete drafts from new mastery',()=>{
 assert.equal(r.replacements.aib.length,70);assert.equal(r.replacements.legacy.length,13);assert.equal(r.replacements.policy.noWholeSaveReset,true);
 const old=r.replacements.legacy.find(s=>s.sectionId==='1.1');assert.notEqual(old.oldSignature,old.newSignature);
 assert.deepEqual(old.oldActivity.rounds.find(r=>r.id==='repair-mapping').fields.map(f=>f.expected),['history','forecast','infer','train']);
 assert.ok(!old.newActivity.rounds.some(r=>r.id==='repair-mapping'));assert.ok(old.newActivity.rounds.every(r=>!r.fields?.some(f=>typeof f.expected==='string')));
});
test('allocation feedback computes the actual excess and names the missing required item',()=>{
 const logic=require('../generated/teaching-logic.v5.json'),exercise=logic.sections.flatMap(s=>s.independentApplication.rounds).find(e=>e.round.type==='allocate'&&e.round.required?.length),round=exercise.round,entry=r.feedback.activeEntries.find(e=>e.roundHash===require('../../contracts').digest(JSON.stringify(round)));
 const all={selected:round.items.map(i=>i.id)},over=T.diagnoseRound(round,all,entry),cost=round.items.reduce((n,i)=>n+i.cost,0);assert.ok(cost>round.budget);assert.match(over.checks.find(c=>c.id==='budget').message.zh,new RegExp('当前总成本'+cost+'，预算'+round.budget+'，超出'+(cost-round.budget)));
 const absent=round.required[0],a={selected:round.required.filter(id=>id!==absent)},missing=T.diagnoseRound(round,a,entry);assert.ok(missing.checks.find(c=>c.id==='required').message.zh.includes(round.items.find(i=>i.id===absent).text.zh));assert.match(missing.checks.find(c=>c.id==='value').message.zh,/当前目标值.*还缺/);assert.deepEqual(missing.draft,a);
});
