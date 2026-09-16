'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { formatEUR, priceForM } from '@/lib/pricing';
import { CATALOG_MAP } from '@/lib/catalog';
import type { CartLine } from '@/lib/types';
import DonutLogo from './DonutLogo';
import SprinkleRain from './SprinkleRain';

const PSEUDO_RE = /^[A-Za-z0-9_]{3,16}$/;

function lineLabel(line: CartLine): string {
  if (line.kind === 'money') return `${line.amountM.toLocaleString('fr-FR')} M de Donuts`;
  if (line.kind === 'item') {
    const item = CATALOG_MAP[line.itemId];
    return item ? `${item.icon} ${item.name}` : 'Item inconnu';
  }
  const parts = line.slots.map((s) => {
    const item = CATALOG_MAP[s.itemId];
    return item ? `${item.icon}×${s.qty}` : '?';
  });
  return `Shulker (${parts.join(' ')})`;
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
      <div className="relative mx-auto max-w-xl px-4 py-20 text-center">
        <SprinkleRain />
        <div className="relative z-10">
          <DonutLogo size={150} className="mx-auto animate-stamp" title="Commande confirmée" />
          <h1 className="mt-6 font-display text-4xl font-bold">
            <span className="title-gradient">Commande envoyée !</span>
          </h1>

          <div className="card mt-8 p-6">
            <p className="text-sm text-donut-choco/70">Numéro de commande</p>
            <p className="mt-1 break-all font-mono text-sm font-bold">{orderResult.orderId}</p>
            <p className="mt-4">
              <span className="price-tag text-3xl">{formatEUR(orderResult.totalEUR)}</span>
            </p>
          </div>

          <p className="mt-6 text-donut-choco/75">
            Contacte-nous avec ce numéro de commande pour finaliser le paiement et la livraison en jeu.
          </p>

          <Link href="/" className="btn-primary mt-8">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <DonutLogo size={130} variant="choco" className="mx-auto animate-float opacity-70" />
        <h1 className="mt-6 font-display text-3xl font-bold">Ton panier est vide</h1>
        <p className="mt-2 text-donut-choco/70">Il est temps de le remplir de Donuts et d&apos;items rares.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex animate-slide-up items-center gap-4">
        <DonutLogo size={64} className="animate-float" />
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          <span className="title-gradient">Mon panier</span>
        </h1>
      </div>

      <div className="stagger mb-8 space-y-3">
        {lines.map((line) => (
          <div key={line.id} className="card card-hover flex items-center gap-3 p-4 sm:gap-4">
            <span className="min-w-0 flex-1 text-sm font-medium">{lineLabel(line)}</span>

            <div className="flex shrink-0 items-center overflow-hidden rounded-full border-2 border-donut-pinkLight bg-white/80">
              <button
                type="button"
                onClick={() => setLineQty(line.id, line.qty - 1)}
                disabled={line.qty <= 1}
                className="px-2.5 py-1 font-bold text-donut-pinkDark transition hover:bg-donut-pinkLight disabled:opacity-30"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="min-w-6 px-1 text-center text-sm font-bold">{line.qty}</span>
              <button
                type="button"
                onClick={() => setLineQty(line.id, line.qty + 1)}
                className="px-2.5 py-1 font-bold text-donut-pinkDark transition hover:bg-donut-pinkLight"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>

            <span className="w-20 shrink-0 text-right font-display text-lg font-bold text-donut-pinkDark">
              {formatEUR(priceForM(lineUnitValueM(line) * line.qty))}
            </span>

            <button
              type="button"
              onClick={() => removeLine(line.id)}
              className="shrink-0 rounded-full p-1.5 text-donut-choco/40 transition hover:bg-donut-coral/15 hover:text-donut-coral"
              aria-label="Supprimer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="card mb-8 flex items-center justify-between p-5">
        <span className="font-display text-xl font-semibold">Total</span>
        <span className="price-tag text-3xl">{formatEUR(total)}</span>
      </div>

      {step === 'cart' && (
        <button type="button" onClick={() => setStep('checkout')} className="btn-primary w-full py-4 text-lg">
          Passer la commande
        </button>
      )}

      {step === 'checkout' && (
        <div className="card animate-slide-up space-y-4 p-6">
          <div className="flex items-center gap-3">
            <DonutLogo size={44} variant="gold" />
            <h2 className="font-display text-2xl font-semibold">Finaliser la commande</h2>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="pseudo">
              Pseudo Minecraft
            </label>
            <input
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value.trim())}
              className="field"
              placeholder="Ton pseudo exact"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="pseudo-confirm">
              Confirme ton pseudo Minecraft
            </label>
            <input
              id="pseudo-confirm"
              value={pseudoConfirm}
              onChange={(e) => setPseudoConfirm(e.target.value.trim())}
              className="field"
              placeholder="Retape ton pseudo"
              autoComplete="off"
            />
            {pseudoConfirm.length > 0 && !pseudosMatch && (
              <p className="mt-1 animate-fade-in text-xs font-semibold text-donut-coral">
                Les pseudos ne correspondent pas.
              </p>
            )}
            {pseudosMatch && pseudoValid && (
              <p className="mt-1 animate-fade-in text-xs font-semibold text-emerald-600">Les pseudos correspondent.</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="discord">
              Discord <span className="font-normal text-donut-choco/50">(optionnel)</span>
            </label>
            <input
              id="discord"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              className="field"
              placeholder="pseudo Discord"
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="animate-fade-in rounded-2xl bg-donut-coral/15 px-4 py-2 text-sm font-semibold text-donut-coral">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setStep('cart')} className="btn-secondary flex-1">
              Retour
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !pseudoValid || !pseudosMatch}
              className="btn-primary flex-1"
            >
              {submitting ? 'Envoi...' : 'Envoyer ma commande'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
