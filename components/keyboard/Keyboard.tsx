"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Key } from "./Key";
import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  BOTTOM_ROW,
  ROWS,
} from "./layout";
import type { MachineState } from "@/lib/machine/useMachine";
import s from "./Keyboard.module.css";

/** where a cap sits inside the deck, in untransformed layout space */
export interface CapBox {
  x: number;
  y: number;
  w: number;
  h: number;
  /** target sits near the right edge — the label must open leftward */
  flip: boolean;
}

interface Props {
  state: MachineState;
  targetKey: string | null;
  pressed: ReadonlySet<string>;
  onActivate: (id: string) => void;
  readLevels: (out: Float32Array) => void;
  /** fires whenever the pulse's target cap moves — mount, resize, state change */
  onTargetBox: (box: CapBox | null) => void;
  children?: React.ReactNode;
}

/** number of spectrum bands smeared across the width of the deck */
const BANDS = 26;

/* offsetLeft/offsetTop walk up the offsetParent chain, which lives in
   *layout* space — immune to the deck's rotateX. getBoundingClientRect
   would be corrupted by the perspective transform. */
function offsetWithin(
  el: HTMLElement,
  root: HTMLElement,
): Omit<CapBox, "flip"> {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export function Keyboard({
  state,
  targetKey,
  pressed,
  onActivate,
  readLevels,
  onTargetBox,
  children,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const caps = useRef(new Map<string, HTMLElement>());

  // band index + last written value per cap, so the rAF loop can skip
  // DOM writes that would not change anything visible
  const bandOf = useRef(new Map<HTMLElement, number>());
  const lastLit = useRef(new WeakMap<HTMLElement, number>());
  const [ready, setReady] = useState(0);

  const onMeasure = useCallback((id: string, el: HTMLElement | null) => {
    if (el) caps.current.set(id, el);
    else caps.current.delete(id);
  }, []);

  /* ── report the pulse target's position ─────────────────── */
  const measureTarget = useCallback(() => {
    const deck = deckRef.current;
    if (!deck || !targetKey) {
      onTargetBox(null);
      return;
    }
    const cap = caps.current.get(targetKey);
    if (!cap) {
      onTargetBox(null);
      return;
    }
    const b = offsetWithin(cap, deck);
    // ▼ lives in the bottom-right corner; a right-opening label would
    // run off the machine and float on the paper
    onTargetBox({ ...b, flip: b.x + b.w / 2 > deck.offsetWidth * 0.62 });
  }, [targetKey, onTargetBox]);

  useEffect(() => {
    measureTarget();
  }, [measureTarget, ready]);

  /* ── recompute on any resize of the deck ────────────────── */
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const ro = new ResizeObserver(() => {
      // widths changed, so both the target box and the band map are stale
      bandOf.current.clear();
      setReady((n) => n + 1);
    });
    ro.observe(deck);
    return () => ro.disconnect();
  }, []);

  /* ── assign each cap to a spectrum band by its x position ── */
  const buildBands = useCallback(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const width = deck.offsetWidth || 1;
    bandOf.current.clear();
    caps.current.forEach((el) => {
      const b = offsetWithin(el, deck);
      const nx = (b.x + b.w / 2) / width;
      bandOf.current.set(el, Math.min(BANDS - 1, Math.floor(nx * BANDS)));
    });
  }, []);

  /* ── keycap backlighting, driven straight from the analyser ──
     this deliberately bypasses React: 78 caps at 60fps is a job
     for direct style writes, not a render pass.                */
  useEffect(() => {
    if (state !== "live") {
      caps.current.forEach((el) => {
        el.style.setProperty("--lit", "0");
        lastLit.current.set(el, 0);
      });
      return;
    }

    const levels = new Float32Array(BANDS);
    let raf = 0;

    const frame = () => {
      if (bandOf.current.size === 0) buildBands();
      readLevels(levels);

      caps.current.forEach((el) => {
        const band = bandOf.current.get(el);
        if (band === undefined) return;
        const v = levels[band];
        const prev = lastLit.current.get(el) ?? 0;
        // ease down faster than up — feels like light decaying
        const next = v > prev ? prev + (v - prev) * 0.55 : prev + (v - prev) * 0.22;
        if (Math.abs(next - prev) > 0.015) {
          el.style.setProperty("--lit", next.toFixed(3));
          lastLit.current.set(el, next);
        }
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [state, readLevels, buildBands]);

  /* ── pointer parallax: a couple of degrees, no more ──────── */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        stage.style.setProperty("--tilt-y", `${(nx * 3.2).toFixed(2)}deg`);
        stage.style.setProperty("--tilt-x", `${(9.5 - ny * 2.2).toFixed(2)}deg`);
      });
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const capFor = (
    def: Parameters<typeof Key>[0]["def"],
    h: number,
  ) => (
    <Key
      key={def.id}
      def={def}
      h={h}
      armed={targetKey === def.id}
      pressed={pressed.has(def.id)}
      onActivate={onActivate}
      onMeasure={onMeasure}
    />
  );

  return (
    <div ref={stageRef} className={`${s.stage} noselect`} data-state={state}>
      <div className={s.bloom} aria-hidden="true" />

      <div ref={deckRef} className={s.deck}>
        <div className={s.well}>
          {ROWS.map((row, i) =>
            row === BOTTOM_ROW ? (
              <div className={s.row} key="bottom">
                {row.keys.map((k) => capFor(k, row.h))}
                <div className={s.cluster}>
                  {capFor(ARROW_LEFT, 1)}
                  <div className={s.arrowColumn}>
                    {capFor(ARROW_UP, 0.5)}
                    {capFor(ARROW_DOWN, 0.5)}
                  </div>
                  {capFor(ARROW_RIGHT, 1)}
                </div>
              </div>
            ) : (
              <div className={s.row} key={i}>
                {row.keys.map((k) => capFor(k, row.h))}
              </div>
            ),
          )}
        </div>

        {/* the pulse lives inside the deck's 3D space, so it lies on
            the surface of the machine rather than floating over it */}
        {children}
      </div>
    </div>
  );
}
