/* ── YOUR WORK ─────────────────────────────────────────────
   one entry per window. x/y/w/h are percentages of the
   display, laid out as a mosaic so nothing overlaps.

   `image` is the thumbnail and the shot in the opened view.
   drop a file at that path in public/projects/ — until you do,
   the gradient underneath shows through instead, so a missing
   image degrades quietly rather than breaking the window.
   ────────────────────────────────────────────────────────── */

export interface GalleryImage {
  src: string;
  /** shown left-aligned under the image, same row it belongs to */
  caption: string;
}

export interface Section {
  heading: string;
  /** free prose; blank lines split paragraphs */
  body?: string;
  /** tight rows, for a spec list rather than prose */
  lines?: string[];
  /** the same, split into side-by-side columns */
  cols?: string[][];
  /** screenshots, laid out one row per inner array — a row of one
      runs the width of the column, a row of several share it equally
      and are resized to a common height so nothing looks mismatched */
  gallery?: GalleryImage[][];
  /** a feature list: each item's lead-in term set apart from its own
      description — tighter than prose, but a term + sentence rather
      than the bare label/value rows `lines` is for */
  list?: { term: string; body: string }[];
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
  /** the foresite vs LRU comparison graphic */
  bars?: boolean;
  /** a short muted looping clip of the thing in motion — same file
      renders in both the collapsed thumbnail and the opened view, so
      it reads as live everywhere without duplicating any setup.
      takes priority over `image` when both are set. */
  video?: string;
  /** shown until the video's own first frame is decoded */
  videoPoster?: string;
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
    x: 3,
    y: 3,
    w: 37.31,
    h: 53,
    image: "/projects/foresite-preview.svg",
    header: "/projects/foresite-header.svg",
    bars: true,
    sections: [
      {
        heading: "preface",
        cols: [
          ["Year: 2026", "Role: Engineer"],
          ["Languages: Python", "Tools: Ollama, XGBoost, asyncio, scikit-learn, SQLite"],
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

  {
    id: "ori",
    title: "ori",
    kind: "project",
    x: 3,
    y: 59,
    w: 41.47,
    h: 38,
    video: "/projects/ori-preview.mp4",
    videoPoster: "/projects/ori-preview-poster.jpg",
    oneLiner:
      "Ori is an agentic personal assistant. It answers questions about your emails, calendars, and events through a RAG system with 92% accuracy across 860 tests — and it can act: spawning agents to draft emails, schedule calendar events, flag potential fraud, and catch what you'd forget.",
    sections: [
      {
        heading: "preface",
        cols: [
          ["Year: 2026", "Role: Full-Stack Developer"],
          [
            "Languages: Python, JavaScript, SQL",
            "AI/ML: LangGraph, sentence-transformers, Presidio, spaCy, RAG",
          ],
        ],
      },
      {
        heading: "what it can do",
        list: [
          {
            term: "morning digests:",
            body: "a rundown of what changed while you were away, and what your day ahead looks like.",
          },
          {
            term: "proactive drafts:",
            body: "replies get drafted before you ask — not just answers when prompted.",
          },
          {
            term: "soft-commitment tracking:",
            body: "an “I’ll get back to you Friday” becomes a follow-up or a to-do item automatically.",
          },
          {
            term: "calendar management:",
            body: "flags overlaps, proposes reschedules, creates events.",
          },
        ],
      },
      {
        heading: "ui/ux preview",
        gallery: [
          [
            {
              src: "/projects/ori-ui-ask.webp",
              caption: "The landing screen: one question, answered from your own inbox and calendar.",
            },
          ],
          [
            {
              src: "/projects/ori-ui-digest.webp",
              caption: "A morning digest: what changed overnight, what's on the calendar.",
            },
            {
              src: "/projects/ori-ui-recent.webp",
              caption: "Recent threads, each auto-labelled with what it's actually about.",
            },
          ],
          [
            {
              src: "/projects/ori-ui-queue.webp",
              caption: "The approval queue: drafted replies and proposed reschedules, held until you approve them.",
            },
          ],
        ],
      },
      {
        heading: "how it’s different from what’s out there",
        list: [
          {
            term: "writes in your voice:",
            body: "it learns how you actually write to each person, so a drafted reply to your manager doesn’t sound like the one to a friend.",
          },
          {
            term: "reads inside your files:",
            body: "most systems stop at the message body — Ori extracts and indexes what’s in attachments too.",
          },
          {
            term: "retrieval and action in one pass:",
            body: "most tools either search your data or act on the web, so you have to bridge the two yourself. Ori’s agents skip that step, pulling from what it knows about you and finishing the task without you re-typing the context.",
          },
        ],
      },
      {
        heading: "what’s coming",
        lines: [
          "Multi-agent orchestration for complex, multi-step tasks — running your GTM, or planning your next trip.",
          "Text Ori on iMessage.",
          "Smarter threading that auto-clusters related questions into topics.",
        ],
      },
    ],
    links: [{ label: "tryori.vercel.app", href: "https://tryori.vercel.app" }],
  },
  {
    id: "ryng",
    title: "ryng",
    kind: "project",
    x: 43.31,
    y: 3,
    w: 53.69,
    h: 53,
    video: "/projects/ryng-preview.mp4",
    videoPoster: "/projects/ryng-preview-poster.jpg",
    oneLiner:
      "Ryng lets you give any AI agent a working phone number. It handles the hard parts — carrier connections, low-latency audio streaming, and a synchronized speech-to-text / LLM / text-to-speech pipeline. Developers integrate with a single webhook; everyone else can build a voice agent with a few clicks and some context.",
    sections: [
      {
        heading: "preface",
        cols: [
          ["Year: 2025", "Role: Full-stack developer"],
          [
            "Languages: JavaScript",
            "Tools: React, Tailwind CSS, Supabase, Node.js, PostgreSQL",
          ],
        ],
      },
      {
        heading: "the problem",
        body: "Before Ryng, giving an AI agent a phone number meant building a low-latency stack of telephony carriers, real-time audio streaming, and synchronized STT/LLM/TTS pipelines just to make a single call work. Ryng turns that into a webhook for developers, and a few clicks to create a customized voice agent with context for everyone else.",
      },
      {
        heading: "why it’s different from generic “automated phone call” tools",
        body: "Ryng closes the loop between commerce and conversation. Users can set up agents (or connect an existing one) and hook it up to a phone number in a few clicks.\n\nIts context pipeline lets users upload information the agent can reference during calls, and after each call, transcripts are run through an LLM to detect whether follow-up is needed (e.g. was an order placed?). The agent can then act on it automatically (e.g. sending an SMS with an order summary and payment details).\n\nDevelopers with existing AI/CRM logic can use Ryng as a telephony layer alone.",
      },
      {
        heading: "ui/ux preview",
        gallery: [
          [
            {
              src: "/projects/ryng-ui-templates.webp",
              caption: "Industry templates — a pre-built agent for common use cases, customisable after.",
            },
          ],
          [
            {
              src: "/projects/ryng-ui-new-agent.webp",
              caption: "Building an agent from scratch, with a template as a shortcut.",
            },
            {
              src: "/projects/ryng-ui-personality.webp",
              caption: "Tuning tone, voice, and availability once the agent exists.",
            },
          ],
        ],
      },
    ],
    links: [{ label: "ryng.online", href: "https://ryng.online" }],
  },
  {
    id: "three",
    title: "project three",
    kind: "project",
    x: 47.47,
    y: 59,
    w: 23.27,
    h: 38,
    sections: [{ heading: "the problem", body: "what you hit." }],
  },
  {
    id: "index",
    title: "projects",
    kind: "finder",
    x: 73.73,
    y: 59,
    w: 23.27,
    h: 38,
    files: ["foresite", "ori", "ryng", "project three", "archive/"],
  },
];
