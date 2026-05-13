import { SITE, CONTACTS } from './constants';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: `${SITE.url}/`,
  telephone: CONTACTS.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Краснодар',
    addressCountry: 'RU',
  },
  sameAs: [CONTACTS.vk, CONTACTS.telegram],
};

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Михаил Хряпин',
  jobTitle: 'Навигатор по новостройкам Краснодара для военнослужащих',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Краснодар',
    addressCountry: 'RU',
  },
};

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(questions: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function serviceSchema(params: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: params.name,
    description: params.description,
    url: params.url,
    provider: {
      '@type': 'Person',
      name: 'Михаил Хряпин',
    },
    areaServed: params.areaServed ?? 'Краснодар',
  };
}

export const localBusinessKrasnodar = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Кубанская Набережная, д. 33, 3 подъезд, 2 этаж, офис 4',
    addressLocality: 'Краснодар',
    addressCountry: 'RU',
  },
  telephone: CONTACTS.phone,
  url: `${SITE.url}/contacts/`,
};

export const localBusinessCrimea = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Комарова, 13',
    addressLocality: 'Бахчисарай',
    addressRegion: 'Крым',
    addressCountry: 'RU',
  },
  telephone: CONTACTS.phone,
  url: `${SITE.url}/contacts/`,
};
