'use client';

import { useState } from 'react';
import { CATALOG_MAP } from '@/lib/catalog';
import { formatEUR, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';
import ItemPickerModal from './ItemPickerModal';

type SlotData = { itemId: string; qty: number } | null;

const SLOT_COUNT = 27;

export default function ShulkerBuilder() {
  const [slots, setSlots] = useState<SlotData[]>(Array(SLOT_COUNT).fill(null));
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { addShulker } = useCart();

  const totalM = slots.reduce(
    (sum, s) => sum + (s ? (CATALOG_MAP[s.itemId]?.valueM ?? 0) * s.qty : 0),
    0
  );
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
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="mc-panel max-w-3xl mx-auto p-4 sm:p-6 rounded-xl">
      <div className="grid grid-cols-9 gap-1 justify-center mb-6">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 pt-4">
        <div>
          <p className="text-sm text-donut-chocoDark/70">
            {filledCount} / {SLOT_COUNT} emplacements remplis
          </p>
          <p className="text-xl font-bold">
            {formatEUR(totalEUR)}{' '}
            <span className="text-sm font-normal text-donut-chocoDark/60">
              ({totalM.toLocaleString('fr-FR')} M)
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={clearAll} className="btn-secondary">
            Vider
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={filledCount === 0}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {added ? '✅ Ajouté !' : 'Ajouter au panier'}
          </button>
        </div>
      </div>

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
        <span className="text-black/30 text-xl">+</span>
      </button>
    );
  }

  const item = CATALOG_MAP[slot.itemId];
  if (!item) return <div className="mc-slot" />;

  return (
    <div className="mc-slot group" onClick={onClick} role="button" tabIndex={0} title={item.name}>
      <span className="text-xl sm:text-2xl leading-none select-none">{item.icon}</span>
      {item.maxStack > 1 && <span className="qty-badge">{slot.qty}</span>}
      <div className="absolute inset-0 hidden group-hover:flex flex-col bg-black/85 text-white text-[9px] p-0.5 items-center justify-center gap-0.5">
        <span className="text-center leading-tight px-0.5 line-clamp-2">{item.name}</span>
        <div className="flex items-center gap-1">
          {item.maxStack > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement();
                }}
                className="px-1 bg-white/20 rounded"
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement();
                }}
                className="px-1 bg-white/20 rounded"
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
            className="px-1 bg-red-600/80 rounded"
            aria-label="Retirer l'item"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
