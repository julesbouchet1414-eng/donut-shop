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
 *
 * `icon` sert aux libellés en texte brut (récap de commande, admin),
 * `sprite` désigne l'icône pixel-art affichée dans l'interface.
 */
export const CATALOG: CatalogItem[] = [
  { id: 'elytra', name: 'Élytres', category: 'equipement', icon: '🪽', sprite: 'elytra', valueM: 500, maxStack: 1, rarity: 'epique' },
  { id: 'casque-netherite', name: 'Casque Netherite (Prot IV, Unbreaking III, Mending)', category: 'equipement', icon: '⛑️', sprite: 'helmet', valueM: 350, maxStack: 1, rarity: 'rare' },
  { id: 'plastron-netherite', name: 'Plastron Netherite (Prot IV, Unbreaking III, Mending)', category: 'equipement', icon: '🦺', sprite: 'chestplate', valueM: 450, maxStack: 1, rarity: 'rare' },
  { id: 'epee-netherite', name: 'Épée Netherite (Tranchant V, Butin III, Mending)', category: 'equipement', icon: '⚔️', sprite: 'sword', valueM: 400, maxStack: 1, rarity: 'rare' },
  { id: 'hache-netherite', name: 'Hache Netherite (Tranchant V, Mending)', category: 'equipement', icon: '🪓', sprite: 'axe', valueM: 380, maxStack: 1, rarity: 'rare' },
  { id: 'arc-enchante', name: 'Arc (Puissance V, Infinité, Mending)', category: 'equipement', icon: '🏹', sprite: 'bow', valueM: 300, maxStack: 1, rarity: 'rare' },
  { id: 'trident', name: 'Trident (Fidélité III, Canalisation, Perforation V, Mending)', category: 'equipement', icon: '🔱', sprite: 'trident', valueM: 650, maxStack: 1, rarity: 'epique' },

  { id: 'livre-mending', name: 'Livre enchanté : Mending', category: 'livres', icon: '📗', sprite: 'bookGreen', valueM: 180, maxStack: 1, rarity: 'rare' },
  { id: 'livre-protection4', name: 'Livre enchanté : Protection IV', category: 'livres', icon: '📘', sprite: 'bookBlue', valueM: 130, maxStack: 1, rarity: 'commun' },
  { id: 'livre-sharpness5', name: 'Livre enchanté : Tranchant V', category: 'livres', icon: '📕', sprite: 'bookRed', valueM: 150, maxStack: 1, rarity: 'commun' },
  { id: 'livre-efficiency5', name: 'Livre enchanté : Efficacité V', category: 'livres', icon: '📙', sprite: 'bookGold', valueM: 110, maxStack: 1, rarity: 'commun' },

  { id: 'pomme-doree-ench', name: 'Pomme dorée enchantée', category: 'consommables', icon: '🍏', sprite: 'apple', valueM: 110, maxStack: 64, rarity: 'rare' },
  { id: 'potion-force2', name: 'Potion de Force II (longue durée)', category: 'consommables', icon: '🧪', sprite: 'potion', valueM: 100, maxStack: 1, rarity: 'commun' },

  { id: 'nether-star', name: 'Étoile du Nether', category: 'blocs', icon: '⭐', sprite: 'star', valueM: 700, maxStack: 64, rarity: 'epique' },
  { id: 'bloc-netherite', name: 'Bloc de Netherite', category: 'blocs', icon: '🟫', sprite: 'netheriteBlock', valueM: 950, maxStack: 64, rarity: 'epique' },
  { id: 'beacon', name: 'Balise (Beacon)', category: 'blocs', icon: '🔆', sprite: 'beacon', valueM: 500, maxStack: 64, rarity: 'rare' },
  { id: 'shulker-vide', name: 'Shulker Box (vide)', category: 'blocs', icon: '🟪', sprite: 'shulker', valueM: 180, maxStack: 1, rarity: 'rare' },
  { id: 'tete-joueur', name: 'Tête de joueur (rare)', category: 'blocs', icon: '💀', sprite: 'head', valueM: 120, maxStack: 1, rarity: 'commun' },
  { id: 'oeuf-dragon', name: 'Œuf de Dragon', category: 'blocs', icon: '🥚', sprite: 'dragonEgg', valueM: 2500, maxStack: 1, rarity: 'legendaire' },
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
  { id: 'm5000', amountM: 5000, label: 'Best deal' },
];
