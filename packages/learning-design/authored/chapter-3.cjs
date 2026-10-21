'use strict';

// Authored cases: all roles, thresholds and scores below are exercise conditions,
// never claims about legal obligations or universal risk scoring.
const pack = require('../../knowledge/generated/knowledge.v1.json');
const L = (zh, en) => ({zh, en});
const item = (id, zh, en) => ({id, text:L(zh,en)});
const units = {};
function add(id, rationale, misconception, prompt, reason, shape, question) {
  const source = pack.units.find(u => u.id === id);
  if (!source) throw new Error(`Unknown authored unit ${id}`);
  const feedback = L(`${reason.zh} 常见错误：${misconception.zh} 回看《${source.title.zh}》。`, `${reason.en} Common error: ${misconception.en} Review “${source.title.en}”.`);
  units[id] = {
    rationale, misconception,
    activity:{version:1,kind:'governance-lab',title:L(`${source.title.zh}：决策演练`,`${source.title.en}: decision lab`),
      brief:L('先阅读本单元，再按题面给定条件操作；角色、数值及流程约束仅用于教材演练，不构成外部法律判断。','Read this unit first, then apply the stated case conditions. Roles, values and workflow constraints are exercise assumptions, not external legal determinations.'),
      rounds:[{id:'decision',prompt,reason:feedback,...shape}]},
    questions:[{q:question[0],a:question[1],wrong:question[2],en:{q:question[3],a:question[4],wrong:question[5]},quote:source.evidence[0].quote,mode:'scenario'}]
  };
}
const choose = (options,expected) => ({type:'choose', options:options.map((x,i)=>item(`o${i+1}`,...x)),expected:expected.map(n=>`o${n}`)});
const order = entries => ({type:'order',items:entries.map((x,i)=>item(`s${i+1}`,...x)),expected:entries.map((_,i)=>`s${i+1}`)});
const sort = (bins, entries) => ({type:'sort',bins:bins.map((x,i)=>item(`b${i+1}`,...x)),items:entries.map((x,i)=>({...item(`i${i+1}`,x[0],x[1]),target:`b${x[2]}`}))});
const matrix = (rows,columns,expected) => ({type:'matrix',rows:rows.map((x,i)=>item(`r${i+1}`,...x)),columns:columns.map((x,i)=>item(`c${i+1}`,...x)),expected});

add('3.1-lesson-1',L('把责任原则转成可检查的控制，检验能否从宣言迁移到行动。','Translate principles into observable controls to test transfer from slogans to action.'),L('有原则海报就等于已治理。','A principles poster is treated as implemented governance.'),
 L('团队只有一张责任原则海报。选择所有能产生实际评估或控制证据的补充工作。','The team has only a principles poster. Select every addition that produces actual assessment or control evidence.'),
 L('分组差错评估和异常条件测试让原则进入实际验证；仅改宣传措辞不能证明控制有效。','Subgroup error assessment and abnormal-condition tests operationalize principles; promotional wording does not demonstrate effective controls.'),
 choose([['记录相关群体的差错并评审','Record and review errors for relevant groups'],['在异常输入下测试并记录结果','Test abnormal inputs and record results'],['把海报换成更醒目的颜色','Change the poster to brighter colors']],[1,2]),
 ['团队声称遵循稳健性原则，哪项证据最直接支持此声明？','异常条件测试记录',['更大的海报','模型回答很自信'],'What most directly supports a team’s robustness claim?','Recorded abnormal-condition tests',['A larger poster','Confident model wording']]);

add('3.1-lesson-2',L('在硬约束下配置资源，体验收益不能自动压倒责任要求。','Allocate resources under explicit constraints to experience why benefits do not override responsibility requirements.'),L('以最高效率替代对影响和责任的说明。','Maximum efficiency replaces explanation of impact and ownership.'),
 L('演练给定：预算3；必须做影响记录和责任确认；总控制值至少3。选择满足全部约束的工作包。分值只用于本题。','Exercise: budget 3; impact recording and owner confirmation are mandatory; total control value must reach 3. Select a feasible package. Scores apply only here.'),
 L('影响记录和责任确认各占1预算，风险控制占1，恰好达到3；纯加速项不满足责任硬约束。取舍需记录理由。','Impact recording, owner confirmation and risk control each cost 1 and jointly reach 3. Acceleration alone misses mandatory responsibility constraints. Record the trade-off rationale.'),
 {type:'allocate',budget:3,minimumValue:3,required:['impact','owner'],items:[{...item('impact','记录影响：成本1，控制值1','Record impact: cost 1, control value 1'),cost:1,value:1},{...item('owner','确认决策责任：成本1，控制值1','Confirm decision owner: cost 1, control value 1'),cost:1,value:1},{...item('control','风险相称控制：成本1，控制值1','Proportionate control: cost 1, control value 1'),cost:1,value:1},{...item('speed','仅提速：成本3，控制值0','Acceleration only: cost 3, control value 0'),cost:3,value:0}]},
 ['在效率与责任冲突的评审中，哪份记录更完整？','影响、约束、责任人及取舍理由',['仅记录节省的时间','只说所有人已同意'],'Which trade-off review record is more complete?','Impacts, constraints, decision owner and rationale',['Only time saved','Only that everyone agreed']]);

add('3.1-lesson-3',L('通过项目门序把治理放到设计前段。','Use project gates to place governance early in design.'),L('上线后补监督与验证即可。','Oversight and validation can simply be added after launch.'),
 L('演练项目规定：先确定用途与责任，再设计验证和监督，通过验证后才上线。按这三道门排序。','Case policy: establish use and ownership, design evaluation and oversight, then deploy only after validation. Order these three gates.'),
 L('用途与责任约束验证和监督设计；通过这些验证才进入发布。把治理留到上线后会错过设计阶段的控制机会。','Use and ownership guide evaluation and oversight; deployment follows successful validation. Delaying governance misses design-stage controls.'),
 order([['确定数据用途与责任','Define data use and ownership'],['设计监督并完成验证','Design oversight and complete validation'],['通过验证后上线','Deploy after validation passes']]),
 ['项目还在功能设计阶段，何时确定数据用途和监督责任？','现在纳入设计并验证',['等上线发生事故后','等所有功能完成且不再变更时'],'When should a project in feature design define data use and oversight ownership?','Include them now in design and validation',['After a production incident','After every feature is frozen']]);

add('3.1-lesson-4',L('给定授权边界，让学习者操作停止与接手权限。','Operate stop and takeover permissions under explicit authority boundaries.'),L('模型自信表达等于正式授权。','Confident model language counts as formal authorization.'),
 L('演练授权：监控员可暂停自动行动；审批员可决定恢复；模型无任何授权。勾选且仅勾选获授权的组合。','Exercise authority: monitor may pause automation; approver may authorize resumption; model has no authority. Select exactly the authorized combinations.'),
 L('停止与恢复是不同授权，按给定角色分配；模型无论措辞多自信都不能自行获得权限。','Stopping and resumption are separate authorizations assigned by the case; confidence does not grant the model authority.'),
 matrix([['监控员','Monitor'],['审批员','Approver'],['模型','Model']],[['暂停','Pause'],['批准恢复','Approve resumption']],['r1:c1','r2:c2']),
 ['演练中模型说“我确信可以恢复”，但只有审批员有恢复权限。应该怎么做？','交审批员决定是否恢复',['接受模型自信声明并恢复','让模型自行签署授权'],'The model says it is certain resumption is safe, but only the approver may authorize it. What should happen?','Ask the approver to decide resumption',['Resume based on confidence','Let the model grant itself authority']]);

add('3.1.1-unit-1',L('从总体指标中找出缺失的群体证据。','Detect missing group evidence behind an aggregate metric.'),L('总体平均优秀足以证明公平。','A strong overall average proves fairness.'),
 L('演练：总体错误率5%，但未按受影响群体统计。选择所有必要的下一步；本题不设普遍公平阈值。','Exercise: overall error rate is 5%, with no breakdown for affected groups. Select all necessary next steps; no universal fairness threshold is given.'),
 L('需要识别相关群体、比较差错和影响，并讨论取舍；一个总体均值不能给出群体分布。','Identify relevant groups, compare errors and impacts, and discuss trade-offs; an aggregate average cannot reveal group distributions.'),
 choose([['结合用途识别相关群体','Identify relevant groups for the use'],['比较群体差错、机会和影响','Compare group errors, opportunities and impacts'],['直接宣布不存在公平性问题','Declare no fairness issue immediately']],[1,2]),
 ['两组错误差异很大，但总体指标达标。合理结论是什么？','仍需结合用途评估群体影响与取舍',['总体达标即证明公平','只看样本最多的一组'],'Group errors differ substantially while the overall target is met. What follows?','Assess group impacts and trade-offs for the use case',['Overall success proves fairness','Examine only the largest group']]);

add('3.1.1-unit-2',L('将用户可知情选择与理解判断依据区分开。','Distinguish informed choice from understanding a decision basis.'),L('披露AI参与等同于解释每次判断。','Disclosing AI involvement explains each decision.'),
 L('给交付物分类：解释判断依据放入可说明性；披露AI参与及边界放入透明度。','Classify deliverables: decision-basis explanations support explainability; disclosure of AI involvement and limits supports transparency.'),
 L('依据说明帮助理解行为；参与和限制披露帮助知情选择，两者不能互相替代。','Explaining the basis supports understanding behavior; disclosing participation and limits supports informed choice. Neither substitutes for the other.'),
 sort([['可说明性','Explainability'],['透明度','Transparency']],[['说明本次建议使用哪些判断依据','Explain the basis of this recommendation',1],['告知用户AI参与及重要限制','Tell users about AI participation and key limits',2]]),
 ['页面只写“本服务使用AI”，还缺什么才能帮助理解一次建议？','解释该次建议的判断依据',['把AI提示字体放大','隐去适用边界'],'A page only says the service uses AI. What helps users understand a particular recommendation?','Explain the basis of that recommendation',['Enlarge the AI notice','Hide the usage boundaries']]);

add('3.1.1-unit-3',L('依据控制目的而不是技术名称定位责任缺口。','Locate control gaps by purpose rather than technology names.'),L('有访问密码就解决所有隐私和稳健性问题。','A password resolves privacy and robustness too.'),
 L('将三个独立检查路由到最直接的目的；这里按题面关注点分类。','Route three checks by their most direct purpose, using the stated focus.'),
 L('资料用途关注隐私，阻止未授权访问关注安全，变化条件下表现关注稳健性。控制可能互补，但目的有区别。','Appropriate data use concerns privacy, unauthorized access concerns security, and behavior under change concerns robustness. Controls can complement one another but have distinct purposes.'),
 sort([['隐私','Privacy'],['安全','Security'],['稳健性','Robustness']],[['检查个人资料是否用于适当目的','Check appropriate personal-data purposes',1],['阻止无权限账号进入资料库','Block unauthorized accounts from the repository',2],['测试输入异常时能否适当运行','Test appropriate behavior on unusual inputs',3]]),
 ['系统限制了账号访问，但从未测试环境变化。哪项仍缺证据？','稳健性',['已经证明全部责任原则','仅因有密码即可证明稳健'],'Accounts are access-controlled, but changing conditions were never tested. What still lacks evidence?','Robustness',['Every responsibility principle is proven','A password already proves robustness']]);

add('3.1.2-unit-1',L('补全评审记录中的影响维度，使比例判断可审计。','Complete impact dimensions so proportionality reasoning can be reviewed.'),L('只记录收益，不记录损害严重性和可逆性。','Benefits are recorded while severity and reversibility are omitted.'),
 L('评审已记录节省时间。选择还应补充的全部信息，以讨论相称控制。','The review records time savings. Select every missing input needed to discuss proportionate controls.'),
 L('影响对象、可能性、严重程度、可逆性和决定责任共同支持取舍；厂商品牌不提供这些影响证据。','Affected people, likelihood, severity, reversibility and decision ownership support the trade-off; a vendor brand provides none of this impact evidence.'),
 choose([['受影响对象及损害可能性','Affected people and likelihood of harm'],['严重程度与可逆性','Severity and reversibility'],['控制取舍和决定责任','Control trade-offs and decision ownership'],['只补模型品牌','Add only the model brand']],[1,2,3]),
 ['两种用途收益相同，其中一种损害难以逆转。评审应如何处理？','将可逆性纳入相称控制和取舍记录',['收益相同所以控制必须相同','忽略损害只比较速度'],'Two uses have equal benefits, but harm from one is hard to reverse. What should the review do?','Include reversibility in proportionate controls and the trade-off record',['Equal benefits require identical controls','Ignore harm and compare only speed']]);

add('3.1.3-unit-1',L('把不允许用途与人工介入落实到验收门。','Make prohibited uses and human review concrete acceptance gates.'),L('先做功能，验收时只测速度。','Build features first and test only speed at acceptance.'),
 L('演练规定按用途定义→保障设计→验证迭代推进。将步骤排序。','Case workflow requires use definition, safeguard design, then iterative validation. Order the steps.'),
 L('先界定允许和不允许用途，再设置数据、功能和人工介入保障，最后以这些要求验证并迭代。','Define permitted and prohibited uses, then design data, feature and human-intervention safeguards, and validate against those requirements.'),
 order([['定义用途与禁止场景','Define intended and prohibited uses'],['设计资料、功能及人工介入保障','Design data, feature and human-review safeguards'],['纳入验收并迭代验证','Include safeguards in acceptance and iterate tests']]),
 ['设计验收标准时发现高影响操作需要人工介入，应该如何处理？','把介入情形和保障纳入设计及验证',['只测响应速度','等上线后用户投诉才定义介入'],'During acceptance design, a high-impact action needs human intervention. What should happen?','Include intervention conditions and safeguards in design and validation',['Test only response speed','Define intervention only after complaints']]);

add('3.1.4-unit-1',L('检查监督是否具有实际介入能力。','Check whether oversight has practical intervention capacity.'),L('安排一个签字人即可构成有效监督。','Assigning a signer creates effective oversight.'),
 L('演练：复核员只能看到结论，必须立即签字且无暂停权。选择所有必要补强。','Case: a reviewer sees only conclusions, must sign immediately, and cannot pause actions. Select all necessary improvements.'),
 L('监督需要证据、时间、训练、停止或修改权，并给无来源结论等触发事件指定接手人；单纯签字不提供能力。','Oversight needs evidence, time, training, stop or modification authority, and owners for triggers such as unsupported conclusions. A signature alone provides no capability.'),
 choose([['提供证据、复核时间和训练','Provide evidence, review time and training'],['授予停止或修改权限','Grant stop or modification authority'],['定义无来源结论等升级条件与接手者','Define unsupported-claim escalation and takeover owners'],['只增加签字次数','Only require more signatures']],[1,2,3]),
 ['出现无来源的重要结论，复核员没有停止权。最直接的治理缺口是什么？','监督缺少实际权限与明确升级接手',['复核员签名不够漂亮','模型措辞不够确定'],'An important unsupported conclusion appears and the reviewer cannot stop action. What is the direct governance gap?','Oversight lacks practical authority and a defined escalation owner',['The signature is unattractive','The model wording lacks certainty']]);

add('3.2-lesson-1',L('将跨职能参与转成明确的决策分工。','Turn cross-functional participation into explicit decision responsibilities.'),L('所有部门参会就无需指定责任人。','Attendance by every department removes the need for owners.'),
 L('演练分工：业务负责人决定用途；技术负责人决定部署配置；合规负责人核对组织要求。仅标记指定职责，不推断其他权限。','Case assignments: business owner decides use; technical owner decides deployment settings; compliance owner checks organizational requirements. Mark only these duties.'),
 L('跨职能参与与清晰决策责任同时成立；参会不自动赋予所有人全部决策权。','Cross-functional participation coexists with clear decision ownership; attendance does not grant everyone every authority.'),
 matrix([['业务负责人','Business owner'],['技术负责人','Technical owner'],['合规负责人','Compliance owner']],[['用途决定','Use decision'],['部署配置','Deployment settings'],['核对组织要求','Check organizational requirements']],['r1:c1','r2:c2','r3:c3']),
 ['五个部门参加评审，但无人有权作上线决定。还缺什么？','明确该决定的责任与授权边界',['再增加参会人数','把责任写为所有人共同承担即可'],'Five departments attend a review, but nobody may decide deployment. What is missing?','Explicit ownership and authority for that decision',['More attendees','Simply assign responsibility to everyone']]);

add('3.2-lesson-2',L('先形成可供责任人判断的合规上下文。','Build compliance context before responsible specialists assess it.'),L('通用清单可以直接给出所有用途的合规结论。','A generic checklist determines compliance for every use.'),
 L('演练项目尚未说明地区或资料类别。选择提交责任人评估前应补充的全部上下文。','The case omits locations and data categories. Select every context item needed before assessment by responsible people.'),
 L('用途、数据、地区与组织要求决定核查上下文；清单只能辅助，不能凭未知条件直接宣告合规。','Use, data, locations and organizational requirements establish assessment context; a checklist cannot justify a compliance conclusion with unknown conditions.'),
 choose([['业务用途和数据类型','Intended business use and data types'],['适用地区和组织要求','Relevant locations and organizational requirements'],['只提交“通用清单已勾完”','Submit only a completed generic checklist']],[1,2]),
 ['团队只凭通用清单宣布合规，资料类型和地区仍未知。合理下一步？','补充上下文并交相关责任人评估',['继续使用该结论','让模型口头保证合法'],'A generic checklist is used to declare compliance while data types and locations are unknown. What next?','Complete context and ask responsible people to assess it',['Keep the conclusion','Ask the model for a verbal legality guarantee']]);

add('3.2-lesson-3',L('用最小可用权限矩阵替代提示词愿望。','Replace prompt-based wishes with a minimally sufficient permission matrix.'),L('提示词写“不要越权”就能替代工具权限。','A prompt saying not to exceed authority replaces tool permissions.'),
 L('演练：客服只需读FAQ；财务只需读账单；两者均不需删除。配置最小权限，列为读FAQ、读账单、删除。','Case: support needs FAQ reads only; finance needs invoice reads only; neither needs deletion. Configure least privilege across FAQ read, invoice read and delete.'),
 L('只开放任务所需读取权限，删除无必要。矩阵必须在资料和工具系统执行，不能仅写在提示词里。','Grant only the required reads and no deletion. Enforce the matrix in data and tool systems, not merely in prompts.'),
 matrix([['客服','Support'],['财务','Finance']],[['读FAQ','Read FAQ'],['读账单','Read invoices'],['删除','Delete']],['r1:c1','r2:c2']),
 ['客服任务只需FAQ，但工具拥有账单读取权。应该改哪里？','在资料和工具层撤销不必要权限',['仅添加“请勿读账单”的提示','保留权限并让模型承诺'],'Support only needs FAQs, but its tool can read invoices. What should change?','Revoke unnecessary access in data and tool systems',['Only prompt it not to read invoices','Keep access and ask for a promise']]);

add('3.2-lesson-4',L('依据影响证据选择风险分级输入。','Select impact evidence for risk classification.'),L('模型越大风险一定越高。','Larger models are always higher risk.'),
 L('为两个模型的用途排治理优先级。选择应比较的全部依据，不直接推断风险等级。','Prioritize governance for two model uses. Select all relevant comparison inputs without assigning an unsupported risk grade.'),
 L('用途、对象、损害和控制条件支持影响判断；只凭参数大小不能确定用途风险。','Use, affected people, harm and controls support impact assessment; parameter count alone cannot determine use-case risk.'),
 choose([['用途与受影响对象','Use and affected people'],['潜在损害与现有控制','Potential harm and current controls'],['只按模型大小决定等级','Determine grades solely by model size']],[1,2]),
 ['小模型参与高影响决定，大模型用于低影响草稿。能否仅凭规模给小模型低优先级？','不能，应结合用途、损害和控制评估',['能，规模是唯一标准','能，只要小模型速度快'],'A small model supports a high-impact decision; a large model drafts low-impact text. Can size alone lower the small model’s priority?','No; assess use, harm and controls',['Yes; size is the sole criterion','Yes if the small model is fast']]);

add('3.2.1-unit-1',L('分开执行与最终问责，避免多人协作的责任真空。','Separate execution from accountability to prevent ownership gaps.'),L('负责执行的人必然拥有最终决策权。','The person doing the work necessarily owns the decision.'),
 L('演练授权：分析员执行验证；业务主管最终决定是否上线。仅选择这两个对应职责。','Case authority: analyst performs validation; business lead owns the final deployment decision. Select only those two assignments.'),
 L('执行者提供工作结果，问责者对决定和结果负责。两种职责按明确授权划分，不能因参与工作就推断决策权。','The executor provides the work; the accountable owner owns the decision and outcome. Explicit authority separates the roles; participation does not imply decision power.'),
 matrix([['分析员','Analyst'],['业务主管','Business lead']],[['执行验证','Perform validation'],['最终上线决定','Final deployment decision']],['r1:c1','r2:c2']),
 ['分析员完成验证，按演练业务主管最终问责。谁作最终上线决定？','业务主管',['分析员因为做了验证','无需任何人决定'],'The analyst validates; the business lead is accountable under the case. Who makes the final deployment decision?','Business lead',['Analyst because they ran validation','Nobody needs to decide']]);

add('3.2.2-unit-1',L('按给定交接顺序组织具体合规资料，避免越权下法律结论。','Organize concrete assessment context in the stated handoff sequence without inventing legal conclusions.'),L('把使用地区或受影响人群省略也不影响具体核查。','Omitting locations or affected people does not affect assessment.'),
 L('演练评审流程固定为：先收集用途与人群，再补数据、地区和组织要求，最后由责任专业人员核对。按流程排序。','The case fixes this review workflow: collect use and people, complete data/location/organizational context, then responsible specialists check applicability. Order it.'),
 L('专业人员需要完整上下文才能核对适用条件；这里的顺序来自演练交接要求，不是通用法律程序。','Specialists need the full context to check applicable conditions. This ordering is a case handoff requirement, not a universal legal procedure.'),
 order([['收集用途与受影响人群','Collect use and affected people'],['补充数据类别、地区与组织要求','Complete data categories, locations and organizational requirements'],['责任专业人员核对适用条件','Responsible specialists check applicable conditions']]),
 ['资料表已有数据类别却没有使用地区。交专业人员前应如何做？','补充使用地区及其他缺失上下文',['按任意地区规则宣告合规','把未知地区留空并默认无要求'],'The context sheet lists data categories but omits usage locations. What should happen before specialist review?','Add locations and other missing context',['Declare compliance under an arbitrary location’s rules','Leave locations blank and assume no requirements']]);

add('3.2.3-unit-1',L('在数据进入检索前放置授权门，操作体现控制时点。','Place an authorization gate before retrieval so timing becomes operational.'),L('先越权检索再遮盖输出就等于阻止访问。','Masking output after unauthorized retrieval prevents access.'),
 L('演练系统须先验证身份和授权，再检索允许资料，再生成答复。排序安全路径。','The case system must verify identity and authorization, retrieve permitted data, then generate a response. Order the safe path.'),
 L('授权发生在检索之前才阻止越权读取；生成后遮盖无法撤销已经发生的访问。','Authorization before retrieval prevents unauthorized reads; masking a generated response cannot undo access that already occurred.'),
 order([['验证身份与所需资料权限','Verify identity and required data permissions'],['只检索已授权资料','Retrieve only authorized data'],['依据允许资料生成答复','Generate from permitted data']]),
 ['检索器读取了禁止资料后才遮盖答案，这是否替代检索前授权？','不能，越权检索已经发生',['可以，只要用户没看到','可以，只要提示词要求保密'],'The retriever reads forbidden data and then masks the answer. Does this replace authorization before retrieval?','No; unauthorized retrieval already happened',['Yes if the user never sees it','Yes if the prompt asks for secrecy']]);

add('3.2.4-unit-1',L('在用途变化时重新开风险门，而非复用旧结论。','Reopen risk assessment when use changes instead of reusing an old conclusion.'),L('同一模型不变就不必重新分级。','An unchanged model never needs risk reclassification.'),
 L('演练：同一模型从内部草稿改为影响客户权益的建议。选择所有适当工作。','Case: the same model moves from internal drafts to advice affecting customer interests. Select all appropriate actions.'),
 L('用途、对象和损害条件已改变，需重新评估分级及治理力度；模型未升级不能维持旧结论。','Use, affected people and harm conditions changed, requiring reassessment of classification and governance effort. An unchanged model does not preserve the old conclusion.'),
 choose([['重评用途、对象、潜在损害和控制','Reassess use, people, potential harm and controls'],['按新评估安排治理优先级','Set governance priority from the new assessment'],['直接沿用原低风险结论','Reuse the previous low-risk conclusion unchanged']],[1,2]),
 ['模型版本未变，但部署人群与用途改变。应如何处理风险等级？','按新影响条件重新评估',['永久保留旧等级','仅比较模型参数数量'],'The model version is unchanged but use and deployment population change. What about its risk grade?','Reassess under the new impact conditions',['Keep the old grade permanently','Compare only parameter counts']]);

add('3.3-lesson-1',L('配置上线后持续控制，而不把发布当终点。','Configure continuous operational controls rather than treating launch as completion.'),L('通过上线验收就无需运行监控。','Passing release acceptance removes the need for monitoring.'),
 L('上线清单已有发布按钮。选择生产运行还需具备的全部机制。','The launch checklist has a release button. Select all additional mechanisms needed for operation.'),
 L('日志和质量检查支持发现异常，升级与回退支持处置；仅发布或宣传无法持续控制风险。','Logs and quality checks detect anomalies; escalation and fallback support response. Release or promotion alone cannot control operational risk.'),
 choose([['运行质量检查与日志','Operational quality checks and logs'],['异常处理、人工升级与回退','Incident handling, human escalation and fallback'],['只增加上线宣传','Only increase launch publicity']],[1,2]),
 ['上线前通过测试，但运行中出现异常。合理机制应包括什么？','日志追踪、异常处理、人工升级与回退',['只引用上线前测试证明安全','删除异常日志避免告警'],'Pre-launch tests passed, but an anomaly appears in operation. What mechanisms are appropriate?','Traceable logs, incident handling, human escalation and fallback',['Use pre-launch tests as permanent safety proof','Delete anomalous logs to avoid alerts']]);

add('3.3-lesson-2',L('沿生命周期定位偏差线索，要求持续观察。','Locate bias clues across the lifecycle and require ongoing observation.'),L('训练前检查一次就能排除部署后的偏差。','One pretraining check excludes deployment bias forever.'),
 L('将调查线索放到最直接的阶段；分类只定位线索，不代表已证明因果。','Route each investigation clue to its direct stage. Classification locates a clue; it does not establish causality.'),
 L('遗漏群体指向采样、同例异标指向标注、新人群差异指向部署环境；仍需持续分组检查和原因调查。','Missing groups point to sampling, inconsistent labels to labeling, and a new population to deployment context. Ongoing subgroup assessment and investigation are still needed.'),
 sort([['采样','Sampling'],['标注','Labeling'],['部署环境','Deployment context']],[['样本没有覆盖一个受影响群体','A relevant group is absent from samples',1],['相同案例被不同人员标成相反结果','The same case receives conflicting labels',2],['上线人群与评估人群发生变化','Deployed population differs from evaluation population',3]]),
 ['上线后新增人群表现变差，训练前检查曾通过。应该怎么做？','持续检查分组表现并调查环境变化',['认定过去通过所以现在无偏差','只保留总体平均'],'A new deployment group performs poorly despite a passed earlier check. What next?','Check subgroup outcomes over time and investigate changed conditions',['Assume earlier success rules out current bias','Keep only the overall average']]);

add('3.3-lesson-3',L('并列检查内容安全、来源授权和输出用途。','Check content safety, source permissions and output use separately.'),L('模型生成天然无害且没有权利限制。','Model-generated content is inherently harmless and unrestricted.'),
 L('演练团队准备发布生成材料。选择所有发布前应核对的方面。','The case team plans to publish generated material. Select all aspects needing review before release.'),
 L('生成方式不证明内容无害或资料有授权；需按用途设置审核和处置，而不是让模型自行保证。','Generation does not prove harmlessness or source permission. Review and remediation must fit the use rather than relying on a model guarantee.'),
 choose([['输入资料使用授权','Permission to use input materials'],['输出用途与有害内容风险','Output use and harmful-content risks'],['审核与处置流程','Review and remediation procedures'],['仅确认内容是模型生成','Only confirm the content was model-generated']],[1,2,3]),
 ['材料由模型生成，团队因此省略授权和内容审核。判断如何？','生成不免除这些检查',['模型生成必然无害','模型生成必然无权利限制'],'A team skips rights and content reviews because a model generated the material. What is correct?','Generation does not remove these checks',['Generated content is always harmless','Generated content always has unrestricted rights']]);

add('3.3-lesson-4',L('把流畅表达与证据支持分离并选择复核动作。','Separate fluent wording from evidence and choose verification actions.'),L('内容听起来可信就说明可靠。','Plausible language establishes reliability.'),
 L('演练：一段流畅答案没有支持来源，拟用于重要决定。选择全部合理动作。','Case: a fluent answer has no supporting sources and may inform an important decision. Select all appropriate actions.'),
 L('可信措辞不能补上缺失证据；来源核验、数据检查与必要人工复核共同管理可靠性，未知应保留。','Plausibility cannot supply missing evidence. Source verification, data checks and appropriate human review manage reliability while preserving unknowns.'),
 choose([['核对来源支持与数据质量','Verify source support and data quality'],['必要时交人工复核并保留未知','Seek human review when needed and retain uncertainty'],['因措辞流畅直接执行','Act immediately because it reads fluently']],[1,2]),
 ['一段答案很具体且自信，但没有依据。能否直接当可靠事实？','不能，应核验支持并必要时人工复核',['可以，细节越多越可靠','可以，自信就是依据'],'An answer is detailed and confident but unsupported. Can it be treated as reliable fact?','No; verify support and seek human review as needed',['Yes; detail guarantees reliability','Yes; confidence is evidence']]);

add('3.3.1-unit-1',L('让事件响应先限制影响，再调查验证恢复。','Practice containing impact before investigation and verified restoration.'),L('发现异常后先扩大上线才能获得更多样本。','Expand deployment first to gather more incident samples.'),
 L('演练已检测到异常并保全日志；规定先限制影响，再调查修复，验证满足恢复条件后才扩大。排列后续行动。','An anomaly is detected and logs are preserved. Case policy requires containment, investigation and repair, then validation before wider restoration. Order the actions.'),
 L('先控制受影响范围避免损害继续，再用版本、输入输出和告警追踪原因；修复须验证，不能以修复声明替代恢复条件。','Containment limits further harm; versions, inputs, outputs and alerts support investigation. Validate remediation rather than treating a repair claim as a restoration condition.'),
 order([['暂停或限制受影响流程','Pause or contain the affected process'],['利用版本与事件日志调查并修复','Investigate and repair using version and event logs'],['验证恢复条件再扩大使用','Validate restoration conditions before expanding use']]),
 ['修复已提交，但尚未验证恢复条件。下一步是什么？','先验证修复与恢复条件',['立即扩大所有使用','删除旧版本日志'],'A repair is submitted but restoration conditions remain unvalidated. What next?','Validate remediation and restoration conditions first',['Immediately expand to all users','Delete old-version logs']]);

add('3.3.2-unit-1',L('为差异准备多阶段调查假设，避免一因解释。','Prepare multi-stage hypotheses for disparities instead of assuming a single cause.'),L('分组差异一定只来自训练样本。','Subgroup disparities can only come from training samples.'),
 L('演练发现群体差异。选择所有值得调查的可能来源；本题不把任何线索直接判为根因。','A case reveals subgroup disparities. Select every plausible source to investigate; none is declared the root cause here.'),
 L('代表性、标注一致性、优化目标和部署人群都可能影响差异，应结合持续监测调查，而不是先锁定一个根因。','Representation, labeling consistency, optimization objectives and deployment populations can affect disparities. Investigate with ongoing monitoring rather than assuming one root cause.'),
 choose([['样本代表性与标注一致性','Sample representation and label consistency'],['优化目标与部署人群变化','Optimization objectives and deployment-population changes'],['因总体平均稳定而停止调查','Stop investigating because the overall average is stable']],[1,2]),
 ['群体差异出现，但样本代表性检查正常。能否结束偏差调查？','不能，还需调查标注、目标和部署等来源',['能，样本是唯一来源','能，只要总体平均没变'],'A subgroup disparity appears despite normal sample-representation checks. Can the bias investigation end?','No; investigate labeling, objectives and deployment too',['Yes; samples are the only source','Yes if the overall average is unchanged']]);

add('3.3.3-unit-1',L('让来源许可和输出安全分别占一个检查门。','Give source permission and output safety independent review gates.'),L('资料有授权就证明生成内容安全。','Licensed inputs prove generated outputs are safe.'),
 L('演练报告只记录“来源有授权，输出未审”。选择所有仍需处理的工作。','The case report says sources are authorized but outputs are unreviewed. Select all remaining work.'),
 L('来源授权只回答允许如何使用资料；输出用途、内容风险、投诉与处置仍需核对。反过来，过滤有害内容也不证明获得许可。','Source permission addresses allowed source use. Output use, content risk, complaints and remediation still need review. Conversely, harmful-content filtering does not prove permission.'),
 choose([['按输出用途进行内容审核','Review content for intended output use'],['设置投诉与处置流程','Establish complaints and remediation procedures'],['直接把来源授权当成输出安全证明','Treat source authorization as proof of output safety']],[1,2]),
 ['输出通过有害内容过滤，却未核对来源许可。可否认定已获版权许可？','不能，内容安全与来源许可是不同检查',['可以，过滤即代表许可','可以，未发现有害词就足够'],'An output passes harmful-content filtering, but source permission is unchecked. Does that prove copyright permission?','No; content safety and source permission are separate checks',['Yes; filtering implies permission','Yes; no harmful terms is enough']]);

add('3.3.4-unit-1',L('按显式演练状态编码修复证据卡，保留未知。','Repair an evidence card using explicit case status codes while retaining unknowns.'),L('看到相关引用就默认支持结论且版本正确。','A related citation automatically supports the claim and has the right version.'),
 L('演练编码：已核验=1，未知=0。资料主题相关已核验；引用是否支持具体结论未知；版本是否最新未知。修复三格为对应数值。','Exercise codes: verified=1, unknown=0. Topic relevance is verified; support for the specific claim is unknown; current source version is unknown. Repair the three cells.'),
 L('相关性不等于具体支持，版本也要单独检查；因此为1、0、0。不能将未知填成已证实，重要未知需升级复核。','Relevance is not claim support, and version needs a separate check, so values are 1, 0, 0. Do not promote unknowns to verified facts; escalate important unknowns.'),
 {type:'edit',fields:[{id:'relevance',label:L('主题相关性（已核验）','Topic relevance (verified)'),expected:1,min:0,max:1},{id:'support',label:L('具体结论支持（未知）','Specific claim support (unknown)'),expected:0,min:0,max:1},{id:'version',label:L('当前版本（未知）','Current version (unknown)'),expected:0,min:0,max:1}]},
 ['引用主题相关，但是否支持重要结论及版本均未知。应如何表达？','保留不确定性并升级复核支持与版本',['直接宣布结论已经证实','删除未知标记保持答案流畅'],'A citation is topically relevant, but support for an important claim and its version are unknown. What should be communicated?','Retain uncertainty and escalate support and version checks',['Declare the claim verified','Remove unknown markers for fluent wording']]);

module.exports = {units};
