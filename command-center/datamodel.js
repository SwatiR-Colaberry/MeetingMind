// Data model: an ER diagram drawn at runtime. The plan's own artifacts come from
// plan.derived.artifacts; the proposed tables are the student's design in
// command-center/data-model.json, shown as "proposed, not built".
import { esc, crumbs, notFound, slug, storyTable, plural, wrapLabel } from './util.js';

const CP = 224; const RP = 150; const BW = 188; const BH = 126; const M = 10;

function rect(at, rows = 1) {
  const [c, r] = at;
  return { x1: M + c * CP, y1: M + r * RP, x2: M + c * CP + BW, y2: M + r * RP + BH + (rows - 1) * RP };
}

// Shortest straight connector between two boxes.
function connect(a, b) {
  const ox1 = Math.max(a.x1, b.x1); const ox2 = Math.min(a.x2, b.x2);
  const oy1 = Math.max(a.y1, b.y1); const oy2 = Math.min(a.y2, b.y2);
  if (ox1 < ox2) { const x = (ox1 + ox2) / 2; return a.y2 <= b.y1 ? [x, a.y2, x, b.y1] : [x, a.y1, x, b.y2]; }
  if (oy1 < oy2) { const y = (oy1 + oy2) / 2; return a.x2 <= b.x1 ? [a.x2, y, b.x1, y] : [a.x1, y, b.x2, y]; }
  const ax = a.x2 <= b.x1 ? a.x2 : a.x1; const ay = a.y2 <= b.y1 ? a.y2 : a.y1;
  const bx = a.x2 <= b.x1 ? b.x1 : b.x2; const by = a.y2 <= b.y1 ? b.y1 : b.y2;
  return [ax, ay, bx, by];
}

function cardLabel(x1, y1, x2, y2, text, atStart) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const t = Math.min(12 / len, 0.4);
  const px = atStart ? x1 + (x2 - x1) * t : x2 - (x2 - x1) * t;
  const py = atStart ? y1 + (y2 - y1) * t : y2 - (y2 - y1) * t;
  const nx = -(y2 - y1) / len; const ny = (x2 - x1) / len;
  return `<text class="card-lbl" x="${px + nx * 8}" y="${py + ny * 8 + 4}" text-anchor="middle">${esc(text)}</text>`;
}

function diagram(dm) {
  const ents = dm.entities || [];
  const boxes = new Map(ents.map((e) => [e.name, rect(e.at, e.rows)]));
  (dm.externals || []).forEach((x) => boxes.set(x.name, rect(x.at)));
  const all = [...boxes.values()];
  const W = Math.max(...all.map((b) => b.x2)) + M; const H = Math.max(...all.map((b) => b.y2)) + M;
  const rels = (dm.relationships || []).filter((r) => boxes.has(r.from) && boxes.has(r.to)).map((r) => {
    const [x1, y1, x2, y2] = connect(boxes.get(r.from), boxes.get(r.to));
    return `<g class="er-rel"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${cardLabel(x1, y1, x2, y2, r.from_card, true)}${cardLabel(x1, y1, x2, y2, r.to_card, false)}
      <title>${esc(`${r.from} ${r.from_card} — ${r.to_card} ${r.to}${r.label ? ` (${r.label})` : ''}`)}</title></g>`;
  }).join('');
  const exts = (dm.externals || []).filter((x) => boxes.has(x.touches)).map((x) => {
    const b = boxes.get(x.name);
    const [x1, y1, x2, y2] = x.side === 'input' ? connect(b, boxes.get(x.touches)) : connect(boxes.get(x.touches), b);
    const lines = wrapLabel(x.name, 24);
    return `<line class="er-ext-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#erarr)"/>
      <g class="er-ext"><rect x="${b.x1}" y="${b.y1 + 28}" width="${BW}" height="${BH - 56}" rx="35"/>
      <text class="ext-kind" x="${b.x1 + BW / 2}" y="${b.y1 + 46}" text-anchor="middle">${x.side === 'input' ? 'external input' : 'external output'}</text>
      ${lines.slice(0, 3).map((l, i) => `<text x="${b.x1 + BW / 2}" y="${b.y1 + 62 + i * 13}" text-anchor="middle">${esc(l)}</text>`).join('')}</g>`;
  }).join('');
  const nodes = ents.map((e) => {
    const b = boxes.get(e.name);
    const room = Math.floor((b.y2 - b.y1 - 30) / 14);
    const fields = e.fields || [];
    const shown = fields.length > room ? fields.slice(0, room - 1) : fields;
    return `<a href="#/data-model/${slug(e.name)}"><g class="er-ent"><rect x="${b.x1}" y="${b.y1}" width="${BW}" height="${b.y2 - b.y1}" rx="8"/>
      <rect class="er-head" x="${b.x1}" y="${b.y1}" width="${BW}" height="24" rx="8"/>
      <text class="er-title" x="${b.x1 + 10}" y="${b.y1 + 17}">${esc(e.name)}</text>
      ${shown.map((f, i) => `<text class="er-field${f[2] ? ` ${f[2]}` : ''}" x="${b.x1 + 10}" y="${b.y1 + 40 + i * 14}">${f[2] ? `${f[2]} ` : ''}${esc(f[0])}</text>`).join('')}
      ${shown.length < fields.length ? `<text class="er-more" x="${b.x1 + 10}" y="${b.y1 + 40 + shown.length * 14}">+ ${fields.length - shown.length} more</text>` : ''}
      <title>${esc(e.description || e.name)}</title></g></a>`;
  }).join('');
  return `<div class="diagram-wrap er-wide"><svg class="er" viewBox="0 0 ${W} ${H}" role="img" aria-label="Proposed entity-relationship diagram">
    <defs><marker id="erarr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>
    ${rels}${exts}${nodes}</svg></div>`;
}

function ownersFor(m, reqIds) {
  const stories = [...new Set((reqIds || []).flatMap((id) => m.reqById.get(id)?.fulfilled_by || []))].map((id) => m.storyById.get(id)).filter(Boolean);
  return { stories, owners: [...new Set(stories.map((s) => s.owner_agent).filter(Boolean))] };
}

export function viewDataModel(m, sub) {
  const dm = m.dataModel;
  const artifacts = m.plan.derived?.artifacts || [];
  const ents = dm?.entities || [];
  if (sub) {
    const e = ents.find((x) => x.name === sub);
    if (!e) return notFound('data-model', 'Data model', sub);
    const rels = (dm.relationships || []).filter((r) => r.from === e.name || r.to === e.name);
    const { stories, owners } = ownersFor(m, e.requirements);
    const agents = (m.plan.agents || []);
    return `${crumbs(['#/data-model', 'Data model'], [null, e.name])}<h2>${esc(e.name)} <span class="tag grey">proposed, not built</span></h2>
      <p>${esc(e.description || '')}</p>
      <div class="table-wrap"><table><thead><tr><th>Field</th><th>Type / meaning</th><th>Key</th></tr></thead><tbody>
        ${(e.fields || []).map((f) => `<tr><td><code>${esc(f[0])}</code></td><td>${esc(f[1])}</td><td>${esc(f[2] || '')}</td></tr>`).join('')}</tbody></table></div>
      <div class="section card"><dl class="kv">
        <dt>Relationships</dt><dd>${rels.length ? rels.map((r) => `${esc(r.from)} ${esc(r.from_card)} — ${esc(r.to_card)} ${esc(r.to)}${r.label ? ` (${esc(r.label)})` : ''}`).join('<br>') : 'none'}</dd>
        <dt>Writes / reads it</dt><dd>${agents.length ? 'See the agents whose inputs and outputs name it.' : `No agents in the plan yet. Story owners serving its requirements: ${owners.length ? esc(owners.join(', ')) : 'none'}.`}</dd>
      </dl></div>
      <div class="section"><h3>Requirements it serves</h3><ul class="clean card">${(e.requirements || []).map((id) => `<li><a href="#/knowledge/req/${slug(id)}"><strong>${esc(id)}</strong></a> ${esc(m.reqById.get(id)?.statement ?? 'not in the plan')}</li>`).join('')}</ul></div>
      <div class="section"><h3>Stories that will build it</h3>${storyTable(m, stories)}</div>`;
  }
  return `<h2>Data model</h2>
    <p class="muted">The tables behind the system. <strong>Proposed, not built:</strong> this is a first design taken from your requirements, kept in <code>command-center/data-model.json</code>. No table exists yet — review it before any is created.</p>
    <section class="section"><h3>From the plan</h3><div class="card">${artifacts.length
      ? `<ul class="clean">${artifacts.map((a) => `<li><strong>${esc(a.name)}</strong> <span class="small muted">produced by ${esc((a.produced_by || []).join(', ') || '—')} · read by ${esc((a.read_by || []).join(', ') || '—')}</span></li>`).join('')}</ul>`
      : '<p class="muted" style="margin:0"><code>plan.derived.artifacts</code> is empty: your plan names no artifacts that agents read or produce yet, so the diagram below is drawn from the proposal file only.</p>'}</div></section>
    <section class="section"><div class="section-head"><h3>Entities <span class="tag grey">proposed, not built</span></h3>${ents.length ? `<span class="muted small">${plural(ents.length, 'entity')} · ${plural((dm.relationships || []).length, 'relationship')} · click an entity for its fields</span>` : ''}</div>
      ${dm ? `<div class="card">${diagram(dm)}
        <ul class="er-narrow">${ents.map((e) => `<li><a href="#/data-model/${slug(e.name)}"><strong>${esc(e.name)}</strong></a> <span class="small muted">— ${esc(e.description || '')} (${plural((e.fields || []).length, 'field')})</span></li>`).join('')}</ul>
        <p class="legend"><span>pk = primary key · fk = foreign key</span><span>1 — N: one to many</span><span>rounded pills: systems outside, where data enters or leaves</span></p></div>`
        : '<div class="not-built"><p><code>command-center/data-model.json</code> is missing, so there is no proposed model to draw yet.</p></div>'}
    </section>`;
}
