import { loadFiles, loadEnrichment, buildModel, dataAge } from './data.js';
import {
  STANDING, esc, day, fmtDate, daysBetween, todayUtc, plural, sampleTag, stateBadge, stateDot, crumbs, storyTable,
} from './util.js';
import { viewOutcomes, viewUsers, viewGuardrails, viewSystems } from './tabs.js';
import { viewProject } from './project.js';
import { viewAgents } from './agents.js';
import { viewKnowledge, renderMatrix, renderSearch } from './knowledge.js';
import { viewDataModel } from './datamodel.js';

const TABS = [
  { key: 'overview', label: 'Overview', blurb: 'What the system does, which release you are in, and the headline counts.' },
  { key: 'outcomes', label: 'Outcomes', blurb: 'The numbers this has to move, baseline to target, and which stories move them.' },
  { key: 'users', label: 'Users', blurb: 'A card per role: what they do today, what changes, and how they touch the system.' },
  { key: 'guardrails', label: 'Guardrails', blurb: 'What must never happen, and whether any verified story enforces it yet.' },
  { key: 'systems', label: 'Systems', blurb: 'What this connects to, with honest grey status until your system reports otherwise.' },
  { key: 'project', label: 'Project', blurb: 'Gantt of releases, every story with due and baseline dates, and dependencies.' },
  { key: 'agents', label: 'AI agents', blurb: 'Who owns which stories, the workflow between them, and where a human sits.' },
  { key: 'knowledge', label: 'Knowledge base', blurb: 'Traceability matrix, what you said at intake, decisions, notes and a local search.' },
  { key: 'data-model', label: 'Data model', blurb: 'The proposed entities and relationships, labelled "proposed, not built".' },
];

let files = null;
let mode = readMode();
// View state that is not data: table sort, knowledge filters, search text.
const ui = { sort: { key: 'due', dir: 1 }, kb: { kind: '', priority: '', text: '' }, q: '' };

function readMode() {
  try { return localStorage.getItem('cc-mode') === 'sample' ? 'sample' : 'real'; } catch { return 'real'; }
}
function saveMode(m) {
  try { localStorage.setItem('cc-mode', m); } catch { /* storage unavailable: mode just isn't remembered */ }
}

// ---------------------------------------------------------------- shell
function renderShell(m, route) {
  const tab = route[0] || 'overview';
  const age = dataAge(m.manifest);
  const name = m.plan.project?.name ?? m.plan.project_name ?? 'Your project';
  const descriptor = m.plan.project?.descriptor ?? m.plan.descriptor ?? '';
  document.title = `${name} · Command Center`;
  return `
  <header class="site-header">
    <div class="header-row">
      <div class="brand"><strong>${esc(name)} · Command Center</strong><span>${esc(descriptor)}</span></div>
      <div class="header-tools">
        <span class="stamp${age.stale ? ' stale' : ''}" id="stamp" role="status">${esc(age.text)}</span>
        <div class="mode-switch" role="group" aria-label="Data mode">
          <button type="button" data-mode="real" aria-pressed="${!m.sample}">Real</button>
          <button type="button" class="sample" data-mode="sample" aria-pressed="${m.sample}">Sample</button>
        </div>
      </div>
    </div>
    <nav class="tabs" aria-label="Command Center tabs">
      ${TABS.map((t) => `<a href="#/${t.key}"${t.key === tab ? ' aria-current="page"' : ''}>${esc(t.label)}</a>`).join('')}
    </nav>
  </header>
  ${m.sample ? `<div class="sample-banner" role="note"><div><strong>SAMPLE DATA.</strong> Every story state, tick and point on this screen is made up to show the layout. None of it is your project's real progress. Switch to <strong>Real</strong> before you demo.</div></div>` : ''}
  <main id="main" class="${m.sample ? 'is-sample' : ''}">${renderRoute(m, route)}</main>`;
}

function renderRoute(m, route) {
  const [tab, sub, id] = route;
  if (tab === 'story' && sub) return viewStory(m, decodeURIComponent(sub));
  if (!tab || tab === 'overview') {
    if (sub === 'understanding' && id) return viewUnderstanding(m, decodeURIComponent(id));
    if (sub === 'release' && id) return viewRelease(m, decodeURIComponent(id));
    if (sub === 'totals' && id) return viewTotals(m, decodeURIComponent(id));
    if (sub === 'term') return viewTerm(m);
    if (sub === 'live') return viewLive(m);
    return viewOverview(m);
  }
  const args = [m, sub && decodeURIComponent(sub), id && decodeURIComponent(id), ui];
  if (tab === 'outcomes') return viewOutcomes(...args);
  if (tab === 'users') return viewUsers(...args);
  if (tab === 'guardrails') return viewGuardrails(...args);
  if (tab === 'systems') return viewSystems(...args);
  if (tab === 'project') return viewProject(...args);
  if (tab === 'agents') return viewAgents(...args);
  if (tab === 'knowledge') return viewKnowledge(...args);
  if (tab === 'data-model') return viewDataModel(...args);
  return `<div class="not-built"><h2>No page here</h2><p>There is no tab called “${esc(tab)}”. <a href="#/overview">Back to Overview</a>.</p></div>`;
}

// ---------------------------------------------------------------- Overview
function viewOverview(m) {
  const u = m.understanding.entries || [];
  const problems = u.filter((e) => e.dimension === 'problem');
  const success = u.filter((e) => e.dimension === 'success_definition');
  // The shortest "problem" statement is the one that reads as a single headline.
  const problem = [...problems].sort((a, b) => a.statement.length - b.statement.length)[0];
  // First two paragraphs: what it costs today, then the goal. The rest is one click away.
  const successFirst = success[0]?.statement.split(/\n\s*\n/).slice(0, 2).join('\n\n');
  const name = m.plan.project?.name ?? m.plan.project_name;

  const quoteCard = (title, entry, text, dim) => entry ? `
    <a class="card" href="#/overview/understanding/${esc(dim)}">
      <div class="quote-label">${esc(title)} — in your words · ${esc(STANDING[entry.standing] ?? entry.standing)}</div>
      <p class="quote">${esc(text)}</p>
      <span class="more">Everything you said about this →</span>
    </a>` : `
    <a class="card" href="#/overview/understanding/${esc(dim)}">
      <div class="quote-label">${esc(title)}</div>
      <p class="muted">Nothing recorded in the plan yet. It comes from what you say at intake.</p>
      <span class="more">What will be here →</span>
    </a>`;

  return `
  <section class="hero" aria-label="What this is">
    <div class="card">
      <h1>${esc(name)}</h1>
      <p class="muted">${esc(m.plan.project?.descriptor ?? m.plan.descriptor ?? '')}</p>
      ${termBlock(m)}
      <a class="more" href="#/overview/term" style="color:var(--accent);font-size:.85rem">Term dates and prep →</a>
    </div>
    ${quoteCard('The problem', problem, problem?.statement, 'problem')}
    ${quoteCard('What good looks like', success[0], successFirst, 'success_definition')}
  </section>

  <section class="section" aria-label="Release track">
    <div class="section-head"><h2>Release track${sampleTag(m)}</h2><span class="muted small">Each segment is a release on a real date axis, filled by how many of its stories are verified. Click one to open it.</span></div>
    <div class="card">${releaseTrack(m)}</div>
  </section>

  <section class="section" aria-label="Next up">
    <div class="grid">
      ${nextStoryCard(m)}
      ${liveCard(m)}
    </div>
  </section>

  <section class="section" aria-label="Headline counts">
    <div class="section-head"><h2>Headline counts${sampleTag(m)}</h2><span class="muted small">Totals as the platform summed them in progress.json.</span></div>
    <div class="grid">${countTiles(m)}</div>
  </section>`;
}

function termBlock(m) {
  const s = m.plan.schedule;
  if (!s || !s.build_start || !s.demo_day) {
    return '<p class="muted small">The plan carries no term dates yet, so where you are in the term cannot be shown.</p>';
  }
  const start = day(s.build_start); const end = day(s.demo_day); const buildEnd = day(s.build_end);
  const today = todayUtc();
  const span = end - start;
  const pct = (d) => Math.min(100, Math.max(0, ((d - start) / span) * 100));
  let where;
  if (today < start) where = `Build starts in ${plural(daysBetween(today, start), 'day')} (${fmtDate(s.build_start)}).`;
  else if (buildEnd && today <= buildEnd) where = `Week ${Math.floor(daysBetween(start, today) / 7) + 1} of ${s.build_weeks ?? '?'} · ${plural(daysBetween(today, end), 'day')} to demo day.`;
  else if (today <= end) where = `Build window closed · demo prep · ${plural(daysBetween(today, end), 'day')} to demo day.`;
  else where = `Demo day was ${fmtDate(s.demo_day)}. Releases after it are roadmap.`;
  return `
    <p style="margin:.75rem 0 0"><strong>${esc(where)}</strong></p>
    <div class="term" role="img" aria-label="Term from ${esc(fmtDate(s.build_start))} to demo day ${esc(fmtDate(s.demo_day))}">
      <div class="fill" style="left:0;width:${buildEnd ? pct(buildEnd) : 100}%"></div>
      <span class="mark today" style="left:${pct(today)}%">today</span>
    </div>
    <div class="term-legend"><span>Build ${esc(fmtDate(s.build_start))}</span><span>build ends ${esc(fmtDate(s.build_end))}</span><span>Demo ${esc(fmtDate(s.demo_day))}</span></div>`;
}

function releaseTrack(m) {
  const rel = m.releases;
  if (!rel.length) return '<p class="muted">The plan has no releases yet.</p>';
  const dated = rel.every((r) => r.starts_on && r.ends_on);
  const here = m.nextStory?.release;
  let pos;
  let min; let span;
  if (dated) {
    min = Math.min(...rel.map((r) => day(r.starts_on)));
    const max = Math.max(...rel.map((r) => day(r.ends_on)));
    span = max - min || 1;
    pos = (r) => {
      const left = ((day(r.starts_on) - min) / span) * 100;
      const width = Math.max(((day(r.ends_on) - day(r.starts_on)) / span) * 100, 2.2);
      return { left, width };
    };
  } else {
    pos = (r) => ({ left: (rel.indexOf(r) / rel.length) * 100, width: 100 / rel.length - 0.6 });
  }
  const segs = rel.map((r) => {
    const { left, width } = pos(r);
    const frac = r.stories.length ? r.verified / r.stories.length : 0;
    const cls = ['seg', r.is_roadmap ? 'roadmap' : '', r.is_demo_target ? 'demo' : '', r.key === here ? 'here' : ''].join(' ');
    const title = `${r.key} · ${r.name} · ${r.checked ? `${r.verified} of ${r.stories.length} verified` : 'not checked yet'}${r.is_demo_target ? ' · demo target' : ''}${r.is_roadmap ? ' · roadmap' : ''}`;
    return `<a class="${cls}" href="#/overview/release/${esc(r.key)}" style="left:${left}%;width:${width}%" title="${esc(title)}" aria-label="${esc(title)}">
      <span class="done" style="width:${(frac * 100).toFixed(1)}%"></span><span class="lbl">${esc(r.key)}</span></a>`;
  }).join('');
  const flags = [];
  const demoRel = rel.find((r) => r.is_demo_target);
  if (demoRel) { const p = pos(demoRel); flags.push(`<span class="flag top demo" style="left:${p.left + p.width / 2}%">★ demo target</span>`); }
  const hereRel = rel.find((r) => r.key === here);
  if (hereRel) { const p = pos(hereRel); flags.push(`<span class="flag bottom here" style="left:${p.left + p.width / 2}%">▲ you are here</span>`); }
  const demoDay = m.plan.schedule?.demo_day;
  if (dated && demoDay) {
    const left = ((day(demoDay) - min) / span) * 100;
    if (left >= 0 && left <= 100) flags.push(`<span class="demo-line" style="left:${left}%" title="Demo day ${esc(fmtDate(demoDay))}"></span>`);
  }
  return `<div class="track-wrap"><div class="track">${segs}${flags.join('')}</div></div>
    <div class="legend">
      <span><i style="background:var(--ok)"></i>verified share</span>
      <span><i style="border:2px solid var(--ok)"></i>demo target</span>
      <span><i style="border:1px dashed var(--border);opacity:.5"></i>roadmap — after demo day (dotted line)</span>
      <span>${dated ? `${esc(fmtDate(rel[0].starts_on))} → ${esc(fmtDate(rel[rel.length - 1].ends_on))}` : 'Releases are undated in the plan, so the track is undated too.'}</span>
    </div>`;
}

function nextStoryCard(m) {
  const s = m.nextStory;
  if (!s) return `<a class="card" href="#/project"><div class="quote-label">Next story to build</div><p>Every story in the plan is verified.</p><span class="more">All stories →</span></a>`;
  const r = m.releases.find((x) => x.key === s.release);
  return `<a class="card" href="#/story/${esc(s.id)}">
    <div class="quote-label">Next story to build${sampleTag(m)}</div>
    <h3 style="margin-top:.3rem">${esc(s.id)} — ${esc(s.title)}</h3>
    <p class="muted small">${esc(r ? `${r.key} · ${r.name}` : s.release)} · due ${esc(fmtDate(s.due_on))} · ${stateBadge(s.state)}</p>
    <p class="small">${esc(s.narrative)}</p>
    <span class="more">Open the story →</span></a>`;
}

function liveCard(m) {
  const verified = m.stories.filter((s) => s.state === 'verified');
  const body = !m.anyChecked
    ? '<p>Not checked yet. No story has been through verification, so nothing can be called live.</p>'
    : verified.length
      ? `<p>${plural(verified.length, 'story')} verified. Everything else is not live yet.</p>`
      : '<p><strong>Nothing is live yet.</strong> No story in the plan is verified, so no part of the system can be claimed as working.</p>';
  return `<a class="card" href="#/overview/live">
    <div class="quote-label">What is live and what is not${sampleTag(m)}</div>
    ${body}
    <span class="more">See it story by story →</span></a>`;
}

function countTiles(m) {
  const t = m.progress.totals || {};
  const extra = m.extraStories.map((s) => s.id);
  const named = extra.map((id) => (id === 'STORY-000' ? 'this Command Center (STORY-000)' : id));
  const extraNote = extra.length
    ? `${t.stories_total} stories, including ${named.length > 1 ? `${named.slice(0, -1).join(', ')} and ${named[named.length - 1]}` : named[0]} — ${plural(extra.length, 'story')} beyond the ${m.stories.length} in the plan.`
    : `${t.stories_total} stories.`;
  if (!m.anyChecked) {
    return ['Stories verified', 'Criteria passed', 'Points awarded'].map((label, i) => `
      <a class="card" href="#/overview/totals/${['stories', 'criteria', 'points'][i]}">
        <div class="quote-label">${label}</div><div class="big unknown">not checked yet</div>
        <span class="more">Breakdown →</span></a>`).join('');
  }
  const tile = (key, label, n, of, note) => `
    <a class="card" href="#/overview/totals/${key}">
      <div class="quote-label">${label}${sampleTag(m)}</div>
      <div class="big">${esc(n)}${of !== undefined ? ` <small>of ${esc(of)}</small>` : ''}</div>
      ${of ? `<div class="meter" aria-hidden="true"><span style="width:${(100 * n / of).toFixed(1)}%"></span></div>` : ''}
      <p class="muted small" style="margin:.5rem 0 0">${esc(note)}</p>
      <span class="more">Breakdown →</span></a>`;
  return tile('stories', 'Stories verified', t.stories_verified, t.stories_total, extraNote)
    + tile('criteria', 'Acceptance criteria passed', t.criteria_passed, t.criteria_total, 'Across every story, as ticked in progress.json and checked by the platform.')
    + tile('points', 'Points awarded', t.points_awarded, undefined, 'Points come only from verified stories.');
}

// ---------------------------------------------------------------- Overview drill-downs
function viewUnderstanding(m, dim) {
  const entries = (m.understanding.entries || []).filter((e) => e.dimension === dim);
  const heading = entries[0]?.heading ?? dim.replace(/_/g, ' ');
  return `${crumbs(['#/overview', 'Overview'], [null, heading])}
    <h2>${esc(heading)}</h2>
    <p class="muted">Quoted from what you said at intake (<code>plan.derived.understanding</code>, dimension <code>${esc(dim)}</code>). These are your statements, not measured results.</p>
    ${entries.length ? entries.map((e) => `<div class="card section"><div class="quote-label">${esc(STANDING[e.standing] ?? e.standing)}</div><p class="quote">${esc(e.statement)}</p></div>`).join('')
      : '<div class="not-built"><p>Nothing recorded for this yet. It fills in from what you tell the platform at intake.</p></div>'}`;
}

function viewTerm(m) {
  const s = m.plan.schedule;
  if (!s) return `${crumbs(['#/overview', 'Overview'], [null, 'Term'])}<div class="not-built"><p>The plan carries no schedule, so the term is undated.</p></div>`;
  return `${crumbs(['#/overview', 'Overview'], [null, 'Term'])}
    <h2>Term</h2>
    <div class="card"><dl class="kv">
      <dt>Build starts</dt><dd>${esc(fmtDate(s.build_start))}</dd>
      <dt>Build ends</dt><dd>${esc(fmtDate(s.build_end))}</dd>
      <dt>Demo day</dt><dd>${esc(fmtDate(s.demo_day))}</dd>
      <dt>Build weeks</dt><dd>${esc(s.build_weeks ?? '—')}</dd>
      <dt>Demo release</dt><dd><a href="#/overview/release/${esc(s.demo_release_key)}">${esc(s.demo_release_key)}</a></dd>
      <dt>Roadmap</dt><dd>${(s.roadmap_release_keys || []).map((k) => `<a href="#/overview/release/${esc(k)}">${esc(k)}</a>`).join(', ') || '—'}</dd>
    </dl></div>
    <div class="section"><h3>Demo prep</h3>
      ${(s.prep || []).length ? `<div class="table-wrap"><table><thead><tr><th>Key</th><th>Task</th><th>Due</th></tr></thead><tbody>
        ${s.prep.map((p) => `<tr><td>${esc(p.key)}</td><td>${esc(p.title)}</td><td>${esc(fmtDate(p.due_on))}</td></tr>`).join('')}</tbody></table></div>`
        : '<p class="muted">No prep tasks in the plan.</p>'}
    </div>`;
}

function viewRelease(m, key) {
  const r = m.releases.find((x) => x.key === key);
  if (!r) return `${crumbs(['#/overview', 'Overview'], [null, key])}<div class="not-built"><p>No release “${esc(key)}” in the plan.</p></div>`;
  return `${crumbs(['#/overview', 'Overview'], [null, `${r.key} · ${r.name}`])}
    <h2>${esc(r.key)} · ${esc(r.name)}${sampleTag(m)}</h2>
    <p>${r.is_demo_target ? '<span class="tag ok">demo target</span> ' : ''}${r.is_roadmap ? '<span class="tag grey">roadmap — after demo day</span> ' : ''}${r.key === m.nextStory?.release ? '<span class="tag accent">you are here</span>' : ''}</p>
    <div class="card"><dl class="kv">
      <dt>Dates</dt><dd>${esc(fmtDate(r.starts_on))} → ${esc(fmtDate(r.ends_on))}</dd>
      <dt>Goal</dt><dd>${esc(r.goal)}</dd>
      <dt>Demo</dt><dd>${esc(r.demo)}</dd>
      <dt>Verified</dt><dd>${r.checked ? `${r.verified} of ${r.stories.length} stories` : 'not checked yet'}</dd>
    </dl></div>
    <div class="section"><h3>Stories</h3>${storyTable(m, r.stories)}</div>`;
}

function viewLive(m) {
  return `${crumbs(['#/overview', 'Overview'], [null, 'What is live'])}
    <h2>What is live and what is not${sampleTag(m)}</h2>
    <p class="muted">A story counts as live only when the platform has verified it. Everything else is not live, however finished it looks.</p>
    ${m.releases.map((r) => `<div class="section"><h3><a href="#/overview/release/${esc(r.key)}">${esc(r.key)} · ${esc(r.name)}</a></h3>
      <ul class="clean card">${r.stories.map((s) => `<li>${stateDot(s.state)}<a href="#/story/${esc(s.id)}">${esc(s.id)}</a> ${esc(s.title)} ${stateBadge(s.state)}</li>`).join('')}</ul></div>`).join('')}`;
}

function viewTotals(m, which) {
  const t = m.progress.totals || {};
  const label = { stories: 'Stories', criteria: 'Acceptance criteria', points: 'Points' }[which];
  if (!label) return `${crumbs(['#/overview', 'Overview'], [null, which])}<div class="not-built"><p>No breakdown called “${esc(which)}”.</p></div>`;
  const head = `${crumbs(['#/overview', 'Overview'], [null, label])}<h2>${label} — breakdown${sampleTag(m)}</h2>`;
  if (!m.anyChecked) return `${head}<div class="not-built"><p>Not checked yet. The platform has not verified any story, so there is nothing to break down. Push your work and sync from the portal.</p></div>`;

  if (which === 'stories') {
    const rows = [['verified', t.stories_verified], ['submitted', t.stories_submitted], ['in progress', t.stories_in_progress], ['not started', t.stories_not_started]];
    return `${head}
      <div class="card"><dl class="kv">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v ?? '—')}</dd>`).join('')}<dt>total</dt><dd>${esc(t.stories_total)}</dd></dl></div>
      ${m.extraStories.length ? `<div class="section"><h3>Beyond the plan</h3><p class="muted small">In progress.json but not in plan.json.</p>
        <ul class="clean card">${m.extraStories.map((s) => `<li>${esc(s.id)} ${stateBadge(s.verification?.state ?? null)}${s.id === 'STORY-000' ? ' <span class="muted small">— this Command Center</span>' : ''}</li>`).join('')}</ul></div>` : ''}
      <div class="section"><h3>By release</h3><div class="table-wrap"><table><thead><tr><th>Release</th><th>Verified</th><th>Stories</th></tr></thead><tbody>
      ${m.releases.map((r) => `<tr><td><a href="#/overview/release/${esc(r.key)}">${esc(r.key)} · ${esc(r.name)}</a></td><td>${r.checked ? r.verified : 'not checked yet'}</td><td>${r.stories.length}</td></tr>`).join('')}
      </tbody></table></div></div>`;
  }
  if (which === 'criteria') {
    return `${head}<p class="muted">${esc(t.criteria_passed)} of ${esc(t.criteria_total)} criteria passed overall. Per story:</p>
      ${m.releases.map((r) => `<div class="section"><h3>${esc(r.key)} · ${esc(r.name)}</h3>${storyTable(m, r.stories)}</div>`).join('')}`;
  }
  const earned = m.stories.filter((s) => s.points !== null && s.points !== undefined);
  return `${head}<p class="muted">${esc(t.points_awarded)} points awarded in total.</p>
    ${earned.length ? `<div class="table-wrap"><table><thead><tr><th>Story</th><th>Title</th><th>Points</th></tr></thead><tbody>
      ${earned.map((s) => `<tr><td><a href="#/story/${esc(s.id)}">${esc(s.id)}</a></td><td>${esc(s.title)}</td><td>${esc(s.points)}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="not-built"><p>No story has been awarded points yet. Points arrive when a story is verified.</p></div>'}`;
}

// ---------------------------------------------------------------- story detail
function viewStory(m, id) {
  const s = m.storyById.get(id);
  if (!s) {
    const extra = m.extraStories.find((x) => x.id === id);
    if (!extra) return `${crumbs(['#/overview', 'Overview'], [null, id])}<div class="not-built"><p>No story “${esc(id)}” in the plan.</p></div>`;
    return `${crumbs(['#/overview', 'Overview'], [null, id])}<h2>${esc(id)}</h2><p class="muted">This story lives in progress.json only; see docs/stories/${esc(id)}.md.</p>
      <ul class="clean card">${(extra.criteria || []).map((c) => `<li><span class="tick ${c.passed ? 'yes' : 'no'}">${c.passed ? '✓' : '○'}</span>${esc(c.text)}</li>`).join('')}</ul>`;
  }
  const r = m.releases.find((x) => x.key === s.release);
  const crit = s.progress?.criteria || [];
  const passedText = new Set(crit.filter((c) => c.passed).map((c) => c.text));
  const slip = s.due_on && s.due_baseline_on ? daysBetween(day(s.due_baseline_on), day(s.due_on)) : null;
  return `${crumbs(['#/overview', 'Overview'], r ? [`#/overview/release/${r.key}`, `${r.key} · ${r.name}`] : [null, s.release], [null, s.id])}
    <h2>${esc(s.id)} — ${esc(s.title)}${sampleTag(m)}</h2>
    <p>${stateBadge(s.state)}</p>
    <div class="card"><p class="quote" style="margin-top:0">${esc(s.narrative)}</p></div>
    <div class="section card"><dl class="kv">
      <dt>Release</dt><dd>${r ? `<a href="#/overview/release/${esc(r.key)}">${esc(r.key)} · ${esc(r.name)}</a>` : esc(s.release)}</dd>
      <dt>Owner</dt><dd>${esc(s.owner_agent ?? '—')}</dd>
      <dt>Due</dt><dd>${esc(fmtDate(s.due_on))}</dd>
      <dt>Baseline</dt><dd>${esc(fmtDate(s.due_baseline_on))}${slip ? ` · <strong>${slip > 0 ? '+' : ''}${slip} days slippage</strong>` : slip === 0 ? ' · no slippage' : ''}</dd>
      <dt>Blocked by</dt><dd>${(s.blocked_by || []).length ? s.blocked_by.map((b) => `<a href="#/story/${esc(b)}">${esc(b)}</a>`).join(', ') : 'nothing'}</dd>
      <dt>Points</dt><dd>${s.points ?? '<span class="muted">none yet</span>'}</dd>
    </dl></div>
    <div class="section"><h3>Acceptance criteria</h3>
      <ul class="clean card">${(s.acceptance || []).map((a) => `<li><span class="tick ${passedText.has(a) ? 'yes' : 'no'}" aria-label="${passedText.has(a) ? 'passed' : 'not passed'}">${passedText.has(a) ? '✓' : '○'}</span>${esc(a)}</li>`).join('')}</ul></div>
    <div class="section"><h3>Failure paths</h3>
      ${(s.failure_paths || []).length ? `<ul class="clean card">${s.failure_paths.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : '<p class="muted">None listed.</p>'}</div>
    <div class="section"><h3>Requirements it fulfils</h3>
      ${(s.fulfills || []).length ? `<div class="table-wrap"><table><thead><tr><th>Req</th><th>Kind</th><th>Statement</th></tr></thead><tbody>
        ${s.fulfills.map((rid) => { const q = m.reqById.get(rid); return `<tr><td>${esc(rid)}</td><td>${esc(q?.kind ?? '')}</td><td>${esc(q?.statement ?? 'not in plan')}</td></tr>`; }).join('')}
      </tbody></table></div>` : '<p class="muted">None listed.</p>'}</div>
    ${s.task_guidance ? `<div class="section"><h3>Task guidance</h3><div class="card"><p style="margin:0;white-space:pre-wrap">${esc(s.task_guidance)}</p></div></div>` : ''}`;
}

// ---------------------------------------------------------------- boot
function parseRoute() {
  return (location.hash.replace(/^#\/?/, '') || 'overview').split('/').filter(Boolean);
}

let model = null;
function render() {
  if (!files) return;
  model = buildModel(files, mode);
  document.getElementById('app').innerHTML = renderShell(model, parseRoute());
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-mode]');
  if (b) { mode = b.dataset.mode; saveMode(mode); render(); return; }
  const s = e.target.closest('[data-sort]');
  if (s) {
    const key = s.dataset.sort;
    ui.sort = { key, dir: ui.sort.key === key ? -ui.sort.dir : 1 };
    render();
  }
});
// Knowledge-base filters re-render only the matrix, so the input keeps focus.
document.addEventListener('input', (e) => {
  const f = e.target.closest('[data-kb]');
  if (!f || !model) return;
  ui.kb[f.dataset.kb] = f.value;
  const el = document.getElementById('kb-matrix');
  if (el) el.innerHTML = renderMatrix(model, ui);
});
document.addEventListener('submit', (e) => {
  const f = e.target.closest('#kb-ask');
  if (!f || !model) return;
  e.preventDefault();
  ui.q = f.querySelector('input').value;
  const el = document.getElementById('kb-answer');
  if (el) el.innerHTML = renderSearch(model, ui.q);
});
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
setInterval(() => {
  const el = document.getElementById('stamp');
  if (el && files) { const a = dataAge(files.manifest); el.textContent = a.text; el.classList.toggle('stale', a.stale); }
}, 60000);

loadFiles().then((f) => {
  files = f;
  render();
  // Enrichment files are many small optional fetches; load them after first paint.
  loadEnrichment(f.plan).then((enrichment) => { files.enrichment = enrichment; render(); });
}).catch((err) => {
  document.getElementById('app').innerHTML = `<div class="error-box" role="alert"><h2>The Command Center could not load its data</h2><p>${esc(err.message)}</p></div>`;
});
