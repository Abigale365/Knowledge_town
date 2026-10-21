(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.StudyThemes=api;})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const themes={
 '1.1':{kind:'garden',item:'知识种子',container:'概念与词汇花房',pack:'概念种子盒',action:'收好星芽花房',art:4,device:4,instruction:'搜集知识种子，读懂每个概念的定义。收齐后正确配对概念与定义，才能让花房盛开。'},
 '1.2':{kind:'workbench',item:'方案卡',container:'AI方案工具台',pack:'方案工具盒',action:'收好方案工具盒',art:11,device:36,instruction:'把读过的方案卡放到对应工具架，比较规则与AI、代理能力，以及上线后的运行治理。',groups:['选择规则与AI','代理与编排','运行与治理'],groupMap:[0,1,2,2]},
 '1.3':{kind:'manual',item:'技术笔记',container:'生成式AI实验手册',pack:'实验手册',action:'装订本节实验手册',art:23,device:32,instruction:'把提示、上下文、RAG和微调的笔记装订成手册，先理解各自解决什么问题。'},
 '2.1':{kind:'route',item:'战略拼片',container:'战略路线沙盘',pack:'战略路线图',action:'收录战略路线图',art:22,device:32,instruction:'把业务目标、方案取舍、优先级和迁移条件铺进学习路线。这里组织的是知识顺序，不是唯一业务流程。'},
 '2.2':{kind:'ledger',item:'指标账页',container:'AI价值账本',pack:'价值账本',action:'装订价值账本',art:9,device:34,instruction:'把指标、基线、ROI和成本页分开整理，建立可比较、不过度承诺的价值核算体系。',groups:['目标与观测','基线与核算','成本控制'],groupMap:[0,1,1,0,2]},
 '2.3':{kind:'canvas',item:'价值便签',container:'竞争优势画布',pack:'商业价值画布',action:'保存商业价值画布',art:22,device:32,instruction:'用便签补齐竞争格局、业务模式、持续优势和投资条件，形成完整的价值视角。'},
 '3.1':{kind:'principles',item:'原则徽记',container:'负责任AI原则板',pack:'责任原则册',action:'收录责任原则册',art:14,device:33,instruction:'把原则、取舍、设计时治理和人工监督放在同一块原则板上，理解它们怎样共同约束业务决策。'},
 '3.2':{kind:'cabinet',item:'治理档案',container:'AI治理档案柜',pack:'治理档案册',action:'归档本节治理资料',art:35,device:38,instruction:'分柜整理责任与要求、访问权限和风险分类；理解谁负责、谁能访问、何时需要更多治理。',groups:['责任与要求','资料与权限','风险与优先级'],groupMap:[0,0,1,2]},
 '3.3':{kind:'watchboard',item:'风险标记',container:'风险监控图板',pack:'风险控制图',action:'保存风险控制图',art:39,device:39,instruction:'把生产监控、偏差、有害内容与可靠性风险放上图板，建立持续观察与处置的全貌。'},
 '4.1':{kind:'dashboard',item:'能力拼片',container:'组织准备度仪表',pack:'组织能力档案',action:'收录组织能力档案',art:33,device:34,instruction:'把准备度、成熟度、能力差距和发展路线拼进仪表，先看组织条件，再讨论大规模投入。'},
 '4.2':{kind:'foundation',item:'数据模块',container:'数据基础搭建台',pack:'数据基础蓝图',action:'收好数据基础蓝图',art:10,device:32,instruction:'连接数据准备、数据责任与基础设施模块，理解支撑AI的基础条件。'},
 '4.3':{kind:'roundtable',item:'协作名牌',container:'AI变革协作圆桌',pack:'团队协作手册',action:'记录团队协作手册',art:43,device:43,instruction:'把领导、沟通、文化与培养名牌摆上圆桌，理解不同角色如何配合，而不是只统计工具安装。',groups:['领导与责任','沟通与文化','培养与协作'],groupMap:[0,0,1,1,2,2]},
 '4.4':{kind:'journey',item:'里程碑票',container:'转型学习路线',pack:'转型阶段地图',action:'收好转型阶段地图',art:45,device:24,instruction:'按学习顺序串联迭代、短期成果、共享能力、反馈、生产和推广条件，形成可回看的转型地图。'}
};
const nicknames={'1.1':'星芽花房','1.2':'叮当百宝台','1.3':'云朵配方书','2.1':'风向旅行盘','2.2':'金松鼠账房','2.3':'奇想贴贴墙','3.1':'星光誓约板','3.2':'猫头鹰密柜','3.3':'守夜灯塔','4.1':'启航仪表盘','4.2':'积木工坊','4.3':'松果议事桌','4.4':'远山通行册'};
for(const[id,t]of Object.entries(themes)){t.subtitle=t.container;t.container=nicknames[id];t.pack=nicknames[id];t.action='收好'+nicknames[id];}
function forSection(section,isBuiltIn=false,chapter=0){if(isBuiltIn&&themes[section.id])return themes[section.id];const name=section.title||'';let key=/指标|收益|价值|成本|ROI/i.test(name)?'2.2':/权限|治理|合规/.test(name)?'3.2':/风险|监控/.test(name)?'3.3':/团队|员工|沟通|协作/.test(name)?'4.3':/提示|生成|检索|微调/.test(name)?'1.3':/策略|战略|路线/.test(name)?'2.1':['1.1','2.3','3.2','4.4'][chapter];const t={...themes[key],subtitle:section.title};delete t.groups;delete t.groupMap;return t;}
function group(theme,lesson){if(!theme.groups)return 0;const index=Number((lesson.skill||'').split('.').at(-1))-1;return theme.groupMap?.[index]??0;}
return{themes,forSection,group};
});
