# A 知识库工程交付报告

## 最新：剩余35条来源补证与材料缺口收束（revision 3）

日期：2026-10-20（America/Los_Angeles）。本节为最新结果，后文 revision 2/1 为历史记录。

### 完成内容与结论

上一轮的35条未决单元全部获得充分的一手资料依据，已同步核对中文、英文、例子、边界及先修关系，并改为 supported。**最新139条全部supported，needs-review=0，gap状态=0，KnowledgePack.gaps=[]。** 没有仅删去missing或用教学补充自引来升级。

| 补证范围 | 原未决 | 本轮补齐 | 仍未解决 |
| --- | ---: | ---: | ---: |
| 领域1：概念、选型、编排、监测和提示评测 | 9 | 9 | 0 |
| 领域2：采购、迁移、价值计量和投资判断 | 12 | 12 | 0 |
| 领域3/4：监督、偏差、数据治理和人员转型 | 14 | 14 | 0 |
| 合计 | 35 | 35 | 0 |

新增36条一手来源登记（12+8+16），累计102条、101个不同URL。主要包括NIST风险/偏差资料、Google Rules of ML、AWS监控/部署/编排文档、Anthropic提示与评测技术文档、英国政府AI采购/数据质量/技能与收益框架、Microsoft迁移与价值衡量文档、OECD原始报告、原始研究论文及监管机构监督指南。短原文锚点有逐条对应的URL与核验日期，rationale说明实际阅读的章节和支持范围；searchNotes保留检索结果及判定。未将标题相似的链接当作证据。

本轮的重要内容修订：

- 规则与模型选型明确区分学习型AI，避免暗示所有规则系统均不属于AI；代理交接须保留来源、状态，并由组织指定人类处置责任。
- 监测闭环说明调查后选择重训、回退或用途调整，验证变更后再扩大部署；按预案紧急回退不必等待全部调查结束。
- 提示资料分隔只作为理解辅助，明确不能保证防注入或代替资源权限控制；评测需代表性任务、边界/失败情况、版本与保留测试集。
- 竞争投资边界由绝对的“不是依据”修正为“不能仅凭竞品投入决定”；采购、行业指标方法不冒充各地区一律适用的法律或阈值。
- 标注分歧不自动等于标注错误；公平性须结合任务与群体。数据质量不再暗示唯一固定五维标准。
- 员工信任后果表述为可能；心理安全原始研究不被夸大成任何激励机制必然有效。重复性工作仅是自动化候选特征，不等于授权或可移交岗位责任。
- 岗位练习、POC和黑客马拉松的评估者、任务证据、通过标准和接手责任须由组织制定。公共原则支持本单元的设计知识，不伪称本项目已持有获批的人事考核量表。

104条原supported单元的内容字段保持不变，只有原文证据重新定位至新版本材料；其解释、标题、类别、例子、边界、目标映射、先修和状态均有回归比对。96条先修关联继续有效且无环。不存在仍未补齐的这35条知识缺口，因此无需以“确实无法获取”保留条目；具体组织阈值、授权人和政策仍属于使用时的实施工作，而不是伪造为已经取得的资料。

### 变更文件、版本与可复现入口

- `packages/knowledge/complete-gaps.cjs`：只对上一轮pending单元应用完整后续决定；校验三份基线内容指纹、原知识清单哈希、包/分析一致性和版本；拒绝漏审、重复或更改已支持条目。
- `packages/knowledge/review-corpus.cjs`：输出路径跟随实际修订号，新增资料采用独立materialId，保留所有历史材料；写前继续校验，不把其他错误当知识缺口放行。
- `packages/knowledge/review/round3/manifest.json`：输入指纹、revision 2基线及revision 3输出约定。
- `packages/knowledge/review/round3/domain1.json`、`domain2.json`、`domain34.json`：9/12/14条完整补证，含previousMissing、searchNotes、新来源与逐条结论。
- `packages/knowledge/tests/completion.test.cjs`：新增6项测试，含全部35条真实补证、104条内容不变、历史材料保留、版本/来源冲突与失败保护。
- `packages/knowledge/generated/materials.v3.json`、`knowledge.v3.json`、`analysis.v3.json`：最新完整材料/知识包及139条分析。
- `packages/knowledge/generated/gaps.v3.json`：空数组；`gap-resolution.v3.json`：35条从原缺口到新依据/结论的逐项记录；`review.v3.md`：完整可读双语审校内容。
- `packages/knowledge/README.md`、本报告：更新复现及交接。

输入为 revision 2 的资料包、知识包、分析及原139单元清单；输出仍使用 `schemaVersion=1`，MaterialBundle id=`aib-knowledge-materials`、revision=3，KnowledgePack id=`aib-knowledge`、revision=3、materialRevision=3。新增独立一手摘录与双语解释后共7份材料，上一轮5份材料正文与contentHash逐项保留，v1/v2文件未覆盖。原知识清单哈希仍为 `4e79e33540b63f01939addff812b56d04e74b27d32c33cc2061104d9b070c8de`；基线指纹详见round3 manifest。

### 重新验收的实际结果

1. `node packages/knowledge/complete-gaps.cjs`：成功；139 units、58 objectives、102 source records、139 supported、0 needs-review、0 gaps。
2. `node scripts/test-module.cjs knowledge`：**21 tests、21 pass、0 fail**，包含新revision 3真实数据回归；原v1/v2测试仍保留并通过。
3. `node scripts/check-contracts.cjs`：**PASS**，冻结schema v1样例仍编译4章4题。
4. 对真实修订包执行 `validateKnowledge(knowledge.v3,materials.v3)` 和 `assertValid`：**diagnostics=[]，0 errors、0 warnings**；139条全部supported，58目标双向映射完整，96条先修无环，旧材料版本拒绝混配。
5. 不同于主实现模型的独立代码复核：**PASS**，实际运行测试19/19（随后仅扩充回归到最终21/21），确认只改原pending、104条内容不变、历史材料保留、revision/指纹校验及写前保护。第1领域9条补证又经另一只读审查，实际打开全部12条新来源，**PASS**；第3/4领域14条的16个新来源及双语限定也经独立只读复核，**PASS**，未发现靠删除要求、伪造本组织政策或来源错配升级的情况。

### 剩余限制、接口建议与交回D

这35条定义与设计原则的资料缺口已清零；不表示取得私有课程全文、官方试题解释、付费标准全文或用户组织内部审批文件。supported表示有一手支持并经AI领域/双语审校，不是官方背书、人工专家认证、具体法律合规结论或组织政策已批准。特定地区监管、厂商实现与行业研究均有适用范围说明；组织仍需为自身场景制定阈值、量表、责任、授权与验收。

**共享接口没有变更。D应使用成对的 `materials.v3.json` / `knowledge.v3.json`，并重新生成引用knowledgeRevision=3的教学方案；不能沿用绑定旧知识版本的方案。** 本轮只验收A知识包与冻结样例，没有冒充完成B/C/D整条课程或游戏发布验收。未运行根发布构建、未修改其他模块/共享契约/dist，也未自行联系D或发布。

分支/提交：共享目录 `main`，本轮开始时HEAD=`9f7f67b57ad3f4e5ba07a4685d1f8359733edfb7`；本轮未创建提交、切分支、合并或发布，不提交其他对话文件。根进展由D汇总。

**交接棒：A已补齐剩余35条证据，最新139条全部supported、gaps为空；新产物看 `packages/knowledge/generated/*v3*`，逐条补证看 `gap-resolution.v3.json`。21项模块测试、冻结样例和真实知识包校验通过。请用户将本报告交回原D集成对话，由D接入revision 3并完成教学/游戏链路验收及发布。**

---

## 上一轮：139 单元领域、双语、来源和先修全量审校（revision 2）

日期：2026-10-20（America/Los_Angeles）。本节为上一轮历史结果；最新revision 3见报告顶部。

### 完成内容与结论

全部 139 单元已逐条核对标题、定义、例子、易混边界、中英文含义、来源支持范围和先修关系。139 条英文定义均补齐或修订，35 条双语标题有修订；原创例示明确标注，不冒充官方题目或来源原例。审稿模型为 gpt-6-astra，主实现模型与审稿模型不同。

- **104 supported**：核心解释有独立一手资料支持，双语限定已核对；不是只因教学补充中有同一句话而升级状态。
- **35 needs-review**：审校已做，剩余问题是具体证据或适用条件不足；每条列出 missing 与 requiredMaterial，同时写入 KnowledgePack.gaps，不能当作已补齐。
- status=gap 的单元为 0：剩余35条均有部分依据，但尚不足以完整支持条目。**这不表示 gaps 为空。完整包仍被 knowledge.gap 阻断编译。**
- 共核验66条一手来源登记，涉及65个不同URL（同一AWS安全文章由两领域复用相同摘录）。保留短原文锚点、URL、核验日期与逐条正文段落说明；不把原有阅读链接列表冒充已获取正文。
- 逐条保留或调整先修依赖及理由，最终96条关联，全部有效且无环；这些是明确标识的教学依赖建议，不宣称来源规定唯一学习顺序。

| 任务 | supported | needs-review / 缺证 |
| --- | ---: | ---: |
| 1.1 | 21 | 1 |
| 1.2 | 8 | 5 |
| 1.3 | 7 | 3 |
| 2.1 | 4 | 6 |
| 2.2 | 7 | 5 |
| 2.3 | 7 | 1 |
| 3.1 | 8 | 2 |
| 3.2 | 8 | 0 |
| 3.3 | 6 | 2 |
| 4.1 | 8 | 0 |
| 4.2 | 4 | 2 |
| 4.3 | 4 | 8 |
| 4.4 | 12 | 0 |
| 合计 | 104 | 35 |

实质修正：`3.3.1-unit-1` 不再要求无条件保存输入输出，加入必要性、最小化、脱敏、访问与留存限制；`2.2.2-unit-1` 说明分阶段试验必须有适当对照并处理时间趋势，避免把简单分批上线误当因果证据。

### 本轮变更文件与产物指针

- `packages/knowledge/review/{manifest,domain1,domain2,domain34}.json`：基线SHA256绑定和139条逐项审校结论、改后的双语正文、先修理由、来源与缺口。
- `packages/knowledge/review-corpus.cjs`：审校版生成器，完整覆盖与独立来源门槛、基线关系/版本校验、输出前校验。
- `packages/knowledge/tests/review.test.cjs`：审校门槛、真实139条、失配版本、错误候选不覆盖已有文件等7项新增测试。
- `packages/knowledge/generated/materials.v2.json`：首版3份原材料原文/哈希完整保留，新增独立一手摘录与审校解释，共5份资料。
- `packages/knowledge/generated/knowledge.v2.json`：139单元与58目标的修订知识包，104 supported、35 needs-review、35 gaps。
- `packages/knowledge/generated/analysis.v2.json`：逐条审校、字段变更、原/新先修、来源、目标级完整/部分支持状态与契约诊断。
- `packages/knowledge/generated/gaps.v2.json`：35条待补证据及所需资料的可执行清单。
- `packages/knowledge/generated/review.v2.md`：可直接逐条阅读的中英定义、例子、边界、依据与缺口。
- `packages/knowledge/README.md`、本报告：更新重建、状态解释、限制及交接。

首版 `generated/*.v1.json` 保留。未修改共享契约、其他模块、content原用户材料、dist或根发布脚本；未发布。

### 输入输出版本与验收结果

- 输入基线 MaterialBundle / KnowledgePack revision=1；原知识清单SHA256：`4e79e33540b63f01939addff812b56d04e74b27d32c33cc2061104d9b070c8de`，记录在 manifest。基线包之间的来源ID/版本及manifest指定修订号必须匹配，旧审校不能直接套用新原料。
- 输出 MaterialBundle id=`aib-knowledge-materials`，revision=2；KnowledgePack id=`aib-knowledge`，revision=2、materialRevision=2；**schemaVersion 均仍为冻结的1**。文件名v2仅表示资料/知识修订，未升级共享schema。
- `node packages/knowledge/review-corpus.cjs`：成功，139 units / 58 objectives / 66 source records / 104 supported / 35 needs-review / 35 gaps；无来源错配、缺译、错误映射或先修环。
- `node scripts/test-module.cjs knowledge`：**15 tests、15 pass、0 fail**。包含原8项及新增7项；验证首版哈希不变、139条一一审校、独立引文、缺口不被映射隐藏、失配基线被拒绝、先修环不会覆盖已有产物。
- `node scripts/check-contracts.cjs`：**PASS**，冻结v1样例仍可编译4章4题。
- 对真实修订包执行 `validateKnowledge(pack,bundle)`：35条review warning；唯一 error 为 `knowledge.gap`（35条未决清单造成），其余error=0。此结果表示结构/引用/关系检查通过但资料不充分，**不能写成完整包可编译PASS**。
- 独立代码评审首轮 FAIL，指出先写文件再检查错误、基线版本/对应关系未校验；已修复并加回归。第二轮 **PASS**，审稿模型实际运行模块测试15/15通过。

### 未完成、限制与接口建议

35条待补详见 `generated/gaps.v2.json`，集中于：规则/AI选择与业务错误代价；代理交接与完整监测闭环；提示评测与指令混淆边界；采购合作/合同/退出条件；成本与收益计量、先导指标预测效度；部分责任比例、监督条件与偏差机制；数据契约/版本治理；岗位训练、人机分工、沟通与心理安全的具体方法。没有为提高supported数而删除这些限定或抹去缺口。

未获取私有课程正文、视频、官方题库答案或付费标准全文。标准仅核对公开概览；泛化的治理与财务原则未解释为任何地区的具体合规结论。supported表示AI领域与双语审查和一手支持，不是人工专家认证、官方背书或完整官方课程复刻。程序能校验逐字锚点、哈希和关系，无法自动证明网页内容真实性或所有语义蕴含；语义结论在审校记录中可人工复核。

接口无变更。D后续应使用成对的 `materials.v2.json` 和 `knowledge.v2.json`，先处理35个gaps；不得把v2知识包配首版材料或首版教学方案，也不得简单删除gaps以绕过编译门槛。共享契约的后续建议仍见首轮接口建议；本轮以侧车审校记录承载细节，不擅自扩展字段。

分支/提交：共享主目录 `main`；本轮未创建提交、未切换分支、未合并或发布。基线仍以首轮记录为参照，不提交其他对话文件。根进展由D汇总。

**交接棒：A已完成139条领域与双语逐项审校，104条supported，35条带具体材料缺口；96条先修关联无环。新产物见 `packages/knowledge/generated/*v2*`，逐条结果看 `review.v2.md`，待补材料看 `gaps.v2.json`。15项测试与冻结样例通过，独立代码复核PASS；完整修订包因真实缺口仍禁止编译。请用户将本报告交回原D集成对话，由D决定补证及集成。**

---

## 首轮交付（历史，仅描述 revision 1）

日期：2026-10-20（America/Los_Angeles）。角色 A；共享主目录 main。本报告是 A 独占交接记录，根进展由 D 汇总。

## 完成内容

- 新增可注入的目标识别 → 带章节/UTF-16 位置分段 → 单元提取 → 双向目标映射流程。模型连接和密钥仍由 D 注入，不生成游戏控件。
- 实现双语解释去重、来源合并、同名不同解释的冲突提示、遗漏目标与所需材料清单。冻结校验继续检查来源错配、双语缺失、先修缺失/循环及版本。取消在目标识别及每个片段调用前后检查。
- 整理完整当前课程范围：4 领域、13 任务、58 技能、139 双语单元，未局限于任务 1.1。58 项中文目标逐项配有英文目标；单元保留解释、类别、已有例子与易混边界。增加保守的跨技能先修建议；B 负责跨章复习安排。
- 将已有教学补充显式制作为独立版本 MaterialBundle 资料，保留原清单哈希、逐单元来源标签与阅读链接；139 单元全部 needs-review，未把大纲目标或未获取网页伪称为定义原文。
- 公开两主题小样例位于新增测试：水循环正文；库存大纲缺口、重复及冲突。真实整理流程产物在 generated，非冻结 fixture 的复制效果。

## 变更文件

- `packages/knowledge/index.cjs`：导出新增 API，保留现有 buildKnowledge 接口。
- `packages/knowledge/engine.cjs`：分段、可注入提取、组装与分析。
- `packages/knowledge/generate-corpus.cjs`：完整本地材料确定性整理器。
- `packages/knowledge/objectives-en.cjs`：58 技能英文语义翻译。
- `packages/knowledge/generated/materials.v1.json`：三份材料、正文哈希、教学补充独立快照。
- `packages/knowledge/generated/knowledge.v1.json`：实际生成的知识包。
- `packages/knowledge/generated/analysis.v1.json`：覆盖、诊断、出处、访问缺口、质量界限。
- `packages/knowledge/tests/engine.test.cjs`：新增 6 项测试，连同原有 2 项共 8 项。
- `packages/knowledge/README.md`：回调协议、复现、质量界限。
- `flow/tasks/A-knowledge.report.md`：本报告。

未改共享契约、其他模块、content 原用户材料、根脚本或 dist；未运行发布构建。

## 输入输出版本

- 输入 MaterialBundle schemaVersion=1，id=`aib-knowledge-materials`，revision=1。输入来源：四章大纲、完整伴读资料、既有 `content/knowledge-inventory.json` 的139单元快照。正文 SHA256 均在材料包；原清单 SHA256 位于 analysis.inputInventoryHash。
- 输出 KnowledgePack schemaVersion=1，id=`aib-knowledge`，revision=1，materialBundleId/materialRevision 对应上述输入。
- 原清单改变后需明确递增材料和知识 revision；当前脚本固定首版号，不能用首版号覆盖已进入集成的历史版本。

## 验收命令与实际结果

1. `node packages/knowledge/generate-corpus.cjs`：成功；58 skills、139 units、0 errors、139 review warnings。
2. `node scripts/test-module.cjs knowledge`：8 tests、8 pass、0 fail。覆盖来源错配、目标遗漏、去重/冲突、循环、缺译、调用前/过程中取消、重复原文绝对位置、全课程覆盖与英文目标要求。
3. `node scripts/check-contracts.cjs`：PASS；冻结 v1 三种样例编译为4章4题。
4. 真实生成包的 `validateKnowledge(pack,bundle)`：0 error；139 warning 对应139条显式 needs-review，非隐藏失败。

质量分析：覆盖数表示每项技能已有教学补充映射，不证明所有官方正文、技能子项深度或双语细节均已穷尽。已有部分英文解释比中文简略，不能宣称完全等义审校完成；不擅自提升 supported。来源校验保证引用逐字存在于正确资料；不能证明单元语义由该引文完整蕴含。现有139单元教学解释未擅自改写。

## 独立评审

按根规则由不同模型 gpt-6-astra 只读评审。首轮 FAIL，指出重复原文位置被覆盖及英文目标使用术语列表；两项已修并增加测试，二次复核 PASS；评审模型实际执行新增测试文件 6/6 通过，模块总测试为8/8。未联系其他开发对话，评审为本轮只读子任务。

## 未完成事项与已知限制

- 任意教材语义提取仍依赖 D 注入 identify/extractSegment 模型回调；本模块不包含线上模型凭证或实调用记录。两主题测试验证流程，不冒充模型理解质量。
- 私有课程正文、视频、官方题目及完整标准没有收齐。伴读资料是目录与复习说明，不能把其中链接当作正文。访问缺口单列 analysis，不冒充已解决。
- 未访问或重新核实外部阅读链接；它们只是继承的阅读线索。没有新增未经核实的“权威正文”。
- 139 单元仍需人工领域与双语细节审校；先修为人工建议，未声称原文明确给定。目标映射完整不等于全部学习细节充分。
- 分段按行、长行按长度，可能切开长段落；模型需使用 heading 和目标上下文，跨段复杂推理需 D 后续扩展。
- 精确归一化去重，不做向量近义合并；同名不同解释只标潜在冲突，不自动裁定真伪。回调需正确区分定义、原理、步骤、判断标准，不以目标文字充当正文。

## 接口建议（交 D 决定，未改契约）

1. 后续版本可为 evidence 增加数值 start/end 和来源类型，区分用户正文、独立教学解释、已获取权威摘录；v1 暂用 locator 与侧车分析。
2. 增加目标级正文证据、翻译审校状态、关系来源，以及访问缺口与阻断性知识缺口的不同字段；v1 不塞额外字段。
3. D 可按 README 注入分段回调；现有服务不自动启用新 adapter。先审阅 generated 的 needs-review 内容，再交 B；不要把全部警告批量抹除。

## 分支与提交

当前分支 `main`；基线提交 `9f7f67b57ad3f4e5ba07a4685d1f8359733edfb7`。共享目录内未切换分支、未提交、未合并发布。工作期间发现其他对话正修改 flow/plan.md 和 packages/learning-design，均未触碰或纳入 A 交付。

交接棒：A 完成全部58技能/139单元的可追溯整理及注入式处理流程，8项测试和冻结契约验收通过；全部单元仍需领域/双语审阅。产物看 `packages/knowledge/generated/`，接口用法看模块 README。请用户将本报告交回原 D 集成对话，由 D 审阅、集成并决定发布。
