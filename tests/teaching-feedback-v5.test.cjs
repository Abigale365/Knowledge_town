'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{feedbackCatalog}=require('../scripts/teaching-feedback-v5.cjs'),T=require('../packages/learning-design/teaching-logic.v5.cjs');
test('reviewed feedback covers only canonical active rounds and rejects substituted feedback',()=>{
 const c=feedbackCatalog();assert.equal(Object.keys(c.entries).length,323);
 for(const {round,feedback}of Object.values(c.entries)){const answer=T.witness(round);assert.ok(T.diagnoseRound(round,answer,feedback).correct);assert.equal(c.hashes[JSON.stringify(round)],feedback.roundHash);assert.throws(()=>T.diagnoseRound({...round,id:round.id+'-changed'},answer,feedback),/snapshot/);}
 const manifest=require('../packages/learning-design/candidates/feedback-v5/reviewed/feedback-manifest.v5.json'),original=manifest.planHash;try{manifest.planHash='tampered';assert.throws(feedbackCatalog,/binding/);}finally{manifest.planHash=original;}
});
