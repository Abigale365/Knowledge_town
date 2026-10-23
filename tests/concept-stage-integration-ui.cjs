'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 let h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('legacy')");
 const id=h.run("studySection().lessons.find(l=>ConceptGameHost.resolve(l.id)?.descriptor.kind==='evidence-board').id"),getContext=()=>`ConceptGameHost.resolve(${JSON.stringify(id)})`;
 const descriptor=h.run(getContext()+'.descriptor');h.run(`openStudyLesson(${JSON.stringify(id)},false,null,true)`);assert.equal(h.get('favoriteKnowledge').disabled,true);assert.equal(h.run('guideNextStep().stage'),'concept-game');
 h.click('openConceptGame');const idle=async()=>{await h.run('ConceptGameIntegration.whenIdle()');await new Promise(resolve=>setImmediate(resolve));};h.click('cgStart');await idle();
 const action=async value=>{const node=h.list('[data-cg-action]').find(el=>JSON.stringify(JSON.parse(el.dataset.cgAction))===JSON.stringify(value));assert.ok(node,'missing visible action '+JSON.stringify(value));node.click();await idle();};
 h.run('globalThis.conceptTestFlush=STORE.flush;STORE.flush=async()=>false');
 await action({type:'inspect',evidenceId:descriptor.config.evidence[0].id});assert.ok(h.get('cgRetrySave'),'storage refusal is visible in the real integration');
 h.click('cgBack');await idle();assert.ok(h.get('conceptGameRoot'),'refused storage does not silently leave the experiment');assert.equal(h.run(getContext()+`&&ConceptGameHost.read(${getContext()}).passed`),false);
 h.run('STORE.flush=conceptTestFlush');h.click('cgRetrySave');await idle();assert.ok(!h.get('cgRetrySave'),'retry acknowledges the actual storage flush');
 for(const evidence of descriptor.config.evidence)await action({type:'inspect',evidenceId:evidence.id});
 const first=descriptor.config.claims[0],firstId=first.evidenceIds[0];h.list('[data-cg-evidence]').find(el=>el.dataset.cgEvidence===first.id&&el.dataset.cgEvidenceId===firstId).click();await idle();
 assert.equal(h.run(getContext()+`&&ConceptGameHost.readDraft(${getContext()}).ui.local[${JSON.stringify(first.id)}][0]`),firstId);
 h.click('cgBack');await idle();h.run('save()');await new Promise(resolve=>setImmediate(resolve));h=await harness(h.data,{entrySchedule:true});h.run(`close();openStudyLesson(${JSON.stringify(id)})`);h.click('openConceptGame');
 assert.equal(h.list('[data-cg-evidence]').find(el=>el.dataset.cgEvidence===first.id&&el.dataset.cgEvidenceId===firstId).getAttribute('aria-pressed'),'true','unsubmitted evidence choice survives actual save/restore');
 for(const claim of descriptor.config.claims){
  for(const evidenceId of claim.evidenceIds){const node=h.list('[data-cg-evidence]').find(el=>el.dataset.cgEvidence===claim.id&&el.dataset.cgEvidenceId===evidenceId);if(node.getAttribute('aria-pressed')!=='true'){node.click();await idle();}}
  await action({type:'judge',claimId:claim.id,decision:claim.expected,evidenceIds:claim.evidenceIds});
 }
 assert.ok(h.get('cgFinish'));h.run("changeTownLanguage('bi')");h.click('cgFinish');await idle();assert.equal(h.get('favoriteKnowledge').disabled,false);assert.equal(h.run(`teachingContext().p.favorites.includes(${JSON.stringify(id)})`),false);
 h.click('favoriteKnowledge');assert.equal(h.run(`teachingContext().p.favorites.includes(${JSON.stringify(id)})`),true);assert.equal(h.get('confirmFoundation').disabled,false);h.click('confirmFoundation');assert.equal(h.run(`studyState().deposited.includes(${JSON.stringify(id)})`),true);assert.ok(!h.list('[data-teaching-favorite]').some(el=>el.dataset.teachingFavorite===id),'filed item leaves the carry tray');assert.equal(h.run('studyState().sealed.length'),0);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 const archived=h.run('JSON.stringify({favorites:teachingContext().p.favorites,deposited:studyState().deposited,foundations:teachingContext().p.foundations,sealed:studyState().sealed})');
 h.run(`openStudyLesson(${JSON.stringify(id)})`);assert.ok(h.get('openConceptGame').textContent.includes('小游戏已完成'));assert.ok(h.get('openConceptGame').textContent.includes('Concept game complete'),'fixed bilingual entry includes both languages');const recordBefore=h.run('JSON.stringify(state.conceptGameRecords)');h.click('restartConceptGame');h.click('cancelConceptRestart');assert.equal(h.run('JSON.stringify(state.conceptGameRecords)'),recordBefore,'cancel keeps the existing experiment');
 h.click('restartConceptGame');h.click('confirmConceptRestart');await idle();assert.ok(h.get('cgStart'),'explicit restart opens a fresh experiment');assert.equal(h.run(getContext()+`&&ConceptGameHost.read(${getContext()}).passed`),false);
 assert.equal(h.run('JSON.stringify({favorites:teachingContext().p.favorites,deposited:studyState().deposited,foundations:teachingContext().p.foundations,sealed:studyState().sealed})'),archived,'object restart preserves existing collections, foundations and chapter results');
 assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 console.log('PASS: actual stage index evidence controls, refresh draft, manual collection/filing and cancel/confirmed object restart preserve archive and chapter progress. Simulated DOM only.');
})().catch(error=>{console.error(error);process.exitCode=1;});
