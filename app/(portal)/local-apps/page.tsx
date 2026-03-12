'use client'

import { useState, useEffect } from 'react'
import AppCard from '@/components/AppCard'

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

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function LocalAppsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [filtered, setFiltered] = useState<Application[]>([])
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/applications?category=LOCAL').then((r) => r.json()).catch(() => []),
      fetch('/api/favorites').then((r) => r.json()).catch(() => []),
    ]).then(([appsData, favsData]) => {
      if (Array.isArray(appsData)) setApps(appsData)
      if (Array.isArray(favsData)) {
        setFavorites(new Set(favsData.map((f: any) => f.applicationId).filter(Boolean)))
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let result = apps
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q)
      )
    }
    if (activeLetter) {
      result = result.filter((a) => a.letterIndex.toUpperCase() === activeLetter)
    }
    setFiltered(result)
  }, [apps, search, activeLetter])

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

  const availableLetters = new Set(apps.map((a) => a.letterIndex.toUpperCase()))

  const grouped = LETTERS.reduce<Record<string, Application[]>>((acc, letter) => {
    const group = filtered.filter((a) => a.letterIndex.toUpperCase() === letter)
    if (group.length > 0) acc[letter] = group
    return acc
  }, {})

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Local / Site Applications</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Site-specific applications for day-to-day plant operations
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveLetter(null) }}
            placeholder="Search local applications..."
            className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {(search || activeLetter) && (
            <button
              onClick={() => { setSearch(''); setActiveLetter(null) }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {LETTERS.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                setSearch('')
                setActiveLetter(activeLetter === letter ? null : letter)
              }}
              disabled={!availableLetters.has(letter)}
              className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                activeLetter === letter
                  ? 'bg-green-700 text-white'
                  : availableLetters.has(letter)
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5 text-sm text-gray-600">
        <span>{filtered.length} application{filtered.length !== 1 ? 's' : ''}</span>
        {(search || activeLetter) && <span className="text-green-600">— filtered</span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-44 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium">No applications found</p>
          <p className="text-sm mt-1">Try a different search or clear the filter</p>
        </div>
      ) : search || activeLetter ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              isFavorite={favorites.has(app.id)}
              onFavoriteToggle={toggleFavorite}
              colorScheme="green"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([letter, letterApps]) => (
            <div key={letter} id={`letter-${letter}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-green-700 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  {letter}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{letter}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{letterApps.length} app{letterApps.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {letterApps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    isFavorite={favorites.has(app.id)}
                    onFavoriteToggle={toggleFavorite}
                    colorScheme="green"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
