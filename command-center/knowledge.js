// Knowledge base: traceability, what the student said, decisions, notes, and a LOCAL search.
// A static page cannot hold an API key, so the question box is a search, not a model.
import { STANDING, esc, plain, crumbs, notFound, stateBadge, storyTable, coverage, sampleTag, slug, plural } from './util.js';

const STATE_CLASS = { verified: 'c-ok', submitted: 'c-prog', in_progress: 'c-prog', not_started: 'c-none' };

function filtered(m, ui) {
  const { kind, priority, text } = ui.kb;
  const t = text.trim().toLowerCase();
  return (m.plan.requirements || []).filter((r) => r.kind !== 'CONSTRAINT'
    && (!kind || r.kind === kind) && (!priority || r.priority === priority)
    && (!t || `${r.id} ${r.statement} ${r.cluster}`.toLowerCase().includes(t)));
}

export function renderMatrix(m, ui) {
  const reqs = filtered(m, ui);
  const stories = m.stories;
  if (!reqs.length) return '<p class="muted">No requirement matches these filters.</p>';
  const head = stories.map((s) => `<th class="vh" scope="col"><a href="#/story/${esc(s.id)}" title="${esc(`${s.id} ${s.title}`)}">${esc(s.id.replace(/^STORY-0*/, ''))}</a></th>`).join('');
  const rows = reqs.map((r) => {
    const cov = coverage(m, r.fulfilled_by);
    const gap = cov.none && r.priority === 'must';
    const cells = stories.map((s) => (r.fulfilled_by.includes(s.id)
      ? `<td class="cell ${s.state === null ? 'c-unk' : STATE_CLASS[s.state] || 'c-none'}" title="${esc(`${r.id} ← ${s.id}: ${s.state ?? 'not checked yet'}`)}"></td>` : '<td class="cell"></td>')).join('');
    return `<tr class="${gap ? 'gap-row' : ''}"><th scope="row" class="rh"><a href="#/knowledge/req/${slug(r.id)}">${esc(r.id)}</a>
      <span class="tag grey">${esc(r.kind)}</span>${gap ? ' <strong class="small">no story</strong>' : cov.allVerified ? ' <span class="tag ok">built</span>' : ''}</th>${cells}</tr>`;
  }).join('');
  return `<p class="small muted">${plural(reqs.length, 'requirement')} × ${plural(stories.length, 'story')}. A filled cell means the story fulfils the requirement, coloured by its verification state. Click a requirement or a story number to open it.</p>
    <div class="table-wrap matrix-wrap"><table class="tmatrix"><thead><tr><th class="rh">Requirement</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <div class="legend"><span><i class="c-ok"></i>verified</span><span><i class="c-prog"></i>submitted / in progress</span><span><i class="c-none"></i>not started</span><span><i class="c-unk"></i>not checked yet</span></div>`;
}

// ---------------------------------------------------------------- local search
function corpus(m) {
  const out = [];
  for (const r of m.plan.requirements || []) out.push({ tab: 'Knowledge base', href: `#/knowledge/req/${slug(r.id)}`, title: `${r.id} — ${r.cluster}`, text: r.statement });
  for (const s of m.stories) out.push({ tab: 'Project', href: `#/story/${slug(s.id)}`, title: `${s.id} — ${s.title}`, text: `${s.narrative} ${(s.acceptance || []).join(' ')}` });
  for (const g of m.plan.derived?.guardrails || []) out.push({ tab: 'Guardrails', href: `#/guardrails/${slug(g.id)}`, title: `${g.id} guardrail`, text: g.statement });
  for (const a of m.plan.agents || []) out.push({ tab: 'AI agents', href: `#/agents/${slug(a.name)}`, title: a.name, text: `${a.purpose ?? ''} ${(a.skills || []).join(' ')}` });
  for (const o of m.owners) out.push({ tab: 'AI agents', href: `#/agents/${slug(o)}`, title: `${o} (story owner)`, text: o });
  for (const e of m.understanding.entries || []) out.push({ tab: 'Overview', href: `#/overview/understanding/${slug(e.dimension)}`, title: `What you said — ${e.heading}`, text: plain(e.statement) });
  return out;
}
const STOP = new Set('a an the of to and or in on for is are be it what which who how does do did when where with i we my our this that there can will should must system'.split(' '));

export function renderSearch(m, q) {
  const words = String(q).toLowerCase().split(/[^a-z0-9-]+/).filter((w) => w.length > 1 && !STOP.has(w));
  if (!words.length) return '<p class="muted small">Type a few words, e.g. “encrypt transcripts” or “speaker”.</p>';
  const hits = corpus(m).map((d) => {
    const hay = `${d.title} ${d.text}`.toLowerCase();
    const score = words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);
    return { ...d, score };
  }).filter((d) => d.score > 0).sort((a, b) => b.score - a.score);
  const best = hits.filter((h) => h.score === hits[0]?.score);
  if (!hits.length) return `<p><strong>No match.</strong> Nothing in the loaded files mentions ${esc(words.join(', '))}. This box searches your plan's text; it does not guess.</p>`;
  const show = (best.length >= 3 ? best : hits).slice(0, 12);
  return `<p class="small muted">${hits.length} entries mention ${best[0].score === words.length ? 'all of' : 'some of'} your words. Showing the closest ${show.length}; each says which tab it came from.</p>
    <ul class="clean">${show.map((h) => `<li><span class="tag accent">${esc(h.tab)}</span> <a href="${h.href}">${esc(h.title)}</a><br><span class="small">${esc(h.text.slice(0, 220))}${h.text.length > 220 ? '…' : ''}</span></li>`).join('')}</ul>`;
}

// ---------------------------------------------------------------- view
function decisionsOf(m) {
  return (m.enrichment || []).flatMap((e) => [
    ...(e.data.decisions || []).map((d) => ({ story: e.id, kind: 'decision', text: d.statement, why: d.rationale, evidence: d.evidence })),
    ...(e.data.limitations || []).map((d) => ({ story: e.id, kind: 'limit', text: d.statement, evidence: d.evidence })),
  ]);
}
const notesOf = (m) => (Array.isArray(m.notes?.notes) ? m.notes.notes : []);

export function viewKnowledge(m, sub, id, ui) {
  const u = m.understanding;
  if (sub === 'req') {
    const r = m.reqById.get(id);
    if (!r) return notFound('knowledge', 'Knowledge base', id);
    const cov = coverage(m, r.fulfilled_by);
    return `${crumbs(['#/knowledge', 'Knowledge base'], [null, r.id])}<h2>${esc(r.id)}${sampleTag(m)}</h2>
      <div class="card"><p class="quote" style="margin-top:0">${esc(r.statement)}</p>
      <dl class="kv"><dt>Kind</dt><dd>${esc(r.kind)}</dd><dt>Priority</dt><dd>${esc(r.priority)}</dd><dt>Cluster</dt><dd>${esc(r.cluster)}</dd>
      <dt>Built?</dt><dd>${r.kind === 'CONSTRAINT' ? 'built with, not built — a constraint gets no story of its own' : cov.none ? '<strong>no story fulfils it — a gap</strong>' : cov.allVerified ? 'yes — every story verified' : `not yet — ${cov.verified.length} of ${cov.stories.length} stories verified`}</dd></dl></div>
      <div class="section"><h3>${r.kind === 'CONSTRAINT' ? 'Used by' : 'Fulfilled by'}</h3>${cov.none ? '<p class="muted">No stories.</p>' : storyTable(m, cov.stories)}</div>`;
  }
  if (sub === 'understanding') {
    const groups = [...new Set((u.entries || []).map((e) => e.heading))];
    return `${crumbs(['#/knowledge', 'Knowledge base'], [null, 'What you told us'])}<h2>What you told us</h2>
      <p class="muted">Quoted from intake. Each entry is marked confirmed or not yet.</p>
      ${groups.map((g) => `<section class="section"><h3>${esc(g)}</h3>${(u.entries || []).filter((e) => e.heading === g).map((e) => `<div class="card section"><div class="quote-label">${esc(STANDING[e.standing] ?? e.standing)}</div><p class="quote">${esc(e.statement)}</p></div>`).join('')}</section>`).join('')}
      <section class="section"><h3>Open questions</h3>${(u.unanswered || []).length ? `<ul class="bullets">${u.unanswered.map((q) => `<li>${esc(typeof q === 'string' ? q : q.question ?? JSON.stringify(q))}</li>`).join('')}</ul>` : '<p class="muted">None recorded as unanswered.</p>'}</section>`;
  }
  if (sub === 'decisions') {
    const ds = decisionsOf(m);
    return `${crumbs(['#/knowledge', 'Knowledge base'], [null, 'Decisions and limits'])}<h2>Decisions and limits</h2>
      <p class="muted">From <code>.colaberry/enrichment/&lt;story&gt;.json</code>, written as each story finishes.</p>
      ${ds.length ? `<ul class="clean card">${ds.map((d) => `<li><span class="tag ${d.kind === 'limit' ? 'grey' : 'accent'}">${d.kind}</span> <a href="#/story/${esc(d.story)}">${esc(d.story)}</a> — ${esc(d.text)}${d.why ? `<br><span class="small muted">Why: ${esc(d.why)}</span>` : ''}${d.evidence ? `<br><span class="small muted">Evidence: ${esc(d.evidence)}</span>` : ''}</li>`).join('')}</ul>`
        : '<div class="not-built"><p>No decisions recorded yet. They appear as stories finish and write their enrichment file.</p></div>'}`;
  }
  if (sub === 'notes') {
    const ns = notesOf(m);
    return `${crumbs(['#/knowledge', 'Knowledge base'], [null, 'Notes'])}<h2>Notes</h2>
      <p class="muted">Yours, from <code>command-center/notes.json</code>. Add an entry like <code>{"date": "2026-12-03", "title": "…", "text": "…"}</code> to its <code>notes</code> list.</p>
      ${ns.length ? ns.map((n) => `<div class="card section"><div class="quote-label">${esc(n.date ?? '')}</div><h3>${esc(n.title ?? 'Note')}</h3><p style="white-space:pre-wrap;margin:0">${esc(n.text ?? '')}</p></div>`).join('')
        : '<div class="not-built"><p>No notes yet.</p></div>'}`;
  }
  if (sub) return notFound('knowledge', 'Knowledge base', sub);

  const reqs = m.plan.requirements || [];
  const kinds = [...new Set(reqs.filter((r) => r.kind !== 'CONSTRAINT').map((r) => r.kind))];
  const prios = [...new Set(reqs.map((r) => r.priority))];
  const constraints = reqs.filter((r) => r.kind === 'CONSTRAINT');
  const gaps = reqs.filter((r) => r.kind !== 'CONSTRAINT' && r.priority === 'must' && !r.fulfilled_by.length);
  const ds = decisionsOf(m); const ns = notesOf(m);
  const confirmed = (u.entries || []).filter((e) => e.standing === 'confirmed').length;
  return `<h2>Knowledge base${sampleTag(m)}</h2>
    <p class="muted">Everything the project knows about itself. It reads from files that grow — your plan, each story's enrichment file and your notes — so it is added to, not regenerated.</p>
    <section class="section card"><form id="kb-ask" role="search"><label class="quote-label" for="kb-q">Ask the project</label>
      <div class="ask-row"><input id="kb-q" type="search" placeholder="e.g. how are transcripts encrypted?" value="${esc(ui.q)}" autocomplete="off"><button type="submit">Search</button></div></form>
      <p class="small muted" style="margin:.3rem 0 0">A local search across requirements, stories, guardrails, owners and what you said. Not an AI model: it shows matching entries and the tab each came from, and says so when nothing matches.</p>
      <div id="kb-answer">${ui.q ? renderSearch(m, ui.q) : ''}</div></section>
    <div class="kb-layout">
      <section class="section"><h3>Traceability</h3>
        <div class="filters">
          <label>Kind <select data-kb="kind"><option value="">all</option>${kinds.map((k) => `<option${ui.kb.kind === k ? ' selected' : ''}>${esc(k)}</option>`).join('')}</select></label>
          <label>Priority <select data-kb="priority"><option value="">all</option>${prios.map((p) => `<option${ui.kb.priority === p ? ' selected' : ''}>${esc(p)}</option>`).join('')}</select></label>
          <label>Text <input data-kb="text" type="search" value="${esc(ui.kb.text)}" placeholder="filter requirements"></label>
        </div>
        ${gaps.length ? `<p class="gap-note">${plural(gaps.length, 'must requirement')} with no story: ${gaps.map((g) => `<a href="#/knowledge/req/${slug(g.id)}">${esc(g.id)}</a>`).join(', ')}.</p>` : ''}
        <div id="kb-matrix">${renderMatrix(m, ui)}</div>
        ${constraints.length ? `<h3 class="section">Built with, not built</h3><p class="small muted">Constraints are the tools and platforms the other stories are built with. By design they get no story of their own, so they are not gaps.</p>
          <ul class="clean card">${constraints.map((c) => `<li><a href="#/knowledge/req/${slug(c.id)}"><strong>${esc(c.id)}</strong></a> ${esc(c.statement)}
            <br><span class="small muted">${c.fulfilled_by.length ? `used by ${esc(c.fulfilled_by.join(', '))}` : 'no story lists it as used yet'}</span></li>`).join('')}</ul>` : ''}
      </section>
      <aside class="section kb-side">
        <a class="card" href="#/knowledge/understanding"><div class="quote-label">What you told us</div>
          <p class="small" style="margin:.3rem 0">${plural((u.entries || []).length, 'statement')} from intake · ${confirmed} confirmed · ${(u.entries || []).length - confirmed} not yet · ${plural((u.unanswered || []).length, 'open question')}</p>
          <ul class="bullets small">${[...new Set((u.entries || []).map((e) => e.heading))].map((h) => `<li>${esc(h)}</li>`).join('')}</ul><span class="more">Read them →</span></a>
        <a class="card section" href="#/knowledge/decisions"><div class="quote-label">Decisions log</div>
          <p class="small" style="margin:.3rem 0">${ds.length ? `${plural(ds.length, 'entry')} from story enrichment files.` : m.enrichment === null ? 'Loading enrichment files…' : 'Nothing recorded yet. Each story adds its decisions and limits when it finishes.'}</p><span class="more">Open the log →</span></a>
        <a class="card section" href="#/knowledge/notes"><div class="quote-label">Notes</div>
          <p class="small" style="margin:.3rem 0">${ns.length ? plural(ns.length, 'note') : m.notes ? 'No notes yet.' : 'command-center/notes.json is missing.'}</p><span class="more">Open notes →</span></a>
      </aside>
    </div>`;
}
