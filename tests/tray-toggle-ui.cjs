'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});h.run('close()');const before=h.run('JSON.stringify(studyState())');
 assert.ok(h.get('trayToggle'));h.click('trayToggle');assert.equal(h.get('trayToggle').textContent,'▲');assert.ok(h.run('document.body.classList.contains("tray-collapsed")'));
 h.run('render()');assert.ok(h.run('document.body.classList.contains("tray-collapsed")'));assert.ok(h.get('trayToggle'));
 h.click('trayToggle');assert.equal(h.get('trayToggle').textContent,'▼');assert.equal(h.run('document.body.classList.contains("tray-collapsed")'),false);assert.ok(h.get('teachingFavoriteTray'));
 assert.equal(h.run('JSON.stringify(studyState())'),before);
 console.log('PASS: tray toggle stays available while collapsed, survives render and restores controls without changing progress. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
