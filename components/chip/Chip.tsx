"use client";

import { useState } from "react";
import { LINKS } from "./links";
import s from "./Chip.module.css";

/* an inference accelerator card, seen straight on, spanning the full
   width of the page and sitting flush to the bottom of the viewport.

   the zones follow the same left-to-right reading as any piece of
   rack hardware — a bank of parts, a heatsink, the main package —
   except every one of them is a real thing a board like this has:
   the six memory packages on the left are the links, the fin stack
   in the middle is the cooler, and the die on the right carries the
   mark. black pcb and brushed metal, same material language as the
   keyboard and the imac. */

export function Chip() {
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <div className={s.card}>
      <div className={s.pcb}>
        {/* board status led — a real feature of a card like this,
            and the one place the site's accent shows up here */}
        <div className={s.status}>
          <i className={s.led} aria-hidden="true" />
          <span className={s.statusText}>available for freelance</span>
        </div>

        {/* the links, as the memory bank flanking the die */}
        <div className={s.bank}>
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              target={l.sameTab ? undefined : "_blank"}
              rel={l.sameTab ? undefined : "noreferrer"}
              className={s.pkg}
              aria-label={l.label}
              data-pressed={pressed === l.id || undefined}
              onPointerDown={() => setPressed(l.id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
            >
              <span className={s.legend}>{l.legend}</span>
              <span className={s.tooltip}>{l.label}</span>
            </a>
          ))}
        </div>

        {/* the cooler */}
        <div className={s.fins} aria-hidden="true" />

        <div className={s.smd} aria-hidden="true" />

        {/* the main package */}
        <div className={s.die} aria-hidden="true">
          <i className={s.screw} data-c="tl" />
          <i className={s.screw} data-c="tr" />
          <i className={s.screw} data-c="bl" />
          <i className={s.screw} data-c="br" />
          <div className={s.lid}>
            <span className={s.mark}>S1</span>
            <span className={s.sub}>suhana grewal</span>
          </div>
        </div>

        <span className={s.silk} aria-hidden="true">
          SG-1 &middot; REV.A
        </span>

        {/* the pcie edge, meeting the bottom of the page */}
        <div className={s.fingers} aria-hidden="true" />
      </div>
    </div>
  );
}
