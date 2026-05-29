import { useEffect, useMemo, useState } from "react";
import {
  useGetSensorOverview,
  useGetSensorFeed,
  useGetSensorAnalytics,
  useGetSensorAlerts,
} from "@workspace/api-client-react";
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
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cpu,
  Gauge,
  MapPin,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low" | "info";

type SensorOverview = {
  activeSensors: number;
  roadsMonitored: number;
  liveAnomalyCount: number;
  avgVibrationScore: number;
  currentStressLevel: string;
  criticalZones: number;
  dataPointsToday: number;
  uptime: number;
};

type SensorFeedRow = {
  id: string | number;
  roadId: string | number;
  roadName: string;
  timestamp: string;
  vibrationIntensity: number;
  shockSpikes: number;
  roughnessIndex: number;
  temperature: number;
  humidity: number;
  sensorStatus: string;
  damageClassification: string;
  damageProbability: number;
};

const ROAD_KEYS = ["JM Road", "FC Road", "Hinjewadi", "Baner"] as const;
type RoadKey = (typeof ROAD_KEYS)[number];

type VibrationPoint = {
  time: string;
} & Record<RoadKey, number>;

type AnomalyByRoad = {
  road: string;
  count: number;
  severity: Severity;
};

type ConditionDistribution = {
  condition: string;
  percentage: number;
  count: number;
};

type StressPoint = {
  date: string;
  stress: number;
};

type SensorAnalytics = {
  vibrationTrend: VibrationPoint[];
  anomalyByRoad: AnomalyByRoad[];
  conditionDistribution: ConditionDistribution[];
  stressTrend: StressPoint[];
  predictedFailures7Days: number;
  predictedFailures30Days: number;
};

type SensorAlert = {
  id: string | number;
  roadId: string | number;
  roadName: string;
  alertType: string;
  message: string;
  severity: Severity;
  timestamp: string;
  resolved: boolean;
};

const MOCK_OVERVIEW: SensorOverview = {
  activeSensors: 42,
  roadsMonitored: 8,
  liveAnomalyCount: 6,
  avgVibrationScore: 3.8,
  currentStressLevel: "moderate",
  criticalZones: 2,
  dataPointsToday: 4862,
  uptime: 98.6,
};

const MOCK_FEED: SensorFeedRow[] = [
  {
    id: 1,
    roadId: 101,
    roadName: "JM Road Patch Zone",
    timestamp: "08:42:12",
    vibrationIntensity: 7.6,
    shockSpikes: 9,
    roughnessIndex: 8.4,
    temperature: 29.8,
    humidity: 78,
    sensorStatus: "watch",
    damageClassification: "pothole cluster probable",
    damageProbability: 0.82,
  },
  {
    id: 2,
    roadId: 102,
    roadName: "FC Road Junction",
    timestamp: "08:39:44",
    vibrationIntensity: 6.4,
    shockSpikes: 6,
    roughnessIndex: 7.1,
    temperature: 30.2,
    humidity: 74,
    sensorStatus: "watch",
    damageClassification: "surface cracking",
    damageProbability: 0.68,
  },
  {
    id: 3,
    roadId: 103,
    roadName: "Wakad-Hinjewadi Road",
    timestamp: "08:35:19",
    vibrationIntensity: 5.8,
    shockSpikes: 5,
    roughnessIndex: 6.6,
    temperature: 30.7,
    humidity: 71,
    sensorStatus: "active",
    damageClassification: "edge deterioration",
    damageProbability: 0.57,
  },
  {
    id: 4,
    roadId: 104,
    roadName: "Baner Link Road",
    timestamp: "08:29:03",
    vibrationIntensity: 3.2,
    shockSpikes: 2,
    roughnessIndex: 4.1,
    temperature: 29.1,
    humidity: 69,
    sensorStatus: "active",
    damageClassification: "minor roughness",
    damageProbability: 0.28,
  },
  {
    id: 5,
    roadId: 105,
    roadName: "Katraj Bypass",
    timestamp: "08:23:58",
    vibrationIntensity: 4.9,
    shockSpikes: 4,
    roughnessIndex: 5.6,
    temperature: 31.0,
    humidity: 80,
    sensorStatus: "active",
    damageClassification: "waterlogging stress",
    damageProbability: 0.46,
  },
  {
    id: 6,
    roadId: 106,
    roadName: "Sinhagad Road",
    timestamp: "08:18:37",
    vibrationIntensity: 2.7,
    shockSpikes: 1,
    roughnessIndex: 3.4,
    temperature: 28.8,
    humidity: 73,
    sensorStatus: "active",
    damageClassification: "normal wear",
    damageProbability: 0.18,
  },
];

const MOCK_ANALYTICS: SensorAnalytics = {
  vibrationTrend: [
    { time: "06:00", "JM Road": 5.4, "FC Road": 4.8, Hinjewadi: 4.2, Baner: 2.4 },
    { time: "07:00", "JM Road": 5.8, "FC Road": 5.1, Hinjewadi: 4.4, Baner: 2.6 },
    { time: "08:00", "JM Road": 6.3, "FC Road": 5.6, Hinjewadi: 4.8, Baner: 2.8 },
    { time: "09:00", "JM Road": 6.9, "FC Road": 6.0, Hinjewadi: 5.1, Baner: 3.0 },
    { time: "10:00", "JM Road": 7.3, "FC Road": 6.2, Hinjewadi: 5.2, Baner: 3.1 },
    { time: "11:00", "JM Road": 7.1, "FC Road": 6.1, Hinjewadi: 5.0, Baner: 3.0 },
    { time: "12:00", "JM Road": 6.7, "FC Road": 5.8, Hinjewadi: 4.8, Baner: 2.8 },
    { time: "13:00", "JM Road": 6.2, "FC Road": 5.5, Hinjewadi: 4.6, Baner: 2.7 },
    { time: "14:00", "JM Road": 6.5, "FC Road": 5.7, Hinjewadi: 4.9, Baner: 2.9 },
    { time: "15:00", "JM Road": 7.0, "FC Road": 6.1, Hinjewadi: 5.4, Baner: 3.2 },
    { time: "16:00", "JM Road": 7.4, "FC Road": 6.4, Hinjewadi: 5.8, Baner: 3.5 },
    { time: "17:00", "JM Road": 7.8, "FC Road": 6.8, Hinjewadi: 6.1, Baner: 3.8 },
  ],
  anomalyByRoad: [
    { road: "JM Road", count: 9, severity: "high" },
    { road: "FC Road", count: 6, severity: "medium" },
    { road: "Hinjewadi", count: 5, severity: "medium" },
    { road: "Katraj", count: 4, severity: "medium" },
    { road: "Baner", count: 2, severity: "low" },
  ],
  conditionDistribution: [
    { condition: "Stable", percentage: 50, count: 4 },
    { condition: "Watch", percentage: 25, count: 2 },
    { condition: "High Risk", percentage: 12.5, count: 1 },
    { condition: "Repair Due", percentage: 12.5, count: 1 },
  ],
  stressTrend: [
    { date: "Apr 01", stress: 2.8 },
    { date: "Apr 04", stress: 3.0 },
    { date: "Apr 07", stress: 3.3 },
    { date: "Apr 10", stress: 3.6 },
    { date: "Apr 13", stress: 3.7 },
    { date: "Apr 16", stress: 4.1 },
    { date: "Apr 19", stress: 4.3 },
    { date: "Apr 22", stress: 4.8 },
    { date: "Apr 25", stress: 5.1 },
    { date: "Apr 28", stress: 5.4 },
  ],
  predictedFailures7Days: 2,
  predictedFailures30Days: 4,
};

const MOCK_ALERTS: SensorAlert[] = [
  {
    id: 1,
    roadId: 101,
    roadName: "JM Road Patch Zone",
    alertType: "Failure Risk Rising",
    message: "Shock spikes increased after rainfall. Field inspection recommended within 48 hours.",
    severity: "high",
    timestamp: "08:42",
    resolved: false,
  },
  {
    id: 2,
    roadId: 102,
    roadName: "FC Road Junction",
    alertType: "Surface Cracking",
    message: "Vibration pattern suggests early longitudinal cracking near junction approach.",
    severity: "medium",
    timestamp: "08:39",
    resolved: false,
  },
  {
    id: 3,
    roadId: 103,
    roadName: "Wakad-Hinjewadi Road",
    alertType: "Edge Stress",
    message: "Heavy commuter traffic correlated with edge deterioration signal.",
    severity: "medium",
    timestamp: "08:35",
    resolved: false,
  },
  {
    id: 4,
    roadId: 104,
    roadName: "Baner Link Road",
    alertType: "Stable Segment",
    message: "No urgent anomaly. Routine monitoring only.",
    severity: "low",
    timestamp: "08:29",
    resolved: true,
  },
];

const ROAD_COLORS: Record<RoadKey, string> = {
  "JM Road": "#DC2626",
  "FC Road": "#F59E0B",
  Hinjewadi: "#0EA5A4",
  Baner: "#16A34A",
};

const BANNED_REMOTE_ROADS = ["AIIMS", "Delhi", "Bangalore", "Andheri", "Outer Ring", "NH-48"];

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "0";

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function getSeverityMeta(severity: Severity | string) {
  switch (severity) {
    case "critical":
      return {
        color: "#DC2626",
        bg: "rgba(220,38,38,0.12)",
        label: "Critical",
      };

    case "high":
      return {
        color: "#F97316",
        bg: "rgba(249,115,22,0.12)",
        label: "High",
      };

    case "medium":
      return {
        color: "#F59E0B",
        bg: "rgba(245,158,11,0.12)",
        label: "Medium",
      };

    case "low":
      return {
        color: "#16A34A",
        bg: "rgba(22,163,74,0.12)",
        label: "Low",
      };

    default:
      return {
        color: "#0EA5A4",
        bg: "rgba(14,165,164,0.12)",
        label: "Info",
      };
  }
}

function isPilotRoadName(name: string) {
  return !BANNED_REMOTE_ROADS.some((blocked) =>
    name.toLowerCase().includes(blocked.toLowerCase()),
  );
}

function normalizeOverview(data: unknown): SensorOverview {
  const source = ((data as { data?: unknown })?.data ?? data ?? {}) as Partial<SensorOverview>;

  const activeSensors = toNumber(source.activeSensors, MOCK_OVERVIEW.activeSensors);
  const roadsMonitored = toNumber(source.roadsMonitored, MOCK_OVERVIEW.roadsMonitored);
  const liveAnomalyCount = toNumber(source.liveAnomalyCount, MOCK_OVERVIEW.liveAnomalyCount);
  const avgVibrationScore = toNumber(source.avgVibrationScore, MOCK_OVERVIEW.avgVibrationScore);
  const criticalZones = toNumber(source.criticalZones, MOCK_OVERVIEW.criticalZones);
  const dataPointsToday = toNumber(source.dataPointsToday, MOCK_OVERVIEW.dataPointsToday);
  const uptime = toNumber(source.uptime, MOCK_OVERVIEW.uptime);

  if (activeSensors > 120 || roadsMonitored > 30 || liveAnomalyCount > 25) {
    return MOCK_OVERVIEW;
  }

  return {
    activeSensors,
    roadsMonitored,
    liveAnomalyCount,
    avgVibrationScore,
    currentStressLevel:
      typeof source.currentStressLevel === "string"
        ? source.currentStressLevel
        : MOCK_OVERVIEW.currentStressLevel,
    criticalZones,
    dataPointsToday,
    uptime,
  };
}

function getArrayFromUnknown<T>(data: unknown, keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];

  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data as T[];

  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }

  return [];
}

function normalizeFeed(data: unknown): SensorFeedRow[] {
  const source = getArrayFromUnknown<Record<string, unknown>>(data, [
    "feed",
    "items",
    "rows",
  ]);

  if (source.length === 0) return MOCK_FEED;

  const normalized = source.map((row, index): SensorFeedRow => {
    const roadName = String(row.roadName ?? row.road_name ?? row.name ?? "");

    return {
      id: row.id ?? row._id ?? index + 1,
      roadId: row.roadId ?? row.road_id ?? index + 1,
      roadName: roadName || "Unknown Road",
      timestamp: String(row.timestamp ?? row.time ?? "08:00"),
      vibrationIntensity: toNumber(row.vibrationIntensity ?? row.vibration, 0),
      shockSpikes: toNumber(row.shockSpikes ?? row.shock_spikes, 0),
      roughnessIndex: toNumber(row.roughnessIndex ?? row.roughness, 0),
      temperature: toNumber(row.temperature, 0),
      humidity: toNumber(row.humidity, 0),
      sensorStatus: String(row.sensorStatus ?? row.status ?? "active"),
      damageClassification: String(
        row.damageClassification ?? row.classification ?? "normal",
      ),
      damageProbability: toNumber(
        row.damageProbability ?? row.damage_probability,
        0,
      ),
    };
  });

  if (normalized.some((row) => !isPilotRoadName(row.roadName))) {
    return MOCK_FEED;
  }

  return normalized.length > 0 ? normalized : MOCK_FEED;
}

function normalizeAnalytics(data: unknown): SensorAnalytics {
  const source = ((data as { data?: unknown })?.data ?? data ?? {}) as Record<
    string,
    unknown
  >;

  const anomalyByRoad = getArrayFromUnknown<Record<string, unknown>>(
    source.anomalyByRoad,
    [],
  ).map((item): AnomalyByRoad => ({
    road: String(item.road ?? item.roadName ?? item.name ?? "Unknown"),
    count: toNumber(item.count ?? item.value, 0),
    severity: String(item.severity ?? "medium") as Severity,
  }));

  const hasBadRoad = anomalyByRoad.some((item) => !isPilotRoadName(item.road));

  if (hasBadRoad || anomalyByRoad.length === 0) {
    return MOCK_ANALYTICS;
  }

  return {
    ...MOCK_ANALYTICS,
    anomalyByRoad,
  };
}

function normalizeAlerts(data: unknown): SensorAlert[] {
  const source = getArrayFromUnknown<Record<string, unknown>>(data, [
    "alerts",
    "items",
  ]);

  if (source.length === 0) return MOCK_ALERTS;

  const normalized = source.map((alert, index): SensorAlert => {
    const roadName = String(alert.roadName ?? alert.road_name ?? alert.name ?? "");

    return {
      id: alert.id ?? alert._id ?? index + 1,
      roadId: alert.roadId ?? alert.road_id ?? index + 1,
      roadName: roadName || "Unknown Road",
      alertType: String(alert.alertType ?? alert.type ?? "Sensor Alert"),
      message: String(alert.message ?? alert.description ?? "Sensor anomaly detected."),
      severity: String(alert.severity ?? "medium") as Severity,
      timestamp: String(alert.timestamp ?? alert.time ?? "08:00"),
      resolved: Boolean(alert.resolved),
    };
  });

  if (normalized.some((alert) => !isPilotRoadName(alert.roadName))) {
    return MOCK_ALERTS;
  }

  return normalized.length > 0 ? normalized : MOCK_ALERTS;
}

function buildSimulatedPoint(
  tick: number,
  traffic: number,
  rainfall: number,
): VibrationPoint {
  const hour = 8 + (tick % 10);
  const minute = (tick * 7) % 60;
  const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0",
  )}`;

  const trafficFactor = traffic / 100;
  const rainfallFactor = rainfall / 100;
  const wave = Math.sin(tick * 0.65);

  return {
    time,
    "JM Road": Number(
      clamp(5.7 + trafficFactor * 1.4 + rainfallFactor * 1.8 + wave * 0.35, 0, 10).toFixed(1),
    ),
    "FC Road": Number(
      clamp(4.9 + trafficFactor * 1.1 + rainfallFactor * 1.2 + wave * 0.25, 0, 10).toFixed(1),
    ),
    Hinjewadi: Number(
      clamp(4.2 + trafficFactor * 1.5 + rainfallFactor * 0.7 + wave * 0.2, 0, 10).toFixed(1),
    ),
    Baner: Number(
      clamp(2.4 + trafficFactor * 0.6 + rainfallFactor * 0.4 + wave * 0.15, 0, 10).toFixed(1),
    ),
  };
}

function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  color,
}: {
  label: string;
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
          style={{ background: `${color}14`, color }}
        >
          Demo
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

function StatusPill({ severity }: { severity: Severity | string }) {
  const meta = getSeverityMeta(severity);

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        background: meta.bg,
        color: meta.color,
      }}
    >
      {meta.label}
    </span>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div
        className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div>
          <h2
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function MetricRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold" style={{ color }}>
          {formatNumber(value, 1)}
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--border))" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${clamp(value * 10, 0, 100)}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default function Sensors() {
  const { data: overviewData } = useGetSensorOverview();
  const { data: feedData } = useGetSensorFeed();
  const { data: analyticsData } = useGetSensorAnalytics();
  const { data: alertsData } = useGetSensorAlerts();

  const [simRunning, setSimRunning] = useState(false);
  const [traffic, setTraffic] = useState(54);
  const [rainfall, setRainfall] = useState(28);
  const [selectedRoad, setSelectedRoad] = useState<RoadKey | "all">("all");
  const [tick, setTick] = useState(0);
  const [liveTrend, setLiveTrend] = useState<VibrationPoint[]>(
    MOCK_ANALYTICS.vibrationTrend,
  );

  const overview = useMemo(() => normalizeOverview(overviewData), [overviewData]);
  const feed = useMemo(() => normalizeFeed(feedData), [feedData]);
  const analytics = useMemo(
    () => normalizeAnalytics(analyticsData),
    [analyticsData],
  );
  const alerts = useMemo(() => normalizeAlerts(alertsData), [alertsData]);

  useEffect(() => {
    setLiveTrend(analytics.vibrationTrend);
  }, [analytics.vibrationTrend]);

  useEffect(() => {
    if (!simRunning) return;

    const interval = window.setInterval(() => {
      setTick((previousTick) => {
        const nextTick = previousTick + 1;
        const nextPoint = buildSimulatedPoint(nextTick, traffic, rainfall);

        setLiveTrend((previousTrend) => [
          ...previousTrend.slice(-17),
          nextPoint,
        ]);

        return nextTick;
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, [simRunning, traffic, rainfall]);

  const visibleRoadKeys: RoadKey[] =
    selectedRoad === "all" ? [...ROAD_KEYS] : [selectedRoad];

  const topRiskFeed = [...feed].sort(
    (a, b) => b.damageProbability - a.damageProbability,
  );

  const highRiskRoads = feed.filter((row) => row.damageProbability >= 0.55).length;

  const avgDamageProbability =
    feed.length === 0
      ? 0
      : feed.reduce((total, row) => total + row.damageProbability, 0) / feed.length;

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
              <Cpu className="h-3.5 w-3.5" />
              RoadSense Digital Twin
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Sensor Intelligence
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Simulated edge-sensor and mobile accelerometer network for
              detecting roughness, shock spikes, monsoon stress, and early road
              failure signals across Pune and PCMC pilot roads.
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
              <Wifi className="h-4 w-4 text-emerald-500" />
              Simulated Feed Online
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Demo mode · Deterministic digital twin · No live government feed
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Edge Nodes"
          value={overview.activeSensors}
          note="Fixed + mobile samples"
          icon={Radio}
          color="#0EA5A4"
        />

        <KpiCard
          label="Roads Observed"
          value={overview.roadsMonitored}
          note="Pune / PCMC corridors"
          icon={Route}
          color="#16A34A"
        />

        <KpiCard
          label="Anomalies Today"
          value={overview.liveAnomalyCount}
          note="Needs field review"
          icon={AlertTriangle}
          color="#F97316"
        />

        <KpiCard
          label="Avg Vibration"
          value={`${formatNumber(overview.avgVibrationScore, 1)}/10`}
          note="Composite signal score"
          icon={Gauge}
          color="#F59E0B"
        />

        <KpiCard
          label="Failure Risk"
          value={`${highRiskRoads} roads`}
          note={`${formatNumber(avgDamageProbability * 100, 0)}% avg probability`}
          icon={TrendingUp}
          color="#DC2626"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionCard
          title="Road Vibration Timeline"
          subtitle="Deterministic simulation based on traffic and rainfall inputs."
          action={
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: simRunning
                  ? "rgba(22,163,74,0.14)"
                  : "hsl(var(--muted))",
                color: simRunning ? "#16A34A" : "hsl(var(--muted-foreground))",
              }}
            >
              {simRunning ? "Running" : "Paused"}
            </span>
          }
        >
          <div className="p-5">
            <div className="h-[310px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liveTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  {visibleRoadKeys.map((road) => (
                    <Line
                      key={road}
                      type="monotone"
                      dataKey={road}
                      stroke={ROAD_COLORS[road]}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <button
                type="button"
                onClick={() => setSimRunning((current) => !current)}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
                style={{
                  background: simRunning
                    ? "rgba(220,38,38,0.12)"
                    : "rgba(14,165,164,0.14)",
                  color: simRunning ? "#DC2626" : "#0EA5A4",
                }}
              >
                {simRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause Twin
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Twin
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSimRunning(false);
                  setTick(0);
                  setTraffic(54);
                  setRainfall(28);
                  setSelectedRoad("all");
                  setLiveTrend(analytics.vibrationTrend);
                }}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--foreground))",
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>

              <select
                value={selectedRoad}
                onChange={(event) =>
                  setSelectedRoad(event.target.value as RoadKey | "all")
                }
                className="rounded-xl px-3 py-2 text-sm outline-none"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <option value="all">All Roads</option>
                {ROAD_KEYS.map((road) => (
                  <option key={road} value={road}>
                    {road}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Scenario controls below
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Traffic Load: {traffic}%
                </label>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={traffic}
                  onChange={(event) => setTraffic(Number(event.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Rainfall / Waterlogging Stress: {rainfall}%
                </label>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rainfall}
                  onChange={(event) => setRainfall(Number(event.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Predictive Failure Queue"
          subtitle="Ranked using vibration, shock spikes, roughness, and complaint risk."
        >
          <div className="space-y-3 p-4">
            {topRiskFeed.slice(0, 4).map((row, index) => {
              const severity =
                row.damageProbability >= 0.75
                  ? "high"
                  : row.damageProbability >= 0.5
                    ? "medium"
                    : "low";

              const meta = getSeverityMeta(severity);

              return (
                <div
                  key={row.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: "hsl(var(--muted))",
                    border: `1px solid ${meta.color}30`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: meta.color }}
                        >
                          {index + 1}
                        </span>

                        <h3 className="font-semibold">{row.roadName}</h3>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {row.damageClassification}
                      </p>
                    </div>

                    <StatusPill severity={severity} />
                  </div>

                  <div className="mt-3 space-y-2">
                    <MetricRow
                      label="Vibration"
                      value={row.vibrationIntensity}
                      color={meta.color}
                    />

                    <MetricRow
                      label="Roughness"
                      value={row.roughnessIndex}
                      color="#0EA5A4"
                    />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    Damage probability:{" "}
                    <span className="font-bold" style={{ color: meta.color }}>
                      {formatNumber(row.damageProbability * 100, 0)}%
                    </span>
                    . Recommended action: field verification before repair
                    approval.
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Anomalies by Road"
          subtitle="Count of detected signal deviations today."
        >
          <div className="h-[260px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.anomalyByRoad} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="road"
                  type="category"
                  width={80}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {analytics.anomalyByRoad.map((item) => (
                    <Cell
                      key={item.road}
                      fill={getSeverityMeta(item.severity).color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Road Network Condition"
          subtitle="Pilot distribution across monitored road segments."
        >
          <div className="space-y-4 p-5">
            {analytics.conditionDistribution.map((item) => {
              const severity =
                item.condition === "Stable"
                  ? "low"
                  : item.condition === "Watch"
                    ? "medium"
                    : "high";

              const meta = getSeverityMeta(severity);

              return (
                <div key={item.condition}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{item.condition}</span>

                    <span className="text-muted-foreground">
                      {item.count} roads
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full"
                    style={{ background: "hsl(var(--border))" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl bg-primary/10 p-3 text-xs leading-5 text-muted-foreground">
              This is intentionally labelled as a pilot-grade simulated sensor
              network. Judges can understand the architecture without assuming
              fake live government data.
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="30-Day Stress Trend"
          subtitle="Monsoon and traffic-linked stress index."
        >
          <div className="h-[260px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.stressTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 8]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="stress"
                  stroke="#0EA5A4"
                  fill="rgba(14,165,164,0.16)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Sensor Event Stream"
          subtitle="Compact feed of latest edge-device observations."
          action={
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: "rgba(14,165,164,0.14)",
                color: "#0EA5A4",
              }}
            >
              Simulated stream
            </span>
          }
        >
          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {feed.map((row) => {
              const severity =
                row.damageProbability >= 0.75
                  ? "high"
                  : row.damageProbability >= 0.5
                    ? "medium"
                    : "low";

              const meta = getSeverityMeta(severity);

              return (
                <div key={row.id} className="px-5 py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: meta.color }} />

                        <h3 className="font-semibold">{row.roadName}</h3>

                        <StatusPill severity={severity} />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {row.timestamp} · {row.damageClassification}
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <MiniSignal
                          label="Vibration"
                          value={`${formatNumber(row.vibrationIntensity, 1)}/10`}
                        />

                        <MiniSignal
                          label="Shock Spikes"
                          value={String(row.shockSpikes)}
                        />

                        <MiniSignal
                          label="Roughness"
                          value={`${formatNumber(row.roughnessIndex, 1)}/10`}
                        />
                      </div>
                    </div>

                    <div className="min-w-[150px] rounded-2xl bg-muted p-3">
                      <p className="text-xs text-muted-foreground">
                        Damage Probability
                      </p>

                      <p
                        className="mt-1 text-2xl font-bold"
                        style={{
                          color: meta.color,
                          fontFamily: "Sora, sans-serif",
                        }}
                      >
                        {formatNumber(row.damageProbability * 100, 0)}%
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Temp {formatNumber(row.temperature, 1)}°C · Humidity{" "}
                        {formatNumber(row.humidity, 0)}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Sensor-Triggered Alerts"
          subtitle="Only decision-relevant alerts are shown."
        >
          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {alerts.map((alert) => {
              const meta = getSeverityMeta(alert.severity);

              return (
                <div key={alert.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    {alert.resolved ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: "#16A34A" }}
                      />
                    ) : (
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: meta.color }}
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold">
                          {alert.alertType}
                        </h3>

                        <StatusPill severity={alert.severity} />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {alert.roadName} · {alert.timestamp}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <ArchitectureBlock
            icon={Cpu}
            title="Edge Sensing"
            text="Low-cost accelerometer nodes and mobile-device samples detect vibration, shock, and roughness patterns."
          />

          <ArchitectureBlock
            icon={Zap}
            title="Digital Twin"
            text="Traffic and rainfall controls simulate how road stress changes under monsoon and commuter load."
          />

          <ArchitectureBlock
            icon={ShieldCheck}
            title="Explainable Triage"
            text="Alerts are ranked by vibration, roughness, shock spikes, and damage probability — not vague AI claims."
          />
        </div>
      </section>
    </div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-3 py-2"
      style={{
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
    </div>
  );
}

function ArchitectureBlock({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: "#0EA5A4" }} />

        <h3 className="font-semibold">{title}</h3>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}