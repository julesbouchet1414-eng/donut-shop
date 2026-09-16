import Link from 'next/link';
import DonutLogo from '@/components/DonutLogo';
import { CATALOG } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';

const STEPS = [
  {
    title: 'Choisis',
    text: 'De l’argent, des items rares, ou une shulker que tu composes toi-même case par case.',
    variant: 'pink' as const,
  },
  {
    title: 'Commande',
    text: 'Ajoute au panier, confirme ton pseudo Minecraft deux fois, et envoie ta commande.',
    variant: 'gold' as const,
  },
  {
    title: 'Reçois',
    text: 'On te contacte avec ton numéro de commande pour le paiement, puis livraison en jeu.',
    variant: 'mint' as const,
  },
];

export default function HomePage() {
  const marquee = CATALOG.slice(0, 10).map((i) => `${i.name} · ${formatEUR(priceForM(i.valueM))}`);

  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-14 md:grid-cols-2 md:pt-20">
        <div className="animate-slide-up">
          <span className="chip mb-5 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-donut-mint" />
            Livraison en jeu après paiement
          </span>

          <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
            <span className="title-gradient">Donut Shop</span>
            <br />
            <span className="text-donut-choco">l’argent et les items</span>
            <br />
            <span className="text-donut-choco">de tes rêves</span>
          </h1>

          <p className="mt-5 max-w-md text-lg text-donut-choco/80">
            Achète des Donuts, des items haut de gamme, ou compose ta shulker sur-mesure. Un seul tarif,
            appliqué au prorata partout : <strong className="text-donut-pinkDark">500 M = 15 €</strong>.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/argent" className="btn-primary text-lg">
              Acheter de l’argent
            </Link>
            <Link href="/shulker" className="btn-secondary text-lg">
              Composer une shulker
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-donut-choco/70">
            <span>✅ Prix calculés automatiquement</span>
            <span>✅ Pseudo confirmé 2 fois</span>
            <span>✅ {CATALOG.length} items au catalogue</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-donut-glaze/25 blur-3xl sm:h-80 sm:w-80" />

          <div className="animate-float">
            <div className="animate-spin-slow">
              <DonutLogo size={300} title="Donut glacé rose" className="drop-shadow-2xl" />
            </div>
          </div>

          <div className="absolute -left-2 top-4 animate-float-slow sm:left-2">
            <DonutLogo size={72} variant="mint" />
          </div>
          <div className="absolute -right-1 bottom-6 animate-float" style={{ animationDelay: '1.2s' }}>
            <DonutLogo size={88} variant="choco" />
          </div>
          <div className="absolute right-6 top-0 animate-float-slow" style={{ animationDelay: '2.4s' }}>
            <DonutLogo size={54} variant="gold" />
          </div>

          <div className="card animate-pop-in absolute bottom-2 left-0 px-4 py-2 sm:bottom-6" style={{ animationDelay: '0.6s' }}>
            <p className="text-xs text-donut-choco/60">Tarif de référence</p>
            <p className="font-display text-lg font-bold text-donut-pinkDark">500 M = 15,00 €</p>
          </div>
        </div>
      </section>

      <section className="relative my-10 flex gap-6 overflow-hidden border-y border-white/60 bg-white/50 py-3 backdrop-blur">
        <div className="flex shrink-0 animate-marquee gap-6 whitespace-nowrap">
          {[...marquee, ...marquee].map((label, i) => (
            <span key={i} className="flex items-center gap-2 text-sm font-semibold text-donut-choco/70">
              <DonutLogo size={18} variant={i % 2 ? 'gold' : 'pink'} />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-8 text-center font-display text-3xl font-bold text-donut-choco">Comment ça marche</h2>
        <div className="stagger grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card card-hover p-6 text-center">
              <div className="relative mx-auto mb-4 w-fit">
                <DonutLogo size={88} variant={s.variant} />
                <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold text-donut-chocoDark drop-shadow">
                  {i + 1}
                </span>
              </div>
              <p className="font-display text-xl font-semibold">{s.title}</p>
              <p className="mt-2 text-sm text-donut-choco/70">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="card mt-10 flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <DonutLogo size={64} variant="gold" className="animate-float" />
            <div>
              <p className="font-display text-xl font-semibold">Un doute sur un prix ?</p>
              <p className="text-sm text-donut-choco/70">
                Tout est calculé depuis la valeur en jeu, au même taux pour l’argent et les items.
              </p>
            </div>
          </div>
          <Link href="/items" className="btn-primary">
            Voir le catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
