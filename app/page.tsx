import { Hero } from "@/components/hero/Hero";
import { Desk } from "@/components/desk/Desk";
import s from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* the machine slides away to reveal this */}
      <section id="after-hero" className={s.work}>
        <h2 className={s.heading}>some stuff i&rsquo;ve made</h2>
        <div className={s.deskWrap}>
          <Desk />
        </div>
      </section>
    </main>
  );
}
