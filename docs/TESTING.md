# 当前测试入口

## 2026-10-22 B5集成验证范围

默认总入口现纳入 `teaching-v5-ui.cjs`、`b5-micro-ui.cjs`、`b5-item-feedback-ui.cjs`，分别验证新版阶段、提前微练习及真实训练/推理逐项反馈。B4和经典入口测试继续保留。`teaching-stage-engine.test.cjs`覆盖两种课程285轮应用与存档门禁；`teaching-feedback-v5.test.cjs`核验323规范题及独立反馈绑定。

以下旧版本“浏览器另行核对”均属历史证据，不能作为本轮B5浏览器验收。本轮只有模拟DOM、逻辑/服务和静态检查；浏览器连接当前不可用，B5真实布局、连续动画、触屏及原生拖放仍待验证。真实模型API尚未配置。

从仓库根目录执行，无需安装npm依赖：

```sh
node scripts/check-repository.cjs
node scripts/test-current.cjs
```

第一个检查游戏入口、HTML引用、共享图片、CommonJS依赖、当前文档链接和npm脚本路径。第二个先做仓库检查，再运行所有 `tests/*.test.cjs`，以及当前小镇与三套经典游戏的主要模拟交互流程。任一检查失败即返回非零退出码。

## 只检查一个部分

| 范围 | 命令 |
| --- | --- |
| 核心逻辑与服务 | `node --test tests/*.test.cjs`（若所用终端不展开通配符，请用总入口） |
| 基础学习到章末测验 | `node tests/chapter-ui.cjs` |
| 海边与圣诞主线 | `node tests/adventures-ui.cjs` |
| 六类知识探索、阶段场景和四段支线 | `node tests/exploration-ui.cjs` |
| 新手引导 | `node tests/game-guide.cjs` |
| 档案馆／群岛／寻物社 | `node tests/ui-smoke.cjs`、`node tests/expedition-ui.cjs`、`node tests/hunt-ui.cjs` |
| 静态美术与入口检查 | `python -X utf8 tests/static-audit.py` |
| 手动容量检查 | `node tests/capacity.cjs` |

容量检查默认更新页面的 `dist/capacity-report.json` 摘要，并把完整本机结果写到忽略上传的 `artifacts/runtime/capacity.json`。仅验证、不更新报告时，设置环境变量 `TOWN_NO_REPORT=1`。

当前UI测试使用模拟DOM，能检查事件、规则、保存与恢复，不能证明实际布局、图形渲染、鼠标命中或真机触摸正确。浏览器另行核对了经典入口、知识物件操作、收集归位、场景机关、阶段物件隔离、切章与刷新恢复；真实手机触摸尚未全面验收。课程生成接口通过本地模拟服务验证，真实模型仍需填写服务配置后验证效果。

旧版本连续长跑脚本和报告已放入 [历史归档](../archive/README.md)。它们不属于当前测试入口，也不能把旧报告中的时长当作本次验证时长。

知识单元与理解检查见 `tests/knowledge.test.cjs`；实际读卡、场景组装、配对、双语题目覆盖、存档与单章重玩见 `tests/knowledge-ui.cjs`。API测试另外检查知识缺口、遗漏单元与定义被改写时拒绝生成。

`workshops.test.cjs` 检查139个知识单元、全部52项后续技能映射、八类操作与不可跳过的判定；`workshops-ui.cjs` 通过实际事件处理器完成12个装置的42轮，覆盖错误、重试、知识回看、分阶段完成及账房半途刷新。模拟DOM检查不等同于浏览器视觉检查。

本轮浏览器补充验收：实际收集Task 2.1/2.2/3.1/3.2知识素材，完成预算组合、方案决策、迁移排序及责任取舍；验证收益账房错误计算、草稿刷新、英文显示，以及权限矩阵越权拒绝。截图仅保存在本机忽略目录 `artifacts/previews/`。全量自动检查为99项逻辑/服务检查与13组模拟交互流程。

`phase-import-ui.cjs` 覆盖四章学习/答题切换的物件隔离、答案与工具图标互斥，以及知识库直达入口、粘贴、文件追加/同名替换/移除、容量限制、英文显示和清单恢复。浏览器另行核对40px图案与60px点击宽度、导入入口及粘贴清单。模型接口尚未配置，因此没有实际向外部模型发送材料。

`language.test.cjs` 检查三种模式、显式词对和缺译回退；`bilingual-ui.cjs` 检查选择菜单、当前知识页恢复、材料草稿、冒险切换和存档。双语正文的真实DOM、控件点击与布局另行浏览器验收。

三模式浏览器验收包括双语知识正文、英文/双语往返、当前阅读页保留、双语权限矩阵与刷新后的语言偏好。菜单按钮使用独立的操作属性，根节点的语言布局属性为 `data-locale-mode`，避免事件冒泡把菜单立即关闭。

## v0.16 模块迁移

手工游戏源码改在 apps/game/src，服务实现改在 apps/server，共享兼容脚本改在 packages/contracts/runtime；dist 保留发布路径与美术。根 server.cjs、原 HTML 入口仍可运行。运行 npm run build 发布源码，node scripts/test-current.cjs 验收模块与现有流程。并行任务、允许文件和独立预览见 [任务入口](../flow/tasks/README.md)，接口见 [pipeline v1](contracts/pipeline-v1.md)。
