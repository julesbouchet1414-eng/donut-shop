import type { CatalogItem, Category, MoneyPreset } from './types';

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'equipement', label: 'Équipement', icon: '⚔️' },
  { id: 'livres', label: 'Livres enchantés', icon: '📚' },
  { id: 'consommables', label: 'Consommables', icon: '🍎' },
  { id: 'blocs', label: 'Blocs & Objets rares', icon: '💎' },
];

/**
 * Catalogue d'exemple : uniquement des items chers, dont le prix en euros est
 * calculé automatiquement (valueM * RATE, voir lib/pricing.ts). Les valeurs
 * en Donuts (valueM) sont des exemples à ajuster au marché réel du serveur.
 */
export const CATALOG: CatalogItem[] = [
  { id: 'elytra', name: 'Élytres', category: 'equipement', icon: '🪽', valueM: 500, maxStack: 1 },
  { id: 'casque-netherite', name: 'Casque Netherite (Prot IV, Unbreaking III, Mending)', category: 'equipement', icon: '⛑️', valueM: 350, maxStack: 1 },
  { id: 'plastron-netherite', name: 'Plastron Netherite (Prot IV, Unbreaking III, Mending)', category: 'equipement', icon: '🦺', valueM: 450, maxStack: 1 },
  { id: 'epee-netherite', name: 'Épée Netherite (Tranchant V, Butin III, Mending)', category: 'equipement', icon: '⚔️', valueM: 400, maxStack: 1 },
  { id: 'hache-netherite', name: 'Hache Netherite (Tranchant V, Mending)', category: 'equipement', icon: '🪓', valueM: 380, maxStack: 1 },
  { id: 'arc-enchante', name: 'Arc (Puissance V, Infinité, Mending)', category: 'equipement', icon: '🏹', valueM: 300, maxStack: 1 },
  { id: 'trident', name: 'Trident (Fidélité III, Canalisation, Perforation V, Mending)', category: 'equipement', icon: '🔱', valueM: 650, maxStack: 1 },

  { id: 'livre-mending', name: 'Livre enchanté : Mending', category: 'livres', icon: '📗', valueM: 180, maxStack: 1 },
  { id: 'livre-protection4', name: 'Livre enchanté : Protection IV', category: 'livres', icon: '📘', valueM: 130, maxStack: 1 },
  { id: 'livre-sharpness5', name: 'Livre enchanté : Tranchant V', category: 'livres', icon: '📕', valueM: 150, maxStack: 1 },
  { id: 'livre-efficiency5', name: 'Livre enchanté : Efficacité V', category: 'livres', icon: '📙', valueM: 110, maxStack: 1 },

  { id: 'pomme-doree-ench', name: 'Pomme dorée enchantée', category: 'consommables', icon: '🍏', valueM: 110, maxStack: 64 },
  { id: 'potion-force2', name: 'Potion de Force II (longue durée)', category: 'consommables', icon: '🧪', valueM: 100, maxStack: 1 },

  { id: 'nether-star', name: 'Étoile du Nether', category: 'blocs', icon: '⭐', valueM: 700, maxStack: 64 },
  { id: 'bloc-netherite', name: 'Bloc de Netherite', category: 'blocs', icon: '🟫', valueM: 950, maxStack: 64 },
  { id: 'beacon', name: 'Balise (Beacon)', category: 'blocs', icon: '🔆', valueM: 500, maxStack: 64 },
  { id: 'shulker-vide', name: 'Shulker Box (vide)', category: 'blocs', icon: '🟪', valueM: 180, maxStack: 1 },
  { id: 'tete-joueur', name: 'Tête de joueur (rare)', category: 'blocs', icon: '💀', valueM: 120, maxStack: 1 },
  { id: 'oeuf-dragon', name: 'Œuf de Dragon', category: 'blocs', icon: '🥚', valueM: 2500, maxStack: 1 },
];

export const CATALOG_MAP: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.map((item) => [item.id, item])
);

export function findItem(id: unknown): CatalogItem | null {
  if (typeof id !== 'string') return null;
  return CATALOG_MAP[id] ?? null;
}

export const MONEY_PRESETS: MoneyPreset[] = [
  { id: 'm100', amountM: 100 },
  { id: 'm250', amountM: 250 },
  { id: 'm500', amountM: 500, label: 'Populaire' },
  { id: 'm1000', amountM: 1000 },
  { id: 'm2500', amountM: 2500 },
  { id: 'm5000', amountM: 5000 },
];
