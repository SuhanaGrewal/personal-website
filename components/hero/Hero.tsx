"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, type CapBox } from "@/components/keyboard/Keyboard";
import { PulseDot } from "@/components/pulse/PulseDot";
import { useMachine } from "@/lib/machine/useMachine";
import s from "./Hero.module.css";

const INTRO = "half ai engineer, half design nerd.";
const TAGLINE = "& occasional musician";

/* where each beat of the sticky sequence sits along the scroll range */
const NAME_ENDS = 0.55; // the name has cleared the top of the frame
const EXIT_BEGINS = 0.6; // only then does the machine start moving left
const EXIT_ENDS = 0.9; // it is fully off-frame; the rest is a beat of
//                        held white before the next section arrives
/* past this much of the rise the pulse is out of the way */
const PULSE_HIDES = 0.3;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function Hero() {
  const { state, targetKey, hint, pressed, activate, readLevels } = useMachine();
  const [box, setBox] = useState<CapBox | null>(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [pulseGone, setPulseGone] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const goneRef = useRef(false);

  const onTargetBox = useCallback((b: CapBox | null) => setBox(b), []);

  /* show the hint unprompted for a beat on arrival, then let hover
     take over — otherwise nobody discovers the pulse is a button */
  useEffect(() => {
    if (state !== "dormant") {
      setIntroOpen(false);
      return;
    }
    const show = setTimeout(() => setIntroOpen(true), 3200);
    const hide = setTimeout(() => setIntroOpen(false), 7400);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [state]);

  /* ── the sticky sequence ──────────────────────────────────
     Two normalised clocks written straight to CSS variables:
     --p-name raises the name while the ground washes white,
     then --p-exit carries the machine off to the left. Both
     are pure functions of scroll offset, so scrolling back up
     plays it in reverse with no state to unwind. Writing them
     from inside a rAF keeps the whole thing on one frame.     */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? clamp01((window.scrollY - el.offsetTop) / range) : 0;

      const pName = clamp01(p / NAME_ENDS);
      const pExit = clamp01((p - EXIT_BEGINS) / (EXIT_ENDS - EXIT_BEGINS));

      el.style.setProperty("--p-name", pName.toFixed(4));
      el.style.setProperty("--p-exit", pExit.toFixed(4));

      // the pulse steps aside once the name starts moving, and comes
      // back if you scroll up again
      const gone = pName > PULSE_HIDES;
      if (gone !== goneRef.current) {
        goneRef.current = gone;
        setPulseGone(gone);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" ref={heroRef} className={s.hero} data-state={state}>
      <div className={s.viewport}>
        {/* the ground washes to pure white as the name rises */}
        <div className={s.wash} aria-hidden="true" />

        <header className={s.top}>
          <div className={s.mark} aria-hidden="true" />
          <p className={s.intro}>{INTRO}</p>
          <button type="button" className={s.menu} aria-label="Menu">
            ⋮
          </button>
        </header>

        <div className={s.stage}>
          <div className={s.machine}>
            <Keyboard
              state={state}
              targetKey={targetKey}
              pressed={pressed}
              onActivate={activate}
              readLevels={readLevels}
              onTargetBox={onTargetBox}
            >
              <PulseDot
                box={box}
                label={pulseGone ? "" : hint}
                open={introOpen}
                onPress={() => targetKey && activate(targetKey)}
              />
            </Keyboard>
          </div>

          <h1 className={s.wordmark} aria-label="Suhana Grewal">
            <span aria-hidden="true">suhana</span>
            <span aria-hidden="true">grewal</span>
          </h1>
        </div>

        <footer className={s.bottom}>
          <span aria-hidden="true" />
          <span className={s.tagline}>{TAGLINE}</span>
          <span className={s.copyright}>© 2026 suhana grewal</span>
        </footer>
      </div>
    </section>
  );
}
