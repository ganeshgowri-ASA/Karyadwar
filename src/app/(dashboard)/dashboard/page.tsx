export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LeftSidebar } from "@/components/dashboard/LeftSidebar";
import { ImageCarousel } from "@/components/dashboard/ImageCarousel";
import { AnnouncementsPanel } from "@/components/dashboard/AnnouncementsPanel";
import { EmployeeEventsPanel } from "@/components/dashboard/EmployeeEventsPanel";
import { TickerBar } from "@/components/dashboard/TickerBar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;
  const siteId = user.defaultSite as number | null;

  // Fetch data in parallel
  const [
    favorites,
    enterpriseApps,
    localApps,
    announcements,
    carouselImages,
    tickerItems,
    employeeEvents,
  ] = await Promise.all([
    // Favorites
    prisma.favorite.findMany({
      where: { user_id: parseInt(user.id) },
      include: { application: true },
    }),
    // Enterprise apps
    prisma.application.findMany({
      where: { category: "enterprise", is_active: true },
      orderBy: [{ letter_index: "asc" }, { sort_order: "asc" }],
    }),
    // Local apps for user's site
    siteId
      ? prisma.application.findMany({
          where: { category: "local", site_id: siteId, is_active: true },
          orderBy: [{ letter_index: "asc" }, { sort_order: "asc" }],
        })
      : Promise.resolve([]),
    // Announcements
    prisma.announcement.findMany({
      where: {
        is_active: true,
        OR: [{ site_id: siteId }, { site_id: null }],
        AND: [
          {
            OR: [
              { expires_at: null },
              { expires_at: { gt: new Date() } },
            ],
          },
        ],
      },
      orderBy: { created_at: "desc" },
      take: 10,
    }),
    // Carousel images
    siteId
      ? prisma.carouselImage.findMany({
          where: { site_id: siteId, is_active: true },
          orderBy: { sort_order: "asc" },
        })
      : Promise.resolve([]),
    // Ticker items
    prisma.tickerItem.findMany({
      where: {
        is_active: true,
        OR: [{ site_id: siteId }, { site_id: null }],
      },
    }),
    // Employee events (today + next 7 days)
    prisma.employeeEvent.findMany({
      where: {
        event_date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      },
      orderBy: { event_date: "asc" },
    }),
  ]);

  const serializedAnnouncements = announcements.map((a) => ({
    ...a,
    created_at: a.created_at.toISOString(),
    expires_at: a.expires_at?.toISOString() || null,
    updated_at: a.updated_at.toISOString(),
  }));

  const serializedEvents = employeeEvents.map((e) => ({
    ...e,
    event_date: e.event_date.toISOString(),
    created_at: e.created_at.toISOString(),
    updated_at: e.updated_at.toISOString(),
  }));

  const serializedFavorites = favorites.map((f) => ({
    ...f,
    created_at: f.created_at.toISOString(),
    application: f.application
      ? {
          ...f.application,
          created_at: f.application.created_at.toISOString(),
          updated_at: f.application.updated_at.toISOString(),
        }
      : null,
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Ticker Bar */}
      <TickerBar items={tickerItems} />

      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* Left Sidebar - 3 columns */}
        <div className="col-span-12 md:col-span-3">
          <LeftSidebar
            favorites={serializedFavorites as any}
            enterpriseApps={enterpriseApps.map((a) => ({
              ...a,
              created_at: a.created_at.toISOString(),
              updated_at: a.updated_at.toISOString(),
            }))}
            localApps={localApps.map((a) => ({
              ...a,
              created_at: a.created_at.toISOString(),
              updated_at: a.updated_at.toISOString(),
            }))}
            userId={user.id}
          />
        </div>

        {/* Center Panel - 6 columns */}
        <div className="col-span-12 md:col-span-6 space-y-4">
          {/* Image Carousel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <ImageCarousel images={carouselImages} />
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600">⚡</span>
              Quick Links
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "IT Helpdesk", icon: "💻", url: "#" },
                { label: "HR Portal", icon: "👤", url: "#" },
                { label: "Leave Apply", icon: "📅", url: "#" },
                { label: "Pay Slips", icon: "💰", url: "#" },
                { label: "Travel Desk", icon: "✈️", url: "#" },
                { label: "Cafeteria", icon: "🍽️", url: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-colors text-center"
                >
                  <span className="text-xl mb-1">{link.icon}</span>
                  <span className="text-xs text-gray-600">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - 3 columns */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          {/* Announcements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <span className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center text-orange-600 text-xs">📢</span>
              <h3 className="text-sm font-semibold text-gray-700">
                Announcements
              </h3>
            </div>
            <div className="p-4">
              <AnnouncementsPanel announcements={serializedAnnouncements} />
            </div>
          </div>

          {/* Employee Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">
                Employee Celebrations
              </h3>
            </div>
            <div className="p-4">
              <EmployeeEventsPanel events={serializedEvents as any} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
