'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),R=require('../apps/game/src/concept-game-records.js');
const binding={courseId:'course-a',courseRevision:'1',courseDigest:'course-hash',lessonId:'1.1',lessonDigest:'knowledge-hash',gameId:'rule-machine',gameRevision:'1',gameDigest:'game-hash'};
const validate=d=>Array.isArray(d.runs)&&d.runs.every(n=>Number.isInteger(n)&&n>=0);
test('exact bank, course, knowledge and game binding prevents shared 1.1 or revised content inheriting evidence',()=>{
 const s=R.fresh();assert.ok(R.write(s,'bank-a',binding,{runs:[2,2]},validate));
 assert.deepEqual(R.read(s,'bank-a',binding,validate),{runs:[2,2]});
 assert.equal(R.read(s,'bank-b',binding,validate),null);
 for(const key of ['courseId','courseRevision','courseDigest','lessonId','lessonDigest','gameId','gameRevision','gameDigest'])assert.equal(R.read(s,'bank-a',{...binding,[key]:'changed'},validate),null,key);
});
test('refresh/backup round trip preserves draft without trusting completion flags or malformed game evidence',()=>{
 const s=R.fresh(),draft={runs:[2]};assert.ok(R.write(s,'bank-a',binding,draft,validate));draft.runs.push(9);
 const loaded=JSON.parse(JSON.stringify(s));assert.ok(R.valid(loaded,['bank-a']));assert.deepEqual(R.read(loaded,'bank-a',binding,validate),{runs:[2]});
 assert.equal(R.write(loaded,'bank-a',binding,{runs:['forged']},validate),false);assert.deepEqual(R.read(loaded,'bank-a',binding,validate),{runs:[2]});
 loaded.records[0].draft={runs:['forged']};assert.equal(R.read(loaded,'bank-a',binding,validate),null);
 loaded.records[0].passed=true;assert.equal(R.valid(loaded),false);
});
test('chapter replay clears only its exact bank/course lessons and duplicate or orphan records are rejected',()=>{
 const s=R.fresh();for(const [bank,b]of [['a',binding],['b',binding],['a',{...binding,lessonId:'1.2'}]])assert.ok(R.write(s,bank,b,{runs:[1]},validate));
 assert.ok(R.clearLessons(s,'a','course-a',['1.1']));assert.equal(s.records.length,2);assert.ok(R.read(s,'b',binding,validate));assert.ok(R.read(s,'a',{...binding,lessonId:'1.2'},validate));
 assert.equal(R.valid(s,['a']),false);s.records.push(JSON.parse(JSON.stringify(s.records[0])));assert.equal(R.valid(s),false);
});
test('aggregate oversized saves are rejected and rejected writes leave previous progress intact',()=>{
 const s=R.fresh();s.records=Array.from({length:32},(_,i)=>({bank:'a',binding:{...binding,lessonId:String(i)},draft:{text:'x'.repeat(64000)}}));assert.ok(R.valid(s));
 const before=JSON.stringify(s);assert.equal(R.write(s,'a',{...binding,lessonId:'overflow'},{text:'x'.repeat(64000)},()=>true),false);assert.equal(JSON.stringify(s),before);
 s.records.push({bank:'a',binding:{...binding,lessonId:'overflow'},draft:{text:'x'.repeat(64000)}});assert.equal(R.valid(s),false);
 assert.equal(R.write(R.fresh(),'a',{}, {runs:[]},validate),false);
});
test('JSON backup objects from a different realm retain the same validation and binding rules',()=>{
 const vm=require('node:vm'),s=R.fresh();R.write(s,'a',binding,{runs:[1]},validate);
 const imported=vm.runInNewContext('JSON.parse(raw)',{raw:JSON.stringify(s)});
 assert.ok(R.valid(imported,['a']));assert.deepEqual(R.read(imported,'a',binding,validate),{runs:[1]});
});
