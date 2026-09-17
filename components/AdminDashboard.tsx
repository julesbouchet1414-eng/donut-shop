'use client';

import { useMemo, useState } from 'react';
import type { OrderStatus, StoredOrder } from '@/lib/types';
import { formatEUR } from '@/lib/pricing';
import AdminOrderRow from './AdminOrderRow';
import PixelIcon from './PixelIcon';

const FILTERS: { id: OrderStatus | 'toutes'; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'nouvelle', label: 'Nouvelles' },
  { id: 'payee', label: 'Payées' },
  { id: 'livree', label: 'Livrées' },
  { id: 'annulee', label: 'Annulées' },
];

export default function AdminDashboard({ orders: initialOrders }: { orders: StoredOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | 'toutes'>('toutes');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'ancien' | 'montant'>('recent');

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'nouvelle').length;
    const paid = orders.filter((o) => o.status === 'payee' || o.status === 'livree');
    const revenue = paid.reduce((sum, o) => sum + o.totalEUR, 0);
    const toDeliver = orders.filter((o) => o.status === 'payee').length;
    const average = orders.length ? orders.reduce((s, o) => s + o.totalEUR, 0) / orders.length : 0;
    return { pending, revenue, toDeliver, average };
  }, [orders]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = orders.filter((o) => {
      if (filter !== 'toutes' && o.status !== filter) return false;
      if (!term) return true;
      return o.pseudo.toLowerCase().includes(term) || o.id.toLowerCase().includes(term);
    });
    return list.sort((a, b) => {
      if (sort === 'montant') return b.totalEUR - a.totalEUR;
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === 'recent' ? diff : -diff;
    });
  }, [orders, filter, search, sort]);

  function handleStatusChange(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function handleDelete(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard sprite="bookRed" label="À traiter" value={String(stats.pending)} accent="text-mc-pink" />
        <StatCard sprite="shulker" label="À livrer" value={String(stats.toDeliver)} accent="text-mc-diamond" />
        <StatCard sprite="donut" label="Encaissé" value={formatEUR(stats.revenue)} accent="text-mc-emerald" />
        <StatCard sprite="star" label="Panier moyen" value={formatEUR(stats.average)} accent="text-mc-gold" />
      </div>

      <div className="panel mb-6 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`border-2 px-3 py-1.5 font-display text-xs font-semibold uppercase transition ${
                filter === f.id
                  ? 'border-mc-purple bg-mc-purple/20 text-white'
                  : 'border-night-400 bg-night-700 text-ink-300 hover:border-night-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:justify-end">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pseudo ou n° de commande..."
            className="field sm:max-w-xs"
            aria-label="Rechercher une commande"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="field sm:w-44"
            aria-label="Trier les commandes"
          >
            <option value="recent">Plus récentes</option>
            <option value="ancien">Plus anciennes</option>
            <option value="montant">Montant décroissant</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="panel p-12 text-center">
          <PixelIcon name="shulker" size={64} className="mx-auto animate-bob opacity-50" />
          <p className="mt-4 font-pixel text-[15px] text-ink-400">
            {orders.length === 0 ? 'AUCUNE COMMANDE' : 'AUCUN RÉSULTAT'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((order) => (
            <AdminOrderRow
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  sprite,
  label,
  value,
  accent,
}: {
  sprite: string;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="panel flex items-center gap-3 p-4">
      <span className="slot !h-12 !w-12 !cursor-default shrink-0">
        <PixelIcon name={sprite} size={32} />
      </span>
      <div className="min-w-0">
        <p className="font-pixel text-[12px] uppercase text-ink-400">{label}</p>
        <p className={`mt-1 truncate font-display text-xl font-bold ${accent}`}>{value}</p>
      </div>
    </div>
  );
}
