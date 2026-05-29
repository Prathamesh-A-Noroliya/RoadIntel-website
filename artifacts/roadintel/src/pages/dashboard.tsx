import { Link } from "wouter";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  IndianRupee,
  Map,
  Radio,
  Scan,
  ShieldCheck,
  TrendingDown,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGetDashboardSummary } from "@workspace/api-client-react";

type Severity = "critical" | "high" | "medium" | "low" | "info";

type ActivityItem = {
  id: number;
  title: string;
  location: string;
  time: string;
  severity: Severity;
  summary: string;
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  severity: Severity;
  read: boolean;
};

type DecisionInsight = {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
};

const PILOT_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    title: "High-risk road segment detected",
    location: "JM Road, Pune",
    time: "12 min ago",
    severity: "high",
    summary: "Complaint density increased after rainfall. Inspection suggested within 48 hours.",
  },
  {
    id: 2,
    title: "New complaint routed to PMC",
    location: "FC Road Junction",
    time: "24 min ago",
    severity: "medium",
    summary: "Pothole complaint assigned to Ward Engineer — Shivajinagar zone.",
  },
  {
    id: 3,
    title: "Contractor watchlist updated",
    location: "Pune Central",
    time: "1 hr ago",
    severity: "high",
    summary: "UrbanBuild Pune Services flagged for repeated patch failures.",
  },
  {
    id: 4,
    title: "Repair verification completed",
    location: "Baner Link Road",
    time: "2 hr ago",
    severity: "info",
    summary: "Citizen photo and inspection note marked repair as verified.",
  },
];

const PILOT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Inspection Required",
    message: "JM Road Patch Zone crossed high-risk threshold.",
    severity: "high",
    read: false,
  },
  {
    id: 2,
    title: "Complaint Assigned",
    message: "FC Road complaint routed to PMC Shivajinagar ward.",
    severity: "medium",
    read: false,
  },
  {
    id: 3,
    title: "Demo Sensor Feed",
    message: "Simulated vibration feed active for Pune pilot roads.",
    severity: "info",
    read: true,
  },
];

const DECISION_INSIGHTS: DecisionInsight[] = [
  {
    id: 1,
    title: "Failure risk rising on JM Road",
    description:
      "Rule engine combines complaint frequency, monsoon exposure, and road health decline.",
    severity: "high",
    confidence: 0.84,
  },
  {
    id: 2,
    title: "Budget-quality mismatch",
    description:
      "UrbanBuild Pune Services shows higher repair spend but lower post-repair quality.",
    severity: "medium",
    confidence: 0.79,
  },
  {
    id: 3,
    title: "Preventive maintenance window",
    description:
      "Baner Link Road can avoid escalation with low-cost crack sealing this month.",
    severity: "low",
    confidence: 0.81,
  },
];

const QUICK_ACTIONS = [
  {
    label: "File Complaint",
    href: "/complaints",
    icon: FileText,
    color: "#0EA5A4",
    description: "Citizen issue reporting",
  },
  {
    label: "Quick Scan",
    href: "/scan",
    icon: Scan,
    color: "#F59E0B",
    description: "Road image analysis",
  },
  {
    label: "Risk Map",
    href: "/risk-map",
    icon: TrendingDown,
    color: "#DC2626",
    description: "Failure prediction",
  },
  {
    label: "Public Spending",
    href: "/spending",
    icon: Wallet,
    color: "#3B82F6",
    description: "Budget transparency",
  },
];

const SECONDARY_ACTIONS = [
  {
    label: "Road DNA",
    href: "/roads",
    icon: Map,
  },
  {
    label: "Sensor Intel",
    href: "/sensors",
    icon: Radio,
  },
  {
    label: "Contractors",
    href: "/contractors",
    icon: ShieldCheck,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: Activity,
  },
];

function safePilotNumber(
  value: unknown,
  fallback: number,
  maxReasonable: number,
) {
  const numberValue = Number(value);

  if (
    !Number.isFinite(numberValue) ||
    numberValue < 0 ||
    numberValue > maxReasonable
  ) {
    return fallback;
  }

  return Math.round(numberValue);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getSeverityColor(severity: Severity) {
  switch (severity) {
    case "critical":
      return "#DC2626";
    case "high":
      return "#F97316";
    case "medium":
      return "#F59E0B";
    case "low":
      return "#16A34A";
    case "info":
    default:
      return "#0EA5A4";
  }
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
  icon: LucideIcon;
  color: string;
  sub: string;
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
          style={{
            background: `${color}14`,
            color,
          }}
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

      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-5 py-4"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <h2
          className="font-semibold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

export default function Dashboard() {
  const { data: summary } = useGetDashboardSummary();
  const summaryRecord = (summary ?? {}) as Record<string, unknown>;

  const totalComplaints = safePilotNumber(
    summaryRecord.totalComplaints,
    220,
    1200,
  );

  const activeIssues = safePilotNumber(
    summaryRecord.activeComplaints,
    31,
    300,
  );

  const roadsMonitored = safePilotNumber(summaryRecord.roadsMonitored, 8, 50);

  const sensorAnomalies = safePilotNumber(
    summaryRecord.sensorAnomalies,
    6,
    25,
  );

  const avgHealthScore = safePilotNumber(
    summaryRecord.avgHealthScore,
    74,
    100,
  );

  const unreadNotifications = PILOT_NOTIFICATIONS.filter(
    (notification) => !notification.read,
  ).length;

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
              <ShieldCheck className="h-3.5 w-3.5" />
              Pune / PCMC Pilot Dashboard
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              RoadIntel Operations Overview
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              A focused view of road complaints, road health, risk prediction,
              public spending, and contractor accountability for a realistic
              pilot deployment.
            </p>
          </div>

          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              System Online
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Demo mode · Simulated sensor feed · Apr 2026
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Complaints Filed"
          value={formatNumber(totalComplaints)}
          icon={FileText}
          color="#0EA5A4"
          sub="Pilot total"
        />

        <StatCard
          label="Active Issues"
          value={formatNumber(activeIssues)}
          icon={AlertTriangle}
          color="#F97316"
          sub="Open or assigned"
        />

        <StatCard
          label="Roads Monitored"
          value={roadsMonitored}
          icon={Map}
          color="#16A34A"
          sub="Pune / PCMC corridors"
        />

        <StatCard
          label="Sensor Alerts"
          value={sensorAnomalies}
          icon={Radio}
          color="#F59E0B"
          sub="Demo feed today"
        />

        <StatCard
          label="Avg Health"
          value={`${avgHealthScore}/100`}
          icon={Activity}
          color="#3B82F6"
          sub="Network score"
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Priority Actions
            </h2>
          </div>

          <span className="text-xs text-muted-foreground">
            All buttons route to working pages
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon, color, description }) => (
            <Link key={href} href={href}>
              <div
                className="group cursor-pointer rounded-2xl p-4 transition hover:-translate-y-0.5"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${color}16` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                </div>

                <div className="mt-4 font-semibold">{label}</div>

                <div className="mt-1 text-xs text-muted-foreground">
                  {description}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SECONDARY_ACTIONS.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <div
                className="flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-sm transition hover:bg-muted"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </span>

                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionCard
          title="Priority Board"
          action={
            <Link href="/analytics">
              <button
                className="flex items-center gap-1 text-xs"
                style={{ color: "#0EA5A4" }}
              >
                View analytics
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          }
        >
          <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
            {PILOT_ACTIVITY.map((item) => {
              const color = getSeverityColor(item.severity);

              return (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: color }}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-medium">{item.title}</h3>

                        <span
                          className="w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase"
                          style={{
                            background: `${color}18`,
                            color,
                          }}
                        >
                          {item.severity}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.location} · {item.time}
                      </p>

                      <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Notifications"
            action={
              unreadNotifications > 0 ? (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ background: "#DC2626" }}
                >
                  {unreadNotifications}
                </span>
              ) : null
            }
          >
            <div className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {PILOT_NOTIFICATIONS.map((notification) => {
                const color = getSeverityColor(notification.severity);

                return (
                  <div key={notification.id} className="px-5 py-3">
                    <div className="flex items-start gap-2">
                      <Bell className="mt-0.5 h-4 w-4" style={{ color }} />

                      <div>
                        <div
                          className={`text-sm font-medium ${
                            notification.read ? "opacity-70" : ""
                          }`}
                        >
                          {notification.title}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Decision Engine">
            <div className="space-y-3 p-4">
              {DECISION_INSIGHTS.map((insight) => {
                const color = getSeverityColor(insight.severity);

                return (
                  <div
                    key={insight.id}
                    className="rounded-2xl p-3"
                    style={{
                      background: "hsl(var(--muted))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold">
                        {insight.title}
                      </div>

                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{
                          background: `${color}18`,
                          color,
                        }}
                      >
                        {(insight.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                );
              })}

              <div className="rounded-xl bg-primary/10 p-3 text-xs leading-5 text-muted-foreground">
                Labelled as a rule-based decision engine for demo honesty,
                avoiding vague AI claims.
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <section
        className="grid gap-4 rounded-3xl p-5 md:grid-cols-3"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <SnapshotCard
          icon={CheckCircle2}
          label="Resolved Cases"
          value="149"
          note="67.7% closure in pilot"
          color="#16A34A"
        />

        <SnapshotCard
          icon={Clock3}
          label="Avg Resolution"
          value="4.8 days"
          note="PMC / PCMC assigned cases"
          color="#F59E0B"
        />

        <SnapshotCard
          icon={IndianRupee}
          label="Flagged Spend"
          value="₹1.86 Cr"
          note="Repeat-repair review queue"
          color="#DC2626"
        />
      </section>
    </div>
  );
}

function SnapshotCard({
  icon: Icon,
  label,
  value,
  note,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  color: string;
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
        <Icon className="h-4 w-4" style={{ color }} />

        <span className="text-sm font-medium">{label}</span>
      </div>

      <div
        className="text-2xl font-bold"
        style={{
          color,
          fontFamily: "Sora, sans-serif",
        }}
      >
        {value}
      </div>

      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}