'use client';

import { useState } from 'react';
import type { OrderStatus, StoredOrder } from '@/lib/types';
import { formatEUR } from '@/lib/pricing';

const STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: '🆕 Nouvelle',
  payee: '💳 Payée',
  livree: '✅ Livrée',
  annulee: '❌ Annulée',
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  nouvelle: 'bg-donut-sky/25 text-sky-800',
  payee: 'bg-donut-gold/30 text-amber-800',
  livree: 'bg-donut-mint/30 text-emerald-800',
  annulee: 'bg-donut-coral/20 text-rose-800',
};

export default function AdminOrderRow({ order }: { order: StoredOrder }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    const previous = status;
    setStatus(newStatus);
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) setStatus(previous);
    } catch {
      setStatus(previous);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-donut-choco/50">{order.id}</p>
          <p className="font-display text-lg font-semibold">
            {order.pseudo}
            {order.discord && (
              <span className="ml-2 text-sm font-normal text-donut-choco/60">· {order.discord}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="price-tag text-lg">{formatEUR(order.totalEUR)}</span>
          <select
            value={status}
            onChange={(e) => handleChange(e.target.value as OrderStatus)}
            disabled={saving}
            className={`rounded-full border-0 px-3 py-1.5 text-sm font-semibold outline-none transition ${STATUS_STYLES[status]}`}
          >
            {(Object.entries(STATUS_LABELS) as [OrderStatus, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="space-y-1 rounded-2xl bg-white/50 p-3 text-sm text-donut-choco/80">
        {order.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span className="min-w-0">{l.label}</span>
            <span className="shrink-0 font-semibold">{formatEUR(l.totalEUR)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-xs text-donut-choco/50">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
    </div>
  );
}
