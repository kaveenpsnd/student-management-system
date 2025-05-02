"use client"
import { useToast } from "../../hooks/use-toast"
import Toast from "./toast"
import "../../styles/toast.css"

const ToastContainer = () => {
  const { toasts, dismiss } = useToast()

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          onClose={dismiss}
        />
      ))}
    </div>
  )
}

export default ToastContainer

