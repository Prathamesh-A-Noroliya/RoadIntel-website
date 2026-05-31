import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
  IndianRupee,
  Landmark,
  MapPin,
  Radio,
  Route,
  ScanLine,
  ShieldCheck,
  TrendingDown,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { NetworkStatusCard } from "@/components/offline/NetworkStatusCard";
import { OfflineReportsList } from "@/components/offline/OfflineReportsList";

type Severity = "critical" | "high" | "medium" | "low";

type Kpi = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  color: string;
};

type RoadPriority = {
  id: string;
  road: string;
  zone: string;
  authority: string;
  risk: number;
  health: number;
  severity: Severity;
  reason: string;
  action: string;
};

type ActivityItem = {
  title: string;
  location: string;
  time: string;
  severity: Severity;
  description: string;
};

type SpendingCheck = {
  road: string;
  approved: number;
  spent: number;
  health: number;
  status: "Clear" | "Watchlist" | "Audit Required";
};

type ContractorSignal = {
  contractor: string;
  ras: number;
  quality: number;
  repeatFailure: number;
  status: "Strong" | "Watchlist" | "Audit Required";
};

const KPI_DATA: Kpi[] = [
  {
    label: "Roads Monitored",
    value: "8",
    note: "Pune / PCMC pilot roads",
    icon: Route,
    color: "#0EA5A4",
  },
  {
    label: "Complaint Signals",
    value: "220",
    note: "Filed, routed and reviewed",
    icon: FileText,
    color: "#3B82F6",
  },
  {
    label: "Spending Tracked",
    value: "₹27.5Cr",
    note: "Approved vs actual spend",
    icon: IndianRupee,
    color: "#F59E0B",
  },
  {
    label: "Audit Flags",
    value: "3",
    note: "Roads needing review",
    icon: AlertTriangle,
    color: "#DC2626",
  },
];

const COMPLAINT_TREND = [
  { month: "Nov", filed: 21, resolved: 12, escalated: 2 },
  { month: "Dec", filed: 28, resolved: 17, escalated: 3 },
  { month: "Jan", filed: 36, resolved: 24, escalated: 4 },
  { month: "Feb", filed: 44, resolved: 31, escalated: 6 },
  { month: "Mar", filed: 49, resolved: 35, escalated: 5 },
  { month: "Apr", filed: 42, resolved: 30, escalated: 4 },
];

const HEALTH_RISK_TREND = [
  { month: "Nov", health: 78, risk: 34 },
  { month: "Dec", health: 76, risk: 39 },
  { month: "Jan", health: 72, risk: 47 },
  { month: "Feb", health: 68, risk: 55 },
  { month: "Mar", health: 71, risk: 49 },
  { month: "Apr", health: 74, risk: 43 },
];

const ROAD_PRIORITIES: RoadPriority[] = [
  {
    id: "RISK-001",
    road: "JM Road Patch Zone",
    zone: "Pune Central",
    authority: "PMC",
    risk: 86,
    health: 42,
    severity: "critical",
    reason: "High complaint density, low road health and repeated patch failure.",
    action: "Inspect within 24 hours and review contractor repair quality.",
  },
  {
    id: "RISK-002",
    road: "FC Road Junction",
    zone: "Pune Central",
    authority: "PMC",
    risk: 74,
    health: 56,
    severity: "high",
    reason: "Cracking and drainage stress near a high-traffic commercial area.",
    action: "Schedule drainage inspection and crack sealing.",
  },
  {
    id: "RISK-003",
    road: "Wakad-Hinjewadi Road",
    zone: "PCMC Corridor",
    authority: "PCMC",
    risk: 68,
    health: 61,
    severity: "high",
    reason: "Heavy commuter load and edge deterioration signals.",
    action: "Plan resurfacing inspection and monitor vibration spikes.",
  },
];

const SPENDING_CHECKS: SpendingCheck[] = [
  {
    road: "JM Road",
    approved: 3.9,
    spent: 4.8,
    health: 42,
    status: "Audit Required",
  },
  {
    road: "FC Road",
    approved: 2.7,
    spent: 3.1,
    health: 56,
    status: "Watchlist",
  },
  {
    road: "Hinjewadi",
    approved: 6.2,
    spent: 6.7,
    health: 61,
    status: "Watchlist",
  },
  {
    road: "Baner",
    approved: 4.8,
    spent: 4.6,
    health: 72,
    status: "Clear",
  },
];

const CONTRACTOR_SIGNALS: ContractorSignal[] = [
  {
    contractor: "Urban Infra Works",
    ras: 91,
    quality: 88,
    repeatFailure: 2,
    status: "Strong",
  },
  {
    contractor: "Metro Patch Systems",
    ras: 69,
    quality: 64,
    repeatFailure: 8,
    status: "Watchlist",
  },
  {
    contractor: "Civic Roadcare",
    ras: 52,
    quality: 49,
    repeatFailure: 13,
    status: "Audit Required",
  },
];

const LIVE_ACTIVITY: ActivityItem[] = [
  {
    title: "Pothole report routed",
    location: "FC Road Junction",
    time: "12 min ago",
    severity: "high",
    description: "Citizen report assigned to PMC Roads Department.",
  },
  {
    title: "Repair evidence verified",
    location: "Ravet BRT Service Road",
    time: "38 min ago",
    severity: "medium",
    description: "Before-after evidence matched and case marked verified.",
  },
  {
    title: "Contractor quality flag raised",
    location: "JM Road Patch Zone",
    time: "1 hr ago",
    severity: "critical",
    description: "Repeat failure detected after recent repair closure.",
  },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#DC2626",
  high: "#F97316",
  medium: "#F59E0B",
  low: "#16A34A",
};

function MetricCard({ label, value, note, icon: Icon, color }: Kpi) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: `${color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>

        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
          style={{ background: `${color}14`, color }}
        >
          Pilot
        </span>
      </div>

      <p
        className="text-2xl font-bold"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold">{label}</p>

      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const color = SEVERITY_COLORS[severity];

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isGood = status === "Clear" || status === "Strong";
  const isWarning = status === "Watchlist";
  const color = isGood ? "#16A34A" : isWarning ? "#F59E0B" : "#DC2626";

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {status}
    </span>
  );
}

function DashboardCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl p-5"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-4">
        <h2
          className="font-semibold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          {title}
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {children}
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <section
        className="overflow-hidden rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.20), rgba(59,130,246,0.12), hsl(var(--card)))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase"
              style={{
                background: "rgba(14,165,164,0.14)",
                color: "#0EA5A4",
              }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              RoadIntel Civic Command Dashboard
            </div>

            <h1
              className="max-w-4xl text-2xl font-bold md:text-4xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Monitor, verify, assign, repair and prove road safety action.
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              RoadIntel combines citizen reports, repair tracking, spending
              visibility and contractor accountability into one civic road
              intelligence dashboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/complaints"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
            >
              <ClipboardList className="h-4 w-4" />
              File Complaint
            </Link>

            <Link
              href="/scan"
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold"
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <ScanLine className="h-4 w-4" />
              Scan Road
            </Link>
          </div>
        </div>
      </section>

      <NetworkStatusCard />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_DATA.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardCard
          title="Complaint Resolution Trend"
          subtitle="Filed, resolved and escalated complaint movement across the pilot months."
        >
          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={COMPLAINT_TREND}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="filed" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar
                  dataKey="resolved"
                  fill="#16A34A"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="escalated"
                  stroke="#DC2626"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Road Health vs Risk"
          subtitle="Lower health and rising risk indicate roads needing early intervention."
        >
          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEALTH_RISK_TREND}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="health"
                  stroke="#0EA5A4"
                  fill="#0EA5A4"
                  fillOpacity={0.18}
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#F97316"
                  fill="#F97316"
                  fillOpacity={0.16}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardCard
          title="Priority Roads"
          subtitle="Road DNA risk scoring highlights where inspection or repair should happen first."
        >
          <div className="space-y-4">
            {ROAD_PRIORITIES.map((road) => (
              <div
                key={road.id}
                className="rounded-2xl p-4"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {road.id}
                      </span>
                      <SeverityBadge severity={road.severity} />
                    </div>

                    <h3 className="mt-2 font-bold">{road.road}</h3>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {road.zone} · {road.authority}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {road.reason}
                    </p>
                  </div>

                  <div className="grid min-w-[180px] grid-cols-2 gap-2 text-center">
                    <div className="rounded-2xl bg-red-500/10 p-3">
                      <p className="text-xl font-bold text-red-400">
                        {road.risk}
                      </p>
                      <p className="text-xs text-muted-foreground">Risk</p>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/10 p-3">
                      <p className="text-xl font-bold text-emerald-400">
                        {road.health}
                      </p>
                      <p className="text-xs text-muted-foreground">Health</p>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 rounded-2xl p-3 text-sm"
                  style={{
                    background: "rgba(14,165,164,0.08)",
                    border: "1px solid rgba(14,165,164,0.18)",
                  }}
                >
                  <span className="font-semibold text-teal-400">
                    Suggested action:
                  </span>{" "}
                  <span className="text-muted-foreground">{road.action}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Live Civic Activity"
          subtitle="Recent RoadIntel actions from citizen reports and repair verification."
        >
          <div className="space-y-4">
            {LIVE_ACTIVITY.map((item) => (
              <div
                key={`${item.title}-${item.time}`}
                className="rounded-2xl p-4"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.location}
                    </p>
                  </div>

                  <SeverityBadge severity={item.severity} />
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          title="Public Spending Verification"
          subtitle="Compares approved budget, actual spend and resulting road health."
        >
          <div className="space-y-3">
            {SPENDING_CHECKS.map((item) => (
              <div
                key={item.road}
                className="grid gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_auto]"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.road}</h3>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Approved</p>
                      <p className="font-bold">₹{item.approved}Cr</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Spent</p>
                      <p className="font-bold">₹{item.spent}Cr</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Health</p>
                      <p className="font-bold">{item.health}/100</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Wallet className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Contractor Accountability"
          subtitle="Repair Accountability Score combines quality, delay and repeat-failure signals."
        >
          <div className="space-y-3">
            {CONTRACTOR_SIGNALS.map((item) => (
              <div
                key={item.contractor}
                className="rounded-2xl p-4"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{item.contractor}</h3>
                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-blue-500/10 p-3">
                    <p className="text-lg font-bold text-blue-400">
                      {item.ras}
                    </p>
                    <p className="text-xs text-muted-foreground">RAS</p>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/10 p-3">
                    <p className="text-lg font-bold text-emerald-400">
                      {item.quality}
                    </p>
                    <p className="text-xs text-muted-foreground">Quality</p>
                  </div>

                  <div className="rounded-2xl bg-red-500/10 p-3">
                    <p className="text-lg font-bold text-red-400">
                      {item.repeatFailure}
                    </p>
                    <p className="text-xs text-muted-foreground">Repeat</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/risk-map"
          className="group rounded-3xl p-5 transition hover:scale-[1.01]"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <BarChart3 className="mb-4 h-6 w-6 text-blue-400" />
          <h3 className="font-bold">Open Risk Intelligence</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            View Road DNA scoring and risk prioritization.
          </p>
          <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/spending"
          className="group rounded-3xl p-5 transition hover:scale-[1.01]"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <Landmark className="mb-4 h-6 w-6 text-yellow-400" />
          <h3 className="font-bold">Track Public Spending</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Compare budgets, repairs and road quality.
          </p>
          <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
        </Link>

        <Link
          href="/sensors"
          className="group rounded-3xl p-5 transition hover:scale-[1.01]"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <Radio className="mb-4 h-6 w-6 text-teal-400" />
          <h3 className="font-bold">Sensor Signals</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor vibration, surface and inspection signals.
          </p>
          <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </section>

      <OfflineReportsList />
    </div>
  );
}