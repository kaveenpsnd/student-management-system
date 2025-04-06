"use client"

import { AlertTriangle, XCircle, Info, AlertCircle } from "lucide-react"

function ErrorMessage({ message, type = "error", onDismiss }) {
  const types = {
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      iconColor: "text-red-500",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      iconColor: "text-yellow-500",
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      iconColor: "text-blue-500",
    },
    alert: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      iconColor: "text-orange-500",
    },
  }

  const style = types[type] || types.error

  return (
    <div
      className={`${style.bgColor} border ${style.borderColor} ${style.textColor} px-4 py-3 rounded-lg shadow-sm animate-fade-in flex items-start`}
    >
      <div className={`${style.iconColor} flex-shrink-0 mr-3 mt-0.5`}>{style.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`ml-4 ${style.textColor} hover:bg-opacity-20 hover:bg-gray-500 rounded-full p-1`}
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

