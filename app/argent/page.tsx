import MoneyShop from '@/components/MoneyShop';

export const metadata = { title: "Acheter de l'argent — Donut Shop" };

export default function ArgentPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-pixel text-base sm:text-2xl mb-2">Argent Donut SMP</h1>
      <p className="text-donut-chocoDark/70 mb-8">
        Tarif : 500 M = 15 €, calculé au prorata pour n&apos;importe quel montant.
      </p>
      <MoneyShop />
    </div>
  );
}
