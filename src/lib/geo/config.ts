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
  vk: '[VK_GROUP]',        // TODO: уточнить у Михаила
  max: '[MAX_LINK]',       // TODO: уточнить у Михаила
  email: '[PRIMARY_EMAIL]', // TODO: уточнить у Михаила
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
      'Первый шаг сервиса: уточняем задачу, бюджет, ограничения и подсказываем следующий реалистичный маршрут покупки.',
  },
  {
    name: 'Подборка новостроек',
    description:
      'Персональный короткий список новостроек под цель покупки: для жизни, переезда позже, вложения или дистанционного сценария.',
  },
  {
    name: 'Маршрут покупки',
    description:
      'Пошаговое сопровождение: от понимания маршрута по военной ипотеке до сделки и регистрации права собственности.',
  },
  {
    name: 'Сопровождение сделки',
    description:
      'Проверка документов, координация шагов и помощь на всех этапах сделки.',
  },
  {
    name: 'Дистанционная покупка',
    description:
      'Сценарий покупки без постоянного личного присутствия в регионе сделки.',
  },
] as const;

export const GEO_PROCESS = [
  { step: 'Цель', description: 'Разбираем вашу ситуацию: бюджет, сроки, ограничения, цель покупки.' },
  { step: 'Объект', description: 'Подбираем 12 проверенных ЖК с видеоразбором под вашу задачу.' },
  { step: 'Маршрут', description: 'Составляем пошаговый план: военная ипотека, бронирование, сделка.' },
  { step: 'Сделка', description: 'Сопровождаем на всех этапах: документы, договор, регистрация.' },
  { step: 'Результат', description: 'Получение ключей и заселение.' },
] as const;

export const GEO_FAQ = [
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
    a: 'Да, работаем с объектами по всему Крыму — Ялта, Симферополь, Севастополь, побережье. Та же методология: сначала разбор цели покупки, потом отбор подходящих объектов. Всё дистанционно.',
  },
] as const;

export const GEO_LINKS = {
  home: '/',
  oServise: '/o-servise/',
  krasnodar: '/voennaya-ipoteka-krasnodar/',
  krym: '/voennaya-ipoteka-krym/',
  usloviya: '/usloviya-voennoy-ipoteki/',
  semeynaya: '/semeynaya-voennaya-ipoteka/',
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
