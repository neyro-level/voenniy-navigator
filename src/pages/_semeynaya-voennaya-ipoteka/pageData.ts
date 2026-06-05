import { SITE } from '../../lib/constants';
import { organizationSchema, breadcrumbSchema } from '../../lib/seo';

export const pageMeta = {
  title: 'Семейная военная ипотека | Как совместить два льготных кредита',
  description:
    'Как совместить военную и семейную ипотеку: условия, лимиты, документы и расчёт. Помощь в оформлении для военнослужащих с детьми.',
  canonical: `${SITE.url}/semeynaya-voennaya-ipoteka/`,
  ogImage: `${SITE.url}/og/semeynaya.jpg`,
};

export const schemas = [
  organizationSchema,
  breadcrumbSchema([
    { name: 'Главная', url: `${SITE.url}/` },
    { name: 'Семейная военная ипотека', url: `${SITE.url}/semeynaya-voennaya-ipoteka/` },
  ]),
];
