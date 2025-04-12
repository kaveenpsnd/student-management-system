"use client"

import { X } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }) {
  const { title, description, variant } = toast

  const variantClasses = {
    default: "bg-white border-gray-200",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
    destructive: "bg-red-50 border-red-200",
  }

  const titleClasses = {
    default: "text-gray-900",
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
    destructive: "text-red-800",
  }

  const descriptionClasses = {
    default: "text-gray-600",
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
    destructive: "text-red-700",
  }

  return (
    <div
      className={`w-80 rounded-lg border p-4 shadow-md animate-in slide-in-from-right-full ${
        variantClasses[variant] || variantClasses.default
      }`}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div>
          {title && <h3 className={`font-medium ${titleClasses[variant] || titleClasses.default}`}>{title}</h3>}
          {description && (
            <div className={`mt-1 text-sm ${descriptionClasses[variant] || descriptionClasses.default}`}>
              {description}
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-500"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}
