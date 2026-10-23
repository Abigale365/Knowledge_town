'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),W=require('../dist/task-workshop-engine.js');
const conceptFixture=require('./concept-game-fixture.cjs');
const options={exam:true,learning:true,chapters:true,knowledge:true,teaching:true};
async function exercise(which){
 let h=await harness(new Map(),options);h.run(`close();openTeachingCourse(${JSON.stringify(which)})`);
 const target=h.run('JSON.parse(JSON.stringify(currentCourse()))');let rounds=0;
 // Browsing and collecting a future knowledge item do not advance required work.
 const future=target.chapters[0].sections[1].lessons[0].id,before=h.run('JSON.stringify(studyState())');
 h.run(`openStudyLesson(${JSON.stringify(future)},true)`);assert.equal(h.get('confirmFoundation').disabled,true);h.click('favoriteKnowledge');assert.equal(h.run('JSON.stringify(studyState())'),before);h.click('leaveLesson');
 assert.equal(h.run('!!L.restore(JSON.stringify(state))'),true);
 for(let ci=0;ci<4;ci++){
  h.run(`enterStudyChapter(${ci})`);assert.equal(h.run('basicsReady()'),false);
  for(const sec of target.chapters[ci].sections){
   console.log('Checking '+which+' '+sec.id);
   assert.equal(h.run('studySection().id'),sec.id);
   h.run('openTaskWorkshop()');assert.ok(h.get('sealBasket').disabled);
   for(const lesson of sec.lessons){h.run(`openStudyLesson(${JSON.stringify(lesson.id)},false,null,true)`);conceptFixture.complete(h,lesson.id);assert.equal(h.get('confirmFoundation').disabled,false);h.click('confirmFoundation');}
   h.run('openTaskWorkshop()');
   for(const r of sec.activity.rounds){
    h.click('workshopSubmit');assert.ok(h.get('workshopFeedback').textContent);assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),sec.activity.rounds.indexOf(r));
    if(r.type==='sort')for(const item of r.items){h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===item.id).click();h.list('[data-workshop-bin]').find(e=>e.dataset.workshopBin===item.target).click();}
    else if(r.type==='order')for(const id of r.expected)h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===id).click();
    else if(r.fields)for(const f of r.fields){const el=h.list('[data-workshop-field]').find(e=>e.dataset.workshopField===f.id);el.value=String(f.expected);el.oninput();}
    else {let ids=r.expected;if(r.type==='allocate')for(let mask=0;mask<2**r.items.length;mask++){const selected=r.items.filter((_,i)=>mask&(1<<i)).map(x=>x.id);if(W.grade(r,{selected})){ids=selected;break;}}for(const id of ids)h.list('[data-workshop-select]').find(e=>e.dataset.workshopSelect===id).click();}
    h.click('workshopSubmit');h.click('workshopNext');rounds++;
   }
   h.click('workshopFinish');assert.equal(h.run(`studyState().sealed.includes(${JSON.stringify(sec.id)})`),true);assert.equal(h.run('!!L.restore(JSON.stringify(state))'),true);
  }
  h.click('knowledgeChestButton');h.click('submitKnowledge');assert.equal(h.run('basicsReady()'),true);
 }
 h.run('save()');await new Promise(r=>setImmediate(r));const re=await harness(h.data,options);assert.equal(re.run('studyState().submitted.length'),4);
 // A sidecar-only revision keeps the prior bank and creates a separate empty one.
 const oldBank=re.run('state.selected');
 re.run(`TeachingCatalog[${JSON.stringify(which)}].binding='a'.repeat(64)`);
 assert.equal(re.run('!!L.restore(JSON.stringify(state))'),true);
 re.run(`openTeachingCourse(${JSON.stringify(which)})`);assert.notEqual(re.run('state.selected'),oldBank);assert.equal(re.run('studyState().deposited.length'),0);
 re.run(`state.selected=${JSON.stringify(oldBank)}`);
 const attack=re.run('JSON.parse(JSON.stringify(state))');const attackedBank=attack.banks.find(b=>b.id===oldBank);for(const ch of attackedBank.teachingSnapshot.chapters)for(const sec of ch.sections)for(const step of sec.steps)step.requiresStepIds=[];
 assert.equal(re.run(`L.restore(${JSON.stringify(JSON.stringify(attack))})`),null);
 // Losing a current catalog entry must not invalidate its archived bank/progress.
 assert.equal(re.run(`delete TeachingCatalog[${JSON.stringify(which)}];!!L.restore(JSON.stringify(state))`),true);
 const saved=re.run('JSON.parse(JSON.stringify(state))');const selected=saved.selected,key=Object.keys(saved.teachingFlows).find(k=>k.startsWith(selected+':'));saved.teachingFlows[key].binding='0'.repeat(64);assert.equal(re.run(`L.restore(${JSON.stringify(JSON.stringify(saved))})`),null);
 console.log(`PASS: B4 ${which}: ${rounds} actual application rounds, optional browsing/favorites, four independent chapters, prerequisite confirmation, wrong rejection, restore and archived-version isolation. Simulated DOM only.`);
 return rounds;
}
(async()=>{assert.equal(await exercise('aib'),145);assert.equal(await exercise('legacy'),50);})().catch(e=>{console.error(e);process.exitCode=1;});
