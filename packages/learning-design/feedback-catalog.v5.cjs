'use strict';
const C=require('../contracts'),W=require('../contracts/runtime/task-workshop-engine.js');
const L=(zh,en)=>({zh,en}),hash=x=>C.digest(JSON.stringify(x)),copy=structuredClone;
const semantic={
 sensor:[L('测得的振动和温度先进入模型，是输入，不是模型估计。','Measured vibration and temperature enter the model as inputs, not estimates.'),['1.1-lesson-2']],
 estimate:[L('剩余小时是模型给出的估计，是输出，不能当作已经发生的观测事实。','Remaining hours are a model estimate: an output, not an observed fact.'),['1.1-lesson-2']],
 change:[L('根据样本结果的误差调整权重，参数发生学习变化，属于训练。','Updating weights from errors against example outcomes changes learned parameters: training.'),['1.1-lesson-3']],
 run:[L('锁定权重处理新设备读数，没有更新参数，属于推理；出现新输入不等于训练。','Processing new readings with locked weights does not update parameters: inference. New inputs do not imply training.'),['1.1-lesson-4']]
};
function buildFeedbackCatalog(pack,logic,legacy){
 const units=new Map(pack.units.map(u=>[u.id,u]));
 const links=ids=>ids.map(id=>{const u=units.get(id);if(!u)throw Error('Unknown feedback knowledge '+id);return {unitId:id,title:copy(u.title),action:'open-knowledge-reference',explanation:copy(u.explanation),evidence:copy(u.evidence)};});
 function entry(key,r,ids,goals,{archive=false}={}){
  const checks={};
  const add=(id,label,expected,detail,reviewIds=ids)=>{checks[id]={label:copy(label),expectedExplanation:detail||L(label.zh+'：'+expected.zh+'。请对照本题事实核对。',label.en+': '+expected.en+'. Check this against the scenario evidence.'),reason:copy(r.reason),reviewLinks:links(reviewIds)};};
  if(r.type==='sort')for(const i of r.items)add(i.id,i.text,r.bins.find(b=>b.id===i.target).text);
  else if(r.fields)for(const f of r.fields)add(f.id,f.label,L('应为'+f.expected,'Expected '+f.expected));
  else if(r.type==='order')for(const i of r.items)add(i.id,i.text,L('应在第'+(r.expected.indexOf(i.id)+1)+'步','Belongs at step '+(r.expected.indexOf(i.id)+1)));
  else if(r.type==='matrix')for(const row of r.rows)for(const col of r.columns){const id=row.id+':'+col.id;const custom=r.id==='inspect-model-work'?semantic[row.id]:null;add(id,L(row.text.zh+' / '+col.text.zh,row.text.en+' / '+col.text.en),L(r.expected.includes(id)?'此格应选':'此格不应选',r.expected.includes(id)?'Select this cell':'Do not select this cell'),custom?.[0],custom?.[1]);}
  else if(r.type==='choose')for(const i of r.options)add(i.id,i.text,L(r.expected.includes(i.id)?'证据支持选择此项':'现有证据不支持选择此项',r.expected.includes(i.id)?'The evidence supports this option':'The evidence does not support this option'));
  else if(r.type==='allocate')for(const [id,label]of [['allowed',L('可用条件','Allowed options')],['budget',L('预算','Budget')],['value',L('目标','Target')],['required',L('必要条件','Required conditions')]])add(id,label,L('须满足题面给定约束','Must satisfy the stated constraint'));
  return {key,roundId:r.id,control:r.type,roundHash:hash(r),archiveOnly:archive,learnerGoals:copy(goals),checks,reviewLinks:links(ids),
   allocationConstraints:r.type==='allocate'?{budget:r.budget,minimumValue:r.minimumValue,required:copy(r.required||[]),items:copy(r.items)}:undefined,
   display:'after-submission-only; never prefill draft',assistance:'incorrect-item-explanation-counts-as-help',preserveCorrectDraft:true};
 }
 const entries=[];
 for(const s of logic.sections)for(const e of [s.guidedPractice,...s.independentApplication.rounds])entries.push(entry('aib/'+s.id+'/'+e.stage+'/'+e.id,e.round,e.round.unitIds,s.learnerGoals));
 for(const s of legacy.chapters.flatMap(c=>c.sections))for(const r of s.independentActivity.rounds)entries.push(entry('legacy/'+s.id+'/'+r.id,r,s.roundUnitIds[r.id],s.learnerGoals));
 const old=require('./templates/core-foundations.cjs').activity.rounds.find(r=>r.id==='repair-mapping');
 const archived=entry('archive/legacy/1.1/repair-mapping',old,['1.1-lesson-2','1.1-lesson-3','1.1-lesson-4'],[L('依据参数是否改变区分训练和推理，而不是输入代码。','Distinguish training and inference from parameter changes rather than code entry.')],{archive:true});
 archived.checks.eventA.expectedExplanation=L('A 没有更新参数，使用已有模型回答新工单，属于推理。','A does not update parameters and uses the existing model on a new ticket: inference.');
 archived.checks.eventA.reviewLinks=links(['1.1-lesson-4']);
 archived.checks.eventB.expectedExplanation=L('B 根据样本调整参数，改变了模型，属于训练。','B adjusts parameters from examples and changes the model: training.');
 archived.checks.eventB.reviewLinks=links(['1.1-lesson-3']);
 return {schemaVersion:1,revision:5,format:'b-c-item-feedback',binding:copy(logic.binding),activeEntries:entries,archivedEntries:[archived]};
}
function buildReplacementRegister(blueprint,audits,legacy){
 const old=require('./generated/aib-blueprint.v4.json'),oldLegacy=require('./generated/legacy-teaching-map.v4.json');
 const policy={oldAnswers:'historical-review-only; never-convert-codes-into-new-conceptual-answers',oldDraft:'retain-as-archived-draft; start-only-incompatible-new-activity-blank',completed:'recheck-signature-and-new-rubric; old-pass-is-not-B5-pass',preserve:['knowledge','found','favorites','filed','unrelated-chapter-progress','compatible-unmodified-activities'],noWholeSaveReset:true};
 return {schemaVersion:1,revision:5,format:'b-c-activity-replacements',policy,
  aib:audits.filter(a=>a.decision!=='retain').map(a=>({unitId:a.unitId,decision:a.decision,reason:a.reason,learnerGoal:a.learnerGoal,oldActivity:copy(old.units[a.unitId].activity),newActivity:copy(blueprint.units[a.unitId].activity),oldSignature:W.signature(old.units[a.unitId].activity),newSignature:W.signature(blueprint.units[a.unitId].activity)})),
  legacy:legacy.chapters.flatMap(c=>c.sections).map(s=>{const prev=oldLegacy.chapters.flatMap(c=>c.sections).find(x=>x.id===s.id);return {sectionId:s.id,oldActivity:copy(prev.activity),newActivity:copy(s.independentActivity),oldSignature:W.signature(prev.activity),newSignature:W.signature(s.independentActivity)};})};
}
module.exports={buildFeedbackCatalog,buildReplacementRegister};
