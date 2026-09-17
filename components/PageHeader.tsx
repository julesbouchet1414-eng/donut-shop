import PixelIcon from './PixelIcon';

export default function PageHeader({
  title,
  subtitle,
  sprite = 'donut',
}: {
  title: string;
  subtitle: string;
  sprite?: string;
}) {
  return (
    <div className="mb-10 animate-slide-up">
      <div className="flex items-center gap-4">
        <span className="panel panel-raised flex h-16 w-16 shrink-0 items-center justify-center">
          <PixelIcon name={sprite} size={40} className="animate-bob" />
        </span>
        <div>
          <h1 className="mc-title text-3xl leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-300">{subtitle}</p>
        </div>
      </div>
      <div className="mt-6 h-0.5 w-full bg-gradient-to-r from-mc-purple via-mc-pink/40 to-transparent" />
    </div>
  );
}
