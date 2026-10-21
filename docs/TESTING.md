# 当前测试入口

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
| 六类知识探索、原图标和四段支线 | `node tests/exploration-ui.cjs` |
| 新手引导 | `node tests/game-guide.cjs` |
| 档案馆／群岛／寻物社 | `node tests/ui-smoke.cjs`、`node tests/expedition-ui.cjs`、`node tests/hunt-ui.cjs` |
| 静态美术与入口检查 | `python -X utf8 tests/static-audit.py` |
| 手动容量检查 | `node tests/capacity.cjs` |

容量检查默认更新页面的 `dist/capacity-report.json` 摘要，并把完整本机结果写到忽略上传的 `artifacts/runtime/capacity.json`。仅验证、不更新报告时，设置环境变量 `TOWN_NO_REPORT=1`。

当前UI测试使用模拟DOM，能检查事件、规则、保存与恢复，不能证明实际布局、图形渲染、鼠标命中或真机触摸正确。浏览器另行核对了经典入口、知识物件操作、收集归位、场景机关、锁定预览、切章与刷新恢复；真实手机触摸尚未全面验收。课程生成接口通过本地模拟服务验证，真实模型仍需填写服务配置后验证效果。

旧版本连续长跑脚本和报告已放入 [历史归档](../archive/README.md)。它们不属于当前测试入口，也不能把旧报告中的时长当作本次验证时长。
