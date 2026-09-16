/** Taux de change unique : € par Million de Donuts (500 M = 15 €). */
export const RATE = 0.03;

export function priceForM(amountM: number): number {
  return Math.round(amountM * RATE * 100) / 100;
}

export function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}

export function formatM(amountM: number): string {
  return `${amountM.toLocaleString('fr-FR')} M`;
}
