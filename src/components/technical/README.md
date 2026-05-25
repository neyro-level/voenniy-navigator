# AMS Technical Suite

Единый переносимый модуль технических страниц и юридического слоя стартера.

## Что входит

- `pages/ConsentPage.astro` - согласие на обработку персональных данных.
- `pages/PrivacyPage.astro` - политика обработки персональных данных.
- `pages/CookiesPage.astro` - правила использования cookie.
- `pages/ThanksPage.astro` - универсальная страница после заявки.
- `technicalManifest.ts` - единый список технических URL и ссылок правового раздела подвала.

Cookie-виджет находится в `src/components/ui/CookieBanner.tsx`, но относится к этому же техническому стандарту и подключается глобально через `PageLayout.astro`.

## Как переносить в соседний проект

1. Скопировать папку `src/components/technical/`.
2. Скопировать или сверить `src/components/ui/CookieBanner.tsx` и `src/styles/cookie-banner.css`.
3. Создать тонкие route-файлы:
   - `src/pages/soglasie.astro`
   - `src/pages/politika.astro`
   - `src/pages/cookies.astro`
   - `src/pages/thanks.astro`
4. Подключить `CookieBanner` в `PageLayout.astro`.
5. В подвале брать правовые ссылки из `FOOTER_LEGAL_LINKS`.

## Что можно менять

Только клиентские данные и placeholder:

- данные Оператора;
- контакты;
- реквизиты;
- даты редакции;
- региональный Роскомнадзор;
- значения `POLICY_*`.

Тексты документов, структура страниц, cookie-баннер, `/thanks/` и правовой раздел подвала по умолчанию не переписываются.

