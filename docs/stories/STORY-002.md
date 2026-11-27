# STORY-002 — System Tray Operation and Startup Configuration

As a user, I want the application to run quietly in the system tray and start automatically if enabled, so that it is always ready to detect meetings without manual startup.

**Release:** r0 · Initial Setup and Detection (weeks 1–1)
**Owner:** system
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

- **REQ-025** (Functional, must) — The system must start automatically when the laptop boots, if enabled by the user.
- **REQ-026** (Functional, must) — The system must run quietly in the system tray or menu bar.

## How to build it

Configure the application to register with the OS for auto-start and system tray operation. Use OS-specific APIs to manage tray icons and startup settings. Ask before building: "OS-specific API" is not among the tools this project names. Check with the project owner whether to use it or where that data already lives.

## Failure paths you must handle

- Application fails to start automatically on boot.
- Application does not appear in the system tray.
- User cannot disable auto-start.

## Where this fits

**Workspace:** System Tray

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given the user has enabled auto-start, when the laptop boots, then the application starts automatically and runs in the system tray.
- [ ] Given the application is running, when the user checks the system tray, then the application is visible there.
- [ ] Trust: When the application starts, an entry is logged indicating the startup mode (manual/automatic).

When every box above is ticked, stop and show the demo.
