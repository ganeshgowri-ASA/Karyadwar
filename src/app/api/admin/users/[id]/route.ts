export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as any;
  if (!session || !["ADMIN", "SITE_ADMIN"].includes(currentUser?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updateData: any = {
      emp_no: body.emp_no || null,
      domain_id: body.domain_id || null,
      nick_name: body.nick_name || null,
      email: body.email,
      default_site: body.default_site || null,
      login_method: body.login_method,
      role: body.role,
    };

    if (body.password) {
      updateData.password_hash = await bcrypt.hash(body.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    });

    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as any;
  if (!session || currentUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
