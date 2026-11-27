# STORY-022 — Local and Cloud AI Processing Options

As a user, I want options for local and cloud AI processing, so that I can choose based on privacy and cost considerations.

**Release:** r3 · Dashboard and Meeting History (weeks 4–4)
**Owner:** AI Processing Team
**Blocked by:** STORY-017, STORY-018

## The requirement this satisfies

- **REQ-015** (Safety, must) — The system must provide options for local processing and cloud-based AI processing, prioritizing local processing to reduce privacy risks and cloud costs.

## How to build it

Implement options for local and cloud-based AI processing. Prioritize local processing where possible.

## Failure paths you must handle

- Processing option does not apply correctly.
- Local processing fails due to resource constraints.
- Cloud processing incurs unexpected costs.

## Where this fits

**Runs headless:** AI Processing — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a user selects local processing, when a meeting is processed, then it should be handled locally without cloud interaction.
- [ ] Given a user selects cloud processing, when a meeting is processed, then it should utilize cloud resources.
- [ ] Trust: Given a processing option is selected, then the system must log the selection and user ID for audit purposes.

When every box above is ticked, stop and show the demo.
