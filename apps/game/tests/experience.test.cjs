const test=require('node:test'),assert=require('node:assert/strict'),harness=require('../../../tests/town-harness.cjs');
const options={exam:true,learning:true,chapters:true,knowledge:true};
test('language switching retains live controls and drafts (simulated DOM; translation checked in browser)',async()=>{
 const h=await harness(new Map(),options);h.click('guideDismiss');
 h.run(`studyState().section=1;for(const l of studySection().lessons){CS.read(studyState(),currentCourse(),l.id);CS.collect(studyState(),currentCourse(),l.id);CS.deposit(studyState(),currentCourse(),l.id);}openTaskWorkshop();`);
 const first=h.list('[data-workshop-item]')[0];first.click();const selection=h.run('workshopSelected'),body=h.get('dialogBody'),html=body.innerHTML,dialog=h.get('dialog');
 h.run(`changeTownLanguage('en')`);assert.equal(dialog.open,true);assert.equal(body.innerHTML,html);assert.equal(h.run('workshopSelected'),selection);
 h.list('[data-workshop-bin]')[0].click();assert.ok(h.run('WorkshopEngine.progress(studyState(),studySection()).draft.placements')[selection]);
 h.run(`studyState().chapter=1;studyState().section=1;for(const l of studySection().lessons){CS.read(studyState(),currentCourse(),l.id);CS.collect(studyState(),currentCourse(),l.id);CS.deposit(studyState(),currentCourse(),l.id);}WorkshopEngine.submit(studyState(),studySection(),{placements:Object.fromEntries(studySection().activity.rounds[0].items.map(i=>[i.id,i.target]))});openTaskWorkshop();`);
 const input=h.list('[data-workshop-field]')[0];input.value='123';input.oninput();input.focus();h.run(`changeTownLanguage('bi')`);assert.equal(h.list('[data-workshop-field]')[0],input);assert.equal(input.value,'123');assert.equal(h.run('document.activeElement'),input);
 const before=h.run('JSON.stringify(studyState())');h.run('save()');await new Promise(r=>setImmediate(r));const restored=await harness(h.data,options);assert.equal(restored.run('state.language'),'bi');assert.equal(restored.run('JSON.stringify(studyState())'),before);
});
test('finds begin in central scene band and positions remain unique for large sections',async()=>{
 const h=await harness(new Map(),options);h.click('guideDismiss');
 for(const zone of ['grove','harbor','town','observatory']){
  const positions=h.run(`state.zone='${zone}';Array.from({length:25},(_,i)=>lessonPosition(i))`);
  assert.equal(new Set(positions.map(p=>p.id)).size,25);
  assert.ok(positions[0].x>=15&&positions[0].x<=85&&positions[0].y>=38&&positions[0].y<=64);
 }
});
const compile=require('../../../packages/course-compiler').compileCourse;
const bundle=require('../../../packages/contracts/fixtures/materials.v1.json'),pack=require('../../../packages/contracts/fixtures/knowledge.v1.json'),plan=require('../../../packages/contracts/fixtures/learning-plan.v1.json');
test('fixed v1 course retains four distinct workshop controls without UI-authored knowledge',async()=>{
 const course=compile(pack,plan,{materialBundle:bundle}),h=await harness(new Map(),options);h.click('guideDismiss');
 h.run(`const fixtureCourse=${JSON.stringify(course)};const fixtureBank=L.addBank(state,{title:fixtureCourse.title,kind:'contract fixture',cards:CourseSchema.cards(fixtureCourse)},Date.now());fixtureBank.syllabus=fixtureCourse;state.selected=fixtureBank.id;`);
 const expected=['sort','number','matrix','order'];
 for(let ci=0;ci<4;ci++){
  h.run(`studyState().chapter=${ci};studyState().section=0;for(const l of studySection().lessons){CS.read(studyState(),currentCourse(),l.id);CS.collect(studyState(),currentCourse(),l.id);CS.deposit(studyState(),currentCourse(),l.id);}openTaskWorkshop();`);
  assert.equal(h.run('studySection().activity.rounds[0].type'),expected[ci]);assert.ok(h.get('workshopSubmit'));assert.equal(h.list('[data-match-term]').length,0);
 }
});
test('adventure devices appear at their phase and replay leaves other chapters intact',async()=>{
 const h=await harness(new Map(),options);h.click('guideDismiss');h.click('seasideButton');if(h.get('adventureBegin'))h.click('adventureBegin');
 assert.equal(h.list('[data-future-device]').length,0);
 for(const id of ['pearl','coral','amber']){h.list('[data-away-item]').find(e=>e.dataset.awayItem===id).click();h.list('[data-away-target]')[0].click();}
 assert.equal(h.list('[data-away-dial]').length,3);assert.ok(h.list('[data-future-device]').every(e=>+e.dataset.futureDevice===0));
 const study=h.run('JSON.stringify(studyState())');h.run('awayProgress("winter").moves=7');h.click('replayAwayChapter');h.click('confirmChapterReplay');assert.equal(h.run('awayProgress("seaside").stage'),0);assert.equal(h.run('awayProgress("winter").moves'),7);assert.equal(h.run('JSON.stringify(studyState())'),study);
});
