import { useCallback, useState } from 'react';
import { sendLead } from '@/lib/leads';
import { Loader2 } from 'lucide-react';

type MagnetType = 'novostroyki';

const OBJECT_OPTIONS = ['Новостройка', 'Готовая', 'Не знаю'];
const PAYMENT_OPTIONS = ['Без доплаты', 'До 1 млн', 'Посчитать'];
const TIMING_OPTIONS = ['Сейчас', '1-3 мес.', 'Позже'];

const METHOD_LABELS: Record<string, string> = {
  telegram: 'Telegram',
  call: 'Звонок',
  max: 'Max',
};

export default function QuizForm() {
  const [objectType, setObjectType] = useState(OBJECT_OPTIONS[0]);
  const [payment, setPayment] = useState(PAYMENT_OPTIONS[2]);
  const [timing, setTiming] = useState(TIMING_OPTIONS[1]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState('telegram');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const magnet: MagnetType = 'novostroyki';

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!contact.trim()) {
        setError('Укажите телефон или Telegram');
        return;
      }

      if (!consent) {
        setError('Подтвердите согласие на обработку данных');
        return;
      }

      setLoading(true);

      try {
        await sendLead({
          form: 'video_quiz',
          name: name.trim() || 'Не указано',
          contact: contact.trim(),
          method,
          source: '/podbor/',
          quizAnswers: {
            q1: objectType,
            q2: payment,
            q3: timing,
            q4: null,
          },
          magnet,
        });

        setSent(true);
        window.location.href = `/bonus/?v=${magnet}`;
      } catch {
        setError('Ошибка соединения. Попробуйте ещё раз.');
        setLoading(false);
      }
    },
    [contact, consent, method, name, objectType, payment, timing, magnet]
  );

  const renderSegment = (label: string, value: string, options: string[], onChange: (value: string) => void) => (
    <div className="vn-quiz__group">
      <span className="vn-quiz__label">{label}</span>
      <div className="vn-quiz__segment" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={value === option ? 'vn-quiz__choice vn-quiz__choice--active' : 'vn-quiz__choice'}
            onClick={() => onChange(option)}
            aria-pressed={value === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  if (sent) {
    return (
      <div className="vn-quiz vn-quiz--sent">
        <span className="vn-quiz__eyebrow">Заявка отправлена</span>
        <p className="vn-quiz__title">Сейчас откроем бонусный материал</p>
      </div>
    );
  }

  return (
    <form className="vn-quiz" onSubmit={handleSubmit}>
      <div className="vn-quiz__top">
        <span className="vn-quiz__eyebrow">Предварительная проверка</span>
        <p className="vn-quiz__title">Получить подбор вариантов</p>
        <p className="vn-quiz__note">Ответьте на 3 пункта, чтобы эксперт не прислал неподходящие объекты.</p>
      </div>

      {renderSegment('Тип объекта', objectType, OBJECT_OPTIONS, setObjectType)}
      {renderSegment('Доплата', payment, PAYMENT_OPTIONS, setPayment)}
      {renderSegment('Срок покупки', timing, TIMING_OPTIONS, setTiming)}

      <div className="vn-quiz__fields">
        <label className="vn-quiz__field">
          <span className="vn-quiz__label">Имя</span>
          <input
            className="vn-quiz__input"
            type="text"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="vn-quiz__field">
          <span className="vn-quiz__label">Телефон или Telegram</span>
          <input
            className="vn-quiz__input"
            type="text"
            placeholder="+7 или @username"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="vn-quiz__methods" aria-label="Удобный способ связи">
        {Object.entries(METHOD_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={method === key ? 'vn-quiz__method vn-quiz__method--active' : 'vn-quiz__method'}
            onClick={() => setMethod(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="vn-quiz__consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          Принимаю <a href="/soglasie/" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> и <a href="/politika/" target="_blank" rel="noopener noreferrer">политику конфиденциальности</a>
        </span>
      </label>

      <button type="submit" className="vn-quiz__submit" disabled={loading}>
        {loading ? (
          <span className="vn-quiz__submit-inner">
            <Loader2 size={18} className="spin" /> Отправка...
          </span>
        ) : (
          'Получить подбор вариантов'
        )}
      </button>

      {error && <div className="vn-quiz__error">{error}</div>}
    </form>
  );
}
