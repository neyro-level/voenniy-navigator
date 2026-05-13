# ASTRO_RULES_CORE.md

**Читать:** в каждой сессии Claude Code, перед любым кодом.
**Объём:** только критичные правила. Детали — в ASTRO_RULES.md.

---

## 1. КОМПОНЕНТНАЯ ДЕКОМПОЗИЦИЯ — ЖЁСТКОЕ ПРАВИЛО

```
КАЖДАЯ СЕКЦИЯ СТРАНИЦЫ = ОТДЕЛЬНЫЙ .astro ФАЙЛ

✅ ПРАВИЛЬНО:
src/pages/index.astro              ← только импорты
src/pages/_home/01-Hero.astro
src/pages/_home/02-ShortAnswer.astro
src/pages/_home/03-Problem.astro
...

✗ ЗАПРЕЩЕНО:
src/pages/index.astro              ← 800 строк всё в одном
```

**Файл страницы содержит ТОЛЬКО:**
```astro
---
import Hero from './_home/01-Hero.astro'
import ShortAnswer from './_home/02-ShortAnswer.astro'
---
<Hero />
<ShortAnswer />
```

---

## 2. ТИПОГРАФИКА — ЖЁСТКИЕ ПРАВИЛА

### Висячие строки — ЗАПРЕЩЕНЫ

Одно слово на строке в конце заголовка или абзаца — профессиональная ошибка.

```css
/* global.css — применять ко ВСЕМ текстам */
h1, h2, h3, h4 { text-wrap: balance; }
p, li, blockquote { text-wrap: pretty; }
```

**Ручная защита для критичных H1/H2:**
```astro
<!-- Плохо: "задачу" одно на строке -->
<h1>Военная ипотека в Краснодаре: новостройки под задачу</h1>

<!-- Хорошо: последние два слова неразрывны -->
<h1>Военная ипотека в Краснодаре: новостройки под&nbsp;задачу</h1>
```

### Числа и адреса — неразрывно

```astro
65&nbsp;сделок
+7&nbsp;(938)&nbsp;407-44-57
с&nbsp;2016&nbsp;года
ул.&nbsp;Кубанская Набережная,&nbsp;33
```

### Проверять на: 375px / 768px / 1280px / 1440px

---

## 3. ДИЗАЙН-ТОКЕНЫ — ТОЛЬКО ПЕРЕМЕННЫЕ

```css
/* ✅ Правильно */
background: var(--color-bg-dark);
color: var(--color-text-ondark);
border-color: var(--color-border-ondark);

/* ✗ Запрещено */
background: #0F1419;
color: #F1F3F5;
```

**Исключение:** цвета из BRANDBOOK.md (#9E0707) в блоках АМС на /prezentaciya/ — допустимо.

---

## 4. ЗАПРЕТЫ

```
✗  jQuery, Bootstrap, Vue, Angular
✗  inline hex-цвета вместо токенов
✗  React там где достаточно Astro + vanilla JS
✗  position:fixed внутри React-компонентов
✗  Дублировать навигационные данные — только navData.ts
✗  Монолитные страницы в одном файле
✗  <br> в заголовках (кроме намеренных дизайнерских решений)
✗  word-break: break-all на заголовках
✗  Фиксированная height на текстовых блоках
```

---

## 5. ИЗОБРАЖЕНИЯ

```astro
<!-- Hero (первый экран) — eager обязательно -->
<Image src="/images/mikhail-hero.jpg"
       alt="Михаил Хряпин — навигатор по военной ипотеке"
       width={480} height={580}
       loading="eager" />

<!-- Все остальные — lazy -->
<Image src="/images/zhk-1.jpg"
       alt="ЖК Краснодар по военной ипотеке"
       loading="lazy" />

<!-- Яндекс.Карты iframe — lazy -->
<iframe loading="lazy" title="Офис в Краснодаре" .../>

<!-- Заглушка пока нет реального фото -->
<PhotoPlaceholder type="building" height="280px" filename="zhk-1.jpg" />
```

---

## 6. ДОСТУПНОСТЬ — МИНИМУМ

```astro
<!-- Icon-only кнопки — обязательно aria-label -->
<button aria-label="Закрыть меню">
  <Icon name="x" />
</button>

<!-- Социальные ссылки — обязательно aria-label -->
<a href="https://t.me/..." aria-label="Telegram Михаила Хряпина">

<!-- Декоративные элементы -->
<svg aria-hidden="true">...</svg>

<!-- Touch targets ≥ 44px -->
.vn-nav-link { min-height: 44px; min-width: 44px; }

<!-- Focus visible -->
*:focus-visible { outline: 2px solid var(--color-accent-cta); }
```

---

## 7. АНИМАЦИИ

```css
/* Всегда добавлять prefers-reduced-motion */
@keyframes vn-seek { ... }

.vn-animated { animation: vn-seek 3s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .vn-animated { animation: none; }
}
```

---

## 8. SEO — ОБЯЗАТЕЛЬНЫЙ МИНИМУМ

На каждой индексируемой странице:
```astro
<!-- В BaseLayout.astro -->
<title>{title}</title>  <!-- 50-60 символов -->
<meta name="description" content={description} />  <!-- 140-160 символов -->
<link rel="canonical" href={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />

<!-- JSON-LD минимум -->
<script type="application/ld+json">
  { BreadcrumbList }
</script>
```

```
Один H1 на странице — всегда.
FAQ — details/summary (не JS-только), видны в DOM.
Alt на всех img — всегда.
```

---

## 9. NAMESPACE

Все CSS-классы: `vn-{component}-{element}`

```css
.vn-header { }
.vn-header__logo { }
.vn-hero { }
.vn-hero__title { }
.vn-footer__legal { }
.vn-footer__dev-link { }
```

---

## 10. КАЧЕСТВО ПЕРЕД КАЖДЫМ КОММИТОМ

```
□  pnpm build — 0 errors
□  Нет висячих строк (проверить на 375px)
□  Нет [PLACEHOLDER] в тексте
□  Alt на всех img
□  Один H1 на странице
□  Нет горизонтального скролла на 375px
```

---

**Детальные правила, паттерны и примеры → ASTRO_RULES.md**

---

**Конец ASTRO_RULES_CORE.md v1.0**
