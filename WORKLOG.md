# WORKLOG — Военный навигатор

## Текущий статус

- **Stack:** Astro 5 + Tailwind CSS v4 + TypeScript strict + React islands.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings.
- **Browser check:** localhost and production (`voen-navigator.ru`) render correctly, 0 console errors.
- **Deployed:** commit `9736e0e` pushed to `main`, GitHub Actions → AMS Server.

### 2026-06-06 — Предрелизная проверка новых страниц и production hardening

- **Checked:** `git remote -v` подтверждён — репозиторий проекта: `https://github.com/neyro-level/voenniy-navigator.git`.
- **Checked:** локальная сборка и технические проверки пройдены заново: `pnpm build` → 0 errors / 0 warnings / 0 hints, `pnpm geo-check` → `100/100`.
- **Fixed:** убраны runtime-утечки placeholder-данных в публичный HTML. Ссылки `Max` / `ВКонтакте`, если не настроены, больше не попадают в footer, overlay, trust/reviews и финальные CTA.
- **Fixed:** исправлен schema-layer на новых страницах. В нескольких `pageData.ts` вместо ссылки на функцию `organizationSchema` теперь вызывается `organizationSchema()`, поэтому JSON-LD больше не сериализуется с `null`-элементами.
- **Fixed:** OG-изображения переведены с несуществующих путей `/og/*.jpg` на реальные публичные ассеты в `public/images/`, чтобы production не раздавал битые social preview URLs.
- **Fixed:** в `src/lib/geo/schema.ts` `sameAs` теперь очищается от placeholder-значений перед генерацией Schema.org.
- **Checks:** повторный поиск по `dist` подтвердил, что placeholder-ссылок и битых внутренних route-href больше нет.
- **Note:** в рабочем дереве остаются сторонние пользовательские изменения `.qwen/settings.json` и `.qwen/settings.json.orig`; они не относятся к сайту и не должны попадать в релиз этого проекта без отдельного решения.

### 2026-06-05 — Бриф страницы условий военной ипотеки

- **Created:** `pages/PAGE_USLOVIYA_VOENNOY_IPOTEKI.md` — утвержденный структурный бриф страницы `/usloviya-voennoy-ipoteki/`.
- **Decision:** страница зафиксирована как отдельный SEO + Info + Lead документ под интент `условия военной ипотеки`, без превращения в дубль страницы калькулятора.
- **Structure:** утверждена структура из 8 блоков: hero, таблица условий, требования и документы, сумма, сценарии увеличения суммы, банки, порядок оформления, FAQ + CTA.
- **Decision:** переходы на расчет внутри страницы ведут на отдельный route `/kalkulyator-voennoy-ipoteki/` как secondary CTA, а не на локальный главный калькулятор страницы условий.
- **Updated:** hero-логика уточнена после согласования — на первом экране оставлен один главный CTA без раннего перехода в калькулятор; правая часть hero переведена в визуальный summary по НИС 2026 вместо перегруженной текстовой карточки.
- **Checks:** сборка не запускалась, так как правки только в markdown-документах и источниках правды проекта.

### 2026-06-05 — Страница условий: первый экран

- **Updated:** `src/pages/_usloviya-voennoy-ipoteki/01-Hero.astro` — hero пересобран под согласованный коммерческий сценарий.
- **Changed:** усилены H1 и подзаголовок; удалён secondary CTA на калькулятор с первого экрана; proof-row сокращён до 3 фактов.
- **Added:** правая visual-summary card с ориентиром по НИС 2026, ежемесячному эквиваленту и стандартному диапазону суммы без перегруза смысловыми абзацами.
- **Updated:** `pages/PAGE_USLOVIYA_VOENNOY_IPOTEKI.md` — синхронизирован бриф hero после согласования.

### 2026-06-05 — Страница условий: усиление Hero-блока (Architectural Navigator)

- **Updated:** `src/pages/_usloviya-voennoy-ipoteki/01-Hero.astro` — точечные улучшения визуальной и технической строгости.
- **Changed:** микро-копирайтинг: «Нис 2026» → «НИС 2026», «расчётный ориентир по НИС» → «ежемесячный эквивалент НИС».
- **Changed:** адаптивная сетка proof-row переведена на `repeat(auto-fit, minmax(200px, 1fr))` для плавного перестроения на планшетах без сплющивания.
- **Added:** инженерная эстетика тегов в правой карточке: добавлены системные индикаторы (цветные точки) перед текстом тегов.
- **Added:** подключен Motion System: `data-reveal="fade-up"` для левого контента и `data-reveal="fade-in"` для правой карточки.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница условий: блок 02 (Основные условия)

- **Created:** `src/pages/_usloviya-voennoy-ipoteki/02-Conditions.astro` — второй экран страницы.
- **Changed:** вместо скучной HTML-таблицы реализована структурная сетка из 6 карточек-параметров (стиль спецификации Linear/Vercel).
- **Changed:** усилен микро-копирайтинг: добавлены конкретные цифры (411 184,90 ₽, ≈ 34 265 ₽/мес), четкие формулировки («Участники НИС со стажем от 3 лет»).
- **Added:** выделенная акцентная карточка «Что влияет на итоговую сумму» как логический мостик к следующему блоку.
- **Added:** структурный дисклеймер и четкий микро-CTA с переходом на `/kalkulyator-voennoy-ipoteki/`.
- **Updated:** `src/pages/usloviya-voennoy-ipoteki.astro` — добавлен импорт и вызов нового компонента.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница условий: блок 03 (Кто может получить и документы)

- **Created:** `src/pages/_usloviya-voennoy-ipoteki/03-Eligibility.astro` — третий экран страницы.
- **Changed:** реализована двухколоночная структура (десктоп): «Критерии участия» и «Пакет документов» для лучшей сканируемости.
- **Changed:** усилены тексты: конкретизированы сроки («Минимум 3 года непрерывного членства»), возраст и разделены документы на «Базовый пакет» и «Для расширения бюджета» (маткапитал, семейная ипотека).
- **Added:** коммерческий акцент в футере блока: «Даже если вы уже участник НИС... итоговая сумма одобрения зависит от конкретного банка. Не гадайте — рассчитайте свой реальный сценарий» + CTA на калькулятор.
- **Updated:** `src/pages/usloviya-voennoy-ipoteki.astro` — добавлен импорт и вызов нового компонента.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница условий: блок 04 (Сколько можно получить)

- **Created:** `src/pages/_usloviya-voennoy-ipoteki/04-Amount.astro` — четвертый экран страницы.
- **Changed:** компактный, но сильный коммерческий дизайн: крупный темный акцентный блок с базовым ориентиром (2,1–2,3 млн ₽) + сетка 2x2 из «рычагов увеличения суммы».
- **Changed:** усилены тексты: фокус смещен с абстрактного лимита на реальное одобрение («Банк считает не по общей таблице, а под вашу конкретную ситуацию»).
- **Added:** четкий CTA-блок внизу: «Не гадайте по общим цифрам. Введите свои данные и получите точный расчет» + кнопка на калькулятор.
- **Updated:** `src/pages/usloviya-voennoy-ipoteki.astro` — добавлен импорт и вызов нового компонента.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница условий: блок 05 (Как увеличить сумму)

- **Created:** `src/pages/_usloviya-voennoy-ipoteki/05-Scenarios.astro` — пятый экран страницы.
- **Changed:** формат «Меню стратегий»: 4 четкие карточки (собственные средства, маткапитал, семейная ипотека, два участника НИС) вместо длинных абзацев.
- **Changed:** усилены тексты: фокус на расширении бюджета и решении задачи, а не на абстрактных возможностях.
- **Added:** внутренняя ссылка на `/semeynaya-voennaya-ipoteka/` в соответствующей карточке, как предусмотрено брифом.
- **Refined:** CTA в футере блока полностью переработан для максимального визуального веса: заменен бледный футер на контрастный темный блок (`var(--color-bg-dark)`) с радиальным градиентным акцентом, крупной типографикой и анимированной стрелкой на кнопке при наведении. Текст усилен: «Узнайте ваш реальный бюджет на покупку».
- **Fixed:** заменены иконки доллара ($) на корректный значок рубля (₽) во всех финансовых карточках страницы (`02-Conditions`, `04-Amount`, `05-Scenarios`).
- **Updated:** `src/pages/usloviya-voennoy-ipoteki.astro` — добавлен импорт и вызов нового компонента.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница условий: блок 06 (Какие банки дают военную ипотеку)

- **Created:** `src/pages/_usloviya-voennoy-ipoteki/06-Banks.astro` — шестой экран страницы.
- **Changed:** вместо скучной таблицы реализована экспертная матрица выбора: 4 карточки банков (ПСБ, Сбер, ВТБ, Банк РОССИЯ) с четким указанием их реального конкурентного преимущества, а не просто абстрактных цифр.
- **Changed:** усилен коммерческий текст: «Не существует одного лучшего банка для всех... Наша задача — подобрать банк, который одобрит именно вашу ситуацию».
- **Added:** мощный темный CTA-блок внизу с радиальным акцентом и текстом: «Максимальная сумма — не главный критерий. Я помогу выбрать банк, который даст реальное одобрение именно под ваши параметры» + кнопка «Подобрать банк под мою ситуацию».
- **Updated:** `src/pages/usloviya-voennoy-ipoteki.astro` — добавлен импорт и вызов нового компонента.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница условий: блок 07 (Порядок оформления)

- **Created:** `src/pages/_usloviya-voennoy-ipoteki/07-Process.astro` — седьмой экран страницы.
- **Changed:** вместо скучного списка реализован вертикальный «инженерный» таймлайн с 7 четкими шагами (от проверки НИС до регистрации), соединенными градиентной линией.
- **Changed:** усилен коммерческий текст: акцент на том, что я беру на себя координацию, чтобы клиент просто приходил на подписание, а не пытался пройти маршрут в одиночку.
- **Added:** финальный темный CTA-блок с призывом: «Не пытайтесь пройти этот маршрут в одиночку... Давайте начнем с первого шага» + кнопка «Начать с первичного разбора».
- **Updated:** `src/pages/usloviya-voennoy-ipoteki.astro` — добавлен импорт и вызов нового компонента.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница условий: блок 08 (FAQ + финальный CTA)

- **Created:** `src/pages/_usloviya-voennoy-ipoteki/08-FAQ.astro` — финальный восьмой экран страницы.
- **Changed:** реализован нативный HTML-аккордеон (`<details>`/`<summary>`) для идеальной SEO-индексации (FAQPage schema) без тяжелого JS.
- **Changed:** добавлены 8 обязательных вопросов из брифа с короткими, сильными и коммерчески выверенными ответами (сумма, платеж, банки, увеличение бюджета, вторичка, дом, свои деньги, калькулятор vs консультация).
- **Added:** финальный темный CTA-блок с двумя путями: основная кнопка «Получить разбор моей ситуации» и вторичная «Сначала рассчитать сумму в калькуляторе».
- **Updated:** `src/pages/usloviya-voennoy-ipoteki.astro` — добавлен импорт и вызов нового компонента. Страница полностью собрана по брифу.
- **Refined:** проведена полная вычитка текстов всех 8 блоков страницы. Заменено повествование от первого лица единственного числа («Я помогу», «Я проверю») на множественное от лица компании/команды («Мы поможем», «Мы проверим», «Мы берем на себя координацию»), чтобы корректно отражать роль Михаила как руководителя проекта, а не единственного исполнителя.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-06 — Страница условий: доработка блока 06 (Банки)

- **Changed:** усилен коммерческий посыл заголовка и лида. Новый H2: «Какие банки дают военную ипотеку: подбираем условия под вашу задачу, а не под рекламу». Новый лид делает акцент на реальных скрытых лимитах и цели получить деньги на квартиру, а не отказ из-за формальностей.
- **Fixed:** исправлен критический баг мобильной версии кнопки CTA в этом блоке. Добавлены `white-space: normal`, уменьшены боковые паддинги и настроен `line-height`, чтобы длинный текст кнопки аккуратно переносился и не вылезал за границы экрана (375px).
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-06 — Страница условий: Mobile Compact Mode (оптимизация адаптива)

- **Changed:** проведена агрессивная компактификация мобильной версии всех 8 блоков страницы без потери смыслов.
- **Changed (04-Amount, 05-Scenarios):** сетки факторов и сценариев переведены из 1 колонки в 2 колонки на мобильном (`grid-template-columns: 1fr 1fr`), что экономит ~40% высоты экрана.
- **Changed (07-Process):** таймлайн сжат: уменьшены отступы между шагами, размер маркеров (20x20px) и шрифты описаний.
- **Changed (02, 03, 06, 08):** повсеместно уменьшены внутренние паддинги карточек (до 16px), `gap` между элементами (до 8-12px) и размеры шрифтов второстепенного текста (до 12-13px с `line-height: 1.3-1.4`).
- **Result:** на экране 375px страница теперь воспринимается как плотный, структурированный дашборд, а не как бесконечная лента, при этом все CTA-кнопки остались крупными и удобными для тапа.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-06 — Главная страница: усиление финального CTA-блока

- **Changed (Копирайтинг):** тексты финального блока приведены в строгое соответствие с правилами АМС. Убраны абстрактные формулировки. Новый H2: «Начните с разбора задачи, а не с каталога квартир». Новый подзаголовок четко объясняет ценность шага от первого лица: «Я уточню, для чего вы покупаете квартиру... и подскажу самый разумный следующий шаг. Это ни к чему вас не обязывает».
- **Changed (Дизайн):** усилен визуальный вес блока. Eyebrow-текст теперь окрашен в акцентный цвет. Ссылки «Полезные страницы» получили микро-анимацию сдвига при наведении (`translateX`), что добавляет интерактивности.
- **Changed (Mobile Compact):** мобильная версия блока оптимизирована: уменьшены отступы, шрифты статистики и ссылок адаптированы под 13px, кнопка CTA растянута на 100% ширины для удобного тапа.
- **Updated:** `src/pages/_home/12-FinalCTA.astro` и `src/components/sections/FinalCTA.astro`.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-06 — Исправление выравнивания мессенджеров (Telegram / Max)

- **Fixed:** устранена проблема «кривого» переноса ссылок на мессенджеры в блоках призыва к действию (FinalCTA на главной и на странице контактов).
- **Changed:** ссылки «Telegram» и «Max» теперь сгруппированы в единый неразрывный контейнер (`flex-wrap: nowrap`) с аккуратным разделителем `/`. Добавлено свойство `white-space: nowrap` для всех классов кнопок/ссылок мессенджеров, что гарантирует их отображение строго в одну строку на любых разрешениях экрана (от десктопа до 320px mobile), предотвращая разрыв слов.
- **Updated:** `src/components/sections/FinalCTA.astro`, `src/pages/_contacts/01-Hero.astro`, `src/pages/_contacts/04-FinalCTA.astro`.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-06 — Страница калькулятора: унификация финального CTA

- **Changed:** кастомный блок `06-CTA.astro` на странице калькулятора заменен на единый компонент `<FinalCTA>`, используемый на главной странице. Это обеспечивает строгую визуальную и поведенческую консистентность (единый стиль, анимации, mobile compact mode).
- **Changed:** тексты адаптированы под интент калькулятора: eyebrow «ТОЧНЫЙ РАСЧЁТ», заголовок «Получите точный расчёт под вашу ситуацию».
- **Changed:** блок «Полезные страницы» обновлен на релевантные для калькулятора: «Условия военной ипотеки в 2026 году» и «Семейная военная ипотека».
- **Updated:** `src/pages/_kalkulyator-voennoy-ipoteki/06-CTA.astro`.
- **Checks:** `pnpm build` passes with 0 errors, 0 warnings.

### 2026-06-05 — Страница калькулятора: route + hero + навигация

- **Created:** `src/pages/kalkulyator-voennoy-ipoteki.astro` — новый route страницы калькулятора.
- **Created:** `src/pages/_kalkulyator-voennoy-ipoteki/pageData.ts` — meta и schema новой страницы.
- **Created:** `src/pages/_kalkulyator-voennoy-ipoteki/01-Hero.astro` — первый экран с рабочим расчетным блоком, CTA и result-summary.
- **Updated:** `src/lib/navigation/navData.ts` — калькулятор добавлен в общую навигацию для карты сайта и футера, но исключен из верхнего меню.
- **Updated:** `src/components/layout/RouteMapOverlay.astro` — добавлены карточка и иконка калькулятора.
- **Updated:** `SITE_ARCHITECTURE.md` — зафиксирован новый URL и папка секций страницы.
- **Checks:** `pnpm build` passes with 0 errors and 0 warnings; по собранному HTML подтверждено, что ссылка на калькулятор есть в карте сайта и футере, но отсутствует в верхнем desktop-menu.

### 2026-06-05 — Бриф страницы калькулятора

- **Created:** `pages/PAGE_KALKULYATOR_VOENNOY_IPOTEKI.md` — утвержденный бриф новой страницы `/kalkulyator-voennoy-ipoteki/`.
- **Decision:** страница зафиксирована как универсальная расчетная SEO-страница без жесткой привязки к Краснодару или Крыму в H1 и первом экране.
- **Structure:** утверждена короткая структура из 6 блоков: hero + калькулятор, explainer, базовые ориентиры, сценарии покупки, FAQ, финальный CTA.
- **Scaffold:** создана рабочая папка `src/pages/_kalkulyator-voennoy-ipoteki/` под будущую сборку секций.
- **Checks:** сборка не запускалась, так как правки только в markdown-документах и организационной структуре.

### 2026-06-05 — Wordstat / Семантика

- **Research:** собрана Wordstat-семантика через `mcp__yandex_searchapi` по кластерам:
  - новостройки Краснодар;
  - военная ипотека Краснодар;
  - Краснодарский край;
  - Крым;
  - калькулятор военной ипотеки;
  - брендовый слой `Военный навигатор`.
- **Created:** `SEMANTICS.md` — большой обзор по кластерам, интентам, динамике спроса и рекомендациям по архитектуре сайта.
- **Updated:** `PASSPORT_PROJECTS.md` — добавлен `SEMANTICS.md` в список источников правды и обязательного чтения для SEO/контентных задач.
- **Key finding:** буквальный спрос на `купить новостройку по военной ипотеке` слабый, а основной реальный спрос идёт через формулировки `военная ипотека краснодар`, `квартиры по военной ипотеке`, `ипотека краснодар новостройки`, `новостройки крыма`, `калькулятор военной ипотеки`.
- **Key finding:** по Крыму спрос распадается на отдельные городские кластеры, прежде всего Севастополь и Симферополь.
- **Checks:** изменений в коде сайта нет; сборка не запускалась, так как правки только в markdown-документах.

### 2026-06-04 — Sprint 2+3: Local fonts + Image pipeline + Motion system + Analytics

- **Local fonts:** заменён Google Fonts CDN на локальный `InterVariable.woff2` в `public/fonts/`.
  - `BaseLayout.astro`: preload + `@font-face` с `font-display: swap`.
  - Fallback metrics: `ascent-override: 91.59%`, `descent-override: 22.81%`, `size-adjust: 105.77%` (Arial fallback).
- **Image pipeline:** `OptimizedImage.astro` обновлён — поддержка `astro:assets` Image для импортов, fallback `<img>` для external/public путей.
  - Добавлен `style` prop, LQIP placeholder, `onerror` handler.
  - Заменены raw `<img>` на `<OptimizedImage>` в 5 ключевых файлах:
    - `01-Hero.astro` (hero portrait)
    - `08-Trust.astro` (trust photo)
    - `03-Scenarios.astro` (krasnodar cards)
    - `02-Hero.astro` (leadgen hero)
    - `04-Trust.astro` (leadgen expert)
- **Motion system:** добавлен `RevealOnScroll.astro` + CSS `data-reveal` утилиты + inline JS в `BaseLayout.astro`.
  - Modes: `fade-up`, `fade-in`, `stagger` (с задержками и threshold).
  - `prefers-reduced-motion: reduce` — отключает анимации.
  - Обёрнуты секции: `02-ShortAnswer`, `03-Problem`, `04-Scenarios`, `05-Method`.
- **Hover shifts:** scenario rows (`04-Scenarios.astro`) — `translateX(4px)` на hover обёрнут в `@media (hover: hover) and (pointer: fine)`.
- **Accessibility:** добавлены `aria-label` для footer-ссылок (Telegram, VK).
- **Analytics layer:** unified `src/lib/analytics.ts` — type-safe обёртка над `ym`.
  - Event map: `modal_open`, `lead_submit`, `faq_open`, `page_scroll_50`, `page_scroll_90`, `phone_click`, `messenger_click`, `cta_click`, `nav_map_open`, `nav_map_close`.
  - Заменены прямые `window.ym` вызовы в `RequestModal.tsx` и `LeadGenRequestModal.tsx` на `track()`.
  - Scroll depth tracking (50% / 90%) — inline JS в `BaseLayout.astro`.
  - FAQ open tracking — inline JS в `11-FAQ.astro`.
  - Global click tracking для `data-track` атрибутов — phone, messenger clicks в Footer.
  - `meta[name="ym-counter-id"]` в `BaseLayout.astro` для доступа inline скриптов к counter ID.
- **CI/CD:** обновлён `.github/workflows/deploy-ams.yml` — pnpm `10.33.2` → `11.5.1`, `CI=true pnpm install --frozen-lockfile`.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings; 15 pages.
- **Next:** WCAG checklist (skip links, heading hierarchy audit), astro-compress (после решения pnpm store conflict).

### 2026-06-04

- **GEO Optimization:** реализована Generative Engine Optimization для AI-поисковиков.
  - Добавлен `src/pages/llms.txt.ts` — авто-генерируемый Markdown для AI-краулеров.
  - Обновлён `public/robots.txt` — разрешены 6 AI-ботов (ChatGPT, Perplexity, Claude, GPTBot, OAI-SearchBot, Google-Extended).
  - Расширен `src/lib/seo.ts` — `WebSite` schema + расширенная `Organization` (`logo`, `sameAs`, `founder`).
  - Добавлен `<link rel="alternate" type="text/plain" href="/llms.txt">` в `BaseLayout.astro`.
  - Добавлен `scripts/geo-check.mjs` — пост-билд аудит GEO (скор 90/100, порог 80).
- **Infra:** портированы Astro Starter improvements — `utils.ts`, `validation.ts`, `OptimizedImage.astro`, `ScriptLoader.astro`, `CookieToggle.tsx`, `useEmailQueryParam.ts`, `leads.ts`, `og.ts`, расширенные constants, font fallback в BaseLayout, fallback modal в PageLayout.
- **Build:** `pnpm build` passes with 0 errors, 0 warnings; 13 pages.
- **Deployed:** commit `f956fc8` pushed to `main`, GitHub Actions → AMS Server.
- **Updated:** `PASSPORT_PROJECTS.md` — добавлены секции «Инфраструктурные улучшения» и «GEO Optimization».

### 2026-06-01

- Done: removed local AI/Astro build instruction duplicates: `ASTRO_RULES_CORE.md`, `CLAUDE.md`, `BUILD_INSTRUCTIONS.md`, `BUILD_PHASE_1_FOUNDATION.md`, `BUILD_PHASE_2_PAGES.md`, `BUILD_PHASE_3_FINAL.md`.
- Done: updated `PASSPORT_PROJECTS.md`; Astro build methodology now points to the global Codex/AI-SYSTEM rules instead of local project files.

### 2026-06-01

- Done: created `PASSPORT_PROJECTS.md` with local project context, sources of truth, form/API caution and journaling rules.
- Done: removed local `AGENTS.md` according to the global Codex rule that only `C:\Users\User\.codex\AGENTS.md` keeps that name.
- Next: before the next code edit, update active references in README/docs if they still point to the old local file name.

### 2026-05-25

- Done: started rebuild of `/voennaya-ipoteka-krasnodar/` from the new commercial brief `pages/PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md`.
- Done: rebuilt the hero around the clean SEO H1 "Квартиры в Краснодаре по военной ипотеке" and the lead offer "подборка 12 проверенных ЖК".
- Done: redesigned the right-side hero visual as a catalog/PDF preview and removed large background section numbers from the rebuilt block.
- Done: adapted the mobile hero: one primary CTA, no secondary CTA, no proof rows before the visual, catalog preview kept immediately after the button.
- Done: replaced the weak short-answer block with a full commercial second screen: "Что будет внутри подборки 12 ЖК" with a document-style catalog contents preview.
- Done: added restrained CSS motion to the second block: staggered document rows, desktop hover highlight, and `prefers-reduced-motion` fallback.
- Done: saved the agreed direction for the next block in `pages/PAGE_VOENNAYA_IPOTEKA_KRASNODAR.md`: 3 real ЖК examples from the подборка, with scenarios "для жизни с семьёй", "под инвестицию", and "в сформированном районе"; no "я" tone and no "переезд позже" wording.
- Checked: `pnpm build` passes with 0 errors and 0 warnings; 375px mobile has no horizontal overflow.

### 2026-05-22

- Done: read project and vault instructions, project architecture/design docs, package/config, source tree, page structure, and lead handling code.
- Checked: `git status --short` is clean before worklog creation; `pnpm build` passes with 13 static pages.
- Noted: no `WORKLOG.md` existed, so created this journal and `_worklog/archive/` according to vault rules.
- Next: wait for the specific edit/task; use the relevant PAGE brief as the source of truth before touching code.

### 2026-05-25 - Краснодар / видеооффер

- Done: strengthened the first and second screens around the updated content offer: "12 ЖК с видеоразбором", scenarios for life/rent/investment, and checking concrete flats inside each ЖК.
- Changed: hero lead, primary CTA, catalog preview captions, proof row, second block heading, CTA, document rows, and document footer.
- Checked: `pnpm build` passes with 0 errors and 0 warnings; browser check at 1440px and 375px shows no horizontal overflow.
- Done: added the third screen `03-Scenarios.astro` for `/voennaya-ipoteka-krasnodar/`: 3 purchase scenarios for family life, rent, and investment, with a 5/7 scenario-board composition and CTA.
- Checked: `pnpm build` passes; browser check at 1440px, 768px, and 375px shows the scenarios block renders without horizontal overflow.
- Changed: converted the third screen to a dark accent section with dark-elevated scenario board, on-dark typography, subtle grid, and blue scenario accents.
- Checked: `pnpm build` passes; browser check at 1440px and 375px confirms dark colors render and no horizontal overflow appears.
- Changed: simplified the third screen scenario cards: shorter titles/texts, removed extra explanatory offer lines, and tightened card spacing for cleaner scanning.
- Checked: `pnpm build` passes; browser check at 1440px and 375px confirms cleaner cards and no horizontal overflow.
- Changed: rebuilt the third screen as a premium "Что войдет в подборку" block with three visual ЖК preview cards, removed the matrix wording, and replaced visible "сценарий" wording on the Краснодар route with goal/purpose language.
- Fixed: corrected the third screen responsive grid so the three preview cards collapse into full-width cards on mobile instead of squeezing into three narrow columns.

### 2026-05-25 - Typography standard

- Done: applied the AMS typography scale in `src/styles/global.css` and added the requested mobile overrides for `--fs-display`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-body`, and `--fs-body-sm`.
- Changed: normalized elevated local `font-size` declarations across page sections, technical pages, leadgen components, quiz/review UI, and shared CTA/layout components to project typography tokens.
- Kept: decorative large sizes such as 404/section markers, catalog cover number, metric number, emoji/icon marks, and legal-card background numbers.
- Checked: `pnpm build` passes with 0 errors and 0 warnings; no `pnpm preflight` script exists in `package.json`.
- Changed: expanded the typography system with semantic aliases, `.vn-type-*` utilities, line-height tokens, and a documented `type-exception` rule in `AGENTS.md` so future exceptions are explicit and easier to audit.
