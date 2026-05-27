import React from "react";

type Contractor = {
  id: string;
  name: string;
  zone: string;
  projects: number;
  score: number;
  status: "Excellent" | "Good" | "Needs Review";
  budget: string;
};

const contractors: Contractor[] = [
  {
    id: "CON-221",
    name: "Shivneri Infra Works",
    zone: "Pune West",
    projects: 18,
    score: 94,
    status: "Excellent",
    budget: "₹12.4 Cr",
  },
  {
    id: "CON-222",
    name: "Maharashtra RoadBuild Ltd.",
    zone: "Mumbai Urban",
    projects: 25,
    score: 88,
    status: "Good",
    budget: "₹19.8 Cr",
  },
  {
    id: "CON-223",
    name: "Nashik Civil Solutions",
    zone: "Nashik Corridor",
    projects: 11,
    score: 72,
    status: "Needs Review",
    budget: "₹7.6 Cr",
  },
  {
    id: "CON-224",
    name: "Vidarbha Highway Services",
    zone: "Nagpur East",
    projects: 14,
    score: 84,
    status: "Good",
    budget: "₹10.2 Cr",
  },
];

const statusClass: Record<Contractor["status"], string> = {
  Excellent: "bg-green-500/15 text-green-300 border-green-500/30",
  Good: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "Needs Review": "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
};

export default function Contractors() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/30">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            RoadIntel Delivery Oversight
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            Contractor Performance Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Monitor road maintenance vendors using project completion,
            complaint recurrence, budget utilization, and safety-risk impact.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Stat title="Registered Contractors" value="64" />
          <Stat title="Active Projects" value="128" />
          <Stat title="Avg. Performance" value="86%" />
          <Stat title="Under Review" value="7" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">Contractor Scorecard</h2>
            <p className="text-sm text-slate-400">
              Ranked using delivery speed, quality, safety impact, and issue recurrence.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {contractors.map((contractor) => (
              <article
                key={contractor.id}
                className="rounded-3xl border border-white/10 bg-slate-800/60 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm text-cyan-300">
                      {contractor.id}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">
                      {contractor.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Zone: {contractor.zone}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[contractor.status]}`}
                  >
                    {contractor.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Projects" value={String(contractor.projects)} />
                  <MiniStat label="Budget" value={contractor.budget} />
                  <MiniStat label="Score" value={`${contractor.score}%`} />
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Performance Index</span>
                    <span className="font-semibold">{contractor.score}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${contractor.score}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-cyan-300">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}