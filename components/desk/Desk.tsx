"use client";

import { useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "./projects";
import { ForesiteBars } from "./Bars";
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
/* the artwork sits on the paper it was drawn on, supplied here rather
   than inside the SVG — layered this way the two cannot disagree at any
   size, and `contain` leaves no band of a different colour */
const PAPER = "linear-gradient(145deg, #fbfbfc 0%, #eceef0 100%)";

function shot(p: Project) {
  return p.image
    ? {
        backgroundImage: `url(${p.image}), ${PAPER}`,
        backgroundSize: "contain, cover",
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: "center, center",
      }
    : undefined;
}

/* a muted, looping clip — used identically in the thumbnail and the
   opened view, so "the animation shows in both" is just this element
   rendering twice rather than two things to keep in sync. `cover`
   because a landing-page recording usually reads better full-bleed
   than letterboxed; switch to `contain` here if a given clip's crop
   looks wrong once it is in. */
function Clip({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // The `muted` JSX attribute is unreliable for autoplay in React: it
  // lands as the `defaultMuted` HTML attribute, and depending on paint
  // timing the browser can evaluate the mute policy before that has
  // taken effect as the live `.muted` property, silently refusing to
  // autoplay a video that LOOKS muted in the markup but was not, from
  // the browser's point of view, at the moment it checked. Setting it
  // imperatively and then calling play() is the reliable version.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    void v.play().catch(() => {
      /* a genuine autoplay block — leave it on its poster frame */
    });
  }, [src]);

  // Nothing in the UI ever pauses this on purpose (there are no visible
  // controls), so any pause is unintended — resume it.
  const onPause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    void e.currentTarget.play().catch(() => {});
  };

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="auto"
      onPause={onPause}
    />
  );
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
  if (p.video) {
    return (
      <div className={s.thumb}>
        <Clip src={p.video} poster={p.videoPoster} className={s.thumbVideo} />
      </div>
    );
  }
  return <div className={s.thumb} style={shot(p)} />;
}

function Detail({ p }: { p: Project }) {
  if (p.kind === "finder") return null;
  return (
    <div className={`${s.detail} ${s.scroller}`}>
      {p.video ? (
        <Clip src={p.video} poster={p.videoPoster} className={s.header} />
      ) : p.header ? (
        <img className={s.header} src={p.header} alt="" aria-hidden="true" />
      ) : null}

      {/* the lead: what the thing is, before the case study proper.
          foresite opens straight on `preface` because it has no such
          line; this renders only when one is set. */}
      {p.oneLiner ? <p className={s.lead}>{p.oneLiner}</p> : null}

      {p.sections?.map((sec) => (
        <section key={sec.heading} className={s.section}>
          <h4 className={s.sectionHeading}>{sec.heading}</h4>

          {sec.lines?.map((l) => (
            <p key={l} className={s.specLine}>
              {l}
            </p>
          ))}

          {sec.cols ? (
            <div className={s.specCols}>
              {sec.cols.map((col, i) => (
                <div key={i}>
                  {col.map((l) => (
                    <p key={l} className={s.specLine}>
                      {l}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : null}

          {sec.body?.split("\n\n").map((para, i) => (
            <p key={i} className={s.para}>
              {para}
            </p>
          ))}

          {sec.gallery?.map((row, i) => (
            <div key={i} className={s.galleryRow}>
              {row.map((img) => (
                <figure key={img.src} className={s.galleryItem}>
                  <img src={img.src} alt="" className={s.galleryImg} />
                  <figcaption className={s.galleryCaption}>
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </section>
      ))}

      {p.bars ? (
        <div className={s.chartBlock}>
          <ForesiteBars />
          <p className={s.chartCaption}>
            Percent of reusable context each policy actually kept in cache,
            across five cache sizes on the same benchmark traces. Every row is
            foresite ahead of plain LRU &mdash; the gap is biggest when the
            cache is tightest.
          </p>
        </div>
      ) : null}

      {p.links?.length ? (
        <section className={s.section}>
          <h4 className={s.sectionHeading}>try it</h4>
          <div className={s.links}>
            {p.links.map((l) => (
              <a
                key={l.href}
                className={s.link}
                href={l.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className={s.at}>@</span>
                {l.label}
                <svg
                  className={s.extIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 4h6v6" />
                  <path d="M20 4 11 13" />
                  <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      ) : null}
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
