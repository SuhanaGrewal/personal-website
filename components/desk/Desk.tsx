"use client";

import { useState } from "react";
import s from "./Desk.module.css";

/* ── YOUR WORK GOES HERE ───────────────────────────────────
   one entry per window. x/y/w/h are percentages of the
   display, so the whole arrangement scales with the screen.
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
  z: number;
  lines?: string[];
  blurb: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    id: "projects",
    title: "projects",
    kind: "finder",
    x: 4,
    y: 13,
    w: 37,
    h: 40,
    z: 3,
    lines: ["readme.md", "moodboard.png", "demo.mov", "index.tsx"],
    blurb: "everything, in one place.",
    tags: ["finder"],
  },
  {
    id: "readme",
    title: "readme.md",
    kind: "doc",
    x: 27,
    y: 33,
    w: 34,
    h: 38,
    z: 5,
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
    x: 57,
    y: 10,
    w: 33,
    h: 34,
    z: 4,
    blurb: "references, colour, type — where the look came from.",
    tags: ["design", "visual"],
  },
  {
    id: "notes",
    title: "notes.txt",
    kind: "doc",
    x: 9,
    y: 52,
    w: 29,
    h: 32,
    z: 6,
    lines: ["ideas", "half-finished", "someday"],
    blurb: "the scratchpad. mostly bad ideas, occasionally not.",
    tags: ["notes"],
  },
  {
    id: "demo",
    title: "demo.mov",
    kind: "media",
    x: 62,
    y: 47,
    w: 30,
    h: 33,
    z: 7,
    blurb: "the thing actually running.",
    tags: ["demo", "video"],
  },
];

export function Desk() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={s.imac}>
      <div className={s.panel}>
        <i className={s.camera} aria-hidden="true" />

        <div className={s.screen} data-fullscreen={open ? "true" : undefined}>
          <div className={s.wallpaper} aria-hidden="true" />

          <div className={s.menubar}>
            <span className={s.menuStrong}>Finder</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
            <span className={s.menuRight}>Thu 17:52</span>
          </div>

          {PROJECTS.map((p) => {
            const isOpen = open === p.id;
            return (
              <article
                key={p.id}
                className={s.window}
                data-open={isOpen || undefined}
                data-dimmed={open && !isOpen ? "true" : undefined}
                style={
                  isOpen
                    ? undefined
                    : {
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.w}%`,
                        height: `${p.h}%`,
                        zIndex: p.z,
                      }
                }
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

                  {/* only read once the window is opened out */}
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

          <div className={s.dock} aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i} className={s.dockIcon} data-i={i} />
            ))}
          </div>

          <div className={s.glare} aria-hidden="true" />
        </div>
      </div>

      <div className={s.neck} aria-hidden="true" />
      <div className={s.foot} aria-hidden="true" />
    </div>
  );
}
