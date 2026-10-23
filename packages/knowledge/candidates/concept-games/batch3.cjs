'use strict';
const fs=require('node:fs'),path=require('node:path'),C=require('../../../contracts'),items=require('./batch3-content.cjs'),{buildBatch2,currentInputs}=require('./batch2.cjs');
function buildBatch3(inputs,coverage){
 if(!Array.isArray(coverage?.sourceConceptsCovered))throw Error('Explicit B coverage sourceConceptsCovered required');
 const selected=items.flatMap(i=>i.unitIds);
 if(selected.some(id=>coverage.sourceConceptsCovered.includes(id)))throw Error('Selected concept no longer a B coverage gap; reselect or review overlap');
 const result=buildBatch2(...inputs,items),legacy=inputs[5].find(r=>r.name==='B5-legacy');
 const oldSection=legacy.course.chapters[0].sections.find(s=>s.id==='1.1'),oldIds=new Set(oldSection.lessons.map(l=>l.sourceUnitId));
 result.candidateRevision=3;result.batchNumber=3;result.coverageSelection={basis:'B current coverage sourceConceptsCovered at selection; not a claim of game implementation',coverageBatch:coverage.batch,coverageContentHash:C.digest(JSON.stringify(coverage)),previouslyCovered:[...coverage.sourceConceptsCovered],selectedGapUnitIds:selected,oldLegacySection:'1.1',oldLegacyLessonCount:oldSection.lessons.length,selectedOldLegacyConcepts:selected.filter(id=>oldIds.has(id)).length};
 result.experiments=[...new Set(items.map(i=>i.experimentId))].map(id=>({id,conceptIds:items.filter(i=>i.experimentId===id).map(i=>i.id),note:'Shared operations may be reused, but each concept keeps its own objective and evidence; not an engine kind.'}));
 return result;
}
module.exports={buildBatch3};
if(require.main===module){const coverage=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../../learning-design/candidates/concept-games/coverage.json'),'utf8')),r=buildBatch3(currentInputs(),coverage);fs.writeFileSync(path.join(__dirname,'batch3.v1.json'),JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({items:r.items.length,experiments:r.experiments.length,bindings:r.items.reduce((n,i)=>n+i.bindings.length,0),selection:r.coverageSelection.selectedOldLegacyConcepts,oldSectionLessons:r.coverageSelection.oldLegacyLessonCount,integrated:r.integrated}));}
