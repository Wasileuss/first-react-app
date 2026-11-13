// Shared validation rules. Each validator returns an error message or ''.

export const LIMITS = {
  emailMax: 254,
  passwordMin: 8,
  passwordMax: 128,
  nameMax: 50,
  todoMax: 200,
  noteMax: 5000,
  cityMax: 85,
};

// Pragmatic email check: one @, no spaces, a dot in the domain, no dot at the edges.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;
const NAME_RE = /^[\p{L}\p{M}' .-]+$/u;

const COMMON_PASSWORDS = new Set([
  '12345678', '123456789', '1234567890', 'password', 'password1', 'password123',
  'qwerty123', 'qwertyuiop', '11111111', '00000000', 'iloveyou', 'abc12345',
  'admin123', 'welcome1', 'letmein1', '1q2w3e4r', '1qaz2wsx', 'passw0rd',
  'football1', 'baseball1', 'sunshine1', 'princess1', 'dragon123', 'monkey123',
]);

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function validateEmail(email) {
  const value = email.trim();
  if (!value) return 'Email is required.';
  if (value.length > LIMITS.emailMax) return 'Email is too long.';
  if (!EMAIL_RE.test(value)) return 'Enter a valid email, e.g. name@example.com.';
  return '';
}

/** Rules shown as a live checklist on the sign-up form. */
export function passwordRules(password, email = '') {
  const localPart = normalizeEmail(email).split('@')[0];
  return [
    { id: 'length', label: `At least ${LIMITS.passwordMin} characters`, ok: password.length >= LIMITS.passwordMin },
    { id: 'letter', label: 'Contains a letter', ok: /\p{L}/u.test(password) },
    { id: 'digit', label: 'Contains a number', ok: /\d/.test(password) },
    {
      id: 'email',
      label: "Doesn't contain your email name",
      ok: !localPart || localPart.length < 3 || !password.toLowerCase().includes(localPart),
    },
    { id: 'common', label: 'Not a common password', ok: !COMMON_PASSWORDS.has(password.toLowerCase()) },
  ];
}

export function validateNewPassword(password, email) {
  if (!password) return 'Password is required.';
  if (password.length > LIMITS.passwordMax) return `Password must be at most ${LIMITS.passwordMax} characters.`;
  if (/^\s|\s$/.test(password)) return "Password can't start or end with a space.";
  const failed = passwordRules(password, email).find((rule) => !rule.ok);
  return failed ? `Password requirement not met: ${failed.label.toLowerCase()}.` : '';
}

/** 0–4 score used for the strength meter (a hint, not a hard rule). */
export function passwordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= LIMITS.passwordMin) score += 1;
  if (password.length >= 12) score += 1;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  if (classes >= 3) score += 1;
  if (classes === 4 || password.length >= 16) score += 1;
  if (COMMON_PASSWORDS.has(password.toLowerCase())) score = 0;
  return Math.min(score, 4);
}

export function validateName(value, label, { required = true } = {}) {
  const v = value.trim();
  if (!v) return required ? `${label} is required.` : '';
  if (v.length > LIMITS.nameMax) return `${label} must be at most ${LIMITS.nameMax} characters.`;
  if (!NAME_RE.test(v)) return `${label} can contain only letters, spaces, apostrophes and hyphens.`;
  return '';
}

export function validatePhone(value, { required = true } = {}) {
  const v = value.trim();
  if (!v) return required ? 'Phone is required.' : '';
  if (!PHONE_RE.test(v) || v.replace(/\D/g, '').length < 7) {
    return 'Enter a valid phone, e.g. +380 67 123 4567.';
  }
  return '';
}

export function validateAge(value) {
  const v = String(value).trim();
  if (!v) return '';
  if (!/^\d{1,3}$/.test(v) || Number(v) < 1 || Number(v) > 120) return 'Age must be a whole number from 1 to 120.';
  return '';
}

export const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
export const isString = (v) => typeof v === 'string';
