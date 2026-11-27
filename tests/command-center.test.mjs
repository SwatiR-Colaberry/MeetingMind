// Command Center tests. Run with: node --test tests/
// No dependencies: the page is rendered against the real .colaberry files with a
// stubbed DOM, so these check what a visitor would actually be shown.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async (p) => JSON.parse(await readFile(path.join(ROOT, p), 'utf8'));

// ---- minimal browser stand-ins --------------------------------------------
let html = '';
let override = {}; // path -> object | 404
const handlers = {};
globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.location = { hash: '' };
globalThis.window = { addEventListener: (e, f) => { handlers[`w${e}`] = f; }, scrollTo() {} };
globalThis.document = {
  getElementById: (id) => (id === 'app' ? { set innerHTML(v) { html = v; } } : null),
  addEventListener: (e, f) => { handlers[e] = f; },
};
globalThis.setInterval = () => 0;
globalThis.fetch = async (p) => {
  const rel = p.replace(/^\.\//, '');
  if (rel in override) {
    const v = override[rel];
    return v === 404 ? { ok: false, status: 404 } : { ok: true, json: async () => structuredClone(v) };
  }
  try {
    const text = await readFile(path.join(ROOT, rel), 'utf8');
    return { ok: true, json: async () => JSON.parse(text) };
  } catch {
    return { ok: false, status: 404 };
  }
};
const text = () => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const go = (hash) => { location.hash = hash; handlers.whashchange(); };
const setMode = (mode) => handlers.click({ target: { closest: (s) => (s === '[data-mode]' ? { dataset: { mode } } : null) } });

const { loadFiles, buildModel, dataAge } = await import('../command-center/data.js');
await import('../command-center/app.js');
await new Promise((r) => setTimeout(r, 200));

const TABS = ['overview', 'outcomes', 'users', 'guardrails', 'systems', 'project', 'agents', 'knowledge', 'data-model'];

// ---- happy path ------------------------------------------------------------
test('every tab is reachable and shows the data-as-of stamp', () => {
  setMode('real');
  for (const t of TABS) {
    go(`#/${t}`);
    assert.match(text(), /Data as of \d+ \w+ \d{4} \(/, `${t} shows the stamp`);
    assert.doesNotMatch(text(), /Not built yet|undefined|NaN|\[object Object\]/, `${t} renders fully`);
    assert.match(html, new RegExp(`href="#/${t}" aria-current="page"`), `${t} is the current tab`);
  }
});

test('every summary card on a tab links one level down', () => {
  setMode('real');
  for (const t of TABS) {
    go(`#/${t}`);
    const cards = html.match(/<a class="card[^"]*" href="([^"]+)"/g) || [];
    for (const c of cards) {
      const href = c.match(/href="([^"]+)"/)[1];
      go(href);
      assert.doesNotMatch(text(), /Nothing called|No page here/, `${t} card ${href} opens a real page`);
      go(`#/${t}`);
    }
  }
});

test('sample mode is labelled as sample on every tab', () => {
  setMode('sample');
  for (const t of TABS) {
    go(`#/${t}`);
    assert.match(html, /SAMPLE DATA/, `${t} carries the sample banner`);
  }
  setMode('real');
  go('#/overview');
  assert.doesNotMatch(html, /SAMPLE DATA/, 'real mode has no sample banner');
});

test('the project tab shows the real releases and due dates from plan.json', async () => {
  const plan = await read('.colaberry/plan.json');
  setMode('real');
  go('#/project');
  for (const r of plan.releases) assert.ok(html.includes(`${r.key} · `), `release ${r.key} is drawn`);
  const s = plan.stories[0];
  assert.ok(html.includes(s.id), 'first story is listed');
});

test('systems are never shown as connected', async () => {
  const plan = await read('.colaberry/plan.json');
  for (const mode of ['real', 'sample']) {
    setMode(mode);
    go('#/systems');
    const rows = html.match(/<tr><td><strong>[^<]+<\/strong><\/td><td><span class="dot" aria-hidden="true"><\/span>not checked from here<\/td>/g) || [];
    assert.equal(rows.length, plan.derived.systems.length, `every system row is grey in ${mode} mode`);
    assert.doesNotMatch(html, /class="dot ok"/, `no green status dot in ${mode} mode`);
  }
  setMode('real');
});

// ---- failure paths -----------------------------------------------------------
test('a story deleted from the plan disappears from the page', async () => {
  const plan = await read('.colaberry/plan.json');
  const gone = plan.stories[plan.stories.length - 1].id;
  plan.stories = plan.stories.filter((s) => s.id !== gone);
  const files = await loadFiles();
  const m = buildModel({ ...files, plan }, 'real');
  assert.ok(!m.stories.some((s) => s.id === gone));
  assert.ok(!m.releases.some((r) => r.stories.some((s) => s.id === gone)));
});

test('a missing plan.json is reported, not rendered as an empty page', async () => {
  override = { '.colaberry/plan.json': 404 };
  await assert.rejects(loadFiles(), /plan\.json is missing/);
  override = {};
});

test('data older than a week is shown as a warning', () => {
  const tenDaysAgo = new Date(Date.now() - 10 * 86400000).toISOString();
  const age = dataAge({ generated_at: tenDaysAgo });
  assert.equal(age.stale, true);
  assert.match(age.text, /10 days ago.*sync from the portal to refresh/);
  const fresh = dataAge({ generated_at: new Date(Date.now() - 2 * 86400000).toISOString() });
  assert.equal(fresh.stale, false);
  assert.equal(dataAge(null).stale, true, 'a missing manifest is a warning too');
});

test('a story the platform has not checked reads "not checked yet", never 0', async () => {
  const files = await loadFiles();
  const progress = structuredClone(files.progress);
  progress.stories.forEach((s) => { s.verification = null; });
  const m = buildModel({ ...files, progress }, 'real');
  assert.equal(m.anyChecked, false);
  assert.equal(m.stories[0].state, null);
  assert.equal(m.stories[0].passed, null);
});
