import { useEffect, useState } from "react";
import {
  getOfflineReports,
  OFFLINE_REPORTS_CHANGED_EVENT,
  type RoadDefectReport,
} from "@/lib/offlineReports";

export function OfflineReportsList() {
  const [reports, setReports] = useState<RoadDefectReport[]>([]);

  useEffect(() => {
    const refreshReports = async () => {
      try {
        const nextReports = await getOfflineReports();
        setReports(nextReports);
      } catch (error) {
        console.error("Failed to load offline reports:", error);
      }
    };

    void refreshReports();

    window.addEventListener(OFFLINE_REPORTS_CHANGED_EVENT, refreshReports);
    window.addEventListener("online", refreshReports);

    return () => {
      window.removeEventListener(OFFLINE_REPORTS_CHANGED_EVENT, refreshReports);
      window.removeEventListener("online", refreshReports);
    };
  }, []);

  if (reports.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-3xl p-5"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-5">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Offline Report Queue
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          These reports are stored locally first. Pending reports will sync when
          internet returns.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead
            className="border-b text-xs uppercase text-muted-foreground"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <tr>
              <th className="py-3 pr-4">Defect</th>
              <th className="py-3 pr-4">Severity</th>
              <th className="py-3 pr-4">Location</th>
              <th className="py-3 pr-4">Photo</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <td className="py-3 pr-4 font-medium">
                  {report.defectType}
                </td>

                <td className="py-3 pr-4 text-muted-foreground">
                  {report.severity}
                </td>

                <td className="py-3 pr-4 text-muted-foreground">
                  {report.address || "Location saved"}
                </td>

                <td className="py-3 pr-4">
                  {report.photoDataUrl ? (
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                      Photo Saved
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No photo</span>
                  )}
                </td>

                <td className="py-3 pr-4">
                  <span
                    className={
                      report.status === "Pending Sync"
                        ? "rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400"
                        : "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400"
                    }
                  >
                    {report.status}
                  </span>
                </td>

                <td className="py-3 pr-4 text-muted-foreground">
                  {new Date(report.createdAt).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
