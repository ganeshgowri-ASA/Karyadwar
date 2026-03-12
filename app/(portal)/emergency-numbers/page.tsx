'use client'

import { useState, useEffect } from 'react'

interface EmergencyNumber {
  id: string
  name: string
  landlineNo?: string | null
  mobileNo?: string | null
  otherNo?: string | null
  sortOrder: number
  site: { name: string; code: string }
}

interface Site {
  id: string
  name: string
  code: string
}

export default function EmergencyNumbersPage() {
  const [numbers, setNumbers] = useState<EmergencyNumber[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState<string>('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/emergency-numbers').then((r) => r.json()).catch(() => []),
      fetch('/api/sites').then((r) => r.json()).catch(() => []),
    ]).then(([nums, siteData]) => {
      if (Array.isArray(nums)) setNumbers(nums)
      if (Array.isArray(siteData)) setSites(siteData)
      setLoading(false)
    })
  }, [])

  const filtered = numbers.filter((n) => {
    const matchesSite = !selectedSite || n.site.name === selectedSite || n.site.code === selectedSite
    const matchesSearch = !search ||
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.site.name.toLowerCase().includes(search.toLowerCase()) ||
      (n.landlineNo || '').includes(search) ||
      (n.mobileNo || '').includes(search)
    return matchesSite && matchesSearch
  })

  // Group by site
  const grouped = filtered.reduce<Record<string, EmergencyNumber[]>>((acc, n) => {
    const key = n.site.name
    if (!acc[key]) acc[key] = []
    acc[key].push(n)
    return acc
  }, {})

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🚨</span>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Numbers</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Emergency contact directory for all manufacturing sites
        </p>
      </div>

      {/* Emergency banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3">
        <div className="text-red-600 text-2xl">📞</div>
        <div>
          <p className="text-red-800 font-semibold text-sm">In case of emergency</p>
          <p className="text-red-700 text-xs mt-0.5">
            Call the site fire station (100) or security control room (102) immediately. For life-threatening emergencies, dial 108 (national ambulance service).
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, site, or number..."
            className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-w-36"
          >
            <option value="">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          {(search || selectedSite) && (
            <button
              onClick={() => { setSearch(''); setSelectedSite('') }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-48 animate-pulse" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📞</p>
          <p className="text-lg font-medium">No emergency contacts found</p>
          <p className="text-sm mt-1">Try adjusting your search or site filter</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([siteName, siteNumbers]) => (
            <div key={siteName} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-red-800 text-white px-5 py-3 flex items-center gap-2">
                <span>📍</span>
                <h2 className="font-semibold">{siteName}</h2>
                <span className="ml-auto text-red-200 text-sm">{siteNumbers.length} contacts</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-red-50 border-b border-red-100">
                      <th className="text-left text-xs font-semibold text-red-800 uppercase tracking-wide px-5 py-3">Department / Service</th>
                      <th className="text-left text-xs font-semibold text-red-800 uppercase tracking-wide px-5 py-3">Landline</th>
                      <th className="text-left text-xs font-semibold text-red-800 uppercase tracking-wide px-5 py-3">Mobile</th>
                      <th className="text-left text-xs font-semibold text-red-800 uppercase tracking-wide px-5 py-3">Other</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {siteNumbers.map((num) => (
                      <tr key={num.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-gray-800">{num.name}</td>
                        <td className="px-5 py-3">
                          {num.landlineNo ? (
                            <a href={`tel:${num.landlineNo}`} className="text-sm text-red-700 hover:text-red-900 font-mono font-semibold">
                              {num.landlineNo}
                            </a>
                          ) : <span className="text-gray-400 text-sm">—</span>}
                        </td>
                        <td className="px-5 py-3">
                          {num.mobileNo ? (
                            <a href={`tel:${num.mobileNo}`} className="text-sm text-red-700 hover:text-red-900 font-mono font-semibold">
                              {num.mobileNo}
                            </a>
                          ) : <span className="text-gray-400 text-sm">—</span>}
                        </td>
                        <td className="px-5 py-3">
                          {num.otherNo ? (
                            <a href={`tel:${num.otherNo}`} className="text-sm text-red-700 hover:text-red-900 font-mono font-semibold">
                              {num.otherNo}
                            </a>
                          ) : <span className="text-gray-400 text-sm">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
