'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const harness=require('../../../tests/town-harness.cjs');
const source=fs.readFileSync(path.join(__dirname,'../src/release-guide.js'),'utf8');
async function load(data=new Map(),installedBeforeHost=false){
 const h=await harness(data,{entrySchedule:true});
 if(installedBeforeHost&&!h.run('!!window.ReleaseGuide'))h.run(source);
 h.installedByEntry=h.run('!!window.ReleaseGuide');
 h.run('var releaseTestExistingHUD=renderHUD,releaseTestExistingLanguage=changeTownLanguage;');
 // The shared flat DOM does not parse header ancestry. Supply only that missing host API.
 h.run(`var releaseTestHeader=document.createElement('header');releaseTestHeader.id='releaseTestHeader';document.body.appendChild(releaseTestHeader);document.querySelector=selector=>selector==='body > header'?releaseTestHeader:null;`);
 h.beforeInstall=h.run('JSON.stringify(state)');
 if(h.installedByEntry)h.run('ReleaseGuide.refresh()');else h.run(source);
 return h;
}
function oldData(){return new Map(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../../../tests/fixtures/pre-integration-9f7f67b-save.json.gz'))).toString('utf8')));}
test('an entry-installed guide is refreshed without installing another HUD or language wrapper',async()=>{
 const h=await load(new Map(),true);
 assert.equal(h.run('renderHUD===releaseTestExistingHUD'),true);
 assert.equal(h.run('changeTownLanguage===releaseTestExistingLanguage'),true);
 assert.equal(h.run('JSON.stringify(state)'),h.beforeInstall);
 assert.ok(h.get('releaseGuideVersion'));
});
test('current B5 edition is visible outside the tray; opening updates never mutates progress',async()=>{
 const h=await load();const before=h.run('JSON.stringify(state)');
 assert.equal(before,h.beforeInstall,'installing the entry is read-only');
 assert.equal(h.run('ReleaseGuide.current().revision'),5);assert.equal(h.get('releaseGuideTry').hidden,true);
 assert.equal(h.run("releaseTestHeader.children.includes(document.getElementById('releaseGuide'))"),true);
 h.run("document.body.classList.add('tray-collapsed');ReleaseGuide.refresh()");
 assert.equal(h.get('releaseGuide').hidden,false);assert.ok(h.get('releaseGuideVersion').innerHTML.includes('教学5'));
 h.click('releaseGuideUpdates');assert.ok(h.get('dialogBody').innerHTML.includes('基础→示范→引导→独立应用'));
 assert.equal(h.run('JSON.stringify(state)'),before);
});
test('nonempty historical bank upgrades explicitly to legacy5, retaining old bank and chapter records',async()=>{
 const h=await load(oldData());const old=h.run('({id:state.selected,bank:JSON.stringify(L.bank(state)),study:JSON.stringify(studyState())})');
 assert.equal(h.run('ReleaseGuide.current().target'),'legacy5');assert.equal(h.get('releaseGuideTry').hidden,false);
 const before=h.run('JSON.stringify(state)');h.click('releaseGuideUpdates');assert.equal(h.run('JSON.stringify(state)'),before);
 h.click('releaseGuideUpgrade');assert.equal(h.run('teachingEntry().revision'),5);assert.equal(h.run('ReleaseGuide.current().kind'),'legacy');
 assert.notEqual(h.run('state.selected'),old.id);assert.equal(h.run(`JSON.stringify(state.banks.find(b=>b.id===${JSON.stringify(old.id)}))`),old.bank);
 assert.equal(h.run(`JSON.stringify(state.chapterStudies[${JSON.stringify(old.id)}])`),old.study);
 h.run(`state.selected=${JSON.stringify(old.id)};renderWorld();save()`);await new Promise(r=>setImmediate(r));
 const re=await load(h.data);assert.equal(re.run('state.selected'),old.id);assert.equal(re.run('JSON.stringify(studyState())'),old.study);assert.equal(re.run('ReleaseGuide.current().revision'),null);
 assert.equal(re.get('releaseGuideTry').hidden,false);assert.ok(!re.get('releaseGuideClose'),'no update popup on restore');
});
test('B4 AIB routes to aib5 and stale dialogs cannot upgrade another selected bank',async()=>{
 const h=await load();h.run("openTeachingCourse('aib');ReleaseGuide.refresh()");
 assert.equal(h.run('ReleaseGuide.current().revision'),4);assert.equal(h.run('ReleaseGuide.current().target'),'aib5');
 h.click('releaseGuideUpdates');const stale=h.get('releaseGuideUpgrade');
 h.run("openTeachingCourse('legacy');ReleaseGuide.refresh()");const selected=h.run('state.selected');stale.click();
 assert.equal(h.run('state.selected'),selected);assert.equal(h.run('teachingEntry().revision'),4);
 h.run("openTeachingCourse('aib');ReleaseGuide.refresh()");h.click('releaseGuideTry');
 assert.equal(h.run('teachingEntry().revision'),5);assert.equal(h.run('ReleaseGuide.current().kind'),'aib');
});
test('three display languages keep header controls stable and never migrate custom or invalid courses',async()=>{
 const h=await load();const button=h.get('releaseGuideUpdates');const progress=h.run('JSON.stringify(state.chapterStudies)');
 h.run("changeTownLanguage('en')");assert.equal(h.get('releaseGuideUpdates'),button);assert.ok(button.innerHTML.includes('View this update'));
 h.run("changeTownLanguage('bi')");assert.equal(h.get('releaseGuideUpdates'),button);assert.ok(button.innerHTML.includes('查看本次更新'));assert.ok(button.innerHTML.includes('lang="en"'));
 h.run("changeTownLanguage('zh')");assert.equal(h.run('JSON.stringify(state.chapterStudies)'),progress);
 button.focus();h.click('releaseGuideUpdates');h.get('releaseGuideClose').focus();
 const returnFocus=h.run('lastFocus');h.run("changeTownLanguage('en')");
 assert.equal(h.run('lastFocus'),returnFocus,'language repaint keeps the original modal return target');
 assert.equal(h.run('document.activeElement.id'),'releaseGuideClose');
 h.run("changeTownLanguage('zh')");
 h.click('releaseGuideClose');h.run("changeTownLanguage('en')");assert.equal(h.get('dialog').open,false,'closed updates stay closed after a language change');
 h.run("changeTownLanguage('zh');L.bank(state).syllabus=structuredClone(currentCourse());L.bank(state).syllabus.chapters[0].sections[0].lessons[0].body+=' custom change';delete L.bank(state).teachingSnapshot;ReleaseGuide.refresh()");
 assert.equal(h.run('ReleaseGuide.current().target'),null,'same ID with modified course content is not an upgrade match');assert.equal(h.get('releaseGuideTry').hidden,true);
 h.run("L.bank(state).syllabus=structuredClone(currentCourse());L.bank(state).syllabus.id='custom-course';delete L.bank(state).teachingSnapshot;ReleaseGuide.refresh()");
 assert.equal(h.run('ReleaseGuide.current().target'),null);assert.equal(h.get('releaseGuideTry').hidden,true);h.click('releaseGuideUpdates');assert.ok(h.get('dialogBody').innerHTML.includes('不会替换自定义内容'));assert.ok(h.get('dialogBody').innerHTML.includes('未绑定物件保留原流程'));
 h.run("L.bank(state).teachingSnapshot={revision:5,courseId:'custom-course',signature:'invalid'};ReleaseGuide.refresh()");assert.equal(h.run('ReleaseGuide.current().invalid'),true);assert.equal(h.get('releaseGuideTry').hidden,true);
 assert.ok(h.get('releaseGuideVersion').innerHTML.includes('未验证'));
});
