import { useRef, useState } from 'react';

import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { useUserState } from '../../hooks/usePersistentState';
import { createId } from '../../lib/storage';
import { LIMITS, isPlainObject } from '../../lib/validation';
import dev from '../../assets/images/dev.webp';
import bg from '../../assets/images/todo-bg.webp';

import './todo.css';

const NO_TODOS = [];
const isTodoList = (v) =>
  Array.isArray(v) && v.every((t) => isPlainObject(t) && t.id !== undefined && typeof t.activity === 'string');

export default function Todo() {
  const [todos, setTodos, saveError] = useUserState('todos', NO_TODOS, isTodoList);
  const [activity, setActivity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const inputRef = useRef(null);

  const resetForm = () => {
    setActivity('');
    setEditingId(null);
    setMsg('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = activity.trim();
    if (!text) {
      setMsg('Enter an activity.');
      inputRef.current?.focus();
      return;
    }
    if (text.length > LIMITS.todoMax) {
      setMsg(`An activity can be at most ${LIMITS.todoMax} characters.`);
      return;
    }
    if (editingId !== null) {
      setTodos((list) => list.map((t) => (t.id === editingId ? { ...t, activity: text } : t)));
    } else {
      setTodos((list) => [...list, { id: createId(), activity: text, isComplete: false }]);
    }
    resetForm();
  };

  const startEdit = (todo) => {
    setActivity(todo.activity);
    setEditingId(todo.id);
    setMsg('');
    inputRef.current?.focus();
  };

  const remove = (id) => {
    setTodos((list) => list.filter((t) => t.id !== id));
    if (id === editingId) resetForm();
  };

  const toggleComplete = (id) => {
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, isComplete: !t.isComplete } : t)));
  };

  const clearAll = () => {
    setTodos([]);
    resetForm();
    setConfirmClear(false);
  };

  return (
    <div className="todo" style={{ background: `url(${bg})`, backgroundSize: 'contain' }}>
      <h2 className="title animate__animated animate__zoomInDown">Todo</h2>
      <form className="todo__form form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="todo-input" className="visually-hidden">
          {editingId !== null ? 'Edit activity' : 'New activity'}
        </label>
        <input
          ref={inputRef}
          id="todo-input"
          type="text"
          name="todo"
          value={activity}
          placeholder="Insert here..."
          maxLength={LIMITS.todoMax}
          onChange={(e) => {
            setActivity(e.target.value);
            if (msg) setMsg('');
          }}
          onKeyDown={(e) => e.key === 'Escape' && editingId !== null && resetForm()}
          className="form__input"
          aria-invalid={msg ? true : undefined}
          aria-describedby={msg ? 'todo-msg' : undefined}
        />
        <div className="form__msg" id="todo-msg" role="alert">
          {(msg || saveError) && <p>{msg || saveError}</p>}
        </div>
        <div className="form__btns btn">
          <button type="submit" className="btn__new">
            {editingId !== null ? 'Save Todo' : 'New Todo'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={resetForm} className="btn__cancel">
              Cancel
            </button>
          )}
          {todos.length > 0 && (
            <button type="button" onClick={() => setConfirmClear(true)} className="btn__clear">
              Clear All
            </button>
          )}
        </div>
      </form>
      <div className="todo__container">
        <div className="todo__create">
          <div className="todo__img">
            <img src={dev} alt="" />
          </div>
        </div>

        <div className="todos">
          <div className="todos__container">
            {todos.length === 0 ? (
              <p className="todos__msg">The list is empty</p>
            ) : (
              <ul className="todos__list task">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className={todo.isComplete ? 'task__complete' : 'animate__animated animate__backInRight'}
                  >
                    <span className={todo.isComplete ? 'task__complete' : ''}>{todo.activity}</span>
                    <div className="task__btns but">
                      <button
                        type="button"
                        onClick={() => startEdit(todo)}
                        className={todo.isComplete ? 'but__edit' : 'but__edit--active'}
                        aria-label={`Edit "${todo.activity}"`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(todo.id)}
                        className={todo.isComplete ? 'but__delete' : 'but__delete--active'}
                        aria-label={`Delete "${todo.activity}"`}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleComplete(todo.id)}
                        className={todo.isComplete ? 'but__uncheck' : 'but__check'}
                        aria-pressed={Boolean(todo.isComplete)}
                        aria-label={`${todo.isComplete ? 'Mark as not done' : 'Mark as done'}: "${todo.activity}"`}
                      >
                        {todo.isComplete ? 'Uncheck' : 'Check'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all todos?"
        confirmLabel="Clear all"
        onCancel={() => setConfirmClear(false)}
        onConfirm={clearAll}
      >
        <p>
          All {todos.length} {todos.length === 1 ? 'todo' : 'todos'} will be deleted.
        </p>
      </ConfirmDialog>
    </div>
  );
}
