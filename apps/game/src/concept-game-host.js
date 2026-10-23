/* D-owned bridge: exact content identity and saved evidence; UI never grants collection. */
'use strict';
window.ConceptGameHost=(()=>{
 const hashes=new WeakMap();
 function hashObject(value){const json=JSON.stringify(value),previous=hashes.get(value);if(previous?.json===json)return previous.hash;const hash=ConceptGameHash.sha256(json);hashes.set(value,{json,hash});return hash;}
 function resolve(id){
  if(typeof ConceptGames==='undefined'||typeof ConceptGameCatalog==='undefined')return null;
  const engine=typeof ConceptGamesNext==='undefined'?ConceptGames:ConceptGamesNext;
  const course=currentCourse(),bank=L.bank(state);if(!course||!bank)return null;
  const section=course.chapters.flatMap(ch=>ch.sections).find(sec=>sec.lessons.some(l=>l.id===id)),lesson=section?.lessons.find(l=>l.id===id);if(!lesson?.sourceUnitId)return null;
  // B bindings deliberately hash the complete original JSON, not sorted replay fingerprints.
  const context={courseId:course.id,courseHash:hashObject(course),lessonId:lesson.id,sourceUnitId:lesson.sourceUnitId,lessonHash:hashObject(lesson),knowledgeHash:ConceptGameCatalog.knowledge.hash};
  const descriptor=engine.resolve(ConceptGameCatalog,context);if(!descriptor)return null;
  const binding={courseId:course.id,courseRevision:String(course.version??1),courseDigest:context.courseHash,lessonId:lesson.id,lessonDigest:context.lessonHash,gameId:descriptor.id,gameRevision:String(descriptor.revision),gameDigest:ConceptGameHash.sha256(JSON.stringify(descriptor))};
  return {bank:bank.id,course,section,lesson,context,descriptor,binding,engine};
 }
 function current(c){const next=c&&resolve(c.lesson.id);return next&&next.bank===c.bank&&ConceptGameRecords.bindingKey(next.binding)===ConceptGameRecords.bindingKey(c.binding)?next:null;}
 function verified(c,draft){try{return c.engine.restore(c.descriptor,c.context,draft?.serialized??draft);}catch{return null;}}
 function localUI(value){
  if(value===undefined)return true;
  try{if(!value||typeof value!=='object'||Array.isArray(value)||JSON.stringify(value).length>4096)return false;
   const safe=(v,depth)=>depth<12&&(v===null||typeof v==='boolean'||typeof v==='number'&&Number.isFinite(v)||typeof v==='string'&&v.length<=512||Array.isArray(v)&&v.length<=100&&v.every(x=>safe(x,depth+1))||typeof v==='object'&&Object.keys(v).length<=100&&Object.entries(v).every(([k,x])=>!['__proto__','constructor','prototype'].includes(k)&&safe(x,depth+1)));
   return safe(value,0);
  }catch{return false;}
 }
 function validDraft(c,draft){return typeof draft?.serialized==='string'&&!!draft.ui&&typeof draft.ui.reading==='boolean'&&typeof draft.ui.inputRaw==='string'&&draft.ui.inputRaw.length<=50&&localUI(draft.ui.local)&&!!verified(c,draft);}
 function readDraft(c){if(!c||!state.conceptGameRecords)return null;return ConceptGameRecords.read(state.conceptGameRecords,c.bank,c.binding,d=>validDraft(c,d));}
 function read(c){const draft=readDraft(c);return draft?verified(c,draft):null;}
 function write(c,draft){
  if(!current(c))return false;const checked=verified(c,draft);if(!checked)return false;
  const normalized={serialized:c.engine.serialize(checked),ui:{reading:draft?.ui?.reading===true,inputRaw:typeof draft?.ui?.inputRaw==='string'?draft.ui.inputRaw.slice(0,50):String(checked.data.input??'')}};
  if(!localUI(draft?.ui?.local))return false;if(draft?.ui?.local!==undefined)normalized.ui.local=JSON.parse(JSON.stringify(draft.ui.local));
  const store=state.conceptGameRecords||ConceptGameRecords.fresh();
  if(!ConceptGameRecords.write(store,c.bank,c.binding,normalized,d=>validDraft(c,d)))return false;
  state.conceptGameRecords=store;save();return true;
 }
 function status(c){
  const entry=teachingEntry(c.course),p=entry&&state.teachingFlows?.[c.bank+':'+entry.binding],study=state.chapterStudies?.[c.bank];
  const alreadyCollected=!!(p?.favorites.includes(c.lesson.id)||study?.carried.includes(c.lesson.id)||study?.deposited.includes(c.lesson.id));
  // Older archives may predate the explicit discovery ledger. An existing
  // collection proves prior discovery without granting a new game completion.
  const found=alreadyCollected||!!p?.found?.includes(c.lesson.id),engineState=read(c)||c.engine.fresh(c.descriptor,c.context),draft=readDraft(c)||engineState;
  return {...c.engine.collection(c.descriptor,c.context,engineState,{found,alreadyCollected}),found,alreadyCollected,draft};
 }
 function reset(c){return !!current(c)&&write(c,c.engine.fresh(c.descriptor,c.context));}
 return Object.freeze({resolve,current,read,readDraft,write,status,reset});
})();
