# 开启并行开发对话

当前对话是 D 集成负责人。用户自己开启三个新对话，分别使用下面的任务卡；每个对话先读根AGENTS与本任务，不要让几个对话都接管整个项目。

| 对话 | 任务卡 | 独占交付报告 |
|---|---|---|
| A 知识库工程 | [A-knowledge.md](A-knowledge.md) | A-knowledge.report.md |
| B 教学与互动设计 | [B-learning-design.md](B-learning-design.md) | B-learning-design.report.md |
| C 游戏体验 | [C-game.md](C-game.md) | C-game.report.md |
| D 当前对话负责集成 | [D-integration.md](D-integration.md) | D-integration.report.md |

推荐在Codex里为新对话选择同一项目的“工作树”环境，从本轮拆分提交后的main开始；每个对话拥有自己的分支/目录。材料与代码属于同一个总体仓库，最后由D合并。不要复制.env或密钥到公开报告。

如果三个对话都在当前同一目录：严格遵守任务卡的文件范围；不要切换Git分支、重置或清理目录，不要提交其他对话的改动。只写自己的报告，完成后用户把报告路径发给D。主目录的dist由D发布，所以A/B/C完成并不意味着尚未集成的功能已经出现在原入口。

开始消息可直接复制各任务卡的“发给新对话”段落。完成后告诉D：任务代号、报告路径、分支/提交（如有）。D会阅读实际产物、核验并集成；不需要其他对话互相发消息。
