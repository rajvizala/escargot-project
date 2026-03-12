import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';

export async function POST(request: NextRequest) {
  let body: { cardId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { cardId } = body;
  if (!cardId) {
    return NextResponse.json({ error: 'Missing cardId' }, { status: 400 });
  }

  try {
    const db = getTursoClient();
    await db.execute({
      sql: `INSERT INTO card_views (card_id, viewed_at) VALUES (?, ?)`,
      args: [cardId, new Date().toISOString()],
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    // Analytics failure is non-critical
    console.error('Failed to write analytics', e);
    return NextResponse.json({ success: true });
  }
}
