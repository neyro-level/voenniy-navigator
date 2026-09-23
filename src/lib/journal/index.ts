import { getCollection, type CollectionEntry } from 'astro:content';

export const JOURNAL_BASE_PATH = '/journal/';
export const JOURNAL_POSTS_PER_PAGE = 6;
export const JOURNAL_TITLE =
  'Журнал Военный навигатор: военная ипотека, новостройки, расчёт';
export const JOURNAL_H1 = 'Военная ипотека: от условий до квартиры';
export const JOURNAL_DESCRIPTION =
  'Экспертные разборы о военной ипотеке: условия, сумма, банки, калькулятор, выбор квартиры в Краснодаре и Крыму.';

export const JOURNAL_CATEGORIES = [
  {
    slug: 'voennaya-ipoteka',
    label: 'Военная ипотека',
    description:
      'Как устроена военная ипотека: условия программы, порядок покупки, ограничения и первые шаги до выбора квартиры.',
    metaDescription:
      'Статьи о военной ипотеке: условия, порядок покупки, ограничения, документы и первые шаги перед подбором квартиры.',
  },
  {
    slug: 'raschet-i-summa',
    label: 'Расчёт и сумма',
    description:
      'Как считать бюджет по военной ипотеке: ориентир по сумме, накопления, ежемесячный платёж и запас на сделку.',
    metaDescription:
      'Расчёт и сумма по военной ипотеке: как понять бюджет, пользоваться калькулятором и не выбирать квартиру вслепую.',
  },
  {
    slug: 'banki-i-usloviya',
    label: 'Банки и условия',
    description:
      'Как выбирать банк и условия военной ипотеки: ставка, требования к объекту, документы, одобрение и ограничения.',
    metaDescription:
      'Банки и условия военной ипотеки: ставка, требования к объекту, документы, одобрение и важные ограничения перед сделкой.',
  },
  {
    slug: 'krasnodar',
    label: 'Краснодар',
    description:
      'Как купить квартиру в Краснодаре по военной ипотеке: районы, новостройки, застройщики, сроки сдачи и варианты покупки.',
    metaDescription:
      'Военная ипотека и новостройки Краснодара: как выбрать район, застройщика, срок сдачи и квартиру под задачу.',
  },
  {
    slug: 'krym',
    label: 'Крым',
    description:
      'Военная ипотека в Крыму: как сравнивать города, выбирать новостройку, вести дистанционную сделку и не ошибиться с объектом.',
    metaDescription:
      'Военная ипотека в Крыму: Севастополь, Симферополь, новостройки, дистанционная покупка и выбор города.',
  },
  {
    slug: 'semeynaya-ipoteka',
    label: 'Семейная ипотека',
    description:
      'Когда сравнивать и совмещать семейную и военную ипотеку: программы, бюджет семьи, объект и вариант покупки.',
    metaDescription:
      'Семейная и военная ипотека: как сравнить программы, бюджет, ограничения и выбрать рабочий вариант покупки.',
  },
  {
    slug: 'sdelka-i-riski',
    label: 'Сделка и риски',
    description:
      'Риски сделки по военной ипотеке: документы, развод, продажа квартиры, дистанционный формат и вопросы, которые лучше задать заранее.',
    metaDescription:
      'Сделка и риски по военной ипотеке: документы, развод, продажа квартиры, дистанционный формат и ограничения.',
  },
] as const;

export type JournalCategorySlug = (typeof JOURNAL_CATEGORIES)[number]['slug'];
export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];
export type JournalPostEntry = CollectionEntry<'journal'>;

export const COMMERCIAL_PAGES = {
  krasnodar: {
    key: 'krasnodar',
    url: '/voennaya-ipoteka-krasnodar/',
    label: 'Военная ипотека Краснодар',
    title: 'Военная ипотека Краснодар',
    description:
      'Подбор квартир и новостроек по военной ипотеке в Краснодаре: районы, бюджет, каталог и вариант покупки.',
    ctaLabel: 'Перейти к странице Краснодара',
  },
  krym: {
    key: 'krym',
    url: '/voennaya-ipoteka-krym/',
    label: 'Военная ипотека Крым',
    title: 'Военная ипотека в Крыму',
    description:
      'Порядок покупки по военной ипотеке в Крыму: города, новостройки, дистанционный формат и следующий шаг.',
    ctaLabel: 'Перейти к странице Крыма',
  },
  calculator: {
    key: 'calculator',
    url: '/kalkulyator-voennoy-ipoteki/',
    label: 'Калькулятор военной ипотеки',
    title: 'Калькулятор военной ипотеки',
    description:
      'Расчёт бюджета, накоплений НИС и рабочего лимита по военной ипотеке до выбора объекта.',
    ctaLabel: 'Открыть калькулятор',
  },
  conditions: {
    key: 'conditions',
    url: '/usloviya-voennoy-ipoteki/',
    label: 'Условия военной ипотеки',
    title: 'Условия военной ипотеки',
    description:
      'Условия, банки, сумма, документы и ограничения по военной ипотеке одним порядком действий.',
    ctaLabel: 'Перейти к условиям',
  },
  family: {
    key: 'family',
    url: '/semeynaya-voennaya-ipoteka/',
    label: 'Семейная военная ипотека',
    title: 'Семейная военная ипотека',
    description:
      'Как совместить семейную и военную ипотеку, увеличить бюджет и выбрать рабочий вариант.',
    ctaLabel: 'Перейти к семейному варианту',
  },
} as const;

export type CommercialPageKey = keyof typeof COMMERCIAL_PAGES;
export type CommercialPageDescriptor = (typeof COMMERCIAL_PAGES)[CommercialPageKey];

const PRIORITY_COMMERCIAL_PAGE_KEYS: readonly CommercialPageKey[] = [
  'krasnodar',
  'krym',
  'calculator',
  'conditions',
  'family',
];

const PRIMARY_COMMERCIAL_PAGE_BY_POST_SLUG: Partial<Record<string, CommercialPageKey>> = {
  'kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare': 'krasnodar',
  'novostroyki-krasnodara-po-voennoy-ipoteke': 'krasnodar',
  'summa-voennoy-ipoteki-i-raschet': 'calculator',
  'banki-po-voennoy-ipoteke': 'conditions',
  'usloviya-voennoy-ipoteki-2026': 'conditions',
  'kalkulyator-voennoy-ipoteki-chto-schitat': 'calculator',
  'voennaya-ipoteka-v-krymu': 'krym',
  'sevastopol-ili-simferopol-po-voennoy-ipoteke': 'krym',
  'semeynaya-i-voennaya-ipoteka': 'family',
  'kvartira-po-voennoy-ipoteke-pri-razvode': 'conditions',
  'dokumenty-dlya-voennoy-ipoteki': 'conditions',
  'prodat-kvartiru-po-voennoy-ipoteke': 'conditions',
  'vtorichka-po-voennoy-ipoteke': 'conditions',
  'pervonachalnyy-vznos-po-voennoy-ipoteke': 'conditions',
  'distantsionnaya-pokupka-po-voennoy-ipoteke': 'conditions',
  'skolko-stoit-sdelka-po-voennoy-ipoteke': 'calculator',
  'proverka-obekta-po-voennoy-ipoteke': 'conditions',
  'voennaya-ipoteka-v-sochi-i-novorossiyske': 'krasnodar',
};

const SECONDARY_COMMERCIAL_PAGE_BY_POST_SLUG: Partial<Record<string, CommercialPageKey>> = {
  'summa-voennoy-ipoteki-i-raschet': 'conditions',
  'banki-po-voennoy-ipoteke': 'calculator',
  'kalkulyator-voennoy-ipoteki-chto-schitat': 'conditions',
  'voennaya-ipoteka-v-krymu': 'calculator',
  'sevastopol-ili-simferopol-po-voennoy-ipoteke': 'conditions',
  'semeynaya-i-voennaya-ipoteka': 'calculator',
  'pervonachalnyy-vznos-po-voennoy-ipoteke': 'calculator',
  'distantsionnaya-pokupka-po-voennoy-ipoteke': 'krasnodar',
  'skolko-stoit-sdelka-po-voennoy-ipoteke': 'conditions',
  'voennaya-ipoteka-v-sochi-i-novorossiyske': 'krym',
};

const PRIMARY_COMMERCIAL_PAGE_BY_CATEGORY: Record<JournalCategorySlug, CommercialPageKey> = {
  'voennaya-ipoteka': 'conditions',
  'raschet-i-summa': 'calculator',
  'banki-i-usloviya': 'conditions',
  krasnodar: 'krasnodar',
  krym: 'krym',
  'semeynaya-ipoteka': 'family',
  'sdelka-i-riski': 'conditions',
};

const SUPPORTING_POST_SLUGS_BY_COMMERCIAL_PAGE: Record<CommercialPageKey, readonly string[]> = {
  krasnodar: [
    'kak-kupit-kvartiru-po-voennoy-ipoteke-v-krasnodare',
    'novostroyki-krasnodara-po-voennoy-ipoteke',
    'summa-voennoy-ipoteki-i-raschet',
    'banki-po-voennoy-ipoteke',
    'voennaya-ipoteka-v-sochi-i-novorossiyske',
  ],
  krym: [
    'voennaya-ipoteka-v-krymu',
    'sevastopol-ili-simferopol-po-voennoy-ipoteke',
    'summa-voennoy-ipoteki-i-raschet',
    'usloviya-voennoy-ipoteki-2026',
  ],
  calculator: [
    'kalkulyator-voennoy-ipoteki-chto-schitat',
    'summa-voennoy-ipoteki-i-raschet',
    'skolko-stoit-sdelka-po-voennoy-ipoteke',
    'pervonachalnyy-vznos-po-voennoy-ipoteke',
    'usloviya-voennoy-ipoteki-2026',
    'semeynaya-i-voennaya-ipoteka',
  ],
  conditions: [
    'usloviya-voennoy-ipoteki-2026',
    'banki-po-voennoy-ipoteke',
    'dokumenty-dlya-voennoy-ipoteki',
    'summa-voennoy-ipoteki-i-raschet',
    'pervonachalnyy-vznos-po-voennoy-ipoteke',
    'distantsionnaya-pokupka-po-voennoy-ipoteke',
    'vtorichka-po-voennoy-ipoteke',
    'proverka-obekta-po-voennoy-ipoteke',
    'prodat-kvartiru-po-voennoy-ipoteke',
    'kvartira-po-voennoy-ipoteke-pri-razvode',
  ],
  family: [
    'semeynaya-i-voennaya-ipoteka',
    'kalkulyator-voennoy-ipoteki-chto-schitat',
    'usloviya-voennoy-ipoteki-2026',
  ],
};

const RELATED_COMMERCIAL_PAGE_KEYS: Record<CommercialPageKey, readonly CommercialPageKey[]> = {
  krasnodar: ['calculator', 'conditions'],
  krym: ['conditions', 'calculator'],
  calculator: ['conditions', 'family'],
  conditions: ['calculator', 'krasnodar'],
  family: ['calculator', 'conditions'],
};

export function getJournalCategory(slug: string): JournalCategory {
  const category = JOURNAL_CATEGORIES.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Unknown journal category: ${slug}`);
  }

  return category;
}

export async function getJournalPosts(): Promise<JournalPostEntry[]> {
  const posts = await getCollection('journal', ({ data }) => !data.draft);

  return posts.sort((a, b) => {
    if (a.data.priority !== b.data.priority) return a.data.priority - b.data.priority;
    return b.data.publishDate.getTime() - a.data.publishDate.getTime();
  });
}

export function getFeaturedJournalPosts(posts: JournalPostEntry[], limit = 3): JournalPostEntry[] {
  return [...posts]
    .sort((a, b) => {
      if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
      if (a.data.priority !== b.data.priority) return a.data.priority - b.data.priority;
      return b.data.publishDate.getTime() - a.data.publishDate.getTime();
    })
    .slice(0, limit);
}

export function getPopularJournalPosts(
  posts: JournalPostEntry[],
  limit = 4,
  excludeSlug?: string,
): JournalPostEntry[] {
  return posts
    .filter((post) => post.id !== excludeSlug)
    .sort((a, b) => {
      if (a.data.popular !== b.data.popular) return a.data.popular ? -1 : 1;
      if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
      if (a.data.priority !== b.data.priority) return a.data.priority - b.data.priority;
      return b.data.publishDate.getTime() - a.data.publishDate.getTime();
    })
    .slice(0, limit);
}

export function getRelatedJournalPosts(
  currentPost: JournalPostEntry,
  posts: JournalPostEntry[],
  limit = 3,
): JournalPostEntry[] {
  return posts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      const sameCategory = post.data.categorySlug === currentPost.data.categorySlug ? 6 : 0;
      const sharedTags = post.data.tags.filter((tag) => currentPost.data.tags.includes(tag)).length;
      const freshness = post.data.publishDate.getTime() / 10000000000000;
      return { post, score: sameCategory + sharedTags * 2 + freshness };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post)
    .slice(0, limit);
}

export function getJournalPostsByCategory(posts: JournalPostEntry[], categorySlug: string): JournalPostEntry[] {
  return posts.filter((post) => post.data.categorySlug === categorySlug);
}

export function getCommercialPage(key: CommercialPageKey): CommercialPageDescriptor {
  return COMMERCIAL_PAGES[key];
}

export function getPriorityCommercialPages(): CommercialPageDescriptor[] {
  return PRIORITY_COMMERCIAL_PAGE_KEYS.map((key) => getCommercialPage(key));
}

export function getPrimaryCommercialPageForPost(
  postOrSlug: JournalPostEntry | string,
): CommercialPageDescriptor | undefined {
  const slug = typeof postOrSlug === 'string' ? postOrSlug : postOrSlug.id;
  const key = PRIMARY_COMMERCIAL_PAGE_BY_POST_SLUG[slug];
  return key ? getCommercialPage(key) : undefined;
}

export function getSecondaryCommercialPageForPost(
  postOrSlug: JournalPostEntry | string,
): CommercialPageDescriptor | undefined {
  const slug = typeof postOrSlug === 'string' ? postOrSlug : postOrSlug.id;
  const key = SECONDARY_COMMERCIAL_PAGE_BY_POST_SLUG[slug];
  return key ? getCommercialPage(key) : undefined;
}

export function getPrimaryCommercialPageForCategory(
  categorySlug: JournalCategorySlug,
): CommercialPageDescriptor {
  return getCommercialPage(PRIMARY_COMMERCIAL_PAGE_BY_CATEGORY[categorySlug]);
}

export function getSupportingPostsForCommercialPage(
  pageKey: CommercialPageKey,
  posts: JournalPostEntry[],
  limit?: number,
): JournalPostEntry[] {
  const postsBySlug = new Map(posts.map((post) => [post.id, post]));
  const orderedPosts = SUPPORTING_POST_SLUGS_BY_COMMERCIAL_PAGE[pageKey]
    .map((slug) => postsBySlug.get(slug))
    .filter((post): post is JournalPostEntry => Boolean(post));

  return typeof limit === 'number' ? orderedPosts.slice(0, limit) : orderedPosts;
}

export function getRelatedCommercialPages(pageKey: CommercialPageKey): CommercialPageDescriptor[] {
  return RELATED_COMMERCIAL_PAGE_KEYS[pageKey].map((key) => getCommercialPage(key));
}

export function getJournalPostUrl(post: JournalPostEntry): string {
  return `${JOURNAL_BASE_PATH}${post.id}/`;
}

export function getJournalIndexUrl(page = 1): string {
  return page <= 1 ? JOURNAL_BASE_PATH : `${JOURNAL_BASE_PATH}${page}/`;
}

export function getJournalCategoryUrl(categorySlug: string, page = 1): string {
  const base = `${JOURNAL_BASE_PATH}category/${categorySlug}/`;
  return page <= 1 ? base : `${base}${page}/`;
}

export function chunkItems<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function getReadingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} мин`;
}

export function formatJournalDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function toAbsoluteUrl(path: string, origin: string): string {
  return new URL(path, origin).href;
}
