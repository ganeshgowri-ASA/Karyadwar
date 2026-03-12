export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as any;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: parseInt(user.id) },
      include: { application: true },
    });
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as any;

  try {
    const body = await request.json();

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: { user_id: parseInt(user.id), app_id: body.app_id },
    });
    if (existing) {
      return NextResponse.json(existing);
    }

    const favorite = await prisma.favorite.create({
      data: {
        user_id: parseInt(user.id),
        app_id: body.app_id || null,
        custom_link_name: body.custom_link_name || null,
        custom_link_url: body.custom_link_url || null,
      },
    });
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as any;

  try {
    const body = await request.json();
    await prisma.favorite.deleteMany({
      where: { user_id: parseInt(user.id), app_id: body.app_id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
