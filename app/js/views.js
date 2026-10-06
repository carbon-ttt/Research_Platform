/* BioPrint Research Copilot — rendering layer. */
(function (global) {
  'use strict';

  const NS = (global.BioPrint = global.BioPrint || {});

  const NAV = [
    { id: 'overview', label: 'Project overview', icon: 'grid' },
    { id: 'question', label: 'Question & context', icon: 'question' },
    { id: 'knowledge', label: 'Knowledge base', icon: 'book' },
    { id: 'evidence', label: 'Evidence ledger', icon: 'lens' },
    { id: 'design', label: 'Design lab', icon: 'flask' },
    { id: 'proposal', label: 'Proposal', icon: 'doc' },
    { id: 'activity', label: 'Activity log', icon: 'pulse' }
  ];

  const GLYPH = {
    grid: '\u25c8',
    question: '?',
    book: '\u25a4',
    lens: '\u25cc',
    flask: '\u233f',
    doc: '\u25a7',
    pulse: '\u2197',
    plus: '+',
    arrow: '\u2192',
    up: '\u2191',
    down: '\u2193',
    check: '\u2713',
    warn: '!',
    clock: '\u25f7',
    search: '\u2315',
    edit: '\u270e',
    close: '\u00d7',
    spark: '\u2726',
    chevron: '\u2304',
    user: '\u25cf',
    logout: '\u21a9',
    print: '\u2399',
    reset: '\u21bb'
  };

  const EVIDENCE_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'fact', label: 'Fact' },
    { id: 'synthesis', label: 'Synthesis' },
    { id: 'review', label: 'Needs review' },
    { id: 'conflict', label: 'Conflict' }
  ];

  /* -------------------------------------------------------------- helpers */

  function escape(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function icon(name) {
    return '<span class="ic ic-' + name + '" aria-hidden="true">' + (GLYPH[name] || '\u2022') + '</span>';
  }

  function formatDate(value) {
    if (!value) return 'Not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function initials(name) {
    return String(name || 'RC')
      .split(' ')
      .filter(Boolean)
      .map(function (part) { return part.charAt(0); })
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  function pct(value) {
    return '<div class="meter"><span style="width:' + Math.max(0, Math.min(100, value)) + '%"></span></div>';
  }

  function toneForType(type) {
    const key = String(type || '').toLowerCase();
    if (key === 'fact') return 'blue';
    if (key === 'synthesis') return 'teal';
    if (key === 'inference') return 'purple';
    return 'slate';
  }

  function riskTone(level) {
    const key = String(level || '').toLowerCase();
    if (key === 'high') return 'high';
    if (key === 'low') return 'low';
    return 'medium';
  }

  function findSource(project, sourceId) {
    return (project.sources || []).find(function (item) { return item.id === sourceId; }) || null;
  }

  /* ------------------------------------------------------------ auth page */

  function authScreen(options) {
    const mode = options.mode === 'signup' ? 'signup' : 'login';
    const isLogin = mode === 'login';
    const busy = options.busy ? ' disabled' : '';
    const error = options.error
      ? '<div class="auth-error" role="alert">' + escape(options.error) + '</div>'
      : '';
    return '' +
      '<main class="auth">' +
        '<section class="auth-brand">' +
          '<div class="brand brand-invert">' +
            '<span class="brand-mark">B</span>' +
            '<span class="brand-text"><strong>BIOPRINT</strong><small>RESEARCH COPILOT</small></span>' +
          '</div>' +
          '<div class="auth-pitch">' +
            '<p class="eyebrow eyebrow-invert">RESEARCH WORKSPACE</p>' +
            '<h1>Turn a research question into a proposal you can defend.</h1>' +
            '<p class="auth-lede">Keep every claim attached to its source, its experimental conditions and the decision that depends on it.</p>' +
          '</div>' +
          '<ol class="auth-flow">' +
            '<li><span>01</span><strong>Scope</strong><small>Shape a testable question</small></li>' +
            '<li><span>02</span><strong>Record</strong><small>Log evidence with conditions</small></li>' +
            '<li><span>03</span><strong>Export</strong><small>Produce a reviewable HTML proposal</small></li>' +
          '</ol>' +
          '<p class="auth-foot">Local demo workspace · data stays in this browser</p>' +
        '</section>' +
        '<section class="auth-panel">' +
          '<div class="auth-form-wrap">' +
            '<div class="brand brand-mobile">' +
              '<span class="brand-mark">B</span>' +
              '<span class="brand-text"><strong>BIOPRINT</strong><small>RESEARCH COPILOT</small></span>' +
            '</div>' +
            '<p class="eyebrow">PRIVATE WORKSPACE</p>' +
            '<h2>' + (isLogin ? 'Welcome back' : 'Create your workspace') + '</h2>' +
            '<p class="auth-sub">' + (isLogin
              ? 'Sign in to continue your research projects.'
              : 'Set up a local workspace for your bioprinting research.') + '</p>' +
            error +
            '<form id="auth-form" class="form" data-mode="' + mode + '">' +
              (isLogin ? '' :
                '<label class="field"><span>Display name</span>' +
                '<input name="name" placeholder="e.g. Lin Chen" autocomplete="name" /></label>') +
              '<label class="field"><span>Email</span>' +
                '<input name="email" type="email" required autocomplete="username" ' +
                'value="' + (isLogin ? escape(NS.Store.DEMO_ACCOUNT.email) : '') + '" ' +
                'placeholder="you@lab.org" /></label>' +
              '<label class="field"><span>Password</span>' +
                '<input name="password" type="password" required autocomplete="' +
                (isLogin ? 'current-password' : 'new-password') + '" ' +
                'placeholder="' + (isLogin ? 'demo1234' : 'At least 8 characters') + '" /></label>' +
              '<button class="btn btn-primary btn-block" type="submit"' + busy + '>' +
                (isLogin ? 'Enter workspace' : 'Create workspace') + icon('arrow') +
              '</button>' +
            '</form>' +
            (isLogin
              ? '<div class="demo-card">' +
                  '<div class="demo-card-head">' + icon('spark') + '<span>Demo account</span></div>' +
                  '<code>' + escape(NS.Store.DEMO_ACCOUNT.email) + '</code>' +
                  '<code>' + escape(NS.Store.DEMO_ACCOUNT.password) + '</code>' +
                  '<button class="btn btn-ghost btn-small" type="button" data-action="fill-demo">Fill credentials</button>' +
                '</div>'
              : '') +
            '<p class="auth-switch">' +
              (isLogin ? 'New here?' : 'Already have a workspace?') + ' ' +
              '<button class="link" type="button" data-action="toggle-auth">' +
                (isLogin ? 'Create an account' : 'Sign in instead') +
              '</button>' +
            '</p>' +
            '<p class="auth-legal">Demo authentication. Passwords are hashed before they are stored in this browser, but this is not a production identity system.</p>' +
          '</div>' +
        '</section>' +
      '</main>';
  }

  /* ------------------------------------------------------------- app shell */

  function navCount(project, id) {
    if (id === 'knowledge') return project.sources.length ? String(project.sources.length) : '';
    if (id === 'evidence') {
      const count = project.evidence.filter(function (item) { return item.status === 'review'; }).length;
      return count ? String(count) : '';
    }
    if (id === 'design') {
      const count = project.design.risks.filter(function (risk) { return risk.status !== 'Resolved'; }).length;
      return count ? String(count) : '';
    }
    return '';
  }

  function appShell(context) {
    const user = context.user;
    const project = context.project;
    const projects = context.projects;
    const view = context.view;
    const progress = NS.Store.completion(project);
    const quality = NS.Store.qualityReport(project);
    const projectOptions = projects.map(function (item) {
      return '<option value="' + escape(item.id) + '"' + (item.id === project.id ? ' selected' : '') + '>' +
        escape(item.name) + '</option>';
    }).join('');
    return '' +
      '<div class="shell">' +
        '<aside class="sidebar" id="sidebar">' +
          '<div class="sidebar-head">' +
            '<div class="brand brand-invert">' +
              '<span class="brand-mark">B</span>' +
              '<span class="brand-text"><strong>BIOPRINT</strong><small>RESEARCH COPILOT</small></span>' +
            '</div>' +
            '<p class="workspace-tag">PERSONAL WORKSPACE <span class="dot-live"></span></p>' +
          '</div>' +
          '<div class="sidebar-body">' +
            '<button class="btn btn-outline btn-block" data-action="new-project">' + icon('plus') + 'New research project</button>' +
            '<p class="nav-label">Workspace</p>' +
            '<nav class="nav">' + NAV.slice(0, 6).map(function (item) {
              const count = navCount(project, item.id);
              return '<button class="nav-item' + (view === item.id ? ' is-active' : '') + '" data-view="' + item.id + '">' +
                icon(item.icon) + '<span>' + item.label + '</span>' +
                (count ? '<em>' + count + '</em>' : '') + '</button>';
            }).join('') + '</nav>' +
            '<p class="nav-label">Project</p>' +
            '<nav class="nav">' + NAV.slice(6).map(function (item) {
              return '<button class="nav-item' + (view === item.id ? ' is-active' : '') + '" data-view="' + item.id + '">' +
                icon(item.icon) + '<span>' + item.label + '</span></button>';
            }).join('') + '</nav>' +
          '</div>' +
          '<div class="sidebar-foot">' +
            '<div class="demo-flag"><span class="dot-live"></span><div><strong>Curated demo data</strong><small>Saved in this browser</small></div></div>' +
            '<button class="profile" data-action="account-menu">' +
              '<span class="avatar">' + escape(initials(user.name)) + '</span>' +
              '<span class="profile-text"><strong>' + escape(user.name) + '</strong><small>' + escape(user.role) + '</small></span>' +
              icon('chevron') +
            '</button>' +
          '</div>' +
        '</aside>' +
        '<main class="main">' +
          '<header class="topbar">' +
            '<div class="topbar-left">' +
              '<button class="icon-btn menu-btn" data-action="toggle-sidebar" aria-label="Toggle navigation">\u2630</button>' +
              '<div class="project-pick">' +
                '<span class="topbar-kicker">CURRENT PROJECT</span>' +
                '<select id="project-select" aria-label="Select project">' + projectOptions + '</select>' +
              '</div>' +
            '</div>' +
            '<div class="topbar-right">' +
              '<span class="save-chip">' + icon('check') + 'Saved locally</span>' +
              '<button class="icon-btn" data-action="go-search" aria-label="Search evidence">' + icon('search') + '</button>' +
              '<button class="btn btn-ghost btn-small" data-action="help">Help</button>' +
              '<span class="avatar avatar-sm">' + escape(initials(user.name)) + '</span>' +
            '</div>' +
          '</header>' +
          '<div class="content" id="content">' + renderView(view, project, quality, progress, context.ui) + '</div>' +
        '</main>' +
        (context.modal ? modal(context.modal, project, context.modalData) : '') +
        (context.toast ? toast(context.toast) : '') +
      '</div>';
  }

  function toast(data) {
    return '<div class="toast toast-' + escape(data.tone || 'ok') + '">' +
      icon(data.tone === 'warn' ? 'warn' : 'check') + '<span>' + escape(data.message) + '</span></div>';
  }

  function pageHead(eyebrow, title, lede, actions) {
    return '<div class="page-head">' +
      '<div class="page-head-text">' +
        '<p class="eyebrow">' + escape(eyebrow) + '</p>' +
        '<h1>' + escape(title) + '</h1>' +
        (lede ? '<p class="page-lede">' + escape(lede) + '</p>' : '') +
      '</div>' +
      (actions ? '<div class="page-actions">' + actions + '</div>' : '') +
      '</div>';
  }

  function renderView(view, project, quality, progress, ui) {
    if (view === 'question') return viewQuestion(project);
    if (view === 'knowledge') return viewKnowledge(project);
    if (view === 'evidence') return viewEvidence(project, ui);
    if (view === 'design') return viewDesign(project, quality);
    if (view === 'proposal') return viewProposal(project, quality);
    if (view === 'activity') return viewActivity(project);
    return viewOverview(project, quality, progress);
  }

  /* -------------------------------------------------------------- overview */

  function viewOverview(project, quality, progress) {
    const openRisks = project.design.risks.filter(function (risk) { return risk.status !== 'Resolved'; });
    const topIssues = quality.issues.slice(0, 3);
    const workflow = [
      { id: 'question', step: '01', title: 'Question', sub: 'Scope and constraints',
        state: project.question.status === 'confirmed' ? 'Confirmed' : 'Draft', tone: 'teal' },
      { id: 'knowledge', step: '02', title: 'Knowledge base', sub: 'Papers and notes',
        state: project.sources.length + ' sources', tone: 'blue' },
      { id: 'evidence', step: '03', title: 'Evidence', sub: 'Claims and conditions',
        state: project.evidence.length + ' records', tone: 'purple' },
      { id: 'design', step: '04', title: 'Design', sub: 'Groups, metrics, risks',
        state: openRisks.length + ' open', tone: 'amber' }
    ];
    return '' +
      pageHead('PROJECT OVERVIEW', project.name, project.topic + ' · ' + project.type,
        '<button class="btn btn-secondary" data-action="new-note">' + icon('plus') + 'Add note</button>' +
        '<button class="btn btn-primary" data-view="proposal">Open proposal' + icon('arrow') + '</button>') +
      '<div class="meta-row">' +
        '<span>' + icon('clock') + 'Updated ' + escape(formatDate(project.updatedAt)) + '</span>' +
        '<span>' + icon('doc') + 'Deadline ' + escape(formatDate(project.deadline)) + '</span>' +
        '<span class="tag-demo">DEMO WORKSPACE</span>' +
      '</div>' +
      '<section class="grid-hero">' +
        '<article class="card pad">' +
          '<div class="card-head">' +
            '<div><p class="card-kicker">WORKING RESEARCH QUESTION</p>' +
            '<h2 class="question-title">' + escape(project.question.text) + '</h2></div>' +
            '<span class="tag ' + (project.question.status === 'confirmed' ? 'tag-ok' : 'tag-warn') + '">' +
              icon(project.question.status === 'confirmed' ? 'check' : 'warn') +
              (project.question.status === 'confirmed' ? 'Confirmed' : 'Draft') + '</span>' +
          '</div>' +
          '<div class="provenance">' +
            '<span class="chip-ai">AI</span>' +
            '<span>' + escape(project.question.source) + '</span>' +
            '<button class="link" data-view="question">Edit question</button>' +
          '</div>' +
          '<div class="facts">' +
            factCell('Researcher profile', project.constraints.role) +
            factCell('Available setup', project.constraints.equipment) +
            factCell('Time window', project.constraints.window) +
            factCell('Open constraint', project.constraints.materials) +
          '</div>' +
          '<div class="card-foot"><button class="link" data-view="question">View project context' + icon('arrow') + '</button></div>' +
        '</article>' +
        '<article class="card pad readiness">' +
          '<div class="card-head">' +
            '<div><p class="card-kicker">PROPOSAL READINESS</p><h2 class="score">' + progress + '%</h2></div>' +
            '<span class="tag tag-ok">' + (quality.blocking ? quality.blocking + ' blockers' : 'On track') + '</span>' +
          '</div>' +
          pct(progress) +
          '<p class="muted">Evidence coverage ' + quality.citationCoverage + '% · ' +
            quality.needsReview + ' record(s) awaiting review.</p>' +
          '<ul class="readiness-list">' +
            readinessRow('Question scoped', project.question.status === 'confirmed') +
            readinessRow('Evidence recorded', project.evidence.length > 0) +
            readinessRow('Control group defined', project.design.groups.some(function (g) { return g.role === 'Control'; })) +
            readinessRow('Design risks resolved', openRisks.length === 0) +
          '</ul>' +
          '<button class="btn btn-secondary btn-block" data-view="design">Review open decisions' + icon('arrow') + '</button>' +
        '</article>' +
      '</section>' +
      '<section class="block">' +
        '<div class="block-head"><div><p class="eyebrow">WORKFLOW</p><h2>From question to reviewable proposal</h2></div>' +
        '<span class="muted">' + progress + '% complete</span></div>' +
        '<div class="grid-flow">' + workflow.map(function (item) {
          return '<button class="flow-card ' + item.tone + '" data-view="' + item.id + '">' +
            '<span class="flow-step">' + item.step + '</span>' +
            '<span class="flow-main"><strong>' + escape(item.title) + '</strong><small>' + escape(item.sub) + '</small></span>' +
            '<span class="flow-state">' + escape(item.state) + '</span>' + icon('arrow') + '</button>';
        }).join('') + '</div>' +
      '</section>' +
      '<section class="grid-two">' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">RECENT ACTIVITY</p><h2>Project memory</h2></div>' +
          '<button class="link" data-view="activity">Full log' + icon('arrow') + '</button></div>' +
          activityList(project.activity.slice(0, 5)) +
        '</article>' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">REVIEW QUEUE</p><h2>Resolve before export</h2></div>' +
          (topIssues.length ? '<span class="count-badge">' + quality.issues.length + '</span>' : '') + '</div>' +
          (topIssues.length
            ? topIssues.map(function (issue, index) {
                return '<div class="queue-row">' +
                  '<span class="queue-index">' + String(index + 1).padStart(2, '0') + '</span>' +
                  '<div><strong>' + escape(issue.title) + '</strong><p>' + escape(issue.detail) + '</p></div>' +
                  '<span class="risk-dot ' + riskTone(issue.level) + '"></span>' +
                '</div>';
              }).join('')
            : '<p class="muted">No open review items. The proposal is ready for expert reading.</p>') +
          '<button class="btn btn-secondary btn-block" data-view="evidence">Open evidence ledger' + icon('arrow') + '</button>' +
        '</article>' +
      '</section>';
  }

  function factCell(label, value) {
    return '<div class="fact"><span>' + escape(label) + '</span><strong>' + escape(value || 'Not set') + '</strong></div>';
  }

  function readinessRow(label, done) {
    return '<li><span class="tick ' + (done ? 'ok' : 'todo') + '">' + icon(done ? 'check' : 'warn') + '</span>' +
      '<span>' + escape(label) + '</span></li>';
  }

  function activityList(rows) {
    if (!rows.length) return '<p class="muted">No activity recorded yet.</p>';
    return '<ul class="activity">' + rows.map(function (row) {
      return '<li><span class="activity-dot ' + escape(row.tone || 'blue') + '"></span>' +
        '<div><strong>' + escape(row.text) + '</strong><small>' + escape(row.at) + '</small></div></li>';
    }).join('') + '</ul>';
  }

  /* -------------------------------------------------------------- question */

  function viewQuestion(project) {
    const c = project.constraints;
    return '' +
      pageHead('01 · QUESTION & CONTEXT', 'Make the question specific enough to test.',
        'The research question is a project object. Keep its assumptions visible and editable.',
        '<button class="btn btn-secondary" data-action="refine-question">' + icon('spark') + 'Refine with Copilot</button>') +
      '<div class="grid-main">' +
        '<div class="stack">' +
          '<form class="card pad" id="question-form">' +
            '<div class="card-head"><div><p class="card-kicker">WORKING RESEARCH QUESTION</p><h2>Scope the study</h2></div>' +
            '<span class="tag ' + (project.question.status === 'confirmed' ? 'tag-ok' : 'tag-warn') + '">' +
              icon(project.question.status === 'confirmed' ? 'check' : 'warn') +
              (project.question.status === 'confirmed' ? 'Confirmed' : 'Needs review') + '</span></div>' +
            '<label class="field"><span>Research question</span>' +
              '<textarea name="question" rows="5">' + escape(project.question.text) + '</textarea>' +
              '<small>Name the system, the variable or comparison, and the outcome you want to observe.</small></label>' +
            '<div class="provenance">' +
              '<span class="chip-ai">AI</span>' +
              '<div class="provenance-text"><strong>' + escape(project.question.source) + '</strong>' +
              '<small>Last edited ' + escape(project.question.lastEdited) + '</small></div>' +
              '<span class="tag tag-muted">Traceable</span>' +
            '</div>' +
            '<div class="form-actions">' +
              '<button class="btn btn-primary" type="submit">Save and confirm' + icon('check') + '</button>' +
              '<button class="btn btn-ghost" type="button" data-action="save-question-draft">Save as draft</button>' +
            '</div>' +
          '</form>' +
          '<form class="card pad" id="context-form">' +
            '<div class="card-head"><div><p class="card-kicker">PROJECT CONTEXT</p>' +
            '<h2>Constraints the Copilot should respect</h2></div></div>' +
            '<div class="field-grid">' +
              contextField('role', 'Researcher profile', c.role) +
              contextField('equipment', 'Available setup', c.equipment) +
              contextField('materials', 'Material status', c.materials) +
              contextField('window', 'Time window', c.window) +
              contextField('budget', 'Budget posture', c.budget) +
            '</div>' +
            '<div class="form-actions"><button class="btn btn-secondary" type="submit">Save context' + icon('check') + '</button></div>' +
          '</form>' +
        '</div>' +
        '<aside class="stack">' +
          '<article class="card pad accent-teal">' +
            '<div class="accent-icon">' + icon('spark') + '</div>' +
            '<p class="card-kicker">COPILOT CHECK</p>' +
            '<h2>A good question keeps the conditions visible.</h2>' +
            '<p class="muted">Before moving into design, check that the question reflects the real printer, the material options and the measurement window you actually have.</p>' +
            '<ul class="check-list">' +
              '<li>' + icon('check') + 'Names the biological system</li>' +
              '<li>' + icon('check') + 'Names the design variable</li>' +
              '<li class="warn">' + icon('warn') + 'Replicate plan still missing</li>' +
            '</ul>' +
          '</article>' +
          '<article class="card pad">' +
            '<div class="card-head"><div><p class="card-kicker">QUESTION HISTORY</p>' +
            '<h2>' + (project.question.status === 'confirmed' ? '1 confirmed version' : 'Draft in progress') + '</h2></div>' +
            icon('pulse') + '</div>' +
            '<div class="history-row"><span class="history-dot"></span><div>' +
              '<strong>Current question</strong><small>' + escape(project.question.lastEdited) + '</small></div></div>' +
          '</article>' +
        '</aside>' +
      '</div>';
  }

  function contextField(name, label, value) {
    return '<label class="field"><span>' + escape(label) + '</span>' +
      '<input name="' + escape(name) + '" value="' + escape(value || '') + '" /></label>';
  }

  /* ------------------------------------------------------------- knowledge */

  function viewKnowledge(project) {
    const stats = [
      { label: 'Sources in project', value: project.sources.length, note: 'Curated and user added' },
      { label: 'Evidence records', value: project.evidence.length, note: 'Condition aware' },
      { label: 'Awaiting review', value: project.evidence.filter(function (e) { return e.status === 'review'; }).length, note: 'Before export' },
      { label: 'Research notes', value: project.notes.length, note: 'Decisions and questions' }
    ];
    return '' +
      pageHead('02 · KNOWLEDGE BASE', 'Keep the research material close to the decision.',
        'A source library for papers, methods, advisor notes and project context.',
        '<button class="btn btn-secondary" data-action="new-source">' + icon('plus') + 'Add source</button>' +
        '<button class="btn btn-primary" data-view="evidence">Open ledger' + icon('arrow') + '</button>') +
      '<div class="grid-stats">' + stats.map(function (item) {
        return '<article class="stat"><span>' + escape(item.label) + '</span>' +
          '<strong>' + item.value + '</strong><small>' + escape(item.note) + '</small></article>';
      }).join('') + '</div>' +
      '<div class="grid-main">' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">PROJECT SOURCES</p><h2>Research library</h2></div>' +
          '<button class="icon-btn" data-action="new-source" aria-label="Add source">' + icon('plus') + '</button></div>' +
          (project.sources.length
            ? '<ul class="source-list">' + project.sources.map(function (item) {
                const badge = item.type === 'Primary study' ? 'P' : item.type === 'Review' ? 'R' : 'M';
                return '<li class="source-row">' +
                  '<span class="source-badge">' + badge + '</span>' +
                  '<div class="source-body">' +
                    '<strong>' + escape(item.title) + '</strong>' +
                    (item.note ? '<p>' + escape(item.note) + '</p>' : '') +
                    '<div class="source-meta"><span>' + escape(item.type) + '</span><span>' + escape(item.year) + '</span>' +
                    '<span>' + escape(item.venue) + '</span></div>' +
                  '</div>' +
                  '<div class="row-actions">' +
                    '<button class="icon-btn quiet" data-action="new-evidence" data-source="' + escape(item.id) + '" title="Record evidence from this source">' + icon('lens') + '</button>' +
                    '<button class="icon-btn quiet danger" data-action="delete-source" data-id="' + escape(item.id) + '" title="Remove source">' + icon('close') + '</button>' +
                  '</div>' +
                '</li>';
              }).join('') + '</ul>'
            : emptyState('No sources yet', 'Add the first paper, method note or internal document for this project.')) +
        '</article>' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">RESEARCH MEMORY</p><h2>Notes and decisions</h2></div>' +
          '<button class="btn btn-secondary btn-small" data-action="new-note">' + icon('plus') + 'Add note</button></div>' +
          (project.notes.length
            ? '<div class="note-list">' + project.notes.map(function (note) {
                return '<article class="note">' +
                  '<div class="note-top"><span class="tag tag-purple">' + escape(note.tag) + '</span>' +
                  '<small>' + escape(formatDate(note.createdAt)) + '</small>' +
                  '<button class="icon-btn quiet danger" data-action="delete-note" data-id="' + escape(note.id) + '" title="Delete note">' + icon('close') + '</button></div>' +
                  '<h3>' + escape(note.title) + '</h3><p>' + escape(note.body) + '</p>' +
                '</article>';
              }).join('') + '</div>'
            : emptyState('No notes yet', 'Record advisor feedback, decisions and open questions here.')) +
        '</article>' +
      '</div>';
  }

  function emptyState(title, body) {
    return '<div class="empty"><strong>' + escape(title) + '</strong><p>' + escape(body) + '</p></div>';
  }

  /* -------------------------------------------------------------- evidence */

  function filterEvidence(project, ui) {
    const filter = (ui && ui.evidenceFilter) || 'all';
    const query = String((ui && ui.evidenceQuery) || '').trim().toLowerCase();
    return project.evidence.filter(function (item) {
      if (filter === 'review' && item.status !== 'review') return false;
      if (filter === 'conflict' && item.relation !== 'conflict') return false;
      if (filter === 'fact' && item.type !== 'Fact') return false;
      if (filter === 'synthesis' && item.type !== 'Synthesis') return false;
      if (!query) return true;
      const source = findSource(project, item.sourceId);
      return [item.claim, item.condition, item.metric, item.location, source ? source.title : '']
        .join(' ')
        .toLowerCase()
        .indexOf(query) !== -1;
    });
  }

  function viewEvidence(project, ui) {
    const active = (ui && ui.evidenceFilter) || 'all';
    const rows = filterEvidence(project, ui);
    const conflicts = project.evidence.filter(function (item) { return item.relation === 'conflict'; });
    return '' +
      pageHead('03 · LITERATURE & EVIDENCE', 'Evidence ledger',
        'Every claim stays attached to its source, location, condition and confidence.',
        '<button class="btn btn-secondary" data-action="new-source">' + icon('plus') + 'Add source</button>' +
        '<button class="btn btn-primary" data-action="new-evidence">' + icon('plus') + 'Record evidence</button>') +
      '<div class="callout">' +
        '<span class="callout-icon">' + icon('lens') + '</span>' +
        '<div><strong>Evidence before fluency</strong>' +
        '<p>A claim enters the proposal only after you can inspect where it came from and under which conditions it was observed.</p></div>' +
        '<span class="callout-stat"><strong>' + project.evidence.length + '</strong><small>records</small></span>' +
      '</div>' +
      '<section class="card">' +
        '<div class="toolbar">' +
          '<div class="pills">' + EVIDENCE_FILTERS.map(function (item) {
            const count = item.id === 'review'
              ? project.evidence.filter(function (e) { return e.status === 'review'; }).length
              : 0;
            return '<button class="pill' + (active === item.id ? ' is-active' : '') + '" ' +
              'data-action="filter" data-filter="' + item.id + '">' + escape(item.label) +
              (count ? '<em>' + count + '</em>' : '') + '</button>';
          }).join('') + '</div>' +
          '<label class="search">' + icon('search') +
            '<input id="evidence-search" type="search" placeholder="Search claims, conditions, sources" ' +
            'value="' + escape((ui && ui.evidenceQuery) || '') + '" /></label>' +
        '</div>' +
        '<div class="table-wrap">' +
          '<table class="table">' +
            '<thead><tr><th>Claim</th><th>Source</th><th>Condition / metric</th><th>Type</th><th>Strength</th><th>Status</th><th></th></tr></thead>' +
            '<tbody id="evidence-body">' +
              (rows.length ? rows.map(function (item) { return evidenceRow(project, item); }).join('')
                : '<tr><td colspan="7" class="empty-cell">No evidence matches this view.</td></tr>') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</section>' +
      (conflicts.length >= 2
        ? '<section class="block">' +
            '<div class="block-head"><div><p class="eyebrow">CONDITION-AWARE COMPARISON</p>' +
            '<h2>Conflicting findings need conditions, not averaging</h2></div>' +
            '<button class="link" data-action="filter" data-filter="conflict">Show conflicts only' + icon('arrow') + '</button></div>' +
            '<div class="conflict">' +
              '<div class="conflict-side">' +
                '<span class="conflict-label">' + escape((findSource(project, conflicts[0].sourceId) || {}).title || '') + '</span>' +
                '<strong>' + escape(conflicts[0].claim) + '</strong>' +
                '<small>' + escape(conflicts[0].condition) + '</small>' +
              '</div>' +
              '<div class="conflict-mid">' + icon('warn') +
                '<strong>Not directly comparable</strong>' +
                '<small>Different conditions must be resolved by a human</small>' +
              '</div>' +
              '<div class="conflict-side">' +
                '<span class="conflict-label">' + escape((findSource(project, conflicts[1].sourceId) || {}).title || '') + '</span>' +
                '<strong>' + escape(conflicts[1].claim) + '</strong>' +
                '<small>' + escape(conflicts[1].condition) + '</small>' +
              '</div>' +
            '</div>' +
          '</section>'
        : '');
  }

  function evidenceRow(project, item) {
    const source = findSource(project, item.sourceId);
    return '<tr>' +
      '<td><div class="claim"><span class="claim-dot ' + (item.relation === 'conflict' ? 'is-conflict' : '') + '"></span>' +
        '<div><strong>' + escape(item.claim) + '</strong><small>' + escape(item.location || 'No location recorded') + '</small></div></div></td>' +
      '<td><span class="source-title">' + escape(source ? source.title : 'Source removed') + '</span>' +
        '<small class="source-year">' + escape(source ? source.year + ' · ' + source.type : '') + '</small></td>' +
      '<td><div class="cell-stack"><span>' + escape(item.condition || 'Not specified') + '</span>' +
        '<small>' + escape(item.metric || 'No metric') + '</small></div></td>' +
      '<td><span class="type-tag ' + toneForType(item.type) + '">' + escape(item.type) + '</span></td>' +
      '<td><span class="strength ' + String(item.strength).toLowerCase() + '"><i></i>' + escape(item.strength) + '</span></td>' +
      '<td><span class="status-tag ' + (item.status === 'review' ? 'review' : 'ok') + '">' +
        (item.status === 'review' ? 'Needs review' : 'In proposal') + '</span></td>' +
      '<td><div class="row-actions">' +
        '<button class="icon-btn quiet" data-action="evidence-detail" data-id="' + escape(item.id) + '" title="Open">' + icon('chevron') + '</button>' +
        '<button class="icon-btn quiet danger" data-action="delete-evidence" data-id="' + escape(item.id) + '" title="Delete">' + icon('close') + '</button>' +
      '</div></td>' +
    '</tr>';
  }

  /* ---------------------------------------------------------------- design */

  function viewDesign(project, quality) {
    const design = project.design;
    const openRisks = design.risks.filter(function (risk) { return risk.status !== 'Resolved'; });
    return '' +
      pageHead('04 · EXPERIMENTAL DESIGN', 'Design lab',
        'Review the study as a set of decisions. The Copilot proposes a structure; you decide what is defensible.',
        '<button class="btn btn-secondary" data-action="design-check">' + icon('check') + 'Run quality check</button>' +
        '<button class="btn btn-primary" data-action="save-hypothesis">' + icon('check') + 'Save hypothesis</button>') +
      '<div class="banner ' + (openRisks.length ? 'banner-warn' : 'banner-ok') + '">' +
        '<span class="banner-icon">' + icon(openRisks.length ? 'warn' : 'check') + '</span>' +
        '<div><strong>' + (openRisks.length ? 'Requires expert review' : 'No open design risks') + '</strong>' +
        '<p>' + (openRisks.length
          ? openRisks.length + ' open decision(s) remain before this plan can be treated as reviewable.'
          : 'All recorded design risks are resolved. This still needs supervisor sign-off.') + '</p></div>' +
        '<span class="tag ' + (openRisks.length ? 'tag-warn' : 'tag-ok') + '">' +
          (quality.blocking + ' blocking item(s)') + '</span>' +
      '</div>' +
      '<div class="grid-two">' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">CANDIDATE HYPOTHESIS</p>' +
          '<h2>What should this study test?</h2></div>' +
          '<span class="tag tag-warn">' + escape(design.hypothesisStatus) + '</span></div>' +
          '<textarea id="hypothesis-input" class="editor" rows="6" placeholder="Write the hypothesis the study will test...">' +
            escape(design.hypothesis) + '</textarea>' +
          '<div class="provenance"><span class="chip-ai">AI</span><span>Derived from the accepted research gaps</span>' +
            '<button class="link" data-view="evidence">Inspect evidence' + icon('arrow') + '</button></div>' +
        '</article>' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">EXPERIMENTAL GROUPS</p>' +
          '<h2>Compare before you commit</h2></div>' +
          '<button class="icon-btn" data-action="new-group" aria-label="Add group">' + icon('plus') + '</button></div>' +
          (design.groups.length
            ? '<table class="table compact"><thead><tr><th>Group</th><th>Role</th><th>Basis</th><th>Status</th><th></th></tr></thead><tbody>' +
              design.groups.map(function (group) {
                const confirmed = group.status === 'confirmed';
                return '<tr><td><strong>' + escape(group.name) + '</strong></td>' +
                  '<td><span class="role-tag ' + (group.role === 'Control' ? 'control' : 'exp') + '">' + escape(group.role) + '</span></td>' +
                  '<td class="muted">' + escape(group.basis) + '</td>' +
                  '<td><button class="link" data-action="toggle-group" data-id="' + escape(group.id) + '">' +
                    icon(confirmed ? 'check' : 'warn') + (confirmed ? 'Confirmed' : 'Review') + '</button></td>' +
                  '<td><button class="icon-btn quiet danger" data-action="delete-group" data-id="' + escape(group.id) + '" title="Remove group">' + icon('close') + '</button></td>' +
                '</tr>';
              }).join('') + '</tbody></table>'
            : emptyState('No groups yet', 'Define at least one control and one experimental condition.')) +
        '</article>' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">VARIABLES & METRICS</p>' +
          '<h2>What changes and what gets measured?</h2></div></div>' +
          tagSection('Independent variables', design.variables, 'variable', 'blue') +
          tagSection('Evaluation metrics', design.metrics, 'metric', 'teal') +
          '<form class="inline-add" data-kind="variable">' +
            '<input name="value" placeholder="Add an independent variable" />' +
            '<button class="btn btn-secondary btn-small" type="submit">Add</button>' +
          '</form>' +
          '<form class="inline-add" data-kind="metric">' +
            '<input name="value" placeholder="Add an evaluation metric" />' +
            '<button class="btn btn-secondary btn-small" type="submit">Add</button>' +
          '</form>' +
        '</article>' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">DESIGN RISKS</p>' +
          '<h2>Open decisions before execution</h2></div>' +
          '<span class="count-badge">' + openRisks.length + '</span></div>' +
          (design.risks.length
            ? '<ul class="risk-list">' + design.risks.map(function (risk) {
                const resolved = risk.status === 'Resolved';
                return '<li class="risk-row">' +
                  '<span class="risk-flag ' + riskTone(risk.level) + '">' + icon(resolved ? 'check' : 'warn') + '</span>' +
                  '<div><strong>' + escape(risk.text) + '</strong>' +
                  '<small>' + escape(risk.level) + ' priority · ' + escape(risk.status) + '</small></div>' +
                  '<div class="row-actions">' +
                    '<button class="icon-btn quiet" data-action="toggle-risk" data-id="' + escape(risk.id) + '" title="' +
                      (resolved ? 'Reopen' : 'Resolve') + '">' + icon(resolved ? 'reset' : 'check') + '</button>' +
                    '<button class="icon-btn quiet danger" data-action="delete-risk" data-id="' + escape(risk.id) + '" title="Remove">' + icon('close') + '</button>' +
                  '</div>' +
                '</li>';
              }).join('') + '</ul>'
            : emptyState('No risks recorded', 'Record what could invalidate the design before you run it.')) +
          '<form class="inline-add" data-kind="risk">' +
            '<input name="value" placeholder="Record a design risk" />' +
            '<button class="btn btn-secondary btn-small" type="submit">Add risk</button>' +
          '</form>' +
        '</article>' +
      '</div>';
  }

  function tagSection(label, items, kind, tone) {
    return '<div class="tag-section"><span class="tag-section-label">' + escape(label) + '</span>' +
      '<div class="tag-list">' +
        (items.length
          ? items.map(function (item, index) {
              return '<span class="data-tag ' + tone + '">' + escape(item) +
                '<button type="button" data-action="remove-' + kind + '" data-index="' + index + '" aria-label="Remove">\u00d7</button></span>';
            }).join('')
          : '<span class="muted">Nothing recorded yet.</span>') +
      '</div></div>';
  }

  /* -------------------------------------------------------------- proposal */

  function viewProposal(project, quality) {
    const sections = [
      { id: 'sec-background', label: 'Background' },
      { id: 'sec-landscape', label: 'Research landscape' },
      { id: 'sec-gap', label: 'Research gap' },
      { id: 'sec-question', label: 'Question & hypothesis' },
      { id: 'sec-design', label: 'Experimental design' },
      { id: 'sec-timeline', label: 'Timeline' },
      { id: 'sec-review', label: 'Review items' },
      { id: 'sec-references', label: 'References' }
    ];
    const accepted = project.evidence.filter(function (item) { return item.status === 'accepted'; });
    return '' +
      pageHead('05 · PROPOSAL', 'Research proposal',
        'A reviewable draft with evidence links and the decisions that still need a human sign-off.',
        '<button class="btn btn-secondary" data-action="preview-proposal">' + icon('print') + 'Preview</button>' +
        '<button class="btn btn-primary" data-action="export-proposal">' + icon('down') + 'Export HTML</button>') +
      '<div class="proposal-bar">' +
        '<div class="proposal-state"><span class="state-dot"></span><strong>Draft · ready for review</strong>' +
        '<span>' + project.evidence.length + ' evidence · ' + project.sources.length + ' sources</span></div>' +
        '<div class="proposal-quality">' +
          '<span class="ok">' + icon('check') + quality.citationCoverage + '% evidence coverage</span>' +
          (quality.issues.length
            ? '<span class="warn">' + icon('warn') + quality.issues.length + ' review item(s)</span>'
            : '<span class="ok">' + icon('check') + 'No open review items</span>') +
        '</div>' +
      '</div>' +
      '<div class="proposal-layout">' +
        '<aside class="card outline">' +
          '<p class="card-kicker">DOCUMENT OUTLINE</p>' +
          '<nav>' + sections.map(function (section, index) {
            return '<button class="outline-item" data-action="jump" data-target="' + section.id + '">' +
              '<span>' + String(index + 1).padStart(2, '0') + '</span>' + escape(section.label) + '</button>';
          }).join('') + '</nav>' +
          '<div class="outline-foot"><span>Evidence coverage</span>' + pct(quality.citationCoverage) +
            '<strong>' + quality.citationCoverage + '%</strong></div>' +
        '</aside>' +
        '<article class="paper">' + proposalDocument(project, quality, accepted) + '</article>' +
      '</div>';
  }

  function proposalDocument(project, quality, accepted) {
    const groups = project.design.groups || [];
    const risks = project.design.risks || [];
    const openRisks = risks.filter(function (risk) { return risk.status !== 'Resolved'; });
    return '' +
      '<div class="paper-cover">' +
        '<span class="paper-label">RESEARCH PROPOSAL · DRAFT</span>' +
        '<h2>' + escape(project.question.text) + '</h2>' +
        '<p>' + escape(project.name) + ' · ' + escape(project.topic) + '</p>' +
        '<p class="paper-meta">Type ' + escape(project.type) + ' · Deadline ' + escape(formatDate(project.deadline)) +
          ' · Generated ' + escape(formatDate(new Date().toISOString())) + '</p>' +
        '<span class="paper-rule"></span>' +
        '<span class="paper-disclaimer">AI-assisted working draft · For advisor review · Not an approved experimental protocol</span>' +
      '</div>' +
      '<section id="sec-background" class="paper-section">' +
        '<span class="paper-num">01</span><div>' +
        '<h3>Background</h3>' +
        '<p>Bioprinting for cartilage tissue engineering couples material behaviour, printing fidelity and the early biological response. The recorded evidence suggests that no single formulation or parameter choice can be read independently from the cell model, the crosslinking window and the assay timing.</p>' +
        citationRow(accepted.slice(0, 3)) +
        '</div></section>' +
      '<section id="sec-landscape" class="paper-section">' +
        '<span class="paper-num">02</span><div>' +
        '<h3>Research landscape</h3>' +
        '<p>The project sits inside an extrusion workflow where bioink formulation, nozzle geometry and print speed interact. Reviews provide the field map, methods sources provide parameter context, and primary studies provide condition-specific outcomes.</p>' +
        '<div class="paper-grid">' +
          paperCell('Sources recorded', project.sources.length + '') +
          paperCell('Evidence records', project.evidence.length + '') +
          paperCell('Accepted evidence', accepted.length + '') +
          paperCell('Open conflicts', quality.unresolvedConflicts + '') +
        '</div>' +
        '</div></section>' +
      '<section id="sec-gap" class="paper-section">' +
        '<span class="paper-num">03</span><div>' +
        '<h3>Research gap</h3>' +
        (project.gaps.length
          ? '<ul class="paper-gaps">' + project.gaps.map(function (gap) {
              return '<li><span class="paper-tag">' + escape(gap.category) + '</span>' +
                '<strong>' + escape(gap.title) + '</strong>' +
                '<p>' + escape(gap.summary) + '</p>' +
                '<small>Confidence ' + escape(gap.confidence) + ' · ' +
                  escape(gap.status === 'accepted' ? 'accepted as a working direction' : 'candidate, not yet accepted') +
                '</small></li>';
            }).join('') + '</ul>'
          : '<p>No research gap has been recorded for this project yet.</p>') +
        '<div class="paper-note">This proposal treats the gaps above as <strong>testable opportunities</strong>, not as proven novelty claims.</div>' +
        '</div></section>' +
      '<section id="sec-question" class="paper-section">' +
        '<span class="paper-num">04</span><div>' +
        '<h3>Question and hypothesis</h3>' +
        '<p>' + escape(project.question.text) + '</p>' +
        (project.design.hypothesis
          ? '<p class="paper-hypothesis">' + escape(project.design.hypothesis) +
            ' <span class="paper-tag">' + escape(project.design.hypothesisStatus) + '</span></p>'
          : '<p class="muted">No hypothesis recorded yet.</p>') +
        '</div></section>' +
      '<section id="sec-design" class="paper-section">' +
        '<span class="paper-num">05</span><div>' +
        '<h3>Experimental design</h3>' +
        (groups.length
          ? '<table class="paper-table"><thead><tr><th>Group</th><th>Role</th><th>Basis</th></tr></thead><tbody>' +
            groups.map(function (group) {
              return '<tr><td>' + escape(group.name) + '</td><td>' + escape(group.role) + '</td><td>' + escape(group.basis) + '</td></tr>';
            }).join('') + '</tbody></table>'
          : '<p>No experimental groups recorded yet.</p>') +
        '<div class="paper-grid">' +
          paperCell('Independent variables', (project.design.variables || []).join(', ') || 'Not set') +
          paperCell('Evaluation metrics', (project.design.metrics || []).join(', ') || 'Not set') +
        '</div>' +
        (openRisks.length
          ? '<div class="paper-warn"><strong>' + openRisks.length + ' open design risk(s)</strong><ul>' +
            openRisks.map(function (risk) { return '<li>' + escape(risk.text) + ' · ' + escape(risk.level) + '</li>'; }).join('') +
            '</ul></div>'
          : '') +
        '</div></section>' +
      '<section id="sec-timeline" class="paper-section">' +
        '<span class="paper-num">06</span><div>' +
        '<h3>Timeline</h3>' +
        (project.tasks.length
          ? '<table class="paper-table"><thead><tr><th>Window</th><th>Task</th><th>Status</th></tr></thead><tbody>' +
            project.tasks.map(function (task) {
              return '<tr><td>' + escape(task.window) + '</td><td>' + escape(task.label) + '</td><td>' + escape(task.status) + '</td></tr>';
            }).join('') + '</tbody></table>'
          : '<p>No timeline recorded yet.</p>') +
        '</div></section>' +
      '<section id="sec-review" class="paper-section">' +
        '<span class="paper-num">07</span><div>' +
        '<h3>Review items</h3>' +
        (quality.issues.length
          ? '<ul class="paper-review">' + quality.issues.map(function (issue) {
              return '<li><span class="risk-dot ' + riskTone(issue.level) + '"></span>' + escape(issue.title) +
                ' <small>' + escape(issue.detail) + '</small></li>';
            }).join('') + '</ul>'
          : '<p>All recorded checks pass. This still requires supervisor sign-off.</p>') +
        '</div></section>' +
      '<section id="sec-references" class="paper-section">' +
        '<span class="paper-num">08</span><div>' +
        '<h3>References</h3>' +
        (project.sources.length
          ? '<ol class="paper-refs">' + project.sources.map(function (item) {
              return '<li>' + escape(item.title) + '<span> · ' + escape(item.year) + ' · ' + escape(item.venue) + '</span>' +
                (item.url ? ' · <a href="' + escape(item.url) + '" target="_blank" rel="noopener">link</a>' : '') + '</li>';
            }).join('') + '</ol>'
          : '<p>No references recorded yet.</p>') +
        '<p class="paper-foot">Demo references are curated for interface evaluation. Verify every source and experimental condition before real-world use.</p>' +
        '</div></section>';
  }

  function paperCell(label, value) {
    return '<div class="paper-cell"><span>' + escape(label) + '</span><strong>' + escape(value) + '</strong></div>';
  }

  function citationRow(items) {
    if (!items.length) return '<p class="paper-cite muted">No accepted evidence linked yet.</p>';
    return '<p class="paper-cite">' + items.map(function (item, index) {
      return '<span class="cite-chip" title="' + escape(item.claim) + '">E' + (index + 1) + '</span>';
    }).join('') + '<span>Evidence linked · conditions preserved</span></p>';
  }

  /* -------------------------------------------------------------- activity */

  function viewActivity(project) {
    return '' +
      pageHead('PROJECT MEMORY', 'Activity log',
        'Every meaningful decision stays visible: what changed, when, and what it affected.',
        '<button class="btn btn-secondary" data-action="new-note">' + icon('plus') + 'Add note</button>' +
        '<button class="btn btn-ghost" data-action="export-json">' + icon('down') + 'Export records (JSON)</button>') +
      '<div class="grid-main">' +
        '<article class="card pad">' +
          '<div class="card-head"><div><p class="card-kicker">RECENT CHANGES</p>' +
          '<h2>' + project.activity.length + ' recorded event(s)</h2></div>' +
          '<span class="tag tag-ok">' + icon('check') + 'Local history on</span></div>' +
          (project.activity.length
            ? '<ol class="timeline">' + project.activity.map(function (row, index) {
                return '<li class="timeline-row">' +
                  '<span class="timeline-dot ' + escape(row.tone || 'blue') + '">' + (index === 0 ? icon('spark') : icon('check')) + '</span>' +
                  '<div><strong>' + escape(row.text) + '</strong><span>' + escape(row.at) + '</span>' +
                  '<p>Stored in this project version and available for review.</p></div></li>';
              }).join('') + '</ol>'
            : emptyState('No activity yet', 'Changes you make will appear here.')) +
        '</article>' +
        '<aside class="card pad dark">' +
          '<p class="card-kicker">WHY RECORDS MATTER</p>' +
          '<h2>Research is iterative</h2>' +
          '<p class="muted-invert">The workspace keeps each decision next to the evidence that produced it, so a later revision does not erase the reasoning behind the earlier one.</p>' +
          '<ul class="principle-list">' +
            '<li>' + icon('lens') + '<span><strong>Traceable</strong><small>Claims link back to sources.</small></span></li>' +
            '<li>' + icon('pulse') + '<span><strong>Recorded</strong><small>Changes stay visible.</small></span></li>' +
            '<li>' + icon('user') + '<span><strong>Private</strong><small>Data stays in this browser.</small></span></li>' +
          '</ul>' +
        '</aside>' +
      '</div>';
  }

  /* --------------------------------------------------------------- modals */

  function modal(kind, project, data) {
    return '<div class="overlay" data-action="close-modal">' +
      '<div class="modal" role="dialog" aria-modal="true">' + modalBody(kind, project, data) + '</div></div>';
  }

  function modalHead(kicker, title, sub) {
    return '<div class="modal-head"><div><p class="card-kicker">' + escape(kicker) + '</p>' +
      '<h2>' + escape(title) + '</h2>' + (sub ? '<p class="modal-sub">' + escape(sub) + '</p>' : '') + '</div>' +
      '<button class="icon-btn" data-action="close-modal" aria-label="Close">' + icon('close') + '</button></div>';
  }

  function modalBody(kind, project, data) {
    if (kind === 'new-project') {
      return modalHead('NEW PROJECT', 'Start a research workspace', 'Keep the first version focused on one research question.') +
        '<form id="new-project-form" class="form">' +
          '<label class="field"><span>Project name</span><input name="name" required placeholder="e.g. Bioink screening study" /></label>' +
          '<label class="field"><span>Research topic</span><textarea name="topic" rows="3" required placeholder="e.g. Extrusion bioprinting for cartilage tissue engineering"></textarea></label>' +
          '<div class="field-grid two">' +
            '<label class="field"><span>Deadline</span><input name="deadline" type="date" /></label>' +
            '<label class="field"><span>Time window</span><input name="window" placeholder="e.g. 12 weeks" /></label>' +
          '</div>' +
          '<label class="field"><span>Researcher profile</span><input name="role" placeholder="e.g. Biological engineering MSc" /></label>' +
          '<div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" type="submit">Create project' + icon('arrow') + '</button></div>' +
        '</form>';
    }
    if (kind === 'new-source') {
      return modalHead('KNOWLEDGE BASE', 'Add a source', 'Record a paper, method, dataset or internal document.') +
        '<form id="source-form" class="form">' +
          '<label class="field"><span>Source title</span><input name="title" required placeholder="Paper or document title" /></label>' +
          '<div class="field-grid two">' +
            '<label class="field"><span>Type</span><select name="type">' +
              '<option>Review</option><option>Primary study</option><option>Methods</option><option>Internal note</option>' +
            '</select></label>' +
            '<label class="field"><span>Year</span><input name="year" type="number" min="1900" max="2100" value="' + new Date().getFullYear() + '" /></label>' +
          '</div>' +
          '<label class="field"><span>Stable link or DOI (optional)</span><input name="url" placeholder="https://doi.org/..." /></label>' +
          '<label class="field"><span>Why is this useful?</span>' +
            '<textarea name="note" rows="3" placeholder="Which decision or section can this source support?"></textarea></label>' +
          '<div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" type="submit">Save source' + icon('check') + '</button></div>' +
        '</form>';
    }
    if (kind === 'new-evidence') {
      const selected = data && data.sourceId ? data.sourceId : (project.sources[0] ? project.sources[0].id : '');
      if (!project.sources.length) {
        return modalHead('EVIDENCE LEDGER', 'Add a source first', 'Evidence has to point at a recorded source.') +
          '<p class="muted">This project has no sources yet. Add a paper or document, then record evidence from it.</p>' +
          '<div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Close</button>' +
          '<button class="btn btn-primary" type="button" data-action="new-source">Add a source</button></div>';
      }
      return modalHead('EVIDENCE LEDGER', 'Record a claim with conditions', 'Keep the claim reviewable before it is used in the proposal.') +
        '<form id="evidence-form" class="form">' +
          '<label class="field"><span>Claim</span>' +
            '<textarea name="claim" rows="2" required placeholder="What does this source support?"></textarea></label>' +
          '<div class="field-grid two">' +
            '<label class="field"><span>Source</span><select name="sourceId">' +
              project.sources.map(function (item) {
                return '<option value="' + escape(item.id) + '"' + (item.id === selected ? ' selected' : '') + '>' +
                  escape(item.title.slice(0, 60)) + '</option>';
              }).join('') + '</select></label>' +
            '<label class="field"><span>Evidence type</span><select name="type">' +
              '<option>Fact</option><option>Synthesis</option><option>Inference</option></select></label>' +
          '</div>' +
          '<label class="field"><span>Location</span>' +
            '<input name="location" placeholder="e.g. p. 5 · Results, or Fig. 2" /></label>' +
          '<label class="field"><span>Condition</span>' +
            '<textarea name="condition" rows="2" placeholder="Cell model, material, parameter, assay timing..."></textarea></label>' +
          '<div class="field-grid three">' +
            '<label class="field"><span>Metric</span><input name="metric" placeholder="e.g. cell viability" /></label>' +
            '<label class="field"><span>Strength</span><select name="strength"><option>Medium</option><option>High</option><option>Low</option></select></label>' +
            '<label class="field"><span>Relation</span><select name="relation"><option value="supports">Supports</option><option value="conflict">Conflicts with other evidence</option></select></label>' +
          '</div>' +
          '<div class="modal-note">New evidence is saved as <strong>needs review</strong>. It enters the proposal only after you accept it.</div>' +
          '<div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" type="submit">Add to ledger' + icon('check') + '</button></div>' +
        '</form>';
    }
    if (kind === 'new-note') {
      return modalHead('RESEARCH MEMORY', 'Add a research note', 'Capture a decision, an advisor comment, or an open question.') +
        '<form id="note-form" class="form">' +
          '<label class="field"><span>Note title</span><input name="title" required placeholder="e.g. Advisor meeting · 17 Sep" /></label>' +
          '<label class="field"><span>Tag</span><select name="tag">' +
            '<option>Advisor note</option><option>Evidence gap</option><option>Decision</option><option>Experiment log</option>' +
          '</select></label>' +
          '<label class="field"><span>Note</span><textarea name="body" rows="5" required placeholder="Write the context and the next action..."></textarea></label>' +
          '<div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" type="submit">Save note' + icon('check') + '</button></div>' +
        '</form>';
    }
    if (kind === 'new-group') {
      return modalHead('EXPERIMENTAL DESIGN', 'Add a group', 'Define what is compared against what.') +
        '<form id="group-form" class="form">' +
          '<label class="field"><span>Group name</span><input name="name" required placeholder="e.g. Higher crosslinking window" /></label>' +
          '<label class="field"><span>Role</span><select name="role"><option>Experimental</option><option>Control</option></select></label>' +
          '<label class="field"><span>Basis</span><input name="basis" placeholder="e.g. Candidate design from evidence E2" /></label>' +
          '<div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" type="submit">Add group' + icon('check') + '</button></div>' +
        '</form>';
    }
    if (kind === 'evidence-detail') {
      const item = (project.evidence || []).find(function (entry) { return entry.id === data.id; });
      if (!item) return modalHead('EVIDENCE', 'Record not found', '');
      const source = findSource(project, item.sourceId);
      return modalHead('EVIDENCE DETAIL · ' + String(item.type).toUpperCase(), item.claim, '') +
        '<div class="detail-grid">' +
          detailCell('Source', source ? source.title : 'Source removed') +
          detailCell('Location', item.location || 'Not recorded') +
          detailCell('Condition', item.condition || 'Not recorded') +
          detailCell('Metric', item.metric || 'Not recorded') +
          detailCell('Strength', item.strength) +
          detailCell('Relation', item.relation === 'conflict' ? 'Conflicts with other evidence' : 'Supports the direction') +
        '</div>' +
        '<div class="excerpt"><p class="card-kicker">CURATED EXCERPT</p>' +
          '<p>This demo represents the source excerpt as a reviewed note. Connect the source document to show the exact paragraph, table or figure in production.</p>' +
          '<small>' + escape(item.location || '') + (source ? ' · ' + escape(source.venue) : '') + '</small></div>' +
        '<div class="modal-actions between">' +
          '<div class="row-actions">' +
            '<button class="icon-btn quiet" data-action="edit-evidence" data-id="' + escape(item.id) + '" title="Edit location and condition">' + icon('edit') + '</button>' +
            '<button class="icon-btn quiet danger" data-action="delete-evidence-modal" data-id="' + escape(item.id) + '" title="Delete record">' + icon('close') + '</button>' +
          '</div>' +
          (item.status === 'review'
            ? '<button class="btn btn-ghost" data-action="set-evidence-review" data-id="' + escape(item.id) + '">Keep as review</button>'
            : '<button class="btn btn-ghost" data-action="set-evidence-review" data-id="' + escape(item.id) + '">Mark for review</button>') +
          '<button class="btn btn-primary" data-action="set-evidence-accepted" data-id="' + escape(item.id) + '">' +
            'Use in proposal' + icon('arrow') + '</button>' +
        '</div>';
    }
    if (kind === 'edit-evidence') {
      const item = (project.evidence || []).find(function (entry) { return entry.id === data.id; });
      if (!item) return modalHead('EVIDENCE', 'Record not found', '');
      return modalHead('EDIT EVIDENCE', 'Location and condition', 'A claim without conditions cannot be transferred safely.') +
        '<form id="edit-evidence-form" class="form" data-id="' + escape(item.id) + '">' +
          '<label class="field"><span>Claim</span><textarea name="claim" rows="2" required>' + escape(item.claim) + '</textarea></label>' +
          '<label class="field"><span>Location</span><input name="location" value="' + escape(item.location) + '" /></label>' +
          '<label class="field"><span>Condition</span><textarea name="condition" rows="2">' + escape(item.condition) + '</textarea></label>' +
          '<div class="field-grid two">' +
            '<label class="field"><span>Metric</span><input name="metric" value="' + escape(item.metric) + '" /></label>' +
            '<label class="field"><span>Strength</span><select name="strength">' +
              ['High', 'Medium', 'Low'].map(function (level) {
                return '<option' + (item.strength === level ? ' selected' : '') + '>' + level + '</option>';
              }).join('') + '</select></label>' +
          '</div>' +
          '<div class="modal-actions"><button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" type="submit">Save changes' + icon('check') + '</button></div>' +
        '</form>';
    }
    if (kind === 'account') {
      return modalHead('ACCOUNT', 'Local workspace', 'This demo keeps accounts and research records in this browser only.') +
        '<div class="detail-grid">' +
          detailCell('Signed in as', data.email) +
          detailCell('Profile', data.name + ' · ' + data.role) +
        '</div>' +
        '<div class="modal-actions between">' +
          '<div class="row-actions">' +
            '<button class="btn btn-ghost btn-small" data-action="export-json">' + icon('down') + 'Export records</button>' +
            '<button class="btn btn-ghost btn-small" data-action="reset-demo">' + icon('reset') + 'Reset demo data</button>' +
          '</div>' +
          '<button class="btn btn-secondary" data-action="logout">Sign out</button>' +
        '</div>';
    }
    if (kind === 'help') {
      return modalHead('HOW THIS DEMO WORKS', 'A ten minute walkthrough',
        'This workspace shows the research reasoning, not a production literature pipeline.') +
        '<ol class="help-list">' +
          '<li><strong>Scope the question</strong><span>Use Copilot to sharpen a broad topic, then confirm it yourself.</span></li>' +
          '<li><strong>Record sources</strong><span>Add papers or notes to the knowledge base.</span></li>' +
          '<li><strong>Log evidence</strong><span>Each claim keeps its location, condition, metric and strength.</span></li>' +
          '<li><strong>Review the design</strong><span>Groups, metrics and risks stay explicit and editable.</span></li>' +
          '<li><strong>Export HTML</strong><span>Download a standalone proposal that includes the review items.</span></li>' +
        '</ol>' +
        '<p class="modal-note">Search results, PDF parsing and the conflict detection shown here are curated for the demo. No production database is connected.</p>' +
        '<div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">Got it</button></div>';
    }
    return modalHead('NOTICE', 'Nothing to show', '');
  }

  function detailCell(label, value) {
    return '<div class="detail-cell"><span>' + escape(label) + '</span><strong>' + escape(value) + '</strong></div>';
  }

  /* -------------------------------------------------------- HTML export -- */

  function proposalHtml(context) {
    const project = context.project;
    const user = context.user;
    const quality = NS.Store.qualityReport(project);
    const accepted = project.evidence.filter(function (item) { return item.status === 'accepted'; });
    const openRisks = project.design.risks.filter(function (risk) { return risk.status !== 'Resolved'; });
    const generated = new Date().toISOString();

    const evidenceRows = project.evidence.map(function (item) {
      const source = findSource(project, item.sourceId);
      return '<tr>' +
        '<td>' + escape(item.claim) + '</td>' +
        '<td>' + escape(source ? source.title : 'Source removed') + '</td>' +
        '<td>' + escape(item.location || 'Not recorded') + '</td>' +
        '<td>' + escape(item.condition || 'Not recorded') + '</td>' +
        '<td>' + escape(item.metric || 'Not recorded') + '</td>' +
        '<td>' + escape(item.type) + '</td>' +
        '<td>' + escape(item.strength) + '</td>' +
        '<td>' + (item.status === 'accepted' ? 'In proposal' : 'Needs review') + '</td>' +
      '</tr>';
    }).join('');

    const groupRows = project.design.groups.map(function (group) {
      return '<tr><td>' + escape(group.name) + '</td><td>' + escape(group.role) + '</td><td>' + escape(group.basis) + '</td></tr>';
    }).join('');

    const taskRows = project.tasks.map(function (task) {
      return '<tr><td>' + escape(task.window) + '</td><td>' + escape(task.label) + '</td><td>' + escape(task.status) + '</td></tr>';
    }).join('');

    const gapItems = project.gaps.map(function (gap) {
      return '<li><span class="tag">' + escape(gap.category) + '</span><strong>' + escape(gap.title) + '</strong>' +
        '<p>' + escape(gap.summary) + '</p>' +
        '<small>Confidence ' + escape(gap.confidence) + ' · ' +
        escape(gap.status === 'accepted' ? 'accepted as a working direction' : 'candidate, not yet accepted') + '</small></li>';
    }).join('');

    const reviewItems = quality.issues.map(function (issue) {
      return '<li><span class="dot ' + riskTone(issue.level) + '"></span><strong>' + escape(issue.title) + '</strong>' +
        '<span>' + escape(issue.detail) + '</span></li>';
    }).join('');

    const refs = project.sources.map(function (item) {
      return '<li>' + escape(item.title) + ' <span>' + escape(item.year) + ' · ' + escape(item.venue) + '</span>' +
        (item.url ? ' <a href="' + escape(item.url) + '">link</a>' : '') + '</li>';
    }).join('');

    return '<!doctype html>\n' +
      '<html lang="en"><head><meta charset="utf-8" />' +
      '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
      '<title>' + escape(project.name) + ' · Research Proposal</title>' +
      '<style>' + proposalCss() + '</style></head><body>' +
      '<main class="doc">' +
        '<header class="cover">' +
          '<p class="kicker">RESEARCH PROPOSAL · DRAFT</p>' +
          '<h1>' + escape(project.question.text) + '</h1>' +
          '<p class="meta">' + escape(project.name) + ' · ' + escape(project.topic) + '</p>' +
          '<p class="meta">Prepared by ' + escape(user.name) + ' · ' + escape(user.role) + ' · Generated ' + escape(generated.slice(0, 10)) + '</p>' +
          '<p class="disclaimer">AI-assisted working draft · For advisor review · Not an approved experimental protocol</p>' +
        '</header>' +
        '<section class="summary">' +
          '<div><span>Evidence records</span><strong>' + project.evidence.length + '</strong></div>' +
          '<div><span>Accepted into proposal</span><strong>' + accepted.length + '</strong></div>' +
          '<div><span>Evidence coverage</span><strong>' + quality.citationCoverage + '%</strong></div>' +
          '<div><span>Open review items</span><strong>' + quality.issues.length + '</strong></div>' +
        '</section>' +
        '<h2>1. Background</h2>' +
        '<p>Bioprinting for cartilage tissue engineering couples material behaviour, printing fidelity and the early biological response. The recorded evidence suggests that no single formulation or parameter choice can be read independently from the cell model, the crosslinking window and the assay timing.</p>' +
        '<h2>2. Research landscape</h2>' +
        '<p>The project sits inside an extrusion workflow where bioink formulation, nozzle geometry and print speed interact. Reviews provide the field map, methods sources provide parameter context, and primary studies provide condition-specific outcomes.</p>' +
        '<p class="note">Topic: ' + escape(project.topic) + ' · Deadline: ' + escape(formatDate(project.deadline)) +
        ' · Researcher profile: ' + escape(project.constraints.role) + '</p>' +
        '<h2>3. Research gap</h2>' +
        (gapItems ? '<ul class="gaps">' + gapItems + '</ul>' : '<p>No research gap has been recorded yet.</p>') +
        '<p class="note">These gaps are treated as <strong>testable opportunities</strong>, not as proven novelty claims.</p>' +
        '<h2>4. Question and hypothesis</h2>' +
        '<p class="question">' + escape(project.question.text) + '</p>' +
        (project.design.hypothesis
          ? '<p class="hypothesis">' + escape(project.design.hypothesis) +
            ' <span class="tag warn">' + escape(project.design.hypothesisStatus) + '</span></p>'
          : '<p>No hypothesis recorded yet.</p>') +
        '<h2>5. Experimental design</h2>' +
        (groupRows
          ? '<table><thead><tr><th>Group</th><th>Role</th><th>Basis</th></tr></thead><tbody>' + groupRows + '</tbody></table>'
          : '<p>No experimental groups recorded yet.</p>') +
        '<p><strong>Independent variables:</strong> ' + escape((project.design.variables || []).join(', ') || 'Not set') + '</p>' +
        '<p><strong>Evaluation metrics:</strong> ' + escape((project.design.metrics || []).join(', ') || 'Not set') + '</p>' +
        (openRisks.length
          ? '<div class="warn-box"><strong>' + openRisks.length + ' open design risk(s)</strong><ul>' +
            openRisks.map(function (risk) { return '<li>' + escape(risk.text) + ' · ' + escape(risk.level) + ' priority</li>'; }).join('') +
            '</ul></div>'
          : '') +
        '<h2>6. Timeline</h2>' +
        (taskRows
          ? '<table><thead><tr><th>Window</th><th>Task</th><th>Status</th></tr></thead><tbody>' + taskRows + '</tbody></table>'
          : '<p>No timeline recorded yet.</p>') +
        '<h2>7. Evidence ledger</h2>' +
        (evidenceRows
          ? '<table class="ledger"><thead><tr><th>Claim</th><th>Source</th><th>Location</th><th>Condition</th><th>Metric</th><th>Type</th><th>Strength</th><th>Status</th></tr></thead><tbody>' + evidenceRows + '</tbody></table>'
          : '<p>No evidence recorded yet.</p>') +
        '<h2>8. Review items</h2>' +
        (reviewItems ? '<ul class="review">' + reviewItems + '</ul>' : '<p>All recorded checks pass. Supervisor sign-off is still required.</p>') +
        '<h2>9. References</h2>' +
        (refs ? '<ol class="refs">' + refs + '</ol>' : '<p>No references recorded yet.</p>') +
        '<footer class="foot">' +
          '<p>Generated by BioPrint Research Copilot · local demo build. Curated demo references are for interface evaluation only. Verify every source, condition and parameter before real-world use.</p>' +
        '</footer>' +
      '</main></body></html>';
  }

  function proposalCss() {
    return [
      '*{box-sizing:border-box}',
      'body{margin:0;background:#eef2f4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Arial,sans-serif;color:#1b2f3d;line-height:1.65}',
      '.doc{max-width:920px;margin:0 auto;background:#fff;padding:64px 72px 72px;box-shadow:0 20px 60px rgba(20,45,60,.09)}',
      '.cover{border-bottom:3px solid #238a78;padding-bottom:26px;margin-bottom:34px}',
      '.kicker{font-size:11px;letter-spacing:.18em;color:#238a78;font-weight:800;margin:0 0 16px}',
      'h1{font-size:31px;line-height:1.2;margin:0 0 16px;letter-spacing:-.02em}',
      '.meta{color:#6d8090;font-size:13px;margin:4px 0}',
      '.disclaimer{display:inline-block;margin-top:18px;background:#fff4e5;color:#9a641d;font-size:12px;padding:7px 12px;border-radius:4px;font-weight:600}',
      '.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:30px 0 40px}',
      '.summary div{background:#f5f8f9;border:1px solid #e2eaee;border-radius:6px;padding:14px}',
      '.summary span{display:block;font-size:11px;color:#7b8d99;margin-bottom:6px}',
      '.summary strong{font-size:22px}',
      'h2{font-size:19px;margin:38px 0 12px;padding-bottom:8px;border-bottom:1px solid #e2eaee}',
      'p{color:#3d5666;font-size:14px}',
      '.note{background:#f5f8f9;border-left:3px solid #94a9b5;padding:12px 16px;font-size:13px;border-radius:0 4px 4px 0}',
      '.question{font-size:16px;font-weight:600;color:#16303f}',
      '.hypothesis{background:#f4f1fa;border-left:3px solid #7d68a8;padding:13px 16px;border-radius:0 4px 4px 0}',
      '.tag{display:inline-block;background:#eef2f4;color:#5d7383;font-size:11px;padding:3px 8px;border-radius:3px;font-weight:700}',
      '.tag.warn{background:#fff4e5;color:#9a641d}',
      'table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12.5px}',
      'th{background:#f5f8f9;text-align:left;padding:10px;border-bottom:1px solid #e2eaee;color:#5d7383;font-size:11px;letter-spacing:.06em;text-transform:uppercase}',
      'td{padding:10px;border-bottom:1px solid #eef2f4;vertical-align:top;color:#3d5666}',
      '.ledger td{font-size:11.5px}',
      '.gaps{list-style:none;padding:0}',
      '.gaps li{border:1px solid #e2eaee;border-radius:6px;padding:16px;margin-bottom:12px}',
      '.gaps li strong{display:block;margin:8px 0 6px;font-size:14px}',
      '.gaps li p{margin:0 0 8px;font-size:13px}',
      '.gaps li small{color:#7b8d99;font-size:11.5px}',
      '.warn-box{background:#fff8ec;border:1px solid #f0dcbb;border-radius:6px;padding:14px 18px;margin:18px 0}',
      '.warn-box ul{margin:8px 0 0;padding-left:18px;font-size:13px;color:#8a6329}',
      '.review{list-style:none;padding:0}',
      '.review li{display:flex;gap:10px;align-items:baseline;padding:9px 0;border-bottom:1px solid #eef2f4;font-size:13px}',
      '.review li span:last-child{color:#6d8090;font-size:12px}',
      '.dot{width:8px;height:8px;border-radius:50%;flex:none;display:inline-block}',
      '.dot.high{background:#d07a2f}.dot.medium{background:#d8a642}.dot.low{background:#8fa3ae}',
      '.refs{font-size:13px;color:#3d5666;padding-left:20px}',
      '.refs li{margin-bottom:8px}',
      '.refs span{color:#7b8d99}',
      '.refs a{color:#238a78}',
      '.foot{margin-top:48px;border-top:1px solid #e2eaee;padding-top:20px}',
      '.foot p{font-size:11.5px;color:#8598a4}',
      '@media print{body{background:#fff}.doc{box-shadow:none;padding:0}h2{page-break-after:avoid}}',
      '@media (max-width:720px){.doc{padding:28px 20px}.summary{grid-template-columns:1fr 1fr}h1{font-size:24px}}'
    ].join('');
  }

  NS.Views = {
    NAV: NAV,
    EVIDENCE_FILTERS: EVIDENCE_FILTERS,
    escape: escape,
    icon: icon,
    formatDate: formatDate,
    initials: initials,
    authScreen: authScreen,
    appShell: appShell,
    modal: modal,
    proposalHtml: proposalHtml,
    filterEvidence: filterEvidence
  };
})(typeof window !== 'undefined' ? window : globalThis);
