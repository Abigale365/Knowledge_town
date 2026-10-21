# 服务与集成模块 D

总体规则见 [根 AGENTS](../../AGENTS.md)，计划见 [flow/plan](../../flow/plan.md)，职责见 [任务入口](../../flow/tasks/README.md)，接口见 [v1契约](../../docs/contracts/pipeline-v1.md)。

- 负责：本机HTTP服务、模型适配与生成任务编排。
- 依赖：packages/knowledge、learning-design、course-compiler。
- 从仓库根目录验收：`npm run test:chapters`。
- 只改本模块及任务卡允许的额外文件；跨模块与契约修改交 D。
- 收工更新本任务独占报告，写清输入版本、输出、测试和下一步。
- 不在本模块重复创建 flow、docs 或 hook。
