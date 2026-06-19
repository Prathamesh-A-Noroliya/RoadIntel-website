import { Link, useParams } from "wouter";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  IndianRupee,
  MapPin,
  Route,
  ShieldCheck,
  TrendingDown,
  User,
  Wallet,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { getHealthColor } from "@/lib/utils";

type RiskLevel = "critical" | "high" | "medium" | "low";
type RoadStatus = "Critical" | "Repair Due" | "Watch" | "Stable";
type RepairQuality = "Good" | "Average" | "Poor";

type RepairRecord = {
  date: string;
  work: string;
  contractor: string;
  costCr: number;
  quality: RepairQuality;
};

type ComplaintRecord = {
  type: string;
  count: number;
};

type HealthPoint = {
  month: string;
  score: number;
  risk: number;
};

type SpendingPoint = {
  month: string;
  approved: number;
  spent: number;
};

type RiskFactor = {
  label: string;
  value: string;
  severity: RiskLevel;
};

type RoadDetail = {
  id: string;
  name: string;
  location: string;
  authority: string;
  contractor: string;
  builtYear: string;
  lengthKm: number;
  roadType: string;
  surface: string;
  trafficLoad: string;
  status: RoadStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  healthScore: number;
  monsoonRisk: number;
  allocatedBudgetCr: number;
  spentBudgetCr: number;
  totalComplaints: number;
  repeatFailures: number;
  lastRepaired: string;
  nextInspection: string;
  summary: string;
  recommendedAction: string;
  repairHistory: RepairRecord[];
  complaintHistory: ComplaintRecord[];
  healthTrend: HealthPoint[];
  spendingTrend: SpendingPoint[];
  riskFactors: RiskFactor[];
};

const ROAD_DATABASE: Record<string, RoadDetail> = {
  "1": {
    id: "1",
    name: "JM Road Patch Zone",
    location: "Shivajinagar, Pune",
    authority: "PMC",
    contractor: "UrbanBuild Pune Services",
    builtYear: "2019",
    lengthKm: 1.8,
    roadType: "Urban arterial road",
    surface: "Bituminous",
    trafficLoad: "High",
    status: "Critical",
    riskLevel: "critical",
    riskScore: 86,
    healthScore: 42,
    monsoonRisk: 82,
    allocatedBudgetCr: 3.9,
    spentBudgetCr: 4.8,
    totalComplaints: 17,
    repeatFailures: 4,
    lastRepaired: "Feb 2026",
    nextInspection: "Within 24 hours",
    summary:
      "JM Road Patch Zone is currently the most critical pilot road. Repeated patch failure, high complaint density and monsoon exposure indicate that this segment needs emergency verification and contractor audit.",
    recommendedAction:
      "Emergency patching, field inspection and contractor quality review before any further payment release.",
    repairHistory: [
      {
        date: "Feb 2026",
        work: "Emergency pothole patching",
        contractor: "UrbanBuild Pune Services",
        costCr: 0.82,
        quality: "Poor",
      },
      {
        date: "Nov 2025",
        work: "Surface patch repair",
        contractor: "UrbanBuild Pune Services",
        costCr: 0.64,
        quality: "Average",
      },
      {
        date: "Aug 2025",
        work: "Drainage-side resurfacing",
        contractor: "UrbanBuild Pune Services",
        costCr: 0.48,
        quality: "Poor",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 8 },
      { type: "Repeat Failure", count: 4 },
      { type: "Waterlogging", count: 3 },
      { type: "Surface Damage", count: 2 },
    ],
    healthTrend: [
      { month: "Oct", score: 64, risk: 48 },
      { month: "Nov", score: 58, risk: 55 },
      { month: "Dec", score: 54, risk: 62 },
      { month: "Jan", score: 49, risk: 71 },
      { month: "Feb", score: 45, risk: 80 },
      { month: "Mar", score: 43, risk: 84 },
      { month: "Apr", score: 42, risk: 86 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 1.2, spent: 1.1 },
      { month: "Dec", approved: 1.8, spent: 1.9 },
      { month: "Jan", approved: 2.4, spent: 2.8 },
      { month: "Feb", approved: 3.0, spent: 3.6 },
      { month: "Mar", approved: 3.5, spent: 4.2 },
      { month: "Apr", approved: 3.9, spent: 4.8 },
    ],
    riskFactors: [
      {
        label: "Repeat repair pattern",
        value: "4 repeat failures",
        severity: "critical",
      },
      {
        label: "Complaint density",
        value: "17 citizen signals",
        severity: "high",
      },
      {
        label: "Budget-quality mismatch",
        value: "Spent above approved budget",
        severity: "high",
      },
    ],
  },

  "2": {
    id: "2",
    name: "FC Road Junction",
    location: "Pune Central",
    authority: "PMC",
    contractor: "UrbanBuild Pune Services",
    builtYear: "2018",
    lengthKm: 1.2,
    roadType: "Urban commercial road",
    surface: "Bituminous",
    trafficLoad: "High",
    status: "Repair Due",
    riskLevel: "high",
    riskScore: 74,
    healthScore: 56,
    monsoonRisk: 71,
    allocatedBudgetCr: 2.7,
    spentBudgetCr: 3.1,
    totalComplaints: 12,
    repeatFailures: 2,
    lastRepaired: "Jan 2026",
    nextInspection: "48 hours",
    summary:
      "FC Road Junction is showing high-risk surface cracking and drainage stress. Heavy pedestrian and two-wheeler movement increases the urgency of preventive repair.",
    recommendedAction:
      "Drainage inspection, crack sealing and post-repair photo verification.",
    repairHistory: [
      {
        date: "Jan 2026",
        work: "Crack sealing near junction approach",
        contractor: "UrbanBuild Pune Services",
        costCr: 0.54,
        quality: "Average",
      },
      {
        date: "Sep 2025",
        work: "Partial lane patching",
        contractor: "UrbanBuild Pune Services",
        costCr: 0.43,
        quality: "Average",
      },
      {
        date: "May 2025",
        work: "Minor resurfacing",
        contractor: "PMC Ward Repair Team",
        costCr: 0.31,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Cracking", count: 5 },
      { type: "Potholes", count: 3 },
      { type: "Waterlogging", count: 3 },
      { type: "Uneven Surface", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 70, risk: 40 },
      { month: "Nov", score: 67, risk: 45 },
      { month: "Dec", score: 64, risk: 51 },
      { month: "Jan", score: 61, risk: 58 },
      { month: "Feb", score: 59, risk: 64 },
      { month: "Mar", score: 57, risk: 70 },
      { month: "Apr", score: 56, risk: 74 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 0.8, spent: 0.7 },
      { month: "Dec", approved: 1.2, spent: 1.2 },
      { month: "Jan", approved: 1.8, spent: 1.9 },
      { month: "Feb", approved: 2.2, spent: 2.5 },
      { month: "Mar", approved: 2.5, spent: 2.8 },
      { month: "Apr", approved: 2.7, spent: 3.1 },
    ],
    riskFactors: [
      {
        label: "Drainage stress",
        value: "Water stagnation after rainfall",
        severity: "high",
      },
      {
        label: "Surface cracking",
        value: "Visible longitudinal cracks",
        severity: "high",
      },
      {
        label: "Traffic pressure",
        value: "Commercial high-load junction",
        severity: "medium",
      },
    ],
  },

  "3": {
    id: "3",
    name: "Wakad-Hinjewadi Road",
    location: "PCMC",
    authority: "PCMC",
    contractor: "Maharashtra RoadBuild Ltd.",
    builtYear: "2020",
    lengthKm: 4.6,
    roadType: "IT corridor road",
    surface: "Bituminous",
    trafficLoad: "Very High",
    status: "Repair Due",
    riskLevel: "high",
    riskScore: 68,
    healthScore: 61,
    monsoonRisk: 64,
    allocatedBudgetCr: 6.2,
    spentBudgetCr: 6.7,
    totalComplaints: 9,
    repeatFailures: 2,
    lastRepaired: "Mar 2026",
    nextInspection: "2-3 weeks",
    summary:
      "Wakad-Hinjewadi Road is under high commuter pressure. Edge deterioration and vibration stress suggest the need for planned resurfacing inspection before damage spreads.",
    recommendedAction:
      "Schedule resurfacing inspection and monitor commuter-hour vibration spikes.",
    repairHistory: [
      {
        date: "Mar 2026",
        work: "Edge repair and lane shoulder correction",
        contractor: "Maharashtra RoadBuild Ltd.",
        costCr: 1.12,
        quality: "Average",
      },
      {
        date: "Dec 2025",
        work: "Pothole patching near IT park entry",
        contractor: "Maharashtra RoadBuild Ltd.",
        costCr: 0.76,
        quality: "Good",
      },
      {
        date: "Jul 2025",
        work: "Monsoon drainage correction",
        contractor: "PCMC Roads Department",
        costCr: 0.58,
        quality: "Average",
      },
    ],
    complaintHistory: [
      { type: "Edge Damage", count: 4 },
      { type: "Potholes", count: 2 },
      { type: "Traffic Stress", count: 2 },
      { type: "Waterlogging", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 72, risk: 38 },
      { month: "Nov", score: 70, risk: 43 },
      { month: "Dec", score: 68, risk: 48 },
      { month: "Jan", score: 66, risk: 55 },
      { month: "Feb", score: 64, risk: 60 },
      { month: "Mar", score: 62, risk: 65 },
      { month: "Apr", score: 61, risk: 68 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 2.0, spent: 1.8 },
      { month: "Dec", approved: 3.0, spent: 3.1 },
      { month: "Jan", approved: 4.0, spent: 4.2 },
      { month: "Feb", approved: 5.0, spent: 5.4 },
      { month: "Mar", approved: 5.8, spent: 6.2 },
      { month: "Apr", approved: 6.2, spent: 6.7 },
    ],
    riskFactors: [
      {
        label: "Commuter load",
        value: "Very high peak-hour traffic",
        severity: "high",
      },
      {
        label: "Edge deterioration",
        value: "Visible shoulder stress",
        severity: "medium",
      },
      {
        label: "Repair recurrence",
        value: "2 repeat repairs",
        severity: "medium",
      },
    ],
  },

  "4": {
    id: "4",
    name: "Baner Link Road",
    location: "Baner, Pune",
    authority: "PMC",
    contractor: "Shivneri Infra Works",
    builtYear: "2021",
    lengthKm: 2.4,
    roadType: "Urban link road",
    surface: "Bituminous",
    trafficLoad: "Medium",
    status: "Watch",
    riskLevel: "medium",
    riskScore: 49,
    healthScore: 72,
    monsoonRisk: 52,
    allocatedBudgetCr: 4.8,
    spentBudgetCr: 4.6,
    totalComplaints: 6,
    repeatFailures: 1,
    lastRepaired: "Dec 2025",
    nextInspection: "1 month",
    summary:
      "Baner Link Road is in watch condition. It is currently stable but should receive preventive crack sealing before monsoon pressure increases.",
    recommendedAction:
      "Preventive crack sealing and routine ward inspection.",
    repairHistory: [
      {
        date: "Dec 2025",
        work: "Preventive surface sealing",
        contractor: "Shivneri Infra Works",
        costCr: 0.62,
        quality: "Good",
      },
      {
        date: "Aug 2025",
        work: "Shoulder patching",
        contractor: "Shivneri Infra Works",
        costCr: 0.38,
        quality: "Good",
      },
      {
        date: "Apr 2025",
        work: "Line marking and minor resurfacing",
        contractor: "PMC Ward Team",
        costCr: 0.26,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Cracking", count: 2 },
      { type: "Potholes", count: 1 },
      { type: "Waterlogging", count: 1 },
      { type: "Surface Wear", count: 2 },
    ],
    healthTrend: [
      { month: "Oct", score: 79, risk: 26 },
      { month: "Nov", score: 78, risk: 30 },
      { month: "Dec", score: 76, risk: 35 },
      { month: "Jan", score: 75, risk: 38 },
      { month: "Feb", score: 74, risk: 42 },
      { month: "Mar", score: 73, risk: 46 },
      { month: "Apr", score: 72, risk: 49 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 1.4, spent: 1.2 },
      { month: "Dec", approved: 2.2, spent: 2.0 },
      { month: "Jan", approved: 2.9, spent: 2.6 },
      { month: "Feb", approved: 3.6, spent: 3.3 },
      { month: "Mar", approved: 4.2, spent: 4.0 },
      { month: "Apr", approved: 4.8, spent: 4.6 },
    ],
    riskFactors: [
      {
        label: "Preventive window",
        value: "Repair before monsoon",
        severity: "medium",
      },
      {
        label: "Contractor quality",
        value: "Strong performer",
        severity: "low",
      },
      {
        label: "Complaint density",
        value: "6 linked complaints",
        severity: "medium",
      },
    ],
  },

  "5": {
    id: "5",
    name: "Katraj Bypass",
    location: "Pune South",
    authority: "PWD Maharashtra",
    contractor: "QuickPatch Civil Works",
    builtYear: "2017",
    lengthKm: 3.1,
    roadType: "State road connector",
    surface: "Composite",
    trafficLoad: "Medium",
    status: "Watch",
    riskLevel: "medium",
    riskScore: 41,
    healthScore: 66,
    monsoonRisk: 69,
    allocatedBudgetCr: 2.7,
    spentBudgetCr: 3.4,
    totalComplaints: 5,
    repeatFailures: 1,
    lastRepaired: "Nov 2025",
    nextInspection: "After rainfall",
    summary:
      "Katraj Bypass has moderate risk mainly due to waterlogging and contractor quality concerns. It should be monitored closely after rainfall.",
    recommendedAction:
      "Post-rainfall inspection and drainage review before additional payment release.",
    repairHistory: [
      {
        date: "Nov 2025",
        work: "Surface patching near bypass entry",
        contractor: "QuickPatch Civil Works",
        costCr: 0.71,
        quality: "Average",
      },
      {
        date: "Jul 2025",
        work: "Waterlogging correction",
        contractor: "QuickPatch Civil Works",
        costCr: 0.52,
        quality: "Average",
      },
      {
        date: "Mar 2025",
        work: "Minor pothole filling",
        contractor: "PWD Road Unit",
        costCr: 0.28,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Waterlogging", count: 2 },
      { type: "Potholes", count: 2 },
      { type: "Surface Damage", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 72, risk: 30 },
      { month: "Nov", score: 70, risk: 33 },
      { month: "Dec", score: 69, risk: 35 },
      { month: "Jan", score: 68, risk: 37 },
      { month: "Feb", score: 67, risk: 39 },
      { month: "Mar", score: 66, risk: 40 },
      { month: "Apr", score: 66, risk: 41 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 0.9, spent: 1.0 },
      { month: "Dec", approved: 1.2, spent: 1.5 },
      { month: "Jan", approved: 1.6, spent: 2.0 },
      { month: "Feb", approved: 2.0, spent: 2.5 },
      { month: "Mar", approved: 2.4, spent: 3.0 },
      { month: "Apr", approved: 2.7, spent: 3.4 },
    ],
    riskFactors: [
      {
        label: "Monsoon exposure",
        value: "69% waterlogging risk",
        severity: "high",
      },
      {
        label: "Budget overrun",
        value: "Spending above approval",
        severity: "medium",
      },
      {
        label: "Contractor watchlist",
        value: "Quality score needs review",
        severity: "medium",
      },
    ],
  },

  "6": {
    id: "6",
    name: "Sinhagad Road Patch",
    location: "Pune South",
    authority: "PMC",
    contractor: "QuickPatch Civil Works",
    builtYear: "2016",
    lengthKm: 2.9,
    roadType: "Urban residential road",
    surface: "Bituminous",
    trafficLoad: "Medium",
    status: "Stable",
    riskLevel: "low",
    riskScore: 29,
    healthScore: 76,
    monsoonRisk: 38,
    allocatedBudgetCr: 2.1,
    spentBudgetCr: 1.9,
    totalComplaints: 3,
    repeatFailures: 1,
    lastRepaired: "Oct 2025",
    nextInspection: "Routine cycle",
    summary:
      "Sinhagad Road Patch is currently stable. Contractor history still needs monitoring, but present road condition does not require urgent action.",
    recommendedAction:
      "Routine monitoring and before/after repair verification.",
    repairHistory: [
      {
        date: "Oct 2025",
        work: "Minor pothole patching",
        contractor: "QuickPatch Civil Works",
        costCr: 0.32,
        quality: "Average",
      },
      {
        date: "Jun 2025",
        work: "Surface levelling",
        contractor: "PMC Ward Team",
        costCr: 0.24,
        quality: "Good",
      },
      {
        date: "Jan 2025",
        work: "Lane marking",
        contractor: "PMC Ward Team",
        costCr: 0.11,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Potholes", count: 1 },
      { type: "Surface Wear", count: 1 },
      { type: "Edge Damage", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 80, risk: 20 },
      { month: "Nov", score: 80, risk: 21 },
      { month: "Dec", score: 79, risk: 22 },
      { month: "Jan", score: 78, risk: 24 },
      { month: "Feb", score: 78, risk: 25 },
      { month: "Mar", score: 77, risk: 27 },
      { month: "Apr", score: 76, risk: 29 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 0.6, spent: 0.5 },
      { month: "Dec", approved: 0.9, spent: 0.8 },
      { month: "Jan", approved: 1.2, spent: 1.1 },
      { month: "Feb", approved: 1.5, spent: 1.4 },
      { month: "Mar", approved: 1.8, spent: 1.6 },
      { month: "Apr", approved: 2.1, spent: 1.9 },
    ],
    riskFactors: [
      {
        label: "Surface condition",
        value: "Stable",
        severity: "low",
      },
      {
        label: "Repair recurrence",
        value: "1 repeat patch",
        severity: "medium",
      },
      {
        label: "Traffic load",
        value: "Medium residential traffic",
        severity: "low",
      },
    ],
  },

  "7": {
    id: "7",
    name: "Ravet BRT Service Road",
    location: "PCMC",
    authority: "PCMC",
    contractor: "PCMC Infra Maintenance",
    builtYear: "2022",
    lengthKm: 2.2,
    roadType: "Service road",
    surface: "Bituminous",
    trafficLoad: "Medium",
    status: "Stable",
    riskLevel: "low",
    riskScore: 22,
    healthScore: 81,
    monsoonRisk: 31,
    allocatedBudgetCr: 5.1,
    spentBudgetCr: 4.9,
    totalComplaints: 2,
    repeatFailures: 0,
    lastRepaired: "Sep 2025",
    nextInspection: "6 months",
    summary:
      "Ravet BRT Service Road is one of the healthiest pilot segments. Low complaint recurrence and verified repairs indicate stable maintenance quality.",
    recommendedAction:
      "Continue routine inspection cycle.",
    repairHistory: [
      {
        date: "Sep 2025",
        work: "Preventive surface maintenance",
        contractor: "PCMC Infra Maintenance",
        costCr: 0.54,
        quality: "Good",
      },
      {
        date: "May 2025",
        work: "BRT lane edge correction",
        contractor: "PCMC Infra Maintenance",
        costCr: 0.41,
        quality: "Good",
      },
      {
        date: "Feb 2025",
        work: "Drainage grate maintenance",
        contractor: "PCMC Infra Maintenance",
        costCr: 0.18,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Surface Wear", count: 1 },
      { type: "Drainage", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 84, risk: 18 },
      { month: "Nov", score: 84, risk: 18 },
      { month: "Dec", score: 83, risk: 19 },
      { month: "Jan", score: 83, risk: 20 },
      { month: "Feb", score: 82, risk: 21 },
      { month: "Mar", score: 82, risk: 22 },
      { month: "Apr", score: 81, risk: 22 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 1.6, spent: 1.5 },
      { month: "Dec", approved: 2.2, spent: 2.1 },
      { month: "Jan", approved: 3.0, spent: 2.9 },
      { month: "Feb", approved: 3.8, spent: 3.6 },
      { month: "Mar", approved: 4.5, spent: 4.3 },
      { month: "Apr", approved: 5.1, spent: 4.9 },
    ],
    riskFactors: [
      {
        label: "Complaint density",
        value: "Only 2 linked complaints",
        severity: "low",
      },
      {
        label: "Repair quality",
        value: "Verified good repairs",
        severity: "low",
      },
      {
        label: "Budget discipline",
        value: "Within approved budget",
        severity: "low",
      },
    ],
  },

  "8": {
    id: "8",
    name: "Aundh Internal Road",
    location: "Aundh, Pune",
    authority: "PMC",
    contractor: "Shivneri Infra Works",
    builtYear: "2021",
    lengthKm: 1.7,
    roadType: "Urban internal road",
    surface: "Bituminous",
    trafficLoad: "Low",
    status: "Stable",
    riskLevel: "low",
    riskScore: 18,
    healthScore: 84,
    monsoonRisk: 27,
    allocatedBudgetCr: 3.2,
    spentBudgetCr: 3.1,
    totalComplaints: 2,
    repeatFailures: 0,
    lastRepaired: "Aug 2025",
    nextInspection: "6 months",
    summary:
      "Aundh Internal Road is a stable road segment with strong contractor performance and low anomaly frequency.",
    recommendedAction:
      "Routine inspection only.",
    repairHistory: [
      {
        date: "Aug 2025",
        work: "Preventive road surface treatment",
        contractor: "Shivneri Infra Works",
        costCr: 0.48,
        quality: "Good",
      },
      {
        date: "Apr 2025",
        work: "Line marking and shoulder clean-up",
        contractor: "Shivneri Infra Works",
        costCr: 0.22,
        quality: "Good",
      },
      {
        date: "Jan 2025",
        work: "Routine inspection repair",
        contractor: "PMC Ward Team",
        costCr: 0.12,
        quality: "Good",
      },
    ],
    complaintHistory: [
      { type: "Surface Wear", count: 1 },
      { type: "Signage", count: 1 },
    ],
    healthTrend: [
      { month: "Oct", score: 86, risk: 15 },
      { month: "Nov", score: 86, risk: 15 },
      { month: "Dec", score: 85, risk: 16 },
      { month: "Jan", score: 85, risk: 17 },
      { month: "Feb", score: 85, risk: 17 },
      { month: "Mar", score: 84, risk: 18 },
      { month: "Apr", score: 84, risk: 18 },
    ],
    spendingTrend: [
      { month: "Nov", approved: 0.8, spent: 0.7 },
      { month: "Dec", approved: 1.3, spent: 1.2 },
      { month: "Jan", approved: 1.8, spent: 1.7 },
      { month: "Feb", approved: 2.3, spent: 2.2 },
      { month: "Mar", approved: 2.8, spent: 2.7 },
      { month: "Apr", approved: 3.2, spent: 3.1 },
    ],
    riskFactors: [
      {
        label: "Road health",
        value: "Healthy condition",
        severity: "low",
      },
      {
        label: "Contractor quality",
        value: "Strong performance",
        severity: "low",
      },
      {
        label: "Monsoon risk",
        value: "Low exposure",
        severity: "low",
      },
    ],
  },
};

function getRiskColor(risk: RiskLevel) {
  if (risk === "critical") return "#DC2626";
  if (risk === "high") return "#F97316";
  if (risk === "medium") return "#F59E0B";
  return "#16A34A";
}

function getStatusColor(status: RoadStatus) {
  if (status === "Critical") return "#DC2626";
  if (status === "Repair Due") return "#F97316";
  if (status === "Watch") return "#F59E0B";
  return "#16A34A";
}

function getQualityColor(quality: RepairQuality) {
  if (quality === "Good") return "#16A34A";
  if (quality === "Average") return "#F59E0B";
  return "#DC2626";
}

function formatCr(value: number) {
  return `â‚¹${value.toFixed(1)} Cr`;
}

function Pill({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        background: `${color}18`,
        color,
      }}
    >
      {label}
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
          DNA
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

function RiskFactorCard({ factor }: { factor: RiskFactor }) {
  const color = getRiskColor(factor.severity);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "hsl(var(--muted))",
        border: `1px solid ${color}30`,
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{factor.label}</h3>
        <Pill label={factor.severity} color={color} />
      </div>

      <p className="text-xs leading-5 text-muted-foreground">{factor.value}</p>
    </div>
  );
}

export default function RoadDetailPage() {
  const params = useParams<{ id: string }>();
  const road = ROAD_DATABASE[params.id ?? "1"] ?? ROAD_DATABASE["1"];

  const riskColor = getRiskColor(road.riskLevel);
  const statusColor = getStatusColor(road.status);
  const budgetVariance = road.spentBudgetCr - road.allocatedBudgetCr;
  const budgetVariancePercent =
    road.allocatedBudgetCr > 0
      ? (budgetVariance / road.allocatedBudgetCr) * 100
      : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <Link href="/roads">
          <button
            type="button"
            className="mb-4 flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Road DNA
          </button>
        </Link>

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
                <Route className="h-3.5 w-3.5" />
                ROAD DNA PROFILE
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Pill label={road.riskLevel} color={riskColor} />
                <Pill label={road.status} color={statusColor} />
              </div>

              <h1
                className="mt-3 text-2xl font-bold md:text-3xl"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {road.name}
              </h1>

              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {road.location} Â· {road.authority} Â· {road.roadType}
              </p>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-muted-foreground">
                {road.summary}
              </p>
            </div>

            <div
              className="rounded-2xl p-5 xl:min-w-[260px]"
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <p className="text-xs text-muted-foreground">Road Health Score</p>

              <div className="mt-1 flex items-end gap-2">
                <span
                  className="text-5xl font-bold"
                  style={{
                    color: getHealthColor(road.healthScore),
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  {road.healthScore}
                </span>
                <span className="pb-2 text-sm text-muted-foreground">/100</span>
              </div>

              <div
                className="mt-4 h-2 overflow-hidden rounded-full"
                style={{ background: "hsl(var(--border))" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${road.healthScore}%`,
                    background: getHealthColor(road.healthScore),
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Risk Score"
          value={`${road.riskScore}/100`}
          note={`Failure level: ${road.riskLevel}`}
          icon={TrendingDown}
          color={riskColor}
        />

        <MetricCard
          label="Complaints"
          value={road.totalComplaints}
          note="Citizen signals linked"
          icon={FileText}
          color="#F59E0B"
        />

        <MetricCard
          label="Repeat Failures"
          value={road.repeatFailures}
          note="Repair recurrence"
          icon={AlertTriangle}
          color={road.repeatFailures >= 3 ? "#DC2626" : "#F97316"}
        />

        <MetricCard
          label="Budget Used"
          value={formatCr(road.spentBudgetCr)}
          note={
            budgetVariance > 0
              ? `${budgetVariancePercent.toFixed(1)}% over approved`
              : "Within approved budget"
          }
          icon={Wallet}
          color={budgetVariance > 0 ? "#DC2626" : "#16A34A"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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
            Health vs Risk Trend
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Road health should improve while risk reduces. Divergence indicates
            maintenance failure.
          </p>

          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={road.healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Health Score"
                  stroke="#0EA5A4"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  name="Risk Score"
                  stroke={riskColor}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
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
            Road Metadata
          </h2>

          <div className="mt-4 space-y-3">
            <InfoRow icon={Building2} label="Authority" value={road.authority} />
            <InfoRow icon={User} label="Contractor" value={road.contractor} />
            <InfoRow icon={Calendar} label="Built Year" value={road.builtYear} />
            <InfoRow icon={Activity} label="Length" value={`${road.lengthKm} km`} />
            <InfoRow icon={Wrench} label="Surface" value={road.surface} />
            <InfoRow icon={Clock3} label="Next Inspection" value={road.nextInspection} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
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
            Budget Flow
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Approved vs actual spend in â‚¹ crore.
          </p>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={road.spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Approved"
                  stroke="#0EA5A4"
                  fill="rgba(14,165,164,0.14)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="spent"
                  name="Spent"
                  stroke="#F59E0B"
                  fill="rgba(245,158,11,0.14)"
                  strokeWidth={2}
                />
              </AreaChart>
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
            Complaint Mix
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Citizen issue categories linked to this road.
          </p>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={road.complaintHistory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="type"
                  type="category"
                  width={100}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {road.complaintHistory.map((item, index) => (
                    <Cell
                      key={item.type}
                      fill={
                        index === 0
                          ? riskColor
                          : index === 1
                            ? "#F59E0B"
                            : "#0EA5A4"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
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
            Risk Factors
          </h2>

          <div className="mt-4 space-y-3">
            {road.riskFactors.map((factor) => (
              <RiskFactorCard key={factor.label} factor={factor} />
            ))}
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
            Repair History
          </h2>

          <div className="mt-4 space-y-3">
            {road.repairHistory.map((repair) => {
              const qualityColor = getQualityColor(repair.quality);

              return (
                <div
                  key={`${repair.date}-${repair.work}`}
                  className="rounded-2xl p-4"
                  style={{
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{repair.work}</span>
                        <Pill label={repair.quality} color={qualityColor} />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {repair.date} Â· {repair.contractor}
                      </p>
                    </div>

                    <div
                      className="rounded-xl px-3 py-2 text-sm font-bold"
                      style={{
                        background: `${qualityColor}14`,
                        color: qualityColor,
                      }}
                    >
                      {formatCr(repair.costCr)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="rounded-3xl p-5"
        style={{
          background:
            road.riskLevel === "critical"
              ? "rgba(220,38,38,0.10)"
              : road.riskLevel === "high"
                ? "rgba(249,115,22,0.10)"
                : "rgba(14,165,164,0.08)",
          border: `1px solid ${riskColor}30`,
        }}
      >
        <div className="flex items-start gap-3">
          {road.riskLevel === "low" ? (
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
          ) : (
            <AlertTriangle
              className="mt-1 h-5 w-5 shrink-0"
              style={{ color: riskColor }}
            />
          )}

          <div>
            <h2
              className="font-semibold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Recommended Action
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {road.recommendedAction}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/complaints">
                <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-4 py-2 text-sm font-bold text-white">
                  File Related Complaint
                </button>
              </Link>

              <Link href="/spending">
                <button className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold">
                  Review Spending
                </button>
              </Link>

              <Link href="/contractors">
                <button className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold">
                  Check Contractor
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl p-3"
      style={{
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>

      <span className="text-right text-sm font-semibold">{value}</span>
    </div>
  );
}
