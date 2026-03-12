export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const siteId = searchParams.get("site_id");

  try {
    const apps = await prisma.application.findMany({
      where: {
        is_active: true,
        ...(category ? { category: category as any } : {}),
        ...(siteId ? { site_id: parseInt(siteId) } : {}),
      },
      orderBy: [{ letter_index: "asc" }, { sort_order: "asc" }],
      include: { site: true },
    });
    return NextResponse.json(apps);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
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
    const app = await prisma.application.create({
      data: {
        name: body.name,
        url: body.url,
        category: body.category,
        letter_index: body.letter_index,
        site_id: body.site_id || null,
        description: body.description || null,
        contact_func: body.contact_func || null,
        contact_tech: body.contact_tech || null,
        is_active: body.is_active ?? true,
        sort_order: body.sort_order ?? 0,
      },
    });
    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}
