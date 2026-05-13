# COMPONENT_HEADER.md

**Компонент:** Navigator Dock + Route Map Overlay
**Проект:** Военный навигатор — Михаил Хряпин
**Версия:** 2.0
**Дата:** 2026-05-12
**Тип:** Сквозной сайтовый компонент — рендерится на каждой странице через PageLayout.astro

---

## 1. Архитектура компонента

**Меню — это единый слой поверх всего сайта.** Не повторяется на каждой странице — подключается один раз в layout.

```
src/
├── layouts/
│   ├── BaseLayout.astro        ← head, meta, SEO, fonts
│   └── PageLayout.astro        ← Header + <slot /> + Footer + BottomCTA
│
├── components/
│   └── layout/
│       ├── Header.astro        ← Navigator Dock (server-rendered)
│       ├── RouteMapOverlay.astro ← Fullscreen overlay (server HTML + TS)
│       └── MobileBottomCTA.astro ← Fixed bottom CTA (mobile only)
│
└── lib/
    └── navigation/
        ├── navData.ts           ← Единый источник всех ссылок
        └── navigationState.ts  ← Scroll, open/close, body-lock, focus-trap
```

### Подключение в PageLayout.astro

```astro
---
import Header from '../components/layout/Header.astro';
import RouteMapOverlay from '../components/layout/RouteMapOverlay.astro';
import MobileBottomCTA from '../components/layout/MobileBottomCTA.astro';
import Footer from '../components/layout/Footer.astro';
---
<body>
  <Header />
  <RouteMapOverlay />
  <main>
    <slot />
  </main>
  <Footer />
  <MobileBottomCTA />
  <script src="/scripts/navigation.ts"></script>
</body>
```

**Каждый `src/pages/*.astro` использует PageLayout:**
```astro
---
import PageLayout from '../layouts/PageLayout.astro';
---
<PageLayout title="..." description="...">
  <!-- блоки страницы -->
</PageLayout>
```

---

## 2. Концепция и wow-эффект

**Три режима, одна идея:**

| Режим | Что видит пользователь |
|---|---|
| **Default** (top of page) | Прозрачный header, сидит на Hero органично |
| **Floating Dock** (при скролле) | Панель «отрывается» от краёв, плавает над страницей |
| **Route Map Overlay** (по клику «Карта сайта») | Весь экран — тёмная карта маршрутов покупки |

**Смысловой образ меню:** не «навигация сайта», а **карта маршрутов для военнослужащего**. Три группы — Выбрать объект / Понять маршрут / Связаться — это миниатюрная воронка прямо в меню.

**Wow-моменты:**
- Floating Dock с border-radius: панель «отрывается» от экрана как инструмент (Arc Browser / Vercel стиль)
- «Карта сайта» вместо «Меню» — тематически точно для бренда Навигатор
- Тройная зона оверлея: бренд / сгруппированные маршруты / контакты
- Semantic grouping: посетитель сразу понимает логику сайта
- Staggered анимация карточек при открытии
- Route-line: тонкая линия маршрута между группами

---

## 3. navData.ts — единый источник навигации

**Используется в:** Header, RouteMapOverlay, Footer, sitemap

```typescript
// src/lib/navigation/navData.ts

export type NavGroup = 'object' | 'route' | 'contact';

export interface NavItem {
  number: string;
  label: string;
  labelShort: string;           // для sticky dock
  href: string;
  description: string;          // для overlay-карточки
  group: NavGroup;
  icon: string;                 // Lucide icon name
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
  object: '01 · Выбрать объект',
  route: '02 · Понять маршрут',
  contact: '03 · Связаться',
};

// HEADER_NAV (состояние 1, 84px): все 5 пунктов
// «Удалённо» виден в полном хедере, скрывается в dock
export const HEADER_NAV = NAV_ITEMS; // все 5

// DOCK_NAV (состояние 2, 60px floating): 4 пункта без «Удалённо»
export const DOCK_NAV = NAV_ITEMS.filter(
  item => !item.href.includes('distancionnaya-pokupka')
);
```

> **Финальная навигация:**
> - Состояние 1 (84px): `Краснодар · Крым · Удалённо · Этапы покупки · Контакты`
> - Состояние 2 dock (60px): `Краснодар · Крым · Этапы · Контакты`
> - «Удалённо» скрывается в dock — остаётся в оверлее группа «Понять маршрут»

---

## 4. Header.astro — три визуальных состояния

### Состояние A: Default (top of page, y=0–80px)

**Высота:** 84px
**Фон:** transparent (сидит на Hero органично)
**Position:** fixed, top: 0, z-index: 100

```
[ЛОГО]  Военный навигатор     Краснодар  Крым  Удалённо  Этапы покупки  Контакты
        Михаил Хряпин                          [Записаться на разбор]  [Карта сайта ▦]
```

### Состояние B: Floating Dock (y>80px)

**Высота:** 60px
**Position:** fixed, top: 12px
**Ширина:** `calc(100% - 48px)`, max-width: 1240px
**Центрирован:** `left: 50%; transform: translateX(-50%)`

```css
background: rgba(255, 255, 255, 0.88);
backdrop-filter: blur(18px) saturate(1.5);
-webkit-backdrop-filter: blur(18px) saturate(1.5);
border-radius: 16px;
border: 1px solid rgba(15, 37, 71, 0.10);
box-shadow: 0 2px 8px rgba(15, 37, 71, 0.06),
            0 8px 24px rgba(15, 37, 71, 0.04);
```

**Изменения в dock-режиме:**
- Дескриптор «Военный навигатор» скрыт (opacity 0)
- Логотип компактнее (только icon + имя)
- CTA: «Записаться на разбор» → «На разбор»
- Активный nav-пункт: soft-pill `bg: rgba(15,37,71,0.07)`, `border-radius: 8px`, `padding: 4px 12px`

**Transition:** 350ms cubic-bezier(0.4, 0, 0.2, 1) — плавное «всплытие»

### Состояние C: Overlay Open

- Header остаётся видимым (z-index 201, поверх оверлея)
- Логотип → белая версия
- CTA «На разбор» скрывается
- Кнопка «Карта сайта» → кнопка «Закрыть ×»

---

## 5. Header — детали компонентов

### Логотип (финальный знак — Corner Brackets)

**Контейнер:** flex, align-items center, gap 10px

**Inline SVG знака** (цвет управляется через CSS-переменную `--logo-bracket-color`):

```astro
<svg width="36" height="36" viewBox="0 0 40 40" fill="none"
     class="vn-logo-mark" aria-hidden="true">
  <!-- Пунктирный круг -->
  <circle cx="20" cy="20" r="9"
    stroke="var(--logo-bracket-color, #0F2547)"
    stroke-width="0.7" stroke-dasharray="2.2 2.2"/>
  <!-- Угловые скобки -->
  <path d="M7 13 L7 7 L13 7"
    stroke="var(--logo-bracket-color, #0F2547)"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 7 L33 7 L33 13"
    stroke="var(--logo-bracket-color, #0F2547)"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 27 L7 33 L13 33"
    stroke="var(--logo-bracket-color, #0F2547)"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 33 L33 33 L33 27"
    stroke="var(--logo-bracket-color, #0F2547)"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Синяя точка — акцент -->
  <circle cx="20" cy="20" r="2.8" fill="#2563EB"/>
</svg>
```

**CSS переключение светлый/тёмный:**
```css
.vn-header__logo { --logo-bracket-color: #0F2547; }
[data-overlay="true"] .vn-header__logo { --logo-bracket-color: rgba(241,243,245,0.75); }
```

**Текстовый блок:**
- Line 1: `ВОЕННЫЙ НАВИГАТОР` — Inter Semi Bold 14px, UPPERCASE, letter-spacing 0.025em, color.text.primary
- Line 2: `МИХАИЛ ХРЯПИН` — Inter Regular 9px, UPPERCASE, letter-spacing 0.07em, color.text.tertiary
- Line 2 скрыта в dock-режиме: `opacity: 0; height: 0; overflow: hidden; transition: 300ms`

**Hover знака:** знак чуть увеличивается `scale(1.06)`, transition 300ms ease

---

### Навигационные ссылки (desktop, 4 пункта из HEADER_NAV)

```
Новостройки   Дистанционно   Этапы   Контакты
```
- Inter Medium 14px, letter-spacing 0.01em, color.text.secondary
- Gap между пунктами: 36px
- Hover: color.text.primary + underline (scaleX left→right, 200ms)
- Активная страница: soft-pill в dock-режиме, accent dot в default-режиме

---

### Кнопка «Карта сайта»

**Состав:**
- Иконка `layout-grid` (Lucide, 16px, stroke 1.5px, color.text.secondary)
- Текст: «Карта сайта» — Inter Medium 13px, color.text.secondary
- Разделитель (1px, 12px высота, rgba(15,37,71,0.15)) между иконкой и текстом

**Контейнер:**
- border: 1px solid rgba(15,37,71,0.12)
- radius: radius.md (10px)
- padding: 8px 14px
- height: 36px
- bg: transparent
- hover: bg rgba(15,37,71,0.05), border-color rgba(15,37,71,0.2)

**При открытом overlay:**
- Текст меняется на «Закрыть» (200ms crossfade)
- Иконка `layout-grid` морфирует в `x` (200ms, через opacity crossfade)

---

### CTA кнопка «Записаться на разбор» / «На разбор»

```
[Default state]   Записаться на разбор
[Dock state]      На разбор
```
- bg: color.accent.cta (#2563EB)
- color: white
- Inter Medium 14px
- height: 40px, dock: 36px
- radius: radius.md
- padding: default 10px 20px, dock 8px 16px
- hover: translateY(-1px) + shadow 0 4px 12px rgba(37,99,235,0.3)
- Действие: `href="/contacts/#request"` + JS перехватывает и открывает RequestModal

---

## 6. Route Map Overlay — детальная спецификация

### Фон и декор

```css
position: fixed;
inset: 0;
z-index: 200;
background: #0F1419;
```

**Декоративные слои:**
- Decorative grid 64×64: `rgba(255,255,255,0.03)` — по всему экрану
- Radial gradient TR (top-right): `rgba(37,99,235,0.07)` → transparent, radius 1400px
- Corner brackets (4 угла): 48×48px L-shape, stroke 1px, `rgba(241,243,245,0.08)`
- Watermark: `МАРШРУТ` — 280px, Semi Bold, `rgba(255,255,255,0.015)`, absolute bottom-center

---

### Overlay Header (72px, top)

```
[LOGO white]                              [× Закрыть]
```
- border-bottom: 1px solid rgba(241,243,245,0.08)
- padding: 0 48px

**Закрыть кнопка:**
- `[× Закрыть]` — icon 20px + label Regular 14px, color.text.ondark-mute
- border: 1px solid rgba(241,243,245,0.15), padding 8px 16px, radius.md
- hover: bg rgba(241,243,245,0.08)
- Лейбл «КАРТА МАРШРУТОВ» по центру: label-mono 11px, color.text.ondark-mute opacity 0.5

---

### Трёхзонный layout (12 колонок: 4 / 5 / 3)

```
cols 1-4        cols 5-9               cols 10-12
────────────    ─────────────────────  ────────────
BRAND ZONE      ROUTE MAP CENTER       CONTACT ZONE
```

---

### Левая зона (cols 1–4) — Brand + CTA

**Padding:** 48px 32px 48px 0

**Логотип (белая версия):** icon + МИХАИЛ ХРЯПИН

**Дескриптор:**
```
Навигатор по новостройкам
и военной ипотеке
```
- Regular 16px, color.text.ondark-mute, max-width 220px, margin-top: spacing.6

**Body:**
```
Помогает военнослужащим и их семьям
выбрать квартиру под задачу и пройти
маршрут покупки без хаоса.
```
- Regular 14px, color.text.ondark-mute opacity 0.7, max-width 220px, margin-top: spacing.4

**CTA (margin-top: spacing.8):**
```
Разобрать мою ситуацию →
```
- bg: color.accent.cta, white, Medium 15px, padding 12px 20px, radius.md, height 44px

**Микротекст под CTA:**
```
30 минут. Сначала цель, потом варианты.
```
- Regular 12px, color.text.ondark-mute opacity 0.5

---

### Центральная зона (cols 5–9) — Route Map

**Padding:** 48px

**Три группы с route-line между ними:**

---

#### Route-line animation

Горизонтальная линия проходит между группами:
- 1px, color.accent.cta opacity 0.2
- При открытии: `scaleX(0) → scaleX(1)` за 400ms, delay 200ms, left→right origin
- Маркеры на линии: circle 8px, bg color.accent.cta opacity 0.4, в конце каждой секции

---

#### Группа 1: «01 · Выбрать объект»

**Sub-header:**
```
01 · ВЫБРАТЬ ОБЪЕКТ
```
- label-mono 11px, color.accent.cta, accent line (2×24px) слева

**2 карточки горизонтально:**

**Карточка Новостройки:**
- Technical label: `OBJECT / 01` — label-mono 10px, color.text.ondark-mute opacity 0.4
- Icon: `building-2` (Lucide 20px, color.accent.cta opacity 0.6)
- H3: «Новостройки Краснодара» — Medium 16px, color.text.ondark
- Body: «Отбор ЖК под задачу, а не по витрине.» — Regular 13px, color.text.ondark-mute

**Карточка Крым:**
- Technical label: `OBJECT / 02`
- Badge: `НОВОЕ` — bg rgba(37,99,235,0.2), color.accent.cta, label-mono 10px
- Icon: `map-pinned` (Lucide 20px)
- H3: «Военная ипотека в Крыму» — Medium 16px, color.text.ondark
- Body: «Квартиры и новостройки под сценарий покупки.» — Regular 13px

**Структура карточки:**
- bg: rgba(241,243,245,0.04), border: 1px solid rgba(241,243,245,0.07)
- radius: radius.lg, padding: 20px
- Hover: bg rgba(241,243,245,0.08), border rgba(241,243,245,0.15)
- Hover: corner brackets появляются (12×12px, L-shape, opacity 0 → 0.4)
- Hover: стрелка `→` появляется в правом нижнем углу
- Active route (текущая страница): border color.accent.cta opacity 0.4 + label `ТЕКУЩИЙ МАРШРУТ`
- Click: overlay закрывается + переход

---

#### Группа 2: «02 · Понять маршрут»

**2 карточки горизонтально:**

**Карточка Дистанционная:**
- Technical label: `REMOTE / 03`
- Icon: `video`
- H3: «Дистанционная покупка»
- Body: «Как контролировать район, ЖК и документы удалённо.»

**Карточка Этапы:**
- Technical label: `ROUTE / 04`
- Icon: `route`
- H3: «Этапы покупки»
- Body: «Маршрут от цели покупки до регистрации.»

---

#### Группа 3: «03 · Связаться»

**2 карточки горизонтально:**

**Карточка Контакты:**
- Technical label: `CONTACT / 05`
- Icon: `phone`
- H3: «Контакты»
- Body: «Офисы в Краснодаре и Бахчисарае.»

**Карточка Главная:**
- Technical label: `START / 00`
- Icon: `compass`
- H3: «Главная»
- Body: «Кто такой Михаил и как начинается работа.»

---

### Правая зона (cols 10–12) — Contacts

**Padding:** 48px 0 48px 32px
**border-left:** 1px solid rgba(241,243,245,0.08)

**Sub-header:**
```
СВЯЗАТЬСЯ
```
- label-mono 11px, color.accent.cta

**4 кнопки связи (vertical stack, gap 12px):**

```
[phone]    +7 938 407 4457
[send]     [TELEGRAM]
[message]  [MAX_LINK]
[share-2]  ВКонтакте
```
- bg: rgba(241,243,245,0.04), border: 1px solid rgba(241,243,245,0.08)
- radius: radius.md, padding: 10px 16px
- Icon 16px + Text Medium 14px color.text.ondark
- hover: bg rgba(241,243,245,0.08), icon → color.accent.cta

**Ghost divider (margin-block: 24px)**

**Офисы:**
```
ОФИСЫ
```
- label-mono 11px, color.text.ondark-mute

```
[map-pin]  Краснодар
           ул. Кубанская Набережная, 33

[map-pin]  Бахчисарай (Крым)
           ул. Комарова, 13
```
- Icon 14px, color.text.ondark-mute opacity 0.5
- City: Medium 13px, color.text.ondark
- Street: Regular 12px, color.text.ondark-mute opacity 0.6
- «Встречи по предварительной записи» — Regular 11px, color.text.ondark-mute opacity 0.4

---

### Overlay Footer Strip (56px, bottom)

- border-top: 1px solid rgba(241,243,245,0.06)
- padding: 0 48px
- flex, space-between

**Left:** `← Вернуться на главную` — Regular 13px, color.text.ondark-mute
**Right:** `Политика конфиденциальности · Cookie` — Regular 12px, ссылки на `/politika/` и `/cookies/`

---

## 7. Анимации оверлея

| Элемент | Вход | Задержка | Длит. | Easing |
|---|---|---|---|---|
| Overlay bg | opacity 0→1 | 0ms | 200ms | ease |
| Left zone | opacity+X(-16px)→0 | 50ms | 350ms | ease-out |
| Group 1 cards | opacity+Y(16px)→0 | 100ms | 400ms | ease-out |
| Route-line 1→2 | scaleX 0→1 | 200ms | 400ms | ease-out |
| Group 2 cards | opacity+Y(16px)→0 | 180ms | 400ms | ease-out |
| Route-line 2→3 | scaleX 0→1 | 300ms | 400ms | ease-out |
| Group 3 cards | opacity+Y(16px)→0 | 260ms | 400ms | ease-out |
| Right zone | opacity 0→1 | 150ms | 300ms | ease |
| Footer strip | opacity 0→1 | 320ms | 250ms | ease |
| **Закрытие** | всё reverse | — | 180ms | ease-in |

---

## 8. Mobile Header (≤1023px)

**Высота:** 60px
**Padding:** 0 20px

```
[LOGO icon + name]                    [На разбор] [Меню ▦]
```

**Логотип mobile:** icon (28px) + «МИХАИЛ ХРЯПИН» (13px Semi Bold)
Дескриптор скрыт.

**CTA mobile:** «На разбор» — bg color.accent.cta, padding 8px 14px, height 36px, Medium 13px
**Кнопка Меню:** icon `layout-grid` 18px, border 1px color.border, 36×36px

---

### Mobile Overlay (100dvh)

**Фон:** bg/dark, grid 48×48

```
[LOGO white]  КАРТА МАРШРУТОВ  [×]    ← header 60px

[Разобрать мою ситуацию] ←───── Primary CTA (full-width)

────────────────────────────────

01  Новостройки Краснодара         →
    Отбор ЖК под задачу

02  Военная ипотека в Крыму        →
    Квартиры и новостройки в Крыму

03  Дистанционная покупка          →
    Контроль района и сделки удалённо

04  Этапы покупки                  →
    Маршрут от цели до регистрации

05  Контакты                       →
    Краснодар · Бахчисарай

────────────────────────────────

[phone icon] +7 938 407 4457
[TG icon]    Telegram
[Max icon]   Max

```

> ℹ️ В мобильной версии при раскрытии оверлея показываем **Telegram + Max** как основные мессенджеры. Телефон отдельной строкой выше. Max — российский мессенджер, ссылка `[MAX_LINK]` добавляется позже.

**Mobile nav item:**
- Min-height: 64px (удобный touch target)
- Horizontal: number (label-mono, color.accent.cta opacity 0.4) + title (Medium 16px) + arrow
- Dividers: 1px, rgba(241,243,245,0.07)
- Tap → overlay закрывается, переход

---

## 9. MobileBottomCTA.astro

**Видимость:** только mobile (≤1023px)
**Position:** fixed bottom 0, full-width
**z-index:** 50 (ниже overlay, ниже popup-форм)
**bg:** rgba(241,243,245,0.92) + backdrop-filter blur(12px)
**border-top:** 1px solid rgba(15,37,71,0.10)
**Padding:** 12px 20px, safe-area-inset-bottom

```
[На разбор — кнопка full-width]
```
- bg color.accent.cta, white, Medium 15px, height 48px, radius.md

**Скрывается:**
- Когда overlay открыт
- Когда форма открыта
- На странице /contacts/ (там уже много CTA)

---

## 10. navigationState.ts — управление состоянием

```typescript
// src/lib/navigation/navigationState.ts
// Vanilla TypeScript — без React, без фреймворков

export class NavigationState {
  private header: HTMLElement;
  private overlay: HTMLElement;
  private isOpen = false;
  private scrollY = 0;

  constructor() {
    this.header = document.getElementById('site-header')!;
    this.overlay = document.getElementById('route-map-overlay')!;
    this.init();
  }

  private init() {
    // Scroll → floating dock
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    this.handleScroll();

    // Toggle buttons
    document.querySelectorAll('[data-nav-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Nav links: close on click
    this.overlay.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', () => this.close());
    });
  }

  private handleScroll() {
    const scrolled = window.scrollY > 80;
    this.header.setAttribute('data-state', scrolled ? 'dock' : 'top');
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    this.overlay.setAttribute('data-open', 'true');
    this.header.setAttribute('data-overlay', 'true');
    // Focus first link in overlay
    const firstLink = this.overlay.querySelector('a[href]') as HTMLElement;
    firstLink?.focus();
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
    this.overlay.setAttribute('data-open', 'false');
    this.header.setAttribute('data-overlay', 'false');
    // Return focus to toggle button
    const toggleBtn = document.querySelector('[data-nav-toggle]') as HTMLElement;
    toggleBtn?.focus();
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  new NavigationState();
});
```

---

## 11. CSS — ключевые состояния и переходы

```css
/* Header states */
#site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 84px;
  transition:
    background 300ms ease,
    height 300ms ease,
    top 300ms ease,
    left 300ms ease,
    right 300ms ease,
    border-radius 300ms ease,
    box-shadow 300ms ease;
}

/* State: top of page */
[data-state="top"] {
  background: transparent;
  height: 84px;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 0;
  box-shadow: none;
}

/* State: floating dock */
[data-state="dock"] {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px) saturate(1.5);
  -webkit-backdrop-filter: blur(18px) saturate(1.5);
  height: 60px;
  top: 12px;
  left: 24px;
  right: 24px;
  border-radius: 16px;
  border: 1px solid rgba(15, 37, 71, 0.10);
  box-shadow:
    0 2px 8px rgba(15, 37, 71, 0.06),
    0 8px 24px rgba(15, 37, 71, 0.04);
}

/* State: overlay open */
[data-overlay="true"] {
  background: transparent;
  box-shadow: none;
  border-color: transparent;
}

/* Overlay */
#route-map-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #0F1419;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}
[data-open="true"] {
  opacity: 1;
  pointer-events: auto;
}

/* Nav cards in overlay */
.vn-route-card {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 400ms ease-out, transform 400ms ease-out;
}
[data-open="true"] .vn-route-card:nth-child(1) { transition-delay: 100ms; opacity: 1; transform: none; }
[data-open="true"] .vn-route-card:nth-child(2) { transition-delay: 160ms; opacity: 1; transform: none; }
[data-open="true"] .vn-route-card:nth-child(3) { transition-delay: 220ms; opacity: 1; transform: none; }
[data-open="true"] .vn-route-card:nth-child(4) { transition-delay: 280ms; opacity: 1; transform: none; }
[data-open="true"] .vn-route-card:nth-child(5) { transition-delay: 340ms; opacity: 1; transform: none; }
[data-open="true"] .vn-route-card:nth-child(6) { transition-delay: 400ms; opacity: 1; transform: none; }

/* Route lines */
.vn-route-line {
  height: 1px;
  background: rgba(37, 99, 235, 0.2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 400ms ease-out;
}
[data-open="true"] .vn-route-line:nth-child(1) { transition-delay: 200ms; transform: scaleX(1); }
[data-open="true"] .vn-route-line:nth-child(2) { transition-delay: 300ms; transform: scaleX(1); }

/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

---

## 12. Accessibility — полная спецификация

```html
<!-- Кнопка-триггер -->
<button
  type="button"
  id="nav-toggle"
  data-nav-toggle
  aria-expanded="false"        <!-- JS переключает: true/false -->
  aria-controls="route-map-overlay"
  aria-label="Открыть карту сайта"
>
  <!-- icon + label -->
</button>

<!-- Overlay -->
<div
  id="route-map-overlay"
  role="dialog"
  aria-modal="true"
  aria-label="Карта сайта — навигация"
  data-open="false"
>
  <!-- Первый фокусируемый элемент — кнопка Закрыть -->
  <button type="button" data-nav-close aria-label="Закрыть карту сайта">
    × Закрыть
  </button>
  <!-- ... nav content ... -->
</div>

<!-- Активная страница -->
<a href="/voennaya-ipoteka-krasnodar/" aria-current="page">Краснодар</a>
```

**Focus trap:** при открытом overlay Tab и Shift+Tab циркулируют только внутри overlay.

**Focus return:** при закрытии фокус возвращается на `#nav-toggle`.

**Screen readers:** overlay скрыт из таба когда закрыт (`pointer-events: none` + `tabindex="-1"` на всех интерактивных элементах).

---

## 13. Чек-лист разработки

### Компонент Header
- [ ] 3 состояния: data-state="top/dock/overlay"
- [ ] Floating dock: border-radius 16px + top: 12px + left/right: 24px
- [ ] Frosted glass: backdrop-filter blur(18px) + rgba(255,255,255,0.88)
- [ ] Logo placeholder SVG в `/public/logo-mark.svg`
- [ ] Анимация дескриптора (скрыт в dock)
- [ ] CTA текст меняется: «Записаться на разбор» → «На разбор»
- [ ] Кнопка «Карта сайта»: icon layout-grid → x при открытии

### navData.ts
- [ ] Все 5 пунктов типизированы (NavItem)
- [ ] HEADER_NAV = 4 пункта (без Крыма в главной строке)
- [ ] Крым в overlay группе 'object'

### Route Map Overlay
- [ ] Трёхзонный layout (4/5/3) корректно на 1280px и 1440px
- [ ] 6 route-карточек с technical labels
- [ ] Route-lines между группами (scaleX анимация)
- [ ] Corner brackets на hover карточек
- [ ] Active route marker на текущей странице
- [ ] Правильные адреса офисов: Краснодар ул. Кубанская Набережная, 33 и Бахчисарай ул. Комарова, 13

### Mobile
- [ ] Высота 60px, logo compact
- [ ] MobileBottomCTA.astro: fixed bottom, z-index 50
- [ ] MobileBottomCTA скрывается при открытом overlay и на /contacts/
- [ ] Touch target каждого nav-item ≥ 64px

### navigationState.ts
- [ ] Scroll → dock (y>80px)
- [ ] toggle() / open() / close()
- [ ] Body scroll lock при открытом overlay
- [ ] Escape закрывает
- [ ] Focus trap + focus return

### Accessibility
- [ ] aria-expanded на toggle button
- [ ] role="dialog" aria-modal="true" на overlay
- [ ] aria-current="page" на активной ссылке
- [ ] prefers-reduced-motion: все анимации 0ms

### Производительность
- [ ] Нет React — только Astro + vanilla TypeScript
- [ ] Иконки Lucide импортированы точечно (не весь bundle)
- [ ] Overlay не блокирует LCP (рендерится в DOM, но hidden)
- [ ] Нет крупных изображений в header

---

**Конец COMPONENT_HEADER.md v2.0**

*Применяется в: PageLayout.astro на всех страницах проекта*
*Данные: navData.ts → Header + Overlay + Footer*
*Стиль: DESIGN_SYSTEM.md (Architectural Navigator v1.0)*
