import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../store/auth';
import {
  LIMITS,
  passwordRules,
  passwordStrength,
  validateEmail,
  validateNewPassword,
} from '../../lib/validation';
import { Field, PasswordInput } from './Field';
import { describedBy } from './describedBy';
import StorageNotice from './StorageNotice';

import './auth.css';

const STRENGTH = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

function validate({ email, password, confirm }) {
  let emailError = validateEmail(email);
  if (!emailError && auth.isEmailRegistered(email)) emailError = 'exists';
  return {
    email: emailError,
    password: validateNewPassword(password, email),
    confirm: !confirm ? 'Repeat the password.' : confirm !== password ? "Passwords don't match." : '',
  };
}

export default function SignUp() {
  const [values, setValues] = useState({ email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const errors = validate(values);
  const show = (name) => (submitted || touched[name]) && errors[name];
  const rules = passwordRules(values.password, values.email);
  const strength = passwordStrength(values.password);

  const focusField = (name) => {
    const ref = { email: emailRef, password: passwordRef, confirm: confirmRef }[name];
    ref?.current?.focus();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
    setFormError('');
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
    const firstInvalid = ['email', 'password', 'confirm'].find((name) => errors[name]);
    if (firstInvalid) return focusField(firstInvalid);
    if (busy) return undefined;

    setBusy(true);
    const result = await auth.register(values);
    // On success the user is logged in and the router redirects.
    if (!result.ok) {
      setBusy(false);
      setFormError(result.error);
      if (result.field) focusField(result.field);
    }
    return undefined;
  };

  const emailError =
    show('email') === 'exists' ? (
      <>
        An account with this email already exists. <Link to="/authorization/login">Log in</Link> instead.
      </>
    ) : (
      show('email')
    );

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit} noValidate aria-describedby="storage-notice">
        <h2 className="auth__title">Create account</h2>
        <StorageNotice />

        {formError && (
          <div className="auth__alert" role="alert">
            <p>{formError}</p>
          </div>
        )}

        <Field id="signup-email" label="Email" error={emailError}>
          <input
            ref={emailRef}
            id="signup-email"
            name="email"
            type="email"
            className="auth__input"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.emailMax}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={show('email') ? true : undefined}
            aria-describedby={describedBy('signup-email', { error: show('email') })}
            required
          />
        </Field>

        <Field id="signup-password" label="Password" error={show('password')}>
          <PasswordInput
            ref={passwordRef}
            id="signup-password"
            name="password"
            autoComplete="new-password"
            maxLength={LIMITS.passwordMax}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={show('password')}
            hint="See the requirements below."
            required
          />
          {values.password && (
            <div className="auth__strength" aria-live="polite">
              <div className={`auth__meter auth__meter--${strength}`} aria-hidden="true">
                <span />
              </div>
              <p>
                Strength: <strong>{STRENGTH[strength]}</strong>
                {strength > 0 && strength < 3 && ' — a longer password with mixed characters is safer.'}
              </p>
            </div>
          )}
          <ul className="auth__rules" aria-label="Password requirements">
            {rules.map((rule) => (
              <li key={rule.id} className={rule.ok ? 'auth__rule auth__rule--ok' : 'auth__rule'}>
                <span aria-hidden="true">{rule.ok ? '✓' : '•'}</span> {rule.label}
                <span className="visually-hidden">{rule.ok ? ' (met)' : ' (not met)'}</span>
              </li>
            ))}
          </ul>
        </Field>

        <Field id="signup-confirm" label="Repeat password" error={show('confirm')}>
          <PasswordInput
            ref={confirmRef}
            id="signup-confirm"
            name="confirm"
            autoComplete="new-password"
            maxLength={LIMITS.passwordMax}
            value={values.confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            error={show('confirm')}
            required
          />
        </Field>

        <button type="submit" className="auth__button" disabled={busy}>
          {busy ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="auth__switch">
          Already have an account? <Link to="/authorization/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
