/* A scene prop carries a particular candidate, not a collectible-only reward. */
'use strict';
function toolKnowledge(item){const k=item?.knowledge;return k&&state.banks.find(b=>b.id===k.bank)?.cards.find(c=>c.id===k.card);}
const takeLearningTool=A.take;
A.take=function(s,id,type){const result=takeLearningTool(s,id,type);if(result.ok&&s===state){const item=s.play.inventory.find(x=>x.id===id),c=encounterCard(id);if(item&&c)item.knowledge={bank:s.selected,card:c.id};}return result;};
const combineLearningTool=A.combine;
A.combine=function(s,id,target,kind){
 const item=s.play.inventory.find(x=>x.id===id),c=s===state?toolKnowledge(item):null,before=new Set(s.play.inventory.map(x=>x.id));
 const result=combineLearningTool(s,id,target,kind);
 if(result.ok&&s===state){const fallback=c||L.card(s,currentQuest().id);for(const reward of s.play.inventory)if(!before.has(reward.id)&&fallback)reward.knowledge={bank:c?item.knowledge.bank:s.selected,card:fallback.id};}
 return result;
};
function pieceAppearance(q,piece){
 const loc=taskLocation(q,q.pieces.indexOf(piece));
 return{name:loc.name,art:loc.art??A.types[loc.type]?.[1]??0,location:loc};
}
const renderLearningScene=renderLoot;
renderLoot=function(){
 renderLearningScene();const q=currentQuest();if(!q||q.done)return;
 document.querySelectorAll('[data-piece]').forEach(el=>{
  const piece=q.pieces.find(p=>p.key===el.dataset.piece),a=pieceAppearance(q,piece);
  el.innerHTML=`${sprites(a.art)}<span class="learning-spark">✦</span><span class="object-label">${esc(a.name)} · 答案线索</span>`;
  el.setAttribute?.('aria-label','阅读'+a.name+'上的答案线索');
  el.draggable=true;bindDraggable(el,{scenePiece:q.id,key:piece.key});
 });
 const reserved=new Set(q.pieces.map(piece=>pieceAppearance(q,piece).location.id));
 const answerArt=new Set(q.pieces.map(piece=>pieceAppearance(q,piece).art));
 document.querySelectorAll('[data-object]').forEach(el=>{const o=CAT.objects(state.zone).find(o=>o.id===el.dataset.object);if(typeof currentCourse==='function'&&currentCourse()){if(reserved.has(el.dataset.object)||o&&answerArt.has(o.art??A.types[o.type]?.[1]??0)){el.hidden=true;el.remove();}}else if(reserved.has(el.dataset.object))el.hidden=true;});
 const st=document.querySelectorAll('[data-station]');
 st.forEach(el=>{if(el.dataset.station===q.station){el.classList.add('learning-event');el.title=q.question;}});
};
const showLearningPiece=inspectPiece;
inspectPiece=function(key){
 showLearningPiece(key);const q=currentQuest(),piece=q.pieces.find(p=>p.key===key);if(!piece||$('fieldNote').hidden)return;
 const a=pieceAppearance(q,piece);
 $('fieldNote').innerHTML=`<span class="eyebrow">${esc(a.name)}上的线索 · ${esc(q.name)}</span><h2 id="fieldNoteTitle">${esc(q.question)}</h2><div class="candidate learning-candidate">${sprites(a.art)}<span>${esc(piece.text)}</span></div><p>${esc(q.prompt)}</p><div class="actions"><button id="leavePiece">暂时留在这里</button><button id="takePiece" class="primary">把这件答案物品带走</button></div><p class="muted">这件物品代表一份候选答案；它不一定正确。带走后拖入场景里的本题装置。</p>`;
 $('leavePiece').onclick=()=>{$('fieldNote').hidden=true;};
 $('takePiece').onclick=()=>{
  const result=A.discover(state,q.id,key);if(!result.ok){toast(result.message);return;}
  selectedPiece={qid:q.id,key};selectedTool=null;$('fieldNote').hidden=true;render();pointStation();save();
  toast('已带走「'+a.name+'」上的答案。把它拖到本题装置，或点选后点击装置。');
  if(state.play.tutorial===1){state.play.tutorial=2;guideSecond();}
 };
 $('takePiece').focus();
};
pieceTokens=function(q){return q.pieces.filter(p=>q.found.includes(p.key)&&!q.placed.includes(p.key)&&!q.rejected.includes(p.key)).map(p=>{const a=pieceAppearance(q,p);return `<button class="material-token ${selectedPiece?.qid===q.id&&selectedPiece.key===p.key?'selected':''}" draggable="true" data-material="${p.key}">${sprites(a.art)}<span><small class="answer-object-name">${esc(a.name)}</small>${esc(p.text)}</span><small>把这件答案物品拖入对应位置</small></button>`;}).join('');};
const applySceneLearningDrag=applyDrag;
applyDrag=function(data,kind,category){
 if(!data||typeof data!=='object')return;
 if(!data.scenePiece){applySceneLearningDrag(data,kind,category);return;}
 const q=A.task(state,data.scenePiece),piece=q?.pieces.find(p=>p.key===data.key);
 if(!q||q.done||!piece)return;
 if(!q.found.includes(piece.key)){const r=A.discover(state,q.id,piece.key);if(!r.ok){toast(r.message);return;}}
 activeQuest=q.id;selectedPiece={qid:q.id,key:piece.key};selectedTool=null;state.guide=true;
 dropPiece(kind,category);render();save();
};
// Keep a short, visible selection card so touch and keyboard players can read the object before use.
const renderSceneLearningHUD=renderHUD;
renderHUD=function(){renderSceneLearningHUD();
 const piece=selectedPiece&&A.task(state,selectedPiece.qid)?.pieces.find(p=>p.key===selectedPiece.key);
 if(piece){const q=A.task(state,selectedPiece.qid),a=pieceAppearance(q,piece);$('sceneTip').textContent='手持 '+a.name+'：'+piece.text+' · 点击本题装置投放';}
};
const renderAnswerTray=renderTray;
renderTray=function(){
 renderAnswerTray();
 if(selectedTool){const c=toolKnowledge(selectedTool);if(c){const info=document.createElement('div');info.className='tool-knowledge';info.innerHTML=`<span>${esc(A.types[selectedTool.type][0])}记着：${esc(c.q)}</span><button id="readToolKnowledge">查看这件物品的知识</button>`;$('adventureTray').appendChild(info);$('readToolKnowledge').onclick=()=>learningEncounter(c,A.types[selectedTool.type][0]+'的知识');}}
 const q=currentQuest();if(!q||q.done)return;
 const found=q.pieces.filter(p=>q.found.includes(p.key)&&!q.placed.includes(p.key)&&!q.rejected.includes(p.key));
 if(!found.length)return;
 const belt=document.createElement('div');belt.className='answer-satchel';
 belt.innerHTML=`<div class="answer-satchel-label"><strong>答案物品</strong><small>拖到本题装置</small></div><div class="answer-satchel-items">${found.map(p=>{const a=pieceAppearance(q,p);return `<button class="answer-prop ${selectedPiece?.qid===q.id&&selectedPiece.key===p.key?'selected':''}" data-beltpiece="${esc(p.key)}" draggable="true" title="${esc(a.name+'：'+p.text)}">${sprites(a.art)}<span><b>${esc(a.name)}</b><small>${esc(p.text)}</small></span></button>`;}).join('')}</div>`;
 $('adventureTray').appendChild(belt);
 document.querySelectorAll('[data-beltpiece]').forEach(el=>{
  const key=el.dataset.beltpiece;bindDraggable(el,{qid:q.id,key});
  el.onclick=()=>{selectedPiece=selectedPiece?.qid===q.id&&selectedPiece.key===key?null:{qid:q.id,key};selectedTool=null;renderHUD();highlightTargets();};
 });
};
const useLearningTool=useTool;
useTool=function(kind){
 const item=selectedTool;if(!item)return;const card=toolKnowledge(item),before=state.play.combinations;
 // Tools from older saves have no binding yet; their first use becomes a learning encounter.
 if(kind!=='trash'&&!card&&A.recipes[kind]?.[item.type]){
  const c=encounterCard(item.id);learningEncounter(c,A.types[item.type][0]+' · '+(zoneInfo().stations.find(st=>st[0]===kind)?.[1]||'场景事件'),()=>{const held=state.play.inventory.find(x=>x.id===item.id);if(!held)return;held.knowledge={bank:state.selected,card:c.id};selectedTool=held;useTool(kind);},item.type);return;
 }
 useLearningTool(kind);
 if(state.play.combinations>before&&card){
  state.play.journal.push({text:('使用'+A.types[item.type][0]+'时回想：'+card.q+' '+learningAnswer(card)).slice(0,2000),at:Date.now(),zone:state.zone});state.play.journal=state.play.journal.slice(-100);save();
 }
};
