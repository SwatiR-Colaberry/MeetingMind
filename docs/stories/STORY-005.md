# STORY-005 — Data Processing Transparency

As a user, I want clear information about what data is processed locally and what is sent to external services, so that I can make informed decisions about my data privacy.

**Release:** r0 · Initial Setup and Detection (weeks 1–1)
**Owner:** system
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

- **REQ-067** (Safety, must) — The system must provide clear information about what data is processed locally and what is sent to external services.

## How to build it

Provide a settings page or documentation section detailing data processing practices. Ensure clarity between local and external processing.

## Failure paths you must handle

- Data processing information is unclear or misleading.
- Changes to data processing are not logged.
- User cannot access data processing information.

## Where this fits

**Workspace:** Settings · view data processing

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given the user accesses the settings, when they view data processing information, then the system clearly distinguishes between local and external data processing.
- [ ] Given the user reviews the data policy, when they check the application documentation, then it accurately reflects data processing practices.
- [ ] Trust: When data processing settings are updated, an entry is logged with the changes and timestamp.

When every box above is ticked, stop and show the demo.
