import { CATALOG, CATEGORIES } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';
import ItemCard from '@/components/ItemCard';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Items — Donut Shop' };

export default function ItemsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        title="Items premium"
        subtitle={`Uniquement des items chers, au même tarif que l'argent : ${formatEUR(priceForM(500))} pour 500 M de valeur en jeu.`}
        variant="gold"
      />

      {CATEGORIES.map((cat) => {
        const items = CATALOG.filter((i) => i.category === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="font-display text-2xl font-semibold">{cat.label}</h2>
              <span className="h-px flex-1 bg-gradient-to-r from-donut-pink/50 to-transparent" />
              <span className="chip">{items.length} items</span>
            </div>
            <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
