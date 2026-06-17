import { Check, MessageSquare, MousePointer2, Send, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ReviewBlock = {
  id: string;
  title: string;
  path?: string;
  index: number;
  element: HTMLElement;
};

type SubmitState = 'idle' | 'sending' | 'sent' | 'error';

const apiUrl = import.meta.env.PUBLIC_REVIEW_API_URL || 'https://review.ams-cloud.ru';
const projectId = import.meta.env.PUBLIC_REVIEW_PROJECT_ID || import.meta.env.PUBLIC_PROJECT_ID;
const siteKey = import.meta.env.PUBLIC_REVIEW_SITE_KEY;

function isReviewEnabled() {
  if (typeof window === 'undefined') return false;

  const { hostname, searchParams } = new URL(window.location.href);
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const isPreview = hostname.endsWith('.preview.ams-cloud.ru');
  const isProductionReview = hostname === 'voen-navigator.ru' || hostname === 'www.voen-navigator.ru';

  return isLocal || isPreview || isProductionReview || searchParams.get('review') === '1';
}

function getBlockTitle(section: HTMLElement, index: number) {
  return (
    section.dataset.reviewTitle ||
    section.getAttribute('aria-label') ||
    section.querySelector('h1, h2, h3')?.textContent?.trim() ||
    `Блок ${index + 1}`
  );
}

function collectBlocks() {
  return Array.from(document.querySelectorAll<HTMLElement>('section'))
    .filter((section) => {
      const rect = section.getBoundingClientRect();
      return rect.width > 100 && rect.height > 40 && !section.closest('dialog:not([open])');
    })
    .map((section, index) => ({
      id: section.dataset.reviewId || `section-${index + 1}`,
      title: getBlockTitle(section, index),
      path: section.dataset.reviewPath,
      index: index + 1,
      element: section,
    }));
}

export default function ReviewWidget() {
  const [enabled, setEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [blocks, setBlocks] = useState<ReviewBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ReviewBlock | null>(null);
  const [comment, setComment] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const canSubmit = useMemo(() => comment.trim().length >= 2 && selectedBlock, [comment, selectedBlock]);

  useEffect(() => {
    setEnabled(isReviewEnabled() && Boolean(projectId && siteKey));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    setBlocks(collectBlocks());
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isSelecting) return;

    document.documentElement.classList.add('vn-review-mode');
    blocks.forEach((block) => {
      block.element.classList.add('vn-review-target');
      block.element.dataset.reviewComputedTitle = block.title;
    });

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest('.vn-review-widget')) return;

      const section = target.closest('section');
      if (!(section instanceof HTMLElement)) return;

      const block = blocks.find((item) => item.element === section);
      if (!block) return;

      event.preventDefault();
      event.stopPropagation();
      setSelectedBlock(block);
      setIsSelecting(false);
      setSubmitState('idle');
    };

    document.addEventListener('click', onClick, true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSelecting(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.documentElement.classList.remove('vn-review-mode');
      blocks.forEach((block) => {
        block.element.classList.remove('vn-review-target');
        delete block.element.dataset.reviewComputedTitle;
      });
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [blocks, enabled, isSelecting]);

  if (!enabled) return null;

  async function submitComment() {
    if (!selectedBlock || !canSubmit) return;

    setSubmitState('sending');

    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/v1/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AMS-Site-Key': siteKey,
        },
        body: JSON.stringify({
          project: projectId,
          page: window.location.pathname,
          url: window.location.href,
          block: {
            id: selectedBlock.id,
            title: selectedBlock.title,
            path: selectedBlock.path,
            index: selectedBlock.index,
          },
          comment: comment.trim(),
          meta: {
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: navigator.userAgent,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Review request failed');
      }

      setSubmitState('sent');
      setComment('');
    } catch {
      setSubmitState('error');
    }
  }

  return (
    <div className="vn-review-widget" aria-live="polite">
      <style>{`
        .vn-review-widget {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 2147483000;
          width: min(380px, calc(100vw - 32px));
          color: #0f1419;
          font-family: "Manrope Variable", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .vn-review-widget__panel {
          border: 1px solid rgba(15, 37, 71, 0.14);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 24px 80px rgba(15, 20, 25, 0.22);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .vn-review-widget__launcher {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 46px;
          margin-left: auto;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          padding: 0 16px;
          background: #2563eb;
          color: #fff;
          font-size: var(--fs-body-sm);
          font-weight: 700;
          box-shadow: 0 18px 50px rgba(15, 20, 25, 0.24);
          cursor: pointer;
        }

        .vn-review-widget__head,
        .vn-review-widget__body,
        .vn-review-widget__footer {
          padding: 16px;
        }

        .vn-review-widget__head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(15, 37, 71, 0.1);
        }

        .vn-review-widget__label {
          display: block;
          margin-bottom: 5px;
          color: #2563eb;
          font-size: var(--fs-caption);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .vn-review-widget__title {
          margin: 0;
          font-size: var(--fs-body);
          font-weight: 650;
          line-height: 1.25;
        }

        .vn-review-widget__close {
          display: inline-grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(15, 37, 71, 0.12);
          border-radius: 999px;
          background: #fff;
          color: #0f1419;
          cursor: pointer;
        }

        .vn-review-widget__selected {
          margin: 0 0 12px;
          padding: 12px;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.08);
          color: #253244;
          font-size: var(--fs-body-sm);
          line-height: 1.45;
        }

        .vn-review-widget__empty {
          margin: 0 0 12px;
          color: #4a5568;
          font-size: var(--fs-body-sm);
          line-height: 1.5;
        }

        .vn-review-widget__field {
          display: grid;
          gap: 6px;
          margin-top: 10px;
        }

        .vn-review-widget__field span {
          color: #4a5568;
          font-size: var(--fs-label);
          font-weight: 600;
        }

        .vn-review-widget__input,
        .vn-review-widget__textarea {
          width: 100%;
          border: 1px solid rgba(15, 37, 71, 0.16);
          border-radius: 10px;
          background: #fff;
          color: #0f1419;
          font: inherit;
          font-size: var(--fs-body-sm);
          outline: none;
        }

        .vn-review-widget__input {
          height: 42px;
          padding: 0 12px;
        }

        .vn-review-widget__textarea {
          min-height: 112px;
          resize: vertical;
          padding: 12px;
          line-height: 1.5;
        }

        .vn-review-widget__actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .vn-review-widget__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 0 14px;
          font-size: var(--fs-body-sm);
          font-weight: 650;
          cursor: pointer;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .vn-review-widget__button:hover {
          transform: translateY(-1px);
        }

        .vn-review-widget__button--primary {
          background: #2563eb;
          color: #fff;
        }

        .vn-review-widget__button--ghost {
          border-color: rgba(15, 37, 71, 0.16);
          background: #fff;
          color: #0f1419;
        }

        .vn-review-widget__button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .vn-review-widget__status {
          margin: 14px 0 0;
          color: #4a5568;
          font-size: var(--fs-label);
          line-height: 1.45;
        }

        .vn-review-widget__status--sent {
          color: #047857;
        }

        .vn-review-widget__status--error {
          color: #b42318;
        }

        .vn-review-mode .vn-review-target {
          position: relative;
          outline: 2px solid rgba(37, 99, 235, 0.8);
          outline-offset: -2px;
          cursor: crosshair;
        }

        .vn-review-mode .vn-review-target::after {
          content: attr(data-review-computed-title);
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 20;
          max-width: min(320px, calc(100vw - 48px));
          border-radius: 999px;
          padding: 8px 12px;
          background: #2563eb;
          color: #fff;
          font-size: var(--fs-label);
          font-weight: 650;
          box-shadow: 0 10px 30px rgba(15, 20, 25, 0.18);
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .vn-review-widget {
            right: 12px;
            bottom: 12px;
            width: calc(100vw - 24px);
          }

          .vn-review-widget__head,
          .vn-review-widget__body,
          .vn-review-widget__footer {
            padding: 14px;
          }

          .vn-review-widget__actions {
            flex-direction: column;
            align-items: stretch;
          }

          .vn-review-mode .vn-review-target {
            outline-color: rgba(37, 99, 235, 0.65);
          }

          .vn-review-mode .vn-review-target::after {
            display: none;
            content: none;
          }
        }
      `}</style>

      {!isOpen ? (
        <button
          className="vn-review-widget__launcher"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={16} strokeWidth={1.8} />
          Правки
        </button>
      ) : (
      <div className="vn-review-widget__panel">
        <div className="vn-review-widget__head">
          <div>
            <span className="vn-review-widget__label">Review mode</span>
            <h2 className="vn-review-widget__title">Напишите свой комментарий</h2>
          </div>
          <button
            className="vn-review-widget__close"
            type="button"
            aria-label="Свернуть review-виджет"
            onClick={() => {
              setIsOpen(false);
              setIsSelecting(false);
            }}
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="vn-review-widget__body">
          {selectedBlock ? (
            <p className="vn-review-widget__selected">
              Выбран блок: <strong>{selectedBlock.title}</strong>
            </p>
          ) : (
            <p className="vn-review-widget__empty">
              Нажмите «Выбрать блок», затем кликните по экрану, где нужна правка.
            </p>
          )}

          <div className="vn-review-widget__actions">
            <button
              className="vn-review-widget__button vn-review-widget__button--ghost"
              type="button"
              onClick={() => {
                setBlocks(collectBlocks());
                setIsSelecting((value) => !value);
              }}
            >
              <MousePointer2 size={16} strokeWidth={1.8} />
              {isSelecting ? 'Отменить выбор' : 'Выбрать блок'}
            </button>
          </div>

          <label className="vn-review-widget__field">
            <span>Комментарий</span>
            <textarea
              className="vn-review-widget__textarea"
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                setSubmitState('idle');
              }}
              placeholder="Напишите, какой текст заменить или что поправить в блоке"
            />
          </label>
          <p className="vn-review-widget__status">
            Ваш комментарий уйдёт в рабочий чат к разработчику сайта.
          </p>
        </div>

        <div className="vn-review-widget__footer">
          <div className="vn-review-widget__actions">
            <button
              className="vn-review-widget__button vn-review-widget__button--primary"
              type="button"
              disabled={!canSubmit || submitState === 'sending'}
              onClick={submitComment}
            >
              {submitState === 'sent' ? <Check size={16} strokeWidth={1.8} /> : <Send size={16} strokeWidth={1.8} />}
              {submitState === 'sending' ? 'Отправляем...' : 'Отправить правку'}
            </button>

            {submitState === 'sent' && (
              <p className="vn-review-widget__status vn-review-widget__status--sent">
                Правка отправлена.
              </p>
            )}
            {submitState === 'error' && (
              <p className="vn-review-widget__status vn-review-widget__status--error">
                Не удалось отправить. Попробуйте ещё раз.
              </p>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
