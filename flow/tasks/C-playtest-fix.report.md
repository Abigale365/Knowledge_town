# C 本地试玩整改：应用场景

## 范围与设计

按`D-local-playtest-fixes.md`，仅新建`application-scene.js/css`、专项测试及本报告；D接index与本地构建。禁止提交、推送和修改dist/服务/教学控制器。

复现：当前收藏会移除原场景知识；全部收藏并确认基础后，没有可点击知识回看物件。当前小节装置预览的进入按钮仍转知识列表，而非直接定位当前示范/引导/独立应用。候选新增独占场景层：散布缺失知识的原多样图案、情境检视板、齿轮工坊。只在当前小节基础门禁满足时出现，调用现有openTaskWorkshop/openStudyLesson；不提交、不判分、不授通过。检视板只投影既有当前题面/情境，不展示答案或自行编知识。

## 完成内容与实际边界

候选完成，D已接源码index末尾，C未修改index。仅学习模式`learn`且当前小节既有基础门禁ready时叠加；正式practice/review/assessment及远行不叠加，不混淆答题/场景道具角色。

- 独占`applicationScene`层：齿轮工坊直接调用`openTaskWorkshop()`进入当前示范/引导/独立应用或收成果；木制检视板投影既有当前情境/题面；原图案知识物件散布在场景中，通过`openStudyLesson()`回看定义、例子和来源。不是一排常驻表单按钮。
- 原基底已显示的知识不重复添加；仅补缺失知识的最多6件，保留原本不同知识图案。其他知识均可由检视板的完整本节列表打开。收藏与归档状态不由本模块改变。
- 阶段完全由当前银行的已有教学快照/`ready`、`complete`、B5 demo/guided判定读取；渲染不创建教学进度、工坊draft或修改完成标志。检视不提交/判分/展示答案或解析；应用全过后仍由原`workshopFinish`收成果，本模块不代封节或通关。
- 只更新/移除自己的覆盖层，不清loot、features、stations、动画或其他world子层。点击前重核银行、课程binding、小节及区域；同节阶段变化进入最新阶段，旧银行/跨小节回调不作用于新进度。弹窗close事件刷新场景阶段。
- 密集场景先选原锚点，再用附近空地候选补位；本层84px点击框中心间隔至少横108px或纵104px（2400×1600世界坐标），并避开已知知识、道具、装置及NPC路线端点/中点。不能据此替代真实几何验收。
- 文案显式使用`TownLocale.text(zh,en,state.language)`；双语输出两行并标记locale-fixed，避免重复翻译。切语言只重绘自己的打开检视，不调用modal重开，不重置工坊草稿。
- 兼容D旧题适配：当legacy课程且`PlaytestDecisionTask.legacyMatches(round)`精确匹配时，检视使用`visibleTask().title/scenario`的业务自然语言，不再投影四代码旧说明。只读取去答案副本，不调用会初始化工坊草稿的`legacyRepairContext`，不改round或存档。

### 变更文件

1. `apps/game/src/application-scene.js`（新增）
2. `apps/game/src/application-scene.css`（新增）
3. `apps/game/tests/application-scene.test.cjs`（新增）
4. `flow/tasks/C-playtest-fix.report.md`（本报告）

D的index/legacy-repair-ui/构建脚本、B候选、动画及其他并行修改不属于本补丁，禁止整棵目录提交。D接线约定：CSS在已有样式之后，JS在release-guide及legacy-repair-ui之后最后加载；测试load检测已安装对象仅refresh，不重复包装。模块自身也有重复安装guard。

## 验收命令与实际结果

所有证据均为模拟DOM/现有处理器，不是浏览器操作。

| 命令/快照 | 实际结果 |
| --- | --- |
| 前置复现（原dist的真实入口顺序harness、22项逐一发现→收藏→确认基础） | 初始knowledge22/filed0，之后0/0，stage=demonstration、收藏22；点当前装置仍打开basket而非demo。证据`artifacts/runtime/game-C/application-r1/before.json` |
| r1专项 | **0/3，失败**：避让仅依赖稀疏锚点且间距过保守，知识/检视板或整层放不下。没有通过降断言隐藏问题；调整附近空地候选与仍大于点击框的间距 |
| r2专项 | **3/3通过**；修复后完整阶段、恢复与legacy5流程通过。r2尚非最终双语/旧题兼容快照 |
| `$env:TOWN_TEST_DIST='artifacts/previews/game-C/application-r3'; node --test apps/game/tests/application-scene.test.cjs` | **4/4通过，退出0**；最终核心流程、原物件保留/恢复、旧回调/语言门禁、B4替代情境/既有工坊 |
| 同r3环境加`--test-name-pattern='layout fixture'` | **1/1通过，退出0**；两门内置课程×四学习场景的首节合法先修位置夹具，工坊/检视板/回看物件存在；跨小节旧按钮拒绝。该用例在前一命令启动后加入，故分开执行，不将日志伪称一次5/5 |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/application-r4`及同目录`--check` | 最终本地候选71运行文件，构建/一致检查退出0；仅专属预览，未写dist |
| r4环境`node --test --test-name-pattern='B4 retired\|layout fixture' apps/game/tests/application-scene.test.cjs` | **2/2通过，退出0**；最终同步D源后的旧题兼容与四场景位置复验，非新增两项独立测试 |
| `node --check apps/game/src/application-scene.js`、本轮文件`git diff --check` | 通过 |

r3一致检查曾因D并发修改`legacy-repair-ui.js`失败，未冒称全量一致；之后r4重新构建并独立check通过。未重复全游戏/全课长测，只做本任务必要定向验证。正式发布回归由D决定。

最终证据索引：`artifacts/runtime/game-C/application-r4/verification.json`包含C源码/测试哈希、r3核心4项与布局1项、r4定向2项及构建结果。原始日志分别为r1/r2/r3/r4目录内`tests.txt`及r3的`layout-tests.txt`；不把分次执行伪称一次完整5/5运行。

### 保存恢复与跨模型复核

实际处理器测试覆盖：AIB5示范→引导错解→正确引导→独立各轮→结果未封节→原收成果；legacy5的22基础确认后直接进入示范；阅读回看与收藏记录保留。引导错解后保存、重新harness加载，草稿、辅助及教学进度逐字相同，工坊继续原阶段；本模块refresh和检视本身不改state。B4用合法先修夹具并通过原判分API推进到旧题，检视保持round，实际业务工坊可进入；不把夹具冒充玩家全课通关。

指定`gpt-6-astra`两次只读复核，最终未发现明确P1/P2；确认无新判分/状态写入、阶段路由、去答案题面、旧回调校验、B4适配和显式双语。审稿未跑测试、构建或浏览器。布局剩余边界：中心避让未测量其他控件全部真实边界，位置仍可能不足；不能把首节位置夹具通过泛化为全部小节/真实六章视觉通过。

## 浏览器、截图和未完成事项

**未操作真实浏览器，本轮截图路径：无新增。** 现有工具无可控页面的限制仍在，未重复启动器/浏览器失败检查，也不借用旧截图。本地预览路径为`artifacts/previews/game-C/application-r4/`；D统一8782试玩版，C未操作服务。

待D实际补验：

1. 旧非空银行/B4与legacy5、aib5分别进入当前小节，基础前不抢原入口；基础确认后关闭弹窗，场景可见工坊、检视板及缺失知识回看物件；收藏过的也可回看。
2. 依次点击工坊看示范、做引导、独立应用；暂时返回场景/原生关闭弹窗后标签同步；错解不推进，成功后仍须原收成果，不能凭检视封节。
3. 检视板显示当前题面而非答案；旧repair-mapping显示业务情境；点击知识看定义/例子/来源并返回；草稿、收藏、辅助标志、旧银行与独立章进度保留，刷新继续。
4. zh/en/bi、360×640/390×844/1280×720、展开/收起底栏，检查初始镜头可发现程度、物件比例、实际点击框、短标签/单一提示、键盘焦点、来源返回及原生触屏；必须截图记录构建、URL、尺寸与浏览器版本。
5. 其余学习小节、四学习背景、正式练习/测验及三个经典入口回归；原场景道具、动画、拖放、90%和独立重玩保持。必要时由D调整接线，不能通过清档或自动通过掩盖问题。

## 接口建议与本地交接

无共享schema、答案ID、判分或存档结构修改；只需D保持当前加载顺序。当前旧题业务检视通过可选只读`PlaytestDecisionTask.visibleTask()`接入；未来新增阶段题面应提供相同的去答案只读情境接口，不能在C前端临时编造教学内容。

共用分支`main`，核对基线`039861f0e7aebf5a53cc8f48282485987847d6c3`。C无新提交、未暂存/推送/上传、未改dist，不自行发布。本轮仅供本地用户试玩，后续发布须用户确认。请将本报告交回原D集成对话；由D汇总根进展和最终本地构建，保证原dist/index.html及经典入口继续可玩。

交接棒：C已交应用场景候选，D已接源码index；基础后有分散知识回看、情境检视与直接阶段工坊，不授通过、不改存档结构。跨模型复评无明确P1/P2；5项专项分次通过，最终同步2项复验及71文件一致检查通过。请D仅作本地试玩集成，补浏览器/截图清单，不提交上传，等待用户确认。
