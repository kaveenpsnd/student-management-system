"use client"

function DeleteConfirmationModal({ title, message, onConfirm, onCancel }) {
  return (
    <div>
      <style>{`
        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4); /* Dark semi-transparent background */
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-in-out;
        }

        /* Modal Container */
        .modal-container {
          background-color: white;
          border-radius: 12px; /* More rounded corners */
          width: 450px;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transform: scale(0.95);
          animation: scaleUp 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }

        /* Modal Header */
        .modal-header {
          background-color: #FF6F61; /* Vibrant coral */
          color: white;
          padding: 20px;
          text-align: center;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 22px;
          font-weight: bold;
        }

        /* Modal Body */
        .modal-body {
          padding: 20px;
          color: #4A4A4A;
          font-size: 16px;
          line-height: 1.5;
          text-align: center;
        }

        /* Modal Footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          padding: 20px;
          background-color: #F9F9F9;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .modal-footer button {
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          border: none;
        }

        .cancel-btn {
          background-color: #E0E0E0; /* Soft light gray */
          color: #333;
          margin-right: 10px;
        }

        .cancel-btn:hover {
          background-color: #B0B0B0; /* Slightly darker gray on hover */
          transform: translateY(-2px); /* Subtle hover effect */
        }

        .delete-btn {
          background-color: #FF6F61; /* Coral color */
          color: white;
        }

        .delete-btn:hover {
          background-color: #D95D4E; /* Slightly darker coral on hover */
          transform: translateY(-2px); /* Subtle hover effect */
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>{title}</h3>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button onClick={onCancel} className="cancel-btn">Cancel</button>
            <button onClick={onConfirm} className="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
