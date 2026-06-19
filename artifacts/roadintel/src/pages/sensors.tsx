import { useMemo, useState } from "react";
import { Link } from "wouter";
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
  ArrowRight,
  CheckCircle2,
  Clock3,
  CloudRain,
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
  TrendingDown,
  Wifi,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low";
type SensorStatus = "Stable" | "Watch" | "Risk" | "Critical";

type SensorRoad = {
  id: string;
  roadName: string;
  zone: string;
  authority: "PMC" | "PCMC" | "PWD Maharashtra";
  simulatedSensors: number;
  vibrationScore: number;
  roughnessIndex: number;
  shockSpikes: number;
  rainfallStress: number;
  trafficLoad: number;
  damageProbability: number;
  roadHealth: number;
  status: SensorStatus;
  severity: Severity;
  interpretation: string;
  recommendedAction: string;
};

type TrendPoint = {
  time: string;
  jmRoad: number;
  fcRoad: number;
  hinjewadi: number;
  baner: number;
};

type StressPoint = {
  road: string;
  vibration: number;
  roughness: number;
  rainfall: number;
  damage: number;
};

type AlertItem = {
  title: string;
  road: string;
  severity: Severity;
  signal: string;
  action: string;
};

const SENSOR_ROADS: SensorRoad[] = [
  {
    id: "SEN-001",
    roadName: "JM Road Patch Zone",
    zone: "Pune Central",
    authority: "PMC",
    simulatedSensors: 5,
    vibrationScore: 8.4,
    roughnessIndex: 78,
    shockSpikes: 19,
    rainfallStress: 82,
    trafficLoad: 88,
    damageProbability: 86,
    roadHealth: 42,
    status: "Critical",
    severity: "critical",
    interpretation:
      "High vibration, repeated shock spikes and rainfall stress indicate unstable patch repair.",
    recommendedAction:
      "Send field team for physical verification within 24 hours and review contractor repair quality.",
  },
  {
    id: "SEN-002",
    roadName: "FC Road Junction",
    zone: "Pune Central",
    authority: "PMC",
    simulatedSensors: 4,
    vibrationScore: 7.1,
    roughnessIndex: 65,
    shockSpikes: 13,
    rainfallStress: 71,
    trafficLoad: 84,
    damageProbability: 74,
    roadHealth: 56,
    status: "Risk",
    severity: "high",
    interpretation:
      "Surface cracking and drainage stress are creating high commuter discomfort.",
    recommendedAction:
      "Schedule drainage inspection and crack sealing before the next heavy rainfall period.",
  },
  {
    id: "SEN-003",
    roadName: "Wakad-Hinjewadi Road",
    zone: "PCMC Corridor",
    authority: "PCMC",
    simulatedSensors: 6,
    vibrationScore: 6.6,
    roughnessIndex: 59,
    shockSpikes: 11,
    rainfallStress: 64,
    trafficLoad: 92,
    damageProbability: 68,
    roadHealth: 61,
    status: "Risk",
    severity: "high",
    interpretation:
      "High traffic load and edge deterioration are increasing road stress during peak hours.",
    recommendedAction:
      "Review resurfacing need and monitor morning/evening commuter vibration patterns.",
  },
  {
    id: "SEN-004",
    roadName: "Baner Link Road",
    zone: "Pune West",
    authority: "PMC",
    simulatedSensors: 3,
    vibrationScore: 4.8,
    roughnessIndex: 43,
    shockSpikes: 6,
    rainfallStress: 52,
    trafficLoad: 61,
    damageProbability: 49,
    roadHealth: 72,
    status: "Watch",
    severity: "medium",
    interpretation:
      "Moderate roughness pattern. Preventive maintenance can avoid future escalation.",
    recommendedAction:
      "Plan preventive crack sealing and keep under weekly monitoring.",
  },
  {
    id: "SEN-005",
    roadName: "Ravet BRT Service Road",
    zone: "PCMC Corridor",
    authority: "PCMC",
    simulatedSensors: 3,
    vibrationScore: 2.7,
    roughnessIndex: 25,
    shockSpikes: 3,
    rainfallStress: 31,
    trafficLoad: 48,
    damageProbability: 22,
    roadHealth: 81,
    status: "Stable",
    severity: "low",
    interpretation:
      "Low vibration and low roughness show stable road condition.",
    recommendedAction:
      "Continue routine inspection cycle.",
  },
];

const VIBRATION_TREND: TrendPoint[] = [
  { time: "08:00", jmRoad: 6.9, fcRoad: 5.4, hinjewadi: 5.8, baner: 3.7 },
  { time: "10:00", jmRoad: 7.4, fcRoad: 5.9, hinjewadi: 6.1, baner: 4.1 },
  { time: "12:00", jmRoad: 7.8, fcRoad: 6.3, hinjewadi: 6.5, baner: 4.4 },
  { time: "14:00", jmRoad: 8.1, fcRoad: 6.8, hinjewadi: 6.4, baner: 4.6 },
  { time: "16:00", jmRoad: 8.4, fcRoad: 7.1, hinjewadi: 6.6, baner: 4.8 },
  { time: "18:00", jmRoad: 8.2, fcRoad: 6.9, hinjewadi: 6.8, baner: 4.5 },
];

const STRESS_BREAKDOWN: StressPoint[] = SENSOR_ROADS.slice(0, 4).map((road) => ({
  road: road.roadName
    .replace(" Patch Zone", "")
    .replace(" Junction", "")
    .replace(" Road", ""),
  vibration: Math.round(road.vibrationScore * 10),
  roughness: road.roughnessIndex,
  rainfall: road.rainfallStress,
  damage: road.damageProbability,
}));

const SENSOR_ALERTS: AlertItem[] = [
  {
    title: "Critical vibration cluster",
    road: "JM Road Patch Zone",
    severity: "critical",
    signal:
      "Vibration score crossed 8.0/10 with repeated shock spikes after rainfall.",
    action: "Verify patch quality and schedule immediate field inspection.",
  },
  {
    title: "Drainage stress signal",
    road: "FC Road Junction",
    severity: "high",
    signal:
      "Rainfall stress and roughness are rising together near a commercial junction.",
    action: "Inspect water outlets and seal visible cracks.",
  },
  {
    title: "Peak-hour commuter stress",
    road: "Wakad-Hinjewadi Road",
    severity: "high",
    signal:
      "Traffic load and vibration pattern indicate increasing edge deterioration.",
    action: "Schedule resurfacing review and monitor commuter-hour spikes.",
  },
];

function getSeverityColor(severity: Severity) {
  if (severity === "critical") return "#DC2626";
  if (severity === "high") return "#F97316";
  if (severity === "medium") return "#F59E0B";
  return "#16A34A";
}

function getStatusMeta(status: SensorStatus) {
  if (status === "Critical") {
    return {
      color: "#DC2626",
      bg: "rgba(220,38,38,0.12)",
      border: "rgba(220,38,38,0.28)",
      icon: AlertTriangle,
    };
  }

  if (status === "Risk") {
    return {
      color: "#F97316",
      bg: "rgba(249,115,22,0.12)",
      border: "rgba(249,115,22,0.28)",
      icon: Zap,
    };
  }

  if (status === "Watch") {
    return {
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.28)",
      icon: Clock3,
    };
  }

  return {
    color: "#16A34A",
    bg: "rgba(22,163,74,0.12)",
    border: "rgba(22,163,74,0.28)",
    icon: CheckCircle2,
  };
}

function getScoreColor(score: number) {
  if (score >= 80) return "#16A34A";
  if (score >= 65) return "#0EA5A4";
  if (score >= 50) return "#F59E0B";
  return "#DC2626";
}

function getStressColor(value: number) {
  if (value >= 75) return "#DC2626";
  if (value >= 60) return "#F97316";
  if (value >= 40) return "#F59E0B";
  return "#16A34A";
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
          Simulated
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

function StatusPill({ status }: { status: SensorStatus }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
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

function SignalBar({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const color = getStressColor(percentage);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold" style={{ color }}>
          {max === 10 ? value.toFixed(1) : Math.round(value)}
          {max === 10 ? "/10" : "/100"}
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "hsl(var(--border))" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
    </div>
  );
}

function SensorRoadCard({ road }: { road: SensorRoad }) {
  const meta = getStatusMeta(road.status);
  const StatusIcon = meta.icon;

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
          <p className="font-mono text-xs text-muted-foreground">{road.id}</p>

          <h3
            className="mt-1 text-xl font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {road.roadName}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {road.zone} Â· {road.authority}
          </p>
        </div>

        <StatusPill status={road.status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniMetric
          label="Sensors"
          value={String(road.simulatedSensors)}
          icon={Radio}
          color="#0EA5A4"
        />
        <MiniMetric
          label="Shock Spikes"
          value={String(road.shockSpikes)}
          icon={Zap}
          color={road.shockSpikes >= 12 ? "#F97316" : "#16A34A"}
        />
        <MiniMetric
          label="Damage Risk"
          value={`${road.damageProbability}%`}
          icon={TrendingDown}
          color={getStressColor(road.damageProbability)}
        />
      </div>

      <div className="mt-5 space-y-4">
        <SignalBar label="Vibration Score" value={road.vibrationScore} max={10} />
        <SignalBar label="Road Roughness" value={road.roughnessIndex} />
        <SignalBar label="Rainfall Stress" value={road.rainfallStress} />
        <SignalBar label="Traffic Load" value={road.trafficLoad} />
      </div>

      <div
        className="mt-5 rounded-2xl p-4"
        style={{
          background: meta.bg,
          border: `1px solid ${meta.border}`,
        }}
      >
        <div className="flex items-start gap-3">
          <StatusIcon
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: meta.color }}
          />

          <div>
            <p className="text-sm font-semibold" style={{ color: meta.color }}>
              Digital Twin Interpretation
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {road.interpretation}
            </p>

            <p className="mt-3 text-xs font-semibold">Recommended Action</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {road.recommendedAction}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
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
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>

      <p className="font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function AlertCard({ alert }: { alert: AlertItem }) {
  const color = getSeverityColor(alert.severity);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: `1px solid ${color}30`,
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{alert.title}</h3>

        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
          style={{
            background: `${color}18`,
            color,
          }}
        >
          {alert.severity}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{alert.road}</p>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">Signal: </span>
        {alert.signal}
      </p>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">Action: </span>
        {alert.action}
      </p>
    </div>
  );
}

function MethodCard({
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
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color }} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}

export default function Sensors() {
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const stats = useMemo(() => {
    const sensorCount = SENSOR_ROADS.reduce(
      (total, road) => total + road.simulatedSensors,
      0,
    );

    const avgVibration =
      SENSOR_ROADS.reduce((total, road) => total + road.vibrationScore, 0) /
      SENSOR_ROADS.length;

    const avgDamage = Math.round(
      SENSOR_ROADS.reduce((total, road) => total + road.damageProbability, 0) /
        SENSOR_ROADS.length,
    );

    const riskRoads = SENSOR_ROADS.filter(
      (road) => road.status === "Critical" || road.status === "Risk",
    ).length;

    return {
      sensorCount,
      avgVibration,
      avgDamage,
      riskRoads,
    };
  }, []);

  function handleRefresh() {
    setLastRefreshed(new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }));
  }

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
              <Radio className="h-3.5 w-3.5" />
              Simulated Road Sensor Digital Twin
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Sensor Intelligence
            </h1>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
              This page demonstrates how RoadIntel can use future sensor or
              mobile accelerometer data to estimate vibration, roughness, shock
              spikes, rainfall stress and damage probability. It is clearly
              presented as simulated pilot data, not a fake live government feed.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setSimulationRunning((current) => !current)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
            >
              {simulationRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Simulation
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Resume Simulation
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-3 text-sm font-bold text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Demo
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Simulated Sensors"
          value={stats.sensorCount}
          note="Across Pune / PCMC pilot roads"
          icon={Cpu}
          color="#0EA5A4"
        />

        <KpiCard
          label="Avg Vibration"
          value={`${stats.avgVibration.toFixed(1)}/10`}
          note="Road-surface stress indicator"
          icon={Activity}
          color="#3B82F6"
        />

        <KpiCard
          label="Damage Probability"
          value={`${stats.avgDamage}%`}
          note="Average across pilot roads"
          icon={TrendingDown}
          color="#F59E0B"
        />

        <KpiCard
          label="Risk Roads"
          value={stats.riskRoads}
          note={`Last refreshed: ${lastRefreshed}`}
          icon={AlertTriangle}
          color="#DC2626"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section
          className="rounded-3xl p-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div className="mb-4">
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Simulated Vibration Trend
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Higher vibration suggests roughness, pothole impact, patch
              instability or poor ride quality.
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VIBRATION_TREND}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="jmRoad"
                  name="JM Road"
                  stroke="#DC2626"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="fcRoad"
                  name="FC Road"
                  stroke="#F97316"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="hinjewadi"
                  name="Hinjewadi"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="baner"
                  name="Baner"
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
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
            Sensor Alerts
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Explainable demo alerts based on vibration, roughness and rainfall
            stress.
          </p>

          <div className="mt-4 space-y-3">
            {SENSOR_ALERTS.map((alert) => (
              <AlertCard key={alert.title} alert={alert} />
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section
          className="rounded-3xl p-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div className="mb-4">
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Stress Signal Breakdown
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Shows how different signal types contribute to road stress.
            </p>
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STRESS_BREAKDOWN} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="road"
                  width={85}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="vibration" name="Vibration" fill="#3B82F6" />
                <Bar dataKey="roughness" name="Roughness" fill="#F59E0B" />
                <Bar dataKey="rainfall" name="Rainfall" fill="#0EA5A4" />
                <Bar dataKey="damage" name="Damage Risk" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section
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
            How Sensor Intel Supports RoadIntel
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            The purpose is not to show fake live data. The purpose is to show a
            realistic integration path for transparent road monitoring.
          </p>

          <div className="mt-4 space-y-3">
            <MethodCard
              icon={Gauge}
              title="1. Capture road roughness"
              text="Future sensors or mobile accelerometers can detect vibration and uneven ride quality."
              color="#3B82F6"
            />

            <MethodCard
              icon={Zap}
              title="2. Detect shock spikes"
              text="Sudden spikes can indicate potholes, patch failures or sharp surface defects."
              color="#F97316"
            />

            <MethodCard
              icon={CloudRain}
              title="3. Add rainfall stress"
              text="Roads with high water exposure are more likely to deteriorate quickly."
              color="#0EA5A4"
            />

            <MethodCard
              icon={Route}
              title="4. Connect to Road DNA"
              text="Signals can update road health, risk score and recommended field action."
              color="#16A34A"
            />
          </div>
        </section>
      </section>

      <section
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
              Road-Wise Simulated Sensor Records
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Clean road-level cards showing how sensor-like signals can support
              inspection prioritization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/risk-map">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15">
                Open Risk Map
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>

            <Link href="/roads">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-white">
                View Road DNA
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {SENSOR_ROADS.map((road) => (
            <SensorRoadCard key={road.id} road={road} />
          ))}
        </div>
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.10), rgba(59,130,246,0.06), hsl(var(--card)))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />

          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Audit-Safe Data Note
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Sensor Intel uses simulated Pune / PCMC pilot-style values to
              demonstrate how future road sensors, mobile accelerometers or
              field devices could support transparent road monitoring. It does
              not claim to be connected to an official live sensor network.
            </p>
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
        <div className="flex items-start gap-3">
          <SlidersHorizontal className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />

          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Integration Roadmap
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              In a real deployment, this module can be connected to mobile
              accelerometer readings, vehicle-mounted sensors, municipal
              inspection devices, rainfall APIs and GIS road ownership data. The
              current demo keeps the workflow honest while showing technical
              scalability.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                Mobile accelerometer
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                Road roughness detection
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                Rainfall stress
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                GIS authority mapping
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                Field verification
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5"
      >
        <div className="flex items-start gap-3">
          <Wifi className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />

          <div>
            <h2
              className="font-semibold text-cyan-100"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Simulation Status
            </h2>

            <p className="mt-2 text-sm leading-6 text-cyan-100/80">
              Demo simulation is currently{" "}
              <span className="font-bold">
                {simulationRunning ? "running" : "paused"}
              </span>
              . This control is functional and only changes the demo state. It
              does not pretend to start or stop a real government sensor system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
