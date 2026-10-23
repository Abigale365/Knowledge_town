# 概念物件内小游戏：批次接口 v1

状态：第一批实现中；C/D可据此接渲染适配，完成评审的具体摘要以review.json为准。只供本地，不改冻结知识/教学包。公共接口暂定后保持v1兼容，新增kind滚动交付。

## 数据与纯引擎

`catalog.json`：`{schemaVersion:1,revision:1,knowledge:{id,revision,hash},games:[descriptor...]}`。

descriptor字段：`id, revision, kind, title, goal, teaching, instructions, sourceUnits, knowledge, bindings, config, boundary, collectionPolicy`，可见文案均 `{zh,en}`。`sourceUnits`包含冻结知识的unitId、内容摘要、原解释及evidence。bindings逐项记录现有 `courseId,courseHash,lessonId,sourceUnitId,lessonHash`，不用裸1.1匹配。

`engine.js`：UMD（浏览器ConceptGames，Node require），无DOM、无存储、无网络。调用：

```js
const descriptor = ConceptGames.resolve(catalog, context); // null表示无已绑定游戏
let state = ConceptGames.fresh(descriptor, context);
state = ConceptGames.dispatch(descriptor, context, state, {type:'acknowledge'});
// UI按kind提供下述动作；dispatch返回新状态，不改输入
const text = ConceptGames.serialize(state);
state = ConceptGames.restore(descriptor, context, text); // 重新演算日志，错误/换版本抛错
const gate = ConceptGames.collection(descriptor, context, state, {found:true,alreadyCollected:false});
```

context须包含 `courseId,courseHash,lessonId,sourceUnitId,lessonHash,knowledgeHash`；所有字段均与descriptor绑定一致。不匹配拒绝，不能按标题猜。D计算课程/lesson规范化JSON的SHA256后传入；不要将运行时临时UI属性加入绑定对象。descriptor来源目录只读课程，D改变课程后须显式重绑定和复核，不静默绕过。

**摘要字节约定已固定**：`courseHash = SHA256(UTF8(JSON.stringify(course)))`，其中course为 `scripts/teaching-catalog.cjs#catalog().{aib,legacy}.course` 或 `scripts/teaching-catalog-v5.cjs#catalog().{aib,legacy}.course` 返回的完整对象；不是排序canonical。`lessonHash`对该course内完整lesson对象使用同一JSON.stringify/SHA256，不另做投影、不重新排列键。`knowledgeHash`为冻结增强KnowledgePack完整原对象同法摘要。`sourceUnits[].unitHash`绑定完整知识单元原对象，包括正文/证据。Node可复用 `bindings.cjs.hash/forLesson/catalogSources`；已生成catalog的courseSources列每个实际源和摘要。

浏览器可使用D预生成的已核课程/lesson绑定索引，不需要WebCrypto；但不得只凭裸lessonId信任摘要。引擎的fingerprint/signature是**另一个**排序canonical的FNV兼容标签，供descriptor/进度重放比较，不能当成SHA256或替代D的课程内容核验。

状态含schemaVersion、gameId、gameSignature、contextSignature、events、phase、feedback、passed及玩法数据。fresh→teaching（先看知识与目标）；acknowledge→playing；达到知识相关操作证据后→passed。所有错误保留已完成操作；feedback为逐项 `{itemId,correct,message,knowledgeIds}`。返回可保存原状态；恢复必须经restore，不能直接相信passed字段。运行签名仅用于完整性及兼容检查，不是防作弊认证。

`validate(descriptor,context,state)`返回boolean；`restore`出错会抛错，D应提示此份小游戏进度不兼容并仅处理它，不清空旧收藏或整份存档。事件日志最多200条；本批典型完成约10个动作，UI不要在输入框每个字符变化时提交setInput，应在用户确认数字/滑条提交后记录。无resolve结果表示该概念尚无已绑定小游戏，不等于通过；首批只覆盖4种来源单元，不用统一模板冒充其余135个单元已交付。

收藏接口返回 `{canNewCollect,preserveExisting,reason,formalMastery:false}`。新收藏须真实found且本游戏通过；已有收藏保留，不追溯取消。完成游戏不会自动收藏、通过本节应用或整章90%正式测验；订正可获得收藏资格，不宣称独立掌握。

## 第一批kind与动作

### rule-runner（算法/确定性）

本题明确固定规则及版本，输入整数，重复运行观察输出。动作：

- `{type:'setInput',value:number}`：设置输入；范围见config。
- `{type:'predict',decision:string}`：对下一次运行选可见动作，选项为config.outputs；不是输入代码。
- `{type:'run'}`：按规则执行，保留输入、版本、预测及输出日志。
- `{type:'conclude',decision:'stable'|'always-same'|'learns-by-running'}`：解释观察，三个值仅控件ID，显示descriptor.config.conclusions文案。

通过条件：同一输入同版本至少运行两次且输出一致；对阈值下沿和阈值本身两种输入都先判断再运行并判断正确；根据日志选择同输入/规则可复现的结论。仅看解释/连点重跑/猜结论不通过。题面阈值是演练规则，不是通用业务政策。

### parameter-lab（训练/推理）

本题是显式简化单参数模型，操作按钮展示用途。动作：

- `{type:'setInput',value:number}`、`{type:'infer'}`：处理输入并显示输出，参数不变。
- `{type:'train'}`：利用给定核验样本拟合本题参数，展示参数变化；不是声称所有模型一次就能学会。
- `{type:'resetModel'}`：回到初始模型，不清既有证据记录。
- `{type:'classify',eventId:string,decision:'training'|'inference'}`：根据某次实际操作记录判断它做了什么，显示双语术语，不输入内部ID。

通过条件：有训练前推理证据、一次实际参数改变、训练后不同输入的推理证据；至少一条训练和一条推理操作的分类正确。记录保留具体输入/输出/参数前后及动作；先教知识再让玩家作判断。

## 四章滚动计划

首批优先当前原课程1.1算法/训练/推理及1.2确定性，同时精确绑定AIB对应lesson。随后按知识选玩法：第二章完整成本/收益账本与约束取舍；第三章资料使用前权限/证据检查；第四章运行接手或资源瓶颈修复。先逐批交可执行kind及评审，不给未覆盖概念伪造统一配对小游戏，也不把背景证据候选直接当新未见测验。
