# C交互后台候选：密集场景与阶段反馈

2026-10-23。按`D-playtest-background.md`完成有边界的一轮后等待；用户当前试玩的dist、assets、8782、入口、启动器及存档冻结。只领用application-scene.js/css、对应测试、本报告；仅构建`artifacts/previews/interaction-background`。不整合、不提交、不上传，不恢复Goal或自动化。

## 开工核对与本轮计划

当前源码存在两处可独立定位的问题：阶段/语言变化会重建覆盖层按钮，却未恢复原焦点；知识悬停同时启用本地small标签及全局explorationHint两套提示。工坊/检视常驻标签还使用长双语动作文本，可能在密集布局中向相邻物件扩展；这部分仅为静态风险，未冒称浏览器已见遮挡。

本轮计划：保留散布物件与既有判分，改为短角色标签＋工坊真实阶段/轮次反馈，知识只用一处提示；同上下文尽量复用仍安全的位置，保持键盘焦点；两个主要装置优先留位。加入针对性逻辑/模拟验证及不同模型只读复核。真实窄屏、标签和触屏仍需浏览器补验。

## 本轮候选改动

- 关键装置联合选位：同时为工坊与检视板选取安全位置，避免贪心占用剩余空隙；同银行/课程/小节/区域内复用仍安全的位置，出现阻挡时避让，空地重新出现时不立即跳回。知识按ID保留安全旧位置，仍最多补6件缺失物件，不清其他场景层。
- 短标签与阶段反馈：工坊、检视板仅常驻短角色名；工坊另用示范／引导／应用当前轮次／待收成果／成果已收好徽标。角色标签最大108世界像素宽、30高，窄窗口宽度收至96；完整动作保留在aria-label和单一提示中。没有将小节成果显示成章末通关。
- 知识只保留全局一处悬停/焦点提示，包含现有知识标题与回看说明；删除本地small重复标签和原生title。重绘只清理本模块标记的旧提示，不清其他来源提示。
- 重绘前记录自身按钮焦点，语言/阶段变化后按知识ID或装置ID恢复；弹窗打开时不抢场景焦点。覆盖层消失且自身按钮原来获得焦点时，回到现有viewport。检视弹窗仍使用原有返回/语言逻辑。
- 无教学侧车的兼容活动，使用原只读`WorkshopEngine.mastered()`读取待收成果状态，已sealed显示成果已收好；不初始化progress、不新增通过条件。原判分、门禁、90%、存档结构和知识/答案ID不变。

### 变更文件（本轮仅这四项）

1. `apps/game/src/application-scene.js`
2. `apps/game/src/application-scene.css`
3. `apps/game/tests/application-scene.test.cjs`
4. `flow/tasks/C-interaction-background.report.md`

工作区已有其他会话的index、动画、D旧题适配、dist及构建修改，均为开工前或别的领用，不属于本轮；C未修改/暂存它们，不得整棵目录收取。报告中的保存测试只在隔离harness的Map内执行，不访问用户浏览器或当前存档。

## 验证与证据

复现证据`artifacts/runtime/interaction-background/before.json`：现行dist的合法基础夹具下，聚焦工坊后切双语，旧按钮仍被document.activeElement引用，新按钮未聚焦。候选对应测试确认重绘后聚焦当前按钮。

测试除保留原B5完整阶段、B4替代题、旧银行/刷新、三语言及四背景布局夹具外，本轮新增焦点/单提示、阻挡避让/位置稳定、无侧车兼容成果状态；原完整流程增加每轮当前阶段/轮次徽标检查。夹具仅模拟前置记录，不能当作用户实际全课完成或学习效果证据。

### 实际命令与结果

| 命令/检查 | 结果 |
| --- | --- |
| `node scripts/build-game.cjs --out artifacts/previews/interaction-background` | 专属预览71运行文件，退出0；收尾兼容状态分支后在同专属路径重建 |
| `$env:TOWN_TEST_DIST='artifacts/previews/interaction-background'; node --test apps/game/tests/application-scene.test.cjs` | **7/7通过，退出0**；含完整阶段/每轮反馈、焦点/单提示、位置稳定、保存恢复、legacy5、B4替代题和两课四背景夹具 |
| 同环境`node --test --test-name-pattern='background candidate\|compatible activities\|layout fixture' apps/game/tests/application-scene.test.cjs` | **4/4通过，退出0**；收尾新增兼容成果分支与提示断言修正后，复验焦点/提示、兼容待收成果、阻挡/位置稳定、四背景夹具 |
| `node scripts/build-game.cjs --out artifacts/previews/interaction-background --check` | 最终71文件与当时源码一致，退出0 |
| `node --check apps/game/src/application-scene.js`及本轮文件`git diff --check` | 通过 |
| 冻结哈希复核 | 全部dist当时105文件及源码index、构建脚本、开始游戏.cmd，共108项，前后SHA256 **0变化**；最终dist文件数量仍105 |

两批覆盖8个独立测试，4项复验中有3项重复；**没有一次完整8/8运行**。7项运行时的JS另存`artifacts/runtime/interaction-background/application-scene-first-suite.js`，最终补的兼容分支通过4项定向验证；不伪称前一结果针对该收尾代码。测试日志为`tests.txt`、`final-targeted-tests.txt`；`verification.json`含最终C文件哈希、结果与冻结检查；`frozen-before.json`、`frozen-check.json`保留原始冻结证据。

只构建专属`artifacts/previews/interaction-background`，未运行会写通用game-C预览的test-module，也未运行根发布构建、启动服务或浏览器。预览构建按既有规则复制当时全体源码作隔离上下文，不代表接收或整合其他会话的后台候选。当前试玩版本未更新。

### 跨模型只读复核

通过调用配置指定`gpt-6-astra`独立只读复核本轮增量，及兼容成果状态/提示断言收尾；未发现明确P1/P2。确认联合选位、保留安全位置、自身焦点恢复、只清自有提示、阶段徽标不冒充通关，及`mastered()`为原纯读检查。审稿未修改文件、构建或运行测试/浏览器，测试数量以C实际执行记录为准。

### 真实浏览器未验及已知限制

本轮无可控真实游戏浏览器，未重试之前已失败的浏览器路径；**截图：无新增，截图路径：无**。模拟DOM的focus不自动触发原生focus事件，因此测试只检查旧提示节点已清理，允许浏览器恢复焦点时立即生成新的提示。没有用模拟焦点等同原生键盘验收。

中心点避让与标签上限不能证明窄屏无重叠；多语言徽标/标签实际边界、84世界像素点击框在相机缩放后的CSS像素大小、触屏及初始镜头可发现性均待实测。极端拥挤场景仍可能缺少位置，不通过覆盖其他物件强行放置。四学习背景的首节夹具不等于全部小节或六章视觉验收。

用户试玩结束、D决定接收后待补：zh/en/bi及360×640、390×844、1280×720；工坊/检视/知识提示同屏、展开/收起底栏、动态阶段后Tab焦点、触屏和缩放；新增遮挡时避让与解除后稳定；原错题、章内顺序、独立重玩和三个经典入口。记录构建/URL/尺寸/新截图，不能复用历史图片。

## 接入与停止约定

现有加载顺序不变，候选继续放在教学/语言/旧题控制器之后；C不改index。无需共享接口或存档变更。D仅在用户明确试玩结束后审核候选差异，再决定是否统一接入与构建；本报告不授权立即整合、重启8782或上传。

共用main，开工及交付核对HEAD `039861f0e7aebf5a53cc8f48282485987847d6c3`；C无本轮提交/推送，未恢复Goal/自动化、未联系其他对话。本轮应用文件原已是待D提交的未跟踪文件；D可将冻结`dist/application-scene.js/css`作为当前试玩基线只读比较候选源，不能仅凭空的git diff误认为没有增量。

**停止状态：本轮有界候选已完成，停止新增开发/评审并等待。** 不自动接入当前dist，不重启8782，不动当前存档，不上传。交接棒：C交互补联合/稳定选位、短标签/真实阶段轮次、单提示及焦点恢复；7项回归和4项收尾定向通过，指定gpt-6-astra复评无明确阻断，108冻结文件哈希0变化。产出指针本报告及`artifacts/previews/interaction-background`；请D等用户试玩结束后再统一审核，真实浏览器/截图缺口如上。
