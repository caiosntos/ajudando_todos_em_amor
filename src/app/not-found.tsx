import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream font-hanken text-ink flex items-center justify-center px-4">
      <div className="text-center">
        <Heart size={48} fill="#E05A50" className="text-coral mx-auto mb-4" />
        <h1 className="font-spectral font-bold text-[40px] mb-3">Página não encontrada</h1>
        <p className="text-ink-secondary mb-6">O endereço que você acessou não existe.</p>
        <Link href="/" className="bg-coral text-white font-semibold px-6 py-3 rounded-pill hover:bg-coral-deep transition-colors">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
