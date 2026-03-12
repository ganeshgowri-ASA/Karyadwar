import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "7");

  try {
    const events = await prisma.employeeEvent.findMany({
      where: {
        event_date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setDate(new Date().getDate() + days)),
        },
      },
      orderBy: { event_date: "asc" },
    });
    return NextResponse.json(events);
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
    const event = await prisma.employeeEvent.create({
      data: {
        emp_no: body.emp_no,
        event_type: body.event_type,
        event_date: new Date(body.event_date),
        department: body.department || null,
        email: body.email || null,
        photo_url: body.photo_url || null,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
