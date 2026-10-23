# A 六小时概念小游戏知识候选报告

更新时间：2026-10-23 07:35 PDT（14:35 UTC）。窗口截止12:46:20 PDT（19:46:20 UTC），不延长；任一适用窗口剩≤10%停止新批次/评审并安全收尾。用户已将B教学交另一位，A停止设计玩法/扩题；本批仅知识显示勘误，三处遗漏共六条legacy绑定，独立只读复核PASS。历史1/2/3批为作者参考，不自动要求新B重做。

额度：显示勘误复核前codex周窗口usedPercent=50，剩50%，任务卡无实际收尾触发标记。只写packages/knowledge/candidates/concept-games/和本报告，不改冻结知识、dist/服务/index/启动器，A不提交推送；用户最新授权的本轮GitHub汇总由D执行。

## 最新小批：学习卡英文显示勘误（不是B教学设计）

先读plan最新14:26 UTC调整，仅对发布B4/B5学习卡的中文/英文定义、例示和边界做字段核对，沿用已审A来源，不重新查全139条一手网页。AIB两路线的这些知识字段与冻结A一致；legacy有缩写/改写，但差异不自动等于错误。本批只选三处可明确复现的英文缺项，不扩成全部改写。

实际产物：packages/knowledge/candidates/concept-games/display-errata.cjs、display-errata.v1.json、display-errata.test.cjs，README追加接入说明。

| 源单元／实际lesson | 明确遗漏与候选修复 |
| --- | --- |
| 1.1-lesson-5／1.1-lesson-12 | 预测英文例示仅高估库存，遗漏中文已有低估缺货；补underestimating…may cause stockouts，不变成必然因果 |
| 1.1-lesson-11／1.1-lesson-18 | 数据质量英文body遗漏“大模型不能自动补救所有数据缺陷”；恢复冻结已审英文边界 |
| 1.1-lesson-14／1.1-lesson-21 | 统一词汇英文body遗漏“标准或框架不能当准确率保证”；恢复冻结已审英文边界 |

均位于legacy节1.1：B4课程course-11fu42t、B5课程course-87vtar，各3张，共6条绑定。完整courseHash/lessonHash、before/after、中文对应句、冻结unitHash及sourceIds在JSON。AIB已有完整对应内容，不新增更正；中文、引文、出处和boundary字段均不改。实际UI将这些限制放在body，不为统一形式强行迁至boundary。

候选内容hash=ec47efdecd9d5eb47a0f4f5f1b1ce17276429cd84f2ba241c6c70582cb4d8032（SHA256 UTF8 JSON.stringify）。projectDisplay只返回展示副本，不改原始课程或卡片；D接UI时必须继续使用原始对象计算B绑定、收藏与存档context。不得将显示投影写回冻结知识/B产物/旧bank，或据此让新游戏重新通过。

### 实际验证与独立复核

- `node packages/knowledge/candidates/concept-games/display-errata.cjs`成功：3问题、6绑定、4条路线核对、displayOnly=true、integrated=false，仅写本候选JSON。
- 定向测试初版3/3通过；不同模型gpt-6-astra实际3/3及落盘一致性复核PASS，确认三处忠实恢复冻结中英文限制、六条当前绑定、AIB无须修改、纯投影和失配拒绝。
- 后补实际language-engine文本注册路径回归：同一中文注册当前英文可重现旧显示映射，注册投影后得到补全英文且原字段不变；最终本地`node --test packages/knowledge/candidates/concept-games/display-errata.test.cjs`4/4通过。此新增测试未冒充独立模型已运行4项。
- 检查knowledge-play.js确实读取body/example/boundary，调用TownLocale.text注册双语；没有实际DOM/浏览器点击验收，不把文本模块测试当最终视觉通过。
- 本批结束核对冻结materials.v3/knowledge.v3/analysis.v3字节hash，与frozen-inputs记录保持一致。

未验：D接入后的英文/中英双语布局、回切与刷新、原bank持续兼容、全部收藏入口；A不操作用户浏览器/存档，不构建或重启服务。候选未整合，本小批完成，后续只响应D知识准确性任务，不向B派设计任务或扩题。

## 可交B的第1批

产物：packages/knowledge/candidates/concept-games/batch1.v1.json（实际双语数据）、batch1.cjs（生成器及buildBatch入口）、batch1.test.cjs、README.md。

| 候选ID | 源单元 | 实际玩法证据，不是术语统一配对 |
| --- | --- | --- |
| deterministic-rule-boundary | 1.2.1-unit-1 | 金额4999/5000/5001重复执行，v1严格大于与v2大于等于在5000处结果不同；比较完整输入和版本，解释反例 |
| rules-model-selection | 1.2-lesson-1 | 揭示政策/样本/代价，分别选择执行明确规则、比较模型与基线、补可比较业务结果；不把复杂直接等同必须用ML |
| algorithm-model-artifact | 1.1-lesson-1、1.1-lesson-2 | 执行排序观察有序记录，再查看给定参数模型产物与调用日志，区分步骤、产物和当前过程 |

共3组、4个不同单元、16条实际卡片绑定，覆盖legacy4/legacy5/aib4/aib5；知识版本3，教学版本4或5。不是仅按1.1机械绑定。

确定性目标绑定legacy节1.2卡1.2-lesson-6、aib节1.7卡1.7-lesson-4；规则选型绑定legacy节1.2卡1.2-lesson-1、aib节1.6卡1.6-lesson-3；算法/模型绑定legacy节1.1卡8/9、aib节1.1卡3/4。完整课程ID与逐卡contentHash在JSON，不在报告手工复制代替真源。

## 知识准确性与边界

- 5000元为原创教学假设，不伪称法规/企业政策；未触发本条审批规则不等于报销获批。
- 确定性只针对固定完整输入、规则版本及本台无随机/时钟/外部调用的条件。改版本或其他读取状态不是同一条件；有限重复不证明所有实现无错，不证明规则公平。
- 学习型模型只作为可比较候选，不因业务复杂就必然值得部署。缺结果记录的例子只阻止声称缺货收益，不能外推所有学习都不可运行。
- 参数模型为明确题设，不把一切模型都当权重文件；文件存在不证明训练正在进行；排序本身不等于学习。
- 所有答案/观测为作者可见，authoringOnly、answersExposed、doNotUseAsUnseenAssessment、notEvidenceOfIndependentMastery均true；不替代B引擎或正式90%测验，不自动记收藏。

采用现有analysis.v3的6条来源登记，继承其2026-10-20审校时间，没有冒充本轮新网页验证。来源支持范围在README；原料包schemaVersion=1、revision=3不变，候选另有candidateRevision=1且integrated=false。

## 实际验证

- `node packages/knowledge/candidates/concept-games/batch1.cjs`：成功，items=3、lessonBindings=16、sources=6、integrated=false；仅写本目录JSON。
- `node --test packages/knowledge/candidates/concept-games/batch1.test.cjs`：3/3通过。核实际四路线映射与输入不变；严格/包含阈值在等值处分歧及重复结果；知识/来源漂移或实际卡映射缺失均拒绝。
- 不同模型gpt-6-astra只读知识/双语复核PASS，实际3/3通过并核对落盘与构建结果一致、16条绑定/版本/hash、六来源支持范围和作者标记；未写文件。没有运行全模块、整站或浏览器测试，候选无UI，不需要构建游戏预览。
- 冻结materials.v3/knowledge.v3/analysis.v3字节hash与frozen-inputs记录一致。

## Goal及后续批次

已调用create_goal请求建立本轮明确目标，工具返回“cannot create a new goal because this thread has an unfinished goal; complete the existing goal first”。现存是上一轮已到期paused的旧目标，工具不提供改objective/恢复接口；不为绕过限制把未完成旧目标虚假标complete。此状态限制不阻塞本轮文件工作，实际执行以D-six-hour-minigames.md的19:46:20 UTC截止与额度规则为准。

本批复核通过后供D转B；后续优先训练/推理/预测、数据偏差等不同操作证据，先检查额度与D反馈，不给其余章节复制同一配对壳。B定义引擎和C定义UI，A只提供可追溯内容。跨模块问题由D协调，不给其他对话发消息。

## 第2批：章2／3／4各两概念（已验收内容候选）

按D续派先读B的API.md、catalog.json、bindings.cjs与报告；不重复第一章阈值/参数实验。实际产物为batch2-content.cjs、batch2.cjs、batch2.v1.json、batch2.test.cjs及README第2批说明。

| 章 | 候选ID与源单元 | 数据与预期观察 |
| --- | --- | --- |
| 2 | roi-evidence-ledger · 2.2.3-unit-1 | 同月现金账本，成本8000、核验收益10000、净收益2000、简单现金ROI25%；产能另列、不重复记节支 |
| 2 | volume-cost-simulator · 2.2.5-unit-1 | 业务量1000/5000下总成本2800/5200、单位成本2.8/1.04；保留人工复核和集成/培训/监测/退出分摊，观察总额与单价方向不同 |
| 3 | permission-before-retrieval · 3.2.3-unit-1 | 明确身份与用途后，只放行政策读取，拒绝人事读取与越权批准；不能先检索再遮盖 |
| 3 | claim-version-evidence · 3.3.4-unit-1 | 虚构政策v1退休/v2生效，保留未拆封、7天内、申请条件；拒绝无条件批准与旧版本推断，缺证据时保留未知 |
| 4 | operational-handover-rehearsal · 4.4.5-unit-1 | 触发虚构故障，核接手者、告警路径、运行手册、回退和恢复证据；不是上传模型/勾选即生产就绪 |
| 4 | pilot-transfer-investigation · 4.4.2-unit-1 | 对照本地资料、接手训练和负载验证，暂停新部门范围而非否定全部试点；一项补齐不自动放行其他条件 |

六组均有实际双语目标、先教内容、操作建议、config、例子、反例、边界。数字/组织/政策均标演练假设，不造通用业务阈值；不是B引擎已注册kind或现有正式测验题。

### 与B接口一致的绑定

- knowledge使用增强aib-knowledge-integration rev3，hash=1b31c336a5ddcfd0a78e22d581102c1d293b3cf835a72124d99cb2344f7c8f80；另保留frozenKnowledge身份，不能拿首批A原包hash替代B运行context。
- bindings直接读取B的catalogSources()/forLesson()，含完整courseHash、lessonHash、sourceUnitId和knowledgeHash；sourceUnits.unitHash对应增强完整单元，正文与已审冻结单元逐字段一致。
- 六个源单元在四条B4/B5 legacy/aib课程中合计26条真实绑定。3.3.4-unit-1在AIB章3/章4两次出现，两条路线共多2条，不删重复卡。JSON含确切课程ID/节号/卡号和摘要。
- sourceIds均核实为目标单元原审校实际引用，sources保留原URL与历史审校日期；未重新访问外网或改B文件。作者内容需要B转换为可执行描述器并测试恢复/门禁，不直接扔给resolve。

### 本批实际验证

生成命令`node packages/knowledge/candidates/concept-games/batch2.cjs`成功：items6、章2/3/4各2、bindings26、integrated=false。

`node --test packages/knowledge/candidates/concept-games/batch2.test.cjs`最终5/5通过：覆盖完整B绑定一致与输入不变、ROI分母/收益去重、业务量成本算术、权限/证据/迁移结论范围，以及源数据变化/卡片缺失拒绝。首次运行4/5，唯一失败为测试预估24条映射；实际目录显示AIB重复复习卡，已核对并改为26及专门的重复绑定断言，没有改源知识以凑断言。

不同模型gpt-6-astra内容/双语/绑定只读复核PASS，实际5/5并核对落盘JSON与当前构建结果一致；确认六组限制、26条B字段绑定、增强知识hash及重复复习卡正确，未写文件。冻结三份v3字节hash保持。没有重跑整站测试、构建预览或改运行收藏与正式判分。此稳定批完成后供D续派，不自行整合。

## 第3批：按当时主coverage缺口选12概念（已验收内容参考）

按D续派读B当前coverage.json与API，选取当时sourceConceptsCovered以外12个单元，其中11个在旧legacy节1.1的22卡内，另1个第三章偏差。选择时coverage batch=1，covered仅算法、确定性、训练、推理；不把第一批已覆盖单元再包装一遍。

实际产物：batch3-content.cjs、batch3.cjs、batch3.v1.json、batch3.test.cjs；第2批buildBatch2仅增加可选authoredItems参数以复用已核绑定流程，默认第二批输出不变。第三批记录coverage完整hash与此前covered清单；B以后新增覆盖不改变这份历史选择说明，重新生成时如目标已覆盖则拒绝并要求复核。

| 实际源单元 | 概念目标与操作证据 |
| --- | --- |
| 1.1-lesson-6 AI | 揭示专家规则、数据拟合与仅复制文件的不同实现，限制能由记录推出的AI/ML结论 |
| 1.1-lesson-7 ML | 对同样“复核”输出展开手写条件/拟合来源，不以答对一次证明泛化 |
| 1.1-lesson-8 GenAI | 在虚构政策与流畅草稿间圈出无依据承诺，保留条件而不是只看语气 |
| 1.1-lesson-18 NLP | 同一文本中抽取订单号、核意图和切换翻译目标，不把语言处理都做成长文生成 |
| 1.1-lesson-19 CV | 合成包裹图定位可见裂口，切换遮挡层并将遮挡背面保持未知 |
| 1.1-lesson-20 监督 | 打开类别/分钟数目标列，核分类与回归均可用带标签样本 |
| 1.1-lesson-21 无监督 | 按题设距离/两组目标组织点集，再拒绝未经证据赋予业务类别意义 |
| 1.1-lesson-22 强化 | 试走两步奖励路线，比较+3/−4与0/+5的累计回报，不冒称已训练智能体 |
| 1.1-lesson-5 预测 | 先估计后揭示实际值，等误差10在假设代价下对应10/30损失，区分结果/行动 |
| 1.1-lesson-12 泛化 | 比较历史工作日90/100与独立周末60/100，调查条件与样本而不直接猜因果 |
| 1.1-lesson-13 验证 | 按订单隔离相关副本，锁定最终测试答案，区分拟合/选择/最终检查 |
| 3.3.2-unit-1 偏差 | 展开A90/100、B18/30及总体108/130，调查样本/标注规则，不用多数票直接抹分歧 |

共12独立目标、7组共享实验、48条实际B课程/卡片绑定、17条已有来源。相邻概念可共享观察台，但各自objective/例子/反例/边界及目标单元摘要独立；不把所有物件做成同一术语配对。B仍须决定具体kind与实现，A数据不直接注册引擎或放行收藏。

实际验证：`node packages/knowledge/candidates/concept-games/batch3.cjs`成功，items12、experiments7、bindings48、selectedOldLegacyConcepts11、oldLegacyLessonCount22、integrated=false。`node --test packages/knowledge/candidates/concept-games/batch3.test.cjs`4/4通过，覆盖gap选择/单元映射、延迟奖励与业务误差算术、订单分组、群体汇总/准确率、遮挡区与类别目标。不同模型gpt-6-astra只读复核PASS：实际第3批4/4和第2批回归5/5共9/9通过，两批落盘与构建一致，确认可选authoredItems未改变第二批默认产物。

不声称演练表现是实测业务收益、真实视觉检测精度、唯一自然分类、公平性证明或正式独立掌握。没有改冻结知识、B/C目录、运行服务或发布文件。

### D最新staging事实已吸纳

第3批复核完成时D通知staging已accepted。A只读核实staging coverage batch2覆盖23来源，SHA256=6354a8c944a449594c7b068e82e1af3b2fff59011958e0fd5c75e9b7c2e88572；本批11个旧1.1单元已覆盖，仅3.3.2-unit-1偏差不在这23项内。因此本批作为已完成的知识参考，不要求重新实现已稳定1.1，不把主目录coverage滞后说成staging缺口。

另定向抽查staging的sample-trainer、cluster-builder、reward-path、image-inspector四项，概念边界与演练假设合理，未发现需改B的明确知识错误。B的RL数值为[5,−4]/[0,4]、A例示为[3,−4]/[0,5]，均为不同假设下的正确演练；不得因A数据不同覆盖B已accepted参数或存档。完整核对见staging-crosscheck.md，不冒称全部23项新评审。

后续优先staging真实gap中的1.2及其他章，先查额度并等D择要续派；不在本轮追加重复1.1玩法或修改B/C文件。

当前未接入；冻结知识、正式题/存档、收藏与服务未改。候选不是玩家已看到的变化；B/C/D接线与用户真实视觉、布局、学习效果仍未验。共享目录main，核对HEAD=039861f0e7aebf5a53cc8f48282485987847d6c3；不切分支，本批未创建提交、不提交他人文件。
