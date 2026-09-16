import ShulkerBuilder from '@/components/ShulkerBuilder';

export const metadata = { title: 'Créer un Shulker — Donut Shop' };

export default function ShulkerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-pixel text-base sm:text-2xl mb-2">Compose ta Shulker</h1>
      <p className="text-donut-chocoDark/70 mb-8">
        Clique sur un emplacement pour ajouter un item cher, ajuste les quantités, puis ajoute ta shulker
        au panier.
      </p>
      <ShulkerBuilder />
    </div>
  );
}
