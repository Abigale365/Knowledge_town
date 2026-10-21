# A 全量知识单元领域与双语审校（revision 2）

{"units":139,"objectives":58,"sources":66,"supported":104,"needs-review":35,"gap":0,"gaps":35}

本文件由审校记录生成。supported 表示核心解释有一手资料支持并经 AI 双语审校，不等于官方背书或人工认证。例子均为教学例示。未决缺口阻断完整课程编译。

## 1.1-lesson-6 · 人工智能 AI / Artificial intelligence (AI)

状态：supported

人工智能是较广的领域，关注让系统执行与智能有关的任务。机器学习是其中一类方法，并非所有自动化都需要机器学习。

Artificial intelligence is a broad field concerned with enabling systems to perform tasks associated with intelligence. Machine learning is one family of approaches within it; not all automation requires machine learning.

例子（教学例示）：清晰、固定的审批条件可直接编写规则，无需为了使用AI而换成模型。

Example (authored illustration): Clear, fixed approval conditions can be implemented directly as rules; there is no need to replace them with a model just to use AI.

审校：AI范围与ML从属关系有直接依据；固定规则示例为原创教学例示。 原例子均为课程原创教学例示。

先修：无硬性先修；本单元可用自身定义和日常例子独立入门，无必要硬先修；不把同技能首条机械设为依赖。

- 来源：[Artificial intelligence — IBM](https://www.ibm.com/think/topics/artificial-intelligence)；摘录键 d1-ai（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Machine learning — IBM](https://www.ibm.com/think/topics/machine-learning)；摘录键 d1-ml（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-7 · 机器学习 ML / Machine learning (ML)

状态：supported

机器学习利用数据学习模式，而不是为所有情况逐一编写规则。数据、目标和验证方式共同影响模型是否适用。

Machine learning learns patterns from data instead of requiring an explicit rule for every case. The data, objective and validation method jointly affect whether a model is suitable.

例子（教学例示）：通过历史交易学习异常模式，与人工写定额阈值规则不同。

Example (authored illustration): Learning unusual patterns from historical transactions differs from manually setting a fixed threshold rule.

审校：IBM Machine learning 开头说明从训练数据模式推断新数据，Machine learning vs. artificial intelligence 对照显式规则与学习；Model training 第1、3、5段说明样本适用性、参数与验证流程。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-6；先掌握人工智能 AI，才能理解本单元中的机器学习 ML机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Machine learning — IBM](https://www.ibm.com/think/topics/machine-learning)；摘录键 d1-ml（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Model training — IBM](https://www.ibm.com/think/topics/model-training)；摘录键 d1-training（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-16 · 深度学习 DL / Deep learning (DL)

状态：supported

使用多层神经网络学习数据表示的机器学习方法；它属于机器学习，而不是与AI并列的领域。

Deep learning is a machine learning approach that uses multilayer neural networks to learn data representations. It belongs within machine learning, rather than being a field at the same level as AI.

例子（教学例示）：识别商品照片中的缺陷。

Example (authored illustration): Identify defects in product photographs.

审校：多层神经网络与ML从属关系均获直接支持；缺陷识别为原创教学例示。 原例子均为课程原创教学例示。

先修：1.1-lesson-7, 1.1-lesson-17；先掌握机器学习 ML、神经网络，才能理解本单元中的深度学习 DL机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Deep learning — IBM](https://www.ibm.com/think/topics/deep-learning)；摘录键 d1-dl（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-17 · 神经网络 / Neural networks

状态：supported

由相连的计算节点和可学习权重组成的模型，通过层间计算处理输入。

A neural network is a model composed of connected computational nodes and learnable weights that processes inputs through computations across layers.

例子（教学例示）：学习交易特征与欺诈风险的关系。

Example (authored illustration): Learn the relationship between transaction features and fraud risk.

审校：分层节点、可学习权重、输入输出映射直接获支持。 原例子均为课程原创教学例示。

先修：1.1-lesson-2；先掌握模型 Model，才能理解本单元中的神经网络机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Neural networks — IBM](https://www.ibm.com/think/topics/neural-networks)；摘录键 d1-nn（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-18 · 自然语言处理 NLP / Natural language processing (NLP)

状态：supported

使计算机处理和分析人类语言的AI领域，任务包括分类、抽取和翻译。

Natural language processing is an AI field that enables computers to process and analyze human language, including classification, extraction and translation tasks.

例子（教学例示）：从工单文字中识别客户诉求。

Example (authored illustration): Identify a customer's request from the text of a support ticket.

审校：IBM What is NLP 段定义处理人类语言；Automation of repetitive tasks 明确分类、信息抽取和翻译，支持全部核心范围。工单为原创例示。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-6；先掌握人工智能 AI，才能理解本单元中的自然语言处理 NLP机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Natural language processing — IBM](https://www.ibm.com/think/topics/natural-language-processing)；摘录键 d1-nlp（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-19 · 计算机视觉 CV / Computer vision (CV)

状态：supported

从图像或视频中提取和解释信息的AI领域。

Computer vision is an AI field that extracts and interprets information from images or video.

例子（教学例示）：从产线照片中定位瑕疵。

Example (authored illustration): Locate defects in photographs from a production line.

审校：引文明确支持图像和视频的处理分析解释；领域定位在已读取正文中，生产线示例为教学例示。 原例子均为课程原创教学例示。

先修：1.1-lesson-6；先掌握人工智能 AI，才能理解本单元中的计算机视觉 CV机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Computer vision — IBM](https://www.ibm.com/think/topics/computer-vision)；摘录键 d1-cv（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-8 · 生成式人工智能 GenAI / Generative artificial intelligence (GenAI)

状态：supported

生成式AI能产生文本、图像等内容。语言流畅并不等于事实正确，业务使用需要核对事实、适用性与复核成本。

Generative AI can produce content such as text and images. Fluent language does not imply factual correctness; business use requires checking facts, suitability and the cost of review.

例子（教学例示）：起草访谈摘要之后，由负责人对照原文检查遗漏和误解。

Example (authored illustration): After drafting an interview summary, the responsible person checks it against the original for omissions and misunderstandings.

审校：IBM AI 的 Generative AI 段明确文本图像等内容生成；AI hallucinations 开头说明可信外观与错误事实可并存。事实/适用性/复核成本是课程实施检查建议，未声称为官方固定指标。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-6；先掌握人工智能 AI，才能理解本单元中的生成式人工智能 GenAI机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Artificial intelligence — IBM](https://www.ibm.com/think/topics/artificial-intelligence)；摘录键 d1-ai（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AI hallucinations — IBM](https://www.ibm.com/think/topics/ai-hallucinations)；摘录键 d1-hallucinations（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-1 · 算法 Algorithm / Algorithm

状态：supported

算法是一套可执行的方法或步骤。模型训练也依照算法进行，但算法本身不是训练后得到的模型。

An algorithm is an executable method or sequence of steps. Model training follows algorithms, but an algorithm is not itself the resulting trained model.

例子（教学例示）：按订单金额排序是一种算法；从订单记录学习需求规律则会得到预测模型。

Example (authored illustration): Sorting orders by value is an algorithm; learning demand patterns from order records produces a predictive model.

审校：NIST Definitions 段定义可执行计算规则；IBM Model training 开头及第三段把训练过程、调整参数和训练得到的参数值分开，支持算法与训练产物的区别。排序与需求预测为原创例示。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：无硬性先修；本单元可用自身定义和日常例子独立入门，无必要硬先修；不把同技能首条机械设为依赖。

- 来源：[Algorithm — NIST CSRC](https://csrc.nist.gov/glossary/term/Algorithm)；摘录键 d1-algorithm（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Model training — IBM](https://www.ibm.com/think/topics/model-training)；摘录键 d1-training（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-2 · 模型 Model / Model

状态：supported

模型是用于将输入映射为输出的表示。在机器学习中，模型的参数通过训练从数据中学习。它的输出需要根据任务目标验证。

A model is a representation used to map inputs to outputs. In machine learning, model parameters are learned from data through training. Its outputs must be validated against the task objective.

例子（教学例示）：将历史销量与日期输入需求模型，得到下一周销量估计。

Example (authored illustration): Feed historical sales and dates into a demand model to estimate next week's sales.

审校：IBM Machine learning 的 How machine learning works 说明输入至目标输出映射；Model training 前五段说明参数学习、使用目标、训练与验证。库存例子为课程自拟。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-1；先掌握算法 Algorithm，才能理解本单元中的模型 Model机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Machine learning — IBM](https://www.ibm.com/think/topics/machine-learning)；摘录键 d1-ml（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Model training — IBM](https://www.ibm.com/think/topics/model-training)；摘录键 d1-training（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-3 · 训练 Training / Training

状态：supported

训练利用已有样本调整模型参数，使模型学习数据中的模式。训练效果好不代表对新数据一定表现好，需要独立验证。

Training uses existing examples to adjust model parameters so the model learns patterns in data. Good training performance does not guarantee good performance on new data; independent validation is needed.

例子（教学例示）：用过去的订单记录学习需求规律，之后用未参与训练的时段检验。

Example (authored illustration): Learn demand patterns from past order records, then evaluate on a period not used in training.

审校：IBM Model training 第3段直接说明学习是参数调整，第5段包括验证；Data leakage 开头明确不可在同一训练数据上评估及未见数据检验，支持泛化限定。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-2；先掌握模型 Model，才能理解本单元中的训练 Training机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Model training — IBM](https://www.ibm.com/think/topics/model-training)；摘录键 d1-training（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Data leakage — IBM](https://www.ibm.com/think/topics/data-leakage-machine-learning)；摘录键 d1-leakage（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-4 · 推理 Inference / Inference

状态：supported

推理是使用已训练的模型处理新输入。训练改变参数；推理通常使用已有参数产生预测或生成内容。

Inference uses a trained model to process new inputs. Training changes parameters; inference usually uses existing parameters to produce predictions or generated content.

例子（教学例示）：上线的客服模型为一张新工单起草回复，属于推理。

Example (authored illustration): A deployed customer service model drafts a reply to a new ticket: this is inference.

审校：IBM AI inference 开头定义使用已训练模型产生新数据输出，紧接段落对比训练阶段的参数调整；Model training 说明调整得到知识参数。保留通常限定，未把在线学习与推理混为一谈。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-3；先掌握训练 Training，才能理解本单元中的推理 Inference机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[AI inference — IBM](https://www.ibm.com/think/topics/ai-inference)；摘录键 d1-inference（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Model training — IBM](https://www.ibm.com/think/topics/model-training)；摘录键 d1-training（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-5 · 预测 Prediction / Prediction

状态：needs-review

预测是利用输入和已学习的模式估计未知结果。业务评价既要看误差，也要看错误会造成的后果。

Prediction uses inputs and learned patterns to estimate an unknown outcome. Business evaluation must consider both error and the consequences of mistakes.

例子（教学例示）：需求高估可能造成库存积压；低估则可能造成缺货。

Example (authored illustration): Overestimating demand may create excess inventory; underestimating it may cause stockouts.

审校：已读IBM推理定义支持预测未知结果；业务错误代价的系统评价方法尚未取得专门资料，保留课程建议待领域审查。 双语保留全部限定；例子为原创教学例示。

先修：1.1-lesson-2；先掌握模型 Model，才能理解本单元中的预测 Prediction机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[AI inference — IBM](https://www.ibm.com/think/topics/ai-inference)；摘录键 d1-inference（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：已读IBM推理定义支持预测未知结果；业务错误代价的系统评价方法尚未取得专门资料，保留课程建议待领域审查。
- 所需材料：预测定义及错误成本评估的官方资料。

## 1.1-lesson-20 · 监督学习 / Supervised learning

状态：supported

使用带有目标标签的样本学习输入到目标的映射，可用于分类和回归。

Supervised learning uses examples with target labels to learn a mapping from inputs to targets. It can be used for classification and regression.

例子（教学例示）：利用已标记是否欺诈的交易训练分类器。

Example (authored illustration): Train a classifier using transactions labeled as fraudulent or not fraudulent.

审校：IBM How supervised learning works 说明输入标签映射；Types of supervised learning 的 Classification、Regression 两小节分别列出离散类别与连续目标。欺诈例子为原创教学例示。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-7；先掌握机器学习 ML，才能理解本单元中的监督学习机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Supervised learning — IBM](https://www.ibm.com/think/topics/supervised-learning)；摘录键 d1-supervised（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-21 · 无监督学习 / Unsupervised learning

状态：supported

从没有目标标签的数据中寻找结构或模式，例如将相似对象聚类。

Unsupervised learning looks for structure or patterns in data without target labels, for example by clustering similar objects.

例子（教学例示）：按购买特征形成客户分群。

Example (authored illustration): Segment customers by their purchasing characteristics.

审校：引文直接支持无标签、模式和聚类；购买分群为原创教学例示。 原例子均为课程原创教学例示。

先修：1.1-lesson-7；先掌握机器学习 ML，才能理解本单元中的无监督学习机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Unsupervised learning — IBM](https://www.ibm.com/think/topics/unsupervised-learning)；摘录键 d1-unsupervised（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-22 · 强化学习 / Reinforcement learning

状态：supported

智能体通过与环境交互和奖励反馈学习行动策略，关注长期累计回报。

In reinforcement learning, an agent learns an action policy through interactions with its environment and reward feedback, with a focus on long-term cumulative return.

例子（教学例示）：在模拟环境中学习库存补货策略。

Example (authored illustration): Learn an inventory replenishment policy in a simulated environment.

审校：IBM Reinforcement learning process 说明智能体与环境、行动和奖励反馈；Components of reinforcement learning 逐项定义policy、reward、value，覆盖长期累计回报。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-7；先掌握机器学习 ML，才能理解本单元中的强化学习机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Reinforcement learning — IBM](https://www.ibm.com/think/topics/reinforcement-learning)；摘录键 d1-rl（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-9 · 结构化数据 / Structured data

状态：supported

结构化数据有相对明确的字段或模式，便于按统一口径查询、统计和校验。结构清晰不等于内容必然准确。

Structured data has relatively well-defined fields or a schema, making it easier to query, summarize and validate consistently. A clear structure does not guarantee accurate contents.

例子（教学例示）：订单表中的日期、商品编号、数量，是明确的字段。

Example (authored illustration): Dates, product identifiers and quantities in an order table are explicit fields.

审校：结构化字段模式有直接依据；内容准确性不由结构推出是逻辑边界，订单字段为教学例示。 原例子均为课程原创教学例示。

先修：无硬性先修；本单元可用自身定义和日常例子独立入门，无必要硬先修；不把同技能首条机械设为依赖。

- 来源：[Structured versus unstructured data — IBM](https://www.ibm.com/think/topics/structured-vs-unstructured-data)；摘录键 d1-structure（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-10 · 非结构化数据 / Unstructured data

状态：supported

非结构化数据通常不像关系表那样具有固定字段结构，常见形式有正文、图片和录音。使用前可能需要提取与组织信息。

Unstructured data typically lacks the fixed field structure of a relational table; common forms include prose, images and audio recordings. Information may need to be extracted and organized before use.

例子（教学例示）：客户录音可先转写，再提取诉求；不能把转写过程当成事实核验。

Example (authored illustration): A customer recording can first be transcribed and then analyzed for requests; transcription must not be mistaken for fact-checking.

审校：无固定预定义格式获支持；正文图片录音和转写例示是概念应用，不将转写视为核验。 原例子均为课程原创教学例示。

先修：无硬性先修；本单元可用自身定义和日常例子独立入门，无必要硬先修；不把同技能首条机械设为依赖。

- 来源：[Structured versus unstructured data — IBM](https://www.ibm.com/think/topics/structured-vs-unstructured-data)；摘录键 d1-structure（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-11 · 数据质量 / Data quality

状态：supported

数据质量要结合用途检查准确性、完整性、一致性、时效性及相关性。更大的模型无法自动补救所有数据缺陷。

Data quality must be assessed for the intended use, including accuracy, completeness, consistency, timeliness and relevance. A larger model cannot automatically repair every data defect.

例子（教学例示）：销售数据存在重复订单，先调查重复来源再比较模型方案。

Example (authored illustration): If sales data contains duplicate orders, investigate the source of duplication before comparing model options.

审校：引文直接列出质量维度和用途适合性；大模型不能保证补救属于质量要求的谨慎边界。 原例子均为课程原创教学例示。

先修：无硬性先修；本单元可用自身定义和日常例子独立入门，无必要硬先修；不把同技能首条机械设为依赖。

- 来源：[Data quality — IBM](https://www.ibm.com/think/topics/data-quality)；摘录键 d1-quality（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-12 · 历史数据与泛化 / Historical data and generalization

状态：supported

历史数据反映过去的条件。要用独立数据检验模型能否处理未见情况，并留意未来环境与历史数据是否不同。

Historical data reflects past conditions. Use independent data to test whether a model can handle unseen cases, and watch for differences between future conditions and historical data.

例子（教学例示）：用过去节日销量训练的模型，遇到新的促销方式时仍需监测。

Example (authored illustration): A model trained on past holiday sales still needs monitoring when new promotion methods are introduced.

审校：独立评估与数据/关系变化证据共同支持泛化与历史局限。 原例子均为课程原创教学例示。

先修：1.1-lesson-3；先掌握训练 Training，才能理解本单元中的历史数据与泛化机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Model drift — IBM](https://www.ibm.com/think/topics/model-drift)；摘录键 d1-drift（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Data leakage — IBM](https://www.ibm.com/think/topics/data-leakage-machine-learning)；摘录键 d1-leakage（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-13 · 训练集与验证 / Training data and validation

状态：supported

训练数据用于学习，独立验证或测试用于检验未见样本的表现。把测试答案带入训练会让结果显得过于乐观。

Training data is used for learning; independent validation or testing assesses performance on unseen examples. Bringing test answers into training makes results look overly optimistic.

例子（教学例示）：不要将上线测试工单的标准答案直接放进待评估模型的输入。

Example (authored illustration): Do not directly include the reference answers for deployment test tickets in the input to the model being evaluated.

审校：IBM 定义及 Examples and types of data leakage 说明独立验证、目标泄漏、训练测试污染和虚高表现。测试工单标准答案例子是将未来不可得目标泄漏原则用于课程场景。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-3；先掌握训练 Training，才能理解本单元中的训练集与验证机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Data leakage — IBM](https://www.ibm.com/think/topics/data-leakage-machine-learning)；摘录键 d1-leakage（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-14 · AI框架与统一词汇 / AI frameworks and shared terminology

状态：supported

团队应先统一算法、模型、训练和推理等词的含义，再讨论方案。标准或框架可以帮助组织概念，但不能当作准确率保证。

Teams should first agree on the meanings of terms such as algorithm, model, training and inference before discussing solutions. Standards or frameworks can organize concepts, but do not guarantee accuracy.

例子（教学例示）：业务说的“模型上线”与技术说的“模型训练完成”不是同一件事。

Example (authored illustration): What business staff call model deployment is not the same as what technical staff call completion of model training.

审校：统一术语框架直接获支持；不等同准确率保证是框架范围的边界说明。 原例子均为课程原创教学例示。

先修：1.1-lesson-1, 1.1-lesson-2, 1.1-lesson-3, 1.1-lesson-4；先掌握算法 Algorithm、模型 Model、训练 Training、推理 Inference，才能理解本单元中的AI框架与统一词汇机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[ISO/IEC 23053 official overview](https://www.iso.org/standard/74438.html)；摘录键 d1-iso23053（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.1-lesson-15 · ISO框架意识 / Awareness of ISO frameworks

状态：supported

按本课程大纲，需了解ISO/IEC 23053与ISO/IEC 42001等框架。前者关注使用机器学习的AI系统框架，后者关注组织AI管理体系；具体要求应查正式标准。

This course outline calls for awareness of frameworks such as ISO/IEC 23053 and ISO/IEC 42001. The former concerns a framework for AI systems using machine learning; the latter concerns organizational AI management systems. Consult the formal standards for specific requirements.

例子（教学例示）：讨论组织责任和管理流程时，不把管理体系标准解释为模型零错误认证。

Example (authored illustration): When discussing organizational responsibilities and management processes, do not interpret a management system standard as certifying an error-free model.

审校：已读取ISO官方概览，支持两标准对象区别；未宣称读取收费标准全文，也未推导具体合规条款。 原例子均为课程原创教学例示。

先修：1.1-lesson-14；先掌握AI框架与统一词汇，才能理解本单元中的ISO框架意识机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[ISO/IEC 23053 official overview](https://www.iso.org/standard/74438.html)；摘录键 d1-iso23053（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[ISO/IEC 42001 official overview](https://www.iso.org/standard/42001)；摘录键 d1-iso42001（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2-lesson-1 · 规则还是AI / Rules or AI

状态：needs-review

条件明确且稳定时，优先考虑确定性规则。模式复杂、规则难穷举时再评估AI；比较价值、错误后果和维护成本。

When conditions are clear and stable, consider deterministic rules first. When patterns are complex and rules are difficult to enumerate, evaluate AI; compare value, consequences of error and maintenance costs.

例子（教学例示）：报销超过明确金额需审批，可以先采用固定规则。

Example (authored illustration): If expenses above a clearly specified amount require approval, a fixed rule can be used first.

审校：IBM已读正文区分显式规则与复杂模式学习；规则优先的选择策略和价值/维护成本权衡尚缺决策指南。 双语保留全部限定；例子为原创教学例示。

先修：1.1-lesson-7；先掌握机器学习 ML，才能理解本单元中的规则还是AI机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Machine learning — IBM](https://www.ibm.com/think/topics/machine-learning)；摘录键 d1-ml（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：IBM已读正文区分显式规则与复杂模式学习；规则优先的选择策略和价值/维护成本权衡尚缺决策指南。
- 所需材料：规则与模型选择、错误成本和维护成本的官方决策指南。

## 1.2-lesson-2 · AI代理与工具 / AI agents and tools

状态：supported

代理围绕目标协调步骤和工具，可能具有一定自主性。代理的行动权限、失败处理和监督方式需要单独设计。

An agent coordinates steps and tools around a goal and may have some autonomy. Its action permissions, failure handling and supervision must be designed separately.

例子（教学例示）：能调用退款工具的助手，需要退款额度、日志和人工升级边界。

Example (authored illustration): An assistant that can call a refund tool needs refund limits, logs and boundaries for escalation to a human.

审校：IBM AI agents defined、Goal initialization and planning、Best practices 的 Activity logs / Interruption / Human supervision 支持工具目标协调、权限监督、失败处理；AWS action group参数与IAM政策为实施依据。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-4；先掌握推理 Inference，才能理解本单元中的AI代理与工具机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[AI agents — IBM](https://www.ibm.com/think/topics/ai-agents)；摘录键 d1-agents（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Prerequisites for creating Amazon Bedrock Agents — AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-prereq.html)；摘录键 d1-actions（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Implementing least privilege access for Amazon Bedrock — AWS](https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/)；摘录键 d1-iam（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2-lesson-3 · 代理协作与编排 / Agent collaboration and orchestration

状态：needs-review

多个代理的角色分工、信息交换和执行顺序属于编排问题。角色越多不自动代表效果越好，要检查任务完成与交接质量。

Dividing roles, exchanging information and ordering execution among multiple agents are orchestration problems. More roles do not automatically improve results; check task completion and handoff quality.

例子（教学例示）：检索代理交给起草代理的资料仍需保留来源和访问范围。

Example (authored illustration): Materials passed from a retrieval agent to a drafting agent must retain their sources and access scope.

审校：IBM编排正文支持多角色协调及执行次序，AI agents的风险章节说明共享失败风险；资料交接来源和访问范围的具体约定尚缺专项指南。 双语保留全部限定；例子为原创教学例示。

先修：1.2-lesson-2；先掌握AI代理与工具，才能理解本单元中的代理协作与编排机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[AI agent orchestration — IBM](https://www.ibm.com/think/topics/ai-agent-orchestration)；摘录键 d1-orchestration（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：IBM编排正文支持多角色协调及执行次序，AI agents的风险章节说明共享失败风险；资料交接来源和访问范围的具体约定尚缺专项指南。
- 所需材料：多代理交接证据、访问控制和质量评估官方指南。

## 1.2-lesson-4 · 模型漂移与持续监测 / Model drift and continuous monitoring

状态：needs-review

输入分布或业务关系变化可能使模型表现变差。部署后持续观察质量、成本和反馈，发现变化后调查原因并纠正。

Changes in input distributions or business relationships may degrade model performance. After deployment, continually observe quality, cost and feedback, investigate changes and take corrective action.

例子（教学例示）：客户群变化后投诉分类变差，应调查新文本与原有训练样本的差别。

Example (authored illustration): If complaint classification deteriorates after the customer population changes, investigate differences between new text and the original training examples.

审校：IBM漂移正文支持变化检测、监测与重新测试；本单元把质量、成本、反馈整合为闭环的具体指标方案尚缺运行指南。 双语保留全部限定；例子为原创教学例示。

先修：1.1-lesson-12；先掌握历史数据与泛化，才能理解本单元中的模型漂移与持续监测机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Model drift — IBM](https://www.ibm.com/think/topics/model-drift)；摘录键 d1-drift（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：IBM漂移正文支持变化检测、监测与重新测试；本单元把质量、成本、反馈整合为闭环的具体指标方案尚缺运行指南。
- 所需材料：部署后监测指标与纠正流程的官方资料。

## 1.2-lesson-5 · 工具分类与影子AI / Tool classification and shadow AI

状态：supported

明确哪些工具已批准、受限、被阻止或仍在评估，说明数据使用边界并提供合适替代方案，有助于减少未经批准的使用。

Clearly identify tools as approved, restricted, blocked or under evaluation. Explain data-use boundaries and provide suitable alternatives to help reduce unapproved use.

例子（教学例示）：员工需要处理敏感文档时，应知道可用工具和求助渠道。

Example (authored illustration): Employees handling sensitive documents should know which tools and support channels are available.

审校：IBM How to manage the risks of shadow AI 的治理框架、护栏、协作和风险沟通小节支持工具使用范围、敏感信息、测试环境及批准替代。四级标签是课程提出的实施分类，不是IBM规定的唯一标准。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：无硬性先修；本单元可用自身定义和日常例子独立入门，无必要硬先修；不把同技能首条机械设为依赖。

- 来源：[Shadow AI — IBM](https://www.ibm.com/think/topics/shadow-ai)；摘录键 d1-shadow（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2.1-unit-1 · 确定性与可重复执行 / Determinism and reproducible execution

状态：supported

规则系统把明确条件映射到动作。同一输入和规则版本应产生同一结果，适合固定阈值、必填校验和明确审批政策。

A rule-based system maps explicit conditions to actions. The same input and rule version should yield the same result, making it suitable for fixed thresholds, required-field checks and explicit approval policies.

例子（教学例示）：报销超过5000元必须审批，用金额规则执行。

Example (authored illustration): Enforce approval for expenses above 5,000 yuan using an amount-based rule.

易混边界：不是所有自动化都需要学习模型。

Boundary: Not all automation needs a learning model.

审校：NIST算法定义说明明确规则产生规定结果；IBM Machine learning vs. artificial intelligence 给出if-then规则并对比学习模型。此处仅针对确定性规则系统，同一输入包括规则读取的完整状态；金额审批为课程示例。 短引文是正文定位锚点，所有业务例子为原创教学例示。

先修：1.1-lesson-1；先掌握算法 Algorithm，才能理解本单元中的确定性与可重复执行机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Algorithm — NIST CSRC](https://csrc.nist.gov/glossary/term/Algorithm)；摘录键 d1-algorithm（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Machine learning — IBM](https://www.ibm.com/think/topics/machine-learning)；摘录键 d1-ml（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2.1-unit-2 · 预测、生成与行动的边界 / Boundaries between prediction, generation and action

状态：supported

预测估计未知结果；生成产生新内容；代理协调工具和步骤执行目标。一个业务系统可以组合三者，应分别验收预测误差、内容质量和行动权限。

Prediction estimates unknown outcomes; generation creates new content; an agent coordinates tools and steps to pursue a goal. A business system can combine all three, but should separately assess prediction error, content quality and action permissions.

例子（教学例示）：预测缺货后起草补货建议，实际下单仍需授权。

Example (authored illustration): After predicting a stockout, draft a replenishment suggestion; placing the actual order still requires authorization.

易混边界：能写出行动建议，不等于已被允许执行。

Boundary: Being able to write an action recommendation does not mean permission to execute it has been granted.

审校：IBM分别定义预测推理、生成新内容和自主工具行动；AI agents 的 Human supervision 要求高影响行动审批，AWS独立IAM授权机制支持能力不等于权限。分别验收是课程从能力区别提出的设计建议。 短引文是正文定位锚点，所有业务例子为原创教学例示。

先修：1.1-lesson-5, 1.1-lesson-8, 1.2-lesson-2；先掌握预测 Prediction、生成式人工智能 GenAI、AI代理与工具，才能理解本单元中的预测、生成与行动的边界机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[AI inference — IBM](https://www.ibm.com/think/topics/ai-inference)；摘录键 d1-inference（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Artificial intelligence — IBM](https://www.ibm.com/think/topics/artificial-intelligence)；摘录键 d1-ai（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AI agents — IBM](https://www.ibm.com/think/topics/ai-agents)；摘录键 d1-agents（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Implementing least privilege access for Amazon Bedrock — AWS](https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/)；摘录键 d1-iam（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2.2-unit-1 · 自主性与停止条件 / Autonomy and stopping conditions

状态：supported

代理的自主性是无需逐步人工指令即可选择行动的程度。应明确目标、可用工具、次数或金额限制、停止条件和异常升级，而不是把自主性理解为无限权限。

Agent autonomy is the degree to which an agent can choose actions without step-by-step human instructions. Define goals, available tools, limits on attempts or amounts, stopping conditions and escalation for exceptions; autonomy does not mean unlimited permission.

例子（教学例示）：连续两次检索失败后停止，转给人工核对。

Example (authored illustration): Stop after two consecutive failed retrieval attempts and transfer the task to a human for checking.

易混边界：自主性越高，监督和边界越不能省略。

Boundary: Greater autonomy makes supervision and boundaries more necessary, not optional.

审校：IBM 定义、Goal initialization、Infinite feedback loops、Interruption 与 Human supervision 涵盖自主行动、目标工具、停止与人工介入；AWS最小权限支持行动范围。两次失败和金额限制是原创控制方案例示。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.2-lesson-2；先掌握AI代理与工具，才能理解本单元中的自主性与停止条件机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[AI agents — IBM](https://www.ibm.com/think/topics/ai-agents)；摘录键 d1-agents（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Implementing least privilege access for Amazon Bedrock — AWS](https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/)；摘录键 d1-iam（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2.2-unit-2 · 工具契约与最小行动权限 / Tool contracts and least action privileges

状态：supported

工具调用需要约定输入、输出、错误、授权和副作用。退款、发邮件等改变外部状态的工具，应在服务端检查权限并保存审计记录。

Tool calls require agreements on inputs, outputs, errors, authorization and side effects. Tools that change external state, such as refunding or sending email, should check permissions on the server and retain audit records.

例子（教学例示）：退款工具拒绝超过额度的请求，并记录调用者。

Example (authored illustration): A refund tool rejects requests above the limit and logs the caller.

易混边界：提示词中的提醒不能替代服务端权限检查。

Boundary: Reminders in a prompt cannot replace server-side authorization checks.

审校：AWS agents-prereq 的 Action group 段定义参数/API/处理/响应；agents-lambda 的 Input event、Response 与 responseState 规定输入、输出和失败处理，开头要求资源权限政策。AWS安全文的 Model adaptation/Model testing 要求IAM执行授权、验证限制及CloudTrail记录，明确避免日志泄露敏感提示。退款额度由服务端业务逻辑执行是教学应用；提示不等于授权由独立IAM控制机制推出。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.2-lesson-2；先掌握AI代理与工具，才能理解本单元中的工具契约与最小行动权限机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Prerequisites for creating Amazon Bedrock Agents — AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-prereq.html)；摘录键 d1-actions（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Configure action group Lambda functions — AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-lambda.html)；摘录键 d1-lambda（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Implementing least privilege access for Amazon Bedrock — AWS](https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/)；摘录键 d1-iam（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2.2-unit-3 · 交接与编排 / Handoffs and orchestration

状态：needs-review

多代理编排规定谁做什么、传什么证据以及何时交接。串行流程适合依赖关系，受控并行可处理独立任务；交接应保留来源、状态和失败责任。

Multi-agent orchestration specifies who does what, which evidence is passed and when handoffs occur. Sequential workflows suit dependent tasks, while controlled parallelism can handle independent tasks. Handoffs should retain sources, status and responsibility for failures.

例子（教学例示）：检索角色交付带出处的资料，审核角色核对后交给起草者。

Example (authored illustration): A retrieval role delivers sourced material; a review role checks it before passing it to the drafter.

易混边界：增加角色数量本身不是质量证据。

Boundary: Increasing the number of roles is not itself evidence of quality.

审校：已读编排正文支持角色与同步协调；串并行任务依赖、交接证据及失败责任的明确流程仍需专项编排资料。 双语保留全部限定；例子为原创教学例示。

先修：1.2-lesson-3；先掌握代理协作与编排，才能理解本单元中的交接与编排机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[AI agent orchestration — IBM](https://www.ibm.com/think/topics/ai-agent-orchestration)；摘录键 d1-orchestration（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：已读编排正文支持角色与同步协调；串并行任务依赖、交接证据及失败责任的明确流程仍需专项编排资料。
- 所需材料：代理串并行编排、来源传递、状态与失败责任官方文档。

## 1.2.3-unit-1 · 数据漂移与概念漂移 / Data drift and concept drift

状态：supported

数据漂移是输入分布变化；概念漂移是输入与目标关系变化。发现分布变化不等于已经证明业务损害，需要结合真实结果和任务指标调查。

Data drift is a change in the input distribution; concept drift is a change in the relationship between inputs and targets. Detecting a distribution change does not prove business harm; investigate using actual outcomes and task metrics.

例子（教学例示）：新客户用词变了是输入变化，促销使同一价格对应的需求改变是关系变化。

Example (authored illustration): Different wording from new customers is an input change; a promotion changing demand at the same price is a relationship change.

易混边界：不能看到漂移告警就不加验证地自动重训上线。

Boundary: Do not automatically retrain and deploy without validation merely because a drift alert fires.

审校：IBM Model drift 的 Concept drift 和 Data drift 小节区分输入目标关系与输入分布；Best practices 的 Automate model testing 要求预生产验证并持续测试。告警后调查再上线是本课程的谨慎实施原则，未宣称漂移必然损害业务。 短引文是正文定位锚点，所有业务例子为原创教学例示。

先修：1.2-lesson-4；先掌握模型漂移与持续监测，才能理解本单元中的数据漂移与概念漂移机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Model drift — IBM](https://www.ibm.com/think/topics/model-drift)；摘录键 d1-drift（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Data leakage — IBM](https://www.ibm.com/think/topics/data-leakage-machine-learning)；摘录键 d1-leakage（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.2.3-unit-2 · 监测基线与反馈闭环 / Monitoring baselines and feedback loops

状态：needs-review

上线前记录可比较的质量、延迟、成本和失败率。运行时监测变化，调查原因，验证修复，再决定重训、回退或调整用途。

Before deployment, record comparable baselines for quality, latency, cost and failure rate. During operation, monitor changes, investigate causes and validate fixes before deciding to retrain, roll back or adjust the use case.

例子（教学例示）：投诉分类准确率下降时，抽查新样本并比较旧版模型。

Example (authored illustration): When complaint classification accuracy falls, inspect new examples and compare with the previous model version.

易混边界：一次上线验收不能替代持续监测。

Boundary: A one-time deployment acceptance test cannot replace continuous monitoring.

审校：已读漂移正文支持测试和监测；延迟/成本/失败率基线以及重训、回退、用途调整的决策条件尚缺运行手册。 双语保留全部限定；例子为原创教学例示。

先修：1.2-lesson-4；先掌握模型漂移与持续监测，才能理解本单元中的监测基线与反馈闭环机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Model drift — IBM](https://www.ibm.com/think/topics/model-drift)；摘录键 d1-drift（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：已读漂移正文支持测试和监测；延迟/成本/失败率基线以及重训、回退、用途调整的决策条件尚缺运行手册。
- 所需材料：生产监测指标基线、修复验证与回退流程官方资料。

## 1.2.4-unit-1 · 工具分级与影子AI / Tool classification and shadow AI

状态：supported

把工具标为已批准、受限、评估中或禁止，同时说明适用数据和用途。影子AI是未经组织批准或管理的使用，应提供可用替代、培训和反馈渠道。

Classify tools as approved, restricted, under evaluation or prohibited, and specify applicable data and uses. Shadow AI means use without organizational approval or management; provide usable alternatives, training and feedback channels.

例子（教学例示）：公开可用工具清单，并提供敏感文档的合规处理渠道。

Example (authored illustration): Publish a list of available tools and provide a compliant channel for processing sensitive documents.

易混边界：只列禁用名单而不解决工作需求，难以形成可执行治理。

Boundary: A blocklist alone, without addressing work needs, makes governance difficult to carry out.

审校：IBM How to manage the risks of shadow AI 涵盖协作、适用工具和敏感数据规则、培训、试验环境、阻止未授权平台及批准替代。四级清单与反馈渠道是把上述机制组织成课程实践，不是标准强制分类。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：无硬性先修；本单元可用自身定义和日常例子独立入门，无必要硬先修；不把同技能首条机械设为依赖。

- 来源：[Shadow AI — IBM](https://www.ibm.com/think/topics/shadow-ai)；摘录键 d1-shadow（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.3-lesson-1 · 提示工程 / Prompt engineering

状态：needs-review

提示应说明目标、必要背景、约束和期望输出。用代表性任务测试提示，避免只看一条漂亮回答。

Prompts should state the objective, necessary context, constraints and expected output. Test prompts on representative tasks instead of judging them from one attractive response.

例子（教学例示）：要求依据提供的访谈生成三点摘要，并为每点标出对应原文。

Example (authored illustration): Ask for a three-point summary based on a supplied interview, identifying the corresponding original passage for each point.

审校：AWS Prompt engineering concepts 已支持任务、上下文、样例及输出约束；代表性任务测试的选样与验收办法尚需评测资料。 双语保留全部限定；例子为原创教学例示。

先修：1.1-lesson-8；先掌握生成式人工智能 GenAI，才能理解本单元中的提示工程机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Prompt engineering — IBM](https://www.ibm.com/think/topics/prompt-engineering)；摘录键 d1-prompt（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Prompt engineering concepts — AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html)；摘录键 d1-prompt-components（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：AWS Prompt engineering concepts 已支持任务、上下文、样例及输出约束；代表性任务测试的选样与验收办法尚需评测资料。
- 所需材料：提示组成及代表性评测的官方技术指南。

## 1.3-lesson-2 · 词元与上下文窗口 / Tokens and context windows

状态：supported

模型一次请求可处理的上下文有上限，输入与输出预算需要规划。资料过多时应筛选相关片段，而不是假设全部文件都会被有效使用。

There is a limit to the context a model can process in one request, so plan input and output budgets. When there is too much material, select relevant passages rather than assuming every file will be used effectively.

例子（教学例示）：先按章节切分教材，再提供与当前问题直接相关的段落。

Example (authored illustration): Split a textbook by chapter first, then provide passages directly relevant to the current question.

审校：Anthropic How the context window works 明确历史与输出共享窗口、系统提示和工具消息计入；IBM长上下文挑战说明容量不能保证利用。筛选相关片段是课程实施建议。 短引文是正文定位锚点，所有业务例子为原创教学例示。

先修：1.1-lesson-8；先掌握生成式人工智能 GenAI，才能理解本单元中的词元与上下文窗口机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Context windows — Anthropic](https://platform.claude.com/docs/en/build-with-claude/context-windows)；摘录键 d1-context-api（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Context window — IBM](https://www.ibm.com/think/topics/context-window)；摘录键 d1-context（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.3-lesson-3 · 检索增强生成 RAG / Retrieval-augmented generation (RAG)

状态：supported

RAG先检索相关且获授权的资料，再把资料提供给生成过程。它改善可用信息条件，但不保证检索和回答一定正确。

RAG first retrieves relevant, authorized material and then supplies it to generation. It improves the information available, but does not guarantee correct retrieval or answers.

例子（教学例示）：制度频繁更新时，核对检索资料的版本、权限和回答引用。

Example (authored illustration): For frequently changing policies, check the retrieved material's version, permissions and the answer's citations.

审校：AWS How does Retrieval-Augmented Generation work 说明先检索后生成；More developer control 明确分级授权和错误资料来源；Update external data 说明资料及嵌入更新。IBM幻觉定义说明回答不保证正确。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.1-lesson-8；先掌握生成式人工智能 GenAI，才能理解本单元中的检索增强生成 RAG机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Retrieval-Augmented Generation — AWS](https://aws.amazon.com/what-is/retrieval-augmented-generation/)；摘录键 d1-rag（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AI hallucinations — IBM](https://www.ibm.com/think/topics/ai-hallucinations)；摘录键 d1-hallucinations（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.3-lesson-4 · 微调 Fine-tuning / Fine-tuning

状态：supported

微调利用训练样本调整模型行为或任务适应性。它与在请求中加入新资料不同，也不能替代对不断变化事实的维护。

Fine-tuning uses training examples to adjust model behavior or adapt it to a task. It differs from adding new material to a request and cannot replace maintenance of continually changing facts.

例子（教学例示）：统一输出风格与补充最新制度属于不同需求，先辨别问题再选技术。

Example (authored illustration): Standardizing output style and supplying the latest policy are different needs; identify the problem before choosing a technique.

审校：继续训练既有权重与请求前读取外部知识有直接区别；不断变化事实需维护是两种机制的合理教学边界。 原例子均为课程原创教学例示。

先修：1.1-lesson-3, 1.1-lesson-8；先掌握训练 Training、生成式人工智能 GenAI，才能理解本单元中的微调 Fine-tuning机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Fine-tuning — IBM](https://www.ibm.com/think/topics/fine-tuning)；摘录键 d1-finetune（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Retrieval-Augmented Generation — AWS](https://aws.amazon.com/what-is/retrieval-augmented-generation/)；摘录键 d1-rag（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.3.1-unit-1 · 任务、上下文、约束与格式 / Task, context, constraints and format

状态：needs-review

提示应交代要做的工作、相关资料、不可越过的边界及期望输出。把原始资料与操作指令分隔，能减少模型把文档文字误当指令的机会。

A prompt should state the work to do, relevant material, boundaries that must not be crossed and the expected output. Separating source material from operational instructions can reduce the chance that document text is mistaken for an instruction.

例子（教学例示）：依据访谈提取三项需求，逐项引用，未出现的内容写未知。

Example (authored illustration): Extract three requirements from an interview, cite each one, and write unknown for information that is absent.

易混边界：更长的提示不必然更好，必须验证输出是否满足任务。

Boundary: A longer prompt is not necessarily better; verify that the output satisfies the task.

审校：AWS正文支持提示组件及分隔示例；分隔文档与操作指令能降低指令混淆的安全性声明仍需专项资料，不能把格式分隔当作权限边界。 双语保留全部限定；例子为原创教学例示。

先修：1.3-lesson-1；先掌握提示工程，才能理解本单元中的任务、上下文、约束与格式机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Prompt engineering — IBM](https://www.ibm.com/think/topics/prompt-engineering)；摘录键 d1-prompt（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Prompt engineering concepts — AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html)；摘录键 d1-prompt-components（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：AWS正文支持提示组件及分隔示例；分隔文档与操作指令能降低指令混淆的安全性声明仍需专项资料，不能把格式分隔当作权限边界。
- 所需材料：提示分隔、注入防御及任务上下文约束格式官方指导。

## 1.3.1-unit-2 · 代表性样例与提示版本 / Representative examples and prompt versions

状态：needs-review

用典型、边界和失败案例测试提示，记录版本和成功标准。少样本示例应展示期望任务模式，而不是把测试题答案泄漏给模型。

Test prompts with typical, boundary and failure cases, recording versions and success criteria. Few-shot examples should demonstrate the intended task pattern rather than leak test answers to the model.

例子（教学例示）：同时测试普通工单、缺失资料工单与无权访问工单。

Example (authored illustration): Test ordinary tickets, tickets with missing information and tickets involving unauthorized access.

易混边界：单次漂亮回答不能证明提示可稳定复用。

Boundary: One impressive answer does not demonstrate reliable reuse of a prompt.

审校：已读IBM和AWS正文支持少样本展示任务模式；版本、成功标准及典型/边界/失败用例的测试管理仍需专项评测资料。 双语保留全部限定；例子为原创教学例示。

先修：1.3-lesson-1；先掌握提示工程，才能理解本单元中的代表性样例与提示版本机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Prompt engineering — IBM](https://www.ibm.com/think/topics/prompt-engineering)；摘录键 d1-prompt（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Data leakage — IBM](https://www.ibm.com/think/topics/data-leakage-machine-learning)；摘录键 d1-leakage（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Prompt engineering concepts — AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html)；摘录键 d1-prompt-components（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：已读IBM和AWS正文支持少样本展示任务模式；版本、成功标准及典型/边界/失败用例的测试管理仍需专项评测资料。
- 所需材料：提示版本管理、代表性测试集和答案泄漏防范资料。

## 1.3.2-unit-1 · 输入与输出共享预算 / Shared input and output budget

状态：supported

上下文窗口有限。规划时需计入指令、检索片段、历史对话、工具消息和预留输出，超过限制时应筛选、压缩或拆分。

Context windows are limited. Budget for instructions, retrieved passages, conversation history, tool messages and reserved output; select, compress or split material when limits would be exceeded.

例子（教学例示）：窗口8000，指令1000、资料5000、历史1000，输出1500会超过500。

Example (authored illustration): With a window of 8,000 tokens, instructions of 1,000, material of 5,000, history of 1,000 and output of 1,500 exceed the limit by 500.

易混边界：词元不等于中文字数，实际计数依模型分词器。

Boundary: Tokens are not the same as Chinese character counts; actual counts depend on the model's tokenizer.

审校：Anthropic How the context window works 与 Context window overflow behavior 说明请求各部分、工具结果和输出的预算；IBM Context windows and tokenization 解释分词与字符不等价。8000算例是假设共享窗口的教学算术，不代表任何具体型号。 短引文是正文定位锚点，所有业务例子为原创教学例示。

先修：1.3-lesson-2；先掌握词元与上下文窗口，才能理解本单元中的输入与输出共享预算机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Context windows — Anthropic](https://platform.claude.com/docs/en/build-with-claude/context-windows)；摘录键 d1-context-api（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Context window — IBM](https://www.ibm.com/think/topics/context-window)；摘录键 d1-context（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.3.2-unit-2 · 相关性与信息位置 / Relevance and information placement

状态：supported

资料能放入窗口不代表所有内容都会被正确使用。优先提供当前问题相关、获授权且版本明确的片段，并验证回答是否真正引用了支持结论的内容。

Material fitting in the window does not mean all of it will be used correctly. Prioritize passages relevant to the current question, authorized for use and clearly versioned; verify that the answer actually cites content supporting its conclusions.

例子（教学例示）：只取当前退款政策相关段落，而不是拼进所有部门手册。

Example (authored illustration): Retrieve only the passages relevant to the current refund policy instead of concatenating every department's handbook.

易混边界：上下文容量不是事实准确率的保证。

Boundary: Context capacity does not guarantee factual accuracy.

审校：IBM context window 的长上下文挑战段说明信息进入窗口仍可能未被正确使用，位置影响利用；AWS RAG 的授权、来源核对及外部更新小节支持相关性、权限和版本维护。核对引用支持结论是课程检查建议。 依据已浏览正文判定，短引文仅作定位锚点；例子均为原创教学例示。

先修：1.3-lesson-2；先掌握词元与上下文窗口，才能理解本单元中的相关性与信息位置机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Context window — IBM](https://www.ibm.com/think/topics/context-window)；摘录键 d1-context（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Retrieval-Augmented Generation — AWS](https://aws.amazon.com/what-is/retrieval-augmented-generation/)；摘录键 d1-rag（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AI hallucinations — IBM](https://www.ibm.com/think/topics/ai-hallucinations)；摘录键 d1-hallucinations（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.3.3-unit-1 · RAG的检索与生成两道关 / The retrieval and generation checks in RAG

状态：supported

RAG先检索资料，再把相关片段提供给模型生成。分别评估是否找对资料，以及回答是否被资料支持；同时维护版本、权限和缺失证据时的处理。

RAG retrieves material first and supplies relevant passages to a model for generation. Separately evaluate whether the right material was found and whether it supports the answer; also maintain versions, permissions and a procedure for missing evidence.

例子（教学例示）：政策更新后重建索引，并测试旧版本是否仍被错误引用。

Example (authored illustration): After a policy update, rebuild the index and test whether the old version is still cited incorrectly.

易混边界：有引用不等于引用支持结论。

Boundary: Having a citation does not mean the cited material supports the conclusion.

审校：AWS评测文档分检索与检索生成，列Context relevance、Faithfulness和Citation coverage；RAG概览的More developer control及Update external data支持权限和版本更新。缺证时应制定处理是课程实施建议，未声称某固定回退政策是官方要求。 短引文是正文定位锚点，所有业务例子为原创教学例示。

先修：1.3-lesson-3；先掌握检索增强生成 RAG，才能理解本单元中的RAG的检索与生成两道关机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Retrieval-Augmented Generation — AWS](https://aws.amazon.com/what-is/retrieval-augmented-generation/)；摘录键 d1-rag（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Use metrics to understand RAG system performance — AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-evaluation-metrics.html)；摘录键 d1-rag-eval（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AI hallucinations — IBM](https://www.ibm.com/think/topics/ai-hallucinations)；摘录键 d1-hallucinations（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 1.3.3-unit-2 · 微调与外部知识更新 / Fine-tuning and external knowledge updates

状态：supported

微调通过训练调整参数，适合评估任务行为、格式或风格适配；外部资料频繁更新时，通常先评估检索和资料维护需求。两者可组合，但不能相互冒充。

Fine-tuning adjusts parameters through training and can be evaluated for adapting task behavior, format or style. When external material changes frequently, usually evaluate retrieval and material maintenance needs first. The two approaches can be combined, but must not be confused.

例子（教学例示）：统一客服回复风格可评估微调，今天更新的退货政策需要及时资料。

Example (authored illustration): Fine-tuning can be evaluated for consistent customer service style; a return policy updated today requires up-to-date material.

易混边界：不要把微调当成随时更新的事实数据库。

Boundary: Do not treat fine-tuning as a continuously updated factual database.

审校：两机制区别获支持；优先评估资料维护属于明确的教学建议，未声称微调不能学到事实。 原例子均为课程原创教学例示。

先修：1.3-lesson-4, 1.3-lesson-3；先掌握微调 Fine-tuning、检索增强生成 RAG，才能理解本单元中的微调与外部知识更新机制或比较边界；这是教学顺序判断，并非外站指定顺序。

- 来源：[Fine-tuning — IBM](https://www.ibm.com/think/topics/fine-tuning)；摘录键 d1-finetune（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Retrieval-Augmented Generation — AWS](https://aws.amazon.com/what-is/retrieval-augmented-generation/)；摘录键 d1-rag（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.1-lesson-1 · 从业务问题到用例 / From business problems to use cases

状态：supported

先明确谁在什么流程中遇到什么问题，再把AI能力映射到可观察的业务结果。技术选择要服务目标。

First identify who faces what problem in which workflow, then map AI capabilities to observable business outcomes. Technology choices must serve the objective.

例子（教学例示）：教学例示（非来源原例）：将“做一个AI助手”改为“减少客服查找获授权制度的时间，同时保持答复质量”。

Example (authored illustration): Teaching illustration (not a source case): Replace 'build an AI assistant' with 'reduce the time customer support spends finding authorized policies while maintaining response quality'.

审校：官方四决策明确受益者、工作流、结果和指标；例子是原作者教学例示，非官方案例。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.1-lesson-2 · 自建、购买或合作 / Build, buy, or partner

状态：needs-review

比较预算、交付时间、内部能力、供应商条件和合规需求。也要考虑集成、维护、迁移与持续运营成本。

Compare budget, delivery time, internal capabilities, supplier conditions, and compliance needs. Also consider integration, maintenance, migration, and ongoing operating costs.

例子（教学例示）：教学例示（非来源原例）：现有团队缺少运维能力时，不能只比较模型购买价格。

Example (authored illustration): Teaching illustration (not a source case): When the current team lacks operational capability, comparing model purchase prices alone is insufficient.

审校：微软列出购买/自建成本和组织能力，尚未完整覆盖合作与合同。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Analyze whether to build, buy, or extend AI components](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/4-analyze-whether-build-buy-extend-ai-components-business-solutions)；摘录键 d2-buy（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：合作关系及供应商合同条款尚缺直接证据。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：合作关系及供应商合同条款尚缺直接证据。

## 2.1-lesson-3 · 项目优先级 / Project prioritization

状态：needs-review

综合商业价值、可行性、可持续性及战略契合度，决定扩展、暂停还是终止。先定义检验假设和停止条件。

Consider business value, feasibility, sustainability, and strategic fit together when deciding whether to scale, pause, or terminate a project. Define the hypotheses to test and the stopping conditions first.

例子（教学例示）：教学例示（非来源原例）：高潜在收益但数据不可用的项目，应先验证准备条件。

Example (authored illustration): Teaching illustration (not a source case): For a project with high potential returns but unavailable data, first verify that readiness conditions can be met.

审校：官方支持影响、准备度与预设停止决策；可持续性未明确。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：2.1.1-unit-1；2.1.1-unit-1（问题、受益者与可观测结果）提供本单元实际使用的问题及结果定义。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：可持续性维度缺少直接定义与判据。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：可持续性维度缺少直接定义与判据。

## 2.1-lesson-4 · 什么时候不该用AI / When not to use AI

状态：supported

当明确规则或流程改进已能解决问题，或错误风险与收益不相称时，AI可能不是合适选择。先比较可行替代方案。

AI may be unsuitable when explicit rules or process improvements already solve the problem, or when the risk of errors is disproportionate to the benefits. Compare feasible alternatives first.

例子（教学例示）：教学例示（非来源原例）：资料命名混乱导致找不到文件，可以先改进归档与检索。

Example (authored illustration): Teaching illustration (not a source case): If inconsistent document names make files hard to find, first improve filing and search.

审校：NIST MAP 1.1及1.3明确比较非AI替代方案并在风险高于收益时不部署。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[NIST AI RMF Playbook: Map](https://airc.nist.gov/airmf-resources/playbook/map/)；摘录键 d2-nist（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.1-lesson-5 · 迁移与业务连续性 / Migration and business continuity

状态：needs-review

切换流程或平台要检查数据准备、性能、权限、成本以及回退路径，避免演示成功后直接替换关键流程。

When switching workflows or platforms, check data readiness, performance, permissions, costs, and rollback routes. Do not replace a critical workflow immediately after a successful demonstration.

例子（教学例示）：教学例示（非来源原例）：先小范围试用新客服系统，保留可用的人工处理方式。

Example (authored illustration): Teaching illustration (not a source case): Try the new customer support system on a small scale first, while retaining a workable manual handling process.

审校：AWS支持分阶段上线、功能及性能测试、回退；权限成本需补证。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Cutover stage](https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/cutover-stage.html)；摘录键 d2-cutover（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Pre-cutover stage](https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/pre-cutover-stage.html)；摘录键 d2-precutover（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：迁移权限与成本检查尚缺本条引用的直接支持。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：迁移权限与成本检查尚缺本条引用的直接支持。

## 2.1.1-unit-1 · 问题、受益者与可观测结果 / Problem, beneficiaries, and observable outcomes

状态：supported

用例要说明谁在什么流程遇到什么问题、现有基线是什么、预期改变如何测量，再选择合适能力。跨职能用例的成功标准会不同。

A use case should state who faces what problem in which workflow, the current baseline, and how the expected change will be measured, before choosing the appropriate capability. Success criteria differ across functions.

例子（教学例示）：教学例示（非来源原例）：客服看处理质量，销售看合格线索，研发看验证周期，开发看评审后交付质量。

Example (authored illustration): Teaching illustration (not a source case): Customer support assesses handling quality; sales assesses qualified leads; research assesses validation cycles; development assesses delivery quality after review.

易混边界：工具名称不是业务问题。

Boundary: A tool name is not a business problem.

审校：四决策逐项覆盖受益者、流程、基线、测量与业务结果。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.1.2-unit-1 · 自建、购买与合作的比较维度 / Criteria for comparing build, buy, and partner options

状态：needs-review

比较时间、预算、差异化需求、内部能力、集成、持续运营、供应商条款和退出成本。已有产品适配且交付期紧时，购买可能比自建更可行。

Compare time, budget, differentiation needs, internal capabilities, integration, ongoing operations, supplier terms, and exit costs. Buying may be more feasible than building when an existing product fits and delivery time is short.

例子（教学例示）：教学例示（非来源原例）：缺少运维团队且三个月要上线，先核对现成服务的能力与约束。

Example (authored illustration): Teaching illustration (not a source case): With no operations team and a three-month launch deadline, first check the capabilities and constraints of available services.

易混边界：购买服务不免除本企业的数据和用途责任。

Boundary: Buying a service does not remove your company's responsibility for its data and intended uses.

审校：微软支持时间、定制、内部能力和锁定风险，不能以此推定全部采购责任。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Analyze whether to build, buy, or extend AI components](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/4-analyze-whether-build-buy-extend-ai-components-business-solutions)；摘录键 d2-buy（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：采购仍负数据与用途责任、合作治理及退出成本需要额外直接来源。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：采购仍负数据与用途责任、合作治理及退出成本需要额外直接来源。

## 2.1.3-unit-1 · 价值、可行性与硬性约束 / Value, feasibility, and hard constraints

状态：needs-review

先识别必须满足的数据授权、安全和业务连续性条件，再比较价值、实施能力与战略契合度。高预期收益不能抵消尚未满足的硬约束。

First identify mandatory requirements for data authorization, security, and business continuity, then compare value, implementation capability, and strategic fit. High expected returns cannot offset unmet mandatory requirements.

例子（教学例示）：教学例示（非来源原例）：收益最高的项目没有合法可用资料，应先暂停补齐条件。

Example (authored illustration): Teaching illustration (not a source case): Pause the highest-return project if legally usable material is unavailable, and satisfy the conditions first.

易混边界：评分模型用于辅助讨论，权重与门槛应明确。

Boundary: Scoring models support discussion; weights and thresholds should be explicit.

审校：NIST支持风险门槛及不得部署的界限，但尚未覆盖本单元全部硬性条件。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：2.1.1-unit-1；2.1.1-unit-1（问题、受益者与可观测结果）提供本单元实际使用的问题及结果定义。

- 来源：[NIST AI RMF Playbook: Map](https://airc.nist.gov/airmf-resources/playbook/map/)；摘录键 d2-nist（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：数据授权、安全、连续性与评分权重的完整组合尚未逐项取证。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：数据授权、安全、连续性与评分权重的完整组合尚未逐项取证。

## 2.1.4-unit-1 · 不使用AI也是方案 / Not using AI is also an option

状态：supported

若明确规则、检索或流程改进已解决问题，应把它们纳入比较。也应停止不具备可验证收益、可用数据或可接受风险边界的AI方案。

Include explicit rules, search, and process improvements in the comparison if they already solve the problem. Also stop AI proposals that lack verifiable benefits, usable data, or acceptable risk boundaries.

例子（教学例示）：教学例示（非来源原例）：文件命名混乱先完善归档，而不是默认训练模型。

Example (authored illustration): Teaching illustration (not a source case): Improve document filing when names are inconsistent, instead of assuming that a model must be trained.

易混边界：暂停或终止是有效的项目决策。

Boundary: Pausing or terminating a project is a valid project decision.

审校：NIST支持替代方案与不实施高风险低价值方案；可用数据条件结合微软数据基础说明。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[NIST AI RMF Playbook: Map](https://airc.nist.gov/airmf-resources/playbook/map/)；摘录键 d2-nist（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AI adoption](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/strategy)；摘录键 d2-adoption（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.1.5-unit-1 · 切换、回退与业务连续性 / Cutover, rollback, and business continuity

状态：needs-review

迁移前验证新旧系统表现、接口、数据准备和成本，明确切换窗口、责任人、回退触发及恢复方式；迁移成功不能只看系统已启动。

Before migration, validate the performance of the old and new systems, interfaces, data readiness, and costs. Specify the cutover window, responsible owners, rollback triggers, and recovery method; a running system alone does not establish migration success.

例子（教学例示）：教学例示（非来源原例）：先在部分请求上验证新平台，异常时可回到原处理流程。

Example (authored illustration): Teaching illustration (not a source case): Validate the new platform on a subset of requests first, with a route back to the original process if anomalies occur.

易混边界：回退方案也需要演练与可用资源。

Boundary: Rollback plans also require rehearsals and available resources.

审校：AWS详细支持切换窗口、联系人、触发、数据恢复与演练，成本核验未覆盖。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Cutover stage](https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/cutover-stage.html)；摘录键 d2-cutover（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Pre-cutover stage](https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-migration-cutover/pre-cutover-stage.html)；摘录键 d2-precutover（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：成本验证未由本条迁移来源直接覆盖。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：成本验证未由本条迁移来源直接覆盖。

## 2.2-lesson-1 · 有形与无形收益 / Tangible and intangible benefits

状态：needs-review

KPI应对应业务目标。有形收益如实际节支或收入，无形收益如满意度；两者需要清楚的测量方式，不能随意互相折算。

KPIs should match business objectives. Tangible benefits include actual cost reductions or revenue; intangible benefits include satisfaction. Both need clear measurement methods and cannot be arbitrarily converted into each other.

例子（教学例示）：教学例示（非来源原例）：同时记录客服处理时间与答复质量，避免只优化生成速度。

Example (authored illustration): Teaching illustration (not a source case): Track customer support handling time together with response quality, rather than optimizing generation speed alone.

审校：微软提供定量定性收益及质量指标，货币换算限定需要独立支持。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：2.1.1-unit-1；2.1.1-unit-1（问题、受益者与可观测结果）提供本单元实际使用的问题及结果定义。

- 来源：[Evaluate ROI criteria for AI-powered solutions](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/2-roi-criteria-ai-powered-business-solution-including-total-cost-ownership)；摘录键 d2-roiCriteria（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：无形收益不得任意货币化的限定需补专门计量依据。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：无形收益不得任意货币化的限定需补专门计量依据。

## 2.2-lesson-2 · 业务基线 / Business baseline

状态：supported

实施前记录可比较的原流程表现，包括时间、成本和质量。上线后保持口径一致，才能合理讨论改善。

Before implementation, record comparable performance of the original process, including time, cost, and quality. Keep measurement definitions consistent after launch to discuss improvements meaningfully.

例子（教学例示）：教学例示（非来源原例）：原流程60分钟，AI生成10分钟且复核15分钟，净节省是35分钟。

Example (authored illustration): Teaching illustration (not a source case): If the original process takes 60 minutes and AI generation takes 10 minutes plus 15 minutes of review, the net saving is 35 minutes.

审校：微软Create ROI analysis第1节Frame the ROI scope的Baseline period、Baseline metrics及noAI baseline提示覆盖比较期间、任务量、时间与返工质量；第2节Map AI value列出时间、质量、产能三类测量。60-10-15=35为原创教学算式，包含人工复核，未宣称为外部实测。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.2-lesson-3 · 收益与ROI / Benefits and ROI

状态：supported

简单ROI为（同期间收益减成本）除以成本。完整成本应覆盖部署、调用、培训、维护和复核，避免重复计算同一份收益。

Simple ROI equals benefits minus costs for the same period, divided by costs. Full costs should include deployment, calls, training, maintenance, and review; avoid counting the same benefit twice.

例子（教学例示）：教学例示（非来源原例）：释放工时不自动等于现金节支，也不能同时无依据地再记作新增收入。

Example (authored illustration): Teaching illustration (not a source case): Released working time does not automatically become cash savings, nor can it also be counted as additional revenue without justification.

审校：微软ROI分析给出净收益/同期总成本；英国政府框架补充现金支出与重复计量边界。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：2.2.3-unit-2, 2.2.5-unit-1；2.2.3-unit-2（释放产能与现金节省）提供本单元实际使用的收益核算边界。2.2.5-unit-1（全生命周期成本）提供本单元实际使用的完整成本范围。

- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Evaluate ROI criteria for AI-powered solutions](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/2-roi-criteria-ai-powered-business-solution-including-total-cost-ownership)；摘录键 d2-roiCriteria（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[The Government Efficiency Framework](https://www.gov.uk/government/publications/the-government-efficiency-framework/the-government-efficiency-framework--2)；摘录键 d2-efficiency（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.2-lesson-4 · 先导性指标 / Leading indicators

状态：needs-review

先导指标用于较早观察成功条件，结果指标用于观察已实现的成果。先导信号有价值，但不构成最终成功保证。

Leading indicators provide early observations of conditions for success; outcome indicators measure results already achieved. Leading signals are useful but do not guarantee eventual success.

例子（教学例示）：教学例示（非来源原例）：合适的活跃使用与流程采用可作为信号，仍需观察实际质量和业务价值。

Example (authored illustration): Teaching illustration (not a source case): Appropriate active use and workflow adoption can be signals, but actual quality and business value still need to be observed.

审校：采用不等于业务结果已核验，但预测性先导指标定义未完整取证。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：来源区分采用与成果，但未直接定义先导/滞后指标的预测关系。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：来源区分采用与成果，但未直接定义先导/滞后指标的预测关系。

## 2.2-lesson-5 · 成本规划与优化 / Cost planning and optimization

状态：supported

明确初期和持续成本、用量假设与预算边界；观察实际调用和复核开销，在质量约束下优化方案。

Specify initial and ongoing costs, usage assumptions, and budget limits. Monitor actual call and review expenses, and optimize the solution subject to quality constraints.

例子（教学例示）：教学例示（非来源原例）：比较方案时把培训、集成、监测和人工复核一起计入。

Example (authored illustration): Teaching illustration (not a source case): Include training, integration, monitoring, and human review when comparing solutions.

审校：微软Evaluate ROI criteria的Total Cost of Ownership节逐项列出开发、部署、运营、培训和退役迁移；Create ROI analysis第5节Model TCO覆盖数据质量、人力与持续运营，第6节Sensitivity bands包含采用用量及质量/返工效果。人工复核作为人力与返工成本计入，单价下降不必然降低总成本是加总关系。例子为教学例示。

先修：2.2.5-unit-1；2.2.5-unit-1（全生命周期成本）提供本单元实际使用的完整成本范围。

- 来源：[Evaluate ROI criteria for AI-powered solutions](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/2-roi-criteria-ai-powered-business-solution-including-total-cost-ownership)；摘录键 d2-roiCriteria（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.2.1-unit-1 · 结果指标与活动指标 / Outcome and activity measures

状态：supported

活动指标记录做了多少，如开通账号；结果指标记录业务改变，如差错率、处理周期、转化率。效率必须与质量和复核代价一起看。

Activity measures record how much was done, such as accounts enabled; outcome measures record business changes, such as error rates, processing cycles, or conversion rates. Assess efficiency together with quality and review costs.

例子（教学例示）：教学例示（非来源原例）：账号增长但处理错误增加，不能仅凭采用率宣布成功。

Example (authored illustration): Teaching illustration (not a source case): If account numbers rise but processing errors increase, adoption alone cannot justify declaring success.

易混边界：单一速度指标容易掩盖质量损失。

Boundary: A single speed metric can hide quality losses.

审校：微软四决策区分采用与业务结果，ROI分析补充质量/返工和成本测量。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.2.1-unit-2 · 有形收益与无形收益 / Tangible and intangible benefits

状态：needs-review

有形收益可以形成可核验的金额或运营变化；满意度、信任等无形收益应设计独立测量，不能任意折算成已经实现的现金。

Tangible benefits can produce verifiable monetary or operational changes. Intangible benefits such as satisfaction and trust need separate measurement and cannot be arbitrarily converted into cash already realized.

例子（教学例示）：教学例示（非来源原例）：分别报告已兑现成本减少与客户满意度变化。

Example (authored illustration): Teaching illustration (not a source case): Report realized cost reductions separately from changes in customer satisfaction.

易混边界：无形收益不是无需证据的收益。

Boundary: Intangible benefits still require evidence.

审校：微软支持定量/定性指标，独立测量及任意折现限制需专门依据。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Evaluate ROI criteria for AI-powered solutions](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/2-roi-criteria-ai-powered-business-solution-including-total-cost-ownership)；摘录键 d2-roiCriteria（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：满意度、信任的独立计量与任意现金折算禁区尚缺专门依据。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：满意度、信任的独立计量与任意现金折算禁区尚缺专门依据。

## 2.2.2-unit-1 · 可比较基线与归因 / Comparable baselines and attribution

状态：supported

记录实施前同口径指标，并尽量控制任务难度、业务量和时间因素。对照组，或设有适当对照并处理时间趋势的分阶段试验，有助于区分AI效果与同期其他改变。

Record pre-implementation metrics using consistent definitions, and control task difficulty, business volume, and timing factors as far as possible. Control groups, or phased trials with appropriate controls and adjustment for time trends, help distinguish AI effects from other concurrent changes.

例子（教学例示）：教学例示（非来源原例）：相同类型工单比较总处理时间，包括人工复核。

Example (authored illustration): Teaching illustration (not a source case): Compare total handling time, including human review, for the same types of support tickets.

易混边界：上线前后数字不同，不自动证明因果关系。

Boundary: Different numbers before and after launch do not automatically prove causation.

审校：微软ROI分析第1节要求基线期间、任务量、时间和返工质量口径；微软研究组Learning causal effects from data明确相关不能替代因果推理；Hofmann等第2.1节（印刷第8页/PDF第11页）说明对照实验区分算法变化和外部事件；NIST 5.3.3.2说明控制时段等干扰因素。已将中英正文修订为分阶段试验须设适当对照并处理时间趋势；此处是上述实验设计原则的条件性应用，并未声称单纯分批上线可以归因，亦未承诺消除所有混杂。例子是同类工单的教学例示。

先修：2.2-lesson-2；2.2-lesson-2（业务基线）提供本单元实际使用的基线概念。

- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Microsoft Research: Causality and Machine Learning](https://www.microsoft.com/en-us/research/group/causal-inference/)；摘录键 d2-causal（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Hofmann, Li and Radlinski (2016): Online Evaluation for Information Retrieval](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/06/ftir-online-evaluation-final-journal.pdf)；摘录键 d2-controlled（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST/SEMATECH e-Handbook 5.3.3.2: Randomized block designs](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm)；摘录键 d2-blocking（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.2.3-unit-1 · ROI公式与核算边界 / ROI formula and accounting boundaries

状态：supported

简单ROI等于同期收益减同期完整成本，再除以同期完整成本。明确期间、单位、收益实现条件和成本范围，才能比较不同方案。

Simple ROI equals benefits for a period minus full costs for that period, divided by those full costs. Specify the period, units, conditions for realizing benefits, and cost scope before comparing solutions.

例子（教学例示）：教学例示（非来源原例）：收益150万元、完整成本100万元，ROI为50%。

Example (authored illustration): Teaching illustration (not a source case): Benefits of RMB 1.5 million and full costs of RMB 1 million yield an ROI of 50%.

易混边界：不能用净收益除以收益冒充ROI。

Boundary: Net benefit divided by benefits is not ROI.

审校：微软直接给出同期净收益/总成本公式；原例单位和150万/100万均保留，50%算术正确。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：2.2.5-unit-1；2.2.5-unit-1（全生命周期成本）提供本单元实际使用的完整成本范围。

- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Evaluate ROI criteria for AI-powered solutions](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/2-roi-criteria-ai-powered-business-solution-including-total-cost-ownership)；摘录键 d2-roiCriteria（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.2.3-unit-2 · 释放产能与现金节省 / Released capacity and cash savings

状态：needs-review

节省工时可释放产能，但只有支出实际减少才构成现金成本节省。若把产能用于新增产出，还需证明需求、人员安排和新增收入能够实现。

Time savings can release capacity, but cash cost savings occur only when spending actually falls. If that capacity is used for additional output, demonstrate that demand, staffing arrangements, and additional revenue can materialize.

例子（教学例示）：教学例示（非来源原例）：每周省十小时但工资未减少，先记为可用产能。

Example (authored illustration): Teaching illustration (not a source case): If ten hours are saved each week but salaries do not fall, initially record this as available capacity.

易混边界：同一批省时不能无依据地重复计入减员与新增收益。

Boundary: Do not count the same saved time as both staff reductions and additional benefits without justification.

审校：政府框架明确区分现金节省与产能提升，并要求证据和避免重复计量；属于政府核算指导，商业收入实现条件仍需专门材料。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[The Government Efficiency Framework](https://www.gov.uk/government/publications/the-government-efficiency-framework/the-government-efficiency-framework--2)；摘录键 d2-efficiency（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：政府核算来源未直接证明商业新增收入所需的需求及人员安排条件。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：政府核算来源未直接证明商业新增收入所需的需求及人员安排条件。

## 2.2.4-unit-1 · 先导信号与滞后结果 / Leading signals and lagging outcomes

状态：needs-review

培训完成、使用频率等可作为早期信号；留存、服务质量、净收益等结果需要后续观察。应说明预期联系，并检验先导指标能否预测结果。

Training completion and usage frequency can be early signals; outcomes such as retention, service quality, and net benefits need later observation. State the expected relationship and test whether the leading indicators predict the outcomes.

例子（教学例示）：教学例示（非来源原例）：培训后继续追踪独立核验正确率，而不只统计出勤。

Example (authored illustration): Teaching illustration (not a source case): After training, continue tracking independent verification accuracy instead of counting attendance alone.

易混边界：先导指标向好不等于收益已兑现。

Boundary: Improving leading indicators do not mean benefits have been realized.

审校：官方说明采用不能代表价值；预测效度验证与先导指标分类仍需证据。 英文按中文定义、例子与边界完整修订；摘录仅作来源定位，判断以浏览正文相应段落为准。

先修：2.2.1-unit-1；2.2.1-unit-1（结果指标与活动指标）提供本单元实际使用的活动与结果区分。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：先导指标对结果预测效度的验证方法尚缺直接来源。
- 所需材料：补充可逐字核验的一手资料及适用范围，具体覆盖：先导指标对结果预测效度的验证方法尚缺直接来源。

## 2.2.5-unit-1 · 全生命周期成本 / Lifecycle cost

状态：supported

预算包括数据整理、集成、部署、调用或计算、培训、人工复核、监测、维护和退出迁移。按业务量变化分析单位成本和总成本。

Include data preparation, integration, deployment, calls or compute, training, human review, monitoring, maintenance, and exit migration in the budget. Analyze unit and total costs as business volume changes.

例子（教学例示）：教学例示（非来源原例）：减少模型调用费却增加大量人工复核，可能没有降低完整成本。

Example (authored illustration): Teaching illustration (not a source case): Lower model-call fees accompanied by much more human review may not reduce full costs.

易混边界：单次调用价格不能代表系统总成本。

Boundary: The price of a single call does not represent total system cost.

审校：微软Evaluate ROI criteria的Total Cost of Ownership节逐项列出开发、部署、运营、培训和退役迁移；Create ROI analysis第5节Model TCO覆盖数据质量、人力与持续运营，第6节Sensitivity bands包含采用用量及质量/返工效果。人工复核作为人力与返工成本计入，单价下降不必然降低总成本是加总关系。例子为教学例示。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Evaluate ROI criteria for AI-powered solutions](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/2-roi-criteria-ai-powered-business-solution-including-total-cost-ownership)；摘录键 d2-roiCriteria（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Create ROI analysis for a proposed AI solution](https://learn.microsoft.com/en-us/training/modules/evaluate-costs-benefits-ai-powered-business-solution/3-create-roi-analysis-proposed-ai-solution-business-process)；摘录键 d2-roiAnalysis（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.3-lesson-1 · 竞争格局 / Competitive landscape

状态：supported

比较客户需求、竞争者能力和自己的独特条件，找到AI可改善的业务环节，而不是仅追随流行工具。

Compare customer needs, competitors' capabilities, and your own distinctive circumstances to find business activities AI could improve, rather than simply following popular tools.

例子（教学例示）：教学例示（非来源原例）：同样购买一个模型，并不意味着获得与竞争者不同的能力。

Example (authored illustration): Teaching illustration (not a source case): Buying the same model does not mean gaining capabilities that differ from competitors'.

审校：AWS文章开篇第2—6段将竞品、人员能力、独特条件和客户学习纳入创新；Sustainable Competitive Advantages节明确外购基础模型同样可被竞争者获得。Teece论文Business model design节从未满足需求出发；这些是战略建议，并非任一技术必然产生竞争收益的实证结论。 例子为教学例示，未冒充来源原例；中英全部限定保留。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Mark Schwartz: What Will Generative AI Mean for Your Business?](https://aws.amazon.com/blogs/enterprise-strategy/what-will-generative-ai-mean-for-your-business/)；摘录键 d2-awsAdvantage（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.3-lesson-2 · 业务模式转型 / Business model transformation

状态：supported

AI可能改变产品、服务、交付或价值获取方式。评估客户价值与运营要求，而不是只给原流程加一个聊天窗口。

AI may change products, services, delivery, or how value is captured. Evaluate customer value and operational requirements rather than merely adding a chat window to an existing workflow.

例子（教学例示）：教学例示（非来源原例）：将一次性报告服务改成持续辅助决策，需要新的数据维护和服务流程。

Example (authored illustration): Teaching illustration (not a source case): Turning a one-off reporting service into continuous decision support requires new data-maintenance and service processes.

审校：Teece论文Business models/Definition节定义价值创造、交付和收益成本结构，Business model implementation节要求补齐组织能力；AWS开篇指出不可混淆技术与商业模式，Operationalizing Generative AI节列出维护和运营要求。由此支持原单元的可能性表述及聊天窗口不足以完成模式转型的限定。 例子为教学例示，未冒充来源原例；中英全部限定保留。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Mark Schwartz: What Will Generative AI Mean for Your Business?](https://aws.amazon.com/blogs/enterprise-strategy/what-will-generative-ai-mean-for-your-business/)；摘录键 d2-awsAdvantage（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.3-lesson-3 · 可持续优势 / Sustainable advantage

状态：supported

可持续优势往往来自相关数据、流程、组织能力和反馈的组合。单一工具上线不保证长期优势。

Sustainable advantage often comes from a combination of relevant data, workflows, organizational capability, and feedback. Launching one tool does not guarantee a lasting advantage.

例子（教学例示）：教学例示（非来源原例）：把客户反馈持续转成流程改进，比只记录软件安装数更有意义。

Example (authored illustration): Teaching illustration (not a source case): Continuously turning customer feedback into process improvements is more meaningful than only counting software installations.

审校：AWS的Sustainable Competitive Advantages节列出独有数据与业务流程，开篇强调人员能力；Teece结论倒数第4段明确学习闭环与持续调整维持竞争优势。共同支持数据、流程、组织和反馈组合；原文中的“往往”“不保证”保留，不作必然成功承诺。 例子为教学例示，未冒充来源原例；中英全部限定保留。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Mark Schwartz: What Will Generative AI Mean for Your Business?](https://aws.amazon.com/blogs/enterprise-strategy/what-will-generative-ai-mean-for-your-business/)；摘录键 d2-awsAdvantage（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.3-lesson-4 · 投资与成熟度 / Investment and maturity

状态：supported

投资规模应结合行业变化、竞争压力、组织准备度及风险承受能力。需要验证条件与分阶段投入。

Investment size should reflect industry changes, competitive pressures, organizational readiness, and risk tolerance. Validate the necessary conditions and invest in stages.

例子（教学例示）：教学例示（非来源原例）：在数据基础不稳时，先投入治理与小范围验证，而非立即全企业扩展。

Example (authored illustration): Teaching illustration (not a source case): When the data foundation is unstable, first invest in governance and small-scale validation instead of immediately expanding across the enterprise.

审校：微软四决策第2—4节要求准备度、少数流程试点与测量后扩展；AWS Responsive Agility节涉及客户及竞争变化，Management of Innovation节支持低成本验证；Teece Business model design节要求在大规模承诺前测试；NIST MAP 1.5要求风险容忍门槛。组合支持按条件分阶段投资，并不推导固定投资金额。 例子为教学例示，未冒充来源原例；中英全部限定保留。

先修：2.1.3-unit-1；2.1.3-unit-1（价值、可行性与硬性约束）提供本单元实际使用的价值与硬约束判断。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Mark Schwartz: What Will Generative AI Mean for Your Business?](https://aws.amazon.com/blogs/enterprise-strategy/what-will-generative-ai-mean-for-your-business/)；摘录键 d2-awsAdvantage（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF Playbook: Map](https://airc.nist.gov/airmf-resources/playbook/map/)；摘录键 d2-nist（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.3.1-unit-1 · 客户问题与竞争位置 / Customer problems and competitive position

状态：needs-review

分析竞争变化如何影响客户期待、交付效率和价值链，再决定投资方向。相同工具在不同业务条件下可能产生不同价值。

Analyze how competitive changes affect customer expectations, delivery efficiency, and the value chain before choosing investment priorities. The same tool may create different value under different business conditions.

例子（教学例示）：教学例示（非来源原例）：同行推出智能客服，本企业先核对客户最常见的服务障碍。

Example (authored illustration): Teaching illustration (not a source case): When competitors launch intelligent customer support, first check your own customers' most common service obstacles.

易混边界：竞争对手的投入金额不是本企业的投资依据。

Boundary: A competitor's investment amount is not the basis for your company's investment.

审校：AWS Responsive Agility节支持客户需求和竞争能力变化；Teece Business model design节同时讨论竞争环境、客户需求与价值链选择，支持不同条件导致不同价值。仍未找到直接讨论以竞争对手投资金额作为本企业预算依据的材料；该边界合理但不将推论冒充来源原断言。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Mark Schwartz: What Will Generative AI Mean for Your Business?](https://aws.amazon.com/blogs/enterprise-strategy/what-will-generative-ai-mean-for-your-business/)；摘录键 d2-awsAdvantage（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：“竞争对手投入金额不是本企业投资依据”的预算边界缺少直接一手论证。
- 所需材料：补充投资决策原始材料，直接区分竞品支出信号与本企业收益、能力和预算依据。

## 2.3.2-unit-1 · 价值主张、交付与收益逻辑 / Value proposition, delivery, and revenue logic

状态：supported

业务模式变化涉及提供何种客户价值、如何交付以及如何获得收益。给现有产品贴AI标签不等于重构业务模式。

Business-model change concerns what customer value is offered, how it is delivered, and how revenue is earned. Adding an AI label to an existing product does not amount to redesigning its business model.

例子（教学例示）：教学例示（非来源原例）：按项目交付咨询转为持续监测服务，需要重新评估定价和运营责任。

Example (authored illustration): Teaching illustration (not a source case): Moving from project-based consulting to continuous monitoring requires reassessing pricing and operational responsibilities.

易混边界：新的技术能力必须连接具体付费或价值实现方式。

Boundary: New technical capabilities must connect to a specific payment or value-realization mechanism.

审校：Teece论文Business models/Definition节及Business model design节覆盖价值主张、定价收入与成本能力；Implementation节要求重配资源，结论要求业务模式各要素联动。AWS开篇直接警示将技术与商业模式混淆。按项目咨询改持续监测为原创示例，推演的是定价与运营责任需重新评估。 例子为教学例示，未冒充来源原例；中英全部限定保留。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Mark Schwartz: What Will Generative AI Mean for Your Business?](https://aws.amazon.com/blogs/enterprise-strategy/what-will-generative-ai-mean-for-your-business/)；摘录键 d2-awsAdvantage（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.3.3-unit-1 · 互补能力与学习闭环 / Complementary capabilities and learning loops

状态：supported

可持续优势常来自获授权的数据、嵌入流程、领域经验、客户关系和持续反馈的组合，而不是人人都能购买的同一基础模型。

Sustainable advantage often comes from a combination of authorized data, embedded workflows, domain expertise, customer relationships, and continuous feedback, rather than the same foundation model available for anyone to buy.

例子（教学例示）：教学例示（非来源原例）：积累经核验的维修反馈，并把它用于改进服务流程。

Example (authored illustration): Teaching illustration (not a source case): Accumulate verified maintenance feedback and use it to improve service processes.

易混边界：数据多不等于数据独有、可用或有权使用。

Boundary: Having more data does not mean it is exclusive, usable, or authorized for use.

审校：AWS战略文Sustainable Competitive Advantages节覆盖独有数据与独特流程，开篇覆盖人员技能；Teece论文Next-generation competition、Business model design及结论覆盖组织知识、客户需求/互动与学习闭环。AWS数据安全文Data privacy and compliance及Data security across the pipeline节分别要求用途分类与访问授权；因此数据数量本身不能证明独占、质量或使用权。该结论是这些条件的逻辑区分，不是声称来源证明数据越多必然更好。 例子为教学例示，未冒充来源原例；中英全部限定保留。

先修：无硬性先修；本单元可以独立理解，不因同章顺序或技能首条而强加先修；原清单未指定硬性先修。

- 来源：[Mark Schwartz: What Will Generative AI Mean for Your Business?](https://aws.amazon.com/blogs/enterprise-strategy/what-will-generative-ai-mean-for-your-business/)；摘录键 d2-awsAdvantage（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS: Security considerations for data in generative AI](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/security.html)；摘录键 d2-dataSecurity（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 2.3.4-unit-1 · 分阶段承诺与停止条件 / Staged commitments and stop conditions

状态：supported

结合行业条件和自身准备度，先验证关键假设，再逐步扩大投入。预先定义价值、质量、风险和成本不达标时的暂停或退出条件。

Consider industry conditions and your own readiness, test key assumptions first, then expand investment gradually. Define pause or exit conditions in advance for failures to meet value, quality, risk, or cost requirements.

例子（教学例示）：教学例示（非来源原例）：先验证获客质量，再决定是否扩展生成内容预算。

Example (authored illustration): Teaching illustration (not a source case): Validate customer-acquisition quality before deciding whether to expand the budget for generated content.

易混边界：试点投入已发生不是继续投入的充分理由。

Boundary: Pilot costs already incurred are not sufficient reason to continue investing.

审校：微软四决策Set the metrics节要求预先决定未达标时调整或停止；NIST MAP 1.5与3.2分别覆盖风险上限和全生命周期失败成本；Teece Business model design节支持先测试后扩大承诺。Green Book第6章Sunk costs明确已发生且不可改变成本不影响下一步选择，此处只采用一般沉没成本原则，不将英国公共部门核算规则当成企业法定义务。 例子为教学例示，未冒充来源原例；中英全部限定保留。

先修：2.1.3-unit-1, 2.2.3-unit-1；2.1.3-unit-1（价值、可行性与硬性约束）提供本单元实际使用的价值与硬约束判断。2.2.3-unit-1（ROI公式与核算边界）提供本单元实际使用的收益核算边界。

- 来源：[Build your AI strategy in four decisions](https://adoption.microsoft.com/en-us/copilot/build-your-ai-strategy/)；摘录键 d2-strategy（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF Playbook: Map](https://airc.nist.gov/airmf-resources/playbook/map/)；摘录键 d2-nist（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[Teece and Linden (2017): Business models, value capture, and the digital enterprise](https://link.springer.com/article/10.1186/s41469-017-0018-x)；摘录键 d2-teece2017（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[HM Treasury: The Green Book (2026)](https://www.gov.uk/government/publications/the-green-book--2/the-green-book-2026)；摘录键 d2-greenbook（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1-lesson-1 · 负责任的AI原则 / Responsible AI principles

状态：supported

公平性、可说明性、隐私、安全、透明度和稳健性需要进入实际决策与控制，而不仅是口号。不同任务需要相应评估。

Fairness, explainability, privacy, security, transparency, and robustness must inform actual decisions and controls rather than remain slogans. Each task needs an appropriate assessment.

例子（教学例示）：教学示例：除平均准确率外，也检查不同群体的错误和影响。

Example (authored illustration): Teaching example: Alongside average accuracy, examine errors and impacts across different groups.

审校：§3列出可信维度并要求按使用情境权衡；各维度进入控制而非口号是教学归纳。

先修：无硬性先修；本单元定义责任原则，无须先修具体模型算法。

- 来源：[NIST AI RMF 1.0 — AI Risks and Trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)；摘录键 d34-review-nist-trust（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1-lesson-2 · 目标冲突与取舍 / Competing objectives and trade-offs

状态：supported

效率、成本与责任要求可能冲突。把影响、约束和决策责任公开，选择与风险相称的措施并记录理由。

Efficiency, cost, and responsibility requirements may conflict. Make impacts, constraints, and decision accountability transparent, choose measures proportionate to risk, and document the reasons.

例子（教学例示）：教学示例：更快地自动发送高影响决定，不一定比保留人工复核更合适。

Example (authored illustration): Teaching example: Automatically sending high-impact decisions faster is not necessarily preferable to retaining human review.

审校：§3的tradeoffs段要求情境、透明与可论证理由，支持取舍而非单一效率优先。

先修：3.1.1-unit-1, 3.1.1-unit-3；先理解公平及隐私等不同责任维度，才能说明目标冲突。

- 来源：[NIST AI RMF 1.0 — AI Risks and Trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)；摘录键 d34-review-nist-trust（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1-lesson-3 · 从设计时纳入治理 / Governance by design

状态：supported

在项目规划和设计阶段确定数据用途、责任、验证与监督，避免上线后才补救关键问题。

Determine data uses, responsibilities, validation, and oversight during project planning and design to avoid addressing critical problems only after deployment.

例子（教学例示）：教学示例：选数据之前就讨论访问权限和允许用途。

Example (authored illustration): Teaching example: Discuss access permissions and permitted uses before choosing data.

审校：Responsible by design段明确在设计阶段解决问题，并覆盖运行期；支持前置治理。

先修：无硬性先修；规划阶段的责任分配可独立理解。

- 来源：[AWS Responsible AI Lens — Design principles](https://docs.aws.amazon.com/wellarchitected/latest/responsible-ai-lens/design-principles.html)；摘录键 d34-review-aws-design（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1-lesson-4 · 人工监督与升级 / Human oversight and escalation

状态：supported

明确何时人工检查、何时停止自动行动、何时上报，以及由谁接手。模型的自信措辞不能替代正式授权。

Specify when people review, when automated actions stop, when escalation occurs, and who takes over. Confident wording from a model cannot replace formal authorization.

例子（教学例示）：教学示例：出现缺乏来源的重要结论时，交给有责任的人员核验。

Example (authored illustration): Teaching example: When an important conclusion lacks sources, refer it to an accountable person for verification.

审校：Human in the loop段及MANAGE 2.4支持高风险人工接手与停用；自信不等于授权是该边界的教学应用。

先修：无硬性先修；人工决策权限与模型输出的区别可直接介绍。

- 来源：[AWS — Architecting the production feedback loops](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/prod-monitoring-feedback.html)；摘录键 d34-review-aws-feedback（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1.1-unit-1 · 公平性与分组表现 / Fairness and subgroup outcomes

状态：supported

公平性评估要结合具体用途和受影响群体，检查差错、机会和影响的差异。总体平均指标不能替代相关群体评估，目标之间也可能存在取舍。

Assess fairness in relation to the specific use and affected groups, examining differences in errors, opportunities, and impacts. Overall averages cannot replace assessments of relevant groups, and objectives may involve trade-offs.

例子（教学例示）：教学示例：总体错误率低，但某地区用户频繁受损，需要单独调查。

Example (authored illustration): Teaching example: Even with a low overall error rate, frequent harm to users in one region requires a separate investigation.

易混边界：不存在脱离用途、适用于一切情境的单一公平指标。

Boundary: There is no single fairness metric that applies to every context independently of its intended use.

审校：§3.7指出公平随文化与应用变化，§3.1讨论分组指标；总体平均不可替代分组是合理推论。

先修：无硬性先修；直接介绍评估维度，不要求技能首条作硬先修。

- 来源：[NIST AI RMF 1.0 — AI Risks and Trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)；摘录键 d34-review-nist-trust（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1.1-unit-2 · 可说明性与透明度 / Explainability and transparency

状态：supported

可说明性帮助理解系统行为或判断依据；透明度使相关人员了解AI参与、适用边界和重要限制，以便作出知情选择。

Explainability helps people understand system behavior or the basis for a judgment; transparency informs relevant people about AI involvement, the scope of appropriate use, and important limitations so they can make informed choices.

例子（教学例示）：教学示例：告知客户使用AI，并提供可理解的判断依据和申诉渠道。

Example (authored illustration): Teaching example: Tell customers that AI is being used and provide understandable reasons and a channel for appeal.

易混边界：展示技术术语不等于给出可用解释。

Boundary: Presenting technical terminology does not amount to a useful explanation.

审校：§3.4–3.5区分透明与解释并要求按用户知识调整说明；申诉场景为原创教学例。

先修：无硬性先修；两概念在本单元内定义完整。

- 来源：[NIST AI RMF 1.0 — AI Risks and Trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)；摘录键 d34-review-nist-trust（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1.1-unit-3 · 隐私、安全与稳健性 / Privacy, security and robustness

状态：supported

隐私关注个人资料的适当使用与保护；安全关注防止未授权访问或破坏；稳健性关注系统在合理变化和异常条件下仍能适当运行。

Privacy concerns the appropriate use and protection of personal information; security concerns preventing unauthorized access or damage; robustness concerns appropriate system operation under reasonable changes and abnormal conditions.

例子（教学例示）：教学示例：检查访问权限，限制敏感数据，并测试异常输入。

Example (authored illustration): Teaching example: Check access permissions, restrict sensitive data, and test abnormal inputs.

易混边界：这些维度相关但不能互相替代。

Boundary: These dimensions are related but cannot substitute for one another.

审校：§3.1、3.3、3.6分别支持稳健、安全和隐私；隐私定义在此为个人资料场景的简化。

先修：无硬性先修；三个维度在本单元并列定义，无强制前置依赖。

- 来源：[NIST AI RMF 1.0 — AI Risks and Trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)；摘录键 d34-review-nist-trust（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1.2-unit-1 · 收益、影响与比例原则 / Benefits, impacts and proportionate controls

状态：needs-review

讨论效率收益时同时说明受影响对象、损害可能性、严重程度和可逆性。选择与影响相称的控制，并记录取舍和决定责任。

When discussing efficiency gains, also identify affected parties and the likelihood, severity, and reversibility of harm. Choose controls proportionate to the impact, and record the trade-offs and responsibility for the decision.

例子（教学例示）：教学示例：高影响决定保留有效人工复核，而非只追求自动处理率。

Example (authored illustration): Teaching example: Retain effective human review for high-impact decisions rather than pursuing only the rate of automated processing.

易混边界：业务指标提高不能自动抵消对个人的严重损害。

Boundary: Improved business metrics do not automatically offset serious harm to individuals.

审校：MANAGE 1.2支持影响与可能性优先；MAP 5.1涉及严重度。可逆性与严重损害不得被收益抵消的规范性界限尚需更明确依据。

先修：3.1.1-unit-1；需要先区分群体影响与整体收益。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：缺少可逆性评估及不可接受严重损害的明确适用标准。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：缺少可逆性评估及不可接受严重损害的明确适用标准。

## 3.1.3-unit-1 · 从用途定义开始设置保障 / Safeguards from use-case definition

状态：supported

在选择数据、设计功能和定义验收标准时纳入责任要求，识别不允许的用途和需要人工介入的情形，再迭代验证。

Include responsibility requirements when selecting data, designing features, and defining acceptance criteria. Identify prohibited uses and situations requiring human intervention, then validate iteratively.

例子（教学例示）：教学示例：设计客服检索时就实施权限，而不是上线后只加免责声明。

Example (authored illustration): Teaching example: Implement permissions while designing customer-support retrieval rather than adding only a disclaimer after launch.

易混边界：设计时治理不意味着不允许小范围迭代。

Boundary: Governance by design does not prohibit limited-scope iteration.

审校：设计原则同时支持用例限定和迭代；journey的Envision Security明确检索权限，支持客服权限例的原则。

先修：无硬性先修；用途、限制和验收均由本单元直接说明。

- 来源：[AWS Responsible AI Lens — Design principles](https://docs.aws.amazon.com/wellarchitected/latest/responsible-ai-lens/design-principles.html)；摘录键 d34-review-aws-design（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.1.4-unit-1 · 复核能力与升级阈值 / Review capability and escalation triggers

状态：needs-review

监督者需要证据、时间、训练和停止或修改行动的权限。为无来源结论、异常指标和高影响操作定义升级条件与接手者。

Reviewers need evidence, time, training, and authority to stop or change actions. Define escalation conditions and handover owners for unsupported conclusions, anomalous metrics, and high-impact operations.

例子（教学例示）：教学示例：不能核验的重要结论转给负责人，不能只要求点击确认。

Example (authored illustration): Teaching example: Refer an important conclusion that cannot be verified to the responsible person; do not merely request a confirmation click.

易混边界：有人工按钮不代表已经形成有效监督。

Boundary: The presence of a human approval button does not establish effective oversight.

审校：GOVERN 2.2、3.2与MANAGE 2.4支持训练、监督职责、停用权限；已查来源未充分具体化时间、证据可用性和每类升级阈值。

先修：3.1-lesson-4；先理解人工介入、升级和接手的基本机制，再设计有效复核条件。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS — Architecting the production feedback loops](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/prod-monitoring-feedback.html)；摘录键 d34-review-aws-feedback（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需核实复核时间、证据可访问性和三类升级条件的操作依据。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需核实复核时间、证据可访问性和三类升级条件的操作依据。

## 3.2-lesson-1 · 跨职能治理与问责 / Cross-functional governance and accountability

状态：supported

业务、技术、数据、法务及合规等角色共同参与，并明确谁负责哪些决策。多人参与不代表责任可以模糊。

Business, technology, data, legal, and compliance roles participate together, with explicit responsibility for each decision. Involving many people does not justify ambiguous accountability.

例子（教学例示）：教学示例：明确谁批准用途、谁维护资料、谁处理异常。

Example (authored illustration): Teaching example: Specify who approves uses, maintains source material, and handles anomalies.

审校：GOVERN 2.1、2.3、3.1明确职责、领导问责与多学科决策，支持共同参与但责任清晰。

先修：无硬性先修；本单元直接介绍参与者和责任，不要求前置风险技术。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.2-lesson-2 · 合规风险识别 / Compliance risk identification

状态：supported

先确定业务用途、数据类型、适用地区与组织要求，再由相关责任人评估合规风险。通用清单不能代替具体判断。

First establish the business use, data types, applicable jurisdictions, and organizational requirements; then have the responsible people assess compliance risks. A generic checklist cannot replace a specific judgment.

例子（教学例示）：教学示例：新用途涉及个人资料时，应先进行适用要求与授权核对。

Example (authored illustration): Teaching example: Before a new use involving personal information, check applicable requirements and authorization.

审校：GOVERN 1.1与MAP 1.1支持情境化识别法律要求；本单元不对任何地区给出具体法律结论。

先修：无硬性先修；这是风险识别流程而非具体法规判断，可直接理解。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.2-lesson-3 · 访问控制与数据安全 / Access control and data security

状态：supported

只授予完成工作所需的访问与操作权限，并在资料和工具层执行控制。仅靠提示词不能可靠替代权限系统。

Grant only the access and action permissions needed for the work, and enforce controls at the data and tool layers. Prompts alone cannot reliably replace a permission system.

例子（教学例示）：教学示例：无权读取人事档案的员工，不应通过检索助手得到档案内容。

Example (authored illustration): Teaching example: An employee without permission to read personnel files must not obtain their contents through a retrieval assistant.

审校：Envision/Launch Security支持最小权限及检索前授权；提示词不是权限控制是由服务端授权要求得出的安全设计推论。

先修：无硬性先修；直接介绍必要权限和执行层控制。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.2-lesson-4 · AI风险分类 / AI risk classification

状态：supported

结合用途、受影响对象、潜在损害和控制条件分类风险，再安排评估与治理优先级；不要仅按模型大小分类。

Classify risks using the intended use, affected parties, potential harm, and controls, then prioritize assessment and governance; do not classify solely by model size.

例子（教学例示）：教学示例：内部草稿辅助与影响个人重要权益的自动决定，需要不同控制。

Example (authored illustration): Teaching example: An internal drafting aid and an automated decision affecting important individual rights require different controls.

审校：MAP 1.1、5.1与MANAGE 1.2按情境、影响和可能性分配风险资源；模型大小不是充分分类依据。

先修：无硬性先修；本单元给出分类输入，不需先修模型结构。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.2.1-unit-1 · 负责执行与最终问责 / Responsible versus accountable

状态：supported

执行者完成工作，最终问责者对决定和结果负责。业务、技术、数据和监督职能需要明确协作与授权边界，避免多人参与却无人作决定。

Those responsible for execution perform the work; those ultimately accountable own the decisions and outcomes. Business, technology, data, and oversight functions need clear collaboration and authority boundaries so that broad participation does not leave decisions unowned.

例子（教学例示）：教学示例：业务负责人批准用途，数据负责人维护资料，运维负责告警。

Example (authored illustration): Teaching example: Business owners approve uses, data owners maintain source material, and operations staff handle alerts.

易混边界：供应商负责模型服务，不等于替客户承担全部业务决定。

Boundary: A supplier's responsibility for a model service does not mean it assumes all of the customer's business decisions.

审校：GOVERN 2.1–2.3支持执行和问责分工；AWS政策保留用户决策责任，供应商边界须按合同具体化。

先修：无硬性先修；职责区别自身可作为治理基础。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Policy (updated January 13, 2025)](https://aws.amazon.com/ai/responsible-ai/policy/)；摘录键 d34-review-aws-policy（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.2.2-unit-1 · 用途、资料与适用要求 / Use, data and applicable requirements

状态：supported

合规识别需要知道系统用途、受影响人群、数据类别、使用地区及组织要求，再由有责任的专业人员核对适用条件。

Identifying compliance risks requires knowing the system's use, affected populations, data categories, jurisdictions of use, and organizational requirements. Accountable specialists then check the applicable conditions.

例子（教学例示）：教学示例：内部文稿辅助改为影响客户权益的自动决定，需要重新评估。

Example (authored illustration): Teaching example: Changing an internal drafting aid into automated decision-making affecting customer rights requires reassessment.

易混边界：通用清单不能替代针对具体用途的判断。

Boundary: A generic checklist cannot replace a judgment about the specific use.

审校：MAP 1.1情境法律、用户和用途，及持续MAP支持用途改变时重新评估；不据此宣称满足某项法规。

先修：3.2-lesson-2；先理解合规风险识别，再展开适用条件。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.2.3-unit-1 · 最小权限与检索前过滤 / Least privilege and pre-retrieval filtering

状态：supported

只授予工作所需的数据与工具权限，在检索或执行前验证身份和授权。输出后再遮盖，不能代替阻止越权检索。

Grant only the data and tool permissions needed for the work, and verify identity and authorization before retrieval or execution. Masking an output afterward cannot replace preventing unauthorized retrieval.

例子（教学例示）：教学示例：客服可读获准政策，不能读人事档案，也不能自行批准高额退款。

Example (authored illustration): Teaching example: Customer-support staff may read approved policies but may not read personnel files or independently approve large refunds.

易混边界：提示层拒绝不构成可靠权限边界。

Boundary: A refusal at the prompt layer does not constitute a reliable permission boundary.

审校：Bedrock Agents文档明确服务身份、知识库权限与action group Lambda资源策略须分别授权；安全文Model testing要求验证身份和授权。结合原数据旅程的检索权限，支持资料及工具执行前控制，而非仅依靠提示拒绝；退款额度是原创业务授权示例。

先修：3.2-lesson-3；先理解最小权限，再判断检索及操作两个权限边界。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS — Create a service role for Amazon Bedrock Agents](https://docs.aws.amazon.com/bedrock/latest/userguide/agents-permissions.html)；摘录键 d34-aws-agents-permissions（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Security Blog — Implementing least privilege access for Amazon Bedrock](https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/)；摘录键 d34-aws-bedrock-least-privilege（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.2.4-unit-1 · 按影响分配治理力度 / Allocating governance effort according to impact

状态：supported

以用途、受影响对象、潜在损害和控制情况确定评估优先级，生命周期中用途或环境改变时重新分级。模型规模不是唯一风险标准。

Prioritize assessments using intended use, affected parties, potential harm, and existing controls. Reclassify when uses or environments change during the lifecycle. Model size is not the only criterion for risk.

例子（教学例示）：教学示例：内部摘要与自动影响个人权益的决策需要不同审查力度。

Example (authored illustration): Teaching example: Internal summarization and automated decisions affecting individual rights require different levels of scrutiny.

易混边界：风险分级不是一次立项表格。

Boundary: Risk classification is not a one-time project initiation form.

审校：MAP持续更新及MANAGE 1.2支持动态分级与按影响分配资源；不是把NIST当作法律风险等级表。

先修：3.2-lesson-4；先理解分类所依据的用途和影响，再学习生命周期重评。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.3-lesson-1 · 生产监控与事件处理 / Production monitoring and incident handling

状态：supported

为运行质量、日志、异常处理、人工升级和回退设定机制。控制要在上线后持续发挥作用。

Establish mechanisms for operational quality, logging, anomaly handling, human escalation, and rollback. Controls must remain effective after deployment.

例子（教学例示）：教学示例：错误率突然升高时限制受影响用途，再调查原因。

Example (authored illustration): Teaching example: When the error rate suddenly rises, restrict the affected use and then investigate the cause.

审校：MEASURE 2.4与MANAGE 4.1–4.3明确生产监控、事件响应、恢复及变更；限制用途为教学策略。

先修：3.1-lesson-4；异常处置使用已定义的停用和人工接手机制。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.3-lesson-2 · 生命周期中的偏差 / Bias across the lifecycle

状态：needs-review

偏差可能来自采样、标注、训练目标和部署环境等阶段。持续观察分组表现及环境变化，不把一次检查当作永久结论。

Bias may arise during sampling, labeling, selection of training objectives, deployment, and other stages. Continuously observe subgroup performance and environmental changes rather than treating one check as a permanent conclusion.

例子（教学例示）：教学示例：整体分数稳定时，某一群体的错误仍可能增加。

Example (authored illustration): Teaching example: Errors for a particular group may increase even when the overall score remains stable.

审校：§3.7说明数据、算法、人类及系统性偏差；MEASURE 2.11、3.1支持持续评估，具体标注和目标机制未展开。

先修：无硬性先修；先介绍偏差来源，未要求掌握统计公式。

- 来源：[NIST AI RMF 1.0 — AI Risks and Trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)；摘录键 d34-review-nist-trust（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补标注不一致、优化目标及环境变化导致群体差异的直接机制资料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补标注不一致、优化目标及环境变化导致群体差异的直接机制资料。

## 3.3-lesson-3 · 有害内容与知识产权 / Harmful content and intellectual property

状态：supported

检查内容风险、资料使用授权和输出用途，设置适当审核与处置流程。不假定模型生成就天然无害或无权利限制。

Check content risks, authorization to use source material, and intended output uses, and establish appropriate review and response processes. Do not assume model-generated content is inherently harmless or free of rights restrictions.

例子（教学例示）：教学示例：公开发布生成内容前，根据用途检查来源与使用条件。

Example (authored illustration): Teaching example: Before publicly releasing generated content, check sources and usage conditions for the intended use.

审校：GOVERN 6.1区分第三方权利风险；AWS政策明确有害用途与输出评估，支持两类风险都需检查。

先修：无硬性先修；本单元讲检查范围，不作具体版权法律判断。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Policy (updated January 13, 2025)](https://aws.amazon.com/ai/responsible-ai/policy/)；摘录键 d34-review-aws-policy（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.3-lesson-4 · 幻觉与可靠性 / Hallucination and reliability

状态：supported

幻觉可能表现为看似可信但无依据的内容。结合来源核验、数据质量检查、监测和必要人工复核来管理风险。

Hallucinations may appear as plausible but unsupported content. Manage the risk through source verification, data-quality checks, monitoring, and human review where needed.

例子（教学例示）：教学示例：带引用的回答仍需核对引用是否真正支持结论。

Example (authored illustration): Teaching example: Even an answer with citations requires checking whether the cited material actually supports its conclusions.

审校：Groundedness定义及best practices支持核对来源和版本，AWS输出概率性说明支持仍需复核。

先修：无硬性先修；幻觉和来源核验在本单元内直接定义。

- 来源：[Microsoft Learn — Groundedness detection](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/groundedness)；摘录键 d34-review-ms-ground（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Policy (updated January 13, 2025)](https://aws.amazon.com/ai/responsible-ai/policy/)；摘录键 d34-review-aws-policy（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.3.1-unit-1 · 检测、限制、调查与恢复 / Detection, containment, investigation and recovery

状态：supported

为追踪问题，按必要性记录模型版本、告警和事件标识；确需记录输入输出时先最小化并脱敏，限制访问并按用途设置留存期限，避免把敏感原文写入日志。出现异常时先控制影响，再调查、修复和验证，满足恢复条件后再扩大使用。

For traceability, record model versions, alerts, and event identifiers as needed. When recording inputs or outputs is necessary, minimize and redact them first, restrict access, and set retention periods according to purpose; avoid writing sensitive source content into logs. When an anomaly occurs, first contain its impact, then investigate, repair, and validate; expand use again only after recovery conditions are met.

例子（教学例示）：教学示例：投诉激增时暂停自动发送，保留辅助起草并安排人工审核。

Example (authored illustration): Teaching example: When complaints surge, pause automated sending, retain drafting assistance, and arrange human review.

易混边界：事故演练顺序服务于具体条件，不是所有组织的唯一流程。

Boundary: The sequence of an incident exercise serves its specific conditions and is not the only process for every organization.

易混边界：可追踪不等于无条件保存原始输入输出；日志本身也需要隐私与访问控制。

Boundary: Traceability does not mean unconditionally storing raw inputs and outputs; logs themselves require privacy and access controls.

审校：已修正无条件记录输入输出的隐私缺陷。AWS Model testing与Logging sensitive information明确敏感资料保护、脱敏及最小访问；AGENTOPS05-BP03要求写入前脱敏和按目的留存；NIST MANAGE 4及AWS恢复测试支持控制影响、验证后恢复。具体顺序依组织情境，例子为教学应用。

先修：3.3-lesson-1；先掌握运行监控与事件处理，再细化恢复程序。

- 来源：[AWS — Architecting the production feedback loops](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/prod-monitoring-feedback.html)；摘录键 d34-review-aws-feedback（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Security Blog — Implementing least privilege access for Amazon Bedrock](https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/)；摘录键 d34-aws-bedrock-least-privilege（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS AGENTOPS05-BP03 — Implement structured logging and comprehensive audit trails](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops05-bp03.html)；摘录键 d34-aws-log-policy（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Reliability — Failure management](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-failmgmt.html)；摘录键 d34-aws-failure-management（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.3.2-unit-1 · 采样、标注、目标与部署 / Sampling, labels, objectives and deployment

状态：needs-review

偏差可能源自缺乏代表性的样本、不一致标注、优化目标和部署人群差异。对相关群体持续监测，并调查差异的原因。

Bias may arise from unrepresentative samples, inconsistent labels, optimization objectives, and differences in deployed populations. Continuously monitor relevant groups and investigate the causes of disparities.

例子（教学例示）：教学示例：新地区加入后，检查当地表达方式是否被原数据覆盖。

Example (authored illustration): Teaching example: After adding a new region, check whether the original data covers local ways of expressing things.

易混边界：仅扩大样本量不保证消除偏差。

Boundary: Simply increasing sample size does not guarantee that bias is eliminated.

审校：§3.7支持样本、算法和系统性偏差，以及样本量并非充分条件；不一致标签、目标和新地区的细节需直接证据。

先修：3.1.1-unit-1；判断偏差前需理解按相关群体检查影响。

- 来源：[NIST AI RMF 1.0 — AI Risks and Trustworthiness](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/)；摘录键 d34-review-nist-trust（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补标注、优化目标、部署分布差异的具体实例或方法资料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补标注、优化目标、部署分布差异的具体实例或方法资料。

## 3.3.3-unit-1 · 来源授权、输出用途与有害内容 / Source rights, output uses and harmful content

状态：supported

核对输入资料允许的使用方式，并根据输出用途设置内容审核、投诉和处置流程。来源有授权不等于输出一定安全，过滤有害内容也不能证明已获版权许可。

Check which uses of input material are permitted, and set up content review, complaint, and response processes appropriate to the output's intended use. Authorization to use a source does not guarantee safe output, and filtering harmful content does not establish copyright permission.

例子（教学例示）：教学示例：公开发布前同时检查素材使用条件和输出风险。

Example (authored illustration): Teaching example: Before public release, check both the conditions for using source material and the risks of the output.

易混边界：模型生成不自动意味着无权利限制。

Boundary: Model generation does not automatically make content free of rights restrictions.

审校：GOVERN 6.1支持权利检查，政策支持内容风险评估；两类控制不能互相证明是独立要求的教学推论。

先修：无硬性先修；输入许可与输出审核可在本单元并列理解。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Policy (updated January 13, 2025)](https://aws.amazon.com/ai/responsible-ai/policy/)；摘录键 d34-review-aws-policy（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 3.3.4-unit-1 · 证据支持与不确定性 / Evidence support and uncertainty

状态：supported

幻觉是看似可信却错误或无依据的内容。核对资料相关性、引用支持和版本，对重要未知保留不确定性并升级复核。

Hallucinations are plausible but incorrect or unsupported content. Check the relevance, citation support, and version of source material; preserve uncertainty about important unknowns and escalate for review.

例子（教学例示）：教学示例：回答引用存在，但引用没有包含声称的退款期限。

Example (authored illustration): Teaching example: A cited source exists, but it does not state the refund deadline claimed in the answer.

易混边界：检索、引用或人工复核都不是零错误保证。

Boundary: Retrieval, citations, and human review do not guarantee zero errors.

审校：Groundedness和best practices支持逐项核对来源与版本；政策说明输出可能不准确，未把检索或复核当无错保证。

先修：3.3-lesson-4；先理解幻觉，再分析引用存在但不支持结论的情况。

- 来源：[Microsoft Learn — Groundedness detection](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/groundedness)；摘录键 d34-review-ms-ground（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Policy (updated January 13, 2025)](https://aws.amazon.com/ai/responsible-ai/policy/)；摘录键 d34-review-aws-policy（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1-lesson-1 · 组织准备度 / Organizational readiness

状态：supported

评估领导共识、数据、文化、基础设施与治理等维度；不能只检查是否买到了模型。

Assess leadership alignment, data, culture, infrastructure, governance, and other relevant dimensions; do not check only whether a model has been purchased.

例子（教学例示）：教学示例：演示效果好，但没有数据负责人和运营人员，仍不足以规模部署。

Example (authored illustration): Teaching example: A good demonstration still does not establish readiness for scaled deployment if no one owns the data or operations.

审校：journey六支柱及Envision阶段包含业务、人员、治理、平台、安全和运营，支持多维准备评估。

先修：无硬性先修；准备度作为组织概念可独立介绍。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1-lesson-2 · AI成熟度 / AI maturity

状态：supported

成熟度描述从探索、实验到可持续运营等能力状态。它用于识别下一步发展方向，不只是给组织打一个漂亮分数。

Maturity describes capability states ranging from exploration and experimentation to sustainable operations. It identifies the next direction for development rather than merely giving the organization an attractive score.

例子（教学例示）：教学示例：能运行一次试点与能持续监测和维护多个应用，是不同能力。

Example (authored illustration): Teaching example: Running one pilot and continuously monitoring and maintaining multiple applications require different capabilities.

审校：journey明确四阶段成熟模型及各阶段能力；用阶段定位下一步是教学归纳，不把得分当认证。

先修：无硬性先修；成熟度在本单元内直接定义。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1-lesson-3 · 能力差距 / Capability gaps

状态：supported

从人员、流程、技术和治理找出具体缺口，区分缺少技能、缺少权限和缺少合适流程等问题。

Identify specific gaps in people, processes, technology, and governance, distinguishing missing skills, permissions, and suitable processes.

例子（教学例示）：教学示例：员工不会核验答案，不能只通过更换模型来解决。

Example (authored illustration): Teaching example: Employees' inability to verify answers cannot be solved merely by replacing the model.

审校：CAF Workforce transformation识别角色技能缺口；journey跨支柱要求支持不把所有缺口归因模型。

先修：无硬性先修；人员、流程、技术、治理是诊断分类，可直接学习。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1-lesson-4 · 发展路线与投入顺序 / Roadmaps and investment sequencing

状态：supported

把能力建设与战略目标连接，依据当前准备程度安排可验证的阶段目标和投入。

Connect capability development to strategic goals, and sequence verifiable milestones and investment according to current readiness.

例子（教学例示）：教学示例：先建立数据责任和验证机制，再扩大相关业务用途。

Example (authored illustration): Teaching example: Establish data accountability and validation mechanisms before expanding the related business uses.

审校：Envision Business对齐战略；CAF Change acceleration要求准备度、依赖和路线图，支持按能力建设安排投入。

先修：4.1-lesson-1；投入顺序依赖准备度诊断，故先了解准备度维度。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1.1-unit-1 · 领导、数据、文化、技术与治理 / Leadership, data, culture, technology and governance

状态：supported

准备度是能否开展并维持特定用途的条件。分别检查领导共识、数据可用性、文化与技能、基础设施和治理，记录证据而非只填写自评分。

Readiness consists of the conditions needed to begin and sustain a particular use. Separately examine leadership alignment, data availability, culture and skills, infrastructure, and governance; record evidence rather than just self-assessment scores.

例子（教学例示）：教学示例：有预算和演示，但没有资料负责人，数据准备仍有缺口。

Example (authored illustration): Teaching example: A budget and a demonstration do not close a data-readiness gap when nobody owns the source material.

易混边界：准备度会随用途改变，不能只给全企业一个分数。

Boundary: Readiness varies by use case and cannot be represented only by one enterprise-wide score.

审校：Envision与Experiment按具体用例检查数据、资源和治理；记录证据、不以企业总分替代是教学推论。

先修：无硬性先修；直接介绍准备条件，不强制先修内容相近的概览。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1.2-unit-1 · 探索、实验与可持续运营 / Exploration, experiments and sustainable operations

状态：supported

成熟度关注能力是否可重复、可治理并能持续运营。一次试点成功与多团队稳定使用不同；具体阶段模型应说明定义和证据要求。

Maturity concerns whether capabilities are repeatable, governable, and sustainably operational. One successful pilot differs from stable use across teams; a particular stage model should state its definitions and evidence requirements.

例子（教学例示）：教学示例：多个演示都依靠同一人手动修复，不代表已具备规模化能力。

Example (authored illustration): Teaching example: Several demonstrations relying on one person's manual repairs do not establish the capability to scale.

易混边界：成熟度模型是诊断工具，不是准确率认证。

Boundary: A maturity model is a diagnostic tool, not a certification of accuracy.

审校：阶段模型区分Experiment、Launch、Scale的不同运营能力；可持续能力不是准确率认证。

先修：4.1-lesson-2；先认识成熟度用途，再评估阶段与证据定义。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1.3-unit-1 · 区分技能、流程、技术与权限缺口 / Distinguishing gaps in skills, processes, technology, and permissions

状态：supported

推广受阻可能因为不会操作、流程未改、系统不可用或没有授权。先确定具体阻碍，再安排对应干预，避免所有问题都用采购或培训解决。

Adoption may be blocked by a lack of operating skills, unchanged processes, unavailable systems, or missing authorization. Identify the specific obstacle before choosing an intervention, rather than treating every problem with procurement or training.

例子（教学例示）：教学示例：员工知道如何核验，但无权查看原文，应解决访问与流程问题。

Example (authored illustration): Teaching example: Employees know how to verify answers but lack access to the originals; address access and process issues.

易混边界：相同的低采用率可能有不同原因。

Boundary: The same low adoption rate may have different causes.

审校：CAF组织设计与Change acceleration要求识别障碍，journey单独规定权限与培训；低采用率的多原因诊断为应用推论。

先修：无硬性先修；诊断分类由本单元提供，无必要硬先修。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.1.4-unit-1 · 依赖关系与阶段成果 / Dependencies and staged outcomes

状态：supported

把战略目标拆成可核验的阶段成果，识别前置依赖和责任人，优先补齐阻碍价值实现的关键条件，再验证下一步投入。

Break strategic goals into verifiable milestones, identify prerequisite dependencies and owners, prioritize the critical conditions blocking value, and then validate the next investment.

例子（教学例示）：教学示例：先统一资料责任和质量标准，再扩大使用团队。

Example (authored illustration): Teaching example: Establish consistent ownership of source material and quality standards before expanding to more teams.

易混边界：不能按“容易展示”替代战略与依赖分析。

Boundary: Ease of demonstration cannot replace analysis of strategy and dependencies.

审校：CAF要求战略、依赖、路线图；journey以用例和数据验证支持阶段投入，容易展示不等于战略价值。

先修：4.1.1-unit-1, 4.1.3-unit-1；路线安排需先知道当前条件及具体缺口，再判定依赖和优先级。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.2-lesson-1 · 数据准备与孤岛 / Data readiness and silos

状态：supported

检查资料质量、可访问性和共享障碍。分散资料是否能适当地用于当前用途，比单纯的数据总量更重要。

Examine data quality, accessibility, and barriers to sharing. Whether distributed material can appropriately serve the current use matters more than total data volume alone.

例子（教学例示）：教学示例：多个部门各有不同版本的客户字段，需要先统一口径与权限。

Example (authored illustration): Teaching example: Departments use different versions of customer fields; first align their meanings and permissions.

审校：Envision数据盘点、Experiment数据可用与集成支持用途相关的数据准备；字段统一场景为原创示例。

先修：无硬性先修；质量与共享障碍是入门概念。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.2-lesson-2 · 数据策略与所有权 / Data strategy and ownership

状态：supported

明确数据用途、责任人、质量维护和共享规则。数据能够共享不等于应对所有人开放。

Specify data uses, owners, quality maintenance, and sharing rules. The ability to share data does not mean it should be open to everyone.

例子（教学例示）：教学示例：为制度资料指定更新责任人，并保留版本和使用范围。

Example (authored illustration): Teaching example: Assign an owner to update policy material and retain versions and the permitted scope of use.

审校：Launch包含血缘与来源、权限及持续数据治理，支持共享保留权限；指定维护人是教学治理设计。

先修：无硬性先修；先介绍数据责任与共享边界，无其他硬先修。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.2-lesson-3 · 基础设施要求 / Infrastructure requirements

状态：supported

按工作负载评估计算、存储、网络、集成、监测和安全需求，并考虑运维与成本；不只比较硬件性能。

Assess compute, storage, networking, integration, monitoring, and security needs for the workload, including operations and cost; do not compare hardware performance alone.

例子（教学例示）：教学示例：交互式客服系统还要考虑延迟、可用性和失败时的处理方式。

Example (authored illustration): Teaching example: An interactive customer-support system also needs consideration of latency, availability, and failure handling.

审校：Selection明确按工作负载与成本选择计算、存储、数据库和网络；PERF05-BP04以响应时间、吞吐、整体验证和监测评估集成效果；Reliability覆盖可用性及恢复。结合原GenAI治理资料支持跨性能、安全与运营的要求，客服例为教学应用。

先修：无硬性先修；基础设施评估概览可直接理解。

- 来源：[AWS — Generative AI Lifecycle Operational Excellence framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/introduction.html)；摘录键 d34-review-aws-gloe（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Well-Architected Framework (2023-04-10) — Selection](https://docs.aws.amazon.com/wellarchitected/2023-04-10/framework/perf-sel.html)；摘录键 d34-aws-architecture-selection（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS PERF05-BP04 — Load test your workload](https://docs.aws.amazon.com/wellarchitected/latest/framework/perf_process_culture_load_test.html)；摘录键 d34-aws-load-test（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Reliability — Failure management](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-failmgmt.html)；摘录键 d34-aws-failure-management（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.2.1-unit-1 · 质量维度与数据契约 / Quality dimensions and data contracts

状态：needs-review

针对用途检查准确、完整、一致、及时和相关性，约定字段意义、主键、格式及缺失值处理。数据孤岛还会带来重复和不同口径。

Check accuracy, completeness, consistency, timeliness, and relevance for the use case, and agree on field meanings, primary keys, formats, and handling of missing values. Data silos can also create duplication and inconsistent definitions.

例子（教学例示）：教学示例：同一客户有两条订单副本，先查主键与来源而不是直接相加。

Example (authored illustration): Teaching example: If the same customer has two copies of an order, inspect the primary keys and sources before adding the amounts together.

易混边界：格式统一不等于数值真实，清洗需要保留依据。

Boundary: Consistent formatting does not establish that values are true; preserve the basis for data-cleaning decisions.

审校：数据指南支持数据质量和集成，但不足以证实此处五维质量定义和主键、缺失值及清洗审计细节。

先修：4.2-lesson-1；先理解数据质量与孤岛问题，再进入字段契约。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补五维质量定义、主键去重、缺失值处理及清洗依据保留的一手资料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补五维质量定义、主键去重、缺失值处理及清洗依据保留的一手资料。

## 4.2.2-unit-1 · 所有者、血缘与版本 / Owners, lineage and versions

状态：needs-review

资料需要明确维护责任、来源去向、版本和共享边界，以便核验答案、修复错误并追踪变化。共享应保留权限而不是复制后全面公开。

Source material needs clear maintenance ownership, lineage, versions, and sharing boundaries so that answers can be checked, errors fixed, and changes traced. Sharing should preserve permissions rather than make copied material public to everyone.

例子（教学例示）：教学示例：制度更新后能查到负责部门、有效日期与旧版去向。

Example (authored illustration): Teaching example: After a policy update, the responsible department, effective date, and disposition of the old version remain traceable.

易混边界：能访问数据不等于可以任意再利用。

Boundary: Being able to access data does not grant unrestricted permission to reuse it.

审校：Launch Operations明确血缘、来源与质量，Security保留权限；版本处置、维护责任与再利用许可细节尚需材料。

先修：4.2-lesson-2；先理解用途、所有权和共享规则，再学习版本与血缘。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补资料版本、维护责任、旧版处置及授权用途限制的具体治理资料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补资料版本、维护责任、旧版处置及授权用途限制的具体治理资料。

## 4.2.3-unit-1 · 延迟、容量、可用性与运营 / Latency, capacity, availability and operations

状态：supported

基础设施需服务实际工作负载，包括并发、数据存储、网络、模型调用、监测和故障恢复；评估成本、可扩展性与支持责任。

Infrastructure must serve the actual workload, including concurrency, data storage, networking, model calls, monitoring, and failure recovery. Assess cost, scalability, and support responsibilities.

例子（教学例示）：教学示例：客服系统除了生成质量，还要验证高峰响应和服务故障时的接手方式。

Example (authored illustration): Teaching example: Beyond generation quality, a customer-support system needs validation of peak-time responses and handover when the service fails.

易混边界：购买更大算力不能替代数据与运营准备。

Boundary: Buying more compute cannot replace data and operational readiness.

审校：架构选择支持计算、存储、网络和成本；负载测试要求生产相似环境、用户规模和指标；Failure management要求恢复目标与演练；runbook定义负责人、工具、权限和升级。结合journey数据准备，支持算力不能替代数据及运营条件的边界。

先修：4.2-lesson-3；先理解基础设施评估范围，再展开容量和恢复。

- 来源：[AWS — Generative AI Lifecycle Operational Excellence framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/introduction.html)；摘录键 d34-review-aws-gloe（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Well-Architected Framework (2023-04-10) — Selection](https://docs.aws.amazon.com/wellarchitected/2023-04-10/framework/perf-sel.html)；摘录键 d34-aws-architecture-selection（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS PERF05-BP04 — Load test your workload](https://docs.aws.amazon.com/wellarchitected/latest/framework/perf_process_culture_load_test.html)；摘录键 d34-aws-load-test（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Reliability — Failure management](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-failmgmt.html)；摘录键 d34-aws-failure-management（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS OPS07-BP03 — Use runbooks to perform procedures](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_ready_to_support_use_runbooks.html)；摘录键 d34-aws-runbooks（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.3-lesson-1 · 高管支持与AI倡导者 / Executive support and AI champions

状态：supported

领导层统一目标、提供资源并明确责任；倡导者推动沟通与实践，而不是替代正式治理。

Leaders align goals, provide resources, and clarify accountability; champions promote communication and practical use without replacing formal governance.

例子（教学例示）：教学示例：由业务负责人解释试点目标，并支持员工反馈问题。

Example (authored illustration): Teaching example: A business owner explains the pilot's goals and supports employees in reporting problems.

审校：Transformational leadership强调赞助、资源和问责；Change acceleration含联盟与沟通，支持倡导不替代治理。

先修：无硬性先修；领导与倡导职责可直接介绍。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.3-lesson-2 · 跨职能团队 / Cross-functional teams

状态：supported

把业务、技术、法律与合规等能力放进协作机制，明确交付、评估和异常处理的责任。

Bring business, technical, legal, compliance, and other relevant capabilities into a collaboration mechanism with clear responsibility for delivery, evaluation, and anomaly handling.

例子（教学例示）：教学示例：试点负责人应知道谁可以决定暂停高风险功能。

Example (authored illustration): Teaching example: The pilot owner should know who can decide to pause a high-risk feature.

审校：GOVERN 2与3支持清晰职责及多学科团队；暂停示例对应MANAGE 2.4。

先修：无硬性先修；无需以另一个概览强制先修团队协作。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.3-lesson-3 · 透明沟通 / Transparent communication

状态：needs-review

说明实施时间、预期结果、岗位影响和支持安排；承认不确定性，提供双向反馈渠道。

Explain implementation timing, expected outcomes, effects on roles, and support arrangements; acknowledge uncertainty and provide two-way feedback channels.

例子（教学例示）：教学示例：员工担心岗位变化时，不能只发布“必须使用”的通知。

Example (authored illustration): Teaching example: When employees worry about role changes, simply issuing a mandatory-use notice is inadequate.

审校：Change acceleration覆盖人员影响、沟通、培训和反馈；对尚未验证结果的诚实表述合理，但本页未明确其边界。

先修：无硬性先修；沟通安排独立可理解。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补AI变更沟通中不确定结果、岗位影响及双向反馈的直接指导。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补AI变更沟通中不确定结果、岗位影响及双向反馈的直接指导。

## 4.3-lesson-4 · 文化障碍 / Cultural barriers

状态：needs-review

区分风险规避、抵触改变和害怕失败等原因，用反馈、安全试验和合适支持来回应。

Distinguish risk aversion, resistance to change, fear of failure, and other causes, and respond with feedback, safe experimentation, and suitable support.

例子（教学例示）：教学示例：低使用率可能是信任与任务适配问题，而不只是安装不足。

Example (authored illustration): Teaching example: Low usage may reflect trust or task-fit problems rather than merely too few installations.

审校：CAF支持识别阻碍、试验与反馈，但未直接给出风险规避/抵触/害怕失败的原因分类。

先修：无硬性先修；行为原因在本单元内介绍，不添加虚假依赖。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补区分文化阻碍、合理风险顾虑和工具适配问题的诊断材料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补区分文化阻碍、合理风险顾虑和工具适配问题的诊断材料。

## 4.3-lesson-5 · 员工培养 / Workforce development

状态：needs-review

围绕岗位任务、实际风险和人机协作设计练习，可结合POC、培训或黑客马拉松；签到不代表形成能力。

Design practice around job tasks, actual risks, and human-AI collaboration, potentially using proofs of concept, training, or hackathons; attendance does not establish capability.

例子（教学例示）：教学示例：让客服练习核对引用、纠正草稿并识别需要上报的情况。

Example (authored illustration): Teaching example: Have customer-support staff practice checking citations, correcting drafts, and identifying situations requiring escalation.

审校：Cloud fluency支持针对性、体验式学习及能力验证；AI核验、POC和黑客马拉松的具体练习目标未被直接覆盖。

先修：无硬性先修；岗位培养方法可先独立介绍。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补AI岗位任务训练与基于表现的能力考核资料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补AI岗位任务训练与基于表现的能力考核资料。

## 4.3-lesson-6 · 角色转变与人的优势 / Changing roles and human strengths

状态：needs-review

重新设计人工操作、人工监督和AI协作的分工，保留批判性思考、同理心与创造力的作用。

Redesign the division of manual work, human oversight, and AI collaboration while retaining the roles of critical thinking, empathy, and creativity.

例子（教学例示）：教学示例：AI起草沟通内容，人类判断对方处境并承担发送责任。

Example (authored illustration): Teaching example: AI drafts a message; a person judges the recipient's situation and takes responsibility for sending it.

审校：GOVERN 3.2支持人机分工，CAF支持角色现代化；同理心和创造力的具体分工论断尚缺直接材料。

先修：3.1-lesson-4；岗位变化中的人工监督必须先明确人如何接手和授权。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补人机任务重设计及批判性思考、同理心、创造性职责的直接资料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补人机任务重设计及批判性思考、同理心、创造性职责的直接资料。

## 4.3.1-unit-1 · 赞助者与业务倡导者 / Sponsors and business champions

状态：supported

高层赞助者提供方向、资源和跨部门协调；业务倡导者帮助发现实际需求、示范使用和反馈。两者都需要明确权责，不能只有口号。

Executive sponsors provide direction, resources, and cross-department coordination; business champions help identify practical needs, demonstrate use, and gather feedback. Both need clear authority and responsibilities rather than slogans alone.

例子（教学例示）：教学示例：业务赞助者解决部门间资源冲突，倡导者组织岗位试用。

Example (authored illustration): Teaching example: A business sponsor resolves resource conflicts between departments while a champion organizes role-specific trials.

易混边界：热情志愿者不能替代正式的资源与责任安排。

Boundary: Enthusiastic volunteers cannot replace formal resource and accountability arrangements.

审校：Transformational leadership明确高层战略、范围、资源与问责；联盟与社区实践支持业务倡导功能，但志愿者不能代替正式责任是教学推论。

先修：无硬性先修；此单元直接说明两类角色，无需重复概览作硬先修。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.3.2-unit-1 · 业务、技术与监督角色 / Business, technical and oversight roles

状态：supported

团队需具备需求判断、数据维护、技术实现、风险审查和运营能力，明确交付标准、接手关系和谁能暂停不适当用途。

The team needs capability in assessing needs, maintaining data, technical implementation, risk review, and operations, with clear delivery standards, handovers, and authority to pause inappropriate uses.

例子（教学例示）：教学示例：上线审批中明确业务目标验收者和运行支持接手者。

Example (authored illustration): Teaching example: Launch approval identifies who accepts the business outcomes and who takes over operational support.

易混边界：团队名单齐全不代表决策机制清晰。

Boundary: A complete team roster does not establish a clear decision-making mechanism.

审校：GOVERN 2.1与3.1、MANAGE 2.4及Experiment People支持跨职能能力、职责、暂停与接手；团队名单不是决策机制。

先修：3.2.1-unit-1；先区分负责执行与最终问责，再设计团队交付和接手。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.3.3-unit-1 · 事实、未知、岗位影响与反馈 / Facts, uncertainty, role impacts and feedback

状态：needs-review

沟通实施时间、已验证与尚未验证的结果、工作变化和支持措施，并建立双向反馈。不应为推动采用而许诺未经证实的岗位或收益结果。

Communicate implementation timing, verified and unverified outcomes, changes to work, and support measures, and establish two-way feedback. Do not promote adoption through unsubstantiated promises about roles or benefits.

例子（教学例示）：教学示例：说明哪些任务会被辅助，哪些决定仍由人承担。

Example (authored illustration): Teaching example: Explain which tasks will receive assistance and which decisions remain people's responsibility.

易混边界：只宣传收益而回避员工担忧会损害信任。

Boundary: Promoting only benefits while avoiding employees' concerns can damage trust.

审校：CAF支持沟通与组织影响管理，但未直接支持对未验证岗位承诺、信任后果的具体论断。

先修：4.3-lesson-3；先理解沟通范围，再区分事实、未知和不当承诺。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补变更沟通中证据化收益、岗位预期与信任维护的直接材料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补变更沟通中证据化收益、岗位预期与信任维护的直接材料。

## 4.3.4-unit-1 · 安全试验与问题反馈 / Safe experimentation and issue reporting

状态：needs-review

当员工担心犯错受罚时，建立限定范围的安全练习、报告渠道和改进机制。区分抵触改变、合理风险担忧和工具不适配。

When employees fear punishment for mistakes, provide bounded safe practice, reporting channels, and improvement mechanisms. Distinguish resistance to change, reasonable risk concerns, and poor tool fit.

例子（教学例示）：教学示例：让员工在测试材料上练习核验，报告失败不扣采用率。

Example (authored illustration): Teaching example: Let employees practice verification on test material without penalizing their adoption metric for reporting failures.

易混边界：强制使用或更换工具不一定解决文化障碍。

Boundary: Mandatory use or a replacement tool does not necessarily resolve cultural barriers.

审校：CAF鼓励试验和反馈，但未具体证明不扣采用率的机制或列举的心理安全干预。

先修：4.1.3-unit-1；先区分低采用率的不同障碍，避免把权限问题误当文化问题。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补心理安全、失败报告与采用激励机制的证据或正式组织政策。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补心理安全、失败报告与采用激励机制的证据或正式组织政策。

## 4.3.5-unit-1 · 从会操作到能判断 / From tool operation to judgment

状态：needs-review

按岗位设计真实任务，练习核验、边界识别、升级与人机交接，并以实际表现评估。POC和黑客马拉松也需要责任与验证目标。

Design realistic tasks for each role, practicing verification, recognition of limits, escalation, and human-AI handovers, and assess actual performance. Proofs of concept and hackathons also need accountability and validation goals.

例子（教学例示）：教学示例：客服训练核对政策和升级投诉，开发者训练代码评审与测试。

Example (authored illustration): Teaching example: Customer-support staff practice checking policies and escalating complaints; developers practice code review and testing.

易混边界：签到或通过工具介绍不能证明岗位胜任。

Boundary: Attendance or completion of a tool introduction does not prove competence for a role.

审校：Cloud fluency支持目标化训练和技能验证；岗位级核验、升级、交接及活动验收细则需直接资料。

先修：3.3.4-unit-1, 3.1-lesson-4；练习核验与升级前需理解证据支持及人工接手边界。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补AI岗位考核量表、真实任务练习及POC/黑客马拉松责任安排资料。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补AI岗位考核量表、真实任务练习及POC/黑客马拉松责任安排资料。

## 4.3.6-unit-1 · 判断、同理心与责任 / Judgment, empathy and responsibility

状态：needs-review

把可重复的辅助工作与需要语境、价值取舍和授权的判断分开，重新设计人的监督、沟通和创造性职责，明确最终责任。

Separate repeatable assistance tasks from judgments requiring context, value trade-offs, and authorization. Redesign people's oversight, communication, and creative responsibilities, and clarify final accountability.

例子（教学例示）：教学示例：AI起草投诉回复，人类理解处境、核验事实并决定发送。

Example (authored illustration): Teaching example: AI drafts a complaint response; a person understands the situation, verifies facts, and decides whether to send it.

易混边界：自动化一个任务不等于可以移交整个岗位责任。

Boundary: Automating one task does not mean responsibility for an entire role can be handed over.

审校：GOVERN 3.2支持人机职责，CAF支持角色调整；重复性与语境判断如何划分尚缺实证或正式方法。

先修：3.2.1-unit-1, 3.1-lesson-4；任务自动化仍需明确最终问责与人工干预。

- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。

- 缺口：需补人机任务划分方法及语境、授权、创造性职责的具体依据。
- 所需材料：补充可公开引用的一手材料及对应章节或原句：需补人机任务划分方法及语境、授权、创造性职责的具体依据。

## 4.4-lesson-1 · 迭代式转型 / Iterative transformation

状态：supported

按构想、实验、启动和扩展等阶段逐步验证。阶段之间应有反馈与决策依据，而非一次性替换全部流程。

Validate progressively through stages such as envisioning, experimentation, launch, and scaling. Use feedback and evidence for decisions between stages rather than replacing all processes at once.

例子（教学例示）：教学示例：从小范围验证开始，观察结果后决定是否继续。

Example (authored illustration): Teaching example: Begin with a limited test, then use the observed results to decide whether to continue.

审校：journey四阶段配合设计原则允许迭代，支持逐步验证而非一次替换。

先修：无硬性先修；阶段框架在本单元完整介绍。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Lens — Design principles](https://docs.aws.amazon.com/wellarchitected/latest/responsible-ai-lens/design-principles.html)；摘录键 d34-review-aws-design（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4-lesson-2 · 从短期成果到扩展 / From quick wins to scale

状态：supported

先获得可核验的小范围成果，再确认数据、流程和支持条件能否迁移到其他团队。

First achieve verifiable results within a limited scope, then check whether the data, processes, and support conditions can transfer to other teams.

例子（教学例示）：教学示例：志愿者试点成功，不代表所有部门立刻适用。

Example (authored illustration): Teaching example: Success in a volunteer pilot does not establish immediate suitability for every department.

审校：Experiment强调用例成功标准，Launch要求扩展前识别缺口，Scale强调标准化条件；不可直接外推志愿者试点是应用推论。

先修：4.1.1-unit-1；扩展到新团队需重新检查具体用途的准备条件。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4-lesson-3 · 卓越中心 COE / Center of excellence (CoE)

状态：supported

卓越中心可提供共享能力、标准、实践与协作支持。它不应让业务责任在集中支持中消失。

A center of excellence can provide shared capabilities, standards, practices, and collaboration support. Centralized support should not make business accountability disappear.

例子（教学例示）：教学示例：把多个团队反复解决的问题整理成可复用的方法和支持机制。

Example (authored illustration): Teaching example: Turn problems repeatedly addressed by multiple teams into reusable methods and support mechanisms.

审校：CAF领导能力介绍CCoE的可复用模式，journey Scale People明确AI CoE；业务责任并未因此转移。

先修：3.2.1-unit-1；共享支持与最终业务问责的区别是理解COE边界的前提。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4-lesson-4 · 持续反馈与价值跟踪 / Continuous feedback and value tracking

状态：supported

同时跟踪使用、质量、风险、成本和长期业务价值，用反馈修正下一轮计划。

Track use, quality, risk, cost, and long-term business value together, and use feedback to revise the next round of plans.

例子（教学例示）：教学示例：账号开通数可以是活动指标，但不能单独证明业务价值。

Example (authored illustration): Teaching example: The number of activated accounts may be an activity metric, but it cannot alone demonstrate business value.

审校：Launch Business评估效率、价值与成本，Operations及Monitoring评估运行风险和反馈；账号量不是价值充分证据。

先修：无硬性先修；指标类别由本单元说明，无需模型技术先修。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Lens — Monitoring](https://docs.aws.amazon.com/wellarchitected/latest/responsible-ai-lens/monitoring.html)；摘录键 d34-review-aws-monitor（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4-lesson-5 · 试点转生产 / Pilot-to-production transition

状态：supported

从实验到生产需要明确责任、运维、治理、支持和异常处置，而不是仅把演示页面公开。

Moving from experiment to production requires clear accountability, operations, governance, support, and anomaly handling, rather than simply making a demonstration page public.

例子（教学例示）：教学示例：上线前确认谁值守、怎样监控、出错如何回退。

Example (authored illustration): Teaching example: Before launch, confirm who is on duty, how monitoring works, and how to roll back when something goes wrong.

审校：GLOE明确PoC与生产差异；GOVERN 2和MANAGE 4.1支持责任、监控、恢复和变更，演示不可替代。

先修：3.3-lesson-1；生产交接需要先认识运行监控与事件机制。

- 来源：[AWS — Generative AI Lifecycle Operational Excellence framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/introduction.html)；摘录键 d34-review-aws-gloe（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4-lesson-6 · 全企业推广 / Enterprise rollout

状态：supported

评估跨团队数据差异、性能、连续性、培训和支持能力，以可控节奏推广并保留纠正空间。

Assess differences in data across teams, performance, continuity, training, and support capacity. Roll out at a controlled pace while preserving room for correction.

例子（教学例示）：教学示例：扩展过程中发现新部门资料不足时，可暂停该用途并补齐条件。

Example (authored illustration): Teaching example: If a new department lacks source material during expansion, pause that use and supply the missing prerequisites.

审校：新增负载与恢复指南支持性能及连续性，运行手册支持团队接手；原journey要求数据、权限、培训和运营准备。按部门条件分批推广、资料不足则暂停是这些要求的教学应用，不是固定组织政策。

先修：4.4-lesson-2；先理解试点迁移条件，再评估全企业推广。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS — Generative AI Lifecycle Operational Excellence framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/introduction.html)；摘录键 d34-review-aws-gloe（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS PERF05-BP04 — Load test your workload](https://docs.aws.amazon.com/wellarchitected/latest/framework/perf_process_culture_load_test.html)；摘录键 d34-aws-load-test（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Reliability — Failure management](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-failmgmt.html)；摘录键 d34-aws-failure-management（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS OPS07-BP03 — Use runbooks to perform procedures](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_ready_to_support_use_runbooks.html)；摘录键 d34-aws-runbooks（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4.1-unit-1 · 构想、实验、启动与扩展 / Envision, experiment, launch and scale

状态：supported

构想明确问题与假设；实验验证可行性和价值；启动落实生产与治理；扩展验证更多团队和规模条件。反馈可使团队返回前一阶段。

Envisioning clarifies problems and assumptions; experimentation validates feasibility and value; launch establishes production and governance; scaling validates additional teams and conditions at scale. Feedback may take the team back to an earlier stage.

例子（教学例示）：教学示例：实验发现资料不可用时，返回补齐基础而不是强行上线。

Example (authored illustration): Teaching example: When an experiment reveals unusable source material, return to filling foundational gaps rather than forcing a launch.

易混边界：阶段不是不可回头的固定流水线。

Boundary: Stages do not form a fixed, irreversible pipeline.

审校：四阶段内容与journey一致；设计原则明确透明迭代，允许回到基础问题是流程应用，不声称固定强制顺序。

先修：无硬性先修；阶段及反馈在本单元完整定义，无须重复概览。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Responsible AI Lens — Design principles](https://docs.aws.amazon.com/wellarchitected/latest/responsible-ai-lens/design-principles.html)；摘录键 d34-review-aws-design（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4.2-unit-1 · 试点代表性与迁移条件 / Pilot representativeness and transfer conditions

状态：supported

试点结果受参与者、数据和支持条件影响。扩展前检查新部门任务差异、资源、成本与用户能力，分批验证并保留暂停点。

Pilot results depend on participants, data, and support conditions. Before expansion, examine differences in new departments' tasks, resources, costs, and user capabilities; validate in batches and retain pause points.

例子（教学例示）：教学示例：志愿者团队表现好，新部门资料缺失时先暂停该部门推广。

Example (authored illustration): Teaching example: A volunteer team performs well, but rollout to a new department is paused because it lacks source material.

易混边界：把试点配置复制过去不等于验证了可迁移性。

Boundary: Copying the pilot configuration does not validate transferability.

审校：journey提供阶段条件，MEASURE 2.3–2.5强调部署条件与泛化限制；分批验证和暂停是受控应用推论。

先修：4.1.1-unit-1, 4.4-lesson-2；扩展验证依赖具体准备条件及试点与其他团队的迁移区别。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4.3-unit-1 · COE与业务责任 / CoE and business accountability

状态：supported

卓越中心提供共享评估、标准、平台和经验复用，支持业务团队而不是代替它们定义价值或承担全部用例责任。

A center of excellence provides shared evaluation, standards, platforms, and reusable experience. It supports business teams rather than replacing them in defining value or assuming all use-case responsibility.

例子（教学例示）：教学示例：多个团队共享检索评估方法，各自负责本部门知识有效性。

Example (authored illustration): Teaching example: Teams share retrieval evaluation methods while each owns the validity of its department's knowledge.

易混边界：集中所有业务决策可能形成瓶颈。

Boundary: Centralizing all business decisions can create bottlenecks.

审校：CAF支持共享模式及权衡集中/分散结构，journey支持AI CoE；集中全部决策造成瓶颈为组织设计推论。

先修：3.2.1-unit-1；先理解问责归属，避免把共享能力误作业务责任转移。

- 来源：[AWS Cloud Adoption Framework — People perspective: culture and change](https://docs.aws.amazon.com/whitepapers/latest/overview-aws-cloud-adoption-framework/people-perspective.html)；摘录键 d34-review-aws-people（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4.4-unit-1 · 采用、质量、风险、成本与结果 / Adoption, quality, risk, cost and outcomes

状态：supported

推广后的反馈同时观察使用、结果、风险与成本，区分短期热度和持续价值，用问题报告推动下一轮改进。

Post-rollout feedback examines use, outcomes, risks, and costs together, distinguishes short-term enthusiasm from sustained value, and uses problem reports to drive the next improvement cycle.

例子（教学例示）：教学示例：使用率提高而复核成本激增时，重新评估流程和净收益。

Example (authored illustration): Teaching example: When usage rises but review costs surge, reassess the workflow and net benefits.

易混边界：成功案例集合不能替代完整运行数据。

Boundary: A collection of success stories cannot replace complete operational data.

审校：Monitoring关注实际收益风险，feedback要求可追踪数据，Launch Business衡量成本价值；支持完整运行证据而非成功故事。

先修：4.4-lesson-4；先理解各类指标，才能判断采用热度与净价值背离。

- 来源：[AWS Responsible AI Lens — Monitoring](https://docs.aws.amazon.com/wellarchitected/latest/responsible-ai-lens/monitoring.html)；摘录键 d34-review-aws-monitor（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS — Architecting the production feedback loops](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/prod-monitoring-feedback.html)；摘录键 d34-review-aws-feedback（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4.5-unit-1 · 值守、告警、回退与变更 / On-call coverage, alerts, rollback, and change

状态：supported

生产交接要明确负责人、运行手册、监测、故障接手、回退、版本变更与持续资料维护。模型文件交付只是其中一部分。

Production handover must specify owners, runbooks, monitoring, incident handover, rollback, version changes, and ongoing maintenance of source material. Delivery of model files is only one part.

例子（教学例示）：教学示例：上线前演练失效检索、错误告警与人工接手。

Example (authored illustration): Teaching example: Before launch, rehearse retrieval failures, error alerts, and human takeover.

易混边界：演示页面能打开不代表系统具备生产条件。

Boundary: An accessible demonstration page does not establish production readiness.

审校：OPS07-BP03明确负责人、运行步骤、权限、异常升级及版本化更新；OPS06-BP01要求部署前测试回退或前进修复计划；Reliability要求经常恢复演练。结合journey持续资料治理，生产交接清单及演示不等于生产准备均有支持。

先修：3.3-lesson-1, 3.2.1-unit-1；交接依赖事件处理及明确负责/问责，而非仅依赖转型阶段名称。

- 来源：[AWS — Generative AI Lifecycle Operational Excellence framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/introduction.html)；摘录键 d34-review-aws-gloe（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[NIST AI RMF 1.0 — Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；摘录键 d34-review-nist-rmf-core（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS OPS07-BP03 — Use runbooks to perform procedures](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_ready_to_support_use_runbooks.html)；摘录键 d34-aws-runbooks（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS OPS06-BP01 — Plan for unsuccessful changes](https://docs.aws.amazon.com/wellarchitected/latest/framework/ops_mit_deploy_risks_plan_for_unsucessful_changes.html)；摘录键 d34-aws-rollback（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Reliability — Failure management](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-failmgmt.html)；摘录键 d34-aws-failure-management（原文见 materials.v2 / analysis.v2，不重复摘录）。


## 4.4.6-unit-1 · 性能、连续性、培训与支持 / Performance, continuity, training and support

状态：supported

扩大业务量和团队范围时，重新验证峰值容量、延迟、资料权限、培训覆盖、支持成本与业务连续性，按证据调整节奏。

As workload and team coverage grow, revalidate peak capacity, latency, data permissions, training coverage, support costs, and business continuity, and adjust the pace based on evidence.

例子（教学例示）：教学示例：新增地区前先确认本地资料、权限和支持接手。

Example (authored illustration): Teaching example: Before adding a region, confirm local source material, permissions, and support handover.

易混边界：规模扩大时原有质量与成本假设可能失效。

Boundary: Existing quality and cost assumptions may fail at a larger scale.

审校：PERF05-BP04要求按用户数、吞吐和响应时间定期负载测试，检查非线性扩展；Reliability按业务需要和恢复成本设RTO/RPO并在重大变化后复验；runbook支持团队接手。结合journey的权限、运营培训、成本与CAF人员能力，支持扩展时重新验证。

先修：4.2.3-unit-1, 4.4.2-unit-1；扩大前需了解工作负载及跨团队迁移条件，才能分别验证容量、连续性和部门准备程度。

- 来源：[AWS Prescriptive Guidance — Generative AI adoption journey](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-data-considerations-gen-ai/journey.html)；摘录键 d34-review-aws-journey（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS — Generative AI Lifecycle Operational Excellence framework](https://docs.aws.amazon.com/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/introduction.html)；摘录键 d34-review-aws-gloe（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS PERF05-BP04 — Load test your workload](https://docs.aws.amazon.com/wellarchitected/latest/framework/perf_process_culture_load_test.html)；摘录键 d34-aws-load-test（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS Reliability — Failure management](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-failmgmt.html)；摘录键 d34-aws-failure-management（原文见 materials.v2 / analysis.v2，不重复摘录）。
- 来源：[AWS OPS07-BP03 — Use runbooks to perform procedures](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_ready_to_support_use_runbooks.html)；摘录键 d34-aws-runbooks（原文见 materials.v2 / analysis.v2，不重复摘录）。
