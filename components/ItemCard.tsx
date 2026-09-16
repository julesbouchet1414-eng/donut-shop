'use client';

import { useState } from 'react';
import type { CatalogItem } from '@/lib/types';
import { formatEUR, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';

export default function ItemCard({ item }: { item: CatalogItem }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAdd() {
    addItem(item.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="bg-white/70 rounded-xl p-4 flex flex-col gap-3 border border-black/5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="mc-slot !cursor-default !w-12 !h-12 sm:!w-14 sm:!h-14">
          <span className="text-xl sm:text-2xl">{item.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-snug">{item.name}</p>
          <p className="text-xs text-donut-chocoDark/60">{item.valueM.toLocaleString('fr-FR')} M</p>
        </div>
      </div>
      <p className="text-2xl font-bold">{formatEUR(priceForM(item.valueM * qty))}</p>
      <div className="flex items-center gap-2 mt-auto">
        {item.maxStack > 1 && (
          <div className="flex items-center border border-black/10 rounded-lg">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2 py-1"
              aria-label="Diminuer la quantité"
            >
              -
            </button>
            <span className="px-2 text-sm">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(item.maxStack, q + 1))}
              className="px-2 py-1"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        )}
        <button type="button" onClick={handleAdd} className="btn-primary flex-1 text-sm">
          {added ? '✅ Ajouté' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
}
