(function(root,factory){const W=typeof module==='object'?require('./task-workshop-engine.js'):root.TaskWorkshop,api=factory(W);if(typeof module==='object')module.exports=api;else root.TeachingFlow=api;})(typeof window==='undefined'?globalThis:window,function(W){
'use strict';
function create(entry){
 // Rebuild the reviewed v4 policy from course identities. Never trust saved gates.
 if(entry.revision!==4||entry.course?.pipeline?.planRevision!==4||entry.chapters?.length!==entry.course.chapters.length)throw Error('Unknown teaching policy');
 const legacy=entry.course.pipeline.knowledgePackId==='legacy-knowledge';
 for(let ci=0;ci<entry.course.chapters.length;ci++){
  const ch=entry.course.chapters[ci],mapped=entry.chapters[ci];let previous=[];
  if(mapped.id!==ch.id||mapped.sections.length!==ch.sections.length)throw Error('Archived chapter mapping changed');
  for(let si=0;si<ch.sections.length;si++){
   const sec=ch.sections[si],saved=mapped.sections[si],prefix=legacy?'legacy:'+sec.id:sec.sourceSectionId;
   const canonical=[...sec.lessons.map(l=>({id:prefix+':foundation:'+(legacy?l.id:l.sourceUnitId),stage:'foundation',unitIds:[l.id]})),...sec.activity.rounds.map(r=>({id:prefix+(legacy?':':':apply:')+r.id,stage:'apply',roundId:r.id}))];
   if(saved.id!==sec.id||saved.steps.length!==canonical.length)throw Error('Archived section mapping changed');
   for(let i=0;i<canonical.length;i++){
    const expected=canonical[i],actual=saved.steps[i];
    if(actual.id!==expected.id||actual.stage!==expected.stage||actual.roundId!==expected.roundId||expected.unitIds&&JSON.stringify(actual.unitIds)!==JSON.stringify(expected.unitIds)||JSON.stringify(actual.requiresStepIds)!==JSON.stringify(previous))throw Error('Archived teaching prerequisites changed');
    previous=[expected.id];
   }
  }
 }
 const steps=new Map(entry.chapters.flatMap(ch=>ch.sections.flatMap(sec=>sec.steps.map(step=>[step.id,{...step,section:sec.id}])))),sections=new Map(entry.course.chapters.flatMap(ch=>ch.sections.map(sec=>[sec.id,sec])));
 const signatures=new Map([...sections].map(([id,sec])=>[id,W.signature(sec.activity)]));
 function fresh(){return {v:1,binding:entry.binding,viewed:[],found:[],favorites:[],foundations:[]};}
 function passed(p,s,id,memo=new Map()){
  if(memo.has(id))return memo.get(id);const step=steps.get(id);if(!step)return false;memo.set(id,false);
  const sec=sections.get(step.section),index=sec.activity.rounds.findIndex(r=>r.id===step.roundId),work=s.workshops?.[sec.id];
  const own=step.stage==='foundation'?p.foundations.includes(id)&&step.unitIds.every(u=>p.viewed.includes(u)):work?.signature===signatures.get(sec.id)&&index>=0&&W.grade(sec.activity.rounds[index],work.answers[index]);
  const ok=!!own&&step.requiresStepIds.every(req=>passed(p,s,req,memo));memo.set(id,ok);return ok;
 }
 function gate(p,s,id){const step=steps.get(id);return !!step&&step.requiresStepIds.every(req=>passed(p,s,req));}
 function foundation(sec,id){return entry.chapters.flatMap(c=>c.sections).find(s=>s.id===sec)?.steps.find(x=>x.stage==='foundation'&&x.unitIds.includes(id));}
 function ready(p,s,sec){const memo=new Map();return entry.chapters.flatMap(c=>c.sections).find(x=>x.id===sec)?.steps.filter(x=>x.stage==='foundation').every(x=>passed(p,s,x.id,memo))||false;}
 function complete(p,s,sec){const memo=new Map();return entry.chapters.flatMap(c=>c.sections).find(x=>x.id===sec)?.steps.every(x=>passed(p,s,x.id,memo))||false;}
 function application(sec,round){return entry.chapters.flatMap(c=>c.sections).find(x=>x.id===sec)?.steps.find(x=>x.roundId===round);}
 function validate(p,s){try{const memo=new Map(),units=new Set(entry.course.chapters.flatMap(c=>c.sections.flatMap(sec=>sec.lessons.map(l=>l.id))));if(!p||p.v!==1||p.binding!==entry.binding)return false;
  if(p.found!==undefined&&(!Array.isArray(p.found)||new Set(p.found).size!==p.found.length||p.found.some(id=>!units.has(id))))return false;
  for(const key of ['viewed','favorites','foundations'])if(!Array.isArray(p[key])||new Set(p[key]).size!==p[key].length)return false;
  if([...p.viewed,...p.favorites].some(id=>!units.has(id))||p.favorites.some(id=>!p.viewed.includes(id))||p.foundations.some(id=>steps.get(id)?.stage!=='foundation'||!passed(p,s,id,memo)))return false;
  for(const sec of sections.values()){const w=s.workshops?.[sec.id];if(w&&(w.signature!==signatures.get(sec.id)||!Number.isInteger(w.round)||w.round!==w.answers.length||w.round>sec.activity.rounds.length||w.answers.some((a,i)=>!W.grade(sec.activity.rounds[i],a)||!passed(p,s,application(sec.id,sec.activity.rounds[i].id).id,memo))))return false;}
  return s.sealed.every(id=>complete(p,s,id))&&s.submitted.every(ci=>entry.course.chapters[ci].sections.every(sec=>complete(p,s,sec.id)));
 }catch{return false;}}
 return {fresh,passed,gate,foundation,ready,complete,application,validate};
}
return {create};
});
