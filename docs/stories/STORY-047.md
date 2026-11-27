# STORY-047 — AI Assistant for Contextual Search

As a user, I want to ask the AI assistant questions about past meetings, so that I can receive contextual answers and references.

**Release:** r7 · AI Assistant and Search (weeks 8–8)
**Owner:** User
**Blocked by:** STORY-045, STORY-046

## The requirement this satisfies

- **REQ-050** (Functional, must) — The system must provide an AI assistant that searches relevant transcripts and provides contextual answers.
- **REQ-051** (Functional, must) — The system must provide references to original meetings, speaker names, and timestamps in AI-generated answers.
- **REQ-080** (Functional, must) — The system must allow users to ask questions about previous meetings using voice or text and receive contextual answers.

## How to build it

Develop the AI assistant interface in the AI Chat Assistant section. Integrate with the transcript database to retrieve relevant information and provide references.

## Failure paths you must handle

- AI assistant fails to retrieve relevant information.
- AI assistant provides incorrect references.
- AI assistant does not distinguish between discussed and interpreted information.

## Where this fits

**Workspace:** AI Chat Assistant

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a question about a past meeting, when I ask the AI assistant, then it provides a contextual answer with references to the original meeting.
- [ ] Given a question about a past meeting, when the AI assistant cannot find relevant information, then it informs the user that no data is available.
- [ ] Trust: Given an AI-generated answer, when I view the references, then they include speaker names and timestamps.

When every box above is ticked, stop and show the demo.
