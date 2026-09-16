'use client';

import { useMemo, useState } from 'react';
import { CATALOG, CATEGORIES } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';
import DonutLogo from './DonutLogo';

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
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-donut-chocoDark/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[82vh] w-full max-w-2xl animate-pop-in flex-col overflow-hidden rounded-3xl border border-white/70 bg-donut-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-donut-pinkLight bg-white/60 p-4">
          <div className="flex items-center gap-3">
            <DonutLogo size={36} className="animate-float" />
            <h3 className="font-display text-xl font-semibold">Choisir un item</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg transition hover:bg-donut-pinkLight"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2 border-b border-donut-pinkLight p-4 sm:flex-row">
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
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-2 overflow-y-auto p-4 sm:grid-cols-2">
          {filtered.map((item, i) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onPick(item.id)}
              className="group flex animate-slide-up items-center gap-3 rounded-2xl border-2 border-transparent bg-white/70 p-3 text-left transition hover:-translate-y-0.5 hover:border-donut-pink hover:bg-white hover:shadow-soft"
              style={{ animationDelay: `${Math.min(i, 10) * 25}ms` }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-donut-pinkLight to-donut-creamDark text-2xl transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug">{item.name}</span>
                <span className="block text-xs text-donut-choco/60">{item.valueM.toLocaleString('fr-FR')} M</span>
              </span>
              <span className="shrink-0 text-sm font-bold text-donut-pinkDark">
                {formatEUR(priceForM(item.valueM))}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 py-10 text-center text-sm text-donut-choco/60">Aucun item trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
}
