'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
const conceptFixture=require('./concept-game-fixture.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});const first=h.run('studySection().lessons[0].id');h.run(`openStudyLesson(${JSON.stringify(first)},false,null,true)`);conceptFixture.complete(h,first);h.run('close();openStudyBasket()');h.get('dialog').scrollTop=240;
 h.list('[data-foundation-lesson]')[0].click();assert.ok(h.get('lessonBack'));h.click('favoriteKnowledge');assert.ok(h.get('lessonBack'));h.run("changeTownLanguage('bi')");h.click('lessonBack');assert.ok(h.get('sealBasket'));assert.equal(h.get('dialog').scrollTop,240);
 h.list('[data-foundation-lesson]')[0].click();h.click('confirmFoundation');assert.ok(h.get('sealBasket'),'confirmation returns to source list');
 h.run('showKnowledgeChest()');h.get('dialog').scrollTop=180;h.list('[data-reread]').find(e=>!e.disabled).click();h.click('lessonBack');assert.ok(h.get('teachingFavoriteShelf'));assert.equal(h.get('dialog').scrollTop,180);
 h.run('previewSceneDevice(studyChapter().sections[1].id)');h.list('[data-preview-lesson]')[0].click();assert.ok(h.get('lessonBack'));h.click('lessonBack');assert.ok(h.get('sceneDeviceStart'));
 h.run('close();openStudyLesson(studySection().lessons[0].id)');assert.ok(!h.get('lessonBack'),'direct scene entry has no stale previous page');
 const second=h.run('studySection().lessons[1].id');h.run(`close();openStudyLesson(${JSON.stringify(second)},false,null,true)`);conceptFixture.complete(h,second);h.click('confirmFoundation');assert.ok(h.get('sealBasket'),'direct knowledge confirmation must return to the section list too');
 console.log('PASS: workshop/chest/preview details return to their source and scroll position; favorites/language retain navigation; direct scene entry has no stale back target. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
