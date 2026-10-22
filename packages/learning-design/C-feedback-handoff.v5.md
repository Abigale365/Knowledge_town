# 截图接线活动补充：逐项反馈与替换登记

本补充按用户截图追加，主B5的generated、manifest及review-v5摘要保持冻结。独立候选在 `candidates/feedback-v5/`，通过补充评审后在 `reviewed/` 子目录交D选择接入，不覆盖正在集成的B5。

## 被替换的截图活动

旧原1.1 `repair-mapping`：输入history、输出forecast、A=infer、B=train。截图中输入/输出已正确，错在A/B。旧题将映射和参数事实写出后要求抄代码，不能证明理解，退出新教学必做路径，仅保留历史错题回看。

新版 `inspect-model-work`：以维修业务记录选择资料/估计/学习调整/使用已有参数的职责，不输入英文代码。四行分别为测量、剩余小时估计、根据误差改权重、锁定权重处理新读数。学习目标是依据数据流和参数是否变化判断职责。新矩阵的内部格ID只供判定，不能在题面展示或要求输入。

另外AIB `1.1-lesson-2` 的history/forecast修复改为测量、估计、人员行动分类；`1.1-lesson-14` 的train/infer抄写改为根据实际日志分类。全部70项修改/替换单元和13节旧活动、新活动、旧答案、signature及原因见 `replacement-register.v5.json`，不是只列这三处。69保留单元的理由仍见主B5逐单元审核。

## C/D调用

1. 同时读取主 `generated/aib-manifest.v5.json` 与补充 `feedback-manifest.v5.json`；确认baseManifestHash、knowledgeHash、planHash、feedbackHash、replacementHash一致。补充评审为 `authored/feedback-review.v5.json`。参考函数运行时另有diagnosticRuntimeHash，需使用通过该摘要评审的实现或等价且已测的浏览器适配。
2. `item-feedback.v5.json.activeEntries` 按 `key` 选择活动，不能只按roundId找题，因为不同节可能重名。传完整题对象与entry：`teachingLogicV5.diagnoseRound(round, answer, entry)`；roundHash不一致拒绝反馈，避免把甲训练/乙推理的其它情境套到截图A/B上。
3. 使用返回的原draft保留所有已正确操作，按checks.id在对应卡片/格子/字段附近显示结果。正确项显示“此项符合题目证据，保留当前操作”；错项显示message，再按需展开reason。矩阵按行汇总相关错误格，不把16格全刷成大段说明。
4. 每个错项都带reviewLinks，显示知识标题并以unitId打开本章可回看的知识内容与原文证据。不能显示裸内部ID或跳去不相关章节。查看知识不清空草稿。
5. 截图历史回看使用archivedEntries唯一项，A直接解释“没有更新参数，属于推理”，B解释“根据样本调整参数，属于训练”；input/output保持正确。此条archiveOnly不能纳入新活动通关或恢复旧输入框。
6. 错项解释揭示了本题答案，标记本次有辅助；订正可以完成应用，但不能恢复独立信用。知识回看和本题答案揭示分开处理，正式90%门槛保持。

## 旧答案、旧草稿、已完成记录

- 同一题提交错误后，保留正确部分和全部草稿，仅标记错项；不能清空或用标准答案覆盖草稿。
- 替换题型/情境后，旧history等答案仅作只读历史记录；不能把字符串自动翻译成新矩阵勾选、也不能把旧正确输入/输出冒充新情境已完成。新活动从空草稿开始，旧正确记录仍可回看。
- 活动signature一致且题目未改，可沿用兼容状态；签名改变只使对应活动的旧草稿/完成证明不再适用于新活动，不清空整份存档。
- 登记中的AIB单元级signature仅供审计，不是实际章节存档键；D应比较当前加载整节activity的signature，不能拿单元签名直接匹配章节workshop记录。
- 找到、收藏、归档、知识阅读及无关章节进度保留；旧正式题记录是否显示为历史由D按现有存档约定处理，不能因本补充修改正式题或重置全部成绩。
- 不新增共享schema或擅自改存档。若D需要帮助状态或历史草稿容器，先在现有适配层解决，不能持久判别时保守标“订正完成，待测验确认”。

浏览器实际反馈位置、点击知识回看、原题退休、新题呈现、旧档刷新及窄屏行为仍由C/D验收。B只提供数据与已测参考，不声称截图页面已更新。
