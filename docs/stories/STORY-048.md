# STORY-048 — Distinguish AI Interpretations from Discussed Information

As a user, I want the system to distinguish between explicitly discussed information and AI-generated interpretations, so that I can trust the accuracy of the information provided.

**Release:** r7 · AI Assistant and Search (weeks 8–8)
**Owner:** User
**Blocked by:** STORY-045, STORY-047

## The requirement this satisfies

- **REQ-052** (Safety, must) — The system must distinguish between explicitly discussed information and AI-generated interpretations.

## How to build it

Implement a labeling system within the AI assistant to differentiate between discussed information and AI interpretations. Ensure clarity in the AI Chat Assistant interface.

## Failure paths you must handle

- System fails to label interpretations.
- System incorrectly labels discussed information as interpretations.
- User cannot distinguish between facts and interpretations.

## Where this fits

**Workspace:** AI Chat Assistant

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given an AI-generated answer, when the answer includes interpretations, then the system clearly labels them as interpretations.
- [ ] Given an AI-generated answer, when the answer is based solely on discussed information, then the system does not label it as an interpretation.
- [ ] Trust: Given a mixed answer, when I view the details, then the system distinguishes between discussed facts and interpretations.

When every box above is ticked, stop and show the demo.
