# STORY-033 — Recognition of Technical Terminology and Industry Vocabulary

As a user, I want the system to recognize technical terminology and industry-specific vocabulary, so that transcripts are accurate and relevant.

**Release:** r5 · Advanced Transcription Features (weeks 6–6)
**Owner:** transcription_service
**Blocked by:** STORY-029

## The requirement this satisfies

- **REQ-038** (Functional, must) — The system must recognize technical terminology, names, numbers, and industry-specific vocabulary during transcription.

## How to build it

Integrate a vocabulary enhancement module into the transcription engine to recognize and transcribe technical and industry-specific terms accurately.

## Failure paths you must handle

- Terms not recognized
- Incorrect transcription of terms
- Recognition not logged

## Where this fits

**Runs headless:** Vocabulary Enhancement Module — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a conversation with technical terms, when transcribed, then the system accurately recognizes and transcribes the terms.
- [ ] Given a conversation with industry-specific vocabulary, when transcribed, then the system accurately recognizes and transcribes the vocabulary.
- [ ] Trust: Given a transcript with technical terms, when reviewed, then recognized terms are logged.

When every box above is ticked, stop and show the demo.
