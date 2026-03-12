export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!session || !["ADMIN", "SITE_ADMIN"].includes(user?.role)) {
    redirect("/dashboard");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "🏠" },
    { href: "/admin/announcements", label: "Announcements", icon: "📢" },
    { href: "/admin/applications", label: "Applications", icon: "🔗" },
    { href: "/admin/images", label: "Carousel Images", icon: "🖼️" },
    { href: "/admin/emergency-numbers", label: "Emergency Numbers", icon: "🆘" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/access", label: "Admin Access", icon: "🔑" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
            ← Back to Portal
          </Link>
          <span className="text-gray-600">|</span>
          <span className="font-semibold">Karyadwar Admin Panel</span>
        </div>
        <span className="text-sm text-gray-400">
          Logged in as: {user?.name}
        </span>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-gray-800 min-h-screen text-white">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
