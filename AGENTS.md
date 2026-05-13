# AGENTS.md

**Проект:** Военный навигатор — Михаил Хряпин
**Стек:** Astro + Tailwind CSS v4 + TypeScript strict + React islands + Vercel
**Этот файл читается OpenAI Codex / ChatGPT Agents автоматически при старте сессии.**

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

Перед написанием любого кода прочитай:

```
1. SITE_ARCHITECTURE.md        — карта сайта, URL, переменные, структура файлов
2. DESIGN_SYSTEM.md            — цвета, типографика, spacing, токены
3. PAGE_*.md нужной страницы   — блоки, композиции, тексты, JSON-LD
4. ASTRO_RULES.md              — правила платформы (обязательно)
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
✗  Не использовать position:fixed в React-компонентах (artifacts bug)
✗  Не дублировать навигационные данные — только navData.ts
✗  Не писать inline стили с hex-цветами в Astro-шаблонах
✗  Не использовать @media queries в Tailwind — только CSS custom media
```

```
✅  Namespace для всех классов: vn-{component}-{element}
✅  React только с client:load или client:visible
✅  Все анимации CSS, без GSAP/Framer
✅  prefers-reduced-motion на каждой анимации
✅  Alt у каждого изображения
✅  Aria-labels на icon-only кнопках
✅  loading="lazy" на всех img/iframe кроме Hero (первый экран)
✅  loading="eager" на Hero-фото (LCP)
✅  Hero-секции: padding-top: 160px (desktop) / 100px (mobile)
    Хедер position:fixed перекрывает контент без этого отступа.
    160px = 84px высота хедера + 76px визуальный отступ.
    Обязательно на КАЖДОЙ странице при сборке первого (hero) блока.
```

---

## 5. ЦВЕТОВЫЕ ТОКЕНЫ (из DESIGN_SYSTEM.md)

```css
/* В src/styles/global.css через @theme */
--color-bg-primary:     #F1F3F5;
--color-bg-secondary:   #E9ECEF;
--color-bg-surface:     #FFFFFF;
--color-bg-dark:        #0F1419;
--color-bg-dark-elev:   #1A2028;

--color-text-primary:   #0F1419;
--color-text-secondary: #4A5568;
--color-text-tertiary:  #8B95A3;
--color-text-ondark:    #F1F3F5;
--color-text-ondark-mute: rgba(241,243,245,0.7);

--color-accent-primary: #0F2547;
--color-accent-cta:     #2563EB;
--color-accent-hover:   #1D4ED8;
--color-accent-soft:    rgba(15,37,71,0.08);
--color-accent-cta-soft: rgba(37,99,235,0.08);

--color-border:         rgba(15,37,71,0.12);
--color-border-ondark:  rgba(241,243,245,0.12);
--color-deco-grid:      rgba(15,37,71,0.04);
--color-deco-grid-dark: rgba(255,255,255,0.03);
--color-deco-marker:    rgba(15,37,71,0.05);
```

---

## 4a. ИЗОЛЯЦИЯ БЛОКОВ — ЗАКОН ДЛЯ ВСЕЙ ВЁРСТКИ

**Каждый блок (секция) страницы — самостоятельная единица. Изменение одного блока не должно влиять на другие.**

```
✅  У каждого блока свой CSS-namespace: vn-{page}-{block}-{element}
    Пример: vn-krd-hero__title, vn-dist-fear__card, vn-home-faq__item
✅  Стили блока живут только внутри него (в <style> секции файла или отдельном css-блоке)
✅  Блок не зависит от порядка других блоков на странице
✅  Блок можно удалить, переместить или заменить — остальные не сломаются
✅  Общие утилиты (vn-container, vn-grid-12, vn-btn-primary и т.д.) — только из global.css
✅  Никаких общих классов между блоками, кроме глобальных утилит из global.css
```

```
✗  Нельзя писать .vn-krd-hero + .vn-krd-novitr { ... } — зависимость от соседа
✗  Нельзя использовать :nth-child или :first-child для межблочной логики
✗  Нельзя делать блок зависимым от наличия другого блока выше/ниже
```

**Правило именования блоков:**
```
vn-{page}-{block}__element  — основной паттерн
vn-{page}-{block}--modifier — модификатор состояния

Примеры:
  vn-home-hero__h1           ← блок hero на главной
  vn-krd-scenarios__card     ← карточка сценария на странице Краснодар
  vn-dist-fear__card--alert  ← карточка-тревога на дистанционной
```

---

## 4b. 12-КОЛОНОЧНАЯ СЕТКА — ЗАКОН ДЛЯ ВСЕХ СЕКЦИЙ

**Каждая секция на desktop верстается ТОЛЬКО через `.vn-grid-12` с явными `grid-column` позициями.**
Нарушение = сломанное выравнивание между блоками.

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
  .vn-grid-12 > * { grid-column: 1 / -1; }  /* всё в одну колонку */
}
```

### Обязательная структура каждой секции

```astro
<section class="vn-section">
  <div class="vn-container">
    <div class="vn-grid-12">
      <div style="grid-column: 1 / 7">  <!-- левый блок -->
      <div style="grid-column: 7 / 13"> <!-- правый блок -->
    </div>
  </div>
</section>
```

**Правила:**
```
✗  Запрещено: display:flex для горизонтальных макетов на desktop
✗  Запрещено: grid-template-columns: 1fr 1fr без явных grid-column
✗  Запрещено: max-width: 720px как корень секции (узкий остров)
✅  Каждый прямой потомок .vn-grid-12 обязан иметь grid-column
✅  Узкий текст — только внутри колонок: max-width: 58ch на дочернем элементе
✅  На ≤1023px все дети схлопываются в grid-column: 1 / -1
```

### Типовые паттерны компоновки

| Паттерн | Левый блок | Правый блок | Когда использовать |
|---|---|---|---|
| **6/6** равные | `1 / 7` | `7 / 13` | Hero, сравнение, 2 равных блока |
| **7/5** текст+фото | `1 / 8` | `8 / 13` | Текст важнее, фото меньше |
| **5/7** фото+текст | `1 / 6` | `6 / 13` | Фото важнее, текст справа |
| **8/4** широкий+aside | `1 / 9` | `9 / 13` | Контент + боковая метка |
| **4 карточки** | `1/4`, `4/7`, `7/10`, `10/13` | — | Сетка из 4 равных |
| **3 карточки** | `1/5`, `5/9`, `9/13` | — | Сетка из 3 равных |
| **Центр 8** | `3 / 11` | — | Центрированный текстовый блок |

### Pre-flight перед каждой новой секцией

Перед версткой любого нового блока проверить:
1. Секция обёрнута в `vn-container` → `vn-grid-12`
2. У каждого дочернего блока есть `grid-column`
3. Мобильный breakpoint ≤1023px схлопывает в одну колонку

---

## 4c. ГЛОБАЛЬНЫЕ СТИЛИ — ЧТО УЖЕ ЕСТЬ В global.css, НЕ ПЕРЕОПРЕДЕЛЯТЬ

**Всё перечисленное ниже уже реализовано в `src/styles/global.css`. Никогда не дублировать и не переопределять в блоках.**

### Готовые компоненты (использовать как есть)

| Класс | Что делает |
|---|---|
| `.vn-btn-primary` | Синяя кнопка CTA. При hover: белый фон + синяя рамка + `translateY(-1px)` + glow |
| `.vn-btn-ghost` | Прозрачная кнопка с рамкой. При hover: светлый фон |
| `.vn-label-mono` | Uppercase eyebrow с синей вертикальной чертой слева |
| `.vn-tag` | Маленький badge-тег (тёмно-синий фон, uppercase) |
| `.vn-card` | Белая карточка: padding 32px, radius 12px, тень, hover-тень |
| `.vn-section` | Секция: position relative, padding 120px vertical, bg-primary |
| `.vn-section--secondary` | Секция с bg-secondary |
| `.vn-section--dark` | Тёмная секция с bg-dark и ondark-цветами |
| `.vn-deco-grid` | Декоративная сетка 64×64px (светлая) |
| `.vn-deco-grid--dark` | Декоративная сетка (тёмная версия) |
| `.vn-section-marker` | Большой декоративный номер (220px, position absolute) |
| `.vn-faq-item` | FAQ строка с border-bottom |
| `.vn-faq-question` | Summary строки FAQ (flex, justify space-between) |
| `.vn-faq-answer` | Тело ответа FAQ |
| `.vn-container` | Центрирующий контейнер max-width 1280px, padding 48px |
| `.vn-grid-12` | 12-колоночный grid с gap 32px |

### Кнопки — точные размеры и эффекты

```css
/* .vn-btn-primary */
padding:       14px 28px
font-size:     15px
font-weight:   400
height:        ~48px (авто по padding)
border-radius: var(--radius-md) = 10px
hover:         bg → #ffffff, color → accent-cta, border → accent-cta
               box-shadow: 0 0 0 3px rgba(37,99,235,0.12)
               transform: translateY(-1px)
transition:    0.22s ease на bg/color/border/shadow/transform

/* .vn-btn-ghost */
padding:       14px 24px
font-size:     15px
font-weight:   500
border:        1px solid var(--color-border)
hover:         bg → color-bg-surface, border → rgba(15,37,71,0.25)
transition:    0.15s ease
```

**Кастомные размеры кнопок в блоках — только через override padding/font-size:**
```css
/* Пример: кнопка в хедере меньше стандартной */
.vn-header__cta { font-size: 14px; padding: 10px 20px; height: 40px; }
```
Никогда не менять цвета, hover-эффекты и transitions кнопок — только размер.

---

## 5b. ТИПОГРАФИКА — ТОКЕНЫ (`src/styles/global.css`, блок `:root`)

**Правило:** никогда не хардкодить размеры шрифтов в компонентах — только `var(--fs-*)`.

```css
/* Заголовки: clamp(min, fluid, max) — авторесайз без media queries */
--fs-display: clamp(36px, 4.5vw, 52px);  /* Hero H1 · 43px@960 · 52px@1150+ */
--fs-h1:      clamp(28px, 3.8vw, 50px);  /* Заголовки секций */
--fs-h2:      clamp(22px, 2.8vw, 36px);  /* Подзаголовки */
--fs-h3:      clamp(18px, 1.8vw, 24px);  /* Карточки, пункты */

/* Текст: фиксированные */
--fs-lead:    17px;   /* Лид-текст, подзаголовок Hero  → 16px на mobile ≤640px */
--fs-body:    15px;   /* Основной текст */
--fs-body-sm: 13px;   /* Trust-значения, мелкий текст */
--fs-label:   12px;   /* Uppercase метки, eyebrow */
--fs-caption: 11px;   /* Мелкий вспомогательный */
```

| Экран | `--fs-display` | `--fs-lead` |
|---|---|---|
| Мобиле ≤640px | 36px | 16px |
| Ноутбук 960px | 43px | 17px |
| Десктоп 1150px+ | 52px | 17px |

### Запрет на висячие слова — обязательное правило

**Одиночное слово на последней строке заголовка или абзаца недопустимо.**

```css
/* На всех заголовках обязательно: */
h1, h2, h3,
.vn-hero__h1, .vn-*__h2, .vn-*__h3 {
  text-wrap: balance;   /* браузер сам балансирует строки — нет висячих слов */
}

/* На лид-тексте и подзаголовках: */
.vn-*__sub, .vn-*__lead {
  text-wrap: pretty;    /* мягкий вариант для длинного текста */
}
```

**Когда `text-wrap` недостаточно** (ручная правка текста):
```html
<!-- Неразрывный пробел &nbsp; связывает последние два слова -->
<h2>Новостройки Краснодара по военной&nbsp;ипотеке</h2>
```

```
✗  Запрещено: одно слово на последней строке заголовка
✗  Запрещено: hyphens: auto (автоперенос слов по слогам)
✅  text-wrap: balance на всех h1/h2/h3
✅  &nbsp; между предпоследним и последним словом если text-wrap не помогает
```

---

## 6. СТРУКТУРА ФАЙЛОВ (сокращённая)

```
src/
├── layouts/
│   ├── BaseLayout.astro       ← head + SEO + fonts + scripts
│   └── PageLayout.astro       ← Header + main slot + Footer + modals
│
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── RouteMapOverlay.astro
│   │   ├── MobileBottomCTA.astro
│   │   └── Footer.astro
│   └── ui/
│       ├── RequestModal.tsx        ← client:load
│       ├── CookieBanner.tsx        ← client:load
│       └── PhotoPlaceholder.astro
│
├── lib/
│   ├── navigation/navData.ts   ← ЕДИНСТВЕННЫЙ источник nav-ссылок
│   └── constants.ts            ← офисы, контакты, реквизиты
│
├── pages/
│   ├── index.astro
│   ├── voennaya-ipoteka-krasnodar.astro
│   ├── voennaya-ipoteka-krym.astro
│   ├── distancionnaya-pokupka.astro
│   ├── etapy-pokupki.astro
│   ├── contacts.astro
│   ├── politika.astro
│   ├── cookies.astro
│   ├── thanks.astro
│   ├── 404.astro
│   └── api/contact.ts          ← Telegram endpoint
│
└── styles/
    └── global.css              ← @import "tailwindcss" + @theme токены
```

---

## 7. НАВИГАЦИЯ — navData.ts

Все ссылки меню берутся **только** отсюда. Не хардкодить href нигде кроме этого файла.

```typescript
// src/lib/navigation/navData.ts
export const NAV_ITEMS = [
  { number:'01', label:'Краснодар',       labelShort:'Краснодар',  href:'/voennaya-ipoteka-krasnodar/', group:'object', icon:'building-2' },
  { number:'02', label:'Крым',            labelShort:'Крым',       href:'/voennaya-ipoteka-krym/',      group:'object', icon:'map-pinned', badge:'new' },
  { number:'03', label:'Удалённо',        labelShort:'Удалённо',   href:'/distancionnaya-pokupka/',     group:'route',  icon:'video' },
  { number:'04', label:'Этапы покупки',   labelShort:'Этапы',      href:'/etapy-pokupki/',              group:'route',  icon:'route' },
  { number:'05', label:'Контакты',        labelShort:'Контакты',   href:'/contacts/',                   group:'contact',icon:'phone' },
];

// Header default (84px): все 5 пунктов
export const HEADER_NAV = NAV_ITEMS;

// Dock (60px, при скролле): 4 пункта без Удалённо
export const DOCK_NAV = NAV_ITEMS.filter(i => !i.href.includes('distancionnaya'));
```

---

## 8. ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

```bash
# .env (НЕ коммитить)
TELEGRAM_BOT_TOKEN=8756363959:AAGdDHVe1jb7JwqUWUyHpO7W5xBnnvu-SWU
TELEGRAM_CHAT_ID=-5270072570
PUBLIC_YM_COUNTER_ID=         # добавить после регистрации в Яндекс.Метрике
```

```bash
# .env.example (коммитить — без значений)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
PUBLIC_YM_COUNTER_ID=
```

Переменные с префиксом `PUBLIC_` доступны в клиентском коде.

---

## 9. КАК ЧИТАТЬ PAGE_*.md БРИФЫ

Каждый бриф описывает одну страницу. Структура:

```
1. Цель страницы          → понять что страница делает
2. SEO-рамка             → Title, Description, H1, URL, canonical
3. AI-ready ответ        → текст блока 02 (Короткий ответ)
4. CTA-логика            → какие кнопки куда ведут
5. Ритм фонов            → последовательность bg секций
6. Блоки 01-N            → детальная спецификация каждого блока:
   - id, фон, padding, grid
   - Композиция (как выглядит)
   - Все тексты (готовые, копировать дословно)
   - Структура компонентов
   - Mobile-адаптация
7. JSON-LD               → схемы для head
8. Evidence Layer        → что верифицировано, что заглушка
9. Чек-лист              → финальная проверка
```

**Правило:** тексты из бриф-файла копировать дословно. Не переформулировать, не сокращать.

---

## 10. СТАНДАРТНАЯ СТРУКТУРА СТРАНИЦЫ

```astro
---
// src/pages/[page-slug].astro
import PageLayout from '../layouts/PageLayout.astro';
// импорты компонентов секций...
---

<PageLayout
  title="Title страницы (50-60 символов)"
  description="Description (140-160 символов)"
  canonical="https://[DOMAIN]/[slug]/"
  ogImage="/og/[slug].jpg"
>
  <!-- JSON-LD в head через slot="head" -->
  <script slot="head" type="application/ld+json">
    { /* BreadcrumbList + Service + FAQPage */ }
  </script>

  <!-- Блоки страницы -->
  <section id="section-[slug]-hero" class="vn-[slug]-hero">
    <!-- ... -->
  </section>
</PageLayout>
```

---

## 11. СТАНДАРТНЫЕ ПАТТЕРНЫ СЕКЦИЙ

### Секция с bg/dark (тёмная)

```astro
<section class="vn-section vn-section--dark" id="...">
  <!-- Декоративная сетка -->
  <div class="vn-deco-grid vn-deco-grid--dark" aria-hidden="true"></div>
  <!-- Section marker -->
  <span class="vn-section-marker" aria-hidden="true">07</span>
  <!-- Контент -->
  <div class="vn-container">
    <div class="vn-grid-12">
      <!-- ... -->
    </div>
  </div>
</section>
```

### Section marker (большой номер)

```astro
<span
  class="vn-section-marker"
  aria-hidden="true"
  style="position:absolute; font-size:220px; font-weight:700;
         color:var(--color-deco-marker); right:48px; bottom:0;
         line-height:0.85; user-select:none; pointer-events:none;"
>07</span>
```

### PhotoPlaceholder (пока нет реального фото)

```astro
import PhotoPlaceholder from '../components/ui/PhotoPlaceholder.astro';
---
<PhotoPlaceholder type="building" height="280px" filename="zhk-1.jpg" />
```

### FAQ accordion (без JS)

```html
<details class="vn-faq-item">
  <summary class="vn-faq-question">Вопрос клиента?</summary>
  <div class="vn-faq-answer">
    <p>Ответ в HTML. Всегда виден в DOM для SEO и Алисы.</p>
  </div>
</details>
```

---

## 12. JSON-LD НА КАЖДОЙ СТРАНИЦЕ

**Главная (/):**
```json
Organization + Person + WebSite + Service + FAQPage + BreadcrumbList
```

**Коммерческие страницы:**
```json
Service + FAQPage + BreadcrumbList
```

**Контакты:**
```json
Organization + LocalBusiness(×2) + FAQPage + BreadcrumbList
```

**Юридические:**
```json
BreadcrumbList
```

BreadcrumbList обязателен на ВСЕХ страницах включая главную.

---

## 13. ФОТОГРАФИИ

| Файл | Статус | Использование |
|---|---|---|
| `/images/mikhail-hero.jpg` | ✅ Готово | Hero главной и /voennaya-ipoteka-krasnodar/ |
| `/images/mikhail-form.jpg` | ✅ Готово | Аватар в RequestModal |
| `/images/zhk-1.jpg` … `zhk-4.jpg` | ⏳ Позже | Блок 06 /voennaya-ipoteka-krasnodar/ |
| `/images/office-krd.jpg` | ⏳ Позже | Блок 04 /contacts/ |

Для файлов ⏳: использовать `<PhotoPlaceholder>` — заменяется позже одной строкой.

Hero-фото: `loading="eager"` (LCP)
Остальные фото: `loading="lazy"`

---

## 14. ФОРМА ЗАЯВКИ

Кнопки CTA открывают модалку через data-атрибуты:

```html
<a href="/contacts/#request"
   data-modal-open
   data-modal-title="Разобрать цель покупки"
   class="vn-btn-primary">
  Записаться на разбор
</a>
```

API endpoint: `POST /api/contact` → Telegram Bot → TELEGRAM_CHAT_ID

Защита: honeypot + timing check (< 3 сек) + rate limit (3/10 мин).

---

## 15. COOKIE BANNER

```astro
<!-- В PageLayout.astro -->
<CookieBanner client:load />
```

localStorage key: `vn_cookie_consent` (значения: `'accepted'` | `'rejected'`)
Яндекс.Метрика запускается ТОЛЬКО после `'accepted'`.

---

## 16. ROBOTS.TXT

```
# public/robots.txt
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
✅ LCP < 2.5 сек (проверить в DevTools > Performance)
✅ Нет горизонтального скролла
✅ Все CTA ведут в нужные места
✅ [PLACEHOLDER] и [TODO] не попали в продакшн
```

---

## 18. TODO — ЧТО НУЖНО ОТ МИХАИЛА ДО ЗАПУСКА

```
✅ [PRIMARY_PHONE]    — +7 (938) 407 44 57 (заполнено в constants.ts)
✅ [TELEGRAM]         — @Mikhail_khryapin (заполнено в constants.ts)
   [MAX_LINK]         — ссылка на Max (российский мессенджер)
   [VK_GROUP]         — ссылка ВКонтакте
   [PRIMARY_EMAIL]    — email
   [DOMAIN]           — финальный домен сайта
   [ГОД]              — год начала работы (для trust-strip)
   [YANDEX_BUSINESS_URL] — после регистрации Яндекс.Бизнес
   PUBLIC_YM_COUNTER_ID  — ID счётчика Яндекс.Метрики
```

Если встречаешь незаполненные плейсхолдеры в коде — оставляй как есть и добавляй TODO-комментарий. Не выдумывай значения.

---

## 19. ЖУРНАЛ ЭТАПОВ СБОРКИ

> Обновляй эту таблицу в конце каждого этапа. Это главный ориентир при старте новой сессии.
> **ВАЖНО:** никогда не начинай следующий ⏳-этап без явного запроса от пользователя.

| # | Этап | Дата | Статус | Что сделано |
|---|------|------|--------|-------------|
| 1 | Инициализация проекта | 2026-05-13 | ✅ Готово | Scaffold: package.json, tsconfig.json, astro.config.mjs, global.css с @theme токенами, .env/.env.example, public/robots.txt |
| 2 | Layouts | 2026-05-13 | ✅ Готово | BaseLayout.astro (head+SEO+OG+JSON-LD), PageLayout.astro (Header+main+Footer+Overlay+BottomCTA) |
| 3 | Компоненты — навигация | 2026-05-13 | ✅ Готово | Header.astro (Navigator Dock 3 состояния + floating), RouteMapOverlay.astro (3 зоны, 6 карточек, stagger-анимации), MobileBottomCTA.astro, Footer.astro (5 зон), PhotoPlaceholder.astro |
| 4 | Lib / утилиты | 2026-05-13 | ✅ Готово | navData.ts (description+NavGroup+GROUP_LABELS), constants.ts (OFFICES/CONTACTS/LEGAL/ROUTE_PATH), navigationState.ts (scroll dock, toggle, aria, inert), seo.ts, utils.ts; public: logo-mark.svg, logo-mark-dark.svg, favicon.svg |
| 5 | Stub-страницы | 2026-05-13 | ✅ Готово | 10 страниц: index, krasnodar, krym, distancionnaya, etapy, contacts, politika, cookies, thanks, 404 |
| 6 | API endpoint | 2026-05-13 | ✅ Готово | /api/contact.ts → Telegram Bot, rate-limit + honeypot + timing |
| 7 | Деплой Preview | 2026-05-13 | ✅ Готово | https://voenniy-navigator-1c8pnahw4-smartunionin-5185s-projects.vercel.app |
| 8 | Главная страница (/) | 2026-05-13 | ✅ Готово | 12 блоков: Hero (фото eager, trust-strip), AI-ответ, Ошибка, Сценарии ×5, Метод+сравнение, Первый шаг, Сопровождение ×7, Доверие+медиа, Кейсы ×3, Что не беру (dark), FAQ 6 вопросов, Финальный CTA (dark) |
| 9 | /voennaya-ipoteka-krasnodar/ | 2026-05-13 | ✅ Готово | 9 блоков по PAGE_NOVOSTROYKI.md: Hero+3 дифференциатора, ошибки выбора 4 карточки, 5 сценариев, метод отбора 5 шагов+8 критериев, локальный фильтр 3 подблока, перелинковка на /distancionnaya, разбор цели, FAQ 6 вопросов, финальный dark CTA |
| 10 | /voennaya-ipoteka-krym/ | — | ⏳ | По PAGE_KRYM.md (бриф не создан) |
| 11 | /distancionnaya-pokupka/ | — | ⏳ | По PAGE_DISTANCIONNAYA_POKUPKA.md |
| 12 | /etapy-pokupki/ | — | ⏳ | По PAGE_ETAPY.md |
| 13 | /contacts/ | — | ⏳ | По PAGE_CONTACTS.md |
| 14 | RequestModal + CookieBanner | — | ⏳ | React islands: client:load |
| 15 | Реальные данные Михаила | — | ⏳ | Заменить оставшиеся [PLACEHOLDER] |
| 16 | Продакшн деплой | — | ⏳ | vercel --prod после финального QA |

**Текущий фокус:** Доработка главной страницы (/) — по указанию владельца.

---

**Конец AGENTS.md**
*Читается автоматически OpenAI Codex / ChatGPT Agents при старте сессии.*
*Обновляется при изменении архитектуры или стека.*
