# LeadGen module

Закрытый модуль для промо-лендингов лидогенерации.

## Состав

- `LeadGen.astro` - общая обвязка: подвал, нижнее мобильное меню, заявочная форма, cookie.
- `LeadGenLanding.astro` - единый закрытый трехэкранный лендинг лидогенерации.
- `LeadGenRequestModal.tsx` - модальная заявочная форма с редиректом на `/podbor/thanks/`.
- `LeadGenThanksPage.astro` - отдельная noindex-страница спасибо для лидогенерации.
- `LeadGenFooter.astro` - подвал модуля.
- `LeadGenBottomCTA.astro` - короткое нижнее меню для мобильной версии.
- `LeadGenMiniHeader.astro` - короткий верхний header текущего эталонного лендинга.
- `sections/` - экраны эталонного лендинга.

## Текущий эталон

Страница `/podbor/` - образцовый трехэкранный лендинг:

1. Hero.
2. Benefits.
3. Expert / video review.

Страница и `/podbor/thanks/` закрыты от SEO через `noindex`.
