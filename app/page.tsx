import { Hero } from "@/components/hero/Hero";
import s from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* the machine tips away to reveal this. sections to be
          designed in the next round — this is the landing pad
          so the ▼ key has somewhere real to go. */}
      <section id="after-hero" className={s.next}>
        <p className={s.eyebrow}>01 — selected work</p>
        <h2 className={s.heading}>Still building this part.</h2>
      </section>
    </main>
  );
}
