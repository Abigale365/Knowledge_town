# 模块拆分与并行开发方案

状态：供下一轮拆分使用的数据契约与职责方案；当前游戏入口、静态资源路径和存档保持可运行。现有代码仍在原目录，本文件中的未来目录是迁移目标。

## 判断

现在适合拆分职责，在同一个仓库里维护多个模块。当前复杂度主要来自 `dist/` 多个脚本通过全局函数相互覆盖、加载顺序，以及 `server.cjs` 同时负责资料处理与课程生成。直接让几个对话同时改这些公共文件，容易出现各自可运行、合并后失效的情况。

推荐三个开发对话，加一个集成对话。不同课程仍复用游戏场景；学习内容通过数据包进入游戏，不为每门课重写前端。第一步冻结接口与样例，第二步提取纯模块，第三步迁移页面调用；不同时重做目录、存档和产品流程。

| 对话 | 职责 | 输入 → 输出 | 当前主要文件 | 未来模块 |
| --- | --- | --- | --- | --- |
| A：知识与资料 | 资料解析、来源定位、概念体系、先修关系、覆盖和缺口、双语释义 | MaterialBundle → KnowledgePack | `content/sources/`、`expanded-knowledge.tsv`、`knowledge-sources.json`、`knowledge-categories.json` | `packages/knowledge/` |
| B：教学与互动设计 | 设计章节与学习顺序、例子、形成性练习、迁移任务、复习策略 | KnowledgePack → LearningPlan | `content/task-activities.cjs`、教学原料 | `packages/learning-design/` |
| C：游戏与体验 | 场景、人物、图标、交互控件、无障碍与三语显示 | PlayableCourse → 游戏过程与学习事件 | `dist/` 手工维护的游戏脚本、CSS与美术；不直接改生成的数据文件 | `apps/game/`、`packages/game-runtime/` |
| D：集成与契约 | API适配、数据校验、编译桥接、存档兼容、集成测试、发布 | 验证并连接 A / B / C | `server.cjs`、`dist/course-schema.js`、`scripts/`、入口加载顺序、跨模块测试 | `apps/server/`、`packages/contracts/`、`packages/course-compiler/` |

现有 `dist/chapter-course.js`、`i18n-data.js` 和 `content/knowledge-inventory.json` 是生成产物，由集成对话运行构建更新，其他对话修改原料。语言层 `language-engine.js` 与 `town-i18n.js` 归游戏对话。共享接口、题目判定字段和存档结构由集成对话统一审核。

## 接口草案 v1

这些是待各对话共同冻结的模块接口，不是新增的线上HTTP端点。现有 `/api/course-jobs`、课程导入与 `CourseSchema.normalize` 继续作为兼容入口。

所有包都带 `schemaVersion`、稳定 `id` 与 `revision`。文字使用 `{zh, en}`；来源原文另存，不把翻译伪装成逐字引用。数值阈值与案例必须标明是资料事实还是教学演练条件。ID不由当前显示语言决定。

```ts
type LocalizedText = { zh: string; en?: string };
type MaterialBundle = {
  schemaVersion: 1; id: string; revision: number;
  materials: { id: string; name: string; text: string; contentHash: string }[];
};
type KnowledgePack = {
  schemaVersion: 1; id: string; revision: number;
  materialBundleId: string;
  objectives: { id: string; title: LocalizedText; unitIds: string[] }[];
  units: {
    id: string; objectiveIds: string[]; category: LocalizedText;
    title: LocalizedText; explanation: LocalizedText;
    examples: LocalizedText[]; misconceptions: LocalizedText[];
    prerequisiteIds: string[];
    evidence: { materialId: string; locator: string; quote: string }[];
    status: 'supported' | 'gap' | 'needs-review';
  }[];
  gaps: { objectiveId: string; missing: string; requiredMaterial: string }[];
};
type LearningPlan = {
  schemaVersion: 1; id: string; revision: number;
  knowledgePackId: string; knowledgeRevision: number;
  chapters: {
    id: string; title: LocalizedText;
    sections: {
      id: string; objectiveIds: string[]; prerequisiteSectionIds: string[];
      learnUnitIds: string[];
      activities: {
        id: string; type: 'sort'|'order'|'choose'|'number'|'matrix'|'allocate'|'rate'|'edit';
        unitIds: string[]; objectiveIds: string[];
        prompt: LocalizedText; data: object; rubric: object;
        feedback: LocalizedText;
      }[];
    }[];
  }[];
};
```

`PlayableCourse` 的第一版目标就是现有 `CourseSchema.normalize` 可接收的结构：四章 → 小节 → lessons / activity / questions。编译器展开知识引用、保持稳定内容ID，并生成当前游戏使用的数据。未来扩展章数或交互类型时，提升契约版本或显式添加能力声明，不让渲染器猜测未知玩法。

接口函数建议：

```ts
buildKnowledge(materials: MaterialBundle): Promise<KnowledgePack>
validateKnowledge(pack: KnowledgePack): Diagnostic[]
designLearning(pack: KnowledgePack): Promise<LearningPlan>
compileCourse(pack: KnowledgePack, plan: LearningPlan): PlayableCourse
validateCourse(course: PlayableCourse): Diagnostic[]
```

`Diagnostic` 至少含 `severity`、`code`、`path`、`message`、`sourceId`（如适用）。错误要定位到具体知识或活动；缺口不能被模型自行填平后当作有来源知识。编译失败时保留资料与已完成的知识包，供人工补充和再次生成。

## “整理成可学习内容”应单独验收

A对话首先回答：是否覆盖学习目标、定义有没有依据、概念之间是什么关系、哪些知识应先学、哪些只是例子或边界、哪些内容仍不足。不能只统计抽取了多少条。

B对话接着回答：学习者看完以后应能做什么、用什么活动证明理解、哪里需要反例或迁移、什么错误应回看哪段知识。每个操作必须链接知识单元与评分依据；只换图标、点三次展开同一段文字不算三种教学互动。

建议共同使用一个小而完整的验收课程，包含术语、流程、数值、权限与业务判断。至少检查：原文引用可定位；目标没有孤立或遗漏；先修关系无循环；题目可解；错误可恢复；答案不被显示语言改变；中英语义对齐；缺译保持原文并提示内容待补，不自动声称已有双语内容。

现有API已经先建立知识库、再生成课程，但目前两步仍编排在同一后端文件里。下一轮应优先提取这两个边界，把知识包保存与人工审阅做成独立步骤；先把A/B的质量做好，再扩充游戏场景。

## 并行协作方法

每个对话使用独立分支与工作目录。开始时写清允许修改的文件、输入样例、输出样例和验收命令。A/B交付数据与模块测试；C用固定样例开发；D定期集成。改契约时同步版本与样例，不能只在某个对话里口头约定。

可复制给新对话的任务：

1. **知识库工程**：阅读本方案。负责MaterialBundle→KnowledgePack，优先做来源定位、缺口、先修关系和双语质量。先提交一份完整样例及诊断结果，不修改游戏页面与共享API入口。
2. **教学设计工程**：阅读本方案，使用冻结的KnowledgePack样例设计LearningPlan。解释每项活动为什么适合对应知识，给出可执行评分与反馈，不直接改UI、存档或课程导入格式。
3. **游戏体验工程**：阅读本方案，使用固定PlayableCourse样例开发呈现与交互。保持学习/答题阶段隔离、三种语言、进度恢复。知识缺口通过诊断反馈给内容模块，不在UI中临时编造知识。
4. **集成工程**：维护契约、编译器、API、存档迁移和发布；保留现有入口。合并其他模块前验证样例契约及完整学习流程，避免多个对话同时覆盖生成文件。

优先拆知识与教学设计；用户体验可以独立优化。等边界稳定后再把原文件逐步搬入未来目录，最终仍由一个集成入口启动。
