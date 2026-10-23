'use strict';
// Valid engine-operation fixtures for tests of later scene/coach behavior.
// This deliberately does not claim a player's whole minigame UI journey; dedicated UI tests do that.
const assert=require('node:assert/strict');
function actions(d){const c=d.config;switch(d.kind){
 case 'rule-runner':return [c.threshold-1,c.threshold,c.threshold].flatMap(value=>[{type:'setInput',value},{type:'predict',decision:value<c.threshold?c.below:c.atOrAbove},{type:'run'}]).concat({type:'conclude',decision:'stable'});
 case 'parameter-lab':return [{type:'infer'},{type:'train'},{type:'setInput',value:c.minInput+1},{type:'infer'},{type:'classify',eventId:'op-1',decision:'inference'},{type:'classify',eventId:'op-2',decision:'training'}];
 case 'evidence-board':return [...c.evidence.map(e=>({type:'inspect',evidenceId:e.id})),...c.claims.map(q=>({type:'judge',claimId:q.id,decision:q.expected,evidenceIds:q.evidenceIds}))];
 case 'sample-trainer':return [...c.samples.filter(s=>s.y!==null).map(s=>({type:'select',sampleId:s.id})),{type:'fit'},{type:'predict',value:c.holdout.y},{type:'test'}];
 case 'cluster-builder':return c.points.map((p,i)=>({type:'place',pointId:p.id,groupId:c.groups[i<2?0:1].id})).concat([{type:'check'},{type:'describe',decision:c.supportedDescription}]);
 case 'reward-path':return c.paths.flatMap(p=>Array.from({length:c.rounds},()=>({type:'advance',pathId:p.id}))).concat([{type:'compare',totals:Object.fromEntries(c.paths.map(p=>[p.id,p.rewards.reduce((a,b)=>a+b,0)]))},{type:'policy',pathId:c.paths.reduce((a,b)=>a.rewards.reduce((x,y)=>x+y,0)>b.rewards.reduce((x,y)=>x+y,0)?a:b).id}]);
 case 'model-flow':return [{type:'feed',choice:c.observationId||'records'},...c.inputs.map(x=>({type:'execute',inputId:x.id})),...c.judgments.map(q=>({type:'judge',itemId:q.id,choice:q.expected})),{type:'check'}];
 case 'inventory-sim':return [{type:'stock',value:10},{type:'reveal'},{type:'answer',itemId:'shortage',value:Math.max(0,c.actual-10)},{type:'answer',itemId:'excess',value:Math.max(0,10-c.actual)},{type:'answer',itemId:'meaning',value:'estimate'},{type:'check'}];
 case 'data-cleaner':return [...c.rows.map(r=>({type:'mark',rowId:r.id,choice:r.expected})),{type:'subtotal',value:c.knownSubtotal},{type:'conclude',choice:c.conclusion.expected},{type:'check'}];
 case 'text-extractor':return [...c.fields.map(f=>({type:'extract',fieldId:f.id,value:f.expected,evidenceId:f.evidenceId})),{type:'check'}];
 case 'image-inspector':return [{type:'inspect',regionId:c.suspectRegion},{type:'conclude',choice:'needs-investigation'},{type:'check'}];
 default:throw Error('No validated scene fixture for '+d.kind);
}}
function complete(h,id){
 if(!h.run(`typeof ConceptGameHost!=='undefined'&&!!ConceptGameHost.resolve(${JSON.stringify(id)})`))return false;
 const d=h.run(`ConceptGameHost.resolve(${JSON.stringify(id)}).descriptor`),trace=[{type:'acknowledge'},...actions(d)];
 assert.equal(h.run(`(()=>{const c=ConceptGameHost.resolve(${JSON.stringify(id)});let s=c.engine.fresh(c.descriptor,c.context);for(const a of ${JSON.stringify(trace)})s=c.engine.dispatch(c.descriptor,c.context,s,a);return s.passed&&ConceptGameHost.write(c,s);})()`),true,'real concept-game evidence fixture '+id);
 h.run(`openStudyLesson(${JSON.stringify(id)},false,null,true)`);return true;
}
module.exports={complete,actions};
