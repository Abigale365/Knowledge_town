# C概念小游戏UI：D内部接续稳定交付

## 最新边界修复：账页横向位置

D复评指出内层账页重建会回最左，现paint仅在同controller已挂载小游戏重绘时捕获cgLedgerScroll.scrollLeft，重建后恢复；first初次挂载不继承旧游戏位置。动作、语言、读卡、待保存/退出拒绝重绘均保留横向列位置，不进持久化草稿。新增真实scrollLeft=237数值回归及从已在playing的另一controller挂载不继承验证，专项35/35通过；独占预览84文件成功。CSS未变，JS冻结交D复评；未动B/host/根构建/dist/服务。

## 最新可读性批：原始记录并列对照账页

data-cleaner原逐条大卡改原位语义账页：订单编号、原数量、原source核验说明、用户处理决定四列同排，A1不同导入记录与B2相同数量可直接对照。使用原columns/rows/options，不按expected/knownSubtotal或重复ID预分类/突出正确行；缺失保留未知，原mark/小计/结论动作和选中状态不变，不自动核算。窄窗口账页横向滚动并保留可键盘聚焦的滚动区域；选项仍普通按钮和稳定焦点，双语单元格换行。

专项34/34通过（原33保持），新增四列/行头语义、原编号来源数量、未知不填零、不预分类或小计、选择/焦点/三语刷新保持及横滚样式检查。独占concept-ui-internal --concept-stage预览84文件成功。JS/CSS冻结交D复核；未改B/host/index/dist/服务，真实浏览器账页窄窗观感未验。

## 最新表现批：模型数据流原位机器通路

model-flow原输入/执行/输出区原位改为各输入独立机器通路：给定输入→公开固定映射倍率→实际运行输出。尚无真实run时只显示等待，不提前计算；成功execute新增记录后仅相应输入通路短暂传递。错误feed执行不生新结果/动画。最近结果取引擎run.input/output，同输入多次记录折叠回看，不用额外上方卡片重复同信息。feed、judgments及其原actionpayload完全保留，不自动回答或建议经理动作。

专项33/33通过（原32保持），新增唯一输入值验证未执行不可见输出、错误feed无run、实际成功结果与仅对应通路动画、语言/读卡/刷新不重播、历史保留和未自动通过。独占concept-ui-internal --concept-stage预览84文件成功。减少动态静态结果完整，未新增草稿字段；JS/CSS冻结交D复核，未动B/host/dist/服务。真实浏览器机器通路观感未验。

## 最新可读性批：证据序号与当前判断引用

evidence-board源卡标题和打开按钮统一可见序号，与作答区证据1/2等一致；不显示内部ID或期望依据。当前判断只对用户已选引用显示可收拢原文区；已打开可回看全文，未打开只提示到同序号源卡检查，不自动inspect/判断/授通过。所有证据同待遇，仅以用户选择和data.opened决定显示，不读取expected/evidenceIds作提示。多引用不丢弃，以限制高度滚动避免重复材料墙。折叠摘要有稳定ID与键盘焦点样式，既有选择/草稿/三语保留。

专项32/32通过，新增序号对应、只展示已选已开引用、未开不可偷看、不授inspect/判断、语言刷新保持，以及先猜后打开必须重新判断的引擎规则不被自动绕过。原30项保持；独占concept-ui-internal --concept-stage预览84文件成功。JS/CSS冻结交D独立复核。真实浏览器滚动/屏幕阅读器仍未验，未改B/dist/服务。

## 最新交互批：图上区域直接定位

image-inspector现有cfg regions成为透明SVG hit区域，使用原坐标与范围，点击或Tab/Enter/Space仅派发原inspect定位；不读suspectRegion、不自动给结论/通过。选中描边仅表示用户当前选择；旧区域按钮保留等价。外层SVG改role=group，保留中性M/L原始坐标说明，子区域role=button/稳定ID/名称/aria-pressed，保存或已通过时aria-disabled且退出Tab序列；动作仍由busy/exit/current及外层引擎重验拦截。三语重绘焦点和原始图形可访问信息保留。

专项30/30通过（原28保持），新增图上点击、Space/Enter、原按钮等价、准确cfg坐标、语言焦点、位置不自动通过、保存/退出/过期回调拒绝。独占concept-ui-internal --concept-stage预览84文件成功。纯模拟事件证据，无真实浏览器/原生屏幕阅读器/触屏结论。JS/CSS冻结交D复核，未动B/host/dist/服务。

## 最新表现批：已走路线的逐步路标

reward-path新增观察轨迹，只读公开路径标签与engine state.data.visits：每条路线仅画已亲自走过的路标和该步实际奖励，尚未探索明确未知；不读未来rewards、不显示未走步数，不算累计，不标最优policy。两条路径用相同形状颜色，不以位置长度暗示未来优劣。只有实际新增访问记录时，最新路标短暂移动；拒绝切路不新增路标/动画，读卡/语言/刷新静态保留且不重播，减少动态静态等价。原advance/compare/policy和数字草稿不变。

专项28/28通过（原27保留），新以唯一未来奖励值验证未访问不可见、已走可见、仅新步动效、切路拒绝保留、三语刷新、累计/策略不自动填写。独占concept-ui-internal --concept-stage预览84文件成功。JS/CSS冻结交D复评，无真实浏览器动态视觉结论，未改B/dist/服务。

## 最新表现批：公开训练样本的联动散点图

sample-trainer新增原生SVG，仅画config.samples内已公开x/y训练点；无目标样本单列说明，不捏造y。现有样本选择按钮联动点的描边，实际fit后仅呈现引擎state.data.k。不读取holdout.y、不画正确预测、不将拟合线延伸到待预测输入（图上仅坐标轴与给定训练点），原预测按钮/test/反馈照旧。静态联动不另加无意义动画；三语可访问原始坐标，刷新依真实重演状态恢复。

专项27/27通过，新增改成唯一隐藏目标值后全程不显示、只有公开训练点、选中联动、fit前无参数/fit后真实k、无外推线、三语/刷新与不授通过验证；旧26项全部保持。concept-ui-internal --concept-stage预览84文件成功。未改B/host/集成/dist/服务。JS/CSS冻结待D独立复核，真实浏览器图示观感/原生键盘/触摸仍未验。

## 最新边界修复：独立页面拖放隔离

拖拽session由模块实例nonce＋控制器递增计数组成，优先crypto.randomUUID，缺失时以时间戳＋两段随机值作唯一性fallback。此nonce仅隔离手势，不宣称身份认证或防伪，判分仍由宿主引擎重演。补两个独立VM模块均首次controller的真实DataTransfer事件回归：另一模块拒绝，原模块可接；专项26/26通过，原25项保持。JS再次冻结待D复评。没有改B/host/integration或服务。

## 最新交互批：数值点的可操作分组板

cluster-builder主视觉改为未分组托盘＋两个目标组，每个点在主板只显示一次；可拖入目标组，或单击点后点击目标组。已有组内点可重新分配，按真实engine placement重绘。普通按钮Tab/Enter/Space等价；原直接place点组选择保留在可展开键盘快捷区，不假称旧主视觉未变。仅发原place/check/describe，不改B阈值、答案或判分。选中点ui.local.point只按当前config points白名单恢复，不授通过。

原生拖放仅接本控制器会话签发的专用MIME与合法point/group；外来文本、坏JSON、跨物件payload及过期drop回调拒绝。保存中/退出中/未开始/已通过拒绝拖放与选择。窄屏组区改单列，公开数值只表达原特征，不附收入或监督标签。

专项25/25通过（原22项保留），新增实际DataTransfer事件路径、点击选择/组目标、重新分配、三语刷新、坏数据/外来/跨会话/旧回调拒绝及保存退出边界。concept-ui-internal --concept-stage预览84文件成功。真实浏览器拖放、原生键盘和触屏手势未验；触屏可用点击等价，不冒称原生触摸拖动通过。JS/CSS冻结交D复核，不动B/dist/8782。

## 最新表现批：备货与揭示需求的同刻度货箱对照

inventory-sim新增真实过程：先提交备货，需求未揭示时仅显示已提交量；外层引擎确实revealed后才出现备货/需求两排同数量刻度货箱。每列代表相同数量区间，未配对部分金边标记，让用户观察并核算缺货/多备。为保留原核算任务，UI不直接替用户填写或显示尚未核算的缺货/多备答案；显示的是已公开备货量、已揭实际需求和每格原始数量。大数量最多每排12格，共用刻度且每格标真实数量，末格可不足整格。揭示时需求货箱短暂入列，读卡/语言/刷新不重播；减少动态下货箱与数字静态等价。

专项22/22通过（原20项保留），新验证揭示前无货箱需求、揭后真实状态来源、不自动作答、语言/刷新静态、大数量缩略与真实数字。concept-ui-internal --concept-stage独占构建84文件。未扩sample-trainer过程，避免不必要的holdout泄漏或虚假实际拟合过程。无浏览器视觉结论。JS/CSS再次冻结等D复审。

## 最新表现批：规则运行与参数变化的实际过程轨迹

仅扩现有rule-runner和parameter-lab表现：运行后显示记录中的输入→实际规则版本或参数前后→已观察输出，记录产生时两段短传递动画依次连接；训练操作确实记录参数改变后才呈现前后变化。无运行记录时仅中性等待提示，不预演下一次输出。其它重绘（读卡、语言、返回刷新）保留静态轨迹但不重新播放；动效是会话内瞬时变量，不进ui.local或serialized，不影响资格。减少动态系统设置下动画关闭，所有实际输入/版本/前后值/输出和说明仍完整可读。

验证：专项20/20通过，原18项保存/焦点/语言均保持；新增实际记录来源、仅新运行触发动效、语言/读卡/刷新不重播、参数变化来源和静态等价检查。独占concept-ui-internal --concept-stage预览构建84文件成功。不重跑无关整套，不改B/宿主/集成/判分/dist/8782。没有真实浏览器观感或性能结论。JS/CSS现冻结交D独立复核，下一批由D确认后再选其它真实观察玩法。

## 最新复修：可访问图形与键盘焦点P2

按D独立复核修两项：image-inspector不再在aria-label说出中格缺口；改为中性坐标语法说明、原生path的M/L坐标及各region范围，保留可访问的原始图形观察而不引用suspectRegion/expected。新增动作、证据、核算文本和抽取控件以语义生成稳定ID；judge动作ID不含可变证据数组，点击及切语言重绘均恢复同控件焦点。没有修改B、host、integration、dist或存档。

专项18/18通过，包含坐标可访问文本与动作/证据/抽取/核算控件焦点回归。D安排独立复评前JS/CSS冻结；完整game模块回归已结束：76项中71通过、5失败；3项application-scene与2项game-guide-flow的旧fixture未经过新概念小游戏即期待基础已完成（空场景、应用入口或apply/demonstration阶段），须由D按新门禁更新fixture后重新验收。未修改他人测试或放宽门禁。模拟DOM不代替真实键盘/浏览器视觉。

## 最新：11种实际控件已接，等待D独立复核

原C聊天停止后由D内部实现者接续独占四文件，未改宿主、集成、index、构建、dist、服务、存档或B产物。

稳定范围：原rule-runner、parameter-lab，及staging的evidence-board、sample-trainer、cluster-builder、reward-path、model-flow、inventory-sim、data-cleaner、text-extractor、image-inspector全部有实际可操作UI。所有状态动作经传入外层engine.dispatch/restore；从不直接调用plugin或收藏。规则输入→输出/参数前后可观察；证据先打开再选依据；监督样本拟合再预测；数值点按距离分组；路线逐步揭奖励再手算；模型数据流实际运行；备货后才揭实际需求；资料逐行清理并核算；文本值和来源双重选择；原生SVG轮廓定位并限制因果结论。未预显expected、保留目标、未揭实际、隐藏奖励、期望依据集。

保存边界：退出中fieldset禁用且旧事件回调也拒绝编辑；原生外部close后保存拒绝会重新显示错误/重试。D回调仍是{serialized,ui}，ui含reading/inputRaw/local，local只白名单存证据勾选、路线累计、备货/核算文本、文本字段/证据选择；不决定通过。新kind选择按钮使用aria-pressed显示当前位置，普通button支持原生键盘。无自建存储、自动收藏或正式掌握标记。

验证：node --test apps/game/tests/concept-games-ui.test.cjs **16/16通过**，覆盖11kind真实外层引擎操作到passed、旧2kind错误订正/返回/刷新/三语言/旧回调失效、2保存边界、新文本草稿恢复。node scripts/build-game.cjs --out artifacts/previews/concept-ui-internal --concept-stage 成功，82运行文件。均为模拟DOM/源码证据，不是浏览器视觉/真实键盘/触摸验收。

本批生产JS/CSS现在冻结，D可安排不同模型只读复核及实际index流程。当前只渲染B已审staging schema，不能泛称任意自定义descriptor都适配。待D验收后再按明确范围续视觉批，避免审阅时漂移。不上传GitHub。

---

# C概念小游戏UI：六小时批次交付

窗口2026-10-23 06:46:20—12:46:20 PDT（13:46:20—19:46:20 UTC）。任一适用非空额度剩余≤10%先安全收尾；不得延长截止，不提交推送。D负责收藏门禁、绑定存档、index/构建/服务及本地集成；C仅领concept-games-ui.js/css、专项测试及本报告，不改application-scene或教学控制器。

## 开工状态与接口对齐

13:48 UTC读取任务卡与plan时，`packages/learning-design/candidates/concept-games/`尚未落文件。先准备UI接入/渲染结构，实际引擎和描述器以B随后落文件为准，不在UI临时编学习知识或判定。需要D对齐：描述器提供可公开的教学目标/讲解/操作数据（不可直接序列化答案）；引擎返回下一状态、逐项反馈与完成结果；宿主接收每次草稿、退出及完成回调。UI只提出通过候选，不直接收藏或授正式掌握。

预备宿主形态：`ConceptGamesUI.open(knowledgeContext, {onComplete,onBack,onDraft,...})`。明确上下文/课程/知识版本摘要与游戏绑定由D验证；B实际API到位后本报告给出最终调用示例，当前不是冻结接口。返回应保留草稿；完成须引擎核验，不能仅靠点击“我读过了”取得收藏资格。

Goal工具限制：原八小时目标仍paused且未完成；本轮create_goal实际失败（unfinished goal exists），工具无恢复或改objective能力。未虚假完成旧Goal，也未恢复旧目标/自动化；实际工作按本轮新授权、截止与额度规则执行。开工额度used26%、remaining74%，未触发收尾。

## 第一批真实API接入（实现已落，验证中）

已读取B实际`engine.js`、`build.cjs`及描述器字段，UI现有真实`rule-runner`与`parameter-lab`操作，不仅通用控件：预测/运行/观察/结论；使用模型/按给定样本拟合/参数前后记录/逐条判断。输出只取引擎产生的数据，不自行算规则/拟合结果，不显示op.kind或内部代码答案。

### D可按以下最终宿主形态接第一批

```js
const controller = ConceptGamesUI.open({
  descriptor: c.descriptor,
  context: c.context,       // B要求的六字段，来自D精确绑定
  engine: ConceptGames,
  draft: status.draft,     // 推荐下述{serialized,ui}，也兼容B原state或serialized字符串
  language: state.language
}, {
  render: html => modal(html, true),
  getRoot: () => $('dialogBody'),
  isCurrent: () => !!ConceptGameHost.current(c),
  onDraft: draft => ConceptGameHost.write(c, draft),
  onComplete: draft => { /* D重验draft.serialized，再返回同知识页；绝不自动收藏 */ },
  onBack: draft => { /* D返回同知识页，草稿已先交onDraft；出错初始draft可能为null */ },
  onError: cause => { /* 可选内部诊断，UI只显示通用错误，不输出内部数据 */ }
});
```

**回调draft精确形状**：`{serialized: ConceptGames.serialize(engineState), ui:{reading:boolean,inputRaw:string}}`。UI不创建存储或独立passed标记。D记录层存整个此对象，但读/写/收藏核验必须调用B的`restore(descriptor,context,draft.serialized)`，不可将包装对象直接传restore，也不能信任ui或序列化的passed字段。ui只保留概念面板与未提交数值文本，不决定资格。全部动作经dispatch；从旧原state/string打开也会转上述回调格式。

onDraft可同步/异步返回false或抛错拒绝保存；拒绝时保留当前操作、显示重试，不调用完成回调。onComplete/onBack也可返回false拒绝离开。完成按钮只在引擎重放通过并保存后通知D一次，不直接收藏、封节或授正式掌握。切换知识时D应dispose旧controller；isCurrent负责过期银行/课程/知识上下文，UI在异步回调后复核。UI不计算D的SHA256绑定。

控制器有`getDraft()`、`whenIdle()`、`setLanguage(mode)`、`back()`、`dispose()`；支持handlers.render/getRoot的D建议，也有ctx.body/document/show/close可选测试挂载。浏览器文件放在已有语言函数之后时会包装原changeTownLanguage，随后只重绘当前小游戏并保留草稿/焦点；D若选择重新open，必须传最新getDraft并dispose旧实例，避免回退到旧记录。

未改dist、index、服务、启动器或当前存档。当前代码验证中，未作为通过验收批次交付。
