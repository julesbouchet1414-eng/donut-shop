'use client';

import { useMemo, useState } from 'react';
import { CATALOG, CATEGORIES } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';

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
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-donut-cream rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-black/10 flex items-center justify-between gap-3">
          <h3 className="font-pixel text-xs sm:text-sm">Choisir un item</h3>
          <button type="button" onClick={onClose} className="text-xl leading-none" aria-label="Fermer">
            ✕
          </button>
        </div>
        <div className="p-4 flex flex-col sm:flex-row gap-2 border-b border-black/10">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un item..."
            className="flex-1 px-3 py-2 rounded-lg border border-black/10"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-black/10"
          >
            <option value="all">Toutes catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onPick(item.id)}
              className="flex items-center gap-3 p-3 rounded-lg border border-black/10 hover:border-donut-pinkDark hover:bg-donut-pink/10 text-left"
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-sm leading-snug">{item.name}</span>
                <span className="block text-xs text-donut-chocoDark/60">
                  {item.valueM.toLocaleString('fr-FR')} M
                </span>
              </span>
              <span className="font-bold text-sm shrink-0">{formatEUR(priceForM(item.valueM))}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-donut-chocoDark/60 col-span-2 text-center py-8">
              Aucun item trouvé.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
