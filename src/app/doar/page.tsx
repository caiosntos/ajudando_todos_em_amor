'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Banknote, Package, ArrowLeft } from 'lucide-react'

type DonationType = 'money' | 'item'
type PickupOption = 'deliver' | 'pickup'

interface FormState {
  donation_type: DonationType
  amount: string
  item_description: string
  item_quantity: string
  item_pickup: PickupOption
  donor_name: string
  donor_email: string
  donor_phone: string
  message: string
}

export default function DoarPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    donation_type: 'item',
    amount: '',
    item_description: '',
    item_quantity: '',
    item_pickup: 'deliver',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const body =
        form.donation_type === 'money'
          ? {
              donation_type: 'money',
              amount: parseFloat(form.amount.replace(',', '.')),
              donor_name: form.donor_name,
              donor_email: form.donor_email,
              donor_phone: form.donor_phone || null,
              message: form.message || null,
            }
          : {
              donation_type: 'item',
              item_description: form.item_description,
              item_quantity: parseInt(form.item_quantity, 10),
              pickup_required: form.item_pickup === 'pickup',
              donor_name: form.donor_name,
              donor_email: form.donor_email,
              donor_phone: form.donor_phone || null,
              message: form.message || null,
            }

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Erro ao enviar doação')
      }

      const donation = await res.json()

      const params = new URLSearchParams({
        id: donation.id,
        name: form.donor_name,
        type: form.donation_type,
        ...(form.donation_type === 'money'
          ? { amount: String(donation.amount) }
          : { description: form.item_description, quantity: form.item_quantity }),
      })

      router.push(`/sucesso?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar doação')
      setSubmitting(false)
    }
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits.length ? `(${digits}` : ''
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const toggleClass = (active: boolean) =>
    active
      ? 'flex-1 border-[1.5px] border-coral bg-coral-light rounded-xl p-3.5 text-center font-semibold text-[15px] text-coral-deep flex items-center justify-center gap-2 cursor-pointer transition-colors'
      : 'flex-1 border-[1.5px] border-border-input bg-white rounded-xl p-3.5 text-center font-medium text-[15px] text-[#7C7269] flex items-center justify-center gap-2 cursor-pointer transition-colors'

  const pickupClass = (active: boolean) =>
    active
      ? 'flex-1 border-[1.5px] border-coral bg-coral-light rounded-xl p-3.5 text-center font-semibold text-[14px] text-coral-deep flex items-center justify-center gap-2 cursor-pointer transition-colors'
      : 'flex-1 border-[1.5px] border-border-input bg-white rounded-xl p-3.5 text-center font-medium text-[14px] text-[#7C7269] flex items-center justify-center gap-2 cursor-pointer transition-colors'

  return (
    <div className="min-h-screen bg-cream font-hanken text-ink">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-[18px] border-b border-border-line bg-white/60">
        <div className="font-spectral font-bold text-[18px] flex items-center gap-2">
          <Heart size={17} fill="#E05A50" className="text-coral" />
          Ajudando Todos em Amor
        </div>
        <Link
          href="/"
          className="text-sm text-ink-muted flex items-center gap-1.5 hover:text-ink transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao início
        </Link>
      </header>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-10 px-10 py-11">
        {/* Left — how it works */}
        <div className="flex-[0.8] hidden md:block">
          <div className="inline-flex bg-coral-light text-coral-deep font-semibold text-[12.5px] px-3 py-1.5 rounded-pill mb-[18px]">
            Passo único
          </div>
          <h2 className="font-spectral font-bold text-[34px] leading-[1.1] mb-3.5">
            Cadastre sua doação
          </h2>
          <p className="text-[15.5px] leading-[1.7] text-ink-secondary mb-6">
            Preencha os dados abaixo. Depois entramos em contato para combinar a entrega ou retirada
            com todo o cuidado.
          </p>
          <div className="bg-white border border-border-line rounded-card p-5">
            <div className="font-semibold text-[14.5px] mb-2.5">Como funciona</div>
            <div className="flex flex-col gap-3 text-sm text-ink-secondary">
              {[
                'Você cadastra a doação',
                'A equipe confirma o recebimento',
                'A doação chega a quem precisa ♥',
              ].map((step, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="flex-none w-[22px] h-[22px] rounded-full bg-coral-light text-coral-deep font-bold text-[12px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form card */}
        <form
          onSubmit={handleSubmit}
          className="flex-[1.2] bg-white border border-border-line rounded-[20px] p-8"
        >
          {/* Type toggle */}
          <label className="block font-semibold text-sm mb-2.5">Tipo de doação</label>
          <div className="flex gap-2.5 mb-6">
            <div className="flex-1 relative border-[1.5px] border-dashed border-[#E2D6CC] bg-[#F7F2ED] rounded-xl p-3.5 text-center font-medium text-[15px] text-ink-soft flex items-center justify-center gap-2 opacity-70 select-none">
              <Banknote size={17} />
              Dinheiro
              <span className="absolute -top-2 -right-2 text-[10px] font-bold tracking-[.04em] text-ink-soft bg-[#EDE5DD] px-2 py-0.5 rounded-pill border border-[#E2D6CC]">
                V2
              </span>
            </div>
            <button
              type="button"
              onClick={() => update('donation_type', 'item')}
              className={toggleClass(form.donation_type === 'item')}
            >
              <Package size={17} />
              Item
            </button>
          </div>

          {/* Money fields */}
          {form.donation_type === 'money' && (
            <>
              <label className="block font-semibold text-sm mb-2.5">Valor da doação</label>
              <div className="flex items-center border-[1.5px] border-border-input rounded-xl px-4 mb-5 bg-input-bg">
                <span className="text-[16px] text-ink-muted font-semibold">R$</span>
                <input
                  type="text"
                  value={form.amount}
                  onChange={(e) => update('amount', e.target.value)}
                  placeholder="0,00"
                  className="flex-1 border-none bg-transparent py-3.5 px-3 text-[16px] font-hanken text-ink outline-none"
                  required
                />
              </div>

              <label className="block font-semibold text-sm mb-2.5">Forma de pagamento</label>
              <div className="flex flex-col gap-2.5 mb-2">
                <div className="flex items-center justify-between border-[1.5px] border-coral bg-coral-light rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-[18px] h-[18px] rounded-full border-[5px] border-coral bg-white flex-none" />
                    <span className="font-semibold text-[14.5px] text-coral-deep">
                      Combinar transferência / entrega
                    </span>
                  </div>
                  <span className="text-[12.5px] text-[#B07268] hidden sm:block">
                    A equipe entra em contato
                  </span>
                </div>
                <div className="flex items-center justify-between border-[1.5px] border-dashed border-[#E2D6CC] bg-[#F7F2ED] rounded-xl p-4 opacity-75">
                  <div className="flex items-center gap-3">
                    <span className="w-[18px] h-[18px] rounded-full border-2 border-[#CBBFB4] bg-white flex-none" />
                    <span className="font-semibold text-[14.5px] text-ink-soft">Pix automático</span>
                  </div>
                  <span className="text-[11.5px] font-bold tracking-[.04em] text-ink-soft bg-[#EDE5DD] px-3 py-1 rounded-pill">
                    EM BREVE · V2
                  </span>
                </div>
              </div>
              <p className="text-[12.5px] text-ink-soft mb-6">
                O pagamento por Pix chega na próxima versão. Por enquanto combinamos com você.
              </p>
            </>
          )}

          {/* Item fields */}
          {form.donation_type === 'item' && (
            <>
              <label className="block font-semibold text-sm mb-2.5">O que você vai doar</label>
              <input
                type="text"
                value={form.item_description}
                onChange={(e) => update('item_description', e.target.value)}
                placeholder="Ex: Fardo de leite integral"
                className="w-full border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none mb-5"
                required
              />
              <label className="block font-semibold text-sm mb-2.5">Quantidade</label>
              <input
                type="number"
                value={form.item_quantity}
                onChange={(e) => update('item_quantity', e.target.value)}
                placeholder="1"
                min="1"
                className="w-full border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none mb-5"
                required
              />
              <label className="block font-semibold text-sm mb-2.5">Entrega</label>
              <div className="flex gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => update('item_pickup', 'deliver')}
                  className={pickupClass(form.item_pickup === 'deliver')}
                >
                  Vou entregar no local
                </button>
                <button
                  type="button"
                  onClick={() => update('item_pickup', 'pickup')}
                  className={pickupClass(form.item_pickup === 'pickup')}
                >
                  Precisam recolher
                </button>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="h-px bg-border-line mb-5" />

          {/* Donor data */}
          <label className="block font-semibold text-sm mb-2.5">Seus dados</label>
          <input
            type="text"
            value={form.donor_name}
            onChange={(e) => update('donor_name', e.target.value)}
            placeholder="Nome completo"
            className="w-full border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none mb-3"
            required
          />
          <div className="flex gap-3 mb-3">
            <input
              type="email"
              value={form.donor_email}
              onChange={(e) => update('donor_email', e.target.value)}
              placeholder="E-mail"
              className="flex-1 border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none"
              required
            />
            <input
              type="tel"
              value={form.donor_phone}
              onChange={(e) => update('donor_phone', formatPhone(e.target.value))}
              placeholder="(47) 99999-9999"
              maxLength={15}
              className="flex-1 border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none"
            />
          </div>
          <textarea
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Mensagem (opcional)"
            className="w-full border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none resize-none h-[70px] mb-5"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-coral text-white border-none font-hanken font-bold text-[16px] py-4 rounded-pill cursor-pointer shadow-coral disabled:opacity-60 flex items-center justify-center gap-2 hover:bg-coral-deep transition-colors"
          >
            {submitting ? 'Enviando…' : 'Enviar doação'}
            {!submitting && <Heart size={18} fill="white" />}
          </button>
        </form>
      </div>
    </div>
  )
}
