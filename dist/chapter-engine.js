(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.ChapterStudy=api;})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const zones=['grove','harbor','town','observatory'];
function fresh(){return{v:1,chapter:0,section:0,mode:'learn',read:[],carried:[],deposited:[],sealed:[],submitted:[],records:{},assessments:[],round:null};}
function lessons(course,ch){return course.chapters[ch].sections.flatMap(s=>s.lessons);}
function ids(course,ch){return course.chapters[ch].sections.map(s=>s.id);}
function learned(s,course,ch=s.chapter){return ids(course,ch).every(id=>s.sealed.includes(id));}
function unlocked(s,ch){return Number.isInteger(ch)&&ch>=0&&ch<4;}
function enter(s,course,ch){if(!Number.isInteger(ch)||ch<0||ch>=course.chapters.length)return false;if(ch===s.chapter)return true;
 s.chapterViews??={};s.chapterViews[s.chapter]={section:s.section,mode:s.mode,round:s.round};const view=s.chapterViews[ch];s.chapter=ch;
 if(view){s.section=view.section;s.mode=view.mode;s.round=view.round;}else{s.section=course.chapters[ch].sections.findIndex(x=>!s.sealed.includes(x.id));if(s.section<0)s.section=0;s.mode=s.submitted.includes(ch)?'practice':'learn';s.round=null;}return true;}
function read(s,course,id){if(!course.chapters[s.chapter].sections[s.section].lessons.some(x=>x.id===id))return false;if(!s.read.includes(id))s.read.push(id);return true;}
function collect(s,course,id){if(!s.read.includes(id)||!course.chapters[s.chapter].sections[s.section].lessons.some(x=>x.id===id))return false;if(s.deposited.includes(id))return false;if(!s.carried.includes(id))s.carried.push(id);return true;}
function deposit(s,course,id){const section=course.chapters[s.chapter].sections[s.section];if(!s.carried.includes(id)||!section.lessons.some(l=>l.id===id))return false;s.carried=s.carried.filter(x=>x!==id);if(!s.deposited.includes(id))s.deposited.push(id);return true;}
function seal(s,course){const section=course.chapters[s.chapter].sections[s.section];if(!section.lessons.every(l=>s.deposited.includes(l.id)))return false;if(!s.sealed.includes(section.id))s.sealed.push(section.id);const next=course.chapters[s.chapter].sections.findIndex(x=>!s.sealed.includes(x.id));if(next>=0)s.section=next;return true;}
function submit(s,course){if(!learned(s,course))return false;if(!s.submitted.includes(s.chapter))s.submitted.push(s.chapter);s.mode='practice';return true;}
function questionSection(course,c){return course.chapters.flatMap(ch=>ch.sections).find(sec=>c.topic?.startsWith('Task '+sec.id+' ·')||c.section===sec.id);}
function pool(s,course,cards){const sections=new Set(ids(course,s.chapter));return cards.filter(c=>sections.has(questionSection(course,c)?.id));}
function record(s,id,ok,mode='practice',assisted=false,now=Date.now()){
 const old=s.records[id]||{attempts:0,correct:0,wrong:0,resolved:false,due:0};old.attempts++;old.last=now;old.lastMode=mode;
 if(ok){old.correct++;if(!assisted){old.resolved=true;old.due=now+86400000;}}else{old.wrong++;old.resolved=false;old.due=now+600000;}s.records[id]=old;return old;
}
function mistakes(s,course,cards){return pool(s,course,cards).filter(c=>s.records[c.id]?.wrong&&!s.records[c.id].resolved);}
function review(s,course,cards,now=Date.now()){return pool(s,course,cards).filter(c=>s.records[c.id]?.attempts).sort((a,b)=>(s.records[a.id].due<=now?0:1)-(s.records[b.id].due<=now?0:1)||s.records[a.id].due-s.records[b.id].due);}
function beginAssessment(s,course,cards){
 if(!s.submitted.includes(s.chapter))return null;const all=pool(s,course,cards);if(!all.length)return null;
 // Fixed full chapter coverage: no cherry-picking or correcting one attempt into a pass.
 const offset=s.assessments.filter(a=>a.chapter===s.chapter).length%all.length;
 s.round={chapter:s.chapter,ids:[...all.slice(offset),...all.slice(0,offset)].map(c=>c.id),answers:[],at:Date.now()};s.mode='assessment';return s.round;
}
function answerAssessment(s,id,ok){const r=s.round;if(!r||r.ids[r.answers.length]!==id)return false;r.answers.push(!!ok);record(s,id,!!ok,'assessment',false);return true;}
function finishAssessment(s){const r=s.round;if(!r||r.answers.length!==r.ids.length)return null;const result={chapter:r.chapter,total:r.ids.length,correct:r.answers.filter(Boolean).length,at:Date.now()};s.assessments.push(result);while(s.assessments.length>100){let index=s.assessments.findIndex((a,i,list)=>a.correct/a.total<.9||list.some((b,j)=>j!==i&&b.chapter===a.chapter&&b.correct/b.total>=.9));if(index<0)index=0;s.assessments.splice(index,1);}s.round=null;s.mode='review';return result;}
function validate(s,course,cards){
 try{if(!s||s.v!==1||!Number.isInteger(s.chapter)||s.chapter<0||s.chapter>=course.chapters.length||!Number.isInteger(s.section)||s.section<0||s.section>=course.chapters[s.chapter].sections.length||!['learn','practice','review','mistakes','assessment'].includes(s.mode))return false;
 const allLessons=new Set(course.chapters.flatMap(c=>c.sections.flatMap(sec=>sec.lessons.map(l=>l.id)))),allSections=course.chapters.flatMap(c=>c.sections),questionIds=new Set(cards.map(c=>c.id));
 for(const k of ['read','carried','deposited','sealed','submitted'])if(!Array.isArray(s[k])||new Set(s[k]).size!==s[k].length)return false;
 if(s.read.some(id=>!allLessons.has(id))||s.carried.some(id=>!s.read.includes(id)||s.deposited.includes(id))||s.deposited.some(id=>!s.read.includes(id))||s.sealed.some(id=>!allSections.find(sec=>sec.id===id)?.lessons.every(l=>s.deposited.includes(l.id)))||s.submitted.some(ch=>!Number.isInteger(ch)||ch<0||ch>=course.chapters.length||!ids(course,ch).every(id=>s.sealed.includes(id))))return false;
 if(!Array.isArray(s.assessments)||s.assessments.length>100||s.assessments.some(a=>!Number.isInteger(a.chapter)||a.chapter<0||a.chapter>=course.chapters.length||!Number.isInteger(a.correct)||!Number.isInteger(a.total)||a.total!==pool({...s,chapter:a.chapter},course,cards).length||a.total<1||a.correct<0||a.correct>a.total||!s.submitted.includes(a.chapter)))return false;
 if(!unlocked(s,s.chapter)||!s.records||typeof s.records!=='object'||Array.isArray(s.records)||Object.entries(s.records).some(([id,r])=>!questionIds.has(id)||!r||!['attempts','correct','wrong'].every(k=>Number.isInteger(r[k])&&r[k]>=0)||r.attempts!==r.correct+r.wrong||typeof r.resolved!=='boolean'||!Number.isFinite(r.due)))return false;
 if(s.round){const r=s.round,validIds=new Set(pool(s,course,cards).map(c=>c.id));if(r.chapter!==s.chapter||!s.submitted.includes(s.chapter)||!Array.isArray(r.ids)||r.ids.length!==validIds.size||new Set(r.ids).size!==r.ids.length||r.ids.some(id=>!validIds.has(id))||!Array.isArray(r.answers)||r.answers.length>r.ids.length||r.answers.some(a=>typeof a!=='boolean'))return false;}
 if(s.chapterViews!==undefined){if(!s.chapterViews||typeof s.chapterViews!=='object'||Array.isArray(s.chapterViews))return false;for(const[key,v]of Object.entries(s.chapterViews)){const chapter=Number(key);if(!/^[0-3]$/.test(key)||!v||!validate({...s,chapter,section:v.section,mode:v.mode,round:v.round,chapterViews:undefined},course,cards))return false;}}
 return true;}catch{return false;}
}
return{zones,fresh,lessons,ids,learned,unlocked,enter,read,collect,deposit,seal,submit,pool,record,mistakes,review,beginAssessment,answerAssessment,finishAssessment,validate};
});
