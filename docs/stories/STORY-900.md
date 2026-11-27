# STORY-900 — Build your connected demo

As a builder, I want a clickable preview of the finished application filled with sample data, so that anyone can see what I am building before it is built.

**Release:** ahead of the plan — right after the Command Center, before your own stories
**Owner:** you, with Claude Code
**Blocked by:** STORY-000 — the demo takes its data shape from the Command Center's data model

## The requirement this satisfies

None of yours, and that is deliberate. Like the Command Center, the demo is not part of your
system. The Command Center is the window onto what exists; the demo is the picture of what
will. It has no row in `docs/TRACEABILITY.md`.

## Read this first
Your Command Center shows what is TRUE about this project today. This story builds the other half: a clickable preview of what the FINISHED application will look like, filled with sample data, so you can show someone the destination before you have built the road.
It lives in `demo/`, apart from the Command Center, and every screen says it is sample data. Keep it that way. The Command Center must never show a made-up number as its own; the demo is made of nothing else. They link to each other and share nothing.
If some of the demo is already built, this brief repairs it rather than replacing it. Step 1 finds out how much is there, and you only build what is missing.

## Step 1 — take stock before you change a single line
- Read `.colaberry/plan.json`, `.colaberry/manifest.json` and `command-center/data-model.json`. Read `docs/demo-kit/DEMO_SPEC_CONTRACT.md`, which says what every field of the demo spec means.
- **If `command-center/data-model.json` does not exist, STOP.** The sample data takes its shape from the data model, and the data model is the last tab of the Command Center. Tell me STORY-000 is not finished; do not invent tables.
- If `demo/demo-spec.json` already exists, read it and compare its `source.plan_sha256` with the manifest. Tell me whether the demo was built from the current plan or an older one, which screens exist, and what you propose to do. Then wait for me.

## Step 2 — lay the floor (two commands, no judgement)
The platform ships the parts that must be right. Use them; do not rewrite them.
```
mkdir -p demo
cp docs/demo-kit/index.html demo/index.html
node docs/demo-kit/scaffold-demo-spec.mjs --repo . --out demo/demo-spec.json
```
`demo/index.html` is the engine. It draws whatever `demo/demo-spec.json` describes and contains nothing about this project, so **you never edit it**. The scaffold reads the plan and the data model and writes a first spec: a screen per table, navigation, an approval queue for every agent that may not act alone, the agent and person roster, the guardrails, and seeded sample rows. It is correct and connected, and it reads like a database. Step 3 is where it becomes a product.
- Skip the scaffold if `demo/demo-spec.json` exists and `source.refined` is true: running it again would overwrite refined work. Repair that file in place instead.

## Step 3 — turn the floor into one believable day
Edit `demo/demo-spec.json` only. When you are done set `source.refined` to true.
- **Pick one moment.** One person, one day, one time of day, with something in flight: a thing just finished, a thing in progress, and a decision waiting on a person. Every row on every screen must be consistent with that moment. If a row says a gap is open, nobody has filled it.
- **Pick the person the home screen is for** from the roles below, and write the home screen for the first thing they need to know when they open it.
- **Name things the way that person would.** Screen titles, column labels and status words come from the stories and requirements, not from table names. "Gaps", not "gap". "Waiting on Dana", not "pending".
- **Never type a total.** A count on a tile is a `where` over the rows, so it is always right and it changes when someone clicks. If you want a tile to say 3, there must be three rows.
- **Keep the navigation short.** A table a person would go looking for gets a place in it. A join table does not; it is reached from the record it belongs to.
- **Make one decision ripple.** The approval a person gives must change something somewhere else (the `also` field): the held row is released, the badge clears, the log gains a line signed by a person.
- **Sample people are fictional.** Invented names, `555-01xx` phone numbers, `@example.com` addresses. No real customer, employee or company of yours or anyone else's.
- **Fill in `coverage`:** one row per story in the plan, pointing at the screen that shows it, or saying in a sentence why nothing does. An honest "not shown" passes; a missing row does not.

## Your project
**MeetingMind AI.** Universal AI-Powered Background Call Transcription Assistant

### Screens the plan promises
Each of these stories gives a person something to open. Each needs a screen, or a row in `coverage` saying why it has none.
- **STORY-002** System Tray Operation and Startup Configuration — System Tray, release r0
- **STORY-003** Notification System for Meeting Detection and Transcript Readiness — Notification System, release r0
- **STORY-004** Clear Indicator for Active Audio Capture and Transcription — System Tray (action: view indicator), release r0
- **STORY-005** Data Processing Transparency — Settings (action: view data processing), release r0
- **STORY-006** Real-Time Transcription with Speaker Identification — Live Meeting View, release r1
- **STORY-007** Manual Transcript Correction and Audio Replay — Meeting Details (action: correct transcript), release r1
- **STORY-013** Configurable Audio Quality Settings — settings (action: configure_audio_quality), release r2
- **STORY-017** Support for Different Audio Formats — settings (action: select_audio_format), release r2
- **STORY-018** Centralized Dashboard for Meeting Management — Meeting Dashboard, release r3
- **STORY-019** Meeting Organization and Search — Meeting Dashboard (action: search), release r3
- **STORY-020** Meeting Data Management — Meeting Dashboard (action: manage data), release r3
- **STORY-021** Download Meeting Transcripts — Meeting Dashboard (action: download transcript), release r3
- **STORY-023** Generate AI-Powered Meeting Summaries — Meeting Details (action: view summary), release r4
- **STORY-024** Select Summary Formats Based on Meeting Type — Meeting Details (action: select format), release r4
- **STORY-026** Automatically Generate Meeting Titles — Meeting Details (action: view title), release r4
- **STORY-027** Generate Project-Level Discussion Summaries — Project Dashboard (action: view project summary), release r4
- **STORY-028** Automatically Categorize Meetings — Meeting Details (action: view category), release r4
- **STORY-030** Confidence Indicator for Uncertain Transcript Segments — Transcript Review (action: review), release r5
- **STORY-032** Support for Multilingual Conversations — Transcript Review (action: review), release r5
- **STORY-034** Regenerate or Improve Transcripts — Transcript Review (action: regenerate), release r5
- **STORY-035** Ensure Readable and Structured Transcripts — Transcript Review (action: format), release r5
- **STORY-037** Audio Retention Options — Audio Management (action: set retention preferences), release r5
- **STORY-046** Manual Control of Transcription — Live Meeting View (action: transcription controls), release r7
- **STORY-047** AI Assistant for Contextual Search — AI Chat Assistant, release r7
- **STORY-048** Distinguish AI Interpretations from Discussed Information — AI Chat Assistant, release r7
- **STORY-049** Switch Between Local and Cloud AI Processing — Settings (action: AI processing mode), release r7
- **STORY-050** Consolidated History of Discussions and Decisions — Meeting Details (action: view project history), release r7
- **STORY-051** Exclude Specific Applications from Automatic Detection — Settings (action: exclude application), release r8
- **STORY-052** Export Meeting Summaries to External Applications — Meeting Details (action: export summary), release r8
- **STORY-054** Configure Notification Preferences — Settings (action: configure notifications), release r8
- **STORY-055** Choose External Applications for Integration — Settings (action: choose integrations), release r8
- **STORY-060** User Interface for Non-Technical and Advanced Users — User Interface, release r3

### Work that happens in the background
These have no screen of their own. They show up as lines in the activity log and as agents on the "Who does what" screen.
- **STORY-001** Automatic Meeting Detection and Audio Capture — Meeting Detection Engine
- **STORY-008** Post-Meeting Transcript Generation — Post-Meeting Transcription Job
- **STORY-009** Transcript and Audio Encryption — Data Encryption Service
- **STORY-010** Network and Application Crash Recovery — Recovery Service
- **STORY-011** Support for Multiple Audio Devices — audio_device_detection
- **STORY-012** Noise Reduction and Audio Enhancement — audio_processing_pipeline
- **STORY-014** Adaptation to Different Audio Configurations — audio_configuration_adaptation
- **STORY-015** Handling OS-Specific Audio Capture Restrictions — os_specific_audio_capture
- **STORY-016** Synchronization of Audio from Multiple Sources — audio_synchronization
- **STORY-022** Local and Cloud AI Processing Options — AI Processing
- **STORY-025** Support Post-Meeting Transcription — Transcription Job
- **STORY-029** Securely Manage API Keys and Authentication Credentials — Security Service
- **STORY-031** Automatic Language Detection — Language Detection Module
- **STORY-033** Recognition of Technical Terminology and Industry Vocabulary — Vocabulary Enhancement Module
- **STORY-036** Support Offline Transcription — Offline Transcription Module
- **STORY-038** Identify Related Meetings — Meeting Relationship Processor
- **STORY-039** Connect Conversations to Projects — Project Linker
- **STORY-040** Track Decisions Across Meetings — Decision Tracker
- **STORY-041** Identify Changes in Agreed Plans — Plan Change Identifier
- **STORY-042** Track Recurring Action Items — Action Item Tracker
- **STORY-043** Highlight Unresolved Issues Across Meetings — Issue Highlighter
- **STORY-044** Identify Completed and Pending Tasks — Task Status Identifier
- **STORY-045** Remind Users About Deadlines — Deadline Reminder System
- **STORY-053** Detect Active Communication via Audio Activity — Audio Detection Service
- **STORY-056** Ensure Scalable Architecture for Future Features — System Architecture
- **STORY-057** Optimize System for Minimal Resource Consumption — Resource Optimization
- **STORY-058** Enhance System Capability to Process Long Meetings — Long Meeting Processing
- **STORY-059** Implement Trust Spine for Initial Setup and Detection — Meeting Detection Process

### Who does what
Your plan has no scoped agents yet. Show who owns each story instead, and say on the roster screen that the agent team is not scoped.

### What the sample data must never show
Guardrails apply to made-up data too. A demo in which the system breaks its own promise is worse than no demo.
- **REQ-015** The system must provide options for local processing and cloud-based AI processing, prioritizing local processing to reduce privacy risks and cloud costs.
- **REQ-016** The system must encrypt stored transcripts and audio recordings.
- **REQ-017** The system must allow users to delete their data permanently and provide data export functionality.
- **REQ-018** The system must obtain the necessary permissions before accessing microphone or system audio and require appropriate participant consent before capturing conversations.
- **REQ-019** The system must provide a clear indicator whenever audio capture or transcription is active.
- **REQ-020** The system must never secretly record calls or bypass operating-system or application permissions.
- **REQ-052** The system must distinguish between explicitly discussed information and AI-generated interpretations.
- **REQ-066** The system must securely manage API keys and authentication credentials.
- **REQ-067** The system must provide clear information about what data is processed locally and what is sent to external services.
For each one, the sample must contain a case where the guardrail visibly HOLDS, and write where in `guardrails[].shown_as`. A field the data model marks RESTRICTED has type `private` and no value in any row.

## Step 4 — connect it to the Command Center, one way
- On the Command Center's Overview tab add one card, "Preview the finished app", linking to `demo/index.html`. A link only. Do not read `demo/demo-spec.json` from any Command Center tab.
- Run `node docs/demo-kit/build-standalone.mjs demo`. It writes `demo/standalone.html`: the whole demo in one file that opens with a double-click and attaches to an email.
- On your project page in the portal, find "Your demo link" and pick your `command-center/data-model.json`. That builds the demo on the platform and gives you one link anybody can open with no login. Unpublishing later takes the link away and keeps the demo, so you can publish the same one again.

## Step 5 — check it the way a stranger would, then tell me
- Open the demo. Click every navigation item, then one row on every list. Nothing may be a dead end.
- Make the decision that is waiting. Confirm something else on screen changed because of it, then press Reset demo.
- Read every guardrail above against the rows. If one is broken, fix the rows, not the guardrail.
- Commit and push. Then tell me in plain language which person and which moment you chose, and which stories are not shown and why.

## Done means
- Given the demo, when demo/index.html is opened, then every screen in its navigation is reachable and every record opens one level down.
- Given any demo screen, when it is shown, then a permanent banner says the data is sample data and names the plan version the demo was built from.
- Given the demo, when any screen renders, then demo/demo-spec.json is committed in this repo and every screen, row and count comes from that file rather than from values typed into the page.
- Given .colaberry/plan.json, when the demo is built, then every story with a workspace has a screen or a stated reason for having none, and every agent and every guardrail in the plan appears in the demo.
- Given the Command Center, when it is opened, then it links to the demo and shows none of the demo's sample values as its own.
- Trust — no sample row breaks a guardrail in the plan, and no restricted field holds a value.
