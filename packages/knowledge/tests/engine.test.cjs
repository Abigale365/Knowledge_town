'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),K=require('..');
const goal={id:'goal',title:{zh:'解释蒸发',en:'Explain evaporation'}};
const claim=(id,quote)=>({id,objectiveIds:['goal'],category:{zh:'原理',en:'Principle'},title:{zh:'蒸发',en:'Evaporation'},explanation:{zh:'液体在表面变成气体。',en:'Liquid changes to gas at its surface.'},evidence:[{materialId:'water',locator:'paragraph',quote}],status:'needs-review'});
test('body topic: injected extraction, stable segmentation, exact locations and cancellation',async()=>{
 const b=K.createMaterialBundle([{id:'water',name:'water.md',text:'# 水循环\n蒸发指液体在表面变成气体。\n'}]);
 const adapter=K.createExtractionAdapter({identify:async()=>[goal],extractSegment:async s=>s.text.includes('蒸发指')?[claim('evap','蒸发指液体在表面变成气体。')]:[]});
 const p=await K.buildKnowledge(b,{extract:adapter});assert.equal(p.units.length,1);assert.match(p.units[0].evidence[0].locator,/UTF16:/);assert.deepEqual(K.segmentMaterials(b),K.segmentMaterials(b));
 const ac=new AbortController();ac.abort();await assert.rejects(K.buildKnowledge(b,{extract:adapter,signal:ac.signal}),{name:'AbortError'});
 const during=new AbortController();await assert.rejects(K.buildKnowledge(b,{extract:K.createExtractionAdapter({identify:async()=>[goal],extractSegment:async()=>{during.abort();return []}}),signal:during.signal}),{name:'AbortError'});
});
test('second topic: outline omission, duplicate and conflict are retained diagnostically',()=>{
 const b=K.createMaterialBundle([{id:'water',name:'inventory.md',text:'库存数量必须先盘点核对。\n目标：解释补货。'}]);
 const a=claim('stock','库存数量必须先盘点核对。');a.title={zh:'盘点',en:'Stock count'};a.explanation={zh:'盘点核对库存数量。',en:'Count and reconcile inventory quantities.'};
 const duplicate=structuredClone(a);duplicate.id='duplicate';const conflict=structuredClone(a);conflict.id='conflict';conflict.explanation={zh:'采用另一种盘点口径。',en:'Use a different counting scope.'};
 const r=K.assembleKnowledge(b,{objectives:[goal,{id:'missing',title:{zh:'解释补货',en:'Explain replenishment'}}],claims:[a,duplicate,conflict]});
 assert.equal(r.pack.units.length,2);assert.equal(r.pack.gaps[0].objectiveId,'missing');assert.ok(r.diagnostics.some(d=>d.code==='knowledge.possible-conflict'));assert.ok(r.diagnostics.some(d=>d.code==='knowledge.gap'));
});
test('source mismatch, missing English and prerequisite cycles reject with candidate',async()=>{
 const b=K.createMaterialBundle([{id:'water',name:'water',text:'蒸发指液体在表面变成气体。'}]);
 const a=claim('a','蒸发指液体在表面变成气体。'),v=structuredClone(a);v.id='b';v.explanation.zh+='不同';a.prerequisiteIds=['b'];v.prerequisiteIds=['a'];v.explanation.en='';
 const r=K.assembleKnowledge(b,{objectives:[goal],claims:[a,v]});assert.ok(r.diagnostics.some(d=>d.code==='knowledge.cycle'));assert.ok(r.diagnostics.some(d=>d.code==='knowledge.translation'));
 await assert.rejects(K.buildKnowledge(b,{extract:async()=>r.pack}),e=>!!e.candidate);
 await assert.rejects(K.buildKnowledge(b,{extract:K.createExtractionAdapter({identify:async()=>[goal],extractSegment:async()=>[{...a,evidence:[{materialId:'other',quote:b.materials[0].text}]}]})}),{code:'KNOWLEDGE_SOURCE_MISMATCH'});
});
test('full local curriculum maps every skill across all four domains without invented official evidence',()=>{
 const b=require('../generated/materials.v1.json'),p=require('../generated/knowledge.v1.json');assert.equal(p.objectives.length,58);assert.equal(p.units.length,139);assert.equal(new Set(p.objectives.map(o=>o.id.split('-')[1].split('.')[0])).size,4);assert.ok(p.objectives.every(o=>o.unitIds.length));assert.ok(p.units.every(u=>u.status==='needs-review'&&u.evidence.every(e=>e.materialId==='teaching-supplement')));assert.equal(K.validateKnowledge(p,b).filter(d=>d.severity==='error').length,0);
});
test('repeat occurrences preserve the actual extracted segment location',async()=>{
 const quote='蒸发指液体在表面变成气体。',text=quote+'\n'+quote;
 const b=K.createMaterialBundle([{id:'water',name:'repeat',text}]);
 const extract=K.createExtractionAdapter({identify:async()=>[goal],extractSegment:async s=>s.start>0?[claim('second',quote)]:[]});
 const p=await K.buildKnowledge(b,{extract});assert.equal(p.units[0].evidence[0].locator,`UTF16:${quote.length+1}-${text.length}`);
});
test('English objectives preserve the requested distinguishing and calculation tasks',()=>{
 const p=require('../generated/knowledge.v1.json');assert.match(p.objectives.find(o=>o.id==='skill-1.1.2').title.en,/^Distinguish AI/);assert.match(p.objectives.find(o=>o.id==='skill-2.2.3').title.en,/^Calculate AI ROI/);
});
