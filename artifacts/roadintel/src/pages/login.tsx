import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("demo@roadintel.in");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (cleanEmail === "demo@roadintel.in" && password === "demo123") {
      localStorage.setItem("roadintel-auth", "true");
      localStorage.setItem(
        "roadintel-user",
        JSON.stringify({
          name: "Demo User",
          email: cleanEmail,
          role: "Road Safety Analyst",
        }),
      );

      navigate("/dashboard");
      return;
    }

    setError("Invalid login. Use demo@roadintel.in and demo123.");
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
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
              <div className="text-sm text-slate-400">v2.5.0 LIVE</div>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Smart Road Safety Intelligence
            </div>

            <h1
              className="text-5xl font-bold leading-tight"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Monitor roads, complaints, budgets, and risk in one dashboard.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              RoadIntel helps teams track road conditions, predict failure
              zones, monitor contractors, and improve public road safety using
              smart data workflows.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-cyan-300">847</div>
                <div className="mt-1 text-xs text-slate-400">Sensors</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-emerald-300">8</div>
                <div className="mt-1 text-xs text-slate-400">Road DNA</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-orange-300">24/7</div>
                <div className="mt-1 text-xs text-slate-400">Monitoring</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm text-slate-500">
            Demo Mode — Apr 2025
          </div>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500">
                <Shield className="h-5 w-5 text-white" />
              </div>

              <div>
                <div className="text-lg font-bold">RoadIntel</div>
                <div className="text-xs text-slate-400">v2.5.0 LIVE</div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#101c31] p-6 shadow-2xl sm:p-8">
              <div className="mb-8">
                <h2
                  className="text-3xl font-bold"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Login to continue to your RoadIntel dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="demo@roadintel.in"
                      className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-11 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="demo123"
                      className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-11 py-3.5 pr-12 text-sm text-white outline-none transition focus:border-cyan-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-400">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-white/10 accent-cyan-500"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-cyan-300 hover:text-cyan-200"
                    onClick={() =>
                      setError("Password reset is disabled in demo mode.")
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
                >
                  Login to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                <div className="font-semibold">Demo login</div>
                <div className="mt-1 text-cyan-200/80">
                  Email: demo@roadintel.in
                </div>
                <div className="text-cyan-200/80">Password: demo123</div>
              </div>

              <p className="mt-6 text-center text-sm text-slate-400">
                New user?{" "}
                <Link href="/register">
                  <span className="cursor-pointer font-semibold text-cyan-300 hover:text-cyan-200">
                    Create account
                  </span>
                </Link>
              </p>
            </div>

            <div className="mt-5 text-center">
              <Link href="/">
                <span className="cursor-pointer text-sm text-slate-500 hover:text-slate-300">
                  Back to landing page
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}