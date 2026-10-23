'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),harness=require('./town-harness.cjs');
(async()=>{
 const stageDir=process.env.TOWN_TEST_DIST,stageRuntime=path.resolve(stageDir||path.join(__dirname,'../dist')),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'town-concept-base-'));
 let old;
 try{
  // Reconstruct only the first reviewed concept engine/catalog, using the same
  // public host and courses. This is not a historical full-release fixture.
  for(const file of fs.readdirSync(stageRuntime,{withFileTypes:true}).filter(entry=>entry.isFile()))fs.copyFileSync(path.join(stageRuntime,file.name),path.join(temporary,file.name));
  const index=fs.readFileSync(path.join(temporary,'index.html'),'utf8').replace(/<script src="concept-(?:learning-methods|content-workshops|games-next)\.js"><\/script>/g,'');
  fs.writeFileSync(path.join(temporary,'index.html'),index);
  fs.writeFileSync(path.join(temporary,'concept-game-catalog.js'),'const ConceptGameCatalog='+fs.readFileSync(path.join(__dirname,'../packages/learning-design/candidates/concept-games/catalog.json'),'utf8')+';');
  process.env.TOWN_TEST_DIST=temporary;old=await harness(new Map(),{entrySchedule:true});old.run("close();openTeachingCourse('legacy')");
 const oldId=old.run("studySection().lessons.find(l=>l.sourceUnitId==='1.1-lesson-1').id");old.run(`openStudyLesson(${JSON.stringify(oldId)},false,null,true);var oldContext=ConceptGameHost.resolve(${JSON.stringify(oldId)}),oldGame=ConceptGames.fresh(oldContext.descriptor,oldContext.context);oldGame=ConceptGames.dispatch(oldContext.descriptor,oldContext.context,oldGame,{type:'acknowledge'});for(const n of [9,10,10]){oldGame=ConceptGames.dispatch(oldContext.descriptor,oldContext.context,oldGame,{type:'setInput',value:n});oldGame=ConceptGames.dispatch(oldContext.descriptor,oldContext.context,oldGame,{type:'predict',decision:n<10?'proceed':'review'});oldGame=ConceptGames.dispatch(oldContext.descriptor,oldContext.context,oldGame,{type:'run'});}oldGame=ConceptGames.dispatch(oldContext.descriptor,oldContext.context,oldGame,{type:'conclude',decision:'stable'});ConceptGameHost.write(oldContext,oldGame);save();`);
 await old.run('STORE.flush()');
 }finally{
  if(stageDir===undefined)delete process.env.TOWN_TEST_DIST;else process.env.TOWN_TEST_DIST=stageDir;
  assert.equal(path.dirname(temporary),path.resolve(os.tmpdir()));assert.ok(path.basename(temporary).startsWith('town-concept-base-'));fs.rmSync(temporary,{recursive:true,force:true});
 }
 const oldId=old.run("studySection().lessons.find(l=>l.sourceUnitId==='1.1-lesson-1').id");
 const resumed=await harness(old.data,{entrySchedule:true});assert.equal(resumed.run(`ConceptGameHost.status(ConceptGameHost.resolve(${JSON.stringify(oldId)})).canNewCollect`),true,'first-batch passing evidence remains valid after the stage engine is added');
 assert.equal(resumed.run('teachingContext().p.favorites.length'),0,'upgrading the engine does not auto-collect an object');
 const h=await harness(new Map(),{entrySchedule:true});assert.equal(h.run("typeof ConceptGamesNext"),'object','the reviewed published extension must be installed');let checked=0;
 for(const course of ['legacy','aib','legacy5','aib5']){
  h.run(`close();openTeachingCourse(${JSON.stringify(course)})`);
  const ids=h.run('currentCourse().chapters.flatMap(ch=>ch.sections.flatMap(sec=>sec.lessons.map(l=>l.id)))');
  for(const id of ids){if(!h.run(`!!ConceptGameHost.resolve(${JSON.stringify(id)})`))continue;
   h.run(`var stageContext=ConceptGameHost.resolve(${JSON.stringify(id)});var stageFresh=stageContext.engine.fresh(stageContext.descriptor,stageContext.context);`);
   assert.equal(h.run('stageContext.engine===ConceptGamesNext'),true);assert.equal(h.run('ConceptGameHost.write(stageContext,stageFresh)'),true,id);assert.equal(h.run('ConceptGameHost.status(stageContext).canNewCollect'),false);checked++;
  }
 }
 assert.equal(checked,h.run('ConceptGameCatalog.games.reduce((n,d)=>n+d.bindings.length,0)'));assert.ok(checked>=92);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 console.log('PASS: old passing evidence resumes without auto-collection; '+checked+' actual stage lesson bindings resolve through the extension engine and preserve unpassed drafts across four course editions. Host/API validation only, not all new UI or visual completion.');
})().catch(error=>{console.error(error);process.exitCode=1;});
