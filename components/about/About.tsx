import s from "./About.module.css";

export function About() {
  return (
    <section className={s.about}>
      <div className={s.copy}>
        <p className={s.name}>
          Hi, I&rsquo;m Suhana Grewal,{" "}
          <span className={s.ipa}>
            pronounced /su&bull;hahn&bull;ah: grey&bull;wahl/
          </span>
          .
        </p>

        <p className={s.bio}>
          I&rsquo;m a sophomore doing Econ &amp; CS @ UChicago, and an
          aspiring AI engineer. Lately I&rsquo;ve been deep into RAG, agentic
          memory, and inference optimization. When I get the time, I like to
          pair my AI projects with clean UI/UX (hence, a design nerd:). I
          also work on AI consulting projects, having interned with EY and
          180 Degrees Consulting on tech projects. In my free time, I enjoy
          producing music and compete as a national-level equestrian!
        </p>
      </div>

      <h2 className={s.heading}>
        <span>about</span>
        <span className={s.accent}>me</span>
      </h2>
    </section>
  );
}
