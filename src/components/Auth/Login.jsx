import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { MAX_ATTEMPTS, auth } from '../../store/auth';
import { LIMITS, validateEmail } from '../../lib/validation';
import { Field, PasswordInput } from './Field';
import { describedBy } from './describedBy';
import StorageNotice from './StorageNotice';

import './auth.css';

function validate({ email, password }) {
  return {
    email: validateEmail(email),
    password: password ? '' : 'Password is required.',
  };
}

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '', remember: false });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const errors = validate(values);
  const show = (name) => (submitted || touched[name]) && errors[name];
  const secondsLeft = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
  const isLocked = secondsLeft > 0;

  // Count down while login is paused.
  useEffect(() => {
    if (!lockedUntil) return undefined;
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= lockedUntil) {
        setLockedUntil(0);
        setAttemptsLeft(MAX_ATTEMPTS);
        setFormError('');
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'email') {
      setFormError('');
      setAttemptsLeft(MAX_ATTEMPTS);
    }
  };

  const handleBlur = (event) => {
    // Leaving a field for the submit button: let submit show the errors. Showing them
    // now would shift the button down before mouseup, so the click would be lost.
    if (event.relatedTarget?.type === 'submit') return;
    setTouched((t) => ({ ...t, [event.target.name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (errors.email) return emailRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();
    if (isLocked || busy) return undefined;

    setBusy(true);
    setFormError('');
    const result = await auth.login(values);
    // On success the router redirects away from this page.
    if (result.ok) return undefined;

    setBusy(false);
    setFormError(result.error);
    setValues((v) => ({ ...v, password: '' }));
    // The password was cleared on purpose: don't flag the now-empty field as an error.
    setSubmitted(false);
    setTouched((t) => ({ ...t, password: false }));
    if (result.lockedUntil) {
      setNow(Date.now());
      setLockedUntil(result.lockedUntil);
    } else {
      setAttemptsLeft(result.attemptsLeft ?? MAX_ATTEMPTS);
      passwordRef.current?.focus();
    }
    return undefined;
  };

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit} noValidate aria-describedby="storage-notice">
        <h2 className="auth__title">Log in</h2>
        <StorageNotice />

        {formError && (
          <div className="auth__alert" role="alert">
            <p>{isLocked ? 'Too many failed attempts.' : formError}</p>
            {isLocked && <p>Login is paused for this email. Try again in {secondsLeft} s.</p>}
            {!isLocked && attemptsLeft > 0 && attemptsLeft <= 2 && (
              <p>
                {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} left before login is paused for 1 minute.
              </p>
            )}
          </div>
        )}

        <Field id="login-email" label="Email" error={show('email')}>
          <input
            ref={emailRef}
            id="login-email"
            name="email"
            type="email"
            className="auth__input"
            autoComplete="username"
            inputMode="email"
            maxLength={LIMITS.emailMax}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={show('email') ? true : undefined}
            aria-describedby={describedBy('login-email', { error: show('email') })}
            required
          />
        </Field>

        <Field id="login-password" label="Password" error={show('password')}>
          <PasswordInput
            ref={passwordRef}
            id="login-password"
            name="password"
            autoComplete="current-password"
            maxLength={LIMITS.passwordMax}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={show('password')}
            required
          />
        </Field>

        <label className="auth__checkbox">
          <input type="checkbox" name="remember" checked={values.remember} onChange={handleChange} />
          Remember me for 30 days
        </label>

        <button type="submit" className="auth__button" disabled={busy || isLocked}>
          {busy ? 'Checking…' : isLocked ? `Try again in ${secondsLeft} s` : 'Log in'}
        </button>

        <p className="auth__switch">
          No account yet? <Link to="/authorization/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
