'use client'

import { useEffect, useState } from 'react'

interface NewsTickerProps {
  items?: string[]
}

const DEFAULT_ITEMS = [
  'Safety First: Wear PPE at all times in designated areas',
  'SAP Upgrade scheduled for 20th March 2026 — Plan accordingly',
  'Annual Performance Appraisal cycle now open in SuccessFactors until 31st March',
  'Long Service Awards ceremony on 25th March at Jamnagar site',
  'ISO 45001 Recertification audit at Dahej site on 18th March',
  'New canteen menu with healthier options launching 1st April across all sites',
]

export default function NewsTicker({ items }: NewsTickerProps) {
  const [tickerItems, setTickerItems] = useState<string[]>(items || DEFAULT_ITEMS)

  useEffect(() => {
    if (!items) {
      fetch('/api/ticker')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setTickerItems(data)
        })
        .catch(() => {})
    }
  }, [items])

  const text = tickerItems.join('   |   ')

  return (
    <div className="bg-blue-900 text-blue-100 text-xs py-1.5 overflow-hidden flex items-center">
      <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 mr-3 rounded-sm shrink-0 uppercase tracking-wide">
        News
      </span>
      <div className="overflow-hidden flex-1">
        <div
          key={text}
          className="whitespace-nowrap inline-block"
          style={{ animation: 'ticker-scroll 60s linear infinite' }}
        >
          {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
    </div>
  )
}
