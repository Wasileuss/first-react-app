import { useState } from 'react';

import { describedBy } from './describedBy';
import eyeHide from '../../assets/icons/eye-hide.svg';
import eyeShow from '../../assets/icons/eye-show.svg';

/** Label + control + error/hint, wired up with aria-describedby. */
export function Field({ id, label, error, hint, children }) {
  return (
    <div className="auth__field">
      <label htmlFor={id} className="auth__label">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="auth__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="auth__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Password input with a show/hide toggle and a Caps Lock warning. */
export function PasswordInput({ id, error, hint, ...props }) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const checkCaps = (event) => {
    if (typeof event.getModifierState === 'function') {
      setCapsLock(event.getModifierState('CapsLock'));
    }
  };

  return (
    <>
      <div className="auth__password">
        <input
          {...props}
          id={id}
          type={visible ? 'text' : 'password'}
          className="auth__input auth__input--password"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { error, hint })}
          onKeyDown={checkCaps}
          onKeyUp={checkCaps}
          onBlur={(event) => {
            setCapsLock(false);
            props.onBlur?.(event);
          }}
          spellCheck={false}
          autoCapitalize="off"
        />
        <button
          type="button"
          className="auth__eye"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setVisible((v) => !v)}
        >
          <img src={visible ? eyeHide : eyeShow} alt="" />
        </button>
      </div>
      {capsLock && <p className="auth__warning auth__warning--inline">Caps Lock is on.</p>}
    </>
  );
}
