'use client'

import { useEffect, useRef } from 'react'
import { X, MapPin, Truck, Package, Banknote, Phone, Mail, MessageSquare } from 'lucide-react'
import type { Donation, DonationStatus } from '@/lib/donations'

interface Props {
  donation: Donation
  onClose: () => void
}

const statusLabel: Record<DonationStatus, { label: string; className: string }> = {
  confirmed: { label: 'Confirmado', className: 'bg-status-confirmed-bg text-status-confirmed' },
  pending:   { label: 'Pendente',   className: 'bg-status-pending-bg text-status-pending' },
  canceled:  { label: 'Cancelado',  className: 'bg-status-canceled-bg text-status-canceled' },
}

function formatMoney(v: number | null) {
  if (!v) return '—'
  return `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function DonationDetailModal({ donation: d, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const badge = statusLabel[d.status] ?? statusLabel.pending

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-white rounded-[20px] shadow-[0_24px_60px_rgba(0,0,0,.18)] w-full max-w-[480px] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border-line">
          <div>
            <div className="font-spectral font-bold text-[20px] leading-tight">{d.donor_name}</div>
            <div className="text-[12.5px] text-ink-muted mt-0.5">{formatDate(d.donated_at)}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-semibold text-[12px] px-3 py-1 rounded-pill ${badge.className}`}>
              {badge.label}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-ink-muted hover:bg-[#F7F2ED] transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Donation type block */}
          {d.donation_type === 'item' ? (
            <div className="bg-cream rounded-[14px] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted uppercase tracking-[.04em]">
                <Package size={14} />
                Item doado
              </div>
              <div>
                <div className="font-semibold text-[17px]">{d.item_description ?? '—'}</div>
                <div className="text-[13.5px] text-ink-secondary mt-0.5">
                  Quantidade: <span className="font-semibold text-ink">{d.item_quantity ?? '?'}</span>
                </div>
              </div>
              <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold w-fit ${
                d.pickup_required
                  ? 'bg-[#FFF3E5] text-[#B07A2A]'
                  : 'bg-status-confirmed-bg text-status-confirmed'
              }`}>
                {d.pickup_required ? <Truck size={14} /> : <MapPin size={14} />}
                {d.pickup_required ? 'Precisa ser recolhido' : 'Doador vai entregar no local'}
              </div>
            </div>
          ) : (
            <div className="bg-cream rounded-[14px] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-ink-muted uppercase tracking-[.04em]">
                <Banknote size={14} />
                Doação em dinheiro
              </div>
              <div className="font-spectral font-bold text-[28px] text-coral">{formatMoney(d.amount)}</div>
            </div>
          )}

          {/* Contact */}
          <div className="flex flex-col gap-2">
            {d.donor_email && (
              <div className="flex items-center gap-2.5 text-[13.5px] text-ink-secondary">
                <Mail size={14} className="text-ink-muted flex-none" />
                <span>{d.donor_email}</span>
              </div>
            )}
            {d.donor_phone && (
              <div className="flex items-center gap-2.5 text-[13.5px] text-ink-secondary">
                <Phone size={14} className="text-ink-muted flex-none" />
                <span>{d.donor_phone}</span>
              </div>
            )}
          </div>

          {/* Message */}
          {d.message && (
            <div className="flex gap-2.5 text-[13.5px] text-ink-secondary bg-[#F7F2ED] rounded-[12px] px-4 py-3">
              <MessageSquare size={14} className="text-ink-muted flex-none mt-0.5" />
              <span className="leading-[1.55]">{d.message}</span>
            </div>
          )}
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full border-[1.5px] border-border-line text-ink-secondary font-semibold text-sm py-2.5 rounded-[12px] hover:bg-[#F7F2ED] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
