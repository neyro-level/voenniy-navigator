/**
 * LLMS Generator — создаёт содержимое /llms.txt из единого GEO-конфига.
 * Формат: Markdown, UTF-8, plain text.
 */

import {
  GEO_SITE,
  GEO_CONTACTS,
  GEO_OFFICES,
  GEO_LEGAL,
  GEO_SERVICES,
  GEO_PROCESS,
  GEO_FAQ,
  GEO_LINKS,
} from './config';

export function generateLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${GEO_SITE.name}`);
  lines.push('');

  // About
  lines.push('## About');
  lines.push('');
  lines.push(
    `${GEO_SITE.tagline}. Помогаю военнослужащим и их семьям выбрать новостройку в Краснодаре и Крыму, ` +
      `получить подборку проверенных ЖК и пройти весь маршрут покупки по военной ипотеке — ` +
      `от первого разговора до получения ключей.`
  );
  lines.push('');

  // Services
  lines.push('## Services');
  lines.push('');
  for (const svc of GEO_SERVICES) {
    lines.push(`- **${svc.name}** — ${svc.description}`);
  }
  lines.push('');

  // How It Works
  lines.push('## How It Works');
  lines.push('');
  for (let i = 0; i < GEO_PROCESS.length; i++) {
    const p = GEO_PROCESS[i];
    lines.push(`${i + 1}. **${p.step}** — ${p.description}`);
  }
  lines.push('');

  // FAQ
  lines.push('## FAQ');
  lines.push('');
  for (const { q, a } of GEO_FAQ) {
    lines.push(`Q: ${q}`);
    lines.push(`A: ${a}`);
    lines.push('');
  }

  // Contact
  lines.push('## Contact');
  lines.push('');
  lines.push(`- **Телефон**: ${GEO_CONTACTS.phone}`);
  lines.push(`- **Telegram**: ${GEO_CONTACTS.telegram}`);

  const primaryOffice = GEO_OFFICES.find((o) => o.primary) ?? GEO_OFFICES[0];
  if (primaryOffice) {
    lines.push(
      `- **Офис в ${primaryOffice.city}**: ${primaryOffice.address}${primaryOffice.detail ? ', ' + primaryOffice.detail : ''} — ${primaryOffice.note}`
    );
  }
  const secondaryOffice = GEO_OFFICES.find((o) => !o.primary);
  if (secondaryOffice) {
    lines.push(
      `- **Офис в ${secondaryOffice.city}**: ${secondaryOffice.address}${secondaryOffice.detail ? ', ' + secondaryOffice.detail : ''} — ${secondaryOffice.note}`
    );
  }
  lines.push(`- **ИНН**: ${GEO_LEGAL.inn}`);
  lines.push(`- **ОГРН**: ${GEO_LEGAL.ogrn}`);
  lines.push('');

  // Links
  lines.push('## Links');
  lines.push('');
  lines.push(`- Главная: ${GEO_SITE.url}${GEO_LINKS.home}`);
  lines.push(`- Военная ипотека в Краснодаре: ${GEO_SITE.url}${GEO_LINKS.krasnodar}`);
  lines.push(`- Военная ипотека в Крыму: ${GEO_SITE.url}${GEO_LINKS.krym}`);
  lines.push(`- Условия военной ипотеки: ${GEO_SITE.url}${GEO_LINKS.usloviya}`);
  lines.push(`- Семейная военная ипотека: ${GEO_SITE.url}${GEO_LINKS.semeynaya}`);
  lines.push(`- Контакты: ${GEO_SITE.url}${GEO_LINKS.contacts}`);
  lines.push(`- Политика конфиденциальности: ${GEO_SITE.url}${GEO_LINKS.privacy}`);
  lines.push(`- Согласие на обработку данных: ${GEO_SITE.url}${GEO_LINKS.agreement}`);
  lines.push('');

  return lines.join('\n');
}
