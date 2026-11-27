# STORY-018 — Centralized Dashboard for Meeting Management

As a user, I want a centralized dashboard to manage my meetings, so that I can easily access ongoing, recent, and historical meetings.

**Release:** r3 · Dashboard and Meeting History (weeks 4–4)
**Owner:** UI/UX Team
**Blocked by:** STORY-017

## The requirement this satisfies

- **REQ-008** (Functional, must) — The system must provide a centralized dashboard where users can access all their previous meetings, view ongoing and recently completed meetings, and browse historical meetings.
- **REQ-024** (Functional, must) — The system must provide a modern, intuitive, and lightweight interface with sections for home dashboard, live meeting view, meeting details, AI chat assistant, and settings.
- **REQ-079** (Functional, must) — The system must display meeting date, duration, participants, and platform in the centralized dashboard.

## How to build it

Implement the dashboard UI with sections for ongoing, recent, and historical meetings. Ensure meeting details such as date, duration, participants, and platform are displayed.

## Failure paths you must handle

- Dashboard fails to load.
- Meeting details are incorrect or missing.
- Ongoing meetings do not update in real-time.

## Where this fits

**Workspace:** Meeting Dashboard

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given the user is logged in, when they access the dashboard, then they should see sections for ongoing, recent, and historical meetings.
- [ ] Given a meeting is ongoing, when the user views the dashboard, then the meeting should appear under the ongoing section with its details.
- [ ] Trust: Given the user accesses the dashboard, then the system must log the access time and user ID for audit purposes.

When every box above is ticked, stop and show the demo.
