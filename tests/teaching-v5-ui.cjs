'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),B=require('../packages/learning-design/teaching-logic.v5.cjs');
(async()=>{
 let h=await harness(new Map(),{entrySchedule:true});h.run('close()');assert.equal(h.run('teachingEntry().revision'),5);
 for(const which of ['legacy5','aib5']){
  h.run(`openTeachingCourse(${JSON.stringify(which)})`);const sec=h.run('JSON.parse(JSON.stringify(studySection()))');
  h.run('openTaskWorkshop()');assert.ok(h.get('sealBasket'));assert.ok(!h.get('b5DemoDone'));
  for(const l of sec.lessons){h.run(`openStudyLesson(${JSON.stringify(l.id)})`);h.click('confirmFoundation');}
  h.run('openTaskWorkshop()');assert.ok(h.get('b5DemoDone'));h.click('b5DemoDone');assert.ok(h.get('b5GuidedSubmit'));
  const guided=h.run('teachingContext().flow.section(studySection().id).policy.guidedPractice.round');
  h.click('b5GuidedSubmit');assert.ok(h.get('b5GuidedFeedback').innerHTML.includes('teaching-feedback'));
  const correct=B.witness(guided);h.run(`Object.assign(teachingContext().p.guided[studySection().id].draft,${JSON.stringify(correct)})`);h.click('b5GuidedSubmit');assert.ok(h.get('workshopSubmit'));
  const first=sec.activity.rounds[0];h.click('workshopSubmit');assert.ok(h.run(`teachingContext().p.assistance[studySection().id+':'+${JSON.stringify(first.id)}].solutionRevealed`));assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),0);
  h.run('save()');await new Promise(r=>setImmediate(r));h=await harness(h.data,{entrySchedule:true});h.run('close();openTaskWorkshop()');assert.ok(h.get('workshopSubmit'));assert.ok(h.run(`teachingContext().p.assistance[studySection().id+':'+${JSON.stringify(first.id)}].solutionRevealed`));
  for(const r of sec.activity.rounds){h.run(`Object.assign(WorkshopEngine.progress(studyState(),studySection()).draft,${JSON.stringify(B.witness(r))})`);h.click('workshopSubmit');h.click('workshopNext');}
  h.click('workshopFinish');assert.ok(h.run(`studyState().sealed.includes(${JSON.stringify(sec.id)})`));assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 }
 const selected=h.run('state.selected');h.run("openTeachingCourse('legacy')");assert.equal(h.run('teachingEntry().revision'),4);h.run(`state.selected=${JSON.stringify(selected)};render()`);assert.equal(h.run('teachingEntry().revision'),5);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 h.run('replayStudyChapter()');h.click('confirmStudyReplay');assert.equal(h.run('studyState().sealed.length'),0);assert.equal(h.run('teachingContext().p.demonstrations.length'),0);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 console.log('PASS: both B5 first sections require demonstrations/guided work, retain failed drafts and assistance across reload, finish all actual independent rounds and restore saves. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
