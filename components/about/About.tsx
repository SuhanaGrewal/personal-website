"use client";

import { useState } from "react";
import { SOCIAL_LINKS, type Bitmap } from "./icons";
import s from "./About.module.css";

/* the shelves in the board photograph, measured off the image itself:
   every one spans x 2.96%–44.17% of the board's width and their top
   surfaces sit at these heights, so a block's base can be set to land
   on the surface rather than floated near it by eye. */
const SHELF_TOPS = [23.43, 47.5, 71.48, 95.37];
const SHELF_CENTRE = 23.52;

/* the lit face: a grid of dots, the on ones glowing blue. the dark
   ones are left visible at low contrast — an LED panel reads as a
   panel because you can see the pixels that aren't lit. */
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
              {/* a real box: a lit front face, and a side wall folded
                  back 90° at its right edge so the block has depth
                  from this angle rather than being a flat square */}
              <span className={s.block}>
                <span className={s.face}>
                  <PixelFace bitmap={link.icon} />
                </span>
                <span className={s.side} aria-hidden="true" />
                <span className={s.top} aria-hidden="true" />
                <span className={s.ground} aria-hidden="true" />
              </span>
              <span className={s.tip}>{link.label}</span>
            </a>
          ))}
        </div>

        <div className={s.copy}>
          <h2 className={s.heading}>
            about <span className={s.accent}>me</span>
          </h2>

          <p className={s.name}>
            My name is Suhana Grewal{" "}
            <span className={s.ipa}>
              pronounced /su&bull;hahn&bull;ah: grey&bull;wahl/
            </span>
          </p>

          <p className={s.bio}>
            I&rsquo;m a sophomore @ uchicago studying econ &amp; cs and an
            aspiring AI engineer who&rsquo;s lately been deep into RAG,
            agentic memory, and inference optimization. When I have the
            time, I like to hook up cool ui/ux to my AI projects (hence
            half a design nerd).
          </p>

          <p className={s.bio}>
            I also work a lot on consulting projects, having interned with
            EY and 180 Degrees for AI-related consulting.
          </p>

          <p className={s.bio}>
            In my free time I enjoy producing music and compete as a
            national-level equestrian.
          </p>
        </div>
      </div>
    </section>
  );
}
