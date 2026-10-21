'use strict';
const K=require('../../packages/knowledge'),D=require('../../packages/learning-design'),Compiler=require('../../packages/course-compiler'),C=require('../../packages/contracts');
async function compilePreparedCourse({materialBundle,knowledgePack,learningPlan}={}, {signal}={}){
 const pack=await K.buildKnowledge(materialBundle,{signal,extract:async()=>knowledgePack});
 const plan=await D.designLearning(pack,{signal,design:async()=>learningPlan});
 return {course:Compiler.compileCourse(pack,plan,{materialBundle}),diagnostics:C.validateKnowledge(pack,materialBundle).filter(d=>d.severity==='warning')};
}
module.exports={compilePreparedCourse};
