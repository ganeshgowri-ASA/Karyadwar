import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('siteId')

    const where: any = { isActive: true }
    if (siteId) where.siteId = siteId

    const announcements = await prisma.announcement.findMany({
      where,
      include: { site: { select: { name: true, code: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('GET /api/announcements error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const ann = await prisma.announcement.create({ data: body })
    return NextResponse.json(ann, { status: 201 })
  } catch (error) {
    console.error('POST /api/announcements error:', error)
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
    const ann = await prisma.announcement.update({ where: { id }, data })
    return NextResponse.json(ann)
  } catch (error) {
    console.error('PUT /api/announcements error:', error)
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
    await prisma.announcement.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/announcements error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
