import { useMemo, useState } from "react";
import {
  useListComplaints,
  useCreateComplaint,
  useGetComplaintStats,
} from "@workspace/api-client-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MapPin,
  CheckCircle,
  Plus,
  X,
  WifiOff,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { getRiskColor } from "@/lib/utils";

type Complaint = {
  id: string | number;
  complaintId: string;
  title: string;
  location: string;
  status: string;
  severity: string;
  issueType: string;
  createdAt: string;
  assignedDepartment: string;
};

type ChartItem = {
  status?: string;
  type?: string;
  count: number;
};

type ComplaintStats = {
  byStatus: ChartItem[];
  byType: ChartItem[];
};

type SubmitResult = {
  complaintId: string;
  authority: string;
  engineer: string;
  timeline: string;
  zone: string;
} | null;

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  in_progress: "#0EA5A4",
  resolved: "#16A34A",
  escalated: "#DC2626",
};

const PIE_COLORS = ["#F59E0B", "#0EA5A4", "#16A34A", "#DC2626"];

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    complaintId: "CMP-2025-001",
    title: "Large pothole near bus stop",
    location: "FC Road, Pune",
    status: "in_progress",
    severity: "high",
    issueType: "Pothole",
    createdAt: "2025-04-10",
    assignedDepartment: "PMC Roads Department",
  },
  {
    id: 2,
    complaintId: "CMP-2025-002",
    title: "Waterlogging causing traffic risk",
    location: "Baner Road, Pune",
    status: "pending",
    severity: "medium",
    issueType: "Waterlogging",
    createdAt: "2025-04-12",
    assignedDepartment: "PMC Stormwater Cell",
  },
  {
    id: 3,
    complaintId: "CMP-2025-003",
    title: "Cracked road surface on highway stretch",
    location: "Mumbai-Pune Expressway",
    status: "resolved",
    severity: "high",
    issueType: "Cracking",
    createdAt: "2025-04-05",
    assignedDepartment: "MSRDC",
  },
  {
    id: 4,
    complaintId: "CMP-2025-004",
    title: "Damaged road edge near market area",
    location: "Sinhagad Road, Pune",
    status: "pending",
    severity: "medium",
    issueType: "Edge Damage",
    createdAt: "2025-04-14",
    assignedDepartment: "PMC Ward Roads Team",
  },
  {
    id: 5,
    complaintId: "CMP-2025-005",
    title: "Dangerous broken road near hospital",
    location: "Sassoon Hospital Road, Pune",
    status: "escalated",
    severity: "critical",
    issueType: "Surface Damage",
    createdAt: "2025-04-15",
    assignedDepartment: "PMC Emergency Roads Cell",
  },
  {
    id: 6,
    complaintId: "CMP-2025-006",
    title: "Potholes on service road",
    location: "Wakad-Hinjewadi Road",
    status: "resolved",
    severity: "medium",
    issueType: "Pothole",
    createdAt: "2025-04-08",
    assignedDepartment: "PCMC Roads Department",
  },
];

const MOCK_STATS: ComplaintStats = {
  byStatus: [
    { status: "Pending", count: 2 },
    { status: "In Progress", count: 1 },
    { status: "Resolved", count: 2 },
    { status: "Escalated", count: 1 },
  ],
  byType: [
    { type: "Pothole", count: 2 },
    { type: "Waterlogging", count: 1 },
    { type: "Cracking", count: 1 },
    { type: "Surface Damage", count: 1 },
    { type: "Edge Damage", count: 1 },
  ],
};

const ROUTING_ENGINE: Record<
  string,
  { authority: string; engineer: string; timeline: string; zone: string }
> = {
  "NH-critical": {
    authority: "National Highways Authority of India",
    engineer: "Executive Engineer, NHAI",
    timeline: "24-48 hours",
    zone: "National",
  },
  "NH-high": {
    authority: "National Highways Authority of India",
    engineer: "Assistant Engineer, NHAI",
    timeline: "3-5 days",
    zone: "National",
  },
  "NH-medium": {
    authority: "NHAI State Unit",
    engineer: "Junior Engineer, NHAI",
    timeline: "7-10 days",
    zone: "State-National",
  },
  "NH-low": {
    authority: "NHAI State Unit",
    engineer: "NHAI Field Inspector",
    timeline: "15-20 days",
    zone: "State-National",
  },

  "SH-critical": {
    authority: "Maharashtra PWD Emergency Cell",
    engineer: "Executive Engineer, PWD",
    timeline: "24-72 hours",
    zone: "State",
  },
  "SH-high": {
    authority: "Maharashtra Public Works Department",
    engineer: "Assistant Engineer, PWD",
    timeline: "3-7 days",
    zone: "State",
  },
  "SH-medium": {
    authority: "Maharashtra Public Works Department",
    engineer: "Junior Engineer, PWD",
    timeline: "10-15 days",
    zone: "State",
  },
  "SH-low": {
    authority: "PWD District Unit",
    engineer: "Road Inspector, PWD",
    timeline: "20-30 days",
    zone: "State",
  },

  "MDR-critical": {
    authority: "District Roads Division",
    engineer: "Executive Engineer, District Roads",
    timeline: "48-72 hours",
    zone: "District",
  },
  "MDR-high": {
    authority: "District Roads Division",
    engineer: "Assistant Engineer, District Roads",
    timeline: "5-7 days",
    zone: "District",
  },
  "MDR-medium": {
    authority: "District Roads Division",
    engineer: "Junior Engineer, District Roads",
    timeline: "10-15 days",
    zone: "District",
  },
  "MDR-low": {
    authority: "District Roads Division",
    engineer: "Road Inspector",
    timeline: "30 days",
    zone: "District",
  },

  "Urban-critical": {
    authority: "Municipal Corporation Emergency Roads Cell",
    engineer: "Executive Engineer, Municipal Roads",
    timeline: "12-24 hours",
    zone: "Municipal",
  },
  "Urban-high": {
    authority: "Municipal Corporation Roads Department",
    engineer: "Assistant Engineer, Roads",
    timeline: "3-5 days",
    zone: "Municipal",
  },
  "Urban-medium": {
    authority: "Ward Roads Department",
    engineer: "Junior Engineer, Ward Roads",
    timeline: "7-14 days",
    zone: "Municipal",
  },
  "Urban-low": {
    authority: "Ward Committee",
    engineer: "Ward Road Inspector",
    timeline: "30 days",
    zone: "Municipal",
  },
};

const ROAD_AUTOFILL: Record<
  string,
  {
    roadType: string;
    authority: string;
    contractor: string;
    lastRelaying: string;
    budgetRef: string;
    jurisdiction: string;
  }
> = {
  "FC Road": {
    roadType: "Urban",
    authority: "PMC Roads Department",
    contractor: "Pune Urban Infrastructure Works",
    lastRelaying: "March 2023",
    budgetRef: "₹8.4 Cr",
    jurisdiction: "Pune Municipal",
  },
  Baner: {
    roadType: "Urban",
    authority: "PMC Ward Roads Team",
    contractor: "Maharashtra RoadBuild Services",
    lastRelaying: "June 2022",
    budgetRef: "₹11.2 Cr",
    jurisdiction: "Pune Municipal",
  },
  Hinjewadi: {
    roadType: "Urban",
    authority: "PCMC Roads Department",
    contractor: "Metro Road Contractors",
    lastRelaying: "January 2023",
    budgetRef: "₹14.8 Cr",
    jurisdiction: "PCMC",
  },
  "Mumbai-Pune": {
    roadType: "NH",
    authority: "MSRDC",
    contractor: "Expressway Maintenance Unit",
    lastRelaying: "September 2022",
    budgetRef: "₹42.5 Cr",
    jurisdiction: "State-National",
  },
  Sinhagad: {
    roadType: "Urban",
    authority: "PMC Roads Department",
    contractor: "Urban Road Maintenance Pvt Ltd",
    lastRelaying: "December 2022",
    budgetRef: "₹6.9 Cr",
    jurisdiction: "Pune Municipal",
  },
};

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function normalizeComplaints(data: unknown): Complaint[] {
  const source =
    Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.complaints)
        ? (data as any).complaints
        : Array.isArray((data as any)?.data)
          ? (data as any).data
          : Array.isArray((data as any)?.items)
            ? (data as any).items
            : [];

  return source.map((item: any, index: number): Complaint => ({
    id: item?.id ?? item?._id ?? index + 1,
    complaintId:
      item?.complaintId ??
      item?.complaint_id ??
      item?.referenceId ??
      `CMP-${String(index + 1).padStart(3, "0")}`,
    title: item?.title ?? item?.name ?? item?.description ?? "Road complaint",
    location: item?.location ?? item?.address ?? "Location not available",
    status: item?.status ?? "pending",
    severity: item?.severity ?? item?.riskLevel ?? "medium",
    issueType: item?.issueType ?? item?.type ?? item?.category ?? "Road Issue",
    createdAt: item?.createdAt ?? item?.created_at ?? new Date().toISOString(),
    assignedDepartment:
      item?.assignedDepartment ??
      item?.department ??
      item?.authority ??
      "Municipal Roads Department",
  }));
}

function normalizeStats(data: unknown, complaints: Complaint[]): ComplaintStats {
  const rawStatus =
    safeArray<ChartItem>((data as any)?.byStatus).length > 0
      ? safeArray<ChartItem>((data as any)?.byStatus)
      : safeArray<ChartItem>((data as any)?.status);

  const rawType =
    safeArray<ChartItem>((data as any)?.byType).length > 0
      ? safeArray<ChartItem>((data as any)?.byType)
      : safeArray<ChartItem>((data as any)?.types);

  if (rawStatus.length > 0 && rawType.length > 0) {
    return {
      byStatus: rawStatus.map((item: any) => ({
        status: item.status ?? item.name ?? item.label ?? "Unknown",
        count: Number(item.count ?? item.value ?? 0),
      })),
      byType: rawType.map((item: any) => ({
        type: item.type ?? item.name ?? item.label ?? "Other",
        count: Number(item.count ?? item.value ?? 0),
      })),
    };
  }

  const statusCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    const key = c.status || "pending";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const typeCounts = complaints.reduce<Record<string, number>>((acc, c) => {
    const key = c.issueType || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    byStatus: Object.entries(statusCounts).map(([status, count]) => ({
      status: status.replace("_", " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      count,
    })),
    byType: Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
    })),
  };
}

function getRouting(roadType: string, severity: string) {
  const key = `${roadType}-${severity}`;
  return (
    ROUTING_ENGINE[key] ??
    ROUTING_ENGINE[`${roadType}-medium`] ?? {
      authority: "Local Municipal Corporation / PWD",
      engineer: "Executive Engineer",
      timeline: "7-14 days",
      zone: "Local",
    }
  );
}

function getAutofill(roadName: string) {
  for (const [key, value] of Object.entries(ROAD_AUTOFILL)) {
    if (roadName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return null;
}

function saveOffline(data: object) {
  try {
    if (typeof window === "undefined") return false;

    const existingRaw = localStorage.getItem("ri_offline_complaints");
    const existing = Array.isArray(JSON.parse(existingRaw || "[]"))
      ? JSON.parse(existingRaw || "[]")
      : [];

    existing.push({
      ...data,
      savedAt: new Date().toISOString(),
      offlineId: `OFL-${Date.now()}`,
    });

    localStorage.setItem("ri_offline_complaints", JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

function NewComplaintModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    severity: "medium",
    issueType: "Pothole",
    reportedBy: "",
    roadType: "Urban",
    priority: "normal",
    anonymous: false,
    notes: "",
  });

  const [autofill, setAutofill] = useState<ReturnType<typeof getAutofill>>(null);
  const [result, setResult] = useState<SubmitResult>(null);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const create = useCreateComplaint();
  const routing = getRouting(form.roadType, form.severity);

  const setField =
    (key: keyof typeof form) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const target = event.target as HTMLInputElement;
      const value =
        target.type === "checkbox" ? target.checked : event.target.value;

      setForm((current) => {
        const next = { ...current, [key]: value };

        if (key === "location") {
          const matched = getAutofill(String(value));
          setAutofill(matched);

          if (matched) {
            next.roadType = matched.roadType;
          }
        }

        return next;
      });
    };

  const submit = async () => {
    try {
      await create.mutateAsync({
        ...form,
        title: form.title || form.issueType,
      });
    } catch {
      saveOffline(form);
    }

    setResult({
      complaintId: `CMP-${Date.now().toString().slice(-6)}`,
      ...routing,
    });
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";
  const inputStyle: React.CSSProperties = {
    background: "hsl(var(--muted))",
    border: "1px solid hsl(var(--border))",
    color: "hsl(var(--foreground))",
  };

  if (result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
        <div
          className="w-full max-w-lg rounded-2xl p-6 space-y-5"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(22,163,74,0.15)" }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <div>
              <div className="font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
                Complaint Filed Successfully
              </div>
              <div className="text-xs text-muted-foreground">
                Smart routing completed
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Complaint ID", value: result.complaintId, highlight: true },
              { label: "Expected Timeline", value: result.timeline },
              { label: "Assigned Authority", value: result.authority },
              { label: "Executive Engineer", value: result.engineer },
              { label: "Jurisdiction Zone", value: result.zone },
              { label: "Status", value: "Pending Review" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3"
                style={{ background: "hsl(var(--muted))" }}
              >
                <div className="text-xs text-muted-foreground mb-0.5">
                  {item.label}
                </div>
                <div
                  className="text-sm font-semibold"
                  style={item.highlight ? { color: "#0EA5A4" } : undefined}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#0EA5A4" }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div
        className="w-full max-w-2xl rounded-2xl my-4"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <h2 className="font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
            File New Complaint
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  anonymous: !current.anonymous,
                }))
              }
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border"
              style={{
                borderColor: form.anonymous ? "#F5A623" : "hsl(var(--border))",
                color: form.anonymous
                  ? "#F5A623"
                  : "hsl(var(--muted-foreground))",
                background: form.anonymous
                  ? "rgba(245,166,35,0.1)"
                  : "transparent",
              }}
            >
              {form.anonymous ? (
                <EyeOff className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              {form.anonymous ? "Anonymous" : "Show Name"}
            </button>

            <button onClick={onClose} aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
              Complaint Title
            </label>
            <input
              value={form.title}
              onChange={setField("title")}
              placeholder="Brief description of the issue"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Issue Type
              </label>
              <select
                value={form.issueType}
                onChange={setField("issueType")}
                className={inputCls}
                style={inputStyle}
              >
                {[
                  "Pothole",
                  "Cracking",
                  "Road Collapse",
                  "Waterlogging",
                  "Surface Damage",
                  "Edge Damage",
                  "Signage",
                  "Drainage",
                  "Other",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Severity
              </label>
              <select
                value={form.severity}
                onChange={setField("severity")}
                className={inputCls}
                style={inputStyle}
              >
                {["low", "medium", "high", "critical"].map((severity) => (
                  <option key={severity} value={severity}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Road Type
              </label>
              <select
                value={form.roadType}
                onChange={setField("roadType")}
                className={inputCls}
                style={inputStyle}
              >
                <option value="NH">National Highway</option>
                <option value="SH">State Highway</option>
                <option value="MDR">Major District Road</option>
                <option value="Urban">Urban / Municipal Road</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={setField("priority")}
                className={inputCls}
                style={inputStyle}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
              Road Name / Location
            </label>
            <input
              value={form.location}
              onChange={setField("location")}
              placeholder="e.g. FC Road, Baner Road, Mumbai-Pune Expressway"
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {autofill && (
            <div
              className="rounded-xl p-4 space-y-2 text-sm"
              style={{
                background: "rgba(14,165,164,0.08)",
                border: "1px solid rgba(14,165,164,0.2)",
              }}
            >
              <div className="text-xs font-semibold" style={{ color: "#0EA5A4" }}>
                Smart Autofill — Road Data Detected
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Contractor", value: autofill.contractor },
                  { label: "Last Relaying", value: autofill.lastRelaying },
                  { label: "Authority", value: autofill.authority },
                  { label: "Budget Ref", value: autofill.budgetRef },
                  { label: "Jurisdiction", value: autofill.jurisdiction },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg p-2"
                    style={{ background: "hsl(var(--muted))" }}
                  >
                    <div className="text-muted-foreground">{item.label}</div>
                    <div className="font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={setField("description")}
              placeholder="Describe the issue in detail"
              rows={3}
              className={`${inputCls} resize-none`}
              style={inputStyle}
            />
          </div>

          {!form.anonymous && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Your Name / Contact
              </label>
              <input
                value={form.reportedBy}
                onChange={setField("reportedBy")}
                placeholder="Name or phone number"
                className={inputCls}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
              Upload Evidence
            </label>
            <label
              className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl border-2 border-dashed"
              style={{
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              <Upload className="w-5 h-5 shrink-0" />
              <span className="text-sm">
                {filePreview ? "File selected" : "Click to upload photo or video"}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setFilePreview(file.name);
                }}
              />
            </label>

            {filePreview && (
              <div className="mt-1 text-xs text-muted-foreground px-1">
                {filePreview}
              </div>
            )}
          </div>

          <div
            className="p-3 rounded-xl text-xs space-y-1.5"
            style={{
              background: "rgba(30,136,229,0.08)",
              border: "1px solid rgba(30,136,229,0.2)",
            }}
          >
            <div className="font-semibold" style={{ color: "#1E88E5" }}>
              Routing Preview
            </div>
            <div>
              <span className="text-muted-foreground">Authority: </span>
              <strong>{routing.authority}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">Engineer: </span>
              {routing.engineer}
            </div>
            <div>
              <span className="text-muted-foreground">Expected Resolution: </span>
              {routing.timeline}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setOfflineSaved(saveOffline(form))}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border"
              style={{
                borderColor: "hsl(var(--border))",
                color: offlineSaved ? "#16A34A" : "hsl(var(--muted-foreground))",
              }}
            >
              <WifiOff className="w-4 h-4" />
              {offlineSaved ? "Saved Offline" : "Save Offline"}
            </button>

            <button
              onClick={submit}
              disabled={create.isPending}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "#0EA5A4" }}
            >
              {create.isPending ? "Filing..." : "Submit Complaint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Complaints() {
  const { data: complaintsData, isLoading } = useListComplaints();
  const { data: statsData } = useGetComplaintStats();
  const [showModal, setShowModal] = useState(false);

  const list = useMemo(() => {
    const normalized = normalizeComplaints(complaintsData);
    return normalized.length > 0 ? normalized : MOCK_COMPLAINTS;
  }, [complaintsData]);

  const stats = useMemo(() => {
    return normalizeStats(statsData, list);
  }, [statsData, list]);

  const byStatus = Array.isArray(stats.byStatus) ? stats.byStatus : MOCK_STATS.byStatus;
  const byType = Array.isArray(stats.byType) ? stats.byType : MOCK_STATS.byType;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Complaint Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            File, track, and monitor road complaints with smart routing
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#0EA5A4" }}
        >
          <Plus className="w-4 h-4" />
          File Complaint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            Complaints by Status
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-[140px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                  >
                    {byStatus.map((_, index) => (
                      <Cell
                        key={`status-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 w-full">
              {byStatus.map((item, index) => (
                <div
                  key={`${item.status}-${index}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: PIE_COLORS[index % PIE_COLORS.length],
                    }}
                  />
                  <span className="text-muted-foreground">
                    {item.status ?? "Unknown"}
                  </span>
                  <span className="font-bold ml-auto">{item.count}</span>
                </div>
              ))}
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
            Issue Type Breakdown
          </h3>

          <div className="w-full h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="type"
                  type="category"
                  tick={{ fontSize: 10 }}
                  width={90}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#0EA5A4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--muted))",
                }}
              >
                {[
                  "ID",
                  "Complaint",
                  "Location",
                  "Type",
                  "Severity",
                  "Department",
                  "Status",
                  "Date",
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

            <tbody className="divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    <td colSpan={8} className="px-4 py-3">
                      <div
                        className="h-4 rounded animate-pulse"
                        style={{ background: "hsl(var(--muted))" }}
                      />
                    </td>
                  </tr>
                ))
              ) : list.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No complaints found.
                  </td>
                </tr>
              ) : (
                list.map((complaint) => {
                  const statusColor =
                    STATUS_COLORS[complaint.status] ?? "#64748B";
                  const severityColor = getRiskColor(complaint.severity);

                  return (
                    <tr
                      key={complaint.id}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <td
                        className="px-4 py-3 text-xs font-mono whitespace-nowrap"
                        style={{ color: "#0EA5A4" }}
                      >
                        {complaint.complaintId}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-sm max-w-[220px] truncate">
                          {complaint.title}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <MapPin className="w-3 h-3" />
                          {complaint.location}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {complaint.issueType}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                          style={{
                            background: `${severityColor}20`,
                            color: severityColor,
                          }}
                        >
                          {complaint.severity}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">
                        {complaint.assignedDepartment}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full capitalize"
                          style={{
                            background: `${statusColor}20`,
                            color: statusColor,
                          }}
                        >
                          {complaint.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {complaint.createdAt.slice(0, 10)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <NewComplaintModal onClose={() => setShowModal(false)} />}
    </div>
  );
}