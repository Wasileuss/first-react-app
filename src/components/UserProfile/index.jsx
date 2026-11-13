import { useState } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';

import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { auth } from '../../store/auth';
import { PROFILE_FIELDS, useProfile } from './profile';
import bg from '../../assets/images/profile-bg.webp';

import './styles.css';

const UserProfile = observer(() => {
  const [profile] = useProfile();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [busy, setBusy] = useState(false);

  const closeDelete = () => {
    setDeleteOpen(false);
    setPassword('');
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!password) {
      setDeleteError('Enter your password to confirm.');
      return;
    }
    setBusy(true);
    const result = await auth.deleteAccount(password);
    setBusy(false);
    if (!result.ok) {
      setDeleteError(result.error);
      setPassword('');
    }
  };

  const memberSince = auth.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : '';

  return (
    <div className="user" style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <h2 className="title animate__animated animate__zoomInDown">User Profile</h2>
      <div className="user__profile">
        <dl className="user__list">
          <div className="user__row">
            <dt>Email</dt>
            <dd>{auth.user?.email}</dd>
          </div>
          {PROFILE_FIELDS.map((field) => (
            <div className="user__row" key={field.name}>
              <dt>{field.label}</dt>
              <dd>{profile[field.name] || <span className="user__empty">—</span>}</dd>
            </div>
          ))}
          {memberSince && (
            <div className="user__row">
              <dt>Member since</dt>
              <dd>{memberSince}</dd>
            </div>
          )}
        </dl>
        <Link className="user__edit" to="/profile/info" aria-label="Edit profile" title="Edit profile">
          <FaUserEdit aria-hidden="true" />
        </Link>
      </div>

      <div className="user__danger">
        <button type="button" className="user__delete" onClick={() => setDeleteOpen(true)}>
          Delete account
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete account?"
        confirmLabel={busy ? 'Deleting…' : 'Delete forever'}
        busy={busy}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
      >
        <p>Your account, todos, notes, contacts and profile will be removed from this browser. This can&apos;t be undone.</p>
        <form
          className="user__confirm-form"
          onSubmit={(e) => {
            e.preventDefault();
            confirmDelete();
          }}
        >
          <label htmlFor="delete-password">Password</label>
          <input
            id="delete-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setDeleteError('');
            }}
            aria-invalid={deleteError ? true : undefined}
            aria-describedby={deleteError ? 'delete-password-error' : undefined}
          />
          {deleteError && (
            <p id="delete-password-error" className="user__error" role="alert">
              {deleteError}
            </p>
          )}
        </form>
      </ConfirmDialog>
    </div>
  );
});

export default UserProfile;
