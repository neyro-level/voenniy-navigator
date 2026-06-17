import { Phone, Send, MessageCircle, type LucideIcon } from 'lucide-react';

export type ContactMethod = 'call' | 'telegram' | 'max';

export type FormErrors = {
  name?: string;
  phone?: string;
  method?: string;
  consent?: string;
};

export const METHOD_OPTIONS: Array<{ value: ContactMethod; label: string; icon: LucideIcon }> = [
  { value: 'call', label: 'Звонок', icon: Phone },
  { value: 'telegram', label: 'Telegram', icon: Send },
  { value: 'max', label: 'Max', icon: MessageCircle },
];

export function normalizePhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('8')) {
    return `7${digits.slice(1)}`.slice(0, 11);
  }

  if (digits.startsWith('7')) {
    return digits.slice(0, 11);
  }

  return `7${digits}`.slice(0, 11);
}

export function formatPhone(value: string) {
  const digits = normalizePhoneDigits(value);

  if (digits.length <= 1) {
    return value.replace(/\D/g, '').length === 0 ? '' : '+7';
  }

  const body = digits.slice(1);
  const part1 = body.slice(0, 3);
  const part2 = body.slice(3, 6);
  const part3 = body.slice(6, 8);
  const part4 = body.slice(8, 10);

  let result = '+7';

  if (part1) result += ` (${part1}`;
  if (part1.length === 3) result += ')';
  if (part2) result += ` ${part2}`;
  if (part3) result += `-${part3}`;
  if (part4) result += `-${part4}`;

  return result;
}

export function getUtmPayload() {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

export function validateForm(name: string, phone: string, method: ContactMethod | '', consent: boolean) {
  const errors: FormErrors = {};
  const phoneDigits = normalizePhoneDigits(phone);

  if (name.trim().length < 2) {
    errors.name = 'Введите имя, чтобы Михаил понял как к вам обратиться.';
  }

  if (phoneDigits.length !== 11) {
    errors.phone = 'Введите телефон в формате +7 (999) 999-99-99.';
  }

  if (!method) {
    errors.method = 'Выберите, куда удобнее ответить.';
  }

  if (!consent) {
    errors.consent = 'Нужно согласие на обработку персональных данных.';
  }

  return errors;
}
