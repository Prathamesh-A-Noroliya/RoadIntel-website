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
  Bot,
  CreditCard,
  Globe
} from "lucide-react";
import { useListNotifications } from "@workspace/api-client-react";
import { ChatbotPanel } from "@/components/chatbot-panel";

type NavGroup = "main" | "intel" | "emergency" | "account";
type NavBadge = "LIVE" | "AI" | "SOS";

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
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "main" },
  { label: "File Complaint", href: "/complaints", icon: FileText, group: "main" },
  { label: "Quick Scan", href: "/scan", icon: Scan, group: "main" },
  { label: "AI Assistant", href: "/assistant", icon: Bot, group: "main", badge: "AI" },

  { label: "Road DNA", href: "/roads", icon: Map, group: "intel" },
  { label: "Risk Map", href: "/risk-map", icon: TrendingDown, group: "intel" },
  { label: "Public Spending", href: "/spending", icon: Wallet, group: "intel" },
  { label: "Sensor Intel", href: "/sensors", icon: Radio, group: "intel", badge: "LIVE" },
  { label: "Contractors", href: "/contractors", icon: Users, group: "intel" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "intel" },

  { label: "Emergency SOS", href: "/sos", icon: Siren, group: "emergency", badge: "SOS" },

  { label: "Subscribe", href: "/subscribe", icon: CreditCard, group: "account" },
  { label: "Settings", href: "/settings", icon: Settings, group: "account" }
];

const BADGE_COLORS: Record<NavBadge, { bg: string; color: string }> = {
  LIVE: { bg: "rgba(22,163,74,0.2)", color: "#16A34A" },
  AI: { bg: "rgba(124,58,237,0.2)", color: "#7C3AED" },
  SOS: { bg: "rgba(229,57,53,0.2)", color: "#E53935" }
};

const GROUPS: Array<{ key: NavGroup; label: string }> = [
  { key: "main", label: "Navigation" },
  { key: "intel", label: "Intelligence" },
  { key: "emergency", label: "Emergency" },
  { key: "account", label: "Account" }
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

export default function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const { data: notifications } = useListNotifications();

  const notificationList = useMemo(() => {
    return normalizeToArray<NotificationItem>(notifications);
  }, [notifications]);

  const unreadCount = notificationList.filter((notification) => {
    return notification?.read !== true;
  }).length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "hsl(var(--sidebar))",
          borderRight: "1px solid hsl(var(--sidebar-border))"
        }}
      >
        <div
          className="flex items-center gap-3 border-b px-5 py-5"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "hsl(var(--sidebar-primary))" }}
          >
            <Shield
              className="h-4 w-4"
              style={{ color: "hsl(var(--sidebar-primary-foreground))" }}
            />
          </div>

          <div>
            <div
              className="text-sm font-bold"
              style={{
                fontFamily: "Sora, sans-serif",
                color: "hsl(var(--sidebar-foreground))"
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

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
          {GROUPS.map((group) => {
            const items = navItems.filter((item) => item.group === group.key);

            return (
              <div key={group.key}>
                <div
                  className="px-2 py-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {group.label}
                </div>

                <div className="mt-1 space-y-0.5">
                  {items.map(({ label, href, icon: Icon, badge }) => {
                    const active = location === href;
                    const badgeStyle = badge ? BADGE_COLORS[badge] : null;

                    return (
                      <Link key={href} href={href}>
                        <div
                          className="sidebar-item"
                          style={
                            active
                              ? {
                                  background: "hsl(var(--sidebar-primary) / 0.15)",
                                  color: "hsl(var(--sidebar-primary))",
                                  borderLeft: "3px solid hsl(var(--sidebar-primary))"
                                }
                              : {}
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
                              className="ml-auto rounded-full px-1.5 py-0.5 text-xs font-semibold"
                              style={{
                                background: badgeStyle.bg,
                                color: badgeStyle.color
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
          className="border-t px-4 py-2"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <Globe className="h-3 w-3" />
            <span>Language: EN</span>

            <Link href="/settings">
              <span className="ml-auto cursor-pointer underline hover:opacity-70">
                Change
              </span>
            </Link>
          </div>
        </div>

        <div
          className="space-y-1 border-t px-4 py-3"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <Activity className="h-3 w-3" style={{ color: "#16A34A" }} />
            <span>All systems operational</span>
          </div>

          <div
            className="text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Demo Mode — Apr 2025
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className="flex shrink-0 items-center gap-4 border-b px-4 py-3"
          style={{
            borderColor: "hsl(var(--border))",
            background: "hsl(var(--card))"
          }}
        >
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <div className="text-xs text-muted-foreground">
              Welcome back, Demo User
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/sos">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #E53935, #B71C1C)" }}
              >
                <Siren className="h-3.5 w-3.5" />
                SOS
              </button>
            </Link>

            <div className="relative">
              <Link href="/dashboard">
                <button
                  type="button"
                  className="relative rounded-lg p-2 hover:bg-muted"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />

                  {unreadCount > 0 && (
                    <span
                      className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white"
                      style={{ background: "#DC2626" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: "hsl(var(--sidebar-primary))" }}
            >
              D
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {!chatOpen && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="pulse-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
          style={{ background: "hsl(var(--sidebar-primary))" }}
          title="AI Assistant"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-6 w-6 text-white" />
        </button>
      )}

      {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}