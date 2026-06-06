import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/**
 * Resolve an absolute site URL from environment variables.
 * Falls back through: PUBLIC_SITE_URL → localhost
 */
export function getURL(path: string = ''): string {
  const url =
    (import.meta.env.PUBLIC_SITE_URL?.trim() || '') ||
    'http://localhost:4321/';

  const base = url
    .replace(/\/+$/, '')
    .replace(/^http:\/\//, 'https://');

  const cleanPath = path.replace(/^\/+/, '');
  return cleanPath ? `${base}/${cleanPath}` : base;
}

/**
 * Detect placeholder-like values such as `[VK_GROUP]` or `[MAX_LINK]`.
 */
export function isPlaceholderValue(value?: string | null): boolean {
  if (!value) return true;
  return /^\[[A-Z0-9_]+\]$/i.test(value.trim());
}

/**
 * Keep only configured public contact values.
 */
export function getConfiguredValue(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return isPlaceholderValue(trimmed) ? undefined : trimmed;
}

/**
 * Typed POST wrapper for internal API calls.
 */
export async function postData<T = unknown>({
  url,
  data,
}: {
  url: string;
  data?: Record<string, unknown>;
}): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Date / time helpers
// ---------------------------------------------------------------------------

/** Convert Unix seconds to a Date object. */
export function toDateTime(secs: number): Date {
  const t = new Date(+0);
  t.setSeconds(secs);
  return t;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

/**
 * Format price for real estate display.
 * 5_300_000 → "5,3 млн ₽"
 * 850_000   → "850 000 ₽"
 */
export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    const formatted = millions % 1 === 0
      ? millions.toFixed(0)
      : millions.toFixed(1).replace('.', ',');
    return `${formatted} млн ₽`;
  }
  return price.toLocaleString('ru-RU').replace(/\s/g, '\u00A0') + '\u00A0₽';
}

/**
 * Format area with unit.
 */
export function formatArea(area: number): string {
  return `${area} м²`;
}

/**
 * Format price per square meter.
 */
export function formatPricePerMeter(price: number, area: number): string {
  if (area <= 0) return '';
  const perMeter = Math.round(price / area);
  return formatPrice(perMeter) + ' / м²';
}
