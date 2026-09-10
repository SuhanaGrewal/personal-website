"use client";

import { useState } from "react";
import s from "./Composer.module.css";

/* ── WIRING UP DELIVERY ────────────────────────────────────
   nothing leaves the browser yet. when you want it to, this is
   the only function that changes — post to an API route, a form
   service, whatever you pick. it returns true on success so the
   UI can acknowledge it.

   async function deliver(message: string) {
     const res = await fetch("/api/message", {
       method: "POST",
       headers: { "content-type": "application/json" },
       body: JSON.stringify({ message }),
     });
     return res.ok;
   }
   ────────────────────────────────────────────────────────── */
async function deliver(message: string): Promise<boolean> {
  // eslint-disable-next-line no-console
  console.log("[composer] not wired up yet, message was:", message);
  return true;
}

interface Props {
  /** light the matching cap on the machine as each key is struck */
  onType?: (code: string) => void;
}

export function Composer({ onType }: Props) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const ready = value.trim().length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;

    setBusy(true);
    const ok = await deliver(value.trim());
    setBusy(false);
    if (!ok) return;

    setValue("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2800);
  }

  return (
    <form className={s.composer} onSubmit={onSubmit} data-open={ready || undefined}>
      <input
        className={s.input}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          // e.code lines up with the cap ids on the machine
          onType?.(e.code);
          if (e.shiftKey) onType?.("ShiftLeft");
        }}
        placeholder={sent ? "thanks :)" : "say hi"}
        aria-label="Send Suhana a message"
        data-sent={sent || undefined}
        maxLength={1000}
      />

      {/* a keycap, borrowed from the machine below */}
      <button
        type="submit"
        className={s.send}
        data-ready={ready || undefined}
        disabled={!ready || busy}
        aria-label="Send"
      >
        <span aria-hidden="true">⏎</span>
      </button>
    </form>
  );
}
