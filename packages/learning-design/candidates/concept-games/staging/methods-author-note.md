# 三种学习方法操作候选

仅供root包装绑定、教学acknowledge、事件重放及收藏门禁。本插件不处理这些权限，不操作DOM、存档或正式掌握；`passed`只代表本次演练操作通过。来源为冻结KnowledgePack revision3的1.1-lesson-20/21/22原解释，所有数值/算法/阈值是可见的演练约定，不新增业务事实。

UMD浏览器名`ConceptLearningMethods`；Node require `learning-methods.js`。导出`kinds/init/step`。`init(descriptor)`返回玩法data；`step(descriptor,data,action)`深复制输入并返回`{data,feedback,passed}`，非法ID/动作抛错。feedback逐项附知识回看ID。root需把definition.sourceUnitId保留给插件，或传入同义字段。

- sample-trainer：展示带目标样本卡和无目标记录；点击选取→拟合可见`y=k×x`规则→对保留输入选择数值预测→检验。动作`select{sampleId}`、`fit`、`predict{value}`、`test`。显示`data.k`和已选样本；检验后才显示保留目标。无目标样本不可加入，错误预测订正不清训练记录。UI不得提前展示config.holdout.y；训练样本目标可见。
- cluster-builder：四个数值点拖入两个区域，实时显示已放位置，但点击检查后才解释距离；再选有证据的描述。动作`place{pointId,groupId}`、`check`、`describe{decision}`。UI显示config.points/groups/maximumRange/minimumPerGroup及descriptions；不显示supportedDescription。交换两个组名同样有效。检查定位未放点及超距组，不清正确放置。
- reward-path：两条路线按钮，每点击一次走一步并显示真实本题奖励；当前路线完成后才切换；两条都走完才填写各自累计值并比较，再选下一轮策略。动作`advance{pathId}`、`compare{totals:{[pathId]:number}}`、`policy{pathId}`。UI初始不预显config.paths[].rewards，奖励从data.visits逐步揭示；不能一键读完。比较错误逐路线解释并保留奖励历史；正确累计核算保留，之后策略可订正。config.rounds=2对应每条路径两轮交互，不代表一般训练收敛。

接口config中的actions含双语按钮说明。内部ID仅由控件提交，用户不输入代码。plugin本身无教学前置，root必须在dispatch前拦截未acknowledge的操作；源正文回看持续可用。重玩应重新init，不能把旧passed字段直接当有效证据。9项纯函数测试涵盖每种错误、成功、订正、前置、输入不变。尚未真实浏览器验收；不同模型评审由root统一安排。
