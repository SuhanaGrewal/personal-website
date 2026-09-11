"use client";

import { useCallback, useRef, useState } from "react";
import {
  FUNCTION_ROW,
  NUMBER_ROW,
  TAB_ROW,
  HOME_ROW,
  SHIFT_ROW,
  BOTTOM_ROW,
  ARROW_LEFT,
  ARROW_UP,
  ARROW_DOWN,
  ARROW_RIGHT,
  type KeyDef,
  type RowDef,
} from "@/components/keyboard/layout";
import { Key } from "@/components/keyboard/Key";
import { TARGETS, KEY_TARGETS, RELABEL } from "./links";
import s from "./Laptop.module.css";

/* a space grey laptop and its mouse.

   the deck is the hero's keycap, not a copy of it: same component,
   same moulded chamfer, same folded front wall, same backlight. the
   handful of keys that go somewhere simply run their --lit up, which
   is the property that cap already uses to glow — so the light
   spilling onto the deck around them is the real thing rather than a
   blue rectangle painted on top. */

/* A and S merge into one wide cap for the substack wordmark, which
   keeps the row's unit sum intact (1 + 1 -> 2) */
function withSubstack(row: RowDef): RowDef {
  const keys: KeyDef[] = [];
  for (const k of row.keys) {
    if (k.id === "KeyA") {
      keys.push({ id: "Sub", w: 2, label: "SUB" });
      continue;
    }
    if (k.id === "KeyS") continue;
    keys.push(k);
  }
  return { ...row, keys };
}

const ROWS: RowDef[] = [
  FUNCTION_ROW,
  NUMBER_ROW,
  TAB_ROW,
  withSubstack(HOME_ROW),
  SHIFT_ROW,
  BOTTOM_ROW,
];

interface Tip {
  label: string;
  x: number;
  y: number;
}

export function Laptop() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [atTop, setAtTop] = useState(false);
  const caps = useRef(new Map<string, HTMLElement>());
  const bodyRef = useRef<HTMLDivElement>(null);

  const measure = useCallback((id: string, el: HTMLElement | null) => {
    if (el) caps.current.set(id, el);
    else caps.current.delete(id);
  }, []);

  /* measured against the body, and rendered as the body's child
     rather than the deck's: the deck is a preserve-3d context and the
     caps are translated toward the viewer inside it, so a label
     parented there sits at z=0 and draws behind the very keys it is
     labelling */
  const onHoverLink = useCallback((id: string | null) => {
    if (!id) return setTip(null);
    const el = caps.current.get(id);
    const deck = bodyRef.current;
    if (!el || !deck) return;
    const c = el.getBoundingClientRect();
    const d = deck.getBoundingClientRect();
    const target = KEY_TARGETS[id];
    if (!target) return;
    setTip({
      label: TARGETS[target].label,
      x: c.left + c.width / 2 - d.left,
      y: c.top - d.top,
    });
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAtTop(true);
    window.setTimeout(() => setAtTop(false), 1400);
  };

  return (
    <div className={s.scene}>
      {/* the machine is centred on the page; the mouse sits beside it
          without pulling it off centre */}
      <div className={s.body} ref={bodyRef}>
        {/* the machine is the photograph, cut off its backdrop. the
            deck below is laid over the well at the coordinates that
            photograph was measured at, and paints its own recess, so
            it covers the keys already in the picture rather than
            doubling them. */}
        <img className={s.shell} src="/macbook.webp" alt="" aria-hidden="true" />

        <div className={s.deck}>
          {ROWS.map((row, i) => (
            <div key={i} className={s.row} style={{ "--h": row.h } as React.CSSProperties}>
              {row.keys.map((k) => {
                const target = KEY_TARGETS[k.id];
                const def = RELABEL[k.id]
                  ? { ...k, label: RELABEL[k.id], shift: undefined, glyph: undefined }
                  : k;
                const t = target ? TARGETS[target] : undefined;
                return (
                  <Key
                    key={k.id}
                    def={def}
                    h={row.h}
                    lit={target ? 1 : undefined}
                    href={t?.href}
                    linkLabel={t?.label}
                    sameTab={t?.sameTab}
                    onHoverLink={onHoverLink}
                    onMeasure={target ? measure : undefined}
                  />
                );
              })}

              {i === ROWS.length - 1 ? (
                <div className={s.arrows}>
                  <Key def={ARROW_LEFT} h={1} />
                  <div className={s.arrowStack}>
                    <Key def={ARROW_UP} h={0.5} />
                    <Key def={ARROW_DOWN} h={0.5} />
                  </div>
                  <Key def={ARROW_RIGHT} h={1} />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <span
          className={s.tip}
          data-on={tip ? true : undefined}
          style={
            {
              "--x": `${tip?.x ?? 0}px`,
              "--y": `${tip?.y ?? 0}px`,
              opacity: tip ? 1 : 0,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          {tip?.label}
        </span>
      </div>

      <button
        type="button"
        className={s.mouse}
        onClick={toTop}
        aria-label="back to the top"
      >
        <img className={s.mouseArt} src="/magic-mouse.webp" alt="" aria-hidden="true" />
        <span className={s.mouseTip} aria-hidden="true">
          {atTop ? "going up" : "back to the top"}
        </span>
      </button>
    </div>
  );
}
