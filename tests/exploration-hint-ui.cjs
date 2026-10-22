'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});h.run('close()');
 for(const [vw,vh,r,w,height]of [
  [1200,800,{left:400,top:450,width:48,height:48},270,120],
  [360,640,{left:150,top:20,width:48,height:48},270,180],
  [360,640,{left:290,top:550,width:48,height:48},270,180],
  [1200,800,{left:400,top:250,width:48,height:48},270,340]
 ]){const p=h.run(`explorationHintPosition(${JSON.stringify(r)},${w},${height},${vw},${vh})`);
  assert.ok(p.x>=8&&p.y>=8&&p.x+w<=vw-8&&p.y+height<=vh-8);
  assert.ok(p.x+w<=r.left||p.x>=r.left+r.width||p.y+height<=r.top||p.y>=r.top+r.height,'hint must not cover target');
 }
 const object=h.list('[data-object]')[0];object.onmouseenter();assert.ok(h.get('sceneExploreHint'));assert.ok(h.run('document.body.classList.contains("exploration-hint-open")'));
 object.onmouseleave();assert.ok(!h.get('sceneExploreHint'));assert.equal(h.run('document.body.classList.contains("exploration-hint-open")'),false);
 console.log('PASS: measured tooltip placement avoids objects for bilingual heights, narrow screens and viewport edges; duplicate scene tip suppressed. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
