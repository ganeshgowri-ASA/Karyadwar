'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const SITES = [
  'Jamnagar', 'Barabanki', 'Dahej', 'Hazira PetChem',
  'Hazira Polyester', 'Hoshiarpur', 'Nagothane', 'Naroda',
  'Patalganga PetChem', 'Patalganga Polyester', 'Silvassa', 'Vadodara',
]

export default function Header() {
  const { data: session } = useSession()
  const [showProfile, setShowProfile] = useState(false)
  const [showSiteSelector, setShowSiteSelector] = useState(false)
  const [selectedSite, setSelectedSite] = useState(session?.user?.defaultSiteName || 'Jamnagar')

  const user = session?.user
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-inner">
            K
          </div>
          <div className="hidden sm:block">
            <div className="text-base font-bold tracking-wide leading-tight">Karyadwar</div>
            <div className="text-blue-300 text-[10px] leading-tight">Manufacturing Intranet Portal</div>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <Link href="/dashboard" className="px-3 py-1.5 rounded text-blue-200 hover:text-white hover:bg-blue-800 transition-colors">
            Home
          </Link>
          <Link href="/enterprise-apps" className="px-3 py-1.5 rounded text-blue-200 hover:text-white hover:bg-blue-800 transition-colors">
            Enterprise Apps
          </Link>
          <Link href="/local-apps" className="px-3 py-1.5 rounded text-blue-200 hover:text-white hover:bg-blue-800 transition-colors">
            Local Apps
          </Link>
          <Link href="/favorites" className="px-3 py-1.5 rounded text-blue-200 hover:text-white hover:bg-blue-800 transition-colors">
            Favorites
          </Link>
          <Link href="/emergency-numbers" className="px-3 py-1.5 rounded text-blue-200 hover:text-white hover:bg-blue-800 transition-colors">
            Emergency
          </Link>
          {isAdmin && (
            <Link href="/admin" className="px-3 py-1.5 rounded text-amber-300 hover:text-amber-200 hover:bg-blue-800 transition-colors font-medium">
              Admin
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Site selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => { setShowSiteSelector(!showSiteSelector); setShowProfile(false) }}
              className="flex items-center gap-1.5 text-xs bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors"
            >
              <span className="text-blue-300">Site:</span>
              <span className="font-medium">{selectedSite}</span>
              <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showSiteSelector && (
              <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded-lg shadow-xl z-50 w-52 max-h-64 overflow-y-auto border border-gray-200">
                <div className="p-2">
                  <p className="text-xs text-gray-500 font-medium px-2 py-1 uppercase tracking-wide">Select Site</p>
                  {SITES.map((site) => (
                    <button
                      key={site}
                      onClick={() => { setSelectedSite(site); setShowSiteSelector(false) }}
                      className={`w-full text-left text-sm px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 transition-colors ${
                        selectedSite === site ? 'bg-blue-50 text-blue-800 font-medium' : ''
                      }`}
                    >
                      {site}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowSiteSelector(false) }}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 px-2.5 py-1.5 rounded-md transition-colors"
            >
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium leading-tight">{user?.name || 'User'}</div>
                <div className="text-[10px] text-blue-300 leading-tight capitalize">{user?.role || 'employee'}</div>
              </div>
              <svg className="w-3 h-3 text-blue-300 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded-lg shadow-xl z-50 w-56 border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {user?.empNo} · <span className="capitalize">{user?.role}</span>
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    <span>🏠</span> Dashboard
                  </Link>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    <span>★</span> My Favorites
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-gray-50 transition-colors text-amber-700"
                      onClick={() => setShowProfile(false)}
                    >
                      <span>⚙️</span> Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <span>↩</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showProfile || showSiteSelector) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowProfile(false); setShowSiteSelector(false) }}
        />
      )}
    </header>
  )
}
