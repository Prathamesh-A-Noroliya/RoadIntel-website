import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Bell,
  CheckCircle2,
  Database,
  Download,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NotificationSettings = {
  complaints: boolean;
  sensors: boolean;
  spending: boolean;
  contractors: boolean;
};

type SavedUser = {
  name?: string;
  email?: string;
  mobile?: string;
  location?: string;
  role?: string;
};

const DEFAULT_USER = {
  name: "Demo User",
  email: "demo@roadintel.in",
  mobile: "+91 98765 43210",
  location: "Pune, Maharashtra",
  role: "Road Safety Analyst",
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  complaints: true,
  sensors: true,
  spending: true,
  contractors: true,
};

function forceRoadIntelDarkTheme() {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;

  root.classList.remove("light");
  root.classList.add("dark");
  root.style.colorScheme = "dark";

  localStorage.setItem("roadintel-theme", "dark");
}

function readSavedUser(): SavedUser {
  if (typeof window === "undefined") return DEFAULT_USER;

  const sessionUser = sessionStorage.getItem("roadintel-user");
  const localUser = localStorage.getItem("roadintel-user");
  const rawUser = sessionUser || localUser;

  if (!rawUser) return DEFAULT_USER;

  try {
    const parsed = JSON.parse(rawUser) as SavedUser;

    return {
      name: parsed.name || DEFAULT_USER.name,
      email: parsed.email || DEFAULT_USER.email,
      mobile: parsed.mobile || DEFAULT_USER.mobile,
      location: parsed.location || DEFAULT_USER.location,
      role: parsed.role || DEFAULT_USER.role,
    };
  } catch {
    return DEFAULT_USER;
  }
}

function readNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;

  try {
    const raw = localStorage.getItem("roadintel-notifications");
    if (!raw) return DEFAULT_NOTIFICATIONS;

    const parsed = JSON.parse(raw) as Partial<NotificationSettings>;

    return {
      complaints: parsed.complaints ?? true,
      sensors: parsed.sensors ?? true,
      spending: parsed.spending ?? true,
      contractors: parsed.contractors ?? true,
    };
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

function saveUserToStorage(user: SavedUser) {
  const cleanUser = {
    name: user.name || DEFAULT_USER.name,
    email: user.email || DEFAULT_USER.email,
    mobile: user.mobile || DEFAULT_USER.mobile,
    location: user.location || DEFAULT_USER.location,
    role: user.role || DEFAULT_USER.role,
  };

  localStorage.setItem("roadintel-user", JSON.stringify(cleanUser));
  sessionStorage.setItem("roadintel-user", JSON.stringify(cleanUser));
}

function saveNotificationsToStorage(settings: NotificationSettings) {
  localStorage.setItem("roadintel-notifications", JSON.stringify(settings));
}

function SettingCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl p-5"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(14,165,164,0.14)" }}
        >
          <Icon className="h-5 w-5" style={{ color: "#0EA5A4" }} />
        </div>

        <div>
          <h2
            className="font-semibold"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}

function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl p-4"
      style={{
        background: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
      }}
    >
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className="relative h-7 w-13 shrink-0 rounded-full transition"
        style={{
          width: "52px",
          background: enabled ? "#0EA5A4" : "hsl(var(--muted))",
        }}
        aria-label={`Toggle ${label}`}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white transition-all"
          style={{ left: enabled ? "26px" : "4px" }}
        />
      </button>
    </div>
  );
}

function ActionCard({
  title,
  description,
  icon: Icon,
  action,
  danger = false,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  action: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: danger ? "rgba(220,38,38,0.08)" : "hsl(var(--background))",
        border: danger
          ? "1px solid rgba(220,38,38,0.24)"
          : "1px solid hsl(var(--border))",
      }}
    >
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: danger
              ? "rgba(220,38,38,0.14)"
              : "rgba(14,165,164,0.14)",
          }}
        >
          <Icon
            className="h-5 w-5"
            style={{ color: danger ? "#DC2626" : "#0EA5A4" }}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

export default function Settings() {
  const [, navigate] = useLocation();

  const storedUser = useMemo(() => readSavedUser(), []);

  const [fullName, setFullName] = useState(storedUser.name ?? DEFAULT_USER.name);
  const [email, setEmail] = useState(storedUser.email ?? DEFAULT_USER.email);
  const [mobile, setMobile] = useState(
    storedUser.mobile ?? DEFAULT_USER.mobile,
  );
  const [location, setLocation] = useState(
    storedUser.location ?? DEFAULT_USER.location,
  );
  const [role, setRole] = useState(storedUser.role ?? DEFAULT_USER.role);

  const [notifications, setNotifications] = useState<NotificationSettings>(
    readNotificationSettings,
  );

  const [saved, setSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    forceRoadIntelDarkTheme();
  }, []);

  function updateNotification<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) {
    setNotifications((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSaveProfile() {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();
    const cleanLocation = location.trim();
    const cleanRole = role.trim();

    if (!cleanName || !cleanEmail || !cleanMobile || !cleanLocation) {
      alert("Please fill name, email, mobile number and location.");
      return;
    }

    const user = {
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      location: cleanLocation,
      role: cleanRole || DEFAULT_USER.role,
    };

    saveUserToStorage(user);
    saveNotificationsToStorage(notifications);
    forceRoadIntelDarkTheme();

    setSaved(true);
    alert("Profile saved successfully.");

    window.setTimeout(() => setSaved(false), 2500);
  }

  function handleDownloadData() {
    const exportData = {
      profile: {
        name: fullName,
        email,
        mobile,
        location,
        role,
      },
      preferences: {
        theme: "RoadIntel fixed dark blue",
        notifications,
      },
      demoData: {
        note: "This is RoadIntel demo profile data stored in this browser.",
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
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
    alert("Your RoadIntel profile data has been downloaded.");

    window.setTimeout(() => setDownloaded(false), 2500);
  }

  function handleResetDemoData() {
    const confirmed = window.confirm(
      "Reset local demo preferences and restore default profile details?",
    );

    if (!confirmed) return;

    setFullName(DEFAULT_USER.name);
    setEmail(DEFAULT_USER.email);
    setMobile(DEFAULT_USER.mobile);
    setLocation(DEFAULT_USER.location);
    setRole(DEFAULT_USER.role);
    setNotifications(DEFAULT_NOTIFICATIONS);

    saveUserToStorage({
      ...DEFAULT_USER,
    });

    saveNotificationsToStorage(DEFAULT_NOTIFICATIONS);
    forceRoadIntelDarkTheme();

    alert("Demo profile has been reset.");
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this demo account from this browser?",
    );

    if (!confirmed) return;

    localStorage.removeItem("roadintel-auth");
    localStorage.removeItem("roadintel-user");
    localStorage.removeItem("roadintel-notifications");
    localStorage.removeItem("roadintel-local-complaints-v2");

    sessionStorage.removeItem("roadintel-auth");
    sessionStorage.removeItem("roadintel-user");

    forceRoadIntelDarkTheme();

    alert("Account deleted successfully. Redirecting to login page.");
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <section
        className="overflow-hidden rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,165,164,0.20), rgba(59,130,246,0.10), hsl(var(--card)))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(14,165,164,0.14)",
                color: "#0EA5A4",
              }}
            >
              <Shield className="h-3.5 w-3.5" />
              Account Control Center
            </div>

            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Settings
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Manage your RoadIntel demo profile, notification preferences, data
              export and account actions. The interface uses a fixed RoadIntel
              dark-blue theme for a consistent audit-ready experience.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
          >
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </div>
      </section>

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

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <SettingCard
            title="Profile Information"
            description="Keep the demo operator profile realistic and consistent across the dashboard."
            icon={User}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Full Name"
                icon={User}
                value={fullName}
                onChange={setFullName}
                placeholder="Demo User"
              />

              <InputField
                label="Email"
                icon={Mail}
                value={email}
                onChange={setEmail}
                placeholder="demo@roadintel.in"
                type="email"
              />

              <InputField
                label="Mobile Number"
                icon={Phone}
                value={mobile}
                onChange={setMobile}
                placeholder="+91 98765 43210"
              />

              <InputField
                label="Location"
                icon={MapPin}
                value={location}
                onChange={setLocation}
                placeholder="Pune, Maharashtra"
              />

              <div className="md:col-span-2">
                <InputField
                  label="Role"
                  icon={Lock}
                  value={role}
                  onChange={setRole}
                  placeholder="Road Safety Analyst"
                />
              </div>
            </div>
          </SettingCard>

          <SettingCard
            title="Notification Preferences"
            description="Choose which operational alerts should appear in the RoadIntel interface."
            icon={Bell}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Toggle
                enabled={notifications.complaints}
                onChange={(value) => updateNotification("complaints", value)}
                label="Complaint Alerts"
                description="New, assigned and escalated citizen complaints."
              />

              <Toggle
                enabled={notifications.sensors}
                onChange={(value) => updateNotification("sensors", value)}
                label="Sensor Alerts"
                description="Simulated vibration, roughness and anomaly warnings."
              />

              <Toggle
                enabled={notifications.spending}
                onChange={(value) => updateNotification("spending", value)}
                label="Spending Alerts"
                description="Budget-quality mismatch and repeat-repair flags."
              />

              <Toggle
                enabled={notifications.contractors}
                onChange={(value) => updateNotification("contractors", value)}
                label="Contractor Alerts"
                description="Low accountability score or audit-risk contractors."
              />
            </div>
          </SettingCard>
        </div>

        <div className="space-y-6">
          <SettingCard
            title="Appearance"
            description="Theme controls have been removed. The app now keeps one professional dark-blue RoadIntel theme."
            icon={Shield}
          >
            <div
              className="rounded-2xl p-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14,165,164,0.12), rgba(59,130,246,0.08), hsl(var(--background)))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <p className="font-semibold">Fixed RoadIntel Dark Blue</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No dark/light toggle is shown. This avoids inconsistent page
                styling and keeps the platform presentation clean for demos.
              </p>
            </div>
          </SettingCard>

          <SettingCard
            title="Data & Account"
            description="Functional account actions. No inactive or fake buttons."
            icon={Database}
          >
            <div className="space-y-4">
              <ActionCard
                title="Download Profile Data"
                description="Export your local RoadIntel demo profile and preferences as a JSON file."
                icon={Download}
                action={
                  <button
                    type="button"
                    onClick={handleDownloadData}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                  >
                    <Download className="h-4 w-4" />
                    Download Data
                  </button>
                }
              />

              <ActionCard
                title="Reset Demo Data"
                description="Restore default demo profile details and notification preferences."
                icon={FileText}
                action={
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                  >
                    <FileText className="h-4 w-4" />
                    Reset Demo Profile
                  </button>
                }
              />

              <ActionCard
                title="Delete Demo Account"
                description="Clear demo account data from this browser and return to the login page."
                icon={Trash2}
                danger
                action={
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/25"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                }
              />
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  );
}


