# B 教学与互动设计交接 · revision 4

日期：2026-10-22（America/Los_Angeles）。状态：教学方案、差异化判定及C接入侧车已验收；游戏接入和发布交D/C。本轮不把教学侧车完成说成当前页面已更新。

## 本轮检查与完成

以D已集成的增强A3/B3为基线，检查AIB全部38节及原内置13节。发现8节仅一种操作、11节出现同操作连续3轮以上；第一章全部沿用decision-lab外观，首游戏1.1为4轮choose。另发现真正原内置1.1由scripts/enrich-knowledge.cjs硬编码match，绕过B模板并触发星芽花房/概念配对。

本轮按内容修改33单元真实操作（第一章19、其他14），不是只改kind或换花盆。AIB全38节仍覆盖139单元、58目标；144张学习卡、145轮应用、144道正式题，四章12/8/7/11节。单一控件节8→0，三连同操作节11→0；保留7类操作：choose58、sort33、order23、edit11、number10、matrix7、allocate3。未强凑第8类rate或无依据量表。

原内置1.1单独补8轮、五类操作，覆盖22单元主题和六个legacy skills；与AIB编译1.1（4单元）分开交付。原内置13节共50轮，都有物件职责、步骤、来源单元与解锁说明。13节原模板入口已补1.1，但根构建特例未越权修改。

## 主要教学选择

| 位置/内容 | 操作与物件职责 | 判定与反馈 |
|---|---|---|
| AIB 1.1：AI/ML/算法/模型 | 收集描述后按学习证据sort；ML立项情境choose；依给定执行依赖order算法；edit输入/输出接线 | 证据不等于AI全部边界；执行方法不等于模型；history/forecast职责不反转。失败reason说明错因并回看对应知识 |
| 原内置1.1：22单元 | 算法装配、映射/参数事件修复、AI/ML/DL证据分类、资料分流、去重/预测后果计算、独立验证排序、能力证据、框架范围选择 | 8轮各有明确标准答案及错误反馈；不把分类关系当时间线、不把框架名称当零错认证 |
| 数据/数值 | 从错误记录、用量、独立样本、成本与损失条件中计算或修复 | 数字/阈值/单位全明示为演练条件，答案可计算，不能编造未给的损失金额 |
| 业务/组织 | 项目任务书流程、完整成本、按职责权限配置、交接或告警单修复 | 硬约束不能被高分抵消；实际失败率不同于政策阈值；修单不延迟已触发的预案紧急回退 |
| 内容已适合现控件的节 | 保留原判定，拆清自由知识物件和必做应用物件 | 不为了轮数或美术强行全变分类；38个section kind只是场景职责标签，实际多样性由round.type和判定证明 |

排序给定依赖是基础应用，不宣称无提示迁移；计算差额不能单独证明理解业务损失，正式题与反馈继续补足判断。

## 自由浏览与必做学习明确分离

- 进入任意章节即可自由看本章全部知识、例子、边界和来源；不要求先完成前节。收藏、收集可选，打开/读过/收藏不计掌握、不推进当前活动。
- 必做基础确认表示准备应用，须满足先修且已打开对应知识；确认本身不算理解通过。本节全部基础确认后逐轮提交真实操作；错解不前进。
- 小节完成仅由全部应用判定通过触发；整章全部必做完成后解锁正式练习。沿用90%测验门槛，失败后仍可进入错题复习，不能把复习锁在考过之后。
- 四章独立进入；跨章先修在本章补学。不清理旧进度，旧版本记录保留，新版本不自动继承掌握。

learning-flow.cjs提供可执行门控参考：browse、gate、confirmFoundation、submit、chapterReadyForPractice、validate。它完整重建并验证侧车依赖，不只相信侧车内嵌hash；删先修、清空考试门槛、错schema/revision、旧绑定、错误答案和畸形存档均拒绝。它是Node/CommonJS参考，不是已加载浏览器的UI实现。

## 交付路径（最新）

- B→C总交接：packages/learning-design/C-handoff.v4.md。
- 每节物件职责、互动步骤和解锁：packages/learning-design/generated/C-section-guide.v4.md。
- AIB38节双语侧车：packages/learning-design/generated/aib-teaching-map.v4.json。
- 原内置13节侧车：packages/learning-design/generated/legacy-teaching-map.v4.json。
- 完整LearningPlan：packages/learning-design/generated/aib-learning-plan.v4.json。
- 完整编译副本：packages/learning-design/generated/aib-course.v4.json。
- 蓝图、版本/摘要、前后浓度审计：同目录aib-blueprint.v4.json、aib-manifest.v4.json、concentration-audit.v4.json。
- 原内置1.1模板：packages/learning-design/templates/core-foundations.cjs，经templates/strategist.cjs导出。
- 独立评审绑定：packages/learning-design/authored/review-v4.json；运行/接入说明：README.md。

candidates目录仅为评审前快照；D/C以generated及其manifest为交付入口。物件与状态必须包含课程/银行ID、版本和摘要，不能把原内置1.1与AIB编译1.1按显示数字混绑。

## 输入输出版本与来源

schemaVersion=1不变；知识仍是D增强后的aib-knowledge-integration revision3，配aib-materials-integration revision3；教学aib-learning-plan revision4。原A3、历史B1/B3与来源均未修改。139单元正式题及其quote本轮逐项保持v3原样；不存在重新造知识或新增外部事实。

- 知识摘要：1b31c336a5ddcfd0a78e22d581102c1d293b3cf835a72124d99cb2344f7c8f80。
- 方案摘要：85c9663ab11142dbf21966691063b0ad85f14967f9688d830a65dd43eaa31d87。
- AIB侧车摘要：770a7ed94b6b7bf5e4fabcbeb94892a3262e461d52a4b732239adb385c51d4d6。
- 原内置侧车摘要：3f2429513ced8ae8a68374a34a2141c8287cb998c1a8d292cde20046a6ed1a5a。

当前D增强A3的validateKnowledge返回0诊断；不是沿用旧A1的139条needs-review统计。未自行更改任何知识状态。createAibDesignAdapter({revision:4})校验输入和输出摘要；revision1/3调用继续隔离。

## 变更文件（本轮B范围）

- authored/activities.v4.chapter1.cjs、activities.v4.applied.cjs：33项活动设计。
- authored/section-designs.v4.cjs：38节内容职责与场景主题；authored/review-v4.json：已审快照绑定。
- templates/core-foundations.cjs、templates/strategist.cjs：内置1.1专用活动与入口。
- teaching-map.cjs、legacy-teaching-map.cjs、learning-flow.cjs：每节接入说明与可执行门控参考。
- generate-aib-v4.cjs：候选、已审方案、侧车与逐节说明生成；aib-adapter.cjs、index.cjs：revision4和门控导出。
- generated下上述8个v4文件，candidates下对应评审快照。
- tests/aib-v4.test.cjs：新增8项实质验收；README.md、C-handoff.v4.md、revision4-plan.md及本报告。

未修改共享契约、知识原文、游戏、服务、根构建脚本或dist。发现C正在共享目录并行修改游戏文件，未触碰、提交或计入B成果。

## 验收命令与实际结果

1. node packages/learning-design/generate-aib-v4.cjs：候选生成成功。
2. node packages/learning-design/generate-aib-v4.cjs --reviewed：审阅哈希匹配，已审产物生成成功；144学习卡/145轮/144题、38节，validateLearningPlan=[]，compileCourse成功。
3. node scripts/test-module.cjs design：26 tests，26 pass，0 fail。包含历史v1/v3及本轮8项测试：全部节的物件/引用/先修、145轮标准解与典型错解、自由浏览不通关、后续节提交阻挡、四章独立、JSON恢复、篡改侧车门槛/依赖/版本拒绝、内置1.1八轮、revision4注入及旧版隔离。
4. node scripts/check-contracts.cjs：PASS。
5. node --test tests/pipeline-contracts.test.cjs：9 tests，9 pass，0 fail。

未运行根build、未写发布目录、未将hook当测试、未宣称已完成C浏览器接线。

## 跨模型评审与修正

两路gpt-6-astra只读评审：第一章19项变更、原知识1.1全部22单元、内置1.1八轮；其他14变更、38节145轮门控及13节legacy映射。33项变更重新语义评审，106未改项精确继承v3逐项审阅，全部保留对应teachingHash。

评审发现侧车仅校验内嵌hash会让删除先修/清空门槛绕过，已改为重建规范整图比对并克隆输入；四类篡改复测拒绝。内置模板曾误写“本节后正式练习”，双语已修为本章全部交付。最后三连分类改成告警记录修复，明确不延迟紧急回退。内容、标准答案、错解及最终产物hash复核PASS。评审范围不替代C/D页面或发布验收。

## D/C下一步与已知限制

1. D核对C-handoff与generated摘要，解除scripts/enrich-knowledge.cjs对内置1.1强制match的特例，否则模板永远不会接入；B没有越权改该根脚本。
2. C将自由浏览与必做状态分离，按侧车每个物件control/roundId接入，不把所有内容改成花盆或定义配对。共享目录C可能已在修访问逻辑，应核对本说明而非重复覆盖。
3. D当前/api/aib-course仍选v3；接收后才切v4，按新版本保留历史进度。来源或蓝图变化需重新审阅，不只改哈希。
4. C/D验收真实页面的触屏/键盘、锁定反馈、三语言、逐章解锁、90%门槛、错题与非空存档恢复，再决定发布；本轮交付教学数据与门控参考，未完成这些UI动作。
5. 部分继承正式题的quote定位较宽，本轮没有擅改已审题目；若要提高引用精度需另做语义修订及绑定。基础排序/固定编码修复不等于独立迁移能力证明。

没有新增共享ActivityRound类型。侧车为B内部b-c-teaching-map格式，不擅自扩展冻结LearningPlan；将其纳入正式共享契约和浏览器构建需D决定。本轮不建议修改根AGENTS。

## 分支与提交

共享main；开工HEAD=f0be257f880f56765641fd65f33675f4a1bfdf46。未切分支、提交、重置清理、合并或发布；不提交C并行文件。按共享目录约定，根进展由D汇总，本轮只更新B独占报告。

## 可复制交接增量

B revision4已完成逐节差异化复核：AIB38节单控件8→0、三连同操作11→0；33单元重设操作，139单元/58目标仍全覆盖，144卡/145轮/144题。原内置1.1另补8轮，覆盖22单元；自由浏览与必做先修已拆清。指针：packages/learning-design/C-handoff.v4.md、generated/C-section-guide.v4.md及aib-learning-plan.v4.json。design26/26、pipeline9/9、契约PASS，跨模型复核通过。请用户把本报告交D/C；D解除内置1.1构建match特例，C按侧车接入物件/状态后做页面验收。B未联系其他开发对话、合并或发布。


## 历史交付记录（revision1；以下不作为本轮最新入口）

# B-learning-design 交付报告

状态：A 的139单元完整教学适配已完成并通过B验收，供D集成；未自行合并或发布。

## 完成内容

- 保留固定包独立开发结果，继续对 A 实际 aib-knowledge 逐单元编写教学任务，覆盖4章、58目标、139独立单元。每单元有双语教学理由、易错点、活动情境、可执行判定、推理反馈、回看方向及带原证据的正式题。
- 四个作者文件是教学真源；不是按关键词猜控件或把全部知识改成配对。保留7类操作，数字、角色、预算、阈值、序列均明示为本演练条件。
- 适配器先在每章做先修闭包与拓扑排序，再按最多4单元分节；各章第一节无跨章锁。四章分别12/8/7/11节，满足冻结20节上限。第四章补学3个治理先修，因此总142卡/142轮/142正式题，独立单元仍139。
- 每节先读全部基础卡，再形成性应用；章交付后才进入正式练习与复习，是D/C应落实的集成顺序。本轮通过brief明确提示，未伪装成新增前端解锁机制。
- 提供可注入 createAibDesignAdapter；完整知识摘要、单元来源摘要和输出摘要同时绑定，拒绝新知识直接沿用旧教学、或同知识混入不同教学蓝图。未知材料仍需显式作者/模型设计，不能默认退回固定题。

## 输入输出版本与完整样例

所有共享输入输出 schemaVersion=1，未修改冻结契约。

- 输入：packages/knowledge/generated/materials.v1.json，aib-knowledge-materials revision=1；knowledge.v1.json，aib-knowledge revision=1。
- 输入摘要：e62f4fa1413371f05d4f06b607a6020b3609cf044b6401304c65778c48a10c31。作者审阅基线存 authored/input-snapshot.v1.json。
- 输出：packages/learning-design/generated/aib-learning-plan.v1.json，aib-learning-plan revision=1，knowledgePackId/knowledgeRevision与输入对应。
- 输出摘要：0c52d202fd6bf93f13b6033455f152cd3af49e7d62e339a030de46e0ee022ffa；计数、摘要以 generated/aib-manifest.v1.json 为准。
- 完整可执行作者输入：generated/aib-blueprint.v1.json；完整编译副本：generated/aib-course.v1.json，均位于B包内，不是dist发布。
- 逐单元教学选择、误区、先修、章节位置、复习策略：generated/aib-unit-audit.v1.json。
- 固定知识包的 examples/blueprint.v1.json、learning-plan.v1.json 保留；examples/a-adaptation-check.json 已更新为全量适配通过，取代旧的固定包拒绝探测状态。

## 交互设计依据与判定

| 内容 | 具体选择与理解证据 | 常见错解及反馈 |
|---|---|---|
| 概念/方案边界 | choose在具体用例中选证据或行动；sort区分预测/生成/行动、训练/推理、职责或漂移 | 按AI标签猜答案或证据不足就下结论；反馈指出观察与推断区别并回看来源 |
| 流程/先修 | order重建给定RAG、编排、治理、监测或转型依赖；初始卡片不预先排好 | 未取证先写作、未验证先扩展；反馈解释依赖，案例顺序不冒充所有项目规律 |
| 数值 | number计算词元共享预算、成本/净收益/ROI、业务指标；假设与单位明示 | 漏运行成本、用总收益代净收益、漏输出词元；反馈完整算式 |
| 权限/监督 | matrix精确选取角色×行动或资料访问；多授和少授都不通过 | 以模型自信代授权、全选图方便；反馈逐项对照角色任务与边界 |
| 业务硬约束 | allocate在授权、必做控制、预算与最低值中选择可行组合 | 高价值不能抵消禁止项或必需审查；反馈解释约束组合，仅演练评分 |
| 记录/数据契约 | edit修复运行交接单与规范化记录，按政策/职责/验证证据输入稳定编码 | 将实际失败率当政策阈值、按姓名替主键、混用日期格式；反馈定位错因和回看方向 |

最终轮次分布：choose90、sort20、order15、number6、matrix5、edit4、allocate2，共142。未为凑8类而使用教材没有统一依据的rate。

每单元至少1个理解检查、1题正式检索；题目quote逐字属于关联unit evidence，编译保留unit稳定关联。第一章45题在独立评审后全部改成与活动不同的诊断/迁移情境。跨章补学复用基础检索题，只作复习，不宣称新迁移题。其余章节正式题包含用例诊断、证据缺口、错误修复或下一步判断。

复习：整章交付后无提示检索；错题按unitIds回看基础和reason后重做；下次学习混合不同单元。改变数值、角色或条件时重审标准答案，不能将演练设定当知识事实。间隔调度、错题存档和前端解锁由D/C实现。

## 变更文件（本轮及累计B交付）

- packages/learning-design/index.cjs：导出通用与AIB注入适配器。
- packages/learning-design/designer.cjs：先修闭包、顺序分节、逐单元引用与题目组装。
- packages/learning-design/aib-adapter.cjs：实际知识快照和教学输出摘要保护。
- packages/learning-design/generate-aib.cjs：作者蓝图→方案→编译副本与审计产物的可复现生成。
- packages/learning-design/authored/chapter-1.cjs 至 chapter-4.cjs：45/30/26/38单元的逐项教学设计。
- packages/learning-design/authored/input-snapshot.v1.json：作者审阅基线。
- packages/learning-design/generated/aib-blueprint.v1.json、aib-learning-plan.v1.json、aib-course.v1.json、aib-manifest.v1.json、aib-unit-audit.v1.json：完整产物。
- packages/learning-design/examples/blueprint.v1.json、learning-plan.v1.json、a-adaptation-check.json：固定样例与全量探测结论。
- packages/learning-design/tests/designer.test.cjs、aib.test.cjs：固定与实际知识包测试。
- packages/learning-design/README.md、review.v1.md：运行方式、教学依据与独立评审闭环。
- flow/tasks/B-learning-design.report.md：本报告。

未修改共享契约、知识原文、游戏、服务、根脚本或dist。共享目录其他对话改动不属于B交付；根进展按共享规则由D汇总。

## 验收命令与实际结果

1. node packages/learning-design/generate-aib.cjs：通过；139独立单元、58目标、38小节、142学习卡、142轮活动、142题；validateLearningPlan 0诊断；compileCourse成功。
2. node scripts/test-module.cjs design：15 tests，15 pass，0 fail。覆盖目标/引用/双语、逐章先修、补学、所有控件标准答案和典型错解、排序非预先解答、完整编译、每小节工作坊提交与mastered、版本/取消/知识变更/混入旧蓝图负向校验。
3. node scripts/check-contracts.cjs：PASS；冻结基线仍编译为4章4题。
4. node --test tests/pipeline-contracts.test.cjs：9 tests，9 pass，0 fail。

A实际材料→知识来源校验0 error、139 needs-review warning；没有抹掉警告或提升supported。编译副本保留142张学习卡的sourceUnitId、来源引文和双语；每轮正确操作通过、典型错解拒绝，完成后运行时mastered与存档结构验证通过。没有将hook视为验收。

## 跨模型评审

不同模型 gpt-6-astra 逐项审核139单元，75与64单元分组；复核四个作者文件及适配器/生成逻辑。首轮发现漂移条件不充分、第一章正式题重复活动、交接修复题照抄、第四章问答不匹配；全部修订并复核通过。额外将记录修复改为真实输入规范化，并采纳教学输出摘要核对建议。详细指针：packages/learning-design/review.v1.md。最终无已知阻断问题。

## 未完成事项与已知限制

- B任务卡的139单元教学适配、可注入实现、来源关联和自动验收已完成；D尚需在实际游戏入口验收阶段解锁、三语言显示、刷新存档和集成发布，本轮不接管。
- 139单元原文全部needs-review；原知识的官方来源完整性、标准时效与双语细节仍以A报告和审校为准。教学评审不能认证原知识。未新增外部事实或资料来源。
- 每单元1道正式题可用于基础检索与错误诊断，不是穷尽题库、考试等值或心理测量有效性的证明；跨章补学题可能重复。
- 所有显式依赖在章内排序；同节基础卡需按learnUnitIds顺序呈现并在活动前学完。v1没有细化阶段/逐选项反馈/复习间隔字段，需D/C落实现有状态机制。
- 通用任意材料仍需要人工或D注入模型生成作者活动；本轮无线上模型实调用、密钥或自动发布。结构通过不能取代新材料的语义评审。

## 接口变更建议（交D决定）

本轮无需修改schemaVersion=1或八类控件。maxUnitsPerSection、rationale、misconception和审阅基线仅属于B内部作者格式，不混入共享LearningPlan。后续可评估显式阶段门、逐选项错误反馈、复习调度字段及章节先修补学标签；由D统一升级契约/类型/样例/编译。无新增根AGENTS长期约定建议。

## 分支与提交

共用主目录main，核对HEAD=9f7f67b57ad3f4e5ba07a4685d1f8359733edfb7。本轮没有提交，不切换分支、不重置清理、不合并，不提交其他对话文件。

## 交接增量

B完成A的139单元/58目标完整教学适配；四章38节，含补学142卡/142轮/142正式题、七类操作。独立评审修订闭环通过，design 15/15、pipeline 9/9、冻结契约PASS。产物指针：packages/learning-design/generated/aib-learning-plan.v1.json、aib-manifest.v1.json及README；原知识139条needs-review保留。下一步：用户把本报告交回原D集成对话，由D读取实际方案、浏览器验收并决定集成发布；B未自行联系其他对话、合并或发布。
