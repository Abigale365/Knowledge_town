'use strict';
const C=require('../contracts'),W=require('../contracts/runtime/task-workshop-engine.js');
const {controls}=require('./teaching-map.cjs');
function buildLegacyMap(){
 const course=require('../../dist/chapter-course.js'),templates=require('./templates/strategist.cjs');
 const core=require('./templates/core-foundations.cjs');
 return {schemaVersion:1,format:'b-c-legacy-teaching-map',revision:4,
  binding:{baseCourseId:course.id,baseCourseHash:C.digest(JSON.stringify(course)),templateHash:C.digest(JSON.stringify(templates))},
  integrationBlockers:[
   {file:'scripts/enrich-knowledge.cjs',reason:'The section.id===1.1 branch forces kind=match and skips templates. D must use the reviewed 1.1 activity rather than this branch.'},
   {file:'apps/game/src/knowledge-play.js',reason:'The reference handler requires prior read status and non-reference browsing is limited to studySection. C must add a read-only chapter browse path that never changes mastery.'}
  ],
  chapters:course.chapters.map(ch=>({id:ch.id,entryRequires:[],freeBrowseUnitIds:ch.sections.flatMap(s=>s.lessons.map(l=>l.id)),
   practiceRequiresSectionIds:ch.sections.map(s=>s.id),sections:ch.sections.map((s,si)=>{
    const activity=templates[s.id];if(!W.validPlan(activity))throw Error('Invalid legacy teaching activity '+s.id);
    const targets=[...new Set(s.lessons.map(l=>l.skill))],covered=new Set(activity.rounds.flatMap(r=>r.skills));
    if(targets.some(id=>!covered.has(id)))throw Error('Legacy activity omits objective '+s.id);
    return {id:s.id,title:s.title,sourceUnitIds:s.lessons.map(l=>l.id),prerequisiteSectionIds:si?[ch.sections[si-1].id]:[],
     freeBrowse:{scope:'whole-chapter-on-entry',content:['body','example','boundary','quote','source','en'],collection:'optional',countsAsMastery:false},
     objects:[...s.lessons.map(l=>({id:`legacy:${l.id}:knowledge`,role:'free-knowledge',name:{zh:l.title,en:l.en?.title||l.title},unitIds:[l.id],readOnly:true})),
      ...activity.rounds.map(r=>({id:`legacy:${s.id}:${r.id}`,role:'required-application',name:controls[r.type].name,duty:controls[r.type].duty,control:r.type,
       unitIds:s.id==='1.1'?core.roundUnitIds[r.id]:s.lessons.filter(l=>r.skills.includes(l.skill)).map(l=>l.id)}))],
     activity:structuredClone(activity),
     steps:activity.rounds.map((r,ri)=>({id:`legacy:${s.id}:${r.id}`,control:r.type,prompt:r.prompt,feedback:r.reason,
      requiresSectionIds:si?[ch.sections[si-1].id]:[],requiresFoundationUnitIds:s.lessons.map(l=>l.id),
      requiresRoundIds:ri?[activity.rounds[ri-1].id]:[],passRule:'TaskWorkshop.grade',instruction:controls[r.type].action})),
     completion:'All required application rounds pass; collecting or matching names is insufficient.'};
   })}))};
}
module.exports={buildLegacyMap};
