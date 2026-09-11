"use client";

import { useState } from "react";
import { SOCIAL_LINKS, type Bitmap } from "./icons";
import s from "./About.module.css";

/* the shelves in the board photograph, measured off the image itself:
   every one spans x 2.96%–44.17% of the board's width and their top
   surfaces run from 23.43% to 25.84% (and the three below at 24.07%
   intervals). a frame stands on the middle of that surface rather than
   on its back edge, which is what makes it read as resting on the
   plank instead of hovering in front of it. */
const SHELF_TOPS = [24.7, 48.77, 72.75, 96.64];
const SHELF_CENTRE = 23.52;

/* the picture inside each frame: a grid of dots, the on ones glowing
   blue. the off ones stay faintly visible — a dot-matrix picture reads
   as one because you can see the pixels that aren't lit. */
function PixelFace({ bitmap }: { bitmap: Bitmap }) {
  return (
    <span className={s.pixelGrid}>
      {bitmap.map((row, r) =>
        row.split("").map((cell, c) => (
          <i
            key={`${r}-${c}`}
            className={s.pixel}
            data-lit={cell === "#" || undefined}
          />
        )),
      )}
    </span>
  );
}

export function About() {
  const [hot, setHot] = useState<string | null>(null);

  return (
    <section className={s.about}>
      <div className={s.inner}>
        <div className={s.board}>
          <img
            className={s.boardImg}
            src="/about-board.webp"
            alt=""
            aria-hidden="true"
          />

          {SOCIAL_LINKS.map((link, i) => (
            <a
              key={link.id}
              className={s.slot}
              style={
                {
                  "--shelf-bottom": `${100 - SHELF_TOPS[i]}%`,
                  "--shelf-centre": `${SHELF_CENTRE}%`,
                } as React.CSSProperties
              }
              href={link.href}
              target={link.sameTab ? undefined : "_blank"}
              rel={link.sameTab ? undefined : "noreferrer"}
              aria-label={link.label}
              data-hot={hot === link.id || undefined}
              onPointerEnter={() => setHot(link.id)}
              onPointerLeave={() => setHot(null)}
              onFocus={() => setHot(link.id)}
              onBlur={() => setHot(null)}
            >
              {/* a polished chrome picture frame standing on the shelf,
                  with the logo inside it as a pixel photograph */}
              <span className={s.frame}>
                <span className={s.mat}>
                  <PixelFace bitmap={link.icon} />
                </span>
              </span>
              <span className={s.tip}>{link.label}</span>
            </a>
          ))}
        </div>

        <div className={s.copy}>
          <h2 className={s.heading}>
            <span>about</span>
            <span className={s.accent}>me</span>
          </h2>

          <p className={s.name}>
            Hi, I&rsquo;m Suhana Grewal,{" "}
            <span className={s.ipa}>
              pronounced /su&bull;hahn&bull;ah: grey&bull;wahl/
            </span>
            .
          </p>

          <p className={s.bio}>
            I&rsquo;m a sophomore at UChicago studying Econ &amp; CS, and an
            aspiring AI engineer. Lately I&rsquo;ve been deep into RAG,
            agentic memory, and inference optimization. When I get the time,
            I like to pair my AI projects with clean UI/UX (hence, a design
            nerd).
          </p>

          <p className={s.bio}>
            I also work a lot on consulting projects, having interned with
            EY and 180 Degrees Consulting on AI-related work.
          </p>

          <p className={s.bio}>
            In my free time, I enjoy producing music and compete as a
            national-level equestrian.
          </p>
        </div>
      </div>
    </section>
  );
}
