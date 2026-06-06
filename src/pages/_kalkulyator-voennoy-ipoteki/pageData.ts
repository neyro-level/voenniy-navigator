import { SITE } from '../../lib/constants';
import { OG_IMAGES } from '../../lib/og';
import { organizationSchema, breadcrumbSchema } from '../../lib/seo';

export const pageMeta = {
  title: 'Калькулятор военной ипотеки | Сумма, условия, сценарии покупки',
  description:
    'Рассчитайте ориентир по военной ипотеке: сумма, условия, накопления, банки и сценарии покупки. Поймите, когда онлайн-расчета достаточно, а когда нужен разбор.',
  canonical: `${SITE.url}/kalkulyator-voennoy-ipoteki/`,
  ogImage: OG_IMAGES.kalkulyator,
};

export const schemas = [
  organizationSchema(),
  breadcrumbSchema([
    { name: 'Главная', url: `${SITE.url}/` },
    { name: 'Калькулятор военной ипотеки', url: `${SITE.url}/kalkulyator-voennoy-ipoteki/` },
  ]),
];
