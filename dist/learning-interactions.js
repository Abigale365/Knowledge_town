/* Course-backed encounters shared by world objects and postal review. */
'use strict';
function studyText(text){
 const lines=String(text||'').split(/\r?\n/),out=[];let table=[],code=null;
 const inline=value=>esc(value).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
 const flush=()=>{if(!table.length)return;out.push('<div class="study-table-wrap"><table>'+table.map((row,i)=>'<tr>'+row.map(cell=>`<${i?'td':'th'}>${inline(cell)}</${i?'td':'th'}>`).join('')+'</tr>').join('')+'</table></div>');table=[];};
 for(const line of lines){if(/^\s*```/.test(line)){flush();if(code){out.push('<pre>'+esc(code.join('\n'))+'</pre>');code=null;}else code=[];continue;}if(code){code.push(line);continue;}
  if(/^\s*\|.*\|\s*$/.test(line)){const cells=line.trim().slice(1,-1).split('|').map(x=>x.trim());if(!cells.every(c=>/^:?-+:?$/.test(c)))table.push(cells);continue;}flush();if(!line.trim())continue;
  const heading=line.match(/^#{1,6}\s+(.+)/);out.push(heading?'<p class="study-heading">'+inline(heading[1])+'</p>':'<p>'+inline(line.replace(/^\s*[-*]\s+/,'• '))+'</p>');
 }flush();if(code)out.push('<pre>'+esc(code.join('\n'))+'</pre>');return out.join('');
}
function studySourceLabel(c){return /原创/.test(c.source||'')?'查看编题参考与来源':'查看原文依据（辅助）';}
function learningAnswer(c){return EncounterRules.summary(EncounterRules.create(c)).join('；');}
function encounterCard(id){
 const bank=L.bank(state),focused=bank.focus?bank.cards.filter(c=>c.topic.startsWith('Task '+bank.focus+' ·')):bank.cards;
 const cards=focused.length?focused:bank.cards;
 return cards[parseInt(P.hash(id),36)%cards.length]||cards[0];
}
let encounterSerial=0;
function learningEncounter(c,title,onSuccess,propType=null){
 const exercise=EncounterRules.create(c),q=exercise.task,nonce=String(++encounterSerial),pieces=A.shuffle(q.pieces,state.seed+state.serial);
 const instant=!exercise.numeric&&!q.categories&&!['order','multi'].includes(q.mode);
 if(!exercise.numeric&&!q.pieces.some(p=>!p.correct)&&!q.categories&&q.mode!=='order')exercise.assisted=true;
 let selected=null,done=false,message='';
 function choose(key,category){
  if(done||!EncounterRules.move(exercise,key,category))return;
  selected=null;message='';if(instant){submit();return;}draw();
 }
 function submit(){
  if(done)return;if(exercise.numeric)exercise.value=$('encounterNumber').value;
  const result=EncounterRules.check(exercise);
  if(!result.ok){message=result.message;if(!result.incomplete){L.answer(state,c.id,'',Date.now(),true);save();}draw();return;}
  const recorded=L.answer(state,c.id,c.a,Date.now(),exercise.assisted);save();done=true;onSuccess?.();render();save();
  modal(`<span class="eyebrow">${esc(title)} · 知识已记录</span><h2 id="dialogTitle">你读懂了这条线索。</h2><div class="encounter-resolution">${EncounterRules.summary(exercise).map(text=>`<p>${esc(text)}</p>`).join('')}</div><details class="source-detail"><summary>${studySourceLabel(c)}</summary><div class="preview-source formatted-source">${studyText(c.quote)}</div>${source(c)}</details><p>下次复习：${new Date(recorded.next).toLocaleDateString('zh-CN')}。${exercise.assisted?'本次使用了提示或修正，作为有帮助的练习记录。':'本次独立作答已写入成长记录。'}</p><div class="actions"><button id="encounterContinue" class="primary">继续探索</button><button id="encounterReview">再收一封复习信</button></div>`);
  $('encounterContinue').onclick=()=>{close();onSuccess?.();render();save();};
  $('encounterReview').onclick=()=>{close();onSuccess?.();render();save();showQuiz();};
 }
 function placedText(category){return exercise.placed.filter(key=>category===undefined||exercise.groups[key]===category).map(key=>{const p=q.pieces.find(p=>p.key===key);return `<button class="placed-answer" data-unplace="${esc(key)}" aria-label="取回：${esc(p.text)}">${esc(p.text)} <span aria-hidden="true">×</span></button>`;}).join('');}
 function draw(){
  const remaining=pieces.filter(p=>!exercise.placed.includes(p.key));
  const targets=q.categories?q.categories.map((label,i)=>`<div class="encounter-category"><button class="encounter-target" data-encounter-target="${i}" aria-label="投放到${esc(label)}"><strong>${esc(label)}</strong><small>拖入材料，或点选材料后点这里</small></button><div class="placed-answers">${placedText(i)}</div></div>`).join(''):`<div class="encounter-category"><button class="encounter-target" data-encounter-target="main"><strong>${q.mode==='order'?'按顺序放入步骤':q.mode==='multi'?'所有符合问题的答案':'把合适的答案放入事件框'}</strong><small>拖动或直接点选材料${q.mode==='order'?' · 点已放入步骤可取回':''}</small></button><div class="placed-answers ${q.mode==='order'?'ordered-answers':''}">${placedText()}</div></div>`;
  modal(`<span class="eyebrow">${esc(title)} · ${esc(q.name)}</span><h2 id="dialogTitle">${esc(c.q)}</h2>${q.prompt!==c.q?`<p class="task-prompt">${esc(q.prompt)}</p>`:''}${exercise.numeric?`<div class="encounter-calculation"><p>${q.mode==='roi'?'ROI＝（收益－成本）÷成本×100%':'净节省＝原先用时－生成耗时－复核耗时'}</p>${q.mode==='roi'?`<p>完整成本：${q.calculation.costs} 万元 · 同期间收益：${q.calculation.benefits} 万元</p>`:''}<label for="encounterNumber">计算结果（${esc(q.calculation.unit)}）</label><input id="encounterNumber" type="number" step="any" value="${esc(exercise.value)}" autocomplete="off" placeholder="请输入结果，可填负数或零"></div>`:`<div id="encounterTarget" class="encounter-targets" role="region" aria-label="答案事件框">${targets}</div><p class="encounter-progress">已放入 ${exercise.placed.length} / ${q.target} 份答案${selected?' · 已选一份材料，请点击对应目标':''}</p><div class="encounter-options">${remaining.map((p,i)=>`<button class="answer-token ${selected===p.key?'selected':''}" draggable="true" data-encounter="${esc(p.key)}">${propType?toolArt(propType):sprites([3,6,11,23,31][i%5])}<span>${esc(p.text)}</span></button>`).join('')||'<p class="muted">材料都已放入。可以核对，或点已放入的材料取回修改。</p>'}</div>`}<div id="encounterFeedback" class="task-message" role="status" aria-live="polite">${esc(message)}</div><details id="encounterSource" ${exercise.assisted?'open':''}><summary>${studySourceLabel(c)}</summary><div class="preview-source formatted-source">${studyText(c.quote)}</div>${source(c)}</details>${instant?'':`<div class="actions"><button id="encounterCheck" class="primary">核对${q.mode==='order'?'步骤顺序':'我的答案'}</button></div>`}<p class="muted">${exercise.assisted?'可对照原文继续练习。':'先独立尝试，再核对原文。'}错误选择不会消耗物件；关闭窗口可稍后再来。</p>`,!!q.categories);
  $('encounterSource').ontoggle=()=>{if($('encounterSource').open)exercise.assisted=true;};
  if($('encounterNumber'))$('encounterNumber').oninput=()=>{exercise.value=$('encounterNumber').value;};
  if($('encounterCheck'))$('encounterCheck').onclick=submit;
  document.querySelectorAll('[data-unplace]').forEach(el=>el.onclick=()=>{const key=el.dataset.unplace;exercise.placed=exercise.placed.filter(x=>x!==key);delete exercise.groups[key];message='';draw();});
  document.querySelectorAll('[data-encounter]').forEach(el=>{
   const key=el.dataset.encounter;
   el.onclick=()=>{if(Date.now()<suppressClick)return;if(q.categories){selected=key;draw();}else choose(key);};
   bindEncounterDrag(el,{nonce,key},category=>choose(key,category));
  });
  document.querySelectorAll('[data-encounter-target]').forEach(el=>{
   const category=el.dataset.encounterTarget==='main'?undefined:Number(el.dataset.encounterTarget);
   el.onclick=()=>{if(selected)choose(selected,category);else toast('先点选一份候选材料，或直接拖到这里。');};
   el.ondragover=e=>{e.preventDefault();el.classList.add('dragover');};
   el.ondragleave=()=>el.classList.remove('dragover');
   el.ondrop=e=>{e.preventDefault();e.stopPropagation();el.classList.remove('dragover');let data;try{data=JSON.parse(e.dataTransfer.getData('application/x-learning-answer'));}catch{return;}if(data?.nonce===nonce&&q.pieces.some(p=>p.key===data.key))choose(data.key,category);};
  });
 }
 draw();
}
function bindEncounterDrag(el,payload,drop){
 el.ondragstart=e=>{e.stopPropagation();e.dataTransfer.setData('application/x-learning-answer',JSON.stringify(payload));e.dataTransfer.effectAllowed='move';};
 let touch=null;
 el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;touch={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};el.setPointerCapture?.(e.pointerId);});
 el.addEventListener('pointermove',e=>{if(!touch||touch.id!==e.pointerId)return;if(Math.hypot(e.clientX-touch.x,e.clientY-touch.y)>9){touch.moved=true;e.preventDefault();document.querySelectorAll('[data-encounter-target]').forEach(x=>x.classList.add('dragover'));}});
 el.addEventListener('pointerup',e=>{if(!touch||touch.id!==e.pointerId)return;const moved=touch.moved;touch=null;if(!moved)return;suppressClick=Date.now()+350;const targets=[...document.querySelectorAll('[data-encounter-target]')];targets.forEach(x=>x.classList.remove('dragover'));const target=targets.find(x=>{const r=x.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.left+r.width&&e.clientY>=r.top&&e.clientY<=r.top+r.height;});if(target)drop(target.dataset.encounterTarget==='main'?undefined:Number(target.dataset.encounterTarget));});
 el.addEventListener('pointercancel',()=>{touch=null;document.querySelectorAll('[data-encounter-target]').forEach(x=>x.classList.remove('dragover'));});
}
const collectWorldObject=inspectObject;
inspectObject=function(id){const o=CAT.objects(state.zone).find(x=>x.id===id);if(!o||A.init(state).collected[id])return;learningEncounter(encounterCard(id),'发现 '+o.name+' · '+A.types[o.type][0],()=>collectWorldObject(id),o.type);};
const applyLearningDrag=applyDrag;
applyDrag=function(data,kind,category){if(data?.world){const o=CAT.objects(state.zone).find(x=>x.id===data.world);if(!o||A.init(state).collected[o.id])return;learningEncounter(encounterCard(o.id),o.name+' · 场景事件',()=>applyLearningDrag(data,kind,category),o.type);return;}applyLearningDrag(data,kind,category);};
showQuiz=function(id=null){const c=id?L.card(state,id):L.quiz(state,Date.now());if(!c){toast('先带来一些学习材料吧。');return;}learningEncounter(c,'阿橙的复习信');};
