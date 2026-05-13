// Vanilla TypeScript — без React, без фреймворков
// Управляет состоянием хедера: scroll dock, overlay open/close, focus trap

class NavigationState {
  private header!: HTMLElement;
  private overlay!: HTMLElement;
  private mobileCTA: HTMLElement | null = null;
  private isOpen = false;

  constructor() {
    const header = document.getElementById('site-header');
    const overlay = document.getElementById('route-map-overlay');
    if (!header || !overlay) return;

    this.header = header;
    this.overlay = overlay;
    this.mobileCTA = document.getElementById('mobile-bottom-cta');

    this.init();
  }

  private init() {
    // Scroll → floating dock
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    this.handleScroll();

    // All toggle buttons (header + overlay close btn)
    document.querySelectorAll('[data-nav-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => this.toggle());
    });

    // Close buttons inside overlay
    document.querySelectorAll('[data-nav-close]').forEach((btn) => {
      btn.addEventListener('click', () => this.close());
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Nav links in overlay: close on click
    this.overlay.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => this.close());
    });
  }

  private handleScroll() {
    const scrolled = window.scrollY > 80;
    this.header.setAttribute('data-state', scrolled ? 'dock' : 'top');
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';

    this.overlay.removeAttribute('inert');
    this.overlay.setAttribute('data-open', 'true');
    this.header.setAttribute('data-overlay', 'true');

    // Update aria-expanded on all toggle buttons
    document.querySelectorAll('[data-nav-toggle]').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'true');
    });

    // Hide mobile CTA
    if (this.mobileCTA) this.mobileCTA.style.display = 'none';

    // Focus first close button in overlay
    const closeBtn = this.overlay.querySelector('[data-nav-close]') as HTMLElement | null;
    closeBtn?.focus();
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';

    this.overlay.setAttribute('inert', '');
    this.overlay.setAttribute('data-open', 'false');
    this.header.setAttribute('data-overlay', 'false');

    // Update aria-expanded
    document.querySelectorAll('[data-nav-toggle]').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
    });

    // Restore mobile CTA
    if (this.mobileCTA) this.mobileCTA.style.display = '';

    // Return focus to primary toggle button
    const toggleBtn = document.getElementById('nav-toggle') as HTMLElement | null;
    toggleBtn?.focus();
  }
}

// Init after DOM is ready (Astro module scripts are deferred)
document.addEventListener('DOMContentLoaded', () => {
  new NavigationState();
});
