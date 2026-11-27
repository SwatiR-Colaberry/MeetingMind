// Outcomes, Users, Guardrails, Systems. Every value comes from the model.
import {
  STANDING, esc, plain, crumbs, notFound, stateBadge, stateDot, storyTable, coverage, plural, sampleTag, slug, wrapLabel,
} from './util.js';

const entriesOf = (m, dim) => (m.understanding.entries || []).filter((e) => e.dimension === dim);
const paragraphs = (s) => String(s || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// ============================================================ Outcomes
// The numbered expectations inside what the student said "good" looks like.
function statedExpectations(m) {
  const out = [];
  for (const e of entriesOf(m, 'success_definition')) {
    for (const line of String(e.statement).split('\n')) {
      const hit = line.match(/^\s*\d+\.\s+(?:\*\*(.+?):?\*\*:?\s*)?(.+)$/);
      if (hit) out.push({ title: plain(hit[1] || hit[2].slice(0, 40)).replace(/:$/, ''), text: plain(hit[2]), entry: e });
    }
  }
  return out;
}

function outcomeBar(left, leftSrc, right, rightSrc) {
  return `<div class="ends" role="img" aria-label="From ${esc(left)} to ${esc(right)}">
    <div class="end"><div class="quote-label">Baseline · ${esc(leftSrc)}</div><div>${esc(left)}</div></div>
    <div class="arrow-bar" aria-hidden="true"><span></span></div>
    <div class="end right"><div class="quote-label">Target · ${esc(rightSrc)}</div><div>${esc(right)}</div></div>
  </div>`;
}

export function viewOutcomes(m, sub, id) {
  const measures = m.plan.derived?.measures || [];
  const success = entriesOf(m, 'success_definition');
  const pains = entriesOf(m, 'pain_points');
  const stated = statedExpectations(m);
  const baselineText = pains[0] ? paragraphs(pains[0].statement)[0] : paragraphs(success[0]?.statement)[0];
  const baselineSrc = pains[0] ? 'pain points, as you stated' : 'what you said it costs today';

  if (sub === 'measure') {
    const ms = measures.find((x) => x.id === id);
    if (!ms) return notFound('outcomes', 'Outcomes', id);
    const req = m.reqById.get(ms.id);
    const movers = req ? m.plan.requirements.filter((r) => r.cluster === req.cluster).flatMap((r) => r.fulfilled_by) : [];
    return `${crumbs(['#/outcomes', 'Outcomes'], [null, ms.id])}<h2>${esc(ms.id)}</h2>
      <div class="card">${outcomeBar(baselineText || 'not stated yet', baselineSrc, ms.statement, 'the measure in your plan')}</div>
      <div class="section card"><dl class="kv"><dt>Current value</dt><dd><span class="tag grey">not measured yet</span></dd>
        <dt>How it is measured</dt><dd>Not defined in the plan yet.</dd></dl></div>
      <div class="section"><h3>Stories that move it</h3>${storyTable(m, [...new Set(movers)].map((x) => m.storyById.get(x)).filter(Boolean))}</div>`;
  }
  if (sub === 'stated') {
    const ex = stated[Number(id)];
    if (!ex) return notFound('outcomes', 'Outcomes', id);
    return `${crumbs(['#/outcomes', 'Outcomes'], [null, ex.title])}
      <h2>${esc(ex.title)} <span class="tag grey">as you stated it, not yet a measured target</span></h2>
      <div class="card">${outcomeBar(baselineText || 'not stated yet', baselineSrc, ex.text, 'as you stated it')}</div>
      <div class="section card"><dl class="kv">
        <dt>Current value</dt><dd><span class="tag grey">not measured yet</span> Nothing in this repo measures it; that comes from the running system.</dd>
        <dt>How it will be measured</dt><dd>Not defined yet. Your plan has no measure for this, so there is no method or number to show.</dd>
        <dt>Stories that move it</dt><dd>Not linked yet. A stated expectation is not tied to requirements until it becomes a measure in the plan.</dd>
        <dt>Standing</dt><dd>${esc(STANDING[ex.entry.standing] ?? ex.entry.standing)}</dd>
      </dl></div>
      <div class="section"><h3>Everything you said about what good looks like</h3>
        ${success.map((e) => `<div class="card"><p class="quote">${esc(e.statement)}</p></div>`).join('')}</div>`;
  }
  if (sub) return notFound('outcomes', 'Outcomes', sub);

  const measureCards = measures.length
    ? `<div class="grid">${measures.map((ms) => `<a class="card" href="#/outcomes/measure/${slug(ms.id)}">
        <div class="quote-label">${esc(ms.id)}</div>${outcomeBar(baselineText || 'not stated yet', baselineSrc, ms.statement, 'measure')}
        <p class="small"><span class="tag grey">not measured yet</span></p><span class="more">How it is measured, and which stories move it →</span></a>`).join('')}</div>`
    : `<div class="not-built"><p><strong>Your plan carries no numeric target yet.</strong> <code>plan.derived.measures</code> is empty, so there is no outcome
        with a baseline and a target to draw. When you add measures to the plan, one card per measure appears here.</p>
        <p class="muted small">Question for your instructor: which of the expectations below should become measured targets?</p></div>`;

  return `<h2>Outcomes — the numbers this has to move</h2>
    <p class="muted">What the system is meant to change. Targets come from your plan; current values come only from the running system, so every one reads “not measured yet”.</p>
    <section class="section"><h3>Measures in the plan</h3>${measureCards}</section>
    ${baselineText ? `<section class="section"><h3>What it costs today — as you stated it</h3>
      <a class="card" href="#/overview/understanding/${pains.length ? 'pain_points' : 'success_definition'}"><p class="quote">${esc(baselineText)}</p><p class="muted small" style="margin-bottom:0">${esc(baselineSrc)}. ${pains.length ? '' : 'No separate pain points were recorded at intake.'}</p><span class="more">Everything you said →</span></a></section>` : ''}
    <section class="section"><div class="section-head"><h3>What good looks like — as you stated it, not yet a measured target</h3></div>
      ${stated.length ? `<div class="grid">${stated.map((ex, i) => `<a class="card" href="#/outcomes/stated/${i}">
        <div class="quote-label">${esc(ex.title)}</div>${outcomeBar('as above', 'today', ex.text, 'as you stated')}
        <p class="small" style="margin:.5rem 0 0"><span class="tag grey">not measured yet</span></p><span class="more">Details →</span></a>`).join('')}</div>`
        : success.length ? `<div class="card"><p class="quote">${esc(success[0].statement)}</p></div>`
          : '<div class="not-built"><p>Nothing recorded about what success looks like yet.</p></div>'}
    </section>`;
}

// ============================================================ Users
function storiesForRole(m, role) {
  const re = new RegExp(`^\\s*as an?\\s+${role.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return m.stories.filter((s) => re.test(s.narrative || ''));
}
const soThat = (n) => (String(n).match(/so that (.+?)\.?$/i) || [])[1];

export function viewUsers(m, sub) {
  const roles = m.plan.derived?.roles || [];
  const actors = entriesOf(m, 'actors');
  const workflow = entriesOf(m, 'current_workflow');
  if (sub) {
    if (!roles.includes(sub)) return notFound('users', 'Users', sub);
    const st = storiesForRole(m, sub);
    return `${crumbs(['#/users', 'Users'], [null, sub])}<h2>${esc(sub)}${sampleTag(m)}</h2>
      <p class="muted">${plural(st.length, 'story')} written “As a ${esc(sub)} …”.</p>
      ${st.map((s) => `<div class="card section"><div class="quote-label"><a href="#/story/${esc(s.id)}">${esc(s.id)}</a> · ${esc(s.title)} · ${stateBadge(s.state)}</div>
        <p class="quote">${esc(s.narrative)}</p><p class="muted small" style="margin-bottom:0">Touches: ${esc(s.workspace?.ref ?? '—')} (${s.workspace?.kind === 'headless' ? 'runs in the background' : 'a screen they use'})</p></div>`).join('')}`;
  }
  const cards = roles.map((role) => {
    const st = storiesForRole(m, role);
    const changes = [...new Set(st.map((s) => soThat(s.narrative)).filter(Boolean))].slice(0, 3);
    const screens = [...new Set(st.filter((s) => s.workspace?.kind !== 'headless').map((s) => s.workspace?.ref).filter(Boolean))];
    const background = [...new Set(st.filter((s) => s.workspace?.kind === 'headless').map((s) => s.workspace?.ref).filter(Boolean))];
    return `<a class="card" href="#/users/${slug(role)}">
      <h3 style="text-transform:capitalize">${esc(role)}</h3>
      <p class="muted small">${plural(st.length, 'story')} written for this role</p>
      <div class="quote-label">What changes for them</div>
      ${changes.length ? `<ul class="bullets">${changes.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : '<p class="muted small">No “so that” stated in their stories.</p>'}
      <div class="quote-label">How they touch the system</div>
      <p class="small">${screens.length ? `Screens they open: ${esc(screens.slice(0, 5).join(', '))}${screens.length > 5 ? ` and ${screens.length - 5} more` : ''}.` : 'Opens no screen of its own.'}
      ${background.length ? ` Runs for them in the background: ${esc(background.slice(0, 4).join(', '))}${background.length > 4 ? ` and ${background.length - 4} more` : ''}.` : ''}</p>
      <div class="quote-label">Comfort with tools</div>
      <p class="small muted">Not stated for this role specifically — see what you said about who uses it, above.</p>
      <span class="more">Their stories →</span></a>`;
  }).join('');
  return `<h2>Users and use case</h2>
    <p class="muted">Roles are taken from your stories (“As a &lt;role&gt;, I want …”). What they do today is quoted from what you said at intake.</p>
    <div class="grid section">
      ${workflow.length ? `<div class="card"><div class="quote-label">How the work starts today — in your words · ${esc(STANDING[workflow[0].standing] ?? '')}</div>
        <p class="quote">${esc(plain(paragraphs(workflow[0].statement)[0]))}</p><a class="more" href="#/overview/understanding/current_workflow">Everything you said →</a></div>` : ''}
      ${actors.length ? `<div class="card"><div class="quote-label">Who uses it — in your words · ${esc(STANDING[actors[0].standing] ?? '')}</div>
        <p class="quote">${esc(plain(actors[0].statement))}</p><a class="more" href="#/overview/understanding/actors">Everything you said →</a></div>` : ''}
    </div>
    <section class="section"><h3>Roles</h3>${roles.length ? `<div class="grid">${cards}</div>` : '<div class="not-built"><p>No roles found in your stories yet.</p></div>'}</section>`;
}

// ============================================================ Guardrails
function guardrailRows(m) {
  return (m.plan.derived?.guardrails || []).map((g) => {
    const req = m.reqById.get(g.id);
    const cov = coverage(m, req?.fulfilled_by);
    const owners = [...new Set(cov.stories.map((s) => s.owner_agent).filter(Boolean))];
    return { ...g, req, cov, owners };
  });
}

export function viewGuardrails(m, sub) {
  const rows = guardrailRows(m);
  if (sub) {
    const g = rows.find((r) => r.id === sub);
    if (!g) return notFound('guardrails', 'Guardrails', sub);
    return `${crumbs(['#/guardrails', 'Guardrails'], [null, g.id])}<h2>${esc(g.id)}${sampleTag(m)}</h2>
      <div class="card"><p class="quote" style="margin-top:0">${esc(g.statement)}</p>
      <p>${g.kind === 'hard_rule' ? '<span class="tag warn-tag">never, no exceptions</span>' : `<span class="tag accent">approval</span> approver: ${g.approver ? esc(g.approver) : '<strong>approver not named yet</strong>'}`}</p></div>
      <div class="section"><h3>Enforced by</h3>${g.cov.none ? '<div class="not-built"><p><strong>No story enforces this.</strong> It is a promise with nothing behind it in the plan.</p></div>'
        : `${g.cov.allVerified ? '<p><span class="tag ok">enforced — every story verified</span></p>' : '<p class="gap-note">A promise you have made and not yet kept: the stories that enforce it are not all verified.</p>'}${storyTable(m, g.cov.stories)}`}</div>`;
  }
  if (!rows.length) {
    return `<h2>Guardrails — what must never happen</h2><div class="not-built"><p><strong>Your plan has no SAFE requirement, so there are no guardrails to show.</strong>
      That is worth fixing before you build further: a system that records conversations needs written promises about what it will never do.</p></div>`;
  }
  const hasApproval = rows.some((r) => r.kind === 'approval');
  const gates = (m.plan.agents || []).flatMap((a) => (a.approval_gates || []).map((gate) => ({ who: a.name, gate })));
  const points = entriesOf(m, 'approval_points');
  const unnamed = rows.filter((r) => r.kind === 'approval' && !r.approver);
  const matrix = `<div class="table-wrap"><table class="matrix-table"><thead><tr><th>Guardrail</th><th>Rule</th><th>Stories that enforce it</th><th>Owner</th><th>Enforced?</th></tr></thead><tbody>
    ${rows.map((g) => {
      const gap = g.cov.none || !g.cov.allVerified;
      return `<tr class="${gap ? 'gap-row' : ''}">
        <td><a href="#/guardrails/${slug(g.id)}"><strong>${esc(g.id)}</strong></a><br><span class="small">${esc(g.statement)}</span></td>
        <td>${g.kind === 'hard_rule' ? 'never, no exceptions' : `approval — ${g.approver ? esc(g.approver) : '<strong>approver not named yet</strong>'}`}</td>
        <td>${g.cov.none ? '<strong>none</strong>' : g.cov.stories.map((s) => `<span class="nowrap">${stateDot(s.state)}<a href="#/story/${esc(s.id)}">${esc(s.id)}</a></span>`).join(' ')}</td>
        <td>${g.owners.length ? esc(g.owners.join(', ')) : '—'}</td>
        <td>${g.cov.none ? '<strong>no story — nothing enforces it</strong>' : g.cov.allVerified ? '<span class="tag ok">yes, verified</span>'
          : `<strong>not yet</strong> <span class="small">${g.cov.verified.length} of ${g.cov.stories.length} verified — a promise made, not yet kept</span>`}</td></tr>`;
    }).join('')}</tbody></table></div>`;

  return `<h2>Guardrails — what must never happen${sampleTag(m)}</h2>
    <p class="muted">Your SAFE requirements. Each row shows which stories enforce it and whether those stories are verified. Highlighted rows are promises not yet kept.</p>
    <div class="guard-layout">
      <section class="section">${matrix}
        <p class="muted small">${hasApproval ? '' : 'Every guardrail in your plan is a hard rule, so none has an approver: nobody can let them through.'}</p></section>
      <aside class="section">
        <h3>Approval points</h3>
        <a class="card" href="#/agents"><div class="quote-label">Agent approval gates</div>
          ${gates.length ? `<ul class="clean">${gates.map((g) => `<li>${esc(g.gate)} <span class="muted small">— ${esc(g.who)}</span></li>`).join('')}</ul>`
            : '<p class="small muted">Your plan has no scoped agents yet, so there are no agent approval gates.</p>'}
          <span class="more">The approval queue →</span></a>
        <a class="card section" href="#/overview/understanding/approval_points"><div class="quote-label">What you said a person checks — in your words</div>
          ${points.length ? `<ul class="clean">${points.map((p) => `<li><span class="quote" style="display:block">${esc(plain(paragraphs(p.statement)[0]))}</span>
            <span class="small"><strong>approver not named</strong> · ${esc(STANDING[p.standing] ?? p.standing)}</span></li>`).join('')}</ul>`
            : '<p class="small muted">No approval points recorded at intake.</p>'}
          <span class="more">Everything you said →</span></a>
        ${unnamed.length || points.length ? `<a class="card section" href="#/knowledge/understanding"><div class="quote-label">For your instructor</div>
          <ul class="bullets small">${unnamed.map((u) => `<li>Who approves ${esc(u.id)}?</li>`).join('')}${points.length ? `<li>Who is the person at each approval point above? None is named yet.</li>` : ''}</ul>
          <span class="more">Open questions →</span></a>` : ''}
      </aside>
    </div>`;
}

// ============================================================ Systems
function systemUse(m, name) {
  const lc = name.toLowerCase();
  const reqs = (m.plan.requirements || []).filter((r) => r.statement.toLowerCase().includes(lc));
  const usedBy = [...new Set(reqs.flatMap((r) => r.fulfilled_by))].map((id) => m.storyById.get(id)).filter(Boolean);
  const agents = (m.plan.agents || []).filter((a) => [...(a.inputs || []), ...(a.outputs || [])].some((x) => String(x).toLowerCase().includes(lc)));
  return { reqs, usedBy, agents };
}

function flowDiagram(m, systems) {
  const artifacts = m.plan.derived?.artifacts || [];
  const rows = systems.map((name) => {
    const u = systemUse(m, name);
    const middle = u.agents.length ? u.agents.map((a) => a.name) : [...new Set(u.usedBy.map((s) => s.owner_agent))];
    const outs = artifacts.filter((a) => (a.produced_by || []).some((p) => middle.includes(p))).map((a) => a.name);
    return { name, middle, outs, agentsReal: u.agents.length > 0 };
  });
  const H = 64; const W = 900; const height = rows.length * H + 40;
  const box = (x, y, w, lines, cls) => `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="44" rx="8"/>${lines.slice(0, 2).map((l, i) => `<text x="${x + w / 2}" y="${y + (lines.length > 1 ? 18 + i * 15 : 27)}" text-anchor="middle">${esc(l)}</text>`).join('')}</g>`;
  const body = rows.map((r, i) => {
    const y = 30 + i * H;
    const mid = r.middle.length ? r.middle.join(', ') : 'no agent or story uses it yet';
    const out = r.outs.length ? r.outs.join(', ') : 'nothing produced yet';
    return `${box(10, y, 220, wrapLabel(r.name, 28), 'node sys')}
      <line class="edge" x1="230" y1="${y + 22}" x2="336" y2="${y + 22}" marker-end="url(#arr)"/>
      ${box(340, y, 250, wrapLabel(mid, 34), r.middle.length ? 'node mid' : 'node empty')}
      <line class="edge" x1="590" y1="${y + 22}" x2="666" y2="${y + 22}" marker-end="url(#arr)"/>
      ${box(670, y, 220, wrapLabel(out, 30), r.outs.length ? 'node out' : 'node empty')}`;
  }).join('');
  return `<div class="diagram-wrap"><svg class="flow" viewBox="0 0 ${W} ${height}" role="img" aria-label="Data flow from systems through agents to what they produce">
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="arrowhead"/></marker></defs>
    <text class="col-head" x="120" y="16" text-anchor="middle">Where data enters</text>
    <text class="col-head" x="465" y="16" text-anchor="middle">${rows.some((r) => r.agentsReal) ? 'Agent that touches it' : 'Who touches it (story owners)'}</text>
    <text class="col-head" x="780" y="16" text-anchor="middle">What leaves</text>${body}</svg></div>`;
}

export function viewSystems(m, sub) {
  const systems = m.plan.derived?.systems || [];
  const intake = entriesOf(m, 'systems');
  if (sub) {
    if (!systems.includes(sub)) return notFound('systems', 'Systems', sub);
    const u = systemUse(m, sub);
    return `${crumbs(['#/systems', 'Systems'], [null, sub])}<h2>${esc(sub)}</h2>
      <div class="card"><p><span class="dot" aria-hidden="true"></span><strong>not checked from here</strong> · last checked: never</p>
      <p class="muted small" style="margin-bottom:0">Whether ${esc(sub)} is connected is a fact about your running system. Nothing in this repo can check it.</p></div>
      <div class="section"><h3>Requirements that name it</h3>${u.reqs.length ? `<ul class="clean card">${u.reqs.map((r) => `<li><strong>${esc(r.id)}</strong> <span class="tag grey">${esc(r.kind)}</span> ${esc(r.statement)}
        ${r.kind === 'CONSTRAINT' ? '<br><span class="small muted">A constraint: built with, not built. It gets no story of its own.</span>' : ''}</li>`).join('')}</ul>` : '<p class="muted">None.</p>'}</div>
      <div class="section"><h3>Agents that use it</h3>${u.agents.length ? `<ul class="clean card">${u.agents.map((a) => `<li>${esc(a.name)}</li>`).join('')}</ul>` : '<p class="muted">No agent in the plan reads or writes it.</p>'}</div>
      <div class="section"><h3>Stories that use it</h3>${u.usedBy.length ? storyTable(m, u.usedBy) : '<p class="muted">No story lists it yet.</p>'}</div>`;
  }
  return `<h2>Systems — what this connects to</h2>
    <p class="muted">Systems your plan names. Whether one is connected is a fact about the running system, so every indicator stays grey and “not checked from here” until your system reports otherwise.</p>
    ${systems.length ? `<section class="section"><h3>Data flow</h3><div class="card">${flowDiagram(m, systems)}
      <p class="muted small" style="margin-bottom:0">Your plan has ${(m.plan.agents || []).length ? '' : 'no scoped agents and '}no named artifacts yet, so the middle and right columns are thin. They fill in from <code>plan.agents</code> and <code>plan.derived.artifacts</code>.</p></div></section>
    <section class="section"><h3>Status</h3><div class="table-wrap"><table><thead><tr><th>System</th><th>Status</th><th>Last checked</th><th></th></tr></thead><tbody>
      ${systems.map((s) => `<tr><td><strong>${esc(s)}</strong></td><td><span class="dot" aria-hidden="true"></span>not checked from here</td><td>never</td><td><a href="#/systems/${slug(s)}">Details →</a></td></tr>`).join('')}
    </tbody></table></div></section>` : '<div class="not-built"><p>Your plan names no external systems yet.</p></div>'}
    ${intake.length ? `<section class="section"><h3>What you named at intake</h3><a class="card" href="#/overview/understanding/systems"><div class="quote-label">in your words · ${esc(STANDING[intake[0].standing] ?? '')}</div>
      ${intake.map((e) => `<p class="quote">${esc(plain(e.statement))}</p>`).join('')}
      <p class="muted small" style="margin-bottom:0">These platforms are in what you said, but not in the plan's systems list, so they get no status row. Worth raising: should they be?</p><span class="more">Everything you said →</span></a></section>` : ''}`;
}
