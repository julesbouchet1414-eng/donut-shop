'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartLine, ShulkerSlotContent } from '@/lib/types';
import { uid } from '@/lib/uid';
import { CATALOG_MAP } from '@/lib/catalog';
import { RATE } from '@/lib/pricing';

const STORAGE_KEY = 'donutshop_cart_v1';
const MAX_LINE_QTY = 64;

function lineValueM(line: CartLine): number {
  if (line.kind === 'money') return line.amountM * line.qty;
  if (line.kind === 'item') {
    const item = CATALOG_MAP[line.itemId];
    return item ? item.valueM * line.qty : 0;
  }
  const perUnit = line.slots.reduce((sum, s) => {
    const item = CATALOG_MAP[s.itemId];
    return sum + (item ? item.valueM * s.qty : 0);
  }, 0);
  return perUnit * line.qty;
}

export function lineTotalEUR(line: CartLine): number {
  return Math.round(lineValueM(line) * RATE * 100) / 100;
}

interface CartContextValue {
  lines: CartLine[];
  addMoney: (amountM: number, qty?: number) => void;
  addItem: (itemId: string, qty?: number) => void;
  addShulker: (slots: ShulkerSlotContent[]) => void;
  removeLine: (id: string) => void;
  setLineQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // `null` = pas encore hydraté depuis localStorage (rendu serveur / premier rendu client).
  // Tant que c'est le cas, l'effet de sauvegarde ci-dessous ne doit RIEN écrire, sinon il
  // écraserait un panier déjà enregistré avec ce tableau vide initial (React (Strict Mode,
  // actif par défaut en dev) peut monter/re-monter les effets avant que le chargement
  // n'ait appliqué son résultat).
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const currentLines = lines ?? [];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setLines(raw ? JSON.parse(raw) : []);
    } catch {
      // localStorage indisponible (navigation privée, etc.) : on repart d'un panier vide.
      setLines([]);
    }
  }, []);

  useEffect(() => {
    if (lines === null) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // idem : on ignore silencieusement si le stockage local n'est pas disponible.
    }
  }, [lines]);

  function addMoney(amountM: number, qty = 1) {
    if (!Number.isFinite(amountM) || amountM <= 0) return;
    setLines((prev) => {
      const base = prev ?? [];
      const existing = base.find((l) => l.kind === 'money' && l.amountM === amountM);
      if (existing) {
        return base.map((l) =>
          l.id === existing.id ? { ...l, qty: Math.min(l.qty + qty, MAX_LINE_QTY) } : l
        );
      }
      return [...base, { id: uid(), kind: 'money', amountM, qty: Math.min(qty, MAX_LINE_QTY) }];
    });
  }

  function addItem(itemId: string, qty = 1) {
    const item = CATALOG_MAP[itemId];
    if (!item) return;
    setLines((prev) => {
      const base = prev ?? [];
      const existing = base.find((l) => l.kind === 'item' && l.itemId === itemId);
      if (existing) {
        return base.map((l) =>
          l.id === existing.id ? { ...l, qty: Math.min(l.qty + qty, item.maxStack) } : l
        );
      }
      return [...base, { id: uid(), kind: 'item', itemId, qty: Math.min(qty, item.maxStack) }];
    });
  }

  function addShulker(slots: ShulkerSlotContent[]) {
    if (slots.length === 0) return;
    setLines((prev) => [
      ...(prev ?? []),
      { id: uid(), kind: 'shulker', label: 'Shulker personnalisée', slots, qty: 1 },
    ]);
  }

  function removeLine(id: string) {
    setLines((prev) => (prev ?? []).filter((l) => l.id !== id));
  }

  function setLineQty(id: string, qty: number) {
    if (qty < 1) return;
    setLines((prev) =>
      (prev ?? []).map((l) => {
        if (l.id !== id) return l;
        if (l.kind === 'item') {
          const item = CATALOG_MAP[l.itemId];
          return { ...l, qty: Math.min(qty, item?.maxStack ?? MAX_LINE_QTY) };
        }
        return { ...l, qty: Math.min(qty, MAX_LINE_QTY) };
      })
    );
  }

  function clear() {
    setLines([]);
  }

  const total = Math.round(currentLines.reduce((sum, l) => sum + lineTotalEUR(l), 0) * 100) / 100;

  return (
    <CartContext.Provider
      value={{ lines: currentLines, addMoney, addItem, addShulker, removeLine, setLineQty, clear, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
