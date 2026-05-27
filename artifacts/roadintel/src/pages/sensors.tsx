import { useEffect, useMemo, useState } from "react";
import {
  useGetSensorOverview,
  useGetSensorFeed,
  useGetSensorAnalytics,
  useGetSensorAlerts,
} from "@workspace/api-client-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Radio,
  Activity,
  AlertTriangle,
  TrendingUp,
  Zap,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";

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

type VibrationPoint = {
  time: string;
  "NH-48": number;
  "Andheri-Kurla": number;
  "MG Road": number;
  "Outer Ring": number;
};

type AnomalyByRoad = {
  road: string;
  count: number;
  severity: string;
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
  severity: string;
  timestamp: string;
  resolved: boolean;
};

const MOCK_OVERVIEW: SensorOverview = {
  activeSensors: 847,
  roadsMonitored: 8,
  liveAnomalyCount: 34,
  avgVibrationScore: 4.2,
  currentStressLevel: "medium",
  criticalZones: 3,
  dataPointsToday: 12847,
  uptime: 99.7,
};

const MOCK_FEED: SensorFeedRow[] = [
  {
    id: 1,
    roadId: 2,
    roadName: "NH-48 Stretch",
    timestamp: "08:01:23",
    vibrationIntensity: 8.7,
    shockSpikes: 12,
    roughnessIndex: 9.8,
    temperature: 31.2,
    humidity: 65,
    sensorStatus: "active",
    damageClassification: "severe anomaly",
    damageProbability: 0.89,
  },
  {
    id: 2,
    roadId: 4,
    roadName: "Andheri-Kurla Road",
    timestamp: "08:02:15",
    vibrationIntensity: 9.1,
    shockSpikes: 15,
    roughnessIndex: 11.2,
    temperature: 30.0,
    humidity: 80,
    sensorStatus: "critical",
    damageClassification: "likely failure zone",
    damageProbability: 0.95,
  },
  {
    id: 3,
    roadId: 7,
    roadName: "AIIMS Delhi Stretch",
    timestamp: "08:03:44",
    vibrationIntensity: 9.8,
    shockSpikes: 18,
    roughnessIndex: 12.5,
    temperature: 32.1,
    humidity: 60,
    sensorStatus: "critical",
    damageClassification: "likely failure zone",
    damageProbability: 0.97,
  },
  {
    id: 4,
    roadId: 1,
    roadName: "MG Road",
    timestamp: "08:04:02",
    vibrationIntensity: 4.2,
    shockSpikes: 3,
    roughnessIndex: 5.1,
    temperature: 28.5,
    humidity: 72,
    sensorStatus: "active",
    damageClassification: "rough road",
    damageProbability: 0.45,
  },
  {
    id: 5,
    roadId: 6,
    roadName: "GST Road",
    timestamp: "08:05:17",
    vibrationIntensity: 3.8,
    shockSpikes: 2,
    roughnessIndex: 4.2,
    temperature: 29.5,
    humidity: 75,
    sensorStatus: "active",
    damageClassification: "rough road",
    damageProbability: 0.38,
  },
  {
    id: 6,
    roadId: 3,
    roadName: "Outer Ring Road South",
    timestamp: "08:06:55",
    vibrationIntensity: 1.8,
    shockSpikes: 0,
    roughnessIndex: 2.1,
    temperature: 27.8,
    humidity: 68,
    sensorStatus: "active",
    damageClassification: "smooth road",
    damageProbability: 0.05,
  },
];

const MOCK_ANALYTICS: SensorAnalytics = {
  vibrationTrend: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    "NH-48": Number((7 + Math.sin(i * 0.4) * 1.3 + 1.1).toFixed(1)),
    "Andheri-Kurla": Number((7.5 + Math.cos(i * 0.35) * 1.2 + 0.9).toFixed(1)),
    "MG Road": Number((3.2 + Math.sin(i * 0.25) * 0.8).toFixed(1)),
    "Outer Ring": Number((1.8 + Math.cos(i * 0.2) * 0.5).toFixed(1)),
  })),
  anomalyByRoad: [
    { road: "AIIMS Delhi", count: 18, severity: "critical" },
    { road: "Andheri-Kurla", count: 15, severity: "critical" },
    { road: "NH-48", count: 12, severity: "high" },
    { road: "MG Road", count: 6, severity: "medium" },
    { road: "GST Road", count: 4, severity: "medium" },
    { road: "ORR South", count: 1, severity: "low" },
  ],
  conditionDistribution: [
    { condition: "Smooth", percentage: 25, count: 2 },
    { condition: "Rough", percentage: 37.5, count: 3 },
    { condition: "Anomaly", percentage: 25, count: 2 },
    { condition: "Critical", percentage: 12.5, count: 1 },
  ],
  stressTrend: Array.from({ length: 30 }, (_, i) => ({
    date: `Apr ${i + 1}`,
    stress: Number(
      (3.5 + Math.sin(i * 0.3) * 1.5 + (i > 20 ? (i - 20) * 0.15 : 0)).toFixed(1),
    ),
  })),
  predictedFailures7Days: 2,
  predictedFailures30Days: 5,
};

const MOCK_ALERTS: SensorAlert[] = [
  {
    id: 1,
    roadId: 7,
    roadName: "AIIMS Delhi Stretch",
    alertType: "Critical Anomaly",
    message: "Repeated high vibration detected. Likely failure imminent.",
    severity: "critical",
    timestamp: "08:03:44",
    resolved: false,
  },
  {
    id: 2,
    roadId: 4,
    roadName: "Andheri-Kurla Road",
    alertType: "Pothole Cluster",
    message: "Pothole cluster forming in segment 3. Road stress rising.",
    severity: "critical",
    timestamp: "08:02:15",
    resolved: false,
  },
  {
    id: 3,
    roadId: 2,
    roadName: "NH-48 Stretch",
    alertType: "Sensor Alert",
    message: "Abnormal shock patterns after recent repair. Quality suspect.",
    severity: "high",
    timestamp: "08:01:23",
    resolved: false,
  },
  {
    id: 4,
    roadId: 1,
    roadName: "MG Road",
    alertType: "Vibration Warning",
    message: "Vibration rising over past 7 days. Monitor closely.",
    severity: "medium",
    timestamp: "07:45:00",
    resolved: false,
  },
];

const CONDITION_COLORS = ["#16A34A", "#0EA5A4", "#F59E0B", "#DC2626"];

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#DC2626",
  high: "#F59E0B",
  medium: "#0EA5A4",
  low: "#16A34A",
};

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function normalizeOverview(data: unknown): SensorOverview {
  const source = (data as any)?.data ?? data ?? {};

  return {
    activeSensors: toNumber(source?.activeSensors, MOCK_OVERVIEW.activeSensors),
    roadsMonitored: toNumber(source?.roadsMonitored, MOCK_OVERVIEW.roadsMonitored),
    liveAnomalyCount: toNumber(
      source?.liveAnomalyCount,
      MOCK_OVERVIEW.liveAnomalyCount,
    ),
    avgVibrationScore: toNumber(
      source?.avgVibrationScore,
      MOCK_OVERVIEW.avgVibrationScore,
    ),
    currentStressLevel:
      typeof source?.currentStressLevel === "string"
        ? source.currentStressLevel
        : MOCK_OVERVIEW.currentStressLevel,
    criticalZones: toNumber(source?.criticalZones, MOCK_OVERVIEW.criticalZones),
    dataPointsToday: toNumber(source?.dataPointsToday, MOCK_OVERVIEW.dataPointsToday),
    uptime: toNumber(source?.uptime, MOCK_OVERVIEW.uptime),
  };
}

function normalizeFeed(data: unknown): SensorFeedRow[] {
  const source =
    Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.data)
        ? (data as any).data
        : Array.isArray((data as any)?.feed)
          ? (data as any).feed
          : Array.isArray((data as any)?.items)
            ? (data as any).items
            : [];

  const normalized = source.map((row: any, index: number): SensorFeedRow => ({
    id: row?.id ?? row?._id ?? index + 1,
    roadId: row?.roadId ?? row?.road_id ?? index + 1,
    roadName: row?.roadName ?? row?.road_name ?? row?.name ?? "Unknown Road",
    timestamp:
      row?.timestamp ??
      row?.time ??
      new Date().toTimeString().slice(0, 8),
    vibrationIntensity: toNumber(row?.vibrationIntensity ?? row?.vibration, 0),
    shockSpikes: toNumber(row?.shockSpikes ?? row?.shock_spikes, 0),
    roughnessIndex: toNumber(row?.roughnessIndex ?? row?.roughness, 0),
    temperature: toNumber(row?.temperature, 0),
    humidity: toNumber(row?.humidity, 0),
    sensorStatus: row?.sensorStatus ?? row?.status ?? "active",
    damageClassification:
      row?.damageClassification ?? row?.classification ?? "normal",
    damageProbability: toNumber(
      row?.damageProbability ?? row?.damage_probability,
      0,
    ),
  }));

  return normalized.length > 0 ? normalized : MOCK_FEED;
}

function normalizeAnalytics(data: unknown): SensorAnalytics {
  const source = (data as any)?.data ?? data ?? {};

  const vibrationTrend = safeArray<any>(source?.vibrationTrend).map(
    (item: any, index: number): VibrationPoint => ({
      time: item?.time ?? `${String(index).padStart(2, "0")}:00`,
      "NH-48": toNumber(item?.["NH-48"] ?? item?.nh48, 0),
      "Andheri-Kurla": toNumber(
        item?.["Andheri-Kurla"] ?? item?.andheriKurla,
        0,
      ),
      "MG Road": toNumber(item?.["MG Road"] ?? item?.mgRoad, 0),
      "Outer Ring": toNumber(item?.["Outer Ring"] ?? item?.outerRing, 0),
    }),
  );

  const anomalyByRoad = safeArray<any>(source?.anomalyByRoad).map(
    (item: any): AnomalyByRoad => ({
      road: item?.road ?? item?.roadName ?? item?.name ?? "Unknown Road",
      count: toNumber(item?.count ?? item?.value, 0),
      severity: item?.severity ?? "medium",
    }),
  );

  const conditionDistribution = safeArray<any>(
    source?.conditionDistribution,
  ).map((item: any): ConditionDistribution => ({
    condition: item?.condition ?? item?.name ?? item?.label ?? "Unknown",
    percentage: toNumber(item?.percentage ?? item?.value, 0),
    count: toNumber(item?.count, 0),
  }));

  const stressTrend = safeArray<any>(source?.stressTrend).map(
    (item: any, index: number): StressPoint => ({
      date: item?.date ?? item?.time ?? `Day ${index + 1}`,
      stress: toNumber(item?.stress ?? item?.value, 0),
    }),
  );

  return {
    vibrationTrend:
      vibrationTrend.length > 0 ? vibrationTrend : MOCK_ANALYTICS.vibrationTrend,
    anomalyByRoad:
      anomalyByRoad.length > 0 ? anomalyByRoad : MOCK_ANALYTICS.anomalyByRoad,
    conditionDistribution:
      conditionDistribution.length > 0
        ? conditionDistribution
        : MOCK_ANALYTICS.conditionDistribution,
    stressTrend: stressTrend.length > 0 ? stressTrend : MOCK_ANALYTICS.stressTrend,
    predictedFailures7Days: toNumber(
      source?.predictedFailures7Days,
      MOCK_ANALYTICS.predictedFailures7Days,
    ),
    predictedFailures30Days: toNumber(
      source?.predictedFailures30Days,
      MOCK_ANALYTICS.predictedFailures30Days,
    ),
  };
}

function normalizeAlerts(data: unknown): SensorAlert[] {
  const source =
    Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.data)
        ? (data as any).data
        : Array.isArray((data as any)?.alerts)
          ? (data as any).alerts
          : Array.isArray((data as any)?.items)
            ? (data as any).items
            : [];

  const normalized = source.map((alert: any, index: number): SensorAlert => ({
    id: alert?.id ?? alert?._id ?? index + 1,
    roadId: alert?.roadId ?? alert?.road_id ?? index + 1,
    roadName: alert?.roadName ?? alert?.road_name ?? alert?.name ?? "Unknown Road",
    alertType: alert?.alertType ?? alert?.type ?? "Sensor Alert",
    message: alert?.message ?? alert?.description ?? "Sensor anomaly detected.",
    severity: alert?.severity ?? "medium",
    timestamp:
      alert?.timestamp ??
      alert?.time ??
      new Date().toTimeString().slice(0, 8),
    resolved: Boolean(alert?.resolved),
  }));

  return normalized.length > 0 ? normalized : MOCK_ALERTS;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function formatNumber(value: number, digits = 1): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "0.0";
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>

        {sub && (
          <span
            className="text-xs px-1.5 py-0.5 rounded-full pulse-glow"
            style={{ background: `${color}20`, color }}
          >
            LIVE
          </span>
        )}
      </div>

      <div
        className="text-2xl font-bold"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {value}
      </div>

      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default function Sensors() {
  const { data: overviewData } = useGetSensorOverview();
  const { data: feedData } = useGetSensorFeed();
  const { data: analyticsData } = useGetSensorAnalytics();
  const { data: alertsData } = useGetSensorAlerts();

  const [simRunning, setSimRunning] = useState(false);
  const [segment, setSegment] = useState("all");
  const [traffic, setTraffic] = useState(50);
  const [rainfall, setRainfall] = useState(0);

  const ov = useMemo(() => normalizeOverview(overviewData), [overviewData]);
  const feed = useMemo(() => normalizeFeed(feedData), [feedData]);
  const analytics = useMemo(
    () => normalizeAnalytics(analyticsData),
    [analyticsData],
  );
  const alerts = useMemo(() => normalizeAlerts(alertsData), [alertsData]);

  const [liveVibration, setLiveVibration] = useState<VibrationPoint[]>(
    MOCK_ANALYTICS.vibrationTrend,
  );

  useEffect(() => {
    setLiveVibration(analytics.vibrationTrend);
  }, [analytics.vibrationTrend]);

  useEffect(() => {
    if (!simRunning) return;

    const interval = window.setInterval(() => {
      setLiveVibration((previous) => {
        const newPoint: VibrationPoint = {
          time: new Date().toTimeString().slice(0, 5),
          "NH-48": Number((6 + Math.random() * 4 + (rainfall / 100) * 2).toFixed(1)),
          "Andheri-Kurla": Number(
            (7 + Math.random() * 3 + (traffic / 100) * 2).toFixed(1),
          ),
          "MG Road": Number((3 + Math.random() * 2).toFixed(1)),
          "Outer Ring": Number((1 + Math.random()).toFixed(1)),
        };

        return [...safeArray<VibrationPoint>(previous).slice(-20), newPoint];
      });
    }, 1500);

    return () => window.clearInterval(interval);
  }, [simRunning, traffic, rainfall]);

  const visibleVibration = safeArray<VibrationPoint>(liveVibration).slice(-24);
  const anomalyByRoad = safeArray<AnomalyByRoad>(analytics.anomalyByRoad);
  const conditionDistribution = safeArray<ConditionDistribution>(
    analytics.conditionDistribution,
  );
  const stressTrend = safeArray<StressPoint>(analytics.stressTrend);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              RoadSense Sensor Intelligence
            </h1>

            <span
              className="text-xs px-2 py-0.5 rounded-full pulse-glow"
              style={{
                background: "rgba(14,165,164,0.15)",
                color: "#0EA5A4",
              }}
            >
              LIVE
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            IoT sensor network monitoring road health in real-time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Active Sensors"
          value={ov.activeSensors}
          icon={Radio}
          color="#0EA5A4"
          sub="live"
        />
        <StatCard
          label="Roads Monitored"
          value={ov.roadsMonitored}
          icon={Activity}
          color="#16A34A"
          sub="live"
        />
        <StatCard
          label="Live Anomalies"
          value={ov.liveAnomalyCount}
          icon={AlertTriangle}
          color="#DC2626"
          sub="live"
        />
        <StatCard
          label="Avg Vibration"
          value={`${formatNumber(ov.avgVibrationScore, 1)}/10`}
          icon={TrendingUp}
          color="#F59E0B"
          sub="live"
        />
      </div>

      <div
        className="p-5 rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5" style={{ color: "#0EA5A4" }} />

          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Sensor Simulation Controls
          </h3>

          <span
            className="text-xs px-2 py-0.5 rounded-full ml-auto"
            style={{
              background: simRunning
                ? "rgba(22,163,74,0.15)"
                : "hsl(var(--muted))",
              color: simRunning ? "#16A34A" : "hsl(var(--muted-foreground))",
            }}
          >
            {simRunning ? "RUNNING" : "PAUSED"}
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSimRunning((current) => !current)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                background: simRunning
                  ? "#DC262620"
                  : "rgba(14,165,164,0.15)",
                color: simRunning ? "#DC2626" : "#0EA5A4",
              }}
            >
              {simRunning ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start
                </>
              )}
            </button>

            <button
              onClick={() => {
                setSimRunning(false);
                setTraffic(50);
                setRainfall(0);
                setLiveVibration(analytics.vibrationTrend);
              }}
              className="px-3 py-2 rounded-xl text-sm"
              style={{ background: "hsl(var(--muted))" }}
              aria-label="Reset simulation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Road Segment
            </label>
            <select
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                background: "hsl(var(--muted))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <option value="all">All Segments</option>
              <option value="nh48">NH-48</option>
              <option value="andheri">Andheri-Kurla</option>
              <option value="mg">MG Road</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
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
            <label className="text-xs text-muted-foreground mb-1 block">
              Rainfall Effect: {rainfall}%
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

      <div
        className="p-5 rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Vibration Over Time
          </h3>

          {simRunning && (
            <span
              className="text-xs px-2 py-0.5 rounded-full pulse-glow"
              style={{
                background: "rgba(14,165,164,0.15)",
                color: "#0EA5A4",
              }}
            >
              LIVE UPDATE
            </span>
          )}
        </div>

        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleVibration}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="NH-48"
                stroke="#DC2626"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Andheri-Kurla"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="MG Road"
                stroke="#0EA5A4"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Outer Ring"
                stroke="#16A34A"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div
          className="p-5 rounded-2xl"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Anomalies by Road
          </h3>

          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anomalyByRoad} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="road"
                  type="category"
                  tick={{ fontSize: 9 }}
                  width={80}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {anomalyByRoad.map((entry, index) => (
                    <Cell
                      key={`${entry.road}-${index}`}
                      fill={SEVERITY_COLOR[entry.severity] ?? "#64748B"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Road Condition Distribution
          </h3>

          <div className="w-full h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionDistribution}
                  dataKey="percentage"
                  nameKey="condition"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  label={(props: any) =>
                    `${props.condition ?? "Road"} ${props.percentage ?? 0}%`
                  }
                >
                  {conditionDistribution.map((item, index) => (
                    <Cell
                      key={`${item.condition}-${index}`}
                      fill={CONDITION_COLORS[index % CONDITION_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {conditionDistribution.map((item, index) => (
              <div
                key={`${item.condition}-${index}`}
                className="flex items-center gap-1.5 text-xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: CONDITION_COLORS[index % CONDITION_COLORS.length],
                  }}
                />
                <span className="text-muted-foreground">
                  {item.condition}: {item.count} roads
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-5 rounded-2xl space-y-4"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Predicted Failures
          </h3>

          <div
            className="p-4 rounded-xl"
            style={{
              background: "#DC262612",
              border: "1px solid #DC262630",
            }}
          >
            <div className="text-xs text-muted-foreground">Next 7 Days</div>
            <div
              className="text-3xl font-bold mt-1"
              style={{
                color: "#DC2626",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {analytics.predictedFailures7Days}
            </div>
            <div className="text-xs mt-1" style={{ color: "#DC2626" }}>
              roads likely to fail
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background: "#F59E0B12",
              border: "1px solid #F59E0B30",
            }}
          >
            <div className="text-xs text-muted-foreground">Next 30 Days</div>
            <div
              className="text-3xl font-bold mt-1"
              style={{
                color: "#F59E0B",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {analytics.predictedFailures30Days}
            </div>
            <div className="text-xs mt-1" style={{ color: "#F59E0B" }}>
              roads predicted to fail
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background: "rgba(14,165,164,0.08)",
              border: "1px solid rgba(14,165,164,0.2)",
            }}
          >
            <div className="text-xs text-muted-foreground">Platform Uptime</div>
            <div
              className="text-2xl font-bold mt-1"
              style={{
                color: "#0EA5A4",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {formatNumber(ov.uptime, 1)}%
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-5 rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <h3
          className="font-semibold mb-4"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Road Stress Index — 30 Day Trend
        </h3>

        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stressTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
              <YAxis domain={[0, 8]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="stress"
                stroke="#0EA5A4"
                fill="rgba(14,165,164,0.15)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div
          className="flex items-center gap-2 px-5 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Radio className="w-4 h-4" style={{ color: "#0EA5A4" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Live Sensor Feed
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full ml-2 pulse-glow"
            style={{
              background: "rgba(14,165,164,0.15)",
              color: "#0EA5A4",
            }}
          >
            STREAMING
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--muted))",
                }}
              >
                {[
                  "Road",
                  "Time",
                  "Vibration",
                  "Shock Spikes",
                  "Roughness",
                  "Temp",
                  "Status",
                  "Classification",
                  "Damage %",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="text-left text-xs font-semibold px-4 py-3 text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody
              className="divide-y"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {feed.map((row) => {
                const vibrationPercent = clampPercent(
                  (row.vibrationIntensity / 12) * 100,
                );

                return (
                  <tr
                    key={row.id}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <td className="px-4 py-3 font-medium text-sm whitespace-nowrap">
                      {row.roadName}
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {row.timestamp}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 w-16 rounded-full overflow-hidden"
                          style={{ background: "hsl(var(--muted))" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${vibrationPercent}%`,
                              background:
                                row.vibrationIntensity > 7
                                  ? "#DC2626"
                                  : row.vibrationIntensity > 4
                                    ? "#F59E0B"
                                    : "#16A34A",
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono">
                          {formatNumber(row.vibrationIntensity, 1)}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-center">
                      {row.shockSpikes}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {formatNumber(row.roughnessIndex, 1)}
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatNumber(row.temperature, 1)}°C
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full capitalize"
                        style={{
                          background:
                            row.sensorStatus === "critical"
                              ? "#DC262618"
                              : "rgba(14,165,164,0.15)",
                          color:
                            row.sensorStatus === "critical"
                              ? "#DC2626"
                              : "#0EA5A4",
                        }}
                      >
                        {row.sensorStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {row.damageClassification}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-bold"
                        style={{
                          color:
                            row.damageProbability > 0.7
                              ? "#DC2626"
                              : row.damageProbability > 0.4
                                ? "#F59E0B"
                                : "#16A34A",
                        }}
                      >
                        {formatNumber(row.damageProbability * 100, 0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div
          className="flex items-center gap-2 px-5 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <AlertTriangle className="w-4 h-4" style={{ color: "#F59E0B" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Sensor-Triggered Alerts
          </h3>
        </div>

        <div
          className="divide-y"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 px-5 py-4"
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{
                  background: SEVERITY_COLOR[alert.severity] ?? "#64748B",
                }}
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-sm">{alert.roadName}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: `${
                        SEVERITY_COLOR[alert.severity] ?? "#64748B"
                      }20`,
                      color: SEVERITY_COLOR[alert.severity] ?? "#64748B",
                    }}
                  >
                    {alert.alertType}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground mt-0.5">
                  {alert.message}
                </div>
              </div>

              <div className="text-xs text-muted-foreground shrink-0">
                {alert.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}