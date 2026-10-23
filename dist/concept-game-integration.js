/* D-owned collection gates. A game pass is collection eligibility, never an exam pass. */
'use strict';
window.ConceptGameIntegration=(()=>{
 let active=null,controller=null;
 const copy=(zh,en)=>TownLocale.text(zh,en,state.language);
 function needsGame(c){const s=ConceptGameHost.status(c);return !s.preserveExisting&&!s.canNewCollect;}
 function launch(c,reopen){
  if(!ConceptGameHost.current(c))return false;
  const status=ConceptGameHost.status(c);
  if(!status.found){toast(copy('先在场景中找到这件物品，再进入它的小游戏。','Find this object in the scene before entering its game.'));return false;}
  if(typeof ConceptGamesUI==='undefined'||typeof ConceptGamesUI.open!=='function'){toast(copy('小游戏正在准备中，进度已保留。','The concept game is not available yet; your progress is kept.'));return false;}
  active={c,reopen};
  const back=()=>{if(active?.c!==c)return false;if(!ConceptGameHost.current(c))return false;active=null;reopen();return true;};
  const persistDraft=async draft=>{if(active?.c!==c||!ConceptGameHost.write(c,draft))return false;const durable=await STORE.flush();return durable===true&&active?.c===c&&!!ConceptGameHost.current(c);};
  controller=ConceptGamesUI.open({descriptor:c.descriptor,context:c.context,engine:c.engine,draft:status.draft,language:state.language,show:modal,close,body:$('dialogBody'),dialog:$('dialog')},{
   isCurrent:()=>active?.c===c&&!!ConceptGameHost.current(c),
   onDraft:persistDraft,onBack:back,onError:error=>console.warn('Concept game operation:',error?.message||String(error)),
   onComplete:async draft=>{if(!await persistDraft(draft)||!ConceptGameHost.status(c).canNewCollect)return false;const collected=ConceptGameHost.status(c).alreadyCollected;back();toast(collected?copy('小游戏完成！原收藏和章节进度已保留。','Concept game complete! Your existing collection and chapter progress are kept.'):copy('小游戏完成！现在可以收藏这件物品。','Concept game complete! You may now collect this object.'));return true;}
  });return true;
 }
 const lessonBase=openStudyLesson;
 openStudyLesson=function(id,reference=false,returnTo=null,foundInScene=false){
  controller?.dispose();controller=null;active=null;lessonBase(id,reference,returnTo,foundInScene);
  const c=ConceptGameHost.resolve(id);if(!c||!$('dialog').open)return;
  const reopen=()=>openStudyLesson(id,reference,returnTo),status=ConceptGameHost.status(c);
  for(const buttonId of ['favoriteKnowledge','collectLesson','confirmFoundation']){
   const button=$(buttonId);if(!button)continue;const original=button.onclick;
   button.onclick=e=>{if(!ConceptGameHost.current(c))return;if(buttonId==='favoriteKnowledge'&&ConceptGameHost.status(c).alreadyCollected){original?.(e);return;}if(needsGame(c)){launch(c,reopen);return;}original?.(e);};
   if(!status.preserveExisting&&!status.canNewCollect){button.disabled=true;button.textContent=buttonId==='confirmFoundation'?copy('完成小游戏后确认基础','Complete the game before confirming this foundation'):status.found?copy('完成小游戏后可收藏','Complete the game to unlock collection'):copy('先在场景找到物件','Find the object in the scene first');}
  }
  const button=document.createElement('button');button.id='openConceptGame';button.className='concept-game-entry primary';button.setAttribute('data-locale-fixed','true');button.disabled=!status.found;
  const entryLabel=status.canNewCollect?['小游戏已完成 · 可以重玩','Concept game complete · play again']:status.preserveExisting?['体验概念小游戏（原收藏保留）','Try the concept game (existing collection kept)']:status.found?['进入概念小游戏 · 完成后收藏','Play the concept game to unlock collection']:['找到这个物件后开启小游戏','Find this object to unlock its game'];
  button.textContent=state.language==='bi'?entryLabel.join('\n'):copy(...entryLabel);button.style.whiteSpace='pre-line';
  button.onclick=()=>launch(c,reopen);$('dialogBody').appendChild(button);
  if(ConceptGameHost.read(c)?.events.length){
   const restart=document.createElement('button');restart.id='restartConceptGame';restart.textContent=copy('重新开始本物件的小游戏','Restart this object’s concept game');
   restart.onclick=()=>{if(!ConceptGameHost.current(c))return;modal(`<h2 id="dialogTitle">${esc(copy('重新开始这件物品的小游戏？','Restart this object’s concept game?'))}</h2><p>${esc(copy('只重置这件物品的小游戏操作记录，原收藏和章节成绩保留。','Only this object’s concept-game operations will reset. Existing collections and chapter results stay.'))}</p><div class="actions"><button id="cancelConceptRestart">${esc(copy('保留现有记录','Keep current progress'))}</button><button id="confirmConceptRestart">${esc(copy('重新开始','Restart'))}</button></div>`,true);$('cancelConceptRestart').onclick=()=>{if(ConceptGameHost.current(c))reopen();};$('confirmConceptRestart').onclick=()=>{if(ConceptGameHost.reset(c))launch(c,reopen);};};$('dialogBody').appendChild(restart);
  }
 };
 const collectBase=CS.collect;
 CS.collect=function(s,course,id){const c=ConceptGameHost.resolve(id);if(c&&s===studyState()&&needsGame(c))return false;return collectBase(s,course,id);};
 const placeBase=placeTeachingFavorite;
 placeTeachingFavorite=function(id){const c=ConceptGameHost.resolve(id);if(c&&needsGame(c)){launch(c,()=>openStudyLesson(id));return false;}return placeBase(id);};
 const guideStepsBase=guideStudySteps;
 guideStudySteps=function(...args){const steps=guideStepsBase(...args);if(!currentCourse()||!studySection().lessons.some(l=>ConceptGameHost.resolve(l.id)))return steps;
  steps[1]=[copy('② 亲自操作，再收藏物件','2. Operate the concept, then collect'),copy('带有小游戏入口的知识物件，先读目标和说明，再亲自实验。操作通过后才解锁新收藏与基础确认；返回会保留草稿。收藏仍需自己点击，也不等于应用或测验通过。','For knowledge objects with a concept game, read its goal and explanation, then operate the experiment. Passing unlocks new collection and foundation confirmation. Returning keeps your draft. Collect manually; it does not pass applications or assessments.')];return steps;};
 const guideNextBase=guideNextStep;
 guideNextStep=function(...args){const next=guideNextBase(...args);if(next.stage!=='confirm')return next;const ctx=teachingContext(),pending=studySection().lessons.find(l=>!ctx.p.foundations.includes(ctx.flow.foundation(studySection().id,l.id)?.id)),c=pending&&ConceptGameHost.resolve(pending.id);
  return c&&ConceptGameHost.status(c).found&&needsGame(c)?{stage:'concept-game',title:copy('已找到物件，下一步亲自实验','Object found: operate its concept experiment'),body:copy('打开物件里的小游戏，先看目标，再操作和观察。通过后可收藏或确认基础，草稿会保留。','Open the object’s concept game, read the goal, then operate and observe. Passing unlocks collection or foundation confirmation; your draft is kept.'),action:copy('打开这件物品的小游戏入口','Open this object’s concept game'),run:()=>{if(ConceptGameHost.current(c))openStudyLesson(c.lesson.id);}}:next;};
 // Keep the all-found notice aligned with the same gated next action as the coach.
 const trayBase=renderTray;
 renderTray=function(...args){const result=trayBase(...args),notice=$('sectionFoundNotice'),button=$('sectionFoundNext');if(!notice||!button)return result;
  const next=guideNextStep();if(next.stage!=='concept-game')return result;
  notice.innerHTML=`<span>${esc(copy('本节物件已全部找到！','All objects in this section found!')+' '+next.body)}</span><button id="sectionFoundNext">${esc(next.action)}</button>`;
  $('sectionFoundNext').onclick=()=>guideNextStep().run();return result;
 };
 const restoreBase=L.restore;
 L.restore=function(raw){const restored=restoreBase(raw);if(!restored)return null;if(restored.conceptGameRecords!==undefined&&!ConceptGameRecords.valid(restored.conceptGameRecords,restored.banks.map(b=>b.id)))return null;return restored;};
 const replayBase=replayStudyChapter;
 replayStudyChapter=function(...args){replayBase(...args);const bank=state.selected,course=currentCourse(),chapter=studyState().chapter,ids=course.chapters[chapter].sections.flatMap(s=>s.lessons.map(l=>l.id)),button=$('confirmStudyReplay'),original=button?.onclick;if(!button)return;button.onclick=e=>{if(state.selected!==bank||currentCourse()!==course||studyState().chapter!==chapter)return;original?.(e);if(state.conceptGameRecords){ConceptGameRecords.clearLessons(state.conceptGameRecords,bank,course.id,ids);save();}};};
 // ConceptGamesUI owns its live language repaint; do not rebuild the same game twice.
 return Object.freeze({launch,whenIdle:()=>controller?.whenIdle()||Promise.resolve()});
})();
