import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: { application: true },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(favorites)
  } catch (error) {
    console.error('GET /api/favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { applicationId } = await req.json()

    const existing = await prisma.favorite.findFirst({
      where: { userId: session.user.id, applicationId },
    })

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      return NextResponse.json({ action: 'removed' })
    }

    const fav = await prisma.favorite.create({
      data: { userId: session.user.id, applicationId },
    })
    return NextResponse.json({ action: 'added', favorite: fav }, { status: 201 })
  } catch (error) {
    console.error('POST /api/favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.favorite.deleteMany({
      where: { id, userId: session.user.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/favorites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
