/* the mouse, drawn rather than approximated.

   css can gradient a rounded rectangle; it cannot give the shell the
   curve it actually has, nor a specular that follows that curve. so
   this is a real silhouette with layered gradients over it — the same
   thing that makes the imac read as a photograph rather than a div. */
export function MagicMouse({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 420"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* the anodised shell, lit from above */}
        <linearGradient id="mm-shell" x1="70" y1="0" x2="120" y2="430"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5c5c65" />
          <stop offset="0.13" stopColor="#4a4a53" />
          <stop offset="0.42" stopColor="#33333a" />
          <stop offset="0.72" stopColor="#232329" />
          <stop offset="1" stopColor="#15161a" />
        </linearGradient>

        {/* the long soft specular down the upper left of the dome */}
        <radialGradient id="mm-spec" cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(74 96) rotate(72) scale(132 60)">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {/* the bounce the right flank picks up off the desk */}
        <radialGradient id="mm-bounce" cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(168 250) rotate(96) scale(150 40)">
          <stop offset="0" stopColor="#fff" stopOpacity="0.13" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {/* the shell turns under at the base and loses the light */}
        <linearGradient id="mm-foot" x1="100" y1="300" x2="100" y2="416"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>

        {/* the bright arris running right around the rim */}
        <linearGradient id="mm-rim" x1="100" y1="4" x2="100" y2="416"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.75" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.14" />
        </linearGradient>

        <path id="mm-body"
          d="M100 4 C153 4 187 40 191 94 C195 150 195 252 191 310
             C187 378 153 416 100 416 C47 416 13 378 9 310
             C5 252 5 150 9 94 C13 40 47 4 100 4 Z" />

        <clipPath id="mm-clip">
          <use href="#mm-body" />
        </clipPath>
      </defs>

      {/* the shadow it casts on the desk, offset and softened */}
      <ellipse cx="103" cy="410" rx="92" ry="24" fill="#0e1016"
        opacity="0.34" filter="blur(13px)" />

      <use href="#mm-body" fill="url(#mm-shell)" />

      <g clipPath="url(#mm-clip)">
        <rect width="200" height="420" fill="url(#mm-spec)" />
        <rect width="200" height="420" fill="url(#mm-bounce)" />
        <rect width="200" height="420" fill="url(#mm-foot)" />

        {/* the seam where the touch surface meets the shell */}
        <path d="M26 112 C60 104 140 104 174 112" stroke="#000"
          strokeOpacity="0.3" strokeWidth="1.6" fill="none" />
        <path d="M26 113.4 C60 105.4 140 105.4 174 113.4" stroke="#fff"
          strokeOpacity="0.07" strokeWidth="1" fill="none" />
      </g>

      <use href="#mm-body" fill="none" stroke="url(#mm-rim)" strokeWidth="1.6" />

      {/* the mark, low on the back the way it sits on the real one */}
      <g transform="translate(100 316) scale(1.42) translate(-12 -12)"
        fill="#fff" fillOpacity="0.22">
        <path d="M17.05 12.54c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.71-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.18-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.5z" />
        <path d="M14.9 6.1c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z" />
      </g>
    </svg>
  );
}
