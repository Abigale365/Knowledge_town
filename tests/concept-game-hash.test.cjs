'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),H=require('../apps/game/src/concept-game-hash.js');
test('browser content digest agrees with Node SHA-256 for Unicode and padding boundaries',()=>{
 for(const s of ['', 'abc', '知识：确定性 🌿',...Array.from({length:130},(_,i)=>'x'.repeat(i)), 'large-course'.repeat(10000)])assert.equal(H.sha256(s),crypto.createHash('sha256').update(s).digest('hex'));
});
test('canonical digest is independent of object insertion order and preserves meaningful lesson changes',()=>{
 const first={title:'概念',en:{title:'Concept',body:'Rule'},examples:[1,2]},second={examples:[1,2],en:{body:'Rule',title:'Concept'},title:'概念'};
 assert.equal(H.digest(first),H.digest(second));assert.notEqual(H.digest(first),H.digest({...first,examples:[2,1]}));assert.notEqual(H.digest(first),H.digest({...first,title:'其他概念'}));
});
