'use client'

import { useState, useEffect } from 'react'

interface EmergencyNumber {
  id: string
  name: string
  landlineNo?: string | null
  mobileNo?: string | null
  otherNo?: string | null
  siteId: string
  sortOrder: number
  site: { name: string; code: string }
}

interface Site {
  id: string
  name: string
  code: string
}

const EMPTY_FORM = {
  name: '',
  landlineNo: '',
  mobileNo: '',
  otherNo: '',
  siteId: '',
  sortOrder: 0,
}

export default function AdminEmergencyNumbersPage() {
  const [numbers, setNumbers] = useState<EmergencyNumber[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [siteFilter, setSiteFilter] = useState('')

  const fetchData = () => {
    Promise.all([
      fetch('/api/emergency-numbers').then((r) => r.json()).catch(() => []),
      fetch('/api/sites').then((r) => r.json()).catch(() => []),
    ]).then(([nums, siteData]) => {
      if (Array.isArray(nums)) setNumbers(nums)
      if (Array.isArray(siteData)) setSites(siteData)
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
      landlineNo: form.landlineNo || null,
      mobileNo: form.mobileNo || null,
      otherNo: form.otherNo || null,
      ...(editId ? { id: editId } : {}),
    }

    const res = await fetch('/api/emergency-numbers', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setMessage(editId ? 'Updated!' : 'Created!')
      setForm({ ...EMPTY_FORM, siteId: sites[0]?.id || '' })
      setEditId(null)
      setShowForm(false)
      fetchData()
    } else {
      setMessage('Error saving.')
    }
    setSaving(false)
  }

  const handleEdit = (num: EmergencyNumber) => {
    setForm({
      name: num.name,
      landlineNo: num.landlineNo || '',
      mobileNo: num.mobileNo || '',
      otherNo: num.otherNo || '',
      siteId: num.siteId,
      sortOrder: num.sortOrder,
    })
    setEditId(num.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this emergency number?')) return
    await fetch(`/api/emergency-numbers?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const filtered = numbers.filter((n) => !siteFilter || n.siteId === siteFilter)

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Emergency Numbers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{numbers.length} contacts across {sites.length} sites</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY_FORM, siteId: sites[0]?.id || '' }) }}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">{message}</div>}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Contact' : 'Add Emergency Contact'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Department / Service *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Site *</label>
              <select required value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select site...</option>
                {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Landline No.</label>
              <input value={form.landlineNo} onChange={(e) => setForm({ ...form, landlineNo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Mobile No.</label>
              <input value={form.mobileNo} onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Other No.</label>
              <input value={form.otherNo} onChange={(e) => setForm({ ...form, otherNo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 text-sm bg-red-700 hover:bg-red-800 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
          <option value="">All Sites ({numbers.length})</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.name} ({numbers.filter((n) => n.siteId === s.id).length})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 h-48 animate-pulse" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50 border-b border-red-100">
                  <th className="text-left text-xs font-semibold text-red-800 uppercase px-4 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-red-800 uppercase px-4 py-3 hidden md:table-cell">Site</th>
                  <th className="text-left text-xs font-semibold text-red-800 uppercase px-4 py-3">Landline</th>
                  <th className="text-left text-xs font-semibold text-red-800 uppercase px-4 py-3 hidden sm:table-cell">Mobile</th>
                  <th className="text-right text-xs font-semibold text-red-800 uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((num) => (
                  <tr key={num.id} className="hover:bg-red-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{num.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{num.site?.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-red-700">{num.landlineNo || '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-red-700 hidden sm:table-cell">{num.mobileNo || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEdit(num)} className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                        <button onClick={() => handleDelete(num.id)} className="text-xs px-3 py-1.5 border border-red-200 rounded hover:bg-red-50 text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">No records found.</div>}
          </div>
        </div>
      )}
    </div>
  )
}
