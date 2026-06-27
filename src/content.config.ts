import { defineCollection, z } from 'astro:content';

const journalCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Военный навигатор'),
    category: z.string(),
    categorySlug: z.enum([
      'voennaya-ipoteka',
      'raschet-i-summa',
      'banki-i-usloviya',
      'krasnodar',
      'krym',
      'semeynaya-ipoteka',
      'sdelka-i-riski',
    ]),
    tags: z.array(z.string()).default([]),
    cover: z.string(),
    coverAlt: z.string(),
    featured: z.boolean().default(false),
    popular: z.boolean().default(false),
    priority: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  journal: journalCollection,
};
