# 冻结接口 v1（D维护）

状态：已实现基础校验、依赖注入端口、样例和编译桥。A/B负责把端口发展成真正的知识/教学引擎；当前线上生成仍使用兼容的两轮API编排，prompt已分别归属A/B。不能把固定样例视为任意材料已自动转好课程。

## 唯一数据口径

- 类型：`packages/contracts/types.d.ts`。
- 执行校验：`packages/contracts/index.cjs`。
- 冻结样例：`packages/contracts/fixtures/materials.v1.json`、`knowledge.v1.json`、`learning-plan.v1.json`。
- 当前游戏格式与八类控件判定：`packages/contracts/runtime/`。
- 验收：`node scripts/check-contracts.cjs` 和 `node --test tests/pipeline-contracts.test.cjs`。

ID由字母/数字/点/横线/下划线组成，最多80字符；ID不随显示语言变化。schemaVersion固定为1，revision为正整数。A/B/C不可自行修改共享文件；需要新字段或行为时，在独占报告提出兼容方案，D更新版本、类型、样例与测试。

## A → B：KnowledgePack

输入 MaterialBundle 含资料包 id/revision、逐份 materialId/name/text/contentHash（UTF-8正文的SHA256）。每次正文改变更新revision与hash。最多50份、合计7MB；当前支持文字，其他格式先经过提取。

输出 KnowledgePack 含 materialBundleId/materialRevision、目标与知识的双向映射、单元的双语标题/解释/类别/例子/易混边界、先修ID、原文 evidence、status 与 gaps。status为 supported、needs-review 或 gap。原文引用必须能在同一materialId的text逐字找到，长度至少6；译文不是原文引文。例子和易混边界允许空数组，不能为了填满而编造。

每条目标都必须映射知识；引用不存在、遗漏、循环先修和未补缺口阻止编译。needs-review可生成预览并给warning，用户仍须在游戏里确认后加入。新增外部依据应作为有出处的新资料加入新版本MaterialBundle，不能伪装成用户上传原文。

```js
const {createMaterialBundle,buildKnowledge}=require('./packages/knowledge');
const bundle=createMaterialBundle([{name:'course.md',text:'足够详细的课程原文……'}]);
const pack=await buildKnowledge(bundle,{extract: async (input,{signal}) => knowledgePack,signal});
```

extract是A实现/提供的适配器，不能读取服务密钥或直接修改游戏状态；实际模型连接由D的服务层注入。无适配器会明确报错，不静默退回示例内容。

## B → D/C：LearningPlan

LearningPlan带knowledgePackId/knowledgeRevision、双语title和四章。每章可独立进入；小节引用learnUnitIds并按顺序学习。跨章先修要在当前章安排补充/复习知识；不能暗中锁住另一章。prerequisiteSectionIds只能引用本章已出现小节。

每节有activity={version:1,kind,title,brief,rounds}和questions。rounds[].unitIds只能引用本节知识并覆盖本节所有知识。题目也必须有unitIds、对应知识的quote、中文q/a/wrong与一一对应的英文en版本。固定样例都是明确给定的教学演练；不可把其数值、评分或流程写成普遍规律。

八类操作：sort分类、order排序、choose多选、number计算、matrix权限矩阵、allocate约束预算、rate证据刻度、edit数据修复。其精确字段见types.d.ts，kind只是外观风格标识，不能凭换kind把同一种题宣称为不同教学活动。整门至少三类操作，选择要服务学习目标。

```js
const {designLearning}=require('./packages/learning-design');
const plan=await designLearning(pack,{design: async (input,{signal}) => learningPlan,signal});
```

错误包括缺少操作、不可解约束、未覆盖知识、顺序不满足先修、缺译、与源知识无关的题目。反馈reason应解释推理与回看方向，不是序列化JSON。当前normalizer可保留的原有题型保持兼容；新LearningPlan v1先用scenario正式题，新增正式题型交D扩展类型与样例。

## D → C：PlayableCourse

```js
const {compileCourse}=require('./packages/course-compiler');
const course=compileCourse(pack,plan,{materialBundle:bundle});
```

编译必须携带原MaterialBundle复核引用；按知识引用展开成旧游戏的chapters/sections/lessons/activity/questions。unit.id映射为lesson.skill与round.skills，判分与回看使用该稳定关联；用户看到的中文/英文仅改变显示。compiler输出保留来源ID与版本信息供集成使用。C读取旧格式即可，不需要理解模型提示词或重新抽取知识。

`dist/index.html`继续加载扁平脚本；D运行 `node scripts/build-game.cjs` 从模块发布。游戏源码在apps/game/src，共享兼容格式在packages/contracts/runtime。真实模型任务仍走POST /api/course-jobs、GET/DELETE /api/course-jobs/:id；GET /api/config只返回配置状态，不返回密钥。

## 错误、取消和版本

所有校验返回Diagnostic[]：severity、code、path、message、可选sourceId。assertValid在error时抛PIPELINE_CONTRACT_INVALID并保留diagnostics；A/B端口额外保留candidate以便审阅失败产物。AbortSignal在调用前后检查并传给适配器，适配器负责中止内部长任务。知识或材料revision不匹配拒绝编译；不把旧完成状态自动当作新课程通关。

## 集成门槛

D核对上述契约、来源与覆盖、实际操作可解、三语言不改变答案、单独章节可玩、刷新恢复和旧入口。固定四章样例为最小接线验收，不替代真实课程的教学质量评审。
