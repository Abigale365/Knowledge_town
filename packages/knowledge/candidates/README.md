# A持续优化候选

这些文件没有接入服务、B输入或发布构建。冻结v3继续作为当前集成输入。

`audit-import.cjs` 是选择性导入审查：识别把关联目标原样复制为解释的错误（含常见Markdown/HTML包装），以及明确写作UTF16偏移的位置与引文错配。全部引用带显式案例/假设词、解释却含未限定全称词时，另给case-generalization警告和requiresScopeReview；只提示人工核对，不自动降级状态或捏造缺口。词语规则可能误报/漏报，反例也可合法反驳全称命题；混合一般证据或改写措辞须人工审阅。返回独立诊断/所需材料，不修改KnowledgePack，也不改变冻结契约。它不能判断改写后的伪定义、所有双语差异或引文语义蕴含；通过只表示可以继续语义审查，不表示知识充分。

```powershell
node packages/knowledge/candidates/audit-import.cjs packages/knowledge/generated/knowledge.v3.json packages/knowledge/generated/materials.v3.json
node --test packages/knowledge/tests/import-audit.test.cjs
```

审查清单见audit-checklist.md；每轮结果与交D事项见根flow/tasks/A-continuous.report.md。

第6轮另提示案例证据被写成实际/实测数据的常见显式句式：candidate.case-as-observation与requiresEmpiricalEvidenceReview。核对时应取得真实研究或运行记录、样本与方法、指标定义和测量结果；一个假设算例的正确算术不证明实际收益。仅检查解释字段和少量肯定式词组，不覆盖全部同义表达、复杂否定或引用语境；真实案例也可触发提示，须人工裁决。

`distinctions.cjs` 生成 `distinctions.v1.json`：跨四领域12组双语正例/反例、理由和边界，绑定知识/材料内容摘要及v3原文引用索引。场景与数值是原创教学假设；不是来源真实案例，也不是未见独立考核题。answersExposed/doNotUseAsUnseenAssessment必须保持true；B可作为示范或编写参考，不得直接据此宣称独立掌握。validateDistinctionSidecar检查来源绑定、双语字段、答案暴露标志及ROI算术，不证明任意后续改写语义正确。

```powershell
node packages/knowledge/candidates/distinctions.cjs
node --test packages/knowledge/tests/distinctions.test.cjs
```

`transfer-criteria.cjs` 生成 `transfer-criteria.v1.json`：12组可观察判断依据、需要实质改变的新情境条件、不足证据与不确定性处理。只供B编写与审核任务，不是自动评分器、学习者结果或学习时长实测。生成前核对distinctions.review.v1.json中独立审阅PASS的固定内容摘要；不能仅保留同ID就改绑定来源或结论。

`scoped-transfer.cjs` 生成独立候选 `transfer-criteria.v2.json`，保留v1：训练/推理判据补明确参数学习模型假设，并用最近邻实例学习检验适用边界；其余11项不变。绑定旧标准、scope-review与独立来源候选包摘要。需D决定是否采用，未接入B或生产；schemaVersion仍为1，candidateRevision=2仅指此旁车候选修订。

`scope-review.cjs` 的结论专用于第4轮审阅的输入。scope-baseline.v1.json固定其知识/材料内容摘要；即使revision未变，只要内容变化也拒绝套用旧结论，需重新进行语义审阅。它不是任意新知识包的自动范围分析器；严格绑定也会拒绝仅改材料名称等不影响语义的变化，属于保守重新审阅边界。

`prerequisite-notes.cjs` 生成 `prerequisite-notes.v1.json`，为5条选定先修边补双语教学理由和限制。关系是教学顺序建议，不宣称外部来源规定唯一顺序或已实测学习效果；不改变原96条图，也不表示全部96条新近重审。unitEvidence/prerequisiteEvidence是绑定知识包中的单元ID，实际引文在这些单元的evidence中。变化后的基线须重新审阅。

`bilingual-numbers.cjs` 为导入审查提供candidate.bilingual-number warning：比较解释/例子/误解两语言可见数字的多重集合，支持常见千位逗号、万/亿/万亿/thousand/million/billion/trillion、百分号、全角字符及Unicode负号归一化。数值约按14位有效数字处理，不解析所有数词、科学计数法、范围、量纲或数字与主体的对应关系；相同数值互换角色可能漏报，数词/比例的等价改写可能误报，须人工核对。不能作为算术证明或完整翻译验收。

供D筛选接入的入口及限制汇总见integration-index.md；当前按D要求收束，等待实际集成或用户新问题后再针对性推进，不为持续目标制造改动。
