const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),J=require('../dist/journey.js'),packs=require('../dist/packs.js');
function fresh(){const s=E.fresh(packs[0].id);J.normalize(s);return s;}
test('investigation gates cannot be bypassed by selecting a correct tool alone',()=>{
 const s=fresh();J.enter(s,'archive');s.journey.chosen='rules';assert.equal(J.letter(s,packs[0]).blocked,true);assert.equal(s.journey.letterAttempts[0],0);
 J.inspect(s,'clue0');assert.equal(J.letter(s,packs[0]).ok,true);assert.equal(s.routes[0],'rules');
});
test('wrong letter choice is recoverable, keeps evidence and preserves first performance',()=>{
 const s=fresh();J.enter(s,'archive');J.inspect(s,'clue0');s.journey.chosen='generate';assert.equal(J.letter(s,packs[0]).ok,false);
 s.journey.chosen='rules';assert.equal(J.letter(s,packs[0]).ok,true);assert.equal(s.journey.letterFirst[0],false);assert.equal(s.journey.letterAttempts[0],2);assert.deepEqual(s.journey.evidence,[0]);
});
test('rooms require previous completion; arbitrary unrelated objects cannot grant evidence',()=>{
 const s=fresh();assert.equal(J.enter(s,'tower'),false);assert.equal(J.inspect(s,'beacon'),false);J.enter(s,'archive');assert.equal(J.inspect(s,'survey'),false);assert.equal(s.journey.evidence.length,0);
 s.completed=[0];assert.equal(J.enter(s,'workshop'),true);assert.equal(J.enter(s,'garden'),false);
});
test('early exploration does not complete the machine; all necessary investigation remains required',()=>{
 const s=fresh();s.completed=[0];J.enter(s,'workshop');J.inspect(s,'tokens');J.inspect(s,'lock');assert.equal(J.ready(s,1),false);J.inspect(s,'machine');assert.equal(J.ready(s,1),true);
});
test('survey, quality record and apparatus are independently required',()=>{
 const s=fresh();s.completed=[0,1];J.enter(s,'garden');J.inspect(s,'crystal');assert.equal(J.ready(s,2),false);J.inspect(s,'survey');assert.equal(J.ready(s,2),false);J.inspect(s,'quality');assert.equal(J.ready(s,2),true);
});
test('malformed journey safely resets, valid room/evidence progress survives serialization',()=>{
 const s=fresh();s.journey.panel=null;assert.equal(J.normalize(s).room,'map');J.enter(s,'archive');J.inspect(s,'clue1');const t=E.restore(JSON.stringify(s),packs[0]);J.normalize(t);assert.equal(t.journey.room,'archive');assert.deepEqual(t.journey.evidence,[1]);
});
test('tutorial state does not award formal experience; event history is bounded',()=>{
 const s=fresh();s.journey.tutorialDone=true;s.journey.tutorial=3;J.log(s,'tutorial','completed');assert.equal(s.xp,0);assert.deepEqual(s.attempts,[0,0,0,0]);for(let i=0;i<450;i++)J.log(s,'inspect',i);assert.equal(s.journey.events.length,400);
});
test('a first letter failure cannot turn into an independent first-pass bonus',()=>{
 const s=fresh(),p=packs[0];p.routes.forEach((r,i)=>s.routes[i]=r.answer);s.first[0]=false;assert.equal(E.submit(p,s),true);assert.equal(s.xp,65);
});
