"use client";

import { useEffect, useState } from "react";
import { PROJECTS, type Project } from "./projects";
import s from "./Desk.module.css";

const MENUS = ["Finder", "File", "Edit", "View", "Go", "Window", "Help"];

function AppleMark() {
  return (
    <svg className={s.apple} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.18-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.5z" />
      <path d="M14.9 6.1c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z" />
    </svg>
  );
}

/* the real day, date and time. rendered only after mount — the server
   has no idea what o'clock it is where you are, and putting a guess in
   the HTML would just cause a hydration mismatch a second later. */
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

/* the image sits as a background over a gradient, so a project with no
   shot yet shows the gradient instead of a broken-image icon */
function shot(p: Project) {
  return p.image
    ? { backgroundImage: `url(${p.image})` }
    : undefined;
}

function Collapsed({ p }: { p: Project }) {
  if (p.kind === "finder") {
    return (
      <div className={s.finder}>
        <div className={`${s.sidebar} ${s.scroller}`}>
          {["recents", "work", "play", "archive"].map((r) => (
            <span key={r} className={s.sideRow}>
              <i className={s.sideDot} aria-hidden="true" />
              {r}
            </span>
          ))}
        </div>
        <div className={`${s.files} ${s.scroller}`}>
          {p.files?.map((f) => (
            <span key={f} className={s.fileRow}>
              <i className={s.fileIcon} aria-hidden="true" />
              {f}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return <div className={s.thumb} style={shot(p)} />;
}

function Detail({ p }: { p: Project }) {
  if (p.kind === "finder") return null;
  return (
    <div className={s.detail}>
      <div className={s.detailShot} style={shot(p)} />

      <div className={`${s.detailText} ${s.scroller}`}>
        <h3 className={s.detailTitle}>{p.title}</h3>
        {p.oneLiner ? <p className={s.oneLiner}>{p.oneLiner}</p> : null}

        <dl className={s.meta}>
          {p.year ? (
            <>
              <dt>year</dt>
              <dd>{p.year}</dd>
            </>
          ) : null}
          {p.role ? (
            <>
              <dt>role</dt>
              <dd>{p.role}</dd>
            </>
          ) : null}
          {p.stack ? (
            <>
              <dt>stack</dt>
              <dd>{p.stack.join(" · ")}</dd>
            </>
          ) : null}
        </dl>

        {p.sections?.map((sec) => (
          <section key={sec.heading} className={s.section}>
            <h4 className={s.sectionHeading}>{sec.heading}</h4>
            {sec.body.split("\n\n").map((para, i) => (
              <p key={i} className={s.para}>
                {para}
              </p>
            ))}
          </section>
        ))}

        {p.links?.length ? (
          <div className={s.links}>
            {p.links.map((l) => (
              <a
                key={l.href}
                className={s.link}
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Desk() {
  const [open, setOpen] = useState<string | null>(null);
  const clock = useClock();

  return (
    <div className={s.imac}>
      <img className={s.shell} src="/imac.svg" alt="" aria-hidden="true" />

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
                  <button type="button" data-c="r" aria-label="Close" onClick={() => setOpen(null)} />
                  <button type="button" data-c="y" aria-label="Exit full screen" onClick={() => setOpen(null)} />
                  <button
                    type="button"
                    data-c="g"
                    aria-label={`Open ${p.title}`}
                    onClick={() => setOpen(p.id)}
                    disabled={p.kind === "finder"}
                  />
                </span>
                <span className={s.title}>{p.title}</span>
              </header>

              <div className={s.body}>
                <Collapsed p={p} />
                {isOpen ? <Detail p={p} /> : null}
              </div>
            </article>
          );
        })}

        <div className={s.glare} aria-hidden="true" />
      </div>
    </div>
  );
}
