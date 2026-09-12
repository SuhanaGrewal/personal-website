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
/* the note posts to /api/message, which mails it to suhana from the
   server — nothing opens on the visitor's side. false on any failure
   so the composer can say so instead of pretending it went. */
async function deliver(message: string): Promise<boolean> {
  try {
    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

interface Props {
  /** light the matching cap on the machine as each key is struck */
  onType?: (code: string) => void;
}

export function Composer({ onType }: Props) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const ready = value.trim().length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;

    setBusy(true);
    setFailed(false);
    const ok = await deliver(value.trim());
    setBusy(false);
    if (!ok) {
      // keep what they typed; just say it didn't go
      setFailed(true);
      window.setTimeout(() => setFailed(false), 3200);
      return;
    }

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
        placeholder={
          sent ? "sent to suhana" : failed ? "didn’t send — try again?" : "don’t be shy, say hi!"
        }
        aria-label="Send Suhana a message"
        data-sent={sent || undefined}
        data-failed={failed || undefined}
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
