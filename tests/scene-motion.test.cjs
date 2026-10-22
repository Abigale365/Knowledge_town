'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),Motion=require('../apps/game/src/scene-motion.js');
const root=groups=>({querySelectorAll:()=>groups.map(a=>({getAnimations:()=>a}))});
test('same-scene redraw retains each decorative CSS animation time without resuming paused motion',()=>{
 const saved=Motion.capture(root([[{animationName:'flight',currentTime:5123,playbackRate:1},{animationName:'flight',currentTime:8241,playbackRate:0}],[{animationName:'snow',currentTime:3920,playbackRate:1}]]),'winter');
 const next=[{animationName:'flight',currentTime:0},{animationName:'flight',currentTime:0},{animationName:'snow',currentTime:0},{animationName:'new',currentTime:0}];Motion.restore(root([next]),saved,'winter');assert.deepEqual(next.map(a=>a.currentTime),[5123,8241,3920,0]);assert.equal(next[1].playbackRate,0);
 const other={animationName:'flight',currentTime:0};Motion.restore(root([[other]]),saved,'seaside');assert.equal(other.currentTime,0);
});
test('missing animation API, reduced-motion empty lists and unresolved times safely do nothing',()=>{
 assert.deepEqual(Motion.capture({},'seaside').items,[]);const saved=Motion.capture(root([[{animationName:'flight',currentTime:null}]]),'seaside');assert.equal(saved.items.length,0);assert.doesNotThrow(()=>Motion.restore({},saved,'seaside'));
});

test('an unresolved same-name animation keeps its slot rather than shifting subsequent instances',()=>{
 const saved=Motion.capture(root([[{animationName:'hover',currentTime:null},{animationName:'hover',currentTime:8241,playbackRate:1}]]),'seaside');
 const next=[{animationName:'hover',currentTime:0},{animationName:'hover',currentTime:0}];Motion.restore(root([next]),saved,'seaside');assert.deepEqual(next.map(a=>a.currentTime),[0,8241]);
});
