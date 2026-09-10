/* ============================================================
   Function-row glyphs. 24x24 viewBox, currentColor, hairline
   strokes so they hold up at ~11px on the real cap.
   ============================================================ */

import type { IconName } from "./layout";

type P = { className?: string };

const sunRays = (r: number, len: number) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const x = 12 + Math.cos(a) * r;
    const y = 12 + Math.sin(a) * r;
    const x2 = 12 + Math.cos(a) * (r + len);
    const y2 = 12 + Math.sin(a) * (r + len);
    return <line key={i} x1={x} y1={y} x2={x2} y2={y2} />;
  });

const Svg = ({ children, className }: P & { children: React.ReactNode }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const speaker = (
  <path d="M4 9.5h3L11 6v12l-4-3.5H4z" fill="currentColor" stroke="none" />
);

export const ICONS: Record<IconName, (p: P) => React.ReactElement> = {
  brightnessLow: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      {sunRays(5.5, 2)}
    </Svg>
  ),

  brightnessHigh: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="4.6" fill="currentColor" stroke="none" />
      {sunRays(7, 2.6)}
    </Svg>
  ),

  missionControl: (p) => (
    <Svg {...p}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
      <rect x="5" y="7.6" width="6" height="4" rx="1" fill="currentColor" stroke="none" />
      <rect x="13" y="7.6" width="6" height="4" rx="1" fill="currentColor" stroke="none" />
      <rect x="8.5" y="13.4" width="7" height="3.4" rx="1" fill="currentColor" stroke="none" />
    </Svg>
  ),

  spotlight: (p) => (
    <Svg {...p}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.4" y1="15.4" x2="20.5" y2="20.5" />
    </Svg>
  ),

  dictation: (p) => (
    <Svg {...p}>
      <rect x="9" y="2.5" width="6" height="11.5" rx="3" fill="currentColor" stroke="none" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <line x1="12" y1="18" x2="12" y2="21.5" />
    </Svg>
  ),

  doNotDisturb: (p) => (
    <Svg {...p}>
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  ),

  prev: (p) => (
    <Svg {...p}>
      <rect x="3.5" y="5.5" width="2" height="13" rx="0.8" fill="currentColor" stroke="none" />
      <path d="M20.5 6.6v10.8L12.6 12z" fill="currentColor" stroke="none" />
      <path d="M12.4 6.6v10.8L4.5 12z" fill="currentColor" stroke="none" />
    </Svg>
  ),

  /* the hero's power button: play triangle + pause bars */
  playPause: (p) => (
    <Svg {...p}>
      <path d="M3.5 5.4v13.2L14 12z" fill="currentColor" stroke="none" />
      <rect x="16" y="5.4" width="2.6" height="13.2" rx="0.9" fill="currentColor" stroke="none" />
      <rect x="20.4" y="5.4" width="2.6" height="13.2" rx="0.9" fill="currentColor" stroke="none" />
    </Svg>
  ),

  next: (p) => (
    <Svg {...p}>
      <path d="M3.5 6.6v10.8L11.4 12z" fill="currentColor" stroke="none" />
      <path d="M11.6 6.6v10.8L19.5 12z" fill="currentColor" stroke="none" />
      <rect x="18.5" y="5.5" width="2" height="13" rx="0.8" fill="currentColor" stroke="none" />
    </Svg>
  ),

  mute: (p) => (
    <Svg {...p}>
      {speaker}
      <line x1="14.5" y1="9" x2="20.5" y2="15" />
      <line x1="20.5" y1="9" x2="14.5" y2="15" />
    </Svg>
  ),

  volDown: (p) => (
    <Svg {...p}>
      {speaker}
      <path d="M14.2 9.4a3.6 3.6 0 0 1 0 5.2" />
    </Svg>
  ),

  volUp: (p) => (
    <Svg {...p}>
      {speaker}
      <path d="M14.2 9.4a3.6 3.6 0 0 1 0 5.2" />
      <path d="M17.4 6.6a7.6 7.6 0 0 1 0 10.8" />
    </Svg>
  ),

  globe: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.6" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8.6" />
      <line x1="3.6" y1="9.2" x2="20.4" y2="9.2" />
      <line x1="3.6" y1="14.8" x2="20.4" y2="14.8" />
    </Svg>
  ),

  touchId: (p) => (
    <Svg {...p} >
      <path d="M12 4.2c-4.3 0-7.8 3.5-7.8 7.8v2.4" />
      <path d="M19.8 12c0-4.3-3.5-7.8-7.8-7.8" />
      <path d="M8.1 12a3.9 3.9 0 0 1 7.8 0v4.2" />
      <path d="M12 12v5.4" />
      <path d="M15.9 18.6v1.2" />
      <path d="M8.1 15.6v2.4" />
    </Svg>
  ),
};

export function KeyIcon({ name, className }: { name: IconName; className?: string }) {
  const Cmp = ICONS[name];
  return <Cmp className={className} />;
}
