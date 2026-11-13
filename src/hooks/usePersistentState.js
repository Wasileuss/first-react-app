import { useCallback, useState, useSyncExternalStore } from 'react';

import { parseJSON, readRaw, subscribe, writeJSON } from '../lib/storage';
import { auth, userKey } from '../store/auth';

// Parsed values are cached by their raw string so useSyncExternalStore gets a
// stable snapshot (same object) until the stored JSON actually changes.
const cache = new Map();

function snapshot(key, fallback, validate) {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw && cached.fallback === fallback) return cached.value;
  const value = parseJSON(raw, fallback, validate);
  cache.set(key, { raw, fallback, value });
  return value;
}

/**
 * Like useState, but persisted in localStorage under `key`, validated on read,
 * and kept in sync across components and browser tabs.
 *
 * `fallback` and `validate` must be stable (define them outside the component).
 * The setter returns an error message if saving failed, otherwise null.
 */
export function usePersistentState(key, fallback, validate) {
  const [error, setError] = useState(null);

  const value = useSyncExternalStore(
    useCallback((onChange) => subscribe(key, onChange), [key]),
    () => snapshot(key, fallback, validate),
  );

  const setValue = useCallback(
    (next) => {
      const current = snapshot(key, fallback, validate);
      const resolved = typeof next === 'function' ? next(current) : next;
      const saveError = writeJSON(key, resolved);
      setError(saveError);
      return saveError;
    },
    [key, fallback, validate],
  );

  return [value, setValue, error];
}

/** Persistent state that belongs to the logged-in user. */
export function useUserState(name, fallback, validate) {
  // Protected pages render only for a logged-in user, so the id is always set.
  return usePersistentState(userKey(auth.user?.id ?? 'anonymous', name), fallback, validate);
}
