'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const engine=require('./content-workshops.js'),defs=require('./workshop-definitions.cjs');
const get=kind=>defs.find(d=>d.kind===kind);
function drive(d,actions){let s=engine.init(d),r;for(const a of actions){const before=JSON.stringify(s);r=engine.step(d,s,a);assert.equal(JSON.stringify(s),before);s=r.data;}return r;}
const solutions={
 'model-flow':d=>[{type:'feed',choice:'records'},...d.config.inputs.map(x=>({type:'execute',inputId:x.id})),...d.config.judgments.map(q=>({type:'judge',itemId:q.id,choice:q.expected})),{type:'check'}],
 'inventory-sim':()=>[{type:'stock',value:10},{type:'reveal'},{type:'answer',itemId:'shortage',value:7},{type:'answer',itemId:'excess',value:0},{type:'answer',itemId:'meaning',value:'estimate'},{type:'check'}],
 'data-cleaner':d=>[...d.config.rows.map(r=>({type:'mark',rowId:r.id,choice:r.expected})),{type:'subtotal',value:d.config.knownSubtotal},{type:'conclude',choice:d.config.conclusion.expected},{type:'check'}],
 'text-extractor':d=>[...d.config.fields.map(f=>({type:'extract',fieldId:f.id,value:f.expected,evidenceId:f.evidenceId})),{type:'check'}],
 'image-inspector':()=>[{type:'inspect',regionId:'center'},{type:'conclude',choice:'needs-investigation'},{type:'check'}]
};
for(const kind of engine.kinds){
 test(kind+' cannot pass without operational evidence',()=>{const d=get(kind);assert.equal(drive(d,[{type:'check'}]).passed,false);});
 test(kind+' completes without mutating input',()=>{for(const d of defs.filter(x=>x.kind===kind))assert.equal(drive(d,solutions[kind](d)).passed,true);});
 test(kind+' errors preserve correct work and can be corrected',()=>{
   const d=get(kind),actions=solutions[kind](d),ok=drive(d,actions);let bad,fix;
   if(kind==='model-flow'){bad={type:'judge',itemId:'action',choice:'model-output'};fix={type:'judge',itemId:'action',choice:'human-decision'};}
   if(kind==='inventory-sim'){bad={type:'answer',itemId:'shortage',value:0};fix={type:'answer',itemId:'shortage',value:7};}
   if(kind==='data-cleaner'){bad={type:'mark',rowId:'r4',choice:'keep'};fix={type:'mark',rowId:'r4',choice:'unknown'};}
   if(kind==='text-extractor'){bad={type:'extract',fieldId:'order',value:'unknown',evidenceId:'p1'};fix={type:'extract',fieldId:'order',value:'unknown',evidenceId:'none'};}
   if(kind==='image-inspector'){bad={type:'conclude',choice:'operator'};fix={type:'conclude',choice:'needs-investigation'};}
   const wrong=engine.step(d,ok.data,bad);assert.equal(wrong.passed,false);assert.equal(engine.step(d,wrong.data,fix).passed,true);assert.equal(JSON.stringify(ok.data),JSON.stringify(engine.step(d,wrong.data,fix).data));
 });
}
test('matching output labels alone cannot replace two model runs',()=>{const d=get('model-flow');assert.equal(drive(d,solutions[d.kind](d).filter(a=>a.type!=='execute')).passed,false);});
test('inventory score is not a test of guessing future demand',()=>{const d=get('inventory-sim');for(const stock of [0,17,30]){const r=drive(d,[{type:'stock',value:stock},{type:'reveal'},{type:'answer',itemId:'shortage',value:Math.max(0,17-stock)},{type:'answer',itemId:'excess',value:Math.max(0,stock-17)},{type:'answer',itemId:'meaning',value:'estimate'}]);assert.equal(r.passed,true);assert.equal(engine.step(d,r.data,{type:'stock',value:2}).data.stock,stock);}});
test('equal quantities are not duplicate evidence and missing is not zero',()=>{const d=get('data-cleaner');let r=drive(d,solutions[d.kind](d));r=engine.step(d,r.data,{type:'mark',rowId:'r3',choice:'duplicate'});assert.equal(r.passed,false);assert.equal(r.data.answers.r1,'keep');});
test('source references and bilingual visible text exist for all seven units',()=>{assert.equal(defs.length,7);for(const d of defs)for(const key of ['title','goal','instructions','boundary']){assert.ok(d[key].zh);assert.ok(d[key].en);}});
