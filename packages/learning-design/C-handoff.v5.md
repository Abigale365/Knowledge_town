# B → C/D：教学逻辑 revision5 接入说明

状态：revision5已冻结并通过不同模型独立评审和B模块/契约验收。以 `generated/aib-manifest.v5.json` 和 `authored/review-v5.json` 的一致绑定接入；candidates仅作复现候选。B不改游戏实现、共享契约或存档结构。

## 产物与选择

- AIB四章38节：`generated/aib-learning-plan.v5.json`、`aib-course.v5.json`；具体教学链为 `teaching-logic.v5.json`。
- 原内置四章13节：`generated/legacy-teaching-logic.v5.json`，保持原章/节ID与知识映射；其中原1.1独立应用8轮，不能套用AIB1.1（4份知识）的内容。
- 原料：`authored/teaching-audit.v5.chapter*.cjs`、`authored/section-scaffolds.v5.cjs`、`templates/core-foundations.v5.cjs`。逐单元及逐节理由见两类 audit JSON 与 `B-section-audit.v5.md`。
- 输入为冻结A3增强快照，输出B5；manifest列知识、蓝图、方案、教学链、legacy、两类审核摘要。加载时同时验证版本与摘要，不只检查revision。`createAibDesignAdapter({revision:5})`拒绝不同知识快照。

## 每节物件与学习顺序

|职责|数据指针|操作和意义|解锁|
|---|---|---|---|
|知识物件|`necessaryKnowledge` / legacy `necessaryKnowledgeIds`|场景真实找到后登记发现；内容随时预览回看|章节可独立进入，不用上一章通关|
|收藏与整理柜|`discoveryAndFiling`|找到后可收藏；入柜移出随身栏，素材箱可回看|收藏可选，不能代替阅读或应用|
|基础确认|`requiresFoundations` / 原知识映射|文案“已查看基础，准备练习”，不能写“已掌握”|当前章内先修基础按学习顺序确认；不拦知识浏览|
|示范台|`demonstration.scenario/workedReasoning`|直接看推理，不要求输入示范答案，不记掌握|先修基础就绪|
|引导练习|`guidedPractice`|先尝试，可逐步提示或主动揭示；不计独立通过|看过本节示范|
|独立应用台|`independentApplication.rounds` / legacy `independentActivity`|新情境按具体控件提交；知识仍可回看|本节基础、示范、引导完成，先修节应用已完成|
|整章正式测验|`formalAssessment`|整章应用完成后进入；90%通过；失败也可回看解析|不能以收藏数量、基础确认或引导答对直接解锁|

每轮 `round.prompt` 是题面，`initialState` 是空白初始作答，`operation` 是具体动作，`control` 为8种共享控件之一，`grading.engine` 使用现有 `TaskWorkshop.grade`。标准答案只在私有判定和提交后的解析中使用，不能把 `answerWitness`、target、expected、内部ID显示成学习目标或输入要求。引导的 workedAnswer 提交前隐藏，主动揭示可用但要明确是示范帮助。

原内置13节的 `roundSpecifications` 提供同样的题面、初始状态、操作、知识提示、判定与反馈指针；`roundUnitIds` 将每轮定位到知识。原1.1的模型矩阵应显示自然语言资料/结果/权重记录，不再出现 history/forecast/train/infer 的抄写输入。

## 判定、逐项反馈与保留正确操作

老师复查增补：`generated/micro-checkpoints.v5.json` 提供按主题提前进入引导练习的入口。先查看 `requiredReviewedKnowledgeIds`（已含递归先修），再呈现该题；不等待整节全部知识、不以收藏/归档数量开题。原1.1首个微判断只需算法/模型两份知识，训练/推理入口需前四份，不再读完22份才判断；另外按标签、原料、模态及框架主题提供入口，不能按列表顺序机械强制全部做完。

相关知识旁只给一次轻量入口，不用弹窗强迫或因跳过反复提醒；玩家可继续阅读，稍后从练习面板回来。微判断复用 `exerciseRef` 指向的已审引导题，属于低压力可选练习；不扣生命、不设分数惩罚、不额外增加独立应用轮数。早期做过同一引导题后，晚些时候进入引导面板可继续/回看，不要求再做一遍。未做微判断的玩家仍按本节原示范/引导入口学习；完整基础及先修要求满足后才能综合应用，整章90%正式测验不变。知识/原文与证据可在操作附近打开，对错与对应知识定位不要分隔到远处。

参考实现导出 `teachingLogicV5.diagnoseRound(round, answer)`、`gradeStage(stage, round, answer, options)`；它们是B侧可执行说明，C/D自行接入现有环境。

1. 提交后保留当前草稿，禁止失败时清空已正确的输入/连线/分类。`diagnoseRound` 返回原草稿副本、每项label及correct；只标出实际有错的卡片、数值字段、顺序位置、矩阵格或预算约束。正确项显示“此项符合证据”，错误项显示对应项目和核验方向，结合该轮 `misconceptions` 提供知识定位。
2. 默认先给逐项诊断和知识回看；完整 `incorrectFeedback.explanation` 是该题推理解析，须由“查看本题解析”明确揭示或完成后展示，不应只弹笼统大段话。完整解析与标准答案不得自动填入作答草稿。
3. 逐项标对错也可能揭示二元题答案，因此保守地把失败后的具体诊断记为辅助；`assistanceRevealed:true` 或完整解释/答案已显示时，用 `solutionRevealed:true` 判订正。重新正确提交可以完成应用，但不能记作“独立掌握证据”。知识资料回看本身不算看本题答案。
4. `gradeStage`区分 applicationCompleted 与 applicationCredit。示范/引导始终无独立信用；独立应用只有未揭示本题帮助时正确作答才有独立证据。无论哪条路径都还需整章90%正式测验，不能把最终重试正确率写成学习准确率。
5. 辅助状态需要刷新后仍有效。若现存存档没有可靠记录，保守显示“应用订正完成，待正式测验确认”，不能刷新后恢复独立信用。B不要求扩展存档字段；由D决定适配方式。旧存档读到的通过记录也不自动证明B5已完成。

## 寻物流程与下一步文案

预览/阅读只是“已查看”；不触发found/favorite/mastery。真实物件点击登记“已找到”；才能收藏，收藏只是“保留”。入柜后不再随身显示，但归档对象持续在素材箱，取消收藏不应删除已归档记录。基础确认表示已准备练习；应用通过表示做完本节情境；整章90%才是整章通关。

找齐提示：“本节物件已找到，可收藏想保留的物件，读完后整理入柜，再进入示范与练习。”整理后提示：“基础已整理：看示范 → 做引导练习 → 换情境独立应用。”不要要求可选收藏才能解锁学习，不要将入柜后消失误报为资料丢失。四章独立进入，外章先修需本章可回看的补充知识；自由浏览后续内容不解锁后续活动。

## 旧草稿、版本与接入责任

保留原知识/正式题ID与所有旧产物。新活动沿用现有 Workshop signature 校验：旧signature与新活动不同，旧草稿不能按新 expected 重放为成功；只重置对应不兼容活动草稿/完成状态的处理交D，不能清空整份存档。原B4完成不等于看过B5示范或做过B5应用，迁移显示需如实标记。

D负责把当前教学目录revision4限制扩展到5、完整摘要绑定、两套课程映射、控件反馈接线和旧档回归。C负责可见题面、保留草稿、逐项错误、阶段文案、自由回看、先修门禁及窄屏/语言验收；若D仍独占teaching-flow文件，C将改动方案交D接线。B未运行真实浏览器、未确认游戏已接入、未构建dist或发布。静态结构及标准答案校验不能证明真实学习效果；仍需实际学习者测试。
