'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const ENTERPRISE_APPS = [
  { name: 'Ariba', letter: 'A', url: 'https://ariba.example.com' },
  { name: 'CAT', letter: 'C', url: 'https://cat.example.com' },
  { name: 'Documentum', letter: 'D', url: 'https://documentum.example.com' },
  { name: 'EHS System', letter: 'E', url: 'https://ehs.example.com' },
  { name: 'ESS', letter: 'E', url: 'https://ess.example.com' },
  { name: 'LIMS', letter: 'L', url: 'https://lims.example.com' },
  { name: 'Maximo', letter: 'M', url: 'https://maximo.example.com' },
  { name: 'Office 365', letter: 'O', url: 'https://portal.office.com' },
  { name: 'SAP ERP', letter: 'S', url: 'https://sap.example.com' },
  { name: 'ServiceNow', letter: 'S', url: 'https://servicenow.example.com' },
]

const LOCAL_APPS = [
  { name: 'Canteen Mgmt', letter: 'C', url: '/apps/canteen' },
  { name: 'Gate Pass', letter: 'G', url: '/apps/gate-pass' },
  { name: 'Incident Report', letter: 'I', url: '/apps/incident' },
  { name: 'Permit to Work', letter: 'P', url: '/apps/permit-to-work' },
  { name: 'Shift Roster', letter: 'S', url: '/apps/shift-roster' },
  { name: 'Visitor Mgmt', letter: 'V', url: '/apps/visitor' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [openSection, setOpenSection] = useState<string | null>('enterprise')
  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'superadmin'

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const navItem = (href: string, label: string, icon: string) => (
    <Link
      key={href}
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
        pathname === href
          ? 'bg-blue-100 text-blue-800 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </Link>
  )

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-3 space-y-1">
        {/* Main nav */}
        {navItem('/dashboard', 'Home', '🏠')}
        {navItem('/favorites', 'My Favorites', '★')}
        {navItem('/emergency-numbers', 'Emergency Numbers', '🚨')}

        {/* Enterprise Apps accordion */}
        <div>
          <button
            onClick={() => toggle('enterprise')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base w-5 text-center">🏢</span>
              Enterprise Apps
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'enterprise' ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSection === 'enterprise' && (
            <div className="ml-4 mt-1 space-y-0.5">
              {ENTERPRISE_APPS.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold flex items-center justify-center shrink-0">
                    {app.letter}
                  </span>
                  {app.name}
                </a>
              ))}
              <Link
                href="/enterprise-apps"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          )}
        </div>

        {/* Local Apps accordion */}
        <div>
          <button
            onClick={() => toggle('local')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base w-5 text-center">🏭</span>
              Local Apps
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'local' ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openSection === 'local' && (
            <div className="ml-4 mt-1 space-y-0.5">
              {LOCAL_APPS.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <span className="w-5 h-5 bg-green-100 text-green-700 rounded text-[10px] font-bold flex items-center justify-center shrink-0">
                    {app.letter}
                  </span>
                  {app.name}
                </a>
              ))}
              <Link
                href="/local-apps"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View all →
              </Link>
            </div>
          )}
        </div>

        {/* Admin section */}
        {isAdmin && (
          <>
            <hr className="border-gray-200 my-2" />
            <p className="text-[10px] text-gray-400 uppercase tracking-wider px-3 font-semibold">Admin</p>
            {navItem('/admin', 'Admin Dashboard', '⚙️')}
            {navItem('/admin/applications', 'Manage Apps', '📱')}
            {navItem('/admin/announcements', 'Announcements', '📢')}
            {navItem('/admin/carousel', 'Carousel Images', '🖼️')}
            {navItem('/admin/ticker', 'Ticker Items', '📰')}
            {navItem('/admin/events', 'Employee Events', '🎂')}
            {navItem('/admin/users', 'Users', '👥')}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center">
          Karyadwar v2026.1<br />
          Manufacturing Intranet Portal
        </p>
      </div>
    </aside>
  )
}
