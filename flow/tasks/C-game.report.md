# C 游戏体验交付报告

日期：2026-10-20（用户时区）。身份：C；共用主目录，不切分支、不提交、不合并。

## 交接棒（给 D）

C 已完成场景分布与图标修正、阶段机关刷新、双语点击遮挡修复、原位语言切换与窄窗口排版。产出指针：本报告、`apps/game/tests/experience.test.cjs`、`artifacts/runtime/game-C/`。独立模块测试 6/6 通过；实际浏览器完成海边和圣诞全流程、组装跨语言操作、刷新恢复、独立重玩及三个经典入口检查。根级旧双语模拟测试仍需 D 调整，原因与建议见下文。下一步：由用户将本报告交回原 D 集成对话，D 核验后构建原 dist/index.html。

共用目录按任务卡只更新本独占报告，未写根进展、决策、踩坑文件；上述交接棒可由 D 摘录到根进展。

## 完成内容

- 知识物件先分布在镜头中央带，再扩展到外围，避免首批线索主要落到画面边缘。四个学习场景前 25 个位置仍保持唯一；保留手绘背景坐标与避让区。
- 首节知识物件统一使用现有种子盆 sprite，避免依赖 emoji 字体；物件美术约 40px、透明点击框 84px，不把图案随点击框放大。浇水壶编号 2→5、权限钥匙编号 5→2，修复钥匙/浇水壶互相冒用。未新建或覆盖共享美术。
- 海边/圣诞未到阶段的机关不渲染；到阶段后出现，完成后保留景观。完成物件不再拦截指针；当前物件和投放点优先。统一 64×64 冒险点击框，把多行双语标签放在框外且不接收指针，解决来信挡第三航标、火车支线挡绿礼物目标等实测问题。
- 切换中文/英文/双语只翻译当前 DOM，不关闭重建弹窗，保留选中的组装部件、分箱物件、输入框节点、草稿与事件。学习/工坊始终渲染中文原树并登记双语对，确保英文中新打开的组合文案也能回切中文。
- 统一指南文本来源，补齐完整指南、冒险提示、航标方向和通关说明的双语对应。没有新编学习知识、答案或评分规则。
- 主界面改用实际页头高度分配剩余空间；窄窗口页头导航和章节导航可横向滚动，底部托盘可纵向滚动，长知识列表在弹窗内滚动。
- 保留阅读收集、场景找部件与组装、首节概念整理、后续八类工坊、知识回看、复习错题、章内顺序、四学习章加两冒险章独立进度、90%门槛及独立重玩。

## 输入/输出与文件范围

输入：冻结 `schemaVersion=1`；`packages/contracts/fixtures/{materials,knowledge,learning-plan}.v1.json` 均为 revision 1；现有内置课程；现有 PlayableCourse/运行时接口。
输出：前端源码、C 模块测试、独立预览和验收证据；没有更改共享契约、答案 ID、判分或存档结构。

C 实际修改文件：

1. `apps/game/src/knowledge-play.js`
2. `apps/game/src/scene-adventures.js`
3. `apps/game/src/task-workshop-ui.js`
4. `apps/game/src/task-workshop.css`
5. `apps/game/src/town-i18n.js`
6. `apps/game/tests/experience.test.cjs`（新增，D 集成时请纳入 Git）
7. `flow/tasks/C-game.report.md`（本报告）

验收输出：`artifacts/previews/game-C/**`、`artifacts/runtime/game-C/**`。

共用目录观察到其他对话同期修改 `apps/game/src/course-import.js`、服务、包、根脚本和 dist 等文件；这些不属于 C 本轮产出。C 没有运行根 build，没有直接写 dist，也没有暂存或提交其他对话文件。预览构建会复制构建当时的共享生成数据与其他源码，D 应以本报告文件清单核对本轮差异。

## 验收命令与实际结果

均从项目根目录执行。

| 命令 | 实际结果 |
| --- | --- |
| `node scripts/test-module.cjs game` | 6/6 通过；构建到专属预览目录。覆盖原四入口/美术、三模式/独立章、语言切换保留控件与草稿、四场景位置、v1固定样例四种不同控件、阶段刷新与独立重玩 |
| `node scripts/build-game.cjs --out artifacts/previews/game-C` | 成功，53 个运行时文件；不覆盖主 dist |
| `node scripts/build-game.cjs --out artifacts/previews/game-C --check` | 通过，53 个运行时文件与源码一致（仅对执行时快照成立） |
| `node scripts/preview-game.cjs --dir artifacts/previews/game-C --port 8773` | 成功启动 `http://127.0.0.1:8773/`；无真实模型调用 |
| `node tests/knowledge-ui.cjs` | 通过：阅读、场景组装、错误投放、知识整理、恢复和独立重玩；模拟 DOM |
| `node tests/workshops-ui.cjs` | 通过：12 个后续小节共 42 轮操作，八类控件、错误决策、相关知识回看和账本草稿恢复；模拟 DOM |
| `node tests/chapter-ui.cjs` | 通过：先学后练、交付、错题、来源回看、部分测验恢复、四章完整测验；模拟 DOM |
| `node tests/adventures-ui.cjs` | 通过：两套冒险全流程、六章入口、章内顺序、独立存档和恢复；模拟 DOM |
| `node --test tests/chapter.test.cjs tests/workshops.test.cjs` | 11/11 通过；含90%门槛、畸形进度拒绝、八类判定与草稿恢复 |
| `git diff --check -- apps/game` | 通过 |
| `node tests/bilingual-ui.cjs` | **未通过**：旧 harness 无 `createTreeWalker`，翻译前即返回；该测试断言切语言后原始 `innerHTML` 包含英文正文，依赖旧的弹窗重建。保留失败日志，未改共享 harness；实际浏览器 en→zh/bi 翻译及按钮操作已通过 |

证据日志在 `artifacts/runtime/game-C/`。新增控件状态测试明确仅验证模拟 DOM 控件与草稿，不把它冒充实际翻译、渲染或触摸设备测试。

## 实际浏览器步骤与结果

浏览器：Codex 内置 Chromium，使用实际 UI 点击/Enter，无控制台注入游戏状态。桌面 1280×720；另查 390×844、最终截图确认实际 360×640。窄屏采用指定标签页 CDP 尺寸与完整 viewport 截图，已清除尺寸覆盖并恢复正常视口。控制台最终读取 error 列表为空。

### 学习、组装与语言

1. 关闭首次指南；点人工智能物件阅读定义、收集，点击本节装置归位，显示 1/22。
2. 点“机器学习 ML”打开玻璃小苗圃，回场景；依次用罗盘定位种子盆、花盆、浇水壶，逐个打开阅读并收集。
3. 回组装面板，选择第一个部件；切换中文→英文，然后对第一个插槽按 Enter，成功放入（旧实现会在重开弹窗时清掉选择）。继续放入两部件，3/3后可收集。
4. 收集并整理后显示 2/22；刷新仍保留。重玩本学习章后再走一次组装，验证重玩清理只作用当前学习章，最终截图的浇水壶图案正确。
5. 在英文模式中新打开本节装置，再切中文：标题、组合说明、分类、内容回到中文，按钮可继续操作。指南英文→中文→双语同样检查完整正文和按钮。
6. 360×640 下依次切中文、英文、双语；横向导航、纵向托盘和长知识列表可滚动；用 Enter 操作返回按钮。截图记录三种模式与双语长面板。

### 海边、圣诞与保存恢复

1. 第五章收集 pearl/coral/amber，投到 chime；首次选择贝壳后切换双语，再对投放点按 Enter仍成功。
2. 第一阶段结束后当前航标出现，后续来信物件尚不出现。三面航标依次设为东、南、西；检查后出现最后符号。
3. 依次 shell→wave→bird，投递完成。刷新后保持三任务通关和双语。
4. 第六章按红→烘焙屋、绿→驿站、金→圣诞树投递；修复双语标签/支线遮挡后都可正常点中。
5. 街灯依次操作开关 1、2、3，三灯全亮；检查后依次 star→bell→moon，提交通关。
6. 回第五章确认重玩，回到任务1/3；第六章仍保持通关，学习章仍保留2/22。随后单独重玩学习章并再次组装，冒险结果不受影响。
7. 三个经典链接实际打开：`adventure.html` 显示失落档案馆开始界面，`expedition.html` 显示八站地图，`short-hunt.html` 显示林间寻物首局引导。未重写它们玩法或重置其存档；本轮未把三个经典游戏全量再通关。

浏览器的90%/错题/四学习章完整流程由既有模拟UI和纯逻辑测试覆盖，本轮真人式浏览器重点验证改动路径，没有手工刷完所有学习章题目。

## 截图路径

均为项目内真实 JPEG，非设计稿：

- `artifacts/runtime/game-C/screenshots/scene-final-zh.jpg`：最终中文场景。
- `artifacts/runtime/game-C/screenshots/assembly-language-selection.jpg`：选部件→切英文→Enter放入，最终3/3，浇水壶正确图案。
- `artifacts/runtime/game-C/screenshots/seaside-complete-bi.jpg`：海边双语通关（阶段隐藏修复后的当时画面；末段翻译后来已补齐）。
- `artifacts/runtime/game-C/screenshots/winter-complete-bi.jpg`：圣诞双语通关。
- `artifacts/runtime/game-C/screenshots/classic-entries.jpg`：三个经典入口。
- `artifacts/runtime/game-C/screenshots/narrow-zh-360x640.jpg`
- `artifacts/runtime/game-C/screenshots/narrow-en-360x640.jpg`
- `artifacts/runtime/game-C/screenshots/narrow-bi-360x640.jpg`
- `artifacts/runtime/game-C/screenshots/narrow-basket-bi-360x640.jpg`：双语长知识列表，内部滚动。

## 评审

按根规则使用独立模型 `gpt-6-astra` 只读评审。初评指出英文指南不能完整回切、模拟 DOM 没有执行真实翻译；均已修复/明确测试边界并浏览器复测。后续复核阶段显示、点击层级、64×64框与中文原树翻译，未发现严重逻辑风险。评审未修改文件、未替代实际浏览器验收。

## 未完成事项、已知限制与 D 建议

- **D 集成尚未在本 C 报告中验收**：C 未合并、未发布、未调用真实模型。原 dist/index.html 的最终构建与兼容验证由 D 负责。
- 根级 `tests/bilingual-ui.cjs` 的旧断言需 D 调整：给 harness 提供真实 DOM 翻译能力，或把文本显示断言移到真实浏览器测试，保留控件身份/事件/草稿与语言ID断言。不要为迎合无DOM的测试恢复弹窗重建。
- 旧 `tests/exploration-ui.cjs` 有“阶段0点击未来机关”的断言，与本次按阶段出现的需求不一致；本轮只静态确认这一点，未把该脚本报成通过。D 应改为验证阶段0无未来机关、阶段1/2当前机关出现且可点，并保留支线/恢复断言；该脚本还存在对更早发现式UI的假设，需一并核对。
- 原生触摸设备、屏幕阅读器、全部语言词条覆盖率未穷尽；本轮做键盘Enter、鼠标、桌面及窄viewport检查。非常短的窗口需要滚动底部工具栏；全景下图案会随地图缩小，可使用罗盘/放大。保留原功能，不宣称完整无障碍认证。
- 前端依然依赖既有全局控制器和词典；没有更改共享运行时格式、后端或判分。个别非核心经典/支线文案可能沿用原中文；没有对三经典全量做英文化。
- **接口变更建议：无必需 schema/API/判分/存档变更。** 建议 D 在后续独立的兼容变更中统一三语言界面词条与浏览器回归，避免在共享运行时添加显示语言相关答案ID。
- **文档建议：无需更改根 AGENTS 结构或长期约定。** 本轮依据已有 C 卡改体验，阶段出现规则、同图标同用途均为已授权要求。

## Git 与下一步

开始时分支 `main`；基线提交 `9f7f67b57ad3f4e5ba07a4685d1f8359733edfb7`。共用目录未切换/重置/清理，**C 未创建提交或分支**。其他对话有同期改动，D 请仅按上面 C 文件清单审阅差异，不按整棵工作区认领。

用户请将本报告路径交回原 D 集成对话：`flow/tasks/C-game.report.md`。由 D 最终集成、测试、构建和发布，保证原 `dist/index.html` 继续可玩；C 不自行联系其他对话。
