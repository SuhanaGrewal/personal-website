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

export function Composer() {
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
    <form className={s.composer} onSubmit={onSubmit}>
      <svg
        className={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="10.6" cy="10.6" r="6.6" />
        <path d="m15.5 15.5 4.6 4.6" />
      </svg>

      <input
        className={s.input}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={sent ? "thanks — that reached me" : "send me a message"}
        aria-label="Send Suhana a message"
        data-sent={sent || undefined}
        maxLength={1000}
      />

      {/* the send key only appears once there is something to send */}
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
