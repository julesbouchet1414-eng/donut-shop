'use client';

import { useState } from 'react';
import { MONEY_PRESETS } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';

export default function MoneyShop() {
  const { addMoney } = useCart();
  const [custom, setCustom] = useState(100);
  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAdd(amountM: number, key: string) {
    if (amountM <= 0) return;
    addMoney(amountM);
    setAddedId(key);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {MONEY_PRESETS.map((p) => (
          <div
            key={p.id}
            className="bg-white/70 rounded-xl p-5 text-center border border-black/5 shadow-sm relative"
          >
            {p.label && (
              <span className="absolute top-2 right-2 text-xs bg-donut-pink text-donut-chocoDark px-2 py-0.5 rounded-full">
                {p.label}
              </span>
            )}
            <p className="text-3xl mb-1">💰</p>
            <p className="font-semibold">{p.amountM.toLocaleString('fr-FR')} M</p>
            <p className="text-2xl font-bold my-2">{formatEUR(priceForM(p.amountM))}</p>
            <button type="button" onClick={() => handleAdd(p.amountM, p.id)} className="btn-primary w-full text-sm">
              {addedId === p.id ? '✅ Ajouté' : 'Ajouter au panier'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white/70 rounded-xl p-6 border border-black/5 shadow-sm max-w-md">
        <h2 className="font-semibold mb-3">Montant personnalisé</h2>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="number"
            min={10}
            step={10}
            value={custom}
            onChange={(e) => setCustom(Math.max(0, Number(e.target.value) || 0))}
            className="flex-1 px-3 py-2 rounded-lg border border-black/10"
          />
          <span className="font-medium">M</span>
        </div>
        <p className="text-xl font-bold mb-3">{formatEUR(priceForM(custom))}</p>
        <button
          type="button"
          onClick={() => handleAdd(custom, 'custom')}
          disabled={custom <= 0}
          className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {addedId === 'custom' ? '✅ Ajouté' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
}
