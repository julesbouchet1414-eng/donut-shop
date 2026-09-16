import DonutLogo from './DonutLogo';
import type { GlazeVariant } from './DonutLogo';

const FLOATING: { top: string; left: string; size: number; variant: GlazeVariant; delay: string; opacity: string }[] = [
  { top: '8%', left: '4%', size: 110, variant: 'pink', delay: '0s', opacity: 'opacity-[0.16]' },
  { top: '26%', left: '86%', size: 140, variant: 'gold', delay: '1.4s', opacity: 'opacity-[0.14]' },
  { top: '62%', left: '8%', size: 90, variant: 'mint', delay: '2.6s', opacity: 'opacity-[0.13]' },
  { top: '78%', left: '78%', size: 120, variant: 'choco', delay: '0.8s', opacity: 'opacity-[0.12]' },
  { top: '45%', left: '48%', size: 70, variant: 'pink', delay: '3.2s', opacity: 'opacity-[0.1]' },
];

export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {FLOATING.map((d, i) => (
        <div
          key={i}
          className={`absolute animate-float-slow ${d.opacity}`}
          style={{ top: d.top, left: d.left, animationDelay: d.delay }}
        >
          <DonutLogo size={d.size} variant={d.variant} />
        </div>
      ))}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: 'radial-gradient(circle, #5b3a29 1.5px, transparent 1.5px)',
          backgroundSize: '26px 26px',
        }}
      />
    </div>
  );
}
