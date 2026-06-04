import { SITE } from './constants';

function absoluteOg(path: string) {
  return new URL(path, SITE.url).href;
}

export const OG_IMAGES = {
  default: absoluteOg('/og/home.jpg'),
  home: absoluteOg('/og/home.jpg'),
  voennayaIpoteka: absoluteOg('/og/voennaya-ipoteka-krasnodar.jpg'),
  distancionnaya: absoluteOg('/og/distancionnaya-pokupka.jpg'),
  etapy: absoluteOg('/og/etapy-pokupki.jpg'),
  contacts: absoluteOg('/og/contacts.jpg'),
  thanks: absoluteOg('/og/thanks.jpg'),
} as const;
