import { useId, useState } from 'react';

import { LIMITS, normalizeEmail, validateEmail, validateName, validatePhone } from '../../lib/validation';

const EMPTY = { first_name: '', last_name: '', phone: '', email: '' };

const FIELDS = [
  { name: 'first_name', label: 'First name', autoComplete: 'off' },
  { name: 'last_name', label: 'Last name', autoComplete: 'off' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'off', placeholder: '+380 67 123 4567' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'off', placeholder: 'name@example.com' },
];

/**
 * Add / edit form for a contact.
 * `contacts` and `contact` are used to warn about duplicates (excluding itself).
 */
export default function ContactForm({ contact, contacts, onSubmit, onCancel }) {
  const formId = useId();
  const [values, setValues] = useState(() =>
    contact ? { ...EMPTY, ...pick(contact) } : EMPTY,
  );
  const [submitted, setSubmitted] = useState(false);
  const isEdit = Boolean(contact);

  const others = contacts.filter((c) => c.id !== contact?.id);
  const errors = {
    first_name: validateName(values.first_name, 'First name'),
    last_name: validateName(values.last_name, 'Last name'),
    phone: validatePhone(values.phone),
    email: validateEmail(values.email),
  };
  if (!errors.email && others.some((c) => normalizeEmail(c.email) === normalizeEmail(values.email))) {
    errors.email = 'A contact with this email already exists.';
  }
  const digits = values.phone.replace(/\D/g, '');
  if (!errors.phone && others.some((c) => c.phone.replace(/\D/g, '') === digits)) {
    errors.phone = 'A contact with this phone already exists.';
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELDS.find((f) => errors[f.name]);
    if (firstInvalid) {
      document.getElementById(`${formId}-${firstInvalid.name}`)?.focus();
      return;
    }
    onSubmit({
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    });
    if (!isEdit) {
      setValues(EMPTY);
      setSubmitted(false);
    }
  };

  return (
    <form className="contact__form" onSubmit={handleSubmit} noValidate aria-label={isEdit ? 'Edit contact' : 'Add contact'}>
      {FIELDS.map((field) => {
        const id = `${formId}-${field.name}`;
        const error = submitted && errors[field.name];
        return (
          <div className="contact__field" key={field.name}>
            <label htmlFor={id} className="visually-hidden">
              {field.label}
            </label>
            <input
              id={id}
              name={field.name}
              className="contact__input"
              type={field.type ?? 'text'}
              placeholder={field.placeholder ?? field.label}
              autoComplete={field.autoComplete}
              maxLength={field.name === 'email' ? LIMITS.emailMax : LIMITS.nameMax}
              value={values[field.name]}
              onChange={handleChange}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            {error && (
              <p id={`${id}-error`} className="error-message" role="alert">
                {error}
              </p>
            )}
          </div>
        );
      })}
      <div className="contact__actions">
        {isEdit && (
          <button type="button" className="contact__button contact__button--secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="contact__button">
          {isEdit ? 'Save' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}

function pick(contact) {
  return {
    first_name: String(contact.first_name ?? ''),
    last_name: String(contact.last_name ?? ''),
    phone: String(contact.phone ?? ''),
    email: String(contact.email ?? ''),
  };
}
