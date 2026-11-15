"use client";

import { Children, ReactNode, useEffect, useRef, useState } from "react";

// Full-screen slides that snap; arrow keys / PageUp/Down / Space move between them, the dots on the right jump,
// and every slide gets "in-view" when it is on screen (its .reveal children fade up).
export default function Deck({ children, labels }: { children: ReactNode; labels: string[] }) {
  const deck = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  useEffect(() => {
    const root = deck.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>(":scope > .slide"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            setActive(slides.indexOf(e.target as HTMLElement));
          }
        }
      },
      { root, threshold: 0.55 }
    );
    slides.forEach((s) => io.observe(s));
    // #3 in the address opens slide 3 (handy for rehearsing one part)
    const n = parseInt(window.location.hash.slice(1), 10);
    if (n > 1 && slides[n - 1]) slides[n - 1].scrollIntoView();
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const go = (i: number) => {
      const slides = deck.current?.querySelectorAll<HTMLElement>(":scope > .slide");
      slides?.[Math.max(0, Math.min(count - 1, i))]?.scrollIntoView({ behavior: "smooth" });
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(active + 1); }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(active - 1); }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(count - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, count]);

  const jump = (i: number) =>
    deck.current?.querySelectorAll<HTMLElement>(":scope > .slide")[i]?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <div ref={deck} className="deck">{children}</div>

      {/* Progress: a thin line on top and labelled dots on the right */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-white/5">
        <div className="h-full bg-amber transition-all duration-700" style={{ width: `${((active + 1) / count) * 100}%` }} />
      </div>
      <nav className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 md:flex" aria-label="Slides">
        {labels.map((label, i) => (
          <button key={label} onClick={() => jump(i)} className="group flex items-center justify-end gap-3" aria-label={label}>
            <span className={`font-mono text-[11px] uppercase tracking-widest transition-opacity ${i === active ? "text-ink opacity-100" : "text-ink-3 opacity-0 group-hover:opacity-100"}`}>
              {label}
            </span>
            <span className={`block h-2 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-amber" : "w-2 bg-white/25 group-hover:bg-white/60"}`} />
          </button>
        ))}
      </nav>
      <div className="pointer-events-none fixed bottom-5 right-6 z-50 font-mono text-xs text-ink-3">
        {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </div>
    </>
  );
}
