'use client';

import { useMemo, useState } from 'react';
import { CATALOG, CATEGORIES } from '@/lib/catalog';
import { formatEUR, formatM, priceForM } from '@/lib/pricing';
import PixelIcon from './PixelIcon';

export default function ItemPickerModal({
  onPick,
  onClose,
}: {
  onPick: (itemId: string) => void;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return CATALOG.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, search]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-night-900/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="panel panel-raised flex max-h-[82vh] w-full max-w-2xl animate-pop-in flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b-2 border-night-900 p-4">
          <h3 className="font-pixel text-[17px] text-white text-shadow-mc">CHOISIR UN ITEM</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn-mc !px-3 !py-1 !text-xs"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2 border-b-2 border-night-900 p-4 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un item..."
            className="field flex-1"
            autoFocus
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="field sm:w-56">
            <option value="all">Toutes catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-2 overflow-y-auto p-4 sm:grid-cols-2">
          {filtered.map((item, i) => {
            const enchanted = item.rarity === 'epique' || item.rarity === 'legendaire';
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onPick(item.id)}
                className="group flex animate-slide-up items-center gap-3 border-2 border-night-500 bg-night-700 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-mc-purple hover:bg-night-600"
                style={{ animationDelay: `${Math.min(i, 10) * 22}ms` }}
              >
                <span className={`slot !h-11 !w-11 !cursor-pointer ${enchanted ? 'enchanted' : ''}`}>
                  <PixelIcon name={item.sprite} size={32} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold leading-snug rarity-${item.rarity}`}>
                    {item.name}
                  </span>
                  <span className="block font-pixel text-[12px] text-ink-400">{formatM(item.valueM)}</span>
                </span>
                <span className="shrink-0 font-display text-sm font-bold text-mc-gold">
                  {formatEUR(priceForM(item.valueM))}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-2 py-10 text-center text-sm text-ink-400">Aucun item trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
