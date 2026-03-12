export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [userCount, appCount, announcementCount, siteCount] = await Promise.all([
    prisma.user.count(),
    prisma.application.count({ where: { is_active: true } }),
    prisma.announcement.count({ where: { is_active: true } }),
    prisma.site.count({ where: { is_active: true } }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount, icon: "👥", href: "/admin/users", color: "bg-blue-500" },
    { label: "Active Applications", value: appCount, icon: "🔗", href: "/admin/applications", color: "bg-green-500" },
    { label: "Active Announcements", value: announcementCount, icon: "📢", href: "/admin/announcements", color: "bg-orange-500" },
    { label: "Active Sites", value: siteCount, icon: "🏭", href: "/admin/applications", color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-xl`}
              >
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { href: "/admin/announcements", icon: "📢", title: "Manage Announcements", desc: "Add, edit, and manage portal announcements" },
          { href: "/admin/applications", icon: "🔗", title: "Manage Applications", desc: "Manage enterprise and local application links" },
          { href: "/admin/images", icon: "🖼️", title: "Carousel Images", desc: "Update carousel banner images" },
          { href: "/admin/emergency-numbers", icon: "🆘", title: "Emergency Numbers", desc: "Manage site emergency contact numbers" },
          { href: "/admin/users", icon: "👥", title: "User Management", desc: "View and manage user accounts" },
          { href: "/admin/access", icon: "🔑", title: "Admin Access", desc: "Manage admin permissions and roles" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
              {item.icon}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
