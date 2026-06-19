import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  getOfflineReportCounts,
  OFFLINE_REPORTS_CHANGED_EVENT,
} from "@/lib/offlineReports";

type Counts = {
  total: number;
  pending: number;
  synced: number;
};

export function NetworkStatusCard() {
  const isOnline = useOnlineStatus();

  const [counts, setCounts] = useState<Counts>({
    total: 0,
    pending: 0,
    synced: 0,
  });

  useEffect(() => {
    const refreshCounts = async () => {
      try {
        const nextCounts = await getOfflineReportCounts();
        setCounts(nextCounts);
      } catch (error) {
        console.error("Failed to load offline report counts:", error);
      }
    };

    void refreshCounts();

    window.addEventListener(OFFLINE_REPORTS_CHANGED_EVENT, refreshCounts);
    window.addEventListener("online", refreshCounts);

    return () => {
      window.removeEventListener(OFFLINE_REPORTS_CHANGED_EVENT, refreshCounts);
      window.removeEventListener("online", refreshCounts);
    };
  }, []);

  return (
    <section
      className="rounded-3xl p-5"
      style={{
        background: isOnline
          ? "linear-gradient(135deg, rgba(22,163,74,0.16), rgba(14,165,164,0.08), hsl(var(--card)))"
          : "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.08), hsl(var(--card)))",
        border: isOnline
          ? "1px solid rgba(22,163,74,0.28)"
          : "1px solid rgba(245,158,11,0.32)",
      }}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase"
            style={{
              background: isOnline
                ? "rgba(22,163,74,0.14)"
                : "rgba(245,158,11,0.16)",
              color: isOnline ? "#16A34A" : "#F59E0B",
            }}
          >
            {isOnline ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}

            {isOnline ? "Online" : "Offline Mode"}
          </div>

          <h2
            className="text-xl font-bold md:text-2xl"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {isOnline
              ? "System Online â€” Reports sync instantly"
              : "Offline Mode Active â€” Reports saved locally"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {isOnline
              ? "RoadIntel is connected. Pending road defect reports will automatically sync."
              : "No internet detected. Citizens can still create road defect reports with photo evidence. Reports will remain safe on this device."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <p className="text-2xl font-bold">{counts.total}</p>
            <p className="mt-1 text-xs text-muted-foreground">Local Reports</p>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
            <p className="text-2xl font-bold text-yellow-400">
              {counts.pending}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Pending Sync</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <p className="text-2xl font-bold text-emerald-400">
              {counts.synced}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Synced</p>
          </div>
        </div>
      </div>
    </section>
  );
}
