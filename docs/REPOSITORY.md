# 仓库导航与保留范围

整理原则：运行中的游戏继续可玩；学习原料和构建脚本分开；当前说明只保留一份权威入口；过期记录归档，生成产物不上传。

## 正在使用的内容

| 位置 | 用途 | 处理方式 |
| --- | --- | --- |
| `dist/index.html` | 当前六章小镇首页 | 保留 |
| `dist/adventure.html` + `app.js`、`engine.js`、`journey.js`、`materials.js`、`packs.js`、`style.css` | 失落的档案馆 | 保留为正式独立玩法 |
| `dist/expedition*` | 星叶群岛 | 保留为正式独立玩法 |
| `dist/short-hunt.html` + `hunt*` | 林间寻物社 | 保留为正式独立玩法 |
| `dist/world*`、`town*`、`learn*`、`venture-engine.js`、`material-compiler.js` | 小镇基础引擎、物件与存档 | 共享依赖，不能按旧文件名判断为无用 |
| `dist/chapter*`、`study-themes.js`、`course-*`、`aib-*` | 当前章节、知识与课程导入 | 保留 |
| `dist/away*`、`scene-*`、`exploration*`、`game-guide*`、`encounter-rules.js` | 场景冒险、探索学习、交互与引导 | 保留 |
| `dist/knowledge-*`、`town-i18n.js`、`i18n-data.js` | 知识收集、组装、配对与双语显示 | 当前维护 |
| `dist/language-engine.js` | 三种语言模式及显式中英文词对 | 当前维护 |
| `dist/task-workshop*` | 情境判定、八类操作控件与十二种装置呈现 | 当前维护 |
| `dist/assets/` | 所有正式玩法共享的图片、缩略图和图集 | 保留，检查脚本会核对静态引用 |
| `dist/aib-practice-pack.json` | 题库JSON导出版 | 保留；与运行用的JS题库用途不同 |
| `dist/capacity-report.json` | 页面展示的容量验证摘要 | 保留；完整临时结果写入本机 artifacts |

本项目没有前端打包步骤，`dist/` 当前就是维护和发布目录，并非可以清空后自动再生的普通缓存。为保持已发布链接、原游戏入口和素材路径稳定，本次不随意改动运行文件的相对位置。

## 已归档的内容

| 位置 | 内容 | 为何离开当前目录 |
| --- | --- | --- |
| `archive/plans/` | 各代玩法研究、迭代计划与执行记录 | 历史设计，不能当作当前玩法说明 |
| `archive/reports/` | 已结束的容量、连续运行和旧版本验证结果 | 历史证据，不代表现在又跑了一次 |
| `archive/history/` | 整理前README、旧上传与运行说明 | 防止多代“当前首页”互相矛盾 |
| `archive/prototypes/world-v06.html` | v0.6 首页源码快照 | 当前首页已经替代它，三套经典游戏不受影响 |
| `archive/experiments/*.cjs.txt` | 定时长跑、旧监控与过期实验 | 部分绑定旧日期、旧输出和旧失败基线；不列入当前测试 |

逐文件迁移位置见 [迁移清单](../archive/file-moves.json)。历史文档里的路径按原样保留作出处记录，请以本导航和当前说明为准。没有删除游戏、美术素材或旧存档数据。

## 开发入口

- [模块边界与并行开发方案](MODULE_BOUNDARIES.md)

- [使用与API配置](GAME_GUIDE.md)
- [测试与验证范围](TESTING.md)
- [课程来源与重建](../content/README.md)
- [海边、圣诞场景美术提示词](art/scene-art-prompts.md)
- [主场景美术来源](art/world-art-prompts.json)

`artifacts/`、`.env`、旧本机 `research/runtime/` 和本机截图不进入GitHub。当前代码不再把新的测试报告写进研究文档目录。

此前已经被Git跟踪的运行摘要已迁入 `archive/reports/runtime/`；旧测试状态检查点改为本机 `artifacts/runtime/` 产物并停止跟踪。原本机文件仍然保留，没有改写仓库历史。
