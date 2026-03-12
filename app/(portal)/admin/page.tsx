'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  users: number
  applications: number
  sites: number
  announcements: number
  emergencyNumbers: number
  events: number
}

const ADMIN_MODULES = [
  { title: 'Applications', desc: 'Manage enterprise and local apps', icon: '📱', href: '/admin/applications', color: 'blue' },
  { title: 'Announcements', desc: 'Create and manage announcements', icon: '📢', href: '/admin/announcements', color: 'green' },
  { title: 'Emergency Numbers', desc: 'Manage emergency contacts by site', icon: '🚨', href: '/admin/emergency-numbers', color: 'red' },
  { title: 'Carousel Images', desc: 'Manage homepage carousel slides', icon: '🖼️', href: '/admin/carousel', color: 'purple' },
  { title: 'Ticker Items', desc: 'Manage news ticker announcements', icon: '📰', href: '/admin/ticker', color: 'amber' },
  { title: 'Employee Events', desc: 'Manage birthdays and long service', icon: '🎂', href: '/admin/events', color: 'pink' },
  { title: 'Users', desc: 'View and manage portal users', icon: '👥', href: '/admin/users', color: 'indigo' },
]

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session && session.user.role === 'user') {
      router.push('/')
      return
    }
    Promise.all([
      fetch('/api/users').then((r) => r.json()).catch(() => []),
      fetch('/api/applications').then((r) => r.json()).catch(() => []),
      fetch('/api/sites').then((r) => r.json()).catch(() => []),
      fetch('/api/announcements').then((r) => r.json()).catch(() => []),
      fetch('/api/emergency-numbers').then((r) => r.json()).catch(() => []),
      fetch('/api/events').then((r) => r.json()).catch(() => []),
    ]).then(([users, apps, sites, anns, emerg, events]) => {
      setStats({
        users: Array.isArray(users) ? users.length : 0,
        applications: Array.isArray(apps) ? apps.length : 0,
        sites: Array.isArray(sites) ? sites.length : 0,
        announcements: Array.isArray(anns) ? anns.length : 0,
        emergencyNumbers: Array.isArray(emerg) ? emerg.length : 0,
        events: Array.isArray(events) ? events.length : 0,
      })
      setLoading(false)
    })
  }, [session, router])

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100',
    red: 'bg-red-50 border-red-200 hover:border-red-400 hover:bg-red-100',
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100',
    amber: 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:bg-amber-100',
    pink: 'bg-pink-50 border-pink-200 hover:border-pink-400 hover:bg-pink-100',
    indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100',
  }

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">⚙️</span>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
            session?.user?.role === 'superadmin' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {session?.user?.role}
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          Manage portal content, applications, and users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Users', value: stats?.users, icon: '👥' },
          { label: 'Applications', value: stats?.applications, icon: '📱' },
          { label: 'Sites', value: stats?.sites, icon: '🏭' },
          { label: 'Announcements', value: stats?.announcements, icon: '📢' },
          { label: 'Emergency Nos.', value: stats?.emergencyNumbers, icon: '🚨' },
          { label: 'Events', value: stats?.events, icon: '🎂' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '—' : stat.value ?? 0}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Module cards */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ADMIN_MODULES.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${colorMap[mod.color]}`}
          >
            <span className="text-3xl">{mod.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-800">{mod.title}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{mod.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick info */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-amber-800 text-sm font-semibold mb-1">Admin Access Info</p>
        <ul className="text-amber-700 text-xs space-y-1">
          <li>• You are logged in as <strong>{session?.user?.name}</strong> ({session?.user?.empNo}) with role: <strong>{session?.user?.role}</strong></li>
          <li>• Changes made here affect all users across the portal</li>
          <li>• Always verify before deleting records as some actions cannot be undone</li>
        </ul>
      </div>
    </div>
  )
}
