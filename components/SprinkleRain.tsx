'use client';

import type { CSSProperties } from 'react';

const COLORS = ['#ffd166', '#6ee7b7', '#7dd3fc', '#c4b5fd', '#fb7185', '#ff9ac4'];

// Positions fixes : pas de Math.random, pour éviter tout écart serveur/client.
const DROPS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 9) * 0.35}s`,
  duration: `${3 + (i % 5) * 0.6}s`,
  color: COLORS[i % COLORS.length],
  rot: (i * 47) % 180,
}));

export default function SprinkleRain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="absolute top-0 block h-4 w-1.5 rounded-full"
          style={
            {
              left: d.left,
              background: d.color,
              transform: `rotate(${d.rot}deg)`,
              animation: `rain ${d.duration} linear ${d.delay} infinite`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
