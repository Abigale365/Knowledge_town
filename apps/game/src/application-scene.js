/* Presentation-only application landmarks. Load after the teaching and locale controllers. */
'use strict';
window.ApplicationScene=(()=>{
 if(window.ApplicationScene)return window.ApplicationScene;
 const engines=new Map();
 function copy(zh,en){const value=TownLocale.text(zh,en,state.language);return state.language==='bi'&&zh&&en&&zh!==en?zh+'\n'+en:value;}
 const text=value=>typeof value==='string'?value:copy(value?.zh,value?.en);
 const lessonTitle=l=>copy(l.title,l.en?.title);
 const stages={demonstration:['看示范','View worked example'],guided:['做引导练习','Try guided practice'],independent:['独立应用','Independent application'],application:['继续应用','Continue applications'],result:['收好本节成果','Keep section result'],complete:['回看本节成果','Review section result']};
 function stageLabel(c){
  if(['independent','application'].includes(c.stage)){
   const total=c.sec.activity.rounds.length,round=Math.min(c.round+1,total);
   return copy('应用 '+round+'/'+total,'Apply '+round+'/'+total);
  }
  return copy(...{demonstration:['示范','Example'],guided:['引导','Guided'],result:['待收成果','Keep result'],complete:['成果已收好','Result kept']}[c.stage]);
 }
 function current(){
  const course=currentCourse(),bank=L.bank(state),s=state.chapterStudies?.[bank?.id];
  if(!course||!s||s.mode!=='learn'||typeof activeAwayScene!=='undefined'&&activeAwayScene)return null;
  const chapter=course.chapters[s.chapter],sec=chapter?.sections[s.section];if(!sec||state.zone!==chapter.zone)return null;
  const entry=typeof teachingEntry==='function'?teachingEntry(course):null;
  let stage='application',item=null,p=null;
  if(entry){
   p=state.teachingFlows?.[state.selected+':'+entry.binding];if(!p)return null;
   const key=entry.binding+':'+entry.signature;
   if(!engines.has(key))engines.set(key,TeachingFlow.create(entry));
   const flow=engines.get(key);if(!flow.ready(p,s,sec.id))return null;
   item=flow.section?.(sec.id);
   if(s.sealed.includes(sec.id))stage='complete';
   else if(flow.complete(p,s,sec.id))stage='result';
   else if(entry.revision===5){
    stage=!p.demonstrations.includes(sec.id)?'demonstration':!flow.passed(p,s,item.guided)?'guided':'independent';
   }
  }else{
   if(!hasWorkshop(sec)||!sec.lessons.every(l=>s.deposited.includes(l.id)))return null;
   if(s.sealed.includes(sec.id))stage='complete';else if(WorkshopEngine.mastered(s,sec))stage='result';
  }
  const work=s.workshops?.[sec.id],round=work?.signature===TaskWorkshop.signature(sec.activity)?work.round:0;
  return {bank:bank.id,course:course.id,binding:entry?.binding||null,section:sec.id,zone:state.zone,mode:s.mode,stage,round,sec,item};
 }
 function identity(c){return [c.bank,c.course,c.binding,c.section,c.zone].join('|');}
 function active(expected){const c=current();if(!c||identity(c)!==identity(expected)){refresh();return null;}return c;}
 function position(el){
  if(!el)return null;
  const style=el.getAttribute?.('style')||'',x=parseFloat(el.style?.left||style.match(/left:\s*([\d.]+)%/)?.[1]),y=parseFloat(el.style?.top||style.match(/top:\s*([\d.]+)%/)?.[1]);
  return Number.isFinite(x)&&Number.isFinite(y)?{x,y}:null;
 }
 function occupied(){
  const selectors=['[data-study-fruit]','[data-study-filed]','[data-section-device]','[data-object]','[data-unit-part]','[data-piece]','[data-station]'];
  const points=selectors.flatMap(q=>[...document.querySelectorAll(q)]).map(position).filter(Boolean);
  for(const id of ['worldStudyBasket','worldKnowledgeChest','sceneAssessmentDevice']){const el=$(id),p=el&&position(el);if(p)points.push(p);}
  for(const [x,y,dx,dy]of zoneInfo().routes)points.push({x,y},{x:x+dx/48,y:y+dy/32},{x:x+dx/24,y:y+dy/16});
  return points;
 }
 function layout(targets,blocked,previous=[]){
  const points=zoneInfo().anchors.map(([x,y])=>({x,y})).filter(p=>p.x>=12&&p.x<=90&&p.y>=24&&p.y<=78);
  // Dense original scenes can occupy every painted anchor. Nearby open ground still supports distinct props.
  for(let y=27;y<=75;y+=8)for(let x=15;x<=87;x+=6)if(!points.some(p=>Math.hypot(p.x-x,p.y-y)<2))points.push({x,y});
  const fits=(p,used)=>p&&used.every(b=>Math.abs(p.x-b.x)>=4.5||Math.abs(p.y-b.y)>=6.5);
  const distance=(p,target)=>(p.x-target[0])**2*1.6+(p.y-target[1])**2;
  const used=[...blocked],result=[];
  // Plan the two essential landmarks together: a greedy central choice can consume both remaining gaps.
  const safe=points.filter(p=>fits(p,used));
  const aims=targets.slice(0,2).map((target,i)=>fits(previous[i],used)?[previous[i].x,previous[i].y]:target);
  let pair=null,best=Infinity;
  for(const a of safe)for(const b of safe){if(!fits(b,[a]))continue;const score=distance(a,aims[0])+distance(b,aims[1]);if(score<best){best=score;pair=[a,b];}}
  if(pair){result.push(...pair);used.push(...pair);}else{
   safe.sort((a,b)=>distance(a,aims[0])-distance(b,aims[0]));result.push(safe[0]||null,null);if(safe[0])used.push(safe[0]);
  }
  for(let i=2;i<targets.length;i++){
   const available=points.filter(p=>fits(p,used));available.sort((a,b)=>distance(a,targets[i])-distance(b,targets[i]));
   const p=fits(previous[i],used)?previous[i]:available[0]||null;result.push(p);if(p)used.push(p);
  }
  return result;
 }
 function focusedProp(root){return root&&[...root.querySelectorAll('[data-application-role]')].includes(document.activeElement)?{id:document.activeElement.id,unit:document.activeElement.dataset.applicationKnowledge}:null;}
 function clearOwnHint(){if($('sceneExploreHint')?.dataset.applicationHint==='true')clearExplorationHint();}
 function boardArt(){return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M17 50l-4 12m34-12l4 12" stroke="#69543a" stroke-width="5"/><rect x="5" y="7" width="54" height="44" rx="5" fill="#ad8757" stroke="#69543a" stroke-width="2"/><rect x="10" y="12" width="44" height="33" rx="2" fill="#3e625b"/><path d="M17 20h20m-20 7h12m-12 7h17" stroke="#f1eacb" stroke-width="2" stroke-linecap="round"/><circle cx="42" cy="32" r="7" fill="#d9e7ce" stroke="#e7c97f" stroke-width="3"/><path d="M47 38l6 6" stroke="#e7c97f" stroke-width="4"/></svg>';}
 let inspectionContext=null;
 function inspect(expected,repaint=false){
  const c=active(expected);if(!c)return;
  const focusId=document.activeElement?.id;inspectionContext=c;
  const round=c.sec.activity.rounds[c.round];
  let title=c.sec.activity.title,scenario=c.stage==='demonstration'?c.item?.policy.demonstration.scenario:c.stage==='guided'?c.item?.policy.guidedPractice.round.prompt:round?.prompt||c.sec.activity.brief;
  if(typeof PlaytestDecisionTask!=='undefined'&&typeof ReleaseGuide!=='undefined'&&ReleaseGuide.current().kind==='legacy'&&PlaytestDecisionTask.legacyMatches(round)){
   const visible=PlaytestDecisionTask.visibleTask();title=visible.title;scenario=visible.scenario;
  }
  const html=`<section id="applicationInspectionView" class="application-inspection" data-locale-fixed="true"><span class="eyebrow">${copy('场景检视 · 只查看，不提交','Scene inspection · view without submitting')}</span><h2 id="dialogTitle">${esc(text(title))}</h2><p>${esc(text(scenario))}</p><p>${copy('分散的小物件可以回看知识；齿轮工坊进入当前学习阶段。检视不判分，也不会替你完成操作。','Scattered keepsakes reopen knowledge. The gear workshop opens the current learning stage. Inspection neither grades nor completes an activity.')}</p><div class="knowledge-shelf">${c.sec.lessons.map(l=>`<button data-application-review="${esc(l.id)}">${esc(lessonTitle(l))}</button>`).join('')}</div><div class="actions"><button id="applicationInspectBack">${copy('返回场景','Back to scene')}</button><button id="applicationLocate">${copy('定位当前工坊','Locate the current workshop')}</button></div></section>`;
  if(repaint===true)$('dialogBody').innerHTML=html;else modal(html,true);
  $('applicationInspectBack').onclick=close;
  $('applicationLocate').onclick=()=>{if(!active(c))return;close();refresh();const p=position($('applicationWorkshop'));if(p)pointXY(p.x,p.y);};
  document.querySelectorAll('[data-application-review]').forEach(el=>el.onclick=()=>{if(active(c))openStudyLesson(el.dataset.applicationReview,true,()=>inspect(c));});
  if(repaint===true&&focusId)$(focusId)?.focus();
 }
 function refresh(){
  const c=current(),world=$('world');let root=$('applicationScene');const focus=focusedProp(root);
  if(!c||!world){if(root)clearOwnHint();root?.remove();if(focus&&!$('dialog').open&&!(typeof activeAwayScene!=='undefined'&&activeAwayScene))$('viewport')?.focus();return;}
  // Existing knowledge remains untouched. Restore only missing keepsakes, including favorites removed by the base renderer.
  const visible=new Set(['[data-study-fruit]','[data-study-filed]'].flatMap(q=>[...document.querySelectorAll(q)]).map(el=>el.dataset.studyFruit||el.dataset.studyFiled));
  const missing=c.sec.lessons.filter(l=>!visible.has(l.id)).slice(0,6);
  const sameContext=root?._applicationContext===identity(c),prior=sameContext?root._applicationSlots:[];
  const previous=[prior?.[0],prior?.[1],...missing.map(l=>{const i=root?._applicationLessons?.indexOf(l.id)??-1;return sameContext&&i>=0?prior?.[i+2]:null;})];
  const slots=layout([[55,58],[32,43],[23,57],[75,42],[39,68],[66,66],[25,33],[82,60]].slice(0,missing.length+2),occupied(),previous);
  if(!slots[0]){clearOwnHint();root?.remove();if(focus&&!$('dialog').open)$('viewport')?.focus();return;}
  const key=JSON.stringify([identity(c),c.mode,c.stage,c.round,state.language,missing.map(l=>l.id),slots]);
  if(root?._applicationKey===key)return;
  clearOwnHint();
  if(!root){root=document.createElement('div');root.id='applicationScene';root.className='application-scene';world.appendChild(root);}
  root._applicationKey=key;root._applicationContext=identity(c);root._applicationSlots=slots;root._applicationLessons=missing.map(l=>l.id);root.setAttribute('data-application-stage',c.stage);root.setAttribute('data-locale-fixed','true');
  const button=(id,role,p,art,label,extra='',visible='')=>p?`<button ${id?`id="${id}"`:''} class="application-prop application-${role}" data-application-role="${role}" style="left:${p.x}%;top:${p.y}%" aria-label="${esc(label)}" ${extra}>${art}${visible}</button>`:'';
  const caption=copy(...stages[c.stage]);
  const badge=stageLabel(c);
  root.innerHTML=button('applicationWorkshop','workshop',slots[0],explorationArt('workshop'),caption+' · '+badge,'',`<span class="application-stage-marker" aria-hidden="true">${esc(badge)}</span><small class="application-role-label" aria-hidden="true">${esc(copy('应用工坊','Workshop'))}</small>`)+
   button('applicationInspection','inspection',slots[1],boardArt(),copy('检视当前情境','Inspect the current situation'),'',`<small class="application-role-label" aria-hidden="true">${esc(copy('情境检视','Case board'))}</small>`)+
   missing.map((l,i)=>button('','knowledge',slots[i+2],explorationArt('knowledge',discoveryProp(l).mode),lessonTitle(l),`data-application-knowledge="${esc(l.id)}"`)).join('');
  $('applicationWorkshop').onclick=e=>{if(Date.now()<suppressClick)return;e?.stopPropagation?.();if(active(c))openTaskWorkshop();};
  if($('applicationInspection'))$('applicationInspection').onclick=e=>{if(Date.now()<suppressClick)return;e?.stopPropagation?.();inspect(c);};
  document.querySelectorAll('[data-application-knowledge]').forEach(el=>el.onclick=e=>{if(Date.now()<suppressClick)return;e?.stopPropagation?.();if(active(c))openStudyLesson(el.dataset.applicationKnowledge,true);});
  for(const el of root.querySelectorAll('[data-application-role]')){
   const lesson=c.sec.lessons.find(l=>l.id===el.dataset.applicationKnowledge);
   const text=el.dataset.applicationRole==='workshop'?caption+' · '+badge:el.dataset.applicationRole==='inspection'?copy('查看当前题面与相关知识；不提交答案。','Inspect the current prompt and related knowledge without submitting.'):(lesson?lessonTitle(lesson)+'\n':'')+copy('回看定义、例子与来源；收藏和基础进度保留。','Reread definitions, examples and sources; keep favorites and foundation progress.');
   bindExplorationHint(el,text);
   const showHint=el.onmouseenter;el.onmouseenter=el.onfocus=e=>{if($('dialog').open)return;showHint?.(e);const hint=$('sceneExploreHint');hint?.setAttribute('data-locale-fixed','true');hint?.setAttribute('data-application-hint','true');};
  }
  if(focus&&!$('dialog').open){const next=focus.unit?[...root.querySelectorAll('[data-application-knowledge]')].find(el=>el.dataset.applicationKnowledge===focus.unit):$(focus.id);(next||$('applicationWorkshop'))?.focus({preventScroll:true});}
 }
 const priorLoot=renderLoot;renderLoot=function(...args){const result=priorLoot(...args);refresh();return result;};
 const priorLanguage=changeTownLanguage;changeTownLanguage=function(...args){const result=priorLanguage(...args);refresh();if($('dialog').open&&$('applicationInspectionView')&&inspectionContext)inspect(inspectionContext,true);return result;};
 $('dialog')?.addEventListener('close',refresh);
 if(typeof worldReady!=='undefined'&&worldReady)refresh();
 return Object.freeze({current,refresh});
})();
