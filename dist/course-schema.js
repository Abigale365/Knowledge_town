(function(root,factory){const P=typeof module==='object'?require('./learn-parser.js'):root.LearnParser;const api=factory(P);if(typeof module==='object')module.exports=api;else root.CourseSchema=api;})(typeof window==='undefined'?globalThis:window,function(P){
'use strict';
const str=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
function normalize(raw,materials=null){
 if(!raw||!Array.isArray(raw.chapters)||raw.chapters.length!==4)throw Error('课程需要恰好四个按顺序组织的章节。');
 const seen=new Set();let totalLessons=0,totalQuestions=0;
 const chapters=raw.chapters.map((ch,ci)=>{
  if(!Array.isArray(ch.sections)||!ch.sections.length||ch.sections.length>20)throw Error('每章需要1至20个小节。');
  return{id:String(ci+1),title:str(ch.title,150)||'第'+(ci+1)+'章',english:str(ch.english,180),zone:['grove','harbor','town','observatory'][ci],sections:ch.sections.map((sec,si)=>{
   const id=(ci+1)+'.'+(si+1),title=str(sec.title,150);if(!title||!Array.isArray(sec.lessons)||!sec.lessons.length||!Array.isArray(sec.questions)||!sec.questions.length)throw Error('每小节都需要标题、基础学习卡和练习题。');
   const lessons=sec.lessons.map((l,i)=>{const out={id:id+'-lesson-'+(i+1),title:str(l.title,150),body:str(l.body,4000),example:str(l.example,1500),quote:str(l.quote,4000),source:str(l.source,200)||'上传材料',skill:str(l.skill,100),category:str(l.category,150),interaction:l.interaction==='assemble'?'assemble':'read',en:l.en?{title:str(l.en.title,150),body:str(l.en.body,4000),example:str(l.en.example,1500),quote:str(l.en.quote,4000),category:str(l.en.category,150)}:undefined,references:Array.isArray(l.references)?l.references.filter(u=>typeof u==='string'&&/^https:\/\//.test(u)).slice(0,10):[],provenance:'AI整理的学习卡，请对照原文核对'};if(!out.title||!out.body||!out.quote)throw Error('学习卡缺少标题、解释或原文依据。');verifyQuote(out.quote,materials);return out;});
   const questions=sec.questions.map((q,i)=>{const c=P.card(q,'上传材料',i);if(!Array.isArray(q.wrong)||!q.wrong.length)throw Error('生成的练习题需要明确的错误候选。');verifyQuote(c.quote,materials);const key=c.q+'\n'+c.a;if(seen.has(key))throw Error('生成的课程包含重复题目，请重新生成或编辑。');seen.add(key);return{...c,en:q.en?P.card({...q.en,mode:c.mode,quote:c.quote},'Translated learning material',i):undefined,topic:'Task '+id+' · '+title};});
   totalLessons+=lessons.length;totalQuestions+=questions.length;return{id,title,english:str(sec.english,180),lessons,questions,matchRequired:true};
  })};
 });
 if(totalLessons>1000||totalQuestions>1000)throw Error('单份课程最多1000张基础卡和1000道题，请按课程拆分。');
 const title=str(raw.title,150)||'我的学习课程';return{id:'course-'+P.hash(title+JSON.stringify(chapters)),title,version:1,chapters};
}
function verifyQuote(quote,materials){if(!materials)return;const clean=x=>x.replace(/\s+/g,' ').trim();const q=clean(quote);if(q.length<6||!materials.some(m=>clean(m.text).includes(q)))throw Error('模型返回的原文引用无法在上传材料中核对，请重试或拆分材料。');}
function cards(course){return course.chapters.flatMap(ch=>ch.sections.flatMap(sec=>sec.questions||[]));}
return{normalize,cards};
});
