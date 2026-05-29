import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  IndianRupee,
  Landmark,
  Map,
  MapPin,
  Radio,
  Route,
  ScanLine,
  Shield,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Stat = {
  value: string;
  label: string;
  note: string;
  icon: LucideIcon;
  color: string;
};

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
};

type Workflow = {
  step: string;
  title: string;
  desc: string;
};

type Requirement = {
  title: string;
  roadwatchNeed: string;
  roadintelFeature: string;
  icon: LucideIcon;
  color: string;
};

const PILOT_STATS: Stat[] = [
  {
    value: "8",
    label: "Pilot Roads",
    note: "Pune / PCMC sample network",
    icon: Map,
    color: "#0EA5A4",
  },
  {
    value: "220",
    label: "Complaint Signals",
    note: "Filed, routed and reviewed",
    icon: FileText,
    color: "#3B82F6",
  },
  {
    value: "₹24.3Cr",
    label: "Budget Visibility",
    note: "Approved vs used comparison",
    icon: IndianRupee,
    color: "#F59E0B",
  },
  {
    value: "5",
    label: "Contractors Scored",
    note: "RAS accountability model",
    icon: Users,
    color: "#16A34A",
  },
];

const ROADWATCH_REQUIREMENTS: Requirement[] = [
  {
    title: "Monitor Road Quality",
    roadwatchNeed: "Citizens need a simple way to understand road condition.",
    roadintelFeature: "Road DNA, health score, risk score and repair history.",
    icon: Map,
    color: "#0EA5A4",
  },
  {
    title: "Track Public Spending",
    roadwatchNeed: "Public money spent on roads should be visible.",
    roadintelFeature: "Approved budget, actual spend and road-health comparison.",
    icon: IndianRupee,
    color: "#F59E0B",
  },
  {
    title: "Report Issues",
    roadwatchNeed: "Citizens should be able to report potholes and unsafe roads.",
    roadintelFeature: "Complaint filing, issue severity and progress timeline.",
    icon: ClipboardList,
    color: "#3B82F6",
  },
  {
    title: "Route to Authority",
    roadwatchNeed: "Complaints must reach the responsible department.",
    roadintelFeature: "PMC / PCMC / PWD / NHAI-MSRDC routing logic.",
    icon: Landmark,
    color: "#8B5CF6",
  },
];

const FEATURES: Feature[] = [
  {
    icon: Route,
    title: "Road DNA Registry",
    desc: "Each road has a condition profile with health score, risk score, complaint history, repair history, contractor details and recommended action.",
    color: "#0EA5A4",
  },
  {
    icon: FileText,
    title: "Citizen Complaint Routing",
    desc: "Road issues are filed with location, severity and issue type, then routed to the correct civic authority with visible status tracking.",
    color: "#3B82F6",
  },
  {
    icon: IndianRupee,
    title: "Public Spending Transparency",
    desc: "Approved budgets are compared with actual spending and road health to identify budget-quality mismatch and audit risk.",
    color: "#F59E0B",
  },
  {
    icon: Users,
    title: "Contractor Accountability",
    desc: "Contractors are scored using quality, timeliness, budget discipline, repeat failures and complaint recurrence.",
    color: "#16A34A",
  },
  {
    icon: TrendingDown,
    title: "Future Risk Map",
    desc: "RoadIntel highlights road segments likely to fail soon using complaint density, repair history, monsoon risk and road condition.",
    color: "#DC2626",
  },
  {
    icon: ScanLine,
    title: "Quick Scan Classifier",
    desc: "Demo road-image classifier identifies potholes, cracks, waterlogging and good road condition with suggested authority routing.",
    color: "#0EA5A4",
  },
];

const WORKFLOW: Workflow[] = [
  {
    step: "01",
    title: "Citizen reports or scans issue",
    desc: "A citizen files a pothole, crack, waterlogging or surface-damage complaint with location and description.",
  },
  {
    step: "02",
    title: "RoadIntel routes the issue",
    desc: "The platform maps the issue to PMC, PCMC, PWD or highway authority based on road ownership and severity.",
  },
  {
    step: "03",
    title: "Road DNA gets updated",
    desc: "Complaint history, health score, risk score, repair history and spending context become visible in one road profile.",
  },
  {
    step: "04",
    title: "Accountability is shown",
    desc: "Public spending, contractor quality and repeat-repair signals are reviewed to recommend the next civic action.",
  },
];

const AUDIT_POINTS = [
  "Transparency-first RoadWatch workflow",
  "Civic transparency platform",
  "No fake live government-data claims",
  "Pilot data clearly focused on Pune / PCMC",
  "Public spending linked with road quality",
  "Responsible authority routing included",
  "Contractor accountability included",
  "Mobile and desktop friendly structure",
];

export default function Landing() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(14,165,164,0.16), transparent 34%), radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 32%), #07111F",
      }}
    >
      <nav
        className="sticky top-0 z-50 border-b px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(7,17,31,0.88)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600">
              <Shield className="h-5 w-5 text-white" />
            </div>

            <div>
              <div
                className="text-lg font-bold text-white"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                RoadIntel
              </div>
              <div className="text-xs text-slate-400">
                RoadWatch Transparency Platform
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <a href="#roadwatch" className="transition hover:text-white">
              RoadWatch Fit
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#transparency" className="transition hover:text-white">
              Transparency
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
                Login
              </button>
            </Link>

            <Link href="/login">
              <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]">
                Open Demo
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Built for RoadWatch: quality, spending, reporting and transparency
                </div>

                <h1
                  className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  Make road maintenance{" "}
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    visible, measurable and accountable.
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                  RoadIntel helps citizens monitor road quality, report issues
                  to the right authority, track public spending, and understand
                  contractor accountability through one transparent civic
                  dashboard.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/login">
                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 transition hover:scale-[1.02]">
                      Launch RoadIntel Demo
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>

                  <a href="#roadwatch">
                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
                      View RoadWatch Alignment
                    </button>
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    Demo login: demo@roadintel.in
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    Password: demo123
                  </span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-300">
Transparency-first demo
                  </span>
                </div>
              </div>

              <div
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                      RoadIntel Pilot View
                    </p>
                    <h2
                      className="mt-1 text-xl font-bold text-white"
                      style={{ fontFamily: "Sora, sans-serif" }}
                    >
                      Transparency Dashboard
                    </h2>
                  </div>

                  <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Audit-safe demo
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {PILOT_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-3xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-2xl"
                          style={{ background: `${stat.color}18` }}
                        >
                          <stat.icon
                            className="h-5 w-5"
                            style={{ color: stat.color }}
                          />
                        </div>

                        <span className="text-[10px] font-semibold uppercase text-slate-500">
                          Pilot
                        </span>
                      </div>

                      <div
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "Sora, sans-serif" }}
                      >
                        {stat.value}
                      </div>

                      <div className="mt-1 text-sm font-semibold text-slate-200">
                        {stat.label}
                      </div>

                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        {stat.note}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Transparency-first design
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        Every important road question connects to visible data:
                        condition, complaint, authority, budget, contractor and
                        recommended action.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="roadwatch" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                <MapPin className="h-3.5 w-3.5" />
                RoadWatch Requirement Mapping
              </div>

              <h2
                className="text-3xl font-bold text-white sm:text-4xl"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Built around road transparency and public accountability.
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                RoadIntel focuses on the core civic requirement: monitor road
                quality, track public spending, report issues to responsible
                authorities, and increase infrastructure transparency.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {ROADWATCH_REQUIREMENTS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: `${item.color}18` }}
                  >
                    <item.icon
                      className="h-5 w-5"
                      style={{ color: item.color }}
                    />
                  </div>

                  <h3
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "Sora, sans-serif" }}
                  >
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Need
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.roadwatchNeed}
                  </p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    RoadIntel
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {item.roadintelFeature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <h2
                className="text-3xl font-bold text-white sm:text-4xl"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Core RoadIntel Modules
              </h2>

              <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Each module supports a practical transparency workflow for road
                quality, public spending and responsible authority action.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]"
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: `${feature.color}18` }}
                  >
                    <feature.icon
                      className="h-6 w-6"
                      style={{ color: feature.color }}
                    />
                  </div>

                  <h3
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "Sora, sans-serif" }}
                  >
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div
              className="rounded-[2rem] border border-white/10 p-6 sm:p-8 lg:p-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,165,164,0.10), rgba(59,130,246,0.07), rgba(255,255,255,0.03))",
              }}
            >
              <div className="mb-10 max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                  <Route className="h-3.5 w-3.5" />
                  Transparent Action Chain
                </div>

                <h2
                  className="text-3xl font-bold text-white sm:text-4xl"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  From citizen complaint to civic accountability.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  The workflow is intentionally simple to explain during demo:
                  issue reporting, authority routing, road profile update,
                  spending visibility and contractor accountability.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {WORKFLOW.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <div
                      className="mb-4 text-4xl font-black text-cyan-300"
                      style={{ fontFamily: "Sora, sans-serif" }}
                    >
                      {item.step}
                    </div>

                    <h3
                      className="text-base font-bold text-white"
                      style={{ fontFamily: "Sora, sans-serif" }}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="transparency" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Evaluation-ready principles
                </div>

                <h2
                  className="text-3xl font-bold text-white sm:text-4xl"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  Honest demo data. Clear civic impact. No paywall.
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  RoadIntel is presented as a working pilot prototype. It avoids
                  fake live-data claims and focuses on how the solution can be
                  integrated with real municipal APIs, GIS road ownership data
                  and field verification workflows later.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/login">
                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4 text-sm font-bold text-white transition hover:scale-[1.02]">
                      Enter Demo
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>

                  <a href="#features">
                    <button className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]">
                      Review Features
                    </button>
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {AUDIT_POINTS.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <p className="text-sm leading-6 text-slate-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/15">
              <Shield className="h-7 w-7 text-cyan-300" />
            </div>

            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Road infrastructure should be visible, measurable and accountable.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              RoadIntel shows how citizens, authorities and auditors can share
              one transparent view of road quality, public money, complaints and
              contractor performance.
            </p>

            <Link href="/login">
              <button className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]">
                Start RoadIntel Demo
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      <footer
        className="border-t px-4 py-8 text-center sm:px-6 lg:px-8"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
            <Shield className="h-4 w-4 text-white" />
          </div>

          <span
            className="font-bold text-white"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            RoadIntel
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Transparency-first RoadWatch platform by HackTech Novas.
        </p>

        <p className="mt-2 text-xs text-slate-600">
          Demo data is pilot-style and used for product demonstration only.
        </p>
      </footer>
    </div>
  );
}