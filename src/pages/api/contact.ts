import type { APIRoute } from 'astro';

const RATE_LIMIT = new Map<string, number[]>();
const MAX_REQUESTS = 3;
const WINDOW_MS = 10 * 60 * 1000;

const METHOD_LABELS: Record<string, string> = {
  call: 'Звонок',
  telegram: 'Telegram',
  max: 'Max',
};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = RATE_LIMIT.get(ip) ?? [];
  const recent = timestamps.filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) return true;

  RATE_LIMIT.set(ip, [...recent, now]);
  return false;
}

function getString(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === 'string' ? value.trim() : '';
}

function getNumber(body: Record<string, unknown>, key: string): number | undefined {
  const value = body[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('cf-connecting-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'Слишком много заявок. Попробуйте чуть позже.' }, 429);
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Некорректный формат заявки.' }, 400);
  }

  const name = getString(body, 'name');
  const phone = getString(body, 'phone');
  const contact = getString(body, 'contact') || phone;
  const method = getString(body, 'method');
  const source = getString(body, 'source');
  const message = getString(body, 'message');
  const honeypot = getString(body, 'honeypot') || getString(body, 'honey');
  const timestamp = getNumber(body, 'timestamp') ?? getNumber(body, 'openedAt');
  const phoneDigits = contact.replace(/\D/g, '');

  if (honeypot) {
    return jsonResponse({ ok: true });
  }

  if (timestamp && Date.now() - timestamp < 3000) {
    return jsonResponse({ ok: true });
  }

  if (name.length < 2 || !contact) {
    return jsonResponse({ error: 'Заполните имя и телефон.' }, 400);
  }

  if (phoneDigits.length > 0 && phoneDigits.length !== 11) {
    return jsonResponse({ error: 'Введите телефон в формате +7 (999) 999-99-99.' }, 400);
  }

  const botToken = import.meta.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return jsonResponse({ error: 'Серверная отправка пока не настроена.' }, 500);
  }

  const text = [
    '<b>Новая заявка - Военный навигатор</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    method ? `<b>Способ связи:</b> ${escapeHtml(METHOD_LABELS[method] ?? method)}` : '',
    source ? `<b>Страница:</b> ${escapeHtml(source)}` : '',
    message ? `<b>Комментарий:</b> ${escapeHtml(message)}` : '',
    '',
    escapeHtml(new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })),
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error('Telegram send error:', error);
    return jsonResponse({ error: 'Не удалось отправить заявку. Попробуйте еще раз.' }, 500);
  }
};
