import { Hero } from "@/components/hero/Hero";
import { Desk } from "@/components/desk/Desk";
import { Laptop } from "@/components/laptop/Laptop";
import { About } from "@/components/about/About";
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

      <About />

      {/* the closing beat: the same white as the work section, with a
          space grey machine whose live keys are the links */}
      <section id="contact" className={s.contact}>
        <Laptop
          heading={
            <h2 className={s.contactHeading}>
              let&rsquo;s
              <span className={s.accent}>talk</span>
            </h2>
          }
        />
      </section>

      {/* the last word: one line to leave on, and the small print */}
      <footer className={s.footer}>
        <p className={s.quote}>
          If the universe put the dream in your heart, it has every intention
          for you to make it happen.
        </p>
        <p className={s.copyright}>&copy; 2026 Suhana Grewal</p>
      </footer>
    </main>
  );
}
