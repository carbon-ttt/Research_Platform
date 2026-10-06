#!/usr/bin/env node
/* Headless smoke test for the BioPrint Research Copilot data + rendering layers.
 * Loads the browser scripts inside a vm context with a localStorage stub,
 * then exercises the golden path: sign in, record, review, export.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP_DIR = path.resolve(__dirname, '..');

let passed = 0;
const failures = [];

function check(label, condition, detail) {
  if (condition) {
    passed += 1;
    process.stdout.write('  ok   ' + label + '\n');
  } else {
    failures.push(label + (detail ? ' — ' + detail : ''));
    process.stdout.write('  FAIL ' + label + (detail ? ' — ' + detail : '') + '\n');
  }
}

function section(name) {
  process.stdout.write('\n' + name + '\n');
}

/* ---------------------------------------------------------------- sandbox */

function createSandbox() {
  const storage = {
    map: Object.create(null),
    getItem(key) { return Object.prototype.hasOwnProperty.call(this.map, key) ? this.map[key] : null; },
    setItem(key, value) { this.map[key] = String(value); },
    removeItem(key) { delete this.map[key]; },
    clear() { this.map = Object.create(null); }
  };

  const sandbox = {
    console,
    localStorage: storage,
    crypto: globalThis.crypto,
    TextEncoder: globalThis.TextEncoder,
    Intl,
    Date,
    Math,
    JSON,
    setTimeout,
    clearTimeout
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  ['js/store.js', 'js/views.js'].forEach(function (file) {
    const source = fs.readFileSync(path.join(APP_DIR, file), 'utf8');
    vm.runInContext(source, sandbox, { filename: file });
  });

  return sandbox;
}

/* ------------------------------------------------------------------- main */

async function main() {
  const win = createSandbox();
  const Store = win.BioPrint.Store;
  const Views = win.BioPrint.Views;

  check('store and views namespaces are exported', Boolean(Store && Views));

  section('Auth');
  await Store.ensureDemoUser();
  check('a new browser session is signed out', Store.getSession() === null);

  const user = await Store.signIn(Store.DEMO_ACCOUNT.email, Store.DEMO_ACCOUNT.password);
  check('demo sign in succeeds', user.email === Store.DEMO_ACCOUNT.email);
  check('demo workspace is seeded with a project', Store.listProjects().length >= 1);

  let wrongPasswordRejected = false;
  try {
    await Store.signIn(Store.DEMO_ACCOUNT.email, 'not-the-password');
  } catch (error) {
    wrongPasswordRejected = true;
  }
  check('wrong password is rejected', wrongPasswordRejected);

  const newUser = await Store.signUp({ name: 'Test Researcher', email: 'test@lab.org', password: 'testing123' });
  check('sign up creates a workspace', newUser.email === 'test@lab.org');

  let duplicateRejected = false;
  try {
    await Store.signUp({ name: 'Duplicate', email: 'test@lab.org', password: 'testing123' });
  } catch (error) {
    duplicateRejected = true;
  }
  check('duplicate email is rejected', duplicateRejected);

  await Store.signIn(Store.DEMO_ACCOUNT.email, Store.DEMO_ACCOUNT.password);

  section('Seed project');
  const project = Store.getActiveProject();
  check('active project exists', Boolean(project));
  check('seed has six sources', project.sources.length === 6, 'got ' + project.sources.length);
  check('seed has six evidence records', project.evidence.length === 6, 'got ' + project.evidence.length);
  check('seed has three research gaps', project.gaps.length === 3);
  check('seed has a control group', project.design.groups.some(function (g) { return g.role === 'Control'; }));

  section('Recording');
  const source = Store.addSource(project.id, {
    title: 'Smoke test source',
    type: 'Methods',
    year: 2025,
    note: 'Added by the automated smoke test.'
  });
  check('source is added', Store.getActiveProject().sources.length === 7);

  const evidence = Store.addEvidence(project.id, {
    sourceId: source.id,
    claim: 'Smoke test claim',
    location: 'p. 1',
    condition: 'Test condition',
    metric: 'Test metric',
    type: 'Fact',
    strength: 'Low'
  });
  let fresh = Store.getActiveProject();
  check('evidence is added', fresh.evidence.length === 7);
  check('new evidence starts as needs review',
    fresh.evidence.find(function (e) { return e.id === evidence.id; }).status === 'review');

  Store.setEvidenceStatus(project.id, evidence.id, 'accepted');
  fresh = Store.getActiveProject();
  check('evidence can be accepted into the proposal',
    fresh.evidence.find(function (e) { return e.id === evidence.id; }).status === 'accepted');

  Store.addNote(project.id, { title: 'Smoke note', tag: 'Decision', body: 'Recorded by the test.' });
  check('note is recorded', Store.getActiveProject().notes.length === 3);

  section('Question');
  Store.refineQuestion(project.id);
  check('copilot refinement marks the question as a draft',
    Store.getActiveProject().question.status === 'draft');
  Store.confirmQuestion(project.id, 'A confirmed smoke test question?');
  fresh = Store.getActiveProject();
  check('question can be confirmed', fresh.question.status === 'confirmed');
  check('confirmed text is stored', fresh.question.text === 'A confirmed smoke test question?');

  section('Design');
  Store.addGroup(project.id, { name: 'Smoke group', role: 'Experimental', basis: 'Test' });
  check('group is added', Store.getActiveProject().design.groups.length === 4);

  const addedGroup = Store.getActiveProject().design.groups.find(function (g) { return g.name === 'Smoke group'; });
  Store.setGroupStatus(project.id, addedGroup.id, 'confirmed');
  check('group status can be confirmed',
    Store.getActiveProject().design.groups.find(function (g) { return g.id === addedGroup.id; }).status === 'confirmed');

  Store.removeGroup(project.id, addedGroup.id);
  check('group can be removed', Store.getActiveProject().design.groups.length === 3);

  Store.addDesignItem(project.id, 'variables', 'Smoke variable');
  check('design variable is added', Store.getActiveProject().design.variables.indexOf('Smoke variable') !== -1);

  Store.addRisk(project.id, { text: 'Smoke risk', level: 'Low' });
  const risk = Store.getActiveProject().design.risks.find(function (r) { return r.text === 'Smoke risk'; });
  check('design risk is recorded', Boolean(risk));
  Store.setRiskStatus(project.id, risk.id, 'Resolved');
  check('design risk can be resolved',
    Store.getActiveProject().design.risks.find(function (r) { return r.id === risk.id; }).status === 'Resolved');
  Store.removeRisk(project.id, risk.id);

  Store.setGapStatus(project.id, 'gap_transfer', 'accepted');
  check('research gap can be accepted',
    Store.getActiveProject().gaps.find(function (g) { return g.id === 'gap_transfer'; }).status === 'accepted');

  section('Quality report');
  const quality = Store.qualityReport(Store.getActiveProject());
  check('quality report lists issues', Array.isArray(quality.issues) && quality.issues.length > 0);
  check('citation coverage is a percentage between 0 and 100',
    quality.citationCoverage >= 0 && quality.citationCoverage <= 100, 'got ' + quality.citationCoverage);
  check('completion score is between 0 and 100',
    Store.completion(Store.getActiveProject()) > 0 &&
    Store.completion(Store.getActiveProject()) <= 100);

  section('Filtering');
  const conflictRows = Views.filterEvidence(Store.getActiveProject(), { evidenceFilter: 'conflict', evidenceQuery: '' });
  check('conflict filter returns only conflicting evidence',
    conflictRows.length === 2 && conflictRows.every(function (item) { return item.relation === 'conflict'; }),
    'got ' + conflictRows.length);

  const reviewRows = Views.filterEvidence(Store.getActiveProject(), { evidenceFilter: 'review', evidenceQuery: '' });
  check('review filter returns only unreviewed evidence',
    reviewRows.every(function (item) { return item.status === 'review'; }));

  const searchRows = Views.filterEvidence(Store.getActiveProject(), { evidenceFilter: 'all', evidenceQuery: 'crosslinking' });
  check('search matches claim text', searchRows.length >= 2, 'got ' + searchRows.length);

  section('Rendering');
  const loginHtml = Views.authScreen({ mode: 'login', error: '', busy: false });
  check('login screen renders the demo account', loginHtml.indexOf(Store.DEMO_ACCOUNT.email) !== -1);
  check('login screen contains the auth form', loginHtml.indexOf('id="auth-form"') !== -1);

  const signupHtml = Views.authScreen({ mode: 'signup', error: 'Something went wrong', busy: false });
  check('signup screen renders the error message', signupHtml.indexOf('Something went wrong') !== -1);

  const views = ['overview', 'question', 'knowledge', 'evidence', 'design', 'proposal', 'activity'];
  const shellProject = Store.getActiveProject();
  let renderedHtml = loginHtml + signupHtml;
  views.forEach(function (view) {
    let html = '';
    let error = null;
    try {
      html = Views.appShell({
        user: user,
        projects: Store.listProjects(),
        project: shellProject,
        view: view,
        ui: Store.getUI(),
        modal: null,
        modalData: null,
        toast: null
      });
    } catch (caught) {
      error = caught;
    }
    renderedHtml += html;
    check('view renders: ' + view, !error && html.length > 500, error ? error.message : 'length ' + html.length);
  });

  const modals = ['new-project', 'new-source', 'new-evidence', 'new-note', 'new-group', 'account', 'help'];
  modals.forEach(function (kind) {
    let html = '';
    let error = null;
    try {
      html = Views.modal(kind, shellProject, { email: user.email, name: user.name, role: user.role });
    } catch (caught) {
      error = caught;
    }
    renderedHtml += html;
    check('modal renders: ' + kind, !error && html.length > 200, error ? error.message : 'length ' + html.length);
  });

  const detail = Views.modal('evidence-detail', shellProject, { id: shellProject.evidence[0].id });
  renderedHtml += detail;
  check('evidence detail modal renders a condition block', detail.indexOf('Condition') !== -1);

  section('Wiring');
  const appSource = fs.readFileSync(path.join(APP_DIR, 'js/app.js'), 'utf8');
  const viewSource = fs.readFileSync(path.join(APP_DIR, 'js/views.js'), 'utf8');

  const actions = new Set();
  const actionPattern = /data-action="([a-z0-9-]+)"/g;
  let match;
  while ((match = actionPattern.exec(renderedHtml)) !== null) actions.add(match[1]);
  const appActionPattern = /data-action="([a-z0-9-]+)"/g;
  while ((match = appActionPattern.exec(appSource)) !== null) actions.add(match[1]);

  const handled = new Set();
  const handledPattern = /action === '([a-z0-9-]+)'/g;
  while ((match = handledPattern.exec(appSource)) !== null) handled.add(match[1]);

  const unhandled = Array.from(actions).filter(function (name) { return !handled.has(name); });
  check('every rendered data-action has a handler', unhandled.length === 0,
    unhandled.length ? 'missing: ' + unhandled.join(', ') : actions.size + ' actions');

  const requiredIds = [
    'id="project-select"',
    'id="sidebar"',
    'id="evidence-search"',
    'id="evidence-body"',
    'id="auth-form"',
    'id="question-form"',
    'id="context-form"',
    'id="hypothesis-input"',
    'id="new-project-form"',
    'id="source-form"',
    'id="evidence-form"',
    'id="note-form"',
    'id="group-form"',
    'id="edit-evidence-form"'
  ];
  const allHtml = renderedHtml +
    Views.modal('edit-evidence', shellProject, { id: shellProject.evidence[0].id }) +
    Views.modal('new-project', shellProject, {}) +
    Views.appShell({
      user: user, projects: Store.listProjects(), project: shellProject, view: 'overview',
      ui: Store.getUI(), modal: 'new-project', modalData: {}, toast: null
    });
  const missingIds = requiredIds.filter(function (needle) { return allHtml.indexOf(needle) === -1; });
  check('all element ids referenced by app.js are rendered', missingIds.length === 0,
    missingIds.length ? 'missing: ' + missingIds.join(', ') : requiredIds.length + ' ids');

  const storesUsed = Array.from(new Set(
    (viewSource + appSource).match(/Store\.[A-Za-z_]+/g) || []
  )).map(function (token) { return token.replace('Store.', ''); });
  const missingApi = storesUsed.filter(function (name) { return typeof Store[name] !== 'function' && name !== 'DEMO_ACCOUNT'; });
  check('every Store API used by the UI exists', missingApi.length === 0,
    missingApi.length ? 'missing: ' + missingApi.join(', ') : storesUsed.length + ' apis');

  section('HTML export');
  const html = Views.proposalHtml({ project: Store.getActiveProject(), user: user });
  check('export starts with a doctype', html.indexOf('<!doctype html>') === 0);
  check('export embeds the research question', html.indexOf('A confirmed smoke test question?') !== -1);
  check('export contains the evidence ledger table', html.indexOf('7. Evidence ledger') !== -1);
  check('export contains review items', html.indexOf('8. Review items') !== -1);
  check('export contains references', html.indexOf('9. References') !== -1);
  check('export flags the draft status', html.indexOf('AI-assisted working draft') !== -1);
  check('export carries the needs-review status', html.indexOf('Needs review') !== -1);
  check('export includes inline styles', html.indexOf('<style>') !== -1);
  check('export has no unresolved template placeholder', html.indexOf('undefined') === -1);

  section('Isolation between accounts');
  const demoProjectCount = Store.listProjects().length;
  await Store.signIn('test@lab.org', 'testing123');
  check('a fresh account starts with no projects', Store.listProjects().length === 0);
  check('demo account still holds its projects after switching', demoProjectCount >= 1);

  section('JSON export');
  await Store.signIn(Store.DEMO_ACCOUNT.email, Store.DEMO_ACCOUNT.password);
  const json = JSON.parse(Store.exportJSON());
  check('JSON export contains projects', Array.isArray(json.projects) && json.projects.length >= 1);
  check('JSON export records the signed in user', json.user.email === Store.DEMO_ACCOUNT.email);

  section('Reset');
  Store.resetDemo();
  check('reset restores a single curated project', Store.listProjects().length === 1);
  check('reset restores the seed evidence', Store.getActiveProject().evidence.length === 6);

  /* ------------------------------------------------------------- summary */
  process.stdout.write('\n' + '-'.repeat(52) + '\n');
  if (failures.length) {
    process.stdout.write(failures.length + ' check(s) failed out of ' + (passed + failures.length) + '\n');
    failures.forEach(function (item) { process.stdout.write('  - ' + item + '\n'); });
    process.exit(1);
  }
  process.stdout.write('All ' + passed + ' checks passed.\n');
}

main().catch(function (error) {
  process.stderr.write('Smoke test crashed: ' + (error && error.stack ? error.stack : error) + '\n');
  process.exit(1);
});
