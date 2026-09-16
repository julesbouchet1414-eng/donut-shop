import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, adminToken } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = (body as Record<string, unknown>)?.password;

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD n'est pas configuré sur le serveur." },
      { status: 500 }
    );
  }
  if (typeof password !== 'string' || password !== expectedPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  }

  const token = adminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token as string, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
