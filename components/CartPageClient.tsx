'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { formatEUR, formatM, priceForM } from '@/lib/pricing';
import { CATALOG_MAP } from '@/lib/catalog';
import type { CartLine } from '@/lib/types';
import PixelIcon from './PixelIcon';
import DonutLogo from './DonutLogo';
import SprinkleRain from './SprinkleRain';

const PSEUDO_RE = /^[A-Za-z0-9_]{3,16}$/;

function lineSprite(line: CartLine): string {
  if (line.kind === 'money') return 'donut';
  if (line.kind === 'item') return CATALOG_MAP[line.itemId]?.sprite ?? 'donut';
  return 'shulker';
}

function lineLabel(line: CartLine): string {
  if (line.kind === 'money') return `${formatM(line.amountM)} de Donuts`;
  if (line.kind === 'item') return CATALOG_MAP[line.itemId]?.name ?? 'Item inconnu';
  return `Shulker personnalisée · ${line.slots.length} item${line.slots.length > 1 ? 's' : ''}`;
}

function lineDetail(line: CartLine): string | null {
  if (line.kind !== 'shulker') return null;
  return line.slots
    .map((s) => {
      const item = CATALOG_MAP[s.itemId];
      return item ? `${item.name} ×${s.qty}` : null;
    })
    .filter(Boolean)
    .join(' · ');
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
  const totalM = lines.reduce((sum, l) => sum + lineUnitValueM(l) * l.qty, 0);

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
          <DonutLogo size={140} className="mx-auto animate-stamp" title="Commande confirmée" />
          <h1 className="mc-title mt-8 text-3xl leading-tight sm:text-4xl">COMMANDE ENVOYÉE !</h1>

          <div className="panel panel-raised mt-8 p-6">
            <p className="font-pixel text-[13px] uppercase text-ink-400">Numéro de commande</p>
            <p className="mt-2 break-all font-mono text-sm font-bold text-mc-emerald">{orderResult.orderId}</p>
            <p className="mt-5">
              <span className="price-tag text-3xl">{formatEUR(orderResult.totalEUR)}</span>
            </p>
          </div>

          <p className="mt-6 text-sm text-ink-300">
            Contacte-nous avec ce numéro de commande pour finaliser le paiement et la livraison en jeu.
          </p>

          <Link href="/" className="btn-mc mt-8">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="panel panel-raised mx-auto flex h-28 w-28 items-center justify-center">
          <PixelIcon name="shulker" size={64} className="animate-bob opacity-70" />
        </span>
        <h1 className="mc-title-purple mt-8 text-3xl sm:text-4xl">PANIER VIDE</h1>
        <p className="mt-4 text-sm text-ink-300">Il est temps de le remplir de Donuts et d&apos;items rares.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/argent" className="btn-primary">
            Acheter de l&apos;argent
          </Link>
          <Link href="/items" className="btn-mc">
            Voir les items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mc-title mb-8 animate-slide-up text-3xl sm:text-4xl">MON PANIER</h1>

      <div className="stagger mb-6 space-y-2">
        {lines.map((line) => {
          const detail = lineDetail(line);
          return (
            <div key={line.id} className="panel flex items-center gap-3 p-3 sm:gap-4">
              <span className="slot !h-12 !w-12 !cursor-default shrink-0">
                <PixelIcon name={lineSprite(line)} size={32} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink-100">{lineLabel(line)}</span>
                {detail && <span className="mt-0.5 block truncate text-xs text-ink-400">{detail}</span>}
              </span>

              <div className="flex shrink-0 items-center border-2 border-night-400 bg-night-900">
                <button
                  type="button"
                  onClick={() => setLineQty(line.id, line.qty - 1)}
                  disabled={line.qty <= 1}
                  className="px-2 py-1 font-pixel text-[15px] text-ink-200 transition hover:bg-night-600 disabled:opacity-30"
                  aria-label="Diminuer la quantité"
                >
                  -
                </button>
                <span className="min-w-7 px-1 text-center font-pixel text-[15px]">{line.qty}</span>
                <button
                  type="button"
                  onClick={() => setLineQty(line.id, line.qty + 1)}
                  className="px-2 py-1 font-pixel text-[15px] text-ink-200 transition hover:bg-night-600"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>

              <span className="w-20 shrink-0 text-right font-display text-lg font-bold text-mc-gold">
                {formatEUR(priceForM(lineUnitValueM(line) * line.qty))}
              </span>

              <button
                type="button"
                onClick={() => removeLine(line.id)}
                className="shrink-0 px-2 py-1 font-pixel text-[15px] text-ink-400 transition hover:text-mc-redstone"
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <div className="panel panel-raised mb-8 flex items-center justify-between p-5">
        <div>
          <span className="font-pixel text-[15px] uppercase text-ink-300">Total</span>
          <p className="mt-1 font-pixel text-[13px] text-mc-emerald">{formatM(totalM)}</p>
        </div>
        <span className="price-tag text-3xl">{formatEUR(total)}</span>
      </div>

      {step === 'cart' && (
        <button type="button" onClick={() => setStep('checkout')} className="btn-primary w-full !py-4 !text-base">
          Passer la commande
        </button>
      )}

      {step === 'checkout' && (
        <div className="panel panel-raised animate-slide-up space-y-4 p-6">
          <h2 className="font-pixel text-[17px] text-white text-shadow-mc">FINALISER</h2>

          <div>
            <label className="mb-1.5 block font-display text-xs font-semibold uppercase text-ink-300" htmlFor="pseudo">
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
            <label
              className="mb-1.5 block font-display text-xs font-semibold uppercase text-ink-300"
              htmlFor="pseudo-confirm"
            >
              Confirme ton pseudo
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
              <p className="mt-1.5 animate-fade-in text-xs font-semibold text-mc-redstone">
                Les pseudos ne correspondent pas.
              </p>
            )}
            {pseudosMatch && pseudoValid && (
              <p className="mt-1.5 animate-fade-in text-xs font-semibold text-mc-emerald">
                Les pseudos correspondent.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block font-display text-xs font-semibold uppercase text-ink-300" htmlFor="discord">
              Discord <span className="normal-case text-ink-400">(optionnel)</span>
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
            <p className="animate-fade-in border-2 border-mc-redstone/50 bg-mc-redstone/15 px-4 py-2 text-sm font-semibold text-mc-redstone">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setStep('cart')} className="btn-mc flex-1">
              Retour
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !pseudoValid || !pseudosMatch}
              className="btn-primary flex-1"
            >
              {submitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
