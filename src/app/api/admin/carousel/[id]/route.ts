import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { getSession } from '@/lib/auth'
import { deleteCarouselImage } from '@/lib/carousel'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const filename = await deleteCarouselImage(Number(id))

  if (!filename) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    await unlink(path.join(process.cwd(), 'public', 'images', 'carousel', filename))
  } catch {}

  return new NextResponse(null, { status: 204 })
}
