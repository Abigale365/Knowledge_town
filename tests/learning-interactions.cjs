const assert=require('node:assert/strict'),harness=require('./town-harness.cjs'),R=require('../dist/encounter-rules.js'),Pack=require('../dist/aib-pack.js'),P=require('../dist/learn-parser.js');
let completed=false;process.on('beforeExit',()=>{if(!completed){console.error('Encounter assertions did not finish');process.exitCode=1;}});
(async()=>{
 // The actual supplied curriculum must support both incomplete and correct reconstruction.
 for(const raw of Pack.cards){const c=P.card(raw,'课程',0),e=R.create(c);assert.equal(R.check(e).ok,false,c.q);if(e.numeric){e.value='not-a-number';assert.equal(R.check(e).ok,false);e.value=String(e.task.expected);}else for(const p of e.task.pieces.filter(p=>p.correct).sort((a,b)=>(a.order||0)-(b.order||0)))assert.ok(R.move(e,p.key,p.category));assert.equal(R.check(e).ok,true,c.q);assert.ok(R.summary(e).every(x=>!x.includes('[object Object]')));}
 const order=R.create(P.card({q:'执行顺序是什么？',steps:['先定义','再验证'],mode:'order'},'流程',0));R.move(order,'step-1');R.move(order,'step-0');assert.equal(R.check(order).ok,false);assert.equal(order.assisted,true);R.move(order,'step-1');R.move(order,'step-0');R.move(order,'step-0');R.move(order,'step-1');assert.equal(R.check(order).ok,true);
 const h=await harness(new Map(),{exam:true,learning:true});
 assert.ok(h.run(`studyText(${JSON.stringify('| 名称 | 解释 |\n|---|---|\n| **规则** | <script>坏内容</script> |')}).includes('<table>')`));
 assert.equal(h.run(`studyText('<img src=x onerror=alert(1)>').includes('<img')`),false);
 const object=h.run(`CAT.objects(state.zone).find(o=>['scenario','match','cloze','deliver','classify'].includes(EncounterRules.create(encounterCard(o.id)).task.mode))`),id=object.id;
 h.run(`inspectObject(${JSON.stringify(id)})`);assert.equal(h.run(`!!state.play.collected[${JSON.stringify(id)}]`),false);assert.ok(h.get('encounterTarget'));
 assert.equal(h.run(`encounterCard(${JSON.stringify(id)}).topic.startsWith('Task '+L.bank(state).focus+' ·')`),true);
 h.list('[data-encounter-target]')[0].ondrop({preventDefault(){},stopPropagation(){},dataTransfer:{getData:()=>''}});assert.ok(h.get('encounterTarget'));
 const task=h.run(`EncounterRules.create(encounterCard(${JSON.stringify(id)})).task`),wrong=task.pieces.find(p=>!p.correct);
 if(wrong){h.list('[data-encounter]').find(el=>el.dataset.encounter===wrong.key).click();assert.ok(h.get('dialogBody').innerHTML.includes('这组答案还不完整'));assert.equal(h.run(`!!state.play.collected[${JSON.stringify(id)}]`),false);}
 h.list('[data-encounter]').find(el=>el.dataset.encounter===task.pieces.find(p=>p.correct).key).click();assert.ok(h.get('encounterContinue'));assert.equal(h.run(`!!state.play.collected[${JSON.stringify(id)}]`),true);h.click('close');assert.equal(h.run(`state.play.collected[${JSON.stringify(id)}]`),true);
 // A complete concept-pair review uses individual targets, never an aggregated JSON/string option.
 const pair=h.run('L.bank(state).cards.find(c=>c.pairs?.length)');h.run(`showQuiz(${JSON.stringify(pair.id)})`);assert.equal(h.list('[data-encounter-target]').length,pair.pairs.length);
 for(let i=0;i<pair.pairs.length;i++){h.list('[data-encounter]').find(el=>el.dataset.encounter==='pair-'+i).click();h.list('[data-encounter-target]').find(el=>el.dataset.encounterTarget===String(i)).click();}
 h.click('encounterCheck');assert.ok(h.get('encounterContinue'));assert.equal(h.get('dialogBody').innerHTML.includes('[object Object]'),false);
 h.run('save()');await new Promise(r=>setImmediate(r));const restored=await harness(h.data,{exam:true,learning:true});assert.equal(restored.run(`state.play.collected[${JSON.stringify(id)}]`),true);
 assert.equal(restored.run(`!!state.play.inventory.find(x=>x.id===${JSON.stringify(id)}).knowledge.card`),true);
 assert.equal(restored.run(`(()=>{const bad=JSON.parse(JSON.stringify(state));bad.play.inventory.find(x=>x.id===${JSON.stringify(id)}).knowledge.bank='missing-bank';return L.restore(bad)===null;})()`),true);
 completed=true;console.log('PASS: all 200 curriculum encounters, sequence errors/recovery, source-linked object gate, invalid drag, real pair controls, readable review and persistence. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
