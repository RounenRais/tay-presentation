"use client";

import { useMemo, useState } from "react";

const stats = [
  { icon: "health", name: "Health", color: "var(--health)", text: "Your last line" },
  { icon: "oxygen", name: "Oxygen", color: "var(--oxygen)", text: "Drains with distance" },
  { icon: "food", name: "Food", color: "var(--food)", text: "Greenhouse crops" },
  { icon: "water", name: "Water", color: "var(--water)", text: "From crater ice" },
  { icon: "warmth", name: "Warmth", color: "var(--warmth)", text: "Lost in the shade" },
  { icon: "radiation", name: "Radiation", color: "var(--radiation)", text: "Real lunar dose" },
];

// The game's oxygen model (SurvivalStats.cs)
const BASE = 0.35, PER_KM = 0.9, DEEP = 650, DEEP_FACTOR = 3;
function drain(d: number, sprint: boolean, rover: boolean) {
  if (rover) return 0.05;
  let r = BASE + (PER_KM * d) / 1000;
  if (sprint) r *= 1.4;
  if (d > DEEP) r *= DEEP_FACTOR;
  return r;
}

export default function Survival() {
  const [d, setD] = useState(420);
  const [tank, setTank] = useState(false);
  const [sprint, setSprint] = useState(false);
  const [rover, setRover] = useState(false);

  const cap = tank ? 160 : 100;
  const rate = drain(d, sprint, rover);
  const seconds = cap / rate;
  // Round trip: out and back at walking speed 8 (sprint 40, rover 32) with the drain of every step on the way
  const speed = rover ? 32 : sprint ? 40 : 8;
  const needed = useMemo(() => {
    let o = 0;
    for (let x = 0; x < d; x += 5) o += (2 * 5 / speed) * drain(x, sprint, rover);
    return o;
  }, [d, sprint, rover, speed]);
  const ok = needed <= cap * 0.95;

  // Drain curve 0..1300 m (one series: no legend, the title names it)
  const W = 520, H = 200, P = 34;
  const max = drain(1300, true, false);
  const pts = Array.from({ length: 131 }, (_, k) => {
    const x = k * 10;
    return [P + (x / 1300) * (W - P * 2), H - P - (drain(x, sprint, false) / max) * (H - P * 2)];
  });
  const mx = P + (d / 1300) * (W - P * 2), my = H - P - (rate / max) * (H - P * 2);

  return (
    <section className="slide flex items-center py-16">
      <div className="stars absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
        <p className="kicker reveal">Survival</p>
        <h2 className="reveal d1 mt-4 font-display text-5xl font-bold uppercase md:text-7xl">Every breath counts</h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, k) => (
            <div key={s.name} className={`reveal d${Math.min(4, Math.floor(k / 2) + 1)} rounded-2xl border border-line bg-panel/60 p-4`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${s.color} 16%, transparent)` }}>
                <span className="block h-6 w-6" style={{ backgroundColor: s.color, mask: `url(/media/icons/${s.icon}.png) center/contain no-repeat`, WebkitMask: `url(/media/icons/${s.icon}.png) center/contain no-repeat` }} />
              </div>
              <p className="mt-3 font-display text-xl font-semibold uppercase">{s.name}</p>
              <p className="mt-1 text-sm text-ink-3">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Oxygen simulator */}
        <div className="reveal d3 mt-8 grid gap-8 rounded-3xl border border-line bg-gradient-to-br from-panel to-surface p-6 md:grid-cols-[1fr_1.1fr] md:p-8">
          <div>
            <p className="font-display text-2xl font-semibold uppercase">How far can you go?</p>
            <label className="mt-6 block">
              <span className="flex justify-between font-mono text-xs uppercase tracking-widest text-ink-3">
                <span>Distance from base</span><span className="text-ink">{d} m</span>
              </span>
              <input type="range" min={0} max={1300} step={10} value={d} onChange={(e) => setD(+e.target.value)}
                     className="mt-3 w-full accent-[var(--amber)]" aria-label="Distance from base" />
            </label>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { on: tank, set: setTank, label: "Extended O₂ tank" },
                { on: sprint, set: setSprint, label: "Sprinting" },
                { on: rover, set: setRover, label: "In the rover" },
              ].map((t) => (
                <button key={t.label} onClick={() => t.set(!t.on)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${t.on ? "border-oxygen bg-oxygen/15 text-oxygen" : "border-line text-ink-3 hover:text-ink"}`}>
                  {t.on ? "✓ " : ""}{t.label}
                </button>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-3">Air left at this spot</p>
                <p className="mt-1 font-display text-5xl font-bold tabular-nums">{Math.floor(seconds / 60)}:{String(Math.floor(seconds % 60)).padStart(2, "0")}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-3">There and back</p>
                <p className={`mt-1 font-display text-5xl font-bold ${ok ? "text-[var(--stamina)]" : "text-[var(--health)]"}`}>{ok ? "Safe" : "Lost"}</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (needed / cap) * 100)}%`, background: ok ? "var(--oxygen)" : "var(--health)" }} />
            </div>
            <p className="mt-2 text-sm text-ink-3">{Math.round(needed)} of {cap} oxygen needed for the round trip{d > DEEP && !rover ? " · deep zone: 3× drain" : ""}</p>
          </div>

          <figure>
            <figcaption className="font-mono text-xs uppercase tracking-widest text-ink-3">Oxygen drain per second by distance{sprint ? " · sprinting" : ""}</figcaption>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="Oxygen drain grows with distance and triples past 650 m">
              <rect x={P + (DEEP / 1300) * (W - P * 2)} y={P / 2} width={(W - P) - (P + (DEEP / 1300) * (W - P * 2))} height={H - P * 1.5} fill="rgb(242 107 115 / 0.07)" />
              <text x={P + (DEEP / 1300) * (W - P * 2) + 8} y={P / 2 + 14} className="fill-[var(--ink-3)] font-mono text-[10px]">DEEP ZONE · ROVER ONLY</text>
              {[0, 650, 1300].map((x) => (
                <text key={x} x={P + (x / 1300) * (W - P * 2)} y={H - 10} textAnchor="middle" className="fill-[var(--ink-3)] font-mono text-[10px]">{x} m</text>
              ))}
              <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="rgb(255 255 255 / 0.12)" />
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--oxygen)" strokeWidth={2} strokeLinejoin="round" />
              <line x1={mx} x2={mx} y1={P / 2} y2={H - P} stroke="rgb(255 255 255 / 0.25)" strokeDasharray="3 3" />
              {!rover && <circle cx={mx} cy={my} r={6} fill="var(--oxygen)" stroke="var(--surface)" strokeWidth={2} />}
              <text x={mx + 10} y={Math.max(P, my - 10)} className="fill-[var(--ink)] font-mono text-[11px]">{rate.toFixed(2)}/s</text>
            </svg>
          </figure>
        </div>
      </div>
    </section>
  );
}
