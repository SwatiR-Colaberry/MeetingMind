# STORY-026 — Automatically Generate Meeting Titles

As a user, I want the system to automatically generate meeting titles based on discussion topics, so that I can easily identify meetings.

**Release:** r4 · AI-Powered Summaries (weeks 5–5)
**Owner:** AI Engine
**Blocked by:** STORY-022, STORY-023

## The requirement this satisfies

- **REQ-044** (Functional, must) — The system must automatically generate meeting titles based on discussion topics.

## How to build it

Use the AI engine to analyze transcripts and extract key topics for title generation. Store titles in the local database with meeting metadata.

## Failure paths you must handle

- Title generation fails
- Title is inaccurate
- Title is not saved

## Where this fits

**Workspace:** Meeting Details · view title

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a completed meeting, when the system processes the transcript, then it generates a title based on discussion topics.
- [ ] Given a meeting with no clear topics, when the system generates a title, then it uses a default naming convention.
- [ ] Trust: Given a generated title, when it is saved, then it is logged with the meeting ID.

When every box above is ticked, stop and show the demo.
