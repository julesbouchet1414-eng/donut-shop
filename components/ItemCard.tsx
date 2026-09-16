'use client';

import { useState } from 'react';
import type { CatalogItem } from '@/lib/types';
import { formatEUR, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';
import SprinkleBurst from './SprinkleBurst';

export default function ItemCard({ item }: { item: CatalogItem }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAdd() {
    addItem(item.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="card card-hover group flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-donut-pinkLight to-donut-creamDark text-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <SprinkleBurst show={added} />
          <span>{item.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{item.name}</p>
          <p className="mt-0.5 text-xs text-donut-choco/60">{item.valueM.toLocaleString('fr-FR')} M en jeu</p>
        </div>
      </div>

      <p className="mt-auto">
        <span className="price-tag text-xl">{formatEUR(priceForM(item.valueM * qty))}</span>
      </p>

      <div className="flex items-center gap-2">
        {item.maxStack > 1 && (
          <div className="flex items-center overflow-hidden rounded-full border-2 border-donut-pinkLight bg-white/80">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2.5 py-1 font-bold text-donut-pinkDark transition hover:bg-donut-pinkLight"
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <span className="min-w-6 px-1 text-center text-sm font-bold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(item.maxStack, q + 1))}
              className="px-2.5 py-1 font-bold text-donut-pinkDark transition hover:bg-donut-pinkLight"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        )}
        <button type="button" onClick={handleAdd} className="btn-primary flex-1 !px-3 text-sm">
          {added ? 'Ajouté !' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
}
