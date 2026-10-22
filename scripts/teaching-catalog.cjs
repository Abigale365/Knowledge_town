'use strict';
const C=require('../packages/contracts'),W=require('../packages/contracts/runtime/task-workshop-engine.js'),Schema=require('../packages/contracts/runtime/course-schema.js');
function catalog(){
 const pack=require('../packages/course-compiler/enrich-aib.cjs').enrichedAib(),plan=require('../packages/learning-design/generated/aib-learning-plan.v4.json'),map=require('../packages/learning-design/generated/aib-teaching-map.v4.json');
 const manifest=require('../packages/learning-design/generated/aib-manifest.v4.json'),review=require('../packages/learning-design/authored/review-v4.json'),blueprint=require('../packages/learning-design/generated/aib-blueprint.v4.json');
 const digest=x=>C.digest(JSON.stringify(x));
 const legacyReviewed=require('../packages/learning-design/generated/legacy-teaching-map.v4.json');
 if(!review.accepted||review.schemaVersion!==1||review.teachingRevision!==4||plan.revision!==4||manifest.output.revision!==4||
  digest(pack.knowledgePack)!==review.knowledgeHash||digest(plan)!==review.planHash||digest(map)!==review.teachingMapHash||digest(legacyReviewed)!==review.legacyMapHash||digest(blueprint)!==review.blueprintHash||
  manifest.input.hash!==review.knowledgeHash||manifest.output.hash!==review.planHash||manifest.teachingMap.hash!==review.teachingMapHash||manifest.legacyMap.hash!==review.legacyMapHash||manifest.blueprintHash!==review.blueprintHash)
  throw Error('Publication input differs from accepted B4 review/manifest; regenerate and review before build');
 require('../packages/learning-design/learning-flow.cjs').createLearningFlow({...pack,plan,teachingMap:map});
 const course=require('../packages/course-compiler').compileCourse(pack.knowledgePack,plan,{materialBundle:pack.materialBundle});
 const legacyMap=require('../packages/learning-design/generated/legacy-teaching-map.v4.json');
 if(C.digest(JSON.stringify(legacyMap))!==C.digest(JSON.stringify(require('../packages/learning-design/legacy-teaching-map.cjs').buildLegacyMap())))throw Error('Legacy sidecar changed; review before build');
 const base=require('../dist/chapter-course.js'),templates=require('../packages/learning-design/templates/strategist.cjs'),cards=require('../dist/aib-pack.js').cards;
 const raw=structuredClone(base);raw.title+=' · 探索版4';raw.pipeline={schemaVersion:1,knowledgePackId:'legacy-knowledge',knowledgeRevision:3,learningPlanId:'legacy-teaching',planRevision:4};
 for(const ch of raw.chapters)for(const sec of ch.sections){sec.sourceSectionId=sec.id;sec.activity=structuredClone(templates[sec.id]);sec.lessons=sec.lessons.map(l=>({...l,sourceUnitId:l.id,interaction:'read'}));sec.questions=cards.filter(c=>c.topic.startsWith('Task '+sec.id+' ·'));}
 const legacy=Schema.normalize(raw);
 function entry(course,source,isLegacy){
  const chapters=course.chapters.map((ch,ci)=>({id:ch.id,sections:ch.sections.map((sec,si)=>{
   const src=source.chapters[ci].sections[si];let steps;
   if(!isLegacy)steps=structuredClone(src.steps).map(step=>({...step,unitIds:step.unitIds.map(id=>sec.lessons.find(l=>l.sourceUnitId===id)?.id||id)}));
   else {const prev=si?source.chapters[ci].sections[si-1]:null;let requires=prev?[`legacy:${prev.id}:${prev.activity.rounds.at(-1).id}`]:[];steps=sec.lessons.map(l=>{const id=`legacy:${sec.id}:foundation:${l.id}`,step={id,stage:'foundation',unitIds:[l.id],requiresStepIds:requires};requires=[id];return step;});for(const r of sec.activity.rounds){const id=`legacy:${sec.id}:${r.id}`;steps.push({id,stage:'apply',roundId:r.id,requiresStepIds:requires});requires=[id];}}
   return {id:sec.id,sourceSectionId:sec.sourceSectionId,steps};
  })}));
  return {course,revision:4,sourceHash:C.digest(JSON.stringify(source)),binding:C.digest(JSON.stringify({course,source})),signature:W.signature(course),chapters};
 }
 return {aib:entry(course,map,false),legacy:entry(legacy,legacyMap,true)};
}
module.exports={catalog};
