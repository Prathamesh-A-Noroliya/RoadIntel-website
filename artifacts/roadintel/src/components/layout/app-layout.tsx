import { useMemo, useState, type ElementType, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Scan,
  Map,
  TrendingDown,
  Wallet,
  Radio,
  Users,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  Shield,
  Activity,
  Siren,
  CreditCard,
  Globe,
  UserCircle,
} from "lucide-react";
import { useListNotifications } from "@workspace/api-client-react";

type NavGroup = "main" | "intel" | "emergency" | "account";
type NavBadge = "LIVE" | "SOS";

type NavItem = {
  label: string;
  href: string;
  icon: ElementType;
  group: NavGroup;
  badge?: NavBadge;
};

type NotificationItem = {
  id?: string | number;
  title?: string;
  message?: string;
  read?: boolean;
  severity?: string;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "main",
  },
  {
    label: "File Complaint",
    href: "/complaints",
    icon: FileText,
    group: "main",
  },
  {
    label: "Quick Scan",
    href: "/scan",
    icon: Scan,
    group: "main",
  },

  {
    label: "Road DNA",
    href: "/roads",
    icon: Map,
    group: "intel",
  },
  {
    label: "Risk Map",
    href: "/risk-map",
    icon: TrendingDown,
    group: "intel",
  },
  {
    label: "Public Spending",
    href: "/spending",
    icon: Wallet,
    group: "intel",
  },
  {
    label: "Sensor Intel",
    href: "/sensors",
    icon: Radio,
    group: "intel",
    badge: "LIVE",
  },
  {
    label: "Contractors",
    href: "/contractors",
    icon: Users,
    group: "intel",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    group: "intel",
  },

  {
    label: "Emergency SOS",
    href: "/sos",
    icon: Siren,
    group: "emergency",
    badge: "SOS",
  },

  {
    label: "Subscribe",
    href: "/subscribe",
    icon: CreditCard,
    group: "account",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    group: "account",
  },
];

const BADGE_COLORS: Record<NavBadge, { bg: string; color: string }> = {
  LIVE: {
    bg: "rgba(22,163,74,0.2)",
    color: "#16A34A",
  },
  SOS: {
    bg: "rgba(229,57,53,0.2)",
    color: "#E53935",
  },
};

const GROUPS: Array<{ key: NavGroup; label: string }> = [
  {
    key: "main",
    label: "Navigation",
  },
  {
    key: "intel",
    label: "Intelligence",
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

function normalizeToArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const possibleKeys = ["notifications", "items", "data", "results", "rows", "list"];

  for (const key of possibleKeys) {
    const possibleValue = record[key];

    if (Array.isArray(possibleValue)) {
      return possibleValue as T[];
    }

    if (possibleValue && typeof possibleValue === "object") {
      const nestedArray = normalizeToArray<T>(possibleValue);

      if (nestedArray.length > 0) {
        return nestedArray;
      }
    }
  }

  return [];
}

function isActiveRoute(currentPath: string, href: string) {
  if (href === "/dashboard") {
    return currentPath === "/dashboard";
  }

  if (href === "/roads") {
    return currentPath === "/roads" || currentPath.startsWith("/roads/");
  }

  return currentPath === href;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: notifications } = useListNotifications();

  const notificationList = useMemo(() => {
    return normalizeToArray<NotificationItem>(notifications);
  }, [notifications]);

  const unreadCount = notificationList.filter((notification) => {
    return notification?.read !== true;
  }).length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "hsl(var(--sidebar))",
          borderRight: "1px solid hsl(var(--sidebar-border))",
        }}
      >
        <div
          className="flex items-center gap-3 border-b px-5 py-5"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: "hsl(var(--sidebar-primary))" }}
          >
            <Shield
              className="h-5 w-5"
              style={{ color: "hsl(var(--sidebar-primary-foreground))" }}
            />
          </div>

          <div>
            <div
              className="text-base font-bold"
              style={{
                fontFamily: "Sora, sans-serif",
                color: "hsl(var(--sidebar-foreground))",
              }}
            >
              RoadIntel
            </div>

            <div
              className="text-xs"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              v2.5.0 LIVE
            </div>
          </div>

          <button
            type="button"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ color: "hsl(var(--sidebar-foreground))" }}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {GROUPS.map((group) => {
            const items = navItems.filter((item) => item.group === group.key);

            if (items.length === 0) {
              return null;
            }

            return (
              <div key={group.key}>
                <div
                  className="px-2 py-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {group.label}
                </div>

                <div className="mt-1 space-y-1">
                  {items.map(({ label, href, icon: Icon, badge }) => {
                    const active = isActiveRoute(location, href);
                    const badgeStyle = badge ? BADGE_COLORS[badge] : null;

                    return (
                      <Link key={href} href={href}>
                        <div
                          className="sidebar-item flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors"
                          style={
                            active
                              ? {
                                  background: "hsl(var(--sidebar-primary) / 0.15)",
                                  color: "hsl(var(--sidebar-primary))",
                                  borderLeft: "3px solid hsl(var(--sidebar-primary))",
                                }
                              : {
                                  color: "hsl(var(--sidebar-foreground))",
                                }
                          }
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon
                            className="h-4 w-4 shrink-0"
                            style={
                              label === "Emergency SOS"
                                ? { color: active ? undefined : "#E53935" }
                                : {}
                            }
                          />

                          <span>{label}</span>

                          {active && !badge && (
                            <ChevronRight className="ml-auto h-3 w-3" />
                          )}

                          {badge && badgeStyle && (
                            <span
                              className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold"
                              style={{
                                background: badgeStyle.bg,
                                color: badgeStyle.color,
                              }}
                            >
                              {badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div
          className="border-t px-4 py-3"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <Globe className="h-3 w-3" />
            <span>Language: EN</span>
            <Link href="/settings">
              <span className="ml-auto cursor-pointer underline">Change</span>
            </Link>
          </div>
        </div>

        <div
          className="border-t px-4 py-3"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Activity className="h-3 w-3" />
            <span>All systems operational</span>
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            Demo Mode — Apr 2025
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-16 shrink-0 items-center gap-4 border-b px-4 sm:px-6"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm text-muted-foreground">
              Welcome back, Demo User
            </div>
          </div>

          <Link href="/sos">
            <button
              type="button"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-white sm:inline-flex"
              style={{ background: "#E53935" }}
            >
              SOS
            </button>
          </Link>

          <div className="relative">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "hsl(var(--muted))" }}
              onClick={() => setNotificationsOpen((current) => !current)}
              aria-label="Notifications"
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
                className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div
                  className="border-b px-4 py-3 text-sm font-bold"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  Notifications
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notificationList.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No notifications available.
                    </div>
                  ) : (
                    notificationList.slice(0, 8).map((notification, index) => (
                      <div
                        key={notification.id ?? index}
                        className="border-b px-4 py-3"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <div className="text-sm font-semibold">
                          {notification.title ?? "RoadIntel Alert"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {notification.message ?? "System update available."}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/settings">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ background: "hsl(var(--sidebar-primary))" }}
              aria-label="Profile settings"
            >
              <UserCircle className="h-5 w-5" />
            </button>
          </Link>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}