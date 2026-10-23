'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),B=require('../packages/learning-design/teaching-logic.v5.cjs');
const conceptFixture=require('./concept-game-fixture.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('aib5')");const cp=h.run('teachingContext().entry.micro[0].checkpoints[0]');assert.ok(!h.get('b5MicroTray'));
 for(const sourceId of cp.requiredReviewedKnowledgeIds){const lesson=h.run(`currentCourse().chapters.flatMap(c=>c.sections.flatMap(s=>s.lessons)).find(l=>l.sourceUnitId===${JSON.stringify(sourceId)}).id`);h.run(`openStudyLesson(${JSON.stringify(lesson)})`);}
 assert.ok(h.get('b5MicroTray'),'reading the last prerequisite must immediately refresh optional practice');h.run('close()');assert.ok(h.get('b5MicroTray'));h.list('[data-b5-micro]')[0].click();assert.ok(h.get('b5GuidedSubmit'));assert.equal(h.run('teachingStageStatus().stage'),'foundation');
 const round=h.run(`teachingContext().entry.microExercises[${JSON.stringify(cp.exerciseRef.sectionId)}].round`),answer=B.witness(round);h.run(`Object.assign(teachingContext().p.micro[${JSON.stringify(cp.exerciseRef.sectionId)}].draft,${JSON.stringify(answer)})`);h.click('b5GuidedSubmit');assert.equal(h.run('studyState().sealed.length'),0);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 const lessons=h.run('studySection().lessons.map(l=>l.id)');for(const id of lessons){h.run(`openStudyLesson(${JSON.stringify(id)},false,null,true)`);conceptFixture.complete(h,id);h.click('confirmFoundation');}
 h.run('openTaskWorkshop()');h.click('b5DemoDone');assert.ok(h.get('workshopSubmit'),'already completed shared micro exercise must not be required again');
 console.log('PASS: micro checks unlock only after all prerequisite reading, remain optional, preserve progress and reuse completed guidance without repeating it. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
