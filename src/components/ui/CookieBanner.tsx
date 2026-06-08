import { useEffect, useState } from 'react';
import { COOKIE_NAME } from '../../lib/constants';
import '../../styles/cookie-banner.css';

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    __vnMetrikaInitialized?: boolean;
  }
}

function dispatchConsentEvent(consent: 'accepted' | 'rejected') {
  window.dispatchEvent(new CustomEvent('vn-consent-changed', { detail: { consent } }));
}

function hasAcceptedConsent() {
  try {
    return window.localStorage.getItem(COOKIE_NAME) === 'accepted';
  } catch {
    return false;
  }
}

function initYandexMetrika(counterId: string) {
  if (!counterId || !hasAcceptedConsent()) return;
  if (window.__vnMetrikaInitialized || document.querySelector('script[data-vn-metrika="true"]')) return;

  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.dataset.vnMetrika = 'true';
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
    ym(${counterId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
  `;

  window.__vnMetrikaInitialized = true;
  document.head.appendChild(script);
  window.dispatchEvent(new CustomEvent('ptupdate'));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_NAME);
    if (!consent) {
      setVisible(true);
    } else if (consent === 'accepted') {
      const counterId = import.meta.env.PUBLIC_YM_COUNTER_ID;
      if (counterId) initYandexMetrika(counterId);
    }

    const handleConsentChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ consent?: string }>).detail;
      if (detail?.consent === 'accepted') {
        const counterId = import.meta.env.PUBLIC_YM_COUNTER_ID;
        if (counterId) initYandexMetrika(counterId);
      }
    };

    window.addEventListener('vn-consent-changed', handleConsentChanged);

    return () => {
      window.removeEventListener('vn-consent-changed', handleConsentChanged);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_NAME, 'accepted');
    setVisible(false);
    dispatchConsentEvent('accepted');
    const counterId = import.meta.env.PUBLIC_YM_COUNTER_ID;
    if (counterId) initYandexMetrika(counterId);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_NAME, 'rejected');
    setVisible(false);
    dispatchConsentEvent('rejected');
  };

  if (!visible) return null;

  return (
    <div className="vn-cookie" role="dialog" aria-label="Использование файлов cookie">
      <div className="vn-cookie__inner">
        <div className="vn-cookie__mark" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="vn-cookie__copy">
          <p className="vn-cookie__title">Cookie</p>
          <p className="vn-cookie__text">
            Мы используем cookie, чтобы сайт работал корректно и становился удобнее.{' '}
            <a href="/cookies/" className="vn-cookie__link">
              Подробнее
            </a>
          </p>
        </div>
        <div className="vn-cookie__actions">
          <button className="vn-cookie__btn vn-cookie__btn--accept" type="button" onClick={handleAccept}>
            Принять
          </button>
          <button className="vn-cookie__btn vn-cookie__btn--reject" type="button" onClick={handleReject}>
            Только необходимые
          </button>
        </div>
      </div>
    </div>
  );
}
