import DonutLogo from './DonutLogo';
import { formatEUR, priceForM, REFERENCE_M, formatM } from '@/lib/pricing';

export default function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-night-900 bg-night-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <DonutLogo size={40} />
          <div>
            <p className="font-pixel text-base text-white text-shadow-mc">DONUT SHOP</p>
            <p className="mt-2 max-w-sm text-xs text-ink-400">
              Boutique communautaire, sans affiliation avec l&apos;équipe du serveur Donut SMP.
            </p>
          </div>
        </div>

        <div className="text-xs text-ink-400 sm:text-right">
          <p className="font-display text-sm text-mc-gold">
            {formatM(REFERENCE_M)} = {formatEUR(priceForM(REFERENCE_M))}
          </p>
          <p className="mt-2">Paiement et livraison finalisés manuellement</p>
          <p>après réception de la commande.</p>
        </div>
      </div>
    </footer>
  );
}
