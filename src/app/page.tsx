import Link from 'next/link'
import { Heart, ArrowRight, Menu, MessageCircle, Copy, Instagram } from 'lucide-react'
import { HeroCarousel } from '@/components/HeroCarousel'
import { listCarouselImages } from '@/lib/carousel'

const needs = [
  {
    title: 'Cesta básica',
    desc: 'Alimento para famílias que chegam sem nada e precisam recomeçar do zero.',
    badge: { label: 'MAIS URGENTE', style: 'bg-coral text-white' },
  },
  {
    title: 'Fardos de leite',
    desc: 'Um dos pedidos mais frequentes de mães com crianças pequenas.',
    badge: { label: 'PEDIDO CONSTANTE', style: 'bg-white text-coral-deep border border-[#F3DDD7]' },
  },
  {
    title: 'Roupas & itens de casa',
    desc: 'Para mobiliar a casa e vestir quem está começando a vida de novo.',
    badge: null,
  },
]

const stats = [
  { value: '8', label: 'anos de história' },
  { value: '45', label: 'crianças a cada 15 dias' },
  { value: '2018', label: 'a promessa que virou projeto' },
  { value: '+∞', label: 'famílias recomeçando' },
]

export default async function LandingPage() {
  const carouselImages = await listCarouselImages()

  return (
    <div className="min-h-screen bg-cream font-hanken text-ink">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-[18px] border-b border-border-line bg-white/60 backdrop-blur-sm">
        <div className="font-spectral font-bold text-[19px] flex items-center gap-2">
          <Heart size={18} fill="#E05A50" className="text-coral" />
          Ajudando Todos em Amor
        </div>
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-[14.5px] text-ink-secondary font-medium">
          <a href="#causa" className="hover:text-ink transition-colors">A causa</a>
          <a href="#como-ajudar" className="hover:text-ink transition-colors">Como ajudar</a>
          <a href="#contato" className="hover:text-ink transition-colors">Contato</a>
          <Link href="/login" className="hover:text-ink transition-colors text-ink-muted">
            Entrar
          </Link>
          <Link
            href="/doar"
            className="bg-coral text-white font-semibold px-5 py-2.5 rounded-pill shadow-coral-sm hover:bg-coral-deep transition-colors"
          >
            Quero doar
          </Link>
        </div>
        {/* Mobile */}
        <button className="md:hidden w-[30px] h-[30px] rounded-lg bg-white border border-border-line flex items-center justify-center text-ink-secondary">
          <Menu size={18} />
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col md:flex-row gap-11 px-10 pt-14 pb-12 items-center">
        <div className="flex-[1.05]">
          <div className="inline-flex items-center gap-2 bg-coral-light text-coral-deep font-semibold text-[13px] px-3.5 py-1.5 rounded-pill mb-5">
            8 anos fazendo o bem · desde 2018
          </div>
          <h1 className="font-spectral font-bold text-[50px] leading-[1.04] tracking-[-0.015em] mb-[18px]">
            Quem chega sem nada,<br />recomeça com amor.
          </h1>
          <p className="text-[17px] leading-[1.65] text-ink-secondary mb-7 max-w-[520px]">
            Tudo começou em 2018 com uma promessa feita pela vida da minha filha Sophia. Desde
            então ajudamos famílias que chegam em Araquari sem nada — com cesta básica, leite,
            roupas e muito carinho.
          </p>
          <div className="flex gap-3.5 items-center flex-wrap">
            <Link
              href="/doar"
              className="inline-flex items-center gap-2 bg-coral text-white font-semibold text-[16px] px-7 py-[15px] rounded-pill shadow-coral hover:bg-coral-deep transition-colors"
            >
              Quero doar <Heart size={18} fill="white" />
            </Link>
            <a
              href="#historia"
              className="inline-flex items-center border-[1.5px] border-[#E2D6CC] text-ink font-semibold text-[16px] px-[26px] py-[14px] rounded-pill bg-white hover:bg-cream transition-colors"
            >
              Conheça a história
            </a>
          </div>
        </div>
        <HeroCarousel images={carouselImages} />
      </section>

      {/* Story + Stats */}
      <section id="historia" className="mx-10 mb-12 bg-white border border-border-line rounded-[18px] p-8 flex flex-col md:flex-row gap-9 items-center">
        <div className="flex-[1.4]">
          <h3 className="font-spectral font-semibold text-[24px] mb-3">
            Feito com muito amor — e com a carretinha
          </h3>
          <p className="text-[15.5px] leading-[1.7] text-ink-secondary">
            Começamos carregando doações num Uno velho, depois veio a carretinha. Hoje, a cada 15
            dias, recebo cerca de 45 crianças em casa para uma dinâmica sobre a Bíblia e um lanche
            gostoso. Seguimos ajudando quem realmente precisa.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3.5">
          {stats.map((s) => (
            <div key={s.label} className="bg-cream rounded-xl p-4">
              <div className="font-spectral font-bold text-[30px] text-coral leading-none">{s.value}</div>
              <div className="text-[13px] text-[#6E645B] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* A Causa */}
      <section id="causa" className="px-10 mb-14">
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="font-spectral font-bold text-[34px]">A causa</h2>
          <span className="text-sm text-ink-muted">Nossa história em palavras</span>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white border border-border-line rounded-card p-6">
            <div className="inline-flex bg-coral text-white text-[11.5px] font-bold tracking-[.04em] px-2.5 py-1 rounded-pill mb-3">
              2018 · O início
            </div>
            <h4 className="font-spectral font-semibold text-[18px] mb-2 leading-snug">
              Uma promessa que virou projeto
            </h4>
            <p className="text-[14.5px] leading-[1.7] text-ink-secondary">
              Tudo começou com uma promessa feita pela vida da minha filha Sophia. Desde então
              ajudávamos arrecadando de tudo — roupa, alimento, móveis — para que famílias que
              chegavam sem nada conseguissem começar do zero. Tudo mesmo.
            </p>
          </div>

          <div className="bg-white border border-border-line rounded-card p-6">
            <div className="inline-flex bg-coral-light text-coral-deep text-[11.5px] font-bold tracking-[.04em] px-2.5 py-1 rounded-pill mb-3">
              2 anos depois · A carretinha
            </div>
            <h4 className="font-spectral font-semibold text-[18px] mb-2 leading-snug">
              Do Uno velho à carretinha
            </h4>
            <p className="text-[14.5px] leading-[1.7] text-ink-secondary">
              Passaram-se dois anos carregando todos os tipos de doação em cima de um Uno velho —
              nosso primeiro carro, que ajudou muitas famílias antes de chegarmos a comprar a
              carretinha. Pequeno símbolo de um crescimento enorme.
            </p>
          </div>

          <div className="bg-white border border-border-line rounded-card p-6">
            <div className="inline-flex bg-[#FFF3E5] text-[#B07A2A] text-[11.5px] font-bold tracking-[.04em] px-2.5 py-1 rounded-pill mb-3">
              Hoje · 8 anos
            </div>
            <h4 className="font-spectral font-semibold text-[18px] mb-2 leading-snug">
              Ajudando quem realmente precisa
            </h4>
            <p className="text-[14.5px] leading-[1.7] text-ink-secondary">
              São 8 anos fazendo o bem com muito amor e carinho. Todos os dias pessoas procuram o
              projeto precisando de ajuda. Os pedidos que mais chegam são cesta básica e fardos de
              leite — e a verdade é que está cada vez mais difícil encontrar doadores dispostos a
              ajudar quem realmente precisa.
            </p>
          </div>

          <div className="bg-coral rounded-card p-6 text-white">
            <div className="inline-flex bg-white/25 text-white text-[11.5px] font-bold tracking-[.04em] px-2.5 py-1 rounded-pill mb-3">
              Janeiro 2026 · Casa própria
            </div>
            <h4 className="font-spectral font-semibold text-[18px] mb-2 leading-snug">
              Não desistimos
            </h4>
            <p className="text-[14.5px] leading-[1.7] opacity-90">
              Em outubro de 2024 ganhamos um terreno do meu cunhado. Tentamos construir uma casa em
              45 dias — levamos um golpe e tivemos que arcar com tudo pagando aluguel com dois
              filhos pequenos. Mas a mão de Deus agiu: amigos nos ajudaram e em janeiro de 2026 nos
              mudamos para nossa própria casa em Araquari. O projeto segue. Sempre vai seguir.
            </p>
          </div>
        </div>

        {/* Children quote block */}
        <div className="bg-white border border-border-line rounded-[18px] p-7">
          <p className="font-spectral font-semibold text-[20px] leading-snug mb-2">
            "A cada 15 dias, cerca de 45 crianças vêm à minha casa."
          </p>
          <p className="text-[14.5px] leading-[1.7] text-ink-secondary">
            Fazemos uma dinâmica sobre a Bíblia e comemos algo gostoso juntos. Hoje procuro ajudar
            as famílias aqui do loteamento em Araquari — tem muitas crianças que precisam. E isso
            não tem preço.
          </p>
          <div className="text-sm text-ink-muted mt-3 font-medium">— Luana, coordenadora · Araquari / SC</div>
        </div>
      </section>

      {/* Needs */}
      <section id="como-ajudar" className="px-10 pb-4">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-spectral font-semibold text-[26px]">O que mais precisamos agora</h3>
          <span className="text-sm text-ink-muted hidden md:block">Você escolhe o que doar no formulário</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-12">
          {needs.map((n) => (
            <div key={n.title} className="bg-white border border-border-line rounded-card overflow-hidden">
              <div className="p-5">
                {n.badge && (
                  <span className={`inline-block text-[11.5px] font-bold tracking-[.04em] px-3 py-[5px] rounded-pill mb-3 ${n.badge.style}`}>
                    {n.badge.label}
                  </span>
                )}
                <h4 className="font-spectral font-semibold text-[19px] mb-1.5">{n.title}</h4>
                <p className="text-sm leading-[1.6] text-[#6E645B] mb-3.5">{n.desc}</p>
                <Link
                  href="/doar"
                  className="inline-flex items-center gap-1.5 text-coral-deep font-semibold text-sm hover:underline"
                >
                  Doar isto <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band */}
      <section className="mx-10 mb-10 bg-coral rounded-[20px] px-11 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
        <div>
          <h3 className="font-spectral font-bold text-[28px] mb-2">Sua doação muda uma história hoje</h3>
          <p className="text-[15.5px] opacity-90">Dinheiro ou itens — cada gesto chega a quem realmente precisa.</p>
        </div>
        <Link
          href="/doar"
          className="flex-none inline-flex items-center gap-2 bg-white text-coral-deep font-bold text-[16px] px-8 py-[15px] rounded-pill whitespace-nowrap hover:bg-coral-light transition-colors"
        >
          Quero doar <Heart size={18} fill="#C4453C" />
        </Link>
      </section>

      {/* Footer */}
      <footer id="contato" className="border-t border-border-line px-10 pt-8 pb-6">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-6">
          {/* Brand */}
          <div>
            <div className="font-spectral font-bold text-[17px] flex items-center gap-2 mb-1.5">
              <Heart size={15} fill="#E05A50" className="text-coral" />
              Ajudando Todos em Amor
            </div>
            <div className="text-[13.5px] text-ink-muted">Araquari / SC · desde 2018</div>
          </div>

          {/* Contact links */}
          <div className="flex flex-col sm:flex-row gap-5 text-[13.5px]">
            <a
              href="https://wa.me/5547996242168"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-secondary hover:text-ink transition-colors"
            >
              <MessageCircle size={15} className="text-[#2E7D32]" />
              (47) 99624-2168
            </a>
            <div className="flex items-center gap-2 text-ink-secondary">
              <Copy size={15} className="text-coral" />
              Pix: 115.079.649-94
            </div>
            <a
              href="https://instagram.com/ajudando_a_todos_em_amor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-secondary hover:text-ink transition-colors"
            >
              <Instagram size={15} className="text-[#C2185B]" />
              @ajudando_a_todos_em_amor
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
