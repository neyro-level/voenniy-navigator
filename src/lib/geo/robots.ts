/**
 * Robots.txt Generator — создаёт robots.txt из единого GEO-конфига.
 * Централизованное управление: AI-боты, disallow paths, sitemap.
 */

import { GEO_AI_POLICY } from './config';

export function generateRobotsTxt(): string {
  const lines: string[] = [];

  // Yandex — всегда отдельная секция
  lines.push('User-agent: Yandex');
  lines.push('Allow: /');
  lines.push('');

  // AI-боты — явно разрешённые
  for (const bot of GEO_AI_POLICY.allowedBots) {
    lines.push(`User-agent: ${bot}`);
    lines.push('Allow: /');
    lines.push('');
  }

  // Googlebot — основной поисковый
  lines.push('User-agent: Googlebot');
  lines.push('Allow: /');
  lines.push('');

  // Все остальные — ограниченный доступ
  lines.push('User-agent: *');
  for (const path of GEO_AI_POLICY.disallowedPaths) {
    lines.push(`Disallow: ${path}`);
  }
  lines.push('');

  lines.push(`Sitemap: ${GEO_AI_POLICY.sitemap}`);
  lines.push('');

  return lines.join('\n');
}
