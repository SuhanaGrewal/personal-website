"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEngine, type AudioEngine } from "@/lib/audio/engine";
import { POWER_KEY, SCROLL_KEY } from "@/components/keyboard/layout";

/*  dormant  ──click F8──▶  live
    the machine only ever powers on. everything after that — the name
    rising, the deck dissolving — is a pure function of scroll offset,
    so scrolling back up rewinds it exactly.  */
export type MachineState = "dormant" | "live";

export interface Machine {
  state: MachineState;
  /** the key the pulse is currently sitting on */
  targetKey: string | null;
  /** the label shown in the pill on hover */
  hint: string;
  /** keys held down right now, real or pointer */
  pressed: ReadonlySet<string>;
  powerOn: () => void;
  descend: () => void;
  activate: (id: string) => void;
  /** stable reader for the keycap backlighting — no-ops until powered */
  readLevels: (out: Float32Array) => void;
}

const HINTS: Record<MachineState, string> = {
  dormant: "some of my music as you scroll",
  live: "scroll",
};

export function useMachine(): Machine {
  const [state, setState] = useState<MachineState>("dormant");
  const [pressed, setPressed] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );

  const engineRef = useRef<AudioEngine | null>(null);
  const stateRef = useRef<MachineState>("dormant");
  stateRef.current = state;

  // the AudioContext is only ever built on a real user gesture
  const getEngine = useCallback(() => {
    if (!engineRef.current) engineRef.current = createEngine();
    return engineRef.current;
  }, []);

  const powerOn = useCallback(() => {
    if (stateRef.current !== "dormant") return;
    void getEngine().start();
    setState("live");
  }, [getEngine]);

  /* run the sticky sequence to its end; the scroll itself animates it */
  const descend = useCallback(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    window.scrollTo({
      top: hero.offsetTop + hero.offsetHeight - window.innerHeight,
      behavior: "smooth",
    });
  }, []);

  /** a cap was clicked — only two of them actually do anything */
  const activate = useCallback(
    (id: string) => {
      if (id === POWER_KEY) {
        if (stateRef.current === "dormant") powerOn();
        else engineRef.current?.isRunning()
          ? engineRef.current.stop()
          : void engineRef.current?.start();
        return;
      }
      if (id === SCROLL_KEY) descend();
    },
    [powerOn, descend],
  );

  /* ── the real keyboard drives the on-screen one ───────── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // never steal keys from a field being typed into — space is the
      // power toggle and ▼ starts the scroll, and both would otherwise
      // be swallowed mid-sentence in the composer
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }

      const code = e.code;

      if (code === "Space" || code === "F8") {
        e.preventDefault();
        if (stateRef.current === "dormant") powerOn();
        else if (engineRef.current?.isRunning()) engineRef.current.stop();
        else void engineRef.current?.start();
      }

      // only hijack ▼ at the very top; further down it must scroll normally
      if (code === "ArrowDown" && stateRef.current === "live" && window.scrollY < 8) {
        e.preventDefault();
        descend();
      }

      setPressed((prev) => {
        if (prev.has(code)) return prev;
        const next = new Set(prev);
        next.add(code);
        return next;
      });
    };

    const up = (e: KeyboardEvent) => {
      setPressed((prev) => {
        if (!prev.has(e.code)) return prev;
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    // a lost blur would otherwise leave caps stuck down
    const clear = () => setPressed(new Set());

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [powerOn, descend]);

  /* scroll depth opens the filter — the track arrives as you go */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const d = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
        engineRef.current?.setIntensity(d);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => () => engineRef.current?.dispose(), []);

  const targetKey = useMemo(() => {
    if (state === "dormant") return POWER_KEY;
    if (state === "live") return SCROLL_KEY;
    return null;
  }, [state]);

  const readLevels = useCallback((out: Float32Array) => {
    const e = engineRef.current;
    if (!e || !e.isRunning()) {
      out.fill(0);
      return;
    }
    e.readLevels(out);
  }, []);

  return {
    state,
    targetKey,
    hint: HINTS[state],
    pressed,
    powerOn,
    descend,
    activate,
    readLevels,
  };
}
