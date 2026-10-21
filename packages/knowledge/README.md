# A：材料到知识包

`index.cjs` 保持原有 `buildKnowledge(bundle,{extract,signal})` 接口。新增的 `createExtractionAdapter({identify,extractSegment,onAnalysis,maxChars})` 将原文按行及长度切片，携带章节标题、materialId 和 UTF-16 半开区间；先调用目标识别，再逐片提取，最后组装双向映射。正文和目标识别由 D 注入的模型回调完成，无密钥、网络调用或默认示例回退。

`identify(segments,{signal})` 返回 `{id,title:{zh,en}}[]`；`extractSegment(segment,{objectives,signal})` 返回冻结接口中的 KnowledgeUnit 数组。回调必须为单一术语、原理、步骤、判断标准分别建立单元；例子和易混边界放入对应数组，缺失时留空。原文只是目标时不产生定义。未解释目标最终进入 gaps。相同双语解释去重，同名异义保留并要求审阅，关系循环由冻结校验阻止。必须明确回调对原文覆盖与翻译质量负责，程序不能证明任意模型的语义完整性。

```js
const K=require('./packages/knowledge');
const extract=K.createExtractionAdapter({
  identify: identifyObjectivesWithYourModel,
  extractSegment: extractUnitsWithYourModel,
  onAnalysis: result => saveDiagnostics(result)
});
const pack=await K.buildKnowledge(bundle,{extract,signal});
```

诊断不塞进共享 KnowledgePack。`assembleKnowledge(bundle,{objectives,claims})` 返回 `{pack,diagnostics,coverage}`，可保存缺口候选；`buildKnowledge` 拒绝错误候选并保留 `error.candidate`。needs-review 允许预览，不能当作已完成人工审阅。缺正文目标没有伪造 gap 单元或原文引文。

## 全材料整理与复现

`node packages/knowledge/generate-corpus.cjs` 生成 `generated/materials.v1.json`、`knowledge.v1.json`、`analysis.v1.json`。输入为用户四章大纲、完整伴读资料和现有 139 单元教学补充清单。教学补充作为独立版本资料快照加入 bundle，附上原清单 SHA256；所有引文指向该快照而非冒充官方网页或大纲定义。原用户材料不修改。全部 58 技能都有双向映射，跨任务先修是保守的人工教学建议，不是大纲规定，仍需审阅；analysis 保留逐单元阅读线索、原来源标签、访问缺口。

此生成器是已有课程的确定性整理器，不是无需模型即可理解任意教材的引擎。它不会从伴读的链接目录推断未获取的课程正文；也没有重新核实外部网页、标准或考试时效事实。现有中英释义有摘要程度差异，因此 139 单元均为 needs-review。58 项目标另有对应的英文语义翻译。完整原课程、官方题库、标准全文缺失是访问范围限制，不以“58 项已映射”声称这些材料已收齐。

验收：`node scripts/test-module.cjs knowledge`、`node scripts/check-contracts.cjs`。两主题公开小例子在 tests/engine.test.cjs：水循环正文、库存大纲缺口和冲突。它们使用显式回调验证流程，不冒充实际线上模型效果。

## 全量审校版（材料和知识 revision 2，契约 schemaVersion 仍为 1）

`node packages/knowledge/review-corpus.cjs` 读取 `review/domain1.json`、`domain2.json`、`domain34.json` 的逐条领域/双语/来源/先修审校记录，生成 `generated/materials.v2.json`、`knowledge.v2.json`、`analysis.v2.json`、`gaps.v2.json` 和便于阅读的 `review.v2.md`。首版文件保留用于追溯；v2 文件名指修订号，不是升级共享契约。

原始大纲、伴读和首版教学补充正文及哈希保留；新的一手来源短摘录（各自附 URL、核验日期）与修订教学解释是两份独立新增资料。原例子和易混边界保留或在审校记录中修订，明确为教学例示，不能当作来源原例。引用只复现短定位锚点，逐条 rationale 记录实际阅读的源页章节与支持范围。来源和翻译的语义判断由审稿模型完成，代码校验不能自动证明引文的真实性或语义蕴含。

每条 supported 必须有独立资料引文、双语解释、逐条先修理由且没有已知的核心证据缺口；其含义是经 AI 领域/双语审查并有一手支持，不表示人工认证或官方背书。已审查但证据不完整的单元保留 needs-review，其缺项和所需材料同时进入 sidecar 与 KnowledgePack.gaps，不能用教学自引或目标映射把缺口隐藏。**因此 v2 的完整包若仍有 gaps，冻结校验应当阻止编译；测试通过不等于全部材料充分。**

审校清单绑定 `review/manifest.json` 中的原知识清单 SHA256。原清单改变时旧审校不能直接复用；需重新审查并发行新的材料/知识修订，不覆盖已经交付的历史版本。生成器会拒绝缺行、重复审校、无独立引文的 supported、错误来源、被静默删除的例子/边界、未说明的状态降级及一对一单元丢失。循环、错误映射和缺译由冻结校验识别；只有已知知识缺口可作为明确的未完成候选写出。

## 剩余35条补证（材料和知识 revision 3）

运行 `node packages/knowledge/complete-gaps.cjs`。输入为完整的 revision 2 资料包、知识包、审校分析，以及 `review/round3/` 的35条后续决定；输出 `generated/{materials,knowledge,analysis,gaps,review}.v3.*` 和 `gap-resolution.v3.json`。`review/round3/manifest.json` 同时绑定原知识清单哈希及基线资料包、知识包、分析的内容指纹，防止在不同基线上套用这轮补证。

只允许更改首轮尚未解决的单元，而且35条必须全部给出后续决定。每条保留 previousMissing、实际检索说明、新依据和剩余材料需求；不能只把状态改为 supported。104条先前已支持内容保持不变。revision 2 的全部资料正文和哈希保留在新包中，再增加本轮独立摘录与双语解释材料，使用新的 materialId，避免覆盖历史证据。

修订号跟随产物生成路径，不覆盖 v1/v2 文件。所有文件写出前重新校验；未决的真实知识缺口仍阻断完整课程编译，其他结构、版本、来源或关系错误会阻止写出。最后以实际 `analysis.v3.json` 的状态计数和 `gaps.v3.json` 为准。补证依据中的行业方法、厂商实现与特定地区规范分别标明适用范围，不被解释为所有组织必须照搬的流程或数值。

本轮实际结果：35条均完成补证，139条supported、0 gaps；真实知识包校验无错误或警告。累计102条来源登记、101个不同URL，96条先修关联无环。模块21项测试通过。D集成时使用成对的revision 3资料/知识包，并重新生成绑定knowledgeRevision=3的教学方案；不能把知识包验收当成游戏发布验收。
