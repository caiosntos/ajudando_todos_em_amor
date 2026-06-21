import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getDonation, updateDonationStatus, deleteDonation, type DonationStatus } from '@/lib/donations'

const VALID_STATUSES: DonationStatus[] = ['pending', 'confirmed', 'canceled']

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const donation = await getDonation(id)
  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(donation)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const donation = await updateDonationStatus(id, status)
    return NextResponse.json(donation)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('PATCH /api/donations/[id]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await deleteDonation(id)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('DELETE /api/donations/[id]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
