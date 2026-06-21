import { pool } from './db'

export type DonationType = 'money' | 'item'
export type DonationStatus = 'pending' | 'confirmed' | 'canceled'

export interface Donation {
  id: string
  donor_name: string
  donor_email: string
  donor_phone: string | null
  donation_type: DonationType
  amount: number | null
  item_description: string | null
  item_quantity: number | null
  pickup_required: boolean
  status: DonationStatus
  message: string | null
  donated_at: string
  created_at: string
}

export interface CreateDonationInput {
  donor_name: string
  donor_email: string
  donor_phone?: string | null
  donation_type: DonationType
  amount?: number | null
  item_description?: string | null
  item_quantity?: number | null
  pickup_required?: boolean
  message?: string | null
}

export interface ListFilters {
  status?: DonationStatus
  from?: string
  to?: string
}

export interface ReportSummary {
  total_money: number
  total_donations: number
  pending_count: number
  confirmed_count: number
  canceled_count: number
  total_items: number
}

export async function createDonation(data: CreateDonationInput): Promise<Donation> {
  const { rows } = await pool.query<Donation>(
    `INSERT INTO donations
       (donor_name, donor_email, donor_phone, donation_type, amount, item_description, item_quantity, pickup_required, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      data.donor_name,
      data.donor_email,
      data.donor_phone ?? null,
      data.donation_type,
      data.amount ?? null,
      data.item_description ?? null,
      data.item_quantity ?? null,
      data.pickup_required ?? false,
      data.message ?? null,
    ]
  )
  return rows[0]
}

export async function listDonations(filters: ListFilters = {}): Promise<Donation[]> {
  const { rows } = await pool.query<Donation>(
    `SELECT * FROM donations
     WHERE ($1::text IS NULL OR status = $1)
       AND ($2::date IS NULL OR donated_at >= $2::date)
       AND ($3::date IS NULL OR donated_at <= $3::date)
     ORDER BY created_at DESC`,
    [filters.status ?? null, filters.from ?? null, filters.to ?? null]
  )
  return rows
}

export async function getDonation(id: string): Promise<Donation | null> {
  const { rows } = await pool.query<Donation>('SELECT * FROM donations WHERE id=$1', [id])
  return rows[0] ?? null
}

export async function updateDonationStatus(id: string, status: DonationStatus): Promise<Donation> {
  const { rows } = await pool.query<Donation>(
    'UPDATE donations SET status=$1 WHERE id=$2 RETURNING *',
    [status, id]
  )
  return rows[0]
}

export async function deleteDonation(id: string): Promise<void> {
  await pool.query('DELETE FROM donations WHERE id=$1', [id])
}

export async function getReportSummary(): Promise<ReportSummary> {
  const { rows } = await pool.query<ReportSummary>(`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE status='confirmed' AND donation_type='money'), 0)::numeric AS total_money,
      COUNT(*)::int AS total_donations,
      COUNT(*) FILTER (WHERE status='pending')::int AS pending_count,
      COUNT(*) FILTER (WHERE status='confirmed')::int AS confirmed_count,
      COUNT(*) FILTER (WHERE status='canceled')::int AS canceled_count,
      COALESCE(SUM(item_quantity) FILTER (WHERE donation_type='item' AND status='confirmed'), 0)::int AS total_items
    FROM donations
  `)
  return rows[0]
}
