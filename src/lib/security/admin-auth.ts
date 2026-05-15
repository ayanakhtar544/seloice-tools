import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'admin_session';

export function isAdminRequest(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return cookieValue === hashToken(secret);
}

export function hashToken(secret: string): string {
  let h = 0;
  for (let i = 0; i < secret.length; i++) {
    h = (Math.imul(31, h) + secret.charCodeAt(i)) | 0;
  }
  return `adm_${Math.abs(h).toString(36)}_${secret.length}`;
}

export async function requireAdmin(): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return { ok: false, status: 503, message: 'Admin is not configured on this environment.' };
  }
  const jar = await cookies();
  const session = jar.get(ADMIN_COOKIE)?.value;
  if (!isAdminRequest(session)) {
    return { ok: false, status: 401, message: 'Unauthorized' };
  }
  return { ok: true };
}
