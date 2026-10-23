# 第二批隔离扩展（不覆盖第一批）

正在测试/评审，D/C在review.json accepted之前不要切换。主目录engine.js/catalog.json/review.json保持首批稳定字节。此目录将覆盖原1.1全部22个来源概念，另保留1.2确定性；具体以coverage.json实测为准，不提前宣称完成。

浏览器加载顺序：首批engine.js（ConceptGames）→本目录learning-methods.js（ConceptLearningMethods）→content-workshops.js（ConceptContentWorkshops）→engine.js（ConceptGamesNext）。Node require本目录engine.js。对第二批catalog使用ConceptGamesNext，原有2种kind委托首批引擎，既有合法首批进度可继续恢复。

resolve/fresh/dispatch/restore/serialize/validate/collection/signature等API不变。SHA256绑定仍使用同一完整原课程和lesson对象；新kind同样先acknowledge再操作，全日志重放，不能信任passed，真实found由D提供。新kind内部数据/反馈由plugin处理，外层保护教学门禁、上下文、错误记录及新收藏资格。游戏通过不自动收藏或正式掌握，旧收藏保留。

## evidence-board

先打开证据卡，然后给出“支持/反驳/不足”的结论并选择依据，不能仅凭标题或词语配对：

- `{type:'inspect',evidenceId}`：将实际证据卡标为已检查。
- `{type:'judge',claimId,decision:'supported'|'refuted'|'unknown',evidenceIds:[...]}`：判断并选依据。

渲染config.evidence与claims的text、verdictOptions；不要展示claims.expected/evidenceIds/feedback为预给答案。正确要求读过支持该判断的证据、结论正确、依据对应；错项保留其它正确结论与证据选择。data.opened/judgments/selectedEvidence可还原当前状态。9种概念使用不同的实际证据和边界问题，不能把它们作为“全新未见正式题”。

## 其它新增玩法

监督拟合、无标签分组、延后奖励三种kind的动作与隐藏字段见methods-author-note.md。资料清理、文本抽取、图像定位、模型数据流与预测后果玩法见workshops-author-note.md。各plugin导出init/step仅为内部模块；C/D一律调用外层ConceptGamesNext，不能直接调用plugin绕过教学/恢复/绑定门禁。

所有descriptor的私有判定数据只供引擎。真实题面仅渲染白名单字段，尤其不能预显示保留样本答案、未来实际需求、隐藏奖励和期望证据集合。知识回看入口用sourceUnits与原lesson来源ID映射，不把运行lesson编号当作知识身份。
