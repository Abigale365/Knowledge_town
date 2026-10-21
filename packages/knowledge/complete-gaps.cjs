'use strict';
const C=require('../contracts'),{buildReviewedCorpus,writeReviewedCorpus}=require('./review-corpus.cjs');
const fingerprint=value=>C.digest(JSON.stringify(value));
function completeGaps({baselineBundle,baselinePack,baselineAnalysis,inventory,inputInventoryHash,manifest,patches}){
 if(fingerprint(baselineBundle)!==manifest.baselineBundleHash||fingerprint(baselinePack)!==manifest.baselinePackHash||fingerprint(baselineAnalysis)!==manifest.baselineAnalysisHash)throw Error('Gap review baseline fingerprint mismatch');
 if(baselineAnalysis.materialRevision!==baselineBundle.revision||baselineAnalysis.knowledgeRevision!==baselinePack.revision)throw Error('Gap review analysis revision mismatch');
 const priorUnits=new Map(baselinePack.units.map(u=>[u.id,u])),auditIds=new Set();
 for(const row of baselineAnalysis.audit){const unit=priorUnits.get(row.unitId);if(!unit||auditIds.has(row.unitId)||unit.status!==row.status||['explanation','examples','misconceptions','prerequisiteIds'].some(k=>fingerprint(unit[k])!==fingerprint(row[k])))throw Error('Baseline audit does not match the knowledge unit: '+row.unitId);auditIds.add(row.unitId);}
 if(auditIds.size!==priorUnits.size)throw Error('Baseline audit coverage is incomplete');
 const pending=baselineAnalysis.audit.filter(r=>r.status!=='supported'),expected=new Map(pending.map(r=>[r.unitId,r])),changes=new Map(),sources=new Map(baselineAnalysis.sources.map(s=>[s.id,s]));
 for(const patch of patches){for(const row of patch.units){if(!expected.has(row.unitId)||changes.has(row.unitId))throw Error('Unexpected or duplicate gap patch: '+row.unitId);if(JSON.stringify(row.previousMissing)!==JSON.stringify(expected.get(row.unitId).missing))throw Error('Gap patch does not identify the previous missing material: '+row.unitId);if(!row.searchNotes||(Array.isArray(row.searchNotes)?!row.searchNotes.length:typeof row.searchNotes!=='string'||!row.searchNotes.trim()))throw Error('Gap patch needs search notes: '+row.unitId);changes.set(row.unitId,row);}
  for(const source of patch.sources){if(sources.has(source.id))throw Error('Gap source ID already exists: '+source.id);sources.set(source.id,source);}
 }
 if(changes.size!==expected.size)throw Error('Every previous unresolved unit needs an explicit follow-up decision');
 const result=buildReviewedCorpus({baselineBundle,baselinePack,inventory,inputInventoryHash,expectedInventoryHash:manifest.inputInventoryHash,baselineMaterialRevision:manifest.baselineMaterialRevision,baselineKnowledgeRevision:manifest.baselineKnowledgeRevision,reviews:[{units:baselineAnalysis.audit.map(r=>changes.get(r.unitId)||r),sources:[...sources.values()]}]});
 if(result.pack.revision!==manifest.outputRevision||result.bundle.revision!==manifest.outputRevision)throw Error('Gap completion output revision mismatch');
 result.analysis.previousSummary=baselineAnalysis.summary;
 result.analysis.gapResolution=pending.map(old=>{const row=changes.get(old.unitId);return {unitId:old.unitId,previousStatus:old.status,previousMissing:old.missing,status:row.status,remainingMissing:row.missing,requiredMaterial:row.requiredMaterial,searchNotes:row.searchNotes,newSourceIds:row.evidence.filter(e=>!old.evidence.some(o=>o.sourceId===e.sourceId)).map(e=>e.sourceId)};});
 result.analysis.reviewManifest=manifest;
 return result;
}
module.exports={completeGaps,fingerprint};
if(require.main===module){const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'../..'),out=path.join(__dirname,'generated'),folder=path.join(__dirname,'review/round3'),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),raw=fs.readFileSync(path.join(root,'content/knowledge-inventory.json'),'utf8');
 const result=completeGaps({baselineBundle:read(path.join(out,'materials.v2.json')),baselinePack:read(path.join(out,'knowledge.v2.json')),baselineAnalysis:read(path.join(out,'analysis.v2.json')),inventory:JSON.parse(raw),inputInventoryHash:C.digest(raw),manifest:read(path.join(folder,'manifest.json')),patches:['domain1.json','domain2.json','domain34.json'].map(f=>read(path.join(folder,f)))});
 writeReviewedCorpus(result,out);fs.writeFileSync(path.join(out,'gap-resolution.v3.json'),JSON.stringify(result.analysis.gapResolution,null,2)+'\n');console.log(JSON.stringify(result.analysis.summary));
}
