"use client";

import { useEffect, useRef, useState } from "react";

// Notes pop up over the footage at given moments (seconds)
type Note = { at: number; until: number; x: string; y: string; text: string };
const clips: { id: string; title: string; caption: string; notes: Note[] }[] = [
  { id: "base", title: "The base", caption: "Hub, workbench, terminal - and a crew to keep fed.",
    notes: [{ at: 0.5, until: 4.5, x: "52%", y: "48%", text: "Hub · life support" }, { at: 4, until: 8.5, x: "30%", y: "62%", text: "Crew mates" }] },
  { id: "journey", title: "The journey", caption: "Past 650 m, only the rover gets you through.",
    notes: [{ at: 1, until: 5, x: "18%", y: "30%", text: "Leaving life support" }, { at: 6, until: 9.8, x: "60%", y: "55%", text: "Deep zone · rover only" }] },
  { id: "pod", title: "Cargo pod", caption: "The first wreck - it holds the rover blueprint.",
    notes: [{ at: 1, until: 5.5, x: "50%", y: "40%", text: "Rover blueprint inside" }] },
  { id: "ship", title: "The crashed ship", caption: "Four repair stages, all built from salvage.",
    notes: [{ at: 1, until: 7, x: "48%", y: "36%", text: "Repair 0 / 4 stages" }] },
  { id: "earth", title: "Earthrise", caption: "A real photo from NASA's EPIC camera.",
    notes: [{ at: 3, until: 6, x: "56%", y: "26%", text: "NASA EPIC · real photo" }] },
];

const loop = [
  { icon: "crate", label: "Salvage", text: "Wrecks, regolith, ice, helium-3" },
  { icon: "engine", label: "Craft", text: "23 workbench recipes" },
  { icon: "base", label: "Build", text: "Greenhouse, solar, garage" },
  { icon: "rover", label: "Explore", text: "Rover into the deep zone" },
  { icon: "ship", label: "Repair", text: "Fix the ship, launch" },
];

export default function Gameplay() {
  const [tab, setTab] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [playing, setPlaying] = useState(true);
  const video = useRef<HTMLVideoElement>(null);
  const clip = clips[tab];

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
    setPlaying(true);
  }, [tab]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = video.current;
    if (!v) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  };

  return (
    <section className="slide flex items-center py-16">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker reveal">Gameplay</p>
            <h2 className="reveal d1 mt-4 font-display text-5xl font-bold uppercase md:text-7xl">Explore the Moon</h2>
          </div>
          <div className="reveal d2 flex flex-wrap gap-2">
            {clips.map((c, k) => (
              <button key={c.id} onClick={() => setTab(k)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${k === tab ? "border-amber bg-amber text-space" : "border-line text-ink-2 hover:border-white/30 hover:text-ink"}`}>
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <div className="reveal d2 relative mt-8 aspect-video overflow-hidden rounded-3xl border border-line bg-black">
          <video suppressHydrationWarning ref={video} className="h-full w-full cursor-pointer object-cover" src={`/media/${clip.id}.mp4`} poster={`/media/${clip.id}-poster.jpg`}
                 muted loop playsInline autoPlay onClick={toggle}
                 onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                 onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 1)} />
          {clip.notes.map((n, k) => {
            const on = time >= n.at && time <= n.until;
            return (
              <div key={k} className={`pointer-events-none absolute flex items-center gap-2 transition-all duration-500 ${on ? "opacity-100" : "translate-y-2 opacity-0"}`}
                   style={{ left: n.x, top: n.y }}>
                <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" /><span className="relative inline-flex h-3 w-3 rounded-full bg-amber" /></span>
                <span className="rounded-full bg-space/80 px-3 py-1 text-sm font-semibold backdrop-blur">{n.text}</span>
              </div>
            );
          })}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6 pt-16">
            <p className="max-w-2xl text-ink-2">{clip.caption}</p>
            <div className="mt-4 flex items-center gap-4">
              <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm hover:bg-white/20" aria-label={playing ? "Pause" : "Play"}>
                {playing ? "❚❚" : "▶"}
              </button>
              <div className="h-1.5 flex-1 cursor-pointer rounded-full bg-white/15" onClick={seek}>
                <div className="h-full rounded-full bg-amber" style={{ width: `${(time / duration) * 100}%` }} />
              </div>
              <span className="font-mono text-xs text-ink-3">{time.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-5">
          {loop.map((s, k) => (
            <div key={s.label} className={`reveal d${Math.min(4, k + 1)} rounded-2xl border border-line bg-panel/60 p-4`}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-ink-3">0{k + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/media/icons/${s.icon}.png`} alt="" className="h-5 w-5 opacity-80" />
                <span className="font-display text-xl font-semibold uppercase">{s.label}</span>
              </div>
              <p className="mt-2 text-sm text-ink-3">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
