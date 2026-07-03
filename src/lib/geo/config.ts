/**
 * GEO Config — единый источник правды для Generative Engine Optimization.
 * Используется для генерации llms.txt, Schema.org, robots policy.
 *
 * Правило: любое изменение GEO-данных делается ЗДЕСЬ.
 * Не дублировать в llms.txt.ts, seo.ts или robots.txt вручную.
 */

export const GEO_SITE = {
  name: 'Военный навигатор',
  tagline: 'Сервис выбора новостройки по военной ипотеке под задачу',
  url: 'https://voen-navigator.ru',
  locale: 'ru-RU',
  country: 'RU',
} as const;

export const GEO_CONTACTS = {
  phone: '+7 (938) 407 44 57',
  telegram: 'https://t.me/Mikhail_khryapin?text=Михаил%2C%20здравствуйте%2C%20я%20с%20вашего%20сайта.%20Нужно%20обсудить%20мою%20ситуацию',
  vk: 'https://vk.com/mikhail_khryapin',
  max: 'tel:+79384074457',
  email: '',
} as const;

export const GEO_OFFICES = [
  {
    city: 'Краснодар',
    address: 'ул. Кубанская Набережная, 33',
    detail: '3 подъезд, 2 этаж, офис 4',
    mapUrl: 'https://yandex.ru/map-widget/v1/?um=constructor%3A269f590d4b02b49eb7666fde1d0f90859fb09fd28d03c93cc6fd72ae30f4bb48&source=constructor',
    note: 'По предварительной записи',
    primary: true,
  },
  {
    city: 'Бахчисарай (Крым)',
    address: 'ул. Комарова, 13',
    detail: '',
    mapUrl: 'https://yandex.ru/map-widget/v1/?um=constructor%3Ac4045c942f0d5288e0d89be0d9997a6643816d5f052f4110e27f450ed3db5ff9&source=constructor',
    note: 'По предварительной записи',
    primary: false,
  },
] as const;

export const GEO_LEGAL = {
  name: 'ИП Мазур Алёна Викторовна',
  fullName: 'Индивидуальный предприниматель Мазур Алёна Викторовна',
  director: 'Мазур Алёна Викторовна',
  inn: '910406895307',
  ogrn: '322237500111941',
  year: new Date().getFullYear(),
} as const;

export const GEO_SERVICES = [
  {
    name: 'Разбор ситуации',
    description:
      'Первый шаг сервиса: разбираем цель покупки, ограничения по программе, бюджет и следующий реалистичный маршрут без случайного выбора объекта.',
  },
  {
    name: 'Подбор новостройки',
    description:
      'Подбираем новостройки и квартиры под цель покупки: для жизни, переезда позже, вложения или дистанционного сценария.',
  },
  {
    name: 'Маршрут покупки',
    description:
      'Помогаем понять порядок действий: банк, объект, документы, сроки и следующий шаг по сделке.',
  },
  {
    name: 'Условия и расчёт',
    description:
      'Объясняем условия военной ипотеки, лимиты, банки и расчётный ориентир до выбора объекта.',
  },
  {
    name: 'Дистанционная покупка',
    description:
      'Отдельно разбираем, что можно пройти удалённо, а где понадобится личное участие или доверенность.',
  },
] as const;

export const GEO_PROCESS = [
  { step: 'Разбор', description: 'Уточняем цель покупки, бюджет, ограничения программы, банк и формат сделки.' },
  { step: 'Отсев', description: 'Отбрасываем сценарии и объекты, которые не подходят под вашу ситуацию.' },
  { step: 'Подбор', description: 'Показываем квартиры и новостройки, которые реально стоит рассматривать в первую очередь.' },
  { step: 'Маршрут', description: 'Фиксируем следующий шаг: расчёт, подбор, документы, дистанционный формат или выход на сделку.' },
] as const;

export const GEO_FAQ = [
  {
    q: 'Что такое Военный навигатор?',
    a: 'Военный навигатор — это сервис, который помогает рассчитать варианты покупки по военной ипотеке, определить ограничения и только потом перейти к выбору квартиры или новостройки.',
  },
  {
    q: 'Что происходит на первом расчёте?',
    a: 'На первом расчёте уточняются цель покупки, бюджет, ограничения программы, банк, сроки и формат сделки. После этого становится понятнее, какие варианты и какой следующий шаг реально подходят.',
  },
  {
    q: 'С какими регионами работает сервис?',
    a: 'Базовые направления сервиса — Краснодар, Крым и дистанционный формат, когда часть маршрута можно пройти без постоянного личного присутствия в регионе сделки.',
  },
  {
    q: 'Можно ли пройти расчёт дистанционно?',
    a: 'Да, первый расчёт можно провести онлайн. Дальше отдельно определяется, какие этапы сделки проходят удалённо, а где понадобится личное участие или доверенность.',
  },
  {
    q: 'Что подготовить перед первым разговором?',
    a: 'Достаточно коротко описать цель покупки, желаемый регион, сроки и ограничения по бюджету или документам. Этого достаточно, чтобы разговор был предметным.',
  },
  {
    q: 'Сколько стоит первый шаг?',
    a: 'Первичный расчёт нужен, чтобы сначала понять задачу и ограничения, а не идти в подбор вслепую. Точные условия лучше уточнять на странице сервиса или при обращении, потому что формат следующего шага зависит от вашей ситуации.',
  },
] as const;

export const GEO_LINKS = {
  home: '/',
  oServise: '/o-servise/',
  krasnodar: '/voennaya-ipoteka-krasnodar/',
  krym: '/voennaya-ipoteka-krym/',
  kalkulyator: '/kalkulyator-voennoy-ipoteki/',
  usloviya: '/usloviya-voennoy-ipoteki/',
  semeynaya: '/semeynaya-voennaya-ipoteka/',
  journal: '/journal/',
  contacts: '/contacts/',
  privacy: '/politika/',
  agreement: '/soglasie/',
  cookies: '/cookies/',
} as const;

export const GEO_AI_POLICY = {
  /** Разрешённые AI-боты. Все остальные — по умолчанию Disallow (если указано). */
  allowedBots: [
    'OAI-SearchBot',   // OpenAI Search
    'ChatGPT-User',    // ChatGPT browsing
    'PerplexityBot',   // Perplexity
    'ClaudeBot',       // Anthropic
    'GPTBot',          // OpenAI crawler
    'Google-Extended', // Google AI
  ] as const,
  /** Ботов, которым явно запрещён доступ к чувствительным страницам */
  disallowedPaths: ['/thanks/', '/404/', '/podbor/', '/bonus/', '/prezentaciya/'],
  sitemap: `${GEO_SITE.url}/sitemap-index.xml`,
} as const;

export const GEO_PERSON = {
  name: 'Михаил Хряпин',
  jobTitle: 'Главный навигатор сервиса по военной ипотеке',
} as const;
