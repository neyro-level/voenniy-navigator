export interface BonusMagnet {
  id: 'ipoteka' | 'novostroyki';
  title: string;
  subtitle: string;
  what_inside: string[];
  vk_embed_url: string;
  vk_title: string;
  duration: string;
  teaser_title: string;
  teaser_sub: string;
}

export const MAGNETS: Record<string, BonusMagnet> = {
  ipoteka: {
    id: 'ipoteka',
    title: 'Как правильно получить военную ипотеку',
    subtitle: 'С чего начать, если ещё не открывал. Кредитная история, документы, банк.',
    what_inside: [
      'С чего начинается военная ипотека — пошагово',
      'Кредитная история: как проверить и что делать',
      'Документы НИС: что, куда и в каком порядке',
      'Типичные ошибки при открытии — как их избежать',
      'Михаил помогает бесплатно — как это работает',
    ],
    vk_embed_url: '[VK_VIDEO_IPOTEKA_URL]',
    vk_title: '[VK_VIDEO_IPOTEKA_TITLE]',
    duration: '[VK_VIDEO_IPOTEKA_DURATION]',
    teaser_title: 'Когда с ипотекой разберётесь — вот следующий шаг',
    teaser_sub: 'Закрытый разбор новостроек Краснодара: какие ЖК смотреть, какие районы подходят под задачу.',
  },
  novostroyki: {
    id: 'novostroyki',
    title: 'Закрытый разбор новостроек Краснодара',
    subtitle: 'Реальный анализ рынка: какие ЖК стоит смотреть в 2026 году и почему.',
    what_inside: [
      'Какие ЖК в Краснодаре реально стоят внимания',
      'Районы: что выбрать под жизнь, сдачу, переезд позже',
      'Разбор реальных сделок из практики Михаила',
      'Что проверять до покупки — чек-лист',
      'Как не купить проблемный объект',
    ],
    vk_embed_url: '[VK_VIDEO_NOVOSTROYKI_URL]',
    vk_title: '[VK_VIDEO_NOVOSTROYKI_TITLE]',
    duration: '[VK_VIDEO_NOVOSTROYKI_DURATION]',
    teaser_title: 'Выбрали объект? Теперь разберитесь с ипотекой',
    teaser_sub: 'Как правильно открыть военную ипотеку: с чего начать, кредитная история, документы.',
  },
};
