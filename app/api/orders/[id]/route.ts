import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthed } from '@/lib/adminAuth';
import { deleteOrder, updateOrderStatus } from '@/lib/ordersStore';
import type { OrderStatus } from '@/lib/types';

const VALID_STATUSES: OrderStatus[] = ['nouvelle', 'payee', 'livree', 'annulee'];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const status = (body as Record<string, unknown>)?.status;

  if (typeof status !== 'string' || !VALID_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }

  const updated = await updateOrderStatus(params.id, status as OrderStatus);
  if (!updated) {
    return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  const removed = await deleteOrder(params.id);
  if (!removed) {
    return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
