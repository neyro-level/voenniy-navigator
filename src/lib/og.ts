import { SITE } from './constants';

function absoluteOg(path: string) {
  return new URL(path, SITE.url).href;
}

export const OG_IMAGES = {
  default: absoluteOg('/images/mikhail-hero.png'),
  home: absoluteOg('/images/mikhail-hero.png'),
  oServise: absoluteOg('/images/mikhail-desk.png'),
  voennayaIpoteka: absoluteOg('/images/krasnodar-newbuild-hero.png'),
  usloviya: absoluteOg('/images/mikhail-desk.png'),
  semeynaya: absoluteOg('/images/mikhail-hero.png'),
  contacts: absoluteOg('/images/mikhail-desk.png'),
  thanks: absoluteOg('/images/mikhail-hero.png'),
  kalkulyator: absoluteOg('/images/mikhail-desk.png'),
  krym: absoluteOg('/images/mikhail-hero.png'),
} as const;
