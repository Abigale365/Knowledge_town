# 测试分类

当前统一入口：`node scripts/test-current.cjs`。说明见 [测试指南](../docs/TESTING.md)。

- `*.test.cjs`：纯逻辑、存档和本地API测试，统一入口自动收集。
- `chapter-ui.cjs`、`adventures-ui.cjs`、`exploration-ui.cjs`、`game-guide.cjs`：当前章节、场景、探索和引导。
- `learning-interactions.cjs`、`scene-learning.cjs`：复杂题型与物件知识关联。
- `ui-smoke.cjs`、`expedition-ui.cjs`、`hunt-ui.cjs`：三套保留的经典游戏。
- `town-harness.cjs`：共用模拟DOM工具，不是独立测试。
- `world-ui.cjs`、`town-ui.cjs`、`town-interactions.cjs`、`world-hit-audit.py`、`placement.cjs`、`material-studio.cjs`：底层或旧模式兼容检查，按改动范围单独使用。
- `capacity.cjs`：手动容量实验，会生成报告，不自动混入普通测试。

有固定旧日期、旧运行目标和旧报告格式的长跑/监控脚本已归档为 [历史实验文本](../archive/experiments/)，不再堆在当前测试入口旁边。

`knowledge.test.cjs` 和 `knowledge-ui.cjs` 检查当前76单元知识库、组装与配对理解检查、200道题双语覆盖、存档和章节重玩。
