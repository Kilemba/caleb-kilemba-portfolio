/**
 * Decorative data visual for project cards that have no cover image.
 *
 * The shape is derived from the project slug, so each card looks distinct but renders
 * identically on the server and the client — `Math.random` here would cause a hydration
 * mismatch and a different picture on every request.
 *
 * Deliberately unlabelled: no axes, no numbers. It suggests the kind of work without
 * implying a measurement, which a chart with figures on it would.
 */

/** FNV-1a. Small, stable, and good enough to spread slugs across the variants. */
function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic sequence seeded from the hash, in [0, 1). */
function series(seed: number, count: number) {
  let state = seed || 1;
  return Array.from({ length: count }, () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  });
}

function Bars({ seed }: { seed: number }) {
  const values = series(seed, 9);
  return (
    <g>
      {values.map((v, i) => {
        const height = 16 + v * 52;
        return (
          <rect
            key={i}
            className="viz-bar"
            x={10 + i * 20}
            y={78 - height}
            width={11}
            height={height}
            rx={3}
            fill="var(--accent)"
            opacity={0.28 + v * 0.5}
            style={{ transitionDelay: `${i * 35}ms` }}
          />
        );
      })}
    </g>
  );
}

function Trend({ seed }: { seed: number }) {
  const values = series(seed, 8);
  const points = values.map((v, i) => [8 + i * 26, 74 - (12 + v * 48)] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = `${line} L${points[points.length - 1][0]} 80 L${points[0][0]} 80 Z`;

  return (
    <g>
      <path d={area} fill="var(--accent)" opacity={0.14} />
      <path
        className="viz-line"
        d={line}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map(([x, y], i) => (
        <circle key={i} className="viz-dot" cx={x} cy={y} r={3} fill="var(--accent)" style={{ transitionDelay: `${i * 40}ms` }} />
      ))}
    </g>
  );
}

function Pipeline({ seed }: { seed: number }) {
  const values = series(seed, 4);
  const nodes = values.map((v, i) => [24 + i * 50, 30 + v * 26] as const);
  return (
    <g>
      {nodes.slice(0, -1).map(([x, y], i) => {
        const [nx, ny] = nodes[i + 1];
        return (
          <path
            key={i}
            className="viz-link"
            d={`M${x + 9} ${y} C${x + 30} ${y}, ${nx - 30} ${ny}, ${nx - 9} ${ny}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.8}
            opacity={0.5}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        );
      })}
      {nodes.map(([x, y], i) => (
        <g key={i} className="viz-node" style={{ transitionDelay: `${i * 60}ms` }}>
          <circle cx={x} cy={y} r={9} fill="white" stroke="var(--accent)" strokeWidth={2} />
          <circle cx={x} cy={y} r={3.4} fill="var(--accent)" opacity={0.55 + i * 0.12} />
        </g>
      ))}
    </g>
  );
}

export function ProjectVisual({ slug, className = "" }: { slug: string; className?: string }) {
  const seed = hash(slug);
  const variant = seed % 3;

  return (
    <div className={`project-visual ${className}`}>
      <svg viewBox="0 0 190 88" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {/* Faint baseline grid, so the shapes read as a chart rather than decoration. */}
        <g stroke="var(--border)" strokeWidth={1}>
          {[22, 44, 66].map((y) => <line key={y} x1={0} y1={y} x2={190} y2={y} />)}
        </g>
        {variant === 0 && <Bars seed={seed} />}
        {variant === 1 && <Trend seed={seed} />}
        {variant === 2 && <Pipeline seed={seed} />}
      </svg>
    </div>
  );
}
