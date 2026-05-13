export type NavGroup = 'object' | 'route' | 'contact';

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
    description: 'Квартиры и новостройки в Крыму под сценарий покупки.',
    group: 'object',
    icon: 'map-pinned',
    badge: 'new',
  },
  {
    number: '03',
    label: 'Удалённо',
    labelShort: 'Удалённо',
    href: '/distancionnaya-pokupka/',
    description: 'Контроль района, ЖК, документов и сделки — без приезда.',
    group: 'route',
    icon: 'video',
  },
  {
    number: '04',
    label: 'Этапы покупки',
    labelShort: 'Этапы',
    href: '/etapy-pokupki/',
    description: 'Маршрут от цели покупки до регистрации.',
    group: 'route',
    icon: 'route',
  },
  {
    number: '05',
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
  route:   '02 · Понять маршрут',
  contact: '03 · Связаться',
};

// Header default (84px) — все 5 пунктов
export const HEADER_NAV = NAV_ITEMS;

// Dock (60px, при скролле) — 4 пункта без «Удалённо»
export const DOCK_NAV = NAV_ITEMS.filter(
  (item) => !item.href.includes('distancionnaya-pokupka'),
);
