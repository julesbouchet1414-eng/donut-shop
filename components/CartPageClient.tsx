'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { formatEUR, priceForM } from '@/lib/pricing';
import { CATALOG_MAP } from '@/lib/catalog';
import type { CartLine } from '@/lib/types';

const PSEUDO_RE = /^[A-Za-z0-9_]{3,16}$/;

function lineLabel(line: CartLine): string {
  if (line.kind === 'money') return `💰 ${line.amountM.toLocaleString('fr-FR')} M`;
  if (line.kind === 'item') {
    const item = CATALOG_MAP[line.itemId];
    return item ? `${item.icon} ${item.name}` : 'Item inconnu';
  }
  const parts = line.slots.map((s) => {
    const item = CATALOG_MAP[s.itemId];
    return item ? `${item.icon}×${s.qty}` : '?';
  });
  return `📦 Shulker (${parts.join(' ')})`;
}

function lineUnitValueM(line: CartLine): number {
  if (line.kind === 'money') return line.amountM;
  if (line.kind === 'item') return CATALOG_MAP[line.itemId]?.valueM ?? 0;
  return line.slots.reduce((s, sl) => s + (CATALOG_MAP[sl.itemId]?.valueM ?? 0) * sl.qty, 0);
}

export default function CartPageClient() {
  const { lines, removeLine, setLineQty, clear, total } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [pseudo, setPseudo] = useState('');
  const [pseudoConfirm, setPseudoConfirm] = useState('');
  const [discord, setDiscord] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderId: string; totalEUR: number } | null>(null);

  const pseudoValid = PSEUDO_RE.test(pseudo);
  const pseudosMatch = pseudo.length > 0 && pseudo === pseudoConfirm;

  async function handleSubmit() {
    setError(null);
    if (!pseudoValid) {
      setError('Pseudo Minecraft invalide (3 à 16 caractères : lettres, chiffres, underscore).');
      return;
    }
    if (!pseudosMatch) {
      setError('Les deux pseudos ne correspondent pas.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo,
          pseudoConfirm,
          discord,
          lines: lines.map((l) =>
            l.kind === 'shulker'
              ? { kind: 'shulker', slots: l.slots, qty: l.qty }
              : l.kind === 'item'
                ? { kind: 'item', itemId: l.itemId, qty: l.qty }
                : { kind: 'money', amountM: l.amountM, qty: l.qty }
          ),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        setSubmitting(false);
        return;
      }
      setOrderResult({ orderId: data.orderId, totalEUR: data.totalEUR });
      setStep('success');
      clear();
    } catch {
      setError('Impossible de contacter le serveur. Réessaie.');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'success' && orderResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🍩✅</p>
        <h1 className="font-pixel text-base sm:text-xl mb-4">Commande envoyée !</h1>
        <p className="mb-2">
          Numéro de commande : <span className="font-mono font-bold">{orderResult.orderId}</span>
        </p>
        <p className="mb-6 text-xl font-bold">{formatEUR(orderResult.totalEUR)}</p>
        <p className="text-donut-chocoDark/70 mb-8">
          Contacte-nous en donnant ce numéro de commande pour finaliser le paiement et la livraison en jeu.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="font-pixel text-base sm:text-xl mb-4">Panier vide</h1>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/argent" className="btn-primary">
            Acheter de l&apos;argent
          </Link>
          <Link href="/items" className="btn-secondary">
            Voir les items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-pixel text-lg sm:text-2xl mb-6">Mon panier</h1>

      <div className="space-y-3 mb-8">
        {lines.map((line) => (
          <div key={line.id} className="bg-white/70 rounded-xl p-4 flex items-center gap-3 sm:gap-4 border border-black/5">
            <span className="flex-1 text-sm min-w-0">{lineLabel(line)}</span>
            <div className="flex items-center border border-black/10 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setLineQty(line.id, line.qty - 1)}
                disabled={line.qty <= 1}
                className="px-2 py-1 disabled:opacity-30"
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <span className="px-2 text-sm">{line.qty}</span>
              <button
                type="button"
                onClick={() => setLineQty(line.id, line.qty + 1)}
                className="px-2 py-1"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <span className="font-bold w-20 text-right shrink-0">
              {formatEUR(priceForM(lineUnitValueM(line) * line.qty))}
            </span>
            <button
              type="button"
              onClick={() => removeLine(line.id)}
              className="text-red-600 hover:text-red-800 shrink-0"
              aria-label="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8 text-xl font-bold border-t border-black/10 pt-4">
        <span>Total</span>
        <span>{formatEUR(total)}</span>
      </div>

      {step === 'cart' && (
        <button type="button" onClick={() => setStep('checkout')} className="btn-primary w-full text-lg py-3">
          Passer la commande
        </button>
      )}

      {step === 'checkout' && (
        <div className="bg-white/70 rounded-xl p-6 border border-black/5 space-y-4">
          <h2 className="font-semibold text-lg">Finaliser la commande</h2>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="pseudo">
              Pseudo Minecraft
            </label>
            <input
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value.trim())}
              className="w-full px-3 py-2 rounded-lg border border-black/10"
              placeholder="Ton pseudo exact"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="pseudo-confirm">
              Confirme ton pseudo Minecraft
            </label>
            <input
              id="pseudo-confirm"
              value={pseudoConfirm}
              onChange={(e) => setPseudoConfirm(e.target.value.trim())}
              className="w-full px-3 py-2 rounded-lg border border-black/10"
              placeholder="Retape ton pseudo"
              autoComplete="off"
            />
            {pseudoConfirm.length > 0 && !pseudosMatch && (
              <p className="text-red-600 text-xs mt-1">Les pseudos ne correspondent pas.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="discord">
              Discord (optionnel)
            </label>
            <input
              id="discord"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/10"
              placeholder="pseudo Discord"
              autoComplete="off"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep('cart')} className="btn-secondary flex-1">
              Retour
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !pseudoValid || !pseudosMatch}
              className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Envoi...' : 'Envoyer ma commande'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
