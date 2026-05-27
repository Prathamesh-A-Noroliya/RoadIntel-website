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
    link.click();

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
        style={{ background: value ? "#0EA5A4" : "hsl(var(--muted))