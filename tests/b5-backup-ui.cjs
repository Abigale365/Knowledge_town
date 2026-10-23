'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
const conceptFixture=require('./concept-game-fixture.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('legacy5')");const first=h.run('studySection().lessons[0].id');h.run(`openStudyLesson(${JSON.stringify(first)},false,null,true)`);conceptFixture.complete(h,first);h.click('confirmFoundation');
 const backup=h.run('JSON.stringify(state)'),foundation=h.run('teachingContext().p.foundations[0]');assert.ok(foundation,'backup fixture must contain earned foundation progress');const games=h.run('JSON.stringify(state.conceptGameRecords)');h.run('showRecords()');
 const before=h.run('JSON.stringify(state)');await h.get('backupFile').onchange({target:{files:[{size:2,text:async()=>'{}'}]}});assert.equal(h.run('JSON.stringify(state)'),before);assert.ok(!h.get('confirmRestore'));
 h.run('showRecords()');await h.get('backupFile').onchange({target:{files:[{size:backup.length,text:async()=>backup}]}});assert.ok(h.get('confirmRestore'));h.click('cancelRestore');assert.equal(h.run('JSON.stringify(state)'),before);
 await h.get('backupFile').onchange({target:{files:[{size:backup.length,text:async()=>backup}]}});h.click('confirmRestore');assert.equal(h.run('teachingEntry().revision'),5);assert.ok(h.run(`teachingContext().p.foundations.includes(${JSON.stringify(foundation)})`));assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 assert.equal(h.run('JSON.stringify(state.conceptGameRecords)'),games,'backup restores the independent concept-game evidence');
 console.log('PASS: B5 full backup rejects invalid input, requires explicit replacement, cancels safely and restores earned foundation and concept-game progress. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
