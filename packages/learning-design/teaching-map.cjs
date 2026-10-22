'use strict';
const C=require('../contracts');
const L=(zh,en)=>({zh,en});
const controls={
 sort:{name:L('分类操作台','Classification bench'),duty:L('把观察、职责或组件放入题面定义的类别/槽位。','Place observations, responsibilities or components into the stated categories or slots.'),action:L('收集相关资料后逐项归类，再提交全部位置。','Collect relevant information, classify each item, then submit all placements.')},
 order:{name:L('流程拼装轨道','Sequence assembly track'),duty:L('按给定依赖重建可执行步骤；不是按名称配对。','Reconstruct executable steps from the stated dependencies, rather than match names.'),action:L('阅读步骤与条件，移动步骤卡形成依赖链后提交。','Read steps and conditions, move cards into a dependency chain, then submit.')},
 choose:{name:L('情境与证据桌','Scenario and evidence desk'),duty:L('检查情境条件，选择有依据的行动或证据；非所有选项都成立。','Inspect conditions and choose supported actions or evidence; not all options are justified.'),action:L('打开情境与证据，选取题面所需项，并提交选择。','Open the scenario and evidence, select the requested items, then submit.')},
 number:{name:L('计算工作台','Calculation workbench'),duty:L('根据显式演练条件计算；保留单位与核算边界。','Calculate from explicit exercise conditions, preserving units and accounting scope.'),action:L('整理输入条件，计算并填写各数值字段后提交。','Organize inputs, calculate and fill each numeric field, then submit.')},
 matrix:{name:L('角色权限柜','Role and permission cabinet'),duty:L('按角色任务配置最小必要授权；多授和漏授均要修正。','Configure necessary role permissions; repair both extra and missing grants.'),action:L('逐角色核对每个行动或资料格，只选允许组合后提交。','Check each role/action or source cell and submit only permitted combinations.')},
 allocate:{name:L('约束资源盘','Constrained resource board'),duty:L('同时满足预算、必做项、禁止项及目标值，收益不能抵消硬约束。','Satisfy budget, mandatory work, exclusions and value targets; value cannot offset hard constraints.'),action:L('比较候选代价与条件，组合可行工作包后提交。','Compare costs and conditions, assemble a feasible work package, then submit.')},
 edit:{name:L('记录修复台','Record repair bench'),duty:L('用原文、职责或数据契约定位错误并修复，不能照信现有记录。','Locate and repair errors using sources, responsibilities or a data contract rather than trust the current record.'),action:L('对照证据与错误记录，修复字段；固定代码按题面输入。','Compare evidence with the faulty record and repair fields, using the stated fixed codes.')},
 rate:{name:L('证据刻度盘','Evidence scale'),duty:L('仅按题面定义的演练刻度评价，不当作普遍认证。','Rate only on the stated exercise scale, without treating it as universal certification.'),action:L('核对逐项证据并在给定范围输入刻度值。','Check each evidence item and enter a value within its stated range.')}
};
function concentration(plan){
 return plan.chapters.flatMap((ch,ci)=>ch.sections.map((s,si)=>{
  const counts={},sequence=s.activity.rounds.map(r=>r.type);let longest=0,run=0,previous;
  for(const type of sequence){counts[type]=(counts[type]||0)+1;run=type===previous?run+1:1;previous=type;longest=Math.max(longest,run);}
  return {sectionId:s.id,compiledSectionId:`${ci+1}.${si+1}`,kind:s.activity.kind,types:counts,sequence,longestRepeat:longest,
   dominantShare:Math.max(...Object.values(counts))/sequence.length,unitIds:s.learnUnitIds};
 }));
}
function buildTeachingMap(pack,plan){
 const planHash=C.digest(JSON.stringify(plan)),byId=new Map(pack.units.map(u=>[u.id,u]));
 const map={schemaVersion:1,format:'b-c-teaching-map',revision:4,
  binding:{knowledgePackId:pack.id,knowledgeRevision:pack.revision,knowledgeHash:C.digest(JSON.stringify(pack)),learningPlanId:plan.id,planRevision:plan.revision,planHash},
  policy:{browse:L('进入任意章节即可自由浏览本章全部知识、例子、边界和来源；不要求先完成上一小节，也不产生掌握或通关。','On entering any chapter, freely browse all its knowledge, examples, boundaries and sources without completing earlier sections. Browsing grants no mastery or completion.'),
   collection:L('收藏、收集和重新打开均可选；不以收集数量、花盆浇水或名称配对代替理解。','Bookmarking, collecting and reopening are optional; collection counts, plant watering and name matching do not establish understanding.'),
   foundations:L('必做路径先确认已读基础，再按先修提交理解操作；确认只表示学习准备，不是掌握证明。','The required path confirms foundation study before prerequisite-ordered application. Confirmation records readiness, not mastery.'),
   chapterEntry:L('四章独立进入；跨章先修在本章补学，不锁另一章。','All four chapters can be entered independently; cross-chapter prerequisites are retaught locally.'),
   practice:L('本章全部必做操作通过后才解锁正式练习；正式测验90%门槛与错题复习由现有游戏状态处理。','Unlock formal practice after all required chapter activities pass; the existing game owns the 90% exam threshold and error review.')},chapters:[]};
 for(const [ci,ch]of plan.chapters.entries()){
  const tails=new Map(ch.sections.map(s=>[s.id,`${s.id}:apply:${s.activity.rounds.at(-1).id}`]));
  const sections=ch.sections.map((s,si)=>{
   const steps=[],objects=[];let previous=s.prerequisiteSectionIds.map(id=>tails.get(id));
   for(const id of s.learnUnitIds){
    const u=byId.get(id),objectId=`${s.id}:knowledge:${id}`,stepId=`${s.id}:foundation:${id}`;
    objects.push({id:objectId,role:'knowledge-reference',unitIds:[id],name:u.title,
     duty:L('呈现定义、例子、易混边界与原文依据，随时可回看；收藏不计通关。','Show definitions, examples, distinctions and source evidence at any time; bookmarks do not count as completion.'),
     browse:'chapter-entry',collection:'optional',countsAsMastery:false,contentKeys:['explanation','examples','misconceptions','evidence'],sourceEvidence:structuredClone(u.evidence)});
    steps.push({id:stepId,stage:'foundation',unitIds:[id],objectId,requiresStepIds:[...previous],
     instruction:L(`阅读并确认“${u.title.zh}”的基础与边界，然后再进入应用；浏览可自由进行，确认仍遵守先修。`,`Study and confirm the foundations and boundaries of ${u.title.en} before application. Browsing is free; required confirmation still respects prerequisites.`),
     passRule:'opened-linked-knowledge-and-confirmed',failureFeedback:L('可继续浏览；先打开本知识卡并完成上游必做步骤，再确认本基础。','Continue browsing freely; open this knowledge card and finish upstream required steps before confirming this foundation.')});
    previous=[stepId];
   }
   for(const r of s.activity.rounds){
    const presentation=controls[r.type],stepId=`${s.id}:apply:${r.id}`,objectId=`${s.id}:operation:${r.id}`;
    const target=byId.get(r.unitIds[0]).title;
    objects.push({id:objectId,role:'required-application',unitIds:r.unitIds,control:r.type,
     name:L(target.zh+' · '+presentation.name.zh,target.en+' · '+presentation.name.en),
     duty:presentation.duty,browse:'inspect-only-when-locked',completion:'grade-success-only',roundId:r.id,
     rendererHint:r.type==='order'?'dependency-track':r.type==='sort'?'classification-or-functional-slots':'existing-control',
     lockedFeedback:L('题面可以查看，提交需先完成标出的基础和上游操作；打开窗口不解锁。','The prompt can be inspected, but submission requires the indicated foundations and earlier operations. Opening a panel does not unlock it.')});
    steps.push({id:stepId,stage:'apply',unitIds:r.unitIds,objectId,roundId:r.id,control:r.type,requiresStepIds:[...previous],
     instruction:presentation.action,prompt:r.prompt,passRule:'TaskWorkshop.grade',feedback:r.reason,
     answerLocation:`chapters[${ci}].sections[${si}].activity.rounds[${s.activity.rounds.indexOf(r)}]`});
    previous=[stepId];
   }
   return {id:s.id,compiledSectionId:`${ci+1}.${si+1}`,title:s.title,freeBrowseUnitIds:s.learnUnitIds,
    prerequisiteSectionIds:s.prerequisiteSectionIds,objects,steps,completeWhenStepIds:previous,
    downstream:L('只有必做应用全部判定通过才交付本节并推进下一节；知识收藏数量不参与。','Deliver this section and advance only after all required applications pass; bookmark counts do not participate.')};
  });
  map.chapters.push({id:ch.id,compiledChapterId:String(ci+1),title:ch.title,entryRequires:[],sections,
   freeBrowseUnitIds:[...new Set(sections.flatMap(s=>s.freeBrowseUnitIds))],
   practiceRequiresStepIds:sections.flatMap(s=>s.completeWhenStepIds),reviewRule:'after-practice-submission-regardless-of-score'});
 }
 return map;
}
module.exports={buildTeachingMap,concentration,controls};
