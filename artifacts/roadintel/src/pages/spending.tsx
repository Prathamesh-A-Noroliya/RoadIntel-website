import {
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
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ContractorStatus = "Strong" | "Watchlist" | "Audit Required";

type Contractor = {
  id: string;
  name: string;
  zone: string;
  authority: string;
  activeProjects: number;
  completedProjects: number;
  budgetApprovedCr: number;
  budgetUsedCr: number;
  qualityScore: number;
  timelinessScore: number;
  repeatFailureRate: number;
  complaintRecurrence: number;
  avgRepairDays: number;
  status: ContractorStatus;
  lastAudit: string;
  roads: string[];
  note: string;
};

const CONTRACTORS: Contractor[] = [
  {
    id: "CON-221",
    name: "Shivneri Infra Works",
    zone: "Pune West",
    authority: "PMC",
    activeProjects: 2,
    completedProjects: 6,
    budgetApprovedCr: 4.8,
    budgetUsedCr: 4.6,
    qualityScore: 92,
    timelinessScore: 91,
    repeatFailureRate: 0.05,
    complaintRecurrence: 3,
    avgRepairDays: 3.8,
    status: "Strong",
    lastAudit: "12 Sep 2026",
    roads: ["Baner Link Road", "Aundh Internal Road"],
    note: "Consistent quality, low repeat complaints and good budget discipline.",
  },
  {
    id: "CON-222",
    name: "Maharashtra RoadBuild Ltd.",
    zone: "PCMC Corridor",
    authority: "PCMC",
    activeProjects: 3,
    completedProjects: 7,
    budgetApprovedCr: 6.2,
    budgetUsedCr: 6.7,
    qualityScore: 76,
    timelinessScore: 74,
    repeatFailureRate: 0.15,
    complaintRecurrence: 9,
    avgRepairDays: 5.6,
    status: "Watchlist",
    lastAudit: "08 Sep 2026",
    roads: ["Wakad-Hinjewadi Road", "Ravet BRT Road"],
    note: "Stable contractor, but monsoon damage recurrence needs monitoring.",
  },
  {
    id: "CON-223",
    name: "UrbanBuild Pune Services",
    zone: "Pune Central",
    authority: "PMC",
    activeProjects: 2,
    completedProjects: 4,
    budgetApprovedCr: 3.9,
    budgetUsedCr: 4.8,
    qualityScore: 58,
    timelinessScore: 61,
    repeatFailureRate: 0.31,
    complaintRecurrence: 17,
    avgRepairDays: 8.4,
    status: "Audit Required",
    lastAudit: "04 Sep 2026",
    roads: ["JM Road Patch Zone", "FC Road Junction"],
    note: "Budget overrun and repeated complaints detected after completed repairs.",
  },
  {
    id: "CON-224",
    name: "PCMC Infra Maintenance",
    zone: "Pimpri-Chinchwad",
    authority: "PCMC",
    activeProjects: 1,
    completedProjects: 5,
    budgetApprovedCr: 5.1,
    budgetUsedCr: 4.9,
    qualityScore: 86,
    timelinessScore: 82,
    repeatFailureRate: 0.09,
    complaintRecurrence: 5,
    avgRepairDays: 4.1,
    status: "Strong",
    lastAudit: "30 Aug 2026",
    roads: ["Akurdi Main Road", "Nigdi Service Road"],
    note: "Good delivery record with acceptable repair response time.",
  },
  {
    id: "CON-225",
    name: "QuickPatch Civil Works",
    zone: "Pune South",
    authority: "PWD",
    activeProjects: 2,
    completedProjects: 3,
    budgetApprovedCr: 2.7,
    budgetUsedCr: 3.4,
    qualityScore: 49,
    timelinessScore: 54,
    repeatFailureRate: 0.38,
    complaintRecurrence: 21,
    avgRepairDays: 9.7,
    status: "Audit Required",
    lastAudit: "27 Aug 2026",
    roads: ["Katraj Bypass", "Sinhagad Road Patch"],
    note: "Low quality score with high repeat-failure rate. Needs inspection before new work allocation.",
  },
  {
    id: "CON-226",
    name: "Vidarbha Highway Services",
    zone: "Nagpur East",
    authority: "PWD",
    activeProjects: 1,
    completedProjects: 6,
    budgetApprovedCr: 4.3,
    budgetUsedCr: 4.4,
    qualityScore: 79,
    timelinessScore: 73,
    repeatFailureRate: 0.13,
    complaintRecurrence: 7,
    avgRepairDays: 5.2,
    status: "Watchlist",
    lastAudit: "22 Aug 2026",
    roads: ["Nagpur Ring Road Sec-2"],
    note: "Acceptable quality, but delivery speed needs improvement.",
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getBudgetOverrun(contractor: Contractor) {
  const variance =
    ((contractor.budgetUsedCr - contractor.budgetApprovedCr) /
      contractor.budgetApprovedCr) *
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

function getStatusMeta(status: ContractorStatus) {
  switch (status) {
    case "Strong":
      return {
        color: "#16A34A",
        bg: "rgba(22,163,74,0.12)",
        border: "rgba(22,163,74,0.28)",
        icon: CheckCircle2,
      };

    case "Watchlist":
      return {
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.28)",
        icon: AlertTriangle,
      };

    case "Audit Required":
      return {
        color: "#DC2626",
        bg: "rgba(220,38,38,0.12)",
        border: "rgba(220,38,38,0.28)",
        icon: ShieldAlert,
      };
  }
}

function getScoreColor(score: number) {
  if (score >= 85) return "#16A34A";
  if (score >= 70) return "#0EA5A4";
  if (score >= 55) return "#F59E0B";
  return "#DC2626";
}

function formatCr(value: number) {
  return `₹${value.toFixed(1)} Cr`;
}

export default function Contractors() {
  const rankedContractors = [...CONTRACTORS].sort(
    (a, b) => calculateRAS(b) - calculateRAS(a),
  );

  const totalActive = CONTRACTORS.reduce(
    (total, contractor) => total + contractor.activeProjects,
    0,
  );

  const totalCompleted = CONTRACTORS.reduce(
    (total, contractor) => total + contractor.completedProjects,
    0,
  );

  const avgRAS = Math.round(
    CONTRACTORS.reduce(
      (total, contractor) => total + calculateRAS(contractor),
      0,
    ) / CONTRACTORS.length,
  );

  const auditRequired = CONTRACTORS.filter(
    (contractor) => contractor.status === "Audit Required",
  ).length;

  const auditQueue = rankedContractors.filter(
    (contractor) => contractor.status !== "Strong",
  );

  return (
    <div className="space-y-6 p-6">
      <section
        className="overflow-hidden rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.18), rgba(59,130,246,0.10), hsl(var(--card)))",
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
              Contractor Accountability Engine
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Contractor Performance Dashboard
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              A clean audit view for tracking road contractors using quality,
              budget discipline, repeat failures, and repair timeliness.
            </p>
          </div>

          <div
            className="grid gap-3 rounded-2xl p-4 sm:grid-cols-2"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div>
              <p className="text-xs text-muted-foreground">Average RAS™</p>

              <div className="mt-1 flex items-end gap-1">
                <span
                  className="text-4xl font-bold"
                  style={{
                    color: getScoreColor(avgRAS),
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {avgRAS}
                </span>

                <span className="pb-1 text-sm text-muted-foreground">/100</span>
              </div>
            </div>

            <div className="text-xs leading-5 text-muted-foreground">
              RAS™ = Quality + Budget discipline + Repeat failure control +
              Timeliness.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Monitored Contractors"
          value={CONTRACTORS.length}
          note="Maharashtra pilot vendors"
          icon={Building2}
          color="#0EA5A4"
        />

        <KpiCard
          title="Active Works"
          value={totalActive}
          note={`${totalCompleted} completed works audited`}
          icon={Wrench}
          color="#3B82F6"
        />

        <KpiCard
          title="Avg. RAS™"
          value={`${avgRAS}/100`}
          note="Composite accountability score"
          icon={Award}
          color={getScoreColor(avgRAS)}
        />

        <KpiCard
          title="Audit Required"
          value={auditRequired}
          note="High-risk contractors"
          icon={ShieldAlert}
          color="#DC2626"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div
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
                Budget vs Quality Matrix
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Contractors spending more but delivering lower quality are
                visually pushed into the audit-risk zone.
              </p>
            </div>

            <div
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(14,165,164,0.12)",
                color: "#0EA5A4",
              }}
            >
              Explainable audit view
            </div>
          </div>

          <BudgetQualityMatrix contractors={rankedContractors} />
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
            Audit Queue
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Priority list for engineers and finance reviewers.
          </p>

          <div className="mt-4 space-y-3">
            {auditQueue.map((contractor, index) => {
              const ras = calculateRAS(contractor);
              const meta = getStatusMeta(contractor.status);
              const Icon = meta.icon;

              return (
                <div
                  key={contractor.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: "hsl(var(--muted))",
                    border: `1px solid ${meta.border}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: meta.color }}
                        >
                          {index + 1}
                        </span>

                        <h3 className="font-semibold">{contractor.name}</h3>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {contractor.zone} • {contractor.authority}
                      </p>
                    </div>

                    <Icon className="h-5 w-5" style={{ color: meta.color }} />
                  </div>

                  <div className="mt-3">
                    <ScoreBar value={ras} label="RAS™" />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {contractor.note}
                  </p>
                </div>
              );
            })}
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
              Each card shows only decision-relevant contractor signals.
            </p>
          </div>

          <div className="text-xs text-muted-foreground">
            Demo data • Pune / PCMC / PWD pilot
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
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
            Compact Review Table
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Quick comparison for jury walkthrough and admin review.
          </p>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead style={{ background: "hsl(var(--muted))" }}>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Contractor</th>
                <th className="px-5 py-3 font-semibold">Authority</th>
                <th className="px-5 py-3 font-semibold">RAS™</th>
                <th className="px-5 py-3 font-semibold">Budget</th>
                <th className="px-5 py-3 font-semibold">Repeat Issues</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {rankedContractors.map((contractor) => {
                const ras = calculateRAS(contractor);
                const meta = getStatusMeta(contractor.status);
                const overrun = getBudgetOverrun(contractor);

                return (
                  <tr
                    key={contractor.id}
                    className="border-t border-border align-top"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold">{contractor.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {contractor.id} • {contractor.zone}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {contractor.authority}
                    </td>

                    <td className="px-5 py-4">
                      <ScoreBar value={ras} />
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <div>{formatCr(contractor.budgetUsedCr)} used</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {overrun > 0
                          ? `${overrun}% over approved budget`
                          : "Within approved budget"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {contractor.complaintRecurrence}
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
  const overrun = getBudgetOverrun(contractor);

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
          value={formatCr(contractor.budgetUsedCr)}
          icon={IndianRupee}
        />

        <MiniMetric
          label="Repeat Issues"
          value={String(contractor.complaintRecurrence)}
          icon={TrendingDown}
        />
      </div>

      <div
        className="mt-4 rounded-2xl p-3"
        style={{
          background:
            contractor.status === "Audit Required"
              ? "rgba(220,38,38,0.10)"
              : contractor.status === "Watchlist"
                ? "rgba(245,158,11,0.10)"
                : "rgba(22,163,74,0.10)",
          border:
            contractor.status === "Audit Required"
              ? "1px solid rgba(220,38,38,0.24)"
              : contractor.status === "Watchlist"
                ? "1px solid rgba(245,158,11,0.24)"
                : "1px solid rgba(22,163,74,0.24)",
        }}
      >
        <p className="text-xs font-semibold">Audit Note</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {contractor.note}
        </p>

        {overrun > 0 && (
          <p className="mt-2 text-xs font-semibold text-red-500">
            Budget overrun detected: {overrun}%
          </p>
        )}
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

function BudgetQualityMatrix({ contractors }: { contractors: Contractor[] }) {
  const maxBudget = Math.max(
    ...contractors.map((contractor) => contractor.budgetUsedCr),
  );

  return (
    <div
      className="relative h-[360px] overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(22,163,74,0.10), transparent 45%), linear-gradient(315deg, rgba(220,38,38,0.12), transparent 42%), hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="absolute left-4 top-4 rounded-full bg-black/20 px-3 py-1 text-xs text-muted-foreground">
        Higher quality ↑
      </div>

      <div className="absolute bottom-4 right-4 rounded-full bg-black/20 px-3 py-1 text-xs text-muted-foreground">
        Higher spending →
      </div>

      <div className="absolute bottom-14 left-8 right-8 h-px bg-border" />
      <div className="absolute bottom-14 left-8 top-8 w-px bg-border" />

      <div className="absolute right-6 top-6 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
        Audit risk zone
      </div>

      <div className="absolute left-10 top-10 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs text-green-400">
        Best value zone
      </div>

      {contractors.map((contractor) => {
        const ras = calculateRAS(contractor);
        const meta = getStatusMeta(contractor.status);

        const left = clamp((contractor.budgetUsedCr / maxBudget) * 78 + 10, 10, 88);
        const bottom = clamp((contractor.qualityScore / 100) * 74 + 12, 12, 88);

        return (
          <div
            key={contractor.id}
            className="group absolute -translate-x-1/2 translate-y-1/2"
            style={{
              left: `${left}%`,
              bottom: `${bottom}%`,
            }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg transition group-hover:scale-110"
              style={{
                background: meta.color,
                boxShadow: `0 0 0 8px ${meta.bg}`,
              }}
            >
              {ras}
            </div>

            <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 hidden w-64 -translate-x-1/2 rounded-2xl border border-border bg-background p-3 text-xs shadow-2xl group-hover:block">
              <div className="font-bold">{contractor.name}</div>

              <div className="mt-1 text-muted-foreground">
                Budget: {formatCr(contractor.budgetUsedCr)} • Quality:{" "}
                {contractor.qualityScore}/100
              </div>

              <div className="mt-2">
                <StatusPill status={contractor.status} />
              </div>
            </div>
          </div>
        );
      })}
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

function ScoreBar({ value, label }: { value: number; label?: string }) {
  const safeValue = clamp(value);
  const color = getScoreColor(safeValue);

  return (
    <div>
      {(label || value) && (
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