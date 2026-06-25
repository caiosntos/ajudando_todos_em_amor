import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getSession } from '@/lib/auth'
import { addCarouselImage, listCarouselImages } from '@/lib/carousel'

export async function GET() {
  const images = await listCarouselImages()
  return NextResponse.json(images)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const alt = (formData.get('alt') as string) || 'Foto do carrossel'

  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `carousel-${Date.now()}.${ext}`
  const dir = path.join(process.cwd(), 'public', 'images', 'carousel')

  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()))

  const image = await addCarouselImage(filename, alt)
  return NextResponse.json(image, { status: 201 })
}
