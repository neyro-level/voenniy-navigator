import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const journalCollection = defineCollection({
  loader: glob({
    base: './src/content/journal',
    pattern: '**/*.md',
  }),
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
    coverPosition: z.string().optional(),
    featured: z.boolean().default(false),
    popular: z.boolean().default(false),
    priority: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  journal: journalCollection,
};
