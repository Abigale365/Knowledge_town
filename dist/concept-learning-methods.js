(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ConceptLearningMethods=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const kinds=['sample-trainer','cluster-builder','reward-path'];
const msg=(zh,en)=>({zh,en});
function init(d){if(!kinds.includes(d.kind))throw Error('Unsupported kind');return d.kind==='sample-trainer'?{selected:[],k:null,prediction:null,tested:false}:d.kind==='cluster-builder'?{placements:{},checked:false,description:null}:{active:null,visits:{},comparison:null,policy:null};}
function step(d,input,a){
 const data=JSON.parse(JSON.stringify(input)),c=d.config,feedback=[];let passed=false;
 const f=(id,ok,zh,en)=>feedback.push({itemId:id,correct:ok,message:msg(zh,en),knowledgeIds:[d.sourceUnitId]});
 if(d.kind==='sample-trainer'){
  if(a.type==='select'){
   const s=c.samples.find(x=>x.id===a.sampleId);if(!s)throw Error('Unknown sample');
   if(s.y===null)f(s.id,false,'此记录没有目标标签，不能用于本题监督拟合；已选样本保留。','This record has no target label and cannot enter this supervised fit; selected samples remain.');
   else {if(!data.selected.includes(s.id)){data.selected.push(s.id);data.k=null;data.prediction=null;data.tested=false;}f(s.id,true,'已选带目标的样本；接下来用样本拟合。','Labeled sample selected; use the examples to fit next.');}
  }else if(a.type==='fit'){
   if(data.selected.length<c.minimumSamples)f('fit',false,`需要至少 ${c.minimumSamples} 个带目标样本。`,`At least ${c.minimumSamples} labeled examples are required.`);
   else {const ss=data.selected.map(id=>c.samples.find(s=>s.id===id));data.k=ss.reduce((v,s)=>v+s.y/s.x,0)/ss.length;data.prediction=null;data.tested=false;f('fit',true,`拟合得到 k=${data.k}；保留输入未参加拟合。`,`Fit gives k=${data.k}; the held-out input was excluded from fitting.`);}
  }else if(a.type==='predict'){
   if(data.k===null)f('prediction',false,'先利用带标签样本拟合。','Fit from labeled examples first.');
   else if(!c.predictionOptions.includes(a.value))throw Error('Unknown prediction');
   else {data.prediction=a.value;data.tested=false;}
  }else if(a.type==='test'){
   if(data.prediction===null)f('prediction',false,'先对未参加拟合的输入作预测。','Predict the excluded input before testing.');
   else {data.tested=data.prediction===c.holdout.y&&data.k*c.holdout.x===c.holdout.y;f('prediction',data.tested,`保留输入 ${c.holdout.x} 的目标为 ${c.holdout.y}；本规则输出 ${data.k*c.holdout.x}。一次吻合不证明一般泛化。`,`The held-out input ${c.holdout.x} has target ${c.holdout.y}; this rule outputs ${data.k*c.holdout.x}. One match does not prove generalization.`);}
  }else throw Error('Unknown action');
  passed=data.tested;
 }else if(d.kind==='cluster-builder'){
  if(a.type==='place'){
   if(!c.points.some(p=>p.id===a.pointId)||!c.groups.some(g=>g.id===a.groupId))throw Error('Unknown point/group');
   data.placements[a.pointId]=a.groupId;data.checked=false;data.description=null;
  }else if(a.type==='check'){
   let valid=true;
   for(const p of c.points)if(!data.placements[p.id]){valid=false;f(p.id,false,'这个点尚未放入组；其它位置保留。','This point has not been grouped; other placements remain.');}
   for(const g of c.groups){const ps=c.points.filter(p=>data.placements[p.id]===g.id);const range=ps.length?Math.max(...ps.map(p=>p.value))-Math.min(...ps.map(p=>p.value)):null;const ok=ps.length>=c.minimumPerGroup&&range<=c.maximumRange;valid=valid&&ok;f(g.id,ok,`本组 ${ps.length} 点，数值差 ${range===null?'未定':range}；需至少 ${c.minimumPerGroup} 点且差≤${c.maximumRange}。`,`This group has ${ps.length} points and range ${range===null?'undefined':range}; need at least ${c.minimumPerGroup} points and range ≤${c.maximumRange}.`);}
   data.checked=valid;
  }else if(a.type==='describe'){
   if(!c.descriptions.some(x=>x.id===a.decision))throw Error('Unknown description');
   if(!data.checked)f('description',false,'先检查分组满足特征距离约束。','Check the feature-distance constraints first.');
   else {data.description=a.decision;f('description',a.decision===c.supportedDescription,'这些数据只支持数值特征的相似性；没有收入或客户价值标签。','These data support numeric similarity only; no income or customer-value labels were provided.');}
  }else throw Error('Unknown action');
  passed=data.checked&&data.description===c.supportedDescription;
 }else if(d.kind==='reward-path'){
  if(a.type==='advance'){
   const p=c.paths.find(x=>x.id===a.pathId);if(!p)throw Error('Unknown path');
   if(data.active&&data.active!==p.id)f(p.id,false,'先走完当前路线的两步，避免把不同路线的奖励混算。','Finish both steps on the current route before switching so rewards are not mixed.');
   else {const seen=data.visits[p.id]||[];if(seen.length>=c.rounds)f(p.id,false,'这条路线已观察完；保留记录，去观察另一条。','This route is complete; keep its record and observe the other.');else {data.active=p.id;seen.push(p.rewards[seen.length]);data.visits[p.id]=seen;if(seen.length===c.rounds)data.active=null;f(p.id,true,`本步奖励 ${seen[seen.length-1]}；目前累计 ${seen.reduce((x,y)=>x+y,0)}。`,`Reward this step: ${seen[seen.length-1]}; cumulative return so far: ${seen.reduce((x,y)=>x+y,0)}.`);}}
  }else if(a.type==='compare'){
   if(!c.paths.every(p=>(data.visits[p.id]||[]).length===c.rounds))f('comparison',false,'两条路线都走完后再比较长期累计回报。','Complete both routes before comparing cumulative returns.');
   else {const totals=Object.fromEntries(c.paths.map(p=>[p.id,data.visits[p.id].reduce((x,y)=>x+y,0)]));let ok=true;for(const p of c.paths){const right=a.totals&&a.totals[p.id]===totals[p.id];ok=ok&&right;f(p.id,right,`本路线逐步奖励 ${data.visits[p.id].join('，')}，累计 ${totals[p.id]}。`,`Observed rewards ${data.visits[p.id].join(', ')} sum to ${totals[p.id]}.`);}if(ok)data.comparison=totals;}
  }else if(a.type==='policy'){
   if(!c.paths.some(p=>p.id===a.pathId))throw Error('Unknown path');
   if(!data.comparison)f('policy',false,'先完成奖励核算；不要只凭首步奖励决策。','Calculate cumulative rewards first; do not decide from the first reward alone.');
   else {const best=Math.max(...Object.values(data.comparison));data.policy=a.pathId;f('policy',data.comparison[a.pathId]===best,'下一轮按已观察的累计回报选路；这不证明未知环境中的一般最优。','Use the observed cumulative returns for the next route; this does not prove general optimality in an unknown environment.');}
  }else throw Error('Unknown action');
  passed=!!data.comparison&&data.policy!==null&&data.comparison[data.policy]===Math.max(...Object.values(data.comparison));
 }else throw Error('Unsupported kind');
 return {data,feedback,passed};
}
return {kinds,init,step};
});
