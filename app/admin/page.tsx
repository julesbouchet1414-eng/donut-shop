import { isAdminAuthed } from '@/lib/adminAuth';
import { readOrders } from '@/lib/ordersStore';
import AdminLogin from '@/components/AdminLogin';
import AdminOrderRow from '@/components/AdminOrderRow';

export const metadata = { title: 'Admin — Donut Shop' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authed = isAdminAuthed();

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20">
        <h1 className="font-pixel text-base mb-6 text-center">Admin</h1>
        <AdminLogin />
      </div>
    );
  }

  const orders = await readOrders();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-pixel text-base sm:text-xl">Commandes ({orders.length})</h1>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="btn-secondary text-sm">
            Déconnexion
          </button>
        </form>
      </div>
      {orders.length === 0 && <p>Aucune commande pour le moment.</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <AdminOrderRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
