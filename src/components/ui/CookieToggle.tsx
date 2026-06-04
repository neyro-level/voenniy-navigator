import { useState, useCallback } from 'react';

type ConsentState = 'accepted' | 'rejected' | null;

export default function CookieToggle() {
  const [consent, setConsent] = useState<ConsentState>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('vn_cookie_consent') as ConsentState;
  });

  const dispatchConsentEvent = useCallback((value: ConsentState) => {
    window.dispatchEvent(
      new CustomEvent('vn-consent-changed', { detail: { consent: value } })
    );
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem('vn_cookie_consent', 'accepted');
    setConsent('accepted');
    dispatchConsentEvent('accepted');
  }, [dispatchConsentEvent]);

  const reject = useCallback(() => {
    localStorage.setItem('vn_cookie_consent', 'rejected');
    setConsent('rejected');
    dispatchConsentEvent('rejected');
  }, [dispatchConsentEvent]);

  return (
    <div className="vn-cookie-toggle">
      {consent === 'accepted' ? (
        <span className="vn-cookie-toggle__status">Cookie разрешены</span>
      ) : consent === 'rejected' ? (
        <span className="vn-cookie-toggle__status">Cookie отключены</span>
      ) : (
        <div className="vn-cookie-toggle__buttons">
          <button onClick={accept} className="vn-btn-primary vn-btn-primary--sm">
            Разрешить
          </button>
          <button onClick={reject} className="vn-btn-ghost vn-btn-ghost--sm">
            Отклонить
          </button>
        </div>
      )}
    </div>
  );
}
