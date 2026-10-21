# 对话 D：集成与发布（当前对话）

负责：根AGENTS/CLAUDE/flow、共享契约与固定样例、packages/course-compiler、apps/server、scripts、根tests与package配置、文档索引、发布dist和共享美术。收到A/B/C报告后核验实际文件和提交，再合并，不能只采信“测试通过”。

当前交付：模块源目录、v1校验、适配器端口、编译桥、冻结四章样例、独立游戏预览、各任务卡。通用知识/教学引擎由A/B后续完成；现有API兼容两轮编排已提取并继续可用。

## 收到报告后的顺序

1. 核对允许范围、分支/提交、接口版本及源材料授权，保留未提交的其他对话改动。共用目录不reset，不切分支。
2. 先A知识质量与来源，再B教学与可解性；编译为当前游戏结构，与C接口联调。失败时返回精确诊断，不在游戏里补假知识。
3. 核对课程引用/版本在预览、导入、存档和刷新中保持；密钥只在后端；真实模型未配置就明确说明。
4. 构建：node scripts/build-game.cjs；原料变化时由D运行内容构建脚本并重建语言数据。不要删除dist/assets或三个经典入口。
5. 验收：node scripts/check-contracts.cjs；node scripts/test-current.cjs；python -X utf8 tests/static-audit.py；浏览器操作原dist/index.html对应页面、六章、语言和刷新。
6. 确认通过后提交main与发布，记录SHA、验收、风险和下一棒。用户已经授权本轮拆分与原仓库更新；后续超范围动作另行判断。

## 最终集成的可玩标准

原dist/index.html可直接打开内置游戏；node server.cjs或npm start仍打开同一入口。资料生成需本机API配置。未配置服务不影响内置课程与独立游戏。页面入口、29份素材、基本玩法与旧存档回归保留。

## 共同约束

先读根AGENTS、flow/plan.md、docs/contracts/pipeline-v1.md、自己模块AGENTS与三个冻结样例。共享接口由D维护；更改建议写进本报告。原dist/index.html及三套经典入口必须保留。不能修改真实密钥或在报告贴完整私有教材。

推荐独立工作树；若共用主目录，不切分支、不reset/clean、不提交别人文件。不要直接修改dist发布副本或运行根build覆盖主入口。仅在自己的允许范围工作。

收工在独占report中记录：做了什么、输入输出版本、文件清单、验收命令与实际结果、未完成与限制、契约变更建议、分支/提交。不要只发“完成了”。用户把报告交当前D对话集成。
