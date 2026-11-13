import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlClose } from 'react-icons/sl';
import { AiOutlineFileDone } from 'react-icons/ai';

import { LIMITS, validateAge, validateName, validatePhone } from '../../../lib/validation';
import { PROFILE_FIELDS, useProfile } from '../profile';

import './styles.css';

function validate(values) {
  const nick = values.nick_name.trim();
  return {
    first_name: validateName(values.first_name, 'First name', { required: false }),
    last_name: validateName(values.last_name, 'Last name', { required: false }),
    nick_name: nick.length > LIMITS.nameMax ? `Nickname must be at most ${LIMITS.nameMax} characters.` : '',
    phone: validatePhone(values.phone, { required: false }),
    age: validateAge(values.age),
    country: validateName(values.country, 'Country', { required: false }),
    city: validateName(values.city, 'City', { required: false }),
    gender: '',
  };
}

export default function UserInfo() {
  const navigate = useNavigate();
  const [profile, setProfile] = useProfile();
  const [values, setValues] = useState(profile);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState('');
  const dialogRef = useRef(null);

  // Native modal dialog: focus trap, Escape and inert background for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.open && dialog.close();
  }, []);

  const errors = validate(values);
  const close = () => navigate('/profile');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const firstInvalid = PROFILE_FIELDS.find((f) => errors[f.name]);
    if (firstInvalid) {
      document.getElementById(`profile-${firstInvalid.name}`)?.focus();
      return;
    }
    const trimmed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
    const error = setProfile(trimmed);
    if (error) {
      setSaveError(error);
      return;
    }
    close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="user-info"
      aria-labelledby="profile-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <form className="user-info__content" onSubmit={handleSubmit} noValidate>
        <button type="button" className="user-info__close" aria-label="Close" onClick={close}>
          <SlClose aria-hidden="true" />
        </button>
        <h2 id="profile-title" className="user-info__title">
          Edit profile
        </h2>
        {saveError && (
          <p className="user-info__alert" role="alert">
            {saveError}
          </p>
        )}
        <ul className="user-info__list">
          {PROFILE_FIELDS.map((field) => {
            const id = `profile-${field.name}`;
            const error = submitted && errors[field.name];
            const common = {
              id,
              name: field.name,
              className: 'user-info__input',
              value: values[field.name],
              onChange: handleChange,
              'aria-invalid': error ? true : undefined,
              'aria-describedby': error ? `${id}-error` : undefined,
            };
            return (
              <li className="user-info__item" key={field.name}>
                <label htmlFor={id}>{field.label}</label>
                <div className="user-info__control">
                  {field.options ? (
                    <select {...common}>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option || 'Not specified'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...common}
                      type={field.type ?? 'text'}
                      inputMode={field.inputMode}
                      autoComplete={field.autoComplete}
                      maxLength={field.name === 'age' ? 3 : LIMITS.nameMax}
                    />
                  )}
                  {error && (
                    <p id={`${id}-error`} className="user-info__error" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="user-info__actions">
          <button type="button" className="user-info__cancel" onClick={close}>
            Cancel
          </button>
          <button type="submit" className="user-info__done">
            Save profile <AiOutlineFileDone aria-hidden="true" />
          </button>
        </div>
      </form>
    </dialog>
  );
}
