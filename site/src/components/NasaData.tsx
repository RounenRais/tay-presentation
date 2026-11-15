"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import data from "@/data/nasa.json";

type Flare = { t: string; c: string; r: string };
// DONKI times are UTC: make that explicit so server and browser read the same instant
const flares = (data.flares as Flare[]).filter((f) => "CMX".includes(f.c[0])).map((f) => ({ ...f, t: f.t.endsWith("Z") ? f.t : f.t + "Z" }));
const meta = data.meta;

const CLASS = {
  C: { color: "var(--flare-c)", label: "C class · weak" },
  M: { color: "var(--flare-m)", label: "M class · strong" },
  X: { color: "var(--flare-x)", label: "X class · extreme" },
} as const;

// X-ray peak flux of a flare class: C1 = 1e-6, M1 = 1e-5, X1 = 1e-4 W/m²
function flux(c: string) {
  const base = { C: 1e-6, M: 1e-5, X: 1e-4 }[c[0] as "C" | "M" | "X"] ?? 1e-7;
  return base * (parseFloat(c.slice(1)) || 1);
}

function FlareChart() {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720, H = 300, L = 54, R = 16, T = 16, B = 34;
  const t0 = new Date(flares[0].t).getTime(), t1 = new Date(flares[flares.length - 1].t).getTime();
  // Rounded: Math.log10 can differ in the last digit between the server and the browser (hydration mismatch)
  const r2 = (v: number) => Math.round(v * 100) / 100;
  const x = (t: string) => r2(L + ((new Date(t).getTime() - t0) / (t1 - t0)) * (W - L - R));
  const y = (f: number) => r2(T + (1 - (Math.log10(f) + 6) / 3) * (H - T - B)); // 1e-6 .. 1e-3
  const counts = useMemo(() => {
    const c = { C: 0, M: 0, X: 0 };
    flares.forEach((f) => c[f.c[0] as "C" | "M" | "X"]++);
    return c;
  }, []);
  const months = useMemo(() => {
    const out: { t: string; label: string }[] = [];
    const d = new Date(t0);
    d.setUTCDate(1);
    for (let k = 0; k < 13; k++) {
      d.setUTCMonth(d.getUTCMonth() + (k === 0 ? 1 : 1));
      if (d.getTime() > t1) break;
      if (k % 2 === 0) out.push({ t: d.toISOString(), label: d.toLocaleString("en", { month: "short", timeZone: "UTC" }) });
    }
    return out;
  }, [t0, t1]);

  const h = hover !== null ? flares[hover] : null;
  return (
    <figure className="relative">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2" role="list" aria-label="Flare classes">
        {(["C", "M", "X"] as const).map((k) => (
          <span key={k} role="listitem" className="flex items-center gap-2 text-sm text-ink-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: CLASS[k].color }} />
            {CLASS[k].label} <span className="font-mono text-ink-3">{counts[k]}</span>
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img"
           aria-label={`${flares.length} solar flares from ${meta.donkiFrom} to ${meta.donkiTo}`} onMouseLeave={() => setHover(null)}>
        {[1e-6, 1e-5, 1e-4, 1e-3].map((f, k) => (
          <g key={f}>
            <line x1={L} x2={W - R} y1={y(f)} y2={y(f)} stroke="rgb(255 255 255 / 0.07)" />
            <text x={L - 8} y={y(f) + 3} textAnchor="end" className="fill-[var(--ink-3)] font-mono text-[10px]">{["C", "M", "X", "X10"][k]}</text>
          </g>
        ))}
        {months.map((m) => (
          <text key={m.t} x={x(m.t)} y={H - 10} textAnchor="middle" className="fill-[var(--ink-3)] font-mono text-[10px]">{m.label}</text>
        ))}
        {flares.map((f, k) => {
          const cls = f.c[0] as "C" | "M" | "X";
          const big = cls === "X";
          return (
            <g key={k} onMouseEnter={() => setHover(k)}>
              <circle cx={x(f.t)} cy={y(flux(f.c))} r={10} fill="transparent" />
              <circle cx={x(f.t)} cy={y(flux(f.c))} r={big ? 5 : 3.5} fill={CLASS[cls].color}
                      stroke="var(--surface)" strokeWidth={1.5} opacity={hover === null || hover === k ? 1 : 0.35} />
            </g>
          );
        })}
        {/* Direct label on the strongest flare */}
        {(() => {
          let best = 0;
          flares.forEach((f, k) => { if (flux(f.c) > flux(flares[best].c)) best = k; });
          const f = flares[best];
          return <text x={x(f.t) - 8} y={y(flux(f.c)) - 9} textAnchor="end" className="fill-[var(--ink)] font-mono text-[11px]">{f.c} · {f.t.slice(0, 10)}</text>;
        })()}
      </svg>
      {h && (
        <div className="pointer-events-none absolute rounded-xl border border-line bg-space/95 px-3 py-2 text-sm shadow-xl backdrop-blur"
             style={{ left: `${(x(h.t) / W) * 100}%`, top: `${(y(flux(h.c)) / H) * 100 + 8}%`, transform: "translate(-50%, 0)" }}>
          <p className="font-semibold text-ink">{h.c} flare</p>
          <p className="font-mono text-xs text-ink-3">{h.t.replace("T", " ").replace("Z", "")} UTC{h.r ? ` · ${h.r}` : ""}</p>
        </div>
      )}
    </figure>
  );
}

function DoseBars() {
  const rows = [
    { name: "Lunar surface", note: "LRO / CRaTER", v: meta.moonDoseMedian },
    { name: "Space station", note: "ISS DosTel", v: meta.issDoseMedian },
  ];
  const max = Math.max(...rows.map((r) => r.v));
  return (
    <div className="space-y-5">
      {rows.map((r) => (
        <div key={r.name}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-ink">{r.name} <span className="font-mono text-xs text-ink-3">{r.note}</span></span>
            <span className="font-mono text-ink">{r.v.toFixed(1)} µGy/h</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-white/[0.06]">
            <div className="h-full rounded-[4px] bg-[var(--radiation)] transition-all duration-1000" style={{ width: `${(r.v / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NasaData() {
  return (
    <section className="slide flex items-center py-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
        <p className="kicker reveal">Real NASA data</p>
        <h2 className="reveal d1 mt-4 font-display text-5xl font-bold uppercase md:text-7xl">Built on real data</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="reveal d2 rounded-3xl border border-line bg-panel/60 p-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-2xl font-semibold uppercase">DONKI · solar flares</p>
              <a href="https://ccmc.gsfc.nasa.gov/tools/DONKI/" target="_blank" rel="noreferrer" className="font-mono text-xs text-ink-3 hover:text-amber">ccmc.gsfc.nasa.gov ↗</a>
            </div>
            <p className="mt-1 text-sm text-ink-2">Every storm in the game is one of these {flares.length} real flares.</p>
            <div className="mt-5"><FlareChart /></div>
          </div>

          <div className="grid gap-6">
            <div className="reveal d3 rounded-3xl border border-line bg-panel/60 p-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-display text-2xl font-semibold uppercase">RadLab · dose</p>
                <a href="https://visualization.osdr.nasa.gov/radlab/gui/data-api/" target="_blank" rel="noreferrer" className="font-mono text-xs text-ink-3 hover:text-amber">osdr ↗</a>
              </div>
              <p className="mt-1 mb-5 text-sm text-ink-2">Sets the radiation outside the base.</p>
              <DoseBars />
            </div>
            <div className="reveal d4 grid grid-cols-[110px_1fr] items-center gap-5 rounded-3xl border border-line bg-panel/60 p-6">
              <img src="/media/earth-epic.png" alt="Earth photographed by NASA EPIC" className="h-[110px] w-[110px] drop-shadow-[0_0_30px_rgba(102,153,255,0.35)]" />
              <div>
                <p className="font-display text-2xl font-semibold uppercase">EPIC · OSDR</p>
                <p className="mt-1 text-sm text-ink-2">Our sky&apos;s Earth is a real DSCOVR photo. Crops follow NASA&apos;s Veggie studies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
