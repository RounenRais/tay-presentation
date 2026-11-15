"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

const chapters = [
  { day: "Day 1", title: "Launch", img: "/media/earth-epic.png", text: "Our crew of three leaves Earth for the Moon.", note: "Real Earth photo · NASA EPIC / DSCOVR" },
  { day: "Day 3", title: "Lunar orbit", img: "/media/ship.png", text: "We reach lunar orbit and aim for the south pole." },
  { day: "Day 4", title: "Descent", img: "/media/moon.png", text: "Landing burn. The main engine starts to shake." },
  { day: "Day 4", title: "Engine failure", img: "/media/ship.png", text: "The engine dies. We crash far from the landing site.", alarm: true },
  { day: "Day 5", title: "The crash site", img: "/media/base.png", text: "The base module survived - but air and food won't last." },
  { day: "Goal", title: "The way home", img: "/media/rover.png", text: "Salvage, build a rover, repair the ship, fly home." },
];

export default function Story() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setI((v) => (v + 1) % chapters.length), 4500);
    return () => clearInterval(t);
  }, [auto]);

  const c = chapters[i];
  return (
    <section className="slide flex items-center">
      <div className="stars absolute inset-0 opacity-40" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-[1.15fr_1fr] md:px-12">
        <div className="reveal relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-[radial-gradient(ellipse_at_center,#1a1f2b,#06070b_70%)]">
          {chapters.map((ch, k) => (
            <img key={k} src={ch.img} alt={ch.title}
                 className={`absolute inset-0 m-auto max-h-[82%] max-w-[82%] object-contain transition-all duration-700 ${k === i ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                 style={ch.alarm ? { filter: "sepia(1) saturate(4) hue-rotate(-30deg) brightness(0.9)", transform: k === i ? "rotate(-12deg)" : undefined } : undefined} />
          ))}
          {c.alarm && <div className="absolute inset-0 animate-pulse bg-red-600/10" />}
          {c.note && <p className="absolute bottom-4 left-5 font-mono text-[11px] uppercase tracking-widest text-ink-3">{c.note}</p>}
          <p className="absolute right-5 top-4 font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")} / 06</p>
        </div>

        <div>
          <p className="kicker reveal">The journey</p>
          <h2 className="reveal d1 mt-4 font-display text-5xl font-bold uppercase md:text-7xl">How we got stranded</h2>
          <ol className="reveal d2 mt-10 space-y-1">
            {chapters.map((ch, k) => (
              <li key={k}>
                <button onClick={() => { setI(k); setAuto(false); }}
                        className={`group flex w-full items-start gap-5 rounded-2xl px-4 py-3 text-left transition ${k === i ? "bg-panel" : "hover:bg-white/[0.03]"}`}>
                  <span className={`mt-1 w-14 shrink-0 font-mono text-xs uppercase tracking-wider ${k === i ? (ch.alarm ? "text-red-400" : "text-amber") : "text-ink-3"}`}>{ch.day}</span>
                  <span>
                    <span className={`block font-display text-2xl font-semibold uppercase tracking-wide ${k === i ? "text-ink" : "text-ink-3 group-hover:text-ink-2"}`}>{ch.title}</span>
                    <span className={`grid transition-all duration-500 ${k === i ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden text-ink-2">{ch.text}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
