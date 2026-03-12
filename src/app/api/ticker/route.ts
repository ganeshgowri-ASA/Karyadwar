import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("site_id");

  try {
    const items = await prisma.tickerItem.findMany({
      where: {
        is_active: true,
        ...(siteId
          ? { OR: [{ site_id: parseInt(siteId) }, { site_id: null }] }
          : {}),
      },
    });
    return NextResponse.json(items);
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
    const item = await prisma.tickerItem.create({
      data: {
        content: body.content,
        site_id: body.site_id,
        is_active: body.is_active ?? true,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
