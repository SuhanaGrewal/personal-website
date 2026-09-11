import { Hero } from "@/components/hero/Hero";
import { Desk } from "@/components/desk/Desk";
import { Macropad } from "@/components/macropad/Macropad";
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

      {/* the closing beat: keyboard, then monitor, then this — a
          third, deliberately smaller hardware object */}
      <section className={s.contact}>
        <h2 className={s.contactHeading}>
          let&rsquo;s <span className={s.accent}>talk</span>
        </h2>
        <Macropad />
      </section>
    </main>
  );
}
