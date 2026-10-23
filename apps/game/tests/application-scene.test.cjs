'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const harness=require('../../../tests/town-harness.cjs'),B=require('../../../packages/learning-design/teaching-logic.v5.cjs');
const conceptFixture=require('../../../tests/concept-game-fixture.cjs');
const source=fs.readFileSync(path.join(__dirname,'../src/application-scene.js'),'utf8');
async function load(data=new Map()){
 const h=await harness(data,{entrySchedule:true});
 if(h.run('!!window.ApplicationScene'))h.run('ApplicationScene.refresh()');else h.run(source);
 return h;
}
async function foundations(h,which='aib5',favorite=true){
 h.run(`close();openTeachingCourse(${JSON.stringify(which)})`);
 for(const id of h.run('studySection().lessons.map(l=>l.id)')){
  h.run(`openStudyLesson(${JSON.stringify(id)},false,null,true)`);
  conceptFixture.complete(h,id);
  if(favorite)h.click('favoriteKnowledge');
  h.click('confirmFoundation');
 }
 h.run('close();ApplicationScene.refresh()');
}
test('after optional favorites remove knowledge, scene keeps distributed rereading, inspection and the actual staged workshop',async()=>{
 const h=await load();h.run("close();openTeachingCourse('aib5')");assert.ok(!h.get('applicationScene'));
 await foundations(h);
 assert.equal(h.list('[data-study-fruit]').length+h.list('[data-study-filed]').length,0,'reproduce original empty knowledge layer');
 assert.equal(h.run('ApplicationScene.current().stage'),'demonstration');
 assert.equal(h.list('[data-application-knowledge]').length,4);
 assert.ok(h.get('applicationInspection'));assert.ok(h.get('applicationWorkshop'));
 const props=h.list('[data-application-role]'),positions=props.map(el=>el.getAttribute('style'));
 assert.equal(new Set(positions).size,props.length);
 const xy=positions.map(s=>[...s.matchAll(/(?:left|top):([\d.]+)%/g)].map(m=>+m[1]));
 for(let i=0;i<xy.length;i++)for(let j=i+1;j<xy.length;j++)assert.ok(Math.abs(xy[i][0]-xy[j][0])>=4.5||Math.abs(xy[i][1]-xy[j][1])>=6.5,'own 84px targets have separated centers');
 assert.ok(props.some(el=>el.dataset.applicationRole==='knowledge'));assert.ok(props.some(el=>el.dataset.applicationRole==='inspection'));assert.ok(props.some(el=>el.dataset.applicationRole==='workshop'));
 const before=h.run('JSON.stringify(state)');h.run('ApplicationScene.refresh()');assert.equal(h.run('JSON.stringify(state)'),before);
 h.click('applicationInspection');assert.equal(h.run('JSON.stringify(state)'),before);assert.ok(h.get('dialogBody').innerHTML.includes(h.run('teachingContext().flow.section(studySection().id).policy.demonstration.scenario.zh')));
 h.list('[data-application-review]')[0].click();assert.ok(h.get('lessonBack'));h.click('lessonBack');assert.ok(h.get('applicationLocate'));
 h.run('close()');h.click('applicationWorkshop');assert.ok(h.get('b5DemoDone'),'directly opens actual worked example rather than basket');
 h.click('b5DemoDone');h.run('close();ApplicationScene.refresh()');assert.equal(h.get('applicationScene').dataset.applicationStage,'guided');
 h.click('applicationWorkshop');assert.ok(h.get('b5GuidedSubmit'));h.click('b5GuidedSubmit');assert.equal(h.run('teachingStageStatus().stage'),'guided');
 const guided=h.run('teachingContext().flow.section(studySection().id).policy.guidedPractice.round');
 h.run(`Object.assign(teachingContext().p.guided[studySection().id].draft,${JSON.stringify(B.witness(guided))})`);h.click('b5GuidedSubmit');
 h.run('close();ApplicationScene.refresh()');assert.equal(h.get('applicationScene').dataset.applicationStage,'independent');
 assert.ok(h.get('applicationWorkshop').getAttribute('aria-label').includes('应用 1/'));
 h.click('applicationWorkshop');assert.ok(h.get('workshopSubmit'));assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),0);
 const favorites=h.run('JSON.stringify(teachingContext().p.favorites)');
 for(const round of h.run('studySection().activity.rounds')){
  h.run(`Object.assign(WorkshopEngine.progress(studyState(),studySection()).draft,${JSON.stringify(B.witness(round))})`);h.click('workshopSubmit');h.click('workshopNext');
  h.run('ApplicationScene.refresh()');
  const work=h.run('WorkshopEngine.progress(studyState(),studySection())'),total=h.run('studySection().activity.rounds.length');
  assert.ok(h.get('applicationWorkshop').getAttribute('aria-label').includes(work.round===total?'待收成果':'应用 '+(work.round+1)+'/'+total));
 }
 h.run('close();ApplicationScene.refresh()');assert.equal(h.get('applicationScene').dataset.applicationStage,'result');
 assert.equal(h.run('studyState().sealed.length'),0,'a scene result never seals a section');
 assert.equal(h.run('JSON.stringify(teachingContext().p.favorites)'),favorites);
 h.click('applicationWorkshop');assert.ok(h.get('workshopFinish'));h.click('workshopFinish');assert.equal(h.run('studyState().sealed.length'),1);
});
async function readyFixture(h){
 h.run(`close();openTeachingCourse('aib5');{const c=teachingContext();for(const l of studySection().lessons){for(const key of ['viewed','found','favorites'])if(!c.p[key].includes(l.id))c.p[key].push(l.id);const step=c.flow.foundation(studySection().id,l.id).id;if(!c.p.foundations.includes(step))c.p.foundations.push(step);for(const key of ['read','deposited'])if(!c.s[key].includes(l.id))c.s[key].push(l.id);}}renderWorld();ApplicationScene.refresh();`);
}
test('background candidate preserves focused props, keeps one knowledge hint and never steals an inspection dialog focus',async()=>{
 const h=await load();await readyFixture(h);
 const before=h.run('JSON.stringify(studyState())'),workshopPosition=h.get('applicationWorkshop').getAttribute('style');
 h.get('applicationWorkshop').focus();h.run("changeTownLanguage('bi')");
 assert.equal(h.run('document.activeElement'),h.get('applicationWorkshop'));
 assert.equal(h.get('applicationWorkshop').getAttribute('style'),workshopPosition);
 const knowledge=h.list('[data-application-knowledge]')[0],id=knowledge.dataset.applicationKnowledge;
 knowledge.focus();knowledge.onfocus();assert.equal(h.list('[data-application-hint]').length,1);assert.equal(knowledge.getAttribute('title'),null);
 const fragment=h.get('applicationScene').innerHTML.split('data-application-knowledge="'+id+'"')[1].split('</button>')[0];assert.ok(!fragment.includes('<small'),'knowledge has no second hover label');
 const oldHint=h.get('sceneExploreHint');h.run("changeTownLanguage('en')");
 const restored=h.list('[data-application-knowledge]').find(el=>el.dataset.applicationKnowledge===id);assert.equal(h.run('document.activeElement'),restored);assert.notEqual(h.get('sceneExploreHint'),oldHint,'old-language hint was removed; native focus may create a new hint');
 restored.onfocus();assert.equal(h.list('[data-application-hint]').length,1);
 h.click('applicationInspection');h.get('applicationLocate').focus();h.run("changeTownLanguage('bi')");assert.equal(h.run('document.activeElement'),h.get('applicationLocate'));
 assert.equal(h.run('JSON.stringify(studyState())'),before);
});
test('compatible activities show pending collection from existing mastery without awarding a section',async()=>{
 const h=await load();
 h.run(`close();openTeachingCourse('legacy');L.bank(state).syllabus.id='compat-activity-fixture';delete L.bank(state).teachingSnapshot;for(const l of studySection().lessons){studyState().read.push(l.id);studyState().deposited.push(l.id);}renderWorld();ApplicationScene.refresh();`);
 assert.equal(h.run('teachingEntry()'),null);assert.equal(h.run('ApplicationScene.current().stage'),'application');
 for(const r of h.run('studySection().activity.rounds'))assert.equal(h.run(`WorkshopEngine.submit(studyState(),studySection(),${JSON.stringify(B.witness(r))})`),true);
 const saved=h.run('JSON.stringify(state)');h.run('ApplicationScene.refresh()');
 assert.equal(h.get('applicationScene').dataset.applicationStage,'result');assert.ok(h.get('applicationWorkshop').getAttribute('aria-label').includes('待收成果'));
 assert.equal(h.run('studyState().sealed.length'),0);assert.equal(h.run('JSON.stringify(state)'),saved);
});
test('background candidate relocates blocked landmarks and keeps their safe positions when free space returns',async()=>{
 const h=await load();await readyFixture(h);
 const original=h.get('applicationWorkshop').getAttribute('style'),before=h.run('JSON.stringify(state)');
 h.get('applicationWorkshop').focus();
 h.run(`var applicationBlocker=document.createElement('button');applicationBlocker.id='applicationBlocker';applicationBlocker.setAttribute('data-object','candidate-blocker');applicationBlocker.setAttribute('style',${JSON.stringify(original)});document.getElementById('features').appendChild(applicationBlocker);ApplicationScene.refresh();`);
 assert.notEqual(h.get('applicationWorkshop').getAttribute('style'),original);assert.ok(h.get('applicationInspection'));
 assert.equal(h.run('document.activeElement'),h.get('applicationWorkshop'));
 const stable=[h.get('applicationWorkshop').getAttribute('style'),h.get('applicationInspection').getAttribute('style')];
 h.run("document.getElementById('applicationBlocker').remove();ApplicationScene.refresh()");
 assert.deepEqual([h.get('applicationWorkshop').getAttribute('style'),h.get('applicationInspection').getAttribute('style')],stable,'new free space does not make the landmarks jump');
 assert.equal(h.run('JSON.stringify(state)'),before);
});
test('existing nonfavorite knowledge is preserved; refresh and restore retain drafts, assistance, progress and other world layers',async()=>{
 let h=await load();await foundations(h,'aib5',false);
 const filed=h.list('[data-study-filed]').length;assert.equal(h.list('[data-application-knowledge]').length,0,'do not duplicate visible knowledge');
 h.run("var applicationSentinel=document.createElement('aside');applicationSentinel.id='applicationTestOtherLayer';document.getElementById('world').appendChild(applicationSentinel);ApplicationScene.refresh()");
 assert.equal(h.run("document.getElementById('applicationTestOtherLayer')===applicationSentinel"),true);assert.equal(h.list('[data-study-filed]').length,filed);
 h.click('applicationWorkshop');h.click('b5DemoDone');h.click('b5GuidedSubmit');
 const stateBefore=h.run('JSON.stringify(state)');h.run('ApplicationScene.refresh()');assert.equal(h.run('JSON.stringify(state)'),stateBefore);
 h.run('save()');await new Promise(r=>setImmediate(r));const expected=h.run('JSON.stringify(studyState())'),flow=h.run('JSON.stringify(teachingContext().p)');
 h=await load(h.data);assert.equal(h.run('JSON.stringify(studyState())'),expected);assert.equal(h.run('JSON.stringify(teachingContext().p)'),flow);
 assert.equal(h.get('applicationScene').dataset.applicationStage,'guided');h.run('close()');h.click('applicationWorkshop');assert.ok(h.get('b5GuidedSubmit'));
});
test('real legacy5 foundation route works and stale actions cannot open a new bank; language and mode changes keep gates',async()=>{
 const h=await load();await foundations(h,'legacy5',false);
 assert.ok(h.get('applicationWorkshop'));assert.equal(h.get('applicationScene').dataset.applicationStage,'demonstration');
 const old=h.get('applicationWorkshop');h.run("openTeachingCourse('aib5');ApplicationScene.refresh()");assert.ok(!h.get('applicationScene'));
 const selected=h.run('state.selected');old.click();assert.equal(h.run('state.selected'),selected);assert.ok(!h.get('b5DemoDone'));
 await foundations(h,'aib5');const records=h.run('JSON.stringify(studyState())');
 h.click('applicationInspection');
 const scenario=h.run('teachingContext().flow.section(studySection().id).policy.demonstration.scenario');
 for(const mode of ['en','bi','zh']){
  h.run(`changeTownLanguage(${JSON.stringify(mode)});ApplicationScene.refresh()`);assert.equal(h.get('applicationScene').dataset.applicationStage,'demonstration');
  assert.ok(h.get('dialogBody').innerHTML.includes(scenario[mode==='en'?'en':'zh']));
  if(mode==='bi')assert.ok(h.get('dialogBody').innerHTML.includes(scenario.en));
 }
 assert.equal(h.run('JSON.stringify(studyState())'),records);
 h.run("studyState().mode='practice';ApplicationScene.refresh()");assert.ok(!h.get('applicationScene'));
 h.run("studyState().mode='assessment';ApplicationScene.refresh()");assert.ok(!h.get('applicationScene'));
 h.run("studyState().mode='learn';state.zone='harbor';ApplicationScene.refresh()");assert.ok(!h.get('applicationScene'));
});
test('B4 retired repair inspection uses the visible business scenario in every language without touching the saved round',async()=>{
 const h=await load();h.run("close();openTeachingCourse('legacy')");
 // Valid prerequisite fixture, graded through existing APIs below; no production completion writes.
 h.run(`for(const l of studySection().lessons){const c=teachingContext();c.p.viewed.push(l.id);c.p.foundations.push(c.flow.foundation(studySection().id,l.id).id);c.s.read.push(l.id);c.s.deposited.push(l.id);}`);
 const rounds=h.run('studySection().activity.rounds'),index=rounds.findIndex(r=>r.id==='repair-mapping');assert.ok(index>=0);
 for(const r of rounds.slice(0,index))assert.equal(h.run(`WorkshopEngine.submit(studyState(),studySection(),${JSON.stringify(B.witness(r))})`),true);
 h.run('renderWorld();ApplicationScene.refresh()');assert.ok(h.get('applicationInspection'));
 const before=h.run('JSON.stringify(state)'),scenario=h.run('PlaytestDecisionTask.visibleTask().scenario');
 h.click('applicationInspection');assert.equal(h.run('JSON.stringify(state)'),before);assert.ok(h.get('dialogBody').innerHTML.includes(scenario.zh));
 h.run("changeTownLanguage('en')");assert.ok(h.get('dialogBody').innerHTML.includes(scenario.en));
 h.run("changeTownLanguage('bi')");assert.ok(h.get('dialogBody').innerHTML.includes(scenario.zh));assert.ok(h.get('dialogBody').innerHTML.includes(scenario.en));
 assert.equal(h.run('WorkshopEngine.progress(studyState(),studySection()).round'),index);
 h.click('applicationInspectBack');h.click('applicationWorkshop');assert.ok(h.get('legacyRepairRoot'));
});
test('layout fixture keeps both application landmarks in all four learning scenes for both built-in editions',async()=>{
 const h=await load();let previous=null;
 for(const which of ['legacy5','aib5']){
  h.run(`close();openTeachingCourse(${JSON.stringify(which)})`);
  for(let chapter=0;chapter<h.run('currentCourse().chapters.length');chapter++){
   // Layout fixture only: make the first section's existing prerequisite records internally consistent.
   h.run(`{const c=teachingContext();c.s.chapter=${chapter};c.s.section=0;c.s.mode='learn';state.zone=studyChapter().zone;for(const l of studySection().lessons){for(const key of ['viewed','found','favorites'])if(!c.p[key].includes(l.id))c.p[key].push(l.id);const step=c.flow.foundation(studySection().id,l.id).id;if(!c.p.foundations.includes(step))c.p.foundations.push(step);for(const key of ['read','deposited'])if(!c.s[key].includes(l.id))c.s[key].push(l.id);}close();renderWorld();ApplicationScene.refresh();}`);
   assert.ok(h.get('applicationWorkshop'),which+' chapter '+chapter+' workshop');
   assert.ok(h.get('applicationInspection'),which+' chapter '+chapter+' inspection');
   assert.ok(h.list('[data-application-knowledge]').length>0,which+' chapter '+chapter+' rereading keepsakes');
   if(previous){previous.click();assert.ok(!h.get('b5DemoDone'),'cross-section stale workshop callback is rejected');}
   previous=h.get('applicationWorkshop');
  }
 }
});
