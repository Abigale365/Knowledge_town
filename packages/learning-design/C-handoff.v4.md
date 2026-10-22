# B → C：逐节物件与学习门控（2026-10-22）

本文件是B教学交接，未声称C页面已接入。全量逐节职责、步骤、依赖和反馈见 [逐节说明](generated/C-section-guide.v4.md)，双语结构化数据见 [AIB 38节侧车](generated/aib-teaching-map.v4.json) 与 [内置13节侧车](generated/legacy-teaching-map.v4.json)。不修改共享LearningPlan契约。

## 两个1.1必须分清

| 入口 | 知识范围 | 必做应用 |
|---|---|---|
| 原内置课程1.1 | 22单元，六个1.1.x技能 | 8轮：方法依赖装配→映射/参数事件修复→学习证据分类→资料加工分流→去重及预测后果计算→独立验证排序→能力证据选择→框架范围判断 |
| AIB revision4编译1.1（sourceSectionId=b-c1-s1） | AI、ML、算法、模型4单元 | sort学习证据→choose立项依据→order给定执行链→edit输入/输出接线 |

其余原知识1.1概念分布于AIB 1.2—1.6等节。不要按显示数字1.1绑定美术/状态；必须使用课程/银行ID、教学版本和内容摘要作为命名空间，逻辑关联使用sourceUnitId、sourceSectionId和roundId。不可用翻译后的标题作ID。

## 物件职责

- 知识物件：定义、例子、边界、原文依据及定位，进入该章后全部可浏览，未来小节也可看；收藏与收集可选。打开、读过或收藏不记为掌握。
- 基础确认：表示已查看该知识并准备应用，仍遵守本章先修链。只记学习准备，不独立交付小节。当前侧车按基础卡顺序确认，再进入本节应用。
- 应用物件：每轮按control使用对应操作；题面可预览，未满足requiresStepIds只能看不能提交。成功条件只取原round的TaskWorkshop.grade；错解显示reason并保持当前步骤。
- 结果物件：本节全部必做操作成功后交付，推进下一节；不要把“收齐”“归位”“配对名称”“浇水”当成另一条通关路径。

分类台处理证据/职责边界；流程轨道处理给定依赖；计算台处理显式数值及单位；权限柜处理角色×资料/行动；资源盘处理硬约束；修复台处理错误记录；情境桌处理有依据的判断。可复用现有美术，但不能用同一花盆动作承载所有操作。order的“组装”是组装明确的执行/计算依赖，edit的“接线”是修复输入输出职责，均已有可执行判定，不是收三张“定义/例子/引文”后机械填槽。

## 解锁与状态参考实现

```js
const {designLearning, createAibDesignAdapter, createLearningFlow} = require('./packages/learning-design');
const {knowledgePack} = require('./packages/course-compiler/enrich-aib.cjs').enrichedAib();
const plan = await designLearning(knowledgePack, {design:createAibDesignAdapter({revision:4})});
const teachingMap = require('./packages/learning-design/generated/aib-teaching-map.v4.json');
const flow = createLearningFlow({knowledgePack, plan, teachingMap});
const progress = flow.fresh();
// 浏览后续节也允许，但不会推进必做链或考试解锁。
flow.browse(progress, 'b-chapter-1', '1.3.3-unit-2');
flow.gate(progress, stepId); // {unlocked, missingStepIds}
flow.confirmFoundation(progress, foundationStepId);
flow.submit(progress, applicationStepId, answer); // 正确才accepted
flow.chapterReadyForPractice(progress, 'b-chapter-1');
flow.validate(JSON.parse(JSON.stringify(progress))); // 保存恢复校验
```

这是Node/CommonJS可执行参考与测试接口，不是已加载到浏览器的脚本。C可以移植或由D的构建桥暴露它；如重写，须保留测试中的相同门控语义。每章独立进入；跨章先修已在本章补学。基础确认/必做提交受顺序约束，但只读知识浏览不需要先修。浏览后不要改动正在进行的studyState.section、round或mode；单独开只读视图。

整章所有必做应用通过才开启正式练习。正式测验沿用90%门槛；提交后即使失败也要能进入对应错题回看，不能把错题复习锁在先考过90%之后。其他章节不得因本章未通过而锁住。

旧版本进度保留在旧课程下，不清库、不reset。新版本foundation/answers不能默认为已完成；binding不一致需明确迁移策略。重开同一版本用validate复核保存答案和依赖，不能仅信completedIds。侧车若被删先修、清空practice门槛或换未知版本会被参考实现拒绝。

## D/C必须核对的现有接线点

1. D：`scripts/enrich-knowledge.cjs` 对1.1的特例把kind强制写成match并continue，绕过教学模板。应使用本轮 `templates/strategist.cjs['1.1']`（来自core-foundations.cjs），且保留原来源与入口。B未修改根脚本。
2. C：`knowledge-play.js` 的原reference视图要求先读过，普通视图限当前节；为“进入本章即可自由浏览”新增真正只读路径，避免把浏览当完成。并行C若已改相关逻辑，请按本侧车语义核对，而不是重复覆盖。
3. C：`openStudyBasket` / `showKnowledgeMatch` 中原1.1花房、收齐和配对说明不再作为唯一必做入口。`task-workshop-ui.js` 已有七类判定控件可复用；物件动作应按sidecar的control/roundId路由。
4. D：目前 `GET /api/aib-course` 仍选v3；接收本轮后再切到已绑定的v4。v4知识仍是D增强A3，教学revision=4，schemaVersion=1，不能把原A3或A1与增强来源教案混用。
5. C：逐章浏览、基础确认与应用门控的可视反馈、触屏/键盘操作、中文/英文/对照、刷新与重玩需做真实页面验收。B的测试证明数据与参考判定可执行，不替代这些UI测试。

## 限制

计算差额不能单独证明理解业务损失，排序给定依赖是基础应用而非无提示迁移；对应正式题与reason继续补足判断。v3正式题及引用本轮原样保留；部分引用较宽的精度问题不因换控件自动解决。来源改变必须重新语义审阅，不只改哈希。此任务没有统一组织评分标准或新控件契约；侧车只是B内部接入格式，新增正式共享字段由D决定。
