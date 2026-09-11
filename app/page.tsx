import { Hero } from "@/components/hero/Hero";
import { Desk } from "@/components/desk/Desk";
import { Chip } from "@/components/chip/Chip";
import s from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* the machine slides away to reveal this */}
      <section id="after-hero" className={s.work}>
        <h2 className={s.heading}>
          <span>some</span>
          <span className={s.accent}>stuff</span>
          <span>i&rsquo;ve</span>
          <span>made</span>
        </h2>

        <div className={s.deskWrap}>
          <Desk />
        </div>
      </section>

      {/* the closing beat: the same white as the work section, with a
          full-bleed accelerator card flush to the bottom of the page */}
      <section id="contact" className={s.contact}>
        <h2 className={s.contactHeading}>
          let&rsquo;s <span className={s.accent}>talk</span>
        </h2>

        {/* the glow the board sits in — a real block in the column, so
            the heading lands exactly on top of where it fades out */}
        <div className={s.glow} aria-hidden="true" />

        <Chip />
      </section>
    </main>
  );
}
