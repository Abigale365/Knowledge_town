# A候选接入索引

冻结集成输入仍是 generated/materials.v3.json 与 knowledge.v3.json；以下均为旁车，未接入服务、教学原料或发布。D决定是否接入，不需要为使用当前v3先接入所有候选。

| 用途 | 入口/产物（相对本目录） | 适用限制与证据 |
| --- | --- | --- |
| 可选导入审查 | audit-import.cjs；依赖bilingual-numbers.cjs | 调用auditImportedKnowledge(pack,bundle)，返回额外diagnostics/candidateGaps。错误与warning均不修改输入；readyForSemanticReview不代表语义验收完成。详见README。 |
| B示范编写参考 | distinctions.v1.json | 12组双语正反例，公开答案，原创假设；不能直接充当未见独立考核。独立PASS摘要见distinctions.review.v1.json。 |
| B迁移判断编写参考 | transfer-criteria.v2.json；生成器scoped-transfer.cjs | 候选修订2保留参数学习模型假设，较v1补最近邻对照；需D接受范围方案后采用。非自动评分器、非学习效果证据。 |
| 可选知识范围注释 | scope-review.v1.json、scope-materials.v1.json | 三个训练/模型/推理单元的范围澄清，引用scikit-learn一手资料；requiresDDecisionToPromote。scope-baseline.v1.json绑定已审输入，变化后必须重新审阅。 |
| 先修说明编写参考 | prerequisite-notes.v1.json | 仅5条边的双语理由与限制；教学建议，不是全部96边重新审核、唯一学习顺序或学习效果实证，不改变原图。 |

验收证据统一记录在根 flow/tasks/A-continuous.report.md。专项测试位于 ../tests/；全模块命令为 `node scripts/test-module.cjs knowledge`（从项目根运行）。冻结输入字节摘要见frozen-inputs.json。

接入时保留：假设/实证区分、答案暴露标志、作者参考用途、来源与内容hash绑定。不得自动将warning清零当作充分语义支持，不得覆盖v3或混配修订号。本索引是人工交接指针，不是生产构建配置或新的共享接口。
