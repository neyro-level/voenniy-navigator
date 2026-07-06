export type NavGroup = 'object' | 'trust' | 'route' | 'contact';

export interface NavItem {
  number: string;
  label: string;
  labelShort: string;
  href: string;
  description: string;
  group: NavGroup;
  icon: string;
  badge?: 'new' | 'current';
}

export const NAV_ITEMS: NavItem[] = [
  {
    number: '01',
    label: 'Краснодар',
    labelShort: 'Краснодар',
    href: '/voennaya-ipoteka-krasnodar/',
    description: 'Новостройки Краснодара по военной ипотеке — отбор под задачу.',
    group: 'object',
    icon: 'building-2',
  },
  {
    number: '02',
    label: 'Крым',
    labelShort: 'Крым',
    href: '/voennaya-ipoteka-krym/',
    description: 'Квартиры и новостройки в Крыму под вашу цель покупки.',
    group: 'object',
    icon: 'map-pinned',
  },
  {
    number: '03',
    label: 'О сервисе',
    labelShort: 'О сервисе',
    href: '/o-servise/',
    description: 'Что такое Военный навигатор, как устроен сервис и кто ведёт первичный расчёт.',
    group: 'trust',
    icon: 'compass',
  },
  {
    number: '04',
    label: 'Калькулятор',
    labelShort: 'Калькулятор',
    href: '/kalkulyator-voennoy-ipoteki/',
    description: 'Рассчитать ориентир по сумме, накоплениям и варианту покупки.',
    group: 'route',
    icon: 'calculator',
  },
  {
    number: '05',
    label: 'Условия',
    labelShort: 'Условия',
    href: '/usloviya-voennoy-ipoteki/',
    description: 'Кто может получить, ставки, сроки, документы и ограничения.',
    group: 'route',
    icon: 'file-text',
  },
  {
    number: '06',
    label: 'Семейная',
    labelShort: 'Семейная',
    href: '/semeynaya-voennaya-ipoteka/',
    description: 'Как совместить военную и семейную ипотеку: условия и расчёт.',
    group: 'route',
    icon: 'users',
  },
  {
    number: '07',
    label: 'Журнал',
    labelShort: 'Журнал',
    href: '/journal/',
    description: 'Разборы по военной ипотеке, банкам, сумме, Краснодару и Крыму.',
    group: 'route',
    icon: 'file-text',
  },
  {
    number: '08',
    label: 'Контакты',
    labelShort: 'Контакты',
    href: '/contacts/',
    description: 'Офисы в Краснодаре и Бахчисарае, телефон, мессенджеры.',
    group: 'contact',
    icon: 'phone',
  },
];

export const GROUP_LABELS: Record<NavGroup, string> = {
  object:  '01 · Выбрать объект',
  trust:   '02 · Понять сервис',
  route:   '03 · Понять процесс',
  contact: '04 · Связаться',
};

// Header default (84px) — без «Семейная» (ведём через footer / linking)
export const HEADER_NAV = NAV_ITEMS.filter(
  (item) => item.href !== '/semeynaya-voennaya-ipoteka/' && item.href !== '/journal/',
);

// Dock (60px, при скролле) — как header
export const DOCK_NAV = HEADER_NAV;
