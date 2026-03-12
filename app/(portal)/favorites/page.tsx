'use client'

import { useState, useEffect } from 'react'
import AppCard from '@/components/AppCard'
import Link from 'next/link'

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

interface Favorite {
  id: string
  applicationId: string | null
  application: Application | null
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setFavorites(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleFavorite = async (appId: string) => {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.action === 'removed') {
        setFavorites((prev) => prev.filter((f) => f.applicationId !== appId))
      }
    }
  }

  const favoriteApps = favorites.filter((f) => f.application).map((f) => f.application!)
  const favoriteIds = new Set(favorites.map((f) => f.applicationId).filter(Boolean) as string[])

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Your starred applications for quick access
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-44 animate-pulse" />
          ))}
        </div>
      ) : favoriteApps.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">★</p>
          <p className="text-xl font-semibold text-gray-700">No favorites yet</p>
          <p className="text-sm mt-2 mb-6">Star any application to add it here for quick access</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/enterprise-apps"
              className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Browse Enterprise Apps
            </Link>
            <Link
              href="/local-apps"
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Browse Local Apps
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-amber-500 text-xl">★</span>
            <span className="text-sm text-gray-600">{favoriteApps.length} favorite{favoriteApps.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favoriteApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                isFavorite={favoriteIds.has(app.id)}
                onFavoriteToggle={toggleFavorite}
                colorScheme={app.category === 'ENTERPRISE' ? 'blue' : 'green'}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
