export type GlazeVariant = 'pink' | 'choco' | 'mint' | 'gold';

const GLAZES: Record<GlazeVariant, { top: string; bottom: string }> = {
  pink: { top: '#ffb0d4', bottom: '#ef5f9e' },
  choco: { top: '#a2673f', bottom: '#6b3a1e' },
  mint: { top: '#9df5d7', bottom: '#43c9a0' },
  gold: { top: '#ffe2a0', bottom: '#f0a833' },
};

const SPRINKLE_COLORS = ['#ffffff', '#ffd166', '#6ee7b7', '#7dd3fc', '#c4b5fd', '#fb7185'];

// Positions fixes (jamais aléatoires) pour que le rendu serveur et client soient identiques.
// Math.cos/sin peuvent différer d'un ULP entre Node et le navigateur : on arrondit
// pour que les deux produisent exactement la même chaîne et éviter une erreur d'hydratation.
const round2 = (n: number) => Math.round(n * 100) / 100;

const DRIPS = [7.5, 5.4, 8.2, 6, 7.1, 5, 8.5, 6.4, 7, 5.6, 8, 6.2].map((r, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return {
    cx: round2(60 + Math.cos(angle) * 45),
    cy: round2(60 + Math.sin(angle) * 45),
    r,
  };
});

const SPRINKLES = [
  { angle: 18, radius: 30, rot: 34, color: 1 },
  { angle: 58, radius: 37, rot: -22, color: 2 },
  { angle: 96, radius: 27, rot: 64, color: 3 },
  { angle: 131, radius: 35, rot: 12, color: 0 },
  { angle: 165, radius: 30, rot: -48, color: 4 },
  { angle: 198, radius: 38, rot: 28, color: 5 },
  { angle: 228, radius: 26, rot: -8, color: 2 },
  { angle: 256, radius: 36, rot: 52, color: 1 },
  { angle: 288, radius: 29, rot: -35, color: 3 },
  { angle: 318, radius: 37, rot: 18, color: 5 },
  { angle: 344, radius: 25, rot: -60, color: 4 },
  { angle: 76, radius: 24, rot: 40, color: 0 },
  { angle: 210, radius: 33, rot: 70, color: 3 },
  { angle: 300, radius: 24, rot: 4, color: 1 },
].map((s) => {
  const a = (s.angle * Math.PI) / 180;
  return {
    cx: round2(60 + Math.cos(a) * s.radius),
    cy: round2(60 + Math.sin(a) * s.radius),
    rot: s.rot,
    color: SPRINKLE_COLORS[s.color],
  };
});

export default function DonutLogo({
  size = 64,
  variant = 'pink',
  className = '',
  title,
}: {
  size?: number;
  variant?: GlazeVariant;
  className?: string;
  title?: string;
}) {
  const glaze = GLAZES[variant];
  const k = variant;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <radialGradient id={`dough-${k}`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#f8cf94" />
          <stop offset="100%" stopColor="#cf8f43" />
        </radialGradient>
        <radialGradient id={`glaze-${k}`} cx="34%" cy="26%" r="80%">
          <stop offset="0%" stopColor={glaze.top} />
          <stop offset="100%" stopColor={glaze.bottom} />
        </radialGradient>
        <mask id={`hole-${k}`}>
          <rect x="0" y="0" width="120" height="120" fill="#fff" />
          <circle cx="60" cy="60" r="17.5" fill="#000" />
        </mask>
      </defs>

      <g mask={`url(#hole-${k})`}>
        <circle cx="60" cy="60" r="52" fill={`url(#dough-${k})`} />
        {DRIPS.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={`url(#glaze-${k})`} />
        ))}
        <circle cx="60" cy="60" r="45" fill={`url(#glaze-${k})`} />
        <ellipse cx="43" cy="33" rx="15" ry="8.5" fill="#ffffff" opacity="0.3" transform="rotate(-35 43 33)" />
        {SPRINKLES.map((s, i) => (
          <rect
            key={i}
            x={-1.7}
            y={-5}
            width={3.4}
            height={10}
            rx={1.7}
            fill={s.color}
            transform={`translate(${s.cx} ${s.cy}) rotate(${s.rot})`}
          />
        ))}
      </g>

      <circle cx="60" cy="60" r="18.6" fill="none" stroke="rgba(120, 70, 30, 0.22)" strokeWidth="3" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(120, 70, 30, 0.14)" strokeWidth="2" />
    </svg>
  );
}
