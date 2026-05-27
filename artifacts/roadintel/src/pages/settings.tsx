import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Bell,
  Globe,
  Shield,
  Eye,
  Database,
  Download,
  Save,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  User,
  MapPin,
  Trash2,
} from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;

  localStorage.setItem("roadintel-theme", theme);
}

export default function Settings() {
  const [, navigate] = useLocation();

  const [notifComplaints, setNotifComplaints] = useState(true);
  const [notifSensor, setNotifSensor] = useState(true);
  const [notifBudget, setNotifBudget] = useState(true);

  const [theme, setTheme] = useState<ThemeMode>("dark");

  const [fullName, setFullName] = useState("Demo User");
  const [mobile, setMobile] = useState("+91 9876543210");
  const [location, setLocation] = useState("Pune, Maharashtra");

  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("roadintel-theme") as ThemeMode | null;
      const storedUser = localStorage.getItem("roadintel-user");
      const storedNotifications = localStorage.getItem("roadintel-notifications");

      if (
        storedTheme === "light" ||
        storedTheme === "dark" ||
        storedTheme === "system"
      ) {
        setTheme(storedTheme);
        applyTheme(storedTheme);
      } else {
        setTheme("dark");
        applyTheme("dark");
      }

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setFullName(user?.name ?? "Demo User");
        setMobile(user?.mobile ?? "+91 9876543210");
        setLocation(user?.location ?? "Pune, Maharashtra");
      }

      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        setNotifComplaints(notifications?.complaints ?? true);
        setNotifSensor(notifications?.sensors ?? true);
        setNotifBudget(notifications?.budget ?? true);
      }

      localStorage.setItem("roadintel-language", "en");
    } catch {
      setTheme("dark");
      applyTheme("dark");
      localStorage.setItem("roadintel-language", "en");
    }
  }, []);

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  function updateTheme(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  function saveProfile() {
    localStorage.setItem("roadintel-language", "en");

    localStorage.setItem(
      "roadintel-user",
      JSON.stringify({
        name: fullName,
        mobile,
        location,
        role: "Road Safety Analyst",
        language: "English",
      }),
    );

    localStorage.setItem(
      "roadintel-notifications",
      JSON.stringify({
        complaints: notifComplaints,
        sensors: notifSensor,
        budget: notifBudget,
      }),
    );

    setSaved(true);
    alert("Profile saved successfully.");

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  }

  function downloadData() {
    const data = {
      profile: {
        name: fullName,
        mobile,
        location,
        role: "Road Safety Analyst",
        language: "English",
      },
      theme,
      notifications: {
        complaints: notifComplaints,
        sensors: notifSensor,
        budget: notifBudget,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "roadintel-profile-data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setDownloaded(true);
    alert("Your RoadIntel data has been downloaded.");

    window.setTimeout(() => {
      setDownloaded(false);
    }, 2200);
  }

  function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your demo account data?",
    );

    if (!confirmed) return;

    localStorage.removeItem("roadintel-auth");
    localStorage.removeItem("roadintel-user");
    localStorage.removeItem("roadintel-notifications");
    localStorage.removeItem("roadintel-language");

    alert("Account deleted successfully. Redirecting to login page.");
    navigate("/login");
  }

  function Toggle({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (value: boolean) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="relative h-6 w-12 rounded-full transition-colors"
        style={{ background: value ? "#0EA5A4" : "hsl(var(--muted))" }}
        aria-label="Toggle setting"
      >
        <div
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
          style={{ left: value ? "26px" : "2px" }}
        />
      </button>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 p-4 sm:p-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, theme, notifications, and privacy.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Profile saved successfully.
        </div>
      )}

      {downloaded && (
        <div className="flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-400">
          <CheckCircle2 className="h-4 w-4" />
          Data downloaded successfully.
        </div>
      )}

      <section
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <Shield className="h-4 w-4" style={{ color: "#0EA5A4" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Profile
          </h3>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-xl px-10 py-2.5 text-sm outline-none"
                  style={{
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Mobile
              </label>
              <input
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-xl px-10 py-2.5 text-sm outline-none"
                style={{
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <Eye className="h-4 w-4" style={{ color: "#0EA5A4" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Appearance
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => updateTheme("light")}
            className="rounded-2xl p-4 text-left transition hover:scale-[1.02]"
            style={{
              background:
                theme === "light"
                  ? "rgba(14,165,164,0.14)"
                  : "hsl(var(--muted))",
              border:
                theme === "light"
                  ? "1px solid #0EA5A4"
                  : "1px solid hsl(var(--border))",
            }}
          >
            <Sun className="mb-3 h-5 w-5 text-amber-400" />
            <div className="font-semibold">Light</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Bright interface
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateTheme("dark")}
            className="rounded-2xl p-4 text-left transition hover:scale-[1.02]"
            style={{
              background:
                theme === "dark"
                  ? "rgba(14,165,164,0.14)"
                  : "hsl(var(--muted))",
              border:
                theme === "dark"
                  ? "1px solid #0EA5A4"
                  : "1px solid hsl(var(--border))",
            }}
          >
            <Moon className="mb-3 h-5 w-5 text-blue-400" />
            <div className="font-semibold">Dark</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Default RoadIntel mode
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateTheme("system")}
            className="rounded-2xl p-4 text-left transition hover:scale-[1.02]"
            style={{
              background:
                theme === "system"
                  ? "rgba(14,165,164,0.14)"
                  : "hsl(var(--muted))",
              border:
                theme === "system"
                  ? "1px solid #0EA5A4"
                  : "1px solid hsl(var(--border))",
            }}
          >
            <Monitor className="mb-3 h-5 w-5 text-slate-400" />
            <div className="font-semibold">System</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Match device theme
            </div>
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-teal-500/10 px-4 py-3 text-sm text-teal-300">
          Current theme: <strong className="capitalize">{theme}</strong>
        </div>
      </section>

      <section
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <Globe className="h-4 w-4" style={{ color: "#0EA5A4" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Language
          </h3>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(14,165,164,0.14)",
            border: "1px solid #0EA5A4",
          }}
        >
          <div className="font-semibold">English</div>
          <div className="mt-1 text-sm text-muted-foreground">
            English is the only available language.
          </div>
          <div className="mt-3 text-xs font-bold text-teal-400">Selected</div>
        </div>
      </section>

      <section
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <Bell className="h-4 w-4" style={{ color: "#0EA5A4" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              label: "Complaint Updates",
              sub: "Notify when your complaints are updated",
              value: notifComplaints,
              onChange: setNotifComplaints,
            },
            {
              label: "Sensor Alerts",
              sub: "Critical sensor anomalies near your location",
              value: notifSensor,
              onChange: setNotifSensor,
            },
            {
              label: "Budget Alerts",
              sub: "Suspicious spending patterns flagged by AI",
              value: notifBudget,
              onChange: setNotifBudget,
            },
          ].map(({ label, sub, value, onChange }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>

              <Toggle value={value} onChange={onChange} />
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl p-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <Database className="h-4 w-4" style={{ color: "#0EA5A4" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Data & Privacy
          </h3>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={downloadData}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm"
            style={{
              background: "hsl(var(--muted))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <span>Download my RoadIntel data</span>
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={deleteAccount}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#EF4444",
            }}
          >
            <span>Delete demo account data</span>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveProfile}
          className="flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #2563EB, #0EA5A4)",
          }}
        >
          <Save className="h-4 w-4" />
          Save Profile
        </button>
      </div>
    </div>
  );
}