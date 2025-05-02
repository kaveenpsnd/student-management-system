"use client"

import { createContext, useContext, useState, useCallback } from "react"

const TOAST_TIMEOUT = 5000 // 5 seconds

const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(({ title, description, variant = "default", duration = TOAST_TIMEOUT }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { 
      id, 
      title, 
      description, 
      variant, 
      duration,
      createdAt: Date.now() 
    }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Automatically remove the toast after duration
    const timeoutId = setTimeout(() => {
      dismiss(id)
    }, duration)

    return () => clearTimeout(timeoutId)
  }, [dismiss])

  return (
    <ToastContext.Provider 
      value={{
        toasts,
        toast,
        dismiss
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
