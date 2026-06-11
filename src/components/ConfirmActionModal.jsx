import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { outlineButtonClass } from '../styles/uiClasses'

const variantClasses = {
  danger: 'border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 focus-visible:ring-red-300',
  warning: 'border-orange-500 bg-orange-500 text-white hover:border-orange-600 hover:bg-orange-600 focus-visible:ring-orange-300',
  archive: 'border-orange-500 bg-orange-500 text-white hover:border-orange-600 hover:bg-orange-600 focus-visible:ring-orange-300',
  neutral: 'border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700 focus-visible:ring-green-300',
}

const confirmBaseClass = 'inline-flex items-center justify-center rounded-[10px] border px-3.5 py-2.5 text-xs font-semibold shadow-[0_5px_13px_rgba(17,24,39,.12)] transition duration-200 ease-in-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0'

export default function ConfirmActionModal({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Vazgeç',
  variant = 'warning',
  onConfirm,
  onCancel,
  children,
  isConfirmDisabled = false,
}) {
  const titleId = useId()
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    previousFocusRef.current = document.activeElement
    const focusable = panelRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    focusable?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/45 px-4 py-6" onMouseDown={onCancel}>
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="max-h-[calc(100vh-48px)] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_24px_70px_rgba(17,24,39,.24)] max-[520px]:p-4"
        onMouseDown={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900" id={titleId}>{title}</h2>
            {description && <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>}
          </div>
          <button aria-label="Modalı kapat" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2" type="button" onClick={onCancel}>
            <X size={17} />
          </button>
        </div>
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button className={outlineButtonClass} type="button" onClick={onCancel}>{cancelLabel}</button>
          <button className={`${confirmBaseClass} ${variantClasses[variant] || variantClasses.warning}`} disabled={isConfirmDisabled} type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
