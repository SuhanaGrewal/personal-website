/* ── YOUR LINKS ────────────────────────────────────────────
   the keys on the deck that actually go somewhere.

   two keys can share one destination — G and H both read
   "github", C and V both read "résumé" — which is why the
   targets are defined once and the keys point at them by
   name rather than each carrying its own url.

   TODO(suhana): only github is real. swap the rest for your
   actual linkedin / x / substack / email / résumé.
   ────────────────────────────────────────────────────────── */

export interface Target {
  /** what the trackpad reads while the key is hovered */
  label: string;
  href: string;
  /** mailto: and downloads stay in this tab */
  sameTab?: boolean;
}

export type TargetName =
  | "linkedin"
  | "substack"
  | "github"
  | "x"
  | "resume"
  | "email";

/* annotated rather than inferred: with `satisfies`, an entry that
   omits sameTab has no such property in its narrowed type, so reading
   t.sameTab off the union fails to compile */
export const TARGETS: Record<TargetName, Target> = {
  linkedin: { label: "linkedin", href: "#" },
  substack: { label: "substack", href: "#" },
  github: { label: "github", href: "https://github.com/SuhanaGrewal" },
  x: { label: "x", href: "#" },
  resume: { label: "résumé", href: "#", sameTab: true },
  email: { label: "email", href: "mailto:you@example.com", sameTab: true },
};

/** key id → where it goes. ids match the layout the hero already uses. */
export const KEY_TARGETS: Record<string, TargetName> = {
  KeyI: "linkedin",
  Sub: "substack",
  KeyG: "github",
  KeyH: "github",
  KeyX: "x",
  KeyC: "resume",
  KeyV: "resume",
  KeyM: "email",
};

/** the few caps whose legend is replaced by a wordmark */
export const RELABEL: Record<string, string> = {
  KeyI: "IN",
  Sub: "SUB",
  KeyM: "@",
};
