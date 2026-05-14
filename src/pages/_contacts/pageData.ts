import { SITE, CONTACTS } from '../../lib/constants';
import { breadcrumbSchema, faqSchema, organizationSchema } from '../../lib/seo';

export const pageMeta = {
  title: 'Контакты Михаила Хряпина — Краснодар и Бахчисарай (Крым)',
  description:
    'Контакты Михаила Хряпина: офисы в Краснодаре и Бахчисарае (Крым), телефон, Telegram, запись на разбор покупки новостройки по военной ипотеке.',
  canonical: `${SITE.url}/contacts/`,
  ogImage: `${SITE.url}/og/contacts.jpg`,
};

export const faqItems = [
  {
    q: 'Можно ли приехать в офис без записи?',
    a: 'Лучше заранее согласовать встречу. Михаил может быть на объекте, показе или встрече с другим клиентом. Предварительная запись помогает не терять время и подготовиться к вашей ситуации.',
  },
  {
    q: 'В какой офис лучше приехать?',
    a: 'Если вопрос связан с новостройками Краснодара — основная точка офис на Кубанской Набережной, 33 (3 подъезд, 2 этаж, офис 4). Встречи по предварительной договорённости.',
  },
  {
    q: 'Можно ли провести разбор дистанционно?',
    a: 'Да. Первый разбор чаще всего проходит онлайн — через Яндекс Телемост, 30 минут. Это удобно особенно для тех, кто служит в другом регионе или не может приехать в Краснодар.',
  },
  {
    q: 'Можно ли написать в мессенджер вместо звонка?',
    a: 'Да. Для первого обращения удобнее написать в Telegram: коротко описать ситуацию, цель покупки и вопрос. Так проще согласовать время разговора.',
  },
  {
    q: 'Что подготовить перед разбором?',
    a: 'Достаточно кратко описать задачу: покупаете для жизни, переезда позже, сдачи или дистанционно. Если есть ограничения по срокам, бюджету, документам — лучше указать заранее.',
  },
  {
    q: 'Можно ли купить новостройку в Крыму по военной ипотеке?',
    a: 'Да, работаем с объектами по всему Крыму — Ялта, Симферополь, Севастополь, побережье. Та же методология: сначала разбор цели покупки, потом отбор подходящих объектов. Всё дистанционно. Отдельная страница по Крыму появится в ближайшее время.',
  },
];

export const schemas = [
  organizationSchema,
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/contacts/#krasnodar`,
    name: SITE.name,
    description: 'Навигатор по новостройкам Краснодара для военнослужащих',
    url: `${SITE.url}/`,
    telephone: CONTACTS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Кубанская Набережная, 33, подъезд 3, этаж 2, офис 4',
      addressLocality: 'Краснодар',
      addressRegion: 'Краснодарский край',
      addressCountry: 'RU',
    },
    sameAs: [CONTACTS.vk, CONTACTS.telegram],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/contacts/#crimea`,
    name: `${SITE.name} (Крым)`,
    description: 'Работаем с объектами по всему Крыму по военной ипотеке',
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
  faqSchema(faqItems),
  breadcrumbSchema([
    { name: 'Главная', url: `${SITE.url}/` },
    { name: 'Контакты', url: `${SITE.url}/contacts/` },
  ]),
];
