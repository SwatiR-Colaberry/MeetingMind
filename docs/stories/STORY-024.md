# STORY-024 — Select Summary Formats Based on Meeting Type

As a user, I want to select different summary formats depending on the meeting type, so that the summary is relevant to the context of the meeting.

**Release:** r4 · AI-Powered Summaries (weeks 5–5)
**Owner:** User Interface
**Blocked by:** STORY-022, STORY-023

## The requirement this satisfies

- **REQ-014** (Functional, must) — The system must allow users to select different summary formats depending on the meeting type, such as business meeting, technical discussion, or casual conversation.

## How to build it

Implement a dropdown in the Meeting Details page to select summary formats. Use the AI engine to apply the selected format to the summary.

## Failure paths you must handle

- User selects an invalid format
- Format selection does not apply
- Format selection is not saved

## Where this fits

**Workspace:** Meeting Details · select format

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a meeting type selection, when a user selects a format, then the system generates a summary in the chosen format.
- [ ] Given an unsupported meeting type, when a user selects a format, then the system provides a default summary format.
- [ ] Trust: Given a format selection, when a summary is generated, then the format choice is logged with the meeting ID.

When every box above is ticked, stop and show the demo.
