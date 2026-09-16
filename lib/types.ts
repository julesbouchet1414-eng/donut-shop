export type Category = 'equipement' | 'livres' | 'consommables' | 'blocs';

export interface CatalogItem {
  id: string;
  name: string;
  category: Category;
  icon: string;
  /** Valeur de l'item en jeu, en millions de Donuts. */
  valueM: number;
  /** Taille de stack max (comme dans Minecraft : 1 ou 64). */
  maxStack: number;
}

export interface MoneyPreset {
  id: string;
  amountM: number;
  label?: string;
}

export type ShulkerSlotContent = { itemId: string; qty: number };

export type CartLine =
  | { id: string; kind: 'money'; amountM: number; qty: number }
  | { id: string; kind: 'item'; itemId: string; qty: number }
  | { id: string; kind: 'shulker'; label: string; slots: ShulkerSlotContent[]; qty: number };

export interface ResolvedLine {
  kind: 'money' | 'item' | 'shulker';
  label: string;
  totalEUR: number;
}

export type OrderStatus = 'nouvelle' | 'payee' | 'livree' | 'annulee';

export interface StoredOrder {
  id: string;
  createdAt: string;
  pseudo: string;
  discord?: string;
  lines: ResolvedLine[];
  totalEUR: number;
  status: OrderStatus;
}
