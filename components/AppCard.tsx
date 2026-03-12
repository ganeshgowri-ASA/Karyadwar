'use client'

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

interface AppCardProps {
  app: Application
  isFavorite?: boolean
  onFavoriteToggle?: (id: string) => void
  colorScheme?: 'blue' | 'green'
}

export default function AppCard({ app, isFavorite = false, onFavoriteToggle, colorScheme = 'blue' }: AppCardProps) {
  const bg = colorScheme === 'blue'
    ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-800 group-hover:text-white'
    : 'bg-green-100 text-green-800 group-hover:bg-green-700 group-hover:text-white'

  const handleLaunch = () => {
    if (app.url.startsWith('http')) {
      window.open(app.url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = app.url
    }
  }

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-4 flex flex-col">
      {/* Favorite star */}
      {onFavoriteToggle && (
        <button
          onClick={(e) => { e.stopPropagation(); onFavoriteToggle(app.id) }}
          className={`absolute top-2.5 right-2.5 text-lg transition-colors ${
            isFavorite ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ★
        </button>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl mb-3 transition-colors duration-200 ${bg}`}>
        {app.letterIndex}
      </div>

      {/* Name & description */}
      <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1">{app.name}</h3>
      {app.description && (
        <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-2">{app.description}</p>
      )}

      {/* Contacts */}
      {(app.contactFunc || app.contactTech) && (
        <div className="mt-2 space-y-0.5">
          {app.contactFunc && (
            <p className="text-[10px] text-gray-400">
              <span className="font-medium">Func:</span> {app.contactFunc}
            </p>
          )}
          {app.contactTech && (
            <p className="text-[10px] text-gray-400">
              <span className="font-medium">Tech:</span> {app.contactTech}
            </p>
          )}
        </div>
      )}

      {/* Launch button */}
      <button
        onClick={handleLaunch}
        className="mt-3 w-full text-xs font-medium bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 py-1.5 rounded-md transition-colors duration-200"
      >
        Launch →
      </button>
    </div>
  )
}
