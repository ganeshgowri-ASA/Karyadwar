export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as any;

  try {
    const profile = await prisma.user.findUnique({
      where: { id: parseInt(user.id) },
      select: {
        id: true,
        emp_no: true,
        domain_id: true,
        nick_name: true,
        email: true,
        default_site: true,
        login_method: true,
        role: true,
        site: true,
      },
    });
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = session.user as any;

  try {
    const body = await request.json();
    const updateData: any = {
      nick_name: body.nick_name,
      default_site: body.default_site || null,
    };

    if (body.new_password) {
      // Verify current password
      const currentUser = await prisma.user.findUnique({
        where: { id: parseInt(user.id) },
      });
      if (!currentUser?.password_hash) {
        return NextResponse.json({ error: "Password update not supported" }, { status: 400 });
      }
      const isValid = await bcrypt.compare(body.current_password, currentUser.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      updateData.password_hash = await bcrypt.hash(body.new_password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(user.id) },
      data: updateData,
      select: {
        id: true,
        emp_no: true,
        domain_id: true,
        nick_name: true,
        email: true,
        default_site: true,
        login_method: true,
        role: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
