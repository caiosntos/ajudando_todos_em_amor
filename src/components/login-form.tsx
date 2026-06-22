'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Credenciais inválidas')
      }

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream font-hanken text-ink flex items-center justify-center px-4">
      <div className="bg-cream border border-border-line rounded-[4px] shadow-card px-10 py-12 w-full max-w-[412px] flex flex-col justify-center min-h-[520px]">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="font-spectral font-bold text-[22px] flex items-center justify-center gap-2 mb-1.5">
            <Heart size={20} fill="#E05A50" className="text-coral" />
            Ajudando Todos
          </div>
          <div className="text-sm text-ink-muted">Área da equipe</div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block font-semibold text-[13.5px] mb-2">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-full border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none mb-4"
            required
          />

          <label className="block font-semibold text-[13.5px] mb-2">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border-[1.5px] border-border-input rounded-xl py-3.5 px-4 text-[15px] font-hanken bg-input-bg text-ink outline-none mb-6"
            required
          />

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white border-none font-hanken font-bold text-[15.5px] py-[15px] rounded-pill cursor-pointer shadow-coral mb-4 disabled:opacity-60 hover:bg-coral-deep transition-colors"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-[12.5px] text-ink-soft text-center">
          Acesso restrito à coordenação do projeto.
        </p>
      </div>
    </div>
  )
}
