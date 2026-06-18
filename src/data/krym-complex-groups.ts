import { krymComplexes } from './krym-complexes';
import type { Complex } from './krasnodar-complexes';

export type DirectionKey = 'simferopol' | 'sevastopol' | 'coast';

export const krymComplexGroups: Record<DirectionKey, Complex[]> = {
  simferopol: krymComplexes.filter((complex) =>
    ['poema', 'respublika', 'listoriya', 'stolitsa', 'simfoniya', 'botanika-krym'].includes(complex.id),
  ),
  sevastopol: krymComplexes.filter((complex) =>
    ['dobrogorod', 'semischaste', 'park-pobedy-krym', 'korabelnyy-krym'].includes(complex.id),
  ),
  coast: krymComplexes.filter((complex) =>
    ['semeynyy', 'na-fontanke', 'pribrezhnyy-dom', 'yaltapark'].includes(complex.id),
  ),
};
