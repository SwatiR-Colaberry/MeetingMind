// Shared helpers for every tab. No plan content lives here.

export const STANDING = {
  confirmed: 'confirmed',
  stated_not_confirmed: 'stated, not yet confirmed',
  from_build: 'from the build',
  inferred: 'inferred',
  question: 'open question',
  unknown: 'unknown',
};
export const STATE_LABEL = {
  verified: 'verified', submitted: 'submitted', in_progress: 'in progress', not_started: 'not started',
};

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const day = (s) => (s ? new Date(`${s}T00:00:00Z`) : null);
export const fmtDate = (s) => (s ? day(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'undated');
export const daysBetween = (a, b) => Math.round((b - a) / 86400000);
export const todayUtc = () => { const n = new Date(); return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())); };
export const plural = (n, w) => (n === 1 ? `${n} ${w}` : `${n} ${w.endsWith('y') ? `${w.slice(0, -1)}ies` : `${w}s`}`);
export const slug = (s) => encodeURIComponent(String(s));
// Strip the light markdown students write (**bold**, # headings) for plain display.
export const plain = (s) => String(s ?? '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '');

export function sampleTag(m) { return m.sample ? ' <span class="tag sample">sample</span>' : ''; }

export function stateBadge(state) {
  if (state === null || state === undefined) return '<span class="tag grey">not checked yet</span>';
  const cls = state === 'verified' ? 'ok' : state === 'not_started' ? 'grey' : 'prog';
  return `<span class="tag ${cls}">${esc(STATE_LABEL[state] ?? state)}</span>`;
}
export function stateDot(state) {
  const cls = state === 'verified' ? 'ok' : state === 'submitted' || state === 'in_progress' ? 'prog' : '';
  return `<span class="dot ${cls}" aria-hidden="true"></span>`;
}

export function crumbs(...parts) {
  return `<nav class="crumbs" aria-label="Breadcrumb">${parts.map(([href, label]) => (href ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`)).join(' / ')}</nav>`;
}

export function storyTable(m, stories) {
  if (!stories.length) return '<p class="muted">No stories.</p>';
  return `<div class="table-wrap"><table><thead><tr><th>Story</th><th>Title</th><th>Due</th><th>State</th><th>Criteria</th></tr></thead><tbody>
    ${stories.map((s) => `<tr><td><a href="#/story/${esc(s.id)}">${esc(s.id)}</a></td><td>${esc(s.title)}</td><td>${esc(fmtDate(s.due_on))}</td>
      <td>${stateBadge(s.state)}</td><td>${s.passed === null ? '<span class="muted">not checked yet</span>' : `${esc(s.passed)} / ${esc(s.total)}`}</td></tr>`).join('')}
  </tbody></table></div>`;
}

export function notFound(back, label, what) {
  return `${crumbs([`#/${back}`, label], [null, what])}<div class="not-built"><p>Nothing called “${esc(what)}” here. <a href="#/${back}">Back to ${esc(label)}</a>.</p></div>`;
}

// Stories verified for a list of ids: { stories, verified, allVerified, none }.
export function coverage(m, ids) {
  const stories = (ids || []).map((id) => m.storyById.get(id)).filter(Boolean);
  const verified = stories.filter((s) => s.state === 'verified');
  return { stories, verified, allVerified: stories.length > 0 && verified.length === stories.length, none: stories.length === 0 };
}

// Wrap a label into lines of at most `max` characters, breaking at spaces, "_" or "/".
export function wrapLabel(text, max) {
  const parts = String(text).split(/(?<=[ _/])/);
  const lines = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + p).trim().length > max && cur) { lines.push(cur.trim()); cur = p; } else cur += p;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}
