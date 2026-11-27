# STORY-019 — Meeting Organization and Search

As a user, I want to organize and search my meetings, so that I can efficiently find and manage them.

**Release:** r3 · Dashboard and Meeting History (weeks 4–4)
**Owner:** Backend Team
**Blocked by:** STORY-017, STORY-018

## The requirement this satisfies

- **REQ-045** (Functional, must) — The system must organize meetings into projects, categories, and folders.
- **REQ-046** (Functional, must) — The system must allow users to search meetings by date, topic, participant, or keyword.
- **REQ-047** (Functional, must) — The system must allow users to filter meetings based on different criteria.

## How to build it

Implement backend support for organizing meetings into projects, categories, and folders. Enable search functionality by date, topic, participant, or keyword.

## Failure paths you must handle

- Search returns no results when it should.
- Search results are incorrect or incomplete.
- Meeting organization fails to save.

## Where this fits

**Workspace:** Meeting Dashboard · search

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given meetings are organized into projects, when the user searches by project, then only meetings from that project should be displayed.
- [ ] Given the user searches by date, topic, participant, or keyword, when results are returned, then they should match the search criteria.
- [ ] Trust: Given a search is performed, then the system must log the search criteria and user ID for audit purposes.

When every box above is ticked, stop and show the demo.
