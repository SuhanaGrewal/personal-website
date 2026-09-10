"use client";

import { useEffect, useRef, useState } from "react";
import type { CapBox } from "@/components/keyboard/Keyboard";
import s from "./PulseDot.module.css";

interface Props {
  /** where the target cap sits inside the deck, in layout space */
  box: CapBox | null;
  label: string;
  /** show the pill without hovering — used to introduce the hint */
  open?: boolean;
  onPress: () => void;
}

export function PulseDot({ box, label, open = false, onPress }: Props) {
  const hidden = !box || !label;

  /* the anchor transitions its transform so the pulse *glides* from
     F8 to ▼. But the very first placement is not a move — without
     this gate the dot visibly flies in from the deck's top-left
     corner on load. So: place first, enable the transition after. */
  const placed = useRef(false);
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!box || placed.current) return;
    placed.current = true;

    // Deliberately no cleanup. `box` gets a fresh identity every time the
    // deck is re-measured, which a ResizeObserver does freely. Cancelling
    // on that re-run kills these for good, because the `placed` guard
    // stops the re-run from rescheduling them. The ref already guarantees
    // they are scheduled exactly once.
    requestAnimationFrame(() => setReady(true));
    // let the machine be looked at before anything asks to be pressed
    window.setTimeout(() => setShown(true), 1900);
  }, [box]);

  return (
    <div
      className={s.anchor}
      data-placed={(shown && Boolean(box)) || undefined}
      data-animate={ready || undefined}
      data-hidden={hidden || undefined}
      data-open={open || undefined}
      style={{
        transform: box
          ? `translate(${box.x + box.w / 2}px, ${box.y + box.h / 2}px)`
          : undefined,
      }}
    >
      <span className={s.pill} data-flip={box?.flip || undefined}>
        {label}
      </span>
      <button
        type="button"
        className={s.dot}
        aria-label={label}
        onClick={onPress}
      />
    </div>
  );
}
