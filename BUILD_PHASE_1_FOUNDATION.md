# BUILD_PHASE_1_FOUNDATION.md

**Проект:** Военный навигатор — Михаил Хряпин
**Фаза:** 1 из 3 — Фундамент
**Читать перед началом:** CLAUDE.md + ASTRO_RULES_CORE.md + DESIGN_SYSTEM.md

---

## Что делается в этой фазе

```
Этап 1.1  Инициализация проекта
Этап 1.2  Дизайн-токены и базовые layout'ы
Этап 1.3  Header + Dock Navigation
Этап 1.4  Footer
Этап 1.5  RequestModal + API
Этап 1.6  PhotoPlaceholder + Logo SVG
Этап 1.7  CookieBanner (заглушка)
──────────────────────────────────
ЧЕКПОИНТ: Hero + Header + Footer корректны
```

После прохождения чекпоинта — переход к BUILD_PHASE_2_PAGES.md.

---

## Этап 1.1 — Инициализация проекта

**Файлы:** CLAUDE.md + SITE_ARCHITECTURE.md

**Задача:**
```
Прочитай CLAUDE.md и SITE_ARCHITECTURE.md раздел astro.config.mjs.

Инициализируй Astro-проект:
- pnpm create astro с minimal template
- Установи зависимости: @astrojs/tailwind, @astrojs/react,
  @astrojs/sitemap, lucide-react
- Создай astro.config.mjs по спецификации из SITE_ARCHITECTURE.md
- Создай .env и .env.example по CLAUDE.md раздел 8
- Создай public/robots.txt по CLAUDE.md раздел 16
```

**Проверка:**
```
□  pnpm dev запускается без ошибок
□  localhost:4321 открывается
□  robots.txt отдаётся на /robots.txt
```

---

## Этап 1.2 — Дизайн-токены и базовые layout'ы

**Файлы:** CLAUDE.md + DESIGN_SYSTEM.md

**Задача:**
```
Прочитай CLAUDE.md и DESIGN_SYSTEM.md.

Создай:
1. src/styles/global.css
   - @import "tailwindcss"
   - @theme с ПОЛНЫМ набором токенов из CLAUDE.md раздел 5
   - Глобальные правила типографики из ASTRO_RULES_CORE.md:
     h1,h2,h3,h4 { text-wrap: balance; }
     p, li { text-wrap: pretty; }

2. src/layouts/BaseLayout.astro
   - head: title, description, canonical, og-теги, robots meta
   - Подключение шрифта Inter (Google Fonts)
   - Slot для JSON-LD схем
   - Яндекс.Метрика (env: PUBLIC_YM_COUNTER_ID)

3. src/layouts/PageLayout.astro
   - Header + main slot + Footer
   - Подключение CookieBanner
   - Подключение RequestModal
```

**Проверка:**
```
□  Токены видны в DevTools (--color-bg-dark, --color-accent-cta и т.д.)
□  Inter загружается (проверить в Network)
□  Нет ошибок в консоли
```

---

## Этап 1.3 — Header + Dock Navigation

**Файлы:** CLAUDE.md + COMPONENT_HEADER.md

**Задача:**
```
Прочитай CLAUDE.md и COMPONENT_HEADER.md полностью.

Создай:
1. src/lib/navigation/navData.ts — по разделу 3 COMPONENT_HEADER.md
   5 пунктов: Краснодар, Крым, Удалённо, Этапы покупки, Контакты
   HEADER_NAV = все 5, DOCK_NAV = 4 без Удалённо

2. src/components/layout/Header.astro
   - Состояние 1 (84px, прозрачный): все 5 пунктов
   - Состояние 2 Dock (60px, floating, frosted glass): 4 пункта
   - Кнопка «Записаться на разбор» с data-modal-open
   - Кнопка бургер для оверлея

3. src/components/layout/RouteMapOverlay.astro
   - Полноэкранный overlay с группами навигации
   - Открытие/закрытие через vanilla TS

4. src/components/layout/MobileBottomCTA.astro
   - Фиксированная кнопка на мобильном при скролле

5. src/scripts/navigation.ts
   - Логика: scroll → dock, open/close overlay
   - IntersectionObserver для активных ссылок

6. SVG логотипа в public/:
   - logo-mark.svg (светлый фон)
   - logo-mark-dark.svg (тёмный фон)
   - favicon.svg (пульсирующий)
   По COMPONENT_LOGO.md раздел 3.
```

**Правило компонентной декомпозиции:**
```
✅ Header.astro = компонент, отвечает только за шапку
✅ RouteMapOverlay.astro = отдельный компонент
✅ MobileBottomCTA.astro = отдельный компонент
✅ navigation.ts = только JS-логика
✗ Не смешивать всё в один файл
```

**Проверка:**
```
□  Header виден на странице
□  При скролле 100px+ появляется Dock (60px, floating)
□  Клик бургер = открывается RouteMapOverlay
□  Escape / клик вне = закрывается
□  Logo SVG отображается корректно (не broken)
□  Mobile 375px: меню работает, нет горизонтального скролла
```

---

## Этап 1.4 — Footer

**Файлы:** CLAUDE.md + COMPONENT_FOOTER.md

**Задача:**
```
Прочитай CLAUDE.md и COMPONENT_FOOTER.md полностью.

Создай:
1. src/lib/constants.ts
   - OFFICES (Краснодар + Бахчисарай с реальными адресами)
   - CONTACTS (плейсхолдеры)
   - LEGAL (ИП Мазур, ИНН, ОГРН)
   - ROUTE_PATH (5 шагов)

2. src/components/layout/Footer.astro — 5 зон:
   Зона 1: Compact CTA Panel (~100px)
   Зона 2: Trust Strip (65 сделок · с 2016 · 180+)
   Зона 3: Main Grid 3/3/3/3 (бренд / nav / офисы / контакты)
     → Decorative grid только здесь
   Зона 4: Route Path Strip (скрыт на mobile)
   Зона 5: Legal Strip (3 части: копирайт / разработка сайта / политика)

ВАЖНО — Legal Strip:
Центральный элемент: «разработка сайта ↗» → chirkovandrey.ru
CSS: .vn-footer__dev-link — строчные, opacity 0.35, hover 0.75
border-left + border-right: 1px rgba(241,243,245,0.07)

ВАЖНО — Контент в сетку:
Все зоны: фон full-width, контент ограничен max-width контейнером.
```

**Проверка:**
```
□  Footer отображается на странице
□  Все 5 зон видны
□  Контент НЕ растягивается на весь экран — в сетке
□  Trust Strip: цифры 65, 2016, 180+ на месте
□  Legal Strip: «разработка сайта ↗» по центру, строчными
□  Mobile: stack вертикально, аккордеоны работают
□  Route Path скрыт на mobile (≤ 767px)
```

---

## Этап 1.5 — RequestModal + API

**Файлы:** CLAUDE.md + COMPONENT_REQUEST_MODAL.md

**Задача:**
```
Прочитай CLAUDE.md и COMPONENT_REQUEST_MODAL.md полностью.

Создай:
1. src/components/ui/RequestModal.tsx (React, client:load)
   - 3 поля: Имя / Телефон +7 маска / Способ (Звонок|Telegram|Max)
   - Чекбокс согласия → /politika/
   - Honeypot + timing check + rate limit
   - States: idle / loading / success / error
   - Аватар Михаила: /images/mikhail-form.jpg
   - После submit → /thanks/?method=[метод]

2. src/pages/api/contact.ts
   - POST endpoint → Telegram Bot
   - Читает TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID из .env
   - Honeypot, timing, rate limit (3/10 мин)
   - Telegram сообщение: имя, телефон, способ, страница, время МСК

3. Подключить в PageLayout.astro:
   - data-modal-open атрибут на CTA-кнопках
   - Глобальный eventListener для открытия модалки
   - Fallback без JS: href="/contacts/#request"
```

**Проверка:**
```
□  Кнопка «Записаться» открывает модалку
□  Телефонная маска работает: +7 (___) ___-__-__
□  Способ связи: переключение Звонок/Telegram/Max
□  Отправить → тестовая заявка пришла в Telegram
□  Honeypot: заполнить скрытое поле → заявка НЕ приходит
□  /thanks/ открывается после отправки
□  Модалка закрывается по Escape и по клику вне
```

---

## Этап 1.6 — PhotoPlaceholder

**Файлы:** CLAUDE.md + COMPONENT_PHOTO_PLACEHOLDER.md

**Задача:**
```
Прочитай CLAUDE.md и COMPONENT_PHOTO_PLACEHOLDER.md.

Создай src/components/ui/PhotoPlaceholder.astro.
Props: type (person|building|office), height, filename, dark.
Брендированные заглушки: тёмный фон, Corner Brackets синие,
иконка типа, label с именем файла.

Готовые фото подключить сразу:
- /images/mikhail-hero.jpg → в Hero (loading="eager")
- /images/mikhail-form.jpg → в RequestModal аватар
- /images/chirkov-andrey.jpg → в /prezentaciya/
```

**Проверка:**
```
□  PhotoPlaceholder рендерится без ошибок
□  type="person" / "building" / "office" — разные иконки
□  Реальные фото Михаила отображаются там где готовы
```

---

## Этап 1.7 — CookieBanner (заглушка)

**Задача:**
```
Создай src/components/shared/CookieBanner.tsx (React, client:load).
Минимальная версия: баннер внизу с кнопками «Принять» / «Отклонить».
localStorage key: vn_cookie_consent ('accepted' | 'rejected')
После 'accepted' → запустить Яндекс.Метрику.
Визуал: компактная полоса внизу, bg/dark, Regular 13px.
Полный дизайн — доработать позже.
```

---

## ✅ ЧЕКПОИНТ ФАЗЫ 1

Перед переходом к Phase 2 проверить:

```
□  pnpm build — без ошибок (0 errors, 0 warnings)
□  Header: 2 состояния работают (84px → Dock при скролле)
□  RouteMapOverlay: открывается/закрывается
□  Footer: контент в сетке, все 5 зон, Legal Strip правильный
□  RequestModal: открывается, форма отправляется, заявка в Telegram
□  PhotoPlaceholder: компонент работает
□  Яндекс.Метрика: счётчик срабатывает после consent
□  Нет ошибок в консоли браузера
□  Mobile 375px: нет горизонтального скролла
```

**После прохождения чекпоинта → переходи к BUILD_PHASE_2_PAGES.md**

---

**Конец BUILD_PHASE_1_FOUNDATION.md**
