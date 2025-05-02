import React from 'react';

function ConfirmationModal({ 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;