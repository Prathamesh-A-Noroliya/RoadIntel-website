import { useEffect, useMemo, useState } from "react";
import { useListComplaints } from "@workspace/api-client-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Plus,
  Route,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low";
type ComplaintStatus =
  | "filed"
  | "assigned"
  | "in_progress"
  | "verified"
  | "resolved"
  | "escalated";

type Complaint = {
  id: string | number;
  complaintId: string;
  title: string;
  location: string;
  status: ComplaintStatus;
  severity: Severity;
  issueType: string;
  createdAt: string;
  assignedDepartment: string;
  assignedEngineer: string;
  sla: string;
  authority: string;
  zone: string;
  description: string;
};

type ComplaintForm = {
  title: string;
  location: string;
  issueType: string;
  severity: Severity;
  roadType: "urban" | "pcmc" | "state" | "national";
  description: string;
};

type RoutingDecision = {
  authority: string;
  department: string;
  engineer: string;
  sla: string;
  zone: string;
};

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    complaintId: "RI-PUN-2026-001",
    title: "Large pothole near bus stop",
    location: "FC Road Junction, Pune",
    status: "in_progress",
    severity: "high",
    issueType: "Pothole",
    createdAt: "2026-04-18",
    assignedDepartment: "PMC Roads Department",
    assignedEngineer: "Ward Engineer — Shivajinagar",
    sla: "48 hours",
    authority: "PMC",
    zone: "Pune Central",
    description:
      "Citizen reported a large pothole near the bus stop after recent rainfall. Two-wheeler risk is high.",
  },
  {
    id: 2,
    complaintId: "RI-PUN-2026-002",
    title: "Waterlogging near school entrance",
    location: "Baner Link Road, Pune",
    status: "assigned",
    severity: "medium",
    issueType: "Waterlogging",
    createdAt: "2026-04-19",
    assignedDepartment: "PMC Stormwater + Roads Cell",
    assignedEngineer: "Assistant Engineer — Baner Ward",
    sla: "5 days",
    authority: "PMC",
    zone: "Pune West",
    description:
      "Water accumulation near school gate is creating pedestrian and traffic risk during morning hours.",
  },
  {
    id: 3,
    complaintId: "RI-PCMC-2026-003",
    title: "Cracked road surface",
    location: "Wakad-Hinjewadi Road, PCMC",
    status: "verified",
    severity: "medium",
    issueType: "Cracking",
    createdAt: "2026-04-16",
    assignedDepartment: "PCMC Roads Department",
    assignedEngineer: "Junior Engineer — Wakad Zone",
    sla: "7 days",
    authority: "PCMC",
    zone: "PCMC Corridor",
    description:
      "Longitudinal cracking observed near high-traffic IT corridor. Preventive sealing recommended.",
  },
  {
    id: 4,
    complaintId: "RI-PUN-2026-004",
    title: "Broken road edge near market",
    location: "Sinhagad Road, Pune",
    status: "filed",
    severity: "low",
    issueType: "Edge Damage",
    createdAt: "2026-04-20",
    assignedDepartment: "PMC Ward Roads Team",
    assignedEngineer: "Ward Review Pending",
    sla: "10 days",
    authority: "PMC",
    zone: "Pune South",
    description:
      "Minor edge damage near roadside parking area. Needs inspection before monsoon escalation.",
  },
  {
    id: 5,
    complaintId: "RI-PUN-2026-005",
    title: "Repeated patch failure",
    location: "JM Road Patch Zone, Pune",
    status: "escalated",
    severity: "critical",
    issueType: "Repeat Repair Failure",
    createdAt: "2026-04-21",
    assignedDepartment: "PMC Emergency Roads Cell",
    assignedEngineer: "Executive Engineer — Roads",
    sla: "24 hours",
    authority: "PMC",
    zone: "Pune Central",
    description:
      "Same patch failed again after repair. Case escalated for contractor quality review.",
  },
  {
    id: 6,
    complaintId: "RI-PCMC-2026-006",
    title: "Potholes on service road",
    location: "Ravet BRT Service Road, PCMC",
    status: "resolved",
    severity: "medium",
    issueType: "Pothole",
    createdAt: "2026-04-12",
    assignedDepartment: "PCMC Roads Department",
    assignedEngineer: "Assistant Engineer — Ravet",
    sla: "5 days",
    authority: "PCMC",
    zone: "PCMC Corridor",
    description:
      "Multiple small potholes reported. Repair was verified through field image and citizen confirmation.",
  },
];

const STATUS_FLOW: ComplaintStatus[] = [
  "filed",
  "assigned",
  "in_progress",
  "verified",
  "resolved",
];

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  filed: "Filed",
  assigned: "Assigned",
  in_progress: "In Progress",
  verified: "Verified",
  resolved: "Resolved",
  escalated: "Escalated",
};

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  filed: "#64748B",
  assigned: "#3B82F6",
  in_progress: "#0EA5A4",
  verified: "#8B5CF6",
  resolved: "#16A34A",
  escalated: "#DC2626",
};

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#DC2626",
  high: "#F97316",
  medium: "#F59E0B",
  low: "#16A34A",
};

const ISSUE_TYPES = [
  "Pothole",
  "Cracking",
  "Waterlogging",
  "Edge Damage",
  "Surface Damage",
  "Repeat Repair Failure",
  "Missing Road Marking",
];

const BANNED_REMOTE_TERMS = [
  "AIIMS",
  "Delhi",
  "Bangalore",
  "Andheri",
  "Outer Ring",
  "NH-48",
];

function normalizeStatus(value: unknown): ComplaintStatus {
  const status = String(value ?? "filed").toLowerCase().replaceAll(" ", "_");

  if (status === "pending") return "filed";
  if (status === "assigned") return "assigned";
  if (status === "in_progress") return "in_progress";
  if (status === "verified") return "verified";
  if (status === "resolved") return "resolved";
  if (status === "escalated") return "escalated";

  return "filed";
}

function normalizeSeverity(value: unknown): Severity {
  const severity = String(value ?? "medium").toLowerCase();

  if (severity === "critical") return "critical";
  if (severity === "high") return "high";
  if (severity === "low") return "low";

  return "medium";
}

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;

  for (const key of ["data", "complaints", "items", "results", "rows", "list"]) {
    const item = record[key];

    if (Array.isArray(item)) return item as T[];

    if (item && typeof item === "object") {
      const nested = toArray<T>(item);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function isPilotLocation(location: string) {
  return !BANNED_REMOTE_TERMS.some((term) =>
    location.toLowerCase().includes(term.toLowerCase()),
  );
}

function normalizeComplaints(value: unknown): Complaint[] {
  const source = toArray<Record<string, unknown>>(value);

  if (source.length === 0) return MOCK_COMPLAINTS;

  const normalized = source.map((item, index): Complaint => {
    const location = String(item.location ?? item.address ?? "Pune Pilot Zone");

    return {
      id: item.id ?? index + 1,
      complaintId: String(
        item.complaintId ?? item.complaint_id ?? `RI-PILOT-${index + 1}`,
      ),
      title: String(item.title ?? item.subject ?? "Road issue reported"),
      location,
      status: normalizeStatus(item.status),
      severity: normalizeSeverity(item.severity),
      issueType: String(item.issueType ?? item.issue_type ?? "Road Damage"),
      createdAt: String(item.createdAt ?? item.created_at ?? "2026-04-20"),
      assignedDepartment: String(
        item.assignedDepartment ??
          item.assigned_department ??
          "PMC Roads Department",
      ),
      assignedEngineer: String(
        item.assignedEngineer ?? item.assigned_engineer ?? "Ward Engineer",
      ),
      sla: String(item.sla ?? "5 days"),
      authority: String(item.authority ?? "PMC"),
      zone: String(item.zone ?? "Pune Pilot"),
      description: String(
        item.description ??
          "Citizen complaint routed through RoadIntel pilot workflow.",
      ),
    };
  });

  if (normalized.some((item) => !isPilotLocation(item.location))) {
    return MOCK_COMPLAINTS;
  }

  return normalized;
}

function getRoutingDecision(form: ComplaintForm): RoutingDecision {
  const location = form.location.toLowerCase();

  if (form.roadType === "national") {
    return {
      authority: "NHAI / MSRDC",
      department: "Highway Maintenance Unit",
      engineer:
        form.severity === "critical"
          ? "Executive Engineer — Highway Safety"
          : "Assistant Engineer — Highway Maintenance",
      sla: form.severity === "critical" ? "24-48 hours" : "5-7 days",
      zone: "Highway Corridor",
    };
  }

  if (
    form.roadType === "pcmc" ||
    location.includes("wakad") ||
    location.includes("hinjewadi") ||
    location.includes("ravet") ||
    location.includes("pimpri") ||
    location.includes("chinchwad")
  ) {
    return {
      authority: "PCMC",
      department: "PCMC Roads Department",
      engineer:
        form.severity === "critical"
          ? "Executive Engineer — PCMC Roads"
          : "Ward Engineer — PCMC Zone",
      sla:
        form.severity === "critical"
          ? "24 hours"
          : form.severity === "high"
            ? "48 hours"
            : "5 days",
      zone: "PCMC Corridor",
    };
  }

  if (form.roadType === "state") {
    return {
      authority: "PWD Maharashtra",
      department: "PWD Road Maintenance Division",
      engineer:
        form.severity === "critical"
          ? "Executive Engineer — PWD"
          : "Assistant Engineer — PWD",
      sla: form.severity === "critical" ? "48 hours" : "7 days",
      zone: "State Road",
    };
  }

  return {
    authority: "PMC",
    department:
      form.issueType === "Waterlogging"
        ? "PMC Stormwater + Roads Cell"
        : "PMC Roads Department",
    engineer:
      form.severity === "critical"
        ? "Executive Engineer — PMC Roads"
        : "Ward Engineer — PMC Zone",
    sla:
      form.severity === "critical"
        ? "24 hours"
        : form.severity === "high"
          ? "48 hours"
          : "5-10 days",
    zone: "Pune Urban",
  };
}

function getStatusIndex(status: ComplaintStatus) {
  if (status === "escalated") return 1;
  return Math.max(0, STATUS_FLOW.indexOf(status));
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildChartData(complaints: Complaint[], key: "status" | "issueType") {
  const counts = complaints.reduce<Record<string, number>>((acc, complaint) => {
    const value =
      key === "status" ? STATUS_LABELS[complaint.status] : complaint.issueType;

    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function getLocalComplaints(): Complaint[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem("roadintel-local-complaints");
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as Complaint[]) : [];
  } catch {
    return [];
  }
}

function MetricCard({
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

function SeverityPill({ severity }: { severity: Severity }) {
  const color = SEVERITY_COLORS[severity];

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {severity}
    </span>
  );
}

function StatusPill({ status }: { status: ComplaintStatus }) {
  const color = STATUS_COLORS[status];

  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatusStepper({ status }: { status: ComplaintStatus }) {
  const activeIndex = getStatusIndex(status);

  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {STATUS_FLOW.map((step, index) => {
          const isDone = index <= activeIndex;
          const color = status === "escalated" ? "#DC2626" : "#0EA5A4";

          return (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className="h-2 w-full rounded-full"
                style={{
                  background: isDone ? color : "hsl(var(--border))",
                }}
              />

              <span className="hidden text-[10px] text-muted-foreground sm:block">
                {STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>

      {status === "escalated" && (
        <p className="mt-2 text-xs font-medium text-red-400">
          Escalated for senior engineer / contractor audit review.
        </p>
      )}
    </div>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <article
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {complaint.complaintId}
            </span>

            <SeverityPill severity={complaint.severity} />
            <StatusPill status={complaint.status} />
          </div>

          <h3
            className="mt-2 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {complaint.title}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {complaint.location}
          </p>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {complaint.description}
          </p>
        </div>

        <div
          className="rounded-2xl p-3 lg:min-w-[230px]"
          style={{
            background: "hsl(var(--muted))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <p className="text-xs text-muted-foreground">Assigned Authority</p>
          <p className="mt-1 font-semibold">{complaint.authority}</p>

          <p className="mt-3 text-xs text-muted-foreground">Department</p>
          <p className="mt-1 text-sm">{complaint.assignedDepartment}</p>

          <p className="mt-3 text-xs text-muted-foreground">SLA</p>
          <p className="mt-1 text-sm font-semibold">{complaint.sla}</p>
        </div>
      </div>

      <div className="mt-4">
        <StatusStepper status={complaint.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Created: {formatDate(complaint.createdAt)}</span>
        <span>{complaint.assignedEngineer}</span>
      </div>
    </article>
  );
}

export default function Complaints() {
  const { data: complaintData, isLoading } = useListComplaints();

  const [showForm, setShowForm] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [localComplaints, setLocalComplaints] =
    useState<Complaint[]>(getLocalComplaints);
  const [submitResult, setSubmitResult] = useState<RoutingDecision | null>(null);

  const [form, setForm] = useState<ComplaintForm>({
    title: "",
    location: "",
    issueType: "Pothole",
    severity: "medium",
    roadType: "urban",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "roadintel-local-complaints",
      JSON.stringify(localComplaints),
    );
  }, [localComplaints]);

  const apiComplaints = useMemo(
    () => normalizeComplaints(complaintData),
    [complaintData],
  );

  const complaints = useMemo(() => {
    const merged = [...localComplaints, ...apiComplaints];

    return merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [localComplaints, apiComplaints]);

  const statusData = useMemo(
    () => buildChartData(complaints, "status"),
    [complaints],
  );

  const typeData = useMemo(
    () => buildChartData(complaints, "issueType"),
    [complaints],
  );

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "resolved",
  ).length;

  const activeCount = complaints.filter(
    (complaint) =>
      complaint.status !== "resolved" && complaint.status !== "verified",
  ).length;

  const escalatedCount = complaints.filter(
    (complaint) => complaint.status === "escalated",
  ).length;

  function updateForm<K extends keyof ComplaintForm>(
    key: K,
    value: ComplaintForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm({
      title: "",
      location: "",
      issueType: "Pothole",
      severity: "medium",
      roadType: "urban",
      description: "",
    });
    setAttachmentName("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim() || !form.description.trim()) {
      alert("Please fill title, location and description.");
      return;
    }

    const routing = getRoutingDecision(form);

    const newComplaint: Complaint = {
      id: `local-${Date.now()}`,
      complaintId: `RI-PILOT-${String(complaints.length + 1).padStart(3, "0")}`,
      title: form.title.trim(),
      location: form.location.trim(),
      status: "assigned",
      severity: form.severity,
      issueType: form.issueType,
      createdAt: new Date().toISOString(),
      assignedDepartment: routing.department,
      assignedEngineer: routing.engineer,
      sla: routing.sla,
      authority: routing.authority,
      zone: routing.zone,
      description: form.description.trim(),
    };

    setLocalComplaints((current) => [newComplaint, ...current]);
    setSubmitResult(routing);
    setShowForm(false);
    resetForm();
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
              ROUTING_ENGINE active
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Citizen Complaint Routing
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              File road complaints, route them to PMC / PCMC / PWD / NHAI, and
              track every case through a transparent status timeline.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            File New Complaint
          </button>
        </div>
      </section>

      {submitResult && (
        <section
          className="rounded-2xl p-4"
          style={{
            background: "rgba(22,163,74,0.10)",
            border: "1px solid rgba(22,163,74,0.28)",
          }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />

            <div>
              <h3 className="font-semibold">Complaint routed successfully</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Assigned to {submitResult.authority} · {submitResult.engineer} ·
                SLA: {submitResult.sla}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSubmitResult(null)}
              className="ml-auto rounded-xl p-1.5 text-muted-foreground hover:bg-white/10"
              aria-label="Dismiss routing result"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Complaints Filed"
          value={complaints.length}
          note="Pilot complaint records"
          icon={FileText}
          color="#0EA5A4"
        />

        <MetricCard
          label="Active Cases"
          value={activeCount}
          note="Open / assigned / in progress"
          icon={Clock3}
          color="#F97316"
        />

        <MetricCard
          label="Resolved"
          value={resolvedCount}
          note="Verified or repaired"
          icon={CheckCircle2}
          color="#16A34A"
        />

        <MetricCard
          label="Escalated"
          value={escalatedCount}
          note="Audit or urgent review"
          icon={AlertTriangle}
          color="#DC2626"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div
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
            Complaint Status Distribution
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Transparent view of where each citizen complaint stands.
          </p>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {statusData.map((item) => {
                    const statusEntry = Object.entries(STATUS_LABELS).find(
                      ([, label]) => label === item.name,
                    );

                    const color = statusEntry
                      ? STATUS_COLORS[statusEntry[0] as ComplaintStatus]
                      : "#0EA5A4";

                    return <Cell key={item.name} fill={color} />;
                  })}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
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
            Issue Type Mix
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Helps authorities plan material, manpower and inspection routes.
          </p>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#0EA5A4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Complaint Timeline Board
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Mobile-friendly cards replace cluttered wide tables and make case
              progress easier to explain to judges.
            </p>
          </div>

          {isLoading && (
            <span className="text-xs text-muted-foreground">
              Syncing complaint records...
            </span>
          )}
        </div>

        <div className="space-y-4">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  File Road Complaint
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  RoadIntel routes the issue to the most relevant authority.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-white/10"
                aria-label="Close complaint form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <InputBlock label="Complaint Title">
                  <input
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                    placeholder="Example: Large pothole near bus stop"
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </InputBlock>

                <InputBlock label="Location">
                  <input
                    value={form.location}
                    onChange={(event) =>
                      updateForm("location", event.target.value)
                    }
                    placeholder="Example: FC Road Junction, Pune"
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </InputBlock>

                <InputBlock label="Issue Type">
                  <select
                    value={form.issueType}
                    onChange={(event) =>
                      updateForm("issueType", event.target.value)
                    }
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    {ISSUE_TYPES.map((issue) => (
                      <option key={issue} value={issue}>
                        {issue}
                      </option>
                    ))}
                  </select>
                </InputBlock>

                <InputBlock label="Severity">
                  <select
                    value={form.severity}
                    onChange={(event) =>
                      updateForm("severity", event.target.value as Severity)
                    }
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </InputBlock>

                <InputBlock label="Road Ownership">
                  <select
                    value={form.roadType}
                    onChange={(event) =>
                      updateForm(
                        "roadType",
                        event.target.value as ComplaintForm["roadType"],
                      )
                    }
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <option value="urban">PMC Urban Road</option>
                    <option value="pcmc">PCMC Road</option>
                    <option value="state">PWD / State Road</option>
                    <option value="national">NHAI / Expressway</option>
                  </select>
                </InputBlock>

                <InputBlock label="Upload Photo">
                  <label
                    className="flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-sm"
                    style={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <span className="truncate text-muted-foreground">
                      {attachmentName || "Choose road image"}
                    </span>

                    <Upload className="h-4 w-4 text-muted-foreground" />

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) setAttachmentName(file.name);
                      }}
                    />
                  </label>
                </InputBlock>
              </div>

              <InputBlock label="Description">
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={4}
                  placeholder="Describe the road issue, nearby landmark, danger level, and when it was observed."
                  className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
              </InputBlock>

              <RoutingPreview form={form} />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold"
                  style={{
                    background: "hsl(var(--muted))",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3 text-sm font-bold text-white"
                >
                  Submit & Route Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InputBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function RoutingPreview({ form }: { form: ComplaintForm }) {
  const routing = getRoutingDecision(form);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(14,165,164,0.08)",
        border: "1px solid rgba(14,165,164,0.22)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" style={{ color: "#0EA5A4" }} />
        <h3 className="text-sm font-semibold">Routing Preview</h3>
      </div>

      <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
        <div>
          Authority:{" "}
          <span className="font-semibold text-foreground">
            {routing.authority}
          </span>
        </div>

        <div>
          Department:{" "}
          <span className="font-semibold text-foreground">
            {routing.department}
          </span>
        </div>

        <div>
          Engineer:{" "}
          <span className="font-semibold text-foreground">
            {routing.engineer}
          </span>
        </div>

        <div>
          SLA:{" "}
          <span className="font-semibold text-foreground">{routing.sla}</span>
        </div>
      </div>
    </div>
  );
}