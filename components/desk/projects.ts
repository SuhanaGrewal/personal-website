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
  /** free prose; blank lines split paragraphs */
  body?: string;
  /** tight rows, for a spec list rather than prose */
  lines?: string[];
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
  /** wide artwork across the top of the opened view */
  header?: string;
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
    id: "foresite",
    title: "foresite",
    kind: "project",
    x: 2.2,
    y: 6,
    w: 38,
    h: 52,
    image: "/projects/foresite.png",
    header: "/projects/foresite-header.svg",
    sections: [
      {
        heading: "preface",
        lines: [
          "Year: 2026",
          "Role: Engineer",
          "Languages: Python",
          "Tools: Ollama, XGBoost, asyncio, scikit-learn, SQLite",
        ],
      },
      {
        heading: "the problem",
        body: "Agent workloads comprising multi-step tool use and agent orchestration grow KV caches fast, and re-send large amounts of overlapping context on every step. Existing eviction policies decide what to evict based purely on recency (LRU) or frequency (LFU) of information use. Neither uses any signal about what an agent is actually doing.\n\nLRU performs near-optimally when the cache is large relative to the working set: there's enough room that eviction decisions barely matter. Its accuracy degrades as cache pressure increases and recency alone becomes a poor predictor of what's needed next.",
      },
      {
        heading: "the product",
        body: "A model that predicts each cached item's reuse likelihood using behavioral signals from the agent's execution trace like recency, position in the task's dependency graph (agent depth, fanout), task progress (DAG completion fraction), and content/event features. These features train an XGBoost classifier that outputs a reuse probability per item, which drives eviction.",
      },
      {
        heading: "the trade",
        body: "In higher cache sizes though LRU is just as effective and cheaper.\n\nSo, the final solution is a hybrid eviction algorithm that measures live cache pressure (cache size relative to number of items) and adaptively switches between the predictor and standard LRU.",
      },
    ],
    links: [
      { label: "git/foresite", href: "https://github.com/SuhanaGrewal/foresite" },
    ],
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
    sections: [
      { heading: "preface", lines: ["Year: 2026", "Role: Engineer"] },
      { heading: "the problem", body: "what you hit." },
      { heading: "the product", body: "what you built." },
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
    files: ["foresite", "project two", "project three", "project four", "archive/"],
  },
  {
    id: "five",
    title: "project five",
    kind: "project",
    x: 67.2,
    y: 6,
    w: 30.6,
    h: 88,
    sections: [{ heading: "the problem", body: "what you hit." }],
  },
];
