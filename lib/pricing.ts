/** Taux de change unique : € par Million de Donuts (500 M = 10 €). */
export const RATE = 0.02;

/** Montant de référence affiché dans les textes du site. */
export const REFERENCE_M = 500;

export function priceForM(amountM: number): number {
  return Math.round(amountM * RATE * 100) / 100;
}

export function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

export function formatM(amountM: number): string {
  return amountM >= 1000
    ? `${(amountM / 1000).toLocaleString('fr-FR')} Md`
    : `${amountM.toLocaleString('fr-FR')} M`;
}
