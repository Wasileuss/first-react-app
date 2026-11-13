import { makeAutoObservable, runInAction } from 'mobx';

import { hashPassword, isCryptoAvailable, verifyPassword } from '../lib/password';
import {
  STORAGE_PREFIX,
  createId,
  readJSON,
  removeByPrefix,
  removeKey,
  writeJSON,
} from '../lib/storage';
import {
  isPlainObject,
  isString,
  normalizeEmail,
  validateEmail,
  validateNewPassword,
} from '../lib/validation';

// Browser-only authentication for a demo app.
// Accounts, sessions and app data live in this browser's storage. There is no
// server, so this can't protect data from someone who has access to the
// browser itself. It does avoid the usual mistakes: no plain-text passwords,
// no hard-coded credentials, sessions that expire, and data kept per account.

const ACCOUNTS_KEY = `${STORAGE_PREFIX}accounts`;
const SESSION_KEY = `${STORAGE_PREFIX}session`;
const ATTEMPTS_KEY = `${STORAGE_PREFIX}login-attempts`;

const REMEMBER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours when "remember me" is off
export const MAX_ATTEMPTS = 5;
const LOCK_MS = 60 * 1000;

const isAccount = (a) =>
  isPlainObject(a) &&
  isString(a.id) &&
  isString(a.email) &&
  isString(a.salt) &&
  isString(a.hash) &&
  Number.isInteger(a.iterations);

const isAccountList = (v) => Array.isArray(v) && v.every(isAccount);
const isSession = (v) => isPlainObject(v) && isString(v.userId) && typeof v.expiresAt === 'number';

export const userKey = (userId, name) => `${STORAGE_PREFIX}user:${userId}:${name}`;

function readAccounts() {
  return readJSON(ACCOUNTS_KEY, [], isAccountList);
}

function readAttempts() {
  return readJSON(ATTEMPTS_KEY, {}, isPlainObject);
}

class AuthStore {
  user = null; // { id, email, createdAt }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    removeLegacyCredentials();
    this.restoreSession();
    window.addEventListener('storage', (event) => {
      // Logged out (or in) in another tab.
      if (event.key === SESSION_KEY || event.key === null) this.restoreSession();
    });
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  restoreSession() {
    const session =
      readJSON(SESSION_KEY, null, isSession, 'session') ?? readJSON(SESSION_KEY, null, isSession);
    const account = session && readAccounts().find((a) => a.id === session.userId);

    if (!session || !account || session.expiresAt <= Date.now()) {
      if (session) this.clearSession();
      this.user = null;
      return;
    }
    this.user = publicUser(account);
  }

  /** Logs out if the session expired while the app was open. */
  checkSession() {
    if (this.user) this.restoreSession();
  }

  /** @returns {Promise<{ok: true} | {ok: false, field?: string, error: string}>} */
  async register({ email, password }) {
    if (!isCryptoAvailable()) return cryptoError();

    const emailError = validateEmail(email);
    if (emailError) return { ok: false, field: 'email', error: emailError };
    const passwordError = validateNewPassword(password, email);
    if (passwordError) return { ok: false, field: 'password', error: passwordError };

    const normalized = normalizeEmail(email);
    if (readAccounts().some((a) => a.email === normalized)) {
      return { ok: false, field: 'email', error: 'An account with this email already exists.' };
    }

    const { salt, hash, iterations } = await hashPassword(password);
    const account = {
      id: createId(),
      email: normalized,
      salt,
      hash,
      iterations,
      createdAt: new Date().toISOString(),
    };

    // Re-read right before writing: another tab may have registered meanwhile.
    const accounts = readAccounts();
    if (accounts.some((a) => a.email === normalized)) {
      return { ok: false, field: 'email', error: 'An account with this email already exists.' };
    }
    const saveError = writeJSON(ACCOUNTS_KEY, [...accounts, account]);
    if (saveError) return { ok: false, error: saveError };

    migrateLegacyData(account.id);
    return this.startSession(account, false);
  }

  /**
   * @returns {Promise<{ok: true} | {ok: false, error: string, lockedUntil?: number, attemptsLeft?: number}>}
   */
  async login({ email, password, remember }) {
    if (!isCryptoAvailable()) return cryptoError();

    const normalized = normalizeEmail(email);
    const lockedUntil = this.lockedUntil(normalized);
    if (lockedUntil) {
      return { ok: false, lockedUntil, error: 'Too many failed attempts.' };
    }

    const account = readAccounts().find((a) => a.email === normalized);
    // Same message for an unknown email and a wrong password.
    const valid = account ? await verifyPassword(password, account) : false;

    if (!valid) {
      const result = registerFailedAttempt(normalized);
      return {
        ok: false,
        error: 'Incorrect email or password.',
        attemptsLeft: result.lockedUntil ? 0 : MAX_ATTEMPTS - result.count,
        lockedUntil: result.lockedUntil || undefined,
      };
    }

    clearAttempts(normalized);
    migrateLegacyData(account.id);
    return this.startSession(account, remember);
  }

  logout() {
    this.clearSession();
    this.user = null;
  }

  /** Deletes the account and everything stored for it in this browser. */
  async deleteAccount(password) {
    if (!this.user) return { ok: false, error: 'You are not logged in.' };
    const account = readAccounts().find((a) => a.id === this.user.id);
    if (!account || !(await verifyPassword(password, account))) {
      return { ok: false, error: 'Incorrect password.' };
    }
    const saveError = writeJSON(
      ACCOUNTS_KEY,
      readAccounts().filter((a) => a.id !== account.id),
    );
    if (saveError) return { ok: false, error: saveError };
    removeByPrefix(userKey(account.id, ''));
    clearAttempts(account.email);
    runInAction(() => this.logout());
    return { ok: true };
  }

  isEmailRegistered(email) {
    const normalized = normalizeEmail(email);
    return readAccounts().some((a) => a.email === normalized);
  }

  lockedUntil(normalizedEmail) {
    const entry = readAttempts()[normalizedEmail];
    return entry && entry.lockedUntil > Date.now() ? entry.lockedUntil : 0;
  }

  startSession(account, remember) {
    const session = {
      userId: account.id,
      expiresAt: Date.now() + (remember ? REMEMBER_MS : SESSION_MS),
    };
    this.clearSession();
    // "Remember me" keeps the session after the browser is closed;
    // otherwise it lives in sessionStorage and ends with the tab.
    const saveError = writeJSON(SESSION_KEY, session, remember ? 'local' : 'session');
    if (saveError) return { ok: false, error: saveError };
    runInAction(() => {
      this.user = publicUser(account);
    });
    return { ok: true };
  }

  clearSession() {
    removeKey(SESSION_KEY, 'local');
    removeKey(SESSION_KEY, 'session');
  }
}

function publicUser(account) {
  return { id: account.id, email: account.email, createdAt: account.createdAt };
}

function cryptoError() {
  return {
    ok: false,
    error: 'Secure login needs HTTPS (or localhost). Open the app over a secure connection.',
  };
}

// Lockout data lives in localStorage too, so it only slows down guessing in
// the UI; it is not a real security boundary.
function registerFailedAttempt(normalizedEmail) {
  const attempts = readAttempts();
  const prev = attempts[normalizedEmail];
  const count = (prev && !(prev.lockedUntil > 0) ? prev.count : 0) + 1;
  const entry = count >= MAX_ATTEMPTS ? { count: 0, lockedUntil: Date.now() + LOCK_MS } : { count, lockedUntil: 0 };
  writeJSON(ATTEMPTS_KEY, { ...attempts, [normalizedEmail]: entry });
  return { count, lockedUntil: entry.lockedUntil };
}

function clearAttempts(normalizedEmail) {
  const attempts = readAttempts();
  if (!(normalizedEmail in attempts)) return;
  delete attempts[normalizedEmail];
  writeJSON(ATTEMPTS_KEY, attempts);
}

// Older versions stored the email and the plain-text password under these keys,
// and an unvalidated weather cache (now kept under `rma:weather`).
function removeLegacyCredentials() {
  removeKey('email');
  removeKey('password');
  removeKey('weatherData');
}

// Older versions kept todos/notes/contacts under global keys. Move them into
// the first account that logs in, so nobody loses their data after updating.
const LEGACY_DATA = [
  { from: 'todos', to: 'todos' },
  { from: 'notes', to: 'notes' },
  { from: 'users', to: 'contacts' },
];

function migrateLegacyData(userId) {
  LEGACY_DATA.forEach(({ from, to }) => {
    const legacy = readJSON(from, null, Array.isArray);
    if (legacy === null) return;
    const target = userKey(userId, to);
    if (readJSON(target, null) === null) writeJSON(target, legacy);
    removeKey(from);
  });
}

export const auth = new AuthStore();
