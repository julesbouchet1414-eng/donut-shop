import { promises as fs } from 'fs';
import path from 'path';
import type { StoredOrder } from './types';

const DATA_DIR = path.join(process.cwd(), 'var');
const DATA_FILE = path.join(DATA_DIR, 'orders.json');

// Sérialise les lectures/écritures pour éviter une corruption du fichier
// en cas de deux commandes envoyées en même temps.
let writeChain: Promise<unknown> = Promise.resolve();

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

export async function readOrders(): Promise<StoredOrder[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addOrder(order: StoredOrder): Promise<void> {
  writeChain = writeChain.then(async () => {
    const orders = await readOrders();
    orders.unshift(order);
    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8');
  });
  await writeChain;
}

export async function updateOrderStatus(
  id: string,
  status: StoredOrder['status']
): Promise<StoredOrder | null> {
  let updated: StoredOrder | null = null;
  writeChain = writeChain.then(async () => {
    const orders = await readOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], status };
      updated = orders[idx];
      await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8');
    }
  });
  await writeChain;
  return updated;
}
