/* eslint-disable @next/next/no-img-element */

// Hero, team and closing slides (no state)

export function Hero() {
  return (
    <section className="slide flex items-end">
      <video suppressHydrationWarning className="absolute inset-0 h-full w-full object-cover" src="/media/earth.mp4" poster="/media/earth-poster.jpg"
             autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-gradient-to-t from-space via-space/50 to-space/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-space/80 via-transparent to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-12 md:pb-28">
        <p className="kicker reveal">NASA Space Apps Challenge · TAY Team</p>
        <h1 className="reveal d1 mt-5 font-display text-[clamp(4rem,12vw,11rem)] font-bold uppercase leading-[0.82] tracking-tight">
          Survive<br />in Moon
        </h1>
        <p className="reveal d2 mt-8 max-w-xl text-lg text-ink-2 md:text-xl">
          A lunar survival game built on real NASA data.
        </p>
        <div className="reveal d3 mt-10 flex items-center gap-4 text-sm text-ink-3">
          <span className="h-px w-10 bg-amber" />
          Tima · Aisha · Yunus
        </div>
      </div>
    </section>
  );
}

const team = [
  { letter: "T", name: "Tima", suit: "Kazakh" },
  { letter: "A", name: "Aisha", suit: "Russian" },
  { letter: "Y", name: "Yunus", suit: "Turkish" },
];

export function Team() {
  return (
    <section className="slide flex items-center">
      <div className="stars absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12">
        <p className="kicker reveal">The crew</p>
        <h2 className="reveal d1 mt-4 font-display text-6xl font-bold uppercase md:text-8xl">
          We are <span className="text-amber">TAY</span>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {team.map((m, i) => (
            <div key={m.name}
                 className={`reveal d${i + 2} group relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-panel to-surface p-8 transition duration-500 hover:-translate-y-2 hover:border-amber/40`}>
              <span className="pointer-events-none absolute -right-4 -top-10 font-display text-[14rem] font-bold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-amber/10">
                {m.letter}
              </span>
              <img src={`/media/astro/${m.suit}.png`} alt="" className="relative mx-auto h-56 w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition duration-500 group-hover:scale-105" />
              <div className="relative mt-6 flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold text-amber">{m.letter}</span>
                <span className="font-display text-3xl font-semibold uppercase tracking-wide">{m.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="slide flex items-center justify-center text-center">
      <video suppressHydrationWarning className="absolute inset-0 h-full w-full object-cover opacity-50" src="/media/base.mp4" poster="/media/base-poster.jpg"
             autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-gradient-to-b from-space via-space/70 to-space" />
      <div className="relative z-10 px-6">
        <p className="kicker reveal">Thank you</p>
        <h2 className="reveal d1 mt-6 font-display text-[clamp(3.5rem,10vw,9rem)] font-bold uppercase leading-[0.85]">
          Let&apos;s go<br /><span className="text-amber">home.</span>
        </h2>
        <div className="reveal d3 mt-12 inline-flex items-center gap-5 rounded-full border border-line bg-panel/70 px-7 py-3 backdrop-blur">
          <span className="font-display text-2xl font-bold tracking-wider text-amber">TAY</span>
          <span className="h-5 w-px bg-line" />
          <span className="text-ink-2">Tima · Aisha · Yunus</span>
        </div>
      </div>
    </section>
  );
}
