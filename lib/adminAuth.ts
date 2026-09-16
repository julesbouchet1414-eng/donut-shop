import { cookies } from 'next/headers';
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'donut_admin';

export function adminToken(): string | null {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return null;
  return crypto.createHash('sha256').update(`${pwd}:donut-shop-admin`).digest('hex');
}

export function isAdminAuthed(): boolean {
  const expected = adminToken();
  if (!expected) return false;
  const value = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
