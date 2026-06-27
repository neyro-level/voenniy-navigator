import { getCollection, type CollectionEntry } from 'astro:content';

export const JOURNAL_BASE_PATH = '/journal/';
export const JOURNAL_POSTS_PER_PAGE = 6;
export const JOURNAL_TITLE =
  'Журнал Военный навигатор: военная ипотека и новостройки';
export const JOURNAL_H1 = 'Журнал Военный навигатор';
export const JOURNAL_DESCRIPTION =
  'Экспертные разборы о военной ипотеке, сумме, банках, калькуляторе, новостройках Краснодара и Крыма.';

export const JOURNAL_CATEGORIES = [
  {
    slug: 'voennaya-ipoteka',
    label: 'Военная ипотека',
    description:
      'Как устроен маршрут покупки по военной ипотеке: от первого расчёта до выбора объекта и следующего шага по сделке.',
    metaDescription:
      'Статьи о военной ипотеке: условия, маршрут покупки, ограничения, документы и первые шаги перед подбором квартиры.',
  },
  {
    slug: 'raschet-i-summa',
    label: 'Расчёт и сумма',
    description:
      'Как считать бюджет по военной ипотеке: накопления, ориентир по сумме, ежемесячный платёж и запас на сделку.',
    metaDescription:
      'Расчёт и сумма по военной ипотеке: как понять бюджет, пользоваться калькулятором и не выбирать квартиру вслепую.',
  },
  {
    slug: 'banki-i-usloviya',
    label: 'Банки и условия',
    description:
      'Что смотреть в банках и условиях программы: ставка, требования к объекту, документы, одобрение и ограничения.',
    metaDescription:
      'Банки и условия военной ипотеки: ставка, требования к объекту, документы, одобрение и важные ограничения перед сделкой.',
  },
  {
    slug: 'krasnodar',
    label: 'Краснодар',
    description:
      'Новостройки Краснодара под военную ипотеку: как отбирать районы, застройщиков, сроки сдачи и реальные сценарии покупки.',
    metaDescription:
      'Военная ипотека и новостройки Краснодара: как выбрать район, застройщика, срок сдачи и квартиру под задачу.',
  },
  {
    slug: 'krym',
    label: 'Крым',
    description:
      'Крым и военная ипотека: как сравнивать города, новостройки, дистанционный формат и ограничения сделки.',
    metaDescription:
      'Военная ипотека в Крыму: Севастополь, Симферополь, новостройки, дистанционная покупка и выбор города.',
  },
  {
    slug: 'semeynaya-ipoteka',
    label: 'Семейная ипотека',
    description:
      'Когда семейная и военная ипотека могут идти рядом: как сравнивать программы, бюджет семьи и сценарий покупки.',
    metaDescription:
      'Семейная и военная ипотека: как сравнить программы, бюджет, ограничения и выбрать рабочий сценарий покупки.',
  },
  {
    slug: 'sdelka-i-riski',
    label: 'Сделка и риски',
    description:
      'Риски сделки по военной ипотеке: документы, развод, продажа, дистанционный формат и вопросы, которые лучше задать заранее.',
    metaDescription:
      'Сделка и риски по военной ипотеке: документы, развод, продажа квартиры, дистанционный формат и ограничения.',
  },
] as const;

export type JournalCategorySlug = (typeof JOURNAL_CATEGORIES)[number]['slug'];
export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];
export type JournalPostEntry = CollectionEntry<'journal'>;

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
    const dateDiff = b.data.publishDate.getTime() - a.data.publishDate.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.data.priority - b.data.priority;
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
    .filter((post) => post.slug !== excludeSlug)
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
    .filter((post) => post.slug !== currentPost.slug)
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

export function getJournalPostUrl(post: JournalPostEntry): string {
  return `${JOURNAL_BASE_PATH}${post.slug}/`;
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
