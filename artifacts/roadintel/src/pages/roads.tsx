import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, ArrowUpRight, MapPin } from "lucide-react";
import { useListRoads } from "@workspace/api-client-react";
import { getRiskColor, getHealthColor } from "@/lib/utils";

type Road = {
  id: string | number;
  name?: string;
  roadType?: string;
  location?: string;
  healthScore?: number;
  riskLevel?: string;
  status?: string;
  contractorName?: string;
  totalComplaints?: number;
};

const MOCK_ROADS: Road[] = [
  {
    id: 1,
    name: "MG Road",
    roadType: "National Highway",
    location: "Bangalore, KA",
    healthScore: 78,
    riskLevel: "medium",
    status: "active",
    contractorName: "BuildRight Infrastructure",
    totalComplaints: 12
  },
  {
    id: 2,
    name: "NH-48 Stretch",
    roadType: "National Highway",
    location: "Delhi-Gurugram",
    healthScore: 34,
    riskLevel: "critical",
    status: "deteriorating",
    contractorName: "RoadCraft Solutions",
    totalComplaints: 47
  },
  {
    id: 3,
    name: "Outer Ring Road South",
    roadType: "State Highway",
    location: "Bangalore, KA",
    healthScore: 85,
    riskLevel: "low",
    status: "good",
    contractorName: "National Road Works",
    totalComplaints: 5
  },
  {
    id: 4,
    name: "Andheri-Kurla Road",
    roadType: "Municipal Road",
    location: "Mumbai, MH",
    healthScore: 28,
    riskLevel: "critical",
    status: "deteriorating",
    contractorName: "RoadCraft Solutions",
    totalComplaints: 63
  },
  {
    id: 5,
    name: "Electronic City Flyover",
    roadType: "Elevated Highway",
    location: "Bangalore, KA",
    healthScore: 91,
    riskLevel: "low",
    status: "excellent",
    contractorName: "Infra Prime Builders",
    totalComplaints: 2
  },
  {
    id: 6,
    name: "GST Road",
    roadType: "National Highway",
    location: "Chennai, TN",
    healthScore: 62,
    riskLevel: "medium",
    status: "active",
    contractorName: "National Road Works",
    totalComplaints: 18
  },
  {
    id: 7,
    name: "AIIMS Delhi Stretch",
    roadType: "State Highway",
    location: "Delhi",
    healthScore: 22,
    riskLevel: "critical",
    status: "deteriorating",
    contractorName: "QuickFix Road Services",
    totalComplaints: 89
  },
  {
    id: 8,
    name: "Mumbai-Pune Expressway Sec-3",
    roadType: "Expressway",
    location: "Pune, MH",
    healthScore: 88,
    riskLevel: "low",
    status: "excellent",
    contractorName: "BuildRight Infrastructure",
    totalComplaints: 3
  }
];

function normalizeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];

  if (!value || typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;
  const possibleKeys = ["data", "items", "results", "rows", "list", "roads"];

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

function HealthBar({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, safeNumber(score)));
  const color = getHealthColor(safeScore);

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--muted))" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${safeScore}%`, background: color }}
        />
      </div>

      <span className="w-8 text-xs font-bold" style={{ color }}>
        {safeScore.toFixed(0)}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  const color =
    normalizedStatus === "excellent"
      ? "#16A34A"
      : normalizedStatus === "deteriorating"
        ? "#DC2626"
        : normalizedStatus === "good"
          ? "#0EA5A4"
          : "hsl(var(--muted-foreground))";

  const background =
    normalizedStatus === "excellent"
      ? "#16A34A20"
      : normalizedStatus === "deteriorating"
        ? "#DC262620"
        : normalizedStatus === "good"
          ? "rgba(14,165,164,0.15)"
          : "hsl(var(--muted))";

  return (
    <span
      className="rounded-full px-2 py-1 text-xs capitalize"
      style={{ background, color }}
    >
      {status}
    </span>
  );
}

export default function Roads() {
  const { data: roads, isLoading } = useListRoads();
  const [search, setSearch] = useState("");

  const roadList = useMemo(() => normalizeArray<Road>(roads, MOCK_ROADS), [roads]);

  const filteredRoads = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return roadList;

    return roadList.filter((road) => {
      const name = safeText(road.name, "").toLowerCase();
      const location = safeText(road.location, "").toLowerCase();
      const contractor = safeText(road.contractorName, "").toLowerCase();
      const type = safeText(road.roadType, "").toLowerCase();

      return (
        name.includes(query) ||
        location.includes(query) ||
        contractor.includes(query) ||
        type.includes(query)
      );
    });
  }, [roadList, search]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Road DNA
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Digital profiles for every monitored road
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search roads by name, location, contractor, or type..."
          className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))"
          }}
        />
      </div>

      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))"
        }}
      >
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
                {[
                  "Road Name",
                  "Type",
                  "Location",
                  "Health Score",
                  "Risk Level",
                  "Status",
                  "Complaints",
                  "Action"
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={8} className="px-4 py-3">
                      <div
                        className="h-4 animate-pulse rounded"
                        style={{ background: "hsl(var(--muted))" }}
                      />
                    </td>
                  </tr>
                ))
              ) : filteredRoads.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No roads found for your search.
                  </td>
                </tr>
              ) : (
                filteredRoads.map((road) => {
                  const id = road.id;
                  const name = safeText(road.name, "Unnamed Road");
                  const roadType = safeText(road.roadType);
                  const location = safeText(road.location);
                  const riskLevel = safeText(road.riskLevel, "medium").toLowerCase();
                  const status = safeText(road.status, "active");
                  const healthScore = safeNumber(road.healthScore);
                  const totalComplaints = safeNumber(road.totalComplaints);

                  return (
                    <tr key={id} className="transition-opacity hover:opacity-90">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium">{name}</div>
                        {road.contractorName && (
                          <div className="text-xs text-muted-foreground">
                            {road.contractorName}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {roadType}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {location}
                        </div>
                      </td>

                      <td className="w-36 px-4 py-3">
                        <HealthBar score={healthScore} />
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2 py-1 text-xs font-medium capitalize"
                          style={{
                            background: `${getRiskColor(riskLevel)}20`,
                            color: getRiskColor(riskLevel)
                          }}
                        >
                          {riskLevel}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={status} />
                      </td>

                      <td className="px-4 py-3 text-sm">{totalComplaints}</td>

                      <td className="px-4 py-3">
                        <Link href={`/roads/${id}`}>
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium"
                            style={{
                              background: "rgba(14,165,164,0.15)",
                              color: "#0EA5A4"
                            }}
                          >
                            DNA <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}