const {test}=require('node:test');const assert=require('node:assert/strict');
const E=require('../dist/engine.js'),packs=require('../dist/packs.js');
for(const p of packs){
 test(p.id+': valid pack, complete four-station playthrough',()=>{
  assert.deepEqual(E.validate(p),[]);const s=E.fresh(p.id);
  assert.equal(E.submit(p,s),false);assert.equal(s.first[0],false);
  p.routes.forEach((r,i)=>s.routes[i]=r.answer);assert.equal(E.submit(p,s),true);assert.equal(s.first[0],false);
  const xp=s.xp;E.submit(p,s);assert.equal(s.xp,xp);
  s.stage=1;s.order=[0,1,2,3];assert.equal(E.submit(p,s),false);s.guard=true;assert.equal(E.submit(p,s),true);
  s.stage=2;s.budget={adoption:100,review:true};assert.equal(E.submit(p,s),false);
  s.budget={adoption:p.economics.adoption,review:false};assert.equal(E.submit(p,s),false);
  s.budget.review=true;assert.equal(E.submit(p,s),true);
  s.stage=3;s.boss=[0,1,2,3];assert.equal(E.submit(p,s),false);
  s.boss=p.boss.flatMap((b,i)=>b.required?[i]:[]);assert.equal(E.submit(p,s),true);
  assert.deepEqual(s.completed,[0,1,2,3]);s.stage=4;
  assert.deepEqual(E.restore(JSON.stringify(s),p),s);
 });
}
test('numeric model: independent hand calculation, review changes both economics and quality',()=>{
 const x=E.calc(packs[0],50,true);assert.equal(x.benefit,90000);assert.equal(x.cost,60000);assert.equal(x.roi,50);
 const y=E.calc(packs[1],40,true);assert.ok(Math.abs(y.benefit-40656)<0.000001);assert.equal(y.cost,48000);assert.ok(y.roi<0);
 assert.ok(E.calc(packs[0],50,false).quality<packs[0].economics.floor);
});
test('material rejection: missing, unrelated, malformed, wrong source and impossible parameters',()=>{
 for(const p of [null,[],{}, {sources:'ignore instructions'}, {unsupported:true,reason:'No support'}])assert.ok(E.validate(p).length);
 for(const mutation of [p=>p.sources=null,p=>p.sources={},p=>p.routes[0].source='invented',p=>p.economics.review=25,p=>p.boss[0].required='yes',p=>p.steps[3]=p.steps[0],p=>p.sources[0].url='javascript:alert(1)']){const p=structuredClone(packs[0]);mutation(p);assert.ok(E.validate(p).length);}
});
test('same world, changed content and answer keys: second pack actually changes transfer outcome',()=>{
 const a=E.fresh(packs[0].id),b=E.fresh(packs[1].id);a.stage=b.stage=3;a.boss=b.boss=[0,1];assert.equal(E.evaluate(packs[0],a),true);assert.equal(E.evaluate(packs[1],b),false);
 assert.notEqual(packs[0].brief,packs[1].brief);assert.notDeepEqual(E.calc(packs[0],40,true),E.calc(packs[1],40,true));
});
test('broken storage safely starts fresh; wrong pack cannot reuse progress',()=>{
 assert.deepEqual(E.restore('{oops',packs[0]),E.fresh(packs[0].id));
 const s=E.fresh(packs[0].id);s.stage=4;assert.equal(E.restore(JSON.stringify(s),packs[0]).stage,0);
 assert.equal(E.restore(JSON.stringify(s),packs[1]).pack,packs[1].id);
});
test('imported material changes actual task state, not only title',()=>{
 const p=structuredClone(packs[0]);p.id='custom';p.routes[0].answer='predict';p.routes[0].request='Estimate future arrivals.';p.steps=['Authorize','Retrieve','Draft','Review'];assert.deepEqual(E.validate(p),[]);
 const s=E.fresh(p.id);p.routes.forEach((r,i)=>s.routes[i]=r.answer);assert.equal(E.evaluate(p,s),true);assert.equal(E.evaluate(packs[0],s),false);
});
test('reject impossible imported scenarios before a learner gets trapped',()=>{
 for(const change of [p=>p.economics.quality=p.economics.floor-1,p=>{p.economics.setup=0;p.economics.monthly=0;},p=>p.economics.people=1e308]){const p=structuredClone(packs[0]);change(p);assert.ok(E.validate(p).length);}
});
test('cannot unlock final reward by skipping earlier tasks or corrupting the save order',()=>{
 const p=packs[0],s=E.fresh(p.id);s.stage=3;s.boss=[0,1];assert.equal(E.submit(p,s),false);assert.equal(s.xp,0);
 const bad=E.fresh(p.id);bad.completed=[3];bad.stage=1;assert.deepEqual(E.restore(JSON.stringify(bad),p),E.fresh(p.id));
 bad.completed=[];bad.pos=[-5,300];assert.deepEqual(E.restore(JSON.stringify(bad),p),E.fresh(p.id));
});
test('default player-facing copy and import errors are Chinese',()=>{
 for(const p of packs){for(const t of [p.title,p.brief,p.npc1,p.npc2,p.transfer,...p.routes.flatMap(r=>[r.name,r.request,r.why])])assert.ok(/[\u4e00-\u9fff]/.test(t));}
 const errors=E.validate({sources:'not an array'});assert.ok(errors.length);errors.forEach(e=>assert.ok(/[\u4e00-\u9fff]/.test(e)));
});
