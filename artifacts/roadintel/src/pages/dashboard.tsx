import { Link } from "wouter";
import {
  FileText,
  Scan,
  Map,
  Radio,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Bell,
} from "lucide-react";
import {
  useGetDashboardSummary,
  useGetRecentActivity,
  useGetAiInsights,
  useListNotifications,
} from "@workspace/api-client-react";

function safeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? value : fallback;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>

      <div
        className="text-2xl font-bold mb-0.5"
        style={{ fontFamily: "Sora, sans-serif" }}
      >
        {value}
      </div>

      <div className="text-sm font-medium">{label}</div>
      {sub && <div className="text-xs mt-1 text-muted-foreground">{sub}</div>}
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "File Complaint", href: "/complaints", icon: FileText, color: "#0EA5A4" },
  { label: "Quick Scan", href: "/scan", icon: Scan, color: "#F59E0B" },
  { label: "Road DNA", href: "/roads", icon: Map, color: "#16A34A" },
  { label: "Sensor Intel", href: "/sensors", icon: Radio, color: "#0EA5A4" },
  { label: "Risk Map", href: "/risk-map", icon: TrendingDown, color: "#DC2626" },
  { label: "Public Spending", href: "/spending", icon: Wallet, color: "#F59E0B" },
];

export default function Dashboard() {
  const { data: summary } = useGetDashboardSummary();
  const { data: activity } = useGetRecentActivity();
  const { data: insights } = useGetAiInsights();
  const { data: notifications } = useListNotifications();

  const activityList = safeArray<any>(activity, MOCK_ACTIVITY);
  const insightList = safeArray<any>(insights, MOCK_INSIGHTS);
  const notificationList = safeArray<any>(notifications, MOCK_NOTIFICATIONS);

  const unreadNotifications = notificationList.filter((n) => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      <div
        className="p-6 rounded-2xl"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #0EA5A4 100%)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium mb-1 text-white/60">
              Road Intelligence Platform
            </div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Welcome to RoadIntel
            </h1>
            <p className="text-sm mt-1 text-white/70">
              Monitor roads. Track complaints. Ensure accountability.
            </p>
          </div>

          <div
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <Activity className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">System Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Complaints" value={summary?.totalComplaints ?? 94320} icon={FileText} color="#0EA5A4" />
        <StatCard label="Active Issues" value={summary?.activeComplaints ?? 12847} icon={AlertTriangle} color="#DC2626" />
        <StatCard label="Roads Monitored" value={summary?.roadsMonitored ?? 8} icon={Map} color="#16A34A" />
        <StatCard label="Sensor Anomalies" value={summary?.sensorAnomalies ?? 34} icon={Radio} color="#F59E0B" sub="Today" />
        <StatCard label="Avg Health Score" value={`${summary?.avgHealthScore?.toFixed?.(0) ?? 62}/100`} icon={Activity} color="#0EA5A4" />
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Quick Actions
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <div
                className="p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-xs font-medium">{label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div
          className="md:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
              Recent Activity
            </h3>

            <Link href="/analytics">
              <button className="text-xs flex items-center gap-1" style={{ color: "#0EA5A4" }}>
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </Link>
          </div>

          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {activityList.slice(0, 6).map((item: any) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                <div
                  className="w-2 h-2 rounded-full mt-2 shrink-0"
                  style={{
                    background:
                      item.severity === "critical"
                        ? "#DC2626"
                        : item.severity === "high"
                        ? "#F59E0B"
                        : "#0EA5A4",
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.message}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.location ?? "Platform"} · {item.timestamp}
                  </div>
                </div>

                <span
                  className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background:
                      item.severity === "critical"
                        ? "#DC262618"
                        : item.severity === "high"
                        ? "#F59E0B18"
                        : "#0EA5A418",
                    color:
                      item.severity === "critical"
                        ? "#DC2626"
                        : item.severity === "high"
                        ? "#F59E0B"
                        : "#0EA5A4",
                  }}
                >
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          >
            <div
              className="flex items-center gap-2 px-5 py-4 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Bell className="w-4 h-4" />
              <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
                Notifications
              </h3>

              {unreadNotifications > 0 && (
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ background: "#DC2626" }}
                >
                  {unreadNotifications}
                </span>
              )}
            </div>

            <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {notificationList.slice(0, 4).map((n: any) => (
                <div key={n.id} className="px-5 py-3">
                  <div className={`text-xs font-medium flex items-center gap-1.5 ${!n.read ? "" : "opacity-60"}`}>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background:
                          n.severity === "critical"
                            ? "#DC2626"
                            : n.severity === "high"
                            ? "#F59E0B"
                            : "#0EA5A4",
                      }}
                    />
                    {n.title}
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {n.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <h3 className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>
                AI Insights
              </h3>

              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}
              >
                AI
              </span>
            </div>

            <div className="p-4 space-y-3">
              {insightList.slice(0, 3).map((i: any) => (
                <div key={i.id} className="p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                  <div className="text-xs font-semibold mb-1">{i.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {i.description}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: i.severity === "critical" ? "#DC262618" : "#F59E0B18",
                        color: i.severity === "critical" ? "#DC2626" : "#F59E0B",
                      }}
                    >
                      {i.severity}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {i.confidence ? `${(i.confidence * 100).toFixed(0)}% confidence` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_ACTIVITY = [
  { id: 1, message: "Critical road failure detected on AIIMS Delhi Stretch", location: "Delhi", timestamp: "2 min ago", severity: "critical", type: "sensor" },
  { id: 2, message: "New complaint filed: Large pothole on MG Road", location: "Bangalore", timestamp: "8 min ago", severity: "high", type: "complaint" },
  { id: 3, message: "Corruption pattern detected: RoadCraft Solutions flagged", location: "National", timestamp: "25 min ago", severity: "high", type: "ai" },
  { id: 4, message: "Sensor anomaly: Andheri-Kurla Road vibration spike", location: "Mumbai", timestamp: "1 hr ago", severity: "critical", type: "sensor" },
  { id: 5, message: "Repair verified on Electronic City Flyover", location: "Bangalore", timestamp: "2 hr ago", severity: "info", type: "repair" },
  { id: 6, message: "Budget overrun detected: NH-48 stretch exceeded 12%", location: "Delhi-NCR", timestamp: "3 hr ago", severity: "medium", type: "budget" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Critical Road Failure", message: "AIIMS Delhi Stretch health score 22. Immediate action needed.", read: false, severity: "critical" },
  { id: 2, title: "Sensor Alert: High Vibration", message: "Andheri-Kurla Road sensor detected 9.1 intensity.", read: false, severity: "high" },
  { id: 3, title: "Corruption Flag Raised", message: "RoadCraft Solutions flagged for suspicious patterns.", read: false, severity: "high" },
  { id: 4, title: "Repair Verified", message: "MG Road Phase 2 repair validated by AI.", read: true, severity: "info" },
];

const MOCK_INSIGHTS = [
  { id: 1, title: "High repeat failure risk on NH-48", description: "Road has failed 5 times in 3 years. Contractor shows suspicious pattern.", severity: "critical", confidence: 0.92 },
  { id: 2, title: "Budget anomaly detected", description: "Andheri-Kurla Road has 51% budget overrun with quality score of 28/100.", severity: "high", confidence: 0.87 },
  { id: 3, title: "Predicted failure in 7 days", description: "AIIMS Stretch sensor data indicates imminent road failure.", severity: "critical", confidence: 0.95 },
];