# CLAUDE.md

**Проект:** Военный навигатор — Михаил Хряпин
**Стек:** Astro + Tailwind CSS v4 + TypeScript strict + React islands + Vercel
**Этот файл читается Claude Code автоматически при старте сессии.**

---

## 0. РАЗРЕШЕНИЯ — АВТОНОМНЫЙ РЕЖИМ

**Владелец проекта Андрей Чирков выдал полные разрешения на все действия.**

```
✅ Редактировать, создавать, удалять любые файлы проекта — без подтверждения
✅ Запускать pnpm install / build / dev — без подтверждения
✅ Коммитить в git — без подтверждения
✅ Деплоить на Vercel (vercel CLI) — без подтверждения
✅ Добавлять/изменять env-переменные в Vercel — без подтверждения
✅ Исправлять TypeScript-ошибки и линтер-предупреждения — без подтверждения
✅ Устанавливать новые зависимости из package.json — без подтверждения
```

**НЕ делать без явного запроса:**
```
✗ git push в remote
✗ vercel --prod (продакшн деплой)
✗ Удалять _project-docs/ документы
✗ Менять TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
```

---

## 1. ПЕРВОЕ ДЕЙСТВИЕ В КАЖДОЙ СЕССИИ

```
1. ASTRO_RULES_CORE.md       ← ЧИТАТЬ ОБЯЗАТЕЛЬНО (критичные правила, ~200 строк)
2. SITE_ARCHITECTURE.md      ← карта сайта, URL, структура файлов
3. DESIGN_SYSTEM.md          ← цвета, типографика, токены
4. PAGE_*.md нужной страницы ← блоки, тексты, JSON-LD
```

ASTRO_RULES.md = полный справочник, читать по необходимости.

**Инструкция по сборке:**
```
Фаза 1 (фундамент): BUILD_PHASE_1_FOUNDATION.md
Фаза 2 (страницы):  BUILD_PHASE_2_PAGES.md
Фаза 3 (финал):     BUILD_PHASE_3_FINAL.md
```

Никогда не начинай строить компонент или страницу без прочтения бриф-файла.

---

## 2. ПРОЕКТ В ОДНОЙ ФРАЗЕ

Персональный сайт эксперта по военной ипотеке в Краснодаре. Помогает военнослужащим выбрать новостройку под задачу и пройти маршрут покупки.

---

## 3. ТЕХНИЧЕСКИЙ СТЕК

```
Astro (latest stable)  — фреймворк, SSG, роутинг
Tailwind CSS v4        — стилизация через @theme токены
TypeScript strict      — типизация всего кода
React islands          — ТОЛЬКО для интерактивных компонентов
Lucide React           — иконки, stroke 1.5px
Vercel                 — деплой
pnpm                   — пакетный менеджер
```

---

## 4. ПРАВИЛА КОДА — НИКОГДА НЕ НАРУШАТЬ

```
✗  Не использовать jQuery, Bootstrap, Vue, Angular
✗  Не хардкодить hex-цвета — только CSS-переменные из @theme
✗  Не использовать React там где достаточно Astro + vanilla TS
✗  Не создавать глобальные CSS-селекторы без namespace vn-
✗  Не использовать position:fixed в React-компонентах
✗  Не дублировать навигационные данные — только navData.ts
✗  Не писать inline стили с hex-цветами в Astro-шаблонах
✗  Монолитные страницы в одном файле — ЗАПРЕЩЕНЫ
```

```
✅  ОБЯЗАТЕЛЬНО: каждая секция страницы = отдельный .astro файл
    src/pages/_[slug]/01-Hero.astro, 02-ShortAnswer.astro и т.д.
    Файл страницы = ТОЛЬКО импорты и порядок блоков.

✅  Hero-секции: padding-top: 160px (desktop) / 100px (mobile)
    Хедер position:fixed перекрывает контент без этого отступа.
    160px = 84px высота хедера + 76px визуальный отступ.

✅  Namespace: vn-{page}-{block}__element
✅  React: только client:load или client:visible
✅  Анимации: только CSS + prefers-reduced-motion
✅  Alt на каждом img
✅  Aria-labels на icon-only кнопках
✅  loading="eager" на Hero-фото · loading="lazy" на остальных
```

### Рефакторинг монолитных страниц

```
Для каждой уже собранной монолитной страницы:
1. Создай src/pages/_[slug]/
2. Каждый <section> → отдельный файл 01-Hero.astro, 02-*.astro
3. Файл страницы = только импорты и порядок
Начинай с index.astro. Внешний вид не меняется — только структура.
```

---

## 4a. ИЗОЛЯЦИЯ БЛОКОВ — ЗАКОН

**Каждый блок — самостоятельная единица. Изменение одного не влияет на другие.**

```
✅  CSS-namespace: vn-{page}-{block}__element
    Примеры: vn-krd-hero__title, vn-home-faq__item
✅  Стили живут только внутри блока (<style> в файле)
✅  Блок не зависит от порядка на странице
✅  Общие утилиты — только из global.css
✗  Нельзя: .vn-block-a + .vn-block-b { ... }
✗  Нельзя: :nth-child для межблочной логики
```

---

## 4b. 12-КОЛОНОЧНАЯ СЕТКА — ЗАКОН

**Каждая секция на desktop = `.vn-grid-12` с явными `grid-column`.**

```css
/* global.css */
.vn-container { max-width: 1280px; margin-inline: auto; padding-inline: 48px; }
.vn-grid-12   { display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px; }
@media (max-width: 1023px) { .vn-grid-12 > * { grid-column: 1 / -1; } }
```

```astro
<section class="vn-section">
  <div class="vn-container">
    <div class="vn-grid-12">
      <div style="grid-column: 1 / 7">…</div>
      <div style="grid-column: 7 / 13">…</div>
    </div>
  </div>
</section>
```

```
✗  display:flex для горизонтальных макетов на desktop — запрещено
✗  grid-template-columns: 1fr 1fr без явных grid-column — запрещено
✅  Каждый потомок .vn-grid-12 имеет grid-column
✅  max-width: 58ch — только на дочернем элементе внутри колонки
```

**Паттерны:**

| Паттерн | Левый | Правый |
|---|---|---|
| 6/6 равные | `1/7` | `7/13` |
| 7/5 текст+фото | `1/8` | `8/13` |
| 5/7 фото+текст | `1/6` | `6/13` |
| 3 карточки | `1/5` | `5/9`, `9/13` |
| 4 карточки | `1/4`, `4/7`, `7/10`, `10/13` | — |
| Центр 8 | `3/11` | — |

---

## 4c. GLOBAL.CSS — ЧТО УЖЕ ЕСТЬ, НЕ ПЕРЕОПРЕДЕЛЯТЬ

| Класс | Что делает |
|---|---|
| `.vn-btn-primary` | Синяя CTA кнопка. Hover: белый фон + рамка + translateY(-1px) + glow |
| `.vn-btn-ghost` | Прозрачная с рамкой |
| `.vn-label-mono` | Uppercase eyebrow с синей чертой слева |
| `.vn-tag` | Маленький badge |
| `.vn-card` | Белая карточка: padding 32px, radius 12px, тень |
| `.vn-section` | Секция 120px vertical padding, bg-primary |
| `.vn-section--secondary` | bg-secondary |
| `.vn-section--dark` | bg-dark |
| `.vn-deco-grid` | Декоративная сетка светлая |
| `.vn-deco-grid--dark` | Декоративная сетка тёмная |
| `.vn-section-marker` | Номер 220px, position absolute |
| `.vn-faq-item/question/answer` | FAQ компоненты |
| `.vn-container` | max-width 1280px, padding 48px |
| `.vn-grid-12` | 12-col grid, gap 32px |

Кастомные размеры кнопок — только override padding/font-size, не цвета:
```css
.vn-header__cta { font-size: 14px; padding: 10px 20px; }
```

---

## 5. ЦВЕТОВЫЕ ТОКЕНЫ

```css
--color-bg-primary:       #F1F3F5;
--color-bg-secondary:     #E9ECEF;
--color-bg-surface:       #FFFFFF;
--color-bg-dark:          #0F1419;
--color-bg-dark-elev:     #1A2028;
--color-text-primary:     #0F1419;
--color-text-secondary:   #4A5568;
--color-text-tertiary:    #8B95A3;
--color-text-ondark:      #F1F3F5;
--color-text-ondark-mute: rgba(241,243,245,0.7);
--color-accent-primary:   #0F2547;
--color-accent-cta:       #2563EB;
--color-accent-hover:     #1D4ED8;
--color-border:           rgba(15,37,71,0.12);
--color-border-ondark:    rgba(241,243,245,0.12);
--color-deco-grid:        rgba(15,37,71,0.04);
--color-deco-grid-dark:   rgba(255,255,255,0.03);
--color-deco-marker:      rgba(15,37,71,0.05);
```

---

## 5b. ТИПОГРАФИКА

```css
--fs-display: clamp(36px, 4.5vw, 52px);
--fs-h1:      clamp(28px, 3.8vw, 50px);
--fs-h2:      clamp(22px, 2.8vw, 36px);
--fs-h3:      clamp(18px, 1.8vw, 24px);
--fs-lead:    17px;  /* 16px на ≤640px */
--fs-body:    15px;
--fs-body-sm: 13px;
--fs-label:   12px;
--fs-caption: 11px;
```

**Запрет висячих строк:**
```css
h1, h2, h3 { text-wrap: balance; }
p, li      { text-wrap: pretty; }
```

**Неразрывные пробелы:**
```
65&nbsp;сделок  ·  +7&nbsp;938...  ·  с&nbsp;2016&nbsp;года
```

---

## 6. СТРУКТУРА ФАЙЛОВ

```
src/
├── layouts/   BaseLayout.astro, PageLayout.astro
├── components/
│   ├── layout/  Header, RouteMapOverlay, MobileBottomCTA, Footer
│   └── ui/      RequestModal.tsx, CookieBanner.tsx, PhotoPlaceholder.astro
├── lib/       navData.ts, constants.ts
├── pages/
│   ├── index.astro + _home/01-Hero.astro ... 12-FinalCTA.astro
│   ├── voennaya-ipoteka-krasnodar.astro + _voennaya-ipoteka-krasnodar/
│   ├── voennaya-ipoteka-krym.astro + _voennaya-ipoteka-krym/
│   ├── distancionnaya-pokupka.astro + _distancionnaya-pokupka/
│   ├── etapy-pokupki.astro + _etapy-pokupki/
│   ├── contacts.astro + _contacts/
│   ├── politika.astro, cookies.astro, thanks.astro, 404.astro
│   ├── video.astro, bonus.astro, prezentaciya.astro
│   └── api/contact.ts
└── styles/    global.css
```

---

## 7. НАВИГАЦИЯ

```typescript
// src/lib/navigation/navData.ts — ЕДИНСТВЕННЫЙ источник
export const NAV_ITEMS = [
  { number:'01', label:'Краснодар',     href:'/voennaya-ipoteka-krasnodar/', group:'object', icon:'building-2' },
  { number:'02', label:'Крым',          href:'/voennaya-ipoteka-krym/',      group:'object', icon:'map-pinned', badge:'new' },
  { number:'03', label:'Удалённо',      href:'/distancionnaya-pokupka/',     group:'route',  icon:'video' },
  { number:'04', label:'Этапы покупки', href:'/etapy-pokupki/',              group:'route',  icon:'route' },
  { number:'05', label:'Контакты',      href:'/contacts/',                   group:'contact',icon:'phone' },
];
export const HEADER_NAV = NAV_ITEMS;
export const DOCK_NAV   = NAV_ITEMS.filter(i => !i.href.includes('distancionnaya'));
```

---

## 8. ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

```bash
# .env (НЕ коммитить)
TELEGRAM_BOT_TOKEN=8756363959:AAGdDHVe1jb7JwqUWUyHpO7W5xBnnvu-SWU
TELEGRAM_CHAT_ID=-5270072570
PUBLIC_YM_COUNTER_ID=
```

---

## 9. БРИФЫ — ПРАВИЛО

Тексты из PAGE_*.md копировать **дословно**. Не переформулировать, не сокращать.

---

## 10. СТАНДАРТНАЯ СТРАНИЦА

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Hero from './_[slug]/01-Hero.astro';
// остальные блоки...
---
<PageLayout title="…" description="…" canonical="…" ogImage="…">
  <script slot="head" type="application/ld+json">{ BreadcrumbList + … }</script>
  <Hero />
  <!-- блоки по порядку из PAGE_*.md -->
</PageLayout>
```

---

## 11. ПАТТЕРНЫ СЕКЦИЙ

```astro
<!-- Тёмная секция -->
<section class="vn-section vn-section--dark" id="…">
  <div class="vn-deco-grid vn-deco-grid--dark" aria-hidden="true"></div>
  <span class="vn-section-marker" aria-hidden="true">07</span>
  <div class="vn-container"><div class="vn-grid-12">…</div></div>
</section>

<!-- FAQ (SEO-friendly, без JS) -->
<details class="vn-faq-item">
  <summary class="vn-faq-question">Вопрос?</summary>
  <div class="vn-faq-answer"><p>Ответ виден в DOM.</p></div>
</details>

<!-- Фото-заглушка -->
<PhotoPlaceholder type="building" height="280px" filename="zhk-1.jpg" />
```

---

## 12. JSON-LD

| Страница | Схемы |
|---|---|
| `/` | Organization + Person + WebSite + Service + FAQPage + BreadcrumbList |
| Коммерческие | Service + FAQPage + BreadcrumbList |
| `/contacts/` | Organization + LocalBusiness(×2) + FAQPage + BreadcrumbList |
| Юридические | BreadcrumbList |

**BreadcrumbList — на ВСЕХ страницах.**

---

## 13. ФОТОГРАФИИ

| Файл | Статус | Где |
|---|---|---|
| `/images/mikhail-hero.jpg` | ✅ Готово | Hero главной + /krasnodar/ |
| `/images/mikhail-form.jpg` | ✅ Готово | RequestModal аватар |
| `/images/chirkov-andrey.jpg` | ✅ Готово | /prezentaciya/ |
| `/images/zhk-1..4.jpg` | ⏳ Позже | /krasnodar/ блок 06 |
| `/images/office-krd.jpg` | ⏳ Позже | /contacts/ блок 04 |

---

## 14. ФОРМА И API

```html
<a data-modal-open data-modal-title="Разобрать цель" class="vn-btn-primary">
  Записаться на разбор
</a>
```

`POST /api/contact` → Telegram · honeypot + timing + rate limit (3/10 мин)

---

## 15. COOKIE

`vn_cookie_consent` (`accepted` | `rejected`) · Метрика только после `accepted`

---

## 16. ROBOTS.TXT

```
User-agent: Yandex / OAI-SearchBot → Allow: /
User-agent: GPTBot → Disallow: /
User-agent: * → Disallow: /thanks/ /404/ /video/ /bonus/ /prezentaciya/
Sitemap: https://[DOMAIN]/sitemap-index.xml
```

---

## 17. КАЧЕСТВО — ПЕРЕД КОММИТОМ

```
✅ H1 один на странице · Title 50-60 · Description 140-160
✅ Alt на всех img · JSON-LD валиден
✅ 375px: без overflow и висячих строк · LCP < 2.5 сек
✅ pnpm build — 0 ошибок · Нет [PLACEHOLDER] в продакшн
```

---

## 18. ПЛЕЙСХОЛДЕРЫ

```
✅ PRIMARY_PHONE  = +7 (938) 407 44 57
✅ TELEGRAM       = @Mikhail_khryapin
⏳ MAX_LINK, VK_GROUP, PRIMARY_EMAIL, DOMAIN, ГОД
⏳ YANDEX_BUSINESS_URL, PUBLIC_YM_COUNTER_ID
⏳ VK_VIDEO_EMBED_URL, VK_VIDEO_IPOTEKA_URL, VK_VIDEO_NOVOSTROYKI_URL
⏳ TELEGRAM_CHANNEL
```

---

## 19. СПЕЦИАЛЬНЫЕ СТРАНИЦЫ

**`/prezentaciya/`** — гибридный дизайн. Читать PAGE_PREZENTACIYA.md раздел 2a + BRANDBOOK.md.
```
НЕ использует клиентский Header/Footer.
Блоки 01-06: акцент #2563EB · Блоки 07-13: акцент #9E0707 (АМС)
Пароль: 2026. noindex, nofollow.
```

**`/video/` и `/bonus/`** — noindex. Mini Header без клиентского меню.

---

## 20. ЖУРНАЛ СБОРКИ

> Обновляй в конце каждого этапа.

| # | Этап | Дата | Статус | Что сделано |
|---|------|------|--------|-------------|
| 1 | Инициализация | 2026-05-13 | ✅ | Scaffold, astro.config, global.css, .env, robots.txt |
| 2 | Layouts | 2026-05-13 | ✅ | BaseLayout, PageLayout |
| 3 | Навигация + Footer | 2026-05-13 | ✅ | Header (3 состояния), Overlay, MobileBottomCTA, Footer (5 зон) |
| 4 | Lib / утилиты | 2026-05-13 | ✅ | navData.ts, constants.ts, navigationState.ts, logo SVG |
| 5 | Stub-страницы | 2026-05-13 | ✅ | 10 страниц-заглушек |
| 6 | API endpoint | 2026-05-13 | ✅ | /api/contact.ts → Telegram + защита |
| 7 | Деплой Preview | 2026-05-13 | ✅ | Vercel Preview активен |
| 8 | Главная / | 2026-05-13 | ✅ | 12 блоков по PAGE_HOME.md |
| 9 | /voennaya-ipoteka-krasnodar/ | 2026-05-13 | ✅ | 9 блоков по PAGE_NOVOSTROYKI.md |
| 10 | Рефакторинг монолитов | — | ⏳ | Разбить все страницы на компоненты по _[slug]/ |
| 11 | RequestModal + CookieBanner | — | ⏳ | React islands, Telegram тест |
| 12 | /voennaya-ipoteka-krym/ | — | ⏳ | PAGE_VOENNAYA_IPOTEKA_KRYM.md |
| 13 | /distancionnaya-pokupka/ | — | ⏳ | PAGE_DISTANCIONNAYA_POKUPKA.md |
| 14 | /etapy-pokupki/ | — | ⏳ | PAGE_ETAPY_POKUPKI.md |
| 15 | /contacts/ | — | ⏳ | PAGE_CONTACTS.md |
| 16 | politika + cookies + 404 + thanks | — | ⏳ | — |
| 17 | Воронка: /video/ + /bonus/ | — | ⏳ | QuizForm, bonus-content.ts |
| 18 | /prezentaciya/ | — | ⏳ | Гибридный дизайн АМС |
| 19 | Финальный QA | — | ⏳ | BUILD_PHASE_3_FINAL.md |
| 20 | Продакшн деплой | — | ⏳ | vercel --prod |

**Текущий фокус:** Рефакторинг монолитов (этап 10) → RequestModal (этап 11).

---

**Конец CLAUDE.md**
*Читается автоматически при старте Claude Code сессии.*
