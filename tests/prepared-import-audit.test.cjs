'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{compilePreparedCourse}=require('../apps/server/pipeline.cjs');
const input=()=>({materialBundle:structuredClone(require('../packages/contracts/fixtures/materials.v1.json')),knowledgePack:structuredClone(require('../packages/contracts/fixtures/knowledge.v1.json')),learningPlan:structuredClone(require('../packages/learning-design/examples/learning-plan.v1.json'))});
test('prepared import rejects copied objectives before invoking learning design and keeps candidate unchanged',async()=>{
 const x=input(),unit=x.knowledgePack.units[0],goal=x.knowledgePack.objectives.find(o=>unit.objectiveIds.includes(o.id));unit.explanation=structuredClone(goal.title);const before=JSON.stringify(x.knowledgePack),D=require('../packages/learning-design'),old=D.designLearning;let calls=0;
 D.designLearning=async()=>{calls++;throw Error('Design must not run');};try{await assert.rejects(()=>compilePreparedCourse(x),e=>e.diagnostics.some(d=>d.code==='candidate.objective-as-explanation')&&e.candidateGaps.length>0);assert.equal(calls,0);assert.equal(JSON.stringify(x.knowledgePack),before);}finally{D.designLearning=old;}
});
test('prepared import returns candidate warnings once without mutating knowledge status',async()=>{
 const x=input();x.knowledgePack.units[1].explanation={zh:'实际试点数据显示，这个项目的ROI为50%。',en:'Observed pilot data show that this project achieved an ROI of 50%.'};const before=JSON.stringify(x.knowledgePack),r=await compilePreparedCourse(x);const warnings=r.diagnostics.filter(d=>d.code==='candidate.case-as-observation');assert.equal(warnings.length,2);assert.equal(new Set(warnings.map(d=>d.path)).size,2);assert.equal(JSON.stringify(x.knowledgePack),before);assert.equal(r.course.chapters.length,4);
});
