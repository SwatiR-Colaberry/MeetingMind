# STORY-052 — Export Meeting Summaries to External Applications

As a user, I want to export meeting summaries and action items to external productivity applications, so that I can manage my tasks efficiently.

**Release:** r8 · Integration and Automation (weeks 9–9)
**Owner:** user
**Blocked by:** STORY-050, STORY-051

## The requirement this satisfies

- **REQ-023** (Functional, must) — The system must support exporting meeting summaries and action items to external productivity applications such as Google Calendar, Microsoft Outlook Calendar, Google Drive, OneDrive, Notion, Slack, Microsoft Teams, Trello, Asana, Jira, and Basecamp.

## How to build it

Use the APIs of Google Calendar, Microsoft Outlook, Google Drive, OneDrive, Notion, Slack, Microsoft Teams, Trello, Asana, Jira, and Basecamp to implement export functionality.

## Failure paths you must handle

- Export fails due to network issues.
- User selects an unsupported application for export.
- Exported data is incomplete or corrupted.

## Where this fits

**Workspace:** Meeting Details · export summary

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a completed meeting summary, When I choose to export it, Then the system exports to Google Calendar and other selected applications.
- [ ] Given a completed meeting summary, When I attempt to export to an unsupported application, Then the system notifies me of the limitation.
- [ ] Trust: Given an export action, When it completes, Then the system logs the export details including destination and timestamp.

When every box above is ticked, stop and show the demo.
