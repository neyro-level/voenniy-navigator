# AGENTS.md

**Проект:** Военный навигатор — Михаил Хряпин
**Стек:** Astro + Tailwind CSS v4 + TypeScript strict + React islands + Vercel
**Этот файл читается автоматически при старте сессии любым AI-агентом:**
OpenAI Codex · ChatGPT Agents · Kimi 2.6 · Gemini · Cursor · Windsurf · Continue · Copilot и др.

---

## 0. РАЗРЕШЕНИЯ — АВТОНОМНЫЙ РЕЖИМ

**Владелец проекта Андрей Чирков выдал полные разрешения на все действия в этом репозитории.**

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
✗ git push в remote (только если попросят)
✗ vercel --prod (продакшн деплой — только по явной команде)
✗ Удалять _project-docs/ документы
✗ Менять TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
```

---

## 1. ПЕРВОЕ ДЕЙСТВИЕ В КАЖДОЙ СЕССИИ

Перед написанием любого кода прочитать в этом порядке:

```
1. ASTRO_RULES_CORE.md       ← ЧИТАТЬ ОБЯЗАТЕЛЬНО (критичные правила, ~200 строк)
2. SITE_ARCHITECTURE.md      ← карта сайта, URL, структура файлов
3. DESIGN_SYSTEM.md          ← цвета, типографика, spacing, токены
4. PAGE_*.md нужной страницы ← блоки, тексты, JSON-LD
```

ASTRO_RULES.md = полный справочник, читать по необходимости.

**Инструкция по сборке:**
```
Фаза 1 (фундамент): BUILD_PHASE_1_FOUNDATION.md
Фаза 2 (страницы):  BUILD_PHASE_2_PAGES.md
Фаза 3 (финал):     BUILD_PHASE_3_FINAL.md
```

Никогда не начинай строить компонент или страницу без прочтения соответствующего бриф-файла.
Никогда не начинай следующий этап из журнала без явного запроса от пользователя.

---

## 2. ПРОЕКТ В ОДНОЙ ФРАЗЕ

Персональный сайт эксперта по военной ипотеке в Краснодаре.
Помогает военнослужащим выбрать новостройку под задачу и пройти маршрут покупки.

---

## 3. ТЕХНИЧЕСКИЙ СТЕК

```
Astro (latest stable)  — фреймворк, SSG, роутинг
Tailwind CSS v4        — стилизация через @theme токены
TypeScript strict      — типизация всего кода
React islands          — ТОЛЬКО для интерактивных компонентов (модалка, баннер)
Lucide React           — иконки, stroke 1.5px, импортировать точечно
Vercel                 — деплой, edge functions для API
pnpm                   — пакетный менеджер
```

---

## 4. ПРАВИЛА КОДА — НИКОГДА НЕ НАРУШАТЬ

```
✗  Не использовать jQuery, Bootstrap, Vue, Angular, styled-components
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
    Обязательно на КАЖДОЙ странице при сборке первого (hero) блока.

✅  Namespace для всех классов: vn-{component}-{element}
✅  React только с client:load или client:visible
✅  Все анимации CSS, без GSAP/Framer
✅  prefers-reduced-motion на каждой анимации
✅  Alt у каждого изображения
✅  Aria-labels на icon-only кнопках
✅  loading="lazy" на всех img/iframe кроме Hero (первый экран)
✅  loading="eager" на Hero-фото (LCP)
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

## 4a. ИЗОЛЯЦИЯ БЛОКОВ — ЗАКОН ДЛЯ ВСЕЙ ВЁРСТКИ

**Каждый блок (секция) страницы — самостоятельная единица. Изменение одного блока не должно влиять на другие.**

```
✅  У каждого блока свой CSS-namespace: vn-{page}-{block}__element
    Пример: vn-krd-hero__title, vn-dist-fear__card, vn-home-faq__item
✅  Стили блока живут только внутри него (<style> в файле)
✅  Блок не зависит от порядка других блоков на странице
✅  Блок можно удалить, переместить или заменить — остальные не сломаются
✅  Общие утилиты (vn-container, vn-grid-12, vn-btn-primary и т.д.) — только из global.css
✗  Нельзя: .vn-block-a + .vn-block-b { ... }
✗  Нельзя: :nth-child для межблочной логики
```

**Правило именования блоков:**
```
vn-{page}-{block}__element   — основной паттерн
vn-{page}-{block}--modifier  — модификатор состояния

Примеры:
  vn-home-hero__h1           ← блок hero на главной
  vn-krd-scenarios__card     ← карточка сценария на странице Краснодар
  vn-dist-fear__card--alert  ← карточка-тревога на дистанционной
```

---

## 4b. 12-КОЛОНОЧНАЯ СЕТКА — ЗАКОН ДЛЯ ВСЕХ СЕКЦИЙ

**Каждая секция на desktop верстается ТОЛЬКО через `.vn-grid-12` с явными `grid-column` позициями.**

### Базовые утилиты (src/styles/global.css)

```css
.vn-container {
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 48px;   /* 24px на мобиле */
}

.vn-grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 32px;
}

@media (max-width: 1023px) {
  .vn-grid-12 > * { grid-column: 1 / -1; }
}

@media (max-width: 640px) {
  .vn-grid-12 { column-gap: 8px; } /* чтобы 12-col grid не давал horizontal overflow на 375px */
}
```

### Обязательная структура каждой секции

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
✅  На ≤1023px все дети схлопываются в grid-column: 1 / -1
```

### Типовые паттерны компоновки

| Паттерн | Левый | Правый |
|---|---|---|
| 6/6 равные | `1/7` | `7/13` |
| 7/5 текст+фото | `1/8` | `8/13` |
| 5/7 фото+текст | `1/6` | `6/13` |
| 8/4 широкий+aside | `1/9` | `9/13` |
| 3 карточки | `1/5`, `5/9`, `9/13` | — |
| 4 карточки | `1/4`, `4/7`, `7/10`, `10/13` | — |
| Центр 8 | `3/11` | — |

---

## 4c. ГЛОБАЛЬНЫЕ СТИЛИ — ЧТО УЖЕ ЕСТЬ В global.css, НЕ ПЕРЕОПРЕДЕЛЯТЬ

| Класс | Что делает |
|---|---|
| `.vn-btn-primary` | Синяя CTA кнопка. Hover: белый фон + рамка + translateY(-1px) + glow |
| `.vn-btn-ghost` | Прозрачная с рамкой |
| `.vn-label-mono` | Uppercase eyebrow с синей чертой слева |
| `.vn-tag` | Маленький badge |
| `.vn-card` | Белая карточка: padding 32px, radius 12px, тень, hover-тень |
| `.vn-section` | Секция: position relative, padding 120px vertical, bg-primary |
| `.vn-section--secondary` | bg-secondary |
| `.vn-section--dark` | bg-dark |
| `.vn-deco-grid` | Декоративная сетка светлая |
| `.vn-deco-grid--dark` | Декоративная сетка тёмная |
| `.vn-section-marker` | Устаревший класс: не использовать в новых и пересобираемых блоках |
| `.vn-faq-item/question/answer` | FAQ компоненты |
| `.vn-container` | max-width 1280px, padding 48px |
| `.vn-grid-12` | 12-col grid, gap 32px |

Кастомные размеры кнопок — только override padding/font-size, не цвета:
```css
.vn-header__cta { font-size: 14px; padding: 10px 20px; }
```

---

## 4d. СТАНДАРТ СБОРКИ КАЖДОЙ НОВОЙ СТРАНИЦЫ — ДИЗАЙН, ТИПОГРАФИКА, QA

**Главная страница `/` — визуальный и композиционный эталон проекта.**
Если бриф страницы предлагает другую компоновку, сначала сохранить смысл и тексты из `PAGE_*.md`, но композицию адаптировать к уже собранному банковскому стилю главной: строгая 12-колоночная сетка, холодные фоны, документные списки, тонкие разделители, номера, таблицы, muted-тексты, тёмные секции как акценты. Не делать страницу похожей на другой сайт.

### Перед сборкой страницы

```
✅  Определить источник правды: SITE_ARCHITECTURE.md + DESIGN_SYSTEM.md + нужный PAGE_*.md
✅  Изучить уже собранную главную: _home/01-12 как эталон дизайна и ритма
✅  Составить Pre-flight: какие блоки создаются, какие файлы меняются, какие схемы JSON-LD нужны
✅  Не начинать следующий этап журнала без явного запроса пользователя
```

### Независимость блоков

```
✅  Каждый блок = отдельный файл src/pages/_[slug]/NN-Name.astro
✅  Route-файл страницы = только импорты, pageData/schema и порядок блоков
✅  У каждого блока свой namespace: vn-{page}-{block}__element
✅  Внутри блока свой <section>, свой <style>, своя адаптация
✅  Блок можно удалить, заменить или переставить без поломки соседних
✅  Общие размеры/цвета/кнопки/лейблы брать из global.css
✗  Не использовать межблочные селекторы, зависимости от порядка секций, глобальные page-хак стили
```

### Типографика — только проектная шкала

Использовать размеры из `src/styles/global.css`, а не значения из брифа, если они конфликтуют с фактической системой главной:

| Роль | Токен |
|---|---|
| Hero H1 | `var(--fs-display)` |
| Большой заголовок секции | `var(--fs-h1)` или чаще `var(--fs-h2)` как на главной |
| H2 секции | `var(--fs-h2)` |
| H3 / заголовок карточки или строки | `var(--fs-h3)` либо локально 15–18px для плотных банковских списков |
| Lead / подзаголовок | `var(--fs-lead)` |
| Основной текст | `var(--fs-body)` |
| Вторичный текст | `var(--fs-body-sm)` |
| Eyebrow / label | `var(--fs-label)` + `.vn-label-mono` |
| Caption / номер | `var(--fs-caption)` |

### Типографический контракт и исключения

Типографика проекта делится на два режима:
- **Смысловой текст:** заголовки, подзаголовки, карточки, списки, FAQ, CTA, юридический текст. Всегда использовать токены `--fs-*` или глобальные классы `.vn-type-*`.
- **Декоративный текст:** большие цифры, обложки каталогов, 404, фоновая типографика, логотипные/визуальные маркеры. Можно использовать локальный размер, если он не является обычным читаемым текстом страницы.

Глобальные классы из `global.css`:
- `.vn-type-display` — Hero H1 главной или промо-лендинга.
- `.vn-type-h1` — H1 внутренней страницы.
- `.vn-type-h2` — заголовок секции.
- `.vn-type-h3` — заголовок карточки, FAQ-вопрос, строка-акцент.
- `.vn-type-lead` — лид/подзаголовок.
- `.vn-type-body` — основной текст.
- `.vn-type-small` — вторичный текст.
- `.vn-type-label` / `.vn-type-caption` — labels, captions, мелкие подписи.

Если нужен локальный `font-size`, обязательно определить тип исключения:
```css
/* type-exception: decorative/catalog-cover-number */
font-size: var(--fs-deco-lg);
```

Допустимые исключения:
- декоративные цифры, если они не заменяют обычный заголовок;
- крупный номер/метрика через `var(--fs-stat)`;
- декоративная фоновая типографика через `var(--fs-deco-md)` или `var(--fs-deco-lg)`;
- иконки/эмодзи-маркеры через `var(--fs-icon)`;
- обложка PDF/каталога через `var(--fs-deco-lg)`;
- компактный UI в навигации, бейджах, виджетах через `var(--fs-ui)`, `var(--fs-label)` или `var(--fs-caption)`.

Недопустимые исключения:
- H1/H2/H3 больше проектной шкалы без отдельного решения;
- `font-size: 18px+` в обычном тексте карточки;
- новые размеры `42px`, `48px`, `56px`, `64px` для смысловых заголовков;
- механическая замена декоративных размеров без проверки роли элемента.

```
✅  Вес заголовков: 600/650, не 700
✅  line-height заголовков: 1.1–1.2
✅  line-height текста: 1.55–1.75
✅  h1/h2/h3: text-wrap: balance
✅  p/li/blockquote: text-wrap: pretty
✅  Числа, телефоны, годы, короткие связки — через &nbsp;
✗  Не вводить новые размеры типа 56px/64px, если они не нужны для совместимости с главной
```

### Кнопки и интерактив

```
✅  CTA-кнопки: только `.vn-btn-primary`
✅  Вторичные кнопки: только `.vn-btn-ghost` или текстовые ссылки в стиле главной
✅  Локально можно менять только height, padding, width, font-size
✗  Не переопределять цвета, hover, radius и border глобальных кнопок
✅  Все CTA на форму: href="/contacts/#request" + data-modal-open + data-modal-title
✅  Внешние ссылки: target="_blank" rel="noopener noreferrer"
```

### Композиционный язык главной

```
✅  Предпочитать банковские паттерны: rows, tables, split 5/7 или 7/5, document cards, чек-листы, numbered lists
✅  Карточки использовать только когда они действительно нужны; не превращать каждый блок в сетку карточек
✅  Тёмные секции использовать для смыслового напряжения или финального CTA
✅  Декоративная сетка — только там, где она уже уместна по дизайн-системе: Hero / тёмный финал / особый акцент
✅  Акцентный синий — для CTA, номеров, тонких линий, статусов; не заливать им большие площади без причины
✗  Не делать маркетинговые hero-карточки, тёплые палитры, большие декоративные иллюстрации, случайные gradients/orbs
✗  Не использовать большие фоновые номера секций вроде 01/02/03 и класс `.vn-section-marker` в новых и пересобираемых блоках
```

### SEO и структурные данные

```
✅  Один H1 на странице
✅  Title 50-60 символов, Description 140-160
✅  Canonical и OG image через PageLayout/BaseLayout
✅  BreadcrumbList на каждой странице
✅  FAQPage если есть FAQ-блок
✅  Service для смысловых коммерческих/информационных страниц
✅  FAQ в HTML через details/summary или доступный accordion, не JS-only
✅  Короткий ответ после Hero — HTML-текст, автономный AI-ready фрагмент
```

### Мобильная адаптация и доступность

```
✅  Проверять 375px / 768px / 1280px / 1440px
✅  На ≤1023px все grid-дети уходят в одну колонку или в явно заданную безопасную 2-колоночную мобильную сетку
✅  На 375px нет горизонтального скролла, наложений текста и обрезанных кнопок
✅  Кнопки и кликабельные элементы ≥44px
✅  Alt у всех img, aria-label у icon-only
✅  loading="eager" только для Hero/LCP, остальное lazy
✅  Каждая анимация имеет prefers-reduced-motion
```

### Финальный чек каждой страницы

```
□  Страница собрана компонентно: route-файл тонкий, блоки независимые
□  Визуально продолжает главную, а не отдельный дизайн
□  Все размеры шрифтов взяты из проектных токенов или повторяют плотные паттерны главной
□  Локальные `font-size` выше 18px проверены: это либо токен, либо подписанное `type-exception`
□  Глобальные кнопки не переопределены по цветам/hover/radius
□  SEO: H1, title, description, canonical, BreadcrumbList, FAQPage/Service где нужно
□  Mobile 375px: нет overflow, текст читается, кнопки помещаются
□  Desktop 1280/1440: все секции в 12-колоночной сетке
□  Нет [PLACEHOLDER] в видимом тексте; если данных нет — TODO-комментарий
□  pnpm build проходит без ошибок
```

---

## 5. ЦВЕТОВЫЕ ТОКЕНЫ (src/styles/global.css → @theme)

```css
/* Фоны */
--color-bg-primary:        #F1F3F5;
--color-bg-secondary:      #E9ECEF;
--color-bg-surface:        #FFFFFF;
--color-bg-surface-low:    #FAFBFC;
--color-bg-dark:           #0F1419;
--color-bg-dark-elev:      #1A2028;

/* Текст */
--color-text-primary:      #0F1419;
--color-text-secondary:    #4A5568;
--color-text-tertiary:     #8B95A3;
--color-text-ondark:       #F1F3F5;
--color-text-ondark-mute:  rgba(241, 243, 245, 0.7);

/* Акценты */
--color-accent-primary:    #0F2547;
--color-accent-cta:        #2563EB;
--color-accent-hover:      #1D4ED8;
--color-accent-soft:       rgba(15, 37, 71, 0.08);
--color-accent-cta-soft:   rgba(37, 99, 235, 0.08);

/* Границы и декор */
--color-border:            rgba(15, 37, 71, 0.12);
--color-border-ondark:     rgba(241, 243, 245, 0.12);
--color-deco-grid:         rgba(15, 37, 71, 0.04);
--color-deco-grid-dark:    rgba(255, 255, 255, 0.03);
--color-deco-marker:       rgba(15, 37, 71, 0.05);

/* Радиусы */
--radius-sm:   6px;
--radius-md:   10px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-full: 999px;

/* Тени */
--shadow-xl: 0 20px 60px rgba(15, 20, 25, 0.16);
```

---

## 5b. ТИПОГРАФИКА (src/styles/global.css → :root)

```css
/* Заголовки: clamp(min, fluid, max) — авторесайз без media queries */
--fs-display: clamp(36px, 4vw, 52px);
--fs-h1:      clamp(34px, 3.4vw, 46px);
--fs-h2:      clamp(28px, 2.8vw, 38px);
--fs-h3:      clamp(18px, 1.7vw, 22px);

/* Текст: фиксированные */
--fs-lead:    16px;
--fs-body:    15px;
--fs-body-sm: 14px;
--fs-label:   12px;
--fs-caption: 11px;

/* Semantic aliases and exception tokens */
--fs-button:     var(--fs-body);
--fs-card-title: var(--fs-h3);
--fs-ui:         var(--fs-body-sm);
--fs-stat:       clamp(28px, 3vw, 40px);
--fs-icon:       20px;
--fs-deco-md:    clamp(56px, 7vw, 80px);
--fs-deco-lg:    clamp(72px, 10vw, 148px);
```

**Запрет висячих строк:**
```css
h1, h2, h3, h4 { text-wrap: balance; }
p, li, blockquote { text-wrap: pretty; }
```

**Неразрывные пробелы:**
```
65&nbsp;сделок  ·  +7&nbsp;(938)...  ·  с&nbsp;2016&nbsp;года
```

---

## 6. СТРУКТУРА ФАЙЛОВ

```
src/
├── layouts/
│   ├── BaseLayout.astro       ← head + SEO + OG + JSON-LD + шрифты
│   └── PageLayout.astro       ← Header + main slot + Footer + modals
│
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── RouteMapOverlay.astro
│   │   ├── MobileBottomCTA.astro
│   │   └── Footer.astro
│   └── ui/
│       ├── RequestModal.tsx        ← client:load (React)
│       ├── CookieBanner.tsx        ← client:load (React)
│       └── PhotoPlaceholder.astro
│
├── lib/
│   ├── navigation/
│   │   ├── navData.ts         ← ЕДИНСТВЕННЫЙ источник nav-ссылок
│   │   └── navigationState.ts
│   ├── constants.ts           ← офисы, контакты, реквизиты
│   ├── seo.ts                 ← JSON-LD helpers
│   └── utils.ts
│
├── pages/
│   ├── index.astro
│   ├── _home/
│   │   ├── 00-HomeSharedStyles.astro
│   │   ├── 01-Hero.astro ... 12-FinalCTA.astro
│   ├── voennaya-ipoteka-krasnodar.astro
│   ├── _voennaya-ipoteka-krasnodar/
│   │   ├── 00-KrasnodarSharedStyles.astro
│   │   ├── 01-Hero.astro ... 09-FinalCTA.astro
│   │   └── pageData.ts
│   ├── voennaya-ipoteka-krym.astro        ← stub
│   ├── distancionnaya-pokupka.astro       ← stub
│   ├── etapy-pokupki.astro                ← stub
│   ├── contacts.astro                     ← stub
│   ├── politika.astro
│   ├── cookies.astro
│   ├── thanks.astro
│   ├── 404.astro
│   ├── video.astro                        ← noindex, нет в git
│   ├── bonus.astro                        ← noindex, нет в git
│   ├── prezentaciya.astro                 ← noindex, гибридный дизайн
│   └── api/contact.ts                     ← POST → Telegram
│
└── styles/
    ├── global.css             ← @import tailwindcss + @theme токены
    ├── modal.css              ← стили RequestModal
    └── cookie-banner.css      ← стили CookieBanner
```

---

## 7. НАВИГАЦИЯ — navData.ts

Все ссылки меню берутся **только** отсюда. Не хардкодить href нигде кроме этого файла.

```typescript
// src/lib/navigation/navData.ts
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
PUBLIC_YM_COUNTER_ID=         # добавить после регистрации в Яндекс.Метрике
```

Переменные с префиксом `PUBLIC_` доступны в клиентском коде.

---

## 9. БРИФЫ — ПРАВИЛО

Тексты из PAGE_*.md копировать **дословно**. Не переформулировать, не сокращать.

---

## 10. СТАНДАРТНАЯ СТРУКТУРА СТРАНИЦЫ

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import Hero from './_[slug]/01-Hero.astro';
// остальные блоки...
---
<PageLayout
  title="Title (50-60 символов)"
  description="Description (140-160 символов)"
  canonical={`${SITE.url}/[slug]/`}
  ogImage={`${SITE.url}/og/[slug].jpg`}
  schema={schema}
>
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

## 12. JSON-LD НА КАЖДОЙ СТРАНИЦЕ

| Страница | Схемы |
|---|---|
| `/` | Organization + Person + WebSite + Service + FAQPage + BreadcrumbList |
| Коммерческие | Service + FAQPage + BreadcrumbList |
| `/contacts/` | Organization + LocalBusiness(×2) + FAQPage + BreadcrumbList |
| Юридические | BreadcrumbList |

**BreadcrumbList — на ВСЕХ страницах без исключения.**

---

## 13. ФОТОГРАФИИ

| Файл | Статус | Где |
|---|---|---|
| `/images/mikhail-hero.jpg` | ✅ Готово | Hero главной + /krasnodar/ |
| `/images/mikhail-form.jpg` | ✅ Готово | RequestModal аватар |
| `/images/chirkov-andrey.jpg` | ✅ Готово | /prezentaciya/ |
| `/images/zhk-1..4.jpg` | ⏳ Позже | /krasnodar/ блок 06 |
| `/images/office-krd.jpg` | ⏳ Позже | /contacts/ блок 04 |

Hero-фото: `loading="eager"` (LCP). Остальные: `loading="lazy"`.

---

## 14. ФОРМА ЗАЯВКИ

```html
<a data-modal-open data-modal-title="Разобрать цель" class="vn-btn-primary">
  Записаться на разбор
</a>
```

`POST /api/contact` → Telegram · honeypot + timing + rate limit (3/10 мин)

---

## 15. COOKIE BANNER

```astro
<!-- В PageLayout.astro (уже подключено) -->
<CookieBanner client:load />
```

`localStorage` key: `vn_cookie_consent` (`accepted` | `rejected`)
Яндекс.Метрика запускается **только** после `accepted`.

---

## 16. ROBOTS.TXT

```
User-agent: Yandex
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: *
Disallow: /thanks/
Disallow: /404/
Disallow: /video/
Disallow: /bonus/
Disallow: /prezentaciya/

Sitemap: https://[DOMAIN]/sitemap-index.xml
```

---

## 17. КАЧЕСТВО — ПЕРЕД КАЖДЫМ КОММИТОМ

```
✅ Один H1 на странице
✅ Title 50-60 символов, Description 140-160
✅ Alt на всех img
✅ JSON-LD валиден (нет незакрытых скобок)
✅ Нет console.error в браузере
✅ Мобильная версия не ломается на 375px
✅ LCP < 2.5 сек
✅ Нет горизонтального скролла
✅ Все CTA ведут в нужные места
✅ [PLACEHOLDER] и [TODO] не попали в продакшн
✅ pnpm build — 0 ошибок
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

Если встречаешь незаполненные плейсхолдеры — оставляй как есть и добавляй TODO-комментарий. Не выдумывай значения.

---

## 19. СПЕЦИАЛЬНЫЕ СТРАНИЦЫ

**`/prezentaciya/`** — гибридный дизайн АМС. Читать PAGE_PREZENTACIYA.md + BRANDBOOK.md.
```
НЕ использует клиентский Header/Footer.
Блоки 01-06: акцент #2563EB
Блоки 07-13: акцент #9E0707 (АМС)
Пароль: 2026. noindex, nofollow.
```

**`/video/` и `/bonus/`** — noindex. Mini Header без клиентского меню.

---

## 20. ЖУРНАЛ СБОРКИ

> Обновляй в конце каждого этапа. Никогда не начинай следующий ⏳-этап без явного запроса от пользователя.

| # | Этап | Дата | Статус | Что сделано |
|---|------|------|--------|-------------|
| 1 | Инициализация | 2026-05-13 | ✅ | Scaffold, astro.config, global.css, .env, robots.txt |
| 2 | Layouts | 2026-05-13 | ✅ | BaseLayout, PageLayout |
| 3 | Навигация + Footer | 2026-05-13 | ✅ | Header (3 состояния), Overlay, MobileBottomCTA, Footer (5 зон) |
| 4 | Lib / утилиты | 2026-05-13 | ✅ | navData.ts, constants.ts, navigationState.ts, logo SVG |
| 5 | Stub-страницы | 2026-05-13 | ✅ | 10 страниц-заглушек |
| 6 | API endpoint | 2026-05-13 | ✅ | /api/contact.ts → Telegram + защита |
| 7 | Деплой Preview | 2026-05-13 | ✅ | Vercel Preview активен |
| 8 | Главная / | 2026-05-13 | ✅ | 12 блоков (_home/01-12) по PAGE_HOME.md |
| 9 | /voennaya-ipoteka-krasnodar/ | 2026-05-25 | ⏳ | Главный бриф обновлён: собирать коммерческую страницу по pages/PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md (оффер: подборка 12 проверенных ЖК). Старый PAGE_NOVOSTROYKI.md не использовать как источник правды для этой страницы |
| 10 | Рефакторинг монолитов | 2026-05-13 | ✅ | Обе страницы разбиты на компоненты по _[slug]/ |
| 11 | RequestModal + CookieBanner | 2026-05-13 | ✅ | React islands подключены, modal.css + cookie-banner.css |
| 12 | /voennaya-ipoteka-krym/ | 2026-05-14 | ✅ | 10 блоков (_voennaya-ipoteka-krym/01-10) по PAGE_VOENNAYA_IPOTEKA_KRYM.md |
| 13 | /distancionnaya-pokupka/ | 2026-05-13 | ✅ | 12 блоков по PAGE_DISTANCIONNAYA_POKUPKA.md |
| 14 | /etapy-pokupki/ | 2026-05-14 | ✅ | 10 блоков (_etapy-pokupki/01-10) по PAGE_ETAPY_POKUPKI.md |
| 15 | /contacts/ | 2026-05-13 | ✅ | 9 блоков, MAP-OVERLAY, LocalBusiness×2, FAQPage, legal block |
| 16 | politika + cookies + 404 + thanks | 2026-05-13 | ✅ | Юридические и утилитарные страницы |
| 17 | Воронка: /video/ + /bonus/ | — | ⏳ | QuizForm, bonus-content.ts |
| 18 | /prezentaciya/ | — | ⏳ | Гибридный дизайн АМС |
| 19 | Финальный QA | — | ⏳ | BUILD_PHASE_3_FINAL.md |
| 20 | Продакшн деплой | — | ⏳ | vercel --prod |

**Текущий фокус:** пересборка `/voennaya-ipoteka-krasnodar/` по новому главному брифу `pages/PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md`.

---

**Конец AGENTS.md**
*Синхронизируется с CLAUDE.md при каждом изменении архитектуры или стека.*
*Читается автоматически любым AI-агентом при старте сессии.*
