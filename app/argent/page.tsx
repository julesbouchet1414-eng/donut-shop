import MoneyShop from '@/components/MoneyShop';
import PageHeader from '@/components/PageHeader';
import { formatEUR, formatM, priceForM, REFERENCE_M } from '@/lib/pricing';

export const metadata = { title: "Acheter de l'argent — Donut Shop" };

export default function ArgentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        title="ARGENT DONUT SMP"
        subtitle={`Tarif unique : ${formatM(REFERENCE_M)} = ${formatEUR(priceForM(REFERENCE_M))}, appliqué au prorata pour n'importe quel montant.`}
        sprite="donut"
      />
      <MoneyShop />
    </div>
  );
}
