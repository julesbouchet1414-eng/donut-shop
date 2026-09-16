import DonutLogo from './DonutLogo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-donut-chocoDark text-donut-cream/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <DonutLogo size={34} />
          <div>
            <p className="font-display text-base font-semibold text-donut-cream">Donut Shop</p>
            <p className="text-xs">Boutique communautaire, sans affiliation avec l&apos;équipe du serveur Donut SMP.</p>
          </div>
        </div>
        <p className="text-xs sm:text-right">
          Paiement et livraison finalisés manuellement
          <br className="hidden sm:block" /> après réception de la commande.
        </p>
      </div>
    </footer>
  );
}
