// Password hashing with PBKDF2 (Web Crypto API).
// The plain password is never stored: only a random salt and the derived hash.
// Note: this is a client-only demo. Anyone with access to this browser can read
// localStorage, so the hash only protects against casually reading the
// password, not against a determined attacker. Real apps hash on the server.

const ITERATIONS = 310000;
const HASH = 'SHA-256';
const KEY_LENGTH_BITS = 256;
const SALT_BYTES = 16;

export function isCryptoAvailable() {
  return typeof crypto !== 'undefined' && !!crypto.subtle && window.isSecureContext;
}

function toBase64(bytes) {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: HASH, salt, iterations },
    key,
    KEY_LENGTH_BITS,
  );
  return new Uint8Array(bits);
}

/** @returns {Promise<{salt: string, hash: string, iterations: number}>} */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return { salt: toBase64(salt), hash: toBase64(hash), iterations: ITERATIONS };
}

export async function verifyPassword(password, record) {
  const hash = await derive(password, fromBase64(record.salt), record.iterations);
  const expected = fromBase64(record.hash);
  if (hash.length !== expected.length) return false;
  // Compare every byte so the time taken doesn't depend on where they differ.
  let diff = 0;
  for (let i = 0; i < hash.length; i += 1) diff |= hash[i] ^ expected[i];
  return diff === 0;
}
