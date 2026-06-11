import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  IndianRupee,
  Landmark,
  MapPin,
  ShieldAlert,
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
type AuditStatus = "Clear" | "Watchlist" | "Audit Required";

type RoadSpendRecord = {
  id: string;
  road: string;
  zone: string;
  authority: "PMC" | "PCMC" | "PWD Maharashtra";
  contractor: string;
  approvedCr: number;
  spentCr: number;
  healthScore: number;
  qualityScore: number;
  repeatRepairs: number;
  complaints: number;
  status: AuditStatus;
  issue: string;
  action: string;
};

type MonthlyTrend = {
  month: string;
  approved: number;
  spent: number;
  verified: number;
  flagged: number;
};

type AuditFlag = {
  title: string;
  road: string;
  contractor: string;
  severity: Severity;
  evidence: string;
  recommendedAction: string;
};

const ROAD_SPENDING: RoadSpendRecord[] = [
  {
    id: "SP-001",
    road: "JM Road Patch Zone",
    zone: "Pune Central",
    authority: "PMC",
    contractor: "UrbanBuild Pune Services",
    approvedCr: 3.9,
    spentCr: 4.8,
    healthScore: 42,
    qualityScore: 58,
    repeatRepairs: 4,
    complaints: 17,
    status: "Audit Required",
    issue: "High spend but low road health and repeated patch failure.",
    action: "Hold further payment until repair quality verification.",
  },
  {
    id: "SP-002",
    road: "FC Road Junction",
    zone: "Pune Central",
    authority: "PMC",
    contractor: "UrbanBuild Pune Services",
    approvedCr: 2.7,
    spentCr: 3.1,
    healthScore: 56,
    qualityScore: 61,
    repeatRepairs: 2,
    complaints: 12,
    status: "Watchlist",
    issue: "Budget overrun with medium road-health recovery.",
    action: "Require drainage inspection and before/after repair proof.",
  },
  {
    id: "SP-003",
    road: "Wakad-Hinjewadi Road",
    zone: "PCMC Corridor",
    authority: "PCMC",
    contractor: "Maharashtra RoadBuild Ltd.",
    approvedCr: 6.2,
    spentCr: 6.7,
    healthScore: 61,
    qualityScore: 76,
    repeatRepairs: 2,
    complaints: 9,
    status: "Watchlist",
    issue: "Moderate overrun with commuter-load deterioration.",
    action: "Schedule resurfacing inspection and monitor peak-hour damage.",
  },
  {
    id: "SP-004",
    road: "Baner Link Road",
    zone: "Pune West",
    authority: "PMC",
    contractor: "Shivneri Infra Works",
    approvedCr: 4.8,
    spentCr: 4.6,
    healthScore: 72,
    qualityScore: 92,
    repeatRepairs: 1,
    complaints: 6,
    status: "Clear",
    issue: "Good budget discipline and stable road quality.",
    action: "Continue preventive maintenance cycle.",
  },
  {
    id: "SP-005",
    road: "Katraj Bypass",
    zone: "Pune South",
    authority: "PWD Maharashtra",
    contractor: "QuickPatch Civil Works",
    approvedCr: 2.7,
    spentCr: 3.4,
    healthScore: 66,
    qualityScore: 49,
    repeatRepairs: 1,
    complaints: 5,
    status: "Audit Required",
    issue: "Budget overrun and weak contractor quality score.",
    action: "Review material quality and drainage repair bill before approval.",
  },
  {
    id: "SP-006",
    road: "Ravet BRT Service Road",
    zone: "PCMC Corridor",
    authority: "PCMC",
    contractor: "PCMC Infra Maintenance",
    approvedCr: 5.1,
    spentCr: 4.9,
    healthScore: 81,
    qualityScore: 86,
    repeatRepairs: 0,
    complaints: 2,
    status: "Clear",
    issue: "Healthy road condition with verified maintenance discipline.",
    action: "Keep under routine inspection.",
  },
];

const MONTHLY_TREND: MonthlyTrend[] = [
  { month: "Nov", approved: 4.1, spent: 3.8, verified: 3.2, flagged: 0.4 },
  { month: "Dec", approved: 6.2, spent: 6.4, verified: 4.8, flagged: 0.7 },
  { month: "Jan", approved: 8.4, spent: 9.1, verified: 6.5, flagged: 1.2 },
  { month: "Feb", approved: 10.7, spent: 12.2, verified: 8.1, flagged: 1.9 },
  { month: "Mar", approved: 13.5, spent: 14.9, verified: 10.3, flagged: 2.4 },
  { month: "Apr", approved: 15.4, spent: 17.5, verified: 12.1, flagged: 3.1 },
];

const AUDIT_FLAGS: AuditFlag[] = [
  {
    title: "Budget-quality mismatch",
    road: "JM Road Patch Zone",
    contractor: "UrbanBuild Pune Services",
    severity: "critical",
    evidence:
      "₹4.8 Cr spent against ₹3.9 Cr approved, but road health remains 42/100 with 4 repeat repairs.",
    recommendedAction:
      "Escalate for field verification and freeze additional payment until repair proof is submitted.",
  },
  {
    title: "Weak contractor quality",
    road: "Katraj Bypass",
    contractor: "QuickPatch Civil Works",
    severity: "high",
    evidence:
      "Spending exceeded approved budget by 25.9% while contractor quality score is only 49/100.",
    recommendedAction:
      "Review bill items, material quality and drainage scope before new work allocation.",
  },
  {
    title: "Repeat-repair pattern",
    road: "FC Road Junction",
    contractor: "UrbanBuild Pune Services",
    severity: "medium",
    evidence:
      "Two repeat repairs and 12 complaints indicate preventive maintenance was not fully effective.",
    recommendedAction:
      "Require before/after photo proof and drainage inspection report.",
  },
];

function formatCr(value: number) {
  return `₹${value.toFixed(1)} Cr`;
}

function getOverrunPercent(record: RoadSpendRecord) {
  return ((record.spentCr - record.approvedCr) / record.approvedCr) * 100;
}

function getTotalApproved() {
  return ROAD_SPENDING.reduce((total, item) => total + item.approvedCr, 0);
}

function getTotalSpent() {
  return ROAD_SPENDING.reduce((total, item) => total + item.spentCr, 0);
}

function getVerifiedSpend() {
  return ROAD_SPENDING.filter((item) => item.status === "Clear").reduce(
    (total, item) => total + item.spentCr,
    0,
  );
}

function getFlaggedSpend() {
  return ROAD_SPENDING.filter((item) => item.status !== "Clear").reduce(
    (total, item) => total + item.spentCr,
    0,
  );
}

function getSeverityColor(severity: Severity) {
  if (severity === "critical") return "#DC2626";
  if (severity === "high") return "#F97316";
  if (severity === "medium") return "#F59E0B";
  return "#16A34A";
}

function getStatusMeta(status: AuditStatus) {
  if (status === "Clear") {
    return {
      color: "#16A34A",
      bg: "rgba(22,163,74,0.12)",
      border: "rgba(22,163,74,0.28)",
      icon: CheckCircle2,
    };
  }

  if (status === "Watchlist") {
    return {
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.28)",
      icon: AlertTriangle,
    };
  }

  return {
    color: "#DC2626",
    bg: "rgba(220,38,38,0.12)",
    border: "rgba(220,38,38,0.28)",
    icon: ShieldAlert,
  };
}

function getScoreColor(score: number) {
  if (score >= 80) return "#16A34A";
  if (score >= 65) return "#0EA5A4";
  if (score >= 50) return "#F59E0B";
  return "#DC2626";
}

function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  color: string;
}) {
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
          style={{ background: `${color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>

        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{ background: `${color}14`, color }}
        >
          Pilot
        </span>
      </div>

      <div
        className="text-2xl font-bold"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {value}
      </div>

      <div className="mt-1 text-sm font-medium">{label}</div>
      <div className="mt-1 text-xs text-muted-foreground">{note}</div>
    </div>
  );
}

function StatusPill({ status }: { status: AuditStatus }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        color: meta.color,
      }}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const safeValue = Math.max(0, Math.min(100, value));
  const color = getScoreColor(safeValue);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold" style={{ color }}>
          {safeValue}/100
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--border))" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${safeValue}%`, background: color }}
        />
      </div>
    </div>
  );
}

function SpendingCard({ record }: { record: RoadSpendRecord }) {
  const meta = getStatusMeta(record.status);
  const Icon = meta.icon;
  const overrun = getOverrunPercent(record);
  const overrunPositive = overrun > 0;

  return (
    <article
      className="rounded-3xl p-5"
      style={{
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{record.id}</p>

          <h3
            className="mt-1 text-xl font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {record.road}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {record.zone} · {record.authority}
          </p>
        </div>

        <StatusPill status={record.status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniMetric
          label="Approved"
          value={formatCr(record.approvedCr)}
          color="#0EA5A4"
        />
        <MiniMetric
          label="Spent"
          value={formatCr(record.spentCr)}
          color={overrunPositive ? "#F97316" : "#16A34A"}
        />
        <MiniMetric
          label="Variance"
          value={`${overrunPositive ? "+" : ""}${overrun.toFixed(1)}%`}
          color={overrunPositive ? "#DC2626" : "#16A34A"}
        />
      </div>

      <div className="mt-5 space-y-4">
        <ScoreBar label="Road Health After Spending" value={record.healthScore} />
        <ScoreBar label="Contractor Quality" value={record.qualityScore} />
      </div>

      <div
        className="mt-5 rounded-2xl p-4"
        style={{
          background: meta.bg,
          border: `1px solid ${meta.border}`,
        }}
      >
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: meta.color }} />

          <div>
            <p className="text-sm font-semibold" style={{ color: meta.color }}>
              Transparency Finding
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {record.issue}
            </p>

            <p className="mt-3 text-xs font-semibold">Recommended Action</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {record.action}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span
          className="rounded-full px-2.5 py-1"
          style={{
            background: "hsl(var(--muted))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          Contractor: {record.contractor}
        </span>

        <span
          className="rounded-full px-2.5 py-1"
          style={{
            background: "hsl(var(--muted))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          Complaints: {record.complaints}
        </span>

        <span
          className="rounded-full px-2.5 py-1"
          style={{
            background: "hsl(var(--muted))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          Repeat Repairs: {record.repeatRepairs}
        </span>
      </div>
    </article>
  );
}

function MiniMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function AuditFlagCard({ flag }: { flag: AuditFlag }) {
  const color = getSeverityColor(flag.severity);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: `1px solid ${color}30`,
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{flag.title}</h3>

        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
          style={{
            background: `${color}18`,
            color,
          }}
        >
          {flag.severity}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        {flag.road} · {flag.contractor}
      </p>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">Evidence: </span>
        {flag.evidence}
      </p>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">Action: </span>
        {flag.recommendedAction}
      </p>
    </div>
  );
}

export default function Spending() {
  const totalApproved = getTotalApproved();
  const totalSpent = getTotalSpent();
  const verifiedSpend = getVerifiedSpend();
  const flaggedSpend = getFlaggedSpend();
  const budgetVariance = ((totalSpent - totalApproved) / totalApproved) * 100;

  const auditRequired = ROAD_SPENDING.filter(
    (item) => item.status === "Audit Required",
  ).length;

  const avgHealth = Math.round(
    ROAD_SPENDING.reduce((total, item) => total + item.healthScore, 0) /
      ROAD_SPENDING.length,
  );

  const chartData = ROAD_SPENDING.map((item) => ({
    road: item.road.replace(" Road", "").replace(" Patch Zone", ""),
    spent: item.spentCr,
    health: item.healthScore,
    quality: item.qualityScore,
    status: item.status,
  }));

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
              <Landmark className="h-3.5 w-3.5" />
              Public Spending Transparency
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Road Spending Accountability
            </h1>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
              Track approved budget, actual spending, road health, contractor
              quality and repeat-repair patterns. The goal is simple: citizens
              should see whether public money is improving road quality.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 xl:min-w-[280px]"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <p className="text-xs text-muted-foreground">
              Budget Variance Across Pilot Roads
            </p>

            <div
              className="mt-1 text-4xl font-bold"
              style={{
                color: budgetVariance > 0 ? "#F97316" : "#16A34A",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {budgetVariance > 0 ? "+" : ""}
              {budgetVariance.toFixed(1)}%
            </div>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Positive variance means actual spending is higher than approved
              pilot budget.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Approved Budget"
          value={formatCr(totalApproved)}
          note="Pilot-road approved allocation"
          icon={Wallet}
          color="#0EA5A4"
        />

        <KpiCard
          label="Actual Spending"
          value={formatCr(totalSpent)}
          note="Tracked contractor usage"
          icon={IndianRupee}
          color="#F59E0B"
        />

        <KpiCard
          label="Flagged Spending"
          value={formatCr(flaggedSpend)}
          note={`${auditRequired} roads require audit`}
          icon={ShieldAlert}
          color="#DC2626"
        />

        <KpiCard
          label="Avg Road Health"
          value={`${avgHealth}/100`}
          note={`${formatCr(verifiedSpend)} linked to clear cases`}
          icon={TrendingDown}
          color="#3B82F6"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
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
              Approved vs Spent Trend
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Monthly pilot spending trend. Flagged spend means money connected
              to roads with weak health, repeat repairs or low contractor score.
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND}>
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
                  dataKey="approved"
                  name="Approved ₹Cr"
                  stroke="#0EA5A4"
                  fill="rgba(14,165,164,0.14)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  name="Spent ₹Cr"
                  stroke="#F59E0B"
                  fill="rgba(245,158,11,0.14)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="flagged"
                  name="Flagged ₹Cr"
                  stroke="#DC2626"
                  fill="rgba(220,38,38,0.12)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
          className="rounded-3xl p-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Audit Flags
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Clear, evidence-based flags instead of vague corruption claims.
          </p>

          <div className="mt-4 space-y-3">
            {AUDIT_FLAGS.map((flag) => (
              <AuditFlagCard key={flag.title} flag={flag} />
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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
              Spending vs Road Health
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              This is the main transparency check: high spend should result in
              better road health. If not, the road needs review.
            </p>
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
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
                  {chartData.map((item) => (
                    <Cell
                      key={item.road}
                      fill={
                        item.status === "Audit Required"
                          ? "#DC2626"
                          : item.status === "Watchlist"
                            ? "#F59E0B"
                            : "#0EA5A4"
                      }
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
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
          className="rounded-3xl p-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Transparency Method
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            RoadIntel checks whether public spending creates visible road
            improvement.
          </p>

          <div className="mt-4 space-y-3">
            <MethodCard
              icon={Wallet}
              title="1. Compare budget vs spend"
              text="Every road shows approved budget and actual spending."
              color="#0EA5A4"
            />
            <MethodCard
              icon={TrendingDown}
              title="2. Compare spend vs health"
              text="High spending with low health score becomes a review signal."
              color="#3B82F6"
            />
            <MethodCard
              icon={Users}
              title="3. Link contractor performance"
              text="Road quality is connected to contractor score and repeat repair count."
              color="#F59E0B"
            />
            <MethodCard
              icon={ClipboardCheck}
              title="4. Recommend action"
              text="The page shows whether to verify, monitor or audit the work."
              color="#16A34A"
            />
          </div>
        </section>
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Road-Wise Spending Records
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Mobile-friendly scorecards showing money, quality and audit
              status for each pilot road.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/contractors">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15">
                Review Contractors
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>

            <Link href="/complaints">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white">
                File Complaint
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {ROAD_SPENDING.map((record) => (
            <SpendingCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.10), rgba(59,130,246,0.06), hsl(var(--card)))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />

          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Audit-Safe Data Note
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This page uses realistic Pune / PCMC pilot-style demo data to show
              the RoadWatch transparency workflow. It does not claim connection
              to official live government payment systems. The purpose is to
              demonstrate how public spending, road quality and contractor
              accountability can be connected in one explainable platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MethodCard({
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
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}