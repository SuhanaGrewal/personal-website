"use client";

import { useState } from "react";
import { LINKS } from "./links";
import s from "./Chip.module.css";

/* an inference accelerator card, spanning nearly the full width of the
   page and cropped by the bottom of the viewport.

   the zones read left to right the way any piece of hardware does — a
   bank of parts, a cooler, the main package — except each one is a
   real thing a board like this has: the six memory packages on the
   left are the links, the fin stack in the middle is the cooler, the
   die sits under a brushed spreader on the right. black pcb and
   brushed metal, same material language as the keyboard and the imac.

   a run of identical discrete parts is rendered as real elements
   rather than a repeating gradient, because each one needs its own
   lit top edge and its own shadow — a gradient can only stripe, and a
   stripe reads as a fence rather than as a row of components. */
function Parts({ n, className }: { n: number; className: string }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

export function Chip() {
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <div className={s.card}>
      <div className={s.groundShadow} aria-hidden="true" />

      <div className={s.pcb}>
        {/* the board's own furniture. a bare stretch of pcb between the
            big parts is what makes a render look like a diagram, so the
            gaps carry what a real card carries: bulk caps, a power
            header, mounting holes, passives and reference designators */}
        <Parts n={22} className={s.capRow} />
        <Parts n={8} className={s.power} />
        <Parts n={5} className={s.smdTop} />
        <Parts n={9} className={s.smdLow} />
        <Parts n={4} className={s.smdLeft} />
        <i className={s.hole} data-c="tl" aria-hidden="true" />
        <i className={s.hole} data-c="tr" aria-hidden="true" />
        <span className={s.silkA} aria-hidden="true">C1&ndash;C24</span>
        <span className={s.silkB} aria-hidden="true">J1</span>

        {/* the packages sit in a milled recess, the way the reference's
            keys sit in a well rather than straight on the face — the
            depth reads as much from what is sunk in as what stands out */}
        <div className={s.well} aria-hidden="true" />

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
          <div className={s.lid} />
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
