import { NextRequest, NextResponse } from 'next/server'
import { createDonation } from '@/lib/donations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { donor_name, donor_email, donor_phone, donation_type, amount, item_description, item_quantity, pickup_required, message } = body

    if (!donor_name || !donor_email || !donation_type) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    if (!['money', 'item'].includes(donation_type)) {
      return NextResponse.json({ error: 'Tipo de doação inválido' }, { status: 400 })
    }

    if (donation_type === 'money') {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return NextResponse.json({ error: 'Valor deve ser maior que zero' }, { status: 400 })
      }
    }

    if (donation_type === 'item') {
      if (!item_description) {
        return NextResponse.json({ error: 'Descrição do item é obrigatória' }, { status: 400 })
      }
      if (!item_quantity || parseInt(item_quantity) < 1) {
        return NextResponse.json({ error: 'Quantidade deve ser pelo menos 1' }, { status: 400 })
      }
    }

    const donation = await createDonation({
      donor_name,
      donor_email,
      donor_phone: donor_phone || null,
      donation_type,
      amount: donation_type === 'money' ? Number(amount) : null,
      item_description: donation_type === 'item' ? item_description : null,
      item_quantity: donation_type === 'item' ? parseInt(item_quantity) : null,
      pickup_required: donation_type === 'item' ? Boolean(pickup_required) : false,
      message: message || null,
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('POST /api/donations', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
