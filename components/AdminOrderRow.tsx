'use client';

import { useState } from 'react';
import type { OrderStatus, StoredOrder } from '@/lib/types';
import { formatEUR } from '@/lib/pricing';

const STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: 'Nouvelle',
  payee: 'Payée',
  livree: 'Livrée',
  annulee: 'Annulée',
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  nouvelle: 'border-mc-pink/60 bg-mc-pink/15 text-mc-pink',
  payee: 'border-mc-gold/60 bg-mc-gold/15 text-mc-gold',
  livree: 'border-mc-emerald/60 bg-mc-emerald/15 text-mc-emerald',
  annulee: 'border-ink-400/50 bg-night-600 text-ink-400',
};

export default function AdminOrderRow({
  order,
  onStatusChange,
  onDelete,
}: {
  order: StoredOrder;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      // presse-papiers indisponible (http, permission refusée) : on ignore.
    }
  }

  async function changeStatus(newStatus: OrderStatus) {
    const previous = order.status;
    onStatusChange(order.id, newStatus);
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) onStatusChange(order.id, previous);
    } catch {
      onStatusChange(order.id, previous);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
      if (res.ok) onDelete(order.id);
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  const recap = [
    `Commande ${order.id}`,
    `Pseudo : ${order.pseudo}`,
    ...(order.discord ? [`Discord : ${order.discord}`] : []),
    '',
    ...order.lines.map((l) => `- ${l.label} — ${formatEUR(l.totalEUR)}`),
    '',
    `Total : ${formatEUR(order.totalEUR)}`,
  ].join('\n');

  return (
    <div className="panel p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => copy(order.id, 'id')}
            className="block max-w-full truncate font-mono text-[11px] text-ink-400 transition hover:text-mc-purple"
            title="Copier le numéro de commande"
          >
            {copied === 'id' ? 'Numéro copié !' : order.id}
          </button>
          <button
            type="button"
            onClick={() => copy(order.pseudo, 'pseudo')}
            className="mt-1 font-display text-lg font-bold text-white transition hover:text-mc-emerald"
            title="Copier le pseudo"
          >
            {copied === 'pseudo' ? 'Pseudo copié !' : order.pseudo}
          </button>
          {order.discord && <span className="ml-2 text-xs text-ink-400">· {order.discord}</span>}
        </div>

        <div className="flex items-center gap-3">
          <span className="price-tag text-xl">{formatEUR(order.totalEUR)}</span>
          <select
            value={order.status}
            onChange={(e) => changeStatus(e.target.value as OrderStatus)}
            disabled={saving}
            className={`border-2 px-3 py-1.5 font-display text-xs font-semibold uppercase outline-none ${STATUS_STYLES[order.status]}`}
            aria-label="Statut de la commande"
          >
            {(Object.entries(STATUS_LABELS) as [OrderStatus, string][]).map(([value, label]) => (
              <option key={value} value={value} className="bg-night-700 text-ink-100">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="space-y-1 border-2 border-night-900 bg-night-900/60 p-3 text-sm text-ink-200">
        {order.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span className="min-w-0">{l.label}</span>
            <span className="shrink-0 font-semibold text-mc-gold">{formatEUR(l.totalEUR)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-pixel text-[12px] text-ink-400">
          {new Date(order.createdAt).toLocaleString('fr-FR')}
        </p>

        <div className="flex gap-2">
          <button type="button" onClick={() => copy(recap, 'recap')} className="btn-mc !px-3 !py-1.5 !text-[11px]">
            {copied === 'recap' ? 'Copié !' : 'Copier le récap'}
          </button>
          {confirmDelete ? (
            <>
              <button
                type="button"
                onClick={remove}
                disabled={saving}
                className="btn-mc !border-mc-redstone/60 !px-3 !py-1.5 !text-[11px] !text-mc-redstone"
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="btn-mc !px-3 !py-1.5 !text-[11px]"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="btn-mc !px-3 !py-1.5 !text-[11px] !text-ink-400"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
