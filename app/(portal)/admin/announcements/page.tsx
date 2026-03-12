'use client'

import { useState, useEffect } from 'react'

interface Announcement {
  id: string
  title: string
  content: string
  isActive: boolean
  expiresAt?: string | null
  createdAt: string
  site: { name: string; code: string }
  siteId: string
}

interface Site {
  id: string
  name: string
  code: string
}

const EMPTY_FORM = {
  title: '',
  content: '',
  siteId: '',
  isActive: true,
  expiresAt: '',
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = () => {
    Promise.all([
      fetch('/api/announcements').then((r) => r.json()).catch(() => []),
      fetch('/api/sites').then((r) => r.json()).catch(() => []),
    ]).then(([anns, siteData]) => {
      if (Array.isArray(anns)) setAnnouncements(anns)
      if (Array.isArray(siteData)) {
        setSites(siteData)
        if (!form.siteId && siteData.length > 0) {
          setForm((f) => ({ ...f, siteId: siteData[0].id }))
        }
      }
      setLoading(false)
    })
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const payload = {
      ...form,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      ...(editId ? { id: editId } : {}),
    }

    const res = await fetch('/api/announcements', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setMessage(editId ? 'Announcement updated!' : 'Announcement created!')
      setForm({ ...EMPTY_FORM, siteId: sites[0]?.id || '' })
      setEditId(null)
      setShowForm(false)
      fetchData()
    } else {
      setMessage('Error saving announcement.')
    }
    setSaving(false)
  }

  const handleEdit = (ann: Announcement) => {
    setForm({
      title: ann.title,
      content: ann.content,
      siteId: ann.siteId,
      isActive: ann.isActive,
      expiresAt: ann.expiresAt ? ann.expiresAt.split('T')[0] : '',
    })
    setEditId(ann.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMessage(`Deleted: ${title}`)
      fetchData()
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Announcements</h1>
          <p className="text-gray-500 text-sm mt-0.5">{announcements.length} announcements</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY_FORM, siteId: sites[0]?.id || '' }) }}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {message && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">{message}</div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Announcement' : 'New Announcement'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Content *</label>
              <textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Site *</label>
                <select required value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
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
                className="px-4 py-2 text-sm bg-green-700 hover:bg-green-800 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-200 h-24 animate-pulse" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="text-3xl mb-3">📢</p>
          <p>No announcements yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-green-200 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-800">{ann.title}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ann.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {ann.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">{ann.site?.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ann.content}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Posted: {new Date(ann.createdAt).toLocaleDateString('en-IN')}
                    {ann.expiresAt && ` · Expires: ${new Date(ann.expiresAt).toLocaleDateString('en-IN')}`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(ann)}
                    className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">Edit</button>
                  <button onClick={() => handleDelete(ann.id, ann.title)}
                    className="text-xs px-3 py-1.5 border border-red-200 rounded hover:bg-red-50 text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
