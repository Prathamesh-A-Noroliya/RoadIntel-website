export type ReportSyncStatus = "Pending Sync" | "Synced";

export type RoadDefectInput = {
  defectType: string;
  severity?: string;
  description?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  photoDataUrl?: string | null;
  source?: string;
  extra?: Record<string, unknown>;
};

export type RoadDefectReport = RoadDefectInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ReportSyncStatus;
  syncAttempts: number;
  lastSyncAttemptAt?: string | null;
  syncedAt?: string | null;
  lastSyncError?: string | null;
};

const DB_NAME = "roadintel-offline-db";
const DB_VERSION = 1;
const STORE_NAME = "road_defect_reports";

export const OFFLINE_REPORTS_CHANGED_EVENT =
  "roadintel-offline-reports-changed";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `report-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function notifyReportsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OFFLINE_REPORTS_CHANGED_EVENT));
  }
}

function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not supported in this browser."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });

        store.createIndex("status", "status", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open offline database."));
    };
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      reject(request.error ?? new Error("IndexedDB request failed."));
    };
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not convert file to data URL."));
      }
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file."));
    };

    reader.readAsDataURL(file);
  });
}

export async function saveRoadDefectOffline(
  input: RoadDefectInput,
): Promise<RoadDefectReport> {
  const now = new Date().toISOString();

  const report: RoadDefectReport = {
    id: createId(),
    defectType: input.defectType,
    severity: input.severity ?? "Medium",
    description: input.description ?? "",
    address: input.address ?? "",
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    photoDataUrl: input.photoDataUrl ?? null,
    source: input.source ?? "Citizen Report",
    extra: input.extra ?? {},
    createdAt: now,
    updatedAt: now,
    status: "Pending Sync",
    syncAttempts: 0,
    lastSyncAttemptAt: null,
    syncedAt: null,
    lastSyncError: null,
  };

  const db = await openOfflineDB();

  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await requestToPromise(store.add(report));
    notifyReportsChanged();

    return report;
  } finally {
    db.close();
  }
}

export async function getOfflineReports(): Promise<RoadDefectReport[]> {
  const db = await openOfflineDB();

  try {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const reports = await requestToPromise<RoadDefectReport[]>(store.getAll());

    return reports.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } finally {
    db.close();
  }
}

export async function getPendingOfflineReports(): Promise<RoadDefectReport[]> {
  const db = await openOfflineDB();

  try {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("status");

    return await requestToPromise<RoadDefectReport[]>(
      index.getAll("Pending Sync"),
    );
  } finally {
    db.close();
  }
}

async function updateOfflineReport(report: RoadDefectReport): Promise<void> {
  const db = await openOfflineDB();

  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await requestToPromise(store.put(report));
    notifyReportsChanged();
  } finally {
    db.close();
  }
}

export async function getOfflineReportCounts() {
  const reports = await getOfflineReports();

  return {
    total: reports.length,
    pending: reports.filter((report) => report.status === "Pending Sync")
      .length,
    synced: reports.filter((report) => report.status === "Synced").length,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown sync error";
}

type SyncOptions = {
  endpoint?: string;
};

export async function syncPendingReports(options: SyncOptions = {}) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      total: 0,
      synced: 0,
      failed: 0,
    };
  }

  const pendingReports = await getPendingOfflineReports();

  let synced = 0;
  let failed = 0;

  for (const report of pendingReports) {
    const now = new Date().toISOString();

    const attemptReport: RoadDefectReport = {
      ...report,
      updatedAt: now,
      syncAttempts: report.syncAttempts + 1,
      lastSyncAttemptAt: now,
    };

    try {
      /*
        Real backend mode:
        Add endpoint later, for example:
        endpoint: "/api/reports"

        Current safe demo mode:
        If endpoint is empty, report becomes Synced locally.
      */
      if (options.endpoint) {
        const response = await fetch(options.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attemptReport),
        });

        if (!response.ok) {
          throw new Error(`Sync failed with status ${response.status}`);
        }
      }

      await updateOfflineReport({
        ...attemptReport,
        status: "Synced",
        syncedAt: new Date().toISOString(),
        lastSyncError: null,
        updatedAt: new Date().toISOString(),
      });

      synced += 1;
    } catch (error) {
      await updateOfflineReport({
        ...attemptReport,
        status: "Pending Sync",
        lastSyncError: getErrorMessage(error),
        updatedAt: new Date().toISOString(),
      });

      failed += 1;
    }
  }

  notifyReportsChanged();

  return {
    total: pendingReports.length,
    synced,
    failed,
  };
}
