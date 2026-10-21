'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),C=require('../../contracts'),D=require('..'),{enrichedAib}=require('../../course-compiler/enrich-aib.cjs');
const b=require('../generated/aib-blueprint.v3.json'),audit=require('../authored/review-v3.json');
test('revision 3 preserves original A inputs while adding independently scoped source evidence',()=>{
 const raw=require('../../knowledge/generated/knowledge.v3.json'),before=JSON.stringify(raw),result=enrichedAib();assert.equal(JSON.stringify(raw),before);assert.equal(result.provenance.sourceKnowledgeHash,C.digest(before));assert.notEqual(result.knowledgePack.id,raw.id);assert.deepEqual(C.validateKnowledge(result.knowledgePack,result.materialBundle),[]);
 for(const u of raw.units){const enriched=result.knowledgePack.units.find(v=>v.id===u.id);assert.deepEqual(enriched.explanation,u.explanation);assert.deepEqual(enriched.prerequisiteIds,u.prerequisiteIds);assert.ok(enriched.evidence.length>=u.evidence.length);}
});
test('all 139 teaching units have explicit semantic decisions bound to the frozen source and blueprint',()=>{
 const {knowledgePack}=enrichedAib();assert.equal(audit.decisions.length,139);assert.equal(audit.knowledgeHash,C.digest(JSON.stringify(knowledgePack)));assert.equal(audit.blueprintHash,C.digest(JSON.stringify(b)));
 for(const u of knowledgePack.units){const d=audit.decisions.find(d=>d.unitId===u.id);assert.equal(d.accepted,true);assert.equal(d.teachingHash,C.digest(JSON.stringify(b.units[u.id])));assert.equal(d.sourceBasis,C.digest(JSON.stringify({explanation:u.explanation,evidence:u.evidence})));}
 assert.ok(b.units['1.2.3-unit-2'].questions[0].a.includes('先回退'));assert.ok(b.units['3.3.1-unit-1'].activity.rounds[0].reason.zh.includes('最小化'));assert.ok(b.units['3.3.1-unit-1'].activity.rounds[0].reason.en.includes('Common error:'));
});
test('new reviewed teaching adapter rejects mixed historical inputs and modified source snapshots',async()=>{
 const {knowledgePack}=enrichedAib(),plan=await D.designLearning(knowledgePack,{design:D.createAibDesignAdapter({revision:3})});assert.equal(plan.knowledgeRevision,3);assert.equal(plan.revision,3);
 await assert.rejects(D.designLearning(require('../../knowledge/generated/knowledge.v1.json'),{design:D.createAibDesignAdapter({revision:3})}),/snapshot changed/);
 const changed=structuredClone(knowledgePack);changed.units[0].explanation.en+=' Changed';await assert.rejects(D.designLearning(changed,{design:D.createAibDesignAdapter({revision:3})}),/snapshot changed/);
});
