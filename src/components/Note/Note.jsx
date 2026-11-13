import { useState } from 'react';

import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { useUserState } from '../../hooks/usePersistentState';
import { createId } from '../../lib/storage';
import { LIMITS, isPlainObject } from '../../lib/validation';
import bg from '../../assets/images/note-bg.webp';

import './note.css';

const COLORS = ['#F0F8FF', '#FAFAD2', '#FFE4E1', '#98FB98', '#F0E68C', '#E0FFFF', '#FFDAB9', '#FFE4B5', '#FFFAF0'];
const NO_NOTES = [];
const isNoteList = (v) =>
  Array.isArray(v) && v.every((n) => isPlainObject(n) && n.id !== undefined && typeof n.text === 'string');

// Only colors from the palette are used, so stored data can't inject arbitrary CSS values.
const safeColor = (color) => (COLORS.includes(color) ? color : COLORS[0]);
const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
}

export default function Note() {
  const [notes, setNotes, saveError] = useUserState('notes', NO_NOTES, isNoteList);
  const [confirm, setConfirm] = useState(null); // { type: 'one', id } | { type: 'all' }

  const addNote = () => {
    setNotes((list) => [...list, { id: createId(), color: randomColor(), text: '' }]);
  };

  const updateNote = (id, text) => {
    setNotes((list) => list.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const deleteNote = (id) => {
    setNotes((list) => list.filter((n) => n.id !== id));
  };

  const requestDelete = (note) => {
    // Empty notes are removed right away; notes with text ask first.
    if (note.text.trim()) setConfirm({ type: 'one', id: note.id });
    else deleteNote(note.id);
  };

  const handleConfirm = () => {
    if (confirm?.type === 'all') setNotes([]);
    else if (confirm) deleteNote(confirm.id);
    setConfirm(null);
  };

  return (
    <div className="note" style={{ background: `url(${bg})`, backgroundSize: 'contain' }}>
      <div className="note__content">
        <h2 className="title animate__animated animate__zoomInDown">Note</h2>
        <div className="note__enter">
          <button type="button" className="note__btn" onClick={addNote}>
            New Note
          </button>
          {notes.length > 0 && (
            <button type="button" className="note__btn note__btn--clear" onClick={() => setConfirm({ type: 'all' })}>
              Clear All
            </button>
          )}
        </div>
      </div>
      <div className="notes">
        <div className="notes__title">
          <h3>Note List</h3>
          <p className="notes__hint">Notes are saved automatically.</p>
        </div>
        {saveError && (
          <p className="notes__error" role="alert">
            {saveError}
          </p>
        )}
        {notes.length === 0 ? (
          <p className="notes__msg">No notes yet</p>
        ) : (
          <div className="notes__list">
            {notes.map((note, index) => (
              <div key={note.id} className="notes__block">
                <div
                  className="notes__content animate__animated animate__backInUp"
                  style={{ backgroundColor: safeColor(note.color) }}
                >
                  <div className="notes__btn">
                    <button type="button" className="del-btn" onClick={() => requestDelete(note)} aria-label={`Delete note ${index + 1}`}>
                      Delete
                    </button>
                  </div>
                  <div className="notes__input">
                    <label htmlFor={`note-${note.id}`} className="visually-hidden">
                      Note {index + 1}
                    </label>
                    <textarea
                      id={`note-${note.id}`}
                      rows={5}
                      value={note.text}
                      maxLength={LIMITS.noteMax}
                      onChange={(e) => {
                        updateNote(note.id, e.target.value);
                        autoResize(e.target);
                      }}
                      placeholder="Write your note here..."
                      className="notes__textarea"
                      style={{ backgroundColor: safeColor(note.color) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.type === 'all' ? 'Clear all notes?' : 'Delete note?'}
        confirmLabel={confirm?.type === 'all' ? 'Clear all' : 'Delete'}
        onCancel={() => setConfirm(null)}
        onConfirm={handleConfirm}
      >
        <p>
          {confirm?.type === 'all'
            ? `All ${notes.length} ${notes.length === 1 ? 'note' : 'notes'} will be deleted.`
            : 'This note will be deleted.'}
        </p>
      </ConfirmDialog>
    </div>
  );
}
