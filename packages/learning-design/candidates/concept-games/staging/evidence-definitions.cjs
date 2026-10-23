'use strict';
// Exercise facts below are fictional conditions, not new source knowledge.
const L=(zh,en)=>({zh,en});
const E=(id,zh,en)=>({id,text:L(zh,en)});
const C=(id,zh,en,expected,evidenceIds,fzh,fen)=>({id,text:L(zh,en),expected,evidenceIds,feedback:L(fzh,fen)});
const options=[{id:'supported',text:L('证据支持','Supported')},{id:'refuted',text:L('证据反驳','Refuted')},{id:'unknown',text:L('现有证据不足','Insufficient evidence')}];
function board(n,name,en,goal,egoal,evidence,claims){return {id:'evidence-'+n,sourceUnitId:'1.1-lesson-'+n,kind:'evidence-board',title:L(name,en),goal:L(goal,egoal),instructions:L('以下是虚构演练记录。先逐张检查证据，再判断每条说法并选择支撑判断的记录；记录未提供的信息不能补猜。','These are fictional exercise records. Inspect each evidence card, judge each claim, and select records supporting your judgment. Do not invent missing information.'),boundary:L('订正可完成本物件练习，不代表正式测验独立掌握。演练结果只适用于给出的记录。','Corrections can complete this object exercise; this does not establish independent formal mastery. Conclusions apply only to the supplied records.'),config:{evidence,claims,verdictOptions:options}};}
const definitions=[
board(6,'自动化采购审查','Automation procurement review','区分固定规则的自动化与从样本学习的证据。','Distinguish fixed-rule automation from evidence of learning from examples.',[
E('timer','门厅灯每天18点打开；程序只执行人工写定的时间表。','Lobby lights switch on at 18:00 daily; the program only follows a manually written schedule.'),
E('speech','访客终端从录音识别说出的房间名；说明未披露实现方法。','A visitor terminal recognizes spoken room names from recordings; its implementation is not disclosed.'),
E('pitch','供应商把两个产品都称作“AI升级”，没有提供训练记录。','The vendor calls both products “AI upgrades” and supplies no training records.')],[
C('all-ml','这些记录证明两个产品都从数据学习。','These records prove that both products learn from data.','refuted',['timer'],'灯的行为来自人工时间表；自动执行并不能证明从数据学习。','The light follows a manually written schedule; automatic execution does not establish learning from data.'),
C('speech-method','可以确认语音终端使用机器学习。','We can confirm that the speech terminal uses machine learning.','unknown',['speech'],'语音识别是智能相关任务，但这份记录没有给出实现或学习证据。','Speech recognition is associated with intelligence, but this record provides no implementation or learning evidence.')]),
board(7,'学习过程取证','Learning-process investigation','依据过程记录判断模型是否从数据学习，不只看产品名称。','Use process evidence to judge data-driven learning rather than product names.',[
E('fit','调度器甲读入已核验的历史行程，程序通过这些样本调整预测参数。','Scheduler A reads verified historical journeys and adjusts prediction parameters using those examples.'),
E('rule','调度器乙按人工维护的路线表逐项查找，不使用样本调整规则。','Scheduler B looks up a manually maintained route table; examples do not adjust its rules.'),
E('eval','甲尚未提供面向新线路的独立评估记录。','A has not supplied an independent evaluation on new routes.')],[
C('learned','甲有从数据学习的过程证据。','A has process evidence of learning from data.','supported',['fit'],'样本参与参数调整，体现了数据学习过程。','Examples participate in parameter adjustment, which is evidence of learning from data.'),
C('suitable','仅凭学习记录就能确认甲适合新线路。','The learning record alone establishes that A is suitable for new routes.','unknown',['eval'],'已经学习不等于适用；新线路表现尚未检验。','Having learned does not establish suitability; new-route performance remains untested.'),
C('lookup','乙的查表过程证明它通过样本学习。','B’s lookup process establishes learning from examples.','refuted',['rule'],'记录明确说表由人维护，样本不调整规则。','The table is maintained by people and examples do not adjust its rules.')]),
board(8,'生成稿的事实核对','Checking a generated draft','用原文检查生成内容，区分语言流畅与事实支持。','Check generated content against source text and distinguish fluency from factual support.',[
E('source','工作室原始通知：周三开放体验，需预约；尚未确定下一次日期。','Original studio notice: Wednesday trial sessions require booking; the next date is not yet decided.'),
E('draft','生成稿：周三无需预约即可体验，之后每周三固定开放。文字通顺。','Generated draft: walk in without booking on Wednesday; sessions then run every Wednesday. The prose is fluent.'),
E('workflow','负责人还没有对照原通知复核此稿。','The responsible person has not checked this draft against the original notice.')],[
C('booking','生成稿的预约说明得到原通知支持。','The draft’s booking instruction is supported by the original notice.','refuted',['source','draft'],'原通知要求预约，生成稿却说无需预约；通顺没有消除这个冲突。','The original requires booking while the draft says none is needed; fluency does not remove that conflict.'),
C('schedule','可以直接把“每周三开放”作为已经核验的安排。','“Every Wednesday” can be treated as a verified schedule.','refuted',['source','draft'],'原通知明确下一次日期未定，不能将生成稿的补写当核验结果。','The original explicitly leaves the next date undecided; the draft’s addition is not verification.'),
C('cost','目前已知此类稿件每份需要几分钟复核。','The review time per draft is known.','unknown',['workflow'],'记录只说明尚未复核，没有测量复核时间。','The record states that review has not happened; it does not measure review time.')]),
board(12,'跨环境表现调查','Cross-environment performance inquiry','识别未见样本证据与环境变化的边界。','Identify evidence on unseen cases and the limits imposed by changed conditions.',[
E('past','仓库模型用冬季室内货架照片训练；训练照片识别良好。','A warehouse model was trained on winter indoor-shelf photographs and performs well on those training images.'),
E('heldout','另留未参与学习的冬季室内照片，模型在其上也表现良好。','Separate winter indoor photographs were kept out of learning; performance on them is also good.'),
E('future','新仓库采用室外装卸区，光照与拍摄角度改变，尚未评估。','The new warehouse uses outdoor loading areas with changed lighting and camera angles; these have not been evaluated.')],[
C('unseen','有证据说明模型处理过未参与学习的冬季室内样本。','There is evidence of performance on winter indoor examples not used for learning.','supported',['heldout'],'独立保留的数据提供未见样本证据，但范围仍是冬季室内条件。','Held-out data provides unseen-example evidence, within winter indoor conditions.'),
C('outdoor','可以确认模型在新室外仓库仍表现良好。','We can confirm good performance in the new outdoor warehouse.','unknown',['future'],'光照与角度变化且未评估，旧条件表现不能补足这段证据。','Lighting and angles changed and remain unevaluated; old-condition results do not fill that gap.')]),
board(13,'评估数据血缘追踪','Tracing evaluation data lineage','检查评估样本是否真正独立于学习过程。','Check whether evaluation examples are genuinely independent of learning.',[
E('a','实验甲：80张标注图用于学习；另20张的图像和答案始终隔离，模型固定后才评分。','Experiment A: 80 labeled images are used for learning; another 20 images and their answers remain isolated until scoring after the model is fixed.'),
E('b','实验乙：先查看评分集答案并据此调整参数，再报告同一评分集成绩。','Experiment B: scoring-set answers are inspected to adjust parameters, then the same scoring set is reported.'),
E('scope','两组记录没有提供上线环境数据。','Neither experiment supplies deployment-environment data.')],[
C('independent','甲提供了独立于这次学习的评估记录。','A provides evaluation evidence independent of this learning process.','supported',['a'],'保留集及答案未用于学习，符合此记录中的独立性条件。','The held-out examples and answers were not used for learning, satisfying independence in this record.'),
C('b-independent','乙报告的成绩仍可视为未见样本检验。','B’s reported score still counts as an unseen-example test.','refuted',['b'],'评分答案已经影响参数，这组样本不再独立于学习。','Scoring answers already influenced parameters, so these examples are no longer independent of learning.'),
C('deployment','甲的记录足以确认所有上线环境的表现。','A’s record establishes performance in every deployment environment.','unknown',['scope'],'独立评估不自动覆盖未提供的上线环境。','An independent evaluation does not automatically cover deployment environments absent from the evidence.')]),
board(14,'团队术语会议记录','Team terminology meeting','识别共同词汇解决了什么、仍未解决什么。','Identify what shared terminology resolves and what it does not.',[
E('before','会议甲说“完成学习”指参数拟合结束；会议乙用同一句话指用户已经熟练使用产品。','Team A uses “learning complete” for parameter fitting; team B uses the same phrase for users becoming proficient with the product.'),
E('glossary','双方随后写明两种含义，并规定进度报告分别描述模型学习与用户学习。','They document both meanings and require progress reports to distinguish model learning from user learning.'),
E('missing','此次会议没有提供模型评估或用户操作测试结果。','The meeting supplies neither model evaluation nor user-operation test results.')],[
C('ambiguity','原来的进度报告存在词义混淆。','The original progress report contains a terminology ambiguity.','supported',['before'],'同一句话指两个不同过程，不能据此判断同一进度。','The phrase refers to two different processes and cannot establish one shared progress state.'),
C('fix','新约定为后续报告提供了共同解释。','The new agreement supplies shared interpretations for later reports.','supported',['glossary'],'明确区分词义能帮助协作，但仍需报告对应的实际证据。','Separating meanings supports coordination, while reports still need evidence of actual progress.'),
C('quality','此次词汇统一证明模型质量已达到目标。','The terminology agreement establishes that model quality has met its target.','unknown',['missing'],'没有评估结果，词汇统一不能替代质量证据。','No evaluation result is provided; shared terminology cannot replace quality evidence.')]),
board(15,'框架资料用途审查','Reviewing framework information use','把框架用途与具体要求、合规或质量证明分开。','Separate framework scope from specific requirements and compliance or quality evidence.',[
E('framework','项目资料夹甲：需要为“使用机器学习的AI系统”统一概念框架；资料摘要指向ISO/IEC 23053。','Project folder A needs a shared conceptual framework for AI systems using ML; its summary points to ISO/IEC 23053.'),
E('management','资料夹乙讨论组织AI管理体系的建立、维护和持续改进；摘要指向ISO/IEC 42001。','Folder B concerns establishing, maintaining and continually improving an organizational AI management system; its summary points to ISO/IEC 42001.'),
E('limits','资料夹只有用途摘要，没有正式标准条文、组织实施记录或模型评估。','The folders contain scope summaries, not formal clauses, organizational implementation records or model evaluations.')],[
C('different','甲与乙的资料关注层次不同，不能仅因都提AI就当作同一用途。','A and B address different scopes and cannot be treated as interchangeable merely because both mention AI.','supported',['framework','management'],'甲聚焦使用ML的系统概念框架，乙聚焦组织管理体系。','A concerns an ML-system conceptual framework; B concerns organizational management systems.'),
C('compliance','这些摘要已经证明组织满足具体标准要求。','These summaries establish that the organization meets specific standard requirements.','unknown',['limits'],'没有正式要求与实施证据，不能从资料名称推出符合性。','Without formal requirements and implementation evidence, document names do not establish conformity.'),
C('accuracy','可以从现有资料确认模型零错误。','The supplied material establishes an error-free model.','unknown',['limits'],'没有模型评估；管理或概念框架的用途摘要不是零错误证明。','There is no model evaluation; a management or conceptual-framework summary is not proof of zero errors.')]),
board(16,'深层结构证据台','Inspecting deep-structure evidence','根据架构和学习记录识别深度学习，保留缺失证据的不确定性。','Use architecture and learning records to identify deep learning while preserving uncertainty.',[
E('x','模型甲的结构记录列出相连的多层计算节点；训练日志显示各层权重随样本学习表示。','Model A’s architecture lists connected computational nodes across multiple layers; training logs show layer weights learning representations from examples.'),
E('y','系统乙的宣传只说“深度洞察”，技术结构和学习方式均未披露。','System B’s advertising says “deep insights”; its architecture and learning method are undisclosed.'),
E('z','程序丙只有三层人工审批步骤，没有模型权重或数据学习过程。','Program C has three stages of human approval, with no model weights or data-learning process.')],[
C('a-dl','甲的记录支持使用深度学习方法。','A’s records support identifying a deep-learning approach.','supported',['x'],'多层神经计算结构与学习表示的记录同时存在。','Both a multilayer neural computation structure and representation-learning records are present.'),
C('b-dl','可以确认乙也是深度学习。','B can also be confirmed as deep learning.','unknown',['y'],'宣传用语没有给出神经网络层次与学习过程。','Advertising language supplies neither neural-network layers nor learning-process evidence.'),
C('c-dl','丙的三层审批就是多层神经网络。','C’s three approval stages are a multilayer neural network.','refuted',['z'],'业务步骤的层级不是相连神经节点与可学习权重。','Business-process stages are not connected neural nodes with learnable weights.')]),
board(17,'网络结构核验','Network structure verification','从连接、层间计算与可学习权重辨认神经网络证据。','Recognize neural-network evidence through connections, layer computations and learnable weights.',[
E('network','原型甲：输入数值经过相连计算节点传递；节点间带权重，样本学习会调整权重。','Prototype A passes numeric inputs through connected computational nodes; connections carry weights adjusted through learning from examples.'),
E('flow','图乙把“填表→审核→归档”画成三个框；箭头只表示工作交接，没有数值权重。','Diagram B has three boxes: fill form, review, archive. Arrows indicate work handoffs and have no numeric weights.'),
E('depth','甲的记录没有列出完整层数，也没有独立性能评估。','A’s records do not specify the complete layer count or an independent performance evaluation.')],[
C('neural','甲提供了神经网络结构与学习的证据。','A provides evidence of a neural-network structure and learning.','supported',['network'],'相连计算节点与可学习权重是本次判断的依据，不是图形外观。','Connected computational nodes and learnable weights support this judgment, rather than the visual appearance of a diagram.'),
C('flow-neural','乙只要有节点和箭头就可确认为神经网络。','B can be confirmed as a neural network simply because it has nodes and arrows.','refuted',['flow'],'乙是工作交接图，缺少所述神经计算与可学习权重。','B is a work-handoff diagram, without the described neural computation and learnable weights.'),
C('depth-known','现有记录足以确认甲使用深度学习。','The supplied records establish that A uses deep learning.','unknown',['depth'],'没有完整层次信息，不能只从“神经网络”进一步推断深度学习。','Without complete layer information, “neural network” alone does not establish deep learning.')])
];
module.exports={definitions};
