'use strict';
// Candidate catalog only. The live B4 directory is not switched until its UI gates are ready.
const C=require('../packages/contracts'),W=require('../packages/contracts/runtime/task-workshop-engine.js'),Schema=require('../packages/contracts/runtime/course-schema.js');
const hash=x=>C.digest(JSON.stringify(x));
function catalog(){
 const root='../packages/learning-design/',read=name=>require(root+name);
 const manifest=read('generated/aib-manifest.v5.json'),review=read('authored/review-v5.json');
 const pack=require('../packages/course-compiler/enrich-aib.cjs').enrichedAib();
 const plan=read('generated/aib-learning-plan.v5.json'),logic=read('generated/teaching-logic.v5.json'),legacyLogic=read('generated/legacy-teaching-logic.v5.json'),micro=read('generated/micro-checkpoints.v5.json');
 const artifacts={blueprintHash:read('generated/aib-blueprint.v5.json'),logicHash:logic,legacyHash:legacyLogic,unitAuditHash:read('generated/unit-teaching-audit.v5.json'),sectionAuditHash:read('generated/section-teaching-audit.v5.json'),microHash:micro};
 if(!review.accepted||review.teachingRevision!==5||plan.revision!==5||manifest.output.revision!==5||hash(pack.knowledgePack)!==manifest.input.hash||hash(plan)!==manifest.output.hash||hash(review.binding)!==hash(Object.fromEntries(Object.keys(review.binding).map(k=>[k,manifest[k]]))))throw Error('B5 publication binding differs from accepted review');
 for(const [key,data]of Object.entries(artifacts))if(hash(data)!==manifest[key]||hash(data)!==review.binding[key])throw Error('B5 unreviewed artifact: '+key);
 const course=require('../packages/course-compiler').compileCourse(pack.knowledgePack,plan,{materialBundle:pack.materialBundle});
 if(hash(course)!==hash(read('generated/aib-course.v5.json')))throw Error('B5 compilation differs from reviewed course');
 const base=structuredClone(require('../dist/chapter-course.js')),cards=require('../dist/aib-pack.js').cards;
 base.id+='-teaching-v5';base.title+=' · 探索版5';base.pipeline={schemaVersion:1,knowledgePackId:'legacy-knowledge',knowledgeRevision:3,learningPlanId:'legacy-teaching',planRevision:5};
 for(let ci=0;ci<base.chapters.length;ci++)for(let si=0;si<base.chapters[ci].sections.length;si++){
  const sec=base.chapters[ci].sections[si],policy=legacyLogic.chapters[ci].sections[si];
  if(sec.id!==policy.id)throw Error('B5 legacy section changed');
  sec.sourceSectionId=sec.id;sec.activity=structuredClone(policy.independentActivity);sec.matchRequired=false;
  sec.lessons=sec.lessons.map(l=>({...l,sourceUnitId:l.id,interaction:'read'}));sec.questions=cards.filter(q=>q.topic.startsWith('Task '+sec.id+' ·'));
 }
 const legacy=Schema.normalize(base);
 function entry(course,legacyMode){
  const chapters=course.chapters.map((ch,ci)=>({id:ch.id,sections:ch.sections.map((sec,si)=>{
   const policy=legacyMode?legacyLogic.chapters[ci].sections[si]:logic.sections.find(x=>x.id===sec.sourceSectionId);
   if(!policy)throw Error('Missing B5 section policy: '+sec.id);
   const rounds=legacyMode?policy.independentActivity.rounds:policy.independentApplication.rounds.map(x=>x.round);
   const gradingBody=rs=>rs.map(r=>{const copy=structuredClone(r);delete copy.skills;return copy;});
   if(hash(gradingBody(rounds))!==hash(gradingBody(sec.activity.rounds)))throw Error('B5 policy/activity mismatch: '+sec.id);
   return {id:sec.id,sourceSectionId:sec.sourceSectionId,policy,unitToLesson:Object.fromEntries(sec.lessons.map(l=>[l.sourceUnitId,l.id]))};
  })}));
  const source=legacyMode?legacyLogic:logic;
  return {course,revision:5,sourceHash:hash(source),binding:hash({course,source,micro,review:review.binding}),signature:W.signature(course),chapters,micro:legacyMode?micro.legacy:micro.aib,microExercises:Object.fromEntries(logic.sections.map(s=>[s.id,s.guidedPractice])),knowledge:pack.knowledgePack};
 }
 return {aib:entry(course,false),legacy:entry(legacy,true)};
}
module.exports={catalog};
