'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('legacy5')");const first=h.run('studySection().lessons[0].id');h.run(`openStudyLesson(${JSON.stringify(first)})`);h.click('confirmFoundation');
 const backup=h.run('JSON.stringify(state)'),foundation=h.run('teachingContext().p.foundations[0]');h.run('showRecords()');
 const before=h.run('JSON.stringify(state)');await h.get('backupFile').onchange({target:{files:[{size:2,text:async()=>'{}'}]}});assert.equal(h.run('JSON.stringify(state)'),before);assert.ok(!h.get('confirmRestore'));
 h.run('showRecords()');await h.get('backupFile').onchange({target:{files:[{size:backup.length,text:async()=>backup}]}});assert.ok(h.get('confirmRestore'));h.click('cancelRestore');assert.equal(h.run('JSON.stringify(state)'),before);
 await h.get('backupFile').onchange({target:{files:[{size:backup.length,text:async()=>backup}]}});h.click('confirmRestore');assert.equal(h.run('teachingEntry().revision'),5);assert.ok(h.run(`teachingContext().p.foundations.includes(${JSON.stringify(foundation)})`));assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 console.log('PASS: B5 full backup rejects invalid input, requires explicit replacement, cancels safely and restores staged foundation progress. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
