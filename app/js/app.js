/* BioPrint Research Copilot — application shell and event wiring. */
(function (global) {
  'use strict';

  const NS = global.BioPrint;
  const Store = NS.Store;
  const Views = NS.Views;
  const root = document.querySelector('#app');

  const app = {
    user: null,
    authMode: 'login',
    authError: '',
    busy: false,
    view: 'overview',
    modal: null,
    modalData: null,
    toast: null,
    toastTimer: null
  };

  /* --------------------------------------------------------------- render */

  function render() {
    if (!app.user) {
      root.innerHTML = Views.authScreen({ mode: app.authMode, error: app.authError, busy: app.busy });
      return;
    }
    const projects = Store.listProjects();
    const project = Store.getActiveProject();
    if (!project) {
      root.innerHTML = renderEmptyWorkspace(projects);
      return;
    }
    root.innerHTML = Views.appShell({
      user: app.user,
      projects: projects,
      project: project,
      view: app.view,
      ui: Store.getUI(),
      modal: app.modal,
      modalData: app.modalData,
      toast: app.toast
    });
  }

  function renderEmptyWorkspace(projects) {
    return '' +
      '<div class="empty-workspace">' +
        '<div class="empty-card">' +
          '<div class="brand">' +
            '<span class="brand-mark">B</span>' +
            '<span class="brand-text"><strong>BIOPRINT</strong><small>RESEARCH COPILOT</small></span>' +
          '</div>' +
          '<h1>Start your first research project</h1>' +
          '<p>Create a project for your own topic, or load the curated cartilage tissue engineering demo to see the full workflow.</p>' +
          '<div class="empty-actions">' +
            '<button class="btn btn-primary" data-action="new-project">' + Views.icon('plus') + 'New research project</button>' +
            '<button class="btn btn-secondary" data-action="load-demo">' + Views.icon('spark') + 'Load demo workspace</button>' +
          '</div>' +
          (projects.length ? '<p class="muted">Signed in as ' + Views.escape(app.user.email) + '</p>' : '') +
          '<button class="link" data-action="logout">Sign out</button>' +
        '</div>' +
      '</div>';
  }

  function refresh(message, tone) {
    if (message) {
      app.toast = { message: message, tone: tone || 'ok' };
      render();
      clearTimeout(app.toastTimer);
      app.toastTimer = setTimeout(function () {
        app.toast = null;
        render();
      }, 2600);
      return;
    }
    render();
  }

  function currentProject() {
    return Store.getActiveProject();
  }

  function closeModal() {
    app.modal = null;
    app.modalData = null;
    render();
  }

  /* ------------------------------------------------------------- download */

  function download(filename, content, type) {
    const blob = new Blob([content], { type: (type || 'text/html') + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function slug(value) {
    return String(value || 'proposal')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'proposal';
  }

  /* --------------------------------------------------------------- events */

  async function onAuthSubmit(form) {
    const data = new FormData(form);
    app.busy = true;
    app.authError = '';
    render();
    try {
      let user;
      if (form.dataset.mode === 'signup') {
        user = await Store.signUp({
          name: data.get('name'),
          email: data.get('email'),
          password: data.get('password')
        });
      } else {
        user = await Store.signIn(data.get('email'), data.get('password'));
      }
      app.user = user;
      app.view = 'overview';
      app.busy = false;
      render();
    } catch (error) {
      app.busy = false;
      app.authError = error.message || 'Sign in failed.';
      render();
    }
  }

  function onProjectForm(form) {
    const data = new FormData(form);
    try {
      Store.createProject({
        name: String(data.get('name') || '').trim() || 'Untitled project',
        topic: String(data.get('topic') || '').trim(),
        deadline: data.get('deadline') || '',
        window: String(data.get('window') || '').trim(),
        role: String(data.get('role') || '').trim()
      });
      app.modal = null;
      app.view = 'question';
      refresh('Research project created');
    } catch (error) {
      refresh(error.message, 'warn');
    }
  }

  function onSourceForm(form) {
    const data = new FormData(form);
    const project = currentProject();
    Store.addSource(project.id, {
      title: String(data.get('title') || '').trim(),
      type: data.get('type'),
      year: data.get('year'),
      note: String(data.get('note') || '').trim(),
      url: String(data.get('url') || '').trim()
    });
    app.modal = null;
    refresh('Source added to the knowledge base');
  }

  function onEvidenceForm(form) {
    const data = new FormData(form);
    const project = currentProject();
    Store.addEvidence(project.id, {
      sourceId: data.get('sourceId'),
      claim: String(data.get('claim') || '').trim(),
      location: String(data.get('location') || '').trim(),
      condition: String(data.get('condition') || '').trim(),
      metric: String(data.get('metric') || '').trim(),
      type: data.get('type'),
      strength: data.get('strength'),
      relation: data.get('relation')
    });
    app.modal = null;
    app.view = 'evidence';
    refresh('Evidence recorded and marked for review');
  }

  function onEditEvidenceForm(form) {
    const data = new FormData(form);
    const project = currentProject();
    Store.updateEvidence(project.id, form.dataset.id, {
      claim: String(data.get('claim') || '').trim(),
      location: String(data.get('location') || '').trim(),
      condition: String(data.get('condition') || '').trim(),
      metric: String(data.get('metric') || '').trim(),
      strength: data.get('strength')
    });
    app.modal = null;
    refresh('Evidence updated');
  }

  function onNoteForm(form) {
    const data = new FormData(form);
    const project = currentProject();
    Store.addNote(project.id, {
      title: String(data.get('title') || '').trim(),
      tag: data.get('tag'),
      body: String(data.get('body') || '').trim()
    });
    app.modal = null;
    app.view = 'knowledge';
    refresh('Research note saved');
  }

  function onGroupForm(form) {
    const data = new FormData(form);
    const project = currentProject();
    Store.addGroup(project.id, {
      name: String(data.get('name') || '').trim(),
      role: data.get('role'),
      basis: String(data.get('basis') || '').trim()
    });
    app.modal = null;
    refresh('Experimental group added');
  }

  async function onSubmit(event) {
    const form = event.target;
    if (!form || !form.id) return;
    event.preventDefault();
    if (form.id === 'auth-form') return onAuthSubmit(form);
    if (form.id === 'new-project-form') return onProjectForm(form);
    if (form.id === 'source-form') return onSourceForm(form);
    if (form.id === 'evidence-form') return onEvidenceForm(form);
    if (form.id === 'edit-evidence-form') return onEditEvidenceForm(form);
    if (form.id === 'note-form') return onNoteForm(form);
    if (form.id === 'group-form') return onGroupForm(form);

    const project = currentProject();
    if (!project) return;

    if (form.id === 'question-form') {
      const text = String(new FormData(form).get('question') || '').trim();
      Store.confirmQuestion(project.id, text);
      return refresh('Question saved and confirmed');
    }
    if (form.id === 'context-form') {
      const data = new FormData(form);
      Store.updateConstraints(project.id, {
        role: String(data.get('role') || '').trim(),
        equipment: String(data.get('equipment') || '').trim(),
        materials: String(data.get('materials') || '').trim(),
        window: String(data.get('window') || '').trim(),
        budget: String(data.get('budget') || '').trim()
      });
      return refresh('Project context saved');
    }
    if (form.classList.contains('inline-add')) {
      const kind = form.dataset.kind;
      const value = String(new FormData(form).get('value') || '').trim();
      if (!value) return;
      if (kind === 'variable') Store.addDesignItem(project.id, 'variables', value);
      if (kind === 'metric') Store.addDesignItem(project.id, 'metrics', value);
      if (kind === 'risk') Store.addRisk(project.id, { text: value, level: 'Medium' });
      return refresh('Design field added');
    }
  }

  function onInput(event) {
    if (event.target.id === 'evidence-search') {
      const value = event.target.value;
      Store.setUI({ evidenceQuery: value });
      updateEvidenceRows();
    }
  }

  function updateEvidenceRows() {
    const project = currentProject();
    if (!project) return;
    const body = document.querySelector('#evidence-body');
    if (!body) return;
    const rows = Views.filterEvidence(project, Store.getUI());
    body.innerHTML = rows.length
      ? rows.map(function (item) { return rowHtml(project, item); }).join('')
      : '<tr><td colspan="7" class="empty-cell">No evidence matches this view.</td></tr>';
  }

  function rowHtml(project, item) {
    const source = project.sources.find(function (entry) { return entry.id === item.sourceId; });
    const tone = item.type === 'Fact' ? 'blue' : item.type === 'Synthesis' ? 'teal' : 'purple';
    return '<tr>' +
      '<td><div class="claim"><span class="claim-dot ' + (item.relation === 'conflict' ? 'is-conflict' : '') + '"></span>' +
        '<div><strong>' + Views.escape(item.claim) + '</strong><small>' + Views.escape(item.location || 'No location recorded') + '</small></div></div></td>' +
      '<td><span class="source-title">' + Views.escape(source ? source.title : 'Source removed') + '</span>' +
        '<small class="source-year">' + Views.escape(source ? source.year + ' · ' + source.type : '') + '</small></td>' +
      '<td><div class="cell-stack"><span>' + Views.escape(item.condition || 'Not specified') + '</span>' +
        '<small>' + Views.escape(item.metric || 'No metric') + '</small></div></td>' +
      '<td><span class="type-tag ' + tone + '">' + Views.escape(item.type) + '</span></td>' +
      '<td><span class="strength ' + String(item.strength).toLowerCase() + '"><i></i>' + Views.escape(item.strength) + '</span></td>' +
      '<td><span class="status-tag ' + (item.status === 'review' ? 'review' : 'ok') + '">' +
        (item.status === 'review' ? 'Needs review' : 'In proposal') + '</span></td>' +
      '<td><div class="row-actions">' +
        '<button class="icon-btn quiet" data-action="evidence-detail" data-id="' + Views.escape(item.id) + '">' + Views.icon('chevron') + '</button>' +
        '<button class="icon-btn quiet danger" data-action="delete-evidence" data-id="' + Views.escape(item.id) + '">' + Views.icon('close') + '</button>' +
      '</div></td>' +
    '</tr>';
  }

  function onChange(event) {
    if (event.target.id === 'project-select') {
      Store.setActiveProject(event.target.value);
      app.view = 'overview';
      render();
    }
  }

  async function onClick(event) {
    if (event.target.classList && event.target.classList.contains('overlay')) {
      return closeModal();
    }
    const el = event.target.closest('[data-action], [data-view]');
    if (!el) return;
    const action = el.dataset.action;
    const view = el.dataset.view;
    const project = currentProject();

    if (view) {
      app.view = view;
      app.modal = null;
      return render();
    }
    if (!action) return;

    if (action === 'toggle-auth') {
      app.authMode = app.authMode === 'login' ? 'signup' : 'login';
      app.authError = '';
      return render();
    }
    if (action === 'fill-demo') {
      const form = document.querySelector('#auth-form');
      if (form) {
        form.querySelector('[name="email"]').value = Store.DEMO_ACCOUNT.email;
        form.querySelector('[name="password"]').value = Store.DEMO_ACCOUNT.password;
        form.querySelector('button[type="submit"]').focus();
      }
      return;
    }
    if (action === 'logout') {
      Store.signOut();
      app.user = null;
      app.view = 'overview';
      app.modal = null;
      return render();
    }
    if (!app.user) return;

    if (action === 'close-modal') return closeModal();
    if (action === 'new-project') { app.modal = 'new-project'; app.modalData = null; return render(); }
    if (action === 'new-source') { app.modal = 'new-source'; app.modalData = null; return render(); }
    if (action === 'new-evidence') {
      app.modal = 'new-evidence';
      app.modalData = { sourceId: el.dataset.source || null };
      return render();
    }
    if (action === 'new-note') { app.modal = 'new-note'; app.modalData = null; return render(); }
    if (action === 'new-group') { app.modal = 'new-group'; app.modalData = null; return render(); }
    if (action === 'account-menu') {
      app.modal = 'account';
      app.modalData = { email: app.user.email, name: app.user.name, role: app.user.role };
      return render();
    }
    if (action === 'help') { app.modal = 'help'; app.modalData = null; return render(); }
    if (action === 'toggle-sidebar') {
      document.querySelector('#sidebar').classList.toggle('is-open');
      return;
    }
    if (!project) return;

    if (action === 'load-demo') {
      Store.createDemoProjectForCurrentUser();
      app.view = 'overview';
      return refresh('Demo workspace loaded');
    }
    if (action === 'filter') {
      Store.setUI({ evidenceFilter: el.dataset.filter });
      return render();
    }
    if (action === 'go-search') {
      app.view = 'evidence';
      render();
      const input = document.querySelector('#evidence-search');
      if (input) input.focus();
      return;
    }
    if (action === 'refine-question') {
      Store.refineQuestion(project.id);
      return refresh('Copilot proposed a sharper question — review it before confirming');
    }
    if (action === 'save-question-draft') {
      const field = document.querySelector('#question-form [name="question"]');
      if (field) Store.updateQuestion(project.id, field.value.trim());
      return refresh('Draft saved');
    }
    if (action === 'save-hypothesis') {
      const field = document.querySelector('#hypothesis-input');
      Store.updateDesign(project.id, {
        hypothesis: field ? field.value.trim() : project.design.hypothesis,
        hypothesisStatus: 'Needs expert review'
      });
      return refresh('Hypothesis saved');
    }
    if (action === 'design-check') {
      const report = Store.qualityReport(project);
      return refresh(
        report.issues.length
          ? 'Quality check: ' + report.issues.length + ' item(s) still need attention'
          : 'Quality check passed — supervisor sign-off still required',
        report.issues.length ? 'warn' : 'ok'
      );
    }
    if (action === 'toggle-group') {
      const group = project.design.groups.find(function (item) { return item.id === el.dataset.id; });
      if (!group) return;
      Store.setGroupStatus(project.id, group.id, group.status === 'confirmed' ? 'review' : 'confirmed');
      return render();
    }
    if (action === 'delete-group') {
      Store.removeGroup(project.id, el.dataset.id);
      return refresh('Group removed');
    }
    if (action === 'toggle-risk') {
      const risk = project.design.risks.find(function (item) { return item.id === el.dataset.id; });
      if (!risk) return;
      Store.setRiskStatus(project.id, risk.id, risk.status === 'Resolved' ? 'Open' : 'Resolved');
      return render();
    }
    if (action === 'delete-risk') {
      Store.removeRisk(project.id, el.dataset.id);
      return refresh('Risk removed');
    }
    if (action === 'remove-variable' || action === 'remove-metric') {
      const key = action === 'remove-variable' ? 'variables' : 'metrics';
      Store.removeDesignItem(project.id, key, Number(el.dataset.index));
      return render();
    }
    if (action === 'delete-source') {
      if (!global.confirm('Remove this source and every evidence record that points to it?')) return;
      Store.deleteSource(project.id, el.dataset.id);
      return refresh('Source removed');
    }
    if (action === 'delete-note') {
      Store.deleteNote(project.id, el.dataset.id);
      return refresh('Note deleted');
    }
    if (action === 'delete-evidence' || action === 'delete-evidence-modal') {
      if (!global.confirm('Delete this evidence record?')) return;
      Store.deleteEvidence(project.id, el.dataset.id);
      app.modal = null;
      return refresh('Evidence record deleted');
    }
    if (action === 'evidence-detail') {
      app.modal = 'evidence-detail';
      app.modalData = { id: el.dataset.id };
      return render();
    }
    if (action === 'edit-evidence') {
      app.modal = 'edit-evidence';
      app.modalData = { id: el.dataset.id };
      return render();
    }
    if (action === 'set-evidence-accepted') {
      Store.setEvidenceStatus(project.id, el.dataset.id, 'accepted');
      app.modal = null;
      return refresh('Evidence linked to the proposal');
    }
    if (action === 'set-evidence-review') {
      Store.setEvidenceStatus(project.id, el.dataset.id, 'review');
      app.modal = null;
      return refresh('Evidence marked for review');
    }
    if (action === 'jump') {
      const target = document.getElementById(el.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (action === 'export-proposal') {
      download(slug(project.name) + '-proposal.html', Views.proposalHtml({ project: project, user: app.user }), 'text/html');
      return refresh('HTML proposal downloaded');
    }
    if (action === 'preview-proposal') {
      const win = global.open('', '_blank');
      if (!win) return refresh('Allow pop-ups to preview the proposal', 'warn');
      win.document.write(Views.proposalHtml({ project: project, user: app.user }));
      win.document.close();
      return;
    }
    if (action === 'export-json') {
      download(slug(project.name) + '-records.json', Store.exportJSON(), 'application/json');
      app.modal = null;
      return refresh('Project records exported as JSON');
    }
    if (action === 'reset-demo') {
      if (!global.confirm('Reset this workspace back to the curated demo project? Current edits will be lost.')) return;
      Store.resetDemo();
      app.modal = null;
      app.view = 'overview';
      return refresh('Demo workspace reset');
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && app.modal) closeModal();
  }

  /* ----------------------------------------------------------------- boot */

  async function boot() {
    try {
      await Store.ensureDemoUser();
    } catch (error) {
      /* the demo user is a convenience, not a requirement */
    }
    app.user = Store.getSession();
    render();
  }

  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('keydown', onKeydown);

  boot();
})(window);
