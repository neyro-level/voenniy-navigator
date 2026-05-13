# COMPONENT_REQUEST_MODAL.md

**Компонент:** RequestModal — попап форма заявки
**Проект:** Военный навигатор — Михаил Хряпин
**Версия:** 1.0
**Дата:** 2026-05-12

**Файлы:**
```
src/
├── components/ui/RequestModal.tsx     ← React island (форма + состояния)
├── pages/api/contact.ts               ← Astro API endpoint → Telegram
└── styles/modal.css                   ← стили (или Tailwind)
```

---

## 1. Концепция

**Один компонент — разные заголовки.** Форма, поля, валидация, API — универсальные. Заголовок и подзаголовок передаются через props от каждой CTA-кнопки.

**Дизайн:** белая карточка 420px, тёмная подложка логотипа, три поля, переключатель способа связи, чекбокс согласия, синяя кнопка.

---

## 2. Props компонента

```typescript
interface RequestModalProps {
  title?: string;        // заголовок (динамический)
  subtitle?: string;     // подзаголовок (динамический)
  source?: string;       // страница-источник (для Telegram)
  isOpen: boolean;
  onClose: () => void;
}

// Значения по умолчанию
const defaults = {
  title: 'Записаться на разбор',
  subtitle: 'Оставьте заявку — свяжемся в течение 10 минут и обсудим вашу задачу.',
};
```

**Примеры использования на страницах:**
```astro
<!-- Главная -->
<RequestModal title="Разобрать цель покупки" source="/" client:load />

<!-- /distancionnaya-pokupka/ -->
<RequestModal title="Разобрать дистанционный маршрут" source="/distancionnaya-pokupka/" client:load />

<!-- /voennaya-ipoteka-krym/ -->
<RequestModal title="Разобрать покупку в Крыму" source="/voennaya-ipoteka-krym/" client:load />

<!-- /contacts/ -->
<RequestModal title="Записаться на разбор" source="/contacts/" client:load />
```

---

## 3. Поля формы

| # | Поле | Тип | Обязательное | Плейсхолдер |
|---|---|---|---|---|
| 1 | Имя | text | ✓ | «Как вас зовут?» |
| 2 | Телефон | tel | ✓ | «+7 (___) ___-__-__» |
| 3 | Способ связи | radio-toggle | ✓ | Звонок / Telegram / Max |
| — | Согласие ПД | checkbox | ✓ | — |
| — | Honeypot | hidden | — | (скрытое, видит только бот) |
| — | Время открытия | hidden | — | (timestamp, защита от бота) |
| — | Источник | hidden | — | (страница, передаётся в TG) |

---

## 4. Валидация

```typescript
const validate = (data: FormData) => {
  const errors: Record<string, string> = {};

  // Имя
  const name = data.name.trim();
  if (!name) errors.name = 'Укажите ваше имя';
  if (name.length < 2) errors.name = 'Слишком короткое имя';

  // Телефон — убираем маску, проверяем 11 цифр
  const phone = data.phone.replace(/\D/g, '');
  if (!phone) errors.phone = 'Укажите телефон';
  if (phone.length !== 11) errors.phone = 'Введите полный номер';

  // Способ связи
  if (!data.method) errors.method = 'Выберите способ связи';

  // Согласие
  if (!data.consent) errors.consent = 'Необходимо ваше согласие';

  return errors;
};
```

---

## 5. Телефонная маска

```typescript
// Форматирование в реальном времени
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  // Убираем ведущую 7 или 8
  const clean = digits.startsWith('7') || digits.startsWith('8')
    ? digits.slice(1)
    : digits;

  let result = '+7';
  if (clean.length > 0) result += ' (' + clean.slice(0, 3);
  if (clean.length >= 3) result += ') ' + clean.slice(3, 6);
  if (clean.length >= 6) result += '-' + clean.slice(6, 8);
  if (clean.length >= 8) result += '-' + clean.slice(8, 10);

  return result;
};
```

---

## 6. Состояния формы

```typescript
type FormState = 'idle' | 'loading' | 'success' | 'error';
```

| Состояние | Кнопка | Поля | Что показывать |
|---|---|---|---|
| `idle` | «Отправить заявку» | активны | Обычная форма |
| `loading` | Spinner + «Отправляем...» | disabled | Кнопка заблокирована |
| `success` | — | скрыты | Сообщение «Заявка отправлена» |
| `error` | «Попробовать снова» | активны | Текст ошибки |

**Success-экран:**
```tsx
<div className="vn-modal__success">
  <div className="vn-modal__success-icon">
    {/* Галочка в круге, цвет accent.cta */}
  </div>
  <h3>Заявка отправлена!</h3>
  <p>Михаил свяжется с вами в течение 10 минут.</p>
  <button onClick={onClose}>Закрыть</button>
</div>
```

---

## 7. Полный React компонент

```tsx
// src/components/ui/RequestModal.tsx
import { useState, useEffect, useRef } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  source?: string;
  isOpen: boolean;
  onClose: () => void;
}

type Method = 'call' | 'telegram' | 'max';
type State = 'idle' | 'loading' | 'success' | 'error';

export default function RequestModal({
  title = 'Записаться на разбор',
  subtitle = 'Оставьте заявку — свяжемся в течение 10 минут и обсудим вашу задачу.',
  source = '/',
  isOpen,
  onClose,
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<Method>('call');
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');         // honeypot
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const openedAt = useRef<number>(Date.now());
  const firstInput = useRef<HTMLInputElement>(null);

  // Focus trap + body lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInput.current?.focus(), 50);
      openedAt.current = Date.now();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setName(''); setPhone(''); setMethod('call');
      setConsent(false); setState('idle'); setErrors({});
    }
  }, [isOpen]);

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '');
    const c = (d.startsWith('7') || d.startsWith('8')) ? d.slice(1) : d;
    let r = '+7';
    if (c.length > 0) r += ' (' + c.slice(0, 3);
    if (c.length >= 3) r += ') ' + c.slice(3, 6);
    if (c.length >= 6) r += '-' + c.slice(6, 8);
    if (c.length >= 8) r += '-' + c.slice(8, 10);
    return r;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Укажите имя';
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 11) errs.phone = 'Введите полный номер';
    if (!consent) errs.consent = 'Необходимо согласие';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setState('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          method,
          source,
          honey,                          // honeypot
          openedAt: openedAt.current,     // timing check
        }),
      });

      if (res.ok) {
        setState('success');
        // Цель Яндекс.Метрики
        if (typeof window !== 'undefined' && (window as any).ym) {
          (window as any).ym(import.meta.env.PUBLIC_YM_COUNTER_ID, 'reachGoal', 'form_submitted');
        }
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  if (!isOpen) return null;

  const methodLabels: Record<Method, string> = {
    call: 'Звонок',
    telegram: 'Telegram',
    max: 'Max',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,20,25,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#fff', borderRadius: '20px',
          width: '100%', maxWidth: '420px',
          padding: '32px 28px',
          border: '0.5px solid rgba(15,37,71,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {state === 'success' ? (
          /* ── SUCCESS ── */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(37,99,235,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#2563EB" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: '#0F1419' }}>
              Заявка отправлена!
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: '#4A5568', lineHeight: 1.6 }}>
              Михаил свяжется с вами в течение 10 минут
              через {methodLabels[method]}.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '10px 28px', borderRadius: 10,
                background: '#2563EB', color: '#fff',
                border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          /* ── FORM ── */
          <form onSubmit={handleSubmit} noValidate>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, background: '#0F1419',
                  borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="9" stroke="rgba(241,243,245,0.22)"
                      strokeWidth="0.7" strokeDasharray="2.2 2.2"/>
                    <path d="M7 13L7 7L13 7" stroke="rgba(241,243,245,0.75)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M27 7L33 7L33 13" stroke="rgba(241,243,245,0.75)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 27L7 33L13 33" stroke="rgba(241,243,245,0.75)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M27 33L33 33L33 27" stroke="rgba(241,243,245,0.75)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="20" cy="20" r="2.8" fill="#2563EB"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: '#8B95A3', lineHeight: 1, marginBottom: 4 }}>
                    Военный навигатор
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#0F1419', lineHeight: 1.2 }}>
                    {title}
                  </div>
                </div>
              </div>
              <button type="button" onClick={onClose} aria-label="Закрыть"
                style={{
                  background: 'none', border: '0.5px solid #E2E8EF',
                  borderRadius: 8, width: 32, height: 32,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="#8B95A3" strokeWidth="1.5"
                    strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Subtitle */}
            <p style={{
              fontSize: 13, color: '#4A5568', margin: '0 0 12px',
              lineHeight: 1.6, padding: '10px 14px',
              background: '#F8FAFC', borderRadius: 8,
              borderLeft: '3px solid #2563EB',
            }}>
              {subtitle}
            </p>

            {/* Аватар Михаила — доверие к форме */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            }}>
              <img
                src="/images/mikhail-form.jpg"
                alt="Михаил Хряпин"
                width={40} height={40}
                style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0F1419' }}>
                  Михаил Хряпин
                </div>
                <div style={{ fontSize: 11, color: '#8B95A3' }}>
                  Навигатор по военной ипотеке
                </div>
              </div>
            </div>

            {/* Honeypot — скрытое поле */}
            <input
              type="text" name="website" tabIndex={-1}
              value={honey} onChange={e => setHoney(e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
              aria-hidden="true" autoComplete="off"
            />

            {/* Поле: Имя */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: '#4A5568', display: 'block', marginBottom: 6 }}>
                Ваше имя
              </label>
              <input
                ref={firstInput} type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Как вас зовут?"
                style={{
                  width: '100%', height: 44, borderRadius: 10,
                  border: `1px solid ${errors.name ? '#E24B4A' : '#E2E8EF'}`,
                  padding: '0 14px', fontSize: 14, color: '#0F1419',
                  background: '#FAFBFC', outline: 'none', boxSizing: 'border-box',
                }}
              />
              {errors.name && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#E24B4A' }}>{errors.name}</p>
              )}
            </div>

            {/* Поле: Телефон */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: '#4A5568', display: 'block', marginBottom: 6 }}>
                Телефон
              </label>
              <input
                type="tel" value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                maxLength={18}
                style={{
                  width: '100%', height: 44, borderRadius: 10,
                  border: `1px solid ${errors.phone ? '#E24B4A' : '#E2E8EF'}`,
                  padding: '0 14px', fontSize: 14, color: '#0F1419',
                  background: '#FAFBFC', outline: 'none', boxSizing: 'border-box',
                }}
              />
              {errors.phone && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#E24B4A' }}>{errors.phone}</p>
              )}
            </div>

            {/* Способ связи */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                textTransform: 'uppercase', color: '#4A5568', display: 'block', marginBottom: 8 }}>
                Удобный способ связи
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['call', 'telegram', 'max'] as Method[]).map(m => (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    style={{
                      flex: 1, height: 38, borderRadius: 8, fontSize: 13, fontWeight: 500,
                      cursor: 'pointer',
                      border: method === m ? '1px solid #2563EB' : '1px solid #E2E8EF',
                      background: method === m ? '#EBF2FF' : '#FAFBFC',
                      color: method === m ? '#1854C4' : '#4A5568',
                    }}>
                    {m === 'call' ? '📞 Звонок' : m === 'telegram' ? '✈ Telegram' : '📱 Max'}
                  </button>
                ))}
              </div>
            </div>

            {/* Согласие */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
              cursor: 'pointer', marginBottom: 16 }}>
              <input type="checkbox" checked={consent}
                onChange={e => setConsent(e.target.checked)}
                style={{ marginTop: 2, accentColor: '#2563EB', width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: '#4A5568', lineHeight: 1.55 }}>
                Я даю согласие на обработку персональных данных и соглашаюсь с{' '}
                <a href="https://bastion-lnr.ru/politik" target="_blank" rel="noopener"
                  style={{ color: '#2563EB', textDecoration: 'none' }}>
                  Политикой конфиденциальности
                </a>
              </span>
            </label>
            {errors.consent && (
              <p style={{ margin: '-12px 0 12px', fontSize: 11, color: '#E24B4A' }}>{errors.consent}</p>
            )}

            {/* Submit */}
            <button type="submit" disabled={state === 'loading'}
              style={{
                width: '100%', height: 48, borderRadius: 12,
                background: state === 'loading' ? '#93AEDE' : '#2563EB',
                color: '#fff', fontSize: 15, fontWeight: 500,
                border: 'none', cursor: state === 'loading' ? 'default' : 'pointer',
                marginBottom: 12,
              }}>
              {state === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
            </button>

            {state === 'error' && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#E24B4A', margin: '0 0 8px' }}>
                Ошибка отправки. Попробуйте ещё раз или напишите в Telegram.
              </p>
            )}

            {/* Footer info */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, color: '#8B95A3' }}>⏱ Ответим за 10 минут</span>
              <span style={{ fontSize: 11, color: '#8B95A3' }}>🔒 Данные защищены</span>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
```

---

## 8. API endpoint — /api/contact.ts

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

const BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = import.meta.env.TELEGRAM_CHAT_ID;

// Rate limiting: хранит IP → [timestamps]
const rateLimit = new Map<string, number[]>();

export const POST: APIRoute = async ({ request }) => {

  // ── 1. Парсим тело ──────────────────────────────────────────
  let body: {
    name: string;
    phone: string;
    method: string;
    source: string;
    honey: string;
    openedAt: number;
  };

  try {
    body = await request.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { name, phone, method, source, honey, openedAt } = body;

  // ── 2. Honeypot — бот заполнил скрытое поле ─────────────────
  if (honey) {
    // Молча отдаём 200 чтобы бот думал что всё ок
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // ── 3. Timing check — форма отправлена слишком быстро ────────
  const elapsed = Date.now() - openedAt;
  if (elapsed < 3000) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // ── 4. Rate limiting — max 3 заявки с IP за 10 минут ─────────
  const ip = request.headers.get('x-forwarded-for')
    ?? request.headers.get('cf-connecting-ip')
    ?? 'unknown';
  const now = Date.now();
  const window = 10 * 60 * 1000; // 10 минут
  const history = (rateLimit.get(ip) ?? []).filter(t => now - t < window);

  if (history.length >= 3) {
    return new Response(
      JSON.stringify({ error: 'Слишком много заявок. Попробуйте через 10 минут.' }),
      { status: 429 }
    );
  }

  rateLimit.set(ip, [...history, now]);

  // ── 5. Базовая валидация ────────────────────────────────────
  const digits = phone.replace(/\D/g, '');
  if (!name?.trim() || digits.length !== 11) {
    return new Response(JSON.stringify({ error: 'Некорректные данные' }), { status: 422 });
  }

  // ── 6. Формируем сообщение для Telegram ─────────────────────
  const methodLabels: Record<string, string> = {
    call: '📞 Звонок',
    telegram: '✈️ Telegram',
    max: '📱 Max',
  };

  const time = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date());

  const message = `
🏠 <b>Новая заявка — Военный навигатор</b>

👤 <b>Имя:</b> ${escapeHtml(name.trim())}
📞 <b>Телефон:</b> ${escapeHtml(phone.trim())}
💬 <b>Способ связи:</b> ${methodLabels[method] ?? method}
📄 <b>Страница:</b> ${escapeHtml(source)}

⏰ <b>Время:</b> ${time} (МСК)
  `.trim();

  // ── 7. Отправляем в Telegram ─────────────────────────────────
  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.error('Telegram error:', tgData);
      return new Response(JSON.stringify({ error: 'Telegram error' }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err) {
    console.error('Fetch error:', err);
    return new Response(JSON.stringify({ error: 'Network error' }), { status: 500 });
  }
};

// Экранирование HTML для Telegram HTML-mode
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

---

## 9. Переменные окружения

```bash
# .env (НЕ коммитить в git — уже в .gitignore)
TELEGRAM_BOT_TOKEN=8756363959:AAGdDHVe1jb7JwqUWUyHpO7W5xBnnvu-SWU
TELEGRAM_CHAT_ID=-5270072570
```

```bash
# .env.example (коммитить — без значений)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
PUBLIC_YM_COUNTER_ID=
```

**Vercel Dashboard:** Settings → Environment Variables → добавить обе переменные (Production + Preview).

> ⚠️ Текущие данные тестовые. Перед запуском в продакшн сменить токен через @BotFather.

---

## 10. Подключение в PageLayout.astro

```astro
---
// src/layouts/PageLayout.astro
import RequestModal from '../components/ui/RequestModal';
---

<body>
  <Header />
  <main><slot /></main>
  <Footer />

  <!-- Глобальный модал — один на всё приложение -->
  <RequestModal client:load />

  <script>
    // Открытие по клику на любую CTA-кнопку
    document.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-modal-open]');
      if (btn) {
        e.preventDefault();
        const title = btn.getAttribute('data-modal-title') || undefined;
        const subtitle = btn.getAttribute('data-modal-subtitle') || undefined;
        const source = window.location.pathname;
        window.dispatchEvent(new CustomEvent('open-modal', {
          detail: { title, subtitle, source }
        }));
      }
    });
  </script>
</body>
```

**CTA-кнопки на страницах (атрибуты вместо props):**
```html
<!-- Главная -->
<a href="/contacts/#request"
   data-modal-open
   data-modal-title="Разобрать цель покупки"
   class="vn-btn-primary">
  Записаться на разбор
</a>

<!-- /distancionnaya-pokupka/ -->
<a href="/contacts/#request"
   data-modal-open
   data-modal-title="Разобрать дистанционный маршрут"
   class="vn-btn-primary">
  Разобрать дистанционную покупку
</a>
```

**Fallback без JS:** кнопка ведёт на `/contacts/` — человек попадает на страницу контактов.

---

## 11. Пример сообщения в Telegram

```
🏠 Новая заявка — Военный навигатор

👤 Имя: Алексей Петров
📞 Телефон: +7 (918) 542-33-11
💬 Способ связи: ✈️ Telegram
📄 Страница: /distancionnaya-pokupka/

⏰ Время: 12.05.2026, 14:23 (МСК)
```

---

## 12. Защита от ботов — итоговая схема

| Уровень | Метод | Где | Эффект |
|---|---|---|---|
| 1 | Honeypot поле | Клиент + сервер | Блокирует ~80% простых ботов |
| 2 | Timing check (< 3 сек) | Сервер | Блокирует автоматические отправки |
| 3 | Rate limiting (3/10мин) | Сервер | Блокирует массовые атаки |
| — | Cloudflare (если подключён) | CDN уровень | Дополнительный слой, бесплатно |

---

## 13. Чек-лист

### Разработка
- [ ] RequestModal.tsx создан, `client:load` в PageLayout
- [ ] `/api/contact.ts` создан, импортирует env-переменные
- [ ] `.env` заполнен тестовыми данными, добавлен в `.gitignore`
- [ ] `.env.example` с пустыми ключами закоммичен
- [ ] Vercel Dashboard: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID добавлены

### Тестирование
- [ ] Отправить тестовую заявку — сообщение пришло в Telegram
- [ ] Проверить маску телефона: 79001234567 → +7 (900) 123-45-67
- [ ] Проверить honeypot: заполнить скрытое поле → сообщение НЕ приходит
- [ ] Проверить rate limit: 4 заявки подряд → 4-я возвращает 429
- [ ] Проверить состояние success: зелёная галочка, текст
- [ ] Проверить состояние error: кнопка «Попробовать снова»
- [ ] ESC закрывает модал
- [ ] Клик по оверлею закрывает модал
- [ ] Body scroll lock при открытом модале
- [ ] Fallback без JS: кнопка ведёт на /contacts/

### Продакшн
- [ ] Сменить BOT_TOKEN перед запуском (тестовый токен отозвать)
- [ ] Проверить что `.env` не попал в git (`git status`)
- [ ] Добавить цель в Яндекс.Метрике: `form_submitted`

---

**Конец COMPONENT_REQUEST_MODAL.md v1.0**
