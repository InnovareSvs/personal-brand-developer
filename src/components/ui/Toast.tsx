'use client'

interface ToastProps {
  message: string
  type: 'success' | 'error' | null
}

export function Toast({ message, type }: ToastProps) {
  if (!type) return null
  return (
    <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-50 transition-all ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {message}
    </div>
  )
}
