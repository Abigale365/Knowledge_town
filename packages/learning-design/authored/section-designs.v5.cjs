'use strict';
function decorate(plan,audits){
 require('./section-designs.v4.cjs').decorate(plan);
 const byId=new Map(audits.map(a=>[a.unitId,a]));
 const first=plan.chapters[0].sections[0];first.title={zh:'认识业务数据、模型结果与行动',en:'Distinguish business data, model results and actions'};first.activity.title=structuredClone(first.title);
 for(const ch of plan.chapters)for(const s of ch.sections)s.activity.brief={
  zh:'本节目标：'+s.learnUnitIds.map(id=>byId.get(id).learnerGoal.zh).join('；')+'。先看推理示范、尝试有提示的练习，再做下面的新情境应用。知识始终可回看；示范、收藏或基础确认不代表理解通过。',
  en:'Goals: '+s.learnUnitIds.map(id=>byId.get(id).learnerGoal.en).join('; ')+'. Study worked reasoning, try guided practice, then complete these new-situation applications. Knowledge remains available; examples, favorites and foundation confirmation do not establish understanding.'};
 return plan;
}
module.exports={decorate};
