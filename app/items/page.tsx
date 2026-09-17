import { CATALOG, CATEGORIES } from '@/lib/catalog';
import { formatEUR, formatM, priceForM, REFERENCE_M } from '@/lib/pricing';
import ItemCard from '@/components/ItemCard';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Items — Donut Shop' };

export default function ItemsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        title="ITEMS PREMIUM"
        subtitle={`Uniquement des items chers, au même tarif que l'argent : ${formatM(REFERENCE_M)} de valeur en jeu = ${formatEUR(priceForM(REFERENCE_M))}.`}
        sprite="elytra"
      />

      {CATEGORIES.map((cat) => {
        const items = CATALOG.filter((i) => i.category === cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} className="mb-14">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-pixel text-[17px] text-white text-shadow-mc">{cat.label.toUpperCase()}</h2>
              <span className="h-0.5 flex-1 bg-gradient-to-r from-mc-purple/60 to-transparent" />
              <span className="chip">{items.length}</span>
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
