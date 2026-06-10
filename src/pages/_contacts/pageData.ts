import { SITE, CONTACTS } from '../../lib/constants';
import { OG_IMAGES } from '../../lib/og';
import { breadcrumbSchema, organizationSchema } from '../../lib/seo';
import { getConfiguredValue } from '../../lib/utils';

export const pageMeta = {
  title: 'Контакты Военного навигатора — Краснодар и Крым',
  description:
    'Контакты Военного навигатора: офисы в Краснодаре и Бахчисарае, телефон, Telegram и запись на первичный разбор по военной ипотеке.',
  canonical: `${SITE.url}/contacts/`,
  ogImage: OG_IMAGES.contacts,
};
const sameAs = [CONTACTS.vk, CONTACTS.telegram]
  .map((value) => getConfiguredValue(value))
  .filter((value): value is string => Boolean(value));

export const schemas = [
  organizationSchema(),
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/contacts/#krasnodar`,
    name: SITE.name,
    description: 'Сервис выбора новостройки и маршрута покупки по военной ипотеке',
    url: `${SITE.url}/`,
    telephone: CONTACTS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Кубанская Набережная, 33, подъезд 3, этаж 2, офис 4',
      addressLocality: 'Краснодар',
      addressRegion: 'Краснодарский край',
      addressCountry: 'RU',
    },
    sameAs,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/contacts/#crimea`,
    name: `${SITE.name} (Крым)`,
    description: 'Сервисный маршрут покупки новостройки по военной ипотеке в Крыму',
    url: `${SITE.url}/`,
    telephone: CONTACTS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Комарова, 13',
      addressLocality: 'Бахчисарай',
      addressRegion: 'Республика Крым',
      addressCountry: 'RU',
    },
    areaServed: 'Крым',
    parentOrganization: {
      '@id': `${SITE.url}/contacts/#krasnodar`,
    },
  },
  breadcrumbSchema([
    { name: 'Главная', url: `${SITE.url}/` },
    { name: 'Контакты', url: `${SITE.url}/contacts/` },
  ]),
];
