# STORY-032 — Support for Multilingual Conversations

As a user, I want the system to support multilingual conversations, so that all parts of the conversation are accurately transcribed.

**Release:** r5 · Advanced Transcription Features (weeks 6–6)
**Owner:** transcription_service
**Blocked by:** STORY-029, STORY-031

## The requirement this satisfies

- **REQ-037** (Functional, must) — The system must support multiple languages and explore multilingual conversations.

## How to build it

Enhance the transcription engine to handle multiple languages in a single session, ensuring accurate transcription and language tagging.

## Failure paths you must handle

- Language transitions not detected
- Incorrect transcription of languages
- Transitions not logged

## Where this fits

**Workspace:** Transcript Review · review

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a multilingual conversation, when the system transcribes, then it accurately transcribes each language spoken.
- [ ] Given a conversation in multiple languages, when the user reviews the transcript, then each language is correctly identified and transcribed.
- [ ] Trust: Given a multilingual transcript, when reviewed, then language transitions are logged.

When every box above is ticked, stop and show the demo.
