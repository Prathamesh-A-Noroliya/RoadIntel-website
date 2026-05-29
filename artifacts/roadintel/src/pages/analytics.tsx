import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

const MOCK_ANALYTICS = {
  complaintsOverTime: [
    { month: "Apr", filed: 18, resolved: 10, escalated: 2 },
    { month: "May", filed: 24, resolved: 16, escalated: 3 },
    { month: "Jun", filed: 39, resolved: 25, escalated: 5 },
    { month: "Jul", filed: 52, resolved: 31, escalated: 7 },
    { month: "Aug", filed: 46, resolved: 34, escalated: 6 },
    { month: "Sep", filed: 41, resolved: 33, escalated: 4 },
  ],

  healthTrendAllRoads: [
    { month: "Apr", avgHealth: 78, critical: 1 },
    { month: "May", avgHealth: 76, critical: 1 },
    { month: "Jun", avgHealth: 72, critical: 2 },
    { month: "Jul", avgHealth: 68, critical: 3 },
    { month: "Aug", avgHealth: 70, critical: 2 },
    { month: "Sep", avgHealth: 74, critical: 2 },
  ],

  repairEfficiency: [
    {
      contractor: "Pune Infra Works",
      onTime: 91,
      budget: 88,
      quality: 86,
    },
    {
      contractor: "MahaRoad Services",
      onTime: 84,
      budget: 81,
      quality: 79,
    },
    {
      contractor: "UrbanBuild Pune",
      onTime: 76,
      budget: 72,
      quality: 74,
    },
    {
      contractor: "RoadCraft Solutions",
      onTime: 62,
      budget: 58,
      quality: 61,
    },
    {
      contractor: "QuickPatch Infra",
      onTime: 49,
      budget: 46,
      quality: 52,
    },
  ],

  issuesByCity: [
    { city: "Pune", critical: 6, high: 14, medium: 31, low: 22 },
    { city: "PCMC", critical: 4, high: 11, medium: 24, low: 18 },
    { city: "Mumbai", critical: 3, high: 9, medium: 19, low: 16 },
    { city: "Nagpur", critical: 2, high: 7, medium: 15, low: 13 },
    { city: "Nashik", critical: 1, high: 5, medium: 12, low: 9 },
  ],
};

const KPI_CARDS = [
  {
    label: "Complaints Filed",
    value: "220",
    note: "Pilot total",
    icon: BarChart3,
    color: "#0EA5A4",
  },
  {
    label: "Resolved Cases",
    value: "149",
    note: "67.7% closure",
    icon: CheckCircle2,
    color: "#16A34A",
  },
  {
    label: "Avg Resolution Time",
    value: "4.8 days",
    note: "PMC / PCMC pilot",
    icon: Clock,
    color: "#F59E0B",
  },
  {
    label: "Network Health",
    value: "74/100",
    note: "8 monitored roads",
    icon: Activity,
    color: "#3B82F6",
  },
];

export default function Analytics() {
  const data = MOCK_ANALYTICS;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Analytics
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Realistic pilot-stage analytics for Pune, PCMC and Maharashtra road
          monitoring
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ label, value, note, icon: Icon, color }) => (
          <div
            key={label}
            className="p-4 rounded-2xl"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5" style={{ color }} />

              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: `${color}15`,
                  color,
                }}
              >
                New pilot
              </span>
            </div>

            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {value}
            </div>

            <div className="text-xs text-muted-foreground mt-0.5">
              {label}
            </div>

            <div className="text-[11px] text-muted-foreground mt-1">
              {note}
            </div>
          </div>
        ))}
      </div>

      <div
        className="p-5 rounded-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Complaints Filed vs Resolved
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              April to September pilot data. Complaint volume intentionally kept
              realistic for a newly launched civic-tech project.
            </p>
          </div>

          <TrendingUp className="w-5 h-5 text-muted-foreground" />
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.complaintsOverTime}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="filed"
              name="Filed"
              stroke="#0EA5A4"
              fill="rgba(14,165,164,0.12)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              name="Resolved"
              stroke="#16A34A"
              fill="rgba(22,163,74,0.12)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="escalated"
              name="Escalated"
              stroke="#F59E0B"
              fill="rgba(245,158,11,0.12)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div
          className="p-5 rounded-2xl"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h3
            className="font-semibold mb-1"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Road Health Trend
          </h3>

          <p className="text-xs text-muted-foreground mb-4">
            Average health score dipped during monsoon and recovered slightly
            after patch repairs.
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.healthTrendAllRoads}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgHealth"
                name="Avg Health"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="critical"
                name="Critical Roads"
                stroke="#DC2626"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className="p-5 rounded-2xl"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h3
            className="font-semibold mb-1"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Contractor Repair Efficiency
          </h3>

          <p className="text-xs text-muted-foreground mb-4">
            Contractor comparison using on-time completion, budget discipline
            and repair quality.
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.repairEfficiency}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="contractor"
                tick={{ fontSize: 9 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={65}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" name="On Time %" fill="#0EA5A4" />
              <Bar dataKey="budget" name="Budget %" fill="#3B82F6" />
              <Bar dataKey="quality" name="Quality %" fill="#16A34A" />
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
          className="font-semibold mb-1"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Issue Severity by City
        </h3>

        <p className="text-xs text-muted-foreground mb-4">
          Smaller, believable issue counts across Maharashtra pilot zones.
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.issuesByCity}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="city" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="critical" name="Critical" stackId="a" fill="#DC2626" />
            <Bar dataKey="high" name="High" stackId="a" fill="#F97316" />
            <Bar dataKey="medium" name="Medium" stackId="a" fill="#F59E0B" />
            <Bar dataKey="low" name="Low" stackId="a" fill="#16A34A" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}