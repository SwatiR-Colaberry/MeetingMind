# STORY-030 — Confidence Indicator for Uncertain Transcript Segments

As a user, I want to see confidence indicators for uncertain transcript segments, so that I can review and correct them if necessary.

**Release:** r5 · Advanced Transcription Features (weeks 6–6)
**Owner:** transcription_service
**Blocked by:** STORY-029

## The requirement this satisfies

- **REQ-022** (Functional, must) — The system must provide a confidence indicator for uncertain transcript segments and flag them for user review.

## How to build it

Implement confidence scoring in the transcription engine. Flag segments below a confidence threshold and display them in the transcript UI with an indicator.

## Failure paths you must handle

- Confidence score not calculated
- Flag not displayed
- Correction not logged

## Where this fits

**Workspace:** Transcript Review · review

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a transcript with uncertain segments, when the system detects low confidence, then it flags the segment for review.
- [ ] Given a flagged segment, when the user reviews it, then they can see a confidence indicator.
- [ ] Trust: Given a flagged segment, when the user corrects it, then the correction is logged in the audit trail.

When every box above is ticked, stop and show the demo.
