# STORY-039 — Connect Conversations to Projects

As a user, I want the system to connect conversations to projects, so that I can view all discussions related to a specific project in one place.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** AI Engine
**Blocked by:** STORY-037, STORY-038

## The requirement this satisfies

- **REQ-054** (Functional, must) — The system must connect conversations belonging to the same project.

## How to build it

Utilize project keywords and context from transcripts to associate meetings with projects. Verify project references against existing project data.

## Failure paths you must handle

- Fails to link a meeting to the correct project
- Incorrectly links a meeting to an unrelated project
- Logs incorrect project linkage criteria

## Where this fits

**Runs headless:** Project Linker — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a meeting transcript with project references, when processed, then the system should link it to the appropriate project.
- [ ] Given a meeting transcript without project references, when processed, then it should not be linked to any project.
- [ ] Trust: The system logs the project linkage decisions and criteria.

When every box above is ticked, stop and show the demo.
