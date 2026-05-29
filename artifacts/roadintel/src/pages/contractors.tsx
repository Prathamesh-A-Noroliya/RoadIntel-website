import {
  Activity,
  AlertTriangle,
  Award,
  Building2,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ContractorStatus = "Excellent" | "Good" | "Needs Review";

type Contractor = {
  id: string;
  name: string;
  zone: string;
  activeProjects: number;
  completedProjects: number;
  budgetAllocatedCr: number;
  budgetUsedCr: number;
  qualityScore: number;
  timelinessScore: number;
  repeatFailureRate: number;
  complaintRecurrence: number;
  lastAudit: string;
  status: ContractorStatus;
  note: string;
};

const contractors: Contractor[] = [
  {
    id: "CON-221",
    name: "Shivneri Infra Works",
    zone: "Pune West",
    activeProjects: 3,
    completedProjects: 11,
    budgetAllocatedCr: 8.4,
    budgetUsedCr: 7.9,
    qualityScore: 92,
    timelinessScore: 90,
    repeatFailureRate: 0.06,
    complaintRecurrence: 4,
    lastAudit: "12 Sep 2026",
    status: "Excellent",
    note: "Consistent quality score and low repeat-failure pattern.",
  },
  {
    id: "CON-222",
    name: "Maharashtra RoadBuild Ltd.",
    zone: "PCMC Corridor",
    activeProjects: 4,
    completedProjects: 9,
    budgetAllocatedCr: 11.2,
    budgetUsedCr: 10.7,
    qualityScore: 84,
    timelinessScore: 82,
    repeatFailureRate: 0.12,
    complaintRecurrence: 8,
    lastAudit: "08 Sep 2026",
    status: "Good",
    note: "Stable delivery record, but two locations need monsoon follow-up.",
  },
  {
    id: "CON-223",
    name: "UrbanBuild Pune Services",
    zone: "Pune Central",
    activeProjects: 2,
    completedProjects: 6,
    budgetAllocatedCr: 5.8,
    budgetUsedCr: 6.3,
    qualityScore: 69,
    timelinessScore: 64,
    repeatFailureRate: 0.27,
    complaintRecurrence: 15,
    lastAudit: "04 Sep 2026",
    status: "Needs Review",
    note: "Budget overrun and repeated complaints detected on repaired roads.",
  },
  {
    id: "CON-224",
    name: "Vidarbha Highway Services",
    zone: "Nagpur East",
    activeProjects: 2,
    completedProjects: 8,
    budgetAllocatedCr: 7.1,
    budgetUsedCr: 6.8,
    qualityScore: 81,
    timelinessScore: 78,
    repeatFailureRate: 0.14,
    complaintRecurrence: 7,
    lastAudit: "30 Aug 2026",
    status: "Good",
    note: "Acceptable delivery record with moderate repeat-maintenance cases.",
  },
];

function calculateBudgetOverrun(contractor: Contractor) {
  const overrun =
    ((contractor.budgetUsedCr - contractor.budgetAllocatedCr) /
      contractor.budgetAllocatedCr) *
    100;

  return Math.max(0, Math.round(overrun));
}

function calculateRAS(contractor: Contractor) {
  const budgetOverrun = calculateBudgetOverrun(contractor);

  const score =
    contractor.qualityScore * 0.35 +
    (100 - budgetOverrun) * 0.25 +
    (1 - contractor.repeatFailureRate) * 100 * 0.25 +
    contractor.timelinessScore * 0.15;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getStatusColor(status: ContractorStatus) {
  switch (status) {
    case "Excellent":
      return "#16A34A";
    case "Good":
      return "#0EA5A4";
    case "Needs Review":
      return "#F59E0B";
    default:
      return "#64748B";
  }
}

function getScoreColor(score: number) {
  if (score >= 88) return "#16A34A";
  if (score >= 75) return "#0EA5A4";
  if (score >= 60) return "#F59E0B";
  return "#DC2626";
}

function formatCr(value: number) {
  return `₹${value.toFixed(1)} Cr`;
}

const totalActiveProjects = contractors.reduce(
  (total, contractor) => total + contractor.activeProjects,
  0,
);

const totalCompletedProjects = contractors.reduce(
  (total, contractor) => total + contractor.completedProjects,
  0,
);

const averageRAS = Math.round(
  contractors.reduce((total, contractor) => total + calculateRAS(contractor), 0) /
    contractors.length,
);

const underReviewCount = contractors.filter(
  (contractor) => contractor.status === "Needs Review",
).length;

export default function Contractors() {
  const rankedContractors = [...contractors].sort(
    (a, b) => calculateRAS(b) - calculateRAS(a),
  );

  return (
    <div className="space-y-6 p-6">
      <section
        className="overflow-hidden rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.16), rgba(59,130,246,0.08), hsl(var(--card)))",
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
              <ShieldCheck className="h-3.5 w-3.5" />
              Contractor Accountability Layer
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Contractor Performance Dashboard
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Track contractor quality, delivery reliability, budget discipline,
              and repeated road-failure patterns across the Maharashtra pilot
              network.
            </p>
          </div>

          <div
            className="rounded-2xl px-5 py-4"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <p className="text-xs text-muted-foreground">
              Average Road Accountability Score
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span
                className="text-3xl font-bold"
                style={{
                  color: getScoreColor(averageRAS),
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {averageRAS}
              </span>

              <span className="pb-1 text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Registered Contractors"
          value={contractors.length}
          note="Pilot vendors monitored"
          icon={Building2}
          color="#0EA5A4"
        />

        <StatCard
          title="Active Projects"
          value={totalActiveProjects}
          note={`${totalCompletedProjects} completed works reviewed`}
          icon={Activity}
          color="#3B82F6"
        />

        <StatCard
          title="Avg. RAS™"
          value={`${averageRAS}/100`}
          note="Composite accountability score"
          icon={Award}
          color="#16A34A"
        />

        <StatCard
          title="Needs Review"
          value={underReviewCount}
          note="Contractors flagged for audit"
          icon={AlertTriangle}
          color="#F59E0B"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div
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
                Contractor Scorecards
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                RAS™ combines quality score, budget discipline, repeat-failure
                rate, and timeline performance.
              </p>
            </div>

            <div className="text-xs text-muted-foreground">
              Updated: Demo pilot data
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {rankedContractors.map((contractor) => (
              <ContractorCard key={contractor.id} contractor={contractor} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div
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
              Audit Focus
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              RoadIntel highlights contractors where quality, budget, and
              repeated complaints do not align.
            </p>

            <div className="mt-4 space-y-3">
              <InsightItem
                icon={AlertTriangle}
                title="Budget-quality mismatch"
                text="UrbanBuild Pune Services used more than allocated budget but has the lowest RAS™."
                color="#F59E0B"
              />

              <InsightItem
                icon={TrendingUp}
                title="Repeat failure tracking"
                text="Complaint recurrence is weighted to identify repeated repair failures."
                color="#DC2626"
              />

              <InsightItem
                icon={CheckCircle2}
                title="Top performer"
                text="Shivneri Infra Works shows strong quality and low repeat failure rate."
                color="#16A34A"
              />
            </div>
          </div>

          <div
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
              RAS™ Formula
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <FormulaRow label="Quality Score" value="35%" />
              <FormulaRow label="Budget Discipline" value="25%" />
              <FormulaRow label="Repeat Failure Control" value="25%" />
              <FormulaRow label="Timeliness" value="15%" />
            </div>

            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              This gives judges a clear, explainable accountability metric
              instead of vague contractor ratings.
            </p>
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-3xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="border-b border-border p-5">
          <h2
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Contractor Review Table
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Compact view for quick audit comparison.
          </p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead style={{ background: "hsl(var(--muted))" }}>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Contractor</th>
                <th className="px-5 py-3 font-semibold">Zone</th>
                <th className="px-5 py-3 font-semibold">RAS™</th>
                <th className="px-5 py-3 font-semibold">Budget Used</th>
                <th className="px-5 py-3 font-semibold">Repeat Issues</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {rankedContractors.map((contractor) => {
                const ras = calculateRAS(contractor);
                const statusColor = getStatusColor(contractor.status);

                return (
                  <tr
                    key={contractor.id}
                    className="border-t border-border align-top"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold">{contractor.name}</div>
                      <div className="mt-1 font-mono text-xs text-muted-foreground">
                        {contractor.id}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {contractor.zone}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <ScoreBar value={ras} />
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {formatCr(contractor.budgetUsedCr)}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {contractor.complaintRecurrence}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{
                          background: `${statusColor}18`,
                          color: statusColor,
                        }}
                      >
                        {contractor.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {rankedContractors.map((contractor) => (
            <ContractorCard key={contractor.id} contractor={contractor} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ContractorCard({ contractor }: { contractor: Contractor }) {
  const ras = calculateRAS(contractor);
  const scoreColor = getScoreColor(ras);
  const statusColor = getStatusColor(contractor.status);
  const budgetOverrun = calculateBudgetOverrun(contractor);

  return (
    <article
      className="rounded-3xl p-5"
      style={{
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            {contractor.id}
          </p>

          <h3
            className="mt-1 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {contractor.name}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {contractor.zone}
          </p>
        </div>

        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{
            background: `${statusColor}18`,
            color: statusColor,
          }}
        >
          {contractor.status}
        </span>
      </div>

      <div className="mt-5 rounded-2xl p-4" style={{ background: "hsl(var(--muted))" }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Road Accountability Score
            </p>

            <div className="mt-1 flex items-end gap-1">
              <span
                className="text-3xl font-bold"
                style={{
                  color: scoreColor,
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {ras}
              </span>

              <span className="pb-1 text-sm text-muted-foreground">/100</span>
            </div>
          </div>

          <Award className="h-8 w-8" style={{ color: scoreColor }} />
        </div>

        <div className="mt-3">
          <ScoreBar value={ras} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniMetric
          label="Active Projects"
          value={String(contractor.activeProjects)}
          icon={Activity}
        />

        <MiniMetric
          label="Budget Used"
          value={formatCr(contractor.budgetUsedCr)}
          icon={IndianRupee}
        />

        <MiniMetric
          label="Quality"
          value={`${contractor.qualityScore}%`}
          icon={ShieldCheck}
        />

        <MiniMetric
          label="Timeliness"
          value={`${contractor.timelinessScore}%`}
          icon={Clock3}
        />
      </div>

      <div
        className="mt-4 rounded-2xl p-3"
        style={{
          background:
            contractor.status === "Needs Review"
              ? "rgba(245,158,11,0.10)"
              : "rgba(14,165,164,0.08)",
          border:
            contractor.status === "Needs Review"
              ? "1px solid rgba(245,158,11,0.22)"
              : "1px solid rgba(14,165,164,0.18)",
        }}
      >
        <div className="flex items-start gap-2">
          {contractor.status === "Needs Review" ? (
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "#F59E0B" }}
            />
          ) : (
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "#0EA5A4" }}
            />
          )}

          <div>
            <p className="text-xs font-semibold">
              {contractor.status === "Needs Review"
                ? "Audit Recommended"
                : "Performance Summary"}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {contractor.note}
            </p>

            {budgetOverrun > 0 && (
              <p className="mt-1 text-xs font-medium text-amber-500">
                Budget overrun detected: {budgetOverrun}%
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Last audit: {contractor.lastAudit}
      </p>
    </article>
  );
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  color,
}: {
  title: string;
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
        <Icon className="h-5 w-5" style={{ color }} />

        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{
            background: `${color}18`,
            color,
          }}
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

      <p className="mt-1 text-sm font-medium">{title}</p>

      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div
      className="rounded-2xl p-3"
      style={{
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      <p className="font-bold">{value}</p>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  const color = getScoreColor(safeValue);

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: "hsl(var(--border))" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${safeValue}%`,
            background: color,
          }}
        />
      </div>

      <span className="w-10 text-right text-xs font-bold" style={{ color }}>
        {safeValue}
      </span>
    </div>
  );
}

function InsightItem({
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
      className="rounded-2xl p-3"
      style={{
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />

        <div>
          <p className="text-sm font-semibold">{title}</p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function FormulaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}