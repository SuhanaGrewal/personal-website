import c from "./Chart.module.css";

/* ============================================================
   foresite: reuse captured vs cache size.

   both panels share ONE y scale — the fresh set genuinely sits
   lower, and rescaling it to fill its own panel would flatter
   it. the point of the second panel is that the shape holds on
   data the model never saw, not that the numbers match.

   the calibration panel carries all three policies; the fresh
   panel carries only what shipped (hybrid) against the baseline
   it has to beat (LRU).

   palette: #1A6BFF / #0E9C8E passes the six checks against a
   white surface. tritan separation is 5.9, under the floor, so
   every series is also carried by a direct label, its own
   marker shape and its own dash — never colour alone. LRU is a
   neutral baseline rather than a categorical hue, dashed and
   labelled, because it is the thing being beaten.
   ============================================================ */

interface Series {
  id: string;
  label: string;
  colour: string;
  dash?: string;
  square?: boolean;
  values: number[];
}

const X = [1, 2, 3, 4, 5];

const LRU_CAL: Series = {
  id: "lru",
  label: "LRU",
  colour: "#71767F",
  dash: "5 4",
  values: [1.6, 3.6, 3.9, 6.6, 10.6],
};
const CALIBRATION: Series[] = [
  LRU_CAL,
  { id: "pred", label: "Predictor", colour: "#0E9C8E", values: [4.8, 6.8, 9.0, 10.1, 11.9] },
  { id: "hyb", label: "Hybrid", colour: "#1A6BFF", square: true, values: [4.0, 6.0, 6.5, 8.8, 11.2] },
];

const FRESH: Series[] = [
  { id: "lru", label: "LRU", colour: "#71767F", dash: "5 4", values: [0, 0, 1.1, 1.1, 1.1] },
  { id: "hyb", label: "Hybrid", colour: "#1A6BFF", square: true, values: [1.1, 1.6, 3.2, 3.2, 4.3] },
];

const W = 560;
const H = 340;
const PAD = { t: 24, r: 108, b: 62, l: 66 };
const Y_MAX = 12;

const px = (i: number) => PAD.l + (i / (X.length - 1)) * (W - PAD.l - PAD.r);
const py = (v: number) => H - PAD.b - (v / Y_MAX) * (H - PAD.t - PAD.b);

/* push labels apart until each clears the one above it.

   the gap is derived from the label's font size rather than picked:
   a text box renders about 1.3x its font size tall, so a gap equal to
   the font size is never enough — which is exactly how this collided
   twice before. keep LABEL_FONT in step with .label in the stylesheet. */
const LABEL_FONT = 22;
const MIN_GAP = Math.round(LABEL_FONT * 1.45);

function labelYs(series: Series[]) {
  const rows = series
    .map((s) => ({
      id: s.id,
      label: s.label,
      colour: s.colour,
      y: py(s.values[s.values.length - 1]) + 6,
    }))
    .sort((a, b) => a.y - b.y);

  for (let i = 1; i < rows.length; i++) {
    if (rows[i].y - rows[i - 1].y < MIN_GAP) rows[i].y = rows[i - 1].y + MIN_GAP;
  }
  return rows;
}

function Panel({
  caption,
  note,
  series,
}: {
  caption: string;
  note: string;
  series: Series[];
}) {
  const desc = series
    .map((s) => `${s.label}: ${s.values.map((v, i) => `${X[i]}% cache ${v}%`).join(", ")}`)
    .join(". ");

  return (
    <figure className={c.panel}>
      <figcaption>
        <strong>{caption}</strong>
        <span>{note}</span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${caption}. ${note}.`}>
        {/* the figures, for anyone who cannot use the chart */}
        <desc>{desc}</desc>

        {[0, 3, 6, 9, 12].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={py(v)}
              y2={py(v)}
              stroke="#000"
              strokeOpacity={v === 0 ? 0.24 : 0.07}
            />
            <text x={PAD.l - 12} y={py(v) + 7} className={c.tick} textAnchor="end">
              {v}%
            </text>
          </g>
        ))}

        {X.map((x, i) => (
          <text key={x} x={px(i)} y={H - PAD.b + 26} className={c.tick} textAnchor="middle">
            {x}%
          </text>
        ))}

        {/* both axes say what they are */}
        <text
          className={c.axis}
          textAnchor="middle"
          transform={`translate(18 ${(PAD.t + H - PAD.b) / 2}) rotate(-90)`}
        >
          reuse captured
        </text>
        <text
          x={(PAD.l + W - PAD.r) / 2}
          y={H - 14}
          className={c.axis}
          textAnchor="middle"
        >
          cache size
        </text>

        {series.map((s) => {
          const d = s.values.map((v, i) => `${i ? "L" : "M"}${px(i)} ${py(v)}`).join(" ");
          return (
            <g key={s.id}>
              <path
                d={d}
                fill="none"
                stroke={s.colour}
                strokeWidth={2.4}
                strokeDasharray={s.dash}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {s.values.map((v, i) =>
                s.square ? (
                  <rect
                    key={i}
                    x={px(i) - 4.5}
                    y={py(v) - 4.5}
                    width={9}
                    height={9}
                    fill={s.colour}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    <title>{`${s.label} · ${X[i]}% cache · ${v}% captured`}</title>
                  </rect>
                ) : (
                  <circle key={i} cx={px(i)} cy={py(v)} r={5} fill={s.colour} stroke="#fff" strokeWidth={2}>
                    <title>{`${s.label} · ${X[i]}% cache · ${v}% captured`}</title>
                  </circle>
                ),
              )}
            </g>
          );
        })}

        {labelYs(series).map(({ id, label, colour, y }) => (
          <text key={id} x={px(X.length - 1) + 14} y={y} className={c.label} fill={colour}>
            {label}
          </text>
        ))}
      </svg>
    </figure>
  );
}

export function ForesiteChart() {
  return (
    <div className={c.chart}>
      <p className={c.lede}>
        <strong>Vertical:</strong> the share of real reuse opportunities a policy
        actually captured, out of everything achievable at that cache size.
        Higher is better. <strong>Horizontal:</strong> cache size, as a
        percentage of the task&rsquo;s working set — 1% is severe pressure, 50%
        is roomy. Both panels share one scale.
      </p>

      <div className={c.panels}>
        <Panel caption="calibration set" note="746 items · 10 traces" series={CALIBRATION} />
        <Panel
          caption="fresh set"
          note="151 items · 3 traces · never trained on"
          series={FRESH}
        />
      </div>

      <p className={c.chartNote}>
        The gap only exists under pressure. Above roughly 7% cache, LRU is
        already close to optimal and every policy converges — which is why the
        shipped policy watches live cache pressure and falls back to LRU once it
        passes.
      </p>
    </div>
  );
}
