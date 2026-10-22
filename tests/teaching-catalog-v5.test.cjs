'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{catalog}=require('../scripts/teaching-catalog-v5.cjs');
test('B5 candidate validates reviewed artifacts and separates both course editions',()=>{
 const c=catalog();assert.equal(c.aib.revision,5);assert.equal(c.aib.chapters.flatMap(c=>c.sections).length,38);assert.equal(c.legacy.chapters.flatMap(c=>c.sections).length,13);
 assert.equal(c.legacy.chapters[0].sections[0].policy.independentActivity.rounds.length,8);
 assert.equal(c.legacy.course.chapters[0].sections[0].lessons.length,22);assert.equal(c.aib.course.chapters[0].sections[0].lessons.length,4);
 assert.notEqual(c.aib.binding,c.legacy.binding);assert.equal(c.aib.course.pipeline.planRevision,5);
});
test('B5 candidate refuses changed review or unreviewed micro checkpoints',()=>{
 const review=require('../packages/learning-design/authored/review-v5.json'),accepted=review.accepted;try{review.accepted=false;assert.throws(catalog,/binding/);}finally{review.accepted=accepted;}
 const micro=require('../packages/learning-design/generated/micro-checkpoints.v5.json'),original=micro.policy.basis;try{micro.policy.basis='tampered';assert.throws(catalog,/microHash/);}finally{micro.policy.basis=original;}
});
