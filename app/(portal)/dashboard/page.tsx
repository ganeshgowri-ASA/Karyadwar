'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Carousel from '@/components/Carousel'
import AppCard from '@/components/AppCard'

interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
  site?: { name: string }
}

interface EmployeeEvent {
  id: string
  name: string
  eventType: 'BIRTHDAY' | 'LONG_SERVICE'
  eventDate: string
  department?: string
}

interface Application {
  id: string
  name: string
  description?: string | null
  url: string
  letterIndex: string
  category: string
  contactFunc?: string | null
  contactTech?: string | null
}

const QUICK_LINKS = [
  { label: 'Safety Portal', icon: '🛡️', href: '/enterprise-apps' },
  { label: 'HR Self Service', icon: '👤', href: 'https://ess.example.com' },
  { label: 'IT Helpdesk', icon: '⚙️', href: 'https://helpdesk.example.com' },
  { label: 'Quality Management', icon: '✅', href: '/local-apps' },
  { label: 'Production Dashboard', icon: '📊', href: '/local-apps' },
  { label: 'Training Portal', icon: '📚', href: 'https://lms.example.com' },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [events, setEvents] = useState<EmployeeEvent[]>([])
  const [featuredApps, setFeaturedApps] = useState<Application[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/announcements').then((r) => r.json()).catch(() => []),
      fetch('/api/events?limit=8').then((r) => r.json()).catch(() => []),
      fetch('/api/applications?category=ENTERPRISE').then((r) => r.json()).catch(() => []),
      fetch('/api/favorites').then((r) => r.json()).catch(() => []),
    ]).then(([anns, evts, apps, favs]) => {
      setAnnouncements(Array.isArray(anns) ? anns.slice(0, 5) : [])
      setEvents(Array.isArray(evts) ? evts : [])
      setFeaturedApps(Array.isArray(apps) ? apps.slice(0, 6) : [])
      if (Array.isArray(favs)) {
        setFavorites(new Set(favs.map((f: any) => f.applicationId).filter(Boolean)))
      }
      setLoading(false)
    })
  }, [])

  const toggleFavorite = async (appId: string) => {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId }),
    })
    if (res.ok) {
      const data = await res.json()
      setFavorites((prev) => {
        const next = new Set(prev)
        if (data.action === 'added') next.add(appId)
        else next.delete(appId)
        return next
      })
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      {/* Welcome */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ''}
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {session?.user?.defaultSiteName
            ? `${session.user.defaultSiteName} site — `
            : ''}
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Carousel */}
          <section>
            <Carousel />
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="section-title">Quick Links</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{link.label}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Featured Enterprise Apps */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title mb-0">Enterprise Applications</h2>
              <Link href="/enterprise-apps" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featuredApps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    isFavorite={favorites.has(app.id)}
                    onFavoriteToggle={toggleFavorite}
                    colorScheme="blue"
                  />
                ))}
              </div>
            )}
          </section>

          {/* Announcements */}
          <section>
            <h2 className="section-title">Recent Announcements</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 h-20 animate-pulse" />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-gray-500 text-sm">No announcements at this time.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">{ann.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ann.content}</p>
                        {ann.site && (
                          <span className="inline-block mt-1.5 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {ann.site.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Employee Events */}
          <section>
            <h2 className="section-title">Employee Events</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 h-14 animate-pulse" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming events.</p>
            ) : (
              <div className="space-y-2">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      ev.eventType === 'BIRTHDAY' ? 'bg-pink-100 text-pink-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {ev.eventType === 'BIRTHDAY' ? '🎂' : '🏆'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{ev.name}</p>
                      <p className="text-xs text-gray-500">
                        {ev.department && `${ev.department} · `}
                        {new Date(ev.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                      ev.eventType === 'BIRTHDAY' ? 'bg-pink-50 text-pink-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {ev.eventType === 'BIRTHDAY' ? 'Birthday' : 'Long Service'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Emergency Numbers Quick */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title mb-0">Emergency Contacts</h2>
              <Link href="/emergency-numbers" className="text-xs text-blue-600 hover:text-blue-800">
                All →
              </Link>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2.5">
              {[
                { name: 'Fire Station', number: '100' },
                { name: 'Medical / OHC', number: '101' },
                { name: 'Security Control', number: '102' },
                { name: 'IT Helpdesk', number: '4000' },
              ].map((e) => (
                <div key={e.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{e.name}</span>
                  <a
                    href={`tel:${e.number}`}
                    className="font-bold text-red-700 hover:text-red-900 font-mono"
                  >
                    {e.number}
                  </a>
                </div>
              ))}
              <Link
                href="/emergency-numbers"
                className="block text-center text-xs text-red-600 hover:text-red-800 font-medium mt-1 pt-2 border-t border-red-200"
              >
                View full directory →
              </Link>
            </div>
          </section>

          {/* Manufacturing Sites */}
          <section>
            <h2 className="section-title">Manufacturing Sites</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {['Jamnagar', 'Barabanki', 'Dahej', 'Hazira', 'Hoshiarpur', 'Nagothane', 'Naroda', 'Patalganga', 'Silvassa', 'Vadodara'].map((site) => (
                <button
                  key={site}
                  className="text-xs py-1.5 px-2 bg-white border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 text-gray-700 text-left transition-colors truncate"
                >
                  {site}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
