'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../../contracts'),W=require('../../contracts/runtime/task-workshop-engine.js');
const T=require('../teaching-logic.v5.cjs'),{prepare}=require('../generate-aib-v5.cjs');
const result=prepare(),hash=x=>C.digest(JSON.stringify(x));
function wrong(r){const a=T.witness(r);if(r.type==='sort'){const i=r.items[0];a.placements[i.id]=r.bins.find(b=>b.id!==i.target).id;}else if(r.type==='order')a.order.reverse();else if(r.fields){const f=r.fields[0];a.values[f.id]=f.expected+100+(f.tolerance||0);}else a.selected=[];return a;}
test('all 139 knowledge units, source bindings and formal questions remain frozen while goals are audited',async()=>{
 const r=await result,old=require('../generated/aib-blueprint.v4.json');
 assert.equal(r.audits.length,139);assert.equal(new Set(r.audits.map(a=>a.unitId)).size,139);
 assert.deepEqual(C.validateKnowledge(r.pack,r.bundle),[]);assert.deepEqual(C.validateLearningPlan(r.pack,r.plan),[]);
 assert.equal(r.pack.revision,3);assert.equal(r.plan.revision,5);
 for(const u of r.pack.units){assert.equal(r.blueprint.units[u.id].knowledgeBasis,old.units[u.id].knowledgeBasis);assert.deepEqual(r.blueprint.units[u.id].questions,old.units[u.id].questions);const a=r.audits.find(a=>a.unitId===u.id);for(const k of ['reason','learnerGoal','thinking','understandingEvidence','misconception'])for(const l of ['zh','en'])assert.ok(a[k][l].trim());}
});
test('38 section chains and 13 legacy chains have executable new applications without string-copy answers',async()=>{
 const r=await result;assert.equal(r.logic.sections.length,38);assert.equal(r.legacy.chapters.flatMap(c=>c.sections).length,13);
 let count=0;
 for(const s of r.logic.sections){assert.equal(s.demonstration.countsAsMastery,false);assert.equal(s.guidedPractice.countsAsMastery,false);assert.equal(s.formalAssessment.passThreshold,0.9);assert.equal(s.browsing.countsAsFound,false);
  const ids=s.necessaryKnowledge.map(u=>u.unitId);for(const e of [s.guidedPractice,...s.independentApplication.rounds]){assert.ok(e.round.unitIds.every(id=>ids.includes(id)));assert.equal(W.grade(e.round,e.initialState),false);assert.equal(W.grade(e.round,T.witness(e.round)),true);assert.equal(W.grade(e.round,wrong(e.round)),false);assert.ok(!e.round.fields?.some(f=>typeof f.expected==='string'));assert.equal(e.grading.displayWitnessBeforeAttempt,false);count++;}
  for(const e of s.independentApplication.rounds)assert.ok(e.hints.every(h=>h.kind==='knowledge-reference'&&!h.text));
 }
 for(const c of r.legacy.chapters){assert.deepEqual(c.entryRequires,[]);for(const s of c.sections){assert.equal(W.validPlan(s.independentActivity),true);assert.ok(s.independentActivity.title.en!==s.independentActivity.title.zh);for(const round of s.independentActivity.rounds){assert.equal(W.grade(round,T.initialAnswer(round)),false);assert.equal(W.grade(round,T.witness(round)),true);assert.equal(W.grade(round,wrong(round)),false);assert.ok(s.roundUnitIds[round.id].every(id=>s.necessaryKnowledgeIds.includes(id)));count++;}}}
 assert.ok(count>=323);assert.equal(r.legacy.chapters[0].sections[0].independentActivity.rounds.length,8);
});
test('demonstration, assisted correction and independent evidence have distinct meaning',async()=>{
 const r=(await result).logic.sections[0].independentApplication.rounds[0].round,a=T.witness(r);
 assert.equal(T.gradeStage('demonstration',r,a).applicationCredit,false);
 assert.equal(T.gradeStage('guided',r,a).applicationCredit,false);
 assert.equal(T.gradeStage('independent',r,a).applicationCredit,true);
 const assisted=T.gradeStage('independent',r,a,{solutionRevealed:true});assert.equal(assisted.applicationCompleted,true);assert.equal(assisted.applicationCredit,false);assert.equal(assisted.formalAssessmentStillRequired,true);
});
test('item diagnostics retain correct work and identify the failing item without replacing a draft',async()=>{
 const r=(await result).blueprint.units['1.1-lesson-2'].activity.rounds.find(r=>r.type==='sort'),a=T.witness(r),first=r.items[0];
 a.placements[first.id]=r.bins.find(b=>b.id!==first.target).id;
 const before=structuredClone(a),d=T.diagnoseRound(r,a);assert.deepEqual(a,before);assert.deepEqual(d.draft,a);assert.equal(d.checks.filter(c=>!c.correct).length,1);assert.equal(d.checks.find(c=>!c.correct).id,first.id);assert.equal(d.assistanceRevealed,true);assert.equal(d.fullReasonRevealed,false);assert.equal(d.preserveCorrectOperations,true);
});
test('discovery is necessary for collection; filing survives removing a favorite',()=>{
 assert.equal(T.canFavorite('a',{foundIds:[]}),false);assert.equal(T.canFavorite('a',{foundIds:['a']}),true);
 assert.deepEqual(T.inventory({favoriteIds:['a','b'],filedIds:['a']}),{carried:['b'],filed:['a']});
 assert.deepEqual(T.inventory({favoriteIds:[],filedIds:['a']}),{carried:[],filed:['a']});
});
test('incomplete ordering and malformed selections never show all-green diagnostics',async()=>{
 const r=await result,rounds=r.logic.sections.flatMap(s=>s.independentApplication.rounds.map(e=>e.round));
 const order=rounds.find(r=>r.type==='order'),choose=rounds.find(r=>r.type==='choose'),sort=rounds.find(r=>r.type==='sort');
 for(const [round,answer]of [[order,{order:[]}],[order,{order:[order.expected[0]]}],[choose,{selected:[...choose.expected,choose.expected[0]]}],[sort,{placements:{...T.witness(sort).placements,unknown:'x'}}]]){const d=T.diagnoseRound(round,answer);assert.equal(d.correct,false);assert.ok(d.checks.some(c=>!c.correct));assert.equal(d.assistanceRevealed,true);assert.deepEqual(d.draft,answer);}
});
test('topic micro-practice follows knowledge dependencies before whole-section reading without collection gates',async()=>{
 const r=await result,{canOfferMicro}=require('../authored/micro-checkpoints.v5.cjs');assert.equal(r.micro.aib.length,38);assert.equal(r.micro.legacy.length,13);
 const core=r.micro.legacy.find(s=>s.sectionId==='1.1'),first=core.checkpoints[0];assert.equal(core.checkpoints.length,6);assert.equal(first.requiredReviewedKnowledgeIds.length,2);assert.equal(canOfferMicro(first,{reviewedUnitIds:[]}),false);assert.equal(canOfferMicro(first,{reviewedUnitIds:first.requiredReviewedKnowledgeIds}),true);
 for(const s of [...r.micro.aib,...r.micro.legacy])for(const m of s.checkpoints){assert.equal(m.countsAsMastery,false);assert.equal(m.requiredForFormalUnlock,false);assert.equal(m.countsAsCollection,false);const section=r.logic.sections.find(s=>s.id===m.exerciseRef.sectionId);assert.ok(section);assert.deepEqual(m.topicKnowledgeIds,section.guidedPractice.round.unitIds);for(const id of m.requiredReviewedKnowledgeIds){const u=r.pack.units.find(u=>u.id===id);assert.ok(u);assert.ok(u.prerequisiteIds.every(p=>m.requiredReviewedKnowledgeIds.includes(p)));}}
});
test('reviewed publication and adapter reject altered source snapshots and preserve prior versions',async()=>{
 const r=await result,dir=path.join(__dirname,'../generated');if(!fs.existsSync(path.join(dir,'aib-manifest.v5.json')))return;
 const manifest=require('../generated/aib-manifest.v5.json'),review=require('../authored/review-v5.json');assert.equal(review.accepted,true);
 for(const k of ['input','output','blueprintHash','logicHash','legacyHash','unitAuditHash','sectionAuditHash','microHash'])assert.equal(hash(review.binding[k]),hash(manifest[k]));
 assert.equal(hash(r.plan),manifest.output.hash);assert.equal(hash(r.logic),manifest.logicHash);assert.equal(hash(r.legacy),manifest.legacyHash);
 const {createAibDesignAdapter}=require('..'),adapter=createAibDesignAdapter({revision:5});assert.deepEqual(await adapter(r.pack),r.plan);
 const changed=structuredClone(r.pack);changed.units[0].title.zh+='changed';await assert.rejects(adapter(changed),/snapshot changed/);
 for(const revision of [1,3,4])assert.equal(typeof createAibDesignAdapter({revision}),'function');
});
