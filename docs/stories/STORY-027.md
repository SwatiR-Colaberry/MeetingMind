# STORY-027 — Generate Project-Level Discussion Summaries

As a project manager, I want the system to generate project-level discussion summaries, so that I can track project progress across meetings.

**Release:** r4 · AI-Powered Summaries (weeks 5–5)
**Owner:** AI Engine
**Blocked by:** STORY-022, STORY-023

## The requirement this satisfies

- **REQ-060** (Functional, must) — The system must generate project-level discussion summaries.

## How to build it

Use the AI engine to aggregate meeting summaries by project. Store project-level summaries in the local database with project metadata.

## Failure paths you must handle

- Project-level summary is incomplete
- Aggregation fails
- Summary is not saved

## Where this fits

**Workspace:** Project Dashboard · view project summary

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given multiple meetings within a project, when summaries are generated, then the system consolidates them into a project-level summary.
- [ ] Given a project with no meetings, when a summary is requested, then the system indicates no data available.
- [ ] Trust: Given a project-level summary, when it is generated, then it is logged with a project ID.

When every box above is ticked, stop and show the demo.
