export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!session || !["ADMIN", "SITE_ADMIN"].includes(user?.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        emp_no: true,
        domain_id: true,
        nick_name: true,
        email: true,
        default_site: true,
        login_method: true,
        role: true,
        site: { select: { name: true } },
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as any;
  if (!session || currentUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const passwordHash = body.password
      ? await bcrypt.hash(body.password, 10)
      : null;

    const newUser = await prisma.user.create({
      data: {
        emp_no: body.emp_no || null,
        domain_id: body.domain_id || null,
        nick_name: body.nick_name || null,
        email: body.email,
        default_site: body.default_site || null,
        login_method: body.login_method || "EMAIL",
        password_hash: passwordHash,
        role: body.role || "USER",
      },
    });

    const { password_hash, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
