import { Link } from "wouter";
import {
  Activity,
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
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  {
    road: "Ravet",
    approved: 5.1,
    spent: 4.9,
    health: 81,
    status: "Clear",
  },
];

const CONTRACTOR_SIGNALS: ContractorSignal[] = [
  {
    contractor: "Shivneri Infra",
    ras: 91,
    quality: 92,
    repeatFailure: 5,
    status: "Strong",
  },
  {
    contractor: "PCMC Infra",
    ras: 86,
    quality: 86,
    repeatFailure: 9,
    status: "Strong",
  },
  {
    contractor: "MahaRoad",
    ras: 76,
    quality: 76,
    repeatFailure: 15,
    status: "Watchlist",
  },
  {
    contractor: "UrbanBuild",
    ras: 58,
    quality: 58,
    repeatFailure: 31,
    status: "Audit Required",
  },
  {
    contractor: "QuickPatch",
    ras: 52,
    quality: 49,
    repeatFailure: 38,
    status: "Audit Required",
  },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  {
    title: "Critical road risk detected",
    location: "JM Road Patch Zone",
    time: "Demo signal",
    severity: "critical",
    description:
      "Road health dropped to 42/100 while spending crossed approved budget.",
  },
  {
    title: "Complaint routed to PMC",
    location: "FC Road Junction",
    time: "Demo signal",
    severity: "high",
    description:
      "Pothole and cracking complaint assigned to PMC Roads Department.",
  },
  {
    title: "Contractor audit flag created",
    location: "Pune Central",
    time: "Demo signal",
    severity: "high",
    description:
      "UrbanBuild shows repeated patch failures and budget-quality mismatch.",
  },
  {
    title: "Verified repair pattern identified",
    location: "Baner Link Road",
    time: "Demo signal",
    severity: "low",
    description:
      "Good road health and budget discipline marked as clear case.",
  },
];

const QUICK_ACTIONS = [
  {
    title: "File Road Complaint",
    text: "Report potholes, cracks, waterlogging or unsafe road conditions.",
    href: "/complaints",
    icon: ClipboardList,
    color: "#3B82F6",
  },
  {
    title: "Scan Road Image",
    text: "Use demo classifier for pothole, crack or waterlogging detection.",
    href: "/scan",
    icon: ScanLine,
    color: "#0EA5A4",
  },
  {
    title: "Check Public Spending",
    text: "Compare approved budget, actual spend and road quality.",
    href: "/spending",
    icon: Wallet,
    color: "#F59E0B",
  },
  {
    title: "Review Contractors",
    text: "Check Road Accountability Score and audit-risk contractors.",
    href: "/contractors",
    icon: Users,
    color: "#16A34A",
  },
];

function getSeverityColor(severity: Severity) {
  if (severity === "critical") return "#DC2626";
  if (severity === "high") return "#F97316";
  if (severity === "medium") return "#F59E0B";
  return "#16A34A";
}

function getScoreColor(score: number) {
  if (score >= 80) return "#16A34A";
  if (score >= 65) return "#0EA5A4";
  if (score >= 50) return "#F59E0B";
  return "#DC2626";
}

function getStatusColor(status: SpendingCheck["status"] | ContractorSignal["status"]) {
  if (status === "Audit Required") return "#DC2626";
  if (status === "Watchlist") return "#F59E0B";
  return "#16A34A";
}

function KpiCard({ item }: { item: Kpi }) {
  const Icon = item.icon;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${item.color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color: item.color }} />
        </div>

        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{
            background: `${item.color}14`,
            color: item.color,
          }}
        >
          Pilot
        </span>
      </div>

      <div
        className="text-2xl font-bold"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {item.value}
      </div>

      <div className="mt-1 text-sm font-medium">{item.label}</div>
      <div className="mt-1 text-xs text-muted-foreground">{item.note}</div>
    </div>
  );
}

function SectionCard({
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

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const color = getScoreColor(value);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold" style={{ color }}>
          {value}/100
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--border))" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

function SeverityPill({ severity }: { severity: Severity }) {
  const color = getSeverityColor(severity);

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {severity}
    </span>
  );
}

function RoadPriorityCard({ road }: { road: RoadPriority }) {
  const color = getSeverityColor(road.severity);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: `1px solid ${color}30`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] text-muted-foreground">
            {road.id}
          </p>

          <h3 className="mt-1 font-semibold">{road.road}</h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {road.zone} · {road.authority}
          </p>
        </div>

        <SeverityPill severity={road.severity} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ScoreBar label="Risk Score" value={road.risk} />
        <ScoreBar label="Road Health" value={road.health} />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">Why: </span>
        {road.reason}
      </p>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">Action: </span>
        {road.action}
      </p>
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  const color = getSeverityColor(activity.severity);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: `1px solid ${color}28`,
      }}
    >
      <div className="flex items-start gap-3">
        {activity.severity === "low" ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        ) : (
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color }}
          />
        )}

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{activity.title}</h3>
            <SeverityPill severity={activity.severity} />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {activity.location} · {activity.time}
          </p>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {activity.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  text,
  href,
  icon: Icon,
  color,
}: {
  title: string;
  text: string;
  href: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Link href={href}>
      <button
        type="button"
        className="group w-full rounded-3xl p-5 text-left transition hover:-translate-y-0.5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: `${color}18` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
        </div>

        <h3
          className="font-semibold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          {title}
        </h3>

        <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
      </button>
    </Link>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <section
        className="overflow-hidden rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.20), rgba(59,130,246,0.10), hsl(var(--card)))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(14,165,164,0.14)",
                color: "#0EA5A4",
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              RoadWatch Transparency Command Center
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              RoadIntel Dashboard
            </h1>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
              Monitor road quality, track public spending, report issues to
              responsible authorities and review contractor accountability from
              one RoadWatch-focused dashboard.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 xl:min-w-[300px]"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Audit-safe pilot data
            </div>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Pune / PCMC demo dataset. No fake live government feed. Built to
              show transparent civic workflow and future integration potential.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_DATA.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Complaint Lifecycle"
          subtitle="Filed, resolved and escalated complaints across the pilot window."
        >
          <div className="h-[310px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COMPLAINT_TREND}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="filed"
                  name="Filed"
                  stroke="#0EA5A4"
                  fill="rgba(14,165,164,0.14)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#16A34A"
                  fill="rgba(22,163,74,0.14)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="escalated"
                  name="Escalated"
                  stroke="#F59E0B"
                  fill="rgba(245,158,11,0.14)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Transparency Signals"
          subtitle="Decision-relevant updates only. No fake live claims."
        >
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((activity) => (
              <ActivityCard key={activity.title} activity={activity} />
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Road Health vs Risk"
          subtitle="Road health should improve while risk decreases. Divergence indicates review need."
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={HEALTH_RISK_TREND}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="health"
                  name="Road Health"
                  fill="#0EA5A4"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  name="Risk Score"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Spending vs Road Health"
          subtitle="This is the main transparency check: spending should improve road quality."
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SPENDING_CHECKS}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="road" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="spent"
                  name="Spent ₹Cr"
                  radius={[6, 6, 0, 0]}
                >
                  {SPENDING_CHECKS.map((item) => (
                    <Cell
                      key={item.road}
                      fill={getStatusColor(item.status)}
                    />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="health"
                  name="Road Health"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          title="Priority Road Actions"
          subtitle="Roads ranked by risk, road health and accountability requirement."
        >
          <div className="space-y-3">
            {ROAD_PRIORITIES.map((road) => (
              <RoadPriorityCard key={road.id} road={road} />
            ))}
          </div>

          <div className="mt-4">
            <Link href="/risk-map">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15">
                Open Full Risk Map
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </SectionCard>

        <SectionCard
          title="Contractor Accountability Snapshot"
          subtitle="Road Accountability Score links quality, timeliness, budget discipline and repeat failures."
        >
          <div className="space-y-4">
            {CONTRACTOR_SIGNALS.map((contractor) => {
              const statusColor = getStatusColor(contractor.status);

              return (
                <div
                  key={contractor.contractor}
                  className="rounded-2xl p-4"
                  style={{
                    background: "hsl(var(--muted))",
                    border: `1px solid ${statusColor}30`,
                  }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">
                        {contractor.contractor}
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Repeat failure: {contractor.repeatFailure}%
                      </p>
                    </div>

                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                      style={{
                        background: `${statusColor}18`,
                        color: statusColor,
                      }}
                    >
                      {contractor.status}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <ScoreBar label="RAS" value={contractor.ras} />
                    <ScoreBar label="Quality" value={contractor.quality} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Link href="/contractors">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15">
                Review Contractors
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </SectionCard>
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.10), rgba(59,130,246,0.06), hsl(var(--card)))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <DashboardPrinciple
            icon={Map}
            title="Monitor Quality"
            text="Road DNA profiles show condition, health score and repair history."
            color="#0EA5A4"
          />
          <DashboardPrinciple
            icon={Landmark}
            title="Route Authority"
            text="Complaints are mapped to PMC, PCMC, PWD or highway authority."
            color="#3B82F6"
          />
          <DashboardPrinciple
            icon={IndianRupee}
            title="Track Spending"
            text="Budget usage is compared with road quality and repair outcomes."
            color="#F59E0B"
          />
          <DashboardPrinciple
            icon={Radio}
            title="Plan Integration"
            text="Sensor Intel is clearly shown as simulated digital twin data."
            color="#16A34A"
          />
        </div>
      </section>

      <section
        className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-5"
      >
        <div className="flex items-start gap-3">
          <BarChart3 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />

          <div>
            <h2
              className="font-semibold text-emerald-100"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              RoadWatch Dashboard Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-emerald-100/80">
              This dashboard is designed to make transparency immediately
              visible after login: road condition, citizen complaints, public
              spending, contractor accountability and risk prediction are all
              connected in one place.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardPrinciple({
  icon: Icon,
  title,
  text,
  color,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: `${color}18` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>

      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}