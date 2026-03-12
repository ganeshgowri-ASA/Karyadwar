import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('siteId')

    const where: any = {}
    if (siteId) where.siteId = siteId

    const numbers = await prisma.emergencyNumber.findMany({
      where,
      include: { site: { select: { name: true, code: true } } },
      orderBy: [{ site: { name: 'asc' } }, { sortOrder: 'asc' }],
    })

    return NextResponse.json(numbers)
  } catch (error) {
    console.error('GET /api/emergency-numbers error:', error)
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
    const num = await prisma.emergencyNumber.create({ data: body })
    return NextResponse.json(num, { status: 201 })
  } catch (error) {
    console.error('POST /api/emergency-numbers error:', error)
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
    const num = await prisma.emergencyNumber.update({ where: { id }, data })
    return NextResponse.json(num)
  } catch (error) {
    console.error('PUT /api/emergency-numbers error:', error)
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
    await prisma.emergencyNumber.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/emergency-numbers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
