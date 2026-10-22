/* Reviewed B5 edition. Old banks retain their original course and saved policy. */
'use strict';
Object.assign(TeachingCatalog,{aib5:TeachingCatalogV5.aib,legacy5:TeachingCatalogV5.legacy});
const b5Create=TeachingFlow.create;
TeachingFlow.create=entry=>entry.revision===5?TeachingStages.create(entry):b5Create(entry);
const b5OpenCourse=openTeachingCourse;
openTeachingCourse=function(which='legacy5'){b5OpenCourse(which);if(teachingEntry()?.revision===5){L.bank(state).kind=learningCopy('已审教学 · 探索版5','Reviewed teaching · exploration edition 5');save();}};
function b5Context(){const c=teachingContext();return c?.entry.revision===5?c:null;}
function teachingStageStatus(){const c=b5Context();if(!c)return null;const sec=studySection(),item=c.flow.section(sec.id);let stage='independent';if(!c.flow.ready(c.p,c.s,sec.id))stage='foundation';else if(!c.p.demonstrations.includes(sec.id))stage='demonstration';else if(!c.flow.passed(c.p,c.s,item.guided))stage='guided';return {stage,sectionId:sec.id,revision:5};}
const b5Dock=renderExamDock;
renderExamDock=function(){b5Dock();if(!currentCourse()||teachingEntry()?.revision!==4||$('openTeachingV5'))return;const button=document.createElement('button');button.id='openTeachingV5';button.textContent=learningCopy('进入新版教学5（旧课程和进度保留）','Open teaching edition 5 (keep previous course and progress)');button.onclick=()=>openTeachingCourse(currentCourse().pipeline?.knowledgePackId==='legacy-knowledge'?'legacy5':'aib5');$('chapterDock').appendChild(button);};
let b5FeedbackCleanup=null,b5LastFeedback=null;
function b5Active(c,section){const active=b5Context();return active?.p===c.p&&studySection().id===section;}
function b5Assistance(c,round,section=studySection().id){const key=section+':'+round.id;return c.p.assistance[key]??={assistanceRevealed:false,solutionRevealed:false,fullReasonRevealed:false};}
function b5Mark(c,round,update,section=studySection().id){const info=b5Assistance(c,round,section);for(const key of ['assistanceRevealed','solutionRevealed','fullReasonRevealed'])info[key]=!!info[key]||update[key]===true;save();return info;}
function b5Feedback(c,round,answer,stage,host,explanation,reopen=renderTaskWorkshop){
 const section=studySection().id;b5LastFeedback={c,round,answer:structuredClone(answer),stage,host,explanation,reopen};
 b5FeedbackCleanup?.();const kind=currentCourse().pipeline?.knowledgePackId==='legacy-knowledge'?'legacy':'aib',source=studySection().sourceSectionId||section;
 const key=kind+'/'+source+'/'+(kind==='aib'?stage+'/':'')+round.id,precise=TeachingDiagnostics.feedbackEntries[key];
 if(precise){const copy=structuredClone(round),canonical=structuredClone(precise.round);delete copy.skills;delete canonical.skills;if(JSON.stringify(copy)!==JSON.stringify(canonical))throw Error('Displayed round differs from reviewed feedback');}
 const diagnosis=precise?TeachingDiagnostics.diagnoseRound(precise.round,answer,precise.feedback):TeachingDiagnostics.diagnoseRound(round,answer),info=b5Assistance(c,round);
 if(!diagnosis.correct)b5Mark(c,round,{assistanceRevealed:true,solutionRevealed:true});
 const related=studySection().lessons.filter(l=>(round.unitIds||round.skills||[]).includes(l.sourceUnitId)||(round.unitIds||round.skills||[]).includes(l.id));
 const options={language:state.language,stage,itemFeedback:!!precise,...info,reviewLinks:(related.length?related:studySection().lessons).map(l=>({unitId:l.id,title:{zh:l.title,en:l.en?.title||l.title}})),findControl:id=>['[data-workshop-item]','[data-workshop-select]','[data-workshop-field]','[data-workshop-remove]'].flatMap(q=>[...document.querySelectorAll(q)]).filter(el=>[el.dataset.workshopItem,el.dataset.workshopSelect,el.dataset.workshopField,el.dataset.workshopRemove].includes(id)||round.type==='allocate'&&['allowed','budget','value','required'].includes(id)),explanation:explanation||round.reason,onAssistance:meta=>{if(!b5Active(c,section))throw Error('This task is no longer active');return b5Mark(c,round,meta,section);},onReveal:()=>b5Active(c,section),onExplanationShown:meta=>{if(b5Active(c,section))b5Mark(c,round,meta,section);},onReview:id=>{if(!b5Active(c,section))return;const l=currentCourse().chapters.flatMap(ch=>ch.sections.flatMap(s=>s.lessons)).find(l=>l.id===id||l.sourceUnitId===id);if(l)openStudyLesson(l.id,true,teachingReturnTo(()=>{if(b5Active(c,section))reopen();}));}};
 host.innerHTML=TeachingFeedback.render(diagnosis,options);b5FeedbackCleanup=TeachingFeedback.bind(host,diagnosis,options);
}
const b5Basket=openStudyBasket;
openStudyBasket=function(){b5Basket();const c=b5Context();if(!c)return;const policy=c.flow.section(studySection().id).policy,goals=document.createElement('section');goals.className='b5-learning-goals';goals.innerHTML=`<h3>${learningCopy('这一节要学会什么','What you will learn')}</h3><ul>${policy.learnerGoals.slice(0,3).map(g=>`<li>${esc(wt(g))}</li>`).join('')}</ul>${policy.learnerGoals.length>3?`<details><summary>${learningCopy('查看其余学习目标','More learning goals')}</summary><ul>${policy.learnerGoals.slice(3).map(g=>`<li>${esc(wt(g))}</li>`).join('')}</ul></details>`:''}<p>${learningCopy('基础确认只是准备练习；示范、引导和独立应用各有作用，整章仍需90%测验。','Foundation confirmation prepares practice. Worked examples, guided work and independent applications have different roles; the chapter still requires a 90% assessment.')}</p>`;const body=$('dialogBody'),list=body.querySelector?.('.knowledge-shelf');if(list&&body.insertBefore)body.insertBefore(goals,list);else body.appendChild(goals);if($('sealBasket'))$('sealBasket').textContent=learningCopy('继续本节示范与练习','Continue worked examples and practice');};
const b5Workshop=openTaskWorkshop;
openTaskWorkshop=function(){if(!b5Context())return b5Workshop();renderTaskWorkshop();};
const b5RenderWorkshop=renderTaskWorkshop;
renderTaskWorkshop=function(){b5FeedbackCleanup?.();b5FeedbackCleanup=null;const c=b5Context();if(!c)return b5RenderWorkshop();const status=teachingStageStatus(),sec=studySection(),item=c.flow.section(sec.id);
 if(status.stage==='foundation'){openStudyBasket();return;}
 if(status.stage==='demonstration'){
  modal(`<span class="eyebrow">${learningCopy('学习示范 · 不计独立掌握','Worked example · not independent evidence')}</span><h2 id="dialogTitle">${esc(wt(sec.activity.title))}</h2><p>${esc(wt(item.policy.demonstration.scenario))}</p><div class="lesson-example">${esc(wt(item.policy.demonstration.workedReasoning))}</div><div class="actions"><button id="b5StageBack">${learningCopy('返回知识列表','Back to knowledge list')}</button><button id="b5DemoDone" class="primary">${learningCopy('已看过推理，进入引导练习','Continue to guided practice')}</button></div>`,true);
  $('b5StageBack').onclick=openStudyBasket;$('b5DemoDone').onclick=()=>{if(!b5Active(c,sec.id)||teachingStageStatus()?.stage!=='demonstration')return;if(!c.p.demonstrations.includes(sec.id))c.p.demonstrations.push(sec.id);save();renderTaskWorkshop();};return;
 }
 if(status.stage==='guided'){renderB5Guided(c,item);return;}
 b5RenderWorkshop();const work=WorkshopEngine.progress(c.s,sec),round=sec.activity.rounds[work.round];if(!round)return;
 const note=document.createElement('p');note.id='b5CreditNote';note.textContent=learningCopy('独立应用：可以回看知识。查看本题诊断或解析后的正确作答记为订正，仍需正式测验确认。','Independent application: knowledge remains available. Correct answers after task diagnostics or explanations are corrections and still require formal assessment.');$('dialogBody').appendChild(note);
};
function renderB5Guided(c,item,microKey=null){
 const sec=studySection(),sourceKey=item.policy.id,exercise=microKey?c.entry.microExercises[microKey]:item.policy.guidedPractice;
 c.p.micro??={};const prior=!microKey&&c.p.micro[sourceKey];if(prior?.completed&&WorkshopEngine.grade(exercise.round,prior.answer)){c.p.guided[sec.id]={...structuredClone(prior),completed:true};save();renderTaskWorkshop();return;}
 const round={...exercise.round,id:microKey?'micro-'+microKey:'guided'},g=microKey?(c.p.micro[microKey]??={draft:{},completed:false}):(c.p.guided[sec.id]??={draft:{},completed:false}),d=draftFor(round,g);
 modal(`<span class="eyebrow">${learningCopy('引导练习 · 不计独立应用证据','Guided practice · not independent evidence')}</span><h2 id="dialogTitle">${esc(wt(sec.activity.title))}</h2><p>${esc(wt(round.prompt))}</p>${workshopRoundHTML(round,d)}<div id="b5GuidedFeedback"></div><div class="actions"><button id="b5GuidedBack">${learningCopy('返回知识列表','Back to knowledge list')}</button><button id="b5GuidedSubmit" class="primary">${learningCopy('检查这次尝试','Check this attempt')}</button></div>`,true);
 $('b5GuidedBack').onclick=openStudyBasket;
 const redraw=()=>{save();if(microKey)renderB5Guided(c,item,microKey);else renderTaskWorkshop();};let selected=null;
 document.querySelectorAll('[data-workshop-select]').forEach(el=>el.onclick=()=>{const id=el.dataset.workshopSelect;d.selected=d.selected.includes(id)?d.selected.filter(x=>x!==id):[...d.selected,id];redraw();});
 document.querySelectorAll('[data-workshop-item]').forEach(el=>{el.onclick=()=>{if(round.type==='order'){if(!d.order.includes(el.dataset.workshopItem))d.order.push(el.dataset.workshopItem);redraw();}else{selected=el.dataset.workshopItem;el.classList.add('selected');}};bindDraggable(el,{b5Guided:sec.id,b5MicroKey:microKey,item:el.dataset.workshopItem,bank:state.selected});});
 document.querySelectorAll('[data-workshop-bin]').forEach(el=>{el.onclick=()=>{if(selected){d.placements[selected]=el.dataset.workshopBin;redraw();}};bindDrop(el,'b5-guided-bin-'+el.dataset.workshopBin);});
 document.querySelectorAll('[data-workshop-remove]').forEach(el=>el.onclick=()=>{d.order=d.order.filter(id=>id!==el.dataset.workshopRemove);redraw();});
 for(const [key,delta]of [['workshopUp',-1],['workshopDown',1]])document.querySelectorAll('[data-'+key.replace(/[A-Z]/g,x=>'-'+x.toLowerCase())+']').forEach(el=>el.onclick=()=>{const i=+el.dataset[key],j=i+delta;if(j>=0&&j<d.order.length)[d.order[i],d.order[j]]=[d.order[j],d.order[i]];redraw();});
 document.querySelectorAll('[data-workshop-field]').forEach(el=>{el.oninput=()=>{d.values[el.dataset.workshopField]=el.value;save();};el.onchange=el.oninput;});
 $('b5GuidedSubmit').onclick=()=>{if(!b5Active(c,sec.id))return;if(!microKey&&teachingStageStatus()?.stage!=='guided')return;if(WorkshopEngine.grade(round,d)){g.answer=structuredClone(d);g.completed=true;save();if(microKey){openStudyBasket();toast(learningCopy('轻练习已完成，不计独立应用；可以继续探索。','Short practice complete, not independent application evidence. Continue exploring.'));}else renderTaskWorkshop();}else{g.lastAnswer=structuredClone(d);save();b5Feedback(c,round,d,'guided',$('b5GuidedFeedback'),exercise.incorrectFeedback?.explanation,()=>renderB5Guided(c,item,microKey));}};
}
const b5Drag=applyDrag;
applyDrag=function(data,kind,category){if(data?.b5Guided){const c=b5Context();if(!c||data.bank!==state.selected||data.b5Guided!==studySection().id||!data.b5MicroKey&&teachingStageStatus()?.stage!=='guided')return;const g=data.b5MicroKey?c.p.micro?.[data.b5MicroKey]:c.p.guided[data.b5Guided],round=data.b5MicroKey?c.entry.microExercises[data.b5MicroKey]?.round:c.flow.section(data.b5Guided).policy.guidedPractice.round;if(!g||!round)return;if(round.type==='sort'&&kind.startsWith('b5-guided-bin-')&&round.items.some(i=>i.id===data.item)){g.draft.placements[data.item]=kind.slice(14);save();if(data.b5MicroKey)renderB5Guided(c,c.flow.section(data.b5Guided),data.b5MicroKey);else renderTaskWorkshop();}return;}return b5Drag(data,kind,category);};
const b5Submit=submitTaskWorkshop;
submitTaskWorkshop=function(){const c=b5Context();if(!c)return b5Submit();const sec=studySection(),work=WorkshopEngine.progress(c.s,sec),round=sec.activity.rounds[work.round];if(!round||teachingStageStatus()?.stage!=='independent')return;const answer=structuredClone(draftFor(round,work));
 if(!WorkshopEngine.grade(round,answer)){work.attempts++;save();b5Feedback(c,round,answer,'independent',$('workshopFeedback'));return;}
 const before=work.round;b5Submit();if(work.round===before+1){const info=b5Assistance(c,round);c.p.applicationEvidence??={};const independent=!info.solutionRevealed&&!info.assistanceRevealed;c.p.applicationEvidence[sec.id+':'+round.id]={completed:true,independent};save();const note=document.createElement('p');note.id='b5RoundEvidence';note.textContent=independent?learningCopy('本轮独立应用已完成；整章仍需90%正式测验。','Independent application completed; the chapter still requires a 90% formal assessment.'):learningCopy('本轮订正完成，不计独立掌握；仍需正式测验确认。','Correction completed, not independent mastery evidence; formal assessment is still required.');$('dialogBody').appendChild(note);}
};
const b5Replay=replayStudyChapter;
replayStudyChapter=function(){if(!b5Context())return b5Replay();const c=b5Context(),chapter=c.s.chapter;
 // Reuse the existing replay dialog via the prior controller, whose B5 step fallback is installed below.
 b5Replay();const button=$('confirmStudyReplay'),base=button.onclick;button.onclick=()=>{const ids=currentCourse().chapters[chapter].sections.map(s=>s.id);c.p.demonstrations=c.p.demonstrations.filter(id=>!ids.includes(id));for(const id of ids){delete c.p.guided[id];for(const key of Object.keys(c.p.applicationEvidence||{}))if(key.startsWith(id+':'))delete c.p.applicationEvidence[key];for(const key of Object.keys(c.p.assistance))if(key.startsWith(id+':'))delete c.p.assistance[key];}base();};};

const b5Tray=renderTray;
renderTray=function(){b5Tray();const c=b5Context();if(!c)return;c.p.micro??={};const sec=studySection(),viewed=new Set(currentCourse().chapters.flatMap(ch=>ch.sections.flatMap(s=>s.lessons)).filter(l=>c.p.viewed.includes(l.id)).map(l=>l.sourceUnitId));
 const checkpoints=c.entry.micro.find(x=>x.sectionId===sec.sourceSectionId||x.compiledSectionId===sec.id||x.sectionId===sec.id)?.checkpoints||[];
 const available=checkpoints.filter(x=>x.requiredReviewedKnowledgeIds.every(id=>viewed.has(id))&&!c.p.micro[x.exerciseRef.sectionId]?.completed);
 if(!available.length)return;const box=document.createElement('div');box.id='b5MicroTray';box.innerHTML=available.map((x,i)=>'<button data-b5-micro="'+i+'">'+esc(wt(x.label))+'</button>').join('');$('adventureTray').appendChild(box);document.querySelectorAll('[data-b5-micro]').forEach(el=>el.onclick=()=>{const x=available[+el.dataset.b5Micro];if(!b5Active(c,sec.id))return;if(x.requiredReviewedKnowledgeIds.every(id=>viewed.has(id)))renderB5Guided(c,c.flow.section(sec.id),x.exerciseRef.sectionId);});};

const b5Language=changeTownLanguage;
changeTownLanguage=function(...args){b5Language(...args);const f=b5LastFeedback;if(f&&$('dialog').open&&f.host.id&&$(f.host.id)===f.host)b5Feedback(f.c,f.round,f.answer,f.stage,f.host,f.explanation,f.reopen);};

const b5Modal=modal,b5Close=close;
function disposeB5Feedback(){b5FeedbackCleanup?.();b5FeedbackCleanup=null;b5LastFeedback=null;}
modal=function(...args){disposeB5Feedback();return b5Modal(...args);};
close=function(...args){disposeB5Feedback();return b5Close(...args);};
