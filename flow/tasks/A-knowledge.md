# 对话 A：知识库工程

## 发给新对话

你负责Knowledge Town的知识库工程A。按本文件和packages/knowledge/AGENTS.md执行，先确认输入输出样例，独立实现“材料→有来源、结构完整、适合后续教学设计的KnowledgePack”。当前D对话负责集成。只修改允许范围，完成后写flow/tasks/A-knowledge.report.md并交付实际验证结果。

## 当前起点与范围

允许：packages/knowledge/**，content/sources/下新增补充资料（不改写原用户原文）、content/expanded-knowledge.tsv、knowledge-english.tsv、knowledge-sources.json、knowledge-categories.json，以及本任务report。包内tests与自己的样例可增加。不要修改共享packages/contracts、apps、根scripts和其他content文件。确需改生成逻辑，提出D侧变更请求。

现状：createMaterialBundle记录哈希；buildKnowledge(bundle,{extract,signal})调用注入适配器并校验，有错误保留candidate。独立prompt已在prompts.cjs，现有服务会使用它。extract尚不是完整通用知识引擎，需要你深化。

## 工作目标

1. 研究并实现资料分段、章节/目标识别、原文定位、去重和知识关系；课程目标不能冒充定义。区分术语、原理、步骤、判断标准、例子、反例与易混边界。
2. 提取先修关系并诊断循环/缺口，输出目标覆盖清单。缺正文时保留gap与所需材料；禁止根据常识补写后伪称上传原文。
3. 双语释义要语义一致，保留原文与补充教学解释的区别。权威补充必须有独立可追溯资料来源和新资料版本。
4. 先在至少两套不同主题资料上验收；一套含清晰正文，一套包含大纲缺口、重复或冲突。保留可公开的小样例和诊断，不上传用户大库。
5. 不直接生成游戏控件；把可学习知识交给B。实际模型连接与密钥由D注入。交付可注入的提取适配器、测试及局限，不能只改提示词。

## 验收

`node scripts/test-module.cjs knowledge`；`node scripts/check-contracts.cjs`。新增测试应验证来源错配、遗漏、去重、先修、双语与取消。生成知识包需通过validateKnowledge(pack,bundle)。报告给出一份真实由你的流程生成的样例及知识质量分析，不把固定冻结样例当作算法效果。

## 共同约束

先读根AGENTS、flow/plan.md、docs/contracts/pipeline-v1.md、自己模块AGENTS与三个冻结样例。共享接口由D维护；更改建议写进本报告。原dist/index.html及三套经典入口必须保留。不能修改真实密钥或在报告贴完整私有教材。

推荐独立工作树；若共用主目录，不切分支、不reset/clean、不提交别人文件。不要直接修改dist发布副本或运行根build覆盖主入口。仅在自己的允许范围工作。

收工在独占report中记录：做了什么、输入输出版本、文件清单、验收命令与实际结果、未完成与限制、契约变更建议、分支/提交。不要只发“完成了”。用户把报告交当前D对话集成。
