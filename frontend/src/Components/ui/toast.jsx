"use client"

import { useEffect, useState } from "react"
import "../../styles/toast.css"

const Toast = ({ id, title, description, variant = "default", duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)

      // Wait for exit animation to complete before removing
      const exitTimer = setTimeout(() => {
        onClose(id)
      }, 300) // Match the duration of the exit animation

      return () => clearTimeout(exitTimer)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onClose(id), 300)
  }

  return (
    <div className={`toast toast-${variant} ${isExiting ? "toast-exit" : ""}`}>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        {description && <div className="toast-description">{description}</div>}
      </div>
      <button className="toast-close" onClick={handleClose}>
        ×
      </button>
      <div className="toast-progress">
        <div className="toast-progress-bar"></div>
      </div>
    </div>
  )
}

export default Toast
