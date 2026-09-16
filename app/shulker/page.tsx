import ShulkerBuilder from '@/components/ShulkerBuilder';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Créer un Shulker — Donut Shop' };

export default function ShulkerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        title="Compose ta Shulker"
        subtitle="Clique sur un emplacement pour y glisser un item cher, ajuste les quantités, puis ajoute la shulker complète au panier."
        variant="mint"
      />
      <ShulkerBuilder />
    </div>
  );
}
