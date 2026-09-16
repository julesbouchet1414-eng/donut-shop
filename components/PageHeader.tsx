import DonutLogo from './DonutLogo';
import type { GlazeVariant } from './DonutLogo';

export default function PageHeader({
  title,
  subtitle,
  variant = 'pink',
}: {
  title: string;
  subtitle: string;
  variant?: GlazeVariant;
}) {
  return (
    <div className="mb-10 flex animate-slide-up items-center gap-4">
      <DonutLogo size={72} variant={variant} className="animate-float shrink-0" />
      <div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          <span className="title-gradient">{title}</span>
        </h1>
        <p className="mt-1 max-w-xl text-donut-choco/75">{subtitle}</p>
      </div>
    </div>
  );
}
