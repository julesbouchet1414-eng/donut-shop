import MoneyShop from '@/components/MoneyShop';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: "Acheter de l'argent — Donut Shop" };

export default function ArgentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        title="Argent Donut SMP"
        subtitle="Tarif unique : 500 M = 15 €, appliqué au prorata pour n'importe quel montant."
      />
      <MoneyShop />
    </div>
  );
}
