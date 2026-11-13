import { useEffect, useId, useRef } from 'react';
import { SlClose } from 'react-icons/sl';

import './confirm-dialog.css';

/**
 * Accessible confirmation dialog built on the native <dialog> element:
 * focus is moved into it and trapped, Escape closes it, the page behind is inert.
 */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (event) => {
    event.preventDefault(); // keep React in control of `open`
    if (!busy) onCancel();
  };

  // A click on the backdrop lands on the <dialog> element itself.
  const handleClick = (event) => {
    if (event.target === ref.current && !busy) onCancel();
  };

  return (
    // Keyboard users close it with Escape (native onCancel); the click handler only adds backdrop clicks.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className="confirm"
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div className="confirm__content">
        <button type="button" className="confirm__close" aria-label="Close" onClick={onCancel} disabled={busy}>
          <SlClose aria-hidden="true" />
        </button>
        <h2 id={titleId} className="confirm__title">
          {title}
        </h2>
        {children && <div className="confirm__body">{children}</div>}
        <div className="confirm__buttons">
          {/* Focus the safe action first, as WAI-ARIA recommends for destructive dialogs. */}
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <button type="button" className="confirm__cancel" onClick={onCancel} disabled={busy} autoFocus>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? 'confirm__ok confirm__ok--danger' : 'confirm__ok'}
            onClick={onConfirm}
            disabled={busy}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
