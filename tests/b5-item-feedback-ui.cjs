'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),B=require('../packages/learning-design/teaching-logic.v5.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('legacy5')");
 for(const id of h.run('studySection().lessons.map(l=>l.id)')){h.run(`openStudyLesson(${JSON.stringify(id)})`);h.click('confirmFoundation');}
 h.run('openTaskWorkshop()');h.click('b5DemoDone');const guided=h.run('teachingContext().flow.section(studySection().id).policy.guidedPractice.round');h.run(`Object.assign(teachingContext().p.guided[studySection().id].draft,${JSON.stringify(B.witness(guided))})`);h.click('b5GuidedSubmit');
 let round=h.run('studySection().activity.rounds[WorkshopEngine.progress(studyState(),studySection()).round]');
 while(round.id!=='inspect-model-work'){h.run(`Object.assign(WorkshopEngine.progress(studyState(),studySection()).draft,${JSON.stringify(B.witness(round))})`);h.click('workshopSubmit');h.click('workshopNext');round=h.run('studySection().activity.rounds[WorkshopEngine.progress(studyState(),studySection()).round]');}
 const answer=B.initialAnswer(round);h.run(`Object.assign(WorkshopEngine.progress(studyState(),studySection()).draft,${JSON.stringify(answer)});changeTownLanguage('zh')`);h.click('workshopSubmit');
 assert.ok(h.get('workshopFeedback').innerHTML.includes('属于训练'));assert.ok(h.get('workshopFeedback').innerHTML.includes('属于推理'));assert.equal(h.run('teachingContext().p.assistance[studySection().id+":inspect-model-work"].solutionRevealed'),true);
 const draft=h.run('JSON.stringify(WorkshopEngine.progress(studyState(),studySection()).draft)');h.run("changeTownLanguage('en')");assert.ok(h.get('workshopFeedback').innerHTML.includes('locked weights'));assert.equal(h.run('JSON.stringify(WorkshopEngine.progress(studyState(),studySection()).draft)'),draft);
 h.list('[data-tf-review]')[0].click();h.click('lessonBack');assert.equal(h.run('JSON.stringify(WorkshopEngine.progress(studyState(),studySection()).draft)'),draft);
 assert.ok(h.run('!!L.restore(JSON.stringify(state))'));console.log('PASS: reviewed training/inference feedback appears in actual B5 UI; language/review preserve draft and assistance. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
