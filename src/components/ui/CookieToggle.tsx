import { useEffect, useState } from 'react';

export default function CookieToggle() {
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vn_cookie_consent');
    if (stored === 'accepted' || stored === 'rejected') {
      setConsent(stored);
    }
  }, []);

  const toggle = () => {
    const next = consent === 'accepted' ? 'rejected' : 'accepted';
    localStorage.setItem('vn_cookie_consent', next);
    setConsent(next);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={consent === 'accepted'}
      className="vn-cookie-toggle"
      type="button"
    >
      <span className={`vn-cookie-toggle__track ${consent === 'accepted' ? 'is-on' : ''}`}>
        <span className="vn-cookie-toggle__thumb" />
      </span>
      <span className="vn-cookie-toggle__label">
        {consent === 'accepted' ? 'Включены' : 'Отключены'}
      </span>
    </button>
  );
}
