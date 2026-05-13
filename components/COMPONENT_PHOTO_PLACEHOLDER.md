# COMPONENT_PHOTO_PLACEHOLDER.md

**Компонент:** PhotoPlaceholder.astro
**Файл:** `src/components/ui/PhotoPlaceholder.astro`
**Назначение:** Брендированная заглушка до появления реального фото.
Когда фото готово — компонент заменяется на `<Image>` одной строкой.

---

## Карта всех фотографий проекта

| ID | Файл | Страница / блок | Статус | Заглушка |
|---|---|---|---|---|
| `mikhail-hero` | `public/images/mikhail-hero.jpg` | Главная Hero, /voennaya-ipoteka-krasnodar/ Hero | ✅ Готово | — |
| `mikhail-form` | `public/images/mikhail-form.jpg` | Попап формы (аватар) | ✅ Готово | — |
| `zhk-1` | `public/images/zhk-1.jpg` | /voennaya-ipoteka-krasnodar/ Блок 04 карточка 1 | ⏳ Позже | building |
| `zhk-2` | `public/images/zhk-2.jpg` | /voennaya-ipoteka-krasnodar/ Блок 04 карточка 2 | ⏳ Позже | building |
| `zhk-3` | `public/images/zhk-3.jpg` | /voennaya-ipoteka-krasnodar/ Блок 04 карточка 3 | ⏳ Позже | building |
| `zhk-4` | `public/images/zhk-4.jpg` | /voennaya-ipoteka-krasnodar/ Блок 04 карточка 4 | ⏳ Позже | building |
| `office-krd` | `public/images/office-krd.jpg` | /contacts/ Блок 04 офис Краснодар | ⏳ Позже | office |

---

## Компонент PhotoPlaceholder.astro

```astro
---
// src/components/ui/PhotoPlaceholder.astro

interface Props {
  type: 'person' | 'building' | 'office';
  label?: string;
  sublabel?: string;
  filename?: string;
  width?: number | string;
  height?: number | string;
  class?: string;
  dark?: boolean;   // тёмная версия заглушки (bg/dark)
}

const {
  type = 'building',
  label,
  sublabel,
  filename,
  width = '100%',
  height = '100%',
  class: className = '',
  dark = true,
} = Astro.props;

const defaultLabels = {
  person:   'Фото эксперта',
  building: 'Фото ЖК',
  office:   'Фото офиса',
};

const displayLabel    = label    ?? defaultLabels[type];
const displaySublabel = sublabel ?? filename ?? '';
---

<div
  class={`vn-photo-placeholder vn-photo-placeholder--${type} ${dark ? 'vn-photo-placeholder--dark' : ''} ${className}`}
  style={`width:${width}; height:${height};`}
  role="img"
  aria-label={`Заглушка: ${displayLabel}`}
>
  <!-- Decorative grid -->
  <div class="vn-photo-placeholder__grid"></div>

  <!-- Corner brackets -->
  <svg class="vn-photo-placeholder__corners" viewBox="0 0 40 40" fill="none"
       xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 10 L4 4 L10 4"   stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 4 L36 4 L36 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 30 L4 36 L10 36" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 36 L36 36 L36 30" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- Type icon -->
  {type === 'person' && (
    <svg class="vn-photo-placeholder__icon" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4 20 C4 16 7.5 13 12 13 C16.5 13 20 16 20 20"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  )}

  {type === 'building' && (
    <svg class="vn-photo-placeholder__icon" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="10" width="7" height="12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="9" y="6" width="6" height="16" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="15" y="8" width="7" height="14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <line x1="1" y1="22" x2="23" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  )}

  {type === 'office' && (
    <svg class="vn-photo-placeholder__icon" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="6" y="7" width="5" height="4" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
      <rect x="13" y="7" width="5" height="4" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
      <rect x="9" y="14" width="6" height="6" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
    </svg>
  )}

  <!-- Label -->
  <div class="vn-photo-placeholder__label">
    <span class="vn-photo-placeholder__title">{displayLabel}</span>
    {displaySublabel && (
      <span class="vn-photo-placeholder__sub">{displaySublabel}</span>
    )}
  </div>
</div>

<style>
  .vn-photo-placeholder {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    overflow: hidden;
    border-radius: 12px;
    background: #0F1419;
    color: rgba(241, 243, 245, 0.35);
  }

  .vn-photo-placeholder:not(.vn-photo-placeholder--dark) {
    background: #E9ECEF;
    color: rgba(15, 37, 71, 0.3);
  }

  /* Decorative grid */
  .vn-photo-placeholder__grid {
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        0deg, transparent, transparent 31px,
        currentColor 31px, currentColor 32px
      ),
      repeating-linear-gradient(
        90deg, transparent, transparent 31px,
        currentColor 31px, currentColor 32px
      );
    opacity: 0.04;
    pointer-events: none;
  }

  /* Corner brackets — синие */
  .vn-photo-placeholder__corners {
    position: absolute;
    inset: 16px;
    color: #2563EB;
    opacity: 0.5;
    pointer-events: none;
  }

  /* Icon */
  .vn-photo-placeholder__icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  /* Labels */
  .vn-photo-placeholder__label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    z-index: 1;
  }
  .vn-photo-placeholder__title {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(37, 99, 235, 0.7);
  }
  .vn-photo-placeholder__sub {
    font-size: 10px;
    color: currentColor;
    opacity: 0.6;
    letter-spacing: 0.02em;
  }
</style>
```

---

## Как использовать в Astro-компонентах

```astro
---
import PhotoPlaceholder from '../../components/ui/PhotoPlaceholder.astro';
---

<!-- ЖК-карточка с заглушкой -->
<PhotoPlaceholder
  type="building"
  label="Фото ЖК"
  sublabel="Краснодар, новостройка"
  filename="zhk-1.jpg"
  height="280px"
/>

<!-- Офис -->
<PhotoPlaceholder
  type="office"
  label="Офис в Краснодаре"
  sublabel="Кубанская Набережная, 33"
  filename="office-krd.jpg"
  height="480px"
/>

<!-- Портрет (светлая версия) -->
<PhotoPlaceholder
  type="person"
  dark={false}
  label="Михаил Хряпин"
  height="100%"
/>
```

---

## Как заменить заглушку на реальное фото

```astro
---
// БЫЛО: заглушка
import PhotoPlaceholder from '../../components/ui/PhotoPlaceholder.astro';

// СТАЛО: реальное фото
import { Image } from 'astro:assets';
import zhk1Photo from '../../../public/images/zhk-1.jpg';
---

<!-- БЫЛО -->
<PhotoPlaceholder type="building" height="280px" />

<!-- СТАЛО — одна замена -->
<Image
  src={zhk1Photo}
  alt="Жилой комплекс в Краснодаре по военной ипотеке"
  width={600}
  height={280}
  loading="lazy"
  style="width:100%;height:280px;object-fit:cover;border-radius:12px;"
/>
```

Замена занимает 2 минуты на карточку.
