# COMPONENT_LOGO.md

**Проект:** Военный навигатор — Михаил Хряпин
**Версия:** 1.0
**Дата:** 2026-05-12
**Знак:** Corner Brackets + пунктирный круг + синяя точка

---

## 1. Концепция знака

**Угловые скобки** — L-образные линии по четырём углам — это язык дизайн-системы «Architectural Navigator». Тот же элемент используется как декоративный на карточках сайта (corner brackets на Hero и overlay-карточках). Логотип вырастает из дизайн-системы органично, а не навязывается ей.

**Пунктирный круг** — едва заметный направляющий элемент. Намёк на прицел, орбиту, маршрут.

**Синяя точка (#2563EB)** — единственный цветной акцент. Цель, объект, точка маршрута. Тот же цвет что CTA-кнопки сайта.

---

## 2. Файлы логотипа

### Структура в проекте

```
public/
├── logo-mark.svg          ← знак без текста (для фавикона и мобильного хедера)
├── logo-light.svg         ← полный логотип на светлом фоне
├── logo-dark.svg          ← полный логотип на тёмном фоне
└── favicon.svg            ← фавикон с пульсирующей точкой
```

---

## 3. SVG-файлы (финальный код)

### /public/logo-mark.svg (знак, 40×40, на светлом фоне)

```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Военный навигатор — знак</title>
  <!-- Пунктирный круг -->
  <circle cx="20" cy="20" r="9"
    stroke="#0F2547" stroke-width="0.7"
    stroke-dasharray="2.2 2.2" />
  <!-- Скобки -->
  <path d="M7 13 L7 7 L13 7"
    stroke="#0F2547" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 7 L33 7 L33 13"
    stroke="#0F2547" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 27 L7 33 L13 33"
    stroke="#0F2547" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 33 L33 33 L33 27"
    stroke="#0F2547" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Центральная точка -->
  <circle cx="20" cy="20" r="2.8" fill="#2563EB"/>
</svg>
```

---

### /public/logo-mark-dark.svg (знак для тёмного фона)

```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Военный навигатор — знак (тёмный фон)</title>
  <circle cx="20" cy="20" r="9"
    stroke="rgba(241,243,245,0.22)" stroke-width="0.7"
    stroke-dasharray="2.2 2.2" />
  <path d="M7 13 L7 7 L13 7"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 7 L33 7 L33 13"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 27 L7 33 L13 33"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M27 33 L33 33 L33 27"
    stroke="rgba(241,243,245,0.75)" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="20" cy="20" r="2.8" fill="#2563EB"/>
</svg>
```

---

### /public/favicon.svg (пульсирующий фавикон, тёмный фон)

```svg
<svg width="32" height="32" viewBox="0 0 32 32"
  fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Военный навигатор</title>

  <!-- Тёмный фон с лёгким скруглением -->
  <rect width="32" height="32" rx="5" fill="#0F1419"/>

  <!-- Пунктирный круг (едва заметен) -->
  <circle cx="16" cy="16" r="7"
    stroke="rgba(241,243,245,0.14)" stroke-width="0.6"
    stroke-dasharray="1.8 1.8"/>

  <!-- Угловые скобки — белые -->
  <path d="M5 10 L5 5 L10 5"
    stroke="rgba(241,243,245,0.82)" stroke-width="1.4"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 5 L27 5 L27 10"
    stroke="rgba(241,243,245,0.82)" stroke-width="1.4"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 22 L5 27 L10 27"
    stroke="rgba(241,243,245,0.82)" stroke-width="1.4"
    stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 27 L27 27 L27 22"
    stroke="rgba(241,243,245,0.82)" stroke-width="1.4"
    stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Синяя точка — пульсирует -->
  <circle cx="16" cy="16" r="2.5" fill="#2563EB">
    <animate
      attributeName="r"
      values="2.5;3.8;2.5"
      dur="2.4s"
      repeatCount="indefinite"
      calcMode="spline"
      keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
    <animate
      attributeName="opacity"
      values="1;0.5;1"
      dur="2.4s"
      repeatCount="indefinite"
      calcMode="spline"
      keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
  </circle>

</svg>
```

---

## 4. Подключение в Astro

### BaseLayout.astro — ссылки на фавикон

```astro
<head>
  <!-- SVG favicon (поддерживается Chrome, Firefox, Safari 17+) -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <!-- Fallback PNG для старых браузеров -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <!-- Apple Touch Icon (без пульсации) -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
</head>
```

> ⚠️ PNG-фавиконы нужно экспортировать из SVG в 16×16 и 32×32 как fallback. Пульсация работает только в SVG-версии. Safari ≤16 использует fallback-PNG без анимации — это норм.

---

## 5. Использование знака в Astro-компонентах

### Header.astro — светлая версия (на bg/primary)

```astro
<a href="/" class="vn-header__logo" aria-label="Военный навигатор — на главную">
  <!-- Знак (inline SVG для управления цветом через CSS) -->
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none"
       class="vn-logo-mark" aria-hidden="true">
    <circle cx="20" cy="20" r="9"
      stroke="var(--logo-bracket-color, #0F2547)"
      stroke-width="0.7" stroke-dasharray="2.2 2.2"/>
    <path d="M7 13 L7 7 L13 7"
      stroke="var(--logo-bracket-color, #0F2547)"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27 7 L33 7 L33 13"
      stroke="var(--logo-bracket-color, #0F2547)"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 27 L7 33 L13 33"
      stroke="var(--logo-bracket-color, #0F2547)"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27 33 L33 33 L33 27"
      stroke="var(--logo-bracket-color, #0F2547)"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="20" cy="20" r="2.8" fill="#2563EB"/>
  </svg>

  <div class="vn-header__logo-text">
    <span class="vn-header__brand">Военный навигатор</span>
    <span class="vn-header__name">Михаил Хряпин</span>
  </div>
</a>
```

### CSS — переключение цвета знака через CSS-переменную

```css
/* Светлый хедер (default) */
.vn-header__logo {
  --logo-bracket-color: #0F2547;
}

/* Тёмный хедер (overlay open) */
[data-overlay="true"] .vn-header__logo {
  --logo-bracket-color: rgba(241, 243, 245, 0.75);
}

/* Типографика */
.vn-header__brand {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: var(--color-text-primary);
}
.vn-header__name {
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  transition: opacity 300ms;
}

/* В dock-режиме имя скрывается */
[data-state="dock"] .vn-header__name {
  opacity: 0;
  height: 0;
  overflow: hidden;
}
```

---

## 6. Правила использования

| Правило | Описание |
|---|---|
| Минимальный размер знака | 24px × 24px |
| Минимальный размер полного логотипа | знак 28px + текст |
| Зазор (clear space) | со всех сторон ≥ ½ высоты знака |
| Цвет точки | всегда #2563EB — никогда не менять |
| Деформация | не растягивать, не менять пропорции |
| На сложном фоне | только на однотонных: bg/primary, bg/dark, bg/surface, accent/primary |
| Монохром | убирается пунктирный круг, знак становится только скобки + точка |

---

## 7. PNG-фавиконы (для экспорта)

Необходимо экспортировать из `favicon.svg` (без анимации) в:

- `favicon-32x32.png` — 32×32px
- `favicon-16x16.png` — 16×16px
- `apple-touch-icon.png` — 180×180px (тёмный фон, скобки белые, точка синяя, rx=40)

Инструмент: [realfavicongenerator.net](https://realfavicongenerator.net) или Figma → Export.

---

**Конец COMPONENT_LOGO.md v1.0**
