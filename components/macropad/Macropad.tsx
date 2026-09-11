"use client";

import { useState } from "react";
import { LINKS } from "./links";
import s from "./Macropad.module.css";

/* the tiny live indicator on the status strip — the site's one accent,
   reused rather than introducing green for "available" the way most
   status UIs default to */
function StatusDot() {
  return <i className={s.statusDot} aria-hidden="true" />;
}

export function Macropad() {
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <div className={s.body}>
      {/* the one piece worth keeping from the reference — shrunk from
          its own separate pill into a strip integrated on the object */}
      <div className={s.strip}>
        <StatusDot />
        <span className={s.statusText}>available for freelance</span>
      </div>

      <div className={s.grid}>
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={l.href}
            target={l.sameTab ? undefined : "_blank"}
            rel={l.sameTab ? undefined : "noreferrer"}
            className={s.key}
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
    </div>
  );
}
