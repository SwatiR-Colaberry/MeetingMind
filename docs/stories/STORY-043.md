# STORY-043 — Highlight Unresolved Issues Across Meetings

As a user, I want the system to highlight unresolved issues across meetings, so that I can address them promptly.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** AI Engine
**Blocked by:** STORY-037, STORY-042

## The requirement this satisfies

- **REQ-058** (Functional, must) — The system must highlight unresolved issues across meetings.

## How to build it

Use natural language processing to detect unresolved issues in transcripts and maintain a log of these issues across meetings.

## Failure paths you must handle

- Fails to highlight an unresolved issue
- Incorrectly highlights resolved issues
- Logs incorrect issue references

## Where this fits

**Runs headless:** Issue Highlighter — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given unresolved issues discussed in multiple meetings, when processed, then the system should highlight these issues.
- [ ] Given resolved issues, when processed, then they should not be highlighted as unresolved.
- [ ] Trust: The system logs unresolved issues with references to meetings where they were discussed.

When every box above is ticked, stop and show the demo.
