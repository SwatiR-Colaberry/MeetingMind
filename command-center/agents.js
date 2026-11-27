// AI agents. Uses plan.agents when the plan has a scoped roster; otherwise falls back
// to the owners named on stories, and says plainly that they are owners, not agents.
import { esc, crumbs, notFound, stateBadge, storyTable, sampleTag, plural, slug, wrapLabel } from './util.js';

function roster(m) {
  const agents = m.plan.agents || [];
  if (agents.length) {
    const nodes = agents.map((a) => ({
      name: a.name, agent: a, autonomy: a.autonomy_level || 'unknown', stories: m.stories.filter((s) => (a.owns || []).includes(s.id) || s.owner_agent === a.name),
    }));
    const edges = new Map();
    for (const h of m.plan.derived?.handoffs || []) {
      const k = `${h.from_agent}→${h.to_agent}`;
      if (!edges.has(k)) edges.set(k, { from: h.from_agent, to: h.to_agent, labels: [] });
      edges.get(k).labels.push(h.via);
    }
    return { real: true, nodes, edges: [...edges.values()] };
  }
  const nodes = m.owners.map((o) => ({ name: o, agent: null, autonomy: 'unknown', stories: m.stories.filter((s) => s.owner_agent === o) }));
  // Work flows from the owner of a blocking story to the owner of the story it unblocks.
  const edges = new Map();
  for (const s of m.stories) {
    for (const b of s.blocked_by || []) {
      const from = m.storyById.get(b)?.owner_agent; const to = s.owner_agent;
      if (!from || !to || from === to) continue;
      const k = `${from}→${to}`;
      if (!edges.has(k)) edges.set(k, { from, to, labels: [] });
      edges.get(k).labels.push(`${b} unblocks ${s.id}`);
    }
  }
  return { real: false, nodes, edges: [...edges.values()] };
}

// Longest-path layering, after dropping edges that close a cycle.
function layer(nodes, edges) {
  const names = nodes.map((n) => n.name);
  const adj = new Map(names.map((n) => [n, []]));
  edges.forEach((e) => adj.get(e.from)?.push(e));
  const state = new Map(); const back = new Set();
  const dfs = (u) => {
    state.set(u, 1);
    for (const e of adj.get(u) || []) {
      if (state.get(e.to) === 1) back.add(e);
      else if (!state.get(e.to)) dfs(e.to);
    }
    state.set(u, 2);
  };
  names.forEach((n) => { if (!state.get(n)) dfs(n); });
  const col = new Map(names.map((n) => [n, 0]));
  for (let i = 0; i < names.length; i += 1) {
    edges.forEach((e) => { if (!back.has(e) && col.has(e.from) && col.has(e.to)) col.set(e.to, Math.max(col.get(e.to), col.get(e.from) + 1)); });
  }
  return { col, back };
}

function workflow(m, r) {
  if (!r.nodes.length) return '<div class="not-built"><p>No agents or story owners in the plan yet.</p></div>';
  const { col } = layer(r.nodes, r.edges);
  const cols = Math.max(...col.values()) + 1;
  const byCol = Array.from({ length: cols }, () => []);
  r.nodes.forEach((n) => byCol[col.get(n.name)].push(n));
  const maxRows = Math.max(...byCol.map((c) => c.length));
  const NW = 92; const NH = 54; const P = 124; const RP = 74; const X0 = 92;
  const lanesAbove = []; const lanesBelow = [];
  const edgeList = r.edges.map((e, i) => ({ ...e, n: i + 1 }));
  // Lanes needed before we know the top margin.
  const isAdjacent = (e) => col.get(e.to) === col.get(e.from) + 1;
  const pos = new Map();
  const skip = edgeList.filter((e) => !isAdjacent(e));
  const half = Math.ceil(skip.length / 2);
  const TOP = 40 + half * 7;
  byCol.forEach((c, ci) => c.forEach((n, ri) => {
    const offset = ((maxRows - c.length) * RP) / 2;
    pos.set(n.name, { x: X0 + ci * P, y: TOP + offset + ri * RP });
  }));
  const bottom = TOP + maxRows * RP;
  const W = X0 + cols * P + 10; const H = bottom + (skip.length - half) * 7 + 50;
  // Spread exit / entry points along each node's side.
  const outs = new Map(); const ins = new Map();
  edgeList.forEach((e) => { outs.set(e.from, [...(outs.get(e.from) || []), e]); ins.set(e.to, [...(ins.get(e.to) || []), e]); });
  const pt = (list, e, name) => { const k = list.get(name).indexOf(e); return { k, y: pos.get(name).y + ((k + 1) * NH) / (list.get(name).length + 1) }; };
  const paths = edgeList.map((e) => {
    const a = pos.get(e.from); const b = pos.get(e.to);
    const o = pt(outs, e, e.from); const t = pt(ins, e, e.to);
    const sx = a.x + NW; const tx = b.x;
    let d;
    if (isAdjacent(e)) {
      const mx = (sx + tx) / 2;
      d = `M${sx},${o.y} C${mx},${o.y} ${mx},${t.y} ${tx - 2},${t.y}`;
    } else {
      // Route above or below every node, in a lane of its own.
      const goUp = (o.y + t.y) / 2 < (TOP + bottom) / 2;
      const lanes = goUp ? lanesAbove : lanesBelow;
      lanes.push(e);
      const ly = goUp ? TOP - 12 - (lanes.length - 1) * 7 : bottom - RP + NH + 12 + (lanes.length - 1) * 7;
      const dx1 = 8 + o.k * 4; const dx2 = 8 + t.k * 4;
      d = `M${sx},${o.y} H${sx + dx1} V${ly} H${tx - dx2} V${t.y} H${tx - 2}`;
    }
    return `<path class="wf-edge${isAdjacent(e) ? '' : ' lane'}" d="${d}" marker-end="url(#wfarr)"><title>${esc(`${e.n}. ${e.from} → ${e.to}: ${e.labels.join('; ')}`)}</title></path>
      <g class="wf-num"><circle cx="${tx - 14}" cy="${t.y - 7}" r="7"/><text x="${tx - 14}" y="${t.y - 4}" text-anchor="middle">${e.n}</text></g>`;
  }).join('');
  const nodes = r.nodes.map((n) => {
    const p = pos.get(n.name);
    const lines = wrapLabel(n.name, 13).slice(0, 3);
    return `<a href="#/agents/${slug(n.name)}"><g class="wf-node auto-${esc(String(n.autonomy).replace(/\W/g, '_'))}"><rect x="${p.x}" y="${p.y}" width="${NW}" height="${NH}" rx="9"/>
      ${lines.map((l, i) => `<text x="${p.x + NW / 2}" y="${p.y + NH / 2 + (i - (lines.length - 1) / 2) * 13 + 4}" text-anchor="middle">${esc(l)}</text>`).join('')}<title>${esc(n.name)}</title></g></a>`;
  }).join('');
  const sources = r.nodes.filter((n) => !edgeList.some((e) => e.to === n.name));
  const entry = `<g class="wf-entry"><rect x="4" y="${TOP + (maxRows * RP) / 2 - 30}" width="62" height="48" rx="24"/>
    <text x="35" y="${TOP + (maxRows * RP) / 2 - 9}" text-anchor="middle">${r.real ? 'trigger' : 'start'}</text></g>
    ${sources.map((n) => { const p = pos.get(n.name); return `<path class="wf-edge entry" d="M66,${TOP + (maxRows * RP) / 2 - 6} C${(66 + p.x) / 2},${TOP + (maxRows * RP) / 2 - 6} ${(66 + p.x) / 2},${p.y + 10} ${p.x - 2},${p.y + 10}" marker-end="url(#wfarr)"/>`; }).join('')}`;
  const svg = `<div class="diagram-wrap wf-wide"><svg class="wf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Workflow between ${r.real ? 'agents' : 'story owners'}">
    <defs><marker id="wfarr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>
    ${paths}${entry}${nodes}</svg></div>`;
  const key = `<ol class="wf-key small">${edgeList.map((e) => `<li value="${e.n}"><strong>${esc(e.from)} → ${esc(e.to)}</strong>: ${esc(e.labels.slice(0, 4).join('; '))}${e.labels.length > 4 ? ` and ${e.labels.length - 4} more` : ''}</li>`).join('')}</ol>`;
  const narrow = `<ol class="wf-narrow">${byCol.flat().map((n) => {
    const out = edgeList.filter((e) => e.from === n.name);
    return `<li><a href="#/agents/${slug(n.name)}"><strong>${esc(n.name)}</strong></a>${out.length ? `<ul class="small">${out.map((e) => `<li>hands to ${esc(e.to)}: ${esc(e.labels.slice(0, 2).join('; '))}${e.labels.length > 2 ? '…' : ''}</li>`).join('')}</ul>` : '<div class="small muted">hands nothing on</div>'}</li>`;
  }).join('')}</ol>`;
  return `${svg}${narrow}
    <p class="muted small">${r.real ? 'Arrows are the hand-offs in your plan.' : `No hand-offs are defined, so arrows show where work flows: an arrow from A to B means a story A owns has to be done before a story B owns can start. ${r.edges.length ? `Start is the stories with no dependencies.` : ''}`}
    Nodes are coloured by autonomy; ${r.nodes.every((n) => n.autonomy === 'unknown') ? 'none is defined in your plan, so every node is drawn the same (grey).' : 'see the legend.'}</p>
    <details class="wf-key-wrap"><summary>Arrow key (${edgeList.length})</summary>${key}</details>`;
}

const field = (label, value) => `<div class="field"><div class="quote-label">${label}</div><div>${value}</div></div>`;

export function viewAgents(m, sub) {
  const r = roster(m);
  if (sub) {
    const n = r.nodes.find((x) => x.name === sub);
    if (!n) return notFound('agents', 'AI agents', sub);
    const a = n.agent;
    const handsTo = r.edges.filter((e) => e.from === n.name); const takesFrom = r.edges.filter((e) => e.to === n.name);
    return `${crumbs(['#/agents', 'AI agents'], [null, n.name])}<h2>${esc(n.name)}${sampleTag(m)}</h2>
      <p>${a ? `<span class="tag accent">agent · ${esc(n.autonomy)}</span>` : '<span class="tag grey">story owner — not a scoped AI agent</span>'}</p>
      <div class="card agent-fields">
        ${field('Purpose', a?.purpose ? esc(a.purpose) : '<span class="muted">not defined — the plan names this only as a story owner</span>')}
        ${field('Trigger', a?.trigger ? esc(`${a.trigger_type}: ${a.trigger}`) : '<span class="muted">not defined</span>')}
        ${field('Skills it needs', a?.skills?.length ? esc(a.skills.join(', ')) : '<span class="muted">none listed in the plan</span>')}
        ${field('Skills built', '<span class="muted">none built yet</span>')}
        ${field('Runs', '<span class="muted">no runs recorded</span>')}
        ${field('Takes work from', takesFrom.length ? esc(takesFrom.map((e) => e.from).join(', ')) : '<span class="muted">nobody</span>')}
        ${field('Hands work to', handsTo.length ? esc(handsTo.map((e) => e.to).join(', ')) : '<span class="muted">nobody</span>')}
        ${a?.hard_rules?.length ? field('Hard rules', esc(a.hard_rules.join('; '))) : ''}
        ${a?.approval_gates?.length ? field('Approval gates', esc(a.approval_gates.join('; '))) : ''}
      </div>
      <div class="section"><h3>Stories it owns</h3>${storyTable(m, n.stories)}</div>`;
  }
  const waits = r.nodes.filter((n) => n.agent?.approval_gates?.length);
  const autonomy = m.plan.derived?.counts?.agents_by_autonomy || {};
  return `<h2>AI agents${sampleTag(m)}</h2>
    ${r.real ? `<p class="muted">${plural(r.nodes.length, 'agent')}${Object.keys(autonomy).length ? ` · ${Object.entries(autonomy).map(([k, v]) => `${v} ${k}`).join(' · ')}` : ''}.</p>`
      : `<div class="card"><p style="margin:0"><strong>Your plan does not carry a scoped agent roster yet.</strong> This tab is built from who owns each story.
        These are <strong>owners, not scoped agents</strong>: a job title or a component named on a story is not an AI agent, and none of them has a purpose, trigger or autonomy level in the plan.</p></div>`}
    <section class="section"><h3>Workflow</h3><div class="card">${workflow(m, r)}</div></section>
    <section class="section"><h3>Approval queue</h3><div class="card">
      ${waits.length ? `<ul class="clean">${waits.map((n) => `<li><strong>${esc(n.name)}</strong> waits on: ${esc(n.agent.approval_gates.join('; '))} · released by: <strong>approver not named</strong> · queue: empty</li>`).join('')}</ul>`
        : '<p class="muted" style="margin:0">Nothing is waiting on a person. No agent in the plan has an approval gate, and no agent has run, so the queue is empty.</p>'}</div></section>
    <section class="section"><h3>${r.real ? 'Agents' : 'Owners'} (${r.nodes.length})</h3><div class="grid">
      ${r.nodes.map((n) => {
        const verified = n.stories.filter((s) => s.state === 'verified').length;
        return `<a class="card agent-card" href="#/agents/${slug(n.name)}">
          <h3>${esc(n.name)}</h3>
          <div class="pills">${n.agent ? `<span class="tag accent">${esc(n.autonomy)}</span>` : '<span class="tag grey">owner, not an agent</span>'}<span class="tag grey">no runs recorded</span></div>
          ${field('Owns', `${plural(n.stories.length, 'story')} · ${n.stories.some((s) => s.state !== null) ? `${verified} verified` : 'not checked yet'}`)}
          ${field('Skills it needs', n.agent?.skills?.length ? esc(n.agent.skills.join(', ')) : '<span class="muted">none listed in the plan</span>')}
          ${field('Skills built', '<span class="muted">none built yet</span>')}
          <span class="more">Stories and detail →</span></a>`;
      }).join('')}</div></section>`;
}
