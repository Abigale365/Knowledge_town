'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 let h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('legacy')");
 const id=h.run("studySection().lessons.find(l=>ConceptGameHost.resolve(l.id)?.descriptor.kind==='image-inspector').id"),context=`ConceptGameHost.resolve(${JSON.stringify(id)})`,d=h.run(context+'.descriptor');
 h.list('[data-study-fruit]').find(el=>el.dataset.studyFruit===id).click();assert.equal(h.get('favoriteKnowledge').disabled,true);h.click('openConceptGame');
 const idle=async()=>{await h.run('ConceptGameIntegration.whenIdle()');await new Promise(resolve=>setImmediate(resolve));};
 const action=async value=>{const el=h.list('[data-cg-action]').find(el=>JSON.stringify(JSON.parse(el.dataset.cgAction))===JSON.stringify(value));assert.ok(el,'missing visible action '+JSON.stringify(value));el.click();await idle();};
 const region=key=>h.list('[data-cg-region]').find(el=>el.dataset.cgRegion===key);
 h.click('cgStart');await idle();assert.equal(h.list('[data-cg-region]').length,d.config.regions.length);
 region(d.config.regions.find(r=>r.id!==d.config.suspectRegion).id).click();await idle();await action({type:'conclude',choice:'needs-investigation'});await action({type:'check'});assert.equal(h.run('ConceptGameHost.read('+context+').passed'),false,'a bounded conclusion cannot excuse a wrong location');
 await action({type:'conclude',choice:'operator'});region(d.config.suspectRegion).click();await idle();await action({type:'check'});assert.equal(h.run('ConceptGameHost.read('+context+').passed'),false,'locating a gap cannot establish operator fault');
 h.run("changeTownLanguage('bi')");assert.equal(region(d.config.suspectRegion).getAttribute('aria-pressed'),'true');h.click('cgBack');await idle();h.run('save()');await h.run('STORE.flush()');
 h=await harness(h.data,{entrySchedule:true});h.run(`close();openStudyLesson(${JSON.stringify(id)})`);assert.equal(h.get('favoriteKnowledge').disabled,true);h.click('openConceptGame');assert.equal(region(d.config.suspectRegion).getAttribute('aria-pressed'),'true','the actual SVG selection survives reload');assert.equal(h.run('ConceptGameHost.read('+context+').data.answers.conclusion'),'operator','an incorrect causal choice remains available to correct');
 await action({type:'conclude',choice:'needs-investigation'});assert.equal(h.run('ConceptGameHost.read('+context+').passed'),true);assert.equal(h.run('teachingContext().p.favorites.includes('+JSON.stringify(id)+')'),false,'success does not auto-collect');h.click('cgFinish');await idle();h.click('favoriteKnowledge');assert.equal(h.run('teachingContext().p.favorites.includes('+JSON.stringify(id)+')'),true);assert.equal(h.run('studyState().sealed.length'),0);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 console.log('PASS: actual index SVG image inspection, wrong location and causal claim rejection, bilingual reload and manual collection. Simulated DOM only.');
})().catch(error=>{console.error(error);process.exitCode=1;});
