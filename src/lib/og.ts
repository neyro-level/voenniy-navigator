import { SITE } from './constants';

function absoluteOg(path: string) {
  return new URL(path, SITE.url).href;
}

const sharedOgImage = absoluteOg('/images/og/voenniy-navigator-social-cover.png');

export const OG_IMAGES = {
  default: sharedOgImage,
  home: sharedOgImage,
  oServise: sharedOgImage,
  voennayaIpoteka: sharedOgImage,
  usloviya: sharedOgImage,
  semeynaya: sharedOgImage,
  contacts: sharedOgImage,
  thanks: sharedOgImage,
  kalkulyator: sharedOgImage,
  krym: sharedOgImage,
} as const;
