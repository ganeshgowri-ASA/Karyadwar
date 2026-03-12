import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const FALLBACK_ITEMS = [
  'Safety First: Wear PPE at all times in designated areas',
  'SAP Upgrade scheduled for 20th March 2026',
  'New Emergency Contact Directory available at all site admin offices',
  'Long Service Awards ceremony on 25th March at Jamnagar',
  'ISO 45001 Recertification audit at Dahej site on 18th March',
  'Quarterly Environment Report submissions due by 31st March',
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('siteId')

    const where: any = { isActive: true }
    if (siteId) where.siteId = siteId

    const items = await prisma.tickerItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    if (items.length > 0) {
      return NextResponse.json(items.map((i) => i.content))
    }
    return NextResponse.json(FALLBACK_ITEMS)
  } catch (error) {
    console.error('GET /api/ticker error:', error)
    return NextResponse.json(FALLBACK_ITEMS)
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const item = await prisma.tickerItem.create({ data: body })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('POST /api/ticker error:', error)
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
    const item = await prisma.tickerItem.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error) {
    console.error('PUT /api/ticker error:', error)
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
    await prisma.tickerItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/ticker error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
