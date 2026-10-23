'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 let h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('legacy')");
 const id=h.run("studySection().lessons.find(l=>ConceptGameHost.resolve(l.id)?.descriptor.kind==='sample-trainer').id"),context=`ConceptGameHost.resolve(${JSON.stringify(id)})`,d=h.run(context+'.descriptor');
 h.list('[data-study-fruit]').find(el=>el.dataset.studyFruit===id).click();h.click('openConceptGame');
 const idle=async()=>{await h.run('ConceptGameIntegration.whenIdle()');await new Promise(resolve=>setImmediate(resolve));};
 const action=async value=>{h.list('[data-cg-action]').find(el=>JSON.stringify(JSON.parse(el.dataset.cgAction))===JSON.stringify(value)).click();await idle();};
 h.click('cgStart');await idle();assert.equal(h.list('[data-cg-sample-point]').length,d.config.samples.filter(p=>p.y!==null).length);assert.equal(h.list('[data-cg-fitted-parameter]').length,0);
 for(const sample of d.config.samples.filter(p=>p.y!==null))await action({type:'select',sampleId:sample.id});await action({type:'fit'});
 assert.equal(h.list('[data-cg-fitted-parameter]')[0].dataset.cgFittedParameter,String(h.run('ConceptGameHost.read('+context+').data.k')));assert.equal(h.run('ConceptGameHost.read('+context+').passed'),false,'a visible fitted parameter alone is not a passed prediction');
 await action({type:'predict',value:d.config.predictionOptions.find(value=>value!==d.config.holdout.y)});await action({type:'test'});assert.equal(h.run('ConceptGameHost.read('+context+').passed'),false);
 h.run("changeTownLanguage('bi')");h.click('cgBack');await idle();h.run('save()');await h.run('STORE.flush()');h=await harness(h.data,{entrySchedule:true});h.run(`close();openStudyLesson(${JSON.stringify(id)})`);assert.equal(h.get('favoriteKnowledge').disabled,true);h.click('openConceptGame');assert.equal(h.list('[data-cg-fitted-parameter]').length,1,'the actual fitted observation survives reload');
 await action({type:'predict',value:d.config.holdout.y});await action({type:'test'});assert.equal(h.run('ConceptGameHost.read('+context+').passed'),true);assert.equal(h.run('teachingContext().p.favorites.includes('+JSON.stringify(id)+')'),false);h.click('cgFinish');await idle();h.click('favoriteKnowledge');assert.equal(h.run('teachingContext().p.favorites.includes('+JSON.stringify(id)+')'),true);assert.equal(h.run('studyState().sealed.length'),0);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 console.log('PASS: actual index public training plot, real fit, wrong prediction rejection, bilingual refresh and manual collection. Simulated DOM only.');
})().catch(error=>{console.error(error);process.exitCode=1;});
