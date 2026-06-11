import { useState } from "react";
import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", mobile: "", age: "", email: "", password: "", language: "en", state: "", userType: "citizen" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white" };
  const labelStyle: React.CSSProperties = { color: "rgba(255,255,255,0.7)" };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0F172A" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(14,165,164,0.06) 0%, transparent 60%)" }} />
      <div className="relative w-full max-w-lg">
        <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#0EA5A4" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily: "Sora, sans-serif" }}>RoadIntel</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Sora, sans-serif" }}>Create Account</h1>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Join the road accountability platform.</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Full Name</label>
              <input value={form.fullName} onChange={set("fullName")} placeholder="Ramesh Kumar" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Mobile Number</label>
              <input value={form.mobile} onChange={set("mobile")} placeholder="+91 9876543210" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Age</label>
              <input type="number" value={form.age} onChange={set("age")} placeholder="28" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Email Address</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Password</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="Create password" className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>State/Region</label>
              <select value={form.state} onChange={set("state")} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="">Select State</option>
                {["Maharashtra","Karnataka","Delhi","Tamil Nadu","Telangana","Gujarat","Rajasthan","West Bengal","Kerala","Punjab"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>User Type</label>
              <select value={form.userType} onChange={set("userType")} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="citizen">Citizen</option>
                <option value="authority">Government Authority</option>
                <option value="journalist">Journalist</option>
                <option value="researcher">Researcher</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Language</label>
              <select value={form.language} onChange={set("language")} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                <option value="kn">Kannada</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
          </div>

          <Link href="/dashboard">
            <button className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-6" style={{ background: "#0EA5A4" }}>
              Create Account
            </button>
          </Link>
          <p className="text-center text-sm mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            Already have an account?{" "}
            <Link href="/login"><span className="cursor-pointer" style={{ color: "#0EA5A4" }}>Sign in</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
