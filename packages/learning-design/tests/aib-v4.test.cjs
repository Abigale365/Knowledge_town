'use strict';
const fs=require('node:fs'),path=require('node:path'),test=require('node:test'),assert=require('node:assert/strict');
const C=require('../../contracts'),W=require('../../contracts/runtime/task-workshop-engine.js');
const {enrichedAib}=require('../../course-compiler/enrich-aib.cjs');
const {createLearningFlow}=require('..');
const root=path.join(__dirname,fs.existsSync(path.join(__dirname,'../generated/aib-learning-plan.v4.json'))?'../generated':'../candidates');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const plan=read('aib-learning-plan.v4.json'),map=read('aib-teaching-map.v4.json'),audit=read('concentration-audit.v4.json'),manifest=read('aib-manifest.v4.json');
const {knowledgePack:pack,materialBundle:bundle}=enrichedAib();
function solution(r){
 if(r.type==='sort')return {placements:Object.fromEntries(r.items.map(i=>[i.id,i.target]))};
 if(r.type==='order')return {order:[...r.expected]};
 if(r.fields)return {values:Object.fromEntries(r.fields.map(f=>[f.id,f.expected]))};
 if(r.type==='allocate'){for(let mask=0;mask<2**r.items.length;mask++){const answer={selected:r.items.filter((_,i)=>mask&(1<<i)).map(i=>i.id)};if(W.grade(r,answer))return answer;}throw Error('Unsolvable allocation');}
 return {selected:[...r.expected]};
}
function wrong(r){
 const a=solution(r);
 if(r.type==='sort'){const first=r.items[0];a.placements[first.id]=r.bins.find(b=>b.id!==first.target).id;}
 else if(r.type==='order')a.order.reverse();
 else if(r.fields){const f=r.fields[0];a.values[f.id]=typeof f.expected==='number'?f.expected+(f.tolerance||0)+100:'wrong-code';}
 else if(r.type==='allocate')a.selected=[];
 else a.selected=[];
 return a;
}
const make=()=>createLearningFlow({knowledgePack:pack,plan,teachingMap:map});
test('v4 audits every section and removes single-control sections without modifying sources or questions',()=>{
 const prior=require('../generated/aib-blueprint.v3.json'),current=read('aib-blueprint.v4.json');
 assert.deepEqual(C.validateKnowledge(pack,bundle),[]);assert.deepEqual(C.validateLearningPlan(pack,plan),[]);
 assert.equal(plan.revision,4);assert.equal(plan.knowledgeRevision,3);assert.equal(audit.before.length,38);assert.equal(audit.after.length,38);
 assert.deepEqual(audit.summary,{beforeSingleControl:8,afterSingleControl:0,beforeTripleRepeat:11,afterTripleRepeat:0});
 assert.equal(audit.changes.length,33);
 for(const u of pack.units){assert.deepEqual(current.units[u.id].questions,prior.units[u.id].questions);assert.equal(current.units[u.id].knowledgeBasis,prior.units[u.id].knowledgeBasis);}
 const first=plan.chapters[0].sections[0];assert.deepEqual(first.activity.rounds.map(r=>r.type),['sort','choose','order','edit']);
 assert.equal(first.activity.kind,'model-workbench');assert.equal(new Set(audit.after.map(s=>s.kind)).size,38);
});
test('every AIB/legacy section describes distinct knowledge objects, operation duties and executable round references',()=>{
 let count=0;
 for(const [ci,ch]of map.chapters.entries())for(const s of ch.sections){
  count++;assert.equal(ch.entryRequires.length,0);assert.equal(s.objects.filter(o=>o.role==='knowledge-reference').length,s.freeBrowseUnitIds.length);
  for(const o of s.objects.filter(o=>o.role==='knowledge-reference')){assert.equal(o.collection,'optional');assert.equal(o.countsAsMastery,false);assert.ok(o.sourceEvidence.length);}
  const actual=plan.chapters[ci].sections.find(x=>x.id===s.id);
  for(const step of s.steps.filter(x=>x.stage==='apply')){const object=s.objects.find(o=>o.id===step.objectId);const round=actual.activity.rounds.find(r=>r.id===step.roundId);assert.equal(object.control,round.type);assert.deepEqual(step.prompt,round.prompt);assert.deepEqual(step.feedback,round.reason);assert.ok(step.requiresStepIds.length);}
 }
 assert.equal(count,38);
 const legacy=read('legacy-teaching-map.v4.json');assert.equal(legacy.chapters.flatMap(c=>c.sections).length,13);
 const core=legacy.chapters[0].sections[0];assert.equal(core.sourceUnitIds.length,22);assert.equal(core.activity.rounds.length,8);assert.notEqual(core.activity.kind,'match');
 for(const ch of legacy.chapters)for(const s of ch.sections){assert.equal(W.validPlan(s.activity),true);assert.equal(s.freeBrowse.countsAsMastery,false);assert.equal(s.objects.filter(o=>o.role==='required-application').length,s.activity.rounds.length);}
});
test('free browsing later sections is permitted but never unlocks required activity or formal practice',()=>{
 const flow=make(),state=flow.fresh(),chapter=map.chapters[0],last=chapter.sections.at(-1),later=last.freeBrowseUnitIds[0];
 assert.equal(flow.browse(state,chapter.id,later),true);assert.equal(flow.canBrowse(chapter.id,later),true);
 assert.equal(flow.gate(state,last.steps[0].id).unlocked,false);assert.equal(flow.confirmFoundation(state,last.steps[0].id).accepted,false);
 const step=last.steps.find(x=>x.stage==='apply'),round=plan.chapters[0].sections.at(-1).activity.rounds[0];
 assert.equal(flow.submit(state,step.id,solution(round)).accepted,false);assert.equal(flow.chapterReadyForPractice(state,chapter.id),false);
 for(const ch of map.chapters)assert.equal(flow.gate(state,ch.sections[0].steps[0].id).unlocked,true);
 assert.equal(flow.validate(state),true);
});
test('all 145 required operations enforce prerequisite gates, reject wrong answers and preserve bilingual source feedback',()=>{
 const flow=make(),state=flow.fresh();let count=0;
 for(const [ci,ch]of map.chapters.entries()){
  for(const [si,s]of ch.sections.entries()){
   for(const id of s.freeBrowseUnitIds)flow.browse(state,ch.id,id);
   for(const step of s.steps){
    assert.equal(flow.gate(state,step.id).unlocked,true);
    if(step.stage==='foundation')assert.equal(flow.confirmFoundation(state,step.id).accepted,true);
    else{
     const r=plan.chapters[ci].sections[si].activity.rounds.find(x=>x.id===step.roundId);
     assert.equal(W.grade(r,wrong(r)),false);assert.equal(flow.submit(state,step.id,wrong(r)).accepted,false);assert.equal(flow.hasPassed(state,step.id),false);
     assert.equal(flow.submit(state,step.id,solution(r)).accepted,true);count++;
     for(const lang of ['zh','en']){assert.ok(r.prompt[lang]);assert.ok(r.reason[lang]);}
    }
   }
  }
  assert.equal(flow.chapterReadyForPractice(state,ch.id),true);
 }
 assert.equal(count,145);assert.equal(flow.validate(JSON.parse(JSON.stringify(state))),true);
 const broken=structuredClone(state);delete broken.answers[Object.keys(broken.answers)[0]];assert.equal(flow.validate(broken),false);
});
test('tampered dependency maps, unfamiliar versions and old progress cannot silently reuse mastery',()=>{
 for(const change of [m=>m.chapters[0].practiceRequiresStepIds=[],m=>m.chapters[0].sections[1].steps[0].requiresStepIds=[],m=>m.revision=999,m=>m.schemaVersion=999]){
  const bad=structuredClone(map);change(bad);assert.throws(()=>createLearningFlow({knowledgePack:pack,plan,teachingMap:bad}),/match|changed/);
 }
 const flow=make(),state=flow.fresh();state.binding='revision-3';assert.equal(flow.validate(state),false);assert.throws(()=>flow.browse(state,map.chapters[0].id,map.chapters[0].freeBrowseUnitIds[0]),/Stale/);
 const badPlan=structuredClone(plan);badPlan.revision++;assert.throws(()=>createLearningFlow({knowledgePack:pack,plan:badPlan,teachingMap:map}),/match/);
});
test('legacy 1.1 covers all six objectives and 22 focused units with meaningful passing and failing operations',()=>{
 const {activity,roundUnitIds}=require('../templates/core-foundations.cjs');
 assert.equal(W.validPlan(activity),true);assert.equal(new Set(activity.rounds.map(r=>r.type)).size,5);
 assert.deepEqual([...new Set(activity.rounds.flatMap(r=>r.skills))].sort(),['1.1.1','1.1.2','1.1.3','1.1.4','1.1.5','1.1.6']);
 assert.equal(new Set(Object.values(roundUnitIds).flat()).size,22);
 for(const r of activity.rounds){assert.equal(W.grade(r,solution(r)),true);assert.equal(W.grade(r,wrong(r)),false);assert.ok(roundUnitIds[r.id].every(id=>pack.units.some(u=>u.id===id)));}
 assert.equal(manifest.teachingMap.hash,C.digest(JSON.stringify(map)));
});
test('reviewed v4 adapter reproduces the final plan while legacy v3 and sources remain isolated',async()=>{
 const D=require('..'),review=require('../authored/review-v4.json'),b=read('aib-blueprint.v4.json');
 assert.deepEqual(await D.designLearning(pack,{design:D.createAibDesignAdapter({revision:4})}),plan);
 const v3=await D.designLearning(pack,{design:D.createAibDesignAdapter({revision:3})});assert.equal(v3.revision,3);assert.notEqual(C.digest(JSON.stringify(v3)),manifest.output.hash);
 assert.equal(review.knowledgeHash,manifest.input.hash);assert.equal(review.teachingMapHash,manifest.teachingMap.hash);assert.equal(review.legacyMapHash,manifest.legacyMap.hash);
 assert.equal(review.decisions.length,139);assert.equal(review.decisions.filter(d=>d.mode==='v4-content-reviewed').length,33);
 for(const d of review.decisions){assert.equal(d.accepted,true);assert.equal(d.teachingHash,C.digest(JSON.stringify(b.units[d.unitId])));}
 const ctrl=new AbortController();ctrl.abort();await assert.rejects(D.designLearning(pack,{design:D.createAibDesignAdapter({revision:4}),signal:ctrl.signal}),{name:'AbortError'});
});
test('flow clones its inputs and rejects malformed progress rather than accepting an empty answer array',()=>{
 const mutable=structuredClone(map),flow=createLearningFlow({knowledgePack:pack,plan,teachingMap:mutable});mutable.chapters[0].practiceRequiresStepIds=[];
 const state=flow.fresh();assert.equal(flow.chapterReadyForPractice(state,map.chapters[0].id),false);
 const broken=structuredClone(state);broken.answers=[];assert.equal(flow.validate(broken),false);
});
