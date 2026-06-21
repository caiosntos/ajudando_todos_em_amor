import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt'

// In-memory rate limiter: max 5 attempts per IP per 60 s
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 60_000

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_ATTEMPTS) return false
  entry.count++
  return true
}

function clearRateLimit(ip: string) {
  attempts.delete(ip)
}

interface AdminUser {
  id: string
  email: string
  password_hash: string
}

// Dummy hash used when user is not found — prevents timing-based email enumeration
const DUMMY_HASH = '$2b$12$invalidhashpaddingtomatchbcryptlengthXXXXXXXXXXXXXX'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde 1 minuto.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 })
    }

    const { rows } = await pool.query<AdminUser>(
      'SELECT id, email, password_hash FROM admin_users WHERE email=$1',
      [email.toLowerCase().trim()]
    )
    const user = rows[0]

    // Always run bcrypt to prevent timing-based email enumeration
    const hashToCheck = user?.password_hash ?? DUMMY_HASH
    const valid = await verifyPassword(password, hashToCheck)

    if (!user || !valid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    clearRateLimit(ip)

    const token = await signToken({ sub: user.id, email: user.email })

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  return NextResponse.json({ ok: true })
}
