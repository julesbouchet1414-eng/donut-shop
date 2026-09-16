import { CATALOG, CATEGORIES } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';
import ItemCard from '@/components/ItemCard';

export const metadata = { title: 'Items — Donut Shop' };

export default function ItemsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-pixel text-base sm:text-2xl mb-2">Items premium</h1>
      <p className="text-donut-chocoDark/70 mb-8">
        Uniquement des items chers, au même tarif que l&apos;argent : {formatEUR(priceForM(500))} pour 500 M
        de valeur en jeu.
      </p>
      {CATEGORIES.map((cat) => {
        const items = CATALOG.filter((i) => i.category === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} className="mb-10">
            <h2 className="font-semibold text-lg mb-4">
              {cat.icon} {cat.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
