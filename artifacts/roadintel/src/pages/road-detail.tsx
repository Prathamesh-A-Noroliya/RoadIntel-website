import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Wallet,
  AlertTriangle,
  Wrench,
  Building2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  TrendingDown,
  FileText,
} from "lucide-react";
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

type RoadStatus = "Excellent" | "Good" | "Active" | "Deteriorating";
type RoadRisk = "Low" | "Medium" | "Critical";

type RoadDetail = {
  id: string;
  name: string;
  location: string;
  authority: string;
  contractor: string;
  builtYear: string;
  length: string;
  roadType: string;
  riskLevel: RoadRisk;
  status: RoadStatus;
  riskScore: number;
  healthScore: number;
  allocatedBudget: number;
  spentBudget: number;
  totalComplaints: number;
  repeatFailures: number;
  lastRepaired: string;
  nextInspection: string;
  summary: string;
  repairHistory: {
    date: string;
    work: string;
    contractor: string;
    cost: number;
    quality: "Good" | "Average" | "Poor";
  }[];
  complaintHistory: {
    type: string;
    count: number;
  }[];
  healthTrend: {
    month: string;
    score: number;
  }[];
  spendingTrend: {
    month: string;
    allocated: number;
    spent: number;
  }[];
  riskFactors: {
    label: string;
    value: string;
    severity: "low" | "medium" | "high" | "critical";
  }[];
};

const ROAD_DATABASE: Record<string, RoadDetail> = {
  "1": {
    id: "1",
    name: "MG Road",
    location: "Bangalore, KA",
    authority: "Bengaluru Urban Road Division",
    contractor: "BuildRight Infrastructure",
    builtYear: "2018",
    length: "3.6 km",
    roadType: "National Highway",
    riskLevel: "Medium",
    status: "Active",
    riskScore: 54,
    healthScore: 78,
    allocatedBudget: 126000000,
    spentBudget: 98400000,
    totalComplaints: 12,
    repeatFailures: 2,
    lastRepaired: "February 2025",
    nextInspection: "June 2025",
    summary:
      "MG Road is currently stable with moderate risk. Health score remains acceptable, but recurring surface wear and traffic stress require scheduled resurfacing and improved drainage checks before monsoon.",
    repairHistory: [
      {
        date: "Feb 2025",
        work: "Surface patching and lane marking",
        contractor: "BuildRight Infrastructure",
        cost: 12800000,
        quality: "Good",
      },
      {
        date: "Oct 2024",
        work: "Drainage shoulder correction",
        contractor: "BuildRight Infrastructure",
        cost: 7200000,
        quality: "Average",
      },
      {
        date: "May 2024",
        work: "Minor crack sealing",
        contractor: "Metro Road Services",
        cost: 4100000,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 4 },
      { type: "Waterlogging", count: 3 },
      { type: "Cracks", count: 2 },
      { type: "Uneven Surface", count: 2 },
      { type: "Signage", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 84 },
      { month: "Nov", score: 83 },
      { month: "Dec", score: 81 },
      { month: "Jan", score: 80 },
      { month: "Feb", score: 79 },
      { month: "Mar", score: 78 },
      { month: "Apr", score: 78 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 18, spent: 12 },
      { month: "Dec", allocated: 22, spent: 17 },
      { month: "Jan", allocated: 25, spent: 20 },
      { month: "Feb", allocated: 30, spent: 25 },
      { month: "Mar", allocated: 34, spent: 28 },
      { month: "Apr", allocated: 38, spent: 31 },
    ],
    riskFactors: [
      {
        label: "Moderate traffic stress",
        value: "High daily vehicle load",
        severity: "medium",
      },
      {
        label: "Complaint density",
        value: "12 complaints",
        severity: "medium",
      },
      {
        label: "Repair quality",
        value: "Mostly good",
        severity: "low",
      },
    ],
  },

  "2": {
    id: "2",
    name: "NH-48 Stretch",
    location: "Delhi-Gurugram",
    authority: "National Highways Authority of India",
    contractor: "RoadCraft Solutions",
    builtYear: "2015",
    length: "9.2 km",
    roadType: "National Highway",
    riskLevel: "Critical",
    status: "Deteriorating",
    riskScore: 88,
    healthScore: 34,
    allocatedBudget: 284000000,
    spentBudget: 221000000,
    totalComplaints: 47,
    repeatFailures: 11,
    lastRepaired: "January 2025",
    nextInspection: "May 2025",
    summary:
      "NH-48 Stretch is a critical road segment with rapid deterioration. Repeated failures, heavy freight movement, and high-speed traffic make this road a priority for resurfacing and contractor audit.",
    repairHistory: [
      {
        date: "Jan 2025",
        work: "Emergency pothole patching",
        contractor: "RoadCraft Solutions",
        cost: 26800000,
        quality: "Poor",
      },
      {
        date: "Sep 2024",
        work: "Partial resurfacing",
        contractor: "RoadCraft Solutions",
        cost: 48500000,
        quality: "Average",
      },
      {
        date: "Apr 2024",
        work: "Drainage repair near service lane",
        contractor: "Highway Maintenance Unit",
        cost: 18600000,
        quality: "Average",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 19 },
      { type: "Cracks", count: 12 },
      { type: "Surface Damage", count: 8 },
      { type: "Waterlogging", count: 5 },
      { type: "Shoulder Damage", count: 3 },
    ],
    healthTrend: [
      { month: "Oct", score: 52 },
      { month: "Nov", score: 48 },
      { month: "Dec", score: 44 },
      { month: "Jan", score: 40 },
      { month: "Feb", score: 38 },
      { month: "Mar", score: 36 },
      { month: "Apr", score: 34 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 42, spent: 31 },
      { month: "Dec", allocated: 56, spent: 44 },
      { month: "Jan", allocated: 70, spent: 58 },
      { month: "Feb", allocated: 78, spent: 66 },
      { month: "Mar", allocated: 86, spent: 74 },
      { month: "Apr", allocated: 92, spent: 81 },
    ],
    riskFactors: [
      {
        label: "Repeated failures",
        value: "11 repeat failures",
        severity: "critical",
      },
      {
        label: "Low health score",
        value: "34/100",
        severity: "critical",
      },
      {
        label: "Heavy vehicle stress",
        value: "High freight corridor",
        severity: "high",
      },
      {
        label: "Complaint volume",
        value: "47 complaints",
        severity: "high",
      },
    ],
  },

  "3": {
    id: "3",
    name: "Outer Ring Road South",
    location: "Bangalore, KA",
    authority: "Karnataka State Highways Division",
    contractor: "National Road Works",
    builtYear: "2020",
    length: "7.5 km",
    roadType: "State Highway",
    riskLevel: "Low",
    status: "Good",
    riskScore: 31,
    healthScore: 85,
    allocatedBudget: 164000000,
    spentBudget: 109000000,
    totalComplaints: 5,
    repeatFailures: 1,
    lastRepaired: "April 2025",
    nextInspection: "August 2025",
    summary:
      "Outer Ring Road South is performing well with low risk. Preventive maintenance has kept the surface stable, and complaint volume remains low.",
    repairHistory: [
      {
        date: "Apr 2025",
        work: "Preventive resurfacing and lane repainting",
        contractor: "National Road Works",
        cost: 17600000,
        quality: "Good",
      },
      {
        date: "Dec 2024",
        work: "Minor shoulder stabilization",
        contractor: "National Road Works",
        cost: 6200000,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Signage", count: 2 },
      { type: "Minor Cracks", count: 1 },
      { type: "Drainage", count: 1 },
      { type: "Surface Wear", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 88 },
      { month: "Nov", score: 88 },
      { month: "Dec", score: 87 },
      { month: "Jan", score: 86 },
      { month: "Feb", score: 86 },
      { month: "Mar", score: 85 },
      { month: "Apr", score: 85 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 20, spent: 12 },
      { month: "Dec", allocated: 25, spent: 17 },
      { month: "Jan", allocated: 28, spent: 20 },
      { month: "Feb", allocated: 32, spent: 23 },
      { month: "Mar", allocated: 37, spent: 27 },
      { month: "Apr", allocated: 42, spent: 31 },
    ],
    riskFactors: [
      {
        label: "Low complaint density",
        value: "5 complaints",
        severity: "low",
      },
      {
        label: "Stable health trend",
        value: "85/100",
        severity: "low",
      },
      {
        label: "Preventive maintenance",
        value: "Completed April 2025",
        severity: "low",
      },
    ],
  },

  "4": {
    id: "4",
    name: "Andheri-Kurla Road",
    location: "Mumbai, MH",
    authority: "Mumbai Municipal Roads Department",
    contractor: "RoadCraft Solutions",
    builtYear: "2016",
    length: "5.1 km",
    roadType: "Municipal Road",
    riskLevel: "Critical",
    status: "Deteriorating",
    riskScore: 91,
    healthScore: 28,
    allocatedBudget: 196000000,
    spentBudget: 172000000,
    totalComplaints: 63,
    repeatFailures: 14,
    lastRepaired: "March 2025",
    nextInspection: "May 2025",
    summary:
      "Andheri-Kurla Road is a critical urban corridor with severe deterioration. Heavy traffic, repeated pothole formation, drainage stress, and poor patch durability make this a high-priority repair and audit candidate.",
    repairHistory: [
      {
        date: "Mar 2025",
        work: "Emergency pothole filling",
        contractor: "RoadCraft Solutions",
        cost: 22800000,
        quality: "Poor",
      },
      {
        date: "Nov 2024",
        work: "Surface patch repair",
        contractor: "RoadCraft Solutions",
        cost: 31500000,
        quality: "Poor",
      },
      {
        date: "Jul 2024",
        work: "Monsoon drainage repair",
        contractor: "Mumbai Ward Repair Unit",
        cost: 14400000,
        quality: "Average",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 26 },
      { type: "Waterlogging", count: 15 },
      { type: "Uneven Surface", count: 9 },
      { type: "Cracks", count: 8 },
      { type: "Drainage", count: 5 },
    ],
    healthTrend: [
      { month: "Oct", score: 46 },
      { month: "Nov", score: 42 },
      { month: "Dec", score: 39 },
      { month: "Jan", score: 35 },
      { month: "Feb", score: 32 },
      { month: "Mar", score: 30 },
      { month: "Apr", score: 28 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 34, spent: 29 },
      { month: "Dec", allocated: 42, spent: 37 },
      { month: "Jan", allocated: 50, spent: 45 },
      { month: "Feb", allocated: 58, spent: 52 },
      { month: "Mar", allocated: 64, spent: 59 },
      { month: "Apr", allocated: 70, spent: 63 },
    ],
    riskFactors: [
      {
        label: "Severe repeat failures",
        value: "14 repeat failures",
        severity: "critical",
      },
      {
        label: "High complaint density",
        value: "63 complaints",
        severity: "critical",
      },
      {
        label: "Poor repair durability",
        value: "Multiple poor-quality repairs",
        severity: "critical",
      },
      {
        label: "Waterlogging stress",
        value: "15 waterlogging complaints",
        severity: "high",
      },
    ],
  },

  "5": {
    id: "5",
    name: "Electronic City Flyover",
    location: "Bangalore, KA",
    authority: "Bengaluru Elevated Corridor Authority",
    contractor: "Infra Prime Builders",
    builtYear: "2021",
    length: "4.4 km",
    roadType: "Elevated Highway",
    riskLevel: "Low",
    status: "Excellent",
    riskScore: 22,
    healthScore: 91,
    allocatedBudget: 238000000,
    spentBudget: 151000000,
    totalComplaints: 2,
    repeatFailures: 0,
    lastRepaired: "April 2025",
    nextInspection: "September 2025",
    summary:
      "Electronic City Flyover is in excellent condition. Structural and surface indicators remain strong, complaint count is minimal, and no repeat failures have been recorded.",
    repairHistory: [
      {
        date: "Apr 2025",
        work: "Expansion joint inspection and lane repainting",
        contractor: "Infra Prime Builders",
        cost: 11200000,
        quality: "Good",
      },
      {
        date: "Oct 2024",
        work: "Routine structural inspection",
        contractor: "Infra Prime Builders",
        cost: 6800000,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Signage", count: 1 },
      { type: "Lighting", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 93 },
      { month: "Nov", score: 93 },
      { month: "Dec", score: 92 },
      { month: "Jan", score: 92 },
      { month: "Feb", score: 91 },
      { month: "Mar", score: 91 },
      { month: "Apr", score: 91 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 28, spent: 16 },
      { month: "Dec", allocated: 34, spent: 22 },
      { month: "Jan", allocated: 39, spent: 27 },
      { month: "Feb", allocated: 44, spent: 31 },
      { month: "Mar", allocated: 50, spent: 36 },
      { month: "Apr", allocated: 55, spent: 40 },
    ],
    riskFactors: [
      {
        label: "Very low complaint count",
        value: "2 complaints",
        severity: "low",
      },
      {
        label: "No repeat failures",
        value: "0 repeat failures",
        severity: "low",
      },
      {
        label: "Excellent health score",
        value: "91/100",
        severity: "low",
      },
    ],
  },

  "6": {
    id: "6",
    name: "GST Road",
    location: "Chennai, TN",
    authority: "Tamil Nadu Highways Department",
    contractor: "National Road Works",
    builtYear: "2017",
    length: "6.8 km",
    roadType: "National Highway",
    riskLevel: "Medium",
    status: "Active",
    riskScore: 61,
    healthScore: 62,
    allocatedBudget: 178000000,
    spentBudget: 132000000,
    totalComplaints: 18,
    repeatFailures: 4,
    lastRepaired: "February 2025",
    nextInspection: "July 2025",
    summary:
      "GST Road is active with medium risk. Surface quality is acceptable but trending downward due to heat stress, freight traffic, and moderate complaint recurrence.",
    repairHistory: [
      {
        date: "Feb 2025",
        work: "Surface strengthening and pothole repair",
        contractor: "National Road Works",
        cost: 18600000,
        quality: "Average",
      },
      {
        date: "Sep 2024",
        work: "Crack sealing",
        contractor: "National Road Works",
        cost: 8400000,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 6 },
      { type: "Cracks", count: 5 },
      { type: "Surface Wear", count: 4 },
      { type: "Drainage", count: 2 },
      { type: "Signage", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 71 },
      { month: "Nov", score: 69 },
      { month: "Dec", score: 67 },
      { month: "Jan", score: 66 },
      { month: "Feb", score: 64 },
      { month: "Mar", score: 63 },
      { month: "Apr", score: 62 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 24, spent: 18 },
      { month: "Dec", allocated: 29, spent: 23 },
      { month: "Jan", allocated: 35, spent: 28 },
      { month: "Feb", allocated: 41, spent: 33 },
      { month: "Mar", allocated: 46, spent: 37 },
      { month: "Apr", allocated: 51, spent: 42 },
    ],
    riskFactors: [
      {
        label: "Freight traffic load",
        value: "Moderate-heavy",
        severity: "medium",
      },
      {
        label: "Repeat failures",
        value: "4 repeat failures",
        severity: "medium",
      },
      {
        label: "Health trend",
        value: "Declining from 71 to 62",
        severity: "medium",
      },
    ],
  },

  "7": {
    id: "7",
    name: "AIIMS Delhi Stretch",
    location: "Delhi",
    authority: "Delhi PWD Road Division",
    contractor: "QuickFix Road Services",
    builtYear: "2014",
    length: "2.1 km",
    roadType: "State Highway",
    riskLevel: "Critical",
    status: "Deteriorating",
    riskScore: 95,
    healthScore: 22,
    allocatedBudget: 148000000,
    spentBudget: 139000000,
    totalComplaints: 89,
    repeatFailures: 19,
    lastRepaired: "April 2025",
    nextInspection: "Immediate",
    summary:
      "AIIMS Delhi Stretch is the highest-risk road in the current dataset. Very low health score, extreme complaint volume, hospital-zone sensitivity, and repeated repair failures require immediate intervention.",
    repairHistory: [
      {
        date: "Apr 2025",
        work: "Emergency hospital-zone patching",
        contractor: "QuickFix Road Services",
        cost: 21800000,
        quality: "Poor",
      },
      {
        date: "Jan 2025",
        work: "Pothole cluster repair",
        contractor: "QuickFix Road Services",
        cost: 18400000,
        quality: "Poor",
      },
      {
        date: "Aug 2024",
        work: "Drainage and shoulder correction",
        contractor: "Delhi Ward Roads Unit",
        cost: 9600000,
        quality: "Average",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 31 },
      { type: "Uneven Surface", count: 18 },
      { type: "Waterlogging", count: 16 },
      { type: "Cracks", count: 14 },
      { type: "Traffic Hazard", count: 10 },
    ],
    healthTrend: [
      { month: "Oct", score: 43 },
      { month: "Nov", score: 39 },
      { month: "Dec", score: 35 },
      { month: "Jan", score: 31 },
      { month: "Feb", score: 28 },
      { month: "Mar", score: 25 },
      { month: "Apr", score: 22 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 22, spent: 20 },
      { month: "Dec", allocated: 30, spent: 28 },
      { month: "Jan", allocated: 38, spent: 36 },
      { month: "Feb", allocated: 45, spent: 43 },
      { month: "Mar", allocated: 51, spent: 49 },
      { month: "Apr", allocated: 56, spent: 53 },
    ],
    riskFactors: [
      {
        label: "Extreme complaint volume",
        value: "89 complaints",
        severity: "critical",
      },
      {
        label: "Very low health score",
        value: "22/100",
        severity: "critical",
      },
      {
        label: "Repeat failures",
        value: "19 repeat failures",
        severity: "critical",
      },
      {
        label: "Sensitive zone",
        value: "Hospital corridor",
        severity: "critical",
      },
    ],
  },

  "8": {
    id: "8",
    name: "Mumbai-Pune Expressway Sec-3",
    location: "Pune, MH",
    authority: "MSRDC",
    contractor: "BuildRight Infrastructure",
    builtYear: "2002",
    length: "11.4 km",
    roadType: "Expressway",
    riskLevel: "Low",
    status: "Excellent",
    riskScore: 29,
    healthScore: 88,
    allocatedBudget: 425000000,
    spentBudget: 287000000,
    totalComplaints: 3,
    repeatFailures: 0,
    lastRepaired: "March 2025",
    nextInspection: "August 2025",
    summary:
      "Mumbai-Pune Expressway Sec-3 is in excellent condition. Preventive maintenance and strong surface quality keep risk low despite high-speed traffic conditions.",
    repairHistory: [
      {
        date: "Mar 2025",
        work: "Preventive resurfacing and guardrail inspection",
        contractor: "BuildRight Infrastructure",
        cost: 38500000,
        quality: "Good",
      },
      {
        date: "Sep 2024",
        work: "Drainage cleaning and lane marking",
        contractor: "Expressway Maintenance Unit",
        cost: 16400000,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Signage", count: 1 },
      { type: "Minor Surface Wear", count: 1 },
      { type: "Drainage", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 90 },
      { month: "Nov", score: 90 },
      { month: "Dec", score: 89 },
      { month: "Jan", score: 89 },
      { month: "Feb", score: 88 },
      { month: "Mar", score: 88 },
      { month: "Apr", score: 88 },
    ],
    spendingTrend: [
      { month: "Nov", allocated: 60, spent: 39 },
      { month: "Dec", allocated: 72, spent: 48 },
      { month: "Jan", allocated: 84, spent: 57 },
      { month: "Feb", allocated: 96, spent: 66 },
      { month: "Mar", allocated: 108, spent: 76 },
      { month: "Apr", allocated: 120, spent: 84 },
    ],
    riskFactors: [
      {
        label: "Excellent health score",
        value: "88/100",
        severity: "low",
      },
      {
        label: "Very low complaint count",
        value: "3 complaints",
        severity: "low",
      },
      {
        label: "No repeat failures",
        value: "0 repeat failures",
        severity: "low",
      },
    ],
  },
};

const DEFAULT_ROAD = ROAD_DATABASE["1"];

const SEVERITY_COLORS = {
  low: "#16A34A",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#DC2626",
};

function formatMoney(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function getRiskColor(score: number) {
  if (score >= 80) return "#DC2626";
  if (score >= 65) return "#F97316";
  if (score >= 45) return "#F59E0B";
  return "#16A34A";
}

function getStatusColor(status: RoadStatus) {
  if (status === "Excellent") return "#16A34A";
  if (status === "Good") return "#0EA5A4";
  if (status === "Active") return "#1E88E5";
  return "#DC2626";
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" style={{ color }} />
        {label}
      </div>

      <div
        className="mt-3 text-2xl font-bold"
        style={{ color, fontFamily: "Sora, sans-serif" }}
      >
        {value}
      </div>
    </div>
  );
}

export default function RoadDetail() {
  const params = useParams<{ id: string }>();
  const road = ROAD_DATABASE[params.id ?? "1"] ?? DEFAULT_ROAD;

  const riskColor = getRiskColor(road.riskScore);
  const statusColor = getStatusColor(road.status);
  const spentPercent = Math.round((road.spentBudget / road.allocatedBudget) * 100);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/roads">
            <button className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Road DNA
            </button>
          </Link>

          <h1
            className="text-2xl font-bold sm:text-3xl"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {road.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {road.location}
            </span>

            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {road.authority}
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Built {road.builtYear}
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl px-5 py-3 text-sm font-bold"
          style={{
            background: `${statusColor}18`,
            color: statusColor,
            border: `1px solid ${statusColor}35`,
          }}
        >
          {road.status}
        </div>
      </div>

      <section
        className="grid gap-6 rounded-3xl p-6 lg:grid-cols-[1fr_220px]"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Road Type</div>
              <div className="mt-1 font-semibold">{road.roadType}</div>
            </div>

            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Length</div>
              <div className="mt-1 font-semibold">{road.length}</div>
            </div>

            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Contractor</div>
              <div className="mt-1 font-semibold">{road.contractor}</div>
            </div>

            <div className="rounded-2xl bg-background/40 p-4">
              <div className="text-xs text-muted-foreground">Last Repaired</div>
              <div className="mt-1 font-semibold">{road.lastRepaired}</div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-background/40 p-5">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <h2 className="font-bold">Road Intelligence Summary</h2>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {road.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${riskColor} ${road.riskScore * 3.6}deg, rgba(148,163,184,0.18) 0deg)`,
            }}
          >
            <div
              className="flex h-28 w-28 flex-col items-center justify-center rounded-full"
              style={{ background: "hsl(var(--card))" }}
            >
              <span
                className="text-3xl font-bold"
                style={{ color: riskColor, fontFamily: "Sora, sans-serif" }}
              >
                {road.riskScore}
              </span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>

          <div className="mt-3 text-sm font-semibold text-muted-foreground">
            Risk Score
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Allocated Budget"
          value={formatMoney(road.allocatedBudget)}
          color="#0EA5A4"
        />
        <StatCard
          icon={Wallet}
          label="Spent Budget"
          value={formatMoney(road.spentBudget)}
          color="#16A34A"
        />
        <StatCard
          icon={AlertTriangle}
          label="Total Complaints"
          value={road.totalComplaints}
          color="#F59E0B"
        />
        <StatCard
          icon={ShieldAlert}
          label="Repeat Failures"
          value={road.repeatFailures}
          color="#DC2626"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Health Score Trend
          </h2>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={road.healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0EA5A4"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-400">
              AI Analysis
            </span>

            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Road Intelligence Summary
            </h2>
          </div>

          <div className="space-y-4">
            {road.riskFactors.map((factor) => (
              <div
                key={factor.label}
                className="rounded-2xl p-4"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{factor.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {factor.value}
                    </div>
                  </div>

                  <span
                    className="rounded-full px-2 py-1 text-xs font-bold capitalize"
                    style={{
                      color: SEVERITY_COLORS[factor.severity],
                      background: `${SEVERITY_COLORS[factor.severity]}18`,
                    }}
                  >
                    {factor.severity}
                  </span>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-teal-500/10 p-4 text-sm text-teal-300">
              Recommendation: prioritize maintenance based on current risk,
              complaint density, repeat failures, and budget utilization.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Budget Utilization
          </h2>

          <div className="mb-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-semibold">{spentPercent}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${spentPercent}%`,
                  background: "linear-gradient(90deg, #16A34A, #0EA5A4)",
                }}
              />
            </div>
          </div>

          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={road.spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="allocated"
                  stroke="#1E88E5"
                  fill="rgba(30,136,229,0.18)"
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  stroke="#16A34A"
                  fill="rgba(22,163,74,0.18)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <h2
            className="mb-5 text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Complaint Breakdown
          </h2>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={road.complaintHistory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="type"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={120}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {road.complaintHistory.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        ["#0EA5A4", "#F59E0B", "#F97316", "#DC2626", "#1E88E5"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section
        className="rounded-3xl p-6"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-5 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-teal-400" />
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Repair History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr
                className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Work Completed</th>
                <th className="px-4 py-3">Contractor</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Quality</th>
              </tr>
            </thead>

            <tbody>
              {road.repairHistory.map((item) => (
                <tr
                  key={`${item.date}-${item.work}`}
                  className="border-b"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <Clock className="mr-2 inline h-4 w-4" />
                    {item.date}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium">
                    <FileText className="mr-2 inline h-4 w-4 text-teal-400" />
                    {item.work}
                  </td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    <Building2 className="mr-2 inline h-4 w-4" />
                    {item.contractor}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold">
                    {formatMoney(item.cost)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-semibold"
                      style={{
                        color:
                          item.quality === "Good"
                            ? "#16A34A"
                            : item.quality === "Average"
                              ? "#F59E0B"
                              : "#DC2626",
                        background:
                          item.quality === "Good"
                            ? "rgba(22,163,74,0.15)"
                            : item.quality === "Average"
                              ? "rgba(245,158,11,0.15)"
                              : "rgba(220,38,38,0.15)",
                      }}
                    >
                      {item.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
          <TrendingDown className="mb-2 h-5 w-5" />
          <div className="font-bold">Health Score</div>
          <div className="text-2xl font-bold">{road.healthScore}/100</div>
        </div>

        <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-300">
          <CheckCircle2 className="mb-2 h-5 w-5" />
          <div className="font-bold">Next Inspection</div>
          <div className="text-2xl font-bold">{road.nextInspection}</div>
        </div>

        <div className="rounded-2xl bg-orange-500/10 p-4 text-orange-300">
          <AlertTriangle className="mb-2 h-5 w-5" />
          <div className="font-bold">Action Priority</div>
          <div className="text-2xl font-bold">
            {road.riskScore >= 80
              ? "Urgent"
              : road.riskScore >= 65
                ? "High"
                : road.riskScore >= 45
                  ? "Medium"
                  : "Low"}
          </div>
        </div>
      </section>
    </div>
  );
}