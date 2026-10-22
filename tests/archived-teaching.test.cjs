'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
const options={exam:true,learning:true,chapters:true,knowledge:true,teaching:true};
test('archived bank survives a sidecar-only update, while the new binding starts empty',async()=>{
 const h=await harness(new Map(),options),old=h.run('state.selected');h.run('close();openStudyLesson(studySection().lessons[0].id)');h.click('confirmFoundation');assert.equal(h.run('studyState().deposited.length'),1);
 h.run("TeachingCatalog.legacy.binding='a'.repeat(64)");assert.equal(h.run('!!L.restore(JSON.stringify(state))'),true);
 h.run("openTeachingCourse('legacy')");assert.notEqual(h.run('state.selected'),old);assert.equal(h.run('studyState().deposited.length'),0);
 h.run(`state.selected=${JSON.stringify(old)}`);assert.equal(h.run('studyState().deposited.length'),1);h.run('delete TeachingCatalog.legacy');assert.equal(h.run('!!L.restore(JSON.stringify(state))'),true);
 const raw=h.run('JSON.parse(JSON.stringify(state))'),bank=raw.banks.find(b=>b.id===old);
 for(const mutate of [s=>s.steps.forEach(x=>x.requiresStepIds=[]),s=>s.steps.pop(),s=>s.steps[1].id=s.steps[0].id]){
  const changed=structuredClone(raw),target=changed.banks.find(b=>b.id===old);mutate(target.teachingSnapshot.chapters[0].sections[0]);assert.equal(h.run(`L.restore(${JSON.stringify(JSON.stringify(changed))})`),null);
 }
 assert.ok(bank.teachingSnapshot.binding);
});
