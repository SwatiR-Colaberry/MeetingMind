// The ONE place the Command Center gets its data from.
// Every tab reads the model built here; nothing about the plan is hard-coded.
// To point the page at your running system later, change this file only.

const FILES = {
  plan: './.colaberry/plan.json',
  progress: './.colaberry/progress.json',
  manifest: './.colaberry/manifest.json',
};

async function getJson(path, required) {
  let res;
  try {
    res = await fetch(path, { cache: 'no-store' });
  } catch (e) {
    if (required) throw new Error(`Could not fetch ${path}. Open this page over http (GitHub Pages, or "python3 -m http.server" in the repo), not as a file.`);
    return null;
  }
  if (!res.ok) {
    if (required) throw new Error(`${path} is missing (HTTP ${res.status}). It has to be committed in this repo.`);
    return null;
  }
  try {
    return await res.json();
  } catch (e) {
    throw new Error(`${path} is not valid JSON, so it cannot be read.`);
  }
}

export async function loadFiles() {
  const [plan, progress, manifest, notes, dataModel] = await Promise.all([
    getJson(FILES.plan, true),
    getJson(FILES.progress, true),
    getJson(FILES.manifest, false),
    // The student's own files, not plan content. Missing = nothing written yet.
    getJson('./command-center/notes.json', false),
    getJson('./command-center/data-model.json', false),
  ]);
  return { plan, progress, manifest, notes, dataModel, enrichment: null };
}

// What each story recorded when it finished: .colaberry/enrichment/<id>.json.
// A missing file just means that story has not recorded anything yet.
export async function loadEnrichment(plan) {
  const ids = ['STORY-000', ...(plan.stories || []).map((s) => s.id)];
  const found = await Promise.all(ids.map((id) => getJson(`./.colaberry/enrichment/${id}.json`, false).catch(() => null)));
  return ids.map((id, i) => ({ id, data: found[i] })).filter((e) => e.data);
}

// ---------------------------------------------------------------------------
// Sample mode: invented progress, generated from the SHAPE of the real plan so
// the page can be seen "full" on day one. It is never written anywhere and every
// screen that shows it is labelled as sample.
// ---------------------------------------------------------------------------
function makeSampleProgress(plan, realProgress) {
  const order = new Map(plan.releases.map((r, i) => [r.key, i]));
  const demoIdx = plan.releases.findIndex((r) => r.is_demo_target);
  const stories = plan.stories.map((s) => {
    const ri = order.get(s.release) ?? 99;
    const inRelease = plan.stories.filter((x) => x.release === s.release);
    const pos = inRelease.indexOf(s);
    let state = 'not_started';
    if (ri < demoIdx) state = pos === inRelease.length - 1 ? 'submitted' : 'verified';
    else if (ri === demoIdx) state = pos < 2 ? 'verified' : pos === 2 ? 'in_progress' : 'not_started';
    const total = s.acceptance.length;
    const passed = state === 'verified' ? total : state === 'submitted' ? total : state === 'in_progress' ? Math.floor(total / 2) : 0;
    return {
      id: s.id,
      release: s.release,
      acceptance_total: total,
      criteria: s.acceptance.map((text, i) => ({ text, passed: i < passed })),
      verification: {
        state,
        criteria_passed: passed,
        criteria_total: total,
        points_awarded: state === 'verified' ? total * 10 : null,
        commit_sha: state === 'verified' ? 'sample0' : null,
        outstanding: s.acceptance.slice(passed),
      },
    };
  });
  // Stories that exist only in the progress file (e.g. the Command Center) stay as they are.
  const planIds = new Set(plan.stories.map((s) => s.id));
  for (const s of realProgress.stories) if (!planIds.has(s.id)) stories.unshift({ ...s });
  const count = (st) => stories.filter((s) => s.verification?.state === st).length;
  const totals = {
    stories_total: stories.length,
    stories_verified: count('verified'),
    stories_submitted: count('submitted'),
    stories_in_progress: count('in_progress'),
    stories_not_started: count('not_started'),
    criteria_total: stories.reduce((n, s) => n + (s.criteria?.length ?? 0), 0),
    criteria_passed: stories.reduce((n, s) => n + (s.criteria?.filter((c) => c.passed).length ?? 0), 0),
    points_awarded: stories.reduce((n, s) => n + (s.verification?.points_awarded ?? 0), 0),
  };
  return { ...realProgress, totals, stories };
}

// ---------------------------------------------------------------------------
// The model every view reads.
// ---------------------------------------------------------------------------
export function buildModel(files, mode) {
  const { plan, manifest } = files;
  const sample = mode === 'sample';
  const progress = sample ? makeSampleProgress(plan, files.progress) : files.progress;
  const progressById = new Map((progress.stories || []).map((s) => [s.id, s]));

  const releases = plan.releases || [];
  const releaseIndex = new Map(releases.map((r, i) => [r.key, i]));

  // Story state comes from progress, never from plan. null = not checked yet.
  const stories = (plan.stories || []).map((s) => {
    const p = progressById.get(s.id);
    const v = p?.verification ?? null;
    return {
      ...s,
      progress: p ?? null,
      state: v?.state ?? null,
      passed: v ? v.criteria_passed : null,
      total: v?.criteria_total ?? s.acceptance?.length ?? 0,
      points: v?.points_awarded ?? null,
    };
  });
  const storyById = new Map(stories.map((s) => [s.id, s]));
  const reqById = new Map((plan.requirements || []).map((r) => [r.id, r]));

  // Build order: release order, then due date, then plan order.
  const ordered = [...stories].sort((a, b) =>
    (releaseIndex.get(a.release) ?? 99) - (releaseIndex.get(b.release) ?? 99) ||
    String(a.due_on ?? '').localeCompare(String(b.due_on ?? '')));
  const isDone = (s) => s.state === 'verified';
  const unblocked = (s) => (s.blocked_by || []).every((id) => !storyById.has(id) || isDone(storyById.get(id)));
  const nextStory = ordered.find((s) => !isDone(s) && unblocked(s)) ?? ordered.find((s) => !isDone(s)) ?? null;

  const releaseStats = releases.map((r) => {
    const rs = stories.filter((s) => s.release === r.key);
    return {
      ...r,
      stories: rs,
      verified: rs.filter(isDone).length,
      checked: rs.some((s) => s.state !== null),
    };
  });

  // Stories the progress file carries that the plan does not (e.g. STORY-000).
  const planIds = new Set(stories.map((s) => s.id));
  const extraStories = (progress.stories || []).filter((s) => !planIds.has(s.id));
  const anyChecked = (progress.stories || []).some((s) => s.verification);

  return {
    sample, plan, manifest, progress, stories, storyById, reqById, releases: releaseStats,
    releaseIndex, nextStory, extraStories, anyChecked,
    notes: files.notes, dataModel: files.dataModel, enrichment: files.enrichment,
    owners: [...new Set(stories.map((s) => s.owner_agent).filter(Boolean))],
    understanding: plan.derived?.understanding ?? { entries: [], unanswered: [] },
  };
}

// ---------------------------------------------------------------------------
// "Data as of" — from manifest.generated_at, absolute + relative.
// ---------------------------------------------------------------------------
export function dataAge(manifest, now = new Date()) {
  const at = manifest?.generated_at ? new Date(manifest.generated_at) : null;
  if (!at || Number.isNaN(at.getTime())) {
    return { text: 'Data age unknown — .colaberry/manifest.json is missing. Sync from the portal to refresh.', stale: true };
  }
  const days = (now - at) / 86400000;
  const abs = at.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  let rel;
  if (days < 0) rel = 'in the future — check your clock';
  else if (days < 1 / 24) rel = 'under an hour ago';
  else if (days < 1) rel = `${Math.floor(days * 24)} hour${Math.floor(days * 24) === 1 ? '' : 's'} ago`;
  else rel = `${Math.floor(days)} day${Math.floor(days) === 1 ? '' : 's'} ago`;
  const stale = days > 7;
  return {
    text: `Data as of ${abs} (${rel})${stale ? ' — over a week old: sync from the portal to refresh' : ''}`,
    stale,
  };
}
