'use client'

import { useState, useEffect } from 'react'

interface Application {
  id: string
  name: string
  description?: string | null
  url: string
  letterIndex: string
  category: 'ENTERPRISE' | 'LOCAL'
  contactFunc?: string | null
  contactTech?: string | null
  isActive: boolean
  sortOrder: number
}

const EMPTY_FORM = {
  name: '',
  url: '',
  letterIndex: '',
  category: 'ENTERPRISE' as 'ENTERPRISE' | 'LOCAL',
  description: '',
  contactFunc: '',
  contactTech: '',
  isActive: true,
  sortOrder: 0,
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [message, setMessage] = useState('')

  const fetchApps = () => {
    fetch('/api/applications?category=')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setApps(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchApps() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      ...form,
      letterIndex: form.letterIndex.toUpperCase().slice(0, 1) || form.name[0].toUpperCase(),
      siteId: null,
      ...(editId ? { id: editId } : {}),
    }

    const res = await fetch('/api/applications', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setMessage(editId ? 'Application updated!' : 'Application created!')
      setForm(EMPTY_FORM)
      setEditId(null)
      setShowForm(false)
      fetchApps()
    } else {
      setMessage('Error saving application.')
    }
    setSaving(false)
  }

  const handleEdit = (app: Application) => {
    setForm({
      name: app.name,
      url: app.url,
      letterIndex: app.letterIndex,
      category: app.category,
      description: app.description || '',
      contactFunc: app.contactFunc || '',
      contactTech: app.contactTech || '',
      isActive: app.isActive,
      sortOrder: app.sortOrder,
    })
    setEditId(app.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/applications?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage(`"${name}" deleted.`)
      fetchApps()
    }
  }

  const filtered = apps.filter((a) => {
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
          <p className="text-gray-500 text-sm mt-0.5">{apps.length} total applications</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM) }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {message && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Application' : 'Add New Application'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">URL *</label>
              <input required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ENTERPRISE">Enterprise</option>
                <option value="LOCAL">Local</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Letter Index (A-Z)</label>
              <input maxLength={1} value={form.letterIndex} onChange={(e) => setForm({ ...form, letterIndex: e.target.value.toUpperCase() })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Auto from name if blank" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-700 block mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Functional Contact</label>
              <input value={form.contactFunc} onChange={(e) => setForm({ ...form, contactFunc: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Technical Contact</label>
              <input value={form.contactTech} onChange={(e) => setForm({ ...form, contactTech: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM) }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 text-sm bg-blue-800 hover:bg-blue-900 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..."
          className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-1">
          {['ALL', 'ENTERPRISE', 'LOCAL'].map((cat) => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors ${categoryFilter === cat ? 'bg-blue-800 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {cat === 'ALL' ? 'All' : cat === 'ENTERPRISE' ? 'Enterprise' : 'Local'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 h-48 animate-pulse" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">URL</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center shrink-0 ${
                          app.category === 'ENTERPRISE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>{app.letterIndex}</span>
                        <span className="text-sm font-medium text-gray-800">{app.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        app.category === 'ENTERPRISE' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                      }`}>{app.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-48 block">
                        {app.url}
                      </a>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${app.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {app.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEdit(app)}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(app.id, app.name)}
                          className="text-xs px-3 py-1.5 border border-red-200 rounded hover:bg-red-50 text-red-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-sm">No applications found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
