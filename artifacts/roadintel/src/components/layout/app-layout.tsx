import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Radio,
  Scan,
  Settings,
  Siren,
  TrendingDown,
  UserCircle,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useListNotifications } from "@workspace/api-client-react";

type NavGroup = "citizen" | "transparency" | "emergency" | "account";
type NavBadge = "DEMO" | "SOS";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  group: NavGroup;
  badge?: NavBadge;
};

type NotificationItem = {
  id?: string | number;
  title?: string;
  message?: string;
  read?: boolean;
  severity?: "critical" | "high" | "medium" | "low" | string;
};

const TEXT_FIXES: Array<[string, string]> = [
  ["â‚¹", "₹"],
  ["â€™", "'"],
  ["â€˜", "'"],
  ["â€œ", '"'],
  ["â€�", '"'],
  ["â€“", "–"],
  ["â€”", "—"],
  ["â€¦", "…"],
  ["Â·", "·"],
  ["Â", ""],
];

function fixBrokenText(value: string) {
  let fixed = value;

  for (const [wrong, correct] of TEXT_FIXES) {
    fixed = fixed.split(wrong).join(correct);
  }

  return fixed;
}

function updateTextNode(node: Text) {
  const currentValue = node.nodeValue ?? "";
  const fixedValue = fixBrokenText(currentValue);

  if (fixedValue !== currentValue) {
    node.nodeValue = fixedValue;
  }
}

function cleanBrokenEncoding(root: ParentNode) {
  if (typeof document === "undefined") return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;

      if (!parent) return NodeFilter.FILTER_REJECT;

      const blockedTags = ["SCRIPT", "STYLE", "TEXTAREA", "INPUT"];
      if (blockedTags.includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();

  while (node) {
    updateTextNode(node as Text);
    node = walker.nextNode();
  }
}

function useGlobalTextEncodingFix() {
  useEffect(() => {
    if (typeof document === "undefined") return;

    cleanBrokenEncoding(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          updateTextNode(mutation.target as Text);
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            updateTextNode(node as Text);
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            cleanBrokenEncoding(node as Element);
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "citizen",
  },
  {
    label: "File Complaint",
    href: "/complaints",
    icon: FileText,
    group: "citizen",
  },
  {
    label: "Quick Scan",
    href: "/scan",
    icon: Scan,
    group: "citizen",
  },
  {
    label: "Road DNA",
    href: "/roads",
    icon: Map,
    group: "transparency",
  },
  {
    label: "Risk Map",
    href: "/risk-map",
    icon: TrendingDown,
    group: "transparency",
  },
  {
    label: "Public Spending",
    href: "/spending",
    icon: Wallet,
    group: "transparency",
  },
  {
    label: "Sensor Intel",
    href: "/sensors",
    icon: Radio,
    group: "transparency",
    badge: "DEMO",
  },
  {
    label: "Contractors",
    href: "/contractors",
    icon: Users,
    group: "transparency",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    group: "transparency",
  },
  {
    label: "Emergency SOS",
    href: "/sos",
    icon: Siren,
    group: "emergency",
    badge: "SOS",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    group: "account",
  },
];

const GROUPS: Array<{ key: NavGroup; label: string }> = [
  {
    key: "citizen",
    label: "Citizen Tools",
  },
  {
    key: "transparency",
    label: "Transparency Intel",
  },
  {
    key: "emergency",
    label: "Emergency",
  },
  {
    key: "account",
    label: "Account",
  },
];

const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Critical road risk",
    message: "JM Road Patch Zone requires inspection within 24 hours.",
    read: false,
    severity: "critical",
  },
  {
    id: "n-2",
    title: "Spending transparency flag",
    message: "UrbanBuild Pune Services shows budget-quality mismatch.",
    read: false,
    severity: "high",
  },
  {
    id: "n-3",
    title: "Complaint routing updated",
    message: "New complaint routed to PMC Roads Department.",
    read: true,
    severity: "medium",
  },
];

function normalizeToArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  const possibleKeys = ["notifications", "items", "data", "results", "rows", "list"];

  for (const key of possibleKeys) {
    const possibleValue = record[key];

    if (Array.isArray(possibleValue)) return possibleValue as T[];

    if (possibleValue && typeof possibleValue === "object") {
      const nested = normalizeToArray<T>(possibleValue);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function isActiveRoute(currentPath: string, href: string) {
  if (href === "/dashboard") return currentPath === "/dashboard";
  if (href === "/roads") return currentPath === "/roads" || currentPath.startsWith("/roads/");
  return currentPath === href;
}

function getSeverityColor(severity?: string) {
  if (severity === "critical") return "#DC2626";
  if (severity === "high") return "#F97316";
  if (severity === "medium") return "#F59E0B";
  if (severity === "low") return "#16A34A";
  return "#0EA5A4";
}

function getPageTitle(path: string) {
  if (path === "/dashboard") return "Dashboard";
  if (path === "/complaints") return "Complaint Routing";
  if (path === "/scan") return "Quick Scan";
  if (path === "/roads") return "Road DNA Registry";
  if (path.startsWith("/roads/")) return "Road DNA Profile";
  if (path === "/risk-map") return "Future Risk Map";
  if (path === "/spending") return "Public Spending";
  if (path === "/sensors") return "Sensor Intelligence";
  if (path === "/contractors") return "Contractor Accountability";
  if (path === "/analytics") return "Analytics";
  if (path === "/settings") return "Settings";
  if (path === "/sos") return "Emergency SOS";
  return "RoadIntel";
}

function getPageSubtitle(path: string) {
  if (path === "/dashboard") return "RoadIntel transparency dashboard.";
  if (path === "/complaints") return "Report, route, and track road issues.";
  if (path === "/scan") return "Capture road defects and create evidence-backed reports.";
  if (path === "/spending") return "Track public money against visible road quality.";
  if (path === "/contractors") return "Review repair quality, contractor history, and accountability.";
  if (path === "/risk-map") return "Prioritize future road failure zones before they become safety risks.";

  if (path === "/roads" || path.startsWith("/roads/")) {
    return "Monitor road condition, repair history, and risk signals.";
  }

  if (path === "/sensors") return "View demo sensor intelligence for road condition monitoring.";
  if (path === "/analytics") return "Connect complaints, spending, road health, and accountability.";
  if (path === "/settings") return "Manage your RoadIntel profile and account preferences.";
  if (path === "/sos") return "Access emergency road assistance and safety actions.";

  return "RoadIntel civic intelligence platform.";
}

function Badge({ badge }: { badge: NavBadge }) {
  const styles =
    badge === "SOS"
      ? {
          background: "rgba(220,38,38,0.16)",
          color: "#FCA5A5",
          border: "1px solid rgba(220,38,38,0.28)",
        }
      : {
          background: "rgba(14,165,164,0.16)",
          color: "#5EEAD4",
          border: "1px solid rgba(14,165,164,0.28)",
        };

  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
      style={styles}
    >
      {badge}
    </span>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useGlobalTextEncodingFix();

  const { data: notifications } = useListNotifications();

  const notificationList = useMemo(() => {
    const apiNotifications = normalizeToArray<NotificationItem>(notifications);
    return apiNotifications.length > 0 ? apiNotifications : FALLBACK_NOTIFICATIONS;
  }, [notifications]);

  const unreadCount = notificationList.filter(
    (notification) => notification.read !== true
  ).length;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!notificationsOpen) return;

      const target = event.target as Node;

      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [notificationsOpen]);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("roadintel-auth");
    sessionStorage.removeItem("roadintel-user");
    navigate("/login");
  }

  return (
    <div
      className="flex h-screen overflow-hidden text-foreground"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(14,165,164,0.10), transparent 32%), radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 30%), hsl(var(--background))",
      }}
    >
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(7,17,31,0.96)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-5"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg shadow-cyan-500/20">
              <img
                src="/roadintel-logo.png"
                alt="RoadIntel Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <div
                className="text-lg font-bold text-white"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                RoadIntel
              </div>
              <div className="text-xs text-slate-400">
                Civic Road Intelligence
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {GROUPS.map((group) => {
            const groupItems = NAV_ITEMS.filter((item) => item.group === group.key);

            return (
              <div key={group.key} className="mb-6">
                <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {group.label}
                </div>

                <div className="space-y-1">
                  {groupItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveRoute(location, item.href);

                    return (
                      <Link key={item.href} href={item.href}>
                        <button
                          type="button"
                          onClick={closeSidebar}
                          className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition"
                          style={{
                            background: active ? "rgba(59,130,246,0.18)" : "transparent",
                            color: active ? "#60A5FA" : "#E5E7EB",
                            border: active
                              ? "1px solid rgba(59,130,246,0.28)"
                              : "1px solid transparent",
                          }}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Icon
                              className="h-4 w-4 shrink-0"
                              style={{ color: active ? "#60A5FA" : "#CBD5E1" }}
                            />
                            <span className="truncate">{item.label}</span>
                          </span>

                          <span className="flex items-center gap-2">
                            {item.badge && <Badge badge={item.badge} />}
                            {active && <ChevronRight className="h-4 w-4" />}
                          </span>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="border-t p-4"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="mb-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Activity className="h-4 w-4" />
              Audit-safe demo
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Pilot data · Pune / PCMC · transparency-first
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-red-500/15 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-30 border-b backdrop-blur-xl"
          style={{
            background: "rgba(7,17,31,0.82)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-2xl bg-white/[0.06] p-2.5 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h1
                  className="truncate text-lg font-bold text-white sm:text-xl"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {getPageTitle(location)}
                </h1>
                <p className="hidden text-sm text-slate-400 sm:block">
                  {getPageSubtitle(location)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/sos">
                <button className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:scale-[1.02]">
                  SOS
                </button>
              </Link>

              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((current) => !current)}
                  className="relative rounded-2xl bg-white/[0.06] p-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Open notifications"
                >
                  <Bell className="h-5 w-5" />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div
                    className="absolute right-0 top-14 z-50 w-[320px] overflow-hidden rounded-3xl border shadow-2xl"
                    style={{
                      background: "rgba(15,23,42,0.98)",
                      borderColor: "rgba(255,255,255,0.10)",
                    }}
                  >
                    <div className="border-b border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-white">Notifications</h2>
                        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-bold text-red-300">
                          {unreadCount} new
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        RoadIntel transparency alerts
                      </p>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto p-2">
                      {notificationList.map((notification, index) => {
                        const color = getSeverityColor(notification.severity);

                        return (
                          <div
                            key={notification.id ?? index}
                            className="rounded-2xl p-3 transition hover:bg-white/[0.05]"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ background: color }}
                              />
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {notification.title ?? "RoadIntel alert"}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                  {notification.message ??
                                    "A transparency or road-risk update is available."}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/10 p-3">
                      <Link href="/analytics">
                        <button
                          type="button"
                          onClick={() => setNotificationsOpen(false)}
                          className="w-full rounded-2xl bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                        >
                          View Analytics
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/settings">
                <button
                  className="rounded-2xl bg-blue-500 p-3 text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
                  aria-label="Open settings"
                >
                  <UserCircle className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}