import { isAdminAuthed } from '@/lib/adminAuth';
import { readOrders } from '@/lib/ordersStore';
import AdminLogin from '@/components/AdminLogin';
import AdminOrderRow from '@/components/AdminOrderRow';
import DonutLogo from '@/components/DonutLogo';
import { formatEUR } from '@/lib/pricing';

export const metadata = { title: 'Admin — Donut Shop' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!isAdminAuthed()) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <AdminLogin />
      </div>
    );
  }

  const orders = await readOrders();
  const pending = orders.filter((o) => o.status === 'nouvelle').length;
  const revenue = orders
    .filter((o) => o.status === 'payee' || o.status === 'livree')
    .reduce((sum, o) => sum + o.totalEUR, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <DonutLogo size={64} variant="choco" className="animate-float" />
          <div>
            <h1 className="font-display text-3xl font-bold">
              <span className="title-gradient">Commandes</span>
            </h1>
            <p className="text-sm text-donut-choco/70">
              {orders.length} au total · {pending} en attente · {formatEUR(revenue)} encaissés
            </p>
          </div>
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="btn-secondary text-sm">
            Déconnexion
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <DonutLogo size={96} className="mx-auto animate-float opacity-60" />
          <p className="mt-4 font-display text-xl">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="stagger space-y-4">
          {orders.map((order) => (
            <AdminOrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
