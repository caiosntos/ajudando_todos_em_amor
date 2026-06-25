import { pool } from './db'

export interface CarouselImage {
  id: number
  filename: string
  alt_text: string
  display_order: number
  created_at: string
}

export async function listCarouselImages(): Promise<CarouselImage[]> {
  const { rows } = await pool.query<CarouselImage>(
    'SELECT * FROM carousel_images ORDER BY display_order ASC, created_at ASC'
  )
  return rows
}

export async function addCarouselImage(filename: string, alt_text: string): Promise<CarouselImage> {
  const { rows } = await pool.query<CarouselImage>(
    'INSERT INTO carousel_images (filename, alt_text) VALUES ($1, $2) RETURNING *',
    [filename, alt_text]
  )
  return rows[0]
}

export async function deleteCarouselImage(id: number): Promise<string | null> {
  const { rows } = await pool.query<{ filename: string }>(
    'DELETE FROM carousel_images WHERE id = $1 RETURNING filename',
    [id]
  )
  return rows[0]?.filename ?? null
}
