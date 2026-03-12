import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const sites = await prisma.site.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(sites)
  } catch (error) {
    console.error('GET /api/sites error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
