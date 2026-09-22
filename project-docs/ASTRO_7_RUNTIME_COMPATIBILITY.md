# Astro 5 → Astro 7: граница TypeScript

Дата проверки: 2026-09-22  
Связанный план: `VN-ASTRO7-2026 v5`, EPIC-02 / E02-T03

## Решение

До прямой миграции на Astro 7 проект остаётся на TypeScript 5. TypeScript 6
не устанавливается с peer-override и не подменяется через lockfile.

## Воспроизводимое доказательство

`pnpm why` показывает, что текущий `astro@5.18.1` использует:

- `tsconfck@3.1.6` с peer range `typescript: ^5.0.0`;
- `zod-to-ts@1.2.0` с peer range `typescript: ^4.9.4 || ^5.0.2`.

В `pnpm-lock.yaml` эти пакеты разрешены с `typescript@5.9.3`. Поэтому
TypeScript 6 до обновления Astro создаёт неподдерживаемую peer-комбинацию.

## Официальная совместимость

- TypeScript 6 — стабильный переходный релиз: <https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/>.
- TypeScript 7 пока не подходит для встроенных языковых инструментов Astro;
  официальная рекомендация для Astro — TypeScript 6:
  <https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/>.

## Передача в EPIC-03

1. Сначала выбрать совместимую матрицу Astro 7 и официальных интеграций.
2. Выполнить миграцию Astro 5 → 7 без peer-override.
3. Только после успешных Astro 7 diagnostics установить TypeScript 6 и
   совместимую версию `@astrojs/check`.

TypeScript 7 остаётся вне этого migration scope.
