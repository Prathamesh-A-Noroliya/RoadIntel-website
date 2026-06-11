import { useEffect } from "react";
import { syncPendingReports } from "@/lib/offlineReports";

const SYNC_ENDPOINT = "";

/**
 * Later, when you have a real backend API, use:
 * const SYNC_ENDPOINT = "/api/reports";
 *
 * Current mode:
 * Empty endpoint means local demo sync.
 * Pending Sync becomes Synced when internet comes back.
 */
export function OfflineSyncProvider() {
  useEffect(() => {
    let wasOffline = !navigator.onLine;
    let syncing = false;

    const runSync = async () => {
      if (!navigator.onLine || syncing) return;

      syncing = true;

      try {
        const result = await syncPendingReports({
          endpoint: SYNC_ENDPOINT || undefined,
        });

        if (wasOffline && result.synced > 0) {
          window.alert("Offline reports synced successfully.");
        }

        wasOffline = false;
      } catch (error) {
        console.error("Offline sync failed:", error);
      } finally {
        syncing = false;
      }
    };

    const handleOffline = () => {
      wasOffline = true;
    };

    const handleOnline = () => {
      void runSync();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void runSync();
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    void runSync();

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}