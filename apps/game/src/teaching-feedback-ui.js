/* UI candidate v2. D owns invocation, binding validation, grading and saved assistance. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TeachingFeedback=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
'use strict';
const version=2;let bindingSequence=0;
const copy={
 title:{zh:'逐项核验',en:'Check each item'},
 correct:{zh:'此项符合题目证据，保留当前操作。',en:'This item agrees with the evidence. Keep this work.'},
 review:{zh:'检查此项与题目证据、单位或先后依赖是否一致；其他正确操作保留。',en:'Check this item against the scenario evidence, units or dependencies. Keep other correct work.'},
 item:{zh:'本题项目',en:'Task item'},
 missing:{zh:'未收到可显示的逐项诊断，请回到题面核验当前作答。',en:'No item diagnostics are available. Check your response against the task.'},
 failed:{zh:'请修正标出的项目；当前草稿和已正确的操作保留。',en:'Review the marked items. Your draft and correct work are retained.'},
 passed:{zh:'本轮操作符合条件；整章仍需90%正式测验。',en:'This response meets the task conditions. The chapter still requires a 90% formal assessment.'},
 assisted:{zh:'已提供本题辅助。后续正确完成属于订正，不能据此标为独立掌握；仍需正式测验确认。',en:'Task assistance has been provided. A later correct response is a correction, not independent mastery evidence. Formal assessment is still required.'},
 guided:{zh:'这是示范或引导练习，不计独立应用证据。',en:'This is a demonstration or guided practice, not independent application evidence.'},
 knowledge:{zh:'回看相关知识',en:'Review related knowledge'},
 locate:{zh:'回到这一项修改','en':'Return to this item'},
 reveal:{zh:'查看本题解析',en:'View this task’s explanation'},
 explanation:{zh:'本题解析 · 辅助订正',en:'Task explanation · assisted correction'},
 unavailable:{zh:'本题解析暂不可用；可先回看相关知识。',en:'The explanation is unavailable. Review related knowledge for now.'},
 revealFailed:{zh:'暂未打开解析，请稍后重试；当前作答保留。',en:'The explanation could not be opened. Try again later; your response is retained.'}
};
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const language=value=>['zh','en','bi'].includes(value)?value:'zh';
function pair(value,fallback=copy.item){
 if(typeof value==='string'&&value.trim())return {zh:value,en:value};
 return {zh:typeof value?.zh==='string'&&value.zh.trim()?value.zh:fallback.zh,en:typeof value?.en==='string'&&value.en.trim()?value.en:fallback.en};
}
function text(value,mode){const p=pair(value);return mode==='bi'?`<span lang="zh-CN">${escape(p.zh)}</span><span class="tf-secondary" lang="en">${escape(p.en)}</span>`:escape(p[mode]);}
function checksOf(diagnostics){return Array.isArray(diagnostics?.checks)?diagnostics.checks.filter(c=>c&&typeof c==='object'):[];}
function reviewsFor(check,options){return (Array.isArray(check.reviewLinks)?check.reviewLinks:Array.isArray(options.reviewLinks)?options.reviewLinks:[]).filter(link=>link&&typeof link.unitId==='string'&&link.unitId&&link.action!=='reveal-answer');}
function explanationOf(diagnostics,options){
 // Only display authored prose. Never stringify expected, target, witness or draft.
 if(typeof options.explanation==='string'||options.explanation?.zh||options.explanation?.en)return [pair(options.explanation,copy.unavailable)];
 const reasons=checksOf(diagnostics).map(c=>c.reason).filter(value=>typeof value==='string'||value?.zh||value?.en);
 const unique=new Map(reasons.map(value=>{const p=pair(value,copy.unavailable);return [p.zh+'\n'+p.en,p];}));
 return [...unique.values()];
}
function evidence(diagnostics,options={}){
 const fullReasonRevealed=options.fullReasonRevealed===true||diagnostics?.fullReasonRevealed===true;
 const assisted=diagnostics?.correct===false||diagnostics?.assistanceRevealed===true||options.assistanceRevealed===true||options.solutionRevealed===true||fullReasonRevealed;
 // B.gradeStage reads solutionRevealed only. Item-level hints already require
 // assisted correction, but must never make the full explanation appear by themselves.
 return {assistanceRevealed:assisted,solutionRevealed:assisted,fullReasonRevealed,independentCreditClaimed:false};
}
function solutionHTML(diagnostics,options,mode){const reasons=explanationOf(diagnostics,options);return `<h4>${text(copy.explanation,mode)}</h4>${(reasons.length?reasons:[copy.unavailable]).map(p=>`<p>${text(p,mode)}</p>`).join('')}`;}
function render(diagnostics,options={}){
 const mode=language(options.language),checks=checksOf(diagnostics),info=evidence(diagnostics,options),links=[];
 const list=checks.map((check,index)=>{
  const correct=check.correct===true;
  const review=reviewsFor(check,options).map(link=>{const key=links.push(link)-1;return `<button type="button" data-tf-review="${key}">${text(copy.knowledge,mode)} · ${text(pair(link.title),mode)}</button>`;}).join('');
  // Detailed item explanations require an explicit, reviewed host opt-in after
  // assistance is persisted. Full case reasoning remains a separate reveal action.
  const message=correct?copy.correct:options.itemFeedback===true?pair(check.message,copy.review):copy.review;
  const locate=!correct&&typeof options.findControl==='function'?`<button type="button" data-tf-locate="${index}">${text(copy.locate,mode)}</button>`:'';
  return `<li class="tf-item ${correct?'tf-correct':'tf-review'}" data-tf-check="${index}"><span class="tf-symbol" aria-hidden="true">${correct?'✓':'!'}</span><div><strong>${text(pair(check.label),mode)}</strong><p data-tf-description="${index}">${text(message,mode)}</p>${review||locate?`<div class="tf-links">${locate}${review}</div>`:''}</div></li>`;
 }).join('');
 const guided=options.stage==='guided'||options.stage==='demonstration';
 const reason=explanationOf(diagnostics,options);
 return `<section class="teaching-feedback" data-locale-fixed="true" lang="${mode==='en'?'en':'zh-CN'}"><h3>${text(copy.title,mode)}</h3><p class="tf-summary" role="status">${text(!checks.length?copy.missing:diagnostics?.correct===true?copy.passed:copy.failed,mode)}</p>${guided?`<p class="tf-evidence-note">${text(copy.guided,mode)}</p>`:''}${info.assistanceRevealed?`<p class="tf-evidence-note">${text(copy.assisted,mode)}</p>`:''}<ul class="tf-checks">${list}</ul>${reason.length&&!info.fullReasonRevealed?`<button type="button" data-tf-reveal>${text(copy.reveal,mode)}</button>`:''}<div class="tf-explanation" data-tf-explanation ${info.fullReasonRevealed?'':'hidden'}>${info.fullReasonRevealed?solutionHTML(diagnostics,options,mode):''}</div><p data-tf-error role="status"></p></section>`;
}
function bind(container,diagnostics,options={}){
 if(!container?.querySelectorAll)throw new TypeError('TeachingFeedback.bind requires a dedicated feedback container');
 const checks=checksOf(diagnostics),links=checks.flatMap(check=>reviewsFor(check,options)),cleanups=[];let active=true;
 const info=evidence(diagnostics,options);
 // Host must persist this conservatively before showing diagnostics. No save or grading
 // functions are called here; repeated notifications must be idempotent on the host.
 if(info.assistanceRevealed||info.solutionRevealed){const pending=options.onAssistance?.({...info,source:'item-diagnostics'});if(pending?.then)Promise.resolve(pending).catch(error=>options.onError?.(error));}
 for(const button of container.querySelectorAll('[data-tf-review]')){
  const callback=()=>{const link=links[Number(button.dataset.tfReview)];if(link)options.onReview?.(link.unitId,link);};
  button.onclick=callback;cleanups.push(()=>{if(button.onclick===callback)button.onclick=null;});
 }
 const annotations=new Map(),controlsByIndex=new Map(),descriptions=new Map();
 const bindingId=++bindingSequence;
 for(const node of container.querySelectorAll('[data-tf-description]')){
  const index=Number(node.dataset.tfDescription),prior=node.getAttribute('id'),id=prior||'teaching-feedback-'+bindingId+'-'+index;
  if(!prior){node.setAttribute('id',id);cleanups.push(()=>{if(node.getAttribute('id')===id)node.removeAttribute('id');});}
  descriptions.set(index,id);
 }
 if(typeof options.findControl==='function')checks.forEach((check,index)=>{
  const found=options.findControl(check.id,index),controls=Array.isArray(found)?found:found?[found]:[];
  controlsByIndex.set(index,controls);
  for(const control of controls)if(control?.setAttribute){const entry=annotations.get(control)||{correct:true,descriptions:new Set()};entry.correct&&=check.correct===true;if(check.correct!==true&&descriptions.has(index))entry.descriptions.add(descriptions.get(index));annotations.set(control,entry);}
 });
 for(const [control,entry]of annotations){const prior=control.getAttribute('data-teaching-feedback'),invalid=control.getAttribute('aria-invalid'),describedBy=control.getAttribute('aria-describedby');
   control.setAttribute('data-teaching-feedback',entry.correct?'correct':'review');control.setAttribute('aria-invalid',entry.correct?'false':'true');
   if(entry.descriptions.size)control.setAttribute('aria-describedby',[...new Set([...(describedBy||'').split(/\s+/).filter(Boolean),...entry.descriptions])].join(' '));
   cleanups.push(()=>{if(prior===null)control.removeAttribute('data-teaching-feedback');else control.setAttribute('data-teaching-feedback',prior);if(invalid===null)control.removeAttribute('aria-invalid');else control.setAttribute('aria-invalid',invalid);if(describedBy===null)control.removeAttribute('aria-describedby');else control.setAttribute('aria-describedby',describedBy);});
 }
 for(const button of container.querySelectorAll('[data-tf-locate]')){
  const controls=controlsByIndex.get(Number(button.dataset.tfLocate))||[];button.disabled=!controls.length;
  const callback=()=>{if(!active||button.disabled)return;const control=controls[0];control.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'auto'});control.focus?.({preventScroll:true});};
  button.onclick=callback;cleanups.push(()=>{if(button.onclick===callback)button.onclick=null;});
 }
 for(const button of container.querySelectorAll('[data-tf-reveal]')){
  const callback=async()=>{
   if(!active||button.disabled)return;button.disabled=true;
   const meta={assistanceRevealed:true,solutionRevealed:true,fullReasonRevealed:false,independentCreditClaimed:false,source:'explicit-explanation-request'};
   try{
    await options.onAssistance?.(meta);
    if(!active)return;
    if(await options.onReveal?.(meta)===false){button.disabled=false;return;}
    if(!active)return;
    const target=container.querySelectorAll('[data-tf-explanation]')[0];
    if(target){
     target.innerHTML=solutionHTML(diagnostics,options,language(options.language));target.hidden=false;button.hidden=true;
     // A request or refused/cancelled permission must not become a persisted reveal.
     // Notify actual display only after the authored prose is on the active view.
     try{await options.onExplanationShown?.({...meta,fullReasonRevealed:true,source:'explanation-shown'});}catch(error){options.onError?.(error);}
    }else button.disabled=false;
   }catch(error){if(!active)return;button.disabled=false;const status=container.querySelectorAll('[data-tf-error]')[0];if(status)status.innerHTML=text(copy.revealFailed,language(options.language));options.onError?.(error);}
  };
  button.onclick=callback;cleanups.push(()=>{if(button.onclick===callback)button.onclick=null;});
 }
 return ()=>{active=false;for(const cleanup of cleanups.reverse())cleanup();};
}
return {version,render,bind,evidence};
});
