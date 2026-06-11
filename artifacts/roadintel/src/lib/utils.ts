import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskColor(level: string) {
  switch (level?.toLowerCase()) {
    case "critical": return "#DC2626";
    case "high": return "#F59E0B";
    case "medium": return "#0EA5A4";
    case "low": return "#16A34A";
    default: return "#64748B";
  }
}

export function getHealthColor(score: number) {
  if (score >= 80) return "#16A34A";
  if (score >= 60) return "#0EA5A4";
  if (score >= 40) return "#F59E0B";
  return "#DC2626";
}

export function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
}

export function formatDate(date: string) {
  try { return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return date; }
}
