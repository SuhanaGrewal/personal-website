"use client";

import { useMemo, useState } from "react";
import { LINKS } from "./links";
import s from "./Chip.module.css";

/* a large chip package, viewed from above. the lid sits over the
   upper portion of a dense contact-pad field; almost all of those
   pads are inert texture — real density, the way a real package's
   pinout is mostly not individually meaningful — and exactly six,
   in a single row just below the lid, are actual links. */

const COLS = 18;
const ROWS = 14;
/* the row the real pads sit in — close enough to the lid to be the
   first thing you notice, far enough that the bottom rows are free
   to run on as pure texture past the edge of the viewport */
const LINK_ROW = 6;

function linkSlots(count: number) {
  // evenly spaced across the row, with a margin so none sit at the
  // very edge of the grid
  const margin = 1.5;
  const span = COLS - 1 - margin * 2;
  return Array.from({ length: count }, (_, i) =>
    Math.round(margin + (span * i) / (count - 1)),
  );
}

export function Chip() {
  const [pressed, setPressed] = useState<string | null>(null);

  const cells = useMemo(() => {
    const cols = linkSlots(LINKS.length);
    const linkByCol = new Map(cols.map((c, i) => [c, LINKS[i]]));

    return Array.from({ length: COLS * ROWS }, (_, i) => {
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      const link = row === LINK_ROW ? linkByCol.get(col) : undefined;
      return { key: i, link };
    });
  }, []);

  return (
    <div className={s.chip}>
      <div className={s.grid} style={{ ["--cols" as string]: COLS }}>
        {cells.map(({ key, link }) =>
          link ? (
            <a
              key={key}
              href={link.href}
              target={link.sameTab ? undefined : "_blank"}
              rel={link.sameTab ? undefined : "noreferrer"}
              className={s.padLink}
              aria-label={link.label}
              data-pressed={pressed === link.id || undefined}
              onPointerDown={() => setPressed(link.id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
            >
              <span className={s.padLegend}>{link.legend}</span>
              <span className={s.padTooltip}>{link.label}</span>
            </a>
          ) : (
            <i key={key} className={s.pad} aria-hidden="true" />
          ),
        )}
      </div>

      <div className={s.lid}>
        <svg className={s.traces} viewBox="0 0 400 200" aria-hidden="true">
          <path d="M0 100 H140 M260 100 H400" />
          <path d="M60 0 V60 M60 60 H340 M340 60 V0" />
          <path d="M340 200 V140 M340 140 H60 M60 140 V200" />
          <path d="M200 0 V45 M200 155 V200" />
        </svg>
        <span className={s.mark}>S1</span>
      </div>
    </div>
  );
}
