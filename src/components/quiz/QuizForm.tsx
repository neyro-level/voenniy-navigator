import { useState, useCallback } from 'react';
import {
  BadgeCheck,
  Clock,
  HelpCircle,
  BookOpen,
  Building2,
  Layers,
  MapPin,
  Anchor,
  Compass,
  Check,
  Loader2,
} from 'lucide-react';

type QuizStep = 'q1' | 'q2' | 'q3' | 'result' | 'form' | 'submitted';
type MagnetType = 'ipoteka' | 'novostroyki' | 'both';

interface QuizAnswers {
  q1: string | null;
  q2: string | null;
  q3: string | null;
}

interface QOption {
  value: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
}

const Q1_OPTIONS: QOption[] = [
  {
    value: 'Участник НИС, всё оформлено',
    title: 'Участник НИС, всё оформлено',
    sub: 'Могу начинать выбирать квартиру',
    icon: <BadgeCheck size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Имею право, но ещё не начинал',
    title: 'Имею право, но ещё не начинал',
    sub: 'Знаю что военный, но документов нет',
    icon: <Clock size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Не уверен — нужно разобраться',
    title: 'Не уверен — нужно разобраться',
    sub: 'Слышал про программу, хочу понять',
    icon: <HelpCircle size={20} strokeWidth={1.5} />,
  },
];

const Q2_OPTIONS: QOption[] = [
  {
    value: 'ipoteka',
    title: 'Разобраться с ипотекой',
    sub: 'С чего начать, документы, история',
    icon: <BookOpen size={20} strokeWidth={1.5} />,
  },
  {
    value: 'novostroyki',
    title: 'Выбрать квартиру в Краснодаре',
    sub: 'Какие ЖК смотреть, районы, реальные',
    icon: <Building2 size={20} strokeWidth={1.5} />,
  },
  {
    value: 'both',
    title: 'Нужно и то, и другое',
    sub: '',
    icon: <Layers size={20} strokeWidth={1.5} />,
  },
];

const Q3_OPTIONS: QOption[] = [
  {
    value: 'Краснодар',
    title: 'Краснодар',
    sub: '',
    icon: <MapPin size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Крым (Бахчисарай, побережье)',
    title: 'Крым (Бахчисарай, побережье)',
    sub: '',
    icon: <Anchor size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Ещё не определился',
    title: 'Ещё не определился',
    sub: '',
    icon: <Compass size={20} strokeWidth={1.5} />,
  },
];

const MAGNET_LABELS: Record<string, string> = {
  ipoteka: 'Как правильно получить военную ипотеку',
  novostroyki: 'Закрытый разбор новостроек Краснодара',
  both: 'Оба материала — ипотека + новостройки',
};

const METHOD_LABELS: Record<string, string> = {
  call: 'Звонок',
  telegram: 'Telegram',
  max: 'Max',
};

function getMagnet(q2: string | null): MagnetType {
  if (q2 === 'novostroyki') return 'novostroyki';
  if (q2 === 'both') return 'both';
  return 'ipoteka';
}

export default function QuizForm() {
  const [step, setStep] = useState<QuizStep>('q1');
  const [answers, setAnswers] = useState<QuizAnswers>({ q1: null, q2: null, q3: null });
  const [selected, setSelected] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState('telegram');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const magnet = getMagnet(answers.q2);
  const currentStepNum = step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q3' ? 3 : 0;

  const handleSelect = useCallback((value: string) => {
    setSelected(value);
  }, []);

  const handleNext = useCallback(() => {
    if (!selected) return;
    if (step === 'q1') {
      setAnswers((a) => ({ ...a, q1: selected }));
      setStep('q2');
      setSelected(null);
    } else if (step === 'q2') {
      setAnswers((a) => ({ ...a, q2: selected }));
      setStep('q3');
      setSelected(null);
    } else if (step === 'q3') {
      setAnswers((a) => ({ ...a, q3: selected }));
      setStep('result');
      setSelected(null);
    }
  }, [step, selected]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!name.trim() || name.trim().length < 2) {
        setError('Введите имя');
        return;
      }
      if (!contact.trim()) {
        setError('Введите телефон или Telegram');
        return;
      }
      if (!consent) {
        setError('Необходимо согласие на обработку данных');
        return;
      }

      setLoading(true);

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            contact: contact.trim(),
            method,
            source: '/video/',
            quiz_answers: {
              q1: answers.q1,
              q2: answers.q2,
              q3: answers.q3,
            },
            magnet,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error || 'Не удалось отправить. Попробуйте ещё раз.');
          setLoading(false);
          return;
        }

        setStep('submitted');
        window.location.href = `/bonus/?v=${magnet}`;
      } catch {
        setError('Ошибка соединения. Попробуйте ещё раз.');
        setLoading(false);
      }
    },
    [name, contact, method, consent, answers, magnet]
  );

  const renderOptions = (options: QOption[], grid?: boolean) => (
    <div className={grid ? 'vn-quiz__options vn-quiz__options--grid' : 'vn-quiz__options'}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`vn-quiz__option ${selected === opt.value ? 'vn-quiz__option--selected' : ''}`}
          onClick={() => handleSelect(opt.value)}
        >
          <span className="vn-quiz__option-icon">{opt.icon}</span>
          <span className="vn-quiz__option-text">
            <span className="vn-quiz__option-title">{opt.title}</span>
            {opt.sub && <span className="vn-quiz__option-sub">{opt.sub}</span>}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="vn-quiz">
      {currentStepNum > 0 && (
        <div className="vn-quiz__progress">
          <span className={`vn-quiz__dot ${currentStepNum >= 1 ? 'vn-quiz__dot--active' : ''}`} />
          <span className={`vn-quiz__dot ${currentStepNum >= 2 ? 'vn-quiz__dot--active' : ''}`} />
          <span className={`vn-quiz__dot ${currentStepNum >= 3 ? 'vn-quiz__dot--active' : ''}`} />
          <span>Вопрос {currentStepNum} из 3</span>
        </div>
      )}

      {step === 'q1' && (
        <>
          <p className="vn-quiz__question">Ваш статус по программе военной ипотеки?</p>
          {renderOptions(Q1_OPTIONS)}
          <button
            type="button"
            className={`vn-quiz__next ${selected ? 'vn-quiz__next--visible' : ''}`}
            onClick={handleNext}
          >
            Далее →
          </button>
        </>
      )}

      {step === 'q2' && (
        <>
          <p className="vn-quiz__question">Что для вас важнее прямо сейчас?</p>
          {renderOptions(Q2_OPTIONS, true)}
          <button
            type="button"
            className={`vn-quiz__next ${selected ? 'vn-quiz__next--visible' : ''}`}
            onClick={handleNext}
          >
            Далее →
          </button>
        </>
      )}

      {step === 'q3' && (
        <>
          <p className="vn-quiz__question">Где планируете покупать?</p>
          {renderOptions(Q3_OPTIONS)}
          <button
            type="button"
            className={`vn-quiz__next ${selected ? 'vn-quiz__next--visible' : ''}`}
            onClick={handleNext}
          >
            Далее →
          </button>
        </>
      )}

      {step === 'result' && (
        <div className="vn-quiz__result">
          <div className="vn-quiz__result-check">
            <Check size={24} strokeWidth={2.5} />
          </div>
          <p className="vn-quiz__result-label">Мы подобрали вам материал</p>
          <p className="vn-quiz__result-context">
            Для тех, кто {answers.q2 === 'ipoteka' ? 'разбирается с ипотекой' : answers.q2 === 'novostroyki' ? 'выбирает квартиру' : 'нужно и то, и другое'}
          </p>
          <p className="vn-quiz__result-title">{MAGNET_LABELS[magnet]}</p>
          <button type="button" className="vn-quiz__open-form" onClick={() => setStep('form')}>
            Получить бесплатно →
          </button>
        </div>
      )}

      {step === 'form' && (
        <form className="vn-quiz__form" onSubmit={handleSubmit}>
          <div className="vn-quiz__form-header">
            <img
              src="/images/mikhail-form.jpg"
              alt="Михаил Хряпин"
              className="vn-quiz__form-avatar"
              loading="lazy"
            />
            <span className="vn-quiz__form-header-text">
              Михаил пришлёт материал<br />сразу после отправки
            </span>
          </div>

          <div className="vn-quiz__field">
            <label className="vn-quiz__field-label">Ваше имя</label>
            <input
              className="vn-quiz__input"
              type="text"
              placeholder="Как к вам обращаться"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="vn-quiz__field">
            <label className="vn-quiz__field-label">Телефон или Telegram</label>
            <input
              className="vn-quiz__input"
              type="text"
              placeholder="+7 (___) ___-__-__ или @telegram"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <div className="vn-quiz__field">
            <label className="vn-quiz__field-label">Удобный способ связи</label>
            <div className="vn-quiz__methods">
              {Object.entries(METHOD_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`vn-quiz__method ${method === key ? 'vn-quiz__method--selected' : ''}`}
                  onClick={() => setMethod(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="vn-quiz__consent">
            <input
              type="checkbox"
              id="quiz-consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <label htmlFor="quiz-consent">
              Даю согласие на обработку персональных данных.{' '}
              <a href="/politika/" target="_blank" rel="noopener noreferrer">
                Политика конфиденциальности
              </a>
            </label>
          </div>

          <button type="submit" className="vn-quiz__submit" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Loader2 size={18} className="spin" /> Отправка...
              </span>
            ) : (
              'Получить материал бесплатно'
            )}
          </button>

          {error && <div className="vn-quiz__error">{error}</div>}
        </form>
      )}
    </div>
  );
}
