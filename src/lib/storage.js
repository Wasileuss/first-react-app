// Safe wrappers around Web Storage.
// localStorage can throw (private mode, blocked site data, quota exceeded) and
// its contents can be edited by hand, so every read is parsed defensively and
// validated before the app trusts it.

export const STORAGE_PREFIX = 'rma:';
const CHANGE_EVENT = 'rma:storage-change';

function getArea(area = 'local') {
  try {
    return area === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readRaw(key, area) {
  try {
    return getArea(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function parseJSON(raw, fallback, validate) {
  if (raw === null || raw === undefined) return fallback;
  try {
    const value = JSON.parse(raw);
    return !validate || validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function readJSON(key, fallback, validate, area) {
  return parseJSON(readRaw(key, area), fallback, validate);
}

/** @returns {string|null} an error message, or null on success */
export function writeJSON(key, value, area) {
  const storage = getArea(area);
  if (!storage) return 'Browser storage is not available.';
  try {
    storage.setItem(key, JSON.stringify(value));
    notifyChange(key);
    return null;
  } catch (error) {
    const isQuota = error && (error.name === 'QuotaExceededError' || error.code === 22);
    return isQuota
      ? 'Browser storage is full. Delete some data and try again.'
      : 'Could not save data in the browser.';
  }
}

export function removeKey(key, area) {
  try {
    getArea(area)?.removeItem(key);
    notifyChange(key);
  } catch {
    // ignore: nothing to remove if storage is unavailable
  }
}

/** Removes every key that starts with `prefix`. */
export function removeByPrefix(prefix) {
  const storage = getArea('local');
  if (!storage) return;
  try {
    const keys = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
    keys.forEach((key) => removeKey(key));
  } catch {
    // ignore
  }
}

function notifyChange(key) {
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
}

/**
 * Subscribes to changes of `key` made in this tab (via writeJSON/removeKey)
 * and in other tabs (native `storage` event).
 */
export function subscribe(key, callback) {
  const onLocal = (event) => {
    if (event.detail?.key === key) callback();
  };
  const onOtherTab = (event) => {
    if (event.key === key || event.key === null) callback();
  };
  window.addEventListener(CHANGE_EVENT, onLocal);
  window.addEventListener('storage', onOtherTab);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onLocal);
    window.removeEventListener('storage', onOtherTab);
  };
}

export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
