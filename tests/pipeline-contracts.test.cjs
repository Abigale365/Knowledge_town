const test=require('node:test'),assert=require('node:assert/strict'),C=require('../packages/contracts'),K=require('../packages/knowledge'),D=require('../packages/learning-design'),Compiler=require('../packages/course-compiler');
const bundle=require('../packages/contracts/fixtures/materials.v1.json'),pack=require('../packages/contracts/fixtures/knowledge.v1.json'),plan=require('../packages/contracts/fixtures/learning-plan.v1.json');
const copy=structuredClone;
test('four source-grounded cases cross both injected adapters and compile into the unchanged game format',async()=>{const knowledge=await K.buildKnowledge(bundle,{extract:async input=>{assert.equal(input.id,bundle.id);return copy(pack);}}),design=await D.designLearning(knowledge,{design:async input=>{assert.equal(input.revision,pack.revision);return copy(plan);}}),course=Compiler.compileCourse(knowledge,design,{materialBundle:bundle});assert.equal(course.chapters.length,4);assert.equal(Compiler.cards(course).length,4);for(let i=0;i<4;i++){const sec=course.chapters[i].sections[0];assert.equal(sec.lessons[0].skill,'unit-'+(i+1));assert.equal(sec.activity.rounds[0].skills[0],sec.lessons[0].skill);assert.equal(sec.questions[0].a,plan.chapters[i].sections[0].questions[0].a);}assert.equal(require('../server.cjs').createApp,require('../apps/server').createApp);});
test('changed sources, false quotations and stale revisions do not pass a frozen content contract',()=>{const changed=copy(bundle);changed.materials[0].text+=' changed';assert.ok(C.validateMaterialBundle(changed).some(d=>d.code==='materials.hash'));const quote=copy(pack);quote.units[0].evidence[0].quote='不存在的原文引用';assert.ok(C.validateKnowledge(quote,bundle).some(d=>d.code==='knowledge.quote'));const stale=copy(plan);stale.knowledgeRevision++;assert.ok(C.validateLearningPlan(pack,stale).some(d=>d.code==='plan.stale'));assert.throws(()=>Compiler.compileCourse(pack,plan),/materialBundle/);});
test('knowledge gaps, missing mappings and prerequisite cycles are diagnosed by path',async()=>{const gap=copy(pack);gap.gaps.push({objectiveId:'goal-1',missing:'定义',requiredMaterial:'教材正文'});await assert.rejects(K.buildKnowledge(bundle,{extract:async()=>gap}),e=>e.code==='PIPELINE_CONTRACT_INVALID'&&e.candidate===gap&&e.diagnostics.some(d=>d.code==='knowledge.gap'));const cycle=copy(pack);cycle.units[0].prerequisiteIds=['unit-2'];cycle.units[1].prerequisiteIds=['unit-1'];assert.ok(C.validateKnowledge(cycle,bundle).some(d=>d.code==='knowledge.cycle'));const missing=copy(pack);missing.objectives[0].unitIds=[];assert.ok(C.validateKnowledge(missing,bundle).some(d=>d.path==='knowledge.objectives[0]'));});
test('independent chapters, scenario coverage and executable rubrics are contract requirements',()=>{const cross=copy(pack);cross.units[1].prerequisiteIds=['unit-1'];assert.ok(C.validateLearningPlan(cross,plan).some(d=>d.code==='plan.unit-order'));const unrelated=copy(plan);unrelated.chapters[0].sections[0].activity.rounds[0].unitIds=['unit-4'];assert.ok(C.validateLearningPlan(pack,unrelated).some(d=>d.code==='plan.activity-links'));const impossible=copy(plan);impossible.chapters[1].sections[0].activity.rounds[0].fields[0].expected=null;assert.ok(C.validateLearningPlan(pack,impossible).some(d=>d.code==='plan.activity'));});
test('adapters are explicit, cancellation propagates and diagnostic candidates are retained',async()=>{await assert.rejects(K.buildKnowledge(bundle),/extract/);await assert.rejects(D.designLearning(pack),/design/);const controller=new AbortController();controller.abort();let calls=0;await assert.rejects(K.buildKnowledge(bundle,{signal:controller.signal,extract:async()=>{calls++;return pack;}}),{name:'AbortError'});assert.equal(calls,0);const bad=copy(plan);bad.knowledgeRevision=99;await assert.rejects(D.designLearning(pack,{design:async()=>bad}),e=>e.candidate===bad&&e.code==='PIPELINE_CONTRACT_INVALID');});


test('compiled source lineage survives repeated game normalization and JSON save reload',()=>{
 const course=Compiler.compileCourse(pack,plan,{materialBundle:bundle});
 const restored=Compiler.normalize(JSON.parse(JSON.stringify(Compiler.normalize(course))));
 assert.deepEqual(restored.pipeline,course.pipeline);
 for(let ci=0;ci<4;ci++){
  const a=course.chapters[ci].sections[0],b=restored.chapters[ci].sections[0];
  assert.equal(b.sourceSectionId,a.sourceSectionId);
  assert.equal(b.lessons[0].sourceUnitId,a.lessons[0].sourceUnitId);
  assert.deepEqual(b.lessons[0].objectiveIds,a.lessons[0].objectiveIds);
  assert.equal(b.questions[0].sourceQuestionId,plan.chapters[ci].sections[0].questions[0].id);
  assert.deepEqual(b.questions[0].sourceUnitIds,plan.chapters[ci].sections[0].questions[0].unitIds);
 }
 assert.equal(restored.id,course.id);
});

test('malformed nested content produces diagnostics instead of TypeErrors',()=>{
 const m=copy(bundle);m.materials[0]=null;assert.ok(C.validateMaterialBundle(m).length);
 const k=copy(pack);k.units[0]=null;assert.ok(C.validateKnowledge(k,bundle).length);
 const p=copy(plan);p.chapters[0].sections[0].activity.rounds[0]=null;assert.ok(C.validateLearningPlan(pack,p).length);
 const revision=copy(pack);delete revision.materialRevision;assert.ok(C.validateKnowledge(revision).length);
});

test('unplayable bilingual choices, missing identities and unsupported question modes fail validation',()=>{
 for(const mutate of [q=>q.wrong=[''],q=>q.wrong=[q.a],q=>q.wrong=['same','same'],q=>q.en.wrong=[''],q=>q.en.wrong=[q.en.a],q=>q.id='',q=>q.mode='unknown']){
  const p=copy(plan);mutate(p.chapters[0].sections[0].questions[0]);assert.ok(C.validateLearningPlan(pack,p).length);
 }
 const duplicate=copy(plan);duplicate.chapters[1].sections[0].questions[0].id=duplicate.chapters[0].sections[0].questions[0].id;
 assert.ok(C.validateLearningPlan(pack,duplicate).length);
});

test('every allowed leading identifier survives compilation and normalization',()=>{
 for(const prefix of ['_','.','-']){
  const p=copy(plan);p.id=prefix+'plan';p.chapters[0].sections[0].id=prefix+'section';p.chapters[0].sections[0].questions[0].id=prefix+'question';
  C.assertValid(C.validateLearningPlan(pack,p));const c=Compiler.normalize(Compiler.compileCourse(pack,p,{materialBundle:bundle}));
  assert.equal(c.pipeline.learningPlanId,p.id);assert.equal(c.chapters[0].sections[0].sourceSectionId,prefix+'section');assert.equal(c.chapters[0].sections[0].questions[0].sourceQuestionId,prefix+'question');
 }
});
