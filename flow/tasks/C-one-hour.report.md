# C 一小时可见版本入口交接

## r2 定向布局修复及最终文件确认（优先于下方r1结果）

D指出非chapter页面仍用固定页头高度扣减main的风险；本轮仅修改`release-guide.css`、`release-guide.test.cjs`及本报告，`release-guide.js`未改。CSS将带版本页头的body设为100dvh纵向flex，页头不收缩，main使用实际剩余高度并解除viewport最小高度；不再依赖64/74px等固定扣减。capacity-sandbox保留24px页头外边距并纳入布局，town-immersive继续隐藏页头、main占满视口。使用现代CSS `:has()`限定作用范围；旧版不支持该选择器的浏览器不在本轮验证范围。

测试load现在先检测`window.ReleaseGuide`，已安装则只refresh，否则才注入候选；新增HUD/语言函数身份保持用例，防止D接线后测试重复包装。D已在源码index接入CSS与脚本，C只读确认加载顺序；r2预览也已包含这两引用，专项测试实际走已安装分支。C未修改index。

| r2定向命令 | 实际结果 |
| --- | --- |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/release-r2` | 67运行文件，退出0，仅C预览 |
| `$env:TOWN_TEST_DIST='artifacts/previews/game-C/release-r2'; node --test apps/game/tests/release-guide.test.cjs` | **5/5通过，退出0**；含真实index加载顺序及不重复包装 |
| 同预览`--check`及本轮`git diff --check` | 67文件一致，退出0；diff检查通过 |

指定`gpt-6-astra`再次只读复核这两项定向修改，无明确P1/P2，确认级联覆盖旧固定高度、sandbox偏移和沉浸布局；审稿未跑测试/浏览器。未为CSS和测试helper调整重复整套模块，之前42/42仅为r1快照。新证据：`artifacts/runtime/game-C/release-r2/tests.txt`、`verification.json`。无浏览器操作、无截图；真实窄屏可用高度/布局仍待D验。最终交付文件即当前`release-guide.js/css`和专项测试，后续统一发布由D执行。

## 设计与范围（2026-10-23）

授权窗口11:20:04—12:20:04 UTC。仅领用`apps/game/src/release-guide.js`、`release-guide.css`、对应新增测试和本报告；D负责index接线、构建、服务与发布。

设计：在页头新增常驻课程教学版本/“查看本次更新”入口，独立于可折叠底栏。由当前银行课程及已有教学快照识别B4/B5或兼容课程；可识别的内置旧课明确提供“体验新版（旧记录保留）”，分别调用`openTeachingCourse('legacy5'/'aib5')`。自定义材料不冒充同课升级。只由用户点击切换，查看不创建快照、不写进度、不反复弹窗、不自动清档或迁移。

已确认用户双击“开始游戏.cmd”；D已核8782身份。本模块不重复检查启动器/浏览器，也未读取用户实际银行；旧银行沿用旧课只是待验证原因，版本提示必须按实际当前课程显示。

本轮Goal工具限制：原八小时目标为paused且未完成，create_goal拒绝创建新目标；工具不支持恢复/改目标。未虚假完成旧目标，按根计划的新一小时授权执行，期限不延长。

## 交付状态

候选完成，D已接线（见顶部r2），待最终集成验收；C未修改index、teaching控制器、共享契约、服务、构建脚本或dist。实际版本识别使用课程ID及完整签名，与当前银行的既有教学快照匹配；不使用标题推断课程，不声称用户已切新版。当前B5显示“当前课程 · 探索教学5”，B4显示4，旧课显示兼容教学，自定义/自由材料保留其实际路径；无效快照单独提示未验证并隐藏升级操作。

标准页头常驻“查看本次更新”，旧版内置课另有“体验新版（旧记录保留）”。点更新可查看当前流程、实际知识素材箱/应用工坊入口说明、选择已有课程及返回。只有显式点击升级才调用既有`openTeachingCourse`；旧课程和章节状态保留，当前已有目标银行可复用。弹窗升级前重新核验bank/course/revision/binding，拒绝已经切银行的旧回调。安装、版本展示、查看更新不创建教学快照、不改学习状态，不自动弹窗；语言切换保留常驻按钮节点和弹窗返回焦点目标。

### 修改文件

- `apps/game/src/release-guide.js`（新增）
- `apps/game/src/release-guide.css`（新增）
- `apps/game/tests/release-guide.test.cjs`（新增）
- `flow/tasks/C-one-hour.report.md`（本报告）

另按用户先前要求更新了`flow/tasks/C-game.report.md`的非浏览器交接补充，属于探索修复历史报告维护，不是本候选的接线文件。其他模块报告、根plan/进展等并发变化不属于C；勿整棵目录提交。

### D接线约定（r2已由D接入源码）

在`apps/game/src/index.html`现有布局CSS之后加载`release-guide.css`，在`teaching-v5-ui.js`之后加载`release-guide.js`。脚本依赖既有`currentCourse`、`teachingEntry`、`TeachingCatalog`、`renderHUD`、`changeTownLanguage`及弹窗接口；应保持普通同步脚本顺序，挂接实际初始化首轮HUD，无需主动弹窗或启动新版课程。

r1预览HTML尚未引用新文件；r2已包含D接线，见顶部。D仍须核验最终实际入口资源，不能把本地预览存在引用当成用户实际版本生效证据。无需新增共享API或存档字段；本候选不会展示构建版本，显示的是当前银行课程的教学版本。

## 验收命令与实际结果

| 命令 | 实际结果 |
| --- | --- |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/release-r1` | 67运行文件，仅C预览；这是最初候选构建，不作为最终源码一致证据 |
| `node scripts/test-module.cjs game` | 构建`artifacts/previews/game-C`，67运行文件；**42/42通过，退出0**；模拟DOM与逻辑测试 |
| `$env:TOWN_TEST_DIST='artifacts/previews/game-C'; node --test apps/game/tests/release-guide.test.cjs` | **4/4通过，退出0**；含评审建议补充后的最终用例 |
| `node scripts/build-game.cjs --out artifacts/previews/game-C --check` | 67文件与源码一致，退出0 |
| 本轮文件`git diff --check`及`node --check apps/game/src/release-guide.js` | 退出0 |

专项测试通过实际HTML加载顺序的harness启动，再注入待接线候选；共享模拟DOM不解析header祖先，测试仅补上header查询host，未修改共享harness。覆盖：安装/查看不写状态；折叠底栏后host保留；旧非空fixture显式进legacy5；B4 AIB进aib5；旧银行及章节记录逐字保留；切回旧银行并刷新保留选择；陈旧弹窗不能升级另一银行；zh/en/bi、按钮节点和焦点返回目标；关闭后切语言不重开；自定义改ID、同ID改正文及无效快照不误升级。该模拟host不能证明真实header几何、焦点恢复或浏览器翻译效果。

证据：`artifacts/runtime/game-C/release-r1/tests.txt`、`verification.json`（含最终源码SHA256与本轮结果）。完整模块测试在工具输出中为42项，未另存完整stdout；不把专项日志说成整套模块日志。

### 跨模型评审

通过调用配置明确指定`gpt-6-astra`独立只读审查，未发现明确P1/P2阻断问题；审稿未构建、测试或操作浏览器。确认ID+签名分类、显式升级、旧档边界、陈旧回调复核、页头独立及语言重绘。评审建议补的“关闭后切语言不重开”“同ID修改正文不误升级”两条已纳入最终4/4结果。初版语言重绘重新调用modal的焦点问题已改为仅绘制原弹窗内容，保留原返回目标。

## 保存恢复与真实浏览器待补

保存恢复仅有上述非空历史fixture模拟证明；未读取用户实际bank，未操作浏览器或启动器。**本轮截图：无；截图路径：无新增。** 不重复此前已阻断的浏览器检查。

待D接线后实际操作并截图：

1. 首次进入及已有旧档：页头显示实际教学版本；收起底栏仍可点更新；查看不切课、不改进度，不主动重复弹窗。
2. 旧内置与B4 AIB分别点体验新版，核目标legacy5/aib5；从“选择已有课程”切回原银行，刷新确认旧记录/旧选择保留；已有B5显示5且不提示重复升级。
3. zh/en/bi逐一切换，分别在页头和更新弹窗操作；关闭、切语言、切银行后核按钮和焦点；陈旧弹窗不能操作已离开的银行。
4. 360×640、390×844、1280×720实际尺寸，检查页头增长、场景剩余高度、横向导航、双语按钮换行、键盘Tab/Enter与触屏。标准页头随现有沉浸模式隐藏，本候选不改沉浸模式；退出沉浸后入口应恢复。
5. 从启动器实际入口确认接线后的JS/CSS资源已加载，再验原dist/index.html和三个经典入口；记录URL、浏览器/构建版本、尺寸、新截图路径。

## 未完成、限制与交接

- D已接源码index，尚需最终统一构建发布及实际浏览器验收；C候选测试不能代替这些步骤。
- 自定义/签名变化课程不提供同课升级；当前版标记只说明教学流程版本，不证明内容审校或学习效果。
- 本轮无共享接口、判分、答案ID或存档结构修改建议；如D改变接线顺序或全局函数，应同步检查兼容挂钩。
- 共用分支`main`，核对HEAD为`2dd3d2af0e4f8a0bcede4842aa796d53e8290066`；C无提交，不合并、不发布、不联系其他对话。核对时额度used9%、remaining91%，未触发≤10%提前收尾。

交接棒：C完成独立于折叠底栏的实际课程教学版本/更新入口及r2可变页头布局修复；D已接源码index，跨模型定向复评无明确阻断，r2专项5/5及67文件一致检查通过，r1模块42/42仅保留为当时证据。请用户将本报告交回原D集成对话，补真实浏览器/旧档/窄屏证据并最终统一构建发布，保证原dist/index.html继续可玩。
