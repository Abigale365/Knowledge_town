# A 一小时生效排查报告

时间：2026-10-23 04:22 PDT（11:22 UTC）开始核验；窗口截止05:20:04 PDT（12:20:04 UTC）。角色A，仅只读检查发布数据/源码及写本报告，不改知识、冻结输入、服务或dist。初始额度检查usedPercent=2，剩98%，未触发≤10%收尾。分支main，核验HEAD=2dd3d2af0e4f8a0bcede4842aa796d53e8290066；本轮无提交。

## 结论：玩家看不见“新知识”有数据依据

本地8782的index、B5目录、B4目录与旧默认课程文件均HTTP 200，响应正文SHA256与当时dist文件一致。这证明服务器提供了这些发布文件，不证明玩家当前标签无缓存、已选B5或真实UI可见。

**B5升级的是教学revision，不是新的知识revision。** 两条B5路线knowledgeRevision仍为3。按sourceUnitId逐项比较，B4→B5：aib全部144张卡的body/example/quote/source相同；legacy全部139张也相同。因此不能让玩家仅凭卡片定义判断是否升级到B5。

进一步对照旧默认chapter-course：legacy5保留全部139张body、quote、example，知识来源仍为原大纲/伴读；aib5有144张卡，其中132张body与原对应单元相同、12张正文有修订，144张quote改变、108张example改变（含原创教学例示标签，不等于108个新知识）。这不是B5新增139个新定义。

## 必须分清的课程ID

| 数据/选择键 | 实际课程ID | 知识/教学版本 |
| --- | --- | --- |
| 原默认dist/chapter-course.js | ai-business-strategist-course-v1 | 原默认课程，非B5目录 |
| B4 legacy | course-11fu42t | legacy-knowledge rev3 / legacy-teaching rev4 |
| B5 legacy5 | course-87vtar | legacy-knowledge rev3 / legacy-teaching rev5 |
| B4 aib | course-2iajim | aib-knowledge-integration rev3 / aib-learning-plan rev4 |
| B5 aib5 | course-c5mcdg | aib-knowledge-integration rev3 / aib-learning-plan rev5 |

源码dist/teaching-v5-ui.js将默认openTeachingCourse参数改为legacy5；没有现存bank时初始化调用该函数，但现存bank/存档保留。B4的“进入新版教学5（旧课程和进度保留）”按钮按原knowledgePackId选择legacy5或aib5，不会把legacy自动变成aib。未确认玩家实际选择，不应断言其正在看aib5。A不修改或清除旧档。

## 玩家可核对的三个具体例子（aib5与旧默认对照）

以下是知识数据中的确切节号/卡号。需先由D确认进入course-c5mcdg；在legacy5看不到这些aib修订是符合数据设计的。卡片依据位于“学习目标与依据”折叠区；这里只核数据与渲染代码，未实际点击浏览器。原始单元ID用于追溯，不一定等于重排后的显示卡号。

### 1. 规则还是学习型AI：出现新增边界句

- aib5节1.6，卡1.6-lesson-3，原单元1.2-lesson-1。
- 原默认节1.2正文：“模式复杂、规则难穷举时再评估AI；比较价值、错误后果和维护成本。”
- aib5改成“再评估学习型AI”，并增加：“这是选型起点，规则系统也可能属于AI，规则多起来后未必更易维护。”
- 用户可直接找这句新增边界；依据预览显示IBM的ML/AI关系摘录及reviewed-primary-sources-r3位置。完整审校还绑定Google Rules of ML、AWS成本与NIST MANAGE；不能把首条短摘录当作整段结论的全部证据。
- 原审校来源指针：https://developers.google.com/machine-learning/guides/rules-of-ml （本轮不重新检索外网）。

### 2. 检测、限制、调查与恢复：日志不再无条件存输入输出

- aib5节3.6，卡3.6-lesson-3，原单元3.3.1-unit-1；原默认位于节3.3。
- 原正文起句：“记录模型版本、输入、输出和告警以便追踪”。
- aib5起句改为按必要性记录版本/告警/事件标识；确需记录输入输出时先最小化与脱敏、限制访问并设置留存期限，避免敏感原文进入日志。
- 这是可逐句核对的知识边界变化，不只是按钮换名称。完整证据在analysis.v3审校条目；卡片首条预览是结构化反馈摘录，不独自证明全部隐私限定。
- 对应日志政策来源指针：https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops05-bp03.html 。

### 3. ROI公式与核算边界：定义熟悉，但来源和假设标签不同

- aib5节2.6，卡2.6-lesson-1，原单元2.2.3-unit-1；原默认节2.2。
- 两者公式正文相同；aib5例子前增加“教学例示（非来源原例）”，仍是收益150万元、成本100万元、ROI50%。这些数值不是外部实测收益。
- 原默认quote是大纲目标“通过使用全面的框架来计算AI的投资回报”；aib5quote变为“ROI % = Net_Benefit / Annual_TCO × 100”，source指向reviewed-primary-sources-r3 · UTF16:9768-9806。
- 对应Microsoft一手来源指针：https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process 。

## 来源可见性的现有限制（交D判断，不在A范围修改）

这三张aib5卡的references数组均为空。knowledge-play.js的链接仅从references生成，quote/source显示在折叠区；因此不能承诺玩家能点击外部一手网页，当前可见更多是摘录与内部materialId/UTF16定位。完整URL仍在analysis.v3来源登记中。建议D说明实际入口/路线，再决定是否需要把外部来源链接带到卡片；A不改接口或发布数据。

## 只读核验入口与实际结果

- Node fetch读取http://127.0.0.1:8782/{index.html,teaching-catalog-v5.js,teaching-catalog.js,chapter-course.js}，四项200，正文digest逐项等于dist；未重启/构建服务。
- Node vm读取目录数据，按sourceUnitId比较body/example/quote/source；B4→B5逐项相同：aib144/144、legacy139/139。对原chapter-course逐项统计见顶部。
- Node读取analysis.v3.audit与sources，将3个原单元的证据ID映射到已登记URL；本轮未重新验证网站实时可访问性。
- 源码只读：scripts/teaching-catalog-v5.cjs、dist/teaching-v5-ui.js、apps/game/src/teaching-flow-ui.js、knowledge-play.js。未重跑全模块测试、未清缓存/旧档、未修改银行或冻结材料。
- 冻结materials.v3/knowledge.v3/analysis.v3字节hash与既有frozen-inputs记录一致。
- 不同模型独立只读短复核PASS：重新核对两目录逐字段计数、5个课程ID、3个例子位置/来源映射、空references与默认legacy5/旧档逻辑；未重复HTTP读取或跑全测试。HTTP结果为A本轮实际读取记录，非评审代验。

未验：玩家实际标签/地址/选中bank、真实浏览器点击与折叠区布局、用户缓存状态；由D核入口/接线与最终汇总。其他A候选旁车没有自动进入卡片，不能当作玩家已看到的变化。
