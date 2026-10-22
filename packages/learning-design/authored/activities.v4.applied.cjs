'use strict';
// Explicit v4 activity revisions only. Knowledge, evidence and formal questions stay at reviewed v3.
const L=(zh,en)=>({zh,en});
const item=(id,zh,en)=>({id,text:L(zh,en)});
const revisions=[];
function revision(unitId,kind,title,prompt,reason,why,body){revisions.push({unitId,kind,title:L(...title),prompt:L(...prompt),reason:L(...reason),why:L(...why),body});}
const ordered=entries=>({type:'order',items:entries.map((e,i)=>item('s'+i,...e)).reverse(),expected:entries.map((_,i)=>'s'+i)});
const classified=(bins,entries)=>({type:'sort',bins:bins.map((e,i)=>item('b'+i,...e)),items:entries.map((e,i)=>({...item('i'+i,e[0],e[1]),target:'b'+e[2]}))});

revision('2.1-lesson-1','use-case-workbench',['用例任务书装配','Use-case brief workbench'],
 ['本演练按依赖完成任务书：先定位客服查制度的人员、环节和问题，再定义可观察的改善，最后比较技术能力。重排三份工作单。','Exercise dependencies: identify the support people, workflow and policy-lookup problem, then define observable improvement, then compare technical capabilities. Reorder the three work orders.'],
 ['未说明问题就选模型会把工具当目标；先明确业务问题和结果，再比较服务该目标的能力。','Choosing a model before the problem makes the tool the goal; define the problem and result before comparing capabilities.'],
 ['把用例决策改为按依赖装配任务书，检验技术选择服务目标。','Assemble a brief by dependency to test whether technology serves the objective.'],
 ordered([['记录谁在哪个流程遇到什么问题','Record who faces what problem in which workflow'],['定义可观察的改善结果','Define an observable improvement'],['比较能服务该结果的能力','Compare capabilities serving that result']]));

revision('2.1-lesson-2','option-ledger',['交付方案成本台账','Delivery-option cost ledger'],
 ['本演练只比较同一年、相同功能与合规条件下的成本，不据此单独决定购买。购买：许可20、集成10、运维15、退出准备5；自建：开发25、集成10、运维25、退出准备5。分别填写完整成本，单位均为万元。','Exercise: compare costs for the same year, functions and compliance conditions; cost alone does not decide purchasing. Buy: license 20, integration 10, operations 15, exit preparation 5. Build: development 25, integration 10, operations 25, exit preparation 5. Enter full costs in ten-thousand currency units.'],
 ['购买完整成本20+10+15+5=50；自建25+10+25+5=65。只看许可或开发会漏持续成本；还须另外核验能力、交期与条款。','Full purchase cost is 20+10+15+5=50; build cost is 25+10+25+5=65. License or development alone omits continuing costs; capabilities, deadlines and terms still need separate checks.'],
 ['用可算台账揭示只比报价的漏项，不把低价当唯一决策。','Use a calculable ledger to reveal omissions without treating price as the sole decision.'],
 {type:'number',fields:[{id:'buy',label:L('购买完整成本','Full buy cost'),expected:50},{id:'build',label:L('自建完整成本','Full build cost'),expected:65}]});

revision('2.1.1-unit-1','evidence-desk',['业务任务书证据归档','Business-brief evidence desk'],
 ['本演练收集了三张项目便笺。把现状证据、预期结果与技术选择分别归档；不能把技术名当成结果。','Three project notes were collected in this exercise. File current-state evidence, desired outcomes and technology choices separately; a technology name is not an outcome.'],
 ['现状记录提供比较基线；质量与时间的目标是可测结果；模型采购是候选手段。混淆它们就无法判断改善。','Current-state records provide the baseline; quality and time targets define measurable outcomes; model purchasing is a possible means. Confusing them prevents improvement assessment.'],
 ['从收集资料到分类任务书证据，区分问题、结果和手段。','Classify collected brief evidence to separate problems, outcomes and means.'],
 classified([['现状证据','Current-state evidence'],['预期结果','Desired outcome'],['技术候选','Technology option']],[['客服查一份制度平均需8分钟','Support needs an average of 8 minutes to locate a policy',0],['缩短查找时间且质量不下降','Reduce lookup time without lowering quality',1],['评估购买某模型服务','Evaluate a model-service purchase',2]]));

revision('2.2-lesson-5','cost-control-bench',['用量与预算计算台','Usage and budget calculation bench'],
 ['本演练当月已有质量验收通过，不得用降质省钱。固定运维40万元，调用20000次、每次10元，复核1000次、每次100元；月预算80万元。填写总成本和预算余量，单位万元。','Exercise quality acceptance has passed and may not be sacrificed for savings. Monthly fixed operations cost 40 ten-thousand units; 20,000 calls cost 10 currency units each; 1,000 reviews cost 100 each. Budget: 80 ten-thousand units. Enter total cost and remaining budget in ten-thousand units.'],
 ['调用20万元、复核10万元，加固定40共70，余量80−70=10。漏复核或混用元与万元会低估成本；优化仍要保持质量。','Calls cost 20 ten-thousand units and review 10; plus fixed 40 gives 70, leaving 80−70=10. Omitting review or mixing units understates cost; optimization must preserve quality.'],
 ['从选合格选项转为核算实际用量及复核预算，检验单位与成本边界。','Replace selection with actual usage and review budgeting, testing units and cost boundaries.'],
 {type:'number',fields:[{id:'total',label:L('当月总成本（万元）','Monthly total (ten-thousand units)'),expected:70},{id:'headroom',label:L('预算余量（万元）','Budget remaining (ten-thousand units)'),expected:10}]});

revision('2.3.3-unit-1','feedback-loop',['互补能力闭环装配','Complementary-capability feedback loop'],
 ['本演练规定维修反馈只有获授权并核验后才能进入改进；领域团队据此改流程，再观察下一轮服务结果。把这次闭环按依赖排序；不是仅采购基础模型。','Exercise policy: maintenance feedback enters improvement only after authorization and verification; domain staff adapt the workflow and then observe the next service results. Order this loop by dependency rather than only purchasing a foundation model.'],
 ['反馈先具备授权与有效性，领域经验才能把它转成流程改进，再以结果检验；只换模型不建立闭环。','Feedback must first be authorized and valid; domain expertise turns it into workflow changes, then outcomes test them. Replacing a model alone creates no learning loop.'],
 ['通过组装反馈—领域判断—流程改进—观察的依赖链展示互补能力。','Assemble feedback, domain judgment, workflow improvement and observation into a dependency chain.'],
 ordered([['取得获授权且核验的维修反馈','Obtain authorized, verified maintenance feedback'],['领域团队提出并实施流程改进','Domain team proposes and implements workflow improvements'],['观察后续结果并返回反馈环节','Observe subsequent outcomes and return to feedback']]));

revision('2.3.4-unit-1','stage-gate-register',['阶段承诺闸门修复','Staged-commitment gate register'],
 ['本演练扩展条件：质量≥95、月成本≤10万元、风险审查通过。实际质量96、成本12万元、审查通过。错误登记写成本超额0、状态scale。修复超额并填scale（扩展）或pause（暂停）。','Exercise scaling gates: quality at least 95, monthly cost at most 10 ten-thousand units, risk review passed. Actual quality 96, cost 12, review passed. The faulty register says excess cost 0 and status scale. Repair the excess and enter scale or pause.'],
 ['成本超额12−10=2，状态应pause。通过其他门不抵消成本条件，也不能事后删门槛。','Excess cost is 12−10=2 and status is pause. Passing other gates does not offset the cost gate or justify deleting it afterward.'],
 ['把阶段决策落实为可核验闸门记录，避免重复点击下一步。','Make staged decisions observable in a gate register instead of repeated next-action selection.'],
 {type:'edit',fields:[{id:'excess',label:L('月成本超额（万元）','Monthly cost excess (ten-thousand units)'),expected:2},{id:'status',label:L('扩展状态编码','Scaling status code'),expected:'pause'}]});

revision('3.2.4-unit-1','risk-change-desk',['用途变化证据分拣','Use-change evidence sorting'],
 ['本演练系统从内部草稿改为影响客户权益的建议。把观察分成“需要重评的用途/影响变化”和“本身不能维持旧结论的技术事实”。','Exercise: a system moves from internal drafts to advice affecting customer interests. Sort observations into use/impact changes requiring reassessment and technical facts that cannot themselves preserve the old conclusion.'],
 ['受影响对象和损害条件变化是重评依据；模型版本没变不能证明用途风险也没变。','Changed affected people and harm conditions require reassessment; an unchanged model version does not prove unchanged use risk.'],
 ['用证据归类区分真正风险变化与无关的技术不变。','Classify evidence to separate actual risk changes from unchanged technical facts.'],
 classified([['用途与影响变化','Use and impact changes'],['不能单独维持旧结论','Cannot preserve the old conclusion alone']],[['结果现在影响客户权益','Outputs now affect customer interests',0],['模型版本仍相同','Model version remains unchanged',1],['受影响人群由内部员工变成客户','Affected people change from internal staff to customers',0]]));

revision('3.3-lesson-1','operations-console',['运行告警单修复','Operating-alert record repair'],
 ['本演练近100次请求有12次失败。预设规则：失败率超过5%就交人工接手，状态编码为escalate，否则为observe；必要事件记录模式metadata只记受控的事件标识与版本，raw会写完整敏感原文且本题不允许。告警单错填失败率0、状态observe、日志raw。修复这三项，失败率填百分数，文本使用给定英文编码。是否另行触发紧急回退按已有预案立即处理，不以此修单为前提。','In this exercise, 12 of the last 100 requests failed. Predefined rule: above 5% failures, hand over to a person using state escalate; otherwise use observe. Required event mode metadata records only controlled event identifiers and versions; raw writes full sensitive source text and is prohibited here. The faulty alert says failure rate 0, state observe and logging raw. Repair all three fields using a numeric percentage and the given English codes. Any separately triggered urgent rollback follows the existing plan immediately; completing this record is not a prerequisite.'],
 ['失败率12÷100×100%=12%，已超过5%，状态应escalate；日志按题设选metadata而非敏感原文。只改宣传或误写低失败率会漏报；事件记录支持追踪，人工接手负责处置，修单不延迟预设紧急回退。','Failure rate is 12÷100×100%=12%, above 5%, so state is escalate. Use metadata rather than sensitive source text under the stated logging policy. Publicity or an understated rate can hide incidents; event records support tracing while people handle response. Record repair does not delay predefined urgent rollback.'],
 ['计算运行质量并修复告警与受控日志单，区别于相邻调查恢复排序及风险分类。','Calculate operating quality and repair an alert and controlled-log record, distinct from neighboring investigation/recovery ordering and risk classification.'],
 {type:'edit',fields:[{id:'failure',label:L('失败率%（原值0）','Failure rate % (was 0)'),expected:12},{id:'state',label:L('运行状态编码（原值observe）','Operating state code (was observe)'),expected:'escalate'},{id:'logging',label:L('事件记录模式（原值raw）','Event logging mode (was raw)'),expected:'metadata'}]});

revision('3.3-lesson-3','publication-review-desk',['发布风险证据分柜','Publication-risk evidence cabinets'],
 ['本演练发布生成材料前收集了三类记录。分别归入资料使用权、内容/用途风险及处置机制。完成一个柜不能替其他柜过关。','Before publishing generated material, this exercise collects three records. File them under source-use rights, content/use risk and response mechanisms. Completing one cabinet does not pass the others.'],
 ['授权证明处理资料使用条件；用途与有害内容审查处理内容风险；投诉和处置让异常可接手。不能用生成方式或过滤结果冒充授权。','Authorization concerns source-use conditions, use/content review addresses content risk, and complaints/response enable handling. Generation or filtering does not establish permission.'],
 ['将授权、内容和处置独立归档，检验控制不能相互替代。','File authorization, content and response separately to test non-substitutable controls.'],
 classified([['资料使用权','Source-use rights'],['内容与用途风险','Content and use risk'],['处置机制','Response mechanism']],[['本次输入资料允许的使用范围','Permitted uses of this input material',0],['预期发布场景及有害内容检查','Intended publication context and harmful-content checks',1],['投诉渠道和异常接手流程','Complaint channel and incident handover process',2]]));

revision('4.1.1-unit-1','readiness-evidence-desk',['准备度证据收集柜','Readiness evidence collection desk'],
 ['本演练将收集的准备度便笺归档到对应维度；这些是用途证据，不是统一认证分数。','File the collected exercise readiness notes under the matching dimensions; these are use-specific evidence, not universal certification scores.'],
 ['数据授权与可访问记录属于数据条件；值守和恢复测试属于基础设施；职责与监督记录属于治理。高自评分不能替代这些证据。','Authorization/access records concern data; support coverage and recovery tests concern infrastructure; ownership and oversight records concern governance. High self-scores do not replace evidence.'],
 ['收集后分类具体证据，避免只点击自评分或泛化准备度结论。','Classify collected concrete evidence rather than click self-scores or generic readiness claims.'],
 classified([['数据条件','Data conditions'],['基础设施','Infrastructure'],['治理','Governance']],[['所需资料获授权且可访问','Required sources are authorized and accessible',0],['故障恢复测试与值守能力记录','Recovery tests and operating support records',1],['监督责任与升级流程记录','Oversight ownership and escalation records',2]]));

revision('4.2-lesson-2','data-sharing-switchboard',['数据共享边界操作台','Data-sharing boundary switchboard'],
 ['本演练授权仅有：资料维护员可修订内容；客服可读取获准政策。其他组合均未授权。勾选且仅勾选可执行操作，不能因共享库存在而全开。','Exercise authorization only: source maintainer may revise content; support may read approved policy. All other combinations are unauthorized. Select exactly the allowed actions; a shared repository does not imply open access.'],
 ['按角色任务授予维护或读取，不把可共享等同任何人可修改；数据策略仍需明确用途和责任。','Grant maintenance or reading according to role tasks; shareability is not universal modification authority. Data strategy still needs explicit uses and ownership.'],
 ['通过矩阵操作落实共享规则，区别阅读权限与维护责任。','Operate a permissions matrix to distinguish reading access from maintenance ownership.'],
 {type:'matrix',rows:[item('maintainer','资料维护员','Source maintainer'),item('support','客服','Support')],columns:[item('revise','修订内容','Revise content'),item('read','读取获准政策','Read approved policy')],expected:['maintainer:revise','support:read']});

revision('4.3.4-unit-1','safe-practice-loop',['安全练习反馈闭环','Safe-practice feedback loop'],
 ['本演练员工报告工具不适配并担心受罚。团队规定先记录真实阻碍，再提供限定范围安全练习/支持，最后回收结果修订方案。排序这次改进路径；不要求员工暴露敏感资料。','Exercise employees report poor tool fit and fear punishment. The team first records actual blockers, then provides bounded safe practice/support, then collects results to revise the plan. Order this improvement path without requiring sensitive disclosure.'],
 ['未听取问题就追加训练可能治错原因；限定练习与反馈才能区分抵触、合理担忧和工具不适配。','Training before listening may target the wrong cause; bounded practice and feedback help distinguish resistance, justified concerns and poor fit.'],
 ['从选一句正确口号改为组装倾听—安全试验—反馈的可执行循环。','Replace slogan selection with an executable listen, safe-practice and feedback loop.'],
 ordered([['收集问题并诊断真实阻碍','Collect issues and diagnose actual blockers'],['安排限定范围安全练习与对应支持','Provide bounded safe practice and matching support'],['回收结果并修订工具或支持方案','Collect outcomes and revise tools or support']]));

revision('4.4-lesson-5','production-readiness-board',['试点转生产证据闸门','Pilot-to-production evidence gate'],
 ['本演练转生产必须同时具备值守接手、受控监测、已演练回退；项目只有演示页面和受控监测。把证据卡分为已有与待补，卡上已说明事实。','Exercise production requires operating ownership, controlled monitoring and tested fallback together. The project has only a demo and controlled monitoring. Sort the evidence cards into available and missing using their stated facts.'],
 ['受控监测已具备，但无值守和回退证据仍不能把演示当生产。必须分别补齐接手、异常处理与恢复条件。','Controlled monitoring exists, but missing ownership and fallback evidence still prevent treating the demo as production. Establish handover, response and recovery conditions separately.'],
 ['将转生产判定落实为证据闸门，避免与旁边持续价值题重复选下一步。','Make production readiness an evidence gate rather than repeat nearby next-step choices.'],
 classified([['已有证据','Available evidence'],['待补证据','Missing evidence']],[['监测已按方案启用并有记录','Controlled monitoring is enabled and recorded',0],['负责人未确认故障由谁接手','No confirmed incident handover owner',1],['回退路径只有文档尚未演练','Fallback has documentation but no drill',1]]));

revision('4.4.5-unit-1','handover-assembly',['生产交接包组装','Production handover package assembly'],
 ['本演练规定：先确认负责人及运行手册，再联合演练告警、接手与回退，验证通过才接收版本/资料持续维护。按交接依赖重排，文件复制不能单独完成交接。','Exercise dependencies: confirm owners and runbooks, jointly drill alerts, takeover and rollback, then accept ongoing version/source maintenance after validation. Reorder the handover; copying files alone is insufficient.'],
 ['演练需要已明确的接手人和操作依据；验证后仍要持续版本与资料维护。仅交模型文件会留下运行责任空白。','Drills need named owners and operating instructions; ongoing version/source maintenance remains after validation. A model file alone leaves operating accountability unassigned.'],
 ['用交接包依赖装配替代单选补项，检验准备、演练和持续维护关系。','Assemble handover dependencies instead of selecting one missing item, testing preparation, drills and ongoing maintenance.'],
 ordered([['确认负责人、运行手册与交接范围','Confirm owners, runbooks and handover scope'],['联合演练告警、接手与回退并验证','Jointly drill and validate alerts, takeover and rollback'],['接收版本变更与资料持续维护责任','Accept ongoing version-change and source-maintenance ownership']]));

const decisions=revisions.map(r=>({unitId:r.unitId,why:r.why}));
function apply(blueprint){
 for(const r of revisions){
  const spec=blueprint.units[r.unitId];if(!spec)throw Error('Missing v4 applied unit '+r.unitId);
  const title=spec.activity.title;
  spec.activity.kind=r.kind;spec.activity.title=r.title;
  spec.rationale=r.why;
  spec.activity.rounds=[{id:'apply-v4',prompt:r.prompt,reason:L(r.reason.zh+' 回看“'+title.zh+'”和本演练条件。',r.reason.en+' Revisit '+title.en+' and the stated exercise conditions.'),...structuredClone(r.body)}];
 }
 return blueprint;
}
module.exports={apply,decisions};
