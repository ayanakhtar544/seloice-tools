import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/security/admin-auth';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 400 });
    }

    const ext = file.type.split('/')[1] || 'bin';
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
