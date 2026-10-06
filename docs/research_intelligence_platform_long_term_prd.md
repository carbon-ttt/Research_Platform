# Research Intelligence Platform

> 长期产品方向与平台化 PRD（以 MVP 为起点）  
> 版本：v2.0  
> 日期：2026-09-15  
> 文档状态：战略路线图，不作为 MVP 必做清单  
> 起点产品：Bioprinter Research Proposal Copilot

## 0. 阅读说明

本文档定义 Bioprinter Research Proposal Copilot 验证成功后的长期产品方向。它描述能力如何演进、哪些模块可以平台化、哪些能力必须保持领域特化，以及商业化和合规如何建立在可信证据之上。

本文档不能被用来反向扩大 MVP 范围。任何长期功能进入开发前，都必须经过 MVP 的阶段决策门槛，并补充独立的产品需求、数据源、评测集和安全审查。

### 0.1 与 MVP PRD 的关系

- MVP 是第一个可演示和可验证的垂直产品。
- 长期平台复用 MVP 验证过的 Project、Source、Evidence、Claim、Condition、Hypothesis 和 Deliverable 对象。
- `Universal Layer` 是架构方向，不意味着第一天就支持所有领域。
- `Domain Ontology` 必须以领域专家、真实数据和评测集为基础，不能只做通用节点模板。
- 供应商生态和商业推荐必须后置，并与科研证据和内容推荐完全隔离。

## 1. 长期愿景与定位

### 1.1 愿景

帮助研究者、团队和机构完成从问题到决策的可信研究工作流：

```text
Question
  -> Evidence
  -> Design / Analysis
  -> Decision
  -> Experiment / Action
  -> Deliverable
```

### 1.2 长期产品定位

> Research Intelligence Platform：以证据、条件、领域知识和项目状态为基础的研究决策工作台。

### 1.3 不以什么作为壁垒

长期平台的竞争力不应主要来自更多聊天入口、更长的自动生成文本、更多不可验证的 Agent、更早接入广告和供应商，或单纯的论文数量和搜索结果数量。

应建立的壁垒是：

- 结构化的证据与条件。
- 领域知识和高质量数据。
- 研究项目的长期记忆与版本。
- 研究任务和专家评测体系。
- 在关键决策节点保持透明和可审查。

## 2. 长期用户和场景

### 2.1 用户分层

| 用户 | 核心工作 | 长期价值 |
| --- | --- | --- |
| 个人研究者 | 选题、综述、方案、写作和实验记录 | 减少研究整理和方案迭代时间 |
| 导师/PI | 审核研究方向、设计和结果解释 | 快速发现证据、方法和风险问题 |
| 科研团队 | 共享项目、文献、数据和决策记录 | 减少知识分散和重复研究 |
| 高校/研究机构 | 学科知识库、审核流程和部署 | 形成机构级研究基础设施 |
| 企业研发团队 | 技术路线、专利、竞品和实验决策 | 连接研究与研发决策 |
| 行业分析师 | 技术、市场、专利和公司研究 | 生成可验证的决策型报告 |

### 2.2 长期工作流类型

所有工作流共享 `Research Project Engine`，但使用不同的证据类型、模板和验收标准：

| 工作流 | 输入 | 核心方法 | 主要交付 |
| --- | --- | --- | --- |
| Thesis | 研究问题、文献和实验条件 | 文献综合、方案设计和结果解释 | Thesis/开题 |
| Research Project | 假设、资源和目标 | 实验设计、任务和数据记录 | 项目方案与阶段结论 |
| Grant Proposal | 科学问题、创新性和可行性 | 论证、研究计划和风险 | 基金申请 |
| Technology Review | 技术问题和来源集 | 路线比较、成熟度和限制 | 技术调研报告 |
| Patent Landscape | 关键词、分类和专利文献 | 权利要求、家族和空白分析 | 专利地图 |
| Industry Research | 公司、市场和技术信息 | 多源核验和竞争分析 | 决策报告/PPT |

### 2.3 长期不做的事情

- 不把高风险研究决策完全自动化。
- 不把商业赞助内容伪装成独立科研结论。
- 不在没有领域数据和专家评测的情况下快速扩展新领域。
- 不用一个通用置信度分数掩盖不同证据类型的差异。
- 不用抓取更多资料代替结构化比较和判断。

## 3. 平台分层架构

```text
Experience Layer
  -> Project workspace / Evidence view / Proposal editor / Team review

Workflow Layer
  -> Thesis / Experiment / Grant / Technology review / Industry research

Research Intelligence Layer
  -> Retrieval / Evidence / Contradiction / Gap / Design / Synthesis

Domain Ontology Layer
  -> Entities / Relations / Conditions / Metrics / Rules / Expert curation

Universal Research Layer
  -> Context / Source connectors / Agent runtime / Version / Evaluation

Governance Layer
  -> Privacy / Permissions / Audit / Provenance / Commercial disclosure
```

### 3.1 Universal Research Layer

可跨领域复用的能力：

- 用户、身份、目标、期限和资源理解。
- 项目创建、状态管理、版本和影响分析。
- Source Connector、文档解析和来源元数据。
- 关键词、语义和结构化检索。
- Evidence、Claim、Condition 和 Provenance 存储。
- 结构化 Agent 调用和任务编排。
- 离线评测、在线反馈和回归测试。
- 导出、审计和数据治理。

通用层不能决定每个领域的科学含义。例如它可以保存 `Metric`，但不能假设生物活性、芯片良率和模型准确率使用同一种解释方式。

### 3.2 Domain Ontology Layer

领域层负责回答：

> 在这个领域中，哪些对象重要，它们如何关联，哪些条件会改变结论，哪些指标可以比较？

Bioprinting 示例：

```text
Research Goal
  -> Biological System
  -> Cell / Tissue
  -> Bioink / Material
  -> Printing Technology
  -> Equipment
  -> Process Parameters
  -> Structural Performance
  -> Biological Outcome
  -> Application Constraint
```

其他领域需要独立建模：

- 半导体：Architecture、Process、Material、Equipment、Parameter、Yield、Cost。
- AI：Model、Architecture、Dataset、Training、Inference、Metric、Benchmark、Application。
- Robotics：Task、Hardware、Control、Environment、Trajectory、Safety、Performance。
- Drug Discovery：Target、Compound、Assay、Mechanism、Toxicity、Clinical Stage。

跨领域复用的是 Ontology 接口和数据治理，不是所有实体、关系和规则本身。

## 4. 产品演进路线

### Phase 1：Bioprinter Research Proposal Copilot

目标：验证单一垂直场景的证据组织和 Proposal 价值。

范围：

- 生物打印研究问题澄清。
- 文献与个人资料检索。
- Evidence Ledger。
- 条件化冲突分析。
- Research Gap 和候选假设。
- 实验设计草稿和可行性警告。
- Proposal 编辑与导出。

进入下一阶段条件：

- Citation support rate >= 90%。
- Location accuracy >= 90%。
- Unsupported claim rate <= 5%。
- 至少 70% 的目标用户完成 Proposal 初稿。
- 专家认为 Evidence Ledger 有助于审核。

### Phase 2：Research Project Workspace

目标：从一次性 Proposal 生成变成持续性的研究项目工作台。

新增能力：

- 项目任务、依赖和里程碑。
- 材料准备、设备预约和实验记录。
- 研究问题、假设和方案的版本管理。
- 实验结果上传和结果-证据关联。
- 导师/PI 审核和评论。
- 上游变更影响分析。

边界：不自动控制实验设备，不自动解释没有元数据的数据，也不把项目管理做成普通 Todo List。

### Phase 3：Bioprinting Research Intelligence

目标：让系统能够在 Bioprinting 领域进行更深的比较和趋势分析。

新增能力：

- 材料、细胞、设备、参数和指标的结构化比较。
- 按实验条件筛选相似研究。
- 发现结果冲突、测量差异和条件缺口。
- 研究路线、机构和方法趋势分析。
- 从研究空白到候选实验设计的可追踪生成。
- Bioprinting Ontology 的专家维护工具。

阶段要求：

- 所有趋势图显示数据范围、更新时间和统计口径。
- 机构/作者排名显示排序依据和数据库覆盖范围。
- 不能把论文数量当成研究质量的单一代理指标。

### Phase 4：多领域 Research Intelligence

目标：通过配置领域适配器支持材料、AI、机器人等新领域。

领域接入必须提供：

- 领域实体和关系定义。
- 关键条件与指标定义。
- 领域检索 Connector。
- 领域术语词表和同义词。
- 专家审核规则。
- 领域基准数据和冲突案例。
- 安全、合规和数据来源说明。

新领域接入决策不能只看工程复用率，还要看研究质量是否达到门槛。

### Phase 5：Research-to-Decision Ecosystem

目标：将可信研究组织能力延伸到团队研发、机构知识和采购决策。

新增能力：

- 团队和机构级私有知识库。
- 企业技术路线、专利和竞品分析。
- 研究决策记录与审批流程。
- 材料、设备、试剂、CRO 和软件的参数匹配。
- 研究结果到采购需求的结构化映射。

只有在科研内容与商业推荐完全隔离、披露和可审计后，才开放供应商生态。

## 5. Research Project Operating System

项目不再只是一个 Chat session，而是由以下对象组成：

```text
Question
  -> Hypothesis
  -> Evidence
  -> Design
  -> Task
  -> Data
  -> Result
  -> Conclusion
  -> Deliverable
```

系统能力：

- 对对象进行创建、引用、审核、归档和版本管理。
- 判断上游修改影响哪些下游内容。
- 允许同一个 Evidence 被多个 Claim 和 Deliverable 使用。
- 记录内容由 AI 生成、用户修改还是专家确认。
- 允许研究结论被新证据标记为 `Superseded`，而不是静默覆盖。

### 5.1 项目状态机

```text
Scoping
  -> Evidence gathering
  -> Synthesis
  -> Design review
  -> Execution
  -> Analysis
  -> Reporting
  -> Archived / Reopened
```

每种工作流可以定制状态，但必须保留当前状态、进入状态的条件、阻塞原因、需要谁批准，以及哪些对象在此状态下不可直接修改。

## 6. Evidence and Provenance Graph

长期证据图谱保存：

- `Source`：论文、专利、报告、数据集、内部文档。
- `Evidence`：来源中的原文事实或数据。
- `Condition`：样本、材料、参数、时间、环境和测量方法。
- `Claim`：项目使用的判断。
- `Relation`：支持、反驳、不可比较、衍生或待验证。
- `Provenance`：来源位置、处理时间、解析器版本、模型版本和用户操作。

示例：

```text
Source A
  -> Evidence A1
      -> Condition: cell type / bioink / print parameter / culture time
      -> Claim C1: result under this condition

Source B
  -> Evidence B1
      -> Condition: different cell type / different metric
      -> Claim C2: opposite-looking result

C1 <-> C2
  -> Relation: condition-dependent conflict
```

系统应优先解释条件差异，而不是计算一个没有科学含义的平均结论。

## 7. Domain Ontology Studio

专家可以：

- 定义实体、属性、关系和枚举值。
- 指定哪些字段是必填条件。
- 定义哪些指标可以比较、哪些指标不可直接比较。
- 添加同义词、缩写和术语映射。
- 添加领域规则和警告。
- 审核来自论文的实体和关系提取。
- 发布 Ontology 版本并回溯影响。

Ontology Studio 不应由模型直接自动发布。模型可以提出候选结构，但需要领域专家审核。

## 8. 高阶研究 Agent 系统

Agent 采用职责分离，而不是一个拥有无限权限的通用 Agent：

| Agent | 职责 | 主要输出 | 必须限制 |
| --- | --- | --- | --- |
| Scout | 发现来源和关键词 | 候选 Source 集 | 不能直接形成结论 |
| Extractor | 提取证据和条件 | Evidence 对象 | 必须保留原文位置 |
| Verifier | 验证 Claim 和引用 | 支持/不支持/不确定 | 不能修改原始证据 |
| Contradiction Analyst | 分析结果冲突 | 条件化关系 | 无法解释时保留未解决 |
| Gap Analyst | 组织研究空白 | Gap 候选 | 不能宣称真实创新 |
| Design Reviewer | 检查方案 | 风险和缺失项 | 不替代实验/伦理审批 |
| Writer | 组织交付文档 | 章节草稿 | 不得改变证据含义 |

Agent 运行要求：

- 只能通过工具访问结构化项目和来源数据。
- 工具调用、检索词、来源集合和输出版本全部记录。
- 高风险内容必须经过验证器或人工批准。
- Agent 失败时保留局部结果和可重试状态。
- Agent 之间共享结构化对象，不通过自然语言复制长文本。

## 9. 项目记忆与变更影响

长期系统需要回答：

- 这个结论基于哪些论文和条件？
- 哪个实验方案使用了它？
- 新增一篇相反结果的论文后，哪些章节需要重审？
- 用户什么时候接受了这个假设？
- 当前 Proposal 和上一版本差异是什么？

变更影响示例：

```text
Research Question changed
  -> affected: Research Gap
  -> affected: Hypothesis
  -> affected: Variables and Controls
  -> affected: Timeline
  -> affected: Proposal sections 1, 3, 5, 7
```

长期版本系统必须区分：

- AI 草稿。
- 用户确认。
- 导师或领域专家确认。
- 被新证据替代。
- 被用户拒绝但仍保留在历史中的内容。

## 10. 团队与机构协作

### 10.1 角色

- `Owner`：项目负责人，可管理项目和权限。
- `Contributor`：可添加来源、证据和草稿。
- `Reviewer`：可评论、批准或退回关键对象。
- `Admin`：管理机构空间、Connector、数据策略和审计。

### 10.2 协作能力

- 项目、文献集、知识库和输出的访问控制。
- 评论、批注、任务分配和审核请求。
- 导师确认、专家确认和机构审批状态。
- 审计日志：谁在何时修改了哪个 Claim、条件或参数。
- 机构知识库和个人知识库隔离。
- 机构数据不默认用于公共模型训练。

### 10.3 机构部署要求

- 租户隔离。
- 单点登录和身份同步。
- 数据区域和保留策略配置。
- 私有模型或受控模型路由。
- 机构级来源许可和 Connector 管理。
- 统一的审核模板和质量指标。

## 11. 长期产品形态

长期可以提供三个入口，但共享同一套 `Research Project Engine`：

### 11.1 Thesis

适用于毕业论文、毕业设计和开题。重点是文献综述、研究问题、实验方案、结果解释和论文结构。

### 11.2 Research Project

适用于科研立项、实验项目和基金申请。重点是假设、任务、资源、数据、阶段结论和版本。

### 11.3 Industry Research

适用于技术调研、市场研究和竞争分析。重点是多源核验、技术路线、专利、公司、市场和决策输出。

不同入口不能只通过界面标签区分，必须拥有不同的数据源、权限、评测标准和交付模板。

## 12. 数据与系统架构

### 12.1 长期数据层

```text
Raw Sources
  -> Parsed Documents
  -> Chunks / Tables / Figures
  -> Evidence Store
  -> Knowledge Graph / Ontology Store
  -> Project Object Store
  -> Search Index / Vector Index
  -> Evaluation Warehouse
```

每个派生对象必须能够回指上游来源和处理版本。

### 12.2 Connector 体系

来源 Connector 可包括：

- 学术论文数据库。
- 专利数据库。
- 机构内部文档。
- 行业报告和公司信息。
- 实验记录和结构化数据。
- 设备和材料目录。

每个 Connector 必须声明数据覆盖范围、更新时间、使用许可、访问限制、元数据质量，以及是否允许全文存储和模型处理。

### 12.3 质量层

长期质量体系包括：

- `Source Quality`：来源身份和元数据完整性。
- `Extraction Quality`：正文、表格和图注提取质量。
- `Retrieval Quality`：召回和排序质量。
- `Evidence Quality`：定位和条件保留质量。
- `Reasoning Quality`：冲突、因果和适用范围判断。
- `Workflow Quality`：用户能否完成研究任务。
- `Governance Quality`：隐私、审计和商业披露完整性。

## 13. 领域接入方法

每个新领域在进入平台前，必须完成以下工作包：

1. 领域专家访谈和任务定义。
2. 领域实体、关系、条件和指标建模。
3. 术语、同义词、缩写和检索策略建设。
4. 来源 Connector 和数据许可核验。
5. 领域证据和冲突案例标注。
6. 领域安全、合规和不适用范围定义。
7. 至少一个真实用户工作流试点。
8. 通过与 Bioprinting MVP 同等级别的质量门槛。

接入新领域不能只复制页面和替换文案；如果领域的核心关系、可比指标和风险规则不同，就必须有独立适配器。

## 14. 评测体系

### 14.1 领域基准集

每个领域需要建立：

- 真实研究问题。
- 权威来源集合。
- 关键 Claim 标注。
- 证据位置标注。
- 条件字段标注。
- 正向支持和反向冲突标注。
- 不可比较案例。
- 专家认可的 Gap 候选。
- 方案风险和安全边界案例。

### 14.2 核心指标

| 层级 | 指标 |
| --- | --- |
| 来源 | 元数据准确率、稳定标识覆盖率、来源新鲜度 |
| 检索 | Recall@K、Precision@K、来源类型覆盖 |
| 证据 | Citation support rate、Location accuracy、Condition retention |
| 推理 | Conflict recall、Unsupported claim rate、适用范围准确率 |
| 工作流 | Time to first useful artifact、Proposal completion、用户修改率 |
| 专家 | 审核效率、专家认可度、严重错误率 |
| 平台 | Agent 成本、任务成功率、版本回溯覆盖率 |
| 商业 | 留存、付费转化、机构续费和信任影响 |

### 14.3 评测原则

- 不能只用模型流畅度或用户点赞衡量科研质量。
- 必须区分检索错、解析错、推理错和 UI 误导。
- 每次更换模型、检索器、Prompt、Ontology 或数据源都要回归测试。
- 评测集不能全部由模型生成，应包含专家标注和困难案例。
- 线上反馈要能回流为匿名化错误样例和测试案例。

## 15. 信任、隐私与合规

### 15.1 数据原则

- 用户上传资料默认私有。
- 个人、团队、机构和公共来源按权限隔离。
- 支持导出、删除和数据保留策略。
- 清晰说明数据是否用于模型改进。
- 记录来源、解析器版本、模型版本、生成时间和用户修改。

### 15.2 高风险领域原则

对生物医学、临床、动物实验、伦理、生物安全和采购建议：

- 显示风险和人工审核边界。
- 不把模型建议称为批准方案。
- 关键输出要求用户确认或机构流程确认。
- 对缺少来源、条件冲突和过时数据显式告警。

### 15.3 商业透明原则

科研推荐和商业推荐必须有独立的数据、排序和 UI 区域：

```text
Evidence-based recommendation
  !=
Parameter-based product match
  !=
Sponsored placement
```

任何赞助内容都必须显示商业关系。商业排序不得改变研究结论、证据强度或风险判断。

## 16. 商业化路线

### 16.1 个人 Pro

价值包括更大的私有知识库、深度检索和证据核查、项目版本、质量检查、高级导出和多个研究项目。收费依据应是项目价值、存储和高级能力，而不是单纯按生成字数收费。

### 16.2 团队与高校

价值包括团队知识库、项目协作、导师/PI 审核、权限、审计、机构标准、私有部署或隔离环境、学科 Ontology 和评测集。

### 16.3 企业研发

价值包括内部文档与外部来源联合检索、技术路线、专利和竞品分析、研究决策与风险记录，以及从技术方案到材料、设备和服务需求的映射。

### 16.4 供应商生态

正确顺序是：

```text
可信研究方案
  -> 明确实验参数需求
  -> 透明的产品参数匹配
  -> 用户主动比较和联系供应商
```

供应商产品页必须显示规格、适配理由、数据来源、更新时间和赞助状态。供应商付费不能改变 AI 的研究建议、证据排序或质量判断。

## 17. 产品和经营指标

### 17.1 用户价值指标

- Time to first useful research artifact。
- Time to first expert-reviewable Proposal。
- Proposal completion rate。
- Evidence inspection rate。
- Quality warning resolution rate。
- 用户修改后采纳率。
- 同一项目的回访和版本迭代率。

### 17.2 研究质量指标

- Citation support rate。
- Location accuracy。
- Condition retention。
- Conflict recall。
- Unsupported claim rate。
- 严重实验可行性错误率。
- 专家审核时间下降比例。

### 17.3 平台指标

- 新领域接入所需配置时间。
- Ontology 和 Source Connector 复用率。
- Agent 任务成功率和平均成本。
- 版本回溯和变更影响覆盖率。
- 团队项目活跃率和机构续费率。

### 17.4 商业和信任护栏

- Pro 转化和团队席位增长。
- 机构续费率。
- 商业推荐排序与科研质量指标的独立性。
- 用户对赞助披露的理解度。
- 因错误引用或利益冲突导致的信任事件数量。

## 18. 阶段决策门槛

### 18.1 从 MVP 到项目工作台

必须满足：

- 目标用户愿意在同一项目中回访和修改。
- 证据和 Proposal 之间的回链稳定。
- 质量警告能被用户理解并采取行动。
- 方案建议没有出现不可接受的安全边界错误。

### 18.2 从项目工作台到 Bioprinting Intelligence

必须满足：

- 项目状态和版本模型稳定。
- 有足够的 Bioprinting 专家标注数据。
- 条件化比较能够提高研究决策质量，而不是增加复杂度。
- 领域 Ontology 能支持真实检索和对比任务。

### 18.3 从单领域到多领域

每个新领域都必须完成：

- 领域专家定义 Ontology。
- 真实来源和许可核验。
- 领域测试集和困难案例。
- 安全、合规和适用性审查。
- 至少一个真实用户工作流试点。

### 18.4 从科研产品到商业生态

必须满足：

- 科研证据排序与商业排序完全隔离。
- 赞助内容有清晰标识和审计。
- 产品匹配基于明确参数，而非付费影响。
- 用户理解推荐的商业关系。
- 商业化不会显著降低专家对平台可信度的评价。

## 19. 组织与运营要求

长期产品需要的不只是工程团队：

- `Product`：维护工作流、范围和阶段门槛。
- `Engineering`：构建可靠的对象、检索和 Agent 基础设施。
- `Domain Expert`：维护 Ontology、证据和评测集。
- `Research Quality`：负责人工评测、错误分析和回归测试。
- `Security/Legal`：负责隐私、数据许可和机构部署。
- `Design/Content`：确保不确定性和状态被正确表达。

领域专家不应只在最后做验收，而应参与数据模型、规则和测试集设计。

## 20. 关键风险与应对

| 风险 | 长期影响 | 应对策略 |
| --- | --- | --- |
| 跨领域抽象过早 | 每个领域都不够深 | 先垂直验证，再通过适配器扩展 |
| 数据许可不清 | 无法商业化或机构部署 | Connector 管理许可、覆盖范围和保留策略 |
| Ontology 漂移 | 历史项目和新结果不可比较 | Ontology 版本、迁移和影响分析 |
| Agent 权限过大 | 产生不可审计的结论 | 职责分离、工具边界和日志 |
| 商业利益冲突 | 用户不再信任科研内容 | 推荐和赞助隔离、透明披露 |
| 机构数据泄露 | 合规和信任损失 | 租户隔离、权限、审计和私有部署 |
| 自动化过度 | 用户失去判断能力 | 关键节点人工确认和不确定性展示 |
| 指标被游戏化 | 生成量增长但研究质量下降 | 以任务完成、专家审核和严重错误率为核心 |

## 21. 长期不变的产品原则

- **Evidence before fluency**：证据优先于表达流畅。
- **Conditions travel with claims**：结论必须携带适用条件。
- **Human approval at consequential steps**：高影响节点必须人工确认。
- **Project memory over chat memory**：项目对象和版本优先于聊天记录。
- **Provenance by default**：来源、位置、处理版本和用户操作默认可追溯。
- **Narrow depth before broad scale**：先深耕单一领域，再扩展多领域。
- **Commercial separation**：商业内容不得影响科研判断。
- **Graceful uncertainty**：系统必须能够诚实地说“不知道”或“无法直接比较”。

## 22. 最终平台定义

```text
Product:
  Research Intelligence Platform

Initial Vertical:
  Bioprinting

First Deliverable:
  Research Proposal

Universal Layer:
  Context, retrieval, evidence, provenance, project state, agents, evaluation

Domain Layer:
  Bioprinting ontology first, configurable adapters later

Workflow Layer:
  Thesis, research project, grant, technology review, patent landscape, industry research

Long-term Path:
  Research -> Decision -> Experiment -> Action -> Procurement
```

长期平台只有在“可信研究组织”被验证后，才延伸到“研究决策、实验执行和采购”。每一层都必须继承证据、条件、版本和人工审核能力，不能只继承一个生成接口。
