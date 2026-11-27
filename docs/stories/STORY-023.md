# STORY-023 — Generate AI-Powered Meeting Summaries

As a user, I want the system to generate AI-powered meeting summaries, so that I can quickly understand the key points and decisions from the meeting.

**Release:** r4 · AI-Powered Summaries (weeks 5–5)
**Owner:** AI Engine
**Blocked by:** STORY-022

## The requirement this satisfies

- **REQ-013** (Functional, must) — The system must generate AI-powered meeting summaries, key discussion points, decisions, and action items after every meeting.
- **REQ-082** (Functional, must) — The system must automatically generate and save meeting summaries.

## How to build it

Use the AI meeting intelligence engine to process transcripts and generate summaries. Ensure summaries are stored in the local database with meeting metadata.

## Failure paths you must handle

- AI fails to generate a summary
- Summary generation takes too long
- Summary is incomplete or inaccurate

## Where this fits

**Workspace:** Meeting Details · view summary

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a completed meeting, when the meeting ends, then the system generates a summary including key discussion points, decisions, and action items.
- [ ] Given a completed meeting, when the system generates a summary, then the summary is saved automatically.
- [ ] Trust: Given a generated summary, when it is saved, then it is logged with a timestamp and meeting ID.

When every box above is ticked, stop and show the demo.
