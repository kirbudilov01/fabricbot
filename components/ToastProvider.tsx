'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { setToastCallback } from '@/lib/store'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning'
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }

  useEffect(() => {
    setToastCallback(showToast)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-error-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200'
      case 'error':
        return 'bg-error-50 border-error-200'
      case 'warning':
        return 'bg-warning-50 border-warning-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm ${getBackgroundColor(toast.type)}`}
          >
            {getIcon(toast.type)}
            <span className="ml-3 text-sm font-medium text-gray-900 flex-1">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}