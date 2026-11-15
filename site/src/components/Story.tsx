"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

const chapters = [
  { day: "Day 1", title: "Launch", img: "/media/story-1.jpg", text: "Our crew of three leaves Earth for the Moon.", note: "Earth: NASA EPIC · Moon: NASA LRO" },
  { day: "Day 3", title: "Lunar orbit", img: "/media/story-2.jpg", text: "We reach lunar orbit and aim for the south pole." },
  { day: "Day 4", title: "Descent", img: "/media/story-3.jpg", text: "Landing burn. The main engine starts to shake." },
  { day: "Day 4", title: "Engine failure", img: "/media/story-4.jpg", text: "The engine dies. We crash far from the landing site.", alarm: true },
  { day: "Day 5", title: "The crash site", img: "/media/story-5.jpg", text: "The base module survived - but air and food won't last." },
  { day: "Goal", title: "The way home", img: "/media/story-6.jpg", text: "Salvage, build a rover, repair the ship, fly home." },
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
        <div className="reveal relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-black">
          {chapters.map((ch, k) => (
            <img key={k} src={ch.img} alt={ch.title}
                 className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ${k === i ? "scale-100 opacity-100" : "scale-105 opacity-0"}`} />
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
