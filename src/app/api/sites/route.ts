import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      where: { is_active: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(sites);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const site = await prisma.site.create({
      data: { name: body.name, code: body.code, is_active: body.is_active ?? true },
    });
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create site" }, { status: 500 });
  }
}
