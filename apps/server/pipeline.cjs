'use strict';
const K=require('../../packages/knowledge'),D=require('../../packages/learning-design'),Compiler=require('../../packages/course-compiler'),C=require('../../packages/contracts');
const {auditImportedKnowledge}=require('../../packages/knowledge/candidates/audit-import.cjs');
async function compilePreparedCourse({materialBundle,knowledgePack,learningPlan}={}, {signal}={}){
 const pack=await K.buildKnowledge(materialBundle,{signal,extract:async()=>knowledgePack});
 const audit=auditImportedKnowledge(pack,materialBundle);
 try{C.assertValid(audit.diagnostics);}catch(error){error.candidate=pack;error.candidateGaps=audit.candidateGaps;throw error;}
 const plan=await D.designLearning(pack,{signal,design:async()=>learningPlan});
 return {course:Compiler.compileCourse(pack,plan,{materialBundle}),diagnostics:audit.diagnostics.filter(d=>d.severity==='warning')};
}
module.exports={compilePreparedCourse};
