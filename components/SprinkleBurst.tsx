'use client';

import type { CSSProperties } from 'react';

const BURST = [
  { dx: -46, dy: -34, rot: -35, color: '#ffd166' },
  { dx: -18, dy: -52, rot: 18, color: '#6ee7b7' },
  { dx: 20, dy: -50, rot: -12, color: '#7dd3fc' },
  { dx: 48, dy: -30, rot: 44, color: '#c4b5fd' },
  { dx: 54, dy: 8, rot: -28, color: '#fb7185' },
  { dx: 34, dy: 40, rot: 62, color: '#ffffff' },
  { dx: -6, dy: 52, rot: -50, color: '#ffd166' },
  { dx: -40, dy: 34, rot: 26, color: '#6ee7b7' },
  { dx: -56, dy: 2, rot: -70, color: '#7dd3fc' },
];

export default function SprinkleBurst({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <span className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden="true">
      {BURST.map((b, i) => (
        <span
          key={i}
          className="sprinkle"
          style={
            {
              '--dx': `${b.dx}px`,
              '--dy': `${b.dy}px`,
              '--rot': `${b.rot}deg`,
              background: b.color,
              animationDelay: `${i * 18}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
