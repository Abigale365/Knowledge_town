'use strict';
const {base,list,unique,record,isId,text,localized,refs,diagnostic}=require('./core.cjs'),Workshop=require('../runtime/task-workshop-engine.js');
const normalized=x=>typeof x==='string'?x.replace(/\u0000/g,'').trim():'';
function questionLanguage(q){if(!record(q)||!text(q.q)||q.q.trim().length<3||q.q.length>500||!text(q.a)||q.a.length>1500||!Array.isArray(q.wrong)||!q.wrong.length||q.wrong.length>4)return false;const choices=q.wrong.map(normalized);return q.wrong.every(x=>text(x)&&x.length<=1500)&&choices.every(x=>x&&x!==normalized(q.a))&&new Set(choices).size===choices.length;}
function validateLearningPlan(pack,plan){
 const out=base(plan,'plan');if(!record(pack)||!Array.isArray(pack.units))out.push(diagnostic('plan.knowledge','plan','需要有效知识包'));
 if(plan?.knowledgePackId!==pack?.id||plan?.knowledgeRevision!==pack?.revision)out.push(diagnostic('plan.stale','plan','学习方案与知识包版本不一致'));
 if(!localized(plan?.title))out.push(diagnostic('plan.title','plan.title','需要中英文课程标题'));
 const chapters=list(plan?.chapters),units=new Map(list(pack?.units).filter(record).map(u=>[u.id,u]));
 const allSections=chapters.filter(record).flatMap(ch=>list(ch.sections)),allQuestions=allSections.filter(record).flatMap(s=>list(s.questions));
 const seenUnits=new Set(),allTypes=new Set(),questionText=new Set();
 if(chapters.length!==4)out.push(diagnostic('plan.chapters','plan.chapters','当前游戏要求恰好四章'));
 unique(chapters,'plan.chapters',out);unique(allSections,'plan.sections',out);unique(allQuestions,'plan.questions',out);
 if(allQuestions.length>1000||allSections.filter(record).reduce((n,s)=>n+list(s.learnUnitIds).length,0)>1000)out.push(diagnostic('plan.limit','plan','一门课程最多1000份学习卡和1000题'));
 for(const [ci,ch]of chapters.entries()){
  const cp='plan.chapters['+ci+']';if(!record(ch)||!localized(ch.title)||!list(ch.sections).length||ch.sections.length>20){out.push(diagnostic('plan.chapter',cp,'章节需双语标题和1至20个小节'));continue;}
  const chapterUnits=new Set(),seenSections=new Set();
  for(const [si,s]of ch.sections.entries()){
   const p=cp+'.sections['+si+']';if(!record(s)){out.push(diagnostic('shape',p,'小节必须是对象'));continue;}
   const ids=list(s.learnUnitIds),allowed=new Set(ids);
   if(!localized(s.title)||!refs(s.learnUnitIds)||!ids.length||ids.some(id=>!units.has(id)))out.push(diagnostic('plan.units',p,'小节需双语标题和有效且唯一的知识引用'));
   if(!refs(s.prerequisiteSectionIds)||s.prerequisiteSectionIds.some(id=>!seenSections.has(id)))out.push(diagnostic('plan.section-order',p,'小节只允许依赖本章先前小节'));
   for(const id of ids){for(const req of list(units.get(id)?.prerequisiteIds))if(!chapterUnits.has(req))out.push(diagnostic('plan.unit-order',p,'先修知识必须在本章更早学习：'+req));chapterUnits.add(id);seenUnits.add(id);}
   const activity=s.activity,covered=new Set();
   if(!record(activity)||!Array.isArray(activity.rounds))out.push(diagnostic('plan.activity',p+'.activity','缺少可执行交互'));
   else{
    const projected={...activity,rounds:activity.rounds.filter(record).map(r=>({...r,skills:list(r.unitIds)}))};
    if(projected.rounds.length!==activity.rounds.length||!Workshop.validPlan(projected))out.push(diagnostic('plan.activity',p+'.activity','交互无法执行或缺少中英文判定依据'));
    for(const [ri,r]of activity.rounds.entries()){
     if(!record(r)){out.push(diagnostic('shape',p+'.activity.rounds['+ri+']','轮次必须是对象'));continue;}
     allTypes.add(r.type);if(!refs(r.unitIds)||!r.unitIds.length||r.unitIds.some(id=>!allowed.has(id)))out.push(diagnostic('plan.activity-links',p+'.activity','活动只能引用本节知识'));
     list(r.unitIds).forEach(id=>covered.add(id));
    }
   }
   if(ids.some(id=>!covered.has(id)))out.push(diagnostic('plan.activity-coverage',p,'部分知识没有理解检查'));
   if(!list(s.questions).length)out.push(diagnostic('plan.questions',p,'需提供正式练习'));
   for(const [qi,q]of list(s.questions).entries()){
    const qp=p+'.questions['+qi+']',links=list(q?.unitIds);
    if(!record(q)||!isId(q.id)||q.mode!=='scenario'||!questionLanguage(q)||!questionLanguage(q.en)||list(q.en?.wrong).length!==list(q.wrong).length||!refs(q.unitIds)||!links.length||links.some(id=>!allowed.has(id)))out.push(diagnostic('plan.question',qp,'需唯一ID、scenario题型、有效双语选项和知识引用'));
    if(record(q))for(const lang of [q,q.en])if(record(lang)&&text(lang.q)&&text(lang.a)){const key=lang.q.trim()+'\n'+lang.a.trim();if(questionText.has(key))out.push(diagnostic('plan.question-duplicate',qp,'中英文题目与答案组合不能重复'));questionText.add(key);}
    if(!text(q?.quote)||q.quote.length<6||!links.some(id=>list(units.get(id)?.evidence).some(e=>text(e?.quote)&&e.quote.includes(q.quote))))out.push(diagnostic('plan.question-evidence',qp,'题目引用必须来自其关联知识依据'));
   }
   seenSections.add(s.id);
  }
 }
 if([...units.keys()].some(id=>!seenUnits.has(id)))out.push(diagnostic('plan.coverage','plan.chapters','方案遗漏知识单元'));
 if(allTypes.size<3)out.push(diagnostic('plan.diversity','plan.chapters','整门课程至少使用三类操作'));return out;
}
module.exports={validateLearningPlan};
