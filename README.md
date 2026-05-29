# RoadIntel

## Transparency-First RoadWatch Platform for Road Quality, Public Spending and Responsible Authority Reporting

**RoadIntel** is a RoadWatch-focused civic technology platform designed to improve transparency in road infrastructure by helping citizens monitor road quality, track public spending, report road issues to responsible authorities, and understand contractor accountability.

The project is built for the RoadWatch problem area, where the core requirement is to create a tool that enables citizens to:

```txt
Monitor road quality
Track public spending
Report issues to responsible authorities
Increase transparency in road infrastructure
```

RoadIntel is not only a complaint-reporting website. It is a complete road transparency and accountability system that connects:

```txt
Citizen reports
→ Road condition monitoring
→ Road DNA profiles
→ Responsible authority routing
→ Public spending visibility
→ Contractor accountability
→ Predictive risk alerts
→ Recommended field action
```

---

## Team

```txt
Team Name: HackTech Novas
Project Name: RoadIntel
Problem Statement: RoadWatch
Domain: Road Safety, Civic Transparency, Public Infrastructure Accountability
Pilot Region: Pune / PCMC
Deployment Target: Vercel
```

---

## Demo Login

```txt
Email: demo@roadintel.in
Password: demo123
```

---

## Problem Statement

Road infrastructure problems are often visible to citizens but difficult to report, track, verify or connect with public spending.

Common issues include:

* Citizens can see potholes, cracks, waterlogging and unsafe road conditions, but do not know which authority is responsible.
* Repair progress is not always transparent after a complaint is filed.
* Public spending on roads is not easily connected to visible road quality.
* Contractors are difficult to compare based on repair quality, budget discipline and repeat failures.
* Road problems are usually handled reactively instead of being predicted early.
* Multiple agencies may be involved, but citizens do not get a simple accountability view.
* Dashboards often show numbers but do not clearly explain what action should happen next.

RoadIntel addresses this by creating a single transparency layer for road quality, complaint routing, spending visibility and contractor accountability.

---

## RoadWatch Requirement Mapping

| RoadWatch Requirement                   | RoadIntel Implementation                                                          |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| Citizens monitor road quality           | Road DNA Registry, Road Health Score, Risk Score, Road Detail Pages               |
| Track public spending                   | Public Spending module, budget vs usage comparison, budget-quality mismatch flags |
| Report issues                           | File Complaint page with structured form and status tracker                       |
| Route issues to responsible authorities | PMC / PCMC / PWD / NHAI-MSRDC routing logic                                       |
| Increase transparency                   | Complaint timeline, Road DNA history, spending visibility, contractor scorecards  |
| Improve road safety                     | Risk Map, Quick Scan classifier, emergency SOS workflow, priority actions         |
| Make data understandable                | Clean dashboard, charts, cards, audit checklist and explainable scoring           |
| Support accountability                  | Road Accountability Score, repeat-failure tracking, contractor audit queue        |

---

## Core Concept

RoadIntel follows a transparency-first workflow:

```txt
1. Citizen observes a road issue
2. RoadIntel helps file and classify the issue
3. Complaint is routed to the responsible authority
4. Road DNA profile stores road condition and repair history
5. Public spending is compared with road quality
6. Contractor performance is scored
7. Risk prediction highlights future failure zones
8. Recommended action is shown clearly
```

This makes RoadIntel useful for citizens, civic authorities, road maintenance teams, auditors and evaluators.

---

## Key Modules

## 1. Road DNA Registry

The Road DNA Registry gives every monitored road a unique profile.

Each road profile includes:

* Road health score
* Risk score
* Location
* Road type
* Authority
* Contractor
* Repair history
* Complaint history
* Budget used
* Repeat failure count
* Monsoon risk
* Recommended next action

This helps users understand the full history and current condition of a road instead of seeing only one isolated complaint.

---

## 2. Road Detail Page

Each road opens a dedicated detail page with different, road-specific information.

The detail page includes:

* Health vs risk trend
* Complaint mix
* Budget flow
* Repair history
* Contractor details
* Risk factors
* Recommended civic action

This makes RoadIntel more explainable and easier to demonstrate during evaluation.

---

## 3. Citizen Complaint Routing

RoadIntel includes a complaint filing and tracking workflow.

Complaint status follows:

```txt
Filed → Assigned → In Progress → Verified → Resolved
```

Complaint routing is based on road ownership and issue severity:

| Road Type                     | Responsible Authority |
| ----------------------------- | --------------------- |
| Pune urban road               | PMC                   |
| Pimpri-Chinchwad road         | PCMC                  |
| State road                    | PWD Maharashtra       |
| Highway / expressway corridor | NHAI / MSRDC          |

Each complaint includes:

* Complaint ID
* Issue type
* Severity
* Location
* Description
* Assigned authority
* Assigned department
* SLA
* Status timeline
* Progress visibility

This directly supports the RoadWatch requirement of reporting issues to responsible authorities.

---

## 4. Public Spending Transparency

The Public Spending module connects road quality with spending visibility.

It tracks:

* Approved budget
* Actual spending
* Road health after spending
* Contractor quality
* Repeat repair pattern
* Budget-quality mismatch
* Audit-risk flags

The purpose is to answer a key transparency question:

```txt
If public money was spent on a road, did the road actually improve?
```

This module helps identify cases where:

```txt
High spending + poor road health + repeated repairs = audit risk
```

---

## 5. Contractor Accountability Dashboard

RoadIntel evaluates contractors using a Road Accountability Score.

The score considers:

* Repair quality
* Timeliness
* Budget discipline
* Repeat failure rate
* Complaint recurrence

Contractors are grouped as:

```txt
Strong
Watchlist
Audit Required
```

This helps citizens and authorities see whether repeated road failures are linked to poor maintenance quality or contractor performance.

---

## 6. Quick Scan Road Classifier

Quick Scan allows users to upload or select a road image sample and classify visible road damage.

Supported categories include:

* Pothole formation
* Surface cracking
* Waterlogging risk
* Good road condition
* Surface wear

The scan result includes:

* Issue type
* Severity
* Confidence score
* Health score
* Damage probability
* Responsible authority
* Suggested SLA
* Detected signals
* Recommended action

The classifier is clearly labelled as a demo classifier. It does not falsely claim to be connected to official live government AI systems.

---

## 7. Future Risk Map

The Future Risk Map highlights roads likely to fail soon.

Risk prediction considers:

* Road health score
* Complaint density
* Repeat repair history
* Contractor quality
* Monsoon exposure
* Surface deterioration signals

The page prioritizes roads into:

```txt
Critical
High
Medium
Low
```

This supports proactive road maintenance instead of waiting for severe road failure.

---

## 8. Sensor Intelligence Digital Twin

Sensor Intel is presented as a simulated digital twin for future road monitoring.

It demonstrates how future sensor integration could use:

* Vibration score
* Roughness index
* Shock spikes
* Rainfall stress
* Traffic load
* Damage probability

This is shown as simulated pilot data, not as a fake live sensor feed.

---

## 9. Analytics Command Center

The Analytics page connects the major RoadIntel layers into one evaluation-ready dashboard.

It includes:

* Complaint lifecycle trends
* Road health trends
* Risk trends
* Zone-wise risk load
* Contractor accountability analytics
* Spending vs road health
* Issue-type distribution
* Audit alignment checklist

This helps evaluators quickly understand how the platform connects safety, transparency and accountability.

---

## 10. Floating RoadIntel Assistant

RoadIntel includes a floating assistant to help users navigate and understand the platform.

It supports:

* Text chat
* Voice input where browser-supported
* Voice output
* Website navigation commands
* RoadIntel-specific explanations
* Road risk, complaint, spending and contractor guidance

The assistant is presented as a rule-based decision helper for the demo and avoids overclaiming as a fully autonomous AI system.

---

## Main User Workflows

### Citizen Workflow

```txt
Open RoadIntel
→ File complaint or scan road issue
→ Get responsible authority
→ Track complaint progress
→ View road condition and public spending
→ Understand whether repair action is happening
```

### Civic Authority Workflow

```txt
View complaint load
→ Identify high-risk roads
→ Check assigned department
→ Review road health and risk
→ Prioritize field inspection
→ Monitor verified resolution
```

### Audit / Transparency Workflow

```txt
Select road
→ Check approved budget and actual spending
→ Compare spending with road health
→ Review contractor performance
→ Detect repeated repair patterns
→ Flag contractor or road for audit
```

---

## Why RoadIntel Fits RoadWatch

RoadIntel is designed around the exact RoadWatch transparency goals.

It enables:

* Road quality monitoring
* Public spending visibility
* Issue reporting
* Authority routing
* Repair progress tracking
* Contractor accountability
* Citizen-facing transparency
* Explainable risk prioritization

The strongest part of RoadIntel is that it does not treat road quality as a single complaint. It treats every road as a public asset with condition, spending, repair history and responsibility.

---

## What Makes RoadIntel Different

Most road-reporting tools stop at:

```txt
User reports pothole
→ Complaint is submitted
```

RoadIntel goes further:

```txt
User reports issue
→ Issue is routed
→ Road DNA is updated
→ Risk score is generated
→ Spending is checked
→ Contractor performance is reviewed
→ Recommended action is shown
```

This creates a complete accountability chain.

---

## Technical Architecture

```txt
Frontend Application
├── React
├── TypeScript
├── Vite
├── Tailwind CSS
├── Wouter Router
├── Recharts
├── Lucide React Icons
└── TanStack React Query

RoadIntel Modules
├── Landing and Login
├── Dashboard
├── Complaint Routing
├── Quick Scan
├── Road DNA Registry
├── Road Detail Pages
├── Future Risk Map
├── Public Spending
├── Sensor Intelligence
├── Contractor Accountability
├── Analytics
├── Settings
└── Emergency SOS
```

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Wouter Router
* Recharts
* Lucide React Icons
* TanStack React Query

### Tooling

* pnpm workspace
* TypeScript build validation
* Vercel deployment
* Responsive web layout
* SPA routing support

---

## Folder Structure

```txt
RoadIntel/
├── artifacts/
│   └── roadintel/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   ├── ui/
│       │   │   └── FloatingRoadIntelBot.tsx
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── pages/
│       │   │   ├── analytics.tsx
│       │   │   ├── complaints.tsx
│       │   │   ├── contractors.tsx
│       │   │   ├── dashboard.tsx
│       │   │   ├── landing.tsx
│       │   │   ├── login.tsx
│       │   │   ├── register.tsx
│       │   │   ├── risk-map.tsx
│       │   │   ├── road-detail.tsx
│       │   │   ├── roads.tsx
│       │   │   ├── scan.tsx
│       │   │   ├── sensors.tsx
│       │   │   ├── settings.tsx
│       │   │   └── sos.tsx
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       ├── package.json
│       └── vite.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── vercel.json
└── README.md
```

---

## Main Routes

```txt
/                 Landing page
/login            Login page
/register         Register page
/dashboard        Main dashboard
/complaints       Complaint routing and status tracker
/scan             Quick road image classifier
/roads            Road DNA registry
/roads/:id        Road DNA detail page
/risk-map         Future risk map
/spending         Public spending transparency
/sensors          Sensor intelligence digital twin
/contractors      Contractor accountability dashboard
/analytics        Analytics command center
/settings         Account settings
/sos              Emergency SOS workflow
```

---

## Local Setup

Install dependencies:

```bash
pnpm install
```

Run the RoadIntel application locally:

```bash
pnpm --filter @workspace/roadintel dev
```

Build the RoadIntel app:

```bash
pnpm --filter @workspace/roadintel build
```

Run full workspace build:

```bash
pnpm build
```

---

## Vercel Deployment

Recommended Vercel settings:

```txt
Framework Preset: Vite
Root Directory: artifacts/roadintel
Install Command: pnpm install
Build Command: pnpm build
Output Directory: dist
```

The project includes SPA routing support through `vercel.json`, so direct refreshes on routes like `/dashboard`, `/complaints`, `/roads`, `/spending`, `/contractors`, and `/risk-map` work correctly.

---

## Submission Readiness

RoadIntel is prepared as a hackathon-ready software prototype with:

* Working web application
* Login flow
* RoadWatch-specific modules
* Responsive UI
* Public spending transparency layer
* Citizen complaint workflow
* Contractor accountability
* Demo classifier
* Analytics dashboard
* Vercel deployment compatibility
* Clear assumptions and demo-data note

Recommended submission materials:

```txt
1. Source code repository
2. Deployed website link
3. 7-slide presentation
4. README.md
5. Short assumptions / technical note
6. Demo credentials
```

---

## Demo Data and Assumptions

RoadIntel currently uses realistic pilot-style demo data for Pune / PCMC road monitoring.

The project intentionally does not claim that it is already connected to:

* Live government databases
* Official municipal complaint APIs
* Real-time official sensor networks
* Official contractor payment systems
* Official civic dashboards

The demo data is used to show:

* Product workflow
* RoadWatch alignment
* Complaint routing logic
* Public spending transparency
* Contractor accountability scoring
* Risk prediction approach
* Future integration potential

This keeps the project honest, explainable and evaluation-safe.

---

## Transparency and Accountability Principles

RoadIntel follows these principles:

### 1. Citizen Visibility

Citizens should be able to see road condition, complaint progress and responsible authority.

### 2. Spending Visibility

Public spending should be connected to actual road quality and repair outcomes.

### 3. Authority Clarity

Every complaint should be routed to a clear responsible authority.

### 4. Contractor Accountability

Repeated failures should be linked to contractor performance and audit risk.

### 5. Explainable Risk

Risk scores should be understandable through complaints, repairs, spending and road condition.

### 6. Honest Demo Data

Simulated data should be labelled clearly and should not be presented as official live data.

---

## Evaluation Strengths

### RoadWatch Fit

RoadIntel directly targets monitoring road quality, tracking spending and reporting issues to responsible authorities.

### Transparency

The platform exposes road condition, public money, contractor quality and complaint progress in one place.

### Practicality

The application is already implemented as a working web prototype using deployable technologies.

### Scalability

The design can later integrate municipal complaint APIs, GIS ownership data, real road images, mobile reporting and sensor feeds.

### Impact

RoadIntel can help reduce unsafe road conditions by making road failure visible earlier and making repair accountability clearer.

### Technical Clarity

The project uses TypeScript, React, Vite, Recharts and modular page-based architecture.

### Presentation Readiness

The UI is consistent, mobile-friendly and designed for live demonstration.

---

## Risk and Mitigation

| Risk                              | Mitigation                                                    |
| --------------------------------- | ------------------------------------------------------------- |
| Lack of real municipal API access | Use demo data now; design API-ready structure for integration |
| Fake-data concern                 | Clearly label data as pilot-style demo data                   |
| Multi-authority confusion         | Include authority-routing logic                               |
| Complaint-only limitation         | Add Road DNA, spending, contractor and risk layers            |
| Scalability concern               | Keep modular architecture and future API integration plan     |
| Trust concern                     | Add transparency-first workflow and audit-safe explanations   |

---

## Future Scope

Planned improvements include:

* Real municipal complaint API integration
* GIS-based road ownership mapping
* Citizen mobile reporting application
* Verified before/after repair photo workflow
* Contractor payment hold recommendation after failed repair verification
* Public open dashboard for citizens
* AI-assisted road image classifier
* Mobile accelerometer-based roughness detection
* Field engineer mobile workflow
* Admin panel for civic departments
* Multilingual citizen interface
* Integration with real road safety datasets

---

## Project Status

RoadIntel is currently a working demo-ready web application with pilot data, responsive design and deployable Vercel configuration.

It demonstrates how road quality, citizen reporting, public spending and contractor accountability can be combined into one transparent RoadWatch platform.

---

## Project Identity

```txt
Project: RoadIntel
Team: HackTech Novas
Problem Statement: RoadWatch
Primary Goal: Road Infrastructure Transparency
Secondary Goals: Road Safety, Civic Accountability, Predictive Maintenance
Primary Users: Citizens, Civic Authorities, Auditors, Reviewers
Pilot Data Region: Pune / PCMC
Deployment Target: Vercel
```

---

## Final Statement

RoadIntel is built around one simple principle:

```txt
Road infrastructure should be visible, measurable and accountable.
```

The platform helps answer the most important RoadWatch questions:

```txt
Which roads are damaged?
Where is public money being spent?
Who is responsible for the road?
Has the issue been reported?
Has the repair been verified?
Which contractor is repeatedly failing?
Which road needs urgent action next?
```

By combining citizen complaints, Road DNA, public spending transparency, contractor accountability and predictive risk, RoadIntel presents a practical, scalable and transparency-first RoadWatch solution.
