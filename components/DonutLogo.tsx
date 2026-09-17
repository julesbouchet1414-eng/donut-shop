import PixelIcon from './PixelIcon';

export type GlazeVariant = 'pink' | 'choco' | 'mint' | 'gold' | 'purple';

const SPRITE_BY_VARIANT: Record<GlazeVariant, string> = {
  pink: 'donut',
  choco: 'donutChoco',
  mint: 'donutMint',
  gold: 'donutGold',
  purple: 'donutPurple',
};

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
  return <PixelIcon name={SPRITE_BY_VARIANT[variant]} size={size} className={className} title={title} />;
}
