import { useState, type FormEvent } from 'react';
import { InvisibleSmartCaptcha } from '@yandex/smart-captcha';
import { track } from '../../lib/analytics';
import { Check, Loader2 } from 'lucide-react';
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

import './SoftLeadForm.css';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

type SoftLeadFormProps = {
  formName?: string;
  source?: string;
  thankYouUrl?: string;
  submitLabel?: string;
  submittingLabel?: string;
};

const SMARTCAPTCHA_CLIENT_KEY = (import.meta.env.PUBLIC_SMARTCAPTCHA_CLIENT_KEY || '').trim();

export default function SoftLeadForm({
  formName = 'soft_cta_form',
  source = '',
  thankYouUrl = '/thanks/',
  submitLabel = 'Получить подборку',
  submittingLabel = 'Отправляем',
}: SoftLeadFormProps) {
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

  const isSubmitting = submitState === 'loading';

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
    if (errors.phone) {
      setErrors((current) => ({ ...current, phone: undefined }));
    }
  };

  const submitLead = async (smartCaptchaToken?: string) => {
    setSubmitState('loading');
    setSubmitError('');

    const phoneDigits = normalizePhoneDigits(phone);
    const normalizedPhone = `+${phoneDigits}`;

    try {
      await sendLead({
        form: formName,
        name: name.trim(),
        phone: normalizedPhone,
        method,
        source: source || window.location.pathname,
        honeypot,
        smartCaptchaToken,
        utm: getUtmPayload(),
      });

      setSubmitState('success');
      track('lead_submit', { params: { source: source || window.location.pathname } });

      setTimeout(() => {
        const targetUrl = new URL(thankYouUrl, window.location.origin);
        targetUrl.searchParams.set('method', method || 'call');
        window.location.href = targetUrl.toString();
      }, 1200);
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить заявку.');
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

  if (submitState === 'success') {
    return (
      <div className="vn-soft-form__success" role="status">
        <span className="vn-soft-form__success-icon" aria-hidden="true">
          <Check size={28} strokeWidth={1.8} />
        </span>
        <h3 className="vn-soft-form__success-title">Заявка отправлена</h3>
        <p className="vn-soft-form__success-text">
          Свяжемся с вами в удобном формате и подскажем следующий шаг в покупке.
        </p>
      </div>
    );
  }

  return (
    <form className="vn-soft-form" onSubmit={handleSubmit} noValidate>
      {SMARTCAPTCHA_CLIENT_KEY && (
        <InvisibleSmartCaptcha
          sitekey={SMARTCAPTCHA_CLIENT_KEY}
          language="ru"
          visible={captchaVisible}
          hideShield
          shieldPosition="bottom-right"
          onChallengeHidden={() => {
            setCaptchaVisible(false);
            if (isCaptchaPending && submitState === 'loading') {
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

      <div className="vn-soft-form__field">
        <label className="vn-soft-form__label" htmlFor="soft-form-name">
          Имя
        </label>
        <input
          className="vn-soft-form__input"
          id="soft-form-name"
          name="name"
          value={name}
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'soft-form-name-error' : undefined}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
          }}
          placeholder="Как к вам обращаться"
        />
        {errors.name && (
          <p className="vn-soft-form__error" id="soft-form-name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="vn-soft-form__field">
        <label className="vn-soft-form__label" htmlFor="soft-form-phone">
          Телефон
        </label>
        <input
          className="vn-soft-form__input"
          id="soft-form-phone"
          name="phone"
          value={phone}
          autoComplete="tel"
          inputMode="tel"
          required
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'soft-form-phone-error' : undefined}
          onChange={(event) => handlePhoneChange(event.target.value)}
          placeholder="+7 (999) 999-99-99"
        />
        {errors.phone && (
          <p className="vn-soft-form__error" id="soft-form-phone-error">
            {errors.phone}
          </p>
        )}
      </div>

      <fieldset
        className="vn-soft-form__method"
        aria-invalid={Boolean(errors.method)}
        aria-describedby={errors.method ? 'soft-form-method-error' : undefined}
      >
        <legend className="vn-soft-form__label">Способ связи</legend>
        <div className="vn-soft-form__method-grid">
          {METHOD_OPTIONS.map((option) => {
            const Icon = option.icon;

            return (
              <label className="vn-soft-form__method-option" key={option.value}>
                <input
                  className="vn-soft-form__method-input"
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
                <span className="vn-soft-form__method-label">
                  <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.method && (
          <p className="vn-soft-form__error" id="soft-form-method-error">
            {errors.method}
          </p>
        )}
      </fieldset>

      <label className="vn-soft-form__consent">
        <input
          className="vn-soft-form__checkbox"
          type="checkbox"
          checked={consent}
          required
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'soft-form-consent-error' : undefined}
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
        <p className="vn-soft-form__error" id="soft-form-consent-error">
          {errors.consent}
        </p>
      )}

      <div className="vn-soft-form__honeypot" aria-hidden="true">
        <label htmlFor="soft-form-company">Компания</label>
        <input
          id="soft-form-company"
          name="company"
          value={honeypot}
          tabIndex={-1}
          autoComplete="off"
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {submitState === 'error' && (
        <p className="vn-soft-form__submit-error" role="alert">
          {submitError}
        </p>
      )}

      <button className="vn-btn-primary vn-soft-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="vn-soft-form__spinner" size={18} strokeWidth={1.8} aria-hidden="true" />
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </button>

      <p className="vn-soft-form__submit-note">
        {SMARTCAPTCHA_CLIENT_KEY
          ? 'Форма защищена Yandex SmartCaptcha. Без спама, только связь по вашей задаче.'
          : 'Без спама. Только чтобы связаться по вашей задаче.'}
      </p>
    </form>
  );
}
