'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});h.run('close();courseGenerated=null;showCourseImporter()');
 assert.ok(h.get('dialogBody').innerHTML.includes('教学5'));
 const course=h.run('TeachingCatalogV5.aib.course');h.run(`fetch=async url=>({ok:true,json:async()=>url==='/api/aib-course'?${JSON.stringify({course,diagnostics:[{severity:'warning',code:'candidate.test',message:'<img src=x onerror=alert(1)> 内容待核对'}]})}:{configured:false}})`);
 await h.get('previewIntegratedCourse').onclick();assert.ok(h.get('courseDiagnostics'));assert.ok(h.get('dialogBody').innerHTML.includes('&lt;img'));assert.ok(!h.get('dialogBody').innerHTML.includes('<img src=x'));assert.equal(h.get('commitCourse').disabled,true);
 h.click('discardCoursePreview');assert.equal(h.run('courseDiagnostics.length'),0);
 h.run('courseDiagnostics=[{severity:"warning",message:"old warning"}]');await h.run(`readPreparedCourse({size:${JSON.stringify(course).length},text:async()=>${JSON.stringify(JSON.stringify(course))}})`);assert.equal(h.run('courseDiagnostics.length'),0);assert.ok(!h.get('courseDiagnostics'));
 console.log('PASS: prepared API warnings are visible and escaped, confirmation remains required, and unrelated raw imports clear prior findings. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
