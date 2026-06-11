import type { ReactNode } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

import RootLayout from "@/components/layout/root-layout";
import AppLayout from "@/components/layout/app-layout";
import FloatingRoadIntelBot from "@/components/FloatingRoadIntelBot";
import GoogleTranslateToggle from "@/components/language/GoogleTranslateToggle";
import { OfflineSyncProvider } from "@/components/offline/OfflineSyncProvider";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Complaints from "@/pages/complaints";
import Scan from "@/pages/scan";
import Roads from "@/pages/roads";
import RoadDetail from "@/pages/road-detail";
import RiskMap from "@/pages/risk-map";
import Spending from "@/pages/spending";
import Sensors from "@/pages/sensors";
import Contractors from "@/pages/contractors";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import SOS from "@/pages/sos";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function PublicPage({ children }: { children: ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}

function PrivatePage({ children }: { children: ReactNode }) {
  const isAuthenticated =
    typeof window !== "undefined" &&
    sessionStorage.getItem("roadintel-auth") === "true";

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicPage>
          <Landing />
        </PublicPage>
      </Route>

      <Route path="/login">
        <PublicPage>
          <Login />
        </PublicPage>
      </Route>

      <Route path="/register">
        <PublicPage>
          <Register />
        </PublicPage>
      </Route>

      <Route path="/dashboard">
        <PrivatePage>
          <Dashboard />
        </PrivatePage>
      </Route>

      <Route path="/complaints">
        <PrivatePage>
          <Complaints />
        </PrivatePage>
      </Route>

      <Route path="/scan">
        <PrivatePage>
          <Scan />
        </PrivatePage>
      </Route>

      <Route path="/roads/:id">
        <PrivatePage>
          <RoadDetail />
        </PrivatePage>
      </Route>

      <Route path="/roads">
        <PrivatePage>
          <Roads />
        </PrivatePage>
      </Route>

      <Route path="/risk-map">
        <PrivatePage>
          <RiskMap />
        </PrivatePage>
      </Route>

      <Route path="/spending">
        <PrivatePage>
          <Spending />
        </PrivatePage>
      </Route>

      <Route path="/sensors">
        <PrivatePage>
          <Sensors />
        </PrivatePage>
      </Route>

      <Route path="/contractors">
        <PrivatePage>
          <Contractors />
        </PrivatePage>
      </Route>

      <Route path="/analytics">
        <PrivatePage>
          <Analytics />
        </PrivatePage>
      </Route>

      <Route path="/settings">
        <PrivatePage>
          <Settings />
        </PrivatePage>
      </Route>

      <Route path="/sos">
        <PrivatePage>
          <SOS />
        </PrivatePage>
      </Route>

      <Route path="/assistant">
        <Redirect to="/dashboard" />
      </Route>

      <Route>
        <PublicPage>
          <NotFound />
        </PublicPage>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="roadintel-theme">
        <TooltipProvider>
          <OfflineSyncProvider />

          <Router />

          <GoogleTranslateToggle />
          <FloatingRoadIntelBot />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}