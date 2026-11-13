import { useState } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { BiEditAlt } from 'react-icons/bi';

import ContactForm from './ContactForm';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { useUserState } from '../../hooks/usePersistentState';
import { createId } from '../../lib/storage';
import { isPlainObject } from '../../lib/validation';
import bg from '../../assets/images/contact-bg.webp';

import './contact.css';

const NO_CONTACTS = [];
const isContactList = (v) => Array.isArray(v) && v.every((c) => isPlainObject(c) && c.id !== undefined);

// Older versions stored numeric ids and an `errors` object inside each contact.
function normalize(contact) {
  return {
    id: String(contact.id),
    first_name: String(contact.first_name ?? ''),
    last_name: String(contact.last_name ?? ''),
    phone: String(contact.phone ?? ''),
    email: String(contact.email ?? ''),
  };
}

export default function Contacts() {
  const [stored, setContacts, saveError] = useUserState('contacts', NO_CONTACTS, isContactList);
  const contacts = stored.map(normalize);
  const [editingId, setEditingId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const addContact = (data) => {
    setContacts((list) => [...list.map(normalize), { id: createId(), ...data }]);
  };

  const updateContact = (id, data) => {
    setContacts((list) => list.map(normalize).map((c) => (c.id === id ? { ...c, ...data } : c)));
    setEditingId(null);
  };

  const deleteContact = () => {
    setContacts((list) => list.map(normalize).filter((c) => c.id !== toDelete.id));
    if (editingId === toDelete.id) setEditingId(null);
    setToDelete(null);
  };

  return (
    <div className="contacts" style={{ background: `url(${bg})`, backgroundSize: 'contain' }}>
      <h2 className="title animate__animated animate__zoomInDown">Contacts</h2>
      {saveError && (
        <p className="error-message error-message--block" role="alert">
          {saveError}
        </p>
      )}
      <div className="contacts__content users">
        <div className="users__list">
          {contacts.length === 0 ? (
            <p className="contacts__msg">No contacts yet. Add the first one.</p>
          ) : (
            <ul>
              {contacts.map((contact) => (
                <li className="edit__user" key={contact.id}>
                  <div className="edit__icons icon">
                    <button
                      type="button"
                      className="icon__button icon__delete"
                      aria-label={`Delete ${contact.first_name} ${contact.last_name}`}
                      onClick={() => setToDelete(contact)}
                    >
                      <IoCloseCircleSharp aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon__button icon__edit"
                      aria-label={`Edit ${contact.first_name} ${contact.last_name}`}
                      aria-expanded={editingId === contact.id}
                      onClick={() => setEditingId(editingId === contact.id ? null : contact.id)}
                    >
                      <BiEditAlt aria-hidden="true" />
                    </button>
                  </div>
                  <div className="edit__info">
                    <p className="edit__first-name">
                      {contact.first_name} <span className="edit__last-name">{contact.last_name}</span>
                    </p>
                    <p className="edit__phone">
                      Phone: <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>
                    </p>
                    <p className="edit__email">
                      Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </p>
                    {editingId === contact.id && (
                      <ContactForm
                        contact={contact}
                        contacts={contacts}
                        onSubmit={(data) => updateContact(contact.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="users__add">
          <h3 className="users__title">New contact</h3>
          <ContactForm contacts={contacts} onSubmit={addContact} />
        </div>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete contact?"
        onCancel={() => setToDelete(null)}
        onConfirm={deleteContact}
      >
        {toDelete && (
          <p>
            {toDelete.first_name} {toDelete.last_name} will be removed.
          </p>
        )}
      </ConfirmDialog>
    </div>
  );
}
