# STORY-051 — Exclude Specific Applications from Automatic Detection

As a user, I want to exclude specific applications from automatic detection, so that I can control which applications are monitored.

**Release:** r8 · Integration and Automation (weeks 9–9)
**Owner:** user
**Blocked by:** STORY-050

## The requirement this satisfies

- **REQ-007** (Functional, must) — The system must allow users to exclude specific applications from automatic detection.

## How to build it

Implement exclusion logic in the settings module, ensuring that the list of applications is updated in real-time and stored persistently.

## Failure paths you must handle

- User tries to exclude an application not installed.
- User excludes an application but it still gets detected.
- Exclusion list fails to save after application restart.

## Where this fits

**Workspace:** Settings · exclude application

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given the application settings, When I exclude an application from detection, Then the system does not detect meetings from that application.
- [ ] Given the application settings, When I attempt to exclude an unsupported application, Then the system notifies me that exclusion is not possible.
- [ ] Trust: Given an excluded application, When a meeting starts, Then the system logs that the application was excluded from detection.

When every box above is ticked, stop and show the demo.
