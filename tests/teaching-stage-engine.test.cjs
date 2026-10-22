'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),W=require('../packages/contracts/runtime/task-workshop-engine.js'),Stages=require('../apps/game/src/teaching-stage-engine.js'),B=require('../packages/learning-design/teaching-logic.v5.cjs');
test('B5 requires foundations, demonstration and guided work before independent applications',()=>{
 const e=require('../scripts/teaching-catalog-v5.cjs').catalog().legacy,f=Stages.create(e),p=f.fresh(),s={workshops:{},sealed:[],submitted:[]},sec=e.course.chapters[0].sections[0],policy=f.section(sec.id);
 assert.equal(f.ready(p,s,sec.id),false);for(const l of sec.lessons){p.viewed.push(l.id);const step=f.foundation(sec.id,l.id);assert.ok(f.gate(p,s,step.id));p.foundations.push(step.id);}
 assert.ok(f.ready(p,s,sec.id));const apply=f.application(sec.id,sec.activity.rounds[0].id);assert.equal(f.gate(p,s,apply.id),false);
 p.demonstrations.push(sec.id);assert.equal(f.gate(p,s,apply.id),false);p.guided[sec.id]={completed:true,answer:B.witness(policy.policy.guidedPractice.round)};assert.ok(f.gate(p,s,apply.id));
 for(const r of sec.activity.rounds){assert.ok(f.gate(p,s,f.application(sec.id,r.id).id));assert.ok(W.submit(s,sec,B.witness(r)));}assert.ok(f.complete(p,s,sec.id));assert.ok(f.validate(p,s));
 p.demonstrations=[];assert.equal(f.validate(p,s),false);assert.equal(f.complete(p,s,sec.id),false);
});
test('both full B5 courses retain independent chapters, ordered stages and valid completed saves',()=>{
 for(const entry of Object.values(require('../scripts/teaching-catalog-v5.cjs').catalog())){
  const f=Stages.create(entry),p=f.fresh(),s={workshops:{},sealed:[],submitted:[]};let rounds=0;
  for(const [ci,ch]of entry.course.chapters.entries()){
   for(const sec of ch.sections){const item=f.section(sec.id);assert.ok(f.gate(p,s,f.foundation(sec.id,sec.lessons[0].id).id));for(const l of sec.lessons){p.viewed.push(l.id);p.foundations.push(f.foundation(sec.id,l.id).id);}p.demonstrations.push(sec.id);p.guided[sec.id]={completed:true,answer:B.witness(item.policy.guidedPractice.round)};
    for(const r of sec.activity.rounds){assert.ok(f.gate(p,s,f.application(sec.id,r.id).id));assert.ok(W.submit(s,sec,B.witness(r)));rounds++;}assert.ok(f.complete(p,s,sec.id));s.sealed.push(sec.id);
   }s.submitted.push(ci);
  }assert.ok(f.validate(p,s));assert.equal(rounds,entry.course.pipeline.knowledgePackId==='legacy-knowledge'?131:154);
 }
});
