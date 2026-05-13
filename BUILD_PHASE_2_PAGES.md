# BUILD_PHASE_2_PAGES.md

**Проект:** Военный навигатор — Михаил Хряпин
**Фаза:** 2 из 3 — Страницы
**Читать перед началом:** CLAUDE.md + ASTRO_RULES_CORE.md
**Требование:** Фаза 1 пройдена и чекпоинт ✅

---

## Правило компонентной декомпозиции — ОБЯЗАТЕЛЬНО

```
КАЖДАЯ СЕКЦИЯ СТРАНИЦЫ = ОТДЕЛЬНЫЙ ФАЙЛ

src/pages/index.astro           ← ТОЛЬКО импорты и порядок
src/pages/_home/
    01-Hero.astro
    02-ShortAnswer.astro
    03-Problem.astro
    ...
    12-FinalCTA.astro

Монолитная страница в одном файле — ЗАПРЕЩЕНА.
```

**Как давать задачу:**
```
Реализуй страницу [X] по PAGE_[X].md.
Каждую секцию (<section> с id) вынеси в отдельный файл
в папке src/pages/_[slug]/.
Файл страницы = только импорты и порядок.
```

---

## Этап 2.1 — Главная страница (ЭТАЛОН)

**Файлы:** CLAUDE.md + PAGE_HOME.md + ASTRO_RULES_CORE.md

**Стратегия:** Главная — самая сложная страница. Она становится эталоном для остальных. Собирать итеративно: сначала Hero, потом блок за блоком.

---

### Шаг 2.1a — Hero + JSON-LD

**Задача:**
```
Прочитай CLAUDE.md, PAGE_HOME.md (разделы 1-3 и блок 01 Hero).

Создай:
- src/pages/index.astro (только layout + импорт Hero + JSON-LD в head)
- src/pages/_home/01-Hero.astro

Hero: 7/5 grid, левая колонка — тексты + Trust Row + CTA,
правая — фото Михаила (/images/mikhail-hero.jpg, loading="eager")
+ Corner brackets декор.

JSON-LD в slot head:
Organization + Person + WebSite + BreadcrumbList

Тексты — дословно из PAGE_HOME.md.
```

**Проверка:**
```
□  Hero виден с фото Михаила
□  CTA кнопка открывает RequestModal
□  Текст: нет висячих строк на 375px и 1440px
□  Trust Row: 65 сделок · с 2016 · 180+
□  JSON-LD: валиден в https://validator.schema.org
```

---

### Шаг 2.1b — Блоки 02-06

**Задача:**
```
Прочитай PAGE_HOME.md блоки 02-06.

Добавь в src/pages/_home/:
02-ShortAnswer.astro   (AI-ready блок, bg/primary)
03-Problem.astro       (bg/secondary, split 5/7)
04-Scenarios.astro     (bg/primary, 3 сценария)
05-HowItWorks.astro    (bg/dark, 3 шага)
06-LocalFilter.astro   (bg/dark, локальный фильтр)

Для каждого: тексты дословно, фоны точно, grid правильный.
```

**Проверка:**
```
□  Ритм фонов: primary→secondary→primary→dark→dark
□  Нет дублирования стилей между компонентами
□  Mobile: все блоки корректно stack'аются
```

---

### Шаг 2.1c — Блоки 07-12

**Задача:**
```
Прочитай PAGE_HOME.md блоки 07-12.

Добавь:
07-DualList.astro      (bg/secondary, 2 колонки)
08-AboutMikhail.astro  (bg/primary, фото + текст)
09-HowBegin.astro      (bg/secondary, 3 шага)
10-NotFor.astro        (bg/dark, «что не беру» 4 пункта)
11-FAQ.astro           (bg/secondary, FAQ accordion)
12-FinalCTA.astro      (bg/dark, финальный призыв)

FAQ — details/summary (не JS). Видны в DOM для SEO.
JSON-LD FAQPage добавить в head страницы.
```

**Проверка:**
```
□  FAQ раскрывается/закрывается
□  FAQPage JSON-LD: 8 вопросов в schema
□  Блок 10: 4 пункта с ограничениями (только НИС, только новостройки и т.д.)
□  Финальный CTA: bg/dark, кнопка открывает модалку
□  Lighthouse Performance ≥ 85
□  Нет [PLACEHOLDER] в тексте
```

---

### ✅ ЧЕКПОИНТ ГЛАВНОЙ

```
□  Все 12 блоков отображаются
□  Ритм фонов соответствует PAGE_HOME.md
□  Фото Михаила: loading="eager" (LCP)
□  RequestModal работает с главной
□  JSON-LD: Organization + Person + WebSite + Service + FAQPage + BreadcrumbList
□  Mobile 375px: все блоки читаемы, нет overflow
□  Нет висячих строк ни на одном заголовке
□  Все CTA ведут куда надо
```

**Главная — эталон. Дальше быстрее.**

---

## Этап 2.2 — Коммерческие страницы

**Правило:** 1-2 страницы за сессию. Не больше.

---

### Страница: /voennaya-ipoteka-krasnodar/

**Файлы:** CLAUDE.md + PAGE_NOVOSTROYKI.md

**Задача:**
```
Прочитай CLAUDE.md, PAGE_NOVOSTROYKI.md.

Создай src/pages/voennaya-ipoteka-krasnodar.astro
+ папку src/pages/_voennaya-ipoteka-krasnodar/ с 11 блоками:

01-Hero.astro
02-ShortAnswer.astro
03-WhyVitrina.astro
04-Criteria.astro      (horizontal strips с chips)
05-Scenarios3.astro    (3 сценария ЖК)
06-LocalFilter.astro   (dark, 3 суб-блока + 4 фото-заглушки ЖК)
07-Checklist.astro     (dual-list)
08-RazborService.astro
09-NotFor.astro        (кому не подходит, 4 пункта)
10-FAQ.astro           (6 вопросов)
11-FinalCTA.astro

Блок 06: 4 PhotoPlaceholder type="building" для zhk-1..4.jpg
JSON-LD: Service + FAQPage + BreadcrumbList
```

**Проверка:**
```
□  URL /voennaya-ipoteka-krasnodar/ открывается
□  Hero: Title «Военная ипотека в Краснодаре...»
□  Блок 06: 4 заглушки ЖК в тёмной секции
□  Блок 09: 4 ограничения (только НИС, только новостройки, etc.)
□  FAQ: 6 вопросов, details/summary
□  JSON-LD валиден
```

---

### Страница: /voennaya-ipoteka-krym/

**Файлы:** CLAUDE.md + PAGE_VOENNAYA_IPOTEKA_KRYM.md

**Задача:**
```
Прочитай CLAUDE.md, PAGE_VOENNAYA_IPOTEKA_KRYM.md.

Создай src/pages/voennaya-ipoteka-krym.astro
+ папку src/pages/_voennaya-ipoteka-krym/ с 10 блоками:

01-Hero.astro          (SVG-карта Крыма, НЕ фото)
02-ShortAnswer.astro
03-WhenNeeded.astro    (staggered cards, 4 карточки)
04-HowItWorks.astro
05-Criteria.astro      (2×3 offset columns)
06-Distancionnaya.astro
07-ChecklistCrimea.astro
07.5-NotFor.astro      (кому не подходит)
08-FAQ.astro           (2-column accordion 4+4)
09-FinalCTA.astro      (bg/dark + SVG силуэт Крыма)

Hero: SVG-карта полуострова inline, анимация точки.
```

**Проверка:**
```
□  Hero: SVG карта Крыма видна
□  Блок 05: offset columns (нечётные ─ обычно, чётные +40px)
□  FAQ: 2 колонки по 4 вопроса
□  JSON-LD валиден
```

---

### Страницы: /etapy-pokupki/ и /distancionnaya-pokupka/

**Файлы:** PAGE_ETAPY_POKUPKI.md + PAGE_DISTANCIONNAYA_POKUPKA.md

**Задача:**
```
Прочитай CLAUDE.md, PAGE_ETAPY_POKUPKI.md, PAGE_DISTANCIONNAYA_POKUPKA.md.

Создай обе страницы с декомпозицией по блокам.

Для /etapy-pokupki/:
- Зигзаг-таймлайн — основной паттерн страницы
- 10 блоков

Для /distancionnaya-pokupka/:
- dual-list в блоке 05
- Перелинковка на /voennaya-ipoteka-krasnodar/
- 11 блоков

JSON-LD: Service + FAQPage + BreadcrumbList для обеих.
```

---

### Страница: /contacts/

**Файлы:** CLAUDE.md + PAGE_CONTACTS.md

**Задача:**
```
Прочитай CLAUDE.md, PAGE_CONTACTS.md.

Создай src/pages/contacts.astro с блоками.

КЛЮЧЕВЫЕ БЛОКИ:
- Блок 04: Яндекс.Карта Краснодар (iframe из PAGE_CONTACTS.md)
  + floating-карточка слева
  + PhotoPlaceholder type="office" height="120px"
- Блок 05: Яндекс.Карта Бахчисарай (iframe)
  + floating-карточка справа

CSP в vercel.json: добавить frame-src yandex.ru.
JSON-LD: Organization + LocalBusiness(×2) + FAQPage + BreadcrumbList
NAP в JSON-LD должен совпадать с текстом страницы.
```

**Проверка:**
```
□  Обе Яндекс-карты отображаются
□  Floating-карточки не перекрывают карту
□  PhotoPlaceholder офиса на месте
□  LocalBusiness: два объекта с разными адресами
```

---

## Этап 2.3 — Юридические и служебные страницы

**Файлы:** PAGE_PRIVACY_POLICY.md + PAGE_COOKIES.md + PAGE_404.md + PAGE_THANKS.md

**Задача:**
```
Прочитай CLAUDE.md + все 4 PAGE файла.

Создай:
1. src/pages/politika.astro
   - Дизайнерская политика: тёмная обложка + numbered section cards
   - noindex: false (страница индексируется)

2. src/pages/cookies.astro
   - 4 category-карточки
   - Toggle для аналитических cookies (React island)
   - noindex: false

3. src/pages/404.astro
   - Анимация: seeking dot (синяя точка ищет маршрут, 3s)
   - «404» в фоне, opacity 0.03
   - 4 навигационные карточки
   - prefers-reduced-motion: анимация отключается
   - noindex: true

4. src/pages/thanks.astro
   - Анимированная галочка (stroke-dashoffset)
   - VK Video embed: [VK_VIDEO_EMBED_URL] — placeholder если нет
   - 3 шага «что будет дальше»
   - Telegram-канал: скрыт если [TELEGRAM_CHANNEL] не заполнен
   - noindex: true
   - Яндекс.Метрика цель: form_submitted
```

**Проверка:**
```
□  /politika/ и /cookies/ открываются, не noindex
□  /404/ возвращает HTTP 404 (не 200!)
□  /404/ анимация работает (Chrome, Firefox, Safari)
□  /thanks/ открывается, галочка анимируется
□  Telegram-блок скрыт (ссылка ещё не готова)
```

---

## Этап 2.4 — Воронка из видео

**Файлы:** CLAUDE.md + PAGE_VIDEO.md + PAGE_BONUS.md

**Задача:**
```
Прочитай CLAUDE.md, PAGE_VIDEO.md, PAGE_BONUS.md.

Создай:
1. src/lib/bonus-content.ts
   - Типы BonusMagnet
   - MAGNETS: ipoteka + novostroyki
   - Плейсхолдеры VK Video URL

2. src/components/quiz/QuizForm.tsx (React, client:load)
   - 3 вопроса с card-вариантами
   - Progress bar ●●○
   - Q2 → маппинг на магнит (ipoteka/novostroyki/both)
   - Inline форма после Q3 (одно поле «телефон или Telegram»)
   - Submit → POST /api/contact с quiz_answers
   - Redirect → /bonus/?v=[magnet]

3. src/pages/video.astro
   - Mini Header (без клиентского меню): только логотип + TG-кнопка
   - Mini Footer
   - noindex

4. src/pages/bonus.astro
   - Читает ?v= параметр
   - VK Video embed (placeholder)
   - Тизер второго материала (blur + lock)
   - noindex

5. Обновить /api/contact.ts:
   - Добавить quiz_answers в тело и Telegram-сообщение
```

**Проверка:**
```
□  /video/ без клиентского меню
□  Квиз: 3 вопроса без перезагрузки
□  Q2 «ипотека» → /bonus/?v=ipoteka
□  /bonus/?v=novostroyki показывает видео про новостройки
□  Telegram-сообщение содержит ответы квиза
□  noindex на обеих страницах
```

---

## Этап 2.5 — Презентация для клиента

**Файлы:** CLAUDE.md + PAGE_PREZENTACIYA.md + BRANDBOOK.md + DESIGN_SYSTEM.md

**Задача:**
```
Прочитай CLAUDE.md, PAGE_PREZENTACIYA.md раздел 2a,
BRANDBOOK.md (дизайн-система АМС), DESIGN_SYSTEM.md.

Создай src/pages/prezentaciya.astro.

ГИБРИДНЫЙ ДИЗАЙН — строго по разделу 2a PAGE_PREZENTACIYA.md:
- НЕ использует клиентский Header и Footer
- Mini Header: [АМС] бейдж #9E0707 + дескриптор строчными
- Mini Footer: АМС + chirkovandrey.ru
- Блоки 01-06: акцент #2563EB (клиентский синий)
- Блоки 07-13: акцент #9E0707 (красный АМС)
- Dot navigation (14 точек, IntersectionObserver)
- Пароль 2026 (JS + localStorage)
- scroll-snap на desktop

Фото Андрея: /images/chirkov-andrey.jpg ✅ ГОТОВО
noindex, nofollow
```

---

## ✅ ЧЕКПОИНТ ФАЗЫ 2

```
□  Все 12+ страниц открываются
□  Каждая страница: компонентная декомпозиция (не монолит)
□  Title/Description: 50-60 / 140-160 символов на всех страницах
□  Один H1 на каждой странице
□  Alt на всех img
□  JSON-LD: проверить validator.schema.org на 3 ключевых страницах
□  /404/ возвращает HTTP 404 статус
□  noindex: thanks, 404, video, bonus, prezentaciya
□  index: все основные + politika + cookies
□  Яндекс.Карты: обе карты отображаются
□  Все формы ведут на /thanks/
□  Нет [PLACEHOLDER] в тексте страниц
□  pnpm build: 0 ошибок
```

**После прохождения чекпоинта → переходи к BUILD_PHASE_3_FINAL.md**

---

**Конец BUILD_PHASE_2_PAGES.md**
