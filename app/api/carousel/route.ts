import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const FALLBACK_IMAGES = [
  { id: 'f1', imageUrl: 'https://picsum.photos/seed/plant1/1200/450', linkUrl: null, sortOrder: 1 },
  { id: 'f2', imageUrl: 'https://picsum.photos/seed/plant2/1200/450', linkUrl: null, sortOrder: 2 },
  { id: 'f3', imageUrl: 'https://picsum.photos/seed/plant3/1200/450', linkUrl: null, sortOrder: 3 },
  { id: 'f4', imageUrl: 'https://picsum.photos/seed/plant4/1200/450', linkUrl: null, sortOrder: 4 },
  { id: 'f5', imageUrl: 'https://picsum.photos/seed/plant5/1200/450', linkUrl: null, sortOrder: 5 },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('siteId')

    const where: any = { isActive: true }
    if (siteId) where.siteId = siteId

    const images = await prisma.carouselImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(images.length > 0 ? images : FALLBACK_IMAGES)
  } catch (error) {
    console.error('GET /api/carousel error:', error)
    return NextResponse.json(FALLBACK_IMAGES)
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const img = await prisma.carouselImage.create({ data: body })
    return NextResponse.json(img, { status: 201 })
  } catch (error) {
    console.error('POST /api/carousel error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, ...data } = body
    const img = await prisma.carouselImage.update({ where: { id }, data })
    return NextResponse.json(img)
  } catch (error) {
    console.error('PUT /api/carousel error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await prisma.carouselImage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/carousel error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
