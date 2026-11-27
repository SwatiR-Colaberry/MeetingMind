// Project management: Gantt of releases, story table with slippage, dependencies.
import { esc, day, fmtDate, daysBetween, todayUtc, stateBadge, stateDot, sampleTag, crumbs, notFound } from './util.js';

const STATE_ORDER = { verified: 0, submitted: 1, in_progress: 2, not_started: 3 };

function gantt(m) {
  const rel = m.releases;
  const s = m.plan.schedule;
  const dated = rel.filter((r) => r.starts_on && r.ends_on);
  if (!dated.length) return '<div class="not-built"><p>Your plan carries no release dates, so the chart is undated. It does not borrow dates from anywhere else.</p></div>';
  const starts = dated.map((r) => day(r.starts_on));
  if (s?.build_start) starts.push(day(s.build_start));
  const min = new Date(Math.min(...starts));
  const max = new Date(Math.max(...dated.map((r) => day(r.ends_on))));
  const L = 190; const W = 1000; const R = 16; const rowH = 30; const top = 34;
  const x = (d) => L + ((d - min) / (max - min || 1)) * (W - L - R);
  const height = top + rel.length * rowH + 14;
  // Month ticks
  const ticks = [];
  const t = new Date(Date.UTC(min.getUTCFullYear(), min.getUTCMonth() + 1, 1));
  while (t <= max) {
    ticks.push(`<line class="tick" x1="${x(t)}" y1="${top - 6}" x2="${x(t)}" y2="${height - 10}"/>
      <text class="tick-lbl" x="${x(t) + 3}" y="${top - 10}">${t.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' })}${t.getUTCMonth() === 0 ? ` ${t.getUTCFullYear()}` : ''}</text>`);
    t.setUTCMonth(t.getUTCMonth() + 1);
  }
  const bars = rel.map((r, i) => {
    const y = top + i * rowH;
    const label = `<a href="#/overview/release/${esc(r.key)}"><text class="row-lbl" x="8" y="${y + 19}">${esc(r.key)} · ${esc(r.name.length > 24 ? `${r.name.slice(0, 23)}…` : r.name)}</text></a>`;
    if (!r.starts_on || !r.ends_on) return `${label}<text class="tick-lbl" x="${L}" y="${y + 19}">undated</text>`;
    const x1 = x(day(r.starts_on)); const w = Math.max(x(day(r.ends_on)) - x1, 4);
    const frac = r.stories.length ? r.verified / r.stories.length : 0;
    return `${label}<a href="#/overview/release/${esc(r.key)}"><title>${esc(`${r.key} ${r.name}: ${fmtDate(r.starts_on)} → ${fmtDate(r.ends_on)}, ${r.checked ? `${r.verified}/${r.stories.length} verified` : 'not checked yet'}`)}</title>
      <rect class="bar${r.is_roadmap ? ' roadmap' : ''}${r.is_demo_target ? ' demo' : ''}" x="${x1}" y="${y + 6}" width="${w}" height="18" rx="4"/>
      <rect class="bar-done" x="${x1}" y="${y + 6}" width="${w * frac}" height="18" rx="4"/></a>
      ${r.is_demo_target ? `<text class="flag-lbl demo" x="${x1 + w + 5}" y="${y + 19}">★ demo target</text>` : ''}`;
  }).join('');
  const lines = [];
  const today = todayUtc();
  if (today >= min && today <= max) lines.push(`<line class="today-line" x1="${x(today)}" y1="${top - 4}" x2="${x(today)}" y2="${height - 6}"/><text class="flag-lbl today" x="${x(today) + 3}" y="${height - 2}">today</text>`);
  else lines.push(`<text class="flag-lbl today" x="${L}" y="${height - 2}">today (${fmtDate(today.toISOString().slice(0, 10))}) is before the chart starts</text>`);
  if (s?.demo_day) {
    const d = day(s.demo_day);
    if (d >= min && d <= max) lines.push(`<line class="demo-line-svg" x1="${x(d)}" y1="${top - 4}" x2="${x(d)}" y2="${height - 6}"/><text class="flag-lbl demo" x="${x(d) + 3}" y="${height - 2}">demo day</text>`);
  }
  return `<div class="diagram-wrap"><svg class="gantt" viewBox="0 0 ${W} ${height + 6}" role="img" aria-label="Gantt chart of releases">
    ${ticks.join('')}${bars}${lines.join('')}</svg></div>
    <div class="legend"><span><i style="background:var(--ok)"></i>verified share</span><span><i style="border:2px solid var(--ok)"></i>demo target</span>
    <span><i style="opacity:.45;background:var(--unknown)"></i>roadmap — after demo day</span><span><i style="background:var(--accent)"></i>today</span></div>`;
}

function slip(s) {
  return s.due_on && s.due_baseline_on ? daysBetween(day(s.due_baseline_on), day(s.due_on)) : null;
}

function storyRows(m, ui) {
  const { key, dir } = ui.sort;
  const val = {
    id: (s) => s.id, title: (s) => s.title, release: (s) => m.releaseIndex.get(s.release) ?? 99,
    state: (s) => (s.state === null ? 9 : STATE_ORDER[s.state] ?? 8), due: (s) => s.due_on || '9999',
    baseline: (s) => s.due_baseline_on || '9999', slip: (s) => slip(s) ?? -9999, owner: (s) => s.owner_agent || '',
  }[key] || ((s) => s.due_on || '');
  const rows = [...m.stories].sort((a, b) => {
    const va = val(a); const vb = val(b);
    return (va < vb ? -1 : va > vb ? 1 : 0) * dir || a.id.localeCompare(b.id);
  });
  const th = (k, label) => `<th><button type="button" class="sort" data-sort="${k}" aria-label="Sort by ${label}">${label}${key === k ? (dir > 0 ? ' ▲' : ' ▼') : ''}</button></th>`;
  return `<div class="table-wrap"><table><thead><tr>${th('id', 'Story')}${th('title', 'Title')}${th('release', 'Release')}${th('owner', 'Owner')}${th('state', 'Status')}${th('due', 'Due')}${th('baseline', 'Baseline')}${th('slip', 'Slippage')}</tr></thead><tbody>
    ${rows.map((s) => { const sl = slip(s); return `<tr><td><a href="#/story/${esc(s.id)}">${esc(s.id)}</a></td><td>${esc(s.title)}</td><td>${esc(s.release)}</td><td>${esc(s.owner_agent ?? '')}</td>
      <td>${stateBadge(s.state)}</td><td class="nowrap">${esc(fmtDate(s.due_on))}</td><td class="nowrap">${esc(fmtDate(s.due_baseline_on))}</td>
      <td>${sl === null ? '—' : sl === 0 ? '0 days' : `<strong>${sl > 0 ? '+' : ''}${sl} days</strong>`}</td></tr>`; }).join('')}
  </tbody></table></div>`;
}

function dependencies(m) {
  const done = (id) => m.storyById.get(id)?.state === 'verified';
  const ready = m.stories.filter((s) => s.state !== 'verified' && (s.blocked_by || []).every((b) => !m.storyById.has(b) || done(b)));
  const waiting = m.stories.filter((s) => (s.blocked_by || []).some((b) => m.storyById.has(b) && !done(b)));
  const next = m.nextStory;
  return `<div class="grid">
    <div class="card"><div class="quote-label">Ready now — nothing blocking them${sampleTag(m)}</div>
      ${ready.length ? `<ul class="clean">${ready.map((s) => `<li>${s.id === next?.id ? '<span class="tag accent">next</span> ' : ''}<a href="#/story/${esc(s.id)}">${esc(s.id)}</a> ${esc(s.title)} <span class="muted small">· due ${esc(fmtDate(s.due_on))}</span></li>`).join('')}</ul>`
        : '<p class="muted">Every unfinished story is waiting on another one.</p>'}</div>
    <div class="card"><div class="quote-label">Waiting on another story</div>
      <p class="small muted">${waiting.length} stories. Each line: the story, then what it waits on.</p>
      <ul class="clean small deps">${waiting.map((s) => `<li><a href="#/story/${esc(s.id)}">${esc(s.id)}</a> ← ${(s.blocked_by || []).map((b) => (m.storyById.has(b) ? `<span class="nowrap">${stateDot(m.storyById.get(b).state)}<a href="#/story/${esc(b)}">${esc(b)}</a></span>` : `<span class="nowrap muted">${esc(b)} (not in plan)</span>`)).join(', ')}</li>`).join('')}</ul></div>
  </div>`;
}

export function viewProject(m, sub, id, ui) {
  if (sub) return notFound('project', 'Project', sub);
  const s = m.plan.schedule;
  return `<h2>Project management${sampleTag(m)}</h2>
    <p class="muted">${s ? `Build ${esc(fmtDate(s.build_start))} → ${esc(fmtDate(s.build_end))} · demo day ${esc(fmtDate(s.demo_day))} · demo release ${esc(s.demo_release_key)}. Releases after the demo are roadmap: post-class work, drawn lighter.` : 'Your plan has no schedule, so dates are not shown.'}</p>
    <section class="section"><h3>Releases</h3><div class="card">${gantt(m)}</div></section>
    <section class="section"><div class="section-head"><h3>Every story</h3><span class="muted small">Click a column to sort. Due is the current date; baseline is the first date given; the gap is slippage.</span></div>${storyRows(m, ui)}</section>
    <section class="section"><h3>Dependencies</h3>${dependencies(m)}</section>
    ${(s?.prep || []).length ? `<section class="section"><h3>Demo prep</h3><div class="table-wrap"><table><thead><tr><th>Task</th><th>Due</th></tr></thead><tbody>
      ${s.prep.map((p) => `<tr><td>${esc(p.title)}</td><td>${esc(fmtDate(p.due_on))}</td></tr>`).join('')}</tbody></table></div></section>` : ''}`;
}
