/**
 * Cleans up an email query parameter from the URL after reading it.
 *
 * Usage: after a form redirect with ?email=..., remove it from the URL
 * so the user doesn't see their email in the address bar.
 */

import { useEffect } from 'react';

/**
 * @param paramName — query param key (e.g. 'email')
 * @param onValue  — callback to receive the value
 */
export function useEmailQueryParam(
  paramName: string,
  onValue: (value: string) => void
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('URLSearchParams' in window)) return;

    const { search, pathname } = window.location;
    const params = new URLSearchParams(search);
    const value = params.get(paramName);

    if (value) {
      onValue(value);
      params.delete(paramName);
      const newSearch = params.toString();
      const newPath = pathname + (newSearch ? `?${newSearch}` : '');
      window.history.replaceState({}, '', newPath);
    }
  }, [paramName, onValue]);
}
