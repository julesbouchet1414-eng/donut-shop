import { NextRequest, NextResponse } from 'next/server';
import { findItem } from '@/lib/catalog';
import { priceForM } from '@/lib/pricing';
import { addOrder } from '@/lib/ordersStore';
import { uid } from '@/lib/uid';
import type { ResolvedLine, StoredOrder } from '@/lib/types';

const PSEUDO_RE = /^[A-Za-z0-9_]{3,16}$/;
const MAX_QTY = 64;
const MAX_LINES = 100;
const MAX_MONEY_M = 100_000; // garde-fou : 100 000 M = 3000 €

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { pseudo, pseudoConfirm, discord, lines } = body as Record<string, unknown>;

  if (typeof pseudo !== 'string' || typeof pseudoConfirm !== 'string' || pseudo !== pseudoConfirm) {
    return NextResponse.json({ error: 'Les deux pseudos ne correspondent pas.' }, { status: 400 });
  }
  if (!PSEUDO_RE.test(pseudo)) {
    return NextResponse.json(
      { error: 'Pseudo Minecraft invalide (3 à 16 caractères : lettres, chiffres, underscore).' },
      { status: 400 }
    );
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: 'Le panier est vide.' }, { status: 400 });
  }
  if (lines.length > MAX_LINES) {
    return NextResponse.json({ error: 'Panier trop volumineux.' }, { status: 400 });
  }

  const resolved: ResolvedLine[] = [];
  let total = 0;

  for (const rawLine of lines) {
    if (!rawLine || typeof rawLine !== 'object') {
      return NextResponse.json({ error: 'Ligne de panier invalide.' }, { status: 400 });
    }
    const line = rawLine as Record<string, unknown>;

    if (line.kind === 'money') {
      const amountM = Number(line.amountM);
      const qty = Number(line.qty) || 1;
      if (!Number.isInteger(amountM) || amountM <= 0 || amountM > MAX_MONEY_M) {
        return NextResponse.json({ error: 'Montant invalide.' }, { status: 400 });
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        return NextResponse.json({ error: 'Quantité invalide.' }, { status: 400 });
      }
      const lineTotal = priceForM(amountM * qty);
      resolved.push({ kind: 'money', label: `${amountM.toLocaleString('fr-FR')} M ×${qty}`, totalEUR: lineTotal });
      total += lineTotal;
    } else if (line.kind === 'item') {
      const item = findItem(line.itemId);
      const qty = Number(line.qty) || 1;
      if (!item) {
        return NextResponse.json({ error: 'Item inconnu.' }, { status: 400 });
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > item.maxStack) {
        return NextResponse.json({ error: `Quantité invalide pour ${item.name}.` }, { status: 400 });
      }
      const lineTotal = priceForM(item.valueM * qty);
      resolved.push({ kind: 'item', label: `${item.icon} ${item.name} ×${qty}`, totalEUR: lineTotal });
      total += lineTotal;
    } else if (line.kind === 'shulker') {
      const slots = Array.isArray(line.slots) ? line.slots : [];
      const qty = Number(line.qty) || 1;
      if (slots.length === 0 || slots.length > 27) {
        return NextResponse.json({ error: 'Shulker invalide.' }, { status: 400 });
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        return NextResponse.json({ error: 'Quantité de shulker invalide.' }, { status: 400 });
      }
      let shulkerValueM = 0;
      const parts: string[] = [];
      for (const rawSlot of slots) {
        const slot = rawSlot as Record<string, unknown>;
        const item = findItem(slot?.itemId);
        const sqty = Number(slot?.qty) || 1;
        if (!item) {
          return NextResponse.json({ error: 'Item inconnu dans le shulker.' }, { status: 400 });
        }
        if (!Number.isInteger(sqty) || sqty < 1 || sqty > item.maxStack) {
          return NextResponse.json(
            { error: `Quantité invalide pour ${item.name} dans le shulker.` },
            { status: 400 }
          );
        }
        shulkerValueM += item.valueM * sqty;
        parts.push(`${item.icon}${item.name}×${sqty}`);
      }
      const lineTotal = priceForM(shulkerValueM * qty);
      resolved.push({ kind: 'shulker', label: `Shulker (${parts.join(', ')}) ×${qty}`, totalEUR: lineTotal });
      total += lineTotal;
    } else {
      return NextResponse.json({ error: 'Type de ligne inconnu.' }, { status: 400 });
    }
  }

  total = Math.round(total * 100) / 100;

  const order: StoredOrder = {
    id: uid(),
    createdAt: new Date().toISOString(),
    pseudo,
    discord: typeof discord === 'string' && discord.trim() ? discord.trim().slice(0, 60) : undefined,
    lines: resolved,
    totalEUR: total,
    status: 'nouvelle',
  };

  await addOrder(order);

  return NextResponse.json({ orderId: order.id, totalEUR: order.totalEUR, createdAt: order.createdAt });
}
