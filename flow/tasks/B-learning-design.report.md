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
