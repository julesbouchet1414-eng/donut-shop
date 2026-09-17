'use client';

import { useState } from 'react';
import type { CatalogItem } from '@/lib/types';
import { formatEUR, formatM, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';
import PixelIcon from './PixelIcon';
import SprinkleBurst from './SprinkleBurst';

const RARITY_LABEL: Record<CatalogItem['rarity'], string> = {
  commun: 'Commun',
  rare: 'Rare',
  epique: 'Épique',
  legendaire: 'Légendaire',
};

export default function ItemCard({ item }: { item: CatalogItem }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const enchanted = item.rarity === 'epique' || item.rarity === 'legendaire';

  function handleAdd() {
    addItem(item.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  }

  return (
    <div className="panel panel-hover flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <div className={`slot !h-14 !w-14 !cursor-default ${enchanted ? 'enchanted' : ''}`}>
          <SprinkleBurst show={added} />
          <PixelIcon name={item.sprite} size={40} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold leading-snug text-ink-100">{item.name}</p>
          <p className={`mt-1 font-display text-xs font-bold uppercase rarity-${item.rarity}`}>
            {RARITY_LABEL[item.rarity]}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 border-t-2 border-night-900 pt-3">
        <div>
          <p className="font-pixel text-[13px] text-ink-400">{formatM(item.valueM * qty)}</p>
          <p className="price-tag !px-0 text-xl">{formatEUR(priceForM(item.valueM * qty))}</p>
        </div>

        {item.maxStack > 1 && (
          <div className="flex items-center border-2 border-night-400 bg-night-900">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2 py-1 font-pixel text-[15px] text-ink-200 transition hover:bg-night-600"
              aria-label="Diminuer la quantité"
            >
              -
            </button>
            <span className="min-w-7 px-1 text-center font-pixel text-[15px]">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(item.maxStack, q + 1))}
              className="px-2 py-1 font-pixel text-[15px] text-ink-200 transition hover:bg-night-600"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        )}
      </div>

      <button type="button" onClick={handleAdd} className="btn-primary w-full !text-xs">
        {added ? 'Ajouté !' : 'Ajouter'}
      </button>
    </div>
  );
}
