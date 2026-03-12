"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

interface NavbarProps {
  session: Session;
}

export function Navbar({ session }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session.user as any;

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      {/* Top bar */}
      <div className="bg-blue-950 px-4 py-1 flex items-center justify-between text-xs text-blue-300">
        <span>Welcome, {user.name}</span>
        <span>
          {user.siteName ? `Site: ${user.siteName}` : "All Sites"}
        </span>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-900 font-bold text-lg">K</span>
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">Karyadwar</div>
            <div className="text-blue-300 text-xs leading-tight">
              Manufacturing Intranet Portal
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-md text-sm hover:bg-blue-800 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/emergency-numbers"
            className="px-3 py-2 rounded-md text-sm hover:bg-blue-800 transition-colors"
          >
            Emergency Numbers
          </Link>
          {(user.role === "ADMIN" || user.role === "SITE_ADMIN") && (
            <Link
              href="/admin"
              className="px-3 py-2 rounded-md text-sm hover:bg-blue-800 transition-colors bg-orange-600"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 hover:bg-blue-800 rounded-md px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              {getInitials(user.name || "U")}
            </div>
            <span className="text-sm hidden md:block">{user.name}</span>
            <svg
              className="w-4 h-4 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                {user.empNo && (
                  <p className="text-xs text-gray-500">Emp: {user.empNo}</p>
                )}
              </div>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/emergency-numbers"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 md:hidden"
                onClick={() => setMenuOpen(false)}
              >
                Emergency Numbers
              </Link>
              {(user.role === "ADMIN" || user.role === "SITE_ADMIN") && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <hr className="border-gray-100" />
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
