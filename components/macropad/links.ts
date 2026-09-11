/* ── YOUR LINKS ────────────────────────────────────────────
   one entry per key. `legend` is what's printed on the cap —
   kept to the Magic Keyboard's own grammar (text on keycaps,
   not app icons), so this object reads as the same family
   rather than introducing a new visual language for six keys.

   TODO(suhana): only github is a real link below. swap the
   rest for your actual linkedin/x/substack/email/résumé.
   ────────────────────────────────────────────────────────── */

export interface KeyLink {
  id: string;
  /** printed on the keycap */
  legend: string;
  /** shown in the hover tooltip */
  label: string;
  href: string;
  /** opens in the same tab (mailto:, a download) rather than a new one */
  sameTab?: boolean;
}

export const LINKS: KeyLink[] = [
  { id: "github", legend: "gh", label: "github", href: "https://github.com/SuhanaGrewal" },
  { id: "linkedin", legend: "in", label: "linkedin", href: "#" },
  { id: "x", legend: "x", label: "x", href: "#" },
  { id: "substack", legend: "sub", label: "substack", href: "#" },
  { id: "email", legend: "@", label: "email", href: "mailto:you@example.com", sameTab: true },
  { id: "resume", legend: "cv", label: "résumé", href: "#", sameTab: true },
];
