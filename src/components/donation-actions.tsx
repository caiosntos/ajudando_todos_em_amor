'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  id: string
  status: string
}

export function DonationActions({ id, status }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function patch(newStatus: string) {
    setBusy(true)
    await fetch(`/api/donations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
    setBusy(false)
  }

  async function remove() {
    if (!confirm('Excluir esta doação?')) return
    setBusy(true)
    await fetch(`/api/donations/${id}`, { method: 'DELETE' })
    router.refresh()
    setBusy(false)
  }

  const btnClass = 'font-semibold text-[13px] hover:underline disabled:opacity-50 cursor-pointer'

  return (
    <div className="flex gap-2 justify-end items-center text-[13px] font-semibold">
      {status === 'pending' && (
        <>
          <button onClick={() => patch('confirmed')} disabled={busy} className="text-status-confirmed hover:underline disabled:opacity-50">
            Confirmar
          </button>
          <span className="text-ink-muted">·</span>
        </>
      )}
      {status === 'confirmed' && (
        <>
          <button onClick={() => patch('canceled')} disabled={busy} className="text-coral-deep hover:underline disabled:opacity-50">
            Cancelar
          </button>
          <span className="text-ink-muted">·</span>
        </>
      )}
      <button onClick={remove} disabled={busy} className="text-coral-deep hover:underline disabled:opacity-50">
        Excluir
      </button>
    </div>
  )
}
