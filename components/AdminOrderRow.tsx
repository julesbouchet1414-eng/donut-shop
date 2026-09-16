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
    <div className="bg-white/70 rounded-xl p-4 border border-black/5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div>
          <p className="font-mono text-xs text-donut-chocoDark/60">{order.id}</p>
          <p className="font-semibold">
            {order.pseudo}
            {order.discord && (
              <span className="text-sm font-normal text-donut-chocoDark/60"> · {order.discord}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">{formatEUR(order.totalEUR)}</span>
          <select
            value={status}
            onChange={(e) => handleChange(e.target.value as OrderStatus)}
            disabled={saving}
            className="px-2 py-1 rounded-lg border border-black/10 text-sm"
          >
            {(Object.entries(STATUS_LABELS) as [OrderStatus, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ul className="text-sm text-donut-chocoDark/80 list-disc list-inside">
        {order.lines.map((l, i) => (
          <li key={i}>
            {l.label} — {formatEUR(l.totalEUR)}
          </li>
        ))}
      </ul>
      <p className="text-xs text-donut-chocoDark/50 mt-2">
        {new Date(order.createdAt).toLocaleString('fr-FR')}
      </p>
    </div>
  );
}
