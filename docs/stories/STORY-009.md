# STORY-009 — Transcript and Audio Encryption

As a user, I want the system to encrypt stored transcripts and audio recordings, so that my data is secure.

**Release:** r1 · Real-Time Transcription (weeks 2–2)
**Owner:** security_service
**Blocked by:** STORY-005, STORY-006

## The requirement this satisfies

- **REQ-016** (Safety, must) — The system must encrypt stored transcripts and audio recordings.

## How to build it

Implement encryption for transcripts and audio recordings using AES-256. Ensure encryption is applied before data is stored.

## Failure paths you must handle

- Encryption fails due to incorrect key management.
- Stored data is accessed without decryption.
- Encryption process causes data corruption.

## Where this fits

**Runs headless:** Data Encryption Service — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a transcript is saved, when it is stored, then it is encrypted using the specified encryption protocol.
- [ ] Given an audio recording is saved, when it is stored, then it is encrypted using the specified encryption protocol.
- [ ] Trust: Given encrypted data, when accessed, then it requires decryption keys for access.

When every box above is ticked, stop and show the demo.
