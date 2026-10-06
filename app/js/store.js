/* BioPrint Research Copilot — data layer.
 * Local-first store: accounts, projects and research records. No backend, no build step.
 */
(function (global) {
  'use strict';

  const NS = (global.BioPrint = global.BioPrint || {});
  const DB_KEY = 'bioprint.workspace.v2';
  const SCHEMA_VERSION = 2;

  const DEMO_ACCOUNT = {
    email: 'demo@bioprint.local',
    password: 'demo1234',
    name: 'Lin Chen',
    role: 'Bioprinting Researcher'
  };

  /* ---------------------------------------------------------------- utils */

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function nowISO() {
    return new Date().toISOString();
  }

  /* -------------------------------------------------------------- hashing */

  function randomSalt() {
    const bytes = new Uint8Array(16);
    if (global.crypto && global.crypto.getRandomValues) {
      global.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  function fallbackHash(input) {
    // Demo-only fallback for environments without SubtleCrypto.
    let h1 = 0x811c9dc5;
    let h2 = 0x01000193;
    for (let i = 0; i < input.length; i += 1) {
      const c = input.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
      h2 = Math.imul(h2 ^ (c + i), 2246822519) >>> 0;
    }
    return (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')).repeat(4).slice(0, 64);
  }

  async function hashPassword(password, salt) {
    const payload = salt + '::' + password;
    if (global.crypto && global.crypto.subtle && global.TextEncoder) {
      try {
        const buffer = await global.crypto.subtle.digest('SHA-256', new global.TextEncoder().encode(payload));
        return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('');
      } catch (error) {
        /* fall through to the demo hash */
      }
    }
    return fallbackHash(payload);
  }

  /* ---------------------------------------------------------- persistence */

  function emptyDB() {
    return { version: SCHEMA_VERSION, users: {}, data: {}, session: null };
  }

  function readDB() {
    try {
      const raw = global.localStorage.getItem(DB_KEY);
      if (!raw) return emptyDB();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return emptyDB();
      parsed.version = SCHEMA_VERSION;
      parsed.users = parsed.users || {};
      parsed.data = parsed.data || {};
      parsed.session = parsed.session || null;
      return parsed;
    } catch (error) {
      return emptyDB();
    }
  }

  function writeDB(db) {
    try {
      global.localStorage.setItem(DB_KEY, JSON.stringify(db));
      return true;
    } catch (error) {
      return false;
    }
  }

  function userBucket(db, email) {
    if (!db.data[email]) {
      db.data[email] = { projects: [], activeProjectId: null, ui: { evidenceFilter: 'all', evidenceQuery: '' } };
    }
    const bucket = db.data[email];
    bucket.projects = bucket.projects || [];
    bucket.ui = bucket.ui || { evidenceFilter: 'all', evidenceQuery: '' };
    return bucket;
  }

  /* ------------------------------------------------------------ demo seed */

  function seedSources() {
    return [
      {
        id: 'src_review_landscape',
        title: 'Bioprinting for cartilage tissue engineering: materials, methods and open constraints',
        type: 'Review',
        year: 2022,
        venue: 'Curated review',
        note: 'Builds the field map across bioink families, printing routes and reported biological outcomes.',
        url: ''
      },
      {
        id: 'src_bioink_design',
        title: 'Bioink design trade-offs for embedded cartilage constructs',
        type: 'Primary study',
        year: 2023,
        venue: 'Curated primary source',
        note: 'Reports condition-specific trade-offs between shape retention and early cell response.',
        url: ''
      },
      {
        id: 'src_extrusion_parameters',
        title: 'Extrusion pressure, nozzle geometry and speed interactions in hydrogel printing',
        type: 'Methods',
        year: 2021,
        venue: 'Curated methods source',
        note: 'Parameter ranges are reported with printer-specific context, so transfer needs review.',
        url: ''
      },
      {
        id: 'src_viability_assay',
        title: 'Assessing cell viability in printed cartilage constructs: timing and metric effects',
        type: 'Primary study',
        year: 2024,
        venue: 'Curated primary source',
        note: 'Provides a measurement framework and shows how assay timing shifts the conclusion.',
        url: ''
      },
      {
        id: 'src_crosslink_stability',
        title: 'Crosslinking density and early structural stability in printed hydrogels',
        type: 'Primary study',
        year: 2020,
        venue: 'Curated primary source',
        note: 'Higher crosslinking improved stability inside a narrow, early assay window.',
        url: ''
      },
      {
        id: 'src_conflict_synthesis',
        title: 'Balancing structural stability and biological activity across bioink studies',
        type: 'Review',
        year: 2023,
        venue: 'Curated review source',
        note: 'Collects studies where the stability and activity conclusions do not align.',
        url: ''
      }
    ];
  }

  function seedEvidence() {
    return [
      {
        id: 'ev_landscape',
        sourceId: 'src_review_landscape',
        claim: 'Bioink selection is a coupled material-and-cell decision, not a single printability decision.',
        location: 'p. 4 · Research landscape',
        condition: 'Cell model and crosslinking window must be reported together with the formulation.',
        metric: 'Print fidelity + biological outcome',
        type: 'Synthesis',
        strength: 'High',
        relation: 'supports',
        status: 'accepted',
        createdAt: nowISO()
      },
      {
        id: 'ev_shape_retention',
        sourceId: 'src_bioink_design',
        claim: 'A formulation can improve shape retention while shifting the early cell response profile.',
        location: 'Fig. 3 · Results',
        condition: 'Specific hydrogel formulation, short culture window, extrusion route.',
        metric: 'Shape retention + viability',
        type: 'Fact',
        strength: 'Medium',
        relation: 'supports',
        status: 'accepted',
        createdAt: nowISO()
      },
      {
        id: 'ev_parameters',
        sourceId: 'src_extrusion_parameters',
        claim: 'Extrusion pressure, nozzle geometry and print speed interact to determine filament fidelity.',
        location: 'Table 2 · Methods',
        condition: 'Reported for a specific printer and nozzle configuration.',
        metric: 'Filament width / fidelity',
        type: 'Fact',
        strength: 'High',
        relation: 'supports',
        status: 'accepted',
        createdAt: nowISO()
      },
      {
        id: 'ev_assay_timing',
        sourceId: 'src_viability_assay',
        claim: 'Viability conclusions depend on assay timing and on which viability metric is reported.',
        location: 'p. 7 · Limitations',
        condition: 'Early time points do not represent the longer-term tissue outcome.',
        metric: 'Viability assay',
        type: 'Fact',
        strength: 'Medium',
        relation: 'supports',
        status: 'review',
        createdAt: nowISO()
      },
      {
        id: 'ev_crosslink_positive',
        sourceId: 'src_crosslink_stability',
        claim: 'Higher crosslinking density improved early structural stability in the reported setup.',
        location: 'Fig. 2 · Results',
        condition: 'One cell model, one formulation family, early assay window.',
        metric: 'Compressive stability',
        type: 'Fact',
        strength: 'Medium',
        relation: 'conflict',
        status: 'accepted',
        createdAt: nowISO()
      },
      {
        id: 'ev_crosslink_conflict',
        sourceId: 'src_conflict_synthesis',
        claim: 'Higher crosslinking is not consistently associated with better biological activity.',
        location: 'Section 3 · Synthesis',
        condition: 'Pooled across different cell types, formulations and culture windows.',
        metric: 'Biological activity',
        type: 'Synthesis',
        strength: 'Medium',
        relation: 'conflict',
        status: 'accepted',
        createdAt: nowISO()
      }
    ];
  }

  function seedGaps() {
    return [
      {
        id: 'gap_tradeoff',
        category: 'Contradictory',
        title: 'Stability and early cell response are rarely compared under one controlled parameter set.',
        summary:
          'The evidence points to a condition-dependent trade-off, but the studies do not align cell model, formulation and assay timing.',
        confidence: 'Medium',
        status: 'accepted',
        evidenceIds: ['ev_crosslink_positive', 'ev_crosslink_conflict']
      },
      {
        id: 'gap_transfer',
        category: 'Method limitation',
        title: 'Printer-specific parameter transfer is under-specified.',
        summary:
          'Published parameter ranges are hard to move across machines without recording nozzle, pressure and speed together.',
        confidence: 'Medium',
        status: 'candidate',
        evidenceIds: ['ev_parameters']
      },
      {
        id: 'gap_screening',
        category: 'Testable opportunity',
        title: 'A staged screening matrix could surface the trade-off earlier.',
        summary:
          'A small screening step may reveal the fidelity and viability tension before committing to a long culture experiment.',
        confidence: 'Low',
        status: 'candidate',
        evidenceIds: ['ev_shape_retention', 'ev_assay_timing']
      }
    ];
  }

  function seedDesign() {
    return {
      hypothesis:
        'Within the available extrusion setup, a staged bioink and parameter screen can identify a condition that preserves construct fidelity without crossing the early viability threshold.',
      hypothesisStatus: 'Needs expert review',
      groups: [
        { id: 'grp_control', name: 'Baseline bioink', role: 'Control', basis: 'User context', status: 'confirmed' },
        { id: 'grp_low', name: 'Lower crosslinking window', role: 'Experimental', basis: 'Candidate design', status: 'review' },
        { id: 'grp_high', name: 'Higher crosslinking window', role: 'Experimental', basis: 'Candidate design', status: 'review' }
      ],
      variables: ['Crosslinking window', 'Extrusion speed', 'Nozzle geometry'],
      metrics: ['Print fidelity', 'Early cell viability', 'Construct stability'],
      risks: [
        {
          id: 'risk_transfer',
          text: 'Parameter transfer from the literature may not match the available printer.',
          level: 'High',
          status: 'Open'
        },
        {
          id: 'risk_power',
          text: 'Replicate count and statistical plan are not defined yet.',
          level: 'Medium',
          status: 'Open'
        },
        {
          id: 'risk_assay',
          text: 'Assay timing may overstate early viability.',
          level: 'Medium',
          status: 'Review'
        }
      ]
    };
  }

  function seedTasks() {
    return [
      { id: 'task_scope', label: 'Lock research question and scope', window: 'Week 1', status: 'Done' },
      { id: 'task_evidence', label: 'Verify evidence and parameter transfer', window: 'Weeks 2-3', status: 'In review' },
      { id: 'task_matrix', label: 'Prepare pilot screening matrix', window: 'Week 4', status: 'Next' },
      { id: 'task_pilot', label: 'Run pilot prints and viability assay', window: 'Weeks 5-8', status: 'Planned' },
      { id: 'task_revise', label: 'Analyse results and revise the proposal', window: 'Weeks 9-12', status: 'Planned' }
    ];
  }

  function seedNotes() {
    return [
      {
        id: 'note_advisor',
        title: 'Advisor meeting · 16 Sep',
        tag: 'Advisor note',
        body: 'Confirm whether the first screening matrix should prioritise fidelity or viability.',
        createdAt: '2026-09-16T07:30:00.000Z'
      },
      {
        id: 'note_open',
        title: 'Open question',
        tag: 'Evidence gap',
        body: 'Still need a source that reports nozzle geometry and pressure together with the formulation.',
        createdAt: '2026-09-17T00:40:00.000Z'
      }
    ];
  }

  function createDemoProject() {
    return {
      id: 'prj_cartilage_demo',
      name: 'Cartilage scaffold proposal',
      topic: 'Bioprinting for cartilage tissue engineering',
      type: 'Research Proposal',
      status: 'In progress',
      createdAt: '2026-09-16T01:00:00.000Z',
      updatedAt: nowISO(),
      deadline: '2026-12-10',
      constraints: {
        role: 'Biological engineering MSc · year 2',
        equipment: 'Extrusion bioprinter + basic cell culture setup',
        materials: 'Bioink formulation undecided',
        window: '12 weeks',
        budget: 'Pilot scale · existing lab inventory'
      },
      question: {
        text:
          'How do bioink formulation and extrusion parameters jointly affect print fidelity and early cell viability in a cartilage tissue engineering model?',
        status: 'confirmed',
        source: 'Copilot clarified from your project context',
        lastEdited: '16 Sep 2026'
      },
      sources: seedSources(),
      evidence: seedEvidence(),
      gaps: seedGaps(),
      design: seedDesign(),
      tasks: seedTasks(),
      notes: seedNotes(),
      activity: [
        { id: uid('act'), text: 'Evidence record marked for review', at: 'Today · 08:40', tone: 'orange' },
        { id: uid('act'), text: 'Research question confirmed', at: 'Yesterday · 16:20', tone: 'teal' },
        { id: uid('act'), text: 'Demo project created', at: '16 Sep · 09:00', tone: 'blue' }
      ]
    };
  }

  function createBlankProject(input) {
    const stamp = nowISO();
    return {
      id: uid('prj'),
      name: input.name,
      topic: input.topic,
      type: 'Research Proposal',
      status: 'In progress',
      createdAt: stamp,
      updatedAt: stamp,
      deadline: input.deadline || '',
      constraints: {
        role: input.role || 'Researcher',
        equipment: input.equipment || '',
        materials: input.materials || '',
        window: input.window || '',
        budget: input.budget || ''
      },
      question: {
        text: input.topic,
        status: 'draft',
        source: 'User provided',
        lastEdited: 'Just now'
      },
      sources: [],
      evidence: [],
      gaps: [],
      design: { hypothesis: '', hypothesisStatus: 'Draft', groups: [], variables: [], metrics: [], risks: [] },
      tasks: [],
      notes: [],
      activity: [{ id: uid('act'), text: 'Research project created', at: 'Just now', tone: 'teal' }]
    };
  }

  /* ----------------------------------------------------------------- auth */

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getSession() {
    const db = readDB();
    if (!db.session || !db.session.email) return null;
    return db.users[db.session.email] || null;
  }

  async function ensureDemoUser() {
    const db = readDB();
    const email = DEMO_ACCOUNT.email;
    if (!db.users[email]) {
      const salt = randomSalt();
      db.users[email] = {
        email,
        name: DEMO_ACCOUNT.name,
        role: DEMO_ACCOUNT.role,
        salt,
        hash: await hashPassword(DEMO_ACCOUNT.password, salt),
        createdAt: nowISO()
      };
      const bucket = userBucket(db, email);
      if (!bucket.projects.length) {
        const project = createDemoProject();
        bucket.projects.push(project);
        bucket.activeProjectId = project.id;
      }
      writeDB(db);
    }
    return db.users[email];
  }

  async function signIn(email, password) {
    const db = readDB();
    const key = normalizeEmail(email);
    const user = db.users[key];
    if (!user) throw new Error('No workspace found for that email.');
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.hash) throw new Error('That password does not match this workspace.');
    db.session = { email: key, startedAt: nowISO() };
    writeDB(db);
    return user;
  }

  async function signUp(input) {
    const db = readDB();
    const key = normalizeEmail(input.email);
    if (!key) throw new Error('Enter an email address.');
    if (db.users[key]) throw new Error('That email already has a workspace on this device.');
    if (!input.password || input.password.length < 8) throw new Error('Use at least 8 characters for the password.');
    const salt = randomSalt();
    db.users[key] = {
      email: key,
      name: String(input.name || '').trim() || 'Researcher',
      role: String(input.role || '').trim() || 'Bioprinting Researcher',
      salt,
      hash: await hashPassword(input.password, salt),
      createdAt: nowISO()
    };
    userBucket(db, key);
    db.session = { email: key, startedAt: nowISO() };
    writeDB(db);
    return db.users[key];
  }

  function signOut() {
    const db = readDB();
    db.session = null;
    writeDB(db);
  }

  /* -------------------------------------------------------------- reading */

  function listProjects() {
    const user = getSession();
    if (!user) return [];
    return userBucket(readDB(), user.email).projects;
  }

  function getActiveProjectId() {
    const user = getSession();
    if (!user) return null;
    const bucket = userBucket(readDB(), user.email);
    if (!bucket.activeProjectId && bucket.projects[0]) return bucket.projects[0].id;
    return bucket.activeProjectId;
  }

  function getActiveProject() {
    const projects = listProjects();
    const id = getActiveProjectId();
    return projects.find((project) => project.id === id) || projects[0] || null;
  }

  function setActiveProject(id) {
    const user = getSession();
    if (!user) return;
    const db = readDB();
    userBucket(db, user.email).activeProjectId = id;
    writeDB(db);
  }

  function getUI() {
    const user = getSession();
    if (!user) return { evidenceFilter: 'all', evidenceQuery: '' };
    return userBucket(readDB(), user.email).ui;
  }

  function setUI(patch) {
    const user = getSession();
    if (!user) return;
    const db = readDB();
    const bucket = userBucket(db, user.email);
    bucket.ui = Object.assign({}, bucket.ui, patch);
    writeDB(db);
  }

  /* -------------------------------------------------------------- writing */

  function mutateProject(projectId, mutator) {
    const user = getSession();
    if (!user) throw new Error('Not signed in.');
    const db = readDB();
    const bucket = userBucket(db, user.email);
    const project = bucket.projects.find((item) => item.id === projectId);
    if (!project) throw new Error('Project not found.');
    const result = mutator(project, db);
    project.updatedAt = nowISO();
    writeDB(db);
    return result === undefined ? project : result;
  }

  function logActivity(project, text, tone) {
    project.activity = project.activity || [];
    project.activity.unshift({ id: uid('act'), text, at: 'Just now', tone: tone || 'blue' });
    project.activity = project.activity.slice(0, 30);
  }

  function createProject(input) {
    const user = getSession();
    if (!user) throw new Error('Not signed in.');
    const db = readDB();
    const bucket = userBucket(db, user.email);
    const project = createBlankProject(input);
    bucket.projects.unshift(project);
    bucket.activeProjectId = project.id;
    writeDB(db);
    return project;
  }

  function createDemoProjectForCurrentUser() {
    const user = getSession();
    if (!user) throw new Error('Not signed in.');
    const db = readDB();
    const bucket = userBucket(db, user.email);
    const project = createDemoProject();
    project.id = uid('prj');
    project.activity = [{ id: uid('act'), text: 'Demo workspace loaded', at: 'Just now', tone: 'teal' }];
    bucket.projects.unshift(project);
    bucket.activeProjectId = project.id;
    writeDB(db);
    return project;
  }

  function deleteProject(projectId) {
    const user = getSession();
    if (!user) return;
    const db = readDB();
    const bucket = userBucket(db, user.email);
    bucket.projects = bucket.projects.filter((project) => project.id !== projectId);
    if (bucket.activeProjectId === projectId) {
      bucket.activeProjectId = bucket.projects[0] ? bucket.projects[0].id : null;
    }
    writeDB(db);
  }

  function updateProject(projectId, patch) {
    return mutateProject(projectId, (project) => {
      Object.assign(project, patch);
      logActivity(project, 'Project details updated', 'blue');
    });
  }

  function updateConstraints(projectId, patch) {
    return mutateProject(projectId, (project) => {
      project.constraints = Object.assign({}, project.constraints, patch);
      logActivity(project, 'Project context updated', 'blue');
    });
  }

  function updateQuestion(projectId, text) {
    return mutateProject(projectId, (project) => {
      project.question.text = text;
      project.question.status = 'draft';
      project.question.source = 'User edited';
      project.question.lastEdited = 'Just now';
      logActivity(project, 'Research question edited', 'blue');
    });
  }

  function confirmQuestion(projectId, text) {
    return mutateProject(projectId, (project) => {
      if (typeof text === 'string') project.question.text = text;
      project.question.status = 'confirmed';
      project.question.source = 'User reviewed and confirmed';
      project.question.lastEdited = 'Just now';
      logActivity(project, 'Research question confirmed', 'teal');
    });
  }

  function refineQuestion(projectId) {
    return mutateProject(projectId, (project) => {
      project.question.text =
        'Under the available extrusion setup, how do bioink formulation and printer-specific parameters jointly affect construct fidelity and early cell viability in a cartilage tissue engineering model?';
      project.question.status = 'draft';
      project.question.source = 'Copilot clarified · needs confirmation';
      project.question.lastEdited = 'Just now';
      logActivity(project, 'Copilot proposed a more specific research question', 'teal');
    });
  }

  function addSource(projectId, input) {
    return mutateProject(projectId, (project) => {
      const item = {
        id: uid('src'),
        title: input.title,
        type: input.type,
        year: Number(input.year) || new Date().getFullYear(),
        venue: input.venue || 'User added source',
        note: input.note || '',
        url: input.url || ''
      };
      project.sources.push(item);
      logActivity(project, 'Source added to knowledge base', 'blue');
      return item;
    });
  }

  function deleteSource(projectId, sourceId) {
    return mutateProject(projectId, (project) => {
      project.sources = project.sources.filter((item) => item.id !== sourceId);
      project.evidence = project.evidence.filter((item) => item.sourceId !== sourceId);
      logActivity(project, 'Source removed from knowledge base', 'orange');
    });
  }

  function addEvidence(projectId, input) {
    return mutateProject(projectId, (project) => {
      const item = {
        id: uid('ev'),
        sourceId: input.sourceId,
        claim: input.claim,
        location: input.location || '',
        condition: input.condition || '',
        metric: input.metric || '',
        type: input.type || 'Fact',
        strength: input.strength || 'Medium',
        relation: input.relation || 'supports',
        status: 'review',
        createdAt: nowISO()
      };
      project.evidence.unshift(item);
      logActivity(project, 'Evidence record added for review', 'orange');
      return item;
    });
  }

  function updateEvidence(projectId, evidenceId, patch) {
    return mutateProject(projectId, (project) => {
      const item = project.evidence.find((entry) => entry.id === evidenceId);
      if (item) Object.assign(item, patch);
      return item;
    });
  }

  function setEvidenceStatus(projectId, evidenceId, status) {
    return mutateProject(projectId, (project) => {
      const item = project.evidence.find((entry) => entry.id === evidenceId);
      if (!item) return;
      item.status = status;
      logActivity(
        project,
        status === 'accepted' ? 'Evidence linked to the proposal' : 'Evidence marked for review',
        status === 'accepted' ? 'teal' : 'orange'
      );
    });
  }

  function deleteEvidence(projectId, evidenceId) {
    return mutateProject(projectId, (project) => {
      project.evidence = project.evidence.filter((entry) => entry.id !== evidenceId);
      logActivity(project, 'Evidence record deleted', 'orange');
    });
  }

  function addNote(projectId, input) {
    return mutateProject(projectId, (project) => {
      project.notes.unshift({
        id: uid('note'),
        title: input.title,
        tag: input.tag || 'Research note',
        body: input.body,
        createdAt: nowISO()
      });
      logActivity(project, 'Research note recorded', 'purple');
    });
  }

  function deleteNote(projectId, noteId) {
    return mutateProject(projectId, (project) => {
      project.notes = project.notes.filter((note) => note.id !== noteId);
      logActivity(project, 'Research note deleted', 'orange');
    });
  }

  function setGapStatus(projectId, gapId, status) {
    return mutateProject(projectId, (project) => {
      const gap = project.gaps.find((item) => item.id === gapId);
      if (!gap) return;
      gap.status = status;
      logActivity(
        project,
        status === 'accepted' ? 'Research gap accepted as a working direction' : 'Research gap rejected',
        status === 'accepted' ? 'teal' : 'orange'
      );
    });
  }

  function updateDesign(projectId, patch) {
    return mutateProject(projectId, (project) => {
      project.design = Object.assign({}, project.design, patch);
      logActivity(project, 'Experimental design updated', 'blue');
    });
  }

  function addDesignItem(projectId, key, value) {
    return mutateProject(projectId, (project) => {
      project.design[key] = project.design[key] || [];
      project.design[key].push(value);
      logActivity(project, 'Design field added', 'blue');
    });
  }

  function removeDesignItem(projectId, key, index) {
    return mutateProject(projectId, (project) => {
      if (!project.design[key]) return;
      project.design[key].splice(index, 1);
      logActivity(project, 'Design field removed', 'orange');
    });
  }

  function addGroup(projectId, input) {
    return mutateProject(projectId, (project) => {
      project.design.groups.push({
        id: uid('grp'),
        name: input.name,
        role: input.role,
        basis: input.basis || 'User added',
        status: 'review'
      });
      logActivity(project, 'Experimental group added', 'blue');
    });
  }

  function removeGroup(projectId, groupId) {
    return mutateProject(projectId, (project) => {
      project.design.groups = project.design.groups.filter((group) => group.id !== groupId);
      logActivity(project, 'Experimental group removed', 'orange');
    });
  }

  function setGroupStatus(projectId, groupId, status) {
    return mutateProject(projectId, (project) => {
      const group = project.design.groups.find((item) => item.id === groupId);
      if (group) group.status = status;
    });
  }

  function addRisk(projectId, input) {
    return mutateProject(projectId, (project) => {
      project.design.risks.push({
        id: uid('risk'),
        text: input.text,
        level: input.level || 'Medium',
        status: 'Open'
      });
      logActivity(project, 'Design risk recorded', 'orange');
    });
  }

  function setRiskStatus(projectId, riskId, status) {
    return mutateProject(projectId, (project) => {
      const risk = project.design.risks.find((item) => item.id === riskId);
      if (risk) risk.status = status;
      logActivity(
        project,
        status === 'Resolved' ? 'Design risk marked resolved' : 'Design risk reopened',
        status === 'Resolved' ? 'teal' : 'orange'
      );
    });
  }

  function removeRisk(projectId, riskId) {
    return mutateProject(projectId, (project) => {
      project.design.risks = project.design.risks.filter((risk) => risk.id !== riskId);
      logActivity(project, 'Design risk removed', 'orange');
    });
  }

  function addTask(projectId, input) {
    return mutateProject(projectId, (project) => {
      project.tasks.push({
        id: uid('task'),
        label: input.label,
        window: input.window || '',
        status: input.status || 'Planned'
      });
      logActivity(project, 'Timeline task added', 'blue');
    });
  }

  function setTaskStatus(projectId, taskId, status) {
    return mutateProject(projectId, (project) => {
      const task = project.tasks.find((item) => item.id === taskId);
      if (task) task.status = status;
    });
  }

  function removeTask(projectId, taskId) {
    return mutateProject(projectId, (project) => {
      project.tasks = project.tasks.filter((task) => task.id !== taskId);
      logActivity(project, 'Timeline task removed', 'orange');
    });
  }

  /* -------------------------------------------------------------- derived */

  function completion(project) {
    if (!project) return 0;
    let score = 0;
    if (project.question && project.question.status === 'confirmed') score += 25;
    else if (project.question && project.question.text) score += 12;
    if (project.sources.length >= 3) score += 15;
    else score += project.sources.length * 4;
    if (project.evidence.length >= 6) score += 25;
    else score += Math.round(project.evidence.length * 4);
    if (project.gaps.some((gap) => gap.status === 'accepted')) score += 10;
    if (project.design.hypothesis && project.design.groups.length) score += 15;
    if (project.design.risks.every((risk) => risk.status === 'Resolved')) score += 10;
    return Math.max(0, Math.min(100, score));
  }

  function qualityReport(project) {
    const issues = [];
    const accepted = project.evidence.filter((item) => item.status === 'accepted');
    const needsReview = project.evidence.filter((item) => item.status === 'review');
    const unsourced = project.evidence.filter((item) => !item.location);
    const unresolvedConflicts = project.evidence.filter((item) => item.relation === 'conflict');
    const openRisks = project.design.risks.filter((risk) => risk.status !== 'Resolved');

    if (needsReview.length) {
      issues.push({
        id: 'evidence-review',
        level: 'High',
        title: needsReview.length + ' evidence record(s) still need review',
        detail: 'Anything marked "needs review" should be checked before it is used to justify the proposal.',
        target: 'evidence'
      });
    }
    if (unsourced.length) {
      issues.push({
        id: 'evidence-location',
        level: 'High',
        title: unsourced.length + ' evidence record(s) have no source location',
        detail: 'Without a page, table or figure reference the claim cannot be verified by a reviewer.',
        target: 'evidence'
      });
    }
    if (unresolvedConflicts.length) {
      issues.push({
        id: 'conflict',
        level: 'Medium',
        title: unresolvedConflicts.length + ' conflicting evidence record(s) are unresolved',
        detail: 'Explain the differing conditions or keep the conflict visible instead of averaging it away.',
        target: 'evidence'
      });
    }
    if (!project.design.groups.some((group) => group.role === 'Control')) {
      issues.push({
        id: 'control',
        level: 'High',
        title: 'No control group defined',
        detail: 'A comparison needs a baseline before it can support a conclusion.',
        target: 'design'
      });
    }
    if (!project.design.metrics.length) {
      issues.push({
        id: 'metrics',
        level: 'Medium',
        title: 'No evaluation metric defined',
        detail: 'Decide what will be measured before the pilot runs.',
        target: 'design'
      });
    }
    openRisks.forEach((risk) => {
      issues.push({
        id: 'risk-' + risk.id,
        level: risk.level,
        title: risk.text,
        detail: 'Open design risk · status ' + risk.status,
        target: 'design'
      });
    });

    return {
      evidenceTotal: project.evidence.length,
      evidenceAccepted: accepted.length,
      needsReview: needsReview.length,
      unresolvedConflicts: unresolvedConflicts.length,
      openRisks: openRisks.length,
      issues,
      blocking: issues.filter((issue) => issue.level === 'High').length,
      citationCoverage: project.evidence.length ? Math.round((accepted.length / project.evidence.length) * 100) : 0
    };
  }

  function exportJSON() {
    const user = getSession();
    if (!user) return '{}';
    const db = readDB();
    const bucket = userBucket(db, user.email);
    return JSON.stringify(
      {
        exportedAt: nowISO(),
        user: { email: user.email, name: user.name },
        projects: bucket.projects
      },
      null,
      2
    );
  }

  function resetDemo() {
    const user = getSession();
    if (!user) return;
    const db = readDB();
    const bucket = userBucket(db, user.email);
    const project = createDemoProject();
    bucket.projects = [project];
    bucket.activeProjectId = project.id;
    bucket.ui = { evidenceFilter: 'all', evidenceQuery: '' };
    writeDB(db);
  }

  NS.Store = {
    DEMO_ACCOUNT,
    ensureDemoUser,
    getSession,
    signIn,
    signUp,
    signOut,
    listProjects,
    getActiveProject,
    getActiveProjectId,
    setActiveProject,
    getUI,
    setUI,
    createProject,
    createDemoProjectForCurrentUser,
    deleteProject,
    updateProject,
    updateConstraints,
    updateQuestion,
    confirmQuestion,
    refineQuestion,
    addSource,
    deleteSource,
    addEvidence,
    updateEvidence,
    setEvidenceStatus,
    deleteEvidence,
    addNote,
    deleteNote,
    setGapStatus,
    updateDesign,
    addDesignItem,
    removeDesignItem,
    addGroup,
    removeGroup,
    setGroupStatus,
    addRisk,
    setRiskStatus,
    removeRisk,
    addTask,
    setTaskStatus,
    removeTask,
    completion,
    qualityReport,
    exportJSON,
    resetDemo
  };
})(typeof window !== 'undefined' ? window : globalThis);
