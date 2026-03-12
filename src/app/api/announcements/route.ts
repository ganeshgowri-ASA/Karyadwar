export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("site_id");
  const all = searchParams.get("all");

  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        ...(all ? {} : { is_active: true }),
        ...(siteId
          ? { OR: [{ site_id: parseInt(siteId) }, { site_id: null }] }
          : {}),
      },
      orderBy: { created_at: "desc" },
      include: { site: true },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!session || !["ADMIN", "SITE_ADMIN"].includes(user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        site_id: body.site_id || null,
        is_active: body.is_active ?? true,
        expires_at: body.expires_at ? new Date(body.expires_at) : null,
      },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
