"use client"
import Toast from "./toast"
import "../../styles/toast.css"

const ToastContainer = ({ toasts, onClose }) => {
  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  )
}

export default ToastContainer

