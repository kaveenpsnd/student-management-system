"use client"

import { useEffect, useState, useCallback } from "react"
import "../../styles/toast.css"

const Toast = ({ id, title, description, variant = "default", duration = 5000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }, [id, onClose])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration - 300) // Subtract animation duration

    return () => clearTimeout(timer)
  }, [duration, handleClose])

  const variantClass = variant === 'destructive' ? 'error' : variant

  return (
    <div 
      role="alert"
      aria-live="polite"
      className={`toast toast-${variantClass} ${isExiting ? "toast-exit" : ""}`}
    >
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {description && <div className="toast-description">{description}</div>}
      </div>
      <button 
        className="toast-close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar"
          style={{
            animationDuration: `${duration}ms`
          }}
        />
      </div>
    </div>
  )
}

export default Toast
