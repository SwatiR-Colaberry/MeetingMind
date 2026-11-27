# STORY-031 — Automatic Language Detection

As a user, I want the system to automatically detect the language being spoken, so that transcription is accurate without manual input.

**Release:** r5 · Advanced Transcription Features (weeks 6–6)
**Owner:** transcription_service
**Blocked by:** STORY-029

## The requirement this satisfies

- **REQ-036** (Functional, must) — The system must automatically identify the language being spoken during transcription.

## How to build it

Integrate language detection module into the transcription engine to automatically identify spoken language at the start of transcription.

## Failure paths you must handle

- Language not detected
- Incorrect language detected
- Detection not logged

## Where this fits

**Runs headless:** Language Detection Module — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given an audio input, when the language is spoken, then the system automatically detects the language.
- [ ] Given a multilingual conversation, when different languages are spoken, then the system identifies each language correctly.
- [ ] Trust: Given a detected language, when the transcript is generated, then the language detection is logged.

When every box above is ticked, stop and show the demo.
