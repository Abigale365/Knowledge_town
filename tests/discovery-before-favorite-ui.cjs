'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 let h=await harness(new Map(),{entrySchedule:true});h.run('close();openStudyBasket()');const id=h.run('studySection().lessons[0].id');
 h.list('[data-foundation-lesson]')[0].click();assert.equal(h.get('favoriteKnowledge').disabled,true);h.get('favoriteKnowledge').onclick();assert.equal(h.run('teachingContext().p.favorites.length'),0,'disabled handler must also reject preview favorites');assert.equal(h.run('teachingContext().p.found.length'),0);
 h.run('close()');h.list('[data-study-fruit]').find(e=>e.dataset.studyFruit===id).click();assert.equal(h.get('favoriteKnowledge').disabled,false);h.click('favoriteKnowledge');assert.ok(h.run(`teachingContext().p.favorites.includes(${JSON.stringify(id)})`));
 h.run('save()');await new Promise(r=>setImmediate(r));h=await harness(h.data,{entrySchedule:true});h.run('close();openStudyBasket()');h.list('[data-foundation-lesson]')[0].click();assert.equal(h.get('favoriteKnowledge').disabled,false);h.click('favoriteKnowledge');assert.equal(h.get('favoriteKnowledge').disabled,false,'discovered objects can be favorited again');
 console.log('PASS: previews cannot discover/favorite, actual scene clicks unlock favorites, and discovery persists after refresh/removing favorite. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
