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
const mainZones=['grove','harbor','town','observatory'];
const effects=s=>[...s.matchAll(/data-effect="([a-z]+)" data-bounds="([\d. -]+)"/g)].map(m=>({kind:m[1],bounds:m[2].split(' ').map(Number)}));
test('six scenes use distinct bounded decorations without butterfly or background patches',()=>{
 const zones=[...mainZones,'seaside','winter'];
 const output=zones.map(z=>ambient.markup(z)||ambient.away(z));
 for(const s of output){
  assert.equal((s.match(/<svg /g)||[]).length,1);
  assert.match(s,/aria-hidden="true" focusable="false"/);
  assert.match(s,/<svg fill="none"/); // Unfilled open stroke paths must never acquire black wedges.
  assert.doesNotMatch(s,/<button|tabindex|onclick|<filter|<animate|<image|<mask|butterfly|dragonfly/);
  assert.ok(s.length<16000);
  assert.ok((s.match(/<(?:g|path|ellipse|circle|stop|defs|radialGradient)\b/g)||[]).length<130);
 }
 const expected=[['leaf','mote'],['paperboat','gull'],['bee','petal'],['seed','glint'],['gull','crab']];
 expected.forEach((types,i)=>{for(const type of types)assert.match(output[i],new RegExp(`data-effect="${type}"`));assert.ok(effects(output[i]).length>=3);});
 assert.match(output[5],/scene-snow/);assert.match(output[5],/radialGradient/);
 assert.equal(ambient.markup('unknown'),'');
});
test('same scene retains nodes; switches replace instead of accumulating',()=>{
 let writes=0;const layer={dataset:{},set innerHTML(value){this.value=value;writes++;}};
 for(let i=0;i<60;i++)ambient.render('grove',null,layer);
 assert.equal(writes,1);
 for(let i=0;i<60;i++)ambient.render(i%2?'town':'harbor',null,layer);
 assert.equal(writes,61);assert.equal((layer.value.match(/<svg /g)||[]).length,1);
 assert.match(layer.value,/scene-ambient-town/);assert.doesNotMatch(layer.value,/paperboat/);
});
test('separate-axis timing and finite route envelopes are deterministic',()=>{
 for(const zone of [...mainZones,'seaside']){
  const s=ambient.markup(zone)||ambient.away(zone);
  const timings=[...s.matchAll(/--ambient-duration:([\d.]+)s;--ambient-delay:([\d.-]+)s;--vertical-delay:([\d.-]+)s/g)];
  assert.equal(timings.length,effects(s).length);
  for(const m of timings)assert.ok(Math.abs(Number(m[2])-Number(m[3])-Number(m[1])/4)<.011);
  for(const {bounds:b}of effects(s)){assert.ok(b.every(Number.isFinite));assert.ok(b[2]>b[0]&&b[3]>b[1]);}
 }
});
test('each scene retains a full decoration route in wide and portrait centered crops',()=>{
 for(const zone of [...mainZones,'seaside']){
  const away=zone==='seaside',width=away?1672:1536,height=away?941:1024;
  for(const[w,h]of [[1440,280],[1440,550],[2560,360],[360,280],[360,640],[360,900]]){
   const scale=Math.max(w/width,h/height),left=(width-w/scale)/2,top=(height-h/scale)/2;
   assert.ok(effects(ambient.markup(zone)||ambient.away(zone)).some(({bounds:b})=>b[0]>left&&b[2]<width-left&&b[1]>top&&b[3]<height-top),`${zone}: no full route in ${w}x${h}`);
  }
 }
});
test('decoration envelopes avoid conservative NPC body and responsibility-label routes',()=>{
 const catalog=require('../src/world-catalog.js'),ratio=1536/2400;
 for(const[zone,{routes}]of Object.entries(catalog.zones))for(const{kind,bounds:b}of effects(ambient.markup(zone))){
  for(const[px,py,rx,ry]of routes){
   // Geometry proxy only. Actual bilingual text height still requires browser measurement.
   const n=[px*15.36+(Math.min(0,rx)-45)*ratio,py*10.24+Math.min(0,ry)*ratio,px*15.36+(Math.max(0,rx)+165)*ratio,py*10.24+(Math.max(0,ry)+248)*ratio];
   assert.ok(!(b[0]<n[2]&&b[2]>n[0]&&b[1]<n[3]&&b[3]>n[1]),`${zone} ${kind} ${b} crosses NPC/label envelope`);
  }
 }
});
test('decorations remain pointer transparent, motion reduced and paused behind dialogs',()=>{
 const css=fs.readFileSync(path.resolve(__dirname,'../src/scene-ambient.css'),'utf8');
 assert.match(css,/\.scene-ambient \*\{pointer-events:none\}/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{\.scene-ambient\{display:none\}/);
 assert.match(css,/body\.dialog-open \.scene-ambient \*\{animation-play-state:paused!important\}/);
 assert.doesNotMatch(fs.readFileSync(path.resolve(__dirname,'../src/scene-ambient.js'),'utf8'),/setInterval|setTimeout|requestAnimationFrame|addEventListener/);
});
test('wind and wildlife use differentiated motion without backward gull flight',()=>{
 const css=fs.readFileSync(path.resolve(__dirname,'../src/scene-ambient.css'),'utf8');
 // Gull artwork faces left. A one-way route must face right iff dx is positive.
 for(const zone of ['harbor','seaside']){
  const s=ambient.markup(zone)||ambient.away(zone);
  const birds=[...s.matchAll(/class="little-route little-gull" style="([^"]+)"/g)];
  assert.ok(birds.length>=2);
  for(const[,style]of birds){const dx=Number(style.match(/--flight-x:([\d.-]+)px/)[1]);assert.equal(Number(style.match(/--heading:([\d.-]+);/)[1]),dx>0?-1:1);}
 }
 assert.match(css,/\.little-gull,\.little-leaf,\.little-petal,\.little-seed\{animation-name:little-pass;animation-timing-function:linear\}/);
 const pass=css.match(/@keyframes little-pass\{([^\n]+)/)[1];
 assert.match(pass,/0%\{transform:translateX\(0\);opacity:0\}/);
 assert.match(pass,/100%\{transform:translateX\(var\(--flight-x\)\);opacity:0\}/);
 // Dy values are negative, so this sink travels top -> bottom, without a visible return.
 for(const zone of ['grove','town','observatory'])for(const[,dy]of ambient.markup(zone).matchAll(/class="little-route little-(?:leaf|petal|seed)" style="[^"]*--flight-y:([\d.-]+)px/g))assert.ok(Number(dy)<0);
 assert.match(css,/@keyframes little-sink\{from\{transform:translateY\(var\(--flight-y\)\)\}to\{transform:translateY\(calc\(var\(--flight-y\)\*-1\)\)\}\}/);
 assert.match(css,/\.boat-hull\{animation:little-boat/);
 assert.match(css,/\.little-bee\{animation-name:little-forage\}/);
 assert.match(css,/\.little-crab\{animation-name:little-scuttle\}/);
 const snow=[...ambient.away('winter').matchAll(/--snow-drift:([\d.]+)px;--snow-fall:([\d.]+)px/g)];
 assert.equal(snow.length,28);assert.ok(new Set(snow.map(m=>m[1])).size>=5);assert.ok(new Set(snow.map(m=>m[2])).size>=4);
});
test('observatory glints stay on the painted blue dome and winter steam stays by the chimney',()=>{
 // Small safe blue areas identified from the 1536x1024 original, away from brass/stone.
 const blue=[[1000,60,1080,110],[1100,180,1155,230]];
 const glints=effects(ambient.markup('observatory')).filter(e=>e.kind==='glint');
 assert.equal(glints.length,2);
 for(const{bounds:b}of glints)assert.ok(blue.some(r=>b[0]>=r[0]&&b[1]>=r[1]&&b[2]<=r[2]&&b[3]<=r[3]));
 const winter=ambient.away('winter'),steam=effects(winter).filter(e=>e.kind==='steam');
 assert.equal(steam.length,2);
 for(const{bounds:b}of steam)assert.ok(b[0]>=1280&&b[1]>=80&&b[2]<=1400&&b[3]<=220,'steam must remain local to the locomotive chimney');
 assert.equal((winter.match(/data-effect="steam"[^>]+transform="translate\(1328 151\)"/g)||[]).length,2);
 assert.equal((winter.match(/class="scene-snow"/g)||[]).length,28,'steam must not add a duplicate snow layer');
});
test('boat stays in open water, bees stay by flowers, and hull rocking leaves the wake flat',()=>{
 // Original-art inspection: clear water below the north dock and two flower arches.
 const water=[1190,775,1305,850],flowers=[[1100,720,1200,825],[1240,720,1355,820]];
 const inside=(b,r)=>b[0]>=r[0]&&b[1]>=r[1]&&b[2]<=r[2]&&b[3]<=r[3];
 const boat=effects(ambient.markup('harbor')).filter(e=>e.kind==='paperboat');
 assert.equal(boat.length,1);assert.ok(inside(boat[0].bounds,water));
 const bees=effects(ambient.markup('town')).filter(e=>e.kind==='bee');
 assert.equal(bees.length,2);for(const{bounds:b}of bees)assert.ok(flowers.some(r=>inside(b,r)));
 const css=fs.readFileSync(path.resolve(__dirname,'../src/scene-ambient.css'),'utf8');
 assert.match(css,/\.little-paperboat \.little-body\{animation:none\}/);
 assert.match(css,/\.boat-wake\{animation:little-wake/);
 const wake=css.match(/@keyframes little-wake\{([^\n]+)/)[1];
 assert.doesNotMatch(wake,/rotate|translateY/);
 assert.match(wake,/scaleX\(1\.05\)/);
});

test('all generated SVG elements remain balanced after nested motion groups are split',()=>{
 for(const zone of [...mainZones,'seaside','winter']){
  const stack=[];
  for(const m of (ambient.markup(zone)||ambient.away(zone)).matchAll(/<(\/?)([A-Za-z][\w:-]*)\b[^>]*>/g)){
   if(m[1])assert.equal(stack.pop(),m[2],`${zone}: unmatched closing ${m[2]}`);
   else if(!m[0].endsWith('/>'))stack.push(m[2]);
  }
  assert.deepEqual(stack,[],`${zone}: unclosed SVG elements`);
 }
});
test('gull wings have separate depth and crab leg pairs alternate without moving the shell',()=>{
 const css=fs.readFileSync(path.resolve(__dirname,'../src/scene-ambient.css'),'utf8');
 for(const zone of ['harbor','seaside']){
  const s=ambient.markup(zone)||ambient.away(zone),count=effects(s).filter(e=>e.kind==='gull').length;
  assert.equal((s.match(/class="gull-wing-far"/g)||[]).length,count);
  assert.equal((s.match(/class="gull-wing-near"/g)||[]).length,count);
 }
 assert.match(css,/\.little-gull \.little-wings\{animation:none\}/,'old symmetric wing flattening must not stack on new wing motion');
 assert.match(css,/\.gull-wing-near\{animation:little-gull-wing/);
 assert.match(css,/\.gull-wing-far\{animation:little-gull-far/);
 const seaside=ambient.away('seaside');
 assert.equal((seaside.match(/class="crab-legs crab-legs-[ab]"/g)||[]).length,2);
 assert.match(css,/\.crab-legs-b\{--leg-sweep:-9deg\}/);
 assert.match(css,/skewX\(var\(--leg-sweep,9deg\)\)/);
 assert.match(css,/\.little-crab \.little-body\{animation:none\}/,'gait must not shear the shell or ground shadow');
});
test('wind curves and depth variation stay inside the declared route envelope',()=>{
 const variants=new Set(),sizes=new Set();
 for(const zone of ['grove','town','observatory']){
  const wind=[...ambient.markup(zone).matchAll(/class="little-route little-(?:leaf|petal|seed)" style="([^"]+)"/g)];
  assert.ok(wind.length>=3);
  for(const[,style]of wind){
   const coefficients=['first','mid','late'].map(key=>Number(style.match(new RegExp(`--wind-${key}:([\\d.]+);`))[1]));
   for(const p of coefficients)assert.ok(p>=0&&p<=1,'wind keyframe must not overshoot the original x route');
   const scale=Number(style.match(/--figure-scale:([\d.]+);/)[1]);assert.ok(scale>=.9&&scale<=1,'depth may shrink a silhouette but must not exceed its paint envelope');
   variants.add(coefficients.join(','));sizes.add(scale);
  }
 }
 assert.ok(variants.size>=3);assert.equal(sizes.size,3);
 const css=fs.readFileSync(path.resolve(__dirname,'../src/scene-ambient.css'),'utf8');
 assert.match(css,/\.little-leaf,\.little-petal\{animation-name:little-wind;animation-timing-function:ease-in-out\}/);
 assert.match(css,/@keyframes little-wind\{/);assert.match(css,/var\(--flight-x\)\*var\(--wind-mid\)/);
 assert.match(css,/\.little-seed \.little-body\{animation:little-seed-nod calc\(var\(--detail-duration\)\*1\.8\)/);
});
test('winter snow has sparse near depth and crab stays on clear sand',()=>{
 const winter=ambient.away('winter');
 const flakes=[...winter.matchAll(/class="scene-snow" data-depth="(near|far)"[^>]+r="([\d.]+)" style="([^"]+)"/g)].map(m=>{
  const prop=k=>Number(m[3].match(new RegExp(`--${k}:([\\d.]+)`))[1]);
  return{depth:m[1],radius:Number(m[2]),speed:(140+prop('snow-fall'))/prop('ambient-duration'),peak:prop('snow-peak')};
 });
 const near=flakes.filter(f=>f.depth==='near'),far=flakes.filter(f=>f.depth==='far');
 assert.equal(flakes.length,28);assert.equal(near.length,7);assert.equal(far.length,21);
 assert.ok(Math.min(...near.map(f=>f.radius))>Math.max(...far.map(f=>f.radius)));
 assert.ok(Math.min(...near.map(f=>f.speed))>Math.max(...far.map(f=>f.speed)),'near flakes must travel faster, not just use shorter duration');
 assert.ok(Math.min(...near.map(f=>f.peak))>Math.max(...far.map(f=>f.peak)));
 assert.ok(flakes.every(f=>f.peak>0&&f.peak<=.65&&f.radius<=2.6));
 const crab=effects(ambient.away('seaside')).filter(e=>e.kind==='crab');assert.equal(crab.length,1);
 const[b]=crab.map(e=>e.bounds);assert.ok(b[0]>=600&&b[1]>=330&&b[2]<=720&&b[3]<=460,'crab route must stay on the inspected clear sand');
});
test('multiline NPC labels grow below the sprite frame without extending the hit area',()=>{
 const css=fs.readFileSync(path.resolve(__dirname,'../src/scene-ambient.css'),'utf8');
 const declarations=selector=>Object.fromEntries(css.match(new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\{([^}]+)\\}'))[1].split(';').filter(Boolean).map(x=>{const at=x.indexOf(':');return[x.slice(0,at),x.slice(at+1)];}));
 const frame=declarations('#villagers .npc'),label=declarations('#villagers .npc-label');
 const width=parseFloat(frame.width),height=parseFloat(frame.height),outerMax=parseFloat(label['max-width']);
 assert.equal(width,120);assert.equal(height,128);
 assert.equal(label.top,'calc(100% + 8px)');assert.equal(label.bottom,'auto');
 assert.equal(label['box-sizing'],'border-box');assert.equal(outerMax,210);
 assert.equal(label['pointer-events'],'none');assert.equal(label['white-space'],'normal');assert.equal(label['overflow-wrap'],'anywhere');
 // CSS geometry only, not measured translated text: short zh, multiline en/bi,
 // and an extreme-height label all have the same top independent of height.
 for(const labelHeight of [24,56,112,220]){
  const top=height+8,bottom=top+labelHeight;
  assert.ok(top>=height+8);assert.ok(bottom>top);
  assert.deepEqual([width/2-outerMax/2,width/2+outerMax/2],[-45,165]);
 }
 assert.match(css,/#villagers \.npc:focus-within \.npc-label small\{display:block\}/);
 assert.match(css,/#villagers \.npc:focus-within,#villagers \.npc:active\{animation-play-state:paused!important\}/);
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
 const dialogCycle=()=>{
  const mainNodes=mainLayer.children,awayLayer=h.get('awayScene');
  h.run('modal(`<h2 id="dialogTitle">Environment pause check</h2>`)');
  assert.equal(h.run('document.body.classList.contains("dialog-open")'),true,'shared modal must set the CSS pause flag');
  assert.equal(h.get('dialog').open,true);
  assert.equal(mainLayer.children,mainNodes,'opening a dialog must not restart main-scene animation nodes');
  h.run('close()');
  assert.equal(h.run('document.body.classList.contains("dialog-open")'),false,'closing must release the pause flag');
  assert.equal(h.get('dialog').open,false);
  assert.equal(mainLayer.children,mainNodes);
  if(awayLayer){
   assert.equal(h.get('awayScene'),awayLayer,'dialog close must retain the away scene');
   assert.equal((awayLayer.innerHTML.match(/class="scene-ambient /g)||[]).length,1);
  }
 };
 for(let cycle=0;cycle<2;cycle++)for(const zone of ['grove','harbor','town','observatory']){
  h.run(`changeZone('${zone}')`);
  trace.push({phase:'changeZone',requested:zone,...snapshot()});
  assert.equal(h.run('state.zone'),zone,JSON.stringify({reason:'zone selection failed',trace}));
  assert.equal(h.run('currentCourse().chapters[studyState().chapter].zone'),zone,JSON.stringify({reason:'chapter selection failed',trace}));
  assert.equal(h.get('ambientScene'),mainLayer);
  assert.equal(h.get('world').children.filter(x=>x.id==='ambientScene').length,1);
  const sceneNodes=mainLayer.children;
  h.run('render();renderWorld()');assert.equal(mainLayer.children,sceneNodes,'ordinary redraw must retain animated nodes');
  dialogCycle();
  for(const away of ['seaside','winter','seaside']){
   h.run(`openAwayScene('${away}')`);
   assert.equal(h.run('document.body.children.filter(el=>el.id==="awayScene").length'),1);
   assert.equal((h.get('awayScene').innerHTML.match(/class="scene-ambient /g)||[]).length,1);
   assert.match(h.get('awayScene').innerHTML,away==='winter'?/scene-lamplight/:/xMidYMid slice/);
   if(away==='winter')dialogCycle();
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
