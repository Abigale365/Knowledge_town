'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),C=require('../../contracts');
const {completeGaps,fingerprint}=require('../complete-gaps.cjs');
function input(){
 const baselineBundle=structuredClone(require('../../contracts/fixtures/materials.v1.json')),baselinePack=structuredClone(require('../../contracts/fixtures/knowledge.v1.json'));
 baselineBundle.revision=2;baselinePack.revision=2;baselinePack.materialRevision=2;
 for(const [id,text]of [['reviewed-primary-sources','Earlier synthetic source material.'],['reviewed-teaching-explanations','Earlier synthetic teaching material.']])baselineBundle.materials.push({id,name:id,text,contentHash:C.digest(text)});
 baselinePack.units[0].status='needs-review';baselinePack.gaps=[{objectiveId:'goal-1',missing:'Unverified synthetic restriction',requiredMaterial:'Direct synthetic test evidence'}];
 const sources=[{id:'synthetic-source',url:'https://example.org/synthetic',title:'Synthetic test source',excerpt:'A synthetic example of supporting source text.',verifiedAt:'2026-10-20'}];
 const audit=baselinePack.units.map(u=>({unitId:u.id,title:u.title,explanation:u.explanation,examples:[{zh:'明确的教学例子。',en:'Explicit teaching illustration.'}],misconceptions:[],status:u.status,prerequisiteIds:[],prerequisiteRationale:'Introductory case with no strict dependency.',rationale:'Synthetic test: prior review.',evidence:[{sourceId:'synthetic-source',quote:'synthetic example of supporting source text'}],missing:u.status==='supported'?[]:['Unverified synthetic restriction'],requiredMaterial:u.status==='supported'?[]:['Direct synthetic test evidence']}));
 for(const unit of baselinePack.units){const row=audit.find(r=>r.unitId===unit.id);unit.examples=structuredClone(row.examples);unit.misconceptions=[];unit.prerequisiteIds=[];}
 const baselineAnalysis={materialRevision:2,knowledgeRevision:2,summary:{supported:3,'needs-review':1},sources,audit};
 const row={...structuredClone(audit[0]),status:'supported',missing:[],requiredMaterial:[],previousMissing:audit[0].missing,searchNotes:['Synthetic test: verified the previously missing restriction.']};
 const manifest={inputInventoryHash:'raw-hash',baselineMaterialRevision:2,baselineKnowledgeRevision:2,outputRevision:3,baselineBundleHash:fingerprint(baselineBundle),baselinePackHash:fingerprint(baselinePack),baselineAnalysisHash:fingerprint(baselineAnalysis)};
 return {baselineBundle,baselinePack,baselineAnalysis,manifest,inventory:{units:baselinePack.units.map(u=>({id:u.id,example:'Original test example'}))},inputInventoryHash:'raw-hash',patches:[{units:[row],sources:[]}]};
}
test('gap completion increments revisions and preserves every prior source material',()=>{
 const a=input(),r=completeGaps(a);assert.equal(r.bundle.revision,3);assert.equal(r.pack.revision,3);assert.equal(r.pack.materialRevision,3);assert.equal(r.pack.gaps.length,0);assert.equal(r.analysis.gapResolution.length,1);assert.equal(r.analysis.summary.supported,4);
 for(const m of a.baselineBundle.materials)assert.deepEqual(r.bundle.materials.find(n=>n.id===m.id),m);
 assert.ok(r.bundle.materials.some(m=>m.id==='reviewed-primary-sources-r3'));assert.ok(r.bundle.materials.some(m=>m.id==='reviewed-teaching-explanations-r3'));assert.deepEqual(C.validateKnowledge(r.pack,r.bundle),[]);
 for(const prior of a.baselinePack.units.slice(1)){const after=r.pack.units.find(u=>u.id===prior.id);for(const key of ['title','category','explanation','examples','misconceptions','prerequisiteIds','objectiveIds','status','interaction'])assert.deepEqual(after[key],prior[key]);}
});
test('gap follow-up rejects omitted, duplicate or previously supported targets',()=>{
 const a=input();a.patches[0].units=[];assert.throws(()=>completeGaps(a),/Every previous unresolved/);
 const b=input();b.patches[0].units.push(b.patches[0].units[0]);assert.throws(()=>completeGaps(b),/duplicate gap patch/);
 const c=input();c.patches[0].units[0].unitId='unit-2';assert.throws(()=>completeGaps(c),/Unexpected/);
});
test('completion rejects mutated baseline, wrong gap history and missing research notes',()=>{
 const a=input();a.baselinePack.units[0].explanation.en+=' changed';assert.throws(()=>completeGaps(a),/fingerprint mismatch/);
 const b=input();b.patches[0].units[0].previousMissing=['another gap'];assert.throws(()=>completeGaps(b),/previous missing/);
 const c=input();c.patches[0].units[0].searchNotes=[];assert.throws(()=>completeGaps(c),/search notes/);
});
test('failure to find adequate evidence remains an explicit compilability blocker',()=>{
 const a=input(),row=a.patches[0].units[0];row.status='needs-review';row.missing=['Specific remaining restriction'];row.requiredMaterial=['Supply an applicable organizational decision'];
 const r=completeGaps(a);assert.equal(r.analysis.summary.supported,3);assert.equal(r.pack.gaps.length,1);assert.match(r.pack.gaps[0].missing,/Specific remaining/);assert.equal(r.analysis.gapResolution[0].status,'needs-review');assert.ok(C.validateKnowledge(r.pack,r.bundle).some(d=>d.code==='knowledge.gap'));
});
test('completion rejects material or analysis drift and source/material ID collisions',()=>{
 const a=input();a.baselineBundle.materials[0].text+=' changed';assert.throws(()=>completeGaps(a),/fingerprint mismatch/);
 const b=input();b.baselineAnalysis.summary.supported=99;assert.throws(()=>completeGaps(b),/fingerprint mismatch/);
 const c=input();c.patches[0].sources.push(c.baselineAnalysis.sources[0]);assert.throws(()=>completeGaps(c),/source ID already exists/);
 const d=input(),text='Synthetic preexisting revision-three ID.';d.baselineBundle.materials.push({id:'reviewed-primary-sources-r3',name:'Collision fixture',text,contentHash:C.digest(text)});d.manifest.baselineBundleHash=fingerprint(d.baselineBundle);assert.throws(()=>completeGaps(d),/duplicate-id/);
});
test('the real revision-three corpus resolves all 35 decisions without changing the 104 supported units',()=>{
 const bundle=require('../generated/materials.v3.json'),pack=require('../generated/knowledge.v3.json'),analysis=require('../generated/analysis.v3.json'),beforeBundle=require('../generated/materials.v2.json'),beforePack=require('../generated/knowledge.v2.json');
 assert.equal(bundle.revision,3);assert.equal(pack.revision,3);assert.equal(pack.schemaVersion,1);assert.equal(pack.units.length,139);assert.equal(pack.objectives.length,58);assert.equal(bundle.materials.length,7);assert.equal(new Set(bundle.materials.map(m=>m.id)).size,7);assert.equal(analysis.gapResolution.length,35);assert.equal(new Set(analysis.gapResolution.map(r=>r.unitId)).size,35);
 assert.deepEqual(C.validateKnowledge(pack,bundle),[]);assert.deepEqual(pack.gaps,[]);assert.ok(pack.units.every(u=>u.status==='supported'));
 for(const m of beforeBundle.materials)assert.deepEqual(bundle.materials.find(n=>n.id===m.id),m);
 for(const previous of beforePack.units.filter(u=>u.status==='supported')){const current=pack.units.find(u=>u.id===previous.id);for(const key of ['title','category','explanation','examples','misconceptions','prerequisiteIds','objectiveIds','status','interaction'])assert.deepEqual(current[key],previous[key]);}
 for(const row of analysis.gapResolution){assert.ok(row.previousMissing.length);assert.equal(row.status,'supported');assert.deepEqual(row.remainingMissing,[]);assert.ok(row.searchNotes.length);}
 for(const u of pack.units)assert.ok(u.evidence.every(e=>e.materialId==='reviewed-primary-sources-r3'));
 assert.ok(C.validateKnowledge(pack,beforeBundle).some(d=>d.code==='knowledge.stale'));
});
