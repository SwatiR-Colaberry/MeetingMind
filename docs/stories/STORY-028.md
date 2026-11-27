# STORY-028 — Automatically Categorize Meetings

As a user, I want the system to automatically categorize meetings, so that I can organize them efficiently.

**Release:** r4 · AI-Powered Summaries (weeks 5–5)
**Owner:** AI Engine
**Blocked by:** STORY-022, STORY-023

## The requirement this satisfies

- **REQ-062** (Functional, must) — The system must automatically categorize meetings.

## How to build it

Use the AI engine to analyze transcripts and determine meeting categories. Store categories in the local database with meeting metadata.

## Failure paths you must handle

- Categorization fails
- Category is inaccurate
- Category is not saved

## Where this fits

**Workspace:** Meeting Details · view category

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a completed meeting, when the system processes the transcript, then it categorizes the meeting based on content.
- [ ] Given a meeting with ambiguous content, when categorization is attempted, then the system uses a default category.
- [ ] Trust: Given a categorized meeting, when it is saved, then the category is logged with the meeting ID.

When every box above is ticked, stop and show the demo.
