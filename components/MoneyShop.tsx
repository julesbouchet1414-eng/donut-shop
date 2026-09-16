'use client';

import { useState } from 'react';
import { MONEY_PRESETS } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';
import DonutLogo, { type GlazeVariant } from './DonutLogo';
import SprinkleBurst from './SprinkleBurst';

const VARIANTS: GlazeVariant[] = ['pink', 'gold', 'mint', 'choco', 'pink', 'gold'];

function shortAmount(amountM: number): string {
  return amountM >= 1000 ? `${(amountM / 1000).toLocaleString('fr-FR')} Md` : `${amountM} M`;
}

export default function MoneyShop() {
  const { addMoney } = useCart();
  const [custom, setCustom] = useState(100);
  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAdd(amountM: number, key: string) {
    if (amountM <= 0) return;
    addMoney(amountM);
    setAddedId(key);
    setTimeout(() => setAddedId(null), 1400);
  }

  return (
    <div>
      <div className="stagger mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MONEY_PRESETS.map((p, i) => (
          <div key={p.id} className="card card-hover group relative overflow-hidden p-6 text-center">
            {p.label && (
              <span className="absolute right-4 top-4 rounded-full bg-donut-pinkDark px-3 py-1 text-xs font-bold text-white">
                {p.label}
              </span>
            )}

            <div className="relative mx-auto w-fit">
              <SprinkleBurst show={addedId === p.id} />
              <DonutLogo
                size={128}
                variant={VARIANTS[i % VARIANTS.length]}
                className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-white/85 px-2 py-0.5 font-display text-sm font-bold text-donut-chocoDark shadow">
                  {shortAmount(p.amountM)}
                </span>
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-donut-choco/70">
              {p.amountM.toLocaleString('fr-FR')} Donuts
            </p>
            <p className="my-3">
              <span className="price-tag text-2xl">{formatEUR(priceForM(p.amountM))}</span>
            </p>

            <button type="button" onClick={() => handleAdd(p.amountM, p.id)} className="btn-primary w-full">
              {addedId === p.id ? 'Ajouté !' : 'Ajouter au panier'}
            </button>
          </div>
        ))}
      </div>

      <div className="card relative mx-auto max-w-lg overflow-hidden p-7">
        <div className="mb-5 flex items-center gap-3">
          <DonutLogo size={52} variant="gold" className="animate-float" />
          <div>
            <h2 className="font-display text-2xl font-semibold">Montant personnalisé</h2>
            <p className="text-sm text-donut-choco/70">Le prix suit exactement le même taux.</p>
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
          <span className="font-display text-lg font-semibold">M</span>
        </div>

        <p className="mb-5">
          <span className="price-tag text-2xl">{formatEUR(priceForM(custom))}</span>
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
