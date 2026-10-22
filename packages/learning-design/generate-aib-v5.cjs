'use strict';
const fs=require('node:fs'),path=require('node:path'),C=require('../contracts'),W=require('../contracts/runtime/task-workshop-engine.js');
const {designLearning,createDesignAdapter}=require('.'),{compileCourse}=require('../course-compiler');
const {buildTeachingLogic,initialAnswer,witness,describeAnswer}=require('./teaching-logic.v5.cjs');
const hash=x=>C.digest(JSON.stringify(x)),clone=structuredClone;
function buildLegacy(pack,blueprint,logic,audits){
 const old=require('./generated/legacy-teaching-map.v4.json'),oldCore=require('./templates/core-foundations.cjs'),core=require('./templates/core-foundations.v5.cjs');
 const units=new Map(pack.units.map(u=>[u.id,u])),auditById=new Map(audits.map(a=>[a.unitId,a]));
 const englishTitles={'1.1':'AI foundations','1.2':'AI systems and agents','1.3':'Generative AI','2.1':'Business opportunities','2.2':'Value and measurement','2.3':'Strategy and investment','3.1':'Responsible AI principles','3.2':'Governance and responsibilities','3.3':'Controls and assurance','4.1':'Organizational readiness','4.2':'Skills and capabilities','4.3':'People and change','4.4':'Implementation and operations'};
 const guideSections={'1.1':'1.3','1.2':'1.8','1.3':'1.10','2.1':'2.1','2.2':'2.6','2.3':'2.7','3.1':'3.2','3.2':'3.4','3.3':'3.6','4.1':'4.1','4.2':'4.3','4.3':'4.5','4.4':'4.10'};
 return {schemaVersion:1,format:'b-c-legacy-teaching-logic',revision:5,binding:{knowledgeHash:hash(pack),previousLegacyMapHash:hash(old)},policy:clone(logic.policy),
  chapters:old.chapters.map(ch=>({id:ch.id,entryRequires:[],formalPassThreshold:0.9,sections:ch.sections.map(s=>{
   let activity,focus={};
   if(s.id==='1.1'){activity=clone(core.activity);focus=clone(core.roundUnitIds);}
   else{
    const rounds=[];
    for(const id of s.sourceUnitIds){
     const unit=units.get(id);if(!unit)throw Error('Unknown legacy knowledge '+id);
     for(const [ri,round]of blueprint.units[id].activity.rounds.entries()){
      const roundId=`${id}-r${ri+1}`;const r={...clone(round),id:roundId,skills:unit.objectiveIds.map(id=>id.replace(/^skill-/,''))};
      delete r.unitIds;rounds.push(r);focus[roundId]=[id];
     }
    }
    activity={version:1,kind:'teaching-audit-lab',title:{zh:s.title,en:englishTitles[s.id]},brief:{zh:'先发现和整理知识，再看推理示范与引导练习。以下为新情境应用，知识随时可查；示范、收藏与基础确认不计理解通过。整章完成后进入90%正式测验。',en:'Discover and organize knowledge, then study worked reasoning and guided practice. These are new-situation applications with knowledge always available. Examples, favorites and foundation confirmation do not establish understanding. Formal assessment with a 90% threshold follows the chapter.'},rounds};
   }
   if(!W.validPlan(activity))throw Error('Legacy independent activity invalid or exceeds 20 rounds: '+s.id);
   const required=[...new Set(s.activity.rounds.flatMap(r=>r.skills))],covered=new Set(activity.rounds.flatMap(r=>r.skills));
   if(required.some(id=>!covered.has(id)))throw Error('Legacy objective not assessed '+s.id);
   const guide=logic.sections.find(x=>x.compiledSectionId===guideSections[s.id]);
   const reviewIds=[...new Set(s.sourceUnitIds.flatMap(id=>units.get(id).prerequisiteIds).filter(id=>!s.sourceUnitIds.includes(id)))];
   return {id:s.id,title:s.title,learnerGoals:s.sourceUnitIds.map(id=>auditById.get(id).learnerGoal),
    necessaryKnowledgeIds:s.sourceUnitIds,localPrerequisiteReviewIds:reviewIds,prerequisiteSectionIds:s.prerequisiteSectionIds,
    demonstration:clone(guide.demonstration),guidedPractice:clone(guide.guidedPractice),
    independentActivity:activity,roundUnitIds:focus,independentInitialStates:Object.fromEntries(activity.rounds.map(r=>[r.id,initialAnswer(r)])),
    roundSpecifications:activity.rounds.map(r=>({roundId:r.id,prompt:r.prompt,control:r.type,initialState:initialAnswer(r),
     operation:require('./teaching-map.cjs').controls[r.type].action,grading:'TaskWorkshop.grade',
     knowledgeHintsOnly:focus[r.id],answerBeforeAttempt:false,incorrectFeedback:r.reason,completionFeedback:{zh:'本项应用完成，请核对依据；看过完整答案后的订正不算独立证据。',en:'This application is complete; check the reasoning. Correction after seeing the solution is not independent evidence.'}})),
    audit:{decision:'remove-replace',priorRounds:s.activity.rounds.map(r=>({id:r.id,type:r.type})),
     reason:'Replace the prior workshop with reviewed goal-linked independent tasks; move worked solutions out of the completion path.',
     previousCoreWas: s.id==='1.1'?oldCore.activity.rounds.map(r=>r.id):undefined},
    discoveryAndFiling:clone(guide.discoveryAndFiling),formalAssessment:{availability:'after-whole-chapter',passThreshold:0.9,errorReview:'available-after-submission-including-failure'}};
  })}))};
}
async function prepare(){
 const {knowledgePack:pack,materialBundle:bundle}=require('../course-compiler/enrich-aib.cjs').enrichedAib();
 const base=require('./generated/aib-blueprint.v4.json'),baseManifest=require('./generated/aib-manifest.v4.json');
 if(hash(pack)!==baseManifest.input.hash||hash(base)!==baseManifest.blueprintHash)throw Error('Reviewed knowledge/B4 baseline changed; semantic re-audit required');
 C.assertValid(C.validateKnowledge(pack,bundle));const blueprint=clone(base);blueprint.revision=5;const audits=[];
 for(const name of ['chapter1','chapter2','chapter34']){const module=require('./authored/teaching-audit.v5.'+name+'.cjs');module.apply(blueprint);audits.push(...clone(module.audits));}
 if(audits.length!==pack.units.length||new Set(audits.map(a=>a.unitId)).size!==pack.units.length||pack.units.some(u=>!audits.some(a=>a.unitId===u.id)))throw Error('All 139 units require an explicit audit');
 for(const u of pack.units){
  const spec=blueprint.units[u.id],audit=audits.find(a=>a.unitId===u.id);
  if(spec.knowledgeBasis!==base.units[u.id].knowledgeBasis||hash(spec.questions)!==hash(base.units[u.id].questions))throw Error('This audit must preserve reviewed knowledge/formal questions for '+u.id);
  for(const key of ['reason','learnerGoal','thinking','understandingEvidence','misconception'])for(const lang of ['zh','en'])if(!audit[key]?.[lang]?.trim())throw Error('Missing bilingual audit field '+u.id+'.'+key);
  // Internal control IDs stay in data. Learners must not have to type them as knowledge evidence.
  if(spec.activity.rounds.some(r=>r.fields?.some(f=>typeof f.expected==='string')))throw Error('Independent application still asks for literal code/text copying: '+u.id);
  for(const [ri,r]of spec.activity.rounds.entries())if(r.options)r.options.sort((a,b)=>hash(u.id+ri+a.id).localeCompare(hash(u.id+ri+b.id)));
 }
 const plan=await designLearning(pack,{design:createDesignAdapter(blueprint)});
 require('./authored/section-designs.v5.cjs').decorate(plan,audits);
 C.assertValid(C.validateLearningPlan(pack,plan));
 const logic=buildTeachingLogic(pack,plan,audits),legacy=buildLegacy(pack,blueprint,logic,audits),course=compileCourse(pack,plan,{materialBundle:bundle});
 const micro=require('./authored/micro-checkpoints.v5.cjs').buildMicroCheckpoints(pack,logic,legacy);
 const counts={},decisions={};for(const ch of plan.chapters)for(const s of ch.sections)for(const r of s.activity.rounds)counts[r.type]=(counts[r.type]||0)+1;
 for(const a of audits)decisions[a.decision]=(decisions[a.decision]||0)+1;
 const sectionAudit=logic.sections.map(s=>({sectionId:s.id,compiledSectionId:s.compiledSectionId,title:s.title,learnerGoals:s.learnerGoals,
  necessaryKnowledgeIds:s.necessaryKnowledge.map(u=>u.unitId),chain:['knowledge','demonstration','guided','independent','feedback','formal-assessment'],
  activities:s.necessaryKnowledge.map(u=>{const a=audits.find(a=>a.unitId===u.unitId);return {...a,oldRounds:base.units[u.unitId].activity.rounds.map(r=>({id:r.id,type:r.type})),newRounds:blueprint.units[u.unitId].activity.rounds.map(r=>({id:r.id,type:r.type})),
   oldMeaningfulOperationRemoved:a.decision==='remove-replace',sourceBasis:blueprint.units[u.unitId].knowledgeBasis};})}));
 const manifest={schemaVersion:1,provenance:{baseTeachingRevision:4,basePlanHash:baseManifest.output.hash,baseBlueprintHash:hash(base)},
  input:clone(baseManifest.input),output:{id:plan.id,revision:5,hash:hash(plan)},blueprintHash:hash(blueprint),logicHash:hash(logic),legacyHash:hash(legacy),unitAuditHash:hash(audits),sectionAuditHash:hash(sectionAudit),microHash:hash(micro),
  uniqueUnits:pack.units.length,objectives:pack.objectives.length,decisions,
  sections:logic.sections.length,learningCards:logic.sections.reduce((n,s)=>n+s.necessaryKnowledge.length,0),independentRounds:Object.values(counts).reduce((a,b)=>a+b,0),formalQuestions:plan.chapters.reduce((n,c)=>n+c.sections.reduce((m,s)=>m+s.questions.length,0),0),
  roundCounts:counts,demonstrations:logic.sections.length,guidedPractices:logic.sections.length,
  legacySections:legacy.chapters.flatMap(c=>c.sections).length,legacyIndependentRounds:legacy.chapters.flatMap(c=>c.sections).reduce((n,s)=>n+s.independentActivity.rounds.length,0),knowledgeDiagnostics:C.validateKnowledge(pack,bundle)};
 return {pack,bundle,blueprint,plan,logic,legacy,course,audits,sectionAudit,micro,manifest};
}
async function generate({reviewed=false}={}){
 const result=await prepare();
 if(reviewed){
  const review=JSON.parse(fs.readFileSync(path.join(__dirname,'authored/review-v5.json'),'utf8'));
  for(const key of ['input','output','blueprintHash','logicHash','legacyHash','unitAuditHash','sectionAuditHash','microHash'])if(review.binding[key]===undefined||hash(review.binding[key])!==hash(result.manifest[key]))throw Error('V5 audit review binding differs: '+key);
  if(review.accepted!==true||result.audits.some(a=>review.decisions.filter(d=>d.unitId===a.unitId&&d.accepted===true&&d.teachingHash===hash(result.blueprint.units[a.unitId])).length!==1))throw Error('V5 requires every audited unit bound to independent review');
 }
 const dir=path.join(__dirname,reviewed?'generated':'candidates/v5');fs.mkdirSync(dir,{recursive:true});
 for(const [key,name]of Object.entries({blueprint:'aib-blueprint.v5.json',plan:'aib-learning-plan.v5.json',course:'aib-course.v5.json',logic:'teaching-logic.v5.json',legacy:'legacy-teaching-logic.v5.json',audits:'unit-teaching-audit.v5.json',sectionAudit:'section-teaching-audit.v5.json',manifest:'aib-manifest.v5.json',micro:'micro-checkpoints.v5.json'}))fs.writeFileSync(path.join(dir,name),JSON.stringify(result[key],null,2)+'\n');
 fs.writeFileSync(path.join(dir,'B-section-audit.v5.md'),auditMarkdown(result));
 console.log(JSON.stringify({directory:dir,...result.manifest},null,2));return result;
}
function auditMarkdown({sectionAudit,legacy,manifest}){
 const lines=['# 教学逻辑逐节审查（revision5）','','示范和引导不计掌握；下表的独立应用仍需C按阶段接入。知识可随时回看。原料/学习链/判定及全部双语反馈见同目录JSON。','','| 节 | 学习目标 | 保留/修改/删除替换及原因 |','|---|---|---|'];
 for(const s of sectionAudit)lines.push(`| ${s.compiledSectionId} ${s.title.zh} | ${s.learnerGoals.map(g=>g.zh).join('；')} | ${s.activities.map(a=>`${a.unitId}：${a.decision}—${a.reason.zh}`).join('<br>')} |`);
 lines.push('','## 原内置四章13节','', '| 节 | 必要知识/应用轮数 | 处理与理由 |','|---|---|---|');
 for(const ch of legacy.chapters)for(const s of ch.sections)lines.push(`| ${s.id} ${s.title} | ${s.necessaryKnowledgeIds.length}份知识 / ${s.independentActivity.rounds.length}轮 | 删除旧照抄/混合阶段入口，接入已逐单元审阅的新情境应用；原题只作历史对照。${s.learnerGoals.map(g=>g.zh).join('；')} |`);
 lines.push('',`139单元审查：${JSON.stringify(manifest.decisions)}。实际掌握证据限定为本题可观察操作；反馈中的解释不等于学习者已自由解释。`,'');return lines.join('\n');
}
if(require.main===module)generate({reviewed:process.argv.includes('--reviewed')}).catch(e=>{console.error(e.message,e.diagnostics||'');process.exitCode=1;});
module.exports={prepare,generate};
