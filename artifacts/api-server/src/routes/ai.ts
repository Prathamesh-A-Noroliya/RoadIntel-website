import { Router } from "express";

const router = Router();

type RiskLevel = "critical" | "high" | "medium" | "low";
type Severity = "critical" | "high" | "medium" | "low";

type RoadRecord = {
  id: number;
  roadId: number;
  roadName: string;
  city: string;
  authority: string;
  latitude: number;
  longitude: number;
  healthScore: number;
  riskScore: number;
  riskLevel: RiskLevel;
  predictedFailureIn: string;
  complaintCount: number;
  vibrationScore: number;
  repeatRepairs: number;
  contractorName: string;
  budgetSpentCr: number;
  qualityScore: number;
  reason: string;
  recommendedAction: string;
};

type ContractorRecord = {
  id: number;
  contractorName: string;
  authority: string;
  zone: string;
  roadsManaged: string[];
  qualityScore: number;
  timelinessScore: number;
  budgetApprovedCr: number;
  budgetUsedCr: number;
  repeatFailureRate: number;
  complaintRecurrence: number;
};

const PILOT_ROADS: RoadRecord[] = [
  {
    id: 1,
    roadId: 101,
    roadName: "JM Road Patch Zone",
    city: "Pune",
    authority: "PMC",
    latitude: 18.5222,
    longitude: 73.8478,
    healthScore: 42,
    riskScore: 86,
    riskLevel: "critical",
    predictedFailureIn: "3-5 days",
    complaintCount: 17,
    vibrationScore: 7.8,
    repeatRepairs: 4,
    contractorName: "UrbanBuild Pune Services",
    budgetSpentCr: 4.8,
    qualityScore: 58,
    reason:
      "High complaint density, repeated patch failure, and strong vibration readings after rainfall.",
    recommendedAction:
      "Emergency field inspection, pothole patching, and contractor quality review within 24 hours.",
  },
  {
    id: 2,
    roadId: 102,
    roadName: "FC Road Junction",
    city: "Pune",
    authority: "PMC",
    latitude: 18.5206,
    longitude: 73.8419,
    healthScore: 56,
    riskScore: 74,
    riskLevel: "high",
    predictedFailureIn: "1-2 weeks",
    complaintCount: 12,
    vibrationScore: 6.4,
    repeatRepairs: 2,
    contractorName: "UrbanBuild Pune Services",
    budgetSpentCr: 3.9,
    qualityScore: 61,
    reason:
      "Surface cracking and drainage stress detected near a high-traffic junction.",
    recommendedAction:
      "Crack sealing, drainage check, and ward engineer verification within 48 hours.",
  },
  {
    id: 3,
    roadId: 103,
    roadName: "Wakad-Hinjewadi Road",
    city: "PCMC",
    authority: "PCMC",
    latitude: 18.5912,
    longitude: 73.7389,
    healthScore: 61,
    riskScore: 68,
    riskLevel: "high",
    predictedFailureIn: "2-3 weeks",
    complaintCount: 9,
    vibrationScore: 5.8,
    repeatRepairs: 2,
    contractorName: "Maharashtra RoadBuild Ltd.",
    budgetSpentCr: 6.7,
    qualityScore: 76,
    reason:
      "Heavy commuter load and early edge deterioration detected on the IT corridor approach.",
    recommendedAction:
      "Schedule resurfacing inspection and monitor commuter-hour vibration spikes.",
  },
  {
    id: 4,
    roadId: 104,
    roadName: "Baner Link Road",
    city: "Pune",
    authority: "PMC",
    latitude: 18.559,
    longitude: 73.7868,
    healthScore: 72,
    riskScore: 49,
    riskLevel: "medium",
    predictedFailureIn: "1-2 months",
    complaintCount: 6,
    vibrationScore: 3.2,
    repeatRepairs: 1,
    contractorName: "Shivneri Infra Works",
    budgetSpentCr: 4.6,
    qualityScore: 92,
    reason:
      "Moderate surface wear with low repeat-failure pattern. Preventive repair can avoid escalation.",
    recommendedAction:
      "Preventive crack sealing and routine ward inspection.",
  },
  {
    id: 5,
    roadId: 105,
    roadName: "Katraj Bypass",
    city: "Pune",
    authority: "PWD Maharashtra",
    latitude: 18.4529,
    longitude: 73.8652,
    healthScore: 66,
    riskScore: 41,
    riskLevel: "medium",
    predictedFailureIn: "2 months",
    complaintCount: 5,
    vibrationScore: 4.9,
    repeatRepairs: 1,
    contractorName: "QuickPatch Civil Works",
    budgetSpentCr: 3.4,
    qualityScore: 49,
    reason:
      "Waterlogging stress and low contractor quality score make this a watchlist road.",
    recommendedAction:
      "Post-rainfall inspection and drainage review before additional payment release.",
  },
  {
    id: 6,
    roadId: 106,
    roadName: "Sinhagad Road Patch",
    city: "Pune",
    authority: "PMC",
    latitude: 18.4766,
    longitude: 73.8196,
    healthScore: 76,
    riskScore: 29,
    riskLevel: "low",
    predictedFailureIn: "4-6 months",
    complaintCount: 3,
    vibrationScore: 2.7,
    repeatRepairs: 1,
    contractorName: "QuickPatch Civil Works",
    budgetSpentCr: 2.9,
    qualityScore: 54,
    reason:
      "Minor wear pattern. No urgent structural risk, but contractor history requires monitoring.",
    recommendedAction:
      "Routine monitoring and before/after repair verification.",
  },
  {
    id: 7,
    roadId: 107,
    roadName: "Ravet BRT Service Road",
    city: "PCMC",
    authority: "PCMC",
    latitude: 18.6517,
    longitude: 73.7417,
    healthScore: 81,
    riskScore: 22,
    riskLevel: "low",
    predictedFailureIn: "6+ months",
    complaintCount: 2,
    vibrationScore: 2.4,
    repeatRepairs: 0,
    contractorName: "PCMC Infra Maintenance",
    budgetSpentCr: 4.9,
    qualityScore: 86,
    reason:
      "Stable road segment with good repair verification and low complaint recurrence.",
    recommendedAction:
      "Continue routine inspection cycle.",
  },
  {
    id: 8,
    roadId: 108,
    roadName: "Aundh Internal Road",
    city: "Pune",
    authority: "PMC",
    latitude: 18.5595,
    longitude: 73.8078,
    healthScore: 84,
    riskScore: 18,
    riskLevel: "low",
    predictedFailureIn: "6+ months",
    complaintCount: 2,
    vibrationScore: 2.1,
    repeatRepairs: 0,
    contractorName: "Shivneri Infra Works",
    budgetSpentCr: 3.1,
    qualityScore: 91,
    reason:
      "Healthy road segment with low anomaly frequency and good contractor performance.",
    recommendedAction:
      "Routine inspection only.",
  },
];

const CONTRACTORS: ContractorRecord[] = [
  {
    id: 1,
    contractorName: "Shivneri Infra Works",
    authority: "PMC",
    zone: "Pune West",
    roadsManaged: ["Baner Link Road", "Aundh Internal Road"],
    qualityScore: 92,
    timelinessScore: 91,
    budgetApprovedCr: 4.8,
    budgetUsedCr: 4.6,
    repeatFailureRate: 0.05,
    complaintRecurrence: 3,
  },
  {
    id: 2,
    contractorName: "UrbanBuild Pune Services",
    authority: "PMC",
    zone: "Pune Central",
    roadsManaged: ["JM Road Patch Zone", "FC Road Junction"],
    qualityScore: 58,
    timelinessScore: 61,
    budgetApprovedCr: 3.9,
    budgetUsedCr: 4.8,
    repeatFailureRate: 0.31,
    complaintRecurrence: 17,
  },
  {
    id: 3,
    contractorName: "Maharashtra RoadBuild Ltd.",
    authority: "PCMC",
    zone: "PCMC Corridor",
    roadsManaged: ["Wakad-Hinjewadi Road"],
    qualityScore: 76,
    timelinessScore: 74,
    budgetApprovedCr: 6.2,
    budgetUsedCr: 6.7,
    repeatFailureRate: 0.15,
    complaintRecurrence: 9,
  },
  {
    id: 4,
    contractorName: "QuickPatch Civil Works",
    authority: "PWD / PMC",
    zone: "Pune South",
    roadsManaged: ["Katraj Bypass", "Sinhagad Road Patch"],
    qualityScore: 49,
    timelinessScore: 54,
    budgetApprovedCr: 2.7,
    budgetUsedCr: 3.4,
    repeatFailureRate: 0.38,
    complaintRecurrence: 21,
  },
  {
    id: 5,
    contractorName: "PCMC Infra Maintenance",
    authority: "PCMC",
    zone: "Pimpri-Chinchwad",
    roadsManaged: ["Ravet BRT Service Road"],
    qualityScore: 86,
    timelinessScore: 82,
    budgetApprovedCr: 5.1,
    budgetUsedCr: 4.9,
    repeatFailureRate: 0.09,
    complaintRecurrence: 5,
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getBudgetOverrunPercent(contractor: ContractorRecord) {
  const overrun =
    ((contractor.budgetUsedCr - contractor.budgetApprovedCr) /
      contractor.budgetApprovedCr) *
    100;

  return Math.max(0, Math.round(overrun));
}

function calculateRAS(contractor: ContractorRecord) {
  const budgetOverrun = getBudgetOverrunPercent(contractor);

  const score =
    contractor.qualityScore * 0.35 +
    (100 - budgetOverrun) * 0.25 +
    (1 - contractor.repeatFailureRate) * 100 * 0.25 +
    contractor.timelinessScore * 0.15;

  return Math.round(clamp(score));
}

function getRoadByMessage(message: string) {
  const msg = message.toLowerCase();

  return PILOT_ROADS.find((road) => {
    return (
      msg.includes(road.roadName.toLowerCase()) ||
      road.roadName
        .toLowerCase()
        .split(" ")
        .some((part) => part.length > 4 && msg.includes(part))
    );
  });
}

function getContractorByMessage(message: string) {
  const msg = message.toLowerCase();

  return CONTRACTORS.find((contractor) => {
    return (
      msg.includes(contractor.contractorName.toLowerCase()) ||
      contractor.contractorName
        .toLowerCase()
        .split(" ")
        .some((part) => part.length > 5 && msg.includes(part))
    );
  });
}

function getTopRiskRoads(limit = 3) {
  return [...PILOT_ROADS]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit);
}

function getWeakContractors() {
  return CONTRACTORS.map((contractor) => ({
    ...contractor,
    ras: calculateRAS(contractor),
    budgetOverrun: getBudgetOverrunPercent(contractor),
  })).sort((a, b) => a.ras - b.ras);
}

function createChatResponse(message: string) {
  const msg = message.toLowerCase();
  const matchedRoad = getRoadByMessage(message);
  const matchedContractor = getContractorByMessage(message);
  const topRoads = getTopRiskRoads(3);
  const weakContractors = getWeakContractors();
  const avgHealth = Math.round(
    PILOT_ROADS.reduce((total, road) => total + road.healthScore, 0) /
      PILOT_ROADS.length,
  );
  const activeComplaints = PILOT_ROADS.reduce(
    (total, road) => total + road.complaintCount,
    0,
  );
  const urgentRoads = PILOT_ROADS.filter((road) => road.riskScore >= 60);
  const totalBudgetUsed = CONTRACTORS.reduce(
    (total, contractor) => total + contractor.budgetUsedCr,
    0,
  );
  const totalBudgetApproved = CONTRACTORS.reduce(
    (total, contractor) => total + contractor.budgetApprovedCr,
    0,
  );
  const budgetOverrun = Math.max(
    0,
    ((totalBudgetUsed - totalBudgetApproved) / totalBudgetApproved) * 100,
  );

  if (matchedRoad) {
    return {
      response: `${matchedRoad.roadName} is currently ${matchedRoad.riskLevel.toUpperCase()} risk with a ${matchedRoad.healthScore}/100 health score and ${matchedRoad.riskScore}% failure risk. Predicted failure window: ${matchedRoad.predictedFailureIn}. Main reason: ${matchedRoad.reason} Recommended action: ${matchedRoad.recommendedAction}`,
      intent: "road_detail",
      confidence: 0.91,
      data: {
        roadName: matchedRoad.roadName,
        authority: matchedRoad.authority,
        healthScore: matchedRoad.healthScore,
        riskScore: matchedRoad.riskScore,
        riskLevel: matchedRoad.riskLevel,
      },
    };
  }

  if (matchedContractor) {
    const ras = calculateRAS(matchedContractor);
    const overrun = getBudgetOverrunPercent(matchedContractor);

    return {
      response: `${matchedContractor.contractorName} has a Road Accountability Score of ${ras}/100. Quality score is ${matchedContractor.qualityScore}/100, timeliness is ${matchedContractor.timelinessScore}/100, repeat failure rate is ${(matchedContractor.repeatFailureRate * 100).toFixed(0)}%, and budget overrun is ${overrun}%. Roads managed: ${matchedContractor.roadsManaged.join(", ")}.`,
      intent: "contractor_detail",
      confidence: 0.9,
      data: {
        contractorName: matchedContractor.contractorName,
        ras,
        qualityScore: matchedContractor.qualityScore,
        budgetOverrun: overrun,
      },
    };
  }

  if (
    msg.includes("health") ||
    msg.includes("score") ||
    msg.includes("condition")
  ) {
    return {
      response: `The Pune / PCMC pilot network has an average road health score of ${avgHealth}/100 across ${PILOT_ROADS.length} monitored road segments. The weakest roads are ${topRoads.map((road) => `${road.roadName} (${road.healthScore}/100)`).join(", ")}. This score combines complaint density, vibration signal, repair history, and contractor quality.`,
      intent: "health_summary",
      confidence: 0.86,
      data: { avgHealth, monitoredRoads: PILOT_ROADS.length },
    };
  }

  if (
    msg.includes("risk") ||
    msg.includes("fail") ||
    msg.includes("failure") ||
    msg.includes("predict")
  ) {
    return {
      response: `RoadIntel predicts ${urgentRoads.length} high-risk road segments in the next 30 days. Highest priority: ${topRoads.map((road) => `${road.roadName} (${road.riskScore}% risk, ${road.predictedFailureIn})`).join("; ")}. Recommended workflow: inspect, verify contractor history, then release repair order only after photo-based proof of work.`,
      intent: "risk_prediction",
      confidence: 0.88,
      data: { urgentRoads: urgentRoads.length, topRoads },
    };
  }

  if (
    msg.includes("sensor") ||
    msg.includes("vibration") ||
    msg.includes("anomaly") ||
    msg.includes("roughness")
  ) {
    const sensorRoads = [...PILOT_ROADS]
      .sort((a, b) => b.vibrationScore - a.vibrationScore)
      .slice(0, 3);

    return {
      response: `The simulated sensor feed shows ${sensorRoads.length} priority vibration zones. Top signals: ${sensorRoads.map((road) => `${road.roadName} (${road.vibrationScore}/10)`).join(", ")}. This is labelled as a demo digital twin: it combines vibration, shock-spike and roughness values to support field triage.`,
      intent: "sensor_summary",
      confidence: 0.84,
      data: { sensorRoads },
    };
  }

  if (
    msg.includes("complaint") ||
    msg.includes("file") ||
    msg.includes("report") ||
    msg.includes("citizen")
  ) {
    return {
      response: `RoadIntel is tracking ${activeComplaints} pilot complaint signals across PMC and PCMC corridors. Complaint routing uses road ownership and severity: PMC/PCMC for urban roads, PWD for state roads, and NHAI/MSRDC for highway corridors. Critical issues get a 24-hour SLA, high severity gets 48 hours, and medium cases get 5-7 days.`,
      intent: "complaint_routing",
      confidence: 0.85,
      data: { activeComplaints },
    };
  }

  if (
    msg.includes("spend") ||
    msg.includes("money") ||
    msg.includes("budget") ||
    msg.includes("corruption") ||
    msg.includes("flag")
  ) {
    const weakest = weakContractors[0];

    return {
      response: `The spending engine is tracking ₹${totalBudgetUsed.toFixed(1)} Cr used against ₹${totalBudgetApproved.toFixed(1)} Cr approved in the pilot dataset. Current overrun is ${budgetOverrun.toFixed(1)}%. Highest audit concern: ${weakest.contractorName}, RAS ${weakest.ras}/100, repeat failure rate ${(weakest.repeatFailureRate * 100).toFixed(0)}%, budget overrun ${weakest.budgetOverrun}%.`,
      intent: "spending_audit",
      confidence: 0.87,
      data: {
        totalBudgetUsed,
        totalBudgetApproved,
        budgetOverrun,
        weakestContractor: weakest.contractorName,
      },
    };
  }

  if (
    msg.includes("contractor") ||
    msg.includes("ras") ||
    msg.includes("accountability")
  ) {
    const best = [...weakContractors].sort((a, b) => b.ras - a.ras)[0];
    const weakest = weakContractors[0];

    return {
      response: `Road Accountability Score uses quality, budget discipline, repeat failure control, and timeliness. Best performer: ${best.contractorName} (${best.ras}/100). Weakest performer: ${weakest.contractorName} (${weakest.ras}/100). Contractors below 65 should be placed under audit review before new work allocation.`,
      intent: "contractor_accountability",
      confidence: 0.86,
      data: { best: best.contractorName, weakest: weakest.contractorName },
    };
  }

  if (
    msg.includes("what can you do") ||
    msg.includes("help") ||
    msg.includes("how")
  ) {
    return {
      response:
        "I can explain road health scores, predicted failure risk, complaint routing, simulated sensor alerts, public spending anomalies, and contractor accountability. Try asking: 'Which road is highest risk?', 'Why is JM Road critical?', 'Show contractor audit risk', or 'How are complaints routed?'",
      intent: "help",
      confidence: 0.82,
      data: null,
    };
  }

  return {
    response:
      "RoadIntel is currently running a Pune / PCMC pilot dataset. I can answer questions about road health, risk prediction, complaint routing, simulated sensor signals, spending anomalies, and contractor accountability. Ask about JM Road, FC Road, Wakad-Hinjewadi Road, UrbanBuild Pune Services, or public spending risk.",
    intent: "fallback",
    confidence: 0.72,
    data: {
      monitoredRoads: PILOT_ROADS.length,
      contractors: CONTRACTORS.length,
      pilotRegion: "Pune / PCMC",
    },
  };
}

function getScanResultFromInput(input: string) {
  const source = input.toLowerCase();

  if (
    source.includes("smooth") ||
    source.includes("good") ||
    source.includes("clear")
  ) {
    return {
      issueType: "Good Road Condition",
      severity: "low" as Severity,
      confidence: 0.94,
      healthScore: 88,
      riskLevel: "low" as RiskLevel,
      detectedIssues: ["Minor surface wear", "No major deformation detected"],
      recommendation:
        "Road is currently stable. Continue routine inspection and preventive maintenance check within 6 months.",
      shouldFileComplaint: false,
    };
  }

  if (
    source.includes("crack") ||
    source.includes("broken") ||
    source.includes("surface")
  ) {
    return {
      issueType: "Surface Cracking",
      severity: "medium" as Severity,
      confidence: 0.85,
      healthScore: 58,
      riskLevel: "medium" as RiskLevel,
      detectedIssues: [
        "Longitudinal cracking",
        "Minor delamination",
        "Early fatigue pattern",
      ],
      recommendation:
        "Crack sealing recommended within 30 days. Monitor after rainfall because water seepage can accelerate pothole formation.",
      shouldFileComplaint: true,
    };
  }

  if (
    source.includes("pothole") ||
    source.includes("hole") ||
    source.includes("damage")
  ) {
    return {
      issueType: "Pothole Formation",
      severity: "high" as Severity,
      confidence: 0.91,
      healthScore: 38,
      riskLevel: "high" as RiskLevel,
      detectedIssues: [
        "Surface pothole",
        "Edge crumbling",
        "Water seepage",
        "Asphalt delamination",
      ],
      recommendation:
        "Immediate patching required. Pothole depth appears unsafe for two-wheelers. Recommend full-depth hot-mix asphalt repair with independent verification before payment release.",
      shouldFileComplaint: true,
    };
  }

  return {
    issueType: "Uploaded Road Image Analysis",
    severity: "medium" as Severity,
    confidence: 0.82,
    healthScore: 64,
    riskLevel: "medium" as RiskLevel,
    detectedIssues: [
      "Surface wear detected",
      "Possible uneven patching",
      "Manual verification recommended",
    ],
    recommendation:
      "Uploaded image processed in demo mode. A field engineer should verify location, severity, and contractor responsibility before assignment.",
    shouldFileComplaint: true,
  };
}

router.post("/ai/chatbot", async (req, res) => {
  try {
    const { message } = req.body ?? {};

    const result = createChatResponse(String(message ?? ""));

    res.json({
      ...result,
      engine: "RoadIntel rule-based decision engine",
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      response:
        "RoadIntel assistant could not process the message right now. Please try again.",
      intent: "error",
      confidence: 0,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get("/ai/insights", async (_req, res) => {
  const topRoads = getTopRiskRoads(3);
  const weakContractors = getWeakContractors();

  res.json([
    {
      id: 1,
      title: `Failure risk rising on ${topRoads[0].roadName}`,
      description:
        "Complaint density, repeated patch failure, and vibration signal crossed the inspection threshold.",
      severity: "high",
      confidence: 0.86,
      roadId: topRoads[0].roadId,
    },
    {
      id: 2,
      title: `Budget-quality mismatch: ${weakContractors[0].contractorName}`,
      description: `RAS is ${weakContractors[0].ras}/100 with ${weakContractors[0].budgetOverrun}% budget overrun and high repeat-failure pattern.`,
      severity: "high",
      confidence: 0.84,
      roadId: null,
    },
    {
      id: 3,
      title: `Preventive maintenance window on ${topRoads[2].roadName}`,
      description:
        "Medium-term failure can be avoided through drainage check and preventive surface treatment.",
      severity: "medium",
      confidence: 0.79,
      roadId: topRoads[2].roadId,
    },
    {
      id: 4,
      title: "Complaint routing load concentrated in PMC zones",
      description:
        "Most high-priority complaints are currently routed to PMC Roads and Stormwater cells.",
      severity: "medium",
      confidence: 0.81,
      roadId: null,
    },
  ]);
});

router.post("/ai/scan", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { imageUrl, fileName, sampleId } = req.body ?? {};
  const input = `${imageUrl ?? ""} ${fileName ?? ""} ${sampleId ?? ""}`;

  res.json({
    ...getScanResultFromInput(input),
    engine: "RoadIntel demo scan classifier",
    timestamp: new Date().toISOString(),
  });
});

router.get("/ai/corruption-flags", async (_req, res) => {
  const weakContractors = getWeakContractors();

  const flags = weakContractors
    .filter(
      (contractor) =>
        contractor.ras < 75 ||
        contractor.budgetOverrun > 8 ||
        contractor.repeatFailureRate > 0.2,
    )
    .map((contractor, index) => {
      const severity: Severity =
        contractor.ras < 60 || contractor.budgetOverrun > 18
          ? "critical"
          : "high";

      return {
        id: index + 1,
        type:
          contractor.budgetOverrun > 10
            ? "Budget-Quality Mismatch"
            : "Repeat Repair Pattern",
        description:
          contractor.budgetOverrun > 10
            ? `Contractor used ${contractor.budgetOverrun}% more than approved budget while quality score remains ${contractor.qualityScore}/100.`
            : `Contractor shows repeat-failure rate of ${(contractor.repeatFailureRate * 100).toFixed(0)}% across monitored roads.`,
        roadName: contractor.roadsManaged.join(", "),
        contractorName: contractor.contractorName,
        severity,
        evidence: `RAS ${contractor.ras}/100 · Quality ${contractor.qualityScore}/100 · Timeliness ${contractor.timelinessScore}/100 · Complaints ${contractor.complaintRecurrence}`,
        detectedAt: "2026-04-22",
        status: severity === "critical" ? "open" : "under review",
      };
    });

  res.json(flags);
});

router.get("/roads/risk-map", async (_req, res) => {
  res.json(
    PILOT_ROADS.map((road) => ({
      id: road.id,
      roadId: road.roadId,
      roadName: road.roadName,
      city: road.city,
      authority: road.authority,
      latitude: road.latitude,
      longitude: road.longitude,
      riskScore: road.riskScore,
      riskLevel: road.riskLevel,
      predictedFailureIn: road.predictedFailureIn,
      reason: road.reason,
      recommendedAction: road.recommendedAction,
    })),
  );
});

export default router;