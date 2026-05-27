import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Wallet,
  AlertTriangle,
  Wrench,
  Building2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  TrendingDown,
  FileText,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RoadDetail = {
  id: string;
  name: string;
  location: string;
  authority: string;
  contractor: string;
  builtYear: string;
  length: string;
  roadType: string;
  riskScore: number;
  healthScore: number;
  allocatedBudget: number;
  spentBudget: number;
  totalComplaints: number;
  repeatFailures: number;
  lastRepaired: string;
  nextInspection: string;
  status: "Stable" | "At Risk" | "Critical";
  summary: string;
  repairHistory: {
    date: string;
    work: string;
    contractor: string;
    cost: number;
    quality: string;
  }[];
  complaintHistory: {
    type: string;
    count: number;
  }[];
  healthTrend: {
    month: string;
    score: number;
  }[];
  spendingTrend: {
    month: string;
    allocated: number;
    spent: number;
  }[];
  riskFactors: {
    label: string;
    value: string;
    severity: "low" | "medium" | "high" | "critical";
  }[];
};

const ROAD_DATABASE: Record<string, RoadDetail> = {
  "1": {
    id: "1",
    name: "FC Road Smart Corridor",
    location: "Shivajinagar, Pune, Maharashtra",
    authority: "Pune Municipal Corporation",
    contractor: "Pune Urban Infrastructure Works",
    builtYear: "2019",
    length: "2.8 km",
    roadType: "Urban arterial road",
    riskScore: 72,
    healthScore: 68,
    allocatedBudget: 84000000,
    spentBudget: 61200000,
    totalComplaints: 48,
    repeatFailures: 7,
    lastRepaired: "March 2025",
    nextInspection: "June 2025",
    status: "At Risk",
    summary:
      "FC Road shows moderate-to-high deterioration due to repeated pothole complaints, heavy two-wheeler traffic, drainage stress during monsoon, and multiple patch repairs. The road is usable but needs targeted resurfacing before the next monsoon cycle.",
    repairHistory: [
      {
        date: "Mar 2025",
        work: "Pothole patching and surface leveling",
        contractor: "Pune Urban Infrastructure Works",
        cost: 8200000,
        quality: "Average",
      },
      {
        date: "Dec 2024",
        work: "Drainage edge repair near junction",
        contractor: "Pune Urban Infrastructure Works",
        cost: 4600000,
        quality: "Good",
      },
      {
        date: "Aug 2024",
        work: "Emergency monsoon patch repair",
        contractor: "Ward Maintenance Unit",
        cost: 2800000,
        quality: "Poor",
      },
      {
        date: "Jan 2024",
        work: "Lane marking and shoulder maintenance",
        contractor: "Metro Road Services",
        cost: 3500000,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 18 },
      { type: "Waterlogging", count: 11 },
      { type: "Cracks", count: 8 },
      { type: "Uneven Surface", count: 7 },
      { type: "Drainage", count: 4 },
    ],
    healthTrend: [
      { month: "Oct", score: 82 },
      { month: "Nov", score: 80 },
      { month: "Dec", score: 76 },
      { month: "Jan", score: 74 },
      { month: "Feb", score: 72 },
      { month: "Mar", score: 70 },
      { month: "Apr", score: 68 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 12, spent: 8 },
      { month: "Dec", allocated: 18, spent: 14 },
      { month: "Jan", allocated: 22, spent: 17 },
      { month: "Feb", allocated: 25, spent: 20 },
      { month: "Mar", allocated: 30, spent: 26 },
      { month: "Apr", allocated: 34, spent: 29 },
    ],
    riskFactors: [
      {
        label: "Repeated failures after patchwork",
        value: "7 repeat failures",
        severity: "high",
      },
      {
        label: "Complaint density",
        value: "48 complaints",
        severity: "high",
      },
      {
        label: "Budget utilization",
        value: "72.8% spent",
        severity: "medium",
      },
      {
        label: "Monsoon vulnerability",
        value: "Waterlogging reported",
        severity: "medium",
      },
    ],
  },

  "2": {
    id: "2",
    name: "Mumbai-Pune Expressway Segment",
    location: "Lonavala Ghat Section, Maharashtra",
    authority: "MSRDC",
    contractor: "Expressway Maintenance Unit",
    builtYear: "2002",
    length: "11.4 km",
    roadType: "Expressway",
    riskScore: 81,
    healthScore: 59,
    allocatedBudget: 425000000,
    spentBudget: 356000000,
    totalComplaints: 64,
    repeatFailures: 12,
    lastRepaired: "February 2025",
    nextInspection: "May 2025",
    status: "Critical",
    summary:
      "This expressway segment has high safety sensitivity because of slope, speed, rainfall, and heavy freight movement. Multiple stress points need preventive resurfacing and drainage reinforcement.",
    repairHistory: [
      {
        date: "Feb 2025",
        work: "Surface strengthening and guardrail repair",
        contractor: "Expressway Maintenance Unit",
        cost: 41000000,
        quality: "Average",
      },
      {
        date: "Sep 2024",
        work: "Drainage clearing and ghat section patching",
        contractor: "Hill Road Infra",
        cost: 27500000,
        quality: "Average",
      },
    ],
    complaintHistory: [
      { type: "Surface Damage", count: 22 },
      { type: "Cracks", count: 16 },
      { type: "Drainage", count: 12 },
      { type: "Signage", count: 8 },
      { type: "Shoulder Damage", count: 6 },
    ],
    healthTrend: [
      { month: "Oct", score: 75 },
      { month: "Nov", score: 72 },
      { month: "Dec", score: 70 },
      { month: "Jan", score: 66 },
      { month: "Feb", score: 63 },
      { month: "Mar", score: 61 },
      { month: "Apr", score: 59 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 60, spent: 48 },
      { month: "Dec", allocated: 80, spent: 66 },
      { month: "Jan", allocated: 95, spent: 78 },
      { month: "Feb", allocated: 120, spent: 101 },
      { month: "Mar", allocated: 135, spent: 113 },
      { month: "Apr", allocated: 150, spent: 126 },
    ],
    riskFactors: [
      {
        label: "High-speed traffic exposure",
        value: "Expressway risk",
        severity: "critical",
      },
      {
        label: "Repeat failures",
        value: "12 repeat failures",
        severity: "critical",
      },
      {
        label: "Rainfall stress",
        value: "Ghat section",
        severity: "high",
      },
    ],
  },
};

const DEFAULT_ROAD = ROAD_DATABASE["1"];

const SEVERITY_COLORS = {
  low: "#16A34A",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#DC2626",
};

function formatMoney(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function getRiskColor(score: number) {
  if (score >= 80) return "#DC2626";
  if (score >= 65) return "#F97316";
  if (score >= 45) return "#F59E0B";
  return "#16A34A";
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" style={{ color }} />
        {label}
      </div>

      <div
        className="mt-3 text-2xl font-bold"
        style={{ color, fontFamily: "Sora, sans-serif" }}
      >
        {value}
      </div>
    </div>
  );
}

export default function RoadDetail() {
  const params = useParams<{ id: string }>();
  const road = ROAD_DATABASE[params.id ?? "1"] ?? DEFAULT_ROAD;

  const riskColor = getRiskColor(road.riskScore);
  const spentPercent = Math.round((road.spentBudget / road.allocatedBudget) * 100);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/roads">
            <button className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Road DNA
            </button>
          </Link>

          <h1
            className="text-2xl font-bold sm:text-3xl"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {road.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {road.location}
            </span>

            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {road.authority}
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Built {road.builtYear}
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl px-5 py-3 text-sm font-bold"
          style={{
            background: `${riskColor}18`,
            color: riskColor,
            border: `1px solid ${riskColor}35`,
          }}
        >
          {road.status}
        </div>
      </div>

      <section
        className="grid gap-6 rounded-3xl p-6 lg:grid-cols-[1fr_220px]"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Road Type</div>
              <div className="mt-1 font-semibold">{road.roadType}</div>
            </div>

            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Length</div>
              <div className="mt-1 font-semibold">{road.length}</div>
            </div>

            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Contractor</div>
              <div className="mt-1 font-semibold">{road.contractor}</div>
            </div>

            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Last Repaired</div>
              <div className="mt-1 font-semibold">{road.lastRepaired}</div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-background/40 p-5">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <h2 className="font-bold">Road Intelligence Summary</h2>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {road.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${riskColor} ${road.riskScore * 3.6}deg, rgba(148,163,184,0.18) 0deg)`,
            }}
          >
            <div
              className="flex h-28 w-28 flex-col items-center justify-center rounded-full"
              style={{ background: "hsl(var(--card))" }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: riskColor, fontFamily: "Sora, sans-serif" }}
              >
                {road.riskScore}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          <div className="mt-3 text-sm font-semibold text-muted-foreground">
            Risk Score
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Allocated Budget"
          value={formatMoney(road.allocatedBudget)}
          color="#0EA5A4"
        />
        <StatCard
          icon={Wallet}
          label="Spent Budget"
          value={formatMoney(road.spentBudget)}
          color="#16A34A"
        />
        <StatCard
          icon={AlertTriangle}
          label="Total Complaints"
          value={road.totalComplaints}
          color="#F59E0B"
        />
        <StatCard
          icon={ShieldAlert}
          label="Repeat Failures"
          value={road.repeatFailures}
          color="#DC2626"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Health Score Trend
          </h2>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={road.healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0EA5A4"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-400">
              AI Analysis
            </span>

            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Road Intelligence Summary
            </h2>
          </div>

          <div className="space-y-4">
            {road.riskFactors.map((factor) => (
              <div
                key={factor.label}
                className="rounded-2xl p-4"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{factor.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {factor.value}
                    </div>
                  </div>

                  <span
                    className="rounded-full px-2 py-1 text-xs font-bold capitalize"
                    style={{
                      color: SEVERITY_COLORS[factor.severity],
                      background: `${SEVERITY_COLORS[factor.severity]}18`,
                    }}
                  >
                    {factor.severity}
                  </span>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-teal-500/10 p-4 text-sm text-teal-300">
              Recommendation: prioritize resurfacing, drainage correction, and
              post-repair quality audit before the next inspection cycle.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Budget Utilization
          </h2>

          <div className="mb-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-semibold">{spentPercent}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${spentPercent}%`,
                  background: "linear-gradient(90deg, #16A34A, #0EA5A4)",
                }}
              />
            </div>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={road.spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="allocated"
                  stroke="#1E88E5"
                  fill="rgba(30,136,229,0.18)"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#16A34A"
                  fill="rgba(22,163,74,0.18)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Complaint Breakdown
          </h2>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={road.complaintHistory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="type"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={110}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {road.complaintHistory.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        ["#0EA5A4", "#F59E0B", "#F97316", "#DC2626", "#1E88E5"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section
        className="rounded-3xl p-6"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-5 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-teal-400" />
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Repair History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr
                className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Work Completed</th>
                <th className="px-4 py-3">Contractor</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Quality</th>
              </tr>
            </thead>

            <tbody>
              {road.repairHistory.map((item) => (
                <tr
                  key={`${item.date}-${item.work}`}
                  className="border-b"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <Clock className="mr-2 inline h-4 w-4" />
                    {item.date}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium">
                    <FileText className="mr-2 inline h-4 w-4 text-teal-400" />
                    {item.work}
                  </td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <Building2 className="mr-2 inline h-4 w-4" />
                    {item.contractor}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold">
                    {formatMoney(item.cost)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-semibold"
                      style={{
                        color:
                          item.quality === "Good"
                            ? "#16A34A"
                            : item.quality === "Average"
                              ? "#F59E0B"
                              : "#DC2626",
                        background:
                          item.quality === "Good"
                            ? "rgba(22,163,74,0.15)"
                            : item.quality === "Average"
                              ? "rgba(245,158,11,0.15)"
                              : "rgba(220,38,38,0.15)",
                      }}
                    >
                      {item.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
          <TrendingDown className="mb-2 h-5 w-5" />
          <div className="font-bold">Health Score</div>
          <div className="text-2xl font-bold">{road.healthScore}/100</div>
        </div>

        <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-300">
          <CheckCircle2 className="mb-2 h-5 w-5" />
          <div className="font-bold">Next Inspection</div>
          <div className="text-2xl font-bold">{road.nextInspection}</div>
        </div>

        <div className="rounded-2xl bg-orange-500/10 p-4 text-orange-300">
          <AlertTriangle className="mb-2 h-5 w-5" />
          <div className="font-bold">Action Priority</div>
          <div className="text-2xl font-bold">
            {road.riskScore >= 80 ? "Urgent" : road.riskScore >= 65 ? "High" : "Medium"}
          </div>
        </div>
      </section>
    </div>
  );
}