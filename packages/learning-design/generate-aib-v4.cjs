'use strict';
const fs=require('node:fs'),path=require('node:path'),C=require('../contracts');
const {createDesignAdapter,designLearning}=require('.'),{compileCourse}=require('../course-compiler');
const {buildTeachingMap,concentration}=require('./teaching-map.cjs');
const hash=x=>C.digest(JSON.stringify(x));
async function prepare(){
 const {knowledgePack:pack,materialBundle:bundle}=require('../course-compiler/enrich-aib.cjs').enrichedAib();
 const prior=require('./generated/aib-blueprint.v3.json'),priorPlan=require('./generated/aib-learning-plan.v3.json'),priorManifest=require('./generated/aib-manifest.v3.json');
 C.assertValid(C.validateKnowledge(pack,bundle));
 if(hash(pack)!==priorManifest.input.hash||hash(priorPlan)!==priorManifest.output.hash)throw Error('Reviewed v3 baseline changed; re-audit before v4 adaptation');
 const blueprint=structuredClone(prior);blueprint.revision=4;
 const changes=[];
 for(const name of ['activities.v4.chapter1.cjs','activities.v4.applied.cjs']){
  const module=require('./authored/'+name);module.apply(blueprint);changes.push(...structuredClone(module.decisions));
 }
 // Every question and source basis remains the reviewed revision-3 content.
 for(const u of pack.units){if(hash(blueprint.units[u.id].questions)!==hash(prior.units[u.id].questions)||blueprint.units[u.id].knowledgeBasis!==prior.units[u.id].knowledgeBasis)throw Error('V4 must retain reviewed questions/source for '+u.id);}
 const plan=await designLearning(pack,{design:createDesignAdapter(blueprint)});
 require('./authored/section-designs.v4.cjs').decorate(plan);
 C.assertValid(C.validateLearningPlan(pack,plan));
 const teachingMap=buildTeachingMap(pack,plan),course=compileCourse(pack,plan,{materialBundle:bundle});
 const legacyMap=require('./legacy-teaching-map.cjs').buildLegacyMap();
 const before=concentration(priorPlan),after=concentration(plan),counts={};
 for(const s of after)for(const [type,n]of Object.entries(s.types))counts[type]=(counts[type]||0)+n;
 const manifest={schemaVersion:1,provenance:{baseTeachingRevision:3,basePlanHash:hash(priorPlan),baseBlueprintHash:hash(prior)},
  input:structuredClone(priorManifest.input),output:{id:plan.id,revision:4,hash:hash(plan)},blueprintHash:hash(blueprint),
  teachingMap:{file:'aib-teaching-map.v4.json',hash:hash(teachingMap),format:'b-c-teaching-map',revision:4},
  legacyMap:{file:'legacy-teaching-map.v4.json',hash:hash(legacyMap),sections:legacyMap.chapters.reduce((n,c)=>n+c.sections.length,0)},
  uniqueUnits:pack.units.length,objectives:pack.objectives.length,changedUnits:changes.length,
  chapters:plan.chapters.map(ch=>({id:ch.id,sections:ch.sections.length,learningCards:ch.sections.reduce((n,s)=>n+s.learnUnitIds.length,0),rounds:ch.sections.reduce((n,s)=>n+s.activity.rounds.length,0)})),
  roundCounts:counts,knowledgeWarnings:C.validateKnowledge(pack,bundle).filter(d=>d.severity==='warning').length};
 const concentrationAudit={before,after,summary:{beforeSingleControl:before.filter(s=>Object.keys(s.types).length===1).length,afterSingleControl:after.filter(s=>Object.keys(s.types).length===1).length,
  beforeTripleRepeat:before.filter(s=>s.longestRepeat>=3).length,afterTripleRepeat:after.filter(s=>s.longestRepeat>=3).length},changes};
 return {pack,bundle,blueprint,plan,course,teachingMap,legacyMap,manifest,concentrationAudit,prior};
}
async function generate({reviewed=false}={}){
 const result=await prepare();
 if(reviewed){
  const review=JSON.parse(fs.readFileSync(path.join(__dirname,'authored/review-v4.json'),'utf8'));
  if(review.knowledgeHash!==result.manifest.input.hash||review.blueprintHash!==hash(result.blueprint)||review.planHash!==hash(result.plan)||review.teachingMapHash!==hash(result.teachingMap)||review.legacyMapHash!==hash(result.legacyMap)||review.accepted!==true||
   result.pack.units.some(u=>review.decisions.filter(d=>d.unitId===u.id&&d.accepted===true&&d.teachingHash===hash(result.blueprint.units[u.id])).length!==1))throw Error('V4 review must bind every unit and all plan/map snapshots');
 }
 const dir=path.join(__dirname,reviewed?'generated':'candidates');fs.mkdirSync(dir,{recursive:true});
 for(const [key,name]of Object.entries({blueprint:'aib-blueprint.v4.json',plan:'aib-learning-plan.v4.json',course:'aib-course.v4.json',teachingMap:'aib-teaching-map.v4.json',legacyMap:'legacy-teaching-map.v4.json',manifest:'aib-manifest.v4.json',concentrationAudit:'concentration-audit.v4.json'}))
  fs.writeFileSync(path.join(dir,name),JSON.stringify(result[key],null,2)+'\n');
 fs.writeFileSync(path.join(dir,'C-section-guide.v4.md'),renderGuide(result));
 console.log(JSON.stringify({directory:dir,...result.manifest,concentration:result.concentrationAudit.summary},null,2));return result;
}
function renderGuide({teachingMap,legacyMap}){
 const lines=['# C逐节物件、步骤与解锁（教学revision4）','','此文件由已绑定的侧车生成；完整双语题面、反馈、来源与依赖ID见同目录两个teaching-map。渲染未接入之前不能宣称游戏已改变。',
  '','知识浏览/收藏可自由进行且不计掌握；基础确认与应用提交必须走先修。物件装饰不能代替判定。AIB38节与原内置13节的1.1不同，必须以课程ID/版本/摘要为命名空间。',''];
 for(const ch of teachingMap.chapters){lines.push(`## AIB第${ch.compiledChapterId}章 · ${ch.title.zh}`,'');
  for(const s of ch.sections){lines.push(`### ${s.compiledSectionId} · ${s.title.zh}`,'',`- 映射：${s.id}；本章知识可自由浏览：${s.freeBrowseUnitIds.join('、')}。`,
   `- 必做先修：${s.prerequisiteSectionIds.join('、')||'无；可独立进入本章'}；基础确认顺序：${s.freeBrowseUnitIds.join(' → ')}。`);
   for(const step of s.steps.filter(x=>x.stage==='apply')){const object=s.objects.find(o=>o.id===step.objectId);lines.push(`- 物件 ${object.id}：${object.name.zh}；职责：${object.duty.zh} 步骤：${step.instruction.zh} 判定：${step.passRule}；反馈：${step.feedback.zh}`);}
   lines.push(`- 解锁：${s.completeWhenStepIds.join('、')} 成功才交付本节；下一节仍检查requiresStepIds。`,'');
  }
 }
 lines.push('## 原内置13节（独立命名空间）','', 'D先解除scripts/enrich-knowledge.cjs中对1.1强制match的分支；C随后用对应实际round控制器接入，不能再以花房配对通关。','');
 for(const ch of legacyMap.chapters)for(const s of ch.sections){lines.push(`### 内置${s.id} · ${s.title}`,'',`- 先修：${s.prerequisiteSectionIds.join('、')||'本章无前置小节'}；自由浏览${s.sourceUnitIds.length}份知识。`);
  for(const step of s.steps)lines.push(`- ${step.id}：${step.control}；${step.instruction.zh} 前置：${step.requiresRoundIds.join('、')||'本节基础确认与上游小节'}。反馈：${step.feedback.zh}`);
  lines.push('- 全部必做操作通过才完成；本章全部节完成才进入正式练习，浏览与收藏不触发完成。','');}
 return lines.join('\n')+'\n';
}
if(require.main===module)generate({reviewed:process.argv.includes('--reviewed')}).catch(e=>{console.error(e.message,e.diagnostics||'');process.exitCode=1;});
module.exports={prepare,generate};
