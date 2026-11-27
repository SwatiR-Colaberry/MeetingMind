# STORY-021 — Download Meeting Transcripts

As a user, I want to download meeting transcripts in various formats, so that I can use them as needed.

**Release:** r3 · Dashboard and Meeting History (weeks 4–4)
**Owner:** File Management Team
**Blocked by:** STORY-017, STORY-018

## The requirement this satisfies

- **REQ-048** (Functional, must) — The system must allow users to download transcripts in TXT, PDF, DOCX, and other useful formats.

## How to build it

Implement transcript download functionality supporting TXT, PDF, and DOCX formats. Ensure error handling for unsupported formats.

## Failure paths you must handle

- Download fails or is incomplete.
- Incorrect format is downloaded.
- System does not log the download action.

## Where this fits

**Workspace:** Meeting Dashboard · download transcript

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a user wants to download a transcript, when they select a format, then the transcript should be available in TXT, PDF, or DOCX format.
- [ ] Given a user selects an unsupported format, when they attempt to download, then the system should display an error message.
- [ ] Trust: Given a transcript download, then the system must log the download action and user ID for audit purposes.

When every box above is ticked, stop and show the demo.
