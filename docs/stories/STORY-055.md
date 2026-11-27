# STORY-055 — Choose External Applications for Integration

As a user, I want to choose which external applications to connect, so that I can integrate only the tools I use.

**Release:** r8 · Integration and Automation (weeks 9–9)
**Owner:** user
**Blocked by:** STORY-050, STORY-054

## The requirement this satisfies

- **REQ-064** (Functional, must) — The system must allow users to choose which external applications they want to connect.

## How to build it

Implement integration selection in the settings module, using APIs for Google Calendar, Microsoft Outlook, Google Drive, OneDrive, Notion, Slack, Microsoft Teams, Trello, Asana, Jira, and Basecamp. Ask before building: "due to incorrect API" is not among the tools this project names. Check with the project owner whether to use it or where that data already lives.

## Failure paths you must handle

- Integration fails due to incorrect API keys.
- User cannot deselect an application once connected.
- Integration settings do not persist after restart.

## Where this fits

**Workspace:** Settings · choose integrations

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given the integration settings, When I select applications for integration, Then the system connects to the chosen applications.
- [ ] Given the integration settings, When I deselect an application, Then the system disconnects from that application.
- [ ] Trust: Given an integration change, When it is saved, Then the system logs the change with application details.

When every box above is ticked, stop and show the demo.
