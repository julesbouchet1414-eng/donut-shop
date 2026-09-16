'use client';

import { useState } from 'react';
import { CATALOG_MAP } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';
import ItemPickerModal from './ItemPickerModal';
import SprinkleBurst from './SprinkleBurst';

type SlotData = { itemId: string; qty: number } | null;

const SLOT_COUNT = 27;

export default function ShulkerBuilder() {
  const [slots, setSlots] = useState<SlotData[]>(Array(SLOT_COUNT).fill(null));
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { addShulker } = useCart();

  const totalM = slots.reduce((sum, s) => sum + (s ? (CATALOG_MAP[s.itemId]?.valueM ?? 0) * s.qty : 0), 0);
  const totalEUR = priceForM(totalM);
  const filledCount = slots.filter(Boolean).length;

  function pick(itemId: string) {
    if (pickerIndex === null) return;
    const index = pickerIndex;
    setSlots((prev) => {
      const next = [...prev];
      next[index] = { itemId, qty: 1 };
      return next;
    });
    setPickerIndex(null);
  }

  function updateQty(index: number, delta: number) {
    setSlots((prev) => {
      const slot = prev[index];
      if (!slot) return prev;
      const item = CATALOG_MAP[slot.itemId];
      const max = item?.maxStack ?? 1;
      const qty = Math.min(Math.max(slot.qty + delta, 1), max);
      const next = [...prev];
      next[index] = { ...slot, qty };
      return next;
    });
  }

  function removeSlot(index: number) {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  }

  function clearAll() {
    setSlots(Array(SLOT_COUNT).fill(null));
  }

  function handleAddToCart() {
    const composed = slots
      .filter((s): s is { itemId: string; qty: number } => s !== null)
      .map((s) => ({ itemId: s.itemId, qty: s.qty }));
    if (composed.length === 0) return;
    addShulker(composed);
    clearAll();
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const fillPercent = Math.round((filledCount / SLOT_COUNT) * 100);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mc-panel animate-pop-in rounded-3xl p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 text-donut-chocoDark">
          <p className="font-pixel text-[10px] sm:text-xs">Shulker Box</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-black/25 sm:w-40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-donut-glaze to-donut-pinkDark transition-all duration-500"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <span className="font-pixel text-[9px] sm:text-[10px]">
              {filledCount}/{SLOT_COUNT}
            </span>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-9 justify-center gap-1">
          {slots.map((slot, i) => (
            <ShulkerSlotView
              key={i}
              slot={slot}
              onClick={() => setPickerIndex(i)}
              onIncrement={() => updateQty(i, 1)}
              onDecrement={() => updateQty(i, -1)}
              onRemove={() => removeSlot(i)}
            />
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-black/15 pt-4 sm:flex-row">
          <div className="text-donut-chocoDark">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Total de la shulker</p>
            <p className="font-display text-3xl font-bold">
              {formatEUR(totalEUR)}
              <span className="ml-2 text-sm font-normal opacity-70">({totalM.toLocaleString('fr-FR')} M)</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={clearAll} disabled={filledCount === 0} className="btn-secondary disabled:opacity-40">
              Vider
            </button>
            <div className="relative">
              <SprinkleBurst show={added} />
              <button type="button" onClick={handleAddToCart} disabled={filledCount === 0} className="btn-primary">
                {added ? 'Ajouté !' : 'Ajouter au panier'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {filledCount === 0 && (
        <p className="mt-4 animate-fade-in text-center text-sm text-donut-choco/60">
          Astuce : clique sur une case grise pour choisir un item, puis survole-la pour ajuster la quantité.
        </p>
      )}

      {pickerIndex !== null && <ItemPickerModal onPick={pick} onClose={() => setPickerIndex(null)} />}
    </div>
  );
}

function ShulkerSlotView({
  slot,
  onClick,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  slot: SlotData;
  onClick: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  if (!slot) {
    return (
      <button type="button" onClick={onClick} className="mc-slot" title="Ajouter un item" aria-label="Ajouter un item">
        <span className="text-xl text-black/25">+</span>
      </button>
    );
  }

  const item = CATALOG_MAP[slot.itemId];
  if (!item) return <div className="mc-slot" />;

  return (
    <div
      className="mc-slot mc-slot-filled group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`${item.name} — clique pour remplacer`}
    >
      <span className="select-none text-xl leading-none sm:text-2xl">{item.icon}</span>
      {item.maxStack > 1 && <span className="qty-badge">{slot.qty}</span>}

      <div className="absolute inset-0 hidden flex-col items-center justify-center gap-0.5 bg-black/85 p-0.5 text-[9px] text-white group-hover:flex">
        <span className="line-clamp-2 px-0.5 text-center leading-tight">{item.name}</span>
        <div className="flex items-center gap-1">
          {item.maxStack > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement();
                }}
                className="rounded bg-white/20 px-1 transition hover:bg-white/40"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement();
                }}
                className="rounded bg-white/20 px-1 transition hover:bg-white/40"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded bg-red-600/80 px-1 transition hover:bg-red-500"
            aria-label="Retirer l'item"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
