import { SITE } from '../../lib/constants';
import { OG_IMAGES } from '../../lib/og';
import { breadcrumbSchema, organizationSchema, personSchema, serviceSchema } from '../../lib/seo';

export const pageMeta = {
  title: 'О Военном навигаторе — Михаил Хряпин и сервис по военной ипотеке',
  description:
    'Что такое Военный навигатор, как Михаил Хряпин ведёт первичный разбор и как устроен сервис выбора новостройки по военной ипотеке.',
  canonical: `${SITE.url}/o-servise/`,
  ogImage: OG_IMAGES.oServise,
};

export const schemas = [
  organizationSchema(),
  personSchema(),
  serviceSchema({
    name: 'Военный навигатор — сервис по военной ипотеке с Михаилом Хряпиным',
    description:
      'Сервис помогает разобраться в задаче покупки, определить ограничения и выстроить маршрут выбора квартиры или новостройки по военной ипотеке.',
    url: `${SITE.url}/o-servise/`,
    areaServed: 'Россия',
  }),
  breadcrumbSchema([
    { name: 'Главная', url: `${SITE.url}/` },
    { name: 'О Военном навигаторе', url: `${SITE.url}/o-servise/` },
  ]),
];
