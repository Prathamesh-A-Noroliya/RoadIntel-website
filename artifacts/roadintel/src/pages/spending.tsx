import { useMemo } from "react";
import {
  useGetSpendingOverview,
  useGetContractorSpendingBreakdown,
  useGetCorruptionFlags
} from "@workspace/api-client-react";
import { Wallet, TrendingDown, AlertTriangle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type YearlyTrend = {
  year: string;
  budget: number;
  spent: number;
  quality: number;
};

type SpendingOverview = {
  totalBudget: number;
  totalSpent: number;
  wastedOnRepeatRepairs: number;
  suspiciousTransactions: number;
  yearlyTrend: YearlyTrend[];
};

type ContractorSpending = {
  contractorId: string | number;
  contractorName: string;
  totalSpent: number;
  qualityScore: number;
  efficiency: number;
  flagged: boolean;
};

type CorruptionFlag = {
  id: string | number;
  type: string;
  description: string;
  roadName: string;
  contractorName: string;
  severity: string;
  evidence: string;
  detectedAt: string;
  status: string;
};

const MOCK_OVERVIEW: SpendingOverview = {
  totalBudget: 980000000,
  totalSpent: 1125000000,
  wastedOnRepeatRepairs: 186000000,
  suspiciousTransactions: 23,
  yearlyTrend: [
    { year: "2020", budget: 620000000, spent: 590000000, quality: 74 },
    { year: "2021", budget: 700000000, spent: 760000000, quality: 69 },
    { year: "2022", budget: 810000000, spent: 890000000, quality: 61 },
    { year: "2023", budget: 900000000, spent: 1010000000, quality: 54 },
    { year: "2024", budget: 980000000, spent: 1125000000, quality: 49 }
  ]
};

const MOCK_CONTRACTOR_SPENDING: ContractorSpending[] = [
  {
    contractorId: 1,
    contractorName: "BuildRight Infrastructure",
    totalSpent: 280000000,
    qualityScore: 82,
    efficiency: 88,
    flagged: false
  },
  {
    contractorId: 2,
    contractorName: "RoadCraft Solutions",
    totalSpent: 340000000,
    qualityScore: 38,
    efficiency: 42,
    flagged: true
  },
  {
    contractorId: 3,
    contractorName: "National Road Works",
    totalSpent: 210000000,
    qualityScore: 71,
    efficiency: 76,
    flagged: false
  },
  {
    contractorId: 4,
    contractorName: "QuickFix Road Services",
    totalSpent: 165000000,
    qualityScore: 29,
    efficiency: 35,
    flagged: true
  },
  {
    contractorId: 5,
    contractorName: "Infra Prime Builders",
    totalSpent: 130000000,
    qualityScore: 91,
    efficiency: 93,
    flagged: false
  }
];

const MOCK_FLAGS: CorruptionFlag[] = [
  {
    id: 1,
    type: "Repeat Repair Pattern",
    description: "Same road segment repaired 8 times within 9 years",
    roadName: "Andheri-Kurla Road",
    contractorName: "RoadCraft Solutions",
    severity: "critical",
    evidence:
      "Repair cycle repeats every 8-12 months. AI pattern indicates possible substandard material usage.",
    detectedAt: "2024-04-15",
    status: "open"
  },
  {
    id: 2,
    type: "Budget Overrun",
    description: "Spending crossed approved budget by 14.8%",
    roadName: "NH-48 Stretch",
    contractorName: "RoadCraft Solutions",
    severity: "high",
    evidence:
      "Cost escalation does not match material index or traffic load increase.",
    detectedAt: "2024-04-22",
    status: "under review"
  },
  {
    id: 3,
    type: "Low Quality Delivery",
    description: "High payment released despite poor road health score",
    roadName: "AIIMS Delhi Stretch",
    contractorName: "QuickFix Road Services",
    severity: "critical",
    evidence:
      "Road health score dropped to 22/100 within a short operational window.",
    detectedAt: "2024-05-01",
    status: "open"
  }
];

function normalizeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];

  if (!value || typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;
  const possibleKeys = [
    "data",
    "items",
    "results",
    "rows",
    "list",
    "contractorSpending",
    "flags",
    "yearlyTrend"
  ];

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

function normalizeObject<T extends Record<string, unknown>>(value: unknown, fallback: T): T {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;

  const record = value as Record<string, unknown>;

  if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    return record.data as T;
  }

  if (record.overview && typeof record.overview === "object" && !Array.isArray(record.overview)) {
    return record.overview as T;
  }

  return record as T;
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

function clampPercentage(value: unknown): number {
  return Math.max(0, Math.min(100, safeNumber(value)));
}

function formatCurrency(value: unknown): string {
  const amount = safeNumber(value);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function getQualityColor(score: number) {
  if (score > 70) return "#16A34A";
  if (score > 50) return "#F59E0B";
  return "#DC2626";
}

export default function Spending() {
  const { data: overview } = useGetSpendingOverview();
  const { data: contractorSpending } = useGetContractorSpendingBreakdown();
  const { data: flags } = useGetCorruptionFlags();

  const ov = useMemo(() => {
    const normalized = normalizeObject<SpendingOverview>(
      overview,
      MOCK_OVERVIEW as unknown as SpendingOverview
    );

    return {
      totalBudget: safeNumber(normalized.totalBudget, MOCK_OVERVIEW.totalBudget),
      totalSpent: safeNumber(normalized.totalSpent, MOCK_OVERVIEW.totalSpent),
      wastedOnRepeatRepairs: safeNumber(
        normalized.wastedOnRepeatRepairs,
        MOCK_OVERVIEW.wastedOnRepeatRepairs
      ),
      suspiciousTransactions: safeNumber(
        normalized.suspiciousTransactions,
        MOCK_OVERVIEW.suspiciousTransactions
      ),
      yearlyTrend: normalizeArray<YearlyTrend>(
        normalized.yearlyTrend,
        MOCK_OVERVIEW.yearlyTrend
      )
    };
  }, [overview]);

  const cs = useMemo(() => {
    return normalizeArray<ContractorSpending>(
      contractorSpending,
      MOCK_CONTRACTOR_SPENDING
    );
  }, [contractorSpending]);

  const cf = useMemo(() => {
    return normalizeArray<CorruptionFlag>(flags, MOCK_FLAGS);
  }, [flags]);

  const overrun =
    ov.totalBudget > 0
      ? ((ov.totalSpent - ov.totalBudget) / ov.totalBudget) * 100
      : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Public Money Tracker
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Budget transparency, contractor accountability, and corruption detection
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Budget",
            value: formatCurrency(ov.totalBudget),
            icon: Wallet,
            color: "#0EA5A4",
            sub: "FY 2024-25"
          },
          {
            label: "Total Spent",
            value: formatCurrency(ov.totalSpent),
            icon: TrendingDown,
            color: overrun > 0 ? "#DC2626" : "#16A34A",
            sub: `${overrun > 0 ? "+" : ""}${overrun.toFixed(1)}% vs budget`
          },
          {
            label: "Wasted Repairs",
            value: formatCurrency(ov.wastedOnRepeatRepairs),
            icon: AlertTriangle,
            color: "#DC2626",
            sub: "Repeat repair waste"
          },
          {
            label: "Suspicious Cases",
            value: ov.suspiciousTransactions,
            icon: AlertTriangle,
            color: "#F59E0B",
            sub: "Under investigation"
          }
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div
            key={label}
            className="rounded-2xl p-4"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))"
            }}
          >
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${color}18` }}
            >
              <Icon className="h-4 w-4" style={{ color }} />
            </div>

            <div
              className="text-xl font-bold"
              style={{ fontFamily: "Sora, sans-serif", color }}
            >
              {value}
            </div>
            <div className="mt-0.5 text-sm font-medium">{label}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))"
        }}
      >
        <h3
          className="mb-4 font-semibold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Budget vs Quality Over Time
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ov.yearlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `₹${(safeNumber(value) / 10000000).toFixed(0)}Cr`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: unknown, name: string) =>
                name === "quality" ? `${safeNumber(value)}/100` : formatCurrency(value)
              }
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="budget"
              name="Budget"
              stroke="#0EA5A4"
              strokeWidth={2}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="spent"
              name="Spent"
              stroke="#DC2626"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="quality"
              name="Quality Score"
              stroke="#F59E0B"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="mt-2 text-xs text-muted-foreground">
          Budget spending increases while road quality score declines — a key
          accountability indicator.
        </p>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))"
        }}
      >
        <h3
          className="mb-4 font-semibold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Contractor-Wise Spending & Efficiency
        </h3>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={cs}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="contractorName" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value: unknown, name: string) =>
                name === "totalSpent" ? formatCurrency(value) : `${safeNumber(value)}%`
              }
            />
            <Legend />
            <Bar
              dataKey="qualityScore"
              name="Quality Score"
              fill="#0EA5A4"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="efficiency"
              name="Efficiency %"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
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
            Contractor Spending Detail
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--muted))"
                }}
              >
                {["Contractor", "Total Spent", "Quality Score", "Efficiency", "Status"].map(
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
              {cs.map((contractor, index) => {
                const qualityScore = clampPercentage(contractor.qualityScore);
                const efficiency = clampPercentage(contractor.efficiency);
                const qualityColor = getQualityColor(qualityScore);

                return (
                  <tr
                    key={contractor.contractorId ?? index}
                    className={contractor.flagged ? "bg-red-500/5" : ""}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {contractor.flagged && (
                          <AlertTriangle
                            className="h-4 w-4 shrink-0"
                            style={{ color: "#DC2626" }}
                          />
                        )}
                        <span className="text-sm font-medium">
                          {safeText(contractor.contractorName, "Unknown Contractor")}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold">
                      {formatCurrency(contractor.totalSpent)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 w-16 overflow-hidden rounded-full"
                          style={{ background: "hsl(var(--muted))" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${qualityScore}%`,
                              background: qualityColor
                            }}
                          />
                        </div>

                        <span
                          className="text-sm font-bold"
                          style={{ color: qualityColor }}
                        >
                          {qualityScore}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm">{efficiency}%</td>

                    <td className="px-4 py-3">
                      {contractor.flagged ? (
                        <span
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{ background: "#DC262618", color: "#DC2626" }}
                        >
                          FLAGGED
                        </span>
                      ) : (
                        <span
                          className="rounded-full px-2 py-0.5 text-xs"
                          style={{ background: "#16A34A18", color: "#16A34A" }}
                        >
                          Clear
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))"
        }}
      >
        <div
          className="flex items-center gap-2 border-b px-5 py-4"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <AlertTriangle className="h-4 w-4" style={{ color: "#DC2626" }} />
          <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
            AI Corruption Detector
          </h3>
          <span
            className="ml-2 rounded-full px-2 py-0.5 text-xs"
            style={{ background: "#DC262618", color: "#DC2626" }}
          >
            {cf.length} Active Flags
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
          {cf.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No active corruption flags detected.
            </div>
          ) : (
            cf.map((flag, index) => {
              const severity = safeText(flag.severity, "high").toLowerCase();
              const status = safeText(flag.status, "open").toLowerCase();

              return (
                <div key={flag.id ?? index} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{
                            background:
                              severity === "critical" ? "#DC262618" : "#F59E0B18",
                            color: severity === "critical" ? "#DC2626" : "#F59E0B"
                          }}
                        >
                          {safeText(flag.type, "Flag")}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {safeText(flag.detectedAt)}
                        </span>
                      </div>

                      <div className="text-sm font-medium">
                        {safeText(flag.description, "No description available.")}
                      </div>

                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {safeText(flag.roadName, "Unknown Road")} ·{" "}
                        {safeText(flag.contractorName, "Unknown Contractor")}
                      </div>

                      <div
                        className="mt-2 rounded-lg p-2 text-xs"
                        style={{
                          background: "hsl(var(--muted))",
                          color: "hsl(var(--muted-foreground))"
                        }}
                      >
                        <span className="font-semibold">Evidence: </span>
                        {safeText(flag.evidence, "Evidence not available.")}
                      </div>
                    </div>

                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs capitalize"
                      style={{
                        background: status === "open" ? "#DC262618" : "#F59E0B18",
                        color: status === "open" ? "#DC2626" : "#F59E0B"
                      }}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}