'use client';

import { useState } from 'react';
import { CATALOG_MAP } from '@/lib/catalog';
import { formatEUR, formatM, priceForM } from '@/lib/pricing';
import { useCart } from './CartProvider';
import ItemPickerModal from './ItemPickerModal';
import SprinkleBurst from './SprinkleBurst';
import PixelIcon from './PixelIcon';

type SlotData = { itemId: string; qty: number } | null;

const SLOT_COUNT = 27;

export default function ShulkerBuilder() {
  const [slots, setSlots] = useState<SlotData[]>(Array(SLOT_COUNT).fill(null));
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { addShulker } = useCart();

  const totalM = slots.reduce((sum, s) => sum + (s ? (CATALOG_MAP[s.itemId]?.valueM ?? 0) * s.qty : 0), 0);
  const filledCount = slots.filter(Boolean).length;
  const fillPercent = Math.round((filledCount / SLOT_COUNT) * 100);

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
      const next = [...prev];
      next[index] = { ...slot, qty: Math.min(Math.max(slot.qty + delta, 1), max) };
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
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="panel panel-raised animate-pop-in p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PixelIcon name="shulker" size={24} />
            <p className="font-pixel text-[15px] text-white text-shadow-mc">SHULKER BOX</p>
          </div>
          <span className="font-pixel text-[13px] text-ink-300">
            {filledCount}/{SLOT_COUNT}
          </span>
        </div>

        <div className="xp-bar mb-5">
          <span style={{ width: `${fillPercent}%` }} />
        </div>

        <div className="mb-5 flex justify-center">
          <div className="grid grid-cols-9 gap-1">
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
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-night-900 pt-4 sm:flex-row">
          <div>
            <p className="font-pixel text-[13px] uppercase text-ink-400">Total shulker</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="price-tag !px-0 text-3xl">{formatEUR(priceForM(totalM))}</span>
              <span className="font-pixel text-[13px] text-mc-emerald">{formatM(totalM)}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={clearAll} disabled={filledCount === 0} className="btn-mc">
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
        <p className="mt-4 animate-fade-in text-center text-xs text-ink-400">
          Clique sur une case pour choisir un item, puis survole-la pour ajuster la quantité.
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
      <button type="button" onClick={onClick} className="slot" aria-label="Ajouter un item">
        <span className="font-pixel text-[15px] text-ink-400/40">+</span>
      </button>
    );
  }

  const item = CATALOG_MAP[slot.itemId];
  if (!item) return <div className="slot" />;

  const enchanted = item.rarity === 'epique' || item.rarity === 'legendaire';

  return (
    <div
      className={`slot slot-filled group ${enchanted ? 'enchanted' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <PixelIcon name={item.sprite} size={30} />
      {item.maxStack > 1 && <span className="qty-badge">{slot.qty}</span>}

      <div className="mc-tooltip text-left">
        <p className={`font-display text-xs font-bold rarity-${item.rarity}`}>{item.name}</p>
        <p className="mt-0.5 font-pixel text-[12px] text-ink-400">{formatM(item.valueM * slot.qty)}</p>
        <div className="mt-2 flex items-center gap-1">
          {item.maxStack > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement();
                }}
                className="pointer-events-auto border border-night-400 bg-night-600 px-1.5 font-pixel text-[12px] hover:bg-night-500"
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
                className="pointer-events-auto border border-night-400 bg-night-600 px-1.5 font-pixel text-[12px] hover:bg-night-500"
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
            className="pointer-events-auto border border-mc-redstone/60 bg-mc-redstone/25 px-1.5 font-pixel text-[12px] text-mc-redstone hover:bg-mc-redstone/40"
            aria-label="Retirer l'item"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}
