import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

const DEMO_EMAIL = "demo@roadintel.in";
const DEMO_PASSWORD = "RoadIntel@2026";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (cleanEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem("roadintel-auth", "true");
      sessionStorage.setItem("roadintel-user", JSON.stringify({
        name: "Demo User", email: cleanEmail, role: "Road Safety Analyst",
      }));
      setLoginSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1600);
      return;
    }
    setError("Invalid credentials. Click 'Use demo credentials' below.");
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      {/* ===== WELCOME OVERLAY ===== */}
      {loginSuccess && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "rgba(7,17,31,0.97)", animation: "welcomeFadeInOut 1.6s ease forwards" }}>
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl shadow-cyan-500/40">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
            Welcome to RoadIntel
          </h1>
          <p className="mt-2 text-lg text-cyan-300">Loading your civic dashboard...</p>
        </div>
      )}

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-[#0b1628] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-cyan-500 blur-[120px]" />
            <div className="absolute bottom-[-100px] right-[-100px] h-96 w-96 rounded-full bg-blue-600 blur-[140px]" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">RoadIntel</div>
              <div className="text-sm text-slate-400">v3.0 Civic Intelligence</div>
            </div>
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              India's Civic Road Intelligence Platform
            </div>
            <h1 className="text-5xl font-bold leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>
              Monitor roads, verify repairs, track spending — one dashboard.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              RoadIntel helps civic teams track road conditions, predict failure zones,
              score contractors, and drive public accountability using smart data workflows.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-cyan-300">8</div>
                <div className="mt-1 text-xs text-slate-400">Pilot Roads</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-emerald-300">220+</div>
                <div className="mt-1 text-xs text-slate-400">Complaints</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-orange-300">24/7</div>
                <div className="mt-1 text-xs text-slate-400">Monitoring</div>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-sm text-slate-500">Live Demo — June 2026</div>
        </section>

        {/* RIGHT: LOGIN FORM */}
        <section className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="rounded-[28px] border border-white/10 bg-[#101c31] p-6 shadow-2xl sm:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Welcome back</h2>
                <p className="mt-2 text-sm text-slate-400">Login to continue to your RoadIntel dashboard.</p>
              </div>
              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-11 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-11 py-3.5 pr-12 text-sm text-white outline-none transition focus:border-cyan-400" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]">
                  Login to Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-5 text-center">
                <button type="button" onClick={() => setShowHint(v => !v)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                  {showHint ? "Hide demo credentials" : "Use demo credentials"}
                </button>
                {showHint && (
                  <div className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-left">
                    <div className="font-semibold text-cyan-200">Demo Login</div>
                    <div className="mt-1 text-cyan-200/80 font-mono text-xs">{DEMO_EMAIL}</div>
                    <div className="text-cyan-200/80 font-mono text-xs">{DEMO_PASSWORD}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
