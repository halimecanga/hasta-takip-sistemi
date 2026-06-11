import { useEffect } from 'react'

const toneClasses = {
  success: 'border-green-100 bg-green-50 text-green-700',
  warning: 'border-orange-100 bg-orange-50 text-orange-700',
  error: 'border-red-100 bg-red-50 text-red-700',
}

export default function InlineNotification({ message, tone = 'success', onClose, duration = 3200 }) {
  useEffect(() => {
    if (!message || !onClose) return undefined
    const timer = window.setTimeout(onClose, duration)
    return () => window.clearTimeout(timer)
  }, [duration, message, onClose])

  if (!message) return null

  return (
    <div aria-live="polite" className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${toneClasses[tone] || toneClasses.success}`}>
      {message}
    </div>
  )
}
