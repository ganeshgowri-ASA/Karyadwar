import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("site_id");

  try {
    const numbers = await prisma.emergencyNumber.findMany({
      where: siteId ? { site_id: parseInt(siteId) } : {},
      orderBy: { sort_order: "asc" },
      include: { site: true },
    });
    return NextResponse.json(numbers);
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
    const num = await prisma.emergencyNumber.create({
      data: {
        name: body.name,
        landline_no: body.landline_no || null,
        mobile_no: body.mobile_no || null,
        other_no: body.other_no || null,
        site_id: body.site_id,
        sort_order: body.sort_order ?? 0,
      },
    });
    return NextResponse.json(num, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
