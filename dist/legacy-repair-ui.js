/* Local playtest presentation for the retired built-in four-code exercise. */
'use strict';
function repairText(value){return typeof value==='string'?value:TownLocale.text(value?.zh,value?.en,state.language);}
function legacyRepairContext(){
 if(typeof PlaytestDecisionTask==='undefined'||!currentCourse())return null;
 const info=typeof ReleaseGuide!=='undefined'?ReleaseGuide.current():null;if(info?.kind!=='legacy'||info.invalid)return null;
 const sec=studySection(),work=WorkshopEngine.progress(studyState(),sec),round=sec.activity?.rounds[work.round];
 if(!PlaytestDecisionTask.legacyMatches(round))return null;
 return {bank:state.selected,section:sec.id,sec,work,round};
}
function sameLegacyRepair(c){const next=legacyRepairContext();return next&&next.bank===c.bank&&next.section===c.section&&next.round.id===c.round.id&&next.work===c.work;}
function renderLegacyRepair(c){
 const T=PlaytestDecisionTask,d=draftFor(c.round,c.work);d.repairDecision??=T.beginLegacy(d);const visible=T.visibleTask();
 modal(`<div id="legacyRepairRoot" class="task-workshop"><span class="eyebrow">${learningCopy('业务判断 · 原进度保留','Business decisions · previous progress kept')} · ${c.work.round+1}/${c.sec.activity.rounds.length}</span><h2 id="dialogTitle">${esc(repairText(visible.title))}</h2><p>${esc(repairText(visible.goal))}</p><div class="workshop-case"><p>${esc(repairText(visible.scenario))}</p></div><details><summary>${learningCopy('回看判断依据','Review the principles')}</summary><p>${esc(repairText(visible.foundation))}</p></details><p>${esc(repairText(visible.operation))}</p>${visible.questions.map(q=>`<section class="workshop-evidence"><h3>${esc(repairText(q.prompt))}</h3><div class="workshop-options">${q.options.map(o=>`<button data-repair-question="${q.id}" data-repair-option="${o.id}" aria-pressed="${d.repairDecision.choices[q.id]===o.id}" class="${d.repairDecision.choices[q.id]===o.id?'chosen':''}">${esc(repairText(o.text))}</button>`).join('')}</div><p id="repairFeedback_${q.id}" role="status"></p><button data-repair-review="${q.id}">${learningCopy('回看这一项知识','Review this principle')}</button></section>`).join('')}<div class="actions"><button id="workshopBack">${learningCopy('返回场景','Return to scene')}</button><button id="workshopRead">${learningCopy('查看相关知识','Review related knowledge')}</button><button id="workshopSubmit" class="primary">${learningCopy('提交业务判断','Submit decisions')}</button></div></div>`,true);
 document.querySelectorAll('[data-repair-question]').forEach(el=>el.onclick=()=>{if(!sameLegacyRepair(c))return;d.repairDecision=T.choose(d.repairDecision,el.dataset.repairQuestion,el.dataset.repairOption);d.values[T.legacyFieldFor(el.dataset.repairQuestion)]=T.legacyValueFor(el.dataset.repairQuestion,el.dataset.repairOption);save();renderTaskWorkshop();});
 document.querySelectorAll('[data-repair-review]').forEach(el=>el.onclick=()=>{if(!sameLegacyRepair(c))return;const q=visible.questions.find(q=>q.id===el.dataset.repairReview),lesson=c.sec.lessons.find(l=>q.knowledgeIds.includes(l.sourceUnitId||l.id));if(lesson)openStudyLesson(lesson.id,true,teachingReturnTo(()=>{if(sameLegacyRepair(c))renderTaskWorkshop();}));});
 $('workshopBack').onclick=close;$('workshopRead').onclick=()=>{const id=c.sec.lessons.find(l=>l.id.endsWith('lesson-3'))?.id||c.sec.lessons[0].id;openStudyLesson(id,true,teachingReturnTo(()=>{if(sameLegacyRepair(c))renderTaskWorkshop();}));};
 $('workshopSubmit').onclick=()=>{
  if(!sameLegacyRepair(c))return;const result=T.evaluate(d.repairDecision);d.repairDecision=result.state;
  if(!result.correct){c.work.attempts++;save();for(const check of result.checks){const node=$('repairFeedback_'+check.id);node.textContent=repairText(check.message);node.className=check.correct?'tf-correct':'tf-review';}return;}
  const answer={...result.legacyAnswer,playtestAssisted:!!result.state.helpSeen};
  if(!WorkshopEngine.submit(studyState(),c.sec,answer))return;save();
  modal(`<h2 id="dialogTitle">${learningCopy('业务判断已完成','Business decisions complete')}</h2><p>${esc(repairText(visible.completion))}</p><div class="actions"><button id="workshopPause">${learningCopy('返回场景','Return to scene')}</button><button id="workshopNext">${learningCopy('继续下一轮','Continue to next round')}</button></div>`,true);$('workshopPause').onclick=close;$('workshopNext').onclick=renderTaskWorkshop;
 };
}
const originalRepairWorkshop=renderTaskWorkshop;
renderTaskWorkshop=function(...args){const c=legacyRepairContext();return c?renderLegacyRepair(c):originalRepairWorkshop(...args);};

const originalRepairLanguage=changeTownLanguage;
changeTownLanguage=function(...args){const visible=!!$('legacyRepairRoot');originalRepairLanguage(...args);if(visible&&$('dialog').open&&legacyRepairContext())renderTaskWorkshop();};
