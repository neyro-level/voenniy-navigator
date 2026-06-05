/**
 * Schema Factory — создаёт Schema.org JSON-LD объекты из единого GEO-конфига.
 * Все функции возвращают plain objects, готовые к JSON.stringify.
 */

import {
  GEO_SITE,
  GEO_CONTACTS,
  GEO_OFFICES,
  GEO_LEGAL,
  GEO_SERVICES,
  GEO_FAQ,
  GEO_LINKS,
  GEO_PERSON,
  GEO_AI_POLICY,
} from './config';

/** Base context для всех schema объектов */
const ctx = { '@context': 'https://schema.org' } as const;

/** Organization / LocalBusiness для основного офиса */
export function organizationSchema() {
  const primary = GEO_OFFICES.find((o) => o.primary) ?? GEO_OFFICES[0];
  return {
    ...ctx,
    '@type': 'Organization',
    name: GEO_SITE.name,
    url: `${GEO_SITE.url}/`,
    telephone: GEO_CONTACTS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: primary
        ? `${primary.address}${primary.detail ? ', ' + primary.detail : ''}`
        : undefined,
      addressLocality: primary?.city,
      addressCountry: GEO_SITE.country,
    },
    sameAs: [GEO_CONTACTS.vk, GEO_CONTACTS.telegram].filter(Boolean),
  };
}

/** WebSite с potentialAction (SearchAction) */
export function webSiteSchema() {
  return {
    ...ctx,
    '@type': 'WebSite',
    name: GEO_SITE.name,
    url: `${GEO_SITE.url}/`,
    description: GEO_SITE.tagline,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${GEO_SITE.url}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Person — эксперт / владелец */
export function personSchema() {
  const primary = GEO_OFFICES.find((o) => o.primary) ?? GEO_OFFICES[0];
  return {
    ...ctx,
    '@type': 'Person',
    name: GEO_PERSON.name,
    jobTitle: GEO_PERSON.jobTitle,
    address: {
      '@type': 'PostalAddress',
      addressLocality: primary?.city,
      addressCountry: GEO_SITE.country,
    },
  };
}

/** BreadcrumbList */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    ...ctx,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** FAQPage */
export function faqSchema(questions?: Array<{ q: string; a: string }>) {
  const source = questions ?? GEO_FAQ.map((f) => ({ q: f.q, a: f.a }));
  return {
    ...ctx,
    '@type': 'FAQPage',
    mainEntity: source.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** Service — для услуговых страниц */
export function serviceSchema(params: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
}) {
  return {
    ...ctx,
    '@type': 'Service',
    name: params.name,
    description: params.description,
    url: params.url,
    provider: {
      '@type': 'Person',
      name: GEO_PERSON.name,
    },
    areaServed: params.areaServed ?? (GEO_OFFICES.find((o) => o.primary)?.city || 'Краснодар'),
  };
}

/** LocalBusiness для контактной страницы / офиса */
export function localBusinessSchema(officeIndex: number) {
  const office = GEO_OFFICES[officeIndex];
  if (!office) throw new Error(`Office index ${officeIndex} not found`);
  return {
    ...ctx,
    '@type': 'LocalBusiness',
    name: GEO_SITE.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${office.address}${office.detail ? ', ' + office.detail : ''}`,
      addressLocality: office.city,
      addressCountry: GEO_SITE.country,
    },
    telephone: GEO_CONTACTS.phone,
    url: `${GEO_SITE.url}${GEO_LINKS.contacts}`,
  };
}

/** AI-фriendly metadata (не Schema.org, но полезно для crawlers) */
export function aiPolicyMeta() {
  return {
    allowedBots: GEO_AI_POLICY.allowedBots,
    disallowedPaths: GEO_AI_POLICY.disallowedPaths,
    sitemap: GEO_AI_POLICY.sitemap,
  };
}
