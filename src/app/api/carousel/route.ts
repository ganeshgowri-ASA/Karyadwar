import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("site_id");

  try {
    const images = await prisma.carouselImage.findMany({
      where: siteId ? { site_id: parseInt(siteId) } : {},
      orderBy: { sort_order: "asc" },
      include: { site: true },
    });
    return NextResponse.json(images);
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
    const image = await prisma.carouselImage.create({
      data: {
        image_url: body.image_url,
        link_url: body.link_url || null,
        site_id: body.site_id,
        sort_order: body.sort_order ?? 0,
        is_active: body.is_active ?? true,
      },
    });
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
