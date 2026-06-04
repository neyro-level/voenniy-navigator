export const TECHNICAL_ROUTES = {
  consent: {
    label: 'Согласие на обработку',
    href: '/soglasie/',
    component: 'ConsentPage.astro',
  },
  privacy: {
    label: 'Политика обработки данных',
    href: '/politika/',
    component: 'PrivacyPage.astro',
  },
  cookies: {
    label: 'Использование Cookie',
    href: '/cookies/',
    component: 'CookiesPage.astro',
  },
  thanks: {
    label: 'Страница спасибо',
    href: '/thanks/',
    component: 'ThanksPage.astro',
  },
  notFound: {
    label: 'Страница 404',
    href: '/404/',
    component: 'NotFoundPage.astro',
  },
} as const;

export const FOOTER_LEGAL_LINKS = [
  TECHNICAL_ROUTES.consent,
  TECHNICAL_ROUTES.privacy,
  TECHNICAL_ROUTES.cookies,
] as const;

export const TECHNICAL_PAGE_FILES = [
  'src/pages/soglasie.astro',
  'src/pages/politika.astro',
  'src/pages/cookies.astro',
  'src/pages/thanks.astro',
  'src/pages/404.astro',
] as const;
