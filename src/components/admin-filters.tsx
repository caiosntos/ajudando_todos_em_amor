'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  currentStatus: string
  currentFrom: string
  currentTo: string
  /** Pass 'relatorios' when used inside the Relatórios tab so navigation preserves the tab param */
  tab?: string
}

export function AdminFilters({ currentStatus, currentFrom, currentTo, tab }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    if (tab) params.set('tab', tab)
    router.push(`/admin?${params.toString()}`)
  }

  const inputClass =
    'flex items-center gap-2 border-[1.5px] border-border-input bg-white rounded-[10px] px-3.5 py-2.5 text-sm text-ink-secondary'

  return (
    <div className="flex items-center gap-3 mb-[18px] flex-wrap">
      <div className={inputClass}>
        <span>Status:</span>
        <select
          value={currentStatus}
          onChange={(e) => update('status', e.target.value)}
          className="font-semibold text-ink bg-transparent outline-none cursor-pointer"
        >
          <option value="">Todos</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="canceled">Cancelado</option>
        </select>
      </div>

      <div className={inputClass}>
        <span>De</span>
        <input
          type="date"
          value={currentFrom}
          onChange={(e) => update('from', e.target.value)}
          className="font-semibold text-ink bg-transparent outline-none cursor-pointer"
        />
      </div>

      <div className={inputClass}>
        <span>Até</span>
        <input
          type="date"
          value={currentTo}
          onChange={(e) => update('to', e.target.value)}
          className="font-semibold text-ink bg-transparent outline-none cursor-pointer"
        />
      </div>
    </div>
  )
}
