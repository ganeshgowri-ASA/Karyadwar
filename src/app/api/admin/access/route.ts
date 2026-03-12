import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!session || user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const access = await prisma.adminAccess.findMany({
      include: {
        user: { select: { email: true, nick_name: true, emp_no: true } },
        site: { select: { name: true, code: true } },
      },
    });
    return NextResponse.json(access);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!session || user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const access = await prisma.adminAccess.create({
      data: {
        user_id: body.user_id,
        permission_level: body.permission_level,
        site_id: body.site_id || null,
      },
    });
    return NextResponse.json(access, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
