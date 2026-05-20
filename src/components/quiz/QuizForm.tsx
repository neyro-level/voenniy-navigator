import { useState, useCallback } from 'react';
import { sendLead } from '@/lib/leads';
import {
  Building2,
  MapPin,
  Compass,
  Check,
  Loader2,
  Home,
  KeyRound,
  Landmark,
  Route,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react';

type QuizStep = 'q1' | 'q2' | 'q3' | 'q4' | 'result' | 'form' | 'submitted';
type MagnetType = 'novostroyki';

interface QuizAnswers {
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string | null;
}

interface QOption {
  value: string;
  title: string;
  sub: string;
  icon: React.ReactNode;
}

const STEP_META: Record<Exclude<QuizStep, 'result' | 'form' | 'submitted'>, { label: string; hint: string }> = {
  q1: {
    label: 'География',
    hint: 'Это поможет понять, какие локации и ЖК показывать в разборе.',
  },
  q2: {
    label: 'Задача',
    hint: 'Так разбор будет ближе к вашей реальной цели покупки.',
  },
  q3: {
    label: 'Этап',
    hint: 'Михаил поймёт, нужен обзор рынка или проверка конкретных вариантов.',
  },
  q4: {
    label: 'Приоритет',
    hint: 'Финальный вопрос покажет, на чём сделать главный акцент.',
  },
};

const Q1_OPTIONS: QOption[] = [
  {
    value: 'Краснодар',
    title: 'Краснодар',
    sub: 'Смотрю новостройки в городе',
    icon: <Building2 size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Краснодарский край',
    title: 'Краснодарский край',
    sub: 'Сравниваю город и ближайшие локации',
    icon: <MapPin size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Пока сравниваю варианты',
    title: 'Пока сравниваю варианты',
    sub: 'Хочу понять, куда смотреть первым делом',
    icon: <Compass size={20} strokeWidth={1.5} />,
  },
];

const Q2_OPTIONS: QOption[] = [
  {
    value: 'Для жизни семьи',
    title: 'Для жизни семьи',
    sub: 'Важны район, школа, среда и планировка',
    icon: <Users size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Для переезда',
    title: 'Для переезда',
    sub: 'Нужно понять, где удобно стартовать',
    icon: <Home size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Для вложения или сдачи',
    title: 'Для вложения или сдачи',
    sub: 'Смотрю ликвидность и будущий спрос',
    icon: <Landmark size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Пока не решил',
    title: 'Пока не решил',
    sub: 'Хочу сначала увидеть сильные варианты',
    icon: <Route size={20} strokeWidth={1.5} />,
  },
];

const Q3_OPTIONS: QOption[] = [
  {
    value: 'Только изучаю рынок',
    title: 'Только изучаю рынок',
    sub: 'Пока собираю картину по ЖК и районам',
    icon: <Compass size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Уже смотрю конкретные ЖК',
    title: 'Уже смотрю конкретные ЖК',
    sub: 'Нужно понять, что из этого реально стоит внимания',
    icon: <Building2 size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Готовлюсь к сделке',
    title: 'Готовлюсь к сделке',
    sub: 'Хочу проверить риски до выбора объекта',
    icon: <KeyRound size={20} strokeWidth={1.5} />,
  },
];

const Q4_OPTIONS: QOption[] = [
  {
    value: 'Понять, какие ЖК смотреть',
    title: 'Понять, какие ЖК смотреть',
    sub: 'Нужен короткий список сильных направлений',
    icon: <Building2 size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Не ошибиться с районом',
    title: 'Не ошибиться с районом',
    sub: 'Важно выбрать локацию под задачу',
    icon: <MapPin size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Проверить объект перед покупкой',
    title: 'Проверить объект перед покупкой',
    sub: 'Хочу увидеть, где могут быть слабые места',
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
  },
  {
    value: 'Понять бюджет и маршрут',
    title: 'Понять бюджет и маршрут',
    sub: 'Нужна последовательность действий',
    icon: <WalletCards size={20} strokeWidth={1.5} />,
  },
];

const MAGNET_LABELS: Record<string, string> = {
  novostroyki: 'Закрытый 30-минутный разбор новостроек Краснодара',
};

const METHOD_LABELS: Record<string, string> = {
  call: 'Звонок',
  telegram: 'Telegram',
  max: 'Max',
};

export default function QuizForm() {
  const [step, setStep] = useState<QuizStep>('q1');
  const [answers, setAnswers] = useState<QuizAnswers>({ q1: null, q2: null, q3: null, q4: null });
  const [selected, setSelected] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState('telegram');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const magnet: MagnetType = 'novostroyki';
  const currentStepNum = step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q3' ? 3 : step === 'q4' ? 4 : 0;
  const currentMeta = currentStepNum > 0 ? STEP_META[step as Exclude<QuizStep, 'result' | 'form' | 'submitted'>] : null;

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
      setStep('q4');
      setSelected(null);
    } else if (step === 'q4') {
      setAnswers((a) => ({ ...a, q4: selected }));
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
        await sendLead({
          form: 'video_quiz',
          name: name.trim(),
          contact: contact.trim(),
          method,
          source: '/video/',
          quizAnswers: {
            q1: answers.q1,
            q2: answers.q2,
            q3: answers.q3,
            q4: answers.q4,
          },
          magnet,
        });

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
      {options.map((opt, index) => (
        <button
          key={opt.value}
          type="button"
          className={`vn-quiz__option ${selected === opt.value ? 'vn-quiz__option--selected' : ''}`}
          onClick={() => handleSelect(opt.value)}
        >
          <span className="vn-quiz__option-index">{String(index + 1).padStart(2, '0')}</span>
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
        <div className="vn-quiz__head">
          <div className="vn-quiz__head-row">
            <span className="vn-quiz__kicker">Маршрут подбора</span>
            <span className="vn-quiz__counter">0{currentStepNum} / 04</span>
          </div>
          <div className="vn-quiz__progress" aria-hidden="true">
            <span style={{ width: `${(currentStepNum / 4) * 100}%` }} />
          </div>
          <div className="vn-quiz__steps" aria-label="Шаги квиза">
            {['География', 'Задача', 'Этап', 'Приоритет'].map((label, index) => (
              <span
                key={label}
                className={currentStepNum >= index + 1 ? 'vn-quiz__step vn-quiz__step--active' : 'vn-quiz__step'}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {step === 'q1' && (
        <>
          <p className="vn-quiz__question">Где рассматриваете покупку?</p>
          {currentMeta && <p className="vn-quiz__hint">{currentMeta.hint}</p>}
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
          <p className="vn-quiz__question">Для какой задачи квартира?</p>
          {currentMeta && <p className="vn-quiz__hint">{currentMeta.hint}</p>}
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
          <p className="vn-quiz__question">На каком вы этапе?</p>
          {currentMeta && <p className="vn-quiz__hint">{currentMeta.hint}</p>}
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

      {step === 'q4' && (
        <>
          <p className="vn-quiz__question">Что важнее понять сейчас?</p>
          {currentMeta && <p className="vn-quiz__hint">{currentMeta.hint}</p>}
          {renderOptions(Q4_OPTIONS, true)}
          <button
            type="button"
            className={`vn-quiz__next ${selected ? 'vn-quiz__next--visible' : ''}`}
            onClick={handleNext}
          >
            Подобрать разбор →
          </button>
        </>
      )}

      {step === 'result' && (
        <div className="vn-quiz__result">
          <div className="vn-quiz__result-check">
            <Check size={24} strokeWidth={2.5} />
          </div>
          <p className="vn-quiz__result-label">Разбор подобран</p>
          <p className="vn-quiz__result-context">
            Для вашей задачи: {answers.q2?.toLowerCase() || 'покупка по военной ипотеке'}
          </p>
          <p className="vn-quiz__result-title">{MAGNET_LABELS[magnet]}</p>
          <button type="button" className="vn-quiz__open-form" onClick={() => setStep('form')}>
            Получить видео бесплатно →
          </button>
        </div>
      )}

      {step === 'form' && (
        <form className="vn-quiz__form" onSubmit={handleSubmit}>
          <div className="vn-quiz__form-header">
            <img
              src="/images/mikhail-hero.png"
              alt="Михаил Хряпин"
              className="vn-quiz__form-avatar"
              loading="lazy"
            />
            <span className="vn-quiz__form-header-text">
              Михаил пришлёт закрытый разбор<br />сразу после отправки
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
              'Получить видеоразбор бесплатно'
            )}
          </button>

          {error && <div className="vn-quiz__error">{error}</div>}
        </form>
      )}
    </div>
  );
}
