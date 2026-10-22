'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
test('publication rejects a mutually consistent but unreviewed plan and sidecar',()=>{
 const p=require.resolve('../packages/learning-design/generated/aib-learning-plan.v4.json'),m=require.resolve('../packages/learning-design/generated/aib-teaching-map.v4.json');
 const plan=require(p),map=require(m),changed=structuredClone(plan);changed.chapters[0].sections[0].activity.rounds[0].prompt.zh+='未审修改';
 const pack=require('../packages/course-compiler/enrich-aib.cjs').enrichedAib().knowledgePack;
 try{require.cache[p].exports=changed;require.cache[m].exports=require('../packages/learning-design/teaching-map.cjs').buildTeachingMap(pack,changed);assert.throws(()=>require('../scripts/teaching-catalog.cjs').catalog(),/accepted B4 review/);}
 finally{require.cache[p].exports=plan;require.cache[m].exports=map;}
 assert.equal(require('../scripts/teaching-catalog.cjs').catalog().legacy.course.chapters[0].sections[0].activity.rounds.length,8);
});
