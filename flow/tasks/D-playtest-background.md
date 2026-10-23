# 用户试玩期间后台候选优化

2026-10-23。用户授权D直接协调现有四对话，优先动画；明确完成后先不整合，等用户玩完。此规则覆盖之前自动汇总/构建/推送规则。

## 冻结边界

用户当前玩的dist及dist/assets、8782服务、开始游戏.cmd及相关启动器、index、根构建和共享契约一律不修改、不构建、不重启。禁止提交、推送、修改当前进度或浏览器存储。不因后台交付完成自动合并。只可专属artifacts/previews子目录预览，不能启动/占用8782。旧定时任务和Goal不恢复；每方完成有明确边界的一轮后报告等待。

## 分工与领用

- 动画：scene-ambient.js/css、ambient-scene.test.cjs，独占报告flow/tasks/C-animation-background.report.md，预览artifacts/previews/animation-background。基于刚交付的落叶/纸船等版本完善分场景可见度、自然节奏、造型与原画融合；丰富环境小动效但不抖整图、不用假水贴片、不遮挡物件和NPC、不恢复蝴蝶。不接应用场景模块。
- C交互：application-scene.js/css及对应专项测试，独占报告flow/tasks/C-interaction-background.report.md，预览artifacts/previews/interaction-background。核对基础后可发现性、工坊阶段反馈、密集布局/标签和小窗口操作，保持原判分与单阶段单用途；不动动画或教学控制器。
- B教学：仅packages/learning-design/candidates/background-playtest/及flow/tasks/B-background.report.md。梳理其余旧轮与B5是否仍泄答案/机械抄码、知识目标不清；优先一处实质性不同互动的可执行候选及独立验证，不改已接线playtest-fix、冻结教学/生成包、答案ID或前端。
- A知识：仅packages/knowledge/candidates/background-playtest/及flow/tasks/A-background.report.md。只读核对本节学习卡与业务练习的概念、例子、术语双语一致性，优先训练/推理/预测边界；有证据才写勘误或补充候选，不改冻结知识、教学或生成包。

## 交付

先复现/明确问题再修改领用范围，必要测试和不同模型只读复核；真实浏览器不可用保留未验，不把模拟DOM等同视觉验收。报告列实际改动、验证、未验、接入方式和停止状态。共享目录不改其他方文件，不批量暂存。发现跨模块问题只在报告列D待办，由D根据用户反馈再统一安排。
