export const SITE = {
  name:     'Михаил Хряпин — Военный навигатор',
  tagline:  'Навигатор по новостройкам Краснодара для военнослужащих',
  url:      'https://[DOMAIN]', // TODO: заменить после получения домена
};

export const OFFICES = [
  {
    city:    'Краснодар',
    address: 'ул. Кубанская Набережная, 33',
    detail:  '3 подъезд, 2 этаж, офис 4',
    mapUrl:  'https://yandex.ru/map-widget/v1/?um=constructor%3A269f590d4b02b49eb7666fde1d0f90859fb09fd28d03c93cc6fd72ae30f4bb48&source=constructor',
    note:    'По предварительной записи',
    primary: true,
  },
  {
    city:    'Бахчисарай (Крым)',
    address: 'ул. Комарова, 13',
    detail:  '',
    mapUrl:  'https://yandex.ru/map-widget/v1/?um=constructor%3Ac4045c942f0d5288e0d89be0d9997a6643816d5f052f4110e27f450ed3db5ff9&source=constructor',
    note:    'По предварительной записи',
    primary: false,
  },
];

export const CONTACTS = {
  phone:    '+7 (938) 407 44 57',
  telegram: 'https://t.me/Mikhail_khryapin?text=Михаил%2C%20здравствуйте%2C%20я%20с%20вашего%20сайта.%20Нужно%20обсудить%20мою%20ситуацию',
  max:      '[MAX_LINK]',        // TODO: уточнить у Михаила (Max — российский мессенджер)
  vk:       '[VK_GROUP]',        // TODO: уточнить у Михаила
  email:    '[PRIMARY_EMAIL]',   // TODO: уточнить у Михаила
};

export const LEGAL = {
  name:  'ИП Мазур Алёна Викторовна',
  inn:   '910406895307',
  ogrn:  '322237500111941',
  year:  new Date().getFullYear(),
};

export const ROUTE_PATH = [
  { step: '01', label: 'Цель',      href: '/voennaya-ipoteka-krasnodar/' },
  { step: '02', label: 'Объект',    href: '/voennaya-ipoteka-krasnodar/' },
  { step: '03', label: 'Маршрут',   href: '/etapy-pokupki/' },
  { step: '04', label: 'Сделка',    href: '/etapy-pokupki/' },
  { step: '05', label: 'Результат', href: '/contacts/' },
];
