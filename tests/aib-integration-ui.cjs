const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),{compilePreparedCourse}=require('../apps/server/pipeline.cjs'),W=require('../packages/contracts/runtime/task-workshop-engine.js');
(async()=>{
 const {materialBundle,knowledgePack}=require('../packages/course-compiler/enrich-aib.cjs').enrichedAib(),learningPlan=require('../packages/learning-design/generated/aib-learning-plan.v3.json');
 const {course,diagnostics}=await compilePreparedCourse({materialBundle,knowledgePack,learningPlan});assert.equal(diagnostics.length,0);
 let h=await harness(new Map(),{exam:true,learning:true,chapters:true,knowledge:true});h.click('guideDismiss');h.run('showCourseImporter()');await h.get('preparedCourseFile').onchange({target:{files:[{size:JSON.stringify(course).length,text:async()=>JSON.stringify(course)}]}});h.get('confirmCourse').checked=true;h.get('confirmCourse').onchange();h.click('commitCourse');assert.equal(h.run('basicsReady()'),false);h.run("setStudyMode('practice')");assert.equal(h.run('studyState().mode'),'learn');h.click('basketShortcut');assert.equal(h.get('sealBasket').disabled,true);h.click('basketBack');let total=0;
 for(let ci=0;ci<4;ci++){for(let si=0;si<course.chapters[ci].sections.length;si++){
  h.run(`studyState().chapter=${ci};studyState().section=${si};state.zone=studyChapter().zone;for(const l of studySection().lessons){CS.read(studyState(),currentCourse(),l.id);CS.collect(studyState(),currentCourse(),l.id);CS.deposit(studyState(),currentCourse(),l.id);}renderWorld()`);
  h.click('basketShortcut');h.click('sealBasket');
  for(const r of course.chapters[ci].sections[si].activity.rounds){
   h.click('workshopSubmit');assert.ok(h.get('workshopFeedback'));
   if(r.type==='sort')for(const item of r.items){h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===item.id).click();h.list('[data-workshop-bin]').find(e=>e.dataset.workshopBin===item.target).click();}
   else if(r.type==='order')for(const id of r.expected)h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===id).click();
   else if(r.fields)for(const f of r.fields){const e=h.list('[data-workshop-field]').find(e=>e.dataset.workshopField===f.id);e.value=String(f.expected);e.oninput();}
   else{let selected=r.expected;if(r.type==='allocate'){selected=null;for(let mask=0;mask<2**r.items.length;mask++){const ids=r.items.filter((_,i)=>mask&(1<<i)).map(x=>x.id);if(W.grade(r,{selected:ids})){selected=ids;break;}}assert.ok(selected);}for(const id of selected)h.list('[data-workshop-select]').find(e=>e.dataset.workshopSelect===id).click();}
   h.click('workshopSubmit');assert.ok(h.get('workshopNext'));h.click('workshopNext');total++;
  }
  h.click('workshopFinish');assert.equal(h.run(`studyState().sealed.includes(${JSON.stringify(course.chapters[ci].sections[si].id)})`),true);
 }
 h.click('knowledgeChestButton');h.click('submitKnowledge');assert.equal(h.run('basicsReady()'),true);
 async function assessment(errors=0){
  h.click('chapterFinalButton');const count=h.run('studyState().round.ids.length');
  for(let qi=0;qi<count;qi++){
   const token=h.list('[data-encounter]').find(e=>qi<errors?e.dataset.encounter!=='answer':e.dataset.encounter==='answer');assert.ok(token);token.click();h.click('nextAssessment');
   if(ci===2&&qi===0){h.run('save()');await new Promise(r=>setImmediate(r));h=await harness(h.data,{exam:true,learning:true,chapters:true,knowledge:true});assert.equal(h.run('studyState().round.answers.length'),1);h.run('showChapterAssessment()');}
  }
  return h.run('studyState().assessments.at(-1).correct/studyState().assessments.at(-1).total');
 }
 if(ci===0){assert.ok(await assessment(5)<.9);h.click('assessmentMistakes');assert.equal(h.list('[data-study-review]').length,5);for(let n=0;n<5;n++){h.list('[data-study-review]')[0].click();h.list('[data-encounter]').find(e=>e.dataset.encounter==='answer').click();h.click('encounterContinue');h.list('[data-study-mode]').find(e=>e.dataset.studyMode==='mistakes').click();}assert.equal(h.list('[data-study-review]').length,0);h.click('queueBack');}
 assert.equal(await assessment(),1);h.click('assessmentDone');
 }
 const sections=course.chapters.reduce((n,c)=>n+c.sections.length,0);assert.ok(total>=139);assert.equal(h.run('studyState().sealed.length'),sections);h.run('save()');await new Promise(r=>setImmediate(r));h=await harness(h.data,{exam:true,learning:true,chapters:true,knowledge:true});assert.equal(h.run('studyState().sealed.length'),sections);assert.equal(h.run('currentCourse().pipeline.knowledgeRevision'),3);assert.equal(h.run('studyState().assessments.filter(a=>a.correct/a.total>=.9).length'),4);assert.equal(h.run('currentCourse().pipeline.learningPlanId'),'aib-learning-plan');
 console.log('PASS: A3/B3 full course imports; '+sections+' sections and '+total+' actual control rounds, four full assessments, below-90% rejection, mistake repair and partial assessment reload complete and restore. Reading fixture setup uses the learning engine; controls use real handlers. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
