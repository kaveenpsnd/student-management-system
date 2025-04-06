"use client"

function ConfirmationModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger", // danger, warning, info
}) {
  const types = {
    danger: {
      confirmBg: "bg-red-600 hover:bg-red-700",
      icon: "🚫",
    },
    warning: {
      confirmBg: "bg-yellow-600 hover:bg-yellow-700",
      icon: "⚠️",
    },
    info: {
      confirmBg: "bg-blue-600 hover:bg-blue-700",
      icon: "ℹ️",
    },
  }

  const style = types[type] || types.danger

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-slide-up">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <span className="mr-3 text-xl">{style.icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onCancel} className="ml-auto text-gray-400 hover:text-gray-500 focus:outline-none">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${style.confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal

