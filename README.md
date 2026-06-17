# RoadIntel

## Road Intelligence Transparency & Accountability Platform

RoadIntel is a civic infrastructure intelligence platform designed to transform road-defect reporting into a verified, trackable, and accountable repair workflow. It helps citizens report road issues, supports authorities in prioritising repair action, links road condition with public spending visibility, and creates a proof-based road health record for safer and more transparent infrastructure management.

RoadIntel is not just a complaint portal. It is an end-to-end road accountability system built around one clear workflow:

**Report → Verify → Prioritise → Assign → Repair → Prove → Audit**

---

## Live Website

**Website:** https://roadintel.vercel.app
**Repository:** https://github.com/Prathamesh-A-Noroliya/RoadIntel-website
**Contact:** [prathameshnoroliyaa@gmail.com](mailto:prathameshnoroliyaa@gmail.com)

---

## Project Overview

Road quality issues such as potholes, cracks, waterlogging, broken shoulders, and repeated surface failures are often visible to citizens before they become larger safety and governance problems. However, most reporting systems stop at complaint submission. Citizens often cannot clearly see who owns the issue, whether it has been assigned, whether repair work is progressing, whether public spending is linked to visible improvement, or whether the final repair was verified with proof.

RoadIntel solves this gap by creating a structured road intelligence layer where every reported defect can become a traceable civic case. The platform combines citizen reports, AI-assisted defect classification, road health scoring, contractor accountability, spending-quality visibility, and proof-of-repair verification.

---

## Core Idea

RoadIntel is built on the principle that road infrastructure should be:

* **Visible** — citizens should be able to report and track road issues.
* **Verified** — defect severity and repair closure should be supported by evidence.
* **Accountable** — every case should have ownership, status, and responsible action.
* **Auditable** — spending and repair quality should be compared with visible outcomes.
* **Scalable** — the system should work from a ward-level pilot to a city-level road intelligence layer.

---

## Key Features

### 1. Citizen Road Defect Reporting

Citizens can file structured reports for:

* Potholes
* Road cracks
* Waterlogging
* Damaged shoulders
* Unsafe road patches
* Repeated surface failures
* Other road-condition issues

Each report can include location, issue type, severity, description, ownership hint, and image evidence.

---

### 2. Quick Scan Road Classifier

RoadIntel includes a prototype Quick Scan module that supports AI-assisted classification of road defects.

It can classify or demonstrate detection support for:

* Potholes
* Cracks
* Waterlogging
* Surface condition issues
* Severity indicators

The current classifier is a prototype/demo layer and is designed to evolve into a trained computer-vision model using verified road image datasets.

---

### 3. Road DNA Registry

Road DNA is RoadIntel’s road health intelligence model. Each road segment can receive a profile based on multiple indicators such as:

* Complaint history
* Defect severity
* Repair frequency
* Monsoon or weather stress
* Contractor performance
* Spending signals
* Repeat failure patterns
* Road health trend

This helps identify roads that need urgent attention, repeated maintenance review, or preventive repair.

---

### 4. Smart Routing and Ownership Mapping

RoadIntel is designed to route road issues to the likely responsible authority or repair owner, such as:

* Municipal road departments
* Public Works Department divisions
* Highway authorities
* Assigned contractors
* Local maintenance teams

This reduces ambiguity and helps move from complaint filing to action assignment.

---

### 5. Repair Tracker

The repair lifecycle can be tracked through clear stages:

1. Reported
2. Verified
3. Assigned
4. In Progress
5. Completion Claimed
6. Proof Submitted
7. Verified / Rejected
8. Closed / Escalated

This makes the repair process transparent for citizens, authorities, and auditors.

---

### 6. Proof-of-Repair System

RoadIntel promotes evidence-based closure. A complaint should not be treated as truly resolved unless repair proof is available.

Supported proof structure:

* Before image
* After image
* Contractor update
* Authority verification
* Status trail
* Reopen or dispute option for weak closure claims

This helps reduce paper-based closure and improves public trust.

---

### 7. Public Spending Accountability

RoadIntel connects road condition and repair records with spending visibility.

The spending module is designed to compare:

* Approved spending
* Actual spending
* Road health score
* Repair frequency
* Contractor quality
* Repeat defect signals

This helps flag cases where high spending does not match visible road improvement.

---

### 8. Contractor Accountability Score

RoadIntel includes a Road Accountability Score model for contractor performance assessment.

The score can consider:

* Timeliness
* Work quality
* Budget discipline
* Repeat failure control
* Repair proof quality
* Complaint recurrence after repair

This creates a more transparent performance layer for infrastructure maintenance.

---

### 9. Analytics Command Center

RoadIntel includes dashboards for:

* Complaint lifecycle analysis
* Issue type distribution
* Road health trends
* Spending versus quality signals
* Contractor performance
* Repeat failure areas
* Priority repair queues
* Risk indicators

These analytics help authorities and decision-makers move from reactive repair to data-backed maintenance planning.

---

### 10. Sensor and Future Data Readiness

RoadIntel is designed for future integration with:

* Mobile accelerometer data
* Vehicle vibration signals
* Road roughness data
* Rainfall and flooding data
* Traffic intensity data
* GPS clustering
* Dashcam or camera-based detection
* Municipal work-order systems
* Public spending datasets

The current prototype demonstrates the interface and workflow readiness for these integrations.

---

### 11. Emergency Support Extension

RoadIntel also includes an emergency support interface as a future safety extension. This module can help connect road-risk intelligence with crisis response context, such as nearest hospital information and emergency-route awareness.

This feature is informational in the prototype stage and does not replace official emergency services.

---

## Why RoadIntel Is Different

Many civic systems focus only on collecting complaints. RoadIntel focuses on accountability after the complaint.

| Existing Approach             | RoadIntel Approach                                     |
| ----------------------------- | ------------------------------------------------------ |
| Complaint submission only     | Full report-to-repair accountability loop              |
| Manual issue review           | AI-assisted defect and severity classification         |
| Unclear ownership             | Smart routing to likely responsible authority          |
| Closure without public proof  | Before-after evidence-based closure                    |
| Spending shown separately     | Spending connected with road health and repair quality |
| Contractor performance hidden | Contractor accountability scoring                      |
| Reactive road repair          | Road DNA-based preventive prioritisation               |
| Fragmented dashboards         | Unified civic road intelligence layer                  |

---

## System Workflow

```text
Citizen Report
      ↓
AI-Assisted Classification
      ↓
Duplicate / Severity / Routing Check
      ↓
Authority Review
      ↓
Repair Assignment
      ↓
Contractor Progress Update
      ↓
Before-After Proof Upload
      ↓
Verification
      ↓
Road DNA + Spending + Contractor Score Update
      ↓
Public Accountability Dashboard
```

---

## User Roles

### Citizens

* Report road defects
* Track complaint status
* View repair proof
* Understand road health
* Escalate unresolved issues

### Authorities

* Review verified reports
* Prioritise high-risk road issues
* Assign repair work
* Track repair timelines
* Monitor road health and complaint patterns

### Contractors

* Receive assigned repair cases
* Update repair progress
* Submit before-after proof
* Build performance credibility through transparent scoring

### Auditors and Civic Reviewers

* Compare spending with road outcomes
* Identify repeat repair failures
* Review proof-based closure
* Track accountability gaps

### City Leaders and Administrators

* Monitor road readiness
* Identify priority corridors
* Improve budget allocation
* Build public trust through transparency

---

## Technology Stack

RoadIntel is built as a modern web application using:

* **React** — frontend user interface
* **TypeScript** — type-safe development
* **Vite** — fast development and production build system
* **Tailwind CSS** — responsive styling and design system
* **Wouter** — lightweight client-side routing
* **TanStack React Query** — async data and API-readiness layer
* **Recharts** — dashboards and visual analytics
* **Lucide React** — icon system
* **Framer Motion** — interface animations
* **Vercel** — frontend deployment

---

## Repository Structure

```text
RoadIntel-website/
│
├── artifacts/
│   └── roadintel/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       │
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── vercel.json
└── README.md
```

---

## Main Application Routes

| Route          | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `/`            | Main entry / landing flow                       |
| `/landing`     | Public project introduction                     |
| `/login`       | Login interface                                 |
| `/register`    | Registration interface                          |
| `/dashboard`   | Main RoadIntel command center                   |
| `/complaints`  | Citizen complaint filing and tracking           |
| `/scan`        | Quick Scan road defect classifier               |
| `/roads`       | Road DNA registry                               |
| `/road-detail` | Individual road intelligence profile            |
| `/risk-map`    | Future road risk and priority view              |
| `/spending`    | Public spending accountability dashboard        |
| `/contractors` | Contractor performance and accountability score |
| `/sensors`     | Sensor intelligence and road condition signals  |
| `/analytics`   | Road health and complaint analytics             |
| `/sos`         | Emergency support interface                     |
| `/settings`    | User settings and preferences                   |

---

## Installation and Local Setup

### Prerequisites

Install the following before running the project:

* Node.js
* pnpm

### Clone the Repository

```bash
git clone https://github.com/Prathamesh-A-Noroliya/RoadIntel-website.git
cd RoadIntel-website
```

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm --filter @workspace/roadintel dev
```

### Build for Production

```bash
pnpm --filter @workspace/roadintel build
```

### Type Check

```bash
pnpm --filter @workspace/roadintel typecheck
```

---

## Deployment

The project is deployed using Vercel.

Expected deployment settings:

```text
Framework: Vite
Root Directory: artifacts/roadintel
Build Command: pnpm install --frozen-lockfile=false && pnpm --filter @workspace/roadintel build
Output Directory: artifacts/roadintel/dist
```

The repository includes SPA routing support through `vercel.json`, allowing direct refreshes on internal routes.

---

## Prototype Status

RoadIntel is currently a functional web prototype that demonstrates the product workflow, interface design, module structure, and civic accountability model.

Current prototype includes:

* Working frontend interface
* Road intelligence dashboard
* Complaint filing and tracking views
* Quick Scan classifier interface
* Road DNA module
* Spending accountability dashboard
* Contractor performance module
* Analytics dashboards
* Sensor-readiness interface
* Emergency support interface
* Public deployment

---

## Responsible Claims

RoadIntel is designed as a practical and scalable civic technology platform, but the current prototype should be understood responsibly.

* Current data shown in the prototype may include demo, sample, or pilot-style data.
* The AI classifier is a prototype decision-support layer and not a certified engineering inspection system.
* Road DNA scores are explainable prioritisation indicators, not official road safety certificates.
* Spending-quality flags indicate review priority and do not independently prove misconduct.
* Contractor scoring in production should include transparent methodology and dispute handling.
* Emergency support features are informational and do not replace official emergency numbers or services.
* Road defects are preventable risk signals, but RoadIntel does not claim that all accidents are caused by road damage.

---

## Future Scope

RoadIntel can be expanded into a larger civic infrastructure intelligence system through:

* Mobile-first complaint reporting
* Offline complaint filing and sync
* GPS-based duplicate detection
* Computer-vision pothole and crack detection
* Before-after repair verification model
* Role-based dashboards for authorities and contractors
* Live municipal complaint integration
* Work-order and SLA tracking
* Public spending dataset integration
* Rainfall, traffic, and road-stress overlays
* Vehicle sensor and accelerometer-based road roughness detection
* Road readiness scoring for emergency routes
* City-level and state-level road health dashboards

---

## Suggested Pilot Model

A practical pilot can begin with a limited geography instead of a full-scale rollout.

### Pilot Scope

* 1 ward or selected road corridor
* 20–50 road segments
* 100+ citizen road reports
* 2–3 authority users
* 2–5 contractor profiles
* 60–90 day validation period

### Pilot Success Indicators

* Percentage of reports mapped to likely authority
* Percentage of high-severity cases prioritised
* Percentage of repair closures with before-after proof
* Number of repeat defect clusters identified
* Average time from report to assignment
* Road DNA score improvement after repair
* Number of spending-quality mismatch signals reviewed
* Citizen visibility of status and proof

---

## Impact Potential

RoadIntel can create value across multiple levels.

### Citizen Impact

* Easier road issue reporting
* Transparent complaint status
* Visible proof of repair
* Higher trust in civic response

### Authority Impact

* Better prioritisation of road repairs
* Reduced duplicate complaint load
* Clearer repair queues
* Evidence-based decision-making

### Contractor Impact

* Transparent work assignment
* Proof-based completion records
* Performance credibility
* Fairer quality tracking

### Governance Impact

* Spending linked with road outcomes
* Repeat repair failures identified
* Audit-ready repair history
* Public accountability improved

### Safety Impact

* Preventable infrastructure risks identified earlier
* High-risk road segments prioritised
* Emergency route readiness can be improved
* Preventive maintenance becomes more data-driven

---

## Evaluation Snapshot

| Area                | RoadIntel Strength                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Originality         | Combines complaint reporting, AI classification, Road DNA, repair proof, spending accountability, and contractor scoring into one workflow |
| Clarity             | Simple report-to-audit civic action loop                                                                                                   |
| Feasibility         | Functional web prototype with modular architecture                                                                                         |
| Scalability         | Can begin ward-level and expand city-by-city                                                                                               |
| Social Impact       | Targets road safety, transparency, public spending visibility, and civic trust                                                             |
| Technical Potential | Ready for backend, AI, GPS, sensor, and municipal data integration                                                                         |
| Sustainability      | Can support municipal SaaS, civic pilots, smart-city programs, infrastructure audits, and public dashboards                                |

---

## Project Vision

RoadIntel aims to become a Road Readiness Intelligence Layer for cities.

The long-term vision is to help cities continuously monitor road condition, detect infrastructure risk early, verify repair action, connect spending with outcomes, and make road maintenance more transparent for every citizen.

---


**Project:** RoadIntel
**Email:** [prathameshnoroliyaa@gmail.com](mailto:prathameshnoroliyaa@gmail.com)
**Website:** https://roadintel.vercel.app
**GitHub:** https://github.com/Prathamesh-A-Noroliya/RoadIntel-website

---

## License and Usage

This project is currently shared for demonstration, evaluation, and innovation review purposes. A formal open-source license may be added later depending on future release and deployment plans.

---

## Final Note

RoadIntel is built to make road repair accountability visible.

It transforms road defects from isolated complaints into verified, prioritised, assigned, repaired, and auditable civic action.
