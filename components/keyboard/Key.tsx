"use client";

import { useCallback } from "react";
import type { KeyDef } from "./layout";
import { KeyIcon } from "./icons";
import s from "./Key.module.css";

export interface KeyProps {
  def: KeyDef;
  /** row height in key units */
  h: number;
  /** the pulse currently sits on this key — give it an affordance */
  armed?: boolean;
  /** physically held down right now (real keyboard or pointer) */
  pressed?: boolean;
  onActivate?: (id: string) => void;
  /** hands the live cap element up so the pulse can measure it */
  onMeasure?: (id: string, el: HTMLElement | null) => void;
}

export function Key({
  def,
  h,
  armed = false,
  pressed = false,
  onActivate,
  onMeasure,
}: KeyProps) {
  const { id, w = 1, label, shift, glyph, icon, fn, align = "center" } = def;

  const ref = useCallback(
    (el: HTMLButtonElement | null) => {
      onMeasure?.(id, el);
    },
    [id, onMeasure],
  );

  const isFn = Boolean(fn) || id === "Escape" || id === "TouchID";
  const isTouchId = id === "TouchID";
  const isArrow = id.startsWith("Arrow");

  return (
    <div
      className={s.cell}
      style={{ "--w": w, "--h": h } as React.CSSProperties}
    >
      <button
        ref={ref}
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        data-key={id}
        data-armed={armed || undefined}
        data-pressed={pressed || undefined}
        className={[
          s.cap,
          isFn ? s.fnCap : "",
          isTouchId ? s.touchId : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => onActivate?.(id)}
      >
        {/* function row: tiny F-number in the corner, icon centred */}
        {fn ? <span className={s.fnNum}>{fn}</span> : null}

        {icon && label ? (
          <span className={s.stack} data-align={align}>
            <KeyIcon name={icon} className={s.miniIcon} />
            <span className={s.word}>{label}</span>
          </span>
        ) : icon ? (
          <KeyIcon name={icon} className={s.icon} />
        ) : id === "Escape" ? (
          <span className={s.stack} data-align="left">
            <span className={s.escLabel}>esc</span>
          </span>
        ) : isArrow ? (
          <span className={s.arrow}>{label}</span>
        ) : id === "Space" ? null : (
          <span className={s.stack} data-align={align}>
            {/* number / punctuation: shifted char printed above */}
            {shift ? <span className={s.shifted}>{shift}</span> : null}
            {/* modifier glyph sits above its word, Apple-style */}
            {glyph && label ? <span className={s.glyph}>{glyph}</span> : null}
            {label ? (
              <span
                className={
                  shift ? s.primary : glyph ? s.word : s.letter
                }
              >
                {label}
              </span>
            ) : null}
          </span>
        )}
      </button>
    </div>
  );
}
