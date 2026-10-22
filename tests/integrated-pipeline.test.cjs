'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{once}=require('node:events');
const {compilePreparedCourse}=require('../apps/server/pipeline.cjs'),C=require('../packages/contracts'),D=require('../packages/learning-design');
const materialBundle=require('../packages/contracts/fixtures/materials.v1.json'),knowledgePack=require('../packages/contracts/fixtures/knowledge.v1.json'),blueprint=require('../packages/learning-design/examples/blueprint.v1.json');
async function input(){return {materialBundle,knowledgePack,learningPlan:await D.designLearning(knowledgePack,{design:D.createDesignAdapter(blueprint)})};}
test('A actual corpus retains 58 objectives, 139 grounded units and explicit review warnings',()=>{
 const pack=require('../packages/knowledge/generated/knowledge.v1.json'),bundle=require('../packages/knowledge/generated/materials.v1.json'),checks=C.validateKnowledge(pack,bundle);
 assert.equal(checks.filter(d=>d.severity==='error').length,0);assert.equal(pack.objectives.length,58);assert.equal(pack.units.length,139);assert.equal(checks.filter(d=>d.code==='knowledge.review').length,139);
});
test('A ports, B authored blueprint and D compiler preserve source identities and varied controls',async()=>{
 const {course,diagnostics}=await compilePreparedCourse(await input());assert.equal(diagnostics.length,0);assert.equal(course.pipeline.learningPlanId,'b-learning-plan');
 assert.equal(new Set(course.chapters.flatMap(c=>c.sections.flatMap(s=>s.activity.rounds.map(r=>r.type)))).size,5);
 assert.ok(course.chapters.every(c=>c.sections.every(s=>s.lessons.every(l=>l.sourceUnitId)&&s.questions.every(q=>q.sourceQuestionId))));
 const mismatched=await input();mismatched.knowledgePack=require('../packages/knowledge/generated/knowledge.v1.json');mismatched.materialBundle=require('../packages/knowledge/generated/materials.v1.json');
 await assert.rejects(compilePreparedCourse(mismatched),e=>e.diagnostics.some(d=>d.code==='plan.stale'));
});
test('local prepared-course API works without model credentials and rejects source tampering and cross-site requests',async t=>{
 const app=require('../server.cjs').createApp(require('../server.cjs').configuration({}));app.listen(0,'127.0.0.1');await once(app,'listening');t.after(()=>new Promise(r=>app.close(r)));
 const base='http://127.0.0.1:'+app.address().port;
 const revised=await fetch(base+'/api/aib-course');assert.equal(revised.status,200);const full=await revised.json();assert.equal(full.course.pipeline.knowledgeRevision,3);assert.equal(full.course.pipeline.planRevision,5);assert.equal(full.diagnostics.length,0);
 const body=await input(),post=(data,origin)=>fetch(base+'/api/compile-course',{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify(data)});
 const ok=await post(body);assert.equal(ok.status,200);assert.equal((await ok.json()).course.chapters.length,4);
 const bad=structuredClone(body);bad.knowledgePack.units[0].evidence[0].quote='Invented unsupported quotation';const rejected=await post(bad);assert.equal(rejected.status,400);assert.ok((await rejected.json()).diagnostics.length);
 assert.equal((await post(body,'https://external.example')).status,403);
});

test('A revision 3 is fully source-grounded; revision 2 remains blocked rather than silently relabelled',()=>{
 const pack=require('../packages/knowledge/generated/knowledge.v3.json'),bundle=require('../packages/knowledge/generated/materials.v3.json');assert.deepEqual(C.validateKnowledge(pack,bundle),[]);assert.equal(pack.units.length,139);assert.equal(pack.objectives.length,58);assert.ok(pack.units.every(u=>u.status==='supported'));
 const previous=require('../packages/knowledge/generated/knowledge.v2.json'),materials=require('../packages/knowledge/generated/materials.v2.json');assert.ok(C.validateKnowledge(previous,materials).some(d=>d.code==='knowledge.gap'));
});
