/* ── YOUR LINKS ────────────────────────────────────────────
   one entry per contact pad. `legend` is what's etched on the
   pad — short, matching a real chip's own printed pin labels.

   TODO(suhana): only github is a real link below. swap the
   rest for your actual linkedin/x/substack/email/résumé.
   ────────────────────────────────────────────────────────── */

export interface PadLink {
  id: string;
  legend: string;
  label: string;
  href: string;
  /** opens in the same tab (mailto:, a download) rather than a new one */
  sameTab?: boolean;
}

export const LINKS: PadLink[] = [
  { id: "github", legend: "GH", label: "github", href: "https://github.com/SuhanaGrewal" },
  { id: "linkedin", legend: "IN", label: "linkedin", href: "#" },
  { id: "x", legend: "X", label: "x", href: "#" },
  { id: "substack", legend: "SUB", label: "substack", href: "#" },
  { id: "email", legend: "@", label: "email", href: "mailto:you@example.com", sameTab: true },
  { id: "resume", legend: "CV", label: "résumé", href: "#", sameTab: true },
];
