import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { listDonations, getReportSummary, type DonationStatus } from '@/lib/donations'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') ?? 'csv'
  const status = (searchParams.get('status') || undefined) as DonationStatus | undefined
  const from = searchParams.get('from') || undefined
  const to = searchParams.get('to') || undefined

  const [donations, summary] = await Promise.all([
    listDonations({ status, from, to }),
    getReportSummary(),
  ])

  if (format === 'json') {
    return NextResponse.json({ donations, summary })
  }

  // CSV
  const headers = [
    'ID', 'Nome', 'Email', 'Telefone', 'Tipo', 'Valor (R$)', 'Item', 'Quantidade',
    'Status', 'Mensagem', 'Data doação',
  ]

  const rows = donations.map((d) => [
    d.id,
    d.donor_name,
    d.donor_email,
    d.donor_phone ?? '',
    d.donation_type === 'money' ? 'Dinheiro' : 'Item',
    d.amount != null ? String(d.amount) : '',
    d.item_description ?? '',
    d.item_quantity != null ? String(d.item_quantity) : '',
    d.status === 'confirmed' ? 'Confirmado' : d.status === 'pending' ? 'Pendente' : 'Cancelado',
    d.message ?? '',
    d.donated_at,
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new Response('﻿' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="doacoes.csv"',
    },
  })
}
