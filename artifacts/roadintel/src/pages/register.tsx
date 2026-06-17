import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    age: "",
    email: "",
    password: "",
    state: "",
    userType: "citizen",
  });

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
  };

  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.7)",
  };

  function handleCreateAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    sessionStorage.setItem("roadintel-auth", "true");
    sessionStorage.setItem(
      "roadintel-user",
      JSON.stringify({
        name: form.fullName || "RoadIntel User",
        mobile: form.mobile,
        email: form.email,
        location: form.state,
        role: form.userType,
      })
    );

    navigate("/dashboard");
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      style={{ background: "#0F172A" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(14,165,164,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-lg">
        <form
          onSubmit={handleCreateAccount}
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "#0EA5A4" }}
            >
              <Shield className="h-4 w-4 text-white" />
            </div>

            <span
              className="font-bold text-white"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              RoadIntel
            </span>
          </div>

          <h1
            className="mb-1 text-2xl font-bold text-white"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Create Account
          </h1>

          <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Join the road accountability platform.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium" style={labelStyle}>
                Full Name
              </label>
              <input
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Ramesh Kumar"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={labelStyle}>
                Mobile Number
              </label>
              <input
                value={form.mobile}
                onChange={set("mobile")}
                placeholder="+91 9876543210"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={labelStyle}>
                Age
              </label>
              <input
                type="number"
                value={form.age}
                onChange={set("age")}
                placeholder="28"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium" style={labelStyle}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium" style={labelStyle}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="Create password"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={labelStyle}>
                State / Region
              </label>
              <select
                value={form.state}
                onChange={set("state")}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Kerala">Kerala</option>
                <option value="Punjab">Punjab</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={labelStyle}>
                User Type
              </label>
              <select
                value={form.userType}
                onChange={set("userType")}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputStyle}
              >
                <option value="citizen">Citizen</option>
                <option value="authority">Government Authority</option>
                <option value="journalist">Journalist</option>
                <option value="researcher">Researcher</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: "#0EA5A4" }}
          >
            Create Account
          </button>

          <p
            className="mt-4 text-center text-sm"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Already have an account?{" "}
            <Link href="/login">
              <span className="cursor-pointer" style={{ color: "#0EA5A4" }}>
                Sign in
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
