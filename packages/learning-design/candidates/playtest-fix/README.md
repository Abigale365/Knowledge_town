# 本地试玩：原四槽就地替代

目标：保留旧活动与存档签名，在原 `repair-mapping` 位置显示短业务判断，不要求玩家切银行或重读22份基础。不改冻结B5、正式题或共享schema。

`decision-task.js` 为UMD，浏览器全局 `PlaytestDecisionTask`，Node可require；D可在自己的适配脚本中引入。`baseline.json` 给完整原题投影、原题摘要与字段判定，`legacyMatches(round)`严格核对id/type/双语prompt/按序字段id+双语label+expected，忽略skills/reason等元数据。仅命中内置旧题时启用；不匹配就保留原课程，不用模糊id替换自定义题。

最小接入：

```js
if (PlaytestDecisionTask.legacyMatches(round)) {
  const view = PlaytestDecisionTask.visibleTask();
  const local = PlaytestDecisionTask.beginLegacy(work.draft);
  // render view.goal, view.scenario, view.operation and the four questions/options.
  // Render local.choices as selected; never render legacy tokens or raw keys.
  // For an option click (questionId, optionId):
  work.draft.values ??= {};
  work.draft.values[PlaytestDecisionTask.legacyFieldFor(questionId)] =
    PlaytestDecisionTask.legacyValueFor(questionId, optionId);
  // save() using the existing game path; retain all other fields and correct choices.
}
```

每次显示从 `beginLegacy(work.draft)` 原位恢复已有选择，不能用 `begin()` 空白化旧草稿。截图输入/输出保留为所选正确项，A/B错误选择也保留原位，绝不自动交换。`begin()`仅供全新候选/定向测试；旧轮接线必须用beginLegacy。

提交时 `evaluate(beginLegacy(work.draft))` 返回每项complete/correct/message/knowledgeIds；在具体题目旁显示。未选时提示补判断，错项直接解释参数变化，正确项保留。对应knowledgeIds为**来源知识ID**：模型2、训练3、推理4，不能假定等于当前课程重新编号后的lesson.id；应按sourceUnitId或知识包解析，内联回看本项即可，不跳回整节重读。

`correct`为true时可把 `legacyAnswer` 交原判分/提交函数。原round、activity、题目签名和存档结构完全不变；原submit每次只调用一次，错误只显示反馈、不推进，不清draft。前台选项ID是data值，不是输入框或要背诵的字符串。原码history/forecast/infer/train只由桥函数内部产生，不能显示为答案要求。

旧轮 beginLegacy 始终将独立证据保守标false：这次为兼容旧题的可见订正/应用完成，不代表用户做过B5新矩阵或已独立掌握。保留原正式90%通关要求和其它阶段门禁。不能借此把旧题通过迁成B5通过，也不能因本候选清空全档或让已完成旧轮自动再提交。

旧题active时直接提供目标、当前业务题、可折叠“判断依据”和对应知识入口；无需新增22项基础要求。判断依据讲概念，不提前标出本题各项答案。新工单不等于训练，参数未变是A推理的依据；样本误差改变权重是B训练的依据。

候选仅供本地试玩。B未修改游戏/index/dist；D接线、本地构建和真实点击验收。禁止推送，待用户试玩确认。
