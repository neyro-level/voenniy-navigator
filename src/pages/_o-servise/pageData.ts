import { SITE } from '../../lib/constants';
import { OG_IMAGES } from '../../lib/og';
import { breadcrumbSchema, organizationSchema, personSchema, serviceSchema } from '../../lib/seo';

export const pageMeta = {
  title: 'О Военном навигаторе — сервис по военной ипотеке',
  description:
    'Что такое Военный навигатор, как устроен сервис выбора новостройки по военной ипотеке и какую роль в нём играет Михаил Хряпин.',
  canonical: `${SITE.url}/o-servise/`,
  ogImage: OG_IMAGES.home,
};

export const schemas = [
  organizationSchema(),
  personSchema(),
  serviceSchema({
    name: 'Военный навигатор — сервис по военной ипотеке',
    description:
      'Сервис помогает разобраться в задаче покупки, определить ограничения и выстроить маршрут выбора новостройки по военной ипотеке.',
    url: `${SITE.url}/o-servise/`,
    areaServed: 'Россия',
  }),
  breadcrumbSchema([
    { name: 'Главная', url: `${SITE.url}/` },
    { name: 'О Военном навигаторе', url: `${SITE.url}/o-servise/` },
  ]),
];
