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

  /* ── a cap that is also a link ──────────────────────────
     the contact section's deck lights a handful of keys and sends
     them somewhere. giving the existing cap those two abilities
     keeps one keycap in the codebase rather than a second one that
     has to be kept looking identical. both default off, so the hero
     renders exactly as before. */

  /** backlight level, 0–2. drives --lit, which the cap already reads */
  lit?: number;
  /** when set the cap renders as a real link instead of a button */
  href?: string;
  /** accessible name and tooltip text for a linked cap */
  linkLabel?: string;
  /** mailto: and downloads stay in this tab */
  sameTab?: boolean;
  onHoverLink?: (id: string | null) => void;
}

export function Key({
  def,
  h,
  armed = false,
  pressed = false,
  onActivate,
  onMeasure,
  lit,
  href,
  linkLabel,
  sameTab,
  onHoverLink,
}: KeyProps) {
  const { id, w = 1, label, shift, glyph, icon, fn, align = "center" } = def;

  const ref = useCallback(
    (el: HTMLElement | null) => {
      onMeasure?.(id, el);
    },
    [id, onMeasure],
  );

  const isFn = Boolean(fn) || id === "Escape" || id === "TouchID";
  const isTouchId = id === "TouchID";
  const isArrow = id.startsWith("Arrow");

  /* a linked cap is a real anchor: focusable, named, and reachable by
     keyboard. an unlinked one stays the hero's decorative button. */
  const linked = Boolean(href);
  const Tag = (linked ? "a" : "button") as "a";
  const roleProps = linked
    ? {
        href,
        target: sameTab ? undefined : "_blank",
        rel: sameTab ? undefined : "noreferrer",
        "aria-label": linkLabel,
        onPointerEnter: () => onHoverLink?.(id),
        onPointerLeave: () => onHoverLink?.(null),
        onFocus: () => onHoverLink?.(id),
        onBlur: () => onHoverLink?.(null),
      }
    : ({
        type: "button",
        tabIndex: -1,
        "aria-hidden": true,
        onClick: () => onActivate?.(id),
      } as const);

  return (
    <div
      className={s.cell}
      style={{ "--w": w, "--h": h } as React.CSSProperties}
    >
      <Tag
        ref={ref as React.Ref<HTMLAnchorElement>}
        data-key={id}
        data-armed={armed || undefined}
        data-pressed={pressed || undefined}
        data-linked={linked || undefined}
        style={
          lit === undefined
            ? undefined
            : ({ "--lit": lit } as React.CSSProperties)
        }
        className={[
          s.cap,
          isFn ? s.fnCap : "",
          isTouchId ? s.touchId : "",
        ]
          .filter(Boolean)
          .join(" ")}
        {...roleProps}
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
      </Tag>
    </div>
  );
}
