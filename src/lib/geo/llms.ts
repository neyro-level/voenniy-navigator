/**
 * LLMS Generator — создаёт содержимое /llms.txt из GEO-конфига и live-структуры журнала.
 * Формат: Markdown, UTF-8, plain text.
 */

import {
  COMMERCIAL_PAGES,
  JOURNAL_CATEGORIES,
  getJournalCategoryUrl,
  getJournalPostUrl,
  getJournalPosts,
  getPrimaryCommercialPageForPost,
} from '../journal';
import { getConfiguredValue } from '../utils';
import {
  GEO_AI_POLICY,
  GEO_CONTACTS,
  GEO_FAQ,
  GEO_LEGAL,
  GEO_LINKS,
  GEO_OFFICES,
  GEO_PROCESS,
  GEO_SERVICES,
  GEO_SITE,
} from './config';

function absoluteUrl(path: string) {
  return new URL(path, GEO_SITE.url).href;
}

export async function generateLlmsTxt(): Promise<string> {
  const lines: string[] = [];
  const posts = await getJournalPosts();
  const configuredEmail = getConfiguredValue(GEO_CONTACTS.email);

  lines.push(`# ${GEO_SITE.name}`);
  lines.push('');

  lines.push('## About');
  lines.push('');
  lines.push(
    `${GEO_SITE.tagline}. Это нишевой сервис про покупку квартир и новостроек по военной ипотеке, ` +
      `а не широкий портал про всю недвижимость. Основной сценарий сайта: сначала расчёт и ограничения, ` +
      `потом география выбора, объект и следующий шаг по сделке.`
  );
  lines.push('');

  lines.push('## Commercial Pages');
  lines.push('');
  for (const page of Object.values(COMMERCIAL_PAGES)) {
    lines.push(`- **${page.title}** — ${absoluteUrl(page.url)} — ${page.description}`);
  }
  lines.push(`- **Главная** — ${absoluteUrl(GEO_LINKS.home)} — главный сервисный вход и маршрутизация по сценариям.`);
  lines.push(`- **О Военном навигаторе** — ${absoluteUrl(GEO_LINKS.oServise)} — trust-страница про сервис и эксперта.`);
  lines.push(`- **Контакты** — ${absoluteUrl(GEO_LINKS.contacts)} — контакты, география работы и форма обращения.`);
  lines.push('');

  lines.push('## SEO Focus');
  lines.push('');
  lines.push('- Военная ипотека Краснодар');
  lines.push('- Военная ипотека в Крыму');
  lines.push('- Калькулятор военной ипотеки');
  lines.push('- Условия военной ипотеки');
  lines.push('- Семейная военная ипотека');
  lines.push('');
  lines.push(
    'Журнал работает как supporting SEO-cluster: он закрывает long-tail, process-intent, objections, risks и comparison-intent, ' +
      'но не должен дублировать exact-match commercial pages.'
  );
  lines.push('');

  lines.push('## Services');
  lines.push('');
  for (const service of GEO_SERVICES) {
    lines.push(`- **${service.name}** — ${service.description}`);
  }
  lines.push('');

  lines.push('## How It Works');
  lines.push('');
  for (let index = 0; index < GEO_PROCESS.length; index += 1) {
    const step = GEO_PROCESS[index];
    lines.push(`${index + 1}. **${step.step}** — ${step.description}`);
  }
  lines.push('');

  lines.push('## Journal Structure');
  lines.push('');
  lines.push(`- **Журнал Военный навигатор** — ${absoluteUrl(GEO_LINKS.journal)} — общий SEO-хаб журнала.`);
  for (const category of JOURNAL_CATEGORIES) {
    lines.push(
      `- **${category.label}** — ${absoluteUrl(getJournalCategoryUrl(category.slug))} — ${category.metaDescription}`
    );
  }
  lines.push('');

  lines.push('## Journal Articles');
  lines.push('');
  for (const post of posts) {
    const primaryRoute = getPrimaryCommercialPageForPost(post);
    const targetNote = primaryRoute ? ` — primary route: ${absoluteUrl(primaryRoute.url)}` : '';
    lines.push(`- **${post.data.title}** — ${absoluteUrl(getJournalPostUrl(post))}${targetNote}`);
  }
  lines.push('');

  lines.push('## FAQ');
  lines.push('');
  for (const { q, a } of GEO_FAQ) {
    lines.push(`Q: ${q}`);
    lines.push(`A: ${a}`);
    lines.push('');
  }

  lines.push('## Contact');
  lines.push('');
  lines.push(`- **Телефон**: ${GEO_CONTACTS.phone}`);
  if (configuredEmail) {
    lines.push(`- **Email**: ${configuredEmail}`);
  }
  lines.push(`- **Telegram**: ${GEO_CONTACTS.telegram}`);
  lines.push(`- **ВКонтакте**: ${GEO_CONTACTS.vk}`);
  for (const office of GEO_OFFICES) {
    lines.push(
      `- **Офис в ${office.city}**: ${office.address}${office.detail ? `, ${office.detail}` : ''} — ${office.note}`
    );
  }
  lines.push(`- **ИНН**: ${GEO_LEGAL.inn}`);
  lines.push(`- **ОГРН**: ${GEO_LEGAL.ogrn}`);
  lines.push('');

  lines.push('## Policies');
  lines.push('');
  lines.push(`- **Sitemap**: ${GEO_AI_POLICY.sitemap}`);
  lines.push(`- **llms.txt**: ${absoluteUrl('/llms.txt')}`);
  lines.push(`- **Политика конфиденциальности**: ${absoluteUrl(GEO_LINKS.privacy)}`);
  lines.push(`- **Согласие на обработку данных**: ${absoluteUrl(GEO_LINKS.agreement)}`);
  lines.push(`- **Cookies**: ${absoluteUrl(GEO_LINKS.cookies)}`);
  lines.push(
    `- **Allowed AI crawlers**: ${GEO_AI_POLICY.allowedBots.join(', ')}`
  );
  lines.push(
    `- **Restricted paths**: ${GEO_AI_POLICY.disallowedPaths.join(', ')}`
  );
  lines.push('');

  return lines.join('\n');
}
