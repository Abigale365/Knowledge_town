'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
test('actual HTML script order waits for parsing before storage and first scene render',async()=>{
 const h=await harness(new Map(),{entrySchedule:true});
 assert.equal(h.run('beforeDOMContentLoaded.worldReady'),false,'startup must not paint the base renderer while enhanced scripts are still loading');
 assert.equal(h.run('worldReady'),true);
 assert.ok(h.run('!!teachingEntry()'),'first launch must initialize the reviewed teaching edition');
 const objects=h.list('[data-study-fruit]');assert.ok(objects.length>0);
 assert.ok(objects.every(x=>x.innerHTML.includes('data-scene-art=')));
 assert.ok(new Set(objects.map(x=>x.innerHTML.match(/data-scene-art="(\d+)"/)?.[1])).size>1,'knowledge objects must have multiple visible silhouettes');
 assert.ok(h.get('worldKnowledgeChest').innerHTML.includes('data-scene-art="38"'));
 assert.ok(h.get('worldStudyBasket').innerHTML.includes('data-scene-art="35"'));
 h.run('save()');await new Promise(resolve=>setImmediate(resolve));
 const resumed=await harness(h.data,{entrySchedule:true});
 assert.equal(resumed.run('JSON.stringify(studyState())'),h.run('JSON.stringify(studyState())'));
 assert.ok(resumed.get('worldKnowledgeChest').innerHTML.includes('data-scene-art="38"'));
});
test('parser-delayed startup keeps nonempty published saves and upgrades only scene rendering',async()=>{
 const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
 const data=new Map(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'fixtures/pre-integration-9f7f67b-save.json.gz'))).toString('utf8')));
 const expected=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/pre-integration-9f7f67b-study.json'),'utf8'));
 const h=await harness(data,{entrySchedule:true});
 assert.deepEqual(JSON.parse(h.run('JSON.stringify(studyState())')),expected);
 assert.equal(h.run('worldReady'),true);
 assert.ok(h.get('worldKnowledgeChest').innerHTML.includes('data-scene-art="38"'));
 assert.ok(h.list('[data-study-fruit]').every(x=>x.innerHTML.includes('data-scene-art=')));
});
