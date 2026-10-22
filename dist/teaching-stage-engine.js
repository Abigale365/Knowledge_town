(function(root,factory){const api=factory(typeof module==='object'?require('./task-workshop-engine.js'):root.TaskWorkshop);if(typeof module==='object')module.exports=api;else root.TeachingStages=api;})(typeof window==='undefined'?globalThis:window,function(W){
'use strict';
// B5 candidate. B4 keeps its original engine and archived state until explicit edition selection.
function create(entry){
 if(entry.revision!==5||entry.course?.pipeline?.planRevision!==5)throw Error('Unknown staged teaching revision');
 const sections=new Map(),steps=new Map();
 for(let ci=0;ci<entry.course.chapters.length;ci++){
  let previous=[];const ch=entry.course.chapters[ci],mapped=entry.chapters[ci];
  if(mapped?.id!==ch.id||mapped.sections.length!==ch.sections.length)throw Error('B5 chapter mapping changed');
  for(let si=0;si<ch.sections.length;si++){
   const sec=ch.sections[si],source=mapped.sections[si],prefix='b5:'+sec.id,policy=source.policy;
   if(source.id!==sec.id||!policy?.guidedPractice?.round||!policy.demonstration)throw Error('B5 policy missing');
   const local=[];
   function add(step){step.requires=[...previous];step.section=sec.id;steps.set(step.id,step);local.push(step);previous=[step.id];return step.id;}
   for(const l of sec.lessons)add({id:prefix+':foundation:'+l.id,stage:'foundation',unitIds:[l.id]});
   const demo=add({id:prefix+':demo',stage:'demonstration'}),guided=add({id:prefix+':guided',stage:'guided'});
   for(const r of sec.activity.rounds)add({id:prefix+':apply:'+r.id,stage:'apply',roundId:r.id});
   sections.set(sec.id,{sec,policy,steps:local,demo,guided});
  }
 }
 function fresh(){return {v:1,binding:entry.binding,viewed:[],found:[],favorites:[],foundations:[],demonstrations:[],guided:{},assistance:{}};}
 function passed(p,s,id,memo=new Map()){
  if(memo.has(id))return memo.get(id);memo.set(id,false);const step=steps.get(id);if(!step)return false;
  const {sec,policy}=sections.get(step.section),work=s.workshops?.[sec.id];let own=false;
  if(step.stage==='foundation')own=p.foundations.includes(id)&&step.unitIds.every(u=>p.viewed.includes(u));
  if(step.stage==='demonstration')own=p.demonstrations?.includes(sec.id);
  if(step.stage==='guided')own=!!p.guided?.[sec.id]?.completed&&W.grade(policy.guidedPractice.round,p.guided[sec.id].answer);
  if(step.stage==='apply'){const i=sec.activity.rounds.findIndex(r=>r.id===step.roundId);own=work?.signature===W.signature(sec.activity)&&i>=0&&W.grade(sec.activity.rounds[i],work.answers[i]);}
  const valid=!!own&&step.requires.every(req=>passed(p,s,req,memo));memo.set(id,valid);return valid;
 }
 function gate(p,s,id){return !!steps.get(id)&&steps.get(id).requires.every(req=>passed(p,s,req));}
 function foundation(sec,id){return sections.get(sec)?.steps.find(x=>x.stage==='foundation'&&x.unitIds.includes(id));}
 function application(sec,id){return sections.get(sec)?.steps.find(x=>x.stage==='apply'&&x.roundId===id);}
 function ready(p,s,sec){return !!sections.get(sec)&&sections.get(sec).steps.filter(x=>x.stage==='foundation').every(x=>passed(p,s,x.id));}
 function complete(p,s,sec){return !!sections.get(sec)&&sections.get(sec).steps.every(x=>passed(p,s,x.id));}
 function validate(p,s){try{
  const units=new Set([...sections.values()].flatMap(x=>x.sec.lessons.map(l=>l.id)));
  if(!p||p.v!==1||p.binding!==entry.binding)return false;
  for(const k of ['viewed','found','favorites','foundations','demonstrations'])if(!Array.isArray(p[k])||new Set(p[k]).size!==p[k].length)return false;
  if([...p.viewed,...p.found,...p.favorites].some(id=>!units.has(id))||p.favorites.some(id=>!p.found.includes(id)||!p.viewed.includes(id)))return false;
  if(p.foundations.some(id=>steps.get(id)?.stage!=='foundation'||!passed(p,s,id)))return false;
  if(p.demonstrations.some(id=>!sections.has(id)||!passed(p,s,sections.get(id).demo)))return false;
  for(const [id,g]of Object.entries(p.guided||{}))if(!sections.has(id)||g.completed&&!passed(p,s,sections.get(id).guided))return false;
  for(const [id,w]of Object.entries(s.workshops||{})){const item=sections.get(id);if(!item||w.signature!==W.signature(item.sec.activity)||w.round!==w.answers.length||w.round>item.sec.activity.rounds.length||w.answers.some((a,i)=>!passed(p,s,application(id,item.sec.activity.rounds[i].id).id)))return false;}
  for(const [key,evidence]of Object.entries(p.applicationEvidence||{})){
   const split=key.indexOf(':'),sec=key.slice(0,split),round=key.slice(split+1),step=application(sec,round),help=p.assistance?.[key];
   if(!step||evidence.completed!==true||typeof evidence.independent!=='boolean'||!passed(p,s,step.id)||evidence.independent&&(help?.solutionRevealed||help?.assistanceRevealed||help?.fullReasonRevealed))return false;
  }
  return s.sealed.every(id=>complete(p,s,id))&&s.submitted.every(ci=>entry.course.chapters[ci].sections.every(sec=>complete(p,s,sec.id)));
 }catch{return false;}}
 return {fresh,passed,gate,foundation,application,ready,complete,validate,section:id=>sections.get(id)};
}
return {create};
});
