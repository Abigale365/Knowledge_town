'use strict';
// Real view handlers in a simulated DOM. No layout or browser translation claims.
const test=require('node:test'),assert=require('node:assert/strict'),harness=require('../../../tests/town-harness.cjs');
const opts={entrySchedule:true};
const conceptFixture=require('../../../tests/concept-game-fixture.cjs');
// Keep the original regressions explicitly on B4 after D changes the fresh default to B5.
async function b4Harness(data=new Map()){const h=await harness(data,opts);if(h.run('teachingEntry()?.revision')===5)h.run("openTeachingCourse('legacy')");return h;}
const snapshot=h=>h.run('JSON.stringify({study:studyState(),teaching:teachingContext()?.p})');
function registeredText(h,html){
 const texts=[...html.matchAll(/>([^<>]+)</g)].map(m=>m[1].trim()).filter(t=>/[\u3400-\u9fff]/.test(t));
 assert.ok(texts.length);
 for(const value of texts){const pair=h.run(`TownLocale.pair(${JSON.stringify(value)},translateTownText)`);assert.ok(pair,'missing complete translation: '+value);assert.ok(!/[\u3400-\u9fff]/.test(pair.en),'mixed English: '+pair.en);}
}
test('welcome, reference pages and chapter brief have reversible copy without learning side effects',async()=>{
 const h=await b4Harness(),before=snapshot(h);
 for(const mode of ['zh','en','bi'])for(const page of ['overview','study','seaside','winter']){
  h.run(`state.language=${JSON.stringify(mode)};showGameGuide(false,${JSON.stringify(page)})`);
  registeredText(h,h.get('dialogBody').innerHTML);assert.equal(snapshot(h),before);
  assert.ok(!h.get('dialogBody').innerHTML.includes('全章基础收齐'));
 }
 h.run('showStudyBrief()');registeredText(h,h.get('dialogBody').innerHTML);
 assert.ok(h.get('dialogBody').innerHTML.includes('找到≠收藏≠归档≠应用通过'));
 h.click('briefStart');assert.equal(snapshot(h),before);
});
test('coach finds actual objects, then routes a removed favorite to the list without pointing at its old location',async()=>{
 const h=await b4Harness();h.run('showGameGuide(true)');h.click('guideDismiss');
 h.run('pointXY=(x,y)=>{globalThis.guideTestPoint={x,y};};beginStudyWalk()');
 assert.equal(h.get('gameCoach').dataset.guideStage,'find');assert.ok(h.run('guideTestPoint'));
 const item=h.list('[data-study-fruit]')[0];item.click();conceptFixture.complete(h,item.dataset.studyFruit);h.click('favoriteKnowledge');h.click('leaveLesson');
 assert.equal(h.get('gameCoach').dataset.guideStage,'confirm');
 h.run('guideTestPoint=null;guidePoint()');assert.equal(h.run('guideTestPoint'),null);
 assert.ok(h.get('sealBasket'));assert.equal(h.get('sealBasket').disabled,true);
 h.run('close();renderGameCoach()');registeredText(h,h.get('gameCoach').innerHTML);
 h.click('endGameCoach');assert.equal(h.run('guideState().walk'),null);
});
test('optional collection never blocks the coach from the real application workshop',async()=>{
 const h=await b4Harness();h.run('showGameGuide(true)');h.click('guideDismiss');h.run('beginStudyWalk()');
 const ids=h.run('studySection().lessons.map(l=>l.id)');
 for(const id of ids){h.run(`openStudyLesson(${JSON.stringify(id)},false,null,true)`);conceptFixture.complete(h,id);h.click('confirmFoundation');}
 assert.equal(h.run('teachingContext().p.favorites.length'),0);
 h.run('close();renderGameCoach()');assert.equal(h.get('gameCoach').dataset.guideStage,'apply');
 registeredText(h,h.get('gameCoach').innerHTML);h.click('gameCoachAction');assert.ok(h.get('workshopSubmit'));
 const before=h.run('WorkshopEngine.progress(studyState(),studySection()).round');
 h.click('workshopSubmit');assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),before);
 h.run('close();renderGameCoach()');assert.equal(h.get('gameCoach').dataset.guideStage,'apply');
});
test('submitted-chapter coaching takes priority over a previously completed first section and restores after reload',async()=>{
 const h=await b4Harness();h.run('showGameGuide(true)');h.click('guideDismiss');h.run('beginStudyWalk()');
 // Stage routing fixture only: full completion/restore validation belongs to teaching-v4-ui.
 h.run('studyState().sealed.push(studySection().id);studyState().submitted.push(studyState().chapter);renderGameCoach()');
 assert.equal(h.get('gameCoach').dataset.guideStage,'practice');
 assert.ok(!h.get('gameCoach').innerHTML.includes('整章收齐后'));
 registeredText(h,h.get('gameCoach').innerHTML);
 // Restore a valid, partially discovered course rather than the artificial stage fixture.
 h.run('studyState().sealed=[];studyState().submitted=[];renderGameCoach()');
 h.list('[data-study-fruit]')[0].click();h.click('leaveLesson');h.run('save()');
 const expected=snapshot(h),re=await b4Harness(h.data);assert.equal(snapshot(re),expected);
 assert.equal(re.run('guideState().walk.chapter'),0);
 const hasGame=re.run('!!ConceptGameHost.resolve(studySection().lessons[0].id)');
 assert.equal(re.get('gameCoach').dataset.guideStage,hasGame?'concept-game':'confirm');
});
test('legacy help retains assembly and collection while adventure help describes visible locked devices',async()=>{
 const h=await harness(new Map(),{exam:true,learning:true,chapters:true,knowledge:true});h.click('guideDismiss');
 assert.equal(h.run('!!guideTeaching()'),false);h.run("showGameGuide(false,'study')");
 registeredText(h,h.get('dialogBody').innerHTML);assert.ok(h.get('dialogBody').innerHTML.includes('兼容课程'));
 assert.ok(h.get('dialogBody').innerHTML.includes('组装'));
 h.run('beginStudyWalk()');assert.equal(h.get('gameCoach').dataset.guideStage,'legacy-find');
 h.run("openAwayScene('winter')");registeredText(h,h.get('adventureBrief').innerHTML);
 assert.ok(h.get('adventureBrief').innerHTML.includes('后续装置可查看'));
 h.click('adventureDetails');registeredText(h,h.get('dialogBody').innerHTML);
});
test('revisiting a sealed section suggests its first unfinished neighbor without changing completion',async()=>{
 const h=await b4Harness();h.run('showGameGuide(true)');h.click('guideDismiss');h.run('beginStudyWalk()');
 // Navigation fixture only; no claim that a forged seal passes validation.
 h.run('studyState().sealed.push(studySection().id);renderGameCoach()');
 assert.equal(h.get('gameCoach').dataset.guideStage,'continue');registeredText(h,h.get('gameCoach').innerHTML);
 const sealed=h.run('JSON.stringify(studyState().sealed)');h.click('gameCoachAction');
 assert.equal(h.run('studyState().section'),1);assert.equal(h.run('JSON.stringify(studyState().sealed)'),sealed);
 assert.equal(h.get('gameCoach').dataset.guideStage,'find');
});
test('reopening a submitted or ready-to-submit chapter guide leads to the current action, not another guide loop',async()=>{
 const h=await b4Harness();h.run('showGameGuide(true)');h.click('guideDismiss');
 // Stage-routing fixture only, not a claim that fabricated completion validates.
 h.run('studyState().submitted.push(0);showStudyBrief()');
 assert.ok(h.get('dialogBody').innerHTML.includes('本章已交付'));
 const submitted=snapshot(h);h.click('briefWalk');
 assert.ok(h.get('submitKnowledge'),'submitted guide must lead to the chest, not reopen reference help');
 assert.equal(snapshot(h),submitted);
 h.run('studyState().submitted=[];studyState().sealed=studyChapter().sections.map(s=>s.id);showStudyBrief()');
 assert.ok(h.get('dialogBody').innerHTML.includes('各节已完成'));
 const ready=snapshot(h);h.click('briefWalk');assert.ok(h.get('submitKnowledge'));assert.equal(snapshot(h),ready);
});
test('B5 coach follows actual foundation, worked-example, guided and independent gates without skipping',async()=>{
 const B=require('../../../packages/learning-design/teaching-logic.v5.cjs'),h=await harness(new Map(),opts);
 h.run("close();openTeachingCourse('aib5');beginStudyWalk()");assert.equal(h.run('teachingStageStatus().stage'),'foundation');
 const ids=h.run('studySection().lessons.map(l=>l.id)');
 for(const id of ids){h.run(`openStudyLesson(${JSON.stringify(id)},false,null,true)`);conceptFixture.complete(h,id);h.click('confirmFoundation');}
 h.run('close();beginStudyWalk()');assert.equal(h.get('gameCoach').dataset.guideStage,'demonstration');assert.ok(h.get('b5DemoDone'));
 for(const mode of ['zh','en','bi']){const before=snapshot(h);h.run(`state.language=${JSON.stringify(mode)};showGameGuide(false,'study')`);registeredText(h,h.get('dialogBody').innerHTML);assert.ok(h.get('dialogBody').innerHTML.includes('看示范'));assert.ok(h.get('dialogBody').innerHTML.includes('引导练习'));assert.equal(snapshot(h),before);}
 h.click('guideStudy');h.click('b5DemoDone');h.run('renderGameCoach()');assert.equal(h.get('gameCoach').dataset.guideStage,'guided');
 const guidedBefore=snapshot(h);h.run('showStudyBrief()');registeredText(h,h.get('dialogBody').innerHTML);h.click('briefWalk');assert.ok(h.get('b5GuidedSubmit'));assert.equal(snapshot(h),guidedBefore);
 const r=h.run('teachingContext().flow.section(studySection().id).policy.guidedPractice.round');
 h.run(`Object.assign(teachingContext().p.guided[studySection().id].draft,${JSON.stringify(B.witness(r))})`);h.click('b5GuidedSubmit');
 h.run('renderGameCoach()');assert.equal(h.get('gameCoach').dataset.guideStage,'independent');assert.ok(h.get('workshopSubmit'));
 const before=snapshot(h);h.run('showStudyBrief()');assert.ok(h.get('dialogBody').innerHTML.includes('独立应用'));h.click('briefWalk');assert.ok(h.get('workshopSubmit'));assert.equal(snapshot(h),before);
 // Completed-section priority remains above the B5 stage query; this is a navigation fixture.
 h.run('studyState().sealed.push(studySection().id);renderGameCoach()');assert.equal(h.get('gameCoach').dataset.guideStage,'continue');
});
