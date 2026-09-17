import ShulkerBuilder from '@/components/ShulkerBuilder';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Créer un Shulker — Donut Shop' };

export default function ShulkerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        title="COMPOSE TA SHULKER"
        subtitle="27 emplacements, comme en jeu. Choisis tes items, ajuste les quantités dans la limite de leur stack réel, puis ajoute la shulker complète au panier."
        sprite="shulker"
      />
      <ShulkerBuilder />
    </div>
  );
}
