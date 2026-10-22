# C交互持续优化报告

## D已接入精细反馈：继续冻结

D通知已显式启用itemFeedback并更新本地8782；实际UI训练/推理检查促使D修复源节字段与legacy.skills双侧比较，随后具体中英文反馈、知识回看草稿/help保持通过，导航定向5/5。D执行C13项+绑定1项14/14，另报告游戏38/38、知识50/50、设计39/39；根128项中旧API期望4的文件已改5并定向4/4，20套UI仍在运行。上述均为D集成证据，C本轮未独立重跑，不据此提前签收全回归或真实浏览器。

C指南/反馈候选保持冻结，不扩大候选、不重复长测或操作服务；下方“D稍后启用”已过期，以本条为准。真实浏览器/截图缺口仍保留。

## 显式逐项解释选项交付（2026-10-22 07:40 PDT）

D已明确授权在绑定且已保守保存辅助的诊断中显示精细check.message。C仅修改`apps/game/src/teaching-feedback-ui.js`及`apps/game/tests/teaching-feedback.test.cjs`，保留TeachingFeedback.version=2的兼容接口，新增可选**`options.itemFeedback === true`**：错误项展示B提供的message（缺失时回退原核验提示），正确项始终使用原正确提示。只有布尔true开启；默认/false/字符串不启用。所有文本仍转义，不序列化expected/target/witness，不写草稿、答案或判分。

该选项不改变辅助语义：失败诊断仍属于辅助，D必须先按规范题绑定和持久化后显示；完整round.reason/explanation仍单独主动揭示，itemFeedback不会设置fullReasonRevealed。此前“默认不展示check.message”的约束仍适用于没有显式授权的旧调用，不再误阻止D绑定的新精细解释。

新增意义测试使用B真实inspect-model-work矩阵：错误项分别显示“属于训练”和“属于推理”的依据，默认模式仍不显示它们，正确项保留原提示；zh/en/bi均有对应输出，完整题目reason仍隐藏且保留主动按钮。另覆盖解释XSS转义、缺失回退、literal true门禁。原11项含草稿、回看、定位、异步取消、刷新辅助/解析边界仍通过。

| 命令 | 实际结果 |
| --- | --- |
| `node --test apps/game/tests/teaching-feedback.test.cjs` | **13/13通过、退出0** |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/feedback-r4` | 64运行文件，仅C预览 |
| 同目录`--check`及本轮diff-check | 64文件一致，diff-check通过 |

独立复评：gpt-6-astra只读复核无P1/P2，独立运行13/13通过，确认显式开关、转义、三语言、默认行为及完整解析/辅助语义保持。未改文件、未构建或使用浏览器。D稍后传itemFeedback:true并构建接入；C未改D调用、共享绑定、B数据、dist或本地服务。额度used73/剩27%，未触发收尾。本轮无浏览器截图，实际视觉仍待验。最新摘要/哈希`artifacts/runtime/game-C/feedback-r4/verification.json`。

## 微判断返回P2复验通过（2026-10-22 07:25 PDT）

最新稳定b5-D已含D的reopen修复。C只读定向运行`node artifacts/runtime/game-C/b5-targeted-r2/check-micro.cjs`，**通过、退出0**，没有重跑全课/全模块或原5条整套。结果`artifacts/runtime/game-C/b5-targeted-r2/results.json`；teaching-v5-ui SHA256=`6c7036549428de1b31e64038a827e7296bb3f8ecc1143e20cebc0b8d143ae953`。额度used72/剩28%，不触发收尾；源码候选继续冻结。

实际路径：legacy5首个可选微判断`microKey=b-c1-s1`，保留一项正确操作的失败草稿→反馈切en/bi→回相关知识→返回。原`roundId=micro-b-c1-s1`与完整draft均保留，再提交仍同轮；真实stage始终foundation、demonstrations仍空，不靠跳过阶段修复返回。以上为harness模拟DOM处理器，不宣称浏览器或学习效果。

根因闭环：b5Feedback现在保存显式reopen；微判断传原`renderB5Guided(c,item,microKey)`闭包，语言重绘保留reopen；返回前仍校验当前银行/p引用与小节。原来固定renderTaskWorkshop导致回基础列表的问题在此快照不再复现。D另报告原targeted-r1整套5/5，这是D执行证据，C本轮只独立验证新增micro定向路径。gpt-6-astra只读复核源码与结果确认原P2可关闭、无明显新问题；未再次运行测试或构建。

下方原4/5失败记录保留作修复前证据，不能继续当作最新未修问题。本轮仅新增证据脚本/results和报告，无游戏源码、构建、dist或发布修改；真实浏览器截图仍待验。

## 稳定b5-D定向复验：4通过，微判断返回失败（2026-10-22 07:19 PDT）

**D需处理P2：可选微判断反馈→相关知识→返回，未回到原练习，落到基础列表。** 本轮按D稳定快照仅跑小范围harness，不重跑长测/全模块，不改任何游戏源码。额度used72/剩28%，未触发收尾；候选保持冻结。

命令：`node artifacts/runtime/game-C/b5-targeted-r1/check.cjs`（脚本固定TOWN_TEST_DIST到`artifacts/previews/b5-D`）。实际退出1：5条检查4通过1失败。证据`artifacts/runtime/game-C/b5-targeted-r1/results.json`，快照teaching-v5-ui SHA256=`5aeb840ca30a48157f94ea973e20af03d01208d49f60c6e32a55def3e923808a`。本轮没有改D预览或重建。

| 路径 | 结果 |
| --- | --- |
| AIB5首节独立应用，保留一项正确分类，失败后zh→en | **通过**：反馈HTML变为英文，同一host及题面卡片节点保留，完整draft逐字一致 |
| en→bi | **通过**：反馈出现双语副行，draft与辅助记录保留 |
| 独立应用失败反馈→相关知识→lessonBack | **通过**：返回同一independent阶段、同一round0、同一draft |
| 启动解析异步回调后close→新指南，再调用旧回调 | **通过**：新页HTML不变，fullReasonRevealed没有被旧回调置true |
| legacy5基础阶段开放的首个可选微判断，空提交→相关知识→lessonBack | **失败**：不再存在b5GuidedSubmit，返回基础知识列表；未回到microKey练习 |

复现微判断只需：进入legacy5当前首节，查看首个checkpoint.requiredReviewedKnowledgeIds映射的知识；render后点击首个data-b5-micro→检查空尝试→data-tf-review→lessonBack。测试并未伪造基础/示范完成，不跑整节。

源码根因指针：稳定快照`teaching-v5-ui.js`的b5Feedback.onReview固定使用`teachingReturnTo(renderTaskWorkshop)`；可选微判断虽由`renderB5Guided(c,item,microKey)`打开，未把microKey/重开动作传给反馈。返回时真实全节stage仍foundation，renderTaskWorkshop就打开基础列表。

建议D：反馈保存明确的原练习重开回调；微判断传`renderB5Guided(c,item,microKey)`，普通引导/独立仍用当前统一入口，并在语言重绘时保留此返回上下文及银行/小节绑定。沿用原micro草稿与正确操作，不通过改变stage绕过门禁。C不改teaching-v5-ui。

此轮证据为真实harness处理器的模拟DOM，能证明反馈专属HTML与节点/草稿状态，不能证明真实TreeWalker、浏览器焦点、触屏或视觉。此前语言重绘缺失已复验解决，不再列为现存问题；剩余失败独立标注，不以4条通过覆盖。

跨模型复核：gpt-6-astra只读核对稳定快照、复现脚本与结果，确认P2返回上下文丢失及上述根因；建议回归同时验证原microKey与原草稿，不改stage绕过。未重跑测试、未构建或修改文件。C本轮仅新增证据脚本/results和更新独占报告，未修改冻结候选。

## D后续接线修复通知：候选继续冻结

D已确认接收B5指南并通知修复下列接线问题：teaching-v5-ui加载在town-i18n之后；语言切换只重绘当前反馈host；排序remove与预算约束定位补齐；modal/close统一dispose并清理反馈；异步回调校验银行/p引用/小节作用域。上述为D通知，C尚未对稳定新快照复验；旧preview不含最新代码，不能据旧结果继续报告已修缺陷。

D另报告285轮纯逻辑与首节12轮实际UI通过，C不冒充独立执行。当前guide/feedback候选保持冻结，不改D文件、不重复长测。等待D提供稳定b5-D快照，再仅复验语言切换保留草稿/辅助、排序及预算定位、退出和换银行旧回调取消；真实浏览器缺口仍保留。下方“D反馈接线只读发现”是修复前证据，以上述最新状态为准。

## B5续派：指南阶段适配（2026-10-22 07:11 PDT，本段优先于下方历史blocked）

D已提供实际依赖并直接续派：`teachingStageStatus()`返回B5当前阶段，`openTaskWorkshop()`统一门禁，`openStudyBasket()`为基础列表。C已在原领用game-guide.js及专项测试适配，无改D文件；不重复D的teaching-v5长测。续派前的Goal blocked是历史，当前授权工作已恢复执行；工具API本身没有resume操作，未擅自重建目标或将旧目标标完成。新一轮额度used70/剩30%，未触发收尾。

### 本轮交付

- `guideStage()`只接受revision5且sectionId匹配当前节的实际API，不自己推断示范/引导状态。
- 陪练/欢迎CTA/章简介按实际stage显示“看示范”“做引导练习”“独立应用”，均调用统一openTaskWorkshop；基础仍沿用自由探索/确认。已交付、待交付、已封存及应用完成待收成果的优先级不变。
- B5参考说明与章简介路线补示范→引导→独立应用，说明示范/引导不计独立证据、辅助重试是订正、正式90%不变；B4与旧兼容路径仍保留。
- 原7项指南回归显式选择B4，不让D的新默认B5改变原断言含义；新增一项实际AIB5首节4份基础→示范→引导→独立的短流程，核对帮助/语言/章简介不推进学习、已封存优先。

| 命令 | 实际结果 |
| --- | --- |
| `node --check apps/game/src/game-guide.js` | 通过 |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/guide-b5-r1` | 64运行文件；只构建C预览 |
| `TOWN_TEST_DIST=artifacts/previews/game-C/guide-b5-r1 node --test apps/game/tests/game-guide-flow.test.cjs` | **8/8通过**；B4原7项与B5新项，模拟DOM |
| 同目录build `--check`、本轮diff-check | 64文件与执行时源码一致，diff-check通过 |

独立复评：gpt-6-astra只读复核无P1/P2，独立运行新增B5定向1/1通过。确认阶段由D API读取、动作交统一门禁、完成状态优先和旧路径保留，无新增递归/自动推进。未构建、未改文件或操作浏览器。无本轮浏览器截图，真实翻译/窄屏/焦点仍未验。保存验证仍沿用专项部分发现刷新及历史entry证据，不把新的B5单节路由测试说成全课恢复验收。

### D反馈接线只读发现（不修改D代码）

1. **切语言后反馈区未重绘**：实际AIB5首节确认4基础→示范→引导正确→独立空提交，反馈使用data-locale-fixed；changeTownLanguage('en')后state.language=en，但反馈HTML完全不变。harness无TreeWalker，单独此结果不证明真实翻译；同时源码applyTownLanguage明确跳过data-locale-fixed，且teaching-v5-ui没有语言切换重绘桥，故接线需补专属反馈区重绘/重绑，不能重建题面或丢正确草稿/辅助记录。
2. **部分定位映射缺失**：D当前findControl只查data-workshop-item/select/field。排序已排步骤使用data-workshop-remove，因此对应错误不能定位；预算allowed/budget/value/required是约束ID，也不对应上述卡片ID。建议映射排序remove按钮，预算约束到相应组合/预算说明或可聚焦控件（可返回数组），缺失时不要声称已完成操作点定位。
3. 已核对正确使用：失败先b5Mark辅助后render/bind；b5Mark对辅助/解析单调OR；onReveal只许可，onExplanationShown才保存实际完整解析；未见本轮v2两标记误用。导航/语言换轮仍需及时dispose；当前仅在renderTaskWorkshop及下次b5Feedback清理，建议D明确其它退出路径生命周期。

本轮不扩大领用，不联系其它对话；D按本报告接线并补测试即可。

## 最新候选与D接线要点（2026-10-22 06:55 America/Los_Angeles）

**第八轮：Goal工具已返回blocked（依赖阻塞），不是complete或额度暂停。** 同一依赖连续三轮核验：第六轮确认D接线活跃但live仍B4；第七轮D明确要求候选冻结、接入后再直接续派；第八轮根协调卡新增“当前实际游戏仍B4、候选未接live”，源码仍只接受revision4，未引用TeachingFeedback。当前允许的指南/反馈候选已交付并评审，没有可在不漂移/不越界前提下继续的独立源码工作；真实浏览器缺口也未恢复。不轮询D、不重跑稳定测试或开新代理。D完成接线/提供实际阶段入口或可用浏览器后可直接续派，本次阻塞审计届时重新开始。最新额度used70/剩30%，未触发10%门槛；八小时窗口和D总任务仍有效。未推送/合并/发布。

第七轮交接冻结：D已直接确认收到guide-r2与feedback-r3/version2，要求候选停止漂移；其B5 candidate catalog+TeachingStages门控3测试已完成、尚未切live（此为D执行证据）。D接入后会直接续派C验证，无需用户转述。C不再轮询D、不新开评审或重跑测试，不改D文件。交付哈希核对guide2文件、feedback3文件均与各自verification一致；此轮仅元数据核对和报告，不修改源码。Goal未完成；独立改进已收束后，B5接入/可控浏览器同一实际依赖已连续两轮核验，记录等待审计2/3，当前不提前标blocked或complete。额度最后used69/剩31%，不是额度收尾。

第六轮核验：上一轮为有效进展；额度used68/剩32%，未触发收尾。C领用文件当前候选已验证，剩余B5阶段接线与实际浏览器不是已完成项。已通过wait_threads核验D当前turn仍inProgress，D正接B5；30秒及后续60秒有界等待仍显示活跃，cursor revision由2增至5、有新已完成工具项，未把观察超时当终止、未重启任务。检查时源码仍revision4，index/teaching-flow尚未引用TeachingFeedback，C不越界代接、不重复跑稳定测试。此轮为已核验依赖等待，不标完成或暂停。

### 给D的最小指南阶段信息建议（待D决定，非已实现接口）

指南只需一个只读的“当前下一步”查询：阶段标识、标题/简述/按钮中英对，以及调用现有受门禁保护入口的动作。可复用D现有函数，不强制新增命名或共享schema。B5至少区分基础、示范、引导、独立应用、辅助订正、成果待收、章节待交付、练习/测验；可选微判断不能变成强制重复提醒或额外独立应用。

查询必须绑定当前银行/课程版本/小节；点击动作再次核对当前状态，不沿用旧弹窗中的过期round。C收到实际查询/入口后仅改game-guide的文案与路由；具体先修/评分/辅助保存仍由D控制器负责。这样能替换当前B4 guideNextStep中“ready即进应用”的分支，而不把B5示范/引导跳掉。

### 当前目标核验矩阵

| 要求 | 已有权威证据 | 尚缺/接手 |
| --- | --- | --- |
| 可见/查看/操作分层，自由探索但有序推进 | C原探索测试与当前B4全链模拟，C-game.report.md | D统一B5阶段后重验门禁；实际鼠标/触屏 |
| 1.1分散物件、定义/例子/来源与不同操作 | 当前源码/固定样例/跨章来源回归 | 原入口实际比例、点击与视觉 |
| 三语言指南、已有档继续 | guide-r2 7项+entry2项，独立复评 | B5阶段文案；真实TreeWalker/窄屏 |
| 逐项反馈保留草稿，不把订正算独立证据 | feedback-r3 version2 11项及独立复评，B5实际gradeStage边界 | D接线、先保存辅助、刷新/语言/导航整体验证 |
| 六章/90%/独立重玩/经典入口/旧档 | 原模块及B4/历史fixture模拟；未改判分存档 | D最终统一快照、原dist入口与真实浏览器 |
| 报告、截图与发布 | 独占报告/证据哈希已落；未提交发布 | 本轮无真实截图，浏览器待验；D最终集成 |

整体目标保持未完成。当前安全下一步是接收D正在进行的B5阶段接口，然后在C领用指南内适配；浏览器未恢复时不以几何/模拟PASS冒充可玩性。未请求扩大领用范围。

最新指南：guide-r2，7项+entry2项通过及跨模型复评通过。**最新反馈：feedback-r3，TeachingFeedback.version=2，11/11与60文件build/check通过；初评1项P2已修，gpt-6-astra定向复评与第11项独立1/1通过，无新阻断项，可交D接线。请勿按下方历史version1契约接线。** 仍未接入index/teaching-flow、未发布；真实浏览器未验，全模块历史间歇失败仍保留。额度used66/剩34%，未触发提前收尾，Goal持续。

### version2 必须区分的两个标记

- `solutionRevealed`：保守的**判分辅助标记**，逐项错误诊断、已有辅助记录或完整解析任一提供过即true，可直接传B现有gradeStage的options，正确重试只能applicationCompleted、不能applicationCredit。
- `fullReasonRevealed`：**完整解析实际可见**标记，只在主动查看解析或可靠恢复该展示状态时true。render仅据此自动展示完整解析。单独传`solutionRevealed:true`不会自动展示解析；失败诊断的fullReasonRevealed仍false。
- `evidence(diagnostics,options)`现在返回`{assistanceRevealed,solutionRevealed,fullReasonRevealed,independentCreditClaimed:false}`。**解析请求阶段**onAssistance/onReveal均收到fullReasonRevealed=false；不要提前保存为已展示。许可且绑定仍有效后，组件实际展示解析，再调用新增`onExplanationShown(meta)`，此时fullReasonRevealed才为true，D可据此保存展示状态。拒绝/失败/导航取消不会通知shown；回看知识不额外揭示本题解析。
- **D保存规则不变**：显示具体诊断前先保存保守辅助；整个活动/轮次的辅助一旦发生不能因成功重试、换语言或刷新而清零。若旧存档没有可靠记录，不默认赋独立信用。fullReason展示状态可按D现有适配能力处理，不要求新增共享schema。
- API其余render/bind/dispose/findControl语义不变，语言重绘反馈区、导航前dispose、先落辅助再显示仍必需。旧版用solutionRevealed控制完整解析的调用须改为fullReasonRevealed。D最终决定接线与保存映射，C没有写共享判分或存档。

第五轮实际证据：在v1元数据`assistanceRevealed:true,solutionRevealed:false`直接交B.gradeStage时，正确重试得到applicationCredit=true；现已用实际B5函数回归为completed=true、credit=false，同时完整解析仍隐藏，按钮需显式打开。第10项覆盖此边界；未辅助的正确答案仍由B原判定正常给信用。最新证据`artifacts/runtime/game-C/feedback-r3/{verification.json,language-audit.json}`，英文输出323轮核对无中文/缺失绑定；纯输出检查，不是浏览器实测。

第五轮初评发现P2：原拟定回调在解析许可前就发送fullReasonRevealed=true，宿主若持久化后再拒绝/导航，刷新会提前打开未见解析。已按上述请求/实际展示分离修复，并新增第11项：模拟宿主记录元数据，拒绝/取消后重绘解析仍隐藏，成功显示后才可恢复为可见。11/11通过，审稿模型独立定向1/1并确认P2已修、无新增阻断。onExplanationShown仅是显示通知；若其保存失败，辅助判分仍已预先保存，D不能恢复独立信用，展示偏好失败不应变成评分成功。D应按原题/版本绑定单调合并既有辅助和实际揭示记录，不能用后续false覆写历史true；本轮helper未改游戏存档。

## 以下为各轮增量与历史证据

第五轮开始（06:48）：上一轮为有效进展；额度used66/剩34%，未触发。只读核对B5实际gradeStage发现其仅读solutionRevealed，不读assistanceRevealed；当前Feedback.evidence直接传给B时逐项辅助后的正确重试会得到applicationCredit=true。此前报告要求D自行合并标记，但易误接；拟将候选升级version2：判分辅助标记solutionRevealed保守覆盖逐项诊断，另以fullReasonRevealed单独控制完整解析可见，不能因辅助判分标记自动展示解析。仅本地UI候选契约，不改B判分或存档；完成后给D明确升级差异与直接兼容测试。

第四轮（06:44开始）：上一轮为有效进展；最新额度used64/剩36%，无触发。复核已有进度下的指南，发现guidePoint在basicsReady时重开完整指南，导致“带我走当前第一步→完整指南→再次学习引导”的循环；章简介也不展示当前已交付/待交付状态。新增阶段路由回归初红后绿，修复只在领用game-guide复用guideNextStep作为统一动作派生，章简介显示实际下一步，不改D的启动层或学习完成状态。guide-r2专项7/7、entry2/2及60文件check通过；独立gpt-6-astra定向复评与新增1/1通过，无P1/P2，候选可交D。反馈最新仍为feedback-r2（9/9及复评通过）；全模块历史间歇失败仍交D处理，不宣称全绿。

第三轮（06:41开始）：上一轮为有效进展，最新额度used62/剩38%，未触发收尾。核对D报告尚在准备B5接线；仅在已领用Feedback模块修复可访问性缺口：错误列表缺少回到对应控件的定位动作，控件aria-invalid尚未与具体错误说明关联。现已复用findControl提供可选定位按钮及aria-describedby，双方专项9/9和60文件构建/check通过；gpt-6-astra独立只读评审无P1/P2，可供D采用最新feedback-r2。未改题面/草稿/判分或D入口，视觉仍待验。

状态：第一轮引导候选已完成跨模型评审；专项6项通过，最终模块复跑22/23，有1项间歇动画入口断言失败（单独复跑1/1通过），需D核查；**不宣称整套全绿**。第二轮TeachingFeedback.version=1候选已通过独立模型评审和双方8/8测试，**可交D接线，尚未上线**。Goal持续，截止14:16:12。最近额度检查usedPercent=60、剩余40%，未触发收尾；协调卡无已触发标记。真实浏览器不可用，不重复尝试；视觉、窄屏、触屏和性能仍待验。

### 文件领用/范围

D已明确领用`apps/game/src/game-guide.js`、`game-guide.css`及专项新测试。当前拟新增`apps/game/tests/game-guide-flow.test.cjs`。只在C独立预览/证据目录构建，不写dist，不改教学/init共享文件、根测试或harness。无分支切换/提交/推送。

### 审计发现与计划

1. 当前参考指南/章简介/陪练仍说“收齐基础才激活”，与B4可选收藏、基础确认→应用通过不同；需要分开已审B4和兼容课程的描述。
2. 当前`guidePoint`用`s.read`找物件，B4收藏移出场景但未确认时仍会指向已消失位置；下一步必须读取真实found/favorites/foundations/应用门禁。
3. 当前陪练优先检查首节sealed，即使整章已交付仍提示“全章收齐后交付”，且推进第二节仍停在首节祝贺；改为当前节真实状态优先。
4. 章简介/陪练动态文本没有完整双语对。所有新用户文案在本模块登记中英对，沿用现有翻译机制，不改town-i18n。
5. 欢迎→章简介→陪练由不同init/entry覆盖层触发；D独占的`teaching-flow-ui`首次无旧档路径额外调用欢迎。C只报告冲突，初始化单一入口由D处理。

执行计划：先改实际引导与只读下一步派生；新增针对真实处理器、三语言文案对、阶段路由及保存不变性的模拟测试；独立跨模型评审；写命令结果及D待办。不会恢复guide-spotlight，不增加遮挡层，不改知识/答案/判分/schema。

### 第一轮产出与验收

- `apps/game/src/game-guide.js`：参考指南按B4/兼容路径说明；首次欢迎先给“找一件物品”的动作；明确发现≠收藏≠归档≠应用通过，收藏可选。章简介和陪练完整登记中英对，沿用现有zh/en/bi翻译，不重建语言系统。
- 陪练按当前节真实found/favorites/foundations及flow.ready/complete路由。收藏移走后打开知识列表，不再指向空位置；基础齐则进入应用，无需收藏；整章已交付优先显示练习/复习，不停在首节祝贺。只读进度派生，不写学习完成/判分/存档新字段。
- `game-guide.css`：复用原aside，缩小并限制滚动高度；参考弹窗打开或底栏折叠时隐藏陪练，避免同时遮挡；按钮焦点、长文本换行和窄屏规则。几何效果尚未浏览器验。
- `apps/game/tests/game-guide-flow.test.cjs`新增6项：真实处理器的阶段路由、收藏后位置、可选收藏进入应用、文案双语对、指南不推进学习、部分发现存档恢复与兼容/冒险路径，以及重访已封存小节的继续导航。不能证明真实TreeWalker翻译或视觉。

| 命令 | 实际结果 |
| --- | --- |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/guide-r1` | 58运行文件，专属预览成功 |
| `TOWN_TEST_DIST=artifacts/previews/game-C/guide-r1 node --test apps/game/tests/game-guide-flow.test.cjs` | 5/5通过（Windows实际用PowerShell设置绝对路径环境变量） |
| 同命令在导航修复后重跑 | **6/6通过**，退出0 |
| `node scripts/test-module.cjs game` | 初轮22/22通过；增加第6项导航测试后复跑**22/23、退出1**：引导6项全过，动画入口末尾章节索引actual3/expected0，位置ambient-scene.test.cjs:86。其余通过，构建仅到C预览 |
| `TOWN_TEST_DIST=artifacts/previews/game-C/guide-r1 node --test --test-name-pattern='real entry order' apps/game/tests/ambient-scene.test.cjs` | 上述失败项独立复跑**1/1通过**；不消除整套出现过失败的事实，未修改该测试/动画/初始化 |
| `TOWN_TEST_DIST=artifacts/previews/game-C/guide-r1 node --test tests/entry-startup.test.cjs` | 2/2通过；实际HTML加载顺序、非空历史档恢复，模拟DOM |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/guide-r1 --check` | 58文件与执行时源码一致 |
| `git diff --check -- <本轮四文件>` | 通过；仅提示LF将转CRLF，不是错误 |

独立评审：gpt-6-astra只读评审并在guide-r1独立运行初5项，5/5通过，未发现P1/P2。提出重访已封存小节应提示继续而非再收成果，已修复并新增第6项；审稿再次只读复核该分支通过，无新增P1/P2。未替D修改首次启动/init。

间歇失败第一条错误证据：`artifacts/runtime/game-C/guide-r1/module-rerun-failure.txt`，包含命令/退出码/首个断言及独立重跑边界。此项未改源码或测试，交D统一快照复现。D另告知其integration-npc预览指南6+entry2共8/8通过，为D执行证据。

### 第二轮计划与新增领用

D明确新增领用`apps/game/src/teaching-feedback-ui.js`、`teaching-feedback-ui.css`与`apps/game/tests/teaching-feedback.test.cjs`。输出全局`TeachingFeedback`纯UI helper，D负责脚本/CSS引用和提交处理器接线。输入沿用B的`diagnoseRound`结果，不改index、teaching-flow、判分或存档。

已核对B5交接及实际diagnoseRound：checks含id/label/correct/message，可选reason/reviewLinks；draft是原副本，preserveCorrectOperations=true，失败时assistanceRevealed=true。B带feedback参数时message可能是expectedExplanation，故默认不直接展示其答案解释；仅展示项目状态与一般核验方向，解释单独由明确按钮揭示并通知D记录辅助状态。不会输出raw expected、内部ID或自动填草稿。回看知识仅传unitId给D回调，不当作揭示本题答案。

### 第二轮可接线契约：TeachingFeedback.version=1

仅新增三个领用文件，不改B5、index或提交处理器：

- `apps/game/src/teaching-feedback-ui.js`：浏览器全局TeachingFeedback（亦可CommonJS测试），没有顶层DOM或游戏状态依赖。
- `apps/game/src/teaching-feedback-ui.css`：反馈区域排版与控件标记，无overlay；窄屏换行、焦点、双语副行。
- `apps/game/tests/teaching-feedback.test.cjs`：8项纯UI/事件测试，直接消费B5真实round、diagnoseRound与prepareFeedback生成的绑定数据；不写B产物。

接口：

1. `render(diagnostics, options) -> HTML string`。diagnostics直接使用B返回形状，不消费draft中的答案，也不写draft。options为`language: 'zh'|'en'|'bi'`、`stage: 'guided'|'demonstration'|'independent'`、已审`explanation`中英文本（建议本轮incorrectFeedback.explanation/round.reason）、可选`reviewLinks`作为逐项链接缺省、以及从可靠宿主状态恢复的`assistanceRevealed/solutionRevealed`。
2. `evidence(diagnostics, options) -> {assistanceRevealed,solutionRevealed,independentCreditClaimed:false}`。仅是展示含义，不是gradeStage，不授予独立信用。失败诊断本身即辅助；fullReasonRevealed或已恢复解析标记同样保守处理。
3. `bind(feedbackHost, diagnostics, options) -> dispose()`。Host必须是独占反馈容器，不能用题目/输入控件父容器做替换目标。仅绑定自有按钮，可通过`findControl(checkId,index)`返回题面控件或数组，旁标对错但不改value/checked/选择/草稿。多个约束指向同一控件时错误优先。dispose恢复旧aria-invalid/标记，解除自有事件，取消异步解析结果更新；换轮/重绘前必须调用。
4. 宿主回调：`onReview(unitId,link)`由D按课程unitId→lesson映射只读回看；不增加solution揭示。`onAssistance(meta)`供D幂等记录辅助；`onReveal(meta)`须先可靠保存，可返回Promise或false拒绝显示；失败给重试提示，不填答案。`onError(error)`交宿主处理。解析点击会先通知辅助，再等onReveal同意，之后才展示已审自然语言解释；组件默认不渲染B的message/expectedExplanation，避免提交后自动泄露答案。

**D接线顺序**：先核B5/反馈摘要和round绑定→调用diagnoseRound→用evidence保守保存辅助状态（可靠保存必须在将逐项反馈显示给玩家前完成）→dispose旧绑定→只替换feedbackHost.innerHTML为render结果→bind控件/回看/解析回调。render是纯函数，无法自行保证D的持久化；不要把bind之后的异步通知当成已经成功落盘。刷新若无法可靠恢复辅助记录，沿B要求显示订正完成/待测验，不还原独立信用。

语言切换：本组件用data-locale-fixed保护自有zh/en/bi输出，避免现有翻译器二次套娃；D须在切换语言时只重绘专属反馈容器并重绑，不能重建题面或输入。解释揭示状态由D传入恢复。单独知识回看不视为本题答案揭示。

第三轮接口增量（兼容version1）：render与bind使用同一个`findControl`选项时，错误项目带“回到这一项修改”按钮；点击仅以auto滚动并focus现有控件，不改值、不提交。没有映射的按钮禁用。bind为错误说明生成每次绑定唯一ID，将其追加到对应控件原aria-describedby，多个约束描述可合并；dispose恢复旧属性并移除自己生成的ID。需要真实读屏/浏览器确认朗读和焦点效果，9项模拟测试只证明属性与事件路由。

| 命令 | 实际结果 |
| --- | --- |
| `node --test apps/game/tests/teaching-feedback.test.cjs` | **8/8通过**；全局/CommonJS、B5当前7种控件的实际诊断、保留部分正确草稿、控件聚合标记、异步取消/拒绝解析、辅助语义、XSS与异常重试 |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/feedback-r1` | 60运行文件成功；复制候选但未引用脚本，不表示页面已上线 |
| 同目录`--check` | 60文件与执行时源码一致 |
| 本轮领用文件`git diff --check` | 通过（game-guide.js仅CRLF提示） |

第二轮独立评审：gpt-6-astra只读复核并独立运行8项测试，8/8通过，无必须处理P1/P2。确认默认答案解释隐藏、纯UI不改草稿、标记聚合及清理、异步揭示取消和XSS转义；没有浏览器或布局验收。复评提出的宿主契约均已在本报告明确：先保存辅助、导航前dispose、语言重绘反馈区、版本/hash及信用由D负责。

补充回调语义：`onAssistance`用于保存；保存失败须抛错或拒绝Promise。其返回false只是返回值，不等于拒绝揭示；需要阻止显示时`onReveal`返回false（或者保存失败抛错）。D不能忽略保存失败而允许独立信用。证据摘要与源码SHA256在`artifacts/runtime/game-C/feedback-r1/verification.json`。

第三轮验收：`node --test apps/game/tests/teaching-feedback.test.cjs` **9/9通过、退出0**；`node scripts/build-game.cjs --out artifacts/previews/game-C/feedback-r2`及同目录`--check`均通过，60文件；本轮文件diff-check通过。仅纯UI改动，未重复跑仍由D/动画核查的全模块间歇场景失败。最新哈希与证据摘要在`artifacts/runtime/game-C/feedback-r2/verification.json`，R1为历史候选。

第三轮附加数据核对：`node artifacts/runtime/game-C/feedback-r2/language-audit.cjs`退出0，核对B5 AIB引导/独立及legacy独立共323轮的实际diagnoseRound输出，英文模式含主动揭示解析输出未发现中文残留或缺失绑定。摘要`language-audit.json`带baseManifestHash/feedbackHash，可复现；仅静态文案输出，不证明浏览器翻译/排版或实际学习效果。评审另确认定位/描述/清理无P1/P2，真实读屏尚未验。

缺口：D接入后才可证明逐项反馈位于实际题目附近、输入节点保留、语言切换不中断作答，以及辅助状态跨刷新不丢。真实浏览器截图/窄屏/原生控件焦点仍未验，未伪造学习者校准或实际学习效果。

本轮截图：无新增；浏览器操作未执行，不能签收首次视觉/zh-en-bi真实排版/360与390窄屏/焦点遮挡/触屏。证据使用实际命令结果及专项测试源码。分支main，HEAD f0be257f880f56765641fd65f33675f4a1bfdf46，未创建提交或发布。

### D接手事项

- 首次启动统一欢迎/章简介展示时机，防重复覆盖；C不写init/teaching-flow文件。
- 核查整套并发测试中的间歇章节索引漂移：动画测试往返四章/海边/冬季后再changeZone(origin)，有一次chapter3未回0；独立同项通过。静态核对changeZone→enterStudyChapter链属于共享入口，未确定根因，不应把偶发失败掩盖为已修或改动画测试迎合。
- B5冻结后再按新阶段验证指南；本轮仅对当前B4/旧兼容路径，不预写新教学知识。
- B5现已冻结，但不能把B4指南的“基础就绪→应用工坊”直接当作B5示范→引导→独立应用的接线。D需先确认阶段查询/下一步动作接口，再由C在领用指南内适配；新反馈helper不跳过这些门禁。
- 最终统一快照补真实三语言/窄屏/焦点/拖放及首次进入体验；不把本轮模拟测试当视觉签收。

### 其他已完成证据

上轮长回归现已结束：`node tests/teaching-v4-ui.cjs`通过，AIB145轮、原内置50轮；可选收藏、基础/应用先修、四章独立、错解拒绝、恢复与历史版本隔离，均为模拟DOM。其后5套针对UI与根11/11也退出0。原场景修复和跨模型复核见`C-game.report.md`，不重抄历史实现。

### 第四轮：保存进度下重开引导

修改仅`apps/game/src/game-guide.js`、`apps/game/tests/game-guide-flow.test.cjs`。

复现：章节已交付的路由fixture下，showStudyBrief→briefWalk，旧版本实际返回`reopenedGuide:true, openedKnowledgeChest:false, stage:practice`；新回归最先失败在章简介未包含“本章已交付”。此fixture仅测导航，不声称伪造完成可通过存档验证。真实非空历史档另由entry测试验证恢复。

修复：guidePoint先派发guideNextStep的真实下一步，仅find/legacy-find才定位物件；帮助按钮与章简介CTA直接使用同一action，章简介显示title/body，已交付/待交付/已确认等状态不再都说先找第一件。原首次欢迎/init包装未改；不主动答题、提交或写学习完成。已有7项仍验证自由浏览/收藏可选/归档/旧课/部分发现刷新及文案中英对。

| 命令 | 实际结果 |
| --- | --- |
| 旧feedback-r2预览定向新增回归 | 0/1，退出1，证明问题可复现；旧行为另有实际处理器输出见下方证据 |
| `node scripts/build-game.cjs --out artifacts/previews/game-C/guide-r2` | 60文件成功 |
| `TOWN_TEST_DIST=artifacts/previews/game-C/guide-r2 node --test apps/game/tests/game-guide-flow.test.cjs` | **7/7通过**，退出0 |
| 同预览`node --test tests/entry-startup.test.cjs` | **2/2通过**，退出0，实际HTML加载顺序及非空9f7f67b恢复（模拟DOM） |
| 同目录build `--check`及本轮diff-check | 60文件一致，diff-check通过 |

证据摘要和源码哈希：`artifacts/runtime/game-C/guide-r2/verification.json`。真实浏览器首次/已有档操作、三语言翻译与视觉仍待验。待D给B5阶段接口后再适配B5示范/引导/独立应用，不把本轮B4路由当作B5已接入。

第四轮跨模型复评：gpt-6-astra确认统一派发不会直接递归，continue先切至未完成节后能终止；章简介/CTA同源，未改完成状态或旧课门禁。新增第7项独立定向1/1通过，无新增P1/P2；未改文件、未构建或使用浏览器。
