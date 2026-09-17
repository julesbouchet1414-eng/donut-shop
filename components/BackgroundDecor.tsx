const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  delay: `${(i % 11) * 0.9}s`,
  duration: `${9 + (i % 6) * 2.5}s`,
  size: i % 3 === 0 ? 3 : 2,
  color: ['#b46cff', '#ff4f9b', '#4ee2ec', '#ffb52e'][i % 4],
}));

export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Grille de blocs, façon monde Minecraft vu de loin */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #b46cff 1px, transparent 1px), linear-gradient(to bottom, #b46cff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Faisceau de beacon */}
      <div
        className="absolute left-1/2 top-0 h-[70vh] w-40 -translate-x-1/2 animate-beam opacity-30"
        style={{
          background: 'linear-gradient(180deg, rgba(180,108,255,0.55), rgba(180,108,255,0))',
          filter: 'blur(28px)',
        }}
      />

      {/* Particules qui montent, façon portail du Nether */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 block"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            animation: `rain ${p.duration} linear ${p.delay} infinite reverse`,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(3,2,6,0.75) 100%)' }}
      />
    </div>
  );
}
