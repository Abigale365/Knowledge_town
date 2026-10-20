const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
let complete=false;process.on('beforeExit',()=>{if(!complete){console.error('Scene learning workflow did not finish');process.exitCode=1;}});
const event=data=>({preventDefault(){},stopPropagation(){},dataTransfer:{getData:()=>JSON.stringify(data)}});
(async()=>{
 const h=await harness(new Map(),{exam:true,learning:true}),{run,list,click,get}=h;
 assert.equal(run(`Object.keys(CAT.zones).flatMap(z=>CAT.objects(z)).every(o=>!!encounterCard(o.id)?.q)`),true);
 assert.equal(run(`(()=>{const original=state;let ok=true;for(const[kind,recipes]of Object.entries(A.recipes))for(const type of Object.keys(recipes)){state=L.fresh(19);L.start(state,Date.now());A.init(state);A.session(state);const id='binding-'+kind+'-'+type;A.take(state,id,type);const combined=A.combine(state,id,'town-'+kind,kind);ok=ok&&combined.ok&&state.play.inventory.every(x=>!!toolKnowledge(x))&&A.validate(state);}state=original;return ok;})()`),true);
 let q=run('currentQuest()'),piece=q.pieces.find(x=>x.correct),key=piece.key;
 assert.ok(list('[data-piece]').every(el=>typeof el.ondragstart==='function'));
 const item=list('[data-piece]').find(el=>el.dataset.piece===key);item.click();assert.equal(get('fieldNote').hidden,false);assert.ok(get('fieldNote').innerHTML.includes(piece.text));click('takePiece');assert.ok(list('[data-beltpiece]').some(el=>el.dataset.beltpiece===key));assert.equal(run('selectedPiece.key'),key);
 const belt=list('[data-beltpiece]').find(el=>el.dataset.beltpiece===key);const payload={};belt.ondragstart({stopPropagation(){},dataTransfer:{setData:(k,v)=>payload[k]=v}});const target=list('[data-station]').find(el=>el.dataset.station===q.station);target.ondrop({preventDefault(){},stopPropagation(){},dataTransfer:{getData:k=>payload[k]||''}});if(piece.category!==undefined){list('[data-taskdrop]').find(el=>+el.dataset.category===piece.category).click();}assert.equal(run(`A.task(state,${JSON.stringify(q.id)}).placed.includes(${JSON.stringify(key)})`),true);assert.equal(list('[data-beltpiece]').some(el=>el.dataset.beltpiece===key),false);
 // Drag a scene object directly to the wrong station: it is retained as an answer, never lost.
 q=run('currentQuest()');piece=q.pieces.find(x=>!q.found.includes(x.key));const wrongTarget=list('[data-station]').find(el=>el.dataset.station!==q.station);
 wrongTarget.ondrop(event({scenePiece:q.id,key:piece.key}));assert.equal(run(`currentQuest().found.includes(${JSON.stringify(piece.key)})`),true);assert.equal(run(`currentQuest().placed.includes(${JSON.stringify(piece.key)})`),false);assert.ok(list('[data-beltpiece]').some(el=>el.dataset.beltpiece===piece.key));
 run('close();save()');await new Promise(r=>setImmediate(r));const reload=await harness(h.data,{exam:true,learning:true});assert.equal(reload.run(`currentQuest().found.includes(${JSON.stringify(piece.key)})`),true);assert.equal(reload.run(`currentQuest().placed.includes(${JSON.stringify(key)})`),true);
 // All four scenes provide actual object appearances and avoid duplicate clickable props under answers.
 for(const zone of ['town','harbor','grove','observatory']){reload.run(`changeZone(${JSON.stringify(zone)})`);assert.ok(reload.list('[data-piece]').length);assert.ok(reload.list('[data-piece]').every(el=>el.innerHTML.includes('prop-art')));assert.ok(reload.list('[data-object]').some(el=>el.hidden));}
 complete=true;console.log('PASS: physical answer inspection, visible satchel, real desktop drop handlers, safe wrong target, saved answer progress and four scenes. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
