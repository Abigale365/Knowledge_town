const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),{compilePreparedCourse}=require('../apps/server/pipeline.cjs');
(async()=>{
 const materialBundle=require('../packages/contracts/fixtures/materials.v1.json'),knowledgePack=require('../packages/contracts/fixtures/knowledge.v1.json'),learningPlan=require('../packages/learning-design/examples/learning-plan.v1.json');
 const {course}=await compilePreparedCourse({materialBundle,knowledgePack,learningPlan});
 const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');const old=new Map(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'fixtures/pre-integration-9f7f67b-save.json.gz'))).toString('utf8')));
 let h=await harness(old,{exam:true,learning:true,chapters:true,knowledge:true});if(h.get('guideDismiss'))h.click('guideDismiss');
 const oldBanks=h.run('JSON.stringify(state.banks)'),oldProgress=h.run('JSON.stringify(state.progress)');const original=h.run('JSON.stringify(studyState())'),bankId=h.run('state.selected'),oldSession=h.run(`JSON.stringify(state.sessions[${JSON.stringify(h.run('state.selected'))}])`);assert.ok(Object.keys(JSON.parse(oldProgress)).length);h.run('save()');await new Promise(r=>setImmediate(r));
 h.run('showCourseImporter()');const file={size:JSON.stringify(course).length,text:async()=>JSON.stringify(course)};await h.get('preparedCourseFile').onchange({target:{files:[file]}});assert.equal(h.get('commitCourse').disabled,true);h.get('confirmCourse').checked=true;h.get('confirmCourse').onchange();h.click('commitCourse');
 assert.equal(h.run('currentCourse().pipeline.learningPlanId'),'b-learning-plan');assert.equal(h.run(`JSON.stringify(state.chapterStudies[${JSON.stringify(bankId)}])`),original);
 for(let ci=0;ci<4;ci++){
  h.run(`studyState().chapter=${ci};studyState().section=0;state.zone=studyChapter().zone;renderWorld()`);
  h.list('[data-study-fruit]')[0].click();h.list('[data-discover-part]').forEach(e=>e.click());h.click('collectLesson');h.click('worldStudyBasket');h.click('basketShortcut');h.click('sealBasket');
  const rounds=course.chapters[ci].sections[0].activity.rounds;
  for(let ri=0;ri<rounds.length;ri++){
   const r=rounds[ri];h.click('workshopSubmit');assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),ri);
   if(r.type==='sort')for(const i of r.items){h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===i.id).click();h.list('[data-workshop-bin]').find(e=>e.dataset.workshopBin===i.target).click();}
   else if(r.type==='order')for(const id of r.expected)h.list('[data-workshop-item]').find(e=>e.dataset.workshopItem===id).click();
   else if(r.fields)for(const f of r.fields){const e=h.list('[data-workshop-field]').find(e=>e.dataset.workshopField===f.id);e.value=String(f.expected);e.oninput();}
   else for(const id of r.expected)h.list('[data-workshop-select]').find(e=>e.dataset.workshopSelect===id).click();
   h.click('workshopSubmit');h.click('workshopNext');
  }
  h.click('workshopFinish');assert.ok(h.run('studyState().sealed.includes(studySection().id)'));
 }
 h.run('save()');await new Promise(r=>setImmediate(r));h=await harness(h.data,{exam:true,learning:true,chapters:true,knowledge:true});
 assert.equal(h.run('currentCourse().pipeline.learningPlanId'),'b-learning-plan');assert.equal(h.run('studyState().sealed.length'),4);assert.equal(h.run('JSON.stringify(state.banks.slice(0,-1))'),oldBanks);assert.equal(h.run('JSON.stringify(state.progress)'),oldProgress);assert.equal(h.run(`JSON.stringify(state.sessions[${JSON.stringify(bankId)}])`),oldSession);assert.equal(h.run(`JSON.stringify(state.chapterStudies[${JSON.stringify(bankId)}])`),original);
 console.log('PASS: A/B/D compiled course enters C via confirmation; six actual rounds, independent chapters, original bank preservation and saved lineage restore. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
