import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  TrendingDown,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useListRoads } from "@workspace/api-client-react";
import { getHealthColor } from "@/lib/utils";

type RiskLevel = "critical" | "high" | "medium" | "low";
type RoadStatus = "Stable" | "Watch" | "Repair Due" | "Critical";

type Road = {
  id: string | number;
  name: string;
  roadType: string;
  location: string;
  authority: string;
  healthScore: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: RoadStatus;
  contractorName: string;
  totalComplaints: number;
  lastRepair: string;
  nextAction: string;
  surface: string;
  lengthKm: number;
  trafficLoad: string;
  monsoonRisk: number;
  repeatRepairs: number;
};

const MOCK_ROADS: Road[] = [
  {
    id: 1,
    name: "JM Road Patch Zone",
    roadType: "Urban Arterial Road",
    location: "Shivajinagar, Pune",
    authority: "PMC",
    healthScore: 42,
    riskScore: 86,
    riskLevel: "critical",
    status: "Critical",
    contractorName: "UrbanBuild Pune Services",
    totalComplaints: 17,
    lastRepair: "Feb 2026",
    nextAction: "Emergency inspection + contractor audit",
    surface: "Bituminous",
    lengthKm: 1.8,
    trafficLoad: "High",
    monsoonRisk: 82,
    repeatRepairs: 4,
  },
  {
    id: 2,
    name: "FC Road Junction",
    roadType: "Urban Commercial Road",
    location: "Pune Central",
    authority: "PMC",
    healthScore: 56,
    riskScore: 74,
    riskLevel: "high",
    status: "Repair Due",
    contractorName: "UrbanBuild Pune Services",
    totalComplaints: 12,
    lastRepair: "Jan 2026",
    nextAction: "Drainage check + crack sealing",
    surface: "Bituminous",
    lengthKm: 1.2,
    trafficLoad: "High",
    monsoonRisk: 71,
    repeatRepairs: 2,
  },
  {
    id: 3,
    name: "Wakad-Hinjewadi Road",
    roadType: "IT Corridor Road",
    location: "PCMC",
    authority: "PCMC",
    healthScore: 61,
    riskScore: 68,
    riskLevel: "high",
    status: "Repair Due",
    contractorName: "Maharashtra RoadBuild Ltd.",
    totalComplaints: 9,
    lastRepair: "Mar 2026",
    nextAction: "Resurfacing inspection",
    surface: "Bituminous",
    lengthKm: 4.6,
    trafficLoad: "Very High",
    monsoonRisk: 64,
    repeatRepairs: 2,
  },
  {
    id: 4,
    name: "Baner Link Road",
    roadType: "Urban Link Road",
    location: "Baner, Pune",
    authority: "PMC",
    healthScore: 72,
    riskScore: 49,
    riskLevel: "medium",
    status: "Watch",
    contractorName: "Shivneri Infra Works",
    totalComplaints: 6,
    lastRepair: "Dec 2025",
    nextAction: "Preventive crack sealing",
    surface: "Bituminous",
    lengthKm: 2.4,
    trafficLoad: "Medium",
    monsoonRisk: 52,
    repeatRepairs: 1,
  },
  {
    id: 5,
    name: "Katraj Bypass",
    roadType: "State Road Connector",
    location: "Pune South",
    authority: "PWD Maharashtra",
    healthScore: 66,
    riskScore: 41,
    riskLevel: "medium",
    status: "Watch",
    contractorName: "QuickPatch Civil Works",
    totalComplaints: 5,
    lastRepair: "Nov 2025",
    nextAction: "Post-rainfall inspection",
    surface: "Composite",
    lengthKm: 3.1,
    trafficLoad: "Medium",
    monsoonRisk: 69,
    repeatRepairs: 1,
  },
  {
    id: 6,
    name: "Sinhagad Road Patch",
    roadType: "Urban Residential Road",
    location: "Pune South",
    authority: "PMC",
    healthScore: 76,
    riskScore: 29,
    riskLevel: "low",
    status: "Stable",
    contractorName: "QuickPatch Civil Works",
    totalComplaints: 3,
    lastRepair: "Oct 2025",
    nextAction: "Routine monitoring",
    surface: "Bituminous",
    lengthKm: 2.9,
    trafficLoad: "Medium",
    monsoonRisk: 38,
    repeatRepairs: 1,
  },
  {
    id: 7,
    name: "Ravet BRT Service Road",
    roadType: "Service Road",
    location: "PCMC",
    authority: "PCMC",
    healthScore: 81,
    riskScore: 22,
    riskLevel: "low",
    status: "Stable",
    contractorName: "PCMC Infra Maintenance",
    totalComplaints: 2,
    lastRepair: "Sep 2025",
    nextAction: "Routine inspection",
    surface: "Bituminous",
    lengthKm: 2.2,
    trafficLoad: "Medium",
    monsoonRisk: 31,
    repeatRepairs: 0,
  },
  {
    id: 8,
    name: "Aundh Internal Road",
    roadType: "Urban Internal Road",
    location: "Aundh, Pune",
    authority: "PMC",
    healthScore: 84,
    riskScore: 18,
    riskLevel: "low",
    status: "Stable",
    contractorName: "Shivneri Infra Works",
    totalComplaints: 2,
    lastRepair: "Aug 2025",
    nextAction: "Routine inspection only",
    surface: "Bituminous",
    lengthKm: 1.7,
    trafficLoad: "Low",
    monsoonRisk: 27,
    repeatRepairs: 0,
  },
];

const BANNED_REMOTE_TERMS = [
  "AIIMS",
  "Delhi",
  "Bangalore",
  "Andheri",
  "Outer Ring",
  "NH-48",
  "Chennai",
  "GST Road",
  "Electronic City",
];

function normalizeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];

  if (!value || typeof value !== "object") return fallback;

  const record = value as Record<string, unknown>;

  for (const key of ["data", "items", "results", "rows", "list", "roads"]) {
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

function normalizeRiskLevel(value: unknown): RiskLevel {
  const risk = safeText(value, "low").toLowerCase();

  if (risk === "critical") return "critical";
  if (risk === "high") return "high";
  if (risk === "medium") return "medium";

  return "low";
}

function normalizeStatus(value: unknown, riskLevel: RiskLevel): RoadStatus {
  const status = safeText(value, "").toLowerCase();

  if (status.includes("critical") || riskLevel === "critical") return "Critical";
  if (status.includes("repair") || riskLevel === "high") return "Repair Due";
  if (status.includes("watch") || riskLevel === "medium") return "Watch";

  return "Stable";
}

function isPilotRoad(road: Road) {
  const combined = `${road.name} ${road.location}`;
  return !BANNED_REMOTE_TERMS.some((term) =>
    combined.toLowerCase().includes(term.toLowerCase()),
  );
}

function normalizeRoads(value: unknown): Road[] {
  const source = normalizeArray<Record<string, unknown>>(value, []);

  if (source.length === 0) return MOCK_ROADS;

  const normalized = source.map((item, index): Road => {
    const riskLevel = normalizeRiskLevel(item.riskLevel ?? item.risk_level);

    return {
      id: item.id ?? index + 1,
      name: safeText(item.name ?? item.roadName ?? item.road_name, "Pilot Road"),
      roadType: safeText(item.roadType ?? item.type, "Urban Road"),
      location: safeText(item.location ?? item.city, "Pune"),
      authority: safeText(item.authority, "PMC"),
      healthScore: safeNumber(item.healthScore ?? item.health_score, 70),
      riskScore: safeNumber(item.riskScore ?? item.risk_score, 40),
      riskLevel,
      status: normalizeStatus(item.status, riskLevel),
      contractorName: safeText(
        item.contractorName ?? item.contractor_name,
        "Assigned Contractor",
      ),
      totalComplaints: safeNumber(
        item.totalComplaints ?? item.complaints ?? item.complaintCount,
        0,
      ),
      lastRepair: safeText(item.lastRepair ?? item.last_repair, "2026"),
      nextAction: safeText(
        item.nextAction ?? item.recommendedAction,
        "Routine inspection",
      ),
      surface: safeText(item.surface, "Bituminous"),
      lengthKm: safeNumber(item.lengthKm ?? item.length_km, 2.0),
      trafficLoad: safeText(item.trafficLoad ?? item.traffic_load, "Medium"),
      monsoonRisk: safeNumber(item.monsoonRisk ?? item.monsoon_risk, 40),
      repeatRepairs: safeNumber(item.repeatRepairs ?? item.repeat_repairs, 0),
    };
  });

  if (normalized.some((road) => !isPilotRoad(road))) {
    return MOCK_ROADS;
  }

  return normalized;
}

function getRiskColor(risk: RiskLevel) {
  if (risk === "critical") return "#DC2626";
  if (risk === "high") return "#F97316";
  if (risk === "medium") return "#F59E0B";
  return "#16A34A";
}

function getStatusColor(status: RoadStatus) {
  if (status === "Critical") return "#DC2626";
  if (status === "Repair Due") return "#F97316";
  if (status === "Watch") return "#F59E0B";
  return "#16A34A";
}

function HealthBar({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, safeNumber(score)));
  const color = getHealthColor(safeScore);

  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 flex-1 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--border))" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${safeScore}%`, background: color }}
        />
      </div>

      <span className="w-10 text-right text-xs font-bold" style={{ color }}>
        {safeScore}/100
      </span>
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const color = getRiskColor(risk);

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {risk}
    </span>
  );
}

function StatusBadge({ status }: { status: RoadStatus }) {
  const color = getStatusColor(status);

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {status}
    </span>
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
  icon: LucideIcon;
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

function RoadCard({ road }: { road: Road }) {
  const riskColor = getRiskColor(road.riskLevel);
  const statusColor = getStatusColor(road.status);

  return (
    <article
      className="rounded-3xl p-5 transition hover:-translate-y-0.5"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              ROAD-{String(road.id).padStart(3, "0")}
            </span>

            <RiskBadge risk={road.riskLevel} />
            <StatusBadge status={road.status} />
          </div>

          <h3
            className="mt-3 text-xl font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {road.name}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {road.location} · {road.authority}
          </p>
        </div>

        <Link href={`/roads/${road.id}`}>
          <button
            type="button"
            className="rounded-2xl p-2 transition hover:bg-white/10"
            aria-label={`Open ${road.name}`}
          >
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </Link>
      </div>

      <div
        className="mt-5 rounded-2xl p-4"
        style={{
          background: "hsl(var(--muted))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Road Health DNA</span>
          <span className="text-xs font-semibold" style={{ color: riskColor }}>
            Risk {road.riskScore}/100
          </span>
        </div>

        <HealthBar score={road.healthScore} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniMetric label="Complaints" value={road.totalComplaints} />
        <MiniMetric label="Repeat Repairs" value={road.repeatRepairs} />
        <MiniMetric label="Length" value={`${road.lengthKm.toFixed(1)} km`} />
        <MiniMetric label="Monsoon Risk" value={`${road.monsoonRisk}%`} />
      </div>

      <div
        className="mt-4 rounded-2xl p-3"
        style={{
          background: `${statusColor}0F`,
          border: `1px solid ${statusColor}24`,
        }}
      >
        <p className="text-xs font-semibold" style={{ color: statusColor }}>
          Next Action
        </p>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {road.nextAction}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{road.roadType}</span>
        <span>{road.contractorName}</span>
      </div>
    </article>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
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
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

export default function Roads() {
  const { data: roadsData, isLoading } = useListRoads();

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");

  const roads = useMemo(() => normalizeRoads(roadsData), [roadsData]);

  const filteredRoads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roads.filter((road) => {
      const matchesSearch =
        query.length === 0 ||
        `${road.name} ${road.location} ${road.authority} ${road.contractorName}`
          .toLowerCase()
          .includes(query);

      const matchesRisk = riskFilter === "all" || road.riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [roads, search, riskFilter]);

  const stats = useMemo(() => {
    const avgHealth =
      roads.length === 0
        ? 0
        : Math.round(
            roads.reduce((total, road) => total + road.healthScore, 0) /
              roads.length,
          );

    const critical = roads.filter((road) => road.riskLevel === "critical").length;
    const repairDue = roads.filter((road) => road.status === "Repair Due").length;
    const complaints = roads.reduce(
      (total, road) => total + road.totalComplaints,
      0,
    );

    return { avgHealth, critical, repairDue, complaints };
  }, [roads]);

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
              <Route className="h-3.5 w-3.5" />
              ROAD DNA Engine
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Road DNA Registry
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              A clean road-level intelligence layer for Pune / PCMC pilot roads:
              health, risk, complaints, repairs, contractor quality, and next
              maintenance action.
            </p>
          </div>

          <Link href="/scan">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
            >
              <Wrench className="h-4 w-4" />
              Run Road Scan
            </button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Roads Monitored"
          value={roads.length}
          note="Pune / PCMC pilot"
          color="#0EA5A4"
          icon={Route}
        />

        <StatCard
          label="Avg Health"
          value={`${stats.avgHealth}/100`}
          note="Composite DNA score"
          color="#3B82F6"
          icon={Activity}
        />

        <StatCard
          label="Critical Roads"
          value={stats.critical}
          note="Immediate review"
          color="#DC2626"
          icon={AlertTriangle}
        />

        <StatCard
          label="Complaints Linked"
          value={stats.complaints}
          note="Road-level signals"
          color="#F59E0B"
          icon={Clock3}
        />
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Search Road DNA
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Filter by road, locality, contractor, authority, or risk level.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-3"
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <Search className="h-4 w-4 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search road, area, contractor..."
                className="w-full min-w-[240px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <select
              value={riskFilter}
              onChange={(event) =>
                setRiskFilter(event.target.value as RiskLevel | "all")
              }
              className="rounded-2xl px-4 py-3 text-sm outline-none"
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredRoads.map((road) => (
          <RoadCard key={road.id} road={road} />
        ))}
      </section>

      {filteredRoads.length === 0 && (
        <section
          className="rounded-3xl p-8 text-center"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h3 className="font-semibold">No roads found</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or risk filter.
          </p>
        </section>
      )}

      {isLoading && (
        <div className="text-center text-xs text-muted-foreground">
          Syncing Road DNA records...
        </div>
      )}
    </div>
  );
}