'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('../packages/learning-design/candidates/concept-games/bindings.cjs'),catalog=require('../packages/learning-design/candidates/concept-games/catalog.json');
function setup(){
 const source=B.catalogSources().find(s=>s.name==='B4-legacy'),course=source.course,lesson=course.chapters.flatMap(ch=>ch.sections.flatMap(s=>s.lessons)).find(l=>l.sourceUnitId==='1.2.1-unit-1');
 const ctx={TextEncoder,console};ctx.window=ctx;vm.createContext(ctx);
 vm.runInContext(`var ConceptGameCatalog=JSON.parse(${JSON.stringify(JSON.stringify(catalog))});var course=JSON.parse(${JSON.stringify(JSON.stringify(course))});var state={selected:'a',banks:[{id:'a'},{id:'b'}],teachingFlows:{'a:binding':{found:[],favorites:[]}},chapterStudies:{a:{carried:[],deposited:[]}}};var saves=0;var L={bank:s=>s.banks.find(b=>b.id===s.selected)};function currentCourse(){return course;}function teachingEntry(){return {binding:'binding'};}function save(){saves++;}`,ctx);
 for(const file of ['apps/game/src/concept-game-hash.js','apps/game/src/concept-game-records.js','packages/learning-design/candidates/concept-games/engine.js','apps/game/src/concept-game-host.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
 return {run:s=>vm.runInContext(s,ctx),id:lesson.id};
}
test('real bound lesson keeps reading/discovery/collection separate from replay-verified game completion',()=>{
 const h=setup();h.run(`var c=ConceptGameHost.resolve(${JSON.stringify(h.id)});var d=ConceptGames.fresh(c.descriptor,c.context);`);
 assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),false);assert.equal(h.run('ConceptGameHost.write(c,d)'),true);
 h.run(`state.teachingFlows['a:binding'].found.push(c.lesson.id)`);assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),false);
 h.run(`d=ConceptGames.dispatch(c.descriptor,c.context,d,{type:'acknowledge'});for(const input of [9,10,10]){d=ConceptGames.dispatch(c.descriptor,c.context,d,{type:'setInput',value:input});d=ConceptGames.dispatch(c.descriptor,c.context,d,{type:'predict',decision:input<10?'proceed':'review'});d=ConceptGames.dispatch(c.descriptor,c.context,d,{type:'run'});}d=ConceptGames.dispatch(c.descriptor,c.context,d,{type:'conclude',decision:'stable'});ConceptGameHost.write(c,d);`);
 assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),true);assert.equal(h.run('state.teachingFlows["a:binding"].favorites.length'),0);assert.equal(h.run('state.chapterStudies.a.deposited.length'),0);
 h.run('state.conceptGameRecords=JSON.parse(JSON.stringify(state.conceptGameRecords))');assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),true);
 h.run('var tampered=JSON.parse(state.conceptGameRecords.records[0].draft.serialized);tampered.events=[];state.conceptGameRecords.records[0].draft.serialized=JSON.stringify(tampered)');assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),false);
});
test('old collections remain while stale bank or changed-content callbacks cannot save new evidence',()=>{
 const h=setup();h.run(`var c=ConceptGameHost.resolve(${JSON.stringify(h.id)});var d=ConceptGames.fresh(c.descriptor,c.context);state.teachingFlows['a:binding'].favorites.push(c.lesson.id);`);
 assert.equal(h.run('ConceptGameHost.status(c).preserveExisting'),true);assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),false);
 assert.equal(h.run('ConceptGameHost.status(c).found'),true,'a historical favorite can try its game even without a discovery ledger');
 h.run("state.selected='b'");assert.equal(h.run('ConceptGameHost.write(c,d)'),false);assert.equal(h.run('saves'),0);
 h.run("state.selected='a';c.lesson.body+=' changed'");assert.equal(h.run('ConceptGameHost.current(c)'),null);assert.equal(h.run('ConceptGameHost.write(c,d)'),false);assert.equal(h.run('saves'),0);
});

test('historical filed objects remain explorable without inventing discovery or game pass records',()=>{
 const h=setup();h.run(`var c=ConceptGameHost.resolve(${JSON.stringify(h.id)});delete state.teachingFlows['a:binding'].found;state.chapterStudies.a.deposited.push(c.lesson.id);`);
 assert.equal(h.run('ConceptGameHost.status(c).found'),true);assert.equal(h.run('ConceptGameHost.status(c).preserveExisting'),true);assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),false);assert.equal(h.run('ConceptGameHost.read(c)'),null);assert.equal(h.run('saves'),0);
 h.run('state.chapterStudies.a.deposited=[]');assert.equal(h.run('ConceptGameHost.status(c).found'),false,'a readable but never collected object remains undiscovered');assert.equal(h.run('saves'),0);
});
test('bounded unsubmitted UI selections resume but never grant game completion',()=>{
 const h=setup();h.run(`var c=ConceptGameHost.resolve(${JSON.stringify(h.id)}),freshGame=c.engine.fresh(c.descriptor,c.context);var draftUI={serialized:c.engine.serialize(freshGame),ui:{reading:true,inputRaw:'',local:{selected:['evidence-a'],passed:true}}};`);
 assert.equal(h.run('ConceptGameHost.write(c,draftUI)'),true);assert.equal(h.run('ConceptGameHost.readDraft(c).ui.local.selected[0]'),'evidence-a');assert.equal(h.run('ConceptGameHost.status(c).canNewCollect'),false);
 h.run("draftUI.ui.local={text:'x'.repeat(5000)}");assert.equal(h.run('ConceptGameHost.write(c,draftUI)'),false);assert.equal(h.run('ConceptGameHost.readDraft(c).ui.local.selected[0]'),'evidence-a');
});
test('explicit restart resets only the concept-game draft, preserving existing collections and chapter results',()=>{
 const h=setup();h.run(`var c=ConceptGameHost.resolve(${JSON.stringify(h.id)}),draftGame=c.engine.dispatch(c.descriptor,c.context,c.engine.fresh(c.descriptor,c.context),{type:'acknowledge'});ConceptGameHost.write(c,draftGame);state.teachingFlows['a:binding'].favorites.push(c.lesson.id);var beforeChapter=JSON.stringify(state.chapterStudies);`);
 assert.equal(h.run('ConceptGameHost.reset(c)'),true);assert.equal(h.run('ConceptGameHost.read(c).events.length'),0);assert.equal(h.run('ConceptGameHost.read(c).phase'),'teaching');assert.equal(h.run('ConceptGameHost.status(c).preserveExisting'),true);assert.equal(h.run('JSON.stringify(state.chapterStudies)===beforeChapter'),true);
});
