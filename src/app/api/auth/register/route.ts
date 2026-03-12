export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, domain_id, password, site_id } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check for existing domain_id if provided
    if (domain_id) {
      const existingDomain = await prisma.user.findUnique({
        where: { domain_id },
      });
      if (existingDomain) {
        return NextResponse.json(
          { error: "This Domain ID is already registered." },
          { status: 409 }
        );
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nick_name: name || null,
        email,
        domain_id: domain_id || null,
        password_hash,
        default_site: site_id ? parseInt(site_id) : null,
        login_method: "EMAIL",
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        nick_name: true,
        role: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
