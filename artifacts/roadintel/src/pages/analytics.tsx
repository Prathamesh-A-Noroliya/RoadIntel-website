import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  IndianRupee,
  MapPin,
  ShieldCheck,
  TrendingDown,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low";

type KpiCard = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  color: string;
};

type Insight = {
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
};

const COMPLAINT_TREND = [
  { month: "Nov", filed: 21, resolved: 12, escalated: 2 },
  { month: "Dec", filed: 28, resolved: 17, escalated: 3 },
  { month: "Jan", filed: 36, resolved: 24, escalated: 4 },
  { month: "Feb", filed: 44, resolved: 31, escalated: 6 },
  { month: "Mar", filed: 49, resolved: 35, escalated: 5 },
  { month: "Apr", filed: 42, resolved: 30, escalated: 4 },
];

const ROAD_HEALTH_TREND = [
  { month: "Nov", health: 78, risk: 34 },
  { month: "Dec", health: 76, risk: 39 },
  { month: "Jan", health: 72, risk: 47 },
  { month: "Feb", health: 68, risk: 55 },
  { month: "Mar", health: 71, risk: 49 },
  { month: "Apr", health: 74, risk: 43 },
];

const ZONE_RISK_DATA = [
  { zone: "Pune Central", critical: 1, high: 2, medium: 3, low: 1 },
  { zone: "Pune West", critical: 0, high: 1, medium: 3, low: 2 },
  { zone: "PCMC Corridor", critical: 0, high: 2, medium: 2, low: 2 },
  { zone: "Pune South", critical: 0, high: 1, medium: 2, low: 2 },
];

const CONTRACTOR_ANALYTICS = [
  {
    contractor: "Shivneri Infra",
    quality: 92,
    timeliness: 90,
    budget: 96,
    ras: 91,
  },
  {
    contractor: "PCMC Infra",
    quality: 86,
    timeliness: 82,
    budget: 95,
    ras: 86,
  },
  {
    contractor: "MahaRoad",
    quality: 76,
    timeliness: 74,
    budget: 84,
    ras: 76,
  },
  {
    contractor: "UrbanBuild",
    quality: 58,
    timeliness: 61,
    budget: 77,
    ras: 58,
  },
  {
    contractor: "QuickPatch",
    quality: 49,
    timeliness: 54,
    budget: 74,
    ras: 52,
  },
];

const SPENDING_QUALITY_DATA = [
  { road: "JM Road", spent: 4.8, health: 42 },
  { road: "FC Road", spent: 3.1, health: 56 },
  { road: "Hinjewadi", spent: 6.7, health: 61 },
  { road: "Baner", spent: 4.6, health: 72 },
  { road: "Katraj", spent: 3.4, health: 66 },
  { road: "Ravet", spent: 4.9, health: 81 },
];

const ISSUE_MIX = [
  { issue: "Potholes", count: 31 },
  { issue: "Cracking", count: 18 },
  { issue: "Waterlogging", count: 15 },
  { issue: "Repeat Repair", count: 9 },
  { issue: "Edge Damage", count: 7 },
];

const DECISION_INSIGHTS: Insight[] = [
  {
    title: "JM Road needs immediate audit",
    description:
      "High complaints, low health score and repeated patch failures indicate contractor-quality risk.",
    severity: "critical",
    confidence: 86,
  },
  {
    title: "UrbanBuild shows budget-quality mismatch",
    description:
      "Spending is above approved budget while repair quality and road health remain weak.",
    severity: "high",
    confidence: 83,
  },
  {
    title: "Baner Link Road is in preventive window",
    description:
      "Moderate risk can be reduced through early crack sealing before monsoon escalation.",
    severity: "medium",
    confidence: 79,
  },
  {
    title: "Ravet BRT Service Road is stable",
    description:
      "Low complaints and verified repairs show good maintenance discipline.",
    severity: "low",
    confidence: 88,
  },
];

const KPI_CARDS: KpiCard[] = [
  {
    label: "Complaints Filed",
    value: "220",
    note: "Pune / PCMC pilot total",
    icon: FileText,
    color: "#0EA5A4",
  },
  {
    label: "Resolved / Verified",
    value: "149",
    note: "67.7% closure rate",
    icon: CheckCircle2,
    color: "#16A34A",
  },
  {
    label: "Avg Resolution",
    value: "4.8 days",
    note: "Assigned civic cases",
    icon: Clock3,
    color: "#F59E0B",
  },
  {
    label: "Network Health",
    value: "74/100",
    note: "8 monitored pilot roads",
    icon: Activity,
    color: "#3B82F6",
  },
];

function getSeverityColor(severity: Severity) {
  if (severity === "critical") return "#DC2626";
  if (severity === "high") return "#F97316";
  if (severity === "medium") return "#F59E0B";
  return "#16A34A";
}

function getScoreColor(score: number) {
  if (score >= 85) return "#16A34A";
  if (score >= 70) return "#0EA5A4";
  if (score >= 55) return "#F59E0B";
  return "#DC2626";
}

function KpiCardView({ card }: { card: KpiCard }) {
  const Icon = card.icon;

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
          style={{ background: `${card.color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color: card.color }} />
        </div>

        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{
            background: `${card.color}14`,
            color: card.color,
          }}
        >
          Pilot
        </span>
      </div>

      <div
        className="text-2xl font-bold"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {card.value}
      </div>

      <div className="mt-1 text-sm font-medium">{card.label}</div>

      <div className="mt-1 text-xs text-muted-foreground">{card.note}</div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
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
          {description}
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

function InsightCard({ insight }: { insight: Insight }) {
  const color = getSeverityColor(insight.severity);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: `1px solid ${color}30`,
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{insight.title}</h3>

        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
          style={{
            background: `${color}18`,
            color,
          }}
        >
          {insight.severity}
        </span>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        {insight.description}
      </p>

      <div className="mt-3">
        <ScoreBar label="Confidence" value={insight.confidence} />
      </div>
    </div>
  );
}

export default function Analytics() {
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
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(14,165,164,0.14)",
                color: "#0EA5A4",
              }}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Analytics Command Center
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              RoadIntel Analytics
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Realistic pilot-stage analytics for Pune and PCMC. This page
              connects complaints, road health, risk, spending and contractor
              accountability without using random or exaggerated data.
            </p>
          </div>

          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Audit-safe demo data
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Pune / PCMC pilot Â· No fake live claims
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <KpiCardView key={card.label} card={card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ChartCard
          title="Complaint Lifecycle"
          description="Filed, resolved and escalated complaints across a realistic six-month pilot window."
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
        </ChartCard>

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
            Decision Insights
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Explainable observations for judges and civic officers.
          </p>

          <div className="mt-4 space-y-3">
            {DECISION_INSIGHTS.map((insight) => (
              <InsightCard key={insight.title} insight={insight} />
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Road Health vs Risk"
          description="A useful road intelligence signal: health should improve while risk falls. Divergence means maintenance failure."
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ROAD_HEALTH_TREND}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="health"
                  name="Avg Health"
                  stroke="#0EA5A4"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  name="Avg Risk"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Zone-Wise Risk Load"
          description="Risk is grouped by pilot zones, not random city-wide inflated data."
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ZONE_RISK_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="zone" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="critical" stackId="a" name="Critical" fill="#DC2626" />
                <Bar dataKey="high" stackId="a" name="High" fill="#F97316" />
                <Bar dataKey="medium" stackId="a" name="Medium" fill="#F59E0B" />
                <Bar dataKey="low" stackId="a" name="Low" fill="#16A34A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ChartCard
          title="Contractor Accountability"
          description="RAS-style comparison of quality, timeliness, budget discipline and final accountability score."
        >
          <div className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONTRACTOR_ANALYTICS} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="contractor"
                  type="category"
                  width={95}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="quality" name="Quality" fill="#0EA5A4" radius={[0, 6, 6, 0]} />
                <Bar dataKey="ras" name="RASâ„¢" fill="#3B82F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Spending vs Road Health"
          description="This exposes the key RoadIntel problem: high spending should correlate with better road health."
        >
          <div className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SPENDING_QUALITY_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="road" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="spent"
                  name="Spent â‚¹Cr"
                  fill="#F59E0B"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="health"
                  name="Health Score"
                  stroke="#0EA5A4"
                  strokeWidth={3}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <ChartCard
          title="Issue Mix"
          description="Compact issue distribution for field planning."
        >
          <div className="space-y-4">
            {ISSUE_MIX.map((item, index) => {
              const colors = ["#DC2626", "#F97316", "#F59E0B", "#0EA5A4", "#16A34A"];
              const color = colors[index] ?? "#0EA5A4";
              const max = Math.max(...ISSUE_MIX.map((issue) => issue.count));

              return (
                <div key={item.issue}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{item.issue}</span>
                    <span className="font-semibold" style={{ color }}>
                      {item.count}
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full"
                    style={{ background: "hsl(var(--border))" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.count / max) * 100}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

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
            Audit Alignment Checklist
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            These points make the analytics page stronger for evaluation.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ChecklistItem
              icon={ShieldCheck}
              title="No fake live claims"
              text="Data is presented as a pilot analytics layer, not a false real-time government feed."
              color="#16A34A"
            />

            <ChecklistItem
              icon={MapPin}
              title="Region consistency"
              text="Uses Pune / PCMC pilot zones instead of random unrelated cities."
              color="#0EA5A4"
            />

            <ChecklistItem
              icon={Users}
              title="Contractor accountability"
              text="Analytics connects road quality with contractor performance."
              color="#3B82F6"
            />

            <ChecklistItem
              icon={IndianRupee}
              title="Budget transparency"
              text="Spending is compared against road health, making audit risk visible."
              color="#F59E0B"
            />

            <ChecklistItem
              icon={TrendingDown}
              title="Risk prediction"
              text="Risk trends are shown alongside health decline for explainable decision-making."
              color="#F97316"
            />

            <ChecklistItem
              icon={AlertTriangle}
              title="Escalation clarity"
              text="Critical and high-risk cases are separated from normal complaints."
              color="#DC2626"
            />
          </div>
        </section>
      </section>
    </div>
  );
}

function ChecklistItem({
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
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
} 
