'use strict';
const C=require('../../contracts'),{buildTransferCriteria}=require('./transfer-criteria.cjs'),{buildScopeReview}=require('./scope-review.cjs');
const L=(zh,en)=>({zh,en});
function buildScopedTransferCriteria(sidecar,pack,bundle){
 const base=buildTransferCriteria(sidecar,pack,bundle),{review,materials}=buildScopeReview(pack,bundle),result=structuredClone(base);
 const item=result.criteria.find(c=>c.distinctionId==='training-inference');
 if(!item)throw Error('Missing training-inference criterion');
 item.assumption=L('以下参数更新判据适用于明确给定的参数学习模型；不能作为所有机器学习方法的唯一定义。','The parameter-update criterion below applies to an explicitly specified parameter-learning model; it is not the sole definition across all machine-learning methods.');
 item.outcome=L('先确定学习方法；在给定参数学习模型中，结合参数更新与执行记录区分训练、推理和证据不足。','Identify the learning method first; for the specified parameter-learning model, use parameter-update and execution records to distinguish training, inference, and insufficient evidence.');
 item.vary=L('给定参数学习模型后改变业务场景与更新/请求记录；另给最近邻分类的带标签实例保存及预测流程，检验能否识别原判据的适用边界。','Specify a parameter-learning model, then vary the business setting and update/request records; separately supply labeled-instance retention and prediction steps for nearest-neighbor classification to test the boundary of the original criterion.');
 item.observe=[L('说明所给方法与学习阶段改变的状态；在参数学习模型中，不能只凭新输入判断训练。','Explain the specified method and the state changed during learning; for parameter-learning models, new inputs alone do not establish training.'),L('对最近邻对照，解释为何保存带标签训练实例可属于学习流程，而仅因没有神经网络权重更新就否认机器学习不成立。','For the nearest-neighbor contrast, explain why retaining labeled training instances can be part of learning and why absent neural-network weight updates do not rule out machine learning.')];
 item.insufficient=L('把所有新请求叫训练，把没有数值权重更新一律叫推理，或把任意保存文本都叫训练。','Calling every new request training, calling all activity without numerical weight updates inference, or calling any text storage training.');
 item.uncertainty=L('缺少算法、学习状态或执行记录时，列出所需信息；无更新记录不证明没有更新，不替未知方法猜结论。','When algorithm, learned-state, or execution records are missing, identify the needed information; absent update records do not prove no update, and do not guess for an unspecified method.');
 result.candidateRevision=2;result.requiresDDecisionToPromote=true;result.integrated=false;
 result.previousCriteriaContentHash=C.digest(JSON.stringify(base));result.scopeProposalContentHash=C.digest(JSON.stringify(review));result.scopeSourceMaterialContentHash=C.digest(JSON.stringify(materials));result.scopeSource=structuredClone(review.source);
 return result;
}
module.exports={buildScopedTransferCriteria};
if(require.main===module){const fs=require('node:fs'),path=require('node:path'),read=p=>JSON.parse(fs.readFileSync(path.join(__dirname,p),'utf8'));const result=buildScopedTransferCriteria(read('distinctions.v1.json'),read('../generated/knowledge.v3.json'),read('../generated/materials.v3.json'));fs.writeFileSync(path.join(__dirname,'transfer-criteria.v2.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({candidateRevision:result.candidateRevision,criteria:result.criteria.length,integrated:result.integrated}));}
