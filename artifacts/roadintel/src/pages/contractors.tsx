import {
  Activity,
  AlertTriangle,
  Award,
  Building2,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ContractorStatus = "Strong" | "Watchlist" | "Audit Required";

type Contractor = {
  id: string;
  name: string;
  authority: "PMC" | "PCMC" | "PWD";
  zone: string;
  activeProjects: number;
  completedProjects: number;
  approvedBudgetCr: number;
  usedBudgetCr: number;
  qualityScore: number;
  timelinessScore: number;
  repeatFailureRate: number;
  complaintRecurrence: number;
  avgRepairDays: number;
  roads: string[];
  lastAudit: string;
  status: ContractorStatus;
  auditNote: string;
};

const CONTRACTORS: Contractor[] = [
  {
    id: "CON-221",
    name: "Shivneri Infra Works",
    authority: "PMC",
    zone: "Pune West",
    activeProjects: 2,
    completedProjects: 8,
    approvedBudgetCr: 5.2,
    usedBudgetCr: 5.0,
    qualityScore: 92,
    timelinessScore: 90,
    repeatFailureRate: 0.05,
    complaintRecurrence: 3,
    avgRepairDays: 3.6,
    roads: ["Baner Link Road", "Aundh Internal Road"],
    lastAudit: "12 Sep 2026",
    status: "Strong",
    auditNote:
      "Best performer in the pilot. Low repeat failures, good repair quality and budget discipline.",
  },
  {
    id: "CON-222",
    name: "PCMC Infra Maintenance",
    authority: "PCMC",
    zone: "Pimpri-Chinchwad",
    activeProjects: 1,
    completedProjects: 6,
    approvedBudgetCr: 5.1,
    usedBudgetCr: 4.9,
    qualityScore: 86,
    timelinessScore: 82,
    repeatFailureRate: 0.09,
    complaintRecurrence: 5,
    avgRepairDays: 4.1,
    roads: ["Ravet BRT Service Road", "Akurdi Main Road"],
    lastAudit: "30 Aug 2026",
    status: "Strong",
    auditNote:
      "Stable contractor with verified repairs and low complaint recurrence.",
  },
  {
    id: "CON-223",
    name: "Maharashtra RoadBuild Ltd.",
    authority: "PCMC",
    zone: "PCMC Corridor",
    activeProjects: 3,
    completedProjects: 7,
    approvedBudgetCr: 6.2,
    usedBudgetCr: 6.7,
    qualityScore: 76,
    timelinessScore: 74,
    repeatFailureRate: 0.15,
    complaintRecurrence: 9,
    avgRepairDays: 5.6,
    roads: ["Wakad-Hinjewadi Road", "Ravet Service Patch"],
    lastAudit: "08 Sep 2026",
    status: "Watchlist",
    auditNote:
      "Acceptable delivery, but monsoon damage recurrence needs monitoring.",
  },
  {
    id: "CON-224",
    name: "UrbanBuild Pune Services",
    authority: "PMC",
    zone: "Pune Central",
    activeProjects: 2,
    completedProjects: 5,
    approvedBudgetCr: 3.9,
    usedBudgetCr: 4.8,
    qualityScore: 58,
    timelinessScore: 61,
    repeatFailureRate: 0.31,
    complaintRecurrence: 17,
    avgRepairDays: 8.4,
    roads: ["JM Road Patch Zone", "FC Road Junction"],
    lastAudit: "04 Sep 2026",
    status: "Audit Required",
    auditNote:
      "Repeated patch failures and budget overrun detected. Needs audit before new work allocation.",
  },
  {
    id: "CON-225",
    name: "QuickPatch Civil Works",
    authority: "PWD",
    zone: "Pune South",
    activeProjects: 2,
    completedProjects: 4,
    approvedBudgetCr: 2.7,
    usedBudgetCr: 3.4,
    qualityScore: 49,
    timelinessScore: 54,
    repeatFailureRate: 0.38,
    complaintRecurrence: 21,
    avgRepairDays: 9.7,
    roads: ["Katraj Bypass", "Sinhagad Road Patch"],
    lastAudit: "27 Aug 2026",
    status: "Audit Required",
    auditNote:
      "Lowest quality score in the pilot. High repeat-failure rate and budget-quality mismatch.",
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getBudgetOverrun(contractor: Contractor) {
  const variance =
    ((contractor.usedBudgetCr - contractor.approvedBudgetCr) /
      contractor.approvedBudgetCr) *
    100;

  return Math.max(0, Math.round(variance));
}

function calculateRAS(contractor: Contractor) {
  const budgetOverrun = getBudgetOverrun(contractor);

  const score =
    contractor.qualityScore * 0.35 +
    (100 - budgetOverrun) * 0.25 +
    (1 - contractor.repeatFailureRate) * 100 * 0.25 +
    contractor.timelinessScore * 0.15;

  return Math.round(clamp(score));
}

function getScoreColor(score: number) {
  if (score >= 85) return "#16A34A";
  if (score >= 70) return "#0EA5A4";
  if (score >= 55) return "#F59E0B";
  return "#DC2626";
}

function getStatusMeta(status: ContractorStatus) {
  if (status === "Strong") {
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

function formatCr(value: number) {
  return `â‚¹${value.toFixed(1)} Cr`;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

const rankedContractors = [...CONTRACTORS].sort(
  (a, b) => calculateRAS(b) - calculateRAS(a),
);

const averageRAS = Math.round(
  CONTRACTORS.reduce((total, contractor) => total + calculateRAS(contractor), 0) /
    CONTRACTORS.length,
);

const totalActiveProjects = CONTRACTORS.reduce(
  (total, contractor) => total + contractor.activeProjects,
  0,
);

const totalCompletedProjects = CONTRACTORS.reduce(
  (total, contractor) => total + contractor.completedProjects,
  0,
);

const auditRequiredCount = CONTRACTORS.filter(
  (contractor) => contractor.status === "Audit Required",
).length;

const totalApprovedBudget = CONTRACTORS.reduce(
  (total, contractor) => total + contractor.approvedBudgetCr,
  0,
);

const totalUsedBudget = CONTRACTORS.reduce(
  (total, contractor) => total + contractor.usedBudgetCr,
  0,
);

const overallBudgetVariance =
  ((totalUsedBudget - totalApprovedBudget) / totalApprovedBudget) * 100;

export default function Contractors() {
  const auditQueue = rankedContractors.filter(
    (contractor) => contractor.status !== "Strong",
  );

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
              A clean audit view for comparing contractor quality, budget
              discipline, repeat-failure rate, complaint recurrence and repair
              response time across the RoadIntel pilot network.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 xl:min-w-[260px]"
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
                className="text-5xl font-bold"
                style={{
                  color: getScoreColor(averageRAS),
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {averageRAS}
              </span>

              <span className="pb-2 text-sm text-muted-foreground">/100</span>
            </div>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              RASâ„¢ combines quality, budget discipline, repeat-failure control
              and timeliness.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Monitored Contractors"
          value={CONTRACTORS.length}
          note="PMC / PCMC / PWD pilot"
          icon={Building2}
          color="#0EA5A4"
        />

        <KpiCard
          title="Active Works"
          value={totalActiveProjects}
          note={`${totalCompletedProjects} completed works reviewed`}
          icon={Wrench}
          color="#3B82F6"
        />

        <KpiCard
          title="Audit Required"
          value={auditRequiredCount}
          note="High-risk contractors"
          icon={ShieldAlert}
          color="#DC2626"
        />

        <KpiCard
          title="Budget Variance"
          value={`${overallBudgetVariance > 0 ? "+" : ""}${overallBudgetVariance.toFixed(1)}%`}
          note={`${formatCr(totalUsedBudget)} used`}
          icon={IndianRupee}
          color={overallBudgetVariance > 0 ? "#F59E0B" : "#16A34A"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
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
            Audit Priority Queue
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Contractors are ranked by the weakest accountability signals first.
          </p>

          <div className="mt-4 space-y-3">
            {auditQueue.map((contractor, index) => (
              <AuditQueueItem
                key={contractor.id}
                contractor={contractor}
                rank={index + 1}
              />
            ))}
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
            RASâ„¢ Scoring Model
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Simple and explainable scoring model for judges, citizens and audit
            teams.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FormulaCard
              title="Quality Score"
              value="35%"
              description="Repair quality, field verification and post-repair road condition."
              color="#0EA5A4"
            />

            <FormulaCard
              title="Budget Discipline"
              value="25%"
              description="Approved budget compared with actual contractor spending."
              color="#3B82F6"
            />

            <FormulaCard
              title="Repeat Failure Control"
              value="25%"
              description="How often the same road fails again after repair."
              color="#F59E0B"
            />

            <FormulaCard
              title="Timeliness"
              value="15%"
              description="Repair response time and SLA discipline."
              color="#16A34A"
            />
          </div>

          <div className="mt-5 rounded-2xl bg-primary/10 p-4 text-xs leading-5 text-muted-foreground">
            This keeps contractor scoring transparent. RoadIntel does not only
            show complaints; it connects complaints, money, repair quality and
            repeat failures into one accountability view.
          </div>
        </div>
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Contractor Scorecards
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Each card shows the most decision-relevant contractor signals.
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            Sorted by RASâ„¢ highest to lowest
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {rankedContractors.map((contractor) => (
            <ContractorCard key={contractor.id} contractor={contractor} />
          ))}
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
            Compact Audit Table
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Fast comparison for presentation and admin review.
          </p>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead style={{ background: "hsl(var(--muted))" }}>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Contractor</th>
                <th className="px-5 py-3 font-semibold">Authority</th>
                <th className="px-5 py-3 font-semibold">RASâ„¢</th>
                <th className="px-5 py-3 font-semibold">Budget</th>
                <th className="px-5 py-3 font-semibold">Repeat Failures</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {rankedContractors.map((contractor) => {
                const ras = calculateRAS(contractor);
                const overrun = getBudgetOverrun(contractor);

                return (
                  <tr
                    key={contractor.id}
                    className="border-t border-border align-top"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold">{contractor.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {contractor.id} Â· {contractor.zone}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {contractor.authority}
                    </td>

                    <td className="px-5 py-4">
                      <ScoreBar value={ras} />
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <div>{formatCr(contractor.usedBudgetCr)} used</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {overrun > 0
                          ? `${overrun}% over approved`
                          : "Within approved budget"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {formatPercent(contractor.repeatFailureRate)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusPill status={contractor.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 lg:hidden">
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
  const statusMeta = getStatusMeta(contractor.status);
  const StatusIcon = statusMeta.icon;
  const budgetOverrun = getBudgetOverrun(contractor);

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
          <p className="font-mono text-xs text-muted-foreground">
            {contractor.id}
          </p>

          <h3
            className="mt-1 text-xl font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {contractor.name}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {contractor.zone} Â· {contractor.authority}
          </p>
        </div>

        <StatusPill status={contractor.status} />
      </div>

      <div
        className="mt-5 rounded-2xl p-4"
        style={{
          background: "hsl(var(--muted))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Road Accountability Score
            </p>

            <div className="mt-1 flex items-end gap-1">
              <span
                className="text-4xl font-bold"
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
          label="Quality"
          value={`${contractor.qualityScore}%`}
          icon={ShieldCheck}
        />

        <MiniMetric
          label="Timeliness"
          value={`${contractor.timelinessScore}%`}
          icon={Clock3}
        />

        <MiniMetric
          label="Budget Used"
          value={formatCr(contractor.usedBudgetCr)}
          icon={IndianRupee}
        />

        <MiniMetric
          label="Repeat Failure"
          value={formatPercent(contractor.repeatFailureRate)}
          icon={TrendingDown}
        />
      </div>

      <div
        className="mt-4 rounded-2xl p-4"
        style={{
          background: statusMeta.bg,
          border: `1px solid ${statusMeta.border}`,
        }}
      >
        <div className="flex items-start gap-3">
          <StatusIcon
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: statusMeta.color }}
          />

          <div>
            <p className="text-sm font-semibold" style={{ color: statusMeta.color }}>
              {contractor.status}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {contractor.auditNote}
            </p>

            {budgetOverrun > 0 && (
              <p className="mt-2 text-xs font-semibold text-red-400">
                Budget overrun detected: {budgetOverrun}%
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {contractor.roads.map((road) => (
          <span
            key={road}
            className="rounded-full px-2.5 py-1 text-xs"
            style={{
              background: "hsl(var(--muted))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            {road}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Last audit: {contractor.lastAudit}
      </p>
    </article>
  );
}

function AuditQueueItem({
  contractor,
  rank,
}: {
  contractor: Contractor;
  rank: number;
}) {
  const ras = calculateRAS(contractor);
  const statusMeta = getStatusMeta(contractor.status);
  const Icon = statusMeta.icon;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: `1px solid ${statusMeta.border}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: statusMeta.color }}
            >
              {rank}
            </span>

            <h3 className="font-semibold">{contractor.name}</h3>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {contractor.zone} Â· {contractor.authority}
          </p>
        </div>

        <Icon className="h-5 w-5" style={{ color: statusMeta.color }} />
      </div>

      <div className="mt-3">
        <ScoreBar value={ras} label="RASâ„¢" />
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {contractor.auditNote}
      </p>
    </div>
  );
}

function KpiCard({
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
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${color}18` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>

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

function FormulaCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
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
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>

        <span
          className="rounded-full px-2.5 py-1 text-xs font-bold"
          style={{
            background: `${color}18`,
            color,
          }}
        >
          {value}
        </span>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function ScoreBar({ value, label }: { value: number; label?: string }) {
  const safeValue = clamp(value);
  const color = getScoreColor(safeValue);

  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-bold" style={{ color }}>
            {safeValue}
          </span>
        </div>
      )}

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

        {!label && (
          <span className="w-10 text-right text-xs font-bold" style={{ color }}>
            {safeValue}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ContractorStatus }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
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
