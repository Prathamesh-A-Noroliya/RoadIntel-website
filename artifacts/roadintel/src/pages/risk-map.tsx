import { useMemo } from "react";
import { useGetRiskMap } from "@workspace/api-client-react";
import {
  AlertTriangle,
  Activity,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { getRiskColor } from "@/lib/utils";

type RiskLevel = "critical" | "high" | "medium" | "low";

type RiskPoint = {
  id: string | number;
  roadId?: string | number;
  roadName?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  riskScore?: number;
  riskLevel?: RiskLevel | string;
  predictedFailureIn?: string;
  reason?: string;
  action?: string;
};

const MOCK_RISK_MAP: RiskPoint[] = [
  {
    id: 1,
    roadId: 1,
    roadName: "JM Road Patch Zone",
    city: "Pune",
    latitude: 18.5222,
    longitude: 73.8478,
    riskScore: 86,
    riskLevel: "critical",
    predictedFailureIn: "3-5 days",
    reason: "High complaint density with repeated pothole reports after rain.",
    action: "Emergency patching + contractor inspection",
  },
  {
    id: 2,
    roadId: 2,
    roadName: "FC Road Junction",
    city: "Pune",
    latitude: 18.5206,
    longitude: 73.8419,
    riskScore: 74,
    riskLevel: "high",
    predictedFailureIn: "1-2 weeks",
    reason: "Surface cracking and drainage stress near high-traffic area.",
    action: "Drainage check + crack sealing",
  },
  {
    id: 3,
    roadId: 3,
    roadName: "Wakad-Hinjewadi Road",
    city: "PCMC",
    latitude: 18.5912,
    longitude: 73.7389,
    riskScore: 68,
    riskLevel: "high",
    predictedFailureIn: "2-3 weeks",
    reason: "Heavy commuter traffic and early edge deterioration.",
    action: "Schedule resurfacing inspection",
  },
  {
    id: 4,
    roadId: 4,
    roadName: "Baner Link Road",
    city: "Pune",
    latitude: 18.559,
    longitude: 73.7868,
    riskScore: 49,
    riskLevel: "medium",
    predictedFailureIn: "1-2 months",
    reason: "Moderate wear pattern with increasing two-wheeler complaints.",
    action: "Preventive maintenance",
  },
  {
    id: 5,
    roadId: 5,
    roadName: "Katraj Bypass",
    city: "Pune",
    latitude: 18.4529,
    longitude: 73.8652,
    riskScore: 41,
    riskLevel: "medium",
    predictedFailureIn: "2 months",
    reason: "Monsoon waterlogging may increase surface damage.",
    action: "Monitor after rainfall",
  },
  {
    id: 6,
    roadId: 6,
    roadName: "Mumbai-Pune Expressway Sec-3",
    city: "Expressway",
    latitude: 18.7022,
    longitude: 73.489,
    riskScore: 18,
    riskLevel: "low",
    predictedFailureIn: "6+ months",
    reason: "Stable condition with regular preventive maintenance.",
    action: "Routine inspection",
  },
  {
    id: 7,
    roadId: 7,
    roadName: "Sinhagad Road",
    city: "Pune",
    latitude: 18.4766,
    longitude: 73.8196,
    riskScore: 29,
    riskLevel: "low",
    predictedFailureIn: "4-6 months",
    reason: "Minor surface wear, no urgent structural risk detected.",
    action: "Routine monitoring",
  },
];

function normalizeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];

  if (!value || typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;

  for (const key of ["data", "items", "results", "rows", "list", "riskMap"]) {
    const item = record[key];

    if (Array.isArray(item)) return item as T[];
  }

  return fallback;
}

function safeNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function safeText(value: unknown, fallback = "N/A"): string {
  if (value === null || value === undefined) return fallback;

  const text = String(value).trim();

  return text.length > 0 ? text : fallback;
}

function normalizeRiskLevel(level: unknown): RiskLevel {
  const value = safeText(level, "low").toLowerCase();

  if (value === "critical") return "critical";
  if (value === "high") return "high";
  if (value === "medium") return "medium";

  return "low";
}

function riskScoreColor(score: number) {
  if (score >= 80) return "#DC2626";
  if (score >= 60) return "#F97316";
  if (score >= 35) return "#F59E0B";
  return "#16A34A";
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const color = getRiskColor(level);

  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        background: `${color}1F`,
        color,
      }}
    >
      {level}
    </span>
  );
}

function RiskScore({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, safeNumber(score)));
  const color = riskScoreColor(safeScore);

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-20 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--muted))" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${safeScore}%`,
            background: color,
          }}
        />
      </div>

      <span className="w-9 text-xs font-bold" style={{ color }}>
        {safeScore}%
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  note: string;
  color: string;
  icon: typeof AlertTriangle;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-5 w-5" style={{ color }} />

        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{
            background: `${color}18`,
            color,
          }}
        >
          Live
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

export default function RiskMap() {
  const { data: riskMap } = useGetRiskMap();

  const points = useMemo(
    () => normalizeArray<RiskPoint>(riskMap, MOCK_RISK_MAP),
    [riskMap],
  );

  const sortedPoints = useMemo(() => {
    return [...points].sort(
      (a, b) => safeNumber(b.riskScore) - safeNumber(a.riskScore),
    );
  }, [points]);

  const topPriority = sortedPoints.slice(0, 3);

  const stats = useMemo(() => {
    const critical = points.filter(
      (point) => normalizeRiskLevel(point.riskLevel) === "critical",
    ).length;

    const high = points.filter(
      (point) => normalizeRiskLevel(point.riskLevel) === "high",
    ).length;

    const avgRisk =
      points.length === 0
        ? 0
        : Math.round(
            points.reduce(
              (total, point) => total + safeNumber(point.riskScore),
              0,
            ) / points.length,
          );

    const urgent = points.filter(
      (point) => safeNumber(point.riskScore) >= 60,
    ).length;

    return { critical, high, avgRisk, urgent };
  }, [points]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Future Risk Map
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Clean pilot view of predicted road failure zones across Pune and PCMC.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Critical Roads"
          value={stats.critical}
          note="Action within 7 days"
          color="#DC2626"
          icon={AlertTriangle}
        />

        <StatCard
          label="High Risk Roads"
          value={stats.high}
          note="Inspection required"
          color="#F97316"
          icon={Activity}
        />

        <StatCard
          label="Avg Risk Score"
          value={`${stats.avgRisk}%`}
          note="Pilot network average"
          color="#0EA5A4"
          icon={ShieldCheck}
        />

        <StatCard
          label="Urgent Cases"
          value={stats.urgent}
          note="Risk score above 60%"
          color="#F59E0B"
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2
                className="font-semibold"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Risk Zone Overview
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Bigger and warmer markers indicate higher predicted road risk.
              </p>
            </div>

            <div className="hidden gap-2 text-[11px] text-muted-foreground sm:flex">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                Critical
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                High
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                Medium
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                Low
              </span>
            </div>
          </div>

          <div
            className="relative min-h-[360px] overflow-hidden rounded-2xl"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(14,165,164,0.16), transparent 28%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.14), transparent 26%), linear-gradient(135deg, rgba(15,23,42,0.92), rgba(15,23,42,0.55))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="absolute left-6 top-6 rounded-full bg-black/30 px-3 py-1 text-xs text-slate-300">
              Pune / PCMC pilot map
            </div>

            <div className="absolute inset-x-10 top-[45%] h-0.5 bg-white/10" />
            <div className="absolute bottom-10 left-[18%] h-0.5 w-[64%] rotate-[-18deg] bg-white/10" />
            <div className="absolute bottom-20 left-[38%] h-[55%] w-0.5 bg-white/10" />

            {sortedPoints.map((point, index) => {
              const score = safeNumber(point.riskScore);
              const level = normalizeRiskLevel(point.riskLevel);
              const color = riskScoreColor(score);

              const positions = [
                { left: "30%", top: "28%" },
                { left: "45%", top: "36%" },
                { left: "62%", top: "42%" },
                { left: "53%", top: "60%" },
                { left: "36%", top: "68%" },
                { left: "74%", top: "58%" },
                { left: "24%", top: "55%" },
              ];

              const position = positions[index % positions.length];

              return (
                <div
                  key={point.id}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={position}
                >
                  <div
                    className="flex items-center justify-center rounded-full font-bold text-white shadow-lg transition group-hover:scale-110"
                    style={{
                      width: `${Math.max(34, Math.min(58, 28 + score / 2))}px`,
                      height: `${Math.max(34, Math.min(58, 28 + score / 2))}px`,
                      background: color,
                      boxShadow: `0 0 0 8px ${color}20`,
                    }}
                  >
                    {score}
                  </div>

                  <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 hidden w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950 p-3 text-xs shadow-2xl group-hover:block">
                    <div className="font-bold text-white">
                      {safeText(point.roadName)}
                    </div>

                    <div className="mt-1 text-slate-400">
                      {safeText(point.city)} • {level.toUpperCase()}
                    </div>

                    <div className="mt-2 text-slate-300">
                      {safeText(point.predictedFailureIn)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Top Priority Actions
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Only the most urgent roads are shown here to keep the view focused.
          </p>

          <div className="mt-4 space-y-3">
            {topPriority.map((point, index) => {
              const level = normalizeRiskLevel(point.riskLevel);
              const score = safeNumber(point.riskScore);
              const color = riskScoreColor(score);

              return (
                <div
                  key={point.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: color }}
                        >
                          {index + 1}
                        </span>

                        <h3 className="font-semibold">
                          {safeText(point.roadName)}
                        </h3>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {safeText(point.city)}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {safeText(point.predictedFailureIn)}
                        </span>
                      </div>
                    </div>

                    <RiskBadge level={level} />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    {safeText(point.action)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-2xl"
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
            Risk Assessment Table
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Cleaner table with short actions. Detailed reason opens only when
            needed.
          </p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead style={{ background: "hsl(var(--muted))" }}>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Road</th>
                <th className="px-5 py-3 font-semibold">Risk</th>
                <th className="px-5 py-3 font-semibold">Failure Window</th>
                <th className="px-5 py-3 font-semibold">Recommended Action</th>
              </tr>
            </thead>

            <tbody>
              {sortedPoints.map((point) => {
                const level = normalizeRiskLevel(point.riskLevel);

                return (
                  <tr
                    key={point.id}
                    className="border-t border-border align-top"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{ color: getRiskColor(level) }}
                        />

                        <div>
                          <div className="font-semibold">
                            {safeText(point.roadName)}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {safeText(point.city)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <RiskScore score={safeNumber(point.riskScore)} />
                        <RiskBadge level={level} />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {safeText(point.predictedFailureIn)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="max-w-md text-sm">
                        {safeText(point.action)}

                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-primary">
                            View reason
                          </summary>

                          <p className="mt-2 text-xs leading-5 text-muted-foreground">
                            {safeText(point.reason)}
                          </p>
                        </details>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {sortedPoints.map((point) => {
            const level = normalizeRiskLevel(point.riskLevel);

            return (
              <div
                key={point.id}
                className="rounded-2xl p-4"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {safeText(point.roadName)}
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      {safeText(point.city)}
                    </p>
                  </div>

                  <RiskBadge level={level} />
                </div>

                <div className="mt-3">
                  <RiskScore score={safeNumber(point.riskScore)} />
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {safeText(point.predictedFailureIn)}
                </div>

                <p className="mt-3 text-sm">{safeText(point.action)}</p>

                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-primary">
                    View reason
                  </summary>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {safeText(point.reason)}
                  </p>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}