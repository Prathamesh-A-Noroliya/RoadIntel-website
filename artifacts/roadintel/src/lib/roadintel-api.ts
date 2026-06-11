import { supabase } from "./supabase";

export async function getRoads() {
  const { data, error } = await supabase
    .from("roads")
    .select("*")
    .order("risk_score", { ascending: false });

  if (error) {
    console.error("Failed to fetch roads:", error.message);
    return [];
  }

  return data;
}

export async function getRoadReports() {
  const { data, error } = await supabase
    .from("road_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch road reports:", error.message);
    return [];
  }

  return data;
}

export async function getContractors() {
  const { data, error } = await supabase
    .from("contractors")
    .select("*")
    .eq("active", true)
    .order("rating", { ascending: false });

  if (error) {
    console.error("Failed to fetch contractors:", error.message);
    return [];
  }

  return data;
}

export async function getSensors() {
  const { data, error } = await supabase
    .from("sensors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch sensors:", error.message);
    return [];
  }

  return data;
}

export async function getSensorReadings() {
  const { data, error } = await supabase
    .from("sensor_readings")
    .select("*")
    .order("recorded_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch sensor readings:", error.message);
    return [];
  }

  return data;
}

export async function getPublicSpending() {
  const { data, error } = await supabase
    .from("public_spending")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch public spending:", error.message);
    return [];
  }

  return data;
}

export async function createRoadReport(report: {
  title: string;
  description?: string;
  issue_type?: string;
  severity?: string;
  area?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}) {
  const { data, error } = await supabase
    .from("road_reports")
    .insert({
      title: report.title,
      description: report.description ?? "",
      issue_type: report.issue_type ?? "other",
      severity: report.severity ?? "medium",
      area: report.area ?? "",
      city: report.city ?? "Pune",
      state: report.state ?? "Maharashtra",
      latitude: report.latitude ?? null,
      longitude: report.longitude ?? null,
      status: "submitted",
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create road report:", error.message);
    throw error;
  }

  return data;
}