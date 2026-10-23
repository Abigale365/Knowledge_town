'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
function transfer(){const data=new Map();return{get types(){return [...data.keys()];},setData:(key,value)=>data.set(key,value),getData:key=>data.get(key)||''};}
const event=dataTransfer=>({dataTransfer,preventDefault(){}});
(async()=>{
 let h=await harness(new Map(),{entrySchedule:true});h.run("close();openTeachingCourse('legacy')");
 const id=h.run("studySection().lessons.find(l=>ConceptGameHost.resolve(l.id)?.descriptor.kind==='cluster-builder').id"),context=`ConceptGameHost.resolve(${JSON.stringify(id)})`,descriptor=h.run(context+'.descriptor');
 h.list('[data-study-fruit]').find(el=>el.dataset.studyFruit===id).click();assert.equal(h.get('favoriteKnowledge').disabled,true);h.click('openConceptGame');
 const idle=async()=>{await h.run('ConceptGameIntegration.whenIdle()');await new Promise(resolve=>setImmediate(resolve));};h.click('cgStart');await idle();
 const point=id=>h.list('[data-cg-point]').find(el=>el.dataset.cgPoint===id),group=id=>h.list('[data-cg-drop-group]').find(el=>el.dataset.cgDropGroup===id);
 const action=async value=>{h.list('[data-cg-action]').find(el=>JSON.stringify(JSON.parse(el.dataset.cgAction))===JSON.stringify(value)).click();await idle();};
 const [first,second]=descriptor.config.groups,p=descriptor.config.points[0];
 point(p.id).click();await idle();h.list('[data-cg-place-selected]').find(el=>el.dataset.cgPlaceSelected===second.id).click();await idle();
 assert.equal(h.run(context+'.engine&&ConceptGameHost.read('+context+').data.placements['+JSON.stringify(p.id)+']'),second.id);
 h.run("changeTownLanguage('bi')");h.click('cgBack');await idle();h.run('save()');await h.run('STORE.flush()');h=await harness(h.data,{entrySchedule:true});h.run(`close();openStudyLesson(${JSON.stringify(id)})`);h.click('openConceptGame');
 assert.equal(h.run('ConceptGameHost.read('+context+').data.placements['+JSON.stringify(p.id)+']'),second.id,'click placement survives the actual save/reload');
 for(let i=1;i<descriptor.config.points.length;i++){const dt=transfer();point(descriptor.config.points[i].id).ondragstart(event(dt));group(i<2?first.id:second.id).ondrop(event(dt));await idle();}
 await action({type:'check'});assert.equal(h.run('ConceptGameHost.read('+context+').passed'),false,'wrong grouping cannot unlock collection');
 const dt=transfer();point(p.id).ondragstart(event(dt));group(first.id).ondrop(event(dt));await idle();await action({type:'check'});await action({type:'describe',decision:descriptor.config.supportedDescription});
 assert.equal(h.run('ConceptGameHost.read('+context+').passed'),true);assert.equal(h.run('teachingContext().p.favorites.includes('+JSON.stringify(id)+')'),false,'passing does not auto-collect');h.click('cgFinish');await idle();h.click('favoriteKnowledge');assert.equal(h.run('teachingContext().p.favorites.includes('+JSON.stringify(id)+')'),true);assert.equal(h.run('studyState().sealed.length'),0);assert.ok(h.run('!!L.restore(JSON.stringify(state))'));
 console.log('PASS: actual index cluster board click/drag, wrong rejection, language/back/reload, reallocation and manual collection. Simulated DOM only.');
})().catch(error=>{console.error(error);process.exitCode=1;});
