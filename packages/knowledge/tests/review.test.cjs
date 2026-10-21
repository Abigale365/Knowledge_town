'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {buildReviewedCorpus,writeReviewedCorpus}=require('../review-corpus.cjs');
function input(){const baselineBundle=require('../../contracts/fixtures/materials.v1.json'),baselinePack=require('../../contracts/fixtures/knowledge.v1.json');return {baselineBundle,baselinePack,inventory:{units:baselinePack.units.map(u=>({id:u.id,example:'Existing teaching example',references:[]}))},inputInventoryHash:'hash',expectedInventoryHash:'hash',reviews:[{sources:[{id:'test-source',title:'Synthetic public test text',url:'https://example.org/test',excerpt:'A synthetic primary source excerpt for testing.',verifiedAt:'2026-10-20'}],units:baselinePack.units.map(u=>({unitId:u.id,explanation:u.explanation,examples:[{zh:'这是明确的教学例子。',en:'This is an explicitly authored teaching example.'}],misconceptions:[],status:'supported',rationale:'Synthetic test: supporting source checked.',prerequisiteIds:[],prerequisiteRationale:'Independent introductory case.',evidence:[{sourceId:'test-source',quote:'synthetic primary source excerpt'}],missing:[],requiredMaterial:[]}))}]};}
test('review gate rejects stale, missing and duplicate audit records',()=>{
 const a=input();a.expectedInventoryHash='stale';assert.throws(()=>buildReviewedCorpus(a),/stale/);
 const b=input();b.reviews[0].units.pop();assert.throws(()=>buildReviewedCorpus(b),/every inventory/);
 const c=input();c.reviews[0].units.push(c.reviews[0].units[0]);assert.throws(()=>buildReviewedCorpus(c),/Duplicate review/);
});
test('supported cannot be self-cited, quoted from the wrong source or conceal a known gap',()=>{
 const a=input();a.reviews[0].units[0].evidence=[];assert.throws(()=>buildReviewedCorpus(a),/independent evidence/);
 const b=input();b.reviews[0].units[0].evidence[0].quote='not in the source';assert.throws(()=>buildReviewedCorpus(b),/source mismatch/);
 const c=input();c.reviews[0].units[0].missing=['Unverified restriction'];assert.throws(()=>buildReviewedCorpus(c),/unresolved core gaps/);
});
test('review produces new revisions with explicit mapped-unit gaps and preserves original material hashes',()=>{
 const a=input(),r=a.reviews[0].units[0];r.status='gap';r.evidence=[];r.missing=['Need independent body evidence'];r.requiredMaterial=['Supply primary text with this definition'];
 const b=buildReviewedCorpus(a);assert.equal(b.bundle.revision,2);assert.equal(b.pack.revision,2);assert.equal(b.pack.gaps.length,1);assert.equal(b.pack.gaps[0].objectiveId,'goal-1');assert.equal(b.analysis.summary.supported,3);assert.equal(b.analysis.summary.gap,1);assert.equal(b.bundle.materials[0].contentHash,a.baselineBundle.materials[0].contentHash);assert.ok(b.analysis.diagnostics.every(d=>d.code==='knowledge.gap'));
});
test('review cannot silently drop original examples or create cyclic prerequisites',()=>{
 const a=input();a.reviews[0].units[0].examples=[];assert.throws(()=>buildReviewedCorpus(a),/example silently dropped/);
 const b=input();b.reviews[0].units[0].prerequisiteIds=['unit-2'];b.reviews[0].units[1].prerequisiteIds=['unit-1'];assert.ok(buildReviewedCorpus(b).analysis.diagnostics.some(d=>d.code==='knowledge.cycle'));
});
test('all 139 real units have traceable bilingual audits, reviewed edges and explicit unresolved gaps',()=>{
 const b=require('../generated/materials.v2.json'),p=require('../generated/knowledge.v2.json'),a=require('../generated/analysis.v2.json'),old=require('../generated/materials.v1.json'),C=require('../../contracts');
 assert.equal(p.schemaVersion,1);assert.equal(p.revision,2);assert.equal(b.revision,2);assert.equal(p.units.length,139);assert.equal(a.audit.length,139);assert.equal(new Set(a.audit.map(r=>r.unitId)).size,139);assert.equal(p.objectives.length,58);
 for(const m of old.materials)assert.equal(b.materials.find(n=>n.id===m.id).contentHash,m.contentHash);
 for(const u of p.units){const row=a.audit.find(r=>r.unitId===u.id);assert.ok(row.rationale.trim());assert.ok(row.prerequisiteRationale.trim());assert.deepEqual(u.prerequisiteIds,row.prerequisiteIds);assert.equal(u.status,row.status);assert.ok(u.explanation.zh&&u.explanation.en);if(u.status==='supported'){assert.ok(row.evidence.length);assert.deepEqual(row.missing,[]);assert.ok(u.evidence.every(e=>e.materialId==='reviewed-primary-sources'));}else{assert.ok(row.missing.length&&row.requiredMaterial.length);assert.ok(p.gaps.some(g=>g.missing.startsWith(u.id+':')));}}
 assert.equal(p.gaps.length,p.units.filter(u=>u.status!=='supported').length);
 const errors=C.validateKnowledge(p,b).filter(d=>d.severity==='error');assert.ok(errors.every(d=>d.code==='knowledge.gap'));assert.ok(errors.length>0,'Unresolved gaps must prevent a misleading ready-to-compile claim');
 assert.ok(C.validateKnowledge(p,old).some(d=>d.code==='knowledge.stale'));
});
test('mismatched baseline pack and manifest revisions are rejected',()=>{
 const a=structuredClone(input());a.baselinePack.materialBundleId='unrelated-bundle';assert.throws(()=>buildReviewedCorpus(a),/knowledge.stale/);
 const b=structuredClone(input());b.baselinePack.materialRevision=999;assert.throws(()=>buildReviewedCorpus(b),/knowledge.stale/);
 const c=structuredClone(input());c.baselineBundle.revision=77;assert.throws(()=>buildReviewedCorpus(c),/Baseline revision/);
 const d=structuredClone(input());d.baselinePack.revision=88;assert.throws(()=>buildReviewedCorpus(d),/Baseline revision/);
});
test('a cyclic candidate is rejected before any existing artifact is overwritten',()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),out=fs.mkdtempSync(path.join(os.tmpdir(),'knowledge-audit-test-')),file=path.join(out,'knowledge.v2.json');
 fs.writeFileSync(file,'existing reviewed artifact');
 try{const a=input();a.reviews[0].units[0].prerequisiteIds=['unit-2'];a.reviews[0].units[1].prerequisiteIds=['unit-1'];const r=buildReviewedCorpus(a);assert.throws(()=>writeReviewedCorpus(r,out),/knowledge.cycle/);assert.equal(fs.readFileSync(file,'utf8'),'existing reviewed artifact');assert.deepEqual(fs.readdirSync(out),['knowledge.v2.json']);}
 finally{fs.unlinkSync(file);fs.rmdirSync(out);}
});
