/* Save-side records for concept games. Completion is always recomputed by the game engine. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ConceptGameRecords=api;})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const fields=['courseId','courseRevision','courseDigest','lessonId','lessonDigest','gameId','gameRevision','gameDigest'];
// JSON may arrive through another realm (for example a backup importer or test VM).
const plain=x=>{if(!x||typeof x!=='object'||Array.isArray(x))return false;const proto=Object.getPrototypeOf(x);return proto===null||Object.prototype.toString.call(x)==='[object Object]'&&Object.getPrototypeOf(proto)===null;};
function bindingKey(binding){
 if(!plain(binding)||fields.some(k=>typeof binding[k]!=='string'||!binding[k]||binding[k].length>256))throw Error('Invalid concept game binding');
 return JSON.stringify(fields.map(k=>binding[k]));
}
function copy(value){return JSON.parse(JSON.stringify(value));}
function draftOK(draft){try{return plain(draft)&&JSON.stringify(draft).length<=65536;}catch{return false;}}
function fresh(){return {v:1,records:[]};}
function valid(store,bankIds){
 try{
  if(!plain(store)||store.v!==1||!Array.isArray(store.records)||store.records.length>10000)return false;
  const seen=new Set();let total=0;
  for(const r of store.records){
   if(!plain(r)||typeof r.bank!=='string'||!r.bank||r.bank.length>256||bankIds&&!bankIds.includes(r.bank)||!draftOK(r.draft))return false;
   const key=r.bank+'\n'+bindingKey(r.binding);if(seen.has(key))return false;seen.add(key);
   total+=JSON.stringify(r).length;if(total>2097152)return false;
   // A serialized completion flag is not evidence and is not part of this format.
   if(Object.keys(r).some(k=>!['bank','binding','draft'].includes(k)))return false;
  }
  return true;
 }catch{return false;}
}
function read(store,bank,binding,validateDraft){
 if(!valid(store))return null;const key=bindingKey(binding),record=store.records.find(r=>r.bank===bank&&bindingKey(r.binding)===key);
 if(!record)return null;const draft=copy(record.draft);
 try{return validateDraft(draft)===true?draft:null;}catch{return null;}
}
function write(store,bank,binding,draft,validateDraft){
 if(!valid(store)||typeof bank!=='string'||!bank||!draftOK(draft))return false;
 const cloned=copy(draft);try{if(validateDraft(cloned)!==true)return false;}catch{return false;}
 let key;try{key=bindingKey(binding);}catch{return false;}
 const index=store.records.findIndex(r=>r.bank===bank&&bindingKey(r.binding)===key),record={bank,binding:copy(binding),draft:cloned},records=store.records.slice();
 if(index<0){if(records.length>=10000)return false;records.push(record);}else records[index]=record;
 if(!valid({v:1,records}))return false;store.records=records;
 return true;
}
function clearLessons(store,bank,courseId,lessonIds){if(!valid(store))return false;store.records=store.records.filter(r=>r.bank!==bank||r.binding.courseId!==courseId||!lessonIds.includes(r.binding.lessonId));return true;}
return Object.freeze({fresh,bindingKey,valid,read,write,clearLessons});
});
