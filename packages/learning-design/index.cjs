'use strict';
const C=require('../contracts');
async function designLearning(pack,{design,signal}={}){C.assertValid(C.validateKnowledge(pack));if(typeof design!=='function')throw Error('需要提供教学设计适配器 design；不能用统一配对模板替代教学设计。');signal?.throwIfAborted();const plan=await design(structuredClone(pack),{signal});signal?.throwIfAborted();try{C.assertValid(C.validateLearningPlan(pack,plan));}catch(error){error.candidate=plan;throw error;}return plan;}
module.exports={designLearning,validateLearningPlan:C.validateLearningPlan,...require('./prompts.cjs')};
