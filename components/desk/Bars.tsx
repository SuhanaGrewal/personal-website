import c from "./Bars.module.css";

/* ============================================================
   foresite vs LRU, calibration set.

   drawn in the header diagram's own language — paper, dot grid,
   ink #16191c, grey #5f676e, JetBrains Mono labels — so the two
   graphics read as one pair.

   deliberately not a plotted chart: no axes and no gridlines,
   just two bars a row and the figures on them.
   ============================================================ */

const ROWS = [
  { cache: "1%", lru: 1.6, foresite: 4.0 },
  { cache: "2%", lru: 3.6, foresite: 6.0 },
  { cache: "3%", lru: 3.9, foresite: 6.5 },
  { cache: "4%", lru: 4.3, foresite: 8.8 },
  { cache: "5%", lru: 6.7, foresite: 11.2 },
];

const W = 1592;
const H = 680;
const BAR_X = 300;
const BAR_MAX = 1020;
const SCALE = 12; // % that fills BAR_MAX
const ROW_Y = 190;
const ROW_H = 84;

const INK = "#16191c";
const MID = "#5f676e";
const LIGHT = "#aab1b7";

const len = (v: number) => (v / SCALE) * BAR_MAX;

export function ForesiteBars() {
  return (
    <figure className={c.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="foresite versus LRU at tight cache sizes, calibration set">
        <desc>
          {ROWS.map((r) => `at ${r.cache} cache, LRU ${r.lru}%, foresite ${r.foresite}%`).join("; ")}
        </desc>

        <defs>
          <linearGradient id="barPaper" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#fbfbfc" />
            <stop offset="100%" stopColor="#eceef0" />
          </linearGradient>
          <pattern id="barGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="0.8" cy="0.8" r="0.75" fill="#b6bdc3" opacity="0.5" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="url(#barPaper)" />
        <rect width={W} height={H} fill="url(#barGrid)" opacity="0.45" />

        {/* the headline does the work a title would */}
        <text x={60} y={84} className={c.kicker} fill={MID}>
          WHEN THE CACHE IS TIGHT
        </text>
        <text x={60} y={140} className={c.headline} fill={INK}>
          foresite keeps more of what gets reused
        </text>

        {ROWS.map((r, i) => {
          const y = ROW_Y + i * ROW_H;
          return (
            <g key={r.cache}>
              <text x={60} y={y + 30} className={c.cache} fill={INK}>
                {r.cache}
              </text>
              <text x={60} y={y + 54} className={c.cacheSub} fill={LIGHT}>
                CACHE
              </text>

              <rect x={BAR_X} y={y} width={len(r.lru)} height={20} fill={LIGHT} rx={3} />
              <text x={BAR_X + len(r.lru) + 16} y={y + 16} className={c.value} fill={MID}>
                {r.lru}%
              </text>

              <rect x={BAR_X} y={y + 30} width={len(r.foresite)} height={20} fill={INK} rx={3} />
              <text x={BAR_X + len(r.foresite) + 16} y={y + 46} className={c.value} fill={INK}>
                {r.foresite}%
              </text>

            </g>
          );
        })}

        {/* the key, under the rows */}
        <g transform={`translate(${BAR_X} ${H - 46})`}>
          <rect width={26} height={12} y={-10} fill={LIGHT} rx={2} />
          <text x={38} y={0} className={c.legend} fill={MID}>LRU</text>
          <rect width={26} height={12} x={150} y={-10} fill={INK} rx={2} />
          <text x={188} y={0} className={c.legend} fill={INK}>foresite</text>
        </g>
      </svg>
    </figure>
  );
}
