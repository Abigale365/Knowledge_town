# 对话 C：游戏体验

## 发给新对话

你负责Knowledge Town的游戏体验C。按本文件和apps/game/AGENTS.md执行，使用固定PlayableCourse/既有课程开发场景、交互与呈现。D维护数据编译和发布，只修改允许范围。保留dist/index.html的最终兼容目标，完成后写flow/tasks/C-game.report.md。

## 当前起点与范围

允许：apps/game/**、content/interface-english.json、本任务report、artifacts/previews/game-C/**与artifacts/runtime/game-C/**。新美术先放模块自己的assets候选目录，D审核后发布到dist/assets；不直接覆盖共享美术。不要改apps/server、packages共享包、根scripts、测试harness、生成题库或dist。

apps/game/src是原手工前端源码；共享格式脚本已移至packages/contracts/runtime并按原加载顺序发布。仍有全局兼容控制器，可在模块内部逐步重构，不能同时修改存档、判分ID和共享数据格式。

## 工作目标

1. 提升场景与交互稳定性，保持同阶段图标用途一致、知识与后续触发点分阶段刷新、图案与背景比例协调且点击范围足够。
2. 保持阅读收集、场景组装、按知识设计的八类操作、知识回看及错题复习。不要在UI临时编造知识、统一改成书本或退回全配对。
3. 完整支持中文/英文/中英对照，切换不改变答案ID、草稿或进度；考虑窄窗口、键盘和长内容排版。
4. 保留六章独立进度、章内顺序、90%门槛、重玩与三个经典入口。使用固定样例开发，与A/B无实时依赖。
5. 提供浏览器截图和可重复操作步骤，优先修复真实问题。涉及共享判分或存档结构时提交D侧变更建议。

## 独立预览与验收

从根目录运行 `node scripts/test-module.cjs game`，会构建到artifacts/previews/game-C并跑本模块测试，不覆盖主dist。随后 `node scripts/preview-game.cjs --dir artifacts/previews/game-C --port 8773`，浏览器打开http://127.0.0.1:8773/。这个预览不调用真实模型。必要时手动先运行 `node scripts/build-game.cjs --out artifacts/previews/game-C`。

报告列出截图、交互流程、窗口尺寸、保存/恢复验证与已知限制。模块源码变更需要D发布后才会出现在主入口。

## 共同约束

先读根AGENTS、flow/plan.md、docs/contracts/pipeline-v1.md、自己模块AGENTS与三个冻结样例。共享接口由D维护；更改建议写进本报告。原dist/index.html及三套经典入口必须保留。不能修改真实密钥或在报告贴完整私有教材。

推荐独立工作树；若共用主目录，不切分支、不reset/clean、不提交别人文件。不要直接修改dist发布副本或运行根build覆盖主入口。仅在自己的允许范围工作。

收工在独占report中记录：做了什么、输入输出版本、文件清单、验收命令与实际结果、未完成与限制、契约变更建议、分支/提交。不要只发“完成了”。用户把报告交当前D对话集成。
