# 对话 B：教学与互动设计

## 发给新对话

你负责Knowledge Town的教学与互动设计B。按本文件和packages/learning-design/AGENTS.md执行，独立实现“KnowledgePack→LearningPlan”。优先琢磨学习顺序、理解与迁移活动、反馈和复习，而不是用统一配对模板换图标。D负责接口与最终集成，只修改允许范围，完成后写flow/tasks/B-learning-design.report.md。

## 当前起点与范围

允许：packages/learning-design/**及本任务report，包括包内tests、样例与templates/strategist.cjs。content/task-activities.cjs只是D保留的兼容入口，不修改。不要修改知识原文、共享契约、游戏页面、根scripts/server或dist。

现状：designLearning(pack,{design,signal})调用注入设计适配器并校验。prompts.cjs提供现有课程生成提示；templates/strategist.cjs是12种原有装置数据。新plan轮次使用unitIds，编译时D映射为旧skills。

## 工作目标

1. 根据知识性质和先修关系组织四章，各章独立可进入，章内有序；先学习基本知识，再形成性应用，整章交付后进入正式练习/复习/错题。
2. 为概念、流程、数值、权限/业务判断设计合适的操作；同一知识可以有阅读收集或组装探索，思考环节必须与内容相关。整套至少三种真实控件，不能全部变成概念配对。
3. 每项活动与题目链接明确unitIds，给出可核验判定、错误反馈及回看方向。数字或流程若是演练条件要明确写明；知识不足反馈A，不编造新事实。
4. 解释每种活动的教学理由、学习者容易犯什么错、如何证明理解；提出复习/迁移策略。新增控制类型先向D提出契约与兼容建议。
5. 用冻结知识包先开发，与A无实时依赖；之后对A产物进行第二轮适配验证。实际模型连接由D注入，交付可注入的设计适配器及评审结果，不能只改prompt。

## 验收

`node scripts/test-module.cjs design`；`node scripts/check-contracts.cjs`。测试覆盖目标引用、先修、活动可解、题目依据和双语。输出需通过validateLearningPlan(pack,plan)。报告至少给出四类内容的教学选择及完整可执行样例。

## 共同约束

先读根AGENTS、flow/plan.md、docs/contracts/pipeline-v1.md、自己模块AGENTS与三个冻结样例。共享接口由D维护；更改建议写进本报告。原dist/index.html及三套经典入口必须保留。不能修改真实密钥或在报告贴完整私有教材。

推荐独立工作树；若共用主目录，不切分支、不reset/clean、不提交别人文件。不要直接修改dist发布副本或运行根build覆盖主入口。仅在自己的允许范围工作。

收工在独占report中记录：做了什么、输入输出版本、文件清单、验收命令与实际结果、未完成与限制、契约变更建议、分支/提交。不要只发“完成了”。用户把报告交当前D对话集成。
