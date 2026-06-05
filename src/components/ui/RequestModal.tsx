import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { track } from '../../lib/analytics';
import { Check, Loader2, MessageCircle, Phone, Send, X } from 'lucide-react';
import { sendLead } from '@/lib/leads';
import '../../styles/modal.css';

type ContactMethod = 'call' | 'telegram' | 'max';
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

type OpenModalDetail = {
  title?: string;
  subtitle?: string;
  source?: string;
  thankYouUrl?: string;
};

type RequestModalProps = {
  title?: string;
  subtitle?: string;
  source?: string;
  eyebrow?: string;
  thankYouUrl?: string;
  formName?: string;
};

type FormErrors = {
  name?: string;
  phone?: string;
  method?: string;
  consent?: string;
};

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    __vnPendingModalOpen?: OpenModalDetail;
  }
}

const DEFAULT_TITLE = 'Напишите ваше имя и телефон';
const DEFAULT_SUBTITLE = 'Уточню ваш запрос и задачу, а затем подготовлю подборку квартир.';

const METHOD_OPTIONS: Array<{ value: ContactMethod; label: string; icon: typeof Phone }> = [
  { value: 'call', label: 'Звонок', icon: Phone },
  { value: 'telegram', label: 'Telegram', icon: Send },
  { value: 'max', label: 'Max', icon: MessageCircle },
];

function normalizePhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('8')) {
    return `7${digits.slice(1)}`.slice(0, 11);
  }

  if (digits.startsWith('7')) {
    return digits.slice(0, 11);
  }

  return `7${digits}`.slice(0, 11);
}

function formatPhone(value: string) {
  const digits = normalizePhoneDigits(value);

  if (digits.length <= 1) {
    return value.replace(/\D/g, '').length === 0 ? '' : '+7';
  }

  const body = digits.slice(1);
  const part1 = body.slice(0, 3);
  const part2 = body.slice(3, 6);
  const part3 = body.slice(6, 8);
  const part4 = body.slice(8, 10);

  let result = '+7';

  if (part1) result += ` (${part1}`;
  if (part1.length === 3) result += ')';
  if (part2) result += ` ${part2}`;
  if (part3) result += `-${part3}`;
  if (part4) result += `-${part4}`;

  return result;
}

function getUtmPayload() {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

function validateForm(name: string, phone: string, method: ContactMethod | '', consent: boolean) {
  const errors: FormErrors = {};
  const phoneDigits = normalizePhoneDigits(phone);

  if (name.trim().length < 2) {
    errors.name = 'Введите имя, чтобы Михаил понял как к вам обратиться.';
  }

  if (phoneDigits.length !== 11) {
    errors.phone = 'Введите телефон в формате +7 (999) 999-99-99.';
  }

  if (!method) {
    errors.method = 'Выберите, куда удобнее ответить.';
  }

  if (!consent) {
    errors.consent = 'Нужно согласие на обработку персональных данных.';
  }

  return errors;
}

export default function RequestModal({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  source = '',
  eyebrow = 'Получить варианты',
  thankYouUrl = '/thanks/',
  formName = 'request_modal',
}: RequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(title);
  const [modalSubtitle, setModalSubtitle] = useState(subtitle);
  const [modalSource, setModalSource] = useState(source);
  const [modalThankYouUrl, setModalThankYouUrl] = useState(thankYouUrl);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<ContactMethod | ''>('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const openedAtRef = useRef<number>(Date.now());
  const panelRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  const closeModal = () => {
    setIsOpen(false);
    setSubmitState('idle');
    setSubmitError('');
    setErrors({});
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setMethod('');
    setConsent(false);
    setHoneypot('');
    setSubmitState('idle');
    setSubmitError('');
    setErrors({});
  };

  useEffect(() => {
    const openModal = (event: Event) => {
      const detail = (event as CustomEvent<OpenModalDetail>).detail || {};

      lastActiveElementRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

      resetForm();
      openedAtRef.current = Date.now();
      setModalTitle(detail.title || title);
      setModalSubtitle(detail.subtitle || subtitle);
      setModalSource(detail.source || source || window.location.pathname);
      setModalThankYouUrl(detail.thankYouUrl || thankYouUrl);
      setIsOpen(true);

      track('modal_open', { params: { source: detail.source || source || window.location.pathname } });
    };

    window.addEventListener('open-modal', openModal);

    if (window.__vnPendingModalOpen) {
      window.dispatchEvent(new CustomEvent('open-modal', { detail: window.__vnPendingModalOpen }));
      window.__vnPendingModalOpen = undefined;
    }

    return () => {
      window.removeEventListener('open-modal', openModal);
    };
  }, [source, subtitle, thankYouUrl, title]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      lastActiveElementRef.current?.focus();
      return;
    }

    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => nameInputRef.current?.focus(), 50);

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      const focusable = Array.from(focusableElements).filter((element) => !element.hasAttribute('aria-hidden'));
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
    if (errors.phone) {
      setErrors((current) => ({ ...current, phone: undefined }));
    }
  };

  const handleOverlayKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(name, phone, method, consent);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState('idle');
      return;
    }

    setSubmitState('loading');
    setSubmitError('');

    const phoneDigits = normalizePhoneDigits(phone);
    const normalizedPhone = `+${phoneDigits}`;
    const openedAt = openedAtRef.current;

    try {
      await sendLead({
        form: formName,
        name: name.trim(),
        phone: normalizedPhone,
        method,
        source: modalSource,
        honeypot,
        openedAt,
        utm: getUtmPayload(),
      });

      setSubmitState('success');
      track('lead_submit', { params: { source: modalSource } });
      setTimeout(() => {
        const targetUrl = new URL(modalThankYouUrl, window.location.origin);
        targetUrl.searchParams.set('method', method || 'call');
        window.location.href = targetUrl.toString();
      }, 1200);
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить заявку.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="vn-modal__overlay"
      role="presentation"
      tabIndex={-1}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
      onKeyDown={handleOverlayKeyDown}
    >
      <div
        className="vn-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vn-modal-title"
        aria-describedby="vn-modal-subtitle"
        ref={panelRef}
      >
        <button className="vn-modal__close" type="button" aria-label="Закрыть форму" onClick={closeModal}>
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>

        {submitState === 'success' ? (
          <div className="vn-modal__success" role="status">
            <span className="vn-modal__success-icon" aria-hidden="true">
              <Check size={28} strokeWidth={1.8} />
            </span>
            <h2 className="vn-modal__title" id="vn-modal-title">
              Заявка отправлена
            </h2>
            <p className="vn-modal__subtitle" id="vn-modal-subtitle">
              Свяжемся с вами в удобном формате и подскажем следующий шаг по маршруту покупки.
            </p>
            <button className="vn-btn-primary vn-modal__submit" type="button" onClick={closeModal}>
              Хорошо
            </button>
          </div>
        ) : (
          <>
            <div className="vn-modal__header">
              <div className="vn-modal__header-copy">
                <p className="vn-modal__eyebrow">{eyebrow}</p>
                <h2 className="vn-modal__title" id="vn-modal-title">
                  {modalTitle}
                </h2>
                <p className="vn-modal__subtitle" id="vn-modal-subtitle">
                  {modalSubtitle}
                </p>
              </div>
            </div>

            <form className="vn-modal__form" onSubmit={handleSubmit} noValidate>
              <div className="vn-modal__field">
                <label className="vn-modal__label" htmlFor="request-name">
                  Имя
                </label>
                <input
                  className="vn-modal__input"
                  id="request-name"
                  name="name"
                  ref={nameInputRef}
                  value={name}
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'request-name-error' : undefined}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
                  }}
                  placeholder="Как к вам обращаться"
                />
                {errors.name && (
                  <p className="vn-modal__error" id="request-name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="vn-modal__field">
                <label className="vn-modal__label" htmlFor="request-phone">
                  Телефон
                </label>
                <input
                  className="vn-modal__input"
                  id="request-phone"
                  name="phone"
                  value={phone}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'request-phone-error' : undefined}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="+7 (999) 999-99-99"
                />
                {errors.phone && (
                  <p className="vn-modal__error" id="request-phone-error">
                    {errors.phone}
                  </p>
                )}
              </div>

              <fieldset
                className="vn-modal__method"
                aria-invalid={Boolean(errors.method)}
                aria-describedby={errors.method ? 'request-method-error' : undefined}
              >
                <legend className="vn-modal__label">Укажите способ связи</legend>
                <div className="vn-modal__method-grid">
                  {METHOD_OPTIONS.map((option) => {
                    const Icon = option.icon;

                    return (
                      <label className="vn-modal__method-option" key={option.value}>
                        <input
                          className="vn-modal__method-input"
                          type="radio"
                          name="method"
                          value={option.value}
                          required
                          checked={method === option.value}
                          onChange={() => {
                            setMethod(option.value);
                            if (errors.method) setErrors((current) => ({ ...current, method: undefined }));
                          }}
                        />
                        <span className="vn-modal__method-label">
                          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.method && (
                  <p className="vn-modal__error" id="request-method-error">
                    {errors.method}
                  </p>
                )}
              </fieldset>

              <label className="vn-modal__consent">
                <input
                  className="vn-modal__checkbox"
                  type="checkbox"
                  checked={consent}
                  required
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'request-consent-error' : undefined}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    if (errors.consent) setErrors((current) => ({ ...current, consent: undefined }));
                  }}
                />
                <span>
                  Принимаю{' '}
                  <a href="/soglasie/" target="_blank" rel="noreferrer">
                    согласие на обработку персональных данных
                  </a>{' '}
                  и{' '}
                  <a href="/politika/" target="_blank" rel="noreferrer">
                    политику конфиденциальности
                  </a>
                </span>
              </label>
              {errors.consent && (
                <p className="vn-modal__error" id="request-consent-error">
                  {errors.consent}
                </p>
              )}

              <div className="vn-modal__honeypot" aria-hidden="true">
                <label htmlFor="request-company">Компания</label>
                <input
                  id="request-company"
                  name="company"
                  value={honeypot}
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              {submitState === 'error' && (
                <p className="vn-modal__submit-error" role="alert">
                  {submitError}
                </p>
              )}

              <button className="vn-btn-primary vn-modal__submit" type="submit" disabled={submitState === 'loading'}>
                {submitState === 'loading' ? (
                  <>
                    <Loader2 className="vn-modal__spinner" size={18} strokeWidth={1.8} aria-hidden="true" />
                    Отправляем
                  </>
                ) : (
                  'Отправить заявку'
                )}
              </button>
              <p className="vn-modal__submit-note">Без спама. Только чтобы связаться по вашей задаче.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
