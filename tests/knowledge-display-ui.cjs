'use strict';
// Actual index script order in the simulated DOM; no visual-layout claims.
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});
 for(const route of ['legacy','legacy5']){
  h.run(`close();openTeachingCourse(${JSON.stringify(route)})`);
  const before=h.run('JSON.stringify(currentCourse())'),rows=h.run('KnowledgeDisplayErrata.corrections.filter(c=>c.binding.courseId===currentCourse().id)');
  assert.equal(rows.length,3);
  for(const row of rows){
   const id=JSON.stringify(row.binding.lessonId),key=JSON.stringify(row.field.slice(3));
   h.run(`openStudyLesson(${id},false,null,true)`);
   const text=h.run(`knowledgeText(studySection().lessons.find(l=>l.id===${id}),${key})`);
   assert.equal(h.run(`TownLocale.pair(${JSON.stringify(text)},translateTownText).en`),row.after);
   assert.equal(h.run(`studySection().lessons.find(l=>l.id===${id}).en[${key}]`),row.before);
   const mismatched=h.run(`(()=>{const l=JSON.parse(JSON.stringify(studySection().lessons.find(l=>l.id===${id})));l.title+=' changed';const t=knowledgeText(l,${key});return TownLocale.pair(t,translateTownText).en;})()`);
   assert.equal(mismatched,row.before,'changed lesson must use baseline display');
  }
  assert.equal(h.run('JSON.stringify(currentCourse())'),before,'projection must not change any binding digest');
 }
 console.log('PASS: six reviewed English display corrections, exact binding and unchanged course objects');
})().catch(error=>{console.error(error);process.exitCode=1;});
