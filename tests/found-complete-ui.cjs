'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 let h=await harness(new Map(),{entrySchedule:true});h.run('close()');const ids=h.run('studySection().lessons.map(l=>l.id)');
 for(const id of ids){h.list('[data-study-fruit]').find(e=>e.dataset.studyFruit===id).click();h.run('close()');}
 assert.ok(h.get('sectionFoundNotice'));assert.ok(h.get('sectionFoundNext'));assert.equal(h.run('studyState().sealed.length'),0);h.click('sectionFoundNext');assert.ok(h.get('sealBasket'));
 h.list('[data-foundation-lesson]')[0].click();h.click('favoriteKnowledge');h.run('close()');assert.ok(h.list('[data-teaching-favorite]').some(e=>e.dataset.teachingFavorite===ids[0]));
 h.run(`applyDrag({teachingFavorite:${JSON.stringify(ids[0])},bank:state.selected},'study-basket')`);assert.ok(!h.list('[data-teaching-favorite]').some(e=>e.dataset.teachingFavorite===ids[0]));
 h.run('showKnowledgeChest()');assert.ok(h.list('[data-archived-favorite]').some(e=>e.dataset.archivedFavorite===ids[0]));h.list('[data-archived-favorite]')[0].click();assert.ok(h.get('lessonBack'));
 h.run('save()');await new Promise(r=>setImmediate(r));h=await harness(h.data,{entrySchedule:true});assert.ok(h.get('sectionFoundNotice'));assert.ok(!h.list('[data-teaching-favorite]').some(e=>e.dataset.teachingFavorite===ids[0]));
 console.log('PASS: finding all objects offers the next step; filing removes carried favorites while archive and reload retain them. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
