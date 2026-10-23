# A 概念物件小游戏知识候选

供B编写不同操作、供D筛选接入，非生产契约、非玩家未见考题。只读使用现有已审知识和来源；没有改冻结知识、正式答案、收藏记录或游戏。

首批入口：batch1.v1.json；可复现生成器batch1.cjs导出buildBatch(pack,bundle,analysis,catalogs)。items包含双语目标、先教内容、操作建议、例子/反例/边界，以及可供B采用的确定结果或下一步判据。trial.expected与cases.expectedAction是作者可见参考，不是现有正式测验答案，也不应据此宣称独立掌握。

unitBindings绑定冻结知识单元正文摘要与原文引文；lessonBindings绑定legacy4/legacy5/aib4/aib5的实际课程ID、knowledgeRevision、teachingRevision、sectionId、lessonId、sourceUnitId和lessonContentHash。D/B需比对当前课程与卡片摘要，不能仅凭节号复用。来源URL/摘录来自analysis.v3既有记录，其verifiedAt为历史审校时间，不冒充本轮重新浏览。

来源支持概念原则，不支持本题虚构的5000元政策或店铺经验：NIST算法定义支持明确计算规则；IBM支持规则/学习与方法/模型区分；Google Rules of ML支持不必为技术标签引入ML和建立简单基线；AWS成本/业务价值及NIST管理支持评价后果、价值与持续管理。作者的下一步选择与反例须结合给定条件理解，不是来源规定的唯一业务操作。

从根目录运行：

```powershell
node packages/knowledge/candidates/concept-games/batch1.cjs
node --test packages/knowledge/candidates/concept-games/batch1.test.cjs
```

生成只写本目录，不构建dist或启动服务。测试核实际映射、阈值边界与漂移拒绝，不代表小游戏UI/收藏门禁/学习效果通过。这些仍由B/C/D分别实现和验证。

## 第二批：章节2／3／4各两组

batch2.v1.json由batch2-content.cjs的实际双语内容与batch2.cjs的绑定生成器产出；batch2.test.cjs只做定向验证。6组包含ROI账本、业务量成本、检索前权限、当前版本证据、交接演练、试点迁移；数字、组织和退款政策均为演练假设，不是来源真实案例或通用业务阈值。

本批先读取B当前API.md、bindings.cjs和catalog.json：bindings直接采用其forLesson/courseSources约定，含完整courseHash、lessonHash、knowledgeHash。knowledge使用D增强包aib-knowledge-integration rev3，而frozenKnowledge另保留A冻结输入身份；二者hash不能混用。sourceUnits按增强包完整单元hash绑定，正文必须与已审冻结单元相同，只允许D既有evidence增强。生成读B模块，不写B目录。

6个不同源单元在四条课程路线合计26条实际绑定：3.3.4-unit-1在每条aib路线各出现两次（章3和章4复习），不能凭标题或裸节号丢掉重复卡。此JSON是作者内容旁车，**不是可直接交ConceptGames.resolve的descriptor**；未给未经B实现的kind取名冒充引擎已支持。B采用config及预期观察设计操作后，仍须走其描述器、状态恢复和评审流程。

```powershell
node packages/knowledge/candidates/concept-games/batch2.cjs
node --test packages/knowledge/candidates/concept-games/batch2.test.cjs
```

sourceIds逐一核对确属于该冻结单元的既有审校记录；sources保留历史verifiedAt，未冒充本批重新访问外网。来源支持原则：Microsoft ROI/TCO支持完整成本与收益边界；AWS权限支持检索/工具前授权；Microsoft groundedness及AWS输出政策支持结论与证据核对；AWS运行手册、回退与恢复资料支持交接机制；NIST/AWS阶段资料支持受控迁移的作者推论。来源不证明虚构单月数字、7天退款条款或特定组织已获批准。

## 第三批：按B coverage缺口选12概念

batch3-content.cjs为12个独立双语目标与具体观察，batch3.cjs读取B当时coverage.json，使用第2批相同绑定生成流程；只增加buildBatch2的可选authoredItems参数，原默认第二批数据不变。batch3.v1.json记录选择时coverage完整内容hash、此前covered列表及选定gap单元。B以后合法新增覆盖，不会让当时选择记录变成“已实现”声明；重新生成时如已不是gap，会明确拒绝并要求复核重选。

11个来自旧legacy1.1的22张卡，另1个为第三章数据偏差。7组共享实验围绕实现证据、语言/生成内容、可见图像、带/不带标签的数据、延迟奖励、预测后果、独立验证与群体审计；每个items仍有自己的objective、operation、example、counterexample、boundary和sourceUnits/bindings。experimentId只是作者分组，不是B已注册kind。

RL只提供奖励观察台，不能说点击后机器已学会；CV仅给合成场景待B绘制，不声称真实图像检测精度；分组统计和历史/新条件分数不证明公平或变化的因果原因；所有数字、政策、标签与输出为演练假设。源资料支持概念，不支持这些数字为现实效果。

```powershell
node packages/knowledge/candidates/concept-games/batch3.cjs
node --test packages/knowledge/candidates/concept-games/batch3.test.cjs
```

第三批测试使用落盘记录中的covered列表复核选择语义，避免把B后续新增覆盖误当旧候选错误；当前实际接线前，D/B仍须核对当前coverage及完整SHA256绑定。

## 知识显示勘误小批（非教学设计）

用户将B教学设计交另一位后，A停止玩法扩展。本批仅display-errata.cjs、display-errata.v1.json、display-errata.test.cjs：确认legacy4/legacy5三处英文遗漏，AIB两路线对应字段已完整。六条更正都绑定实际courseId/courseHash/lessonId/lessonHash与原sourceUnitId、冻结单元摘要、before/after及原中文；源引文与URL沿用已审记录，无新外网审校。

候选JSON的JSON.stringify SHA256：ec47efdecd9d5eb47a0f4f5f1b1ce17276429cd84f2ba241c6c70582cb4d8032。D应先核已审文件与精确绑定，再考虑UI侧采用；摘要用于漂移核对，不是防作弊认证。

projectDisplay(course,lesson,reviewedErrata)仅接受D受控的已审候选作展示投影，匹配时返回新对象，失配返回null；不是对不可信任意补丁的安全解释器。**保留原始course/lesson供B的context、courseHash/lessonHash及存档/收藏门禁使用**，不能将投影写回课程、冻结知识、B生成物或旧bank，否则会破坏已审绑定。D还须测试回切/刷新及语言切换，A本批未接线。

```powershell
node packages/knowledge/candidates/concept-games/display-errata.cjs
node --test packages/knowledge/candidates/concept-games/display-errata.test.cjs
```

只读文本字段的措辞差异不自动等于知识错误，本批未把其他缩写/改写强行改成逐字翻译。三处明确遗漏为预测例示的低估/缺货分支、数据质量的大模型补救限制、统一词汇的框架不保证准确率限制。
