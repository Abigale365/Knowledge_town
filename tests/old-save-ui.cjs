const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),harness=require('./town-harness.cjs');
(async()=>{
 const p=path.join(__dirname,'fixtures'),old=new Map(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(p,'pre-integration-9f7f67b-save.json.gz'))).toString('utf8'))),expected=JSON.parse(fs.readFileSync(path.join(p,'pre-integration-9f7f67b-study.json'),'utf8'));
 const h=await harness(old,{exam:true,learning:true,chapters:true,knowledge:true});
 assert.deepEqual(JSON.parse(h.run('JSON.stringify(studyState())')),expected);
 assert.equal(h.run('studyState().deposited.length'),1);h.click('basketShortcut');assert.ok(h.get('dialogBody').innerHTML.includes('1'));
 h.run('close()');const next=h.run("studySection().lessons.find(l=>l.interaction!=='assemble'&&!studyState().deposited.includes(l.id)).id");h.list('[data-study-fruit]').find(e=>e.dataset.studyFruit===next).click();h.list('[data-discover-part]').forEach(x=>x.click());h.click('collectLesson');h.click('worldStudyBasket');
 assert.equal(h.run('studyState().deposited.length'),2);h.run('save()');await new Promise(r=>setImmediate(r));
 const reloaded=await harness(h.data,{exam:true,learning:true,chapters:true,knowledge:true});assert.equal(reloaded.run('studyState().deposited.length'),2);
 console.log('PASS: real 9f7f67b published save restores without progress reset, continues collection and saves/reloads again. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
