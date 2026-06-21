'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Home } from 'lucide-react'

interface Props {
  email: string
}

export function UserMenu({ email }: Props) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/auth/login', { method: 'DELETE' })
    router.push('/login')
  }

  const initials = email.charAt(0).toUpperCase()
  const displayName = email.split('@')[0]
  const label = displayName.charAt(0).toUpperCase() + displayName.slice(1)

  return (
    <div ref={ref} className="relative flex items-center gap-3.5 text-[13.5px] text-ink-secondary">
      <span>{label} · coordenação</span>

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-coral-light text-coral-deep font-bold flex items-center justify-center text-sm hover:bg-coral hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-1"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-white border border-border-line rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,.12)] overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-border-line">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-coral-light text-coral-deep font-bold flex items-center justify-center text-sm flex-none">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[13.5px] text-ink truncate">{label}</div>
                <div className="text-[12px] text-ink-muted truncate">{email}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <Link
              href="/"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13.5px] text-ink-secondary font-medium hover:bg-[#F7F2ED] transition-colors"
            >
              <Home size={15} />
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13.5px] text-coral-deep font-medium hover:bg-coral-light transition-colors disabled:opacity-50"
            >
              <LogOut size={15} />
              {loggingOut ? 'Saindo…' : 'Sair'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
