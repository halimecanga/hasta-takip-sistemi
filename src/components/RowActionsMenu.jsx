import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'

const itemToneClasses = {
  danger: 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50',
  warning: 'text-orange-600 hover:bg-orange-50 focus-visible:bg-orange-50',
  archive: 'text-orange-700 hover:bg-orange-50 focus-visible:bg-orange-50',
  success: 'text-green-700 hover:bg-green-50 focus-visible:bg-green-50',
  neutral: 'text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50',
}

export default function RowActionsMenu({ items, label = 'Satır işlemleri' }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const enabledItems = items.filter(Boolean)

  return (
    <div className="relative inline-flex" ref={wrapperRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 transition hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <MoreHorizontal size={17} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-56 rounded-xl border border-gray-100 bg-white p-1.5 shadow-[0_18px_45px_rgba(17,24,39,.14)]" role="menu">
          {enabledItems.map((item) => {
            const className = `flex w-full items-center gap-2 rounded-[9px] px-3 py-2 text-left text-xs font-semibold transition focus-visible:outline-none ${itemToneClasses[item.tone] || itemToneClasses.neutral} ${item.disabled ? 'pointer-events-none opacity-50' : ''}`
            const icon = item.icon

            if (item.to) {
              return (
                <Link
                  className={className}
                  key={item.label}
                  role="menuitem"
                  state={item.state}
                  tabIndex={0}
                  to={item.to}
                  onClick={() => setOpen(false)}
                >
                  {icon}
                  {item.label}
                </Link>
              )
            }

            return (
              <button
                className={className}
                disabled={item.disabled}
                key={item.label}
                role="menuitem"
                type="button"
                onClick={() => {
                  setOpen(false)
                  item.onSelect?.()
                }}
              >
                {icon}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
