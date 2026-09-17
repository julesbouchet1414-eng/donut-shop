'use client';

import { useState } from 'react';
import { MONEY_PRESETS } from '@/lib/catalog';
import { formatEUR, formatM, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';
import DonutLogo, { type GlazeVariant } from './DonutLogo';
import SprinkleBurst from './SprinkleBurst';

const VARIANTS: GlazeVariant[] = ['pink', 'gold', 'mint', 'purple', 'choco', 'gold'];

export default function MoneyShop() {
  const { addMoney } = useCart();
  const [custom, setCustom] = useState(100);
  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAdd(amountM: number, key: string) {
    if (amountM <= 0) return;
    addMoney(amountM);
    setAddedId(key);
    setTimeout(() => setAddedId(null), 1300);
  }

  return (
    <div>
      <div className="stagger mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MONEY_PRESETS.map((p, i) => (
          <div key={p.id} className="panel panel-hover group relative p-5 text-center">
            {p.label && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 border-2 border-night-900 bg-mc-gold px-2 py-0.5 font-pixel text-[12px] uppercase text-night-900">
                {p.label}
              </span>
            )}

            <div className="relative mx-auto mt-2 w-fit">
              <SprinkleBurst show={addedId === p.id} />
              <DonutLogo
                size={96}
                variant={VARIANTS[i % VARIANTS.length]}
                className="transition-transform duration-200 group-hover:-translate-y-1.5"
              />
            </div>

            <p className="mt-4 font-pixel text-base text-mc-emerald text-shadow-mc">{formatM(p.amountM)}</p>
            <p className="mt-1 text-xs text-ink-400">de Donuts</p>

            <p className="my-4">
              <span className="price-tag text-2xl">{formatEUR(priceForM(p.amountM))}</span>
            </p>

            <button type="button" onClick={() => handleAdd(p.amountM, p.id)} className="btn-primary w-full">
              {addedId === p.id ? 'Ajouté !' : 'Ajouter'}
            </button>
          </div>
        ))}
      </div>

      <div className="panel panel-raised mx-auto max-w-lg p-6">
        <div className="mb-5 flex items-center gap-3">
          <DonutLogo size={44} variant="purple" className="animate-bob" />
          <div>
            <h2 className="font-pixel text-[17px] text-white text-shadow-mc">MONTANT LIBRE</h2>
            <p className="mt-2 text-xs text-ink-400">Même taux, au Donut près.</p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input
            type="number"
            min={10}
            step={10}
            value={custom}
            onChange={(e) => setCustom(Math.max(0, Number(e.target.value) || 0))}
            className="field flex-1 font-display text-lg"
            aria-label="Montant en millions de Donuts"
          />
          <span className="font-pixel text-base text-ink-300">M</span>
        </div>

        <p className="mb-5 text-center">
          <span className="price-tag text-3xl">{formatEUR(priceForM(custom))}</span>
        </p>

        <div className="relative">
          <SprinkleBurst show={addedId === 'custom'} />
          <button
            type="button"
            onClick={() => handleAdd(custom, 'custom')}
            disabled={custom <= 0}
            className="btn-primary w-full"
          >
            {addedId === 'custom' ? 'Ajouté !' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  );
}
