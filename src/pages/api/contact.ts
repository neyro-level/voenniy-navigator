import type { APIRoute } from 'astro';

const RATE_LIMIT = new Map<string, number[]>();
const MAX_REQUESTS = 3;
const WINDOW_MS = 10 * 60 * 1000; // 10 минут

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = RATE_LIMIT.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) return true;
  RATE_LIMIT.set(ip, [...recent, now]);
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('cf-connecting-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, contact, message, honeypot, timestamp } = body as {
    name?: string;
    contact?: string;
    message?: string;
    honeypot?: string;
    timestamp?: number;
  };

  // Honeypot — бот заполнил скрытое поле
  if (honeypot) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Timing check — слишком быстро (< 3 сек)
  if (timestamp && Date.now() - timestamp < 3000) {
    return new Response(JSON.stringify({ error: 'Too fast' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!name || !contact) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const botToken = import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const text = [
    '🏠 *Новая заявка — Военный навигатор*',
    '',
    `👤 *Имя:* ${name}`,
    `📞 *Контакт:* ${contact}`,
    message ? `💬 *Сообщение:* ${message}` : '',
    '',
    `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    if (!res.ok) {
      throw new Error(`Telegram API error: ${res.status}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Telegram send error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
