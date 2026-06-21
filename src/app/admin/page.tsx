import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { listDonations, getReportSummary, type Donation, type DonationStatus } from '@/lib/donations'
import { AdminFilters } from '@/components/admin-filters'
import { DonationActions } from '@/components/donation-actions'
import { DonationDetailButton } from '@/components/donation-detail-button'
import { UserMenu } from '@/components/user-menu'
import { ExportButtons } from '@/components/export-buttons'

interface Props {
  searchParams: Promise<{ status?: string; from?: string; to?: string; tab?: string }>
}

const statusBadge: Record<DonationStatus, { label: string; className: string }> = {
  confirmed: { label: 'Confirmado', className: 'bg-status-confirmed-bg text-status-confirmed' },
  pending: { label: 'Pendente', className: 'bg-status-pending-bg text-status-pending' },
  canceled: { label: 'Cancelado', className: 'bg-status-canceled-bg text-status-canceled' },
}

function formatMoney(v: number | null) {
  if (!v) return '—'
  return `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function donorContact(d: Donation) {
  return d.donor_email || d.donor_phone || ''
}

function valorItem(d: Donation) {
  if (d.donation_type === 'money') return formatMoney(d.amount)
  return `${d.item_quantity ?? '?'}× ${d.item_description ?? ''}`
}

export default async function AdminPage({ searchParams }: Props) {
  const session = await getSession()
  if (!session) redirect('/login')

  const sp = await searchParams
  const tab = sp.tab === 'relatorios' ? 'relatorios' : 'doacoes'
  const status = sp.status as DonationStatus | undefined
  const from = sp.from
  const to = sp.to

  const [donations, summary] = await Promise.all([
    listDonations({ status, from, to }),
    getReportSummary(),
  ])

  const tabLink = (t: string, label: string) => {
    const active = tab === t
    const href = t === 'doacoes' ? '/admin' : '/admin?tab=relatorios'
    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors pb-[18px] mb-[-18px] border-b-2 ${
          active
            ? 'text-ink font-semibold border-coral'
            : 'text-ink-muted border-transparent hover:text-ink'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-cream font-hanken text-ink">
      {/* Top bar */}
      <header className="flex items-center justify-between px-9 py-[18px] border-b border-border-line bg-white">
        <div className="flex items-center gap-7">
          <div className="font-spectral font-bold text-[18px] flex items-center gap-2">
            <Heart size={17} fill="#E05A50" className="text-coral" />
            Painel
          </div>
          <nav className="flex gap-5">
            {tabLink('doacoes', 'Doações')}
            {tabLink('relatorios', 'Relatórios')}
          </nav>
        </div>
        <UserMenu email={String(session.email ?? 'admin')} />
      </header>

      <main className="px-9 py-7 pb-10">
        {/* Summary cards — always visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] mb-6">
          <div className="bg-coral text-white rounded-card px-6 py-5">
            <div className="text-[13px] opacity-90 mb-2">Arrecadado (confirmado)</div>
            <div className="font-spectral font-bold text-[30px]">{formatMoney(summary.total_money)}</div>
          </div>
          <div className="bg-white border border-border-line rounded-card px-6 py-5">
            <div className="text-[13px] text-ink-muted mb-2">Total de doações</div>
            <div className="font-spectral font-bold text-[30px]">{summary.total_donations}</div>
          </div>
          <div className="bg-white border border-border-line rounded-card px-6 py-5">
            <div className="text-[13px] text-ink-muted mb-2">Pendentes</div>
            <div className="font-spectral font-bold text-[30px] text-[#D9963F]">
              {summary.pending_count}
            </div>
          </div>
          <div className="bg-white border border-border-line rounded-card px-6 py-5">
            <div className="text-[13px] text-ink-muted mb-2">Itens recebidos</div>
            <div className="font-spectral font-bold text-[30px]">{summary.total_items} un.</div>
          </div>
        </div>

        {/* ─── TAB: Doações ─── */}
        {tab === 'doacoes' && (
          <>
            <h2 className="font-spectral font-bold text-[28px] mb-5">Doações recebidas</h2>

            <AdminFilters
              currentStatus={status ?? ''}
              currentFrom={from ?? ''}
              currentTo={to ?? ''}
            />

            <div className="bg-white border border-border-line rounded-card overflow-hidden">
              <div className="grid grid-cols-[1.5fr_1fr_1.4fr_1fr_.9fr_auto_1fr] px-5 py-3.5 bg-[#F7F2ED] text-[12px] font-bold tracking-[.04em] uppercase text-ink-muted">
                <span>Doador</span>
                <span>Tipo</span>
                <span>Valor / Item</span>
                <span>Status</span>
                <span>Data</span>
                <span></span>
                <span className="text-right">Ações</span>
              </div>

              {donations.length === 0 && (
                <div className="px-5 py-10 text-center text-ink-muted text-sm">
                  Nenhuma doação encontrada.
                </div>
              )}

              {donations.map((d) => {
                const badge = statusBadge[d.status] ?? statusBadge.pending
                return (
                  <div
                    key={d.id}
                    className="grid grid-cols-[1.5fr_1fr_1.4fr_1fr_.9fr_auto_1fr] items-center px-5 py-4 border-t border-[#F2EAE3] text-sm"
                  >
                    <div>
                      <div className="font-semibold">{d.donor_name}</div>
                      <div className="text-[12.5px] text-ink-soft">{donorContact(d)}</div>
                    </div>
                    <span className="text-ink-secondary">
                      {d.donation_type === 'money' ? 'Dinheiro' : 'Item'}
                    </span>
                    <span className="font-semibold">{valorItem(d)}</span>
                    <span>
                      <span className={`font-semibold text-[12.5px] px-3 py-1 rounded-pill ${badge.className}`}>
                        {badge.label}
                      </span>
                    </span>
                    <span className="text-ink-muted">{formatDate(d.donated_at)}</span>
                    <DonationDetailButton donation={d} />
                    <DonationActions id={d.id} status={d.status} />
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ─── TAB: Relatórios ─── */}
        {tab === 'relatorios' && (
          <>
            <h2 className="font-spectral font-bold text-[28px] mb-1">Relatórios</h2>
            <p className="text-sm text-ink-muted mb-6">
              Filtre por período e status, depois exporte em CSV (planilha) ou PDF.
            </p>

            {/* Filters + export */}
            <div className="bg-white border border-border-line rounded-[18px] p-6 mb-6">
              <div className="font-semibold text-[14.5px] mb-4">Filtrar dados do relatório</div>

              <AdminFilters
                currentStatus={status ?? ''}
                currentFrom={from ?? ''}
                currentTo={to ?? ''}
                tab="relatorios"
              />

              <div className="h-px bg-border-line my-5" />

              <div className="font-semibold text-[14.5px] mb-3">Exportar</div>
              <p className="text-sm text-ink-muted mb-4">
                {donations.length === 0
                  ? 'Nenhuma doação no período selecionado.'
                  : `${donations.length} doação${donations.length > 1 ? 'ões' : ''} ${status ? `com status filtrado` : ''} no período.`}
              </p>

              <ExportButtons status={status ?? ''} from={from ?? ''} to={to ?? ''} />
            </div>

            {/* Preview table */}
            {donations.length > 0 && (
              <div className="bg-white border border-border-line rounded-card overflow-hidden">
                <div className="px-5 py-3 bg-[#F7F2ED] text-[12px] font-bold tracking-[.04em] uppercase text-ink-muted border-b border-border-line">
                  Prévia ({donations.length} registro{donations.length > 1 ? 's' : ''})
                </div>
                <div className="grid grid-cols-[1.5fr_1.4fr_1fr_.9fr] px-5 py-3 bg-[#F7F2ED] text-[12px] font-bold tracking-[.04em] uppercase text-ink-muted">
                  <span>Doador</span>
                  <span>Valor / Item</span>
                  <span>Status</span>
                  <span>Data</span>
                </div>
                {donations.slice(0, 8).map((d) => {
                  const badge = statusBadge[d.status] ?? statusBadge.pending
                  return (
                    <div
                      key={d.id}
                      className="grid grid-cols-[1.5fr_1.4fr_1fr_.9fr] items-center px-5 py-3.5 border-t border-[#F2EAE3] text-sm"
                    >
                      <div>
                        <div className="font-semibold">{d.donor_name}</div>
                        <div className="text-[12px] text-ink-soft">{donorContact(d)}</div>
                      </div>
                      <span className="font-semibold">{valorItem(d)}</span>
                      <span>
                        <span className={`font-semibold text-[12.5px] px-3 py-1 rounded-pill ${badge.className}`}>
                          {badge.label}
                        </span>
                      </span>
                      <span className="text-ink-muted">{formatDate(d.donated_at)}</span>
                    </div>
                  )
                })}
                {donations.length > 8 && (
                  <div className="px-5 py-3 border-t border-[#F2EAE3] text-sm text-ink-muted text-center">
                    + {donations.length - 8} registro{donations.length - 8 > 1 ? 's' : ''} no arquivo exportado
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
