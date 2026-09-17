import Link from 'next/link';
import DonutLogo from '@/components/DonutLogo';
import PixelIcon from '@/components/PixelIcon';
import { CATALOG } from '@/lib/catalog';
import { formatEUR, formatM, priceForM, REFERENCE_M } from '@/lib/pricing';

const STEPS = [
  { title: 'Choisis', sprite: 'donut', text: 'De l’argent, des items rares, ou une shulker que tu remplis case par case.' },
  { title: 'Commande', sprite: 'bookGreen', text: 'Ajoute au panier, confirme ton pseudo Minecraft deux fois, envoie.' },
  { title: 'Reçois', sprite: 'shulker', text: 'On te contacte avec ton numéro de commande, puis livraison en jeu.' },
];

export default function HomePage() {
  const featured = CATALOG.filter((i) => i.rarity === 'epique' || i.rarity === 'legendaire').slice(0, 4);
  const marquee = CATALOG.slice(0, 10);
  const refPrice = formatEUR(priceForM(REFERENCE_M));

  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-12 pt-16 md:grid-cols-2 md:pt-24">
        <div className="animate-slide-up">
          <span className="chip mb-6">
            <span className="h-2 w-2 bg-mc-emerald" />
            Livraison en jeu après paiement
          </span>

          <h1 className="mc-title text-5xl leading-[1.05] sm:text-7xl">
            DONUT
            <br />
            SHOP
          </h1>

          <p className="mt-6 max-w-md text-base text-ink-300">
            De l&apos;argent, des items haut de gamme et des shulkers sur-mesure pour Donut SMP. Un seul taux,
            appliqué au prorata partout.
          </p>

          <div className="panel mt-6 inline-flex items-center gap-4 px-5 py-3">
            <DonutLogo size={40} className="animate-bob" />
            <div>
              <p className="font-pixel text-[13px] uppercase text-ink-400">Tarif</p>
              <p className="font-pixel text-base text-mc-emerald text-shadow-mc">
                {formatM(REFERENCE_M)} = {refPrice}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/argent" className="btn-primary !px-6 !py-3 !text-base">
              Acheter de l&apos;argent
            </Link>
            <Link href="/shulker" className="btn-mc !px-6 !py-3 !text-base">
              Composer une shulker
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center py-8">
          <div className="absolute h-64 w-64 rounded-full bg-mc-purple/25 blur-[70px]" />
          <div className="absolute h-40 w-40 rounded-full bg-mc-pink/30 blur-[50px]" />

          <div className="relative animate-float">
            <DonutLogo size={260} title="Donut glacé" />
          </div>

          <div className="absolute left-0 top-4 animate-float-slow">
            <span className="panel panel-raised flex h-16 w-16 items-center justify-center">
              <PixelIcon name="elytra" size={40} />
            </span>
          </div>
          <div className="absolute bottom-6 right-0 animate-float-slow" style={{ animationDelay: '1.5s' }}>
            <span className="panel panel-raised enchanted flex h-16 w-16 items-center justify-center">
              <PixelIcon name="star" size={40} />
            </span>
          </div>
          <div className="absolute bottom-16 left-2 animate-float" style={{ animationDelay: '2.5s' }}>
            <span className="panel panel-raised flex h-14 w-14 items-center justify-center">
              <PixelIcon name="netheriteBlock" size={34} />
            </span>
          </div>
        </div>
      </section>

      {/* Bandeau défilant */}
      <section className="relative flex overflow-hidden border-y-2 border-night-900 bg-night-800 py-3">
        <div className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8">
          {[...marquee, ...marquee].map((item, i) => (
            <span key={i} className="flex items-center gap-2 font-display text-sm text-ink-300">
              <PixelIcon name={item.sprite} size={20} />
              {item.name.split(' (')[0]}
              <span className="text-mc-gold">{formatEUR(priceForM(item.valueM))}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Items en vedette */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mc-title-purple mb-8 text-center text-2xl sm:text-3xl">ITEMS LÉGENDAIRES</h2>
        <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((item) => (
            <Link key={item.id} href="/items" className="panel panel-hover group p-4 text-center">
              <span className="slot enchanted mx-auto !h-16 !w-16 !cursor-pointer">
                <PixelIcon name={item.sprite} size={44} />
              </span>
              <p className={`mt-3 text-xs font-semibold leading-snug rarity-${item.rarity}`}>
                {item.name.split(' (')[0]}
              </p>
              <p className="mt-2 font-display text-lg font-bold text-mc-gold">
                {formatEUR(priceForM(item.valueM))}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mc-title mb-8 text-center text-2xl sm:text-3xl">COMMENT ÇA MARCHE</h2>
        <div className="stagger grid gap-5 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="panel panel-hover p-6 text-center">
              <span className="panel panel-raised mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <PixelIcon name={s.sprite} size={40} />
              </span>
              <p className="font-pixel text-[15px] text-mc-emerald text-shadow-mc">
                {i + 1}. {s.title.toUpperCase()}
              </p>
              <p className="mt-3 text-sm text-ink-300">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
