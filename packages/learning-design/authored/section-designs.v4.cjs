'use strict';
// Content responsibilities, not asset IDs: C decides scene placement and art reuse.
const rows=[
 ['1.1','model-workbench','从任务证据到模型接线','From task evidence to model wiring'],
 ['1.2','modality-lab','模型结构与输入模态','Model structure and input modalities'],
 ['1.3','inference-desk','生成核验与训练推理边界','Generation checks and training/inference boundaries'],
 ['1.4','learning-router','学习方式与数据结构','Learning approaches and data structure'],
 ['1.5','validation-station','信息提取、数据质量与独立验证','Extraction, data quality and independent evaluation'],
 ['1.6','agent-workbench','统一词汇与有界工具行动','Shared vocabulary and bounded tool actions'],
 ['1.7','operations-router','代理交接、漂移与规则修复','Agent handoffs, drift and rule repair'],
 ['1.8','handoff-track','行动边界与证据交接','Action boundaries and evidence handoff'],
 ['1.9','monitoring-console','变化调查与提示任务书','Change investigation and prompt briefs'],
 ['1.10','context-calculator','上下文预算与检索流程','Context budgets and retrieval workflow'],
 ['1.11','evidence-checkpoint','提示验证与依据两道关','Prompt evaluation and two evidence gates'],
 ['1.12','adaptation-router','行为适配与动态资料更新','Behavior adaptation and changing sources'],
 ['2.1','use-case-board','问题、成本与项目门槛','Problems, costs and project gates'],
 ['2.2','feasibility-workbench','方案比选与硬性约束','Option selection and hard constraints'],
 ['2.3','continuity-desk','退出决策、回退记录与基线','Exit decisions, fallback records and baselines'],
 ['2.4','value-ledger','产能、现金与业务指标','Capacity, cash and business metrics'],
 ['2.5','cost-evidence-board','完整成本与归因证据','Full costs and attribution evidence'],
 ['2.6','roi-track','ROI核算与业务转型','ROI accounting and business transformation'],
 ['2.7','strategy-lab','优势证据与价值交付','Advantage evidence and value delivery'],
 ['2.8','commitment-desk','学习闭环与分阶段承诺','Learning loops and staged commitments'],
 ['3.1','impact-board','责任原则、群体影响与约束','Responsibility, group impacts and constraints'],
 ['3.2','oversight-gates','设计保障、监督授权与取舍','Design safeguards, oversight and trade-offs'],
 ['3.3','risk-review-desk','用途审查与监督接手','Use review and oversight handover'],
 ['3.4','permissions-cabinet','资料权限、责任矩阵与适用要求','Data permissions, role matrices and requirements'],
 ['3.5','incident-track','检索边界、风险与持续处置','Retrieval boundaries, risks and ongoing response'],
 ['3.6','reliability-lab','内容权利、事故与偏差调查','Content rights, incidents and bias investigation'],
 ['3.7','source-repair-desk','来源授权与不确定结论修复','Source rights and uncertain-claim repair'],
 ['4.1','readiness-board','准备度证据与投入顺序','Readiness evidence and investment order'],
 ['4.2','capability-workbench','能力证据、缺口与里程碑','Capability evidence, gaps and milestones'],
 ['4.3','data-contract-desk','资料条件与记录规范化','Data conditions and record normalization'],
 ['4.4','ownership-board','资料维护、工作负载与团队职责','Source maintenance, workloads and team roles'],
 ['4.5','communication-permissions','透明沟通、安全试验与监督权限','Communication, safe practice and oversight'],
 ['4.6','responsibility-router','人机分工与正式责任','Human/AI division and formal accountability'],
 ['4.7','support-evidence-desk','反馈支持与无依据结论修复','Feedback support and unsupported-claim repair'],
 ['4.8','transformation-track','岗位判断与阶段扩展','Role judgment and staged expansion'],
 ['4.9','production-gates','共享支持、反馈与生产接手','Shared support, feedback and production handover'],
 ['4.10','rollout-workbench','企业扩展、迁移与业务责任','Enterprise rollout, transfer and business ownership'],
 ['4.11','sustainable-operations','持续价值与运营扩展','Sustained value and operating expansion']
];
const sections=Object.fromEntries(rows.map(([compiledId,kind,zh,en])=>[compiledId,{kind,title:{zh,en}}]));
function decorate(plan){for(const [ci,ch]of plan.chapters.entries())for(const [si,s]of ch.sections.entries()){
 const config=sections[`${ci+1}.${si+1}`];if(!config)throw Error('Missing explicit section responsibility');
 s.title=structuredClone(config.title);s.activity.title=structuredClone(config.title);s.activity.kind=config.kind;
}return plan;}
module.exports={sections,decorate};
