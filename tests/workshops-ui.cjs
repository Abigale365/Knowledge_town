const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),C=require('../dist/chapter-course.js');
(async()=>{let h=await harness(new Map(),{exam:true,learning:true,chapters:true,knowledge:true});h.click('guideDismiss');let total=0;
for(let ci=0;ci<C.chapters.length;ci++)for(let si=0;si<C.chapters[ci].sections.length;si++){const sec=C.chapters[ci].sections[si];if(sec.id==='1.1')continue;
 h.run(`state.chapterStudies[state.selected]=CS.fresh();studyState().chapter=${ci};studyState().section=${si};state.zone=studyChapter().zone;heldFruit=null;for(const l of studySection().lessons){CS.read(studyState(),currentCourse(),l.id);CS.collect(studyState(),currentCourse(),l.id);CS.deposit(studyState(),currentCourse(),l.id);}renderWorld();save();`);
 h.click('basketShortcut');assert.ok(h.get('sealBasket').textContent.includes(sec.activity.title.zh));h.click('sealBasket');assert.equal(h.list('[data-match-term]').length,0,sec.id+' must not open definition matching');assert.equal(h.run('CS.seal(studyState(),currentCourse())'),false);
 for(let ri=0;ri<sec.activity.rounds.length;ri++){const r=sec.activity.rounds[ri];h.click('workshopSubmit');assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),ri);assert.ok(h.get('workshopFeedback').textContent);
  if(r.type==='sort'){for(const item of r.items){h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===item.id).click();h.list('[data-workshop-bin]').find(e=>e.dataset.workshopBin===item.target).click();}}
  else if(r.type==='order'){// Deliberately reverse the order, then rebuild using actual remove and item controls.
   for(const id of [...r.expected].reverse())h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===id).click();h.click('workshopSubmit');assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),ri);h.click('workshopReset');for(const id of r.expected)h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===id).click();
  }else if(['choose','matrix'].includes(r.type)){for(const id of r.expected)h.list('[data-workshop-select]').find(e=>e.dataset.workshopSelect===id).click();}
  else if(['number','edit','rate'].includes(r.type)){for(const field of r.fields){const input=h.list('[data-workshop-field]').find(e=>e.dataset.workshopField===field.id);input.value=String(field.expected);input.oninput();}}
  else if(r.type==='allocate'){const choices=sec.id==='2.1'?['policy','forecast']:['need','feedback','workflow'];for(const id of choices)h.list('[data-workshop-select]').find(e=>e.dataset.workshopSelect===id).click();}
  if(sec.id==='2.2'&&ri===1){h.run('save()');await new Promise(resolve=>setImmediate(resolve));h=await harness(h.data,{exam:true,learning:true,chapters:true,knowledge:true});h.run('openTaskWorkshop()');assert.equal(h.list('[data-workshop-field]').find(e=>e.dataset.workshopField==='roi').value,'50');}
  h.click('workshopRead');assert.ok(h.get('dialogBody').innerHTML.includes('本轮涉及的知识'));h.click('workshopSubmit');assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),ri+1);h.click('workshopNext');total++;
 }
 assert.equal(h.run('KnowledgePractice.mastered(studyState(),studySection())'),true);h.click('workshopFinish');assert.equal(h.run(`studyState().sealed.includes('${sec.id}')`),true);
}
console.log('PASS: '+total+' actual workshop rounds across all 12 later tasks, eight control types, wrong decisions, staged completion, source review and partial ledger reload. Simulated DOM only.');})().catch(error=>{console.error(error);process.exitCode=1;});
