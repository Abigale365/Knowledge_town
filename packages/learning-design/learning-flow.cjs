'use strict';
const C=require('../contracts'),W=require('../contracts/runtime/task-workshop-engine.js');
// Private B→C adapter: does not extend LearningPlan or change the published game.
function createLearningFlow({knowledgePack:rawPack,plan:rawPlan,teachingMap:rawMap}){
 const knowledgePack=structuredClone(rawPack),plan=structuredClone(rawPlan),teachingMap=structuredClone(rawMap);
 C.assertValid(C.validateKnowledge(knowledgePack));C.assertValid(C.validateLearningPlan(knowledgePack,plan));
 if(teachingMap.schemaVersion!==1||teachingMap.revision!==4||teachingMap.format!=='b-c-teaching-map'||teachingMap.binding.planHash!==C.digest(JSON.stringify(plan))||
  teachingMap.binding.knowledgeHash!==C.digest(JSON.stringify(knowledgePack)))throw Error('Teaching map does not match the knowledge/plan snapshot');
 if(C.digest(JSON.stringify(teachingMap))!==C.digest(JSON.stringify(require('./teaching-map.cjs').buildTeachingMap(knowledgePack,plan))))
  throw Error('Teaching-map prerequisite policy or object mapping changed; regenerate and review it with the plan');
 const binding=C.digest(JSON.stringify({map:teachingMap,planHash:teachingMap.binding.planHash}));
 const chapters=new Map(teachingMap.chapters.map(c=>[c.id,c])),steps=new Map(),rounds=new Map();
 for(const ch of teachingMap.chapters)for(const s of ch.sections){
  const source=plan.chapters.find(c=>c.id===ch.id)?.sections.find(x=>x.id===s.id);
  if(!source)throw Error('Unknown teaching-map section');
  for(const step of s.steps){
   if(steps.has(step.id))throw Error('Duplicate teaching-map step');steps.set(step.id,step);
   if(step.stage==='apply'){
    const r=source.activity.rounds.find(r=>r.id===step.roundId);
    if(!r||JSON.stringify(r.unitIds)!==JSON.stringify(step.unitIds))throw Error('Unbound application step');
    rounds.set(step.id,r);
   }else if(step.stage!=='foundation'||step.unitIds.length!==1||!source.learnUnitIds.includes(step.unitIds[0]))throw Error('Invalid foundation step');
  }
  if(source.activity.rounds.some(r=>!s.steps.some(step=>step.stage==='apply'&&step.roundId===r.id)))throw Error('Missing required application step');
 }
 for(const [id,step]of steps){
  if(step.requiresStepIds.some(req=>req===id||!steps.has(req)))throw Error('Invalid step prerequisite');
 }
 // Validate acyclic dependencies before any recursive progress evaluation.
 const visiting=new Set(),seen=new Set();function visit(id){if(visiting.has(id))throw Error('Cyclic teaching step dependency');if(seen.has(id))return;visiting.add(id);steps.get(id).requiresStepIds.forEach(visit);visiting.delete(id);seen.add(id);}steps.forEach((_,id)=>visit(id));
 function assertState(state){if(!state||state.v!==1||state.binding!==binding||!Array.isArray(state.viewedUnitIds)||!Array.isArray(state.foundationIds)||new Set(state.viewedUnitIds).size!==state.viewedUnitIds.length||new Set(state.foundationIds).size!==state.foundationIds.length||!state.answers||typeof state.answers!=='object'||Array.isArray(state.answers))throw Error('Stale or invalid learning-flow state; migrate explicitly, do not reuse completion');}
 function fresh(){return {v:1,binding,viewedUnitIds:[],foundationIds:[],answers:{}};}
 function passed(state,id,memo=new Map()){
  if(memo.has(id))return memo.get(id);const step=steps.get(id);if(!step)return false;
  const own=step.stage==='foundation'?state.foundationIds.includes(id)&&step.unitIds.every(u=>state.viewedUnitIds.includes(u)):W.grade(rounds.get(id),state.answers[id]);
  const value=!!own&&step.requiresStepIds.every(req=>passed(state,req,memo));memo.set(id,value);return value;
 }
 function canBrowse(chapterId,unitId){return chapters.get(chapterId)?.freeBrowseUnitIds.includes(unitId)||false;}
 function browse(state,chapterId,unitId){assertState(state);if(!canBrowse(chapterId,unitId))return false;if(!state.viewedUnitIds.includes(unitId))state.viewedUnitIds.push(unitId);return true;}
 function gate(state,stepId){assertState(state);const step=steps.get(stepId);if(!step)throw Error('Unknown required step');const missing=step.requiresStepIds.filter(req=>!passed(state,req));return {unlocked:missing.length===0,missingStepIds:missing};}
 function confirmFoundation(state,stepId){
  const status=gate(state,stepId),step=steps.get(stepId);
  if(step.stage!=='foundation')throw Error('Foundation confirmation cannot complete an application');
  if(!status.unlocked||!step.unitIds.every(u=>state.viewedUnitIds.includes(u)))return {accepted:false,...status,feedback:step.failureFeedback};
  if(!state.foundationIds.includes(stepId))state.foundationIds.push(stepId);return {accepted:true};
 }
 function submit(state,stepId,answer){
  const status=gate(state,stepId),step=steps.get(stepId);
  if(step.stage!=='apply')throw Error('Application submission cannot confirm a foundation');
  if(!status.unlocked||!W.grade(rounds.get(stepId),answer))return {accepted:false,...status,feedback:step.feedback};
  state.answers[stepId]=structuredClone(answer);return {accepted:true,feedback:step.feedback};
 }
 function chapterReadyForPractice(state,chapterId){assertState(state);const ch=chapters.get(chapterId);return !!ch&&ch.practiceRequiresStepIds.every(id=>passed(state,id));}
 function validate(state){try{assertState(state);
  return state.viewedUnitIds.every(id=>knowledgePack.units.some(u=>u.id===id))&&state.foundationIds.every(id=>steps.get(id)?.stage==='foundation'&&passed(state,id))&&
   Object.entries(state.answers).every(([id,a])=>steps.get(id)?.stage==='apply'&&W.grade(rounds.get(id),a)&&passed(state,id));
 }catch{return false;}}
 return {fresh,canBrowse,browse,gate,confirmFoundation,submit,chapterReadyForPractice,validate,
  hasPassed:(state,id)=>{assertState(state);return passed(state,id);}};
}
module.exports={createLearningFlow};
