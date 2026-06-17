import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { InvisibleSmartCaptcha } from '@yandex/smart-captcha';
import { track } from '../../lib/analytics';
import { Check, Loader2, X } from 'lucide-react';
import { sendLead } from '@/lib/leads';
import {
  formatPhone,
  getUtmPayload,
  METHOD_OPTIONS,
  normalizePhoneDigits,
  validateForm,
  type ContactMethod,
  type FormErrors,
} from '../../lib/form-utils';
import '../../styles/modal.css';

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

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    __vnPendingModalOpen?: OpenModalDetail;
  }
}

const DEFAULT_TITLE = 'Напишите ваше имя и телефон';
const DEFAULT_SUBTITLE = 'Уточню ваш запрос и задачу, а затем подготовлю подборку квартир.';
const SMARTCAPTCHA_CLIENT_KEY = (import.meta.env.PUBLIC_SMARTCAPTCHA_CLIENT_KEY || '').trim();



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
  const [captchaVisible, setCaptchaVisible] = useState(false);
  const [isCaptchaPending, setIsCaptchaPending] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const openedAtRef = useRef<number>(Date.now());
  const isSubmittingLeadRef = useRef(false);
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
    setCaptchaVisible(false);
    setIsCaptchaPending(false);
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

  const submitLead = async (smartCaptchaToken?: string) => {
    isSubmittingLeadRef.current = true;
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
        smartCaptchaToken,
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
    } finally {
      isSubmittingLeadRef.current = false;
      setCaptchaVisible(false);
      setIsCaptchaPending(false);
    }
  };

  const handleCaptchaFailure = (message: string) => {
    setCaptchaVisible(false);
    setIsCaptchaPending(false);
    setSubmitState('error');
    setSubmitError(message);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(name, phone, method, consent);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState('idle');
      return;
    }

    if (SMARTCAPTCHA_CLIENT_KEY) {
      setSubmitState('loading');
      setSubmitError('');
      setIsCaptchaPending(true);
      setCaptchaVisible(false);
      window.setTimeout(() => setCaptchaVisible(true), 0);
      return;
    }

    await submitLead();
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
              {SMARTCAPTCHA_CLIENT_KEY && (
                <InvisibleSmartCaptcha
                  sitekey={SMARTCAPTCHA_CLIENT_KEY}
                  language="ru"
                  visible={captchaVisible}
                  shieldPosition="bottom-right"
                  onChallengeHidden={() => {
                    setCaptchaVisible(false);
                    if (isCaptchaPending && !isSubmittingLeadRef.current) {
                      setIsCaptchaPending(false);
                      setSubmitState('idle');
                    }
                  }}
                  onNetworkError={() => handleCaptchaFailure('Не удалось запустить SmartCaptcha. Попробуйте ещё раз.')}
                  onTokenExpired={() => handleCaptchaFailure('Проверка SmartCaptcha истекла. Попробуйте ещё раз.')}
                  onJavascriptError={() => handleCaptchaFailure('SmartCaptcha временно недоступна. Попробуйте ещё раз.')}
                  onSuccess={(token) => {
                    if (!isCaptchaPending) return;
                    void submitLead(token);
                  }}
                />
              )}
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
              <p className="vn-modal__submit-note">
                {SMARTCAPTCHA_CLIENT_KEY
                  ? 'Форма защищена Yandex SmartCaptcha. Без спама, только связь по вашей задаче.'
                  : 'Без спама. Только чтобы связаться по вашей задаче.'}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
