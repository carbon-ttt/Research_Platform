# Research Platform

面向生物 3D 打印研究者的 AI 研究工作台：「从研究问题到可审核的研究提案」。

本仓库包含两部分：产品文档（`docs/`）和可直接运行的 MVP Demo（`app/`）。

## 仓库结构

```text
.
├── docs/
│   ├── bioprinter_research_proposal_copilot_mvp_prd.md   MVP 产品需求文档
│   └── research_intelligence_platform_long_term_prd.md  长期平台化方向
└── app/                                                  可运行的 MVP Demo
    ├── index.html
    ├── styles.css
    ├── js/
    │   ├── store.js     数据层：账号、项目、记录的读写与校验
    │   ├── views.js     渲染层：页面、弹窗、HTML 提案导出
    │   └── app.js       交互层：事件绑定与状态流转
    └── tools/
        └── smoke-test.js
```

## 快速开始

```bash
cd app
python3 -m http.server 4173
```

打开 <http://localhost:4173>。

演示账号：

```text
邮箱：demo@bioprint.local
密码：demo1234
```

也可以直接双击 `app/index.html`，但通过本地服务器访问更稳定。

## 这个 Demo 做什么

它不是文献搜索工具，也不是聊天机器人。核心差别在于：**每个结论都必须带着它的来源和实验条件**。

**登录** — 本地注册与登录，密码加盐哈希后存储，数据按账号隔离。

**记录** — 研究项目、研究问题（Copilot 澄清后由用户确认）、项目约束、文献来源、证据台账、研究备注、实验设计、研究空白和活动日志。

**证据台账** — 每条 Claim 记录来源、页码或图表位置、实验条件、评价指标、证据强度、类型（事实 / 归纳 / 推断）以及与其他研究的支持或冲突关系，并在「待审核 → 纳入提案」之间流转。

**导出 HTML** — 一键生成独立的 HTML 研究提案，内联样式，可直接打开或打印为 PDF。包含研究背景、研究空白、假设、实验设计、时间线、完整证据台账、待审核清单和参考文献，草稿状态与未解决冲突都会如实标注。另可导出项目记录的 JSON。

## 测试

```bash
cd app
node tools/smoke-test.js
```

覆盖登录、密码校验、账号隔离、记录增删改、证据状态流转、过滤搜索、页面与弹窗渲染、HTML 导出内容，以及界面动作与数据层 API 的一致性检查。

## 产品文档

- [MVP 产品需求文档](docs/bioprinter_research_proposal_copilot_mvp_prd.md) — 范围、黄金路径、页面规格、数据模型、验收标准
- [长期平台化方向](docs/research_intelligence_platform_long_term_prd.md) — 平台分层、演进路线、Ontology、Agent、商业化与阶段门槛

## 范围与边界

当前版本是用于验证产品判断的高保真原型，**不连接**后端、论文数据库或模型服务。

- 账号与项目记录保存在浏览器 `localStorage`（键名 `bioprint.workspace.v2`）
- 演示用的文献、实验条件和冲突案例是面向界面评审准备的教学素材，不是真实检索结果
- 搜索为本地文本匹配，不是语义检索或 RAG
- 文档解析、领域 Ontology、多 Agent 编排不在本版本范围内
- 本地认证仅用于演示，不具备生产级会话管理、找回密码或多设备同步

接入生产环境前，需要替换为真实数据源，并补齐引用核验、权限体系和评测集。

## 技术说明

前端零依赖、无构建步骤，使用原生 JavaScript 与 HTML template 字符串渲染。数据层通过单一 store 模块统一读写，便于后续替换为真实后端接口。
