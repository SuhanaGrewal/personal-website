/* ── YOUR WORK ─────────────────────────────────────────────
   one entry per window. x/y/w/h are percentages of the
   display, laid out as a mosaic so nothing overlaps.

   `image` is the thumbnail and the shot in the opened view.
   drop a file at that path in public/projects/ — until you do,
   the gradient underneath shows through instead, so a missing
   image degrades quietly rather than breaking the window.
   ────────────────────────────────────────────────────────── */

export interface Section {
  heading: string;
  body: string;
}

export interface Project {
  id: string;
  /** shown in the title bar */
  title: string;
  kind: "project" | "finder";
  x: number;
  y: number;
  w: number;
  h: number;

  image?: string;
  oneLiner?: string;
  year?: string;
  role?: string;
  stack?: string[];
  sections?: Section[];
  links?: { label: string; href: string }[];

  /** finder only */
  files?: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "preface",
    title: "preface",
    kind: "project",
    x: 2.2,
    y: 6,
    w: 38,
    h: 52,
    image: "/projects/preface.png",
    oneLiner: "a cache eviction policy that learns what an agent will need next.",
    year: "2026",
    role: "Engineer",
    stack: ["Python", "XGBoost", "scikit-learn", "Ollama", "asyncio", "SQLite"],
    sections: [
      {
        heading: "the problem",
        body: "Agent workloads — multi-step tool use, orchestration — grow KV caches fast, and re-send large amounts of overlapping context on every step. Existing eviction policies decide what to drop from recency (LRU) or frequency (LFU) alone. Neither uses any signal about what the agent is actually doing.\n\nLRU performs near-optimally when the cache is large relative to the working set: there is enough room that eviction barely matters. Its accuracy degrades as cache pressure rises and recency stops predicting what is needed next.",
      },
      {
        heading: "the product",
        body: "A model that predicts each cached item's reuse likelihood from behavioural signals in the agent's execution trace — recency, position in the task's dependency graph (agent depth, fanout), task progress as a fraction of the DAG completed, and content and event features. An XGBoost classifier turns those into a reuse probability per item, which drives eviction.",
      },
      {
        heading: "the trade",
        body: "At larger cache sizes LRU is just as effective, and cheaper. So the shipped policy is hybrid: it measures live cache pressure — cache size against item count — and switches between the predictor and plain LRU as that pressure moves.",
      },
    ],
    links: [{ label: "github", href: "https://github.com/SuhanaGrewal/foresite" }],
  },

  /* ── the rest are scaffolding: same shape, your content ── */
  {
    id: "two",
    title: "project two",
    kind: "project",
    x: 2.2,
    y: 61,
    w: 38,
    h: 33,
    oneLiner: "one line on what it is.",
    year: "2026",
    role: "Engineer",
    stack: ["—"],
    sections: [
      { heading: "the problem", body: "what you hit." },
      { heading: "the product", body: "what you built." },
      { heading: "the trade", body: "what you gave up, and why." },
    ],
  },
  {
    id: "three",
    title: "project three",
    kind: "project",
    x: 42.2,
    y: 6,
    w: 23,
    h: 30,
    oneLiner: "one line on what it is.",
    year: "2026",
    role: "Engineer",
    stack: ["—"],
    sections: [{ heading: "the problem", body: "what you hit." }],
  },
  {
    id: "four",
    title: "project four",
    kind: "project",
    x: 42.2,
    y: 39,
    w: 23,
    h: 26,
    oneLiner: "one line on what it is.",
    year: "2026",
    role: "Engineer",
    stack: ["—"],
    sections: [{ heading: "the problem", body: "what you hit." }],
  },
  {
    id: "index",
    title: "projects",
    kind: "finder",
    x: 42.2,
    y: 68,
    w: 23,
    h: 26,
    files: ["preface", "project two", "project three", "project four", "archive/"],
  },
  {
    id: "five",
    title: "project five",
    kind: "project",
    x: 67.2,
    y: 6,
    w: 30.6,
    h: 88,
    oneLiner: "one line on what it is.",
    year: "2026",
    role: "Engineer",
    stack: ["—"],
    sections: [
      { heading: "the problem", body: "what you hit." },
      { heading: "the product", body: "what you built." },
    ],
  },
];
