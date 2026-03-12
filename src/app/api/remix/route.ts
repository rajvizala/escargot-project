import { NextRequest, NextResponse } from 'next/server';
import { remixCardImage } from '@/lib/vertexai';
import { getTursoClient } from '@/lib/turso';
import { checkRateLimit } from '@/lib/rateLimit';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded — try again in a minute' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } },
    );
  }

  // Validate request body
  let body: { cardId?: string; cardImageUrl?: string; prompt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { cardId, cardImageUrl, prompt } = body;

  if (!cardId || !cardImageUrl || !prompt) {
    return NextResponse.json(
      { error: 'Missing required fields: cardId, cardImageUrl, prompt' },
      { status: 400 },
    );
  }

  if (prompt.length > 500) {
    return NextResponse.json(
      { error: 'Prompt too long — max 500 characters' },
      { status: 400 },
    );
  }

  try {
    // Fetch the card image and convert to base64
    const imageResponse = await fetch(
      new URL(cardImageUrl, request.nextUrl.origin).toString(),
    );
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch card image' }, { status: 400 });
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const cardImageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Call Gemini via Vertex AI
    const result = await remixCardImage(cardImageBase64, prompt);

    // Persist to Turso
    try {
      const db = getTursoClient();
      await db.execute({
        sql: `INSERT INTO remix_history (id, card_id, prompt, result_b64, created_at) VALUES (?, ?, ?, ?, ?)`,
        args: [result.remixId, cardId, prompt, result.remixedImage, new Date().toISOString()],
      });
    } catch (e) {
      // DB write failure is non-critical — don't fail the remix
      console.error('Failed to persist remix to Turso', e);
    }

    return NextResponse.json(result, {
      headers: { 'X-RateLimit-Remaining': String(remaining) },
    });
  } catch (err) {
    console.error('Remix error:', err);
    return NextResponse.json(
      { error: 'Remix failed — try a different prompt' },
      { status: 500 },
    );
  }
}
