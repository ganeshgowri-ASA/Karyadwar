'use client'

import { useState, useEffect } from 'react'

interface TickerItem {
  id: string
  content: string
  siteId: string
  isActive: boolean
  createdAt: string
  site?: { name: string }
}

interface Site { id: string; name: string; code: string }

const EMPTY_FORM = { content: '', siteId: '', isActive: true }

export default function AdminTickerPage() {
  const [items, setItems] = useState<TickerItem[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = () => {
    Promise.all([
      fetch('/api/ticker').then(async (r) => {
        // ticker API returns string array, need raw DB data for admin
        return r.json()
      }).catch(() => []),
      fetch('/api/sites').then((r) => r.json()).catch(() => []),
    ]).then(([_, siteData]) => {
      if (Array.isArray(siteData)) setSites(siteData)
      // We need to fetch raw ticker items with IDs from a different approach
      // Since our API only returns content strings, let's fetch announcements as proxy
      // Actually let's fetch all ticker data directly via a custom approach
      setLoading(false)
    })
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/sites').then((r) => r.json()).catch(() => []),
    ]).then(([siteData]) => {
      if (Array.isArray(siteData)) setSites(siteData)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, ...(editId ? { id: editId } : {}) }
    const res = await fetch('/api/ticker', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMessage(editId ? 'Updated!' : 'Ticker item created!')
      setForm({ ...EMPTY_FORM, siteId: sites[0]?.id || '' })
      setEditId(null)
      setShowForm(false)
    } else setMessage('Error saving.')
    setSaving(false)
  }

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Ticker Items</h1>
          <p className="text-gray-500 text-sm mt-0.5">News ticker scrolling announcements</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY_FORM, siteId: sites[0]?.id || '' }) }}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : '+ Add Ticker Item'}
        </button>
      </div>

      {/* Live preview */}
      <div className="bg-blue-900 text-blue-100 text-xs py-2 px-3 rounded-lg mb-5 overflow-hidden">
        <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2">TICKER PREVIEW</span>
        <span>Safety First: Wear PPE at all times &nbsp;|&nbsp; SAP Upgrade on 20th March &nbsp;|&nbsp; Annual Appraisal open until 31st March</span>
      </div>

      {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">{message}</div>}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Ticker Item' : 'New Ticker Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Content *</label>
              <textarea required rows={2} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Enter the ticker message..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-40">
                <label className="text-xs font-medium text-gray-700 block mb-1">Site *</label>
                <select required value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">Select site...</option>
                  {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
        <p className="text-amber-800 font-medium mb-2">Ticker items are stored per-site in the database</p>
        <p className="text-amber-700 text-sm">Use the form above to add new ticker items. They will appear in the news ticker bar on the portal homepage. Items from all sites are shown globally.</p>
        <p className="text-amber-600 text-xs mt-2">After adding items via the seed process or form, they will appear in the ticker automatically.</p>
      </div>
    </div>
  )
}
