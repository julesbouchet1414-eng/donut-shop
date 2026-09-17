import { isAdminAuthed } from '@/lib/adminAuth';
import { readOrders } from '@/lib/ordersStore';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import PixelIcon from '@/components/PixelIcon';

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="panel panel-raised flex h-16 w-16 items-center justify-center">
            <PixelIcon name="netheriteBlock" size={40} />
          </span>
          <div>
            <h1 className="mc-title-purple text-3xl sm:text-4xl">PANEL ADMIN</h1>
            <p className="mt-2 text-sm text-ink-400">{orders.length} commande(s) enregistrée(s)</p>
          </div>
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="btn-mc !text-xs">
            Déconnexion
          </button>
        </form>
      </div>

      <AdminDashboard orders={orders} />
    </div>
  );
}
