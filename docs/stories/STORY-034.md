# STORY-034 — Regenerate or Improve Transcripts

As a user, I want the ability to regenerate or improve transcripts, so that I can ensure accuracy and completeness.

**Release:** r5 · Advanced Transcription Features (weeks 6–6)
**Owner:** transcription_service
**Blocked by:** STORY-029

## The requirement this satisfies

- **REQ-042** (Functional, must) — The system must provide the ability to regenerate or improve transcripts.

## How to build it

Provide a user interface option to regenerate or improve transcripts, leveraging the transcription engine to reprocess audio as needed.

## Failure paths you must handle

- Regeneration fails
- Improvement not applied
- Changes not logged

## Where this fits

**Workspace:** Transcript Review · regenerate

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given an existing transcript, when the user requests regeneration, then the system regenerates the transcript.
- [ ] Given a transcript with errors, when the user requests improvement, then the system improves the transcript.
- [ ] Trust: Given a regenerated transcript, when reviewed, then changes are logged.

When every box above is ticked, stop and show the demo.
