(function(root,factory){const W=typeof module==='object'?require('./task-workshop-engine.js'):root.TaskWorkshop;const api=factory(W);if(typeof module==='object')module.exports=api;else root.KnowledgePractice=api;})(typeof window==='undefined'?globalThis:window,function(W){
'use strict';
function shuffle(items,rng=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}if(out.length>1&&out.every((v,i)=>v===items[i]))out.push(out.shift());return out;}
function progress(s,section){s.knowledgeMatches??={};return s.knowledgeMatches[section.id]??={pairs:{},attempts:0};}
function pair(s,section,term,definition){const p=progress(s,section),ids=section.lessons.map(l=>l.id);if(!ids.includes(term)||!ids.includes(definition)||!s.deposited.includes(term))return false;p.attempts++;if(term!==definition)return false;p.pairs[term]=definition;return true;}
function mastered(s,sec){if(sec.activity&&sec.activity.kind!=='match')return W.mastered(s,sec);const p=s.knowledgeMatches?.[sec.id];return!!p&&sec.lessons.every(l=>p.pairs[l.id]===l.id);}
function validate(s,course){if(s.knowledgeMatches===undefined)return true;if(!s.knowledgeMatches||Array.isArray(s.knowledgeMatches)||typeof s.knowledgeMatches!=='object')return false;return Object.entries(s.knowledgeMatches).every(([id,p])=>{const sec=course.chapters.flatMap(c=>c.sections).find(x=>x.id===id);return sec&&p&&Number.isSafeInteger(p.attempts)&&p.attempts>=0&&p.pairs&&typeof p.pairs==='object'&&!Array.isArray(p.pairs)&&Object.entries(p.pairs).every(([k,v])=>k===v&&sec.lessons.some(l=>l.id===k)&&s.deposited.includes(k));});}
return{shuffle,progress,pair,mastered,validate};
});
