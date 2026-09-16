import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-pixel text-xl sm:text-3xl mb-6 leading-relaxed">🍩 Donut Shop</h1>
        <p className="text-lg text-donut-chocoDark/80 mb-10">
          Achète de l&apos;argent et des items rares pour Donut SMP, ou compose ta propre shulker sur-mesure.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/argent" className="btn-primary">
            💰 Acheter de l&apos;argent
          </Link>
          <Link href="/items" className="btn-secondary">
            ⚔️ Voir les items
          </Link>
          <Link href="/shulker" className="btn-secondary">
            📦 Composer une shulker
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20 grid sm:grid-cols-3 gap-6 text-center">
        <div className="bg-white/70 rounded-xl p-6">
          <p className="text-3xl mb-2">1️⃣</p>
          <p className="font-semibold mb-1">Choisis</p>
          <p className="text-sm text-donut-chocoDark/70">Argent, items ou une shulker composée par toi-même.</p>
        </div>
        <div className="bg-white/70 rounded-xl p-6">
          <p className="text-3xl mb-2">2️⃣</p>
          <p className="font-semibold mb-1">Commande</p>
          <p className="text-sm text-donut-chocoDark/70">Ajoute au panier puis confirme ton pseudo Minecraft.</p>
        </div>
        <div className="bg-white/70 rounded-xl p-6">
          <p className="text-3xl mb-2">3️⃣</p>
          <p className="font-semibold mb-1">Reçois</p>
          <p className="text-sm text-donut-chocoDark/70">On te contacte pour le paiement puis la livraison en jeu.</p>
        </div>
      </section>
    </div>
  );
}
