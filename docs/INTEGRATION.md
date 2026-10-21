# A/B/C 最终集成：revision 3

A原始materials.v3与knowledge.v3成对保留：139单元、58目标、96条无环先修、全supported、gaps空。supported表示AI领域/双语审校与来源支持，不是官方认证或穷尽考试知识。

D没有将B旧版教案仅改版本号：逐项复核139单元后修正紧急回退、规则与学习型AI、错误的交接/RAG误区、日志最小化与脱敏，补充风险、标注分歧与组织考核边界。两组独立模型分别审核75/64条，最终批准与完整蓝图哈希、逐单元哈希绑定在packages/learning-design/authored/review-v3.json。

## 来源与版本

复核发现部分A3短引偏离题目主题。D从NIST、Microsoft、UK Government、AWS一手页面增加11项有scope的摘录，覆盖16单元，不更改A原包。packages/course-compiler/enrich-aib.cjs产生独立ID aib-materials-integration / aib-knowledge-integration，材料与知识revision仍3；只增加evidence，正文、例子、状态和先修与原A3相同。aib-source-additions.v3.json保留链接、定位锚、核验日期及适用范围；manifest.provenance保留A3原始哈希。厂商/数据成熟度方法只作明确标识的参考，不作为统一组织标准。

B3绑定这对增强包；旧B1、A1/A2历史产物保留，混用被拒绝。新版四章仍使用原四领域名称，章内先修排序；四章38节、144张含补学卡、144轮互动、144道正式题，七类控件，独立知识139条。多出的5张是章内补学，不是新编知识。

## 游戏入口

运行node server.cjs后，从原index对应首页进入“导入知识库”→“预览完整课程（修订3）”。核对来源、知识和活动后确认，才创建独立课程与进度。原内置课程和旧银行不自动替换。也可在同一面板选择packages/learning-design/generated/aib-course.v3.json；此文件方式不调用模型。

GET /api/aib-course提供已审阅完整版本；POST /api/compile-course接收{materialBundle,knowledgePack,learningPlan}，依次通过A适配器、B适配器及编译桥；来源或版本无效返回400与诊断，跨站请求拒绝。编译已整理数据不发送外部请求。任意新教材仍走原/api/course-jobs与可配置模型服务，密钥只在本机环境中。

固定四章样例仍可用scripts/compile-learning.cjs编译到artifacts，不能绕过D写dist。完整B3重建用node packages/learning-design/generate-aib-v3.cjs --reviewed；不带参数只输出候选，修改输入后必须重审哈希。

## 验收证据与边界

- tests/aib-integration-ui.cjs：最新全量144轮实际控件事件、38节封存、基础学习门禁、四章完整测验、低于90%拒绝、错题修复、部分测验及完整进度恢复。阅读前置由学习引擎布置，不冒充144次真人阅读；模拟DOM。
- tests/integrated-pipeline.test.cjs：原A3与增强包来源/版本，真实HTTP、篡改及跨站拒绝；A2真实缺口继续阻断。
- tests/old-save-ui.cjs和integrated-pipeline-ui.cjs：非空9f7f67b示例旧存档，含收集、错误答题与旧会话；继续收集，导入新课后原银行/状态/答题进度/会话保留。
- 旧双语模拟测试改为映射与控件身份检查，实际文字由浏览器验证；旧未来机关测试改为按阶段显示，C模块同时验证后续阶段可操作。
- 实际浏览器和发布快照验收见D报告；证据范围不等同于全部触摸设备或完整无障碍认证。

原dist/index.html及三套经典入口保留。直接file协议被浏览器工具策略阻止，未绕过；静态入口与相对资源另有审计，真实浏览器通过同一index的本机HTTP入口验收。
