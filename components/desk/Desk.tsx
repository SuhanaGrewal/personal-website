"use client";

import { useEffect, useState } from "react";
import s from "./Desk.module.css";

/* ── YOUR WORK GOES HERE ───────────────────────────────────
   one entry per window. x/y/w/h are percentages of the
   display. they are laid out as a mosaic rather than a
   scattered pile, so nothing overlaps and the desktop is
   almost entirely covered.

   `blurb` and `tags` are what show once a window is opened
   full screen with the green button.
   ────────────────────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  kind: "finder" | "doc" | "media";
  x: number;
  y: number;
  w: number;
  h: number;
  lines?: string[];
  blurb: string;
  tags: string[];
}

/* a mosaic rather than a grid: three columns of different widths,
   and rows of different heights within them, so the windows vary in
   size the way a real desktop does — while still not overlapping. */
const PROJECTS: Project[] = [
  {
    id: "projects",
    title: "projects",
    kind: "finder",
    x: 2.2,
    y: 6,
    w: 38,
    h: 52,
    lines: ["readme.md", "moodboard.png", "demo.mov", "index.tsx", "notes.txt"],
    blurb: "everything, in one place.",
    tags: ["finder"],
  },
  {
    id: "readme",
    title: "readme.md",
    kind: "doc",
    x: 2.2,
    y: 61,
    w: 38,
    h: 33,
    lines: [
      "a thing i built, and why",
      "the part that was hard",
      "what i would do differently",
    ],
    blurb: "the write-up: what it is, why it exists, and what broke on the way.",
    tags: ["writing", "process"],
  },
  {
    id: "moodboard",
    title: "moodboard.png",
    kind: "media",
    x: 42.2,
    y: 6,
    w: 23,
    h: 30,
    blurb: "references, colour, type — where the look came from.",
    tags: ["design", "visual"],
  },
  {
    id: "notes",
    title: "notes.txt",
    kind: "doc",
    x: 42.2,
    y: 39,
    w: 23,
    h: 26,
    lines: ["ideas", "half-finished"],
    blurb: "the scratchpad. mostly bad ideas, occasionally not.",
    tags: ["notes"],
  },
  {
    id: "index",
    title: "index.tsx",
    kind: "doc",
    x: 42.2,
    y: 68,
    w: 23,
    h: 26,
    lines: ["export default", "  function Thing()"],
    blurb: "the code behind it.",
    tags: ["code"],
  },
  {
    id: "demo",
    title: "demo.mov",
    kind: "media",
    x: 67.2,
    y: 6,
    w: 30.6,
    h: 88,
    blurb: "the thing actually running.",
    tags: ["demo", "video"],
  },
];

const MENUS = ["Finder", "File", "Edit", "View", "Go", "Window", "Help"];

function AppleMark() {
  return (
    <svg className={s.apple} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.18-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.5z" />
      <path d="M14.9 6.1c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z" />
    </svg>
  );
}

/* the real day, date and time. rendered only after mount — the
   server has no idea what o'clock it is where you are, and
   putting a guess in the HTML would just cause a hydration
   mismatch a second later. */
function useClock() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const day = d.toLocaleDateString(undefined, { weekday: "short" });
      const month = d.toLocaleDateString(undefined, { month: "short" });
      const time = d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
      setNow(`${day} ${d.getDate()} ${month}  ${time}`);
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}

export function Desk() {
  const [open, setOpen] = useState<string | null>(null);
  const clock = useClock();

  return (
    <div className={s.imac}>
      {/* the machine itself */}
      <img className={s.shell} src="/imac.svg" alt="" aria-hidden="true" />

      {/* the display, positioned onto the artwork's screen area */}
      <div className={s.screen} data-fullscreen={open ? "true" : undefined}>
        <div className={s.wallpaper} aria-hidden="true" />

        <div className={s.menubar}>
          <AppleMark />
          {MENUS.map((m, i) => (
            <span key={m} className={i === 0 ? s.menuStrong : undefined}>
              {m}
            </span>
          ))}
          <span className={s.menuRight} suppressHydrationWarning>
            {clock}
          </span>
        </div>

        {PROJECTS.map((p) => {
          const isOpen = open === p.id;
          return (
            <article
              key={p.id}
              className={s.window}
              data-open={isOpen || undefined}
              data-dimmed={open && !isOpen ? "true" : undefined}
              style={{
                left: isOpen ? "0%" : `${p.x}%`,
                top: isOpen ? "0%" : `${p.y}%`,
                width: isOpen ? "100%" : `${p.w}%`,
                height: isOpen ? "100%" : `${p.h}%`,
                zIndex: isOpen ? 30 : 2,
              }}
            >
              <header className={s.titlebar}>
                <span className={s.lights}>
                  <button
                    type="button"
                    data-c="r"
                    aria-label="Close"
                    onClick={() => setOpen(null)}
                  />
                  <button
                    type="button"
                    data-c="y"
                    aria-label="Exit full screen"
                    onClick={() => setOpen(null)}
                  />
                  <button
                    type="button"
                    data-c="g"
                    aria-label={`Open ${p.title} full screen`}
                    onClick={() => setOpen(p.id)}
                  />
                </span>
                <span className={s.title}>{p.title}</span>
              </header>

              <div className={s.body}>
                {p.kind === "finder" ? (
                  <div className={s.finder}>
                    <div className={s.sidebar}>
                      {["recents", "work", "play", "archive"].map((r) => (
                        <span key={r} className={s.sideRow}>
                          <i className={s.sideDot} aria-hidden="true" />
                          {r}
                        </span>
                      ))}
                    </div>
                    <div className={s.files}>
                      {p.lines?.map((f) => (
                        <span key={f} className={s.fileRow}>
                          <i className={s.fileIcon} aria-hidden="true" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : p.kind === "media" ? (
                  <div className={s.mediaFrame} />
                ) : (
                  <div className={s.doc}>
                    {p.lines?.map((l) => (
                      <span key={l} className={s.textLine}>
                        {l}
                      </span>
                    ))}
                    <span className={s.rule} data-w="88" />
                    <span className={s.rule} data-w="72" />
                    <span className={s.rule} data-w="94" />
                    <span className={s.rule} data-w="52" />
                  </div>
                )}

                <div className={s.detail}>
                  <div className={s.detailMedia} />
                  <h3 className={s.detailTitle}>{p.title}</h3>
                  <p className={s.detailBlurb}>{p.blurb}</p>
                  <div className={s.tags}>
                    {p.tags.map((t) => (
                      <span key={t} className={s.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className={s.glare} aria-hidden="true" />
      </div>
    </div>
  );
}
