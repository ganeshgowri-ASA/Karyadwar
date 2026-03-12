import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      include: { defaultSite: { select: { name: true, code: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const safeUsers = users.map(({ password, ...u }) => u)
    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { password, ...rest } = body
    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined

    const user = await prisma.user.create({
      data: { ...rest, ...(hashedPassword ? { password: hashedPassword } : {}) },
    })
    const { password: _, ...safeUser } = user
    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
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
    const { id, password, ...rest } = body
    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined

    const user = await prisma.user.update({
      where: { id },
      data: { ...rest, ...(hashedPassword ? { password: hashedPassword } : {}) },
    })
    const { password: _, ...safeUser } = user
    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('PUT /api/users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
