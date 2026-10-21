# D 集成报告

状态：本轮拆分完成，等待 A/B/C 后续交付。

## 产物
- apps/game/src：手工前端；apps/server：服务实现；根 server.cjs 兼容启动。
- packages/contracts：v1 类型、校验、固定四章样例和旧格式运行脚本。
- packages/knowledge、packages/learning-design：显式适配器与现有提示词/模板，通用算法待 A/B。
- packages/course-compiler：引用核验、知识/活动映射、旧格式编译与来源关联。
- flow/tasks：三个独占任务卡、报告模板；docs/contracts/pipeline-v1.md：冻结接口。
- 原发布路径与共享素材保留；build 不清空 dist，C 有独立预览。

## 验收
node scripts/test-current.cjs：模块 6 项、108 项原单元及管线测试、13 套 UI 模拟流程通过。
node --test tests/pipeline-contracts.test.cjs：9 项通过，覆盖缺口、来源、版本、畸形输入、错误选项与重复标准化。
跨模型只读评审发现四项问题，已补修复与回归。
限制：真实模型未配置，API 使用模拟服务验收；hook 因缺 jq 安全放行，未宣称完整 hook 测试通过。UI 模拟不替代实际浏览器渲染。

## 后续集成
用户提供 A/B/C 报告路径和分支/提交后，D 阅读实际产物、审核契约差异、合并、构建 dist 并发布。A/B/C 不得自行更改共享契约或覆盖 dist。

浏览器实测：重新加载 localhost:8766，三语偏好和第3章3.2的8/8收集及权限矩阵草稿恢复，重新打开装置可继续互动。截图 artifacts/runtime/split-browser-proof.png（本机忽略上传）。静态美术与入口审计通过（python -X utf8 tests/static-audit.py）。
