'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { DonationDetailModal } from './donation-detail-modal'
import type { Donation } from '@/lib/donations'

export function DonationDetailButton({ donation }: { donation: Donation }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-[8px] text-ink-muted hover:bg-[#F7F2ED] hover:text-ink transition-colors"
        title="Ver detalhes"
      >
        <Eye size={15} />
      </button>
      {open && <DonationDetailModal donation={donation} onClose={() => setOpen(false)} />}
    </>
  )
}
