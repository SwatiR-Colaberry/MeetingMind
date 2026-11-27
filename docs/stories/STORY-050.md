# STORY-050 — Consolidated History of Discussions and Decisions

As a user, I want the system to automatically connect related conversations to projects and provide a consolidated history of discussions, decisions, and progress, so that I can easily track project developments.

**Release:** r7 · AI Assistant and Search (weeks 8–8)
**Owner:** User
**Blocked by:** STORY-045, STORY-049

## The requirement this satisfies

- **REQ-081** (Functional, must) — The system must automatically connect related conversations to projects and provide a consolidated history of discussions, decisions, and progress.

## How to build it

Implement project linking in the Meeting Details section. Use existing meeting data to connect related conversations and update project histories.

## Failure paths you must handle

- System fails to connect related meetings.
- System incorrectly associates unrelated meetings.
- System does not update project history with new meetings.

## Where this fits

**Workspace:** Meeting Details · view project history

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given related meetings, when I view a project, then the system shows a consolidated history of discussions and decisions.
- [ ] Given a project history, when a new related meeting occurs, then the system updates the history with new discussions and decisions.
- [ ] Trust: Given a project history, when I view it, then it accurately reflects all related meetings and decisions.

When every box above is ticked, stop and show the demo.
