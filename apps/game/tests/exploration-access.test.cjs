const test=require('node:test'),assert=require('node:assert/strict'),harness=require('../../../tests/town-harness.cjs');
const opts={exam:true,learning:true,chapters:true,knowledge:true};
test('look ahead at devices, lessons, tools and assessment without unlocking or collecting',async()=>{
 const h=await harness(new Map(),opts);h.click('guideDismiss');
 const progress=h.run('JSON.stringify(studyState())'),inventory=h.run('JSON.stringify(state.play.inventory)');
 assert.equal(h.list('[data-section-device]').length,h.run('studyChapter().sections.length'));assert.ok(h.list('[data-object]').length>0);assert.ok(h.get('sceneAssessmentDevice'));
 h.list('[data-study-section]')[1].click();assert.equal(h.run('studyState().section'),0);assert.equal(h.get('sceneDeviceStart').disabled,true);
 const future=h.run('studyChapter().sections[1].lessons[0]');h.list('[data-preview-lesson]')[0].click();assert.ok(h.get('dialogBody').innerHTML.includes(future.body));assert.equal(h.get('collectLesson').disabled,true);assert.equal(h.run('JSON.stringify(studyState())'),progress);
 h.click('leaveLesson');h.get('sceneAssessmentDevice').click();assert.equal(h.get('sceneExamStart').disabled,true);h.click('sceneExamBack');h.list('[data-object]')[0].click();assert.equal(h.get('sceneObjectCollect').disabled,true);assert.equal(h.run('JSON.stringify(state.play.inventory)'),inventory);h.click('sceneObjectBack');
 assert.equal(h.run('JSON.stringify(studyState())'),progress);
});
test('all knowledge remains in the scene while finding parts and after collecting',async()=>{
 const h=await harness(new Map(),opts);h.click('guideDismiss');const count=h.list('[data-study-fruit]').length,l=h.run('studySection().lessons.find(l=>l.interaction==="assemble")');h.run(`openStudyLesson(${JSON.stringify(l.id)})`);
 assert.ok(h.get('dialogBody').innerHTML.includes(l.body));assert.ok(h.get('dialogBody').innerHTML.includes(l.example));assert.ok(h.get('dialogBody').innerHTML.includes(l.quote));h.click('findUnitParts');assert.equal(h.list('[data-study-fruit]').length,count);assert.equal(h.list('[data-unit-part]').length,3);
 const read=h.run('studySection().lessons.find(l=>l.interaction==="read")');h.run(`openStudyLesson(${JSON.stringify(read.id)})`);h.click('collectLesson');assert.equal(h.list('[data-study-fruit]').length+h.list('[data-study-filed]').length,count);h.run(`openStudyLesson(${JSON.stringify(read.id)})`);assert.ok(!h.get('collectLesson'));h.click('leaveLesson');
 const expected=h.run('JSON.stringify(studyState())');h.run('save()');await new Promise(r=>setImmediate(r));const re=await harness(h.data,opts);assert.equal(re.run('JSON.stringify(studyState())'),expected);assert.equal(re.list('[data-study-fruit]').length+re.list('[data-study-filed]').length,count);assert.ok(re.list('[data-object]').length>0);
});
test('filing, workshop and exam retain separate roles and foundation gating',async()=>{
 const h=await harness(new Map(),opts);h.click('guideDismiss');const sec=h.run('studySection()');assert.ok(h.get('worldStudyBasket').innerHTML.includes('role-filing'));assert.ok(h.get('stations').children.find(el=>el.className==='exploration-devices').innerHTML.includes('role-exam'));assert.ok(h.get('stations').children.find(el=>el.className==='exploration-devices').innerHTML.includes('role-workshop'));
 assert.ok(h.list('[data-study-fruit]').every(el=>el.innerHTML.includes('prop-art')&&el.innerHTML.includes('data-scene-art')&&!el.innerHTML.includes('<svg')));
 assert.equal(h.run('studySection().lessons.every((l,i)=>{const p=lessonPosition(i);return zoneInfo().anchors.some(([x,y])=>x===p.x&&y===p.y);})'),true);
 h.run(`for(const l of studySection().lessons){CS.read(studyState(),currentCourse(),l.id);CS.collect(studyState(),currentCourse(),l.id);CS.deposit(studyState(),currentCourse(),l.id);}render();`);h.list('[data-section-device]')[0].click();assert.equal(h.get('sceneDeviceStart').disabled,false);h.click('sceneDeviceStart');assert.ok(h.get('finishKnowledgeMatch'));assert.equal(h.run('studySection().id'),sec.id);assert.equal(h.run('basicsReady()'),false);
 const saved=h.run('JSON.stringify(studyState())');h.run(`changeTownLanguage('en');changeTownLanguage('bi');changeTownLanguage('zh')`);assert.equal(h.run('JSON.stringify(studyState())'),saved);
});
test('cross-chapter knowledge rereading preserves progress and source links',async()=>{
 const h=await harness(new Map(),opts);h.click('guideDismiss');const first=h.run('studySection().lessons.find(l=>l.interaction==="read")');h.run(`openStudyLesson(${JSON.stringify(first.id)})`);h.click('collectLesson');h.run('enterStudyChapter(1)');const before=h.run('JSON.stringify(studyState())');h.run(`openStudyLesson(${JSON.stringify(first.id)},true)`);assert.ok(h.get('dialogBody').innerHTML.includes(first.body));assert.equal(h.run('JSON.stringify(studyState())'),before);assert.ok(!h.get('collectLesson'));
 const linked=h.run('currentCourse().chapters.flatMap(ch=>ch.sections.flatMap(sec=>sec.lessons)).find(l=>l.references?.length)');assert.ok(linked);h.run(`openStudyLesson(${JSON.stringify(linked.id)},true)`);for(const url of linked.references)assert.ok(h.get('dialogBody').innerHTML.includes(url));assert.equal(h.run('JSON.stringify(studyState())'),before);
});
