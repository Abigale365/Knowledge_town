'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ambient=require('../src/scene-ambient.js');
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const animationSnapshot=['scene-ambient.js','scene-ambient.css'].map(name=>[name,digest(path.resolve(__dirname,'../src',name))]);
function assertPreviewSnapshot(){
 const runtime=process.env.TOWN_TEST_DIST||path.resolve(__dirname,'../../../dist');
 for(const[name,expected]of animationSnapshot)assert.equal(digest(path.join(runtime,name)),expected,`${name}: preview differs from animation source loaded by this test; build an isolated preview and set TOWN_TEST_DIST (runtime=${runtime})`);
}
test('six scenes generate decorative, scene-specific bounded markup',()=>{
 const zones=['grove','harbor','town','observatory','seaside','winter'];
 const output=zones.map(z=>ambient.markup(z)||ambient.away(z));
 for(const s of output){assert.equal((s.match(/<svg /g)||[]).length,1);assert.match(s,/aria-hidden="true" focusable="false"/);assert.doesNotMatch(s,/<button|tabindex|onclick|<filter|<animate/);assert.ok(s.length<11000);}
 for(const s of output)assert.doesNotMatch(s,/<image|<mask|scene-leaf|scene-fall|scene-current|scene-surf|scene-ring|scene-mist|scene-clock/);
 for(const s of output.slice(0,5))assert.equal((s.match(/class="scene-visitor /g)||[]).length,2);
 assert.match(output[0],/scene-butterfly/);assert.match(output[1],/scene-dragonfly/);
 assert.match(output[4],/scene-gull/);
 assert.match(output[5],/scene-snow/);assert.doesNotMatch(output[5],/scene-visitor/);
 assert.equal(ambient.markup('unknown'),'');
});
test('same scene retains its animation nodes; switches replace instead of accumulating',()=>{
 let writes=0;const layer={dataset:{},set innerHTML(value){this.value=value;writes++;}};
 for(let i=0;i<60;i++){ambient.render('grove',null,layer);}
 assert.equal(writes,1);
 for(let i=0;i<60;i++)ambient.render(i%2?'town':'harbor',null,layer);
 assert.equal(writes,61);assert.equal((layer.value.match(/<svg /g)||[]).length,1);assert.match(layer.value,/scene-ambient-town/);assert.doesNotMatch(layer.value,/ambient-harbor-leaf/);
});
test('seaside visitors remain inside centered cover crops on wide and narrow canvases',()=>{
 const birds=[...ambient.away('seaside').matchAll(/translate\((\d+) (\d+)\).*?--flight-x:(-?\d+)px;--flight-y:(-?\d+)px/g)].map(m=>m.slice(1).map(Number));
 assert.equal(birds.length,2);
 for(const [w,h]of [[1440,550],[360,360]]){
  const scale=Math.max(w/1672,h/941),left=(1672-w/scale)/2,top=(941-h/scale)/2;
  for(const[x,y,dx,dy]of birds){
   assert.ok(x+Math.min(0,dx)-22>left&&x+22<1672-left);
   assert.ok(y-Math.abs(dy)-22>top&&y+Math.abs(dy)+22<941-top);
  }
 }
});
test('gulls have independent vertical motion phased a quarter cycle from horizontal turns',()=>{
 const markup=ambient.away('seaside');
 const timing=[...markup.matchAll(/--ambient-duration:([\d.]+)s;--ambient-delay:([\d.-]+)s;--gull-y-delay:([\d.-]+)s/g)].map(m=>m.slice(1).map(Number));
 assert.equal(timing.length,2);assert.equal((markup.match(/class="gull-drift"/g)||[]).length,2);
 for(const[duration,xDelay,yDelay]of timing)assert.equal(xDelay-yDelay,duration/4);
});
test('each main scene keeps at least one full visitor route in normal centered crops',()=>{
 for(const zone of ['grove','harbor','town','observatory']){
  const visitors=[...ambient.markup(zone).matchAll(/translate\((\d+) (\d+)\).*?--flight-x:(-?\d+)px;--flight-y:(-?\d+)px/g)].map(m=>m.slice(1).map(Number));
  for(const[w,h]of [[1440,280],[1440,550],[2560,360],[360,280],[360,640],[360,900]]){
   const scale=Math.max(w/1536,h/1024),left=(1536-w/scale)/2,top=(1024-h/scale)/2;
   assert.ok(visitors.some(([x,y,dx,dy])=>x+Math.min(0,dx)-22>left&&x+Math.max(0,dx)+22<1536-left&&y+Math.min(0,dy)-22>top&&y+Math.max(8,dy)+22<1024-top),`${zone}: no complete visitor route in ${w}x${h} cover crop`);
  }
 }
});
test('visitor routes avoid conservative NPC body and responsibility-label route envelopes',()=>{
 const catalog=require('../src/world-catalog.js'),ratio=1536/2400;
 for(const[zone,{routes}]of Object.entries(catalog.zones)){
  const visitors=[...ambient.markup(zone).matchAll(/translate\((\d+) (\d+)\).*?--flight-x:(-?\d+)px;--flight-y:(-?\d+)px/g)].map(m=>m.slice(1).map(Number));
  for(const[x,y,dx,dy]of visitors){
   const b=[x+Math.min(0,dx)-22,y+Math.min(0,dy)-22,x+Math.max(0,dx)+22,y+Math.max(8,dy)+22];
   for(const[px,py,rx,ry]of routes){
    // 120x128 world-pixel NPC; centered 210-wide label, gap 8 and 112-high text allowance.
    // Includes the bilingual name and up to three English lines of the current role copy.
    // Geometry proxy only: actual translated text height still needs browser measurement.
    const n=[px*15.36+(Math.min(0,rx)-45)*ratio,py*10.24+Math.min(0,ry)*ratio,px*15.36+(Math.max(0,rx)+165)*ratio,py*10.24+(Math.max(0,ry)+248)*ratio];
    assert.ok(!(b[0]<n[2]&&b[2]>n[0]&&b[1]<n[3]&&b[3]>n[1]),`${zone} visitor at ${x},${y} crosses NPC/label route envelope`);
   }
  }
 }
});
test('real entry order installs one ambient layer and away markup without changing progress',async()=>{
 assertPreviewSnapshot();
 const harness=require('../../../tests/town-harness.cjs');
 const h=await harness(new Map(),{entrySchedule:true});
 const progress='JSON.stringify(Object.fromEntries(["chapter","section","read","carried","deposited","sealed","submitted","records","assessments"].map(k=>[k,studyState()[k]])))';
 const before=h.run(progress);
 const origin=h.run('state.zone');
 const snapshot=()=>h.run('({chapter:studyState().chapter,zone:state.zone,course:currentCourse()?.id,selected:state.selected,away:activeAwayScene})');
 const trace=[{phase:'origin',...snapshot()}];
 assert.equal(h.run('worldReady'),true,JSON.stringify({reason:'startup not ready',trace}));
 assert.equal(h.run('currentCourse().chapters[studyState().chapter].zone'),origin,JSON.stringify({reason:'initial scene/chapter mismatch',trace}));
 const mainLayer=h.get('ambientScene');
 for(let cycle=0;cycle<2;cycle++)for(const zone of ['grove','harbor','town','observatory']){
  h.run(`changeZone('${zone}')`);
  trace.push({phase:'changeZone',requested:zone,...snapshot()});
  assert.equal(h.run('state.zone'),zone,JSON.stringify({reason:'zone selection failed',trace}));
  assert.equal(h.run('currentCourse().chapters[studyState().chapter].zone'),zone,JSON.stringify({reason:'chapter selection failed',trace}));
  assert.equal(h.get('ambientScene'),mainLayer);
  assert.equal(h.get('world').children.filter(x=>x.id==='ambientScene').length,1);
  const sceneNodes=mainLayer.children;
  h.run('render();renderWorld()');assert.equal(mainLayer.children,sceneNodes,'ordinary redraw must retain animated nodes');
  for(const away of ['seaside','winter','seaside']){
   h.run(`openAwayScene('${away}')`);
   assert.equal(h.run('document.body.children.filter(el=>el.id==="awayScene").length'),1);
   assert.equal((h.get('awayScene').innerHTML.match(/class="scene-ambient /g)||[]).length,1);
   assert.match(h.get('awayScene').innerHTML,away==='winter'?/scene-lamplight/:/xMidYMid slice/);
  }
  h.run('closeAwayScene()');assert.equal(h.get('awayScene'),undefined);
  trace.push({phase:'closeAwayScene',...snapshot()});
  assert.equal(h.get('ambientScene'),mainLayer);assert.equal(mainLayer.children,sceneNodes);
  assert.equal(h.run('document.body.classList.contains("away-open")'),false);
 }
 h.run(`changeZone('${origin}')`);
 trace.push({phase:'restore-origin',requested:origin,...snapshot()});
 assert.equal(h.run(progress),before,JSON.stringify({origin,beforeChapter:JSON.parse(before).chapter,after:snapshot(),runtime:process.env.TOWN_TEST_DIST||'default dist',trace},null,2));
 assertPreviewSnapshot();
});
