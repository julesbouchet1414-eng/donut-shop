import { promises as fs, constants as fsConstants } from 'fs';
import os from 'os';
import path from 'path';
import type { StoredOrder } from './types';

// process.cwd() n'est inscriptible qu'en local / auto-hébergement. Sur une
// plateforme serverless en lecture seule (Vercel, ...), seul os.tmpdir()
// l'est — mais son contenu n'est pas garanti durable entre deux invocations
// froides. Suffisant pour une démo ou un petit shop peu fréquenté ; pour un
// usage en production sur ce type de plateforme, remplace ce fichier par une
// vraie base de données (voir le README).
const PRIMARY_DIR = path.join(process.cwd(), 'var');
const FALLBACK_DIR = path.join(os.tmpdir(), 'donut-shop');

let resolvedDir: string | null = null;

async function resolveDataDir(): Promise<string> {
  if (resolvedDir) return resolvedDir;
  try {
    await fs.mkdir(PRIMARY_DIR, { recursive: true });
    await fs.access(PRIMARY_DIR, fsConstants.W_OK);
    resolvedDir = PRIMARY_DIR;
  } catch {
    await fs.mkdir(FALLBACK_DIR, { recursive: true });
    resolvedDir = FALLBACK_DIR;
  }
  return resolvedDir;
}

async function dataFile(): Promise<string> {
  return path.join(await resolveDataDir(), 'orders.json');
}

// Sérialise les lectures/écritures pour éviter une corruption du fichier
// en cas de deux commandes envoyées en même temps.
let writeChain: Promise<unknown> = Promise.resolve();

async function ensureFile(): Promise<string> {
  const file = await dataFile();
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, '[]', 'utf8');
  }
  return file;
}

export async function readOrders(): Promise<StoredOrder[]> {
  const file = await ensureFile();
  const raw = await fs.readFile(file, 'utf8');
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
    await fs.writeFile(await dataFile(), JSON.stringify(orders, null, 2), 'utf8');
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
      await fs.writeFile(await dataFile(), JSON.stringify(orders, null, 2), 'utf8');
    }
  });
  await writeChain;
  return updated;
}
