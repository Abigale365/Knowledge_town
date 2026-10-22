'use strict';
const C=require('../contracts'),W=require('../contracts/runtime/task-workshop-engine.js');
const L=(zh,en)=>({zh,en}),hash=x=>C.digest(JSON.stringify(x));
function initialAnswer(round){
 if(round.type==='sort')return {placements:{}};
 if(round.type==='order')return {order:[]};
 if(round.fields)return {values:Object.fromEntries(round.fields.map(f=>[f.id,'']))};
 return {selected:[]};
}
function witness(round){
 if(round.type==='sort')return {placements:Object.fromEntries(round.items.map(i=>[i.id,i.target]))};
 if(round.type==='order')return {order:[...round.expected]};
 if(round.fields)return {values:Object.fromEntries(round.fields.map(f=>[f.id,f.expected]))};
 if(round.type==='allocate'){
  for(let mask=0;mask<2**round.items.length;mask++){
   const a={selected:round.items.filter((_,i)=>mask&(1<<i)).map(i=>i.id)};if(W.grade(round,a))return a;
  }throw Error('Unsolvable teaching allocation');
 }
 return {selected:[...round.expected]};
}
function describeAnswer(r,a){
 if(r.type==='sort')return L(r.items.map(i=>i.text.zh+' → '+r.bins.find(b=>b.id===a.placements[i.id]).text.zh).join('；'),r.items.map(i=>i.text.en+' → '+r.bins.find(b=>b.id===a.placements[i.id]).text.en).join('; '));
 if(r.type==='order')return L(a.order.map(id=>r.items.find(i=>i.id===id).text.zh).join(' → '),a.order.map(id=>r.items.find(i=>i.id===id).text.en).join(' → '));
 if(r.fields)return L(r.fields.map(f=>f.label.zh+'：'+a.values[f.id]).join('；'),r.fields.map(f=>f.label.en+': '+a.values[f.id]).join('; '));
 if(r.type==='matrix')return L(a.selected.map(key=>{const [row,col]=key.split(':');return r.rows.find(i=>i.id===row).text.zh+' / '+r.columns.find(i=>i.id===col).text.zh;}).join('；'),a.selected.map(key=>{const [row,col]=key.split(':');return r.rows.find(i=>i.id===row).text.en+' / '+r.columns.find(i=>i.id===col).text.en;}).join('; '));
 const items=r.options||r.items;return L(a.selected.map(id=>items.find(i=>i.id===id).text.zh).join('；'),a.selected.map(id=>items.find(i=>i.id===id).text.en).join('; '));
}
function exerciseSpec(round,unitAudits,stage){
 const copy=structuredClone(round),audits=round.unitIds?.map(id=>unitAudits.get(id)).filter(Boolean)||[];
 const reason=copy.reason;
 return {id:round.id,stage,countsAsMastery:false,canCompleteApplication:stage==='independent',control:round.type,round:copy,
  initialState:initialAnswer(copy),operation:require('./teaching-map.cjs').controls[round.type].action,
  learnerDecision:audits.map(a=>a.thinking),evidenceOfUnderstanding:audits.map(a=>a.understandingEvidence),
  hints:stage==='independent'?[{level:1,kind:'knowledge-reference',unitIds:round.unitIds,when:'any-time',effect:'review-principles-not-the-case-answer'}]:[
   {level:1,text:audits.length?L(audits.map(a=>a.thinking.zh).join('；'),audits.map(a=>a.thinking.en).join('; ')):L('先分清题目要求与已有证据，说明为什么选这个答案。','Separate the requested judgment from the available evidence and explain the choice.')},
   {level:2,text:reason,when:'after-guided-attempt-or-explicit-reveal',effect:'guided-support-never-independent-credit'}],
  grading:{engine:'TaskWorkshop.grade',answerWitness:witness(copy),displayWitnessBeforeAttempt:false,
   completion:'correct-response',independentEvidence:'correct-without-case-solution-reveal',revealedRetry:'correction-completion-only; formal-new-case-assessment-still-required'},
  incorrectFeedback:{diagnosticEngine:'diagnoseRound',preserveDraft:true,explanation:reason,explanationDisplay:'explicit-reveal-or-post-completion; sets-solutionRevealed',misconceptions:audits.map(a=>a.misconception),next:L('保留已正确的操作，检查标出的项目；可回看知识或主动查看本题解析。看解析后的完成记为订正。','Keep correct work and check the marked items. Revisit knowledge or explicitly reveal this solution; completion after reveal counts as correction.')},
  completionFeedback:L((stage==='independent'?'这项情境应用已通过。':'本次引导练习完成，但还不是独立应用通过。')+'请对照解析检查依据；不代表整章已掌握。',(stage==='independent'?'This scenario application passed. ':'This guided practice is complete, but independent application is not yet passed. ')+'Check the reasoning; this does not establish mastery of the chapter.')};
}
function buildTeachingLogic(pack,plan,audits){
 const byId=new Map(pack.units.map(u=>[u.id,u])),unitAudits=new Map(audits.map(a=>[a.unitId,a]));
 const scaffolds=require('./authored/section-scaffolds.v5.cjs').specs;
 const sections=plan.chapters.flatMap((ch,ci)=>ch.sections.map((s,si)=>{
  const key=`${ci+1}.${si+1}`,spec=scaffolds[key];if(!spec)throw Error('Missing teaching chain for '+key);
  const guided={...structuredClone(spec.guidedPractice.round),id:'guided'};if(guided.options)guided.options.sort((a,b)=>hash(key+a.id).localeCompare(hash(key+b.id)));
  if(guided.unitIds.some(id=>!s.learnUnitIds.includes(id)))throw Error('Guided practice requires untaught unit in '+key);
  if(!W.validPlan({version:1,kind:'guided',title:s.title,rounds:[{...guided,skills:guided.unitIds}]}))throw Error('Invalid guided exercise '+key);
  const independent=s.activity.rounds.map(r=>exerciseSpec(r,unitAudits,'independent'));
  const relevant=s.learnUnitIds.map(id=>unitAudits.get(id));
  return {id:s.id,chapterId:ch.id,compiledSectionId:key,title:s.title,
   learnerGoals:relevant.map(a=>a.learnerGoal),necessaryKnowledge:s.learnUnitIds.map(id=>({unitId:id,title:byId.get(id).title,
    prerequisiteIds:byId.get(id).prerequisiteIds,explanation:byId.get(id).explanation,evidence:byId.get(id).evidence})),
   browsing:{availability:'always-within-entered-chapter',countsAsFound:false,countsAsMastery:false},
   discoveryAndFiling:{sceneDiscovery:'real-scene-object-only',favoriteRequires:'scene-discovery',previewEffect:'view-only',
    carriedItems:'favorites-minus-filed',filedItems:'readable-in-material-box-not-carried',
    foundationMeaning:L('我已查看本项基础，准备练习；不是理解已通过。','I have reviewed this foundation and am ready to practice; understanding is not yet passed.'),
    afterFoundAll:L('本节物件已找到。可收藏想保留的物件，读完后整理入柜，再进入学习示范与练习。','This section’s objects are found. Favorite items you want to keep, read and file them, then enter the worked example and practice.'),
    afterFiled:L('本节基础已整理。先看示范，再做引导练习，最后在新情境中独立应用。','Foundations are organized. View the worked example, try guided practice, then apply the ideas in a new situation.'),
    collectionEffect:'optional-and-never-substitutes-for-application',storageChange:'none-requested-use-existing-game-records'},
   demonstration:{...structuredClone(spec.demonstration),stage:'demonstration',label:L('示范：看老师怎样判断，不计掌握','Worked example: inspect the reasoning; not mastery'),
    operation:'read-worked-reasoning-no-answer-entry',initialState:'reasoning-visible',completion:'viewed-only'},
   guidedPractice:{...exerciseSpec(guided,unitAudits,'guided'),label:L('引导练习：可以看提示，完成后还要换情境应用','Guided practice: hints are available; a new application follows'),workedAnswer:describeAnswer(guided,witness(guided)),
    workedAnswerDisplay:{beforeAttempt:false,reveal:'after-guided-attempt-or-explicit-reveal',countsAsMastery:false}},
   independentApplication:{label:L('独立应用：用新情境检验判断，知识仍可回看','Independent application: reason in a new situation; knowledge remains available'),
    prerequisiteSectionIds:s.prerequisiteSectionIds,requiresFoundations:s.learnUnitIds,rounds:independent,
    completion:'all-independent-rounds-pass',doesNotAccept:['demo-viewed','guided-correct','collection-count','foundation-confirmed-alone']},
   formalAssessment:{questionIds:s.questions.map(q=>q.id),availability:'after-whole-chapter-independent-applications',passThreshold:0.9,
    independentOf:['demo-completion','guided-completion','favorite-count'],errorReview:'available-after-submission-including-failure'},
   review:L('错误时回看对应知识与解析，区别判断依据和表面线索；之后换情境再检验。','On errors revisit the linked knowledge and reasoning, distinguish evidence from surface cues, then test a different situation.')};
 }));
 return {schemaVersion:1,format:'b-c-teaching-logic',revision:5,
  binding:{knowledgePackId:pack.id,knowledgeRevision:pack.revision,knowledgeHash:hash(pack),planId:plan.id,planRevision:plan.revision,planHash:hash(plan)},
  policy:{knowledge:'always-readable',discovery:'preview-is-not-found',favorite:'found-before-favorite',filing:'filed-leaves-carried-and-stays-in-material-box',
   demonstration:'show-reasoning-do-not-grade-as-mastery',guided:'hints-and-reveal-allowed-not-independent-pass',independent:'new-situation-taskworkshop-grade',
   assessment:'whole-chapter-then-formal-exam-90-percent',chapters:'independent-entry-local-prerequisite-review',
   notClaimed:'Structure checks and successful retries do not establish psychometric validity or resistance to memorization.'},sections};
}
// Pure reference rules. C adapts them to its existing records; no new game-save schema is imposed.
function canFavorite(unitId,{foundIds=[]}={}){return foundIds.includes(unitId);}
function inventory({favoriteIds=[],filedIds=[]}={}){return {carried:[...new Set(favoriteIds)].filter(id=>!filedIds.includes(id)),filed:[...new Set(filedIds)]};}
function gradeStage(stage,round,answer,{solutionRevealed=false}={}){
 if(stage==='demonstration')return {correct:null,applicationCompleted:false,applicationCredit:false,formalAssessmentStillRequired:true,meaning:'worked-example-only'};
 if(!['guided','independent'].includes(stage))throw Error('Unknown teaching stage');
 const correct=W.grade(round,answer),applicationCompleted=stage==='independent'&&correct;
 return {correct,applicationCompleted,applicationCredit:applicationCompleted&&!solutionRevealed,
  meaning:stage==='guided'?'guided-practice-only':solutionRevealed?'corrected-application-not-independent-evidence':'scenario-application',
  formalAssessmentStillRequired:true};
}
// Local diagnostic feedback retains the submitted work and never substitutes a solved draft.
// Marking a cell/choice in a binary task can reveal its solution: conservatively treat all
// item-level grading as assisted evidence, even when full reasoning was not requested.
function diagnoseRound(r,answer,feedback){
 if(feedback&&(feedback.roundHash!==hash(r)||feedback.roundId!==r.id))throw Error('Feedback snapshot differs from this round');
 const checks=[],add=(id,label,correct,message)=>checks.push({id,label,correct,message});
 const retry=L('检查这一项与题目证据是否一致；其他正确操作保留。','Check this item against the scenario evidence; keep correct work.');
 if(r.type==='sort')for(const i of r.items)add(i.id,i.text,answer?.placements?.[i.id]===i.target,retry);
 else if(r.fields)for(const f of r.fields){const mini={...r,fields:[f]};add(f.id,f.label,W.grade(mini,answer),L('核对本字段的计算口径、单位与题目依据。','Check this field’s scope, units and scenario evidence.'));}
 else if(r.type==='order')for(const [index,id]of (Array.isArray(answer?.order)?answer.order:[]).entries())add(id,r.items.find(i=>i.id===id)?.text||L('未知项目','Unknown item'),r.expected[index]===id,L('检查这一步依赖的产物是否已准备好。','Check whether the artifacts required by this step are ready.'));
 else if(r.type==='matrix')for(const row of r.rows)for(const col of r.columns){const id=row.id+':'+col.id;add(id,L(row.text.zh+' / '+col.text.zh,row.text.en+' / '+col.text.en),(Array.isArray(answer?.selected)?answer.selected:[]).includes(id)===r.expected.includes(id),retry);}
 else if(r.type==='choose')for(const i of r.options)add(i.id,i.text,(Array.isArray(answer?.selected)?answer.selected:[]).includes(i.id)===r.expected.includes(i.id),retry);
 else if(r.type==='allocate'){
  const selected=(Array.isArray(answer?.selected)?answer.selected:[]).map(id=>r.items.find(i=>i.id===id));
  add('allowed',L('所选方案可用','Selected options are allowed'),selected.every(i=>i&&!i.blocked),retry);
  add('budget',L('预算约束','Budget constraint'),selected.every(Boolean)&&selected.reduce((n,i)=>n+i.cost,0)<=r.budget,retry);
  add('value',L('目标约束','Target constraint'),selected.every(Boolean)&&selected.reduce((n,i)=>n+i.value,0)>=r.minimumValue,retry);
  add('required',L('必要条件','Required conditions'),(r.required||[]).every(id=>(Array.isArray(answer?.selected)?answer.selected:[]).includes(id)),retry);
 }
 const correct=W.grade(r,answer);
 if(r.type==='order'){
  const order=answer?.order||[];
  if(!Array.isArray(order)||order.length!==r.items.length)add('sequence-length',L('步骤尚未全部安排','Not all steps are placed'),false,L('每张工作卡恰好使用一次，补齐尚未安排的步骤。','Use each work card exactly once and place the remaining steps.'));
  if(Array.isArray(order)&&(new Set(order).size!==order.length||order.some(id=>!r.items.some(i=>i.id===id))))add('sequence-items',L('步骤记录有重复或未知项目','Duplicate or unknown steps'),false,retry);
 }
 if(r.type==='sort'&&Object.keys(answer?.placements||{}).some(id=>!r.items.some(i=>i.id===id)))add('unknown-placement',L('分类中有不属于本题的项目','A placement does not belong to this task'),false,retry);
 if(['choose','matrix','allocate'].includes(r.type)){
  const selected=answer?.selected;
  const validIds=r.type==='matrix'?r.rows.flatMap(row=>r.columns.map(col=>row.id+':'+col.id)):(r.options||r.items).map(i=>i.id);
  if(!Array.isArray(selected)||new Set(selected).size!==selected.length||selected.some(id=>!validIds.includes(id)))add('selection-record',L('选择记录须无重复且属于本题','Selections must be unique and belong to this task'),false,retry);
 }
 if(!correct&&!checks.some(c=>!c.correct))add('response-record',L('答题记录不完整','Incomplete response record'),false,L('补齐本题操作；保留已有正确项目，不要复制其他题的作答记录。','Complete this task while retaining correct work; do not copy another task’s response record.'));
 if(feedback)for(const check of checks){
  const rule=feedback.checks[check.id];check.reviewLinks=structuredClone(rule?.reviewLinks||feedback.reviewLinks);
  if(rule){check.message=check.correct?L('此项符合题目证据，保留当前操作。','This item agrees with the scenario evidence; keep this work.'):structuredClone(rule.expectedExplanation);check.reason=structuredClone(rule.reason);}
 }
 if(feedback&&r.type==='allocate'){
  const ids=Array.isArray(answer?.selected)?answer.selected:[],items=ids.map(id=>r.items.find(i=>i.id===id)),known=items.every(Boolean);
  const bad=items.filter(i=>!i||i.blocked),cost=known?items.reduce((n,i)=>n+i.cost,0):null,value=known?items.reduce((n,i)=>n+i.value,0):null;
  const missing=(r.required||[]).filter(id=>!ids.includes(id)).map(id=>r.items.find(i=>i.id===id));
  for(const check of checks.filter(c=>!c.correct)){
   if(check.id==='allowed')check.message=L('当前选中了不可用项目：'+bad.map(i=>i?.text.zh||'不属于本题的项目').join('、')+'。','Unavailable selections: '+bad.map(i=>i?.text.en||'an item outside this task').join(', ')+'.');
   if(check.id==='budget')check.message=known?L('当前总成本'+cost+'，预算'+r.budget+'，超出'+(cost-r.budget)+'。请调整组合。','Current total cost '+cost+', budget '+r.budget+', excess '+(cost-r.budget)+'. Revise the combination.'):L('选择中有未知项目，无法核算总成本；先移除不属于本题的项目。','An unknown selection prevents cost calculation; remove items outside this task first.');
   if(check.id==='value')check.message=known?L('当前目标值'+value+'，最低要求'+r.minimumValue+'，还缺'+(r.minimumValue-value)+'。','Current value '+value+', minimum '+r.minimumValue+', shortfall '+(r.minimumValue-value)+'.'):L('选择中有未知项目，无法核算目标值。','An unknown selection prevents value calculation.');
   if(check.id==='required')check.message=L('尚未满足的必要项：'+missing.map(i=>i.text.zh).join('、')+'。','Missing required items: '+missing.map(i=>i.text.en).join(', ')+'.');
  }
 }
 return {correct,checks,draft:structuredClone(answer||{}),preserveCorrectOperations:true,assistanceRevealed:!correct,fullReasonRevealed:false};
}
module.exports={buildTeachingLogic,initialAnswer,witness,describeAnswer,canFavorite,inventory,gradeStage,diagnoseRound};
