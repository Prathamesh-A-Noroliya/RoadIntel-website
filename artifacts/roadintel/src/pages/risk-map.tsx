import { useMemo } from "react";
import { useGetRiskMap } from "@workspace/api-client-react";
import { MapPin, Clock } from "lucide-react";
import { getRiskColor } from "@/lib/utils";

type RiskPoint = {
  id: string | number;
  roadId?: string | number;
  roadName?: string;
  latitude?: number;
  longitude?: number;
  riskScore?: number;
  riskLevel?: string;
  predictedFailureIn?: string;
  reason?: string;
};

const MOCK_RISK_MAP: RiskPoint[] = [
  {
    id: 1,
    roadId: 7,
    roadName: "AIIMS Delhi Stretch",
    latitude: 28.5672,
    longitude: 77.21,
    riskScore: 97,
    riskLevel: "critical",
    predictedFailureIn: "2-5 days",
    reason:
      "Sensor data shows extreme vibration. Health score is 22/100. Contractor has been suspended."
  },
  {
    id: 2,
    roadId: 4,
    roadName: "Andheri-Kurla Road",
    latitude: 19.1136,
    longitude: 72.8697,
    riskScore: 94,
    riskLevel: "critical",
    predictedFailureIn: "3-7 days",
    reason:
      "8 repair cycles in 9 years. Current health score is 28/100. AI detects likely collapse zone."
  },
  {
    id: 3,
    roadId: 2,
    roadName: "NH-48 Stretch",
    latitude: 28.4595,
    longitude: 77.0266,
    riskScore: 78,
    riskLevel: "high",
    predictedFailureIn: "2-3 weeks",
    reason:
      "5 failures in 3 years. Rising vibration trend. Contractor flagged for repeated quality issues."
  },
  {
    id: 4,
    roadId: 1,
    roadName: "MG Road",
    latitude: 12.9716,
    longitude: 77.5946,
    riskScore: 45,
    riskLevel: "medium",
    predictedFailureIn: "1-2 months",
    reason:
      "Gradual health decline. Pothole clusters forming. Second repair cycle likely needed."
  },
  {
    id: 5,
    roadId: 6,
    roadName: "GST Road",
    latitude: 12.8825,
    longitude: 80.1014,
    riskScore: 32,
    riskLevel: "medium",
    predictedFailureIn: "2-3 months",
    reason:
      "Moderate wear pattern. Drainage issues observed. Seasonal risk during monsoon."
  },
  {
    id: 6,
    roadId: 3,
    roadName: "Outer Ring Road South",
    latitude: 12.9141,
    longitude: 77.62,
    riskScore: 8,
    riskLevel: "low",
    predictedFailureIn: "12+ months",
    reason:
      "Excellent condition. High-quality construction. No immediate concerns identified."
  },
  {
    id: 7,
    roadId: 5,
    roadName: "Electronic City Flyover",
    latitude: 12.8399,
    longitude: 77.677,
    riskScore: 5,
    riskLevel: "low",
    predictedFailureIn: "12+ months",
    reason: "Near-optimal health. Premium construction by top-rated contractor."
  },
  {
    id: 8,
    roadId: 8,
    roadName: "Mumbai-Pune Expressway Sec-3",
    latitude: 18.5204,
    longitude: 73.8567,
    riskScore: 9,
    riskLevel: "low",
    predictedFailureIn: "12+ months",
    reason: "Well-maintained expressway. Regular preventive maintenance in place."
  }
];

function normalizeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];

  if (!value || typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;
  const possibleKeys = ["data", "items", "results", "rows", "list", "riskMap", "points"];

  for (const key of possibleKeys) {
    const item = record[key];

    if (Array.isArray(item)) return item as T[];

    if (item && typeof item === "object") {
      const nested = normalizeArray<T>(item, []);
      if (nested.length > 0) return nested;
    }
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

function riskScoreColor(score: number) {
  if (score > 80) return "#DC2626";
  if (score > 60) return "#F59E0B";
  if (score > 30) return "#0EA5A4";
  return "#16A34A";
}

function RiskBadge({ level }: { level: string }) {
  const safeLevel = level.toLowerCase();

  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase"
      style={{
        background: `${getRiskColor(safeLevel)}20`,
        color: getRiskColor(safeLevel)
      }}
    >
      {safeLevel}
    </span>
  );
}

function RiskBar({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, safeNumber(score)));
  const color = riskScoreColor(safeScore);

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--muted))" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${safeScore}%`, background: color }}
        />
      </div>

      <span className="w-8 text-xs font-bold" style={{ color }}>
        {safeScore}%
      </span>
    </div>
  );
}

export default function RiskMap() {
  const { data: riskMap } = useGetRiskMap();

  const points = useMemo(() => normalizeArray<RiskPoint>(riskMap, MOCK_RISK_MAP), [riskMap]);

  const stats = useMemo(() => {
    return {
      critical: points.filter((point) => safeText(point.riskLevel, "").toLowerCase() === "critical").length,
      high: points.filter((point) => safeText(point.riskLevel, "").toLowerCase() === "high").length,
      medium: points.filter((point) => safeText(point.riskLevel, "").toLowerCase() === "medium").length,
      low: points.filter((point) => safeText(point.riskLevel, "").toLowerCase() === "low").length
    };
  }, [points]);

  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => safeNumber(b.riskScore) - safeNumber(a.riskScore));
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
          AI-predicted road failure zones and risk forecasts
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: "#DC262610", border: "1px solid #DC262630" }}
        >
          <div
            className="text-3xl font-bold"
            style={{ color: "#DC2626", fontFamily: "Sora, sans-serif" }}
          >
            {stats.critical}
          </div>
          <div className="mt-1 text-sm font-medium">Critical Risk Roads</div>
          <div className="text-xs text-muted-foreground">Failing within 1 week</div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ background: "#F59E0B10", border: "1px solid #F59E0B30" }}
        >
          <div
            className="text-3xl font-bold"
            style={{ color: "#F59E0B", fontFamily: "Sora, sans-serif" }}
          >
            {stats.high}
          </div>
          <div className="mt-1 text-sm font-medium">High Risk Roads</div>
          <div className="text-xs text-muted-foreground">Failing within 3 weeks</div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(14,165,164,0.1)",
            border: "1px solid rgba(14,165,164,0.2)"
          }}
        >
          <div
            className="text-3xl font-bold"
            style={{ color: "#0EA5A4", fontFamily: "Sora, sans-serif" }}
          >
            {stats.medium}
          </div>
          <div className="mt-1 text-sm font-medium">Medium Risk Roads</div>
          <div className="text-xs text-muted-foreground">Monitor in 1-3 months</div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ background: "#16A34A10", border: "1px solid #16A34A30" }}
        >
          <div
            className="text-3xl font-bold"
            style={{ color: "#16A34A", fontFamily: "Sora, sans-serif" }}
          >
            {stats.low}
          </div>
          <div className="mt-1 text-sm font-medium">Low Risk Roads</div>
          <div className="text-xs text-muted-foreground">Safe for 12+ months</div>
        </div>
      </div>

      <div
        className="relative min-h-[300px] overflow-hidden rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))"
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(215 60% 8%) 0%, hsl(215 55% 12%) 100%)"
          }}
        >
          <div className="grid w-full max-w-3xl grid-cols-2 gap-6 px-8 sm:grid-cols-4">
            {points.map((point, index) => {
              const riskLevel = safeText(point.riskLevel, "medium").toLowerCase();
              const riskScore = safeNumber(point.riskScore);
              const roadName = safeText(point.roadName, "Unknown Road");

              return (
                <div
                  key={point.id ?? index}
                  className="flex cursor-pointer flex-col items-center gap-2 transition-transform hover:scale-110"
                >
                  <div
                    className="relative flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      background: `${getRiskColor(riskLevel)}25`,
                      border: `2px solid ${getRiskColor(riskLevel)}`
                    }}
                  >
                    <MapPin
                      className="h-5 w-5"
                      style={{ color: getRiskColor(riskLevel) }}
                    />

                    {(riskLevel === "critical" || riskLevel === "high") && (
                      <div
                        className="absolute inset-0 animate-ping rounded-full opacity-30"
                        style={{ background: getRiskColor(riskLevel) }}
                      />
                    )}
                  </div>

                  <div className="text-center">
                    <div
                      className="text-xs font-medium"
                      style={{ color: getRiskColor(riskLevel) }}
                    >
                      {riskScore}%
                    </div>
                    <div className="max-w-[80px] truncate text-center text-xs text-muted-foreground">
                      {roadName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="absolute bottom-4 left-4 rounded-lg px-3 py-1.5 text-xs"
          style={{ background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.7)" }}
        >
          Map visualization — bubble color indicates risk severity
        </div>

        <div
          className="absolute right-4 top-4 flex flex-wrap items-center gap-3 rounded-lg px-3 py-2 text-xs"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          {[
            ["Critical", "#DC2626"],
            ["High", "#F59E0B"],
            ["Medium", "#0EA5A4"],
            ["Low", "#16A34A"]
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))"
        }}
      >
        <div className="border-b px-5 py-4" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
            Detailed Risk Assessment
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--muted))"
                }}
              >
                {["Road", "Risk Score", "Risk Level", "Predicted Failure", "AI Reason"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {sortedPoints.map((point, index) => {
                const riskLevel = safeText(point.riskLevel, "medium").toLowerCase();
                const riskScore = safeNumber(point.riskScore);
                const roadName = safeText(point.roadName, "Unknown Road");

                return (
                  <tr
                    key={point.id ?? index}
                    className={
                      riskLevel === "critical"
                        ? "bg-red-500/5"
                        : riskLevel === "high"
                          ? "bg-amber-500/5"
                          : ""
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <MapPin
                          className="h-3.5 w-3.5"
                          style={{ color: getRiskColor(riskLevel) }}
                        />
                        {roadName}
                      </div>
                    </td>

                    <td className="w-36 px-4 py-3">
                      <RiskBar score={riskScore} />
                    </td>

                    <td className="px-4 py-3">
                      <RiskBadge level={riskLevel} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {safeText(point.predictedFailureIn)}
                      </div>
                    </td>

                    <td className="max-w-xs px-4 py-3 text-xs text-muted-foreground">
                      {safeText(point.reason, "No AI explanation available.")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}