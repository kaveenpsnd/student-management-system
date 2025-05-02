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

    setToasts((prevToasts) => {
      // Remove any existing toasts with the same title to prevent duplicates
      const filteredToasts = prevToasts.filter(t => t.title !== title)
      return [...filteredToasts, newToast]
    })

    // Automatically remove the toast after duration
    setTimeout(() => {
      dismiss(id)
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const value = {
    toasts,
    toast,
    dismiss
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}
