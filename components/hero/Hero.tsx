"use client";

import { useCallback, useEffect, useState } from "react";
import { Keyboard, type CapBox } from "@/components/keyboard/Keyboard";
import { PulseDot } from "@/components/pulse/PulseDot";
import { useMachine } from "@/lib/machine/useMachine";
import s from "./Hero.module.css";

/* tODO(suhana): your words. these are mine, standing in. */
const INTRO_LINES = ["half AI engineer,", "half design nerd."];
const TAGLINE = "& some music";

const STATUS: Record<string, string> = {
  dormant: "system status: dormant",
  live: "system status: playing",
  departed: "system status: playing",
};

export function Hero() {
  const { state, targetKey, hint, pressed, activate, readLevels } = useMachine();
  const [box, setBox] = useState<CapBox | null>(null);
  const [introOpen, setIntroOpen] = useState(false);

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

  return (
    <section className={s.hero} data-state={state}>
      <header className={s.top}>
        <div className={s.mark} aria-hidden="true" />
        <p className={s.intro}>
          {INTRO_LINES[0]}
          <br />
          {INTRO_LINES[1]}
        </p>
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
            label={hint}
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
        <span className={s.tagline}>{TAGLINE}</span>
        <span className={s.status}>
          <i className={s.statusDot} aria-hidden="true" />
          {STATUS[state]}
        </span>
        <span className={s.copyright}>© 2026 suhana grewal</span>
      </footer>
    </section>
  );
}
