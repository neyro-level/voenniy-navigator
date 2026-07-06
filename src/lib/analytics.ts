import { COOKIE_NAME } from './constants';

/**
 * Unified analytics layer for AMS projects.
 * Currently wraps Yandex Metrica (ym) reachGoal calls.
 * Designed for easy Plausible / GA4 addition later.
 *
 * Usage:
 *   import { track } from '@/lib/analytics';
 *   track('modal_open', { source: 'hero' });
 */

// Window.ym type is already declared in CookieBanner.tsx and RequestModal.tsx
// as (...args: unknown[]) => void; we use that here to avoid TS2717 conflicts.

const COUNTER_ID = Number(import.meta.env.PUBLIC_YM_COUNTER_ID || '110444627');

/** All tracked events across the site */
export type AnalyticsEvent =
  | 'modal_open'
  | 'modal_close'
  | 'lead_submit'
  | 'lead_success'
  | 'lead_error'
  | 'faq_open'
  | 'faq_close'
  | 'page_scroll_50'
  | 'page_scroll_90'
  | 'cta_click'
  | 'phone_click'
  | 'messenger_click'
  | 'video_play'
  | 'download_click'
  | 'nav_map_open'
  | 'nav_map_close';

interface TrackOptions {
  /** Optional event parameters for debugging / segmentation */
  params?: Record<string, string | number | boolean>;
  /** Skip if user has not accepted analytics cookies */
  requireConsent?: boolean;
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(COOKIE_NAME) === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Send a tracked event to all configured analytics backends.
 * Falls back silently if no backend is available.
 */
export function track(event: AnalyticsEvent, options: TrackOptions = {}): void {
  const { params } = options;

  if (typeof window === 'undefined') return;

  if (!hasAnalyticsConsent()) return;

  // Yandex Metrica
  if (COUNTER_ID && window.ym) {
    try {
      window.ym(COUNTER_ID, 'reachGoal', event, params);
    } catch {
      // silently fail — analytics should never break UX
    }
  }

  // Plausible (future)
  // if (window.plausible) { window.plausible(event, { props: params }); }
}

/**
 * Track scroll depth once per page load.
 * Call from a scroll listener or intersection observer.
 */
const scrolledDepths = new Set<number>();

export function trackScrollDepth(depthPercent: number): void {
  if (scrolledDepths.has(depthPercent)) return;
  scrolledDepths.add(depthPercent);

  if (depthPercent >= 90) {
    track('page_scroll_90');
  } else if (depthPercent >= 50) {
    track('page_scroll_50');
  }
}

/**
 * Attach scroll-depth tracking to the current page.
 * Call once per page (e.g. in BaseLayout script or page mount).
 */
export function initScrollTracking(): void {
  if (typeof window === 'undefined') return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        ticking = false;
        return;
      }
      const depth = Math.round((scrollTop / docHeight) * 100);
      trackScrollDepth(50);
      if (depth >= 90) trackScrollDepth(90);
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
