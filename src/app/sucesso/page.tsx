import Link from 'next/link'
import { Heart } from 'lucide-react'

interface Props {
  searchParams: Promise<{
    id?: string
    name?: string
    type?: string
    amount?: string
    description?: string
    quantity?: string
  }>
}

function formatMoney(v: string) {
  return parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function formatProtocol(id: string) {
  const year = new Date().getFullYear()
  return `#${id.slice(0, 4).toUpperCase()}-${year}`
}

export default async function SucessoPage({ searchParams }: Props) {
  const p = await searchParams
  const name = p.name ?? 'Doador'
  const type = p.type === 'money' ? 'money' : 'item'
  const protocol = p.id ? formatProtocol(p.id) : '#???-2026'

  const tipoLabel =
    type === 'money' && p.amount
      ? `Dinheiro · R$ ${formatMoney(p.amount)}`
      : p.description && p.quantity
        ? `Item · ${p.quantity}× ${p.description}`
        : type === 'money'
          ? 'Dinheiro'
          : 'Item'

  return (
    <div className="min-h-screen bg-cream font-hanken text-ink flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-border-line rounded-[20px] shadow-card px-12 py-14 text-center max-w-[640px] w-full">
        {/* Icon */}
        <div className="w-[84px] h-[84px] rounded-full bg-coral-light flex items-center justify-center mx-auto mb-6">
          <Heart size={42} fill="#E05A50" className="text-coral" />
        </div>

        <h2 className="font-spectral font-bold text-[34px] mb-3">Doação registrada!</h2>
        <p className="text-[16px] leading-[1.65] text-ink-secondary mb-7 max-w-[440px] mx-auto">
          Obrigada por fazer parte dessa corrente de amor, {name}. Em breve a equipe entra em
          contato para combinar a entrega.
        </p>

        {/* Summary box */}
        <div className="bg-white border border-border-line rounded-card p-5 text-left max-w-[440px] mx-auto mb-7">
          <div className="flex justify-between py-2 text-[14.5px]">
            <span className="text-ink-muted">Tipo</span>
            <span className="font-semibold">{tipoLabel}</span>
          </div>
          <div className="flex justify-between py-2 text-[14.5px] border-t border-[#F2EAE3]">
            <span className="text-ink-muted">Status</span>
            <span className="font-semibold text-[#D9963F]">Aguardando confirmação</span>
          </div>
          <div className="flex justify-between py-2 text-[14.5px] border-t border-[#F2EAE3]">
            <span className="text-ink-muted">Protocolo</span>
            <span className="font-bold font-mono">{protocol}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center bg-coral text-white font-semibold text-[15px] px-[26px] py-3.5 rounded-pill hover:bg-coral-deep transition-colors"
          >
            Voltar ao início
          </Link>
          <Link
            href="/doar"
            className="inline-flex items-center border-[1.5px] border-[#E2D6CC] bg-white text-ink font-semibold text-[15px] px-6 py-[13px] rounded-pill hover:bg-cream transition-colors"
          >
            Fazer outra doação
          </Link>
        </div>
      </div>
    </div>
  )
}
