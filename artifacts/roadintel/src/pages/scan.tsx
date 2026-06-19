import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  ImagePlus,
  MapPin,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low";
type RoadType = "urban" | "pcmc" | "state" | "national";

type ScanSample = {
  id: string;
  title: string;
  image: string;
  issueType: string;
  severity: Severity;
  roadType: RoadType;
  location: string;
  description: string;
};

type ScanResult = {
  issueType: string;
  severity: Severity;
  confidence: number;
  healthScore: number;
  damageProbability: number;
  riskLevel: string;
  authority: string;
  department: string;
  sla: string;
  detectedIssues: string[];
  recommendation: string;
  shouldFileComplaint: boolean;
};

const svg = (content: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(content)}`;

const POTHOLE_IMAGE = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6B8CA8"/>
      <stop offset="1" stop-color="#D4DFE8"/>
    </linearGradient>
    <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4B5563"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="800" height="480" fill="url(#sky)"/>
  <rect y="230" width="800" height="250" fill="url(#road)"/>
  <path d="M0 270 C150 245 260 260 390 242 C530 225 650 245 800 225 L800 270 C650 290 510 278 380 295 C250 312 120 292 0 318 Z" fill="#374151"/>
  <path d="M390 245 C425 222 498 230 528 260 C552 285 532 329 482 342 C425 356 356 338 335 302 C318 271 347 258 390 245Z" fill="#020617"/>
  <path d="M386 254 C420 241 472 244 501 267 C521 283 503 312 463 320 C421 329 373 318 357 295 C345 276 357 265 386 254Z" fill="#1F2937"/>
  <path d="M415 260 C440 256 470 261 485 276" stroke="#6B7280" stroke-width="8" stroke-linecap="round" opacity=".45"/>
  <path d="M60 370 L260 330" stroke="#FACC15" stroke-width="9" stroke-linecap="round" opacity=".9"/>
  <path d="M560 310 L760 278" stroke="#FACC15" stroke-width="9" stroke-linecap="round" opacity=".9"/>
  <circle cx="477" cy="299" r="10" fill="#64748B"/>
  <circle cx="431" cy="303" r="7" fill="#64748B"/>
  <rect x="30" y="30" rx="18" width="235" height="54" fill="#0F172A" opacity=".86"/>
  <text x="55" y="65" font-size="25" font-family="Arial" font-weight="700" fill="#FFFFFF">Pothole Damage</text>
</svg>
`);

const CRACK_IMAGE = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs>
    <linearGradient id="road" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4B5563"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="800" height="480" fill="#94A3B8"/>
  <rect y="130" width="800" height="350" fill="url(#road)"/>
  <path d="M385 125 L420 195 L392 242 L443 300 L412 352 L455 445" fill="none" stroke="#020617" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M420 195 L470 165" fill="none" stroke="#020617" stroke-width="8" stroke-linecap="round"/>
  <path d="M392 242 L340 230" fill="none" stroke="#020617" stroke-width="7" stroke-linecap="round"/>
  <path d="M443 300 L506 288" fill="none" stroke="#020617" stroke-width="7" stroke-linecap="round"/>
  <path d="M412 352 L350 390" fill="none" stroke="#020617" stroke-width="6" stroke-linecap="round"/>
  <path d="M80 320 L290 320" stroke="#FACC15" stroke-width="8" stroke-linecap="round" opacity=".7"/>
  <path d="M520 320 L735 320" stroke="#FACC15" stroke-width="8" stroke-linecap="round" opacity=".7"/>
  <circle cx="230" cy="205" r="4" fill="#CBD5E1"/>
  <circle cx="580" cy="255" r="5" fill="#CBD5E1"/>
  <circle cx="180" cy="390" r="3" fill="#CBD5E1"/>
  <rect x="30" y="30" rx="18" width="250" height="54" fill="#0F172A" opacity=".86"/>
  <text x="55" y="65" font-size="25" font-family="Arial" font-weight="700" fill="#FFFFFF">Surface Cracking</text>
</svg>
`);

const WATERLOGGING_IMAGE = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#334155"/>
      <stop offset="1" stop-color="#94A3B8"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0EA5E9" stop-opacity=".75"/>
      <stop offset="1" stop-color="#1E3A8A" stop-opacity=".82"/>
    </linearGradient>
  </defs>
  <rect width="800" height="480" fill="url(#sky)"/>
  <rect y="210" width="800" height="270" fill="#1F2937"/>
  <ellipse cx="420" cy="350" rx="310" ry="95" fill="url(#water)"/>
  <ellipse cx="420" cy="348" rx="260" ry="55" fill="#38BDF8" opacity=".26"/>
  <path d="M150 338 C250 310 340 360 460 330 C560 305 650 320 720 342" fill="none" stroke="#BAE6FD" stroke-width="6" opacity=".65"/>
  <path d="M110 390 C220 365 330 405 455 382 C580 360 660 375 735 392" fill="none" stroke="#BAE6FD" stroke-width="5" opacity=".55"/>
  <path d="M65 245 L275 225" stroke="#FACC15" stroke-width="8" stroke-linecap="round" opacity=".8"/>
  <path d="M545 225 L760 212" stroke="#FACC15" stroke-width="8" stroke-linecap="round" opacity=".8"/>
  <line x1="160" y1="35" x2="145" y2="85" stroke="#DBEAFE" stroke-width="5" opacity=".7"/>
  <line x1="260" y1="25" x2="245" y2="80" stroke="#DBEAFE" stroke-width="5" opacity=".7"/>
  <line x1="520" y1="40" x2="505" y2="90" stroke="#DBEAFE" stroke-width="5" opacity=".7"/>
  <line x1="650" y1="30" x2="635" y2="82" stroke="#DBEAFE" stroke-width="5" opacity=".7"/>
  <rect x="30" y="30" rx="18" width="265" height="54" fill="#0F172A" opacity=".86"/>
  <text x="55" y="65" font-size="25" font-family="Arial" font-weight="700" fill="#FFFFFF">Waterlogging Risk</text>
</svg>
`);

const SMOOTH_IMAGE = svg(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#60A5FA"/>
      <stop offset="1" stop-color="#DBEAFE"/>
    </linearGradient>
    <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#374151"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="800" height="480" fill="url(#sky)"/>
  <rect y="240" width="800" height="240" fill="url(#road)"/>
  <path d="M0 250 C180 235 330 246 500 230 C620 220 710 225 800 215 L800 265 C665 280 530 272 395 292 C250 310 120 300 0 320 Z" fill="#4B5563"/>
  <path d="M380 250 L400 480" stroke="#F8FAFC" stroke-width="8" stroke-dasharray="34 28" opacity=".9"/>
  <path d="M120 315 L270 292" stroke="#FACC15" stroke-width="8" stroke-linecap="round" opacity=".85"/>
  <path d="M545 258 L720 240" stroke="#FACC15" stroke-width="8" stroke-linecap="round" opacity=".85"/>
  <circle cx="665" cy="115" r="42" fill="#FACC15"/>
  <path d="M75 235 C100 210 120 205 150 232" stroke="#16A34A" stroke-width="18" stroke-linecap="round"/>
  <path d="M590 215 C620 190 650 188 685 220" stroke="#16A34A" stroke-width="18" stroke-linecap="round"/>
  <rect x="30" y="30" rx="18" width="275" height="54" fill="#0F172A" opacity=".86"/>
  <text x="55" y="65" font-size="25" font-family="Arial" font-weight="700" fill="#FFFFFF">Good Road Surface</text>
</svg>
`);

const SAMPLE_SCANS: ScanSample[] = [
  {
    id: "pothole-high",
    title: "Pothole - High Severity",
    image: POTHOLE_IMAGE,
    issueType: "Pothole Formation",
    severity: "high",
    roadType: "urban",
    location: "JM Road Patch Zone, Pune",
    description:
      "Large pothole pattern with unsafe depth for two-wheelers and small vehicles.",
  },
  {
    id: "crack-medium",
    title: "Road Crack - Medium",
    image: CRACK_IMAGE,
    issueType: "Surface Cracking",
    severity: "medium",
    roadType: "urban",
    location: "FC Road Junction, Pune",
    description:
      "Visible longitudinal cracking indicating early surface deterioration.",
  },
  {
    id: "waterlogging-medium",
    title: "Waterlogging - Medium",
    image: WATERLOGGING_IMAGE,
    issueType: "Waterlogging Risk",
    severity: "medium",
    roadType: "state",
    location: "Katraj Bypass, Pune",
    description:
      "Water accumulation can weaken pavement and accelerate pothole formation.",
  },
  {
    id: "smooth-good",
    title: "Smooth Road - Good",
    image: SMOOTH_IMAGE,
    issueType: "Good Road Condition",
    severity: "low",
    roadType: "pcmc",
    location: "Ravet BRT Service Road, PCMC",
    description:
      "Stable road surface with no major visible deformation or urgent risk.",
  },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#DC2626",
  high: "#F97316",
  medium: "#F59E0B",
  low: "#16A34A",
};

function getAuthority(roadType: RoadType, severity: Severity) {
  if (roadType === "pcmc") {
    return {
      authority: "PCMC",
      department: "PCMC Roads Department",
      sla: severity === "high" || severity === "critical" ? "24-48 hours" : "5 days",
    };
  }

  if (roadType === "state") {
    return {
      authority: "PWD Maharashtra",
      department: "PWD Road Maintenance Division",
      sla: severity === "critical" ? "48 hours" : "5-7 days",
    };
  }

  if (roadType === "national") {
    return {
      authority: "NHAI / MSRDC",
      department: "Highway Maintenance Unit",
      sla: severity === "critical" ? "24-48 hours" : "5-7 days",
    };
  }

  return {
    authority: "PMC",
    department: severity === "medium" ? "PMC Roads + Drainage Cell" : "PMC Roads Department",
    sla: severity === "critical" ? "24 hours" : severity === "high" ? "48 hours" : "5-10 days",
  };
}

function buildResult(sample: ScanSample): ScanResult {
  const routing = getAuthority(sample.roadType, sample.severity);

  if (sample.id.includes("pothole")) {
    return {
      issueType: "Pothole Formation",
      severity: "high",
      confidence: 91,
      healthScore: 38,
      damageProbability: 87,
      riskLevel: "High",
      ...routing,
      detectedIssues: [
        "Deep pothole cavity",
        "Edge crumbling",
        "Possible water seepage",
        "Unsafe for two-wheelers",
      ],
      recommendation:
        "Immediate patching required. Use full-depth repair and verify with before/after images before payment release.",
      shouldFileComplaint: true,
    };
  }

  if (sample.id.includes("crack")) {
    return {
      issueType: "Surface Cracking",
      severity: "medium",
      confidence: 86,
      healthScore: 58,
      damageProbability: 64,
      riskLevel: "Medium",
      ...routing,
      detectedIssues: [
        "Longitudinal surface crack",
        "Early fatigue pattern",
        "Water entry risk",
      ],
      recommendation:
        "Crack sealing recommended within 30 days. Inspect after rainfall to prevent pothole growth.",
      shouldFileComplaint: true,
    };
  }

  if (sample.id.includes("waterlogging")) {
    return {
      issueType: "Waterlogging Risk",
      severity: "medium",
      confidence: 84,
      healthScore: 62,
      damageProbability: 59,
      riskLevel: "Medium",
      ...routing,
      detectedIssues: [
        "Standing water on carriageway",
        "Drainage stress",
        "Possible sub-base weakening",
      ],
      recommendation:
        "Drainage inspection recommended. Clear water outlets before approving road patching work.",
      shouldFileComplaint: true,
    };
  }

  return {
    issueType: "Good Road Condition",
    severity: "low",
    confidence: 94,
    healthScore: 88,
    damageProbability: 14,
    riskLevel: "Low",
    ...routing,
    detectedIssues: ["Smooth visible surface", "No major cracking", "No urgent deformation"],
    recommendation:
      "Road appears stable. Continue routine inspection and preventive maintenance cycle.",
    shouldFileComplaint: false,
  };
}

function buildUploadResult(fileName: string): ScanResult {
  const lower = fileName.toLowerCase();

  if (lower.includes("pothole") || lower.includes("hole") || lower.includes("damage")) {
    return buildResult(SAMPLE_SCANS[0]);
  }

  if (lower.includes("crack") || lower.includes("broken")) {
    return buildResult(SAMPLE_SCANS[1]);
  }

  if (lower.includes("water") || lower.includes("rain") || lower.includes("flood")) {
    return buildResult(SAMPLE_SCANS[2]);
  }

  if (lower.includes("smooth") || lower.includes("good") || lower.includes("clear")) {
    return buildResult(SAMPLE_SCANS[3]);
  }

  return {
    issueType: "Road Surface Wear",
    severity: "medium",
    confidence: 81,
    healthScore: 64,
    damageProbability: 52,
    riskLevel: "Medium",
    ...getAuthority("urban", "medium"),
    detectedIssues: [
      "Possible uneven patching",
      "Surface wear detected",
      "Manual verification recommended",
    ],
    recommendation:
      "Uploaded image processed in demo mode. A field engineer should verify exact location and severity before assigning repair work.",
    shouldFileComplaint: true,
  };
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
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-xs font-bold" style={{ color }}>
          {value}
        </span>
      </div>

      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

export default function Scan() {
  const [selectedSample, setSelectedSample] = useState<ScanSample | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const selectedSeverityColor = useMemo(() => {
    if (!scanResult) return "#0EA5A4";
    return SEVERITY_COLORS[scanResult.severity];
  }, [scanResult]);

  function runScan(sample: ScanSample | null, fileName?: string) {
    setIsScanning(true);
    setScanResult(null);

    window.setTimeout(() => {
      if (sample) {
        setScanResult(buildResult(sample));
      } else {
        setScanResult(buildUploadResult(fileName ?? selectedFileName));
      }

      setIsScanning(false);
    }, 900);
  }

  function handleSelectSample(sample: ScanSample) {
    setSelectedSample(sample);
    setPreviewImage(sample.image);
    setSelectedFileName(sample.title);
    runScan(sample);
  }

  function handleUpload(file: File | undefined) {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedSample(null);
    setPreviewImage(imageUrl);
    setSelectedFileName(file.name);
    runScan(null, file.name);
  }

  function resetScan() {
    setSelectedSample(null);
    setPreviewImage("");
    setSelectedFileName("");
    setScanResult(null);
    setIsScanning(false);
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
              <ScanLine className="h-3.5 w-3.5" />
              DEMO ROAD IMAGE CLASSIFIER
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Quick Scan Road Classifier
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Upload a road image or select a realistic sample. The scan
              identifies potholes, cracking, waterlogging, and good road
              condition with clear authority routing.
            </p>
          </div>

          <button
            type="button"
            onClick={resetScan}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/15"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Scan
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div
            className="rounded-3xl p-5"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <label
              className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed p-6 text-center transition hover:border-cyan-400/50 hover:bg-cyan-400/[0.04]"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Upload className="mb-4 h-11 w-11 text-muted-foreground" />

              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Upload Road Image
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                PNG, JPG or WEBP up to 10MB
              </p>

              <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                <ImagePlus className="h-4 w-4" />
                Choose File
              </span>

              <p className="mt-4 text-xs text-muted-foreground">
                Demo mode: uploaded file name influences sample classification.
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(event) => handleUpload(event.target.files?.[0])}
              />
            </label>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2
                className="font-semibold"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Select a Correct Sample
              </h2>

              <span className="text-xs text-muted-foreground">
                Images now match issue type
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SAMPLE_SCANS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`overflow-hidden rounded-3xl text-left transition hover:-translate-y-0.5 ${
                    selectedSample?.id === sample.id ? "ring-2 ring-cyan-400" : ""
                  }`}
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={sample.image}
                      alt={sample.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute right-3 top-3">
                      <SeverityPill severity={sample.severity} />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold">{sample.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {sample.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl"
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
                className="font-semibold"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Scan Preview
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {selectedFileName || "No image selected"}
              </p>
            </div>

            {previewImage && (
              <button
                type="button"
                onClick={resetScan}
                className="rounded-xl p-2 text-muted-foreground hover:bg-white/10"
                aria-label="Clear scan"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="p-5">
            {!previewImage ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl bg-muted text-center">
                <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="font-semibold">No Image Selected</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Upload an image or select a sample to run the road scan.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl bg-muted">
                <img
                  src={previewImage}
                  alt={selectedFileName || "Selected road scan"}
                  className="h-[360px] w-full object-cover"
                />
              </div>
            )}

            {isScanning && (
              <div className="mt-5 rounded-2xl bg-cyan-400/10 p-4 text-sm text-cyan-200">
                Scanning road surface... detecting damage pattern, severity,
                and authority routing.
              </div>
            )}

            {scanResult && (
              <div className="mt-5 space-y-5">
                <div
                  className="rounded-3xl p-5"
                  style={{
                    background: `${selectedSeverityColor}0F`,
                    border: `1px solid ${selectedSeverityColor}30`,
                  }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <SeverityPill severity={scanResult.severity} />

                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
                          style={{
                            background: "rgba(14,165,164,0.14)",
                            color: "#0EA5A4",
                          }}
                        >
                          {scanResult.confidence}% confidence
                        </span>
                      </div>

                      <h3
                        className="mt-3 text-xl font-bold"
                        style={{ fontFamily: "Sora, sans-serif" }}
                      >
                        {scanResult.issueType}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {scanResult.recommendation}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-black/20 px-4 py-3 text-center">
                      <p className="text-xs text-muted-foreground">Health Score</p>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: selectedSeverityColor }}
                      >
                        {scanResult.healthScore}/100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Damage Risk"
                    value={`${scanResult.damageProbability}%`}
                    note={scanResult.riskLevel}
                    icon={AlertTriangle}
                    color={selectedSeverityColor}
                  />

                  <MetricCard
                    label="Authority"
                    value={scanResult.authority}
                    note={scanResult.department}
                    icon={ShieldCheck}
                    color="#0EA5A4"
                  />

                  <MetricCard
                    label="SLA"
                    value={scanResult.sla}
                    note="Suggested response"
                    icon={Clock3}
                    color="#F59E0B"
                  />
                </div>

                <div
                  className="rounded-3xl p-5"
                  style={{
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <h3 className="font-semibold">Detected Signals</h3>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {scanResult.detectedIssues.map((issue) => (
                      <div
                        key={issue}
                        className="flex items-start gap-2 rounded-2xl bg-background p-3 text-sm"
                      >
                        {scanResult.severity === "low" ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: selectedSeverityColor }}
                          />
                        )}

                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/complaints">
                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3 text-sm font-bold text-white sm:w-auto">
                      <FileText className="h-4 w-4" />
                      Create Complaint from Scan
                    </button>
                  </Link>

                  <Link href="/roads">
                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold sm:w-auto">
                      <MapPin className="h-4 w-4" />
                      Match with Road DNA
                    </button>
                  </Link>

                  <Link href="/contractors">
                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold sm:w-auto">
                      <Wrench className="h-4 w-4" />
                      Review Contractor
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
