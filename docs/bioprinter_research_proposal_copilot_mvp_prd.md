# Bioprinter Research Proposal Copilot

> MVP 产品需求文档（实现契约）  
> 版本：v2.0  
> 日期：2026-09-15  
> 文档状态：可进入高保真 Demo 设计与实现

## 0. 阅读说明

本文档是 MVP 的唯一产品依据。后续设计、开发、演示和评审应优先遵守本文档中的范围、黄金路径、数据结构、证据规则和验收标准。

本文档描述的是一个用于 AI PM 面试的高保真 MVP Demo，同时保留向生产产品演进所需的接口边界。Demo 可以使用受控的预置数据模拟检索和证据提取，但界面和交互必须真实体现产品决策，不能把长期愿景伪装成已经实现的能力。

### 0.1 与长期 PRD 的关系

- 本文档回答：“第一版 Demo 具体做什么，用户如何完成一次研究提案任务？”
- `Research Intelligence Platform` 长期 PRD 回答：“这个 MVP 未来如何扩展为平台？”
- MVP 只实现 Bioprinting 单一垂直场景和 Research Proposal 单一主要交付物。
- Universal Research Engine、跨领域 Ontology、团队协作、供应商生态和产业分析属于长期方向，不得作为 MVP 的必需依赖。

### 0.2 一句话定义

> 一个帮助生物工程研究生把研究问题转化为“有证据、带条件、可审查、可修改”的 Research Proposal 初稿的 AI 工作台。

### 0.3 绝对不能误解的边界

- 产品不是“输入一句话，一键生成可信实验方案”。
- 产品不是普通的论文搜索、论文总结或聊天问答工具。
- 产品不宣称自动发现真实的学术创新。
- 产品不替代导师、实验人员、伦理审批或机构安全流程。
- AI 生成的参数、假设和实验建议如果没有文献或用户输入支持，必须标记为“待验证”。
- Demo 中的检索结果可以预置，但不能使用虚构的论文、机构、DOI、实验数据或供应商信息。

## 1. 产品概述

### 1.1 产品名称

Bioprinter Research Proposal Copilot

### 1.2 核心定位

从 Research Question 到 Research Proposal，而不是从 Keyword 到 Search Result。

```text
研究问题
  -> 研究背景与领域地图
  -> 结构化文献与证据
  -> 研究空白
  -> 假设与实验方案
  -> 可行性与风险检查
  -> Proposal 初稿
```

### 1.3 面试 Demo 的固定场景

固定演示主题：

> 生物 3D 打印在软骨组织工程中的应用。

固定演示用户：

> 生物工程硕士二年级学生，计划在 12 周内完成开题方案；已有基础细胞培养条件和一台挤出式生物打印机，但尚未确定 Bioink 配方、评价指标和对照组。

固定演示结果：

> 一份可以交给导师进一步审核的 Research Proposal 初稿，而不是已获批准或可以直接执行的实验 SOP。

使用固定主题的原因：

- 保证面试演示稳定、可重复。
- 把价值集中在研究推理和证据组织，而不是现场搜索速度。
- 方便准备已核验的论文、证据和冲突案例。
- 让用户在 8-10 分钟内看到完整闭环。

## 2. 用户与问题

### 2.1 目标用户

#### 主用户：生物工程硕士研究生

用户通常已有一个宽泛方向，但研究问题尚未收敛；能阅读论文，却需要大量时间建立文献地图、整理实验条件，并平衡导师要求、设备限制、材料可获得性和毕业截止日期。

核心任务：

> 在有限时间内，形成一个有文献依据、边界清晰、实验上初步可行的研究方案。

#### 次用户：导师或早期科研人员

核心任务：

> 快速查看学生方案的证据来源、假设、变量、对照组和风险，而不是重新阅读全部聊天记录。

### 2.2 不服务的场景

- 临床诊疗、治疗建议或患者决策。
- 自动控制打印机或执行生物实验。
- 实时采购、供应商排名和商业推荐。
- 没有领域评测集的跨学科通用研究图谱。

### 2.3 用户痛点假设

| 假设 | 现状问题 | MVP 验证方式 |
| --- | --- | --- |
| P1 | 用户能找到论文，但不能快速判断论文是否适用于自己的条件 | 观察用户是否查看条件字段和原文证据 |
| P2 | Research Gap 容易被 AI 写成没有依据的套话 | 评测用户是否能区分事实、推断和待验证机会 |
| P3 | 方案生成的难点是变量、对照、指标和限制的组织 | 观察用户是否修改结构化方案字段 |
| P4 | 用户需要可交给导师审核的成果，而不是长聊天记录 | 统计 Proposal 初稿完成率和导出率 |
| P5 | 过度自动化会让用户错误信任实验建议 | 记录警告查看率、人工确认率和高风险拦截率 |

### 2.4 用户故事

- 作为研究生，我希望用自然语言描述方向，以便系统帮助我把主题收敛成可研究的问题。
- 作为研究生，我希望查看论文结论成立的实验条件，以便判断它是否适合我的条件。
- 作为研究生，我希望知道不同论文是否冲突，以便避免把不同体系的结果简单平均。
- 作为研究生，我希望逐条接受、修改或拒绝 AI 建议，以便保持对最终方案的控制。
- 作为研究生，我希望导出前看到引用缺失和待验证项目，以便交给导师前完成自查。
- 作为导师，我希望点击结论就能看到来源、位置和条件，以便快速审核方案质量。

## 3. 产品目标与非目标

### 3.1 MVP 目标

在受控的 Bioprinting 数据集上，让目标用户完成：

1. 输入一个宽泛的研究主题。
2. 经由澄清问题形成可审阅的 Research Question。
3. 查看研究地图和论文证据。
4. 识别至少一种有证据支持的研究不足、结果矛盾或方法限制。
5. 生成包含假设、变量、对照、方法、指标和时间线的方案草稿。
6. 完成质量检查，知道哪些内容需要人工确认。
7. 导出 Research Proposal 初稿。

### 3.2 成功标准

用户完成的不是“生成一篇文章”，而是一个可追溯的研究决策链：

```text
用户问题 -> 证据卡片 -> 研究空白卡片 -> 假设卡片 -> 方案卡片 -> Proposal 章节
```

每个下游结论都能够追溯到用户输入、论文证据或明确标记的 AI 推断。

### 3.3 明确非目标

MVP 不包含：

- 自动执行实验、控制打印机或下单采购。
- 临床决策、治疗建议或生物安全审批。
- 全网学术检索覆盖承诺。
- 跨领域通用 Ontology。
- 复杂实验数据统计、图像分析或模型训练。
- 多人实时协作、机构权限和私有部署。
- 市场分析、供应商广告和商业推荐。
- 自动判断“这一定是创新点”。
- 自动生成无需人工审核的最终论文。

## 4. 产品原则

### 4.1 Evidence before fluency

证据优先于表达流畅。宁可显示“尚未找到足够证据”，也不能用专业措辞掩盖证据缺失。

### 4.2 Conditions travel with claims

结论不能脱离实验条件。凡是材料、细胞、浓度、打印参数、培养周期或评价指标发生变化，都必须提示适用性可能变化。

### 4.3 Human approval at consequential steps

研究问题、核心假设、关键变量、对照组、实验参数和创新机会必须可以被用户确认、修改或拒绝。

### 4.4 Project memory over chat memory

保存结构化项目对象和版本，而不是只保存聊天记录。用户再次打开项目时，应能直接回到研究问题、证据和方案状态。

### 4.5 Narrow depth before broad scale

先把软骨组织工程中的 Bioprinting Proposal 做深，再扩展到其他生物打印主题和其他研究领域。

## 5. MVP 信息架构

### 5.1 顶层导航

高保真 Demo 只需要以下导航：

1. `Projects`：项目列表和新建项目。
2. `Project Overview`：当前项目状态和六个研究工作区。
3. `Evidence`：文献、证据台账和冲突。
4. `Proposal`：提案编辑器和质量检查。

不在顶层导航中展示 Marketplace、Team、Ontology Studio 或 Analytics 等长期平台功能。

### 5.2 项目工作区

使用可回溯模块，而不是强制一次性线性向导：

```text
Project Overview
  ├── 01 Question & Context
  ├── 02 Background & Landscape
  ├── 03 Literature & Evidence
  ├── 04 Gap & Hypothesis
  ├── 05 Experimental Design
  ├── 06 Timeline & Proposal
  └── Quality Check
```

模块可以反复进入。修改上游内容时，系统提示下游内容可能需要重新检查。

## 6. 唯一黄金路径

### 6.1 路径概览

| 步骤 | 页面 | 用户动作 | 系统输出 | 面试展示重点 |
| --- | --- | --- | --- | --- |
| 0 | Projects | 打开预置项目或创建项目 | 项目卡片 | 不是聊天首页，而是研究项目 |
| 1 | Question & Context | 输入主题并回答澄清问题 | 研究问题和约束 | AI 先澄清，不直接生成 |
| 2 | Landscape | 查看领域地图 | 主题、路线、来源 | 研究现状可追溯 |
| 3 | Evidence | 查看证据台账 | 结论、条件、来源和冲突 | 核心差异化能力 |
| 4 | Gap & Hypothesis | 接受候选空白和假设 | Gap、Hypothesis、依据 | 区分事实和推断 |
| 5 | Design | 审核结构化方案 | 变量、对照、指标和风险 | AI 边界和人工控制 |
| 6 | Quality Check | 查看问题并确认 | 警告、覆盖率、待办 | 可信度设计 |
| 7 | Proposal | 预览和导出 | Proposal 初稿 | 完成用户任务 |

### 6.2 Demo 预置状态

为了保证面试演示稳定，Demo 可以提供 `Continue demo project` 入口。预置项目至少包含以下字段：

```yaml
project_type: thesis_proposal
topic: 生物3D打印在软骨组织工程中的应用
user_role: 生物工程硕士二年级
deadline: 12周
available_equipment:
  - 挤出式生物打印机
  - 基础细胞培养设备
known_constraints:
  - 尚未确定bioink配方
  - 需要在现有设备条件下完成
target_deliverable: Research Proposal
```

预置数据必须在界面标注为 `Demo workspace / curated sources`，不能暗示已连接完整生产数据库。

## 7. 页面与交互规格

### 7.1 Projects / 项目列表

#### 页面目的

让用户以研究项目为单位开始工作，强化产品不是普通 Chat。

#### 必备组件

- 产品名称和一句定位：`From research question to a reviewable proposal`。
- `New project`。
- `Continue demo project`。
- 项目卡片：名称、研究问题、目标输出、进度、更新时间和风险数量。
- 最近生成的 Proposal 版本。

#### 交互和状态

- 点击项目卡片进入 `Project Overview`。
- 新建项目进入问题澄清。
- 点击风险数量进入 Quality Check。
- 没有项目时显示创建项目和预置 Demo，不显示泛化宣传页。

### 7.2 Question & Context / 问题与背景

#### 页面目的

把宽泛主题收敛成有边界的研究问题，并收集影响方案可行性的约束。

#### 初始输入

- 多行输入：`What are you trying to investigate?`
- 目标输出：MVP 只开放 Research Proposal。
- 截止日期或周期。

#### 澄清问题

系统按缺失字段逐步询问，不一次显示长问卷。最低字段：

- 研究对象：细胞、组织或模型系统。
- 研究目标：性能、机制、比较或应用验证。
- 可用设备。
- 候选材料或 Bioink。
- 评价指标。
- 时间和资源约束。

#### 输出卡片

生成 `Working Research Question`，每个字段显示来源标签：`User provided`、`AI clarified` 或 `Needs confirmation`。

必备交互：

- `Edit question`。
- `Regenerate`。
- `Confirm question`。
- 修改后提示研究空白、假设、方案和时间线可能受影响。

#### 失败状态

- 输入过于宽泛：提示补充研究对象或目标。
- 条件缺失：允许浏览背景，但不允许直接生成实验方案。
- 模型无法收敛：显示两个候选问题，请用户选择。

### 7.3 Background & Landscape / 研究背景与领域地图

#### 页面目的

帮助用户理解研究方向，而不是输出一篇无法验证的综述。

#### 页面结构

- 研究主题摘要。
- 领域地图：材料、打印技术、设备、过程参数、结构性能、生物结果。
- 研究路线：每条路线显示关联来源数量和证据状态。
- 研究热点：显示时间范围和筛选标准。
- 机构信息仅作为可选视图，不做无来源排名。
- `Open evidence` 进入对应 Evidence Ledger。

#### 规则

- “代表性”必须说明依据，如相关性、近五年研究量或引用影响。
- “热点”必须显示数据范围和更新时间。
- 数据不足时显示 `Insufficient evidence`。
- 背景摘要中的关键句至少关联一条来源。

### 7.4 Literature & Evidence / 文献与证据

#### 页面目的

用户比较论文结论成立的条件，而不是只查看标题和摘要。

#### 文献列表字段

- 标题、作者、年份和 DOI/PMID/稳定链接。
- 类型：Review、Primary Study、Methods 或 Other。
- 与当前 Research Question 的相关性。
- 是否已提取证据。
- 用户标签和收藏状态。

操作：`Add source`、`Upload document`、`Filter by type`、`Filter by year`、`Save`、`Exclude`。

#### Evidence Ledger 字段

| 字段 | 要求 |
| --- | --- |
| Claim | 论文支持的结论 |
| Source | 文献身份和稳定标识 |
| Location | 页码、章节、表格或图注 |
| Condition | 细胞、材料、浓度、参数、培养时间等 |
| Metric | 评价指标和测量方法 |
| Result | 结果，保留原文范围和单位 |
| Limitation | 作者局限或系统推断的限制 |
| Evidence type | 原文事实、跨文献归纳、模型推断或待验证 |
| Strength | 高、中、低及判断原因 |
| Relation | 支持、冲突、不可直接比较 |

#### 证据详情抽屉

点击卡片显示原文摘录和位置、该证据被哪些 Claim/Gap/Hypothesis/Proposal 章节使用、相关冲突证据，以及 `Use in proposal`、`Mark for review`、`Reject` 操作。

#### 冲突视图

冲突必须展示双方条件差异：

```text
Paper A: 结果方向 + 条件 + 指标
Paper B: 结果方向 - 条件 + 指标
                 |
                 v
      条件差异 / 测量差异 / 样本差异 / 未知
```

无法解释时显示 `Conflict unresolved`，不能替用户下结论。

### 7.5 Gap & Hypothesis / 研究空白与假设

#### 研究空白类型

- `Unstudied`：在当前检索范围内未找到研究。
- `Underexplored`：研究数量少或条件覆盖有限。
- `Contradictory`：不同研究结果不一致。
- `Method limitation`：方法、指标或实验设计有限。
- `Translation gap`：实验结果尚未充分转化到应用条件。
- `Testable opportunity`：可以形成具体验证任务的候选机会。

#### Gap 卡片

- Gap 标题和类型。
- 证据摘要。
- 支持来源数量和反向证据数量。
- 适用条件和置信等级。
- 推理状态：文献事实、证据推断或待验证。
- `Accept`、`Modify`、`Reject`。

#### 假设卡片

假设必须连接到 Research Question、自变量和因变量、对照组、评价指标以及至少一个支持证据或待验证标记。状态显示：

```text
Candidate / User accepted / Needs expert review
Evidence coverage: 2 supporting sources / 1 unresolved conflict
```

### 7.6 Experimental Design / 实验方案

#### 方案字段

- Research Question。
- Hypothesis。
- Experimental groups 和 Control groups。
- Independent、Dependent、Controlled variables。
- Materials 和 Equipment。
- Process parameters。
- Methods overview。
- Evaluation metrics。
- Replicates and statistical plan。
- Expected result（必须与实际结果区分）。
- Risks and mitigations。
- Ethics / biosafety review required。

#### 参数来源标签

- `From source`：原始文献明确给出。
- `From user`：用户已有设备或资源条件。
- `AI suggestion`：模型根据证据提出，尚未确认。
- `Missing evidence`：没有足够来源。

#### 可行性检查

至少检查设备和打印技术是否匹配；材料、细胞、设备是否在约束内；关键参数是否有来源；变量是否过多；对照组是否缺失；时间线是否短于材料准备、培养或评价周期；统计计划是否缺少重复数或指标定义；是否需要伦理、生物安全或导师审批。

系统只能显示 `Draft`、`Requires expert review` 或 `Blocked by missing information`，不得显示“可直接执行”。

### 7.7 Timeline & Proposal / 时间线与提案

#### 时间线

每个任务包含名称、起止时间、前置依赖、负责人、所需资源、证据依据和风险状态。任务顺序通常为：

```text
问题收敛 -> 文献核查 -> 材料与设备确认 -> 预实验设计
-> 正式实验 -> 数据分析 -> 方案修订与写作
```

#### Proposal 章节

1. Background。
2. Research Landscape。
3. Research Gap。
4. Research Question and Hypothesis。
5. Experimental Design。
6. Innovation Opportunity。
7. Timeline。
8. Limitations and Review Items。
9. References。

编辑器要求：章节可单独重新生成；重新生成保留用户编辑，除非用户明确覆盖；关键句显示引用标记并可跳转 Evidence Ledger；待验证内容醒目标记；顶部显示 Proposal 状态和质量检查摘要。

## 8. 数据模型与对象关系

### 8.1 核心对象

| 对象 | 作用 | 必填字段 |
| --- | --- | --- |
| Project | 研究项目容器 | id、name、type、owner、status |
| ResearchQuestion | 当前研究问题 | text、scope、status、version |
| Constraint | 实验、时间和资源约束 | category、value、source |
| Source | 论文或上传文档 | title、type、year、identifier |
| Evidence | 来源中的可复核证据 | source_id、claim、location、conditions |
| Claim | 被 Proposal 使用的判断 | text、type、evidence_ids、status |
| ResearchGap | 研究空白或候选机会 | category、claim_ids、confidence |
| Hypothesis | 可验证假设 | text、gap_id、variables、status |
| ExperimentDesign | 结构化实验方案 | groups、variables、metrics、risks |
| Task | 研究计划任务 | title、duration、dependencies、status |
| Deliverable | Proposal 交付物 | sections、citations、quality_status |
| Version | 历史版本 | object_id、snapshot、created_at、actor |

### 8.2 对象关系

```text
Project
  -> ResearchQuestion
  -> Constraint
  -> Source
Source
  -> Evidence
Evidence
  -> Claim
Claim
  -> ResearchGap
  -> Hypothesis
  -> ExperimentDesign
ExperimentDesign
  -> Task
ResearchQuestion + Claim + Gap + Hypothesis + Design
  -> Deliverable
```

### 8.3 数据完整性规则

- Claim 没有 Source 或 Evidence 时，不能标记为 `evidence-backed`。
- Evidence 没有 Location 时，不能计入“可复核引用覆盖率”。
- Hypothesis 没有变量或指标时，标记为 `incomplete`。
- ExperimentDesign 没有 Controls 时触发警告，但允许保存草稿。
- Deliverable 含有 `AI suggestion` 或 `missing evidence` 时，必须显示待确认数量。
- 用户拒绝的对象保留在历史版本中，但不进入默认当前版本。
- 被新证据推翻的对象不能静默覆盖，状态应变为 `Superseded`。

## 9. 页面状态和状态机

### 9.1 项目状态

```text
Created
  -> Context incomplete
  -> Question draft
  -> Question confirmed
  -> Evidence gathering
  -> Synthesis ready
  -> Design draft
  -> Quality review
  -> Proposal ready for expert review
```

任一状态都可能进入：

```text
Blocked by missing information
Failed with retry available
Needs user decision
```

### 9.2 对象状态

```text
Generated
  -> User reviewed
  -> User accepted
  -> User modified
  -> User rejected
  -> Superseded by new evidence
```

### 9.3 页面通用状态

每一个 AI 任务都需要设计以下状态：

- `Idle`：尚未运行。
- `Generating`：正在生成，显示任务名称和预计步骤。
- `Partial result`：已生成部分内容，允许用户查看但不能误认为完成。
- `Ready`：结果可审阅。
- `Needs review`：存在来源、条件或质量问题。
- `Failed`：显示失败原因和重试入口。
- `Offline demo`：使用本地缓存结果，明确标识 Demo 模式。

## 10. 功能需求与验收标准

优先级定义：

- `P0`：黄金路径必需；没有它，Demo 或核心信任链无法完成。
- `P1`：高保真 Demo 应展示，生产 MVP 紧随实现。
- `P2`：长期增强，不进入首个面试 Demo。

### 10.1 项目与上下文

| ID | 优先级 | 需求 | 验收标准 |
| --- | --- | --- | --- |
| PRJ-01 | P0 | 创建 Proposal 项目 | 输入主题后生成项目，并保存主题、周期和输出类型 |
| PRJ-02 | P0 | 采集研究约束 | 至少保存用户身份、设备、材料、周期和目标输出 |
| PRJ-03 | P0 | 生成 Working Research Question | 问题包含研究对象、变量/比较对象和研究目标 |
| PRJ-04 | P0 | 用户确认问题 | 未确认时不允许生成正式 Proposal |
| PRJ-05 | P1 | 上游变更提示 | 修改问题后提示受影响的 Gap、假设、方案和时间线 |
| PRJ-06 | P1 | 断点恢复 | 重新打开项目后保留上次对象状态和页面位置 |

### 10.2 来源与检索

| ID | 优先级 | 需求 | 验收标准 |
| --- | --- | --- | --- |
| SRC-01 | P0 | 展示受控来源集 | 每个来源有标题、年份、类型和 DOI/PMID/稳定标识 |
| SRC-02 | P0 | 过滤和收藏 | 可按类型筛选，并收藏或排除来源 |
| SRC-03 | P0 | 证据定位 | 关键证据包含页码、章节、表格或图注位置 |
| SRC-04 | P1 | 上传文档入口 | Demo 显示上传、解析和完成状态，即使结果来自预置数据 |
| SRC-05 | P1 | 来源不足状态 | 来源不足时显示提示，不生成确定性结论 |
| SRC-06 | P1 | 检索解释 | 显示当前检索词、筛选条件和来源范围 |

### 10.3 证据与矛盾

| ID | 优先级 | 需求 | 验收标准 |
| --- | --- | --- | --- |
| EVD-01 | P0 | Evidence Ledger | 显示 Claim、Source、Location、Condition、Metric 和 Strength |
| EVD-02 | P0 | 证据类型标记 | 事实、归纳、推断和待验证四类可区分 |
| EVD-03 | P0 | 原文查看 | 点击后查看原文摘录和位置 |
| EVD-04 | P0 | 冲突关系 | 至少一组冲突展示双方条件和未解决状态 |
| EVD-05 | P1 | 证据进入 Proposal | 用户操作后，证据可被目标章节引用 |
| EVD-06 | P1 | 证据拒绝 | 被拒绝证据不进入默认当前 Proposal |
| EVD-07 | P1 | 条件筛选 | 用户可以按细胞、材料、参数或指标筛选证据 |

### 10.4 Gap、假设与实验设计

| ID | 优先级 | 需求 | 验收标准 |
| --- | --- | --- | --- |
| GAP-01 | P0 | Gap 分类 | 每个 Gap 属于规定的六类之一 |
| GAP-02 | P0 | Gap 证据链 | 显示支持、反向或缺失证据 |
| GAP-03 | P0 | 假设状态 | 显示 Candidate、Accepted 或 Needs review |
| DES-01 | P0 | 结构化设计 | 变量、组别、指标和设备以字段呈现 |
| DES-02 | P0 | 参数来源 | 每个关键参数显示来源标签 |
| DES-03 | P0 | 质量警告 | 对照缺失、来源缺失和周期风险可识别 |
| DES-04 | P1 | 用户修改 | 修改后保留修改痕迹并更新状态 |
| DES-05 | P1 | 设计比较 | 用户可比较两个候选设计的资源、风险和证据覆盖 |

### 10.5 Proposal 与导出

| ID | 优先级 | 需求 | 验收标准 |
| --- | --- | --- | --- |
| OUT-01 | P0 | Proposal 章节 | 默认章节存在并显示内容状态 |
| OUT-02 | P0 | 引用回链 | 关键段落可跳转到证据 |
| OUT-03 | P0 | 质量摘要 | 显示引用覆盖率、待验证项和阻塞项 |
| OUT-04 | P1 | 导出 Markdown | 包含章节、引用和待确认标记 |
| OUT-05 | P1 | 导出 DOCX/PDF | 生成可阅读文件，失败时有可恢复错误 |
| OUT-06 | P1 | 版本比较 | 显示当前 Proposal 与上一版本的修改摘要 |

## 11. AI 能力契约

### 11.1 AI 可以做什么

- 把自然语言主题拆成澄清问题。
- 根据受控来源集进行检索、归纳和比较。
- 从文献中提取 Claim、Condition、Metric 和 Limitation。
- 提出候选 Research Gap 和可验证 Hypothesis。
- 根据用户约束生成实验设计草稿、时间线和章节草稿。
- 对内容做引用覆盖、一致性和条件匹配检查。

### 11.2 AI 不可以做什么

- 编造来源、DOI、实验结果、机构或供应商。
- 把文献建议写成用户已经拥有的设备或材料。
- 把 Expected Result 写成 Observed Result。
- 把“检索范围内未找到”写成“领域从未研究”。
- 把不同细胞、材料、参数和培养条件下的结果直接合并。
- 对伦理、生物安全或临床问题给出无需人工审批的结论。

### 11.3 生成和验证分离

生成模块负责提出候选内容；验证模块负责检查：

- 是否有来源。
- 来源是否真的支持表述。
- 引用位置是否正确。
- 实验条件是否被保留。
- 是否存在反向证据。
- 是否把推断写成事实。

验证失败时，系统应降低状态或阻止进入 Proposal，而不是自动润色后继续输出。

### 11.4 结构化输出约束

模型不得只返回一段自由文本。保存层至少保留：

```json
{
  "claim": "...",
  "type": "fact | synthesis | inference | hypothesis",
  "sources": ["source_id"],
  "locations": ["page/section/table"],
  "conditions": ["..."],
  "metrics": ["..."],
  "confidence": "high | medium | low",
  "status": "generated | needs_review | accepted | rejected",
  "warnings": ["condition_mismatch"]
}
```

## 12. Demo 数据和模拟策略

### 12.1 允许模拟的部分

- 文献搜索结果：预置、已核验来源集。
- PDF 解析：预先提取并人工检查的段落、表格和页码。
- 论文冲突：预先准备的条件化冲突案例。
- AI 生成：确定性模板或固定响应，以保证现场稳定。
- 导出：静态 Markdown/HTML 预览。

### 12.2 必须真实体现的部分

- 页面之间的状态传递。
- 用户确认、修改和拒绝。
- 来源、位置、条件和证据状态展示。
- 质量检查和风险提示。
- 修改上游内容后的影响提示。
- 失败、加载和离线 Demo 状态。

### 12.3 数据质量规则

- 所有论文必须真实存在，并有 DOI、PMID 或稳定公开链接。
- 不使用未核验数字、参数或机构排名。
- 每个 Demo Claim 至少有一条原文位置。
- 为演示交互编写的内容必须标记为 `Illustrative`。
- 预置数据覆盖至少 6 条证据、1 组冲突、3 类 Gap、1 个方案风险和 1 个缺失来源警告。
- Demo 数据须保存来源清单，演示者能在面试中解释每条关键证据的出处。

### 12.4 不建议在 Demo 中现场依赖的能力

- 实时连接不稳定的论文数据库。
- 现场下载和解析未经测试的 PDF。
- 不可控的开放式 Agent 循环。
- 需要登录、付费或授权状态不确定的外部网站。
- 依赖网络才能展示的关键路径。

## 13. 技术方案边界

```text
Web UI
  -> Project API
      -> Workflow Orchestrator
          -> Clarification module
          -> Retrieval module
          -> Evidence extraction module
          -> Gap / hypothesis module
          -> Design checker
          -> Proposal renderer
      -> Project Store
      -> Source / Evidence Store
      -> Evaluation Logs
```

模块职责：

- `Document Ingestion`：解析正文、表格、图注、页码和引用关系。
- `Retrieval`：关键词检索、语义检索、元数据过滤和 reranking。
- `Evidence Service`：维护 Source-Evidence-Condition-Claim 关系。
- `Workflow Orchestrator`：按项目状态调用模块，避免 Agent 自由跳转导致状态丢失。
- `Design Checker`：执行确定性规则，不把所有检查交给语言模型。
- `Proposal Renderer`：从结构化对象渲染章节和引用。
- `Evaluation Logger`：记录输入、来源、输出、用户修改和评测结果。

### 13.1 MVP API 轮廓

接口名称可以调整，但能力边界必须保留：

```text
POST /projects
GET  /projects/:id
PATCH /projects/:id/context
POST /projects/:id/questions/draft
POST /projects/:id/questions/confirm
GET  /projects/:id/sources
POST /projects/:id/sources/search
POST /projects/:id/sources/upload
GET  /projects/:id/evidence
POST /projects/:id/gaps/generate
POST /projects/:id/hypotheses/generate
POST /projects/:id/design/check
POST /projects/:id/proposal/generate
POST /projects/:id/proposal/export
GET  /projects/:id/quality-check
```

### 13.2 可替换边界

- LLM 通过统一生成接口调用，不把模型厂商写死在业务对象中。
- Embedding/Reranking 可替换，检索结果保存版本。
- 文献源通过 Source Connector 接入，不让 UI 依赖某个数据库。
- Proposal JSON 作为中间格式，DOCX/PDF/Markdown 由渲染器生成。
- Demo 模式和生产模式通过同一套对象接口切换，而不是复制两套页面。

## 14. Quality Check 规格

| 检查项 | 触发条件 | 级别 | 用户动作 |
| --- | --- | --- | --- |
| Citation missing | 关键陈述没有 Evidence | Blocker | 补来源或改为待验证 |
| Location missing | 来源存在但没有位置 | High | 打开来源并补定位 |
| Condition mismatch | 方案条件与引用条件不一致 | High | 查看差异并确认适用性 |
| Conflict unresolved | 存在相反结果且无法解释 | High | 保留冲突并请求专家判断 |
| Control missing | 没有对照组 | High | 修改实验设计 |
| Timeline risk | 培养/准备周期超出截止日期 | Medium | 调整任务或日期 |
| Parameter unsupported | 关键参数只有 AI 建议 | Medium | 补来源或标为预实验 |
| Statistical plan incomplete | 缺少重复数或指标定义 | Medium | 请求导师/统计人员确认 |
| Ethics review required | 涉及受监管的细胞、动物等内容 | High | 标记需要机构审核 |

### 14.1 Proposal 质量状态

```text
Draft
  -> Review recommended
  -> Blocked by missing evidence
  -> Ready for expert review
```

`Ready for expert review` 只表示信息和引用检查通过，不表示实验方案科学正确或已获批准。

### 14.2 质量摘要展示

Proposal 页面顶部至少展示：

- `Evidence-backed claims`：有可追溯证据的关键 Claim 数量。
- `Citation coverage`：关键陈述中可回链引用的比例。
- `Needs confirmation`：需要用户、导师或实验人员确认的数量。
- `Blocking issues`：阻止形成可审阅初稿的问题数量。
- `Unresolved conflicts`：尚未解释的论文冲突数量。

## 15. 非功能需求

### 15.1 可信度

- 关键结论必须显示来源。
- 不能定位来源时显示 `Unknown` 或 `Needs source`。
- 不能用“高置信度”代替来源。
- 证据强度必须显示判断原因。
- 所有高风险建议显示人工确认边界。

### 15.2 隐私与安全

- 用户上传资料默认私有。
- Demo 数据与真实用户数据隔离。
- 不在日志中保存完整私人文档正文，除非得到明确授权。
- 删除项目时同时删除索引、向量和导出缓存。
- 生产版本明确数据保留期和模型训练用途。

### 15.3 性能和容错

- 项目页首屏目标不超过 3 秒展示缓存状态。
- 受控数据集检索首批结果目标不超过 5 秒。
- 长文档解析、批量提取和导出使用异步任务。
- 用户可以看到任务状态、失败原因和重试入口。
- 网络不可用时，Demo 可以切换到离线缓存并继续黄金路径。

### 15.4 可访问性和交互

- 状态不能只依赖颜色，必须同时显示文字或图标。
- Evidence 卡片内容可复制，引用位置可点击。
- 表格在窄屏幕上允许横向滚动，不挤压关键字段。
- 风险、待确认项和已接受项必须有明确的视觉层级。

## 16. 评测计划

### 16.1 离线测试集

至少准备：

- 20 个问题澄清样例。
- 30 篇已核验来源及对应原文位置。
- 50 条专家标注 Claim。
- 10 组正向支持关系。
- 10 组不同条件的冲突关系。
- 10 个来源不足或无法判断的案例。
- 10 个方案可行性风险案例。

### 16.2 指标

| 指标 | 定义 | MVP 目标 |
| --- | --- | --- |
| Citation support rate | 引用真正支持 Claim 的比例 | >= 90% |
| Location accuracy | 用户可在来源中复核定位的比例 | >= 90% |
| Condition retention | 关键条件正确保留的比例 | >= 90% |
| Conflict recall | 已知冲突被识别的比例 | >= 80% |
| Unsupported claim rate | 无依据确定性 Claim 的比例 | <= 5% |
| Task completion | 用户完成 Proposal 初稿的比例 | >= 70% |
| Time to first draft | 建项目到初稿的中位时长 | <= 30 分钟 |
| Review usefulness | 专家认为有助于审核的比例 | >= 80% |

### 16.3 人测任务

让 5-8 名目标用户完成相同任务，观察：

- 是否理解 Evidence Ledger。
- 是否能区分事实、推断和待验证。
- 是否会点击原文核查。
- 是否能发现一个方案风险。
- 是否会修改 AI 生成的假设。
- 是否愿意把 Proposal 交给导师审阅。

## 17. 埋点与学习计划

核心事件：

```text
project_created
context_field_completed
research_question_generated
research_question_confirmed
source_opened
evidence_expanded
conflict_opened
gap_accepted
gap_rejected
hypothesis_modified
design_warning_opened
quality_check_completed
proposal_exported
```

核心漏斗：

```text
创建项目 -> 确认问题 -> 打开证据 -> 接受 Gap -> 审核 Design -> 解决警告 -> 导出 Proposal
```

每一步都记录失败原因，不能只记录页面浏览量。

## 18. 版本、权限与恢复

- 项目自动保存。
- 修改 Claim、Gap、Hypothesis 或 Design 时创建版本快照。
- 当前版本、历史版本和被拒绝对象可区分。
- 用户可恢复到上一版本。
- MVP 只支持单用户 Owner，分享以只读导出替代多人协作。

## 19. 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 论文解析错误 | 错误引用或条件丢失 | 保留位置、人工抽查和用户纠正 |
| Gap 幻觉 | 用户形成错误方向 | 分类、证据等级、不确定性语言和反向检索 |
| 条件混用 | 方案不可复现 | Condition 作为 Claim 必填字段 |
| 现场模型不稳定 | Demo 无法演示 | 受控数据集、缓存响应和离线降级 |
| 用户过度信任 | 实验或伦理风险 | 状态、警告和专家审核边界 |
| 范围膨胀 | 无法按期完成 | P0/P1/P2 和阶段门槛 |
| 页面信息过载 | 用户看不懂证据链 | 默认摘要，按需展开详情 |
| 来源覆盖偏差 | 研究地图不完整 | 显示来源范围、时间和语言偏差 |

## 20. 里程碑

### M0：证据基础

确定 20-30 篇已核验 Demo 来源，完成证据定位模型、Source/Evidence 数据结构和至少一组冲突案例。

### M1：问题与检索

完成项目创建、上下文采集、问题澄清、受控检索、来源筛选和 Landscape 页面。

### M2：证据到方案

完成 Evidence Ledger、冲突视图、Gap、假设、实验设计、可行性检查和 Accept/Modify/Reject 状态。

### M3：完整高保真 Demo

完成 Proposal 编辑器、质量检查、Markdown 导出、响应缓存、离线演示模式和目标用户人测。

### M4：生产化评估

在决定接入真实检索、用户上传和 DOCX/PDF 导出前，完成来源许可、数据隔离、性能、成本和回归评测。

## 21. MVP 验收清单

- [ ] 用户可以从项目列表进入预置 Demo。
- [ ] 用户可以输入或修改研究问题。
- [ ] 用户可以看到 `User provided`、`AI clarified` 和 `Needs confirmation` 标签。
- [ ] 用户可以浏览研究地图并打开来源。
- [ ] 用户可以查看至少 6 条结构化证据。
- [ ] 至少一组冲突展示双方条件和未解决状态。
- [ ] 至少三类 Research Gap 可以被区分。
- [ ] 用户可以接受、修改和拒绝 Gap、假设和方案建议。
- [ ] 实验方案包含变量、对照、指标、设备、风险和参数来源。
- [ ] 质量检查可以展示来源缺失、条件不匹配或对照缺失。
- [ ] Proposal 可以预览，关键句可以回链到证据。
- [ ] Proposal 顶部显示引用覆盖率、待确认项和阻塞项。
- [ ] 导出结果包含引用和待确认标记。
- [ ] 现场没有网络或模型失败时仍能完成黄金路径。
- [ ] Demo 不展示虚构论文、虚构 DOI 或未经标注的虚构实验数据。

## 22. 面试演示脚本

### 22.1 开场（约 60 秒）

说明用户缺少的不是搜索入口，而是把证据转成可审核方案的工作流。强调产品不做“一句话生成实验方案”，而是先收集约束，再展示证据和不确定性。

### 22.2 主流程（约 5 分钟）

1. 打开项目列表，进入软骨组织工程项目。
2. 展示 Working Research Question 和用户约束。
3. 打开 Landscape，说明研究地图来自来源集。
4. 进入 Evidence Ledger，打开一条证据和一组冲突。
5. 进入 Gap & Hypothesis，接受一个 Gap 并修改假设措辞。
6. 进入 Experimental Design，指出一个参数来源和一个待确认风险。
7. 打开 Quality Check，说明为什么不让 AI 直接宣称方案可执行。
8. 进入 Proposal，展示引用回链并导出。

### 22.3 产品判断（约 2 分钟）

回答三个问题：

- 为什么先做 Bioprinting 垂直场景：需要先验证领域深度和证据质量。
- 为什么 Evidence Ledger 是核心：研究决策要求知道结论在哪些条件下成立。
- 为什么没有先做多 Agent 和供应商生态：这些依赖可信的证据与项目状态，不能先于核心价值。

### 22.4 结尾（约 1 分钟）

成功不是生成了多少字，而是用户能否更快完成一份有证据、可审查、明确标注待验证项的 Proposal。

## 23. 进入长期方向的条件

只有同时满足以下条件，才进入复杂项目管理和平台化：

- Citation support rate >= 90%。
- Location accuracy >= 90%。
- Unsupported claim rate <= 5%。
- 至少 70% 的测试用户完成 Proposal 初稿。
- 专家认可 Evidence Ledger 对审核有帮助。
- 用户能够理解 `AI suggestion` 和 `evidence-backed` 的区别。

未满足条件时，优先改进数据、检索、证据和交互，不新增领域和商业功能。
