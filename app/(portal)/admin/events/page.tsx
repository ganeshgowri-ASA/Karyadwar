'use client'

import { useState, useEffect } from 'react'

interface EmployeeEvent {
  id: string
  empNo: string
  name: string
  eventType: 'BIRTHDAY' | 'LONG_SERVICE'
  eventDate: string
  department?: string | null
  email?: string | null
}

const EMPTY_FORM = {
  empNo: '',
  name: '',
  eventType: 'BIRTHDAY' as 'BIRTHDAY' | 'LONG_SERVICE',
  eventDate: '',
  department: '',
  email: '',
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EmployeeEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')

  const fetchEvents = () => {
    fetch('/api/events?limit=100')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchEvents() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      eventDate: new Date(form.eventDate).toISOString(),
      department: form.department || null,
      email: form.email || null,
      ...(editId ? { id: editId } : {}),
    }
    const res = await fetch('/api/events', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setMessage(editId ? 'Updated!' : 'Event created!')
      setForm(EMPTY_FORM)
      setEditId(null)
      setShowForm(false)
      fetchEvents()
    } else setMessage('Error saving.')
    setSaving(false)
  }

  const handleEdit = (ev: EmployeeEvent) => {
    setForm({
      empNo: ev.empNo,
      name: ev.name,
      eventType: ev.eventType,
      eventDate: ev.eventDate.split('T')[0],
      department: ev.department || '',
      email: ev.email || '',
    })
    setEditId(ev.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    await fetch(`/api/events?id=${id}`, { method: 'DELETE' })
    fetchEvents()
  }

  const filtered = events.filter((e) => typeFilter === 'ALL' || e.eventType === typeFilter)

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Employee Events</h1>
          <p className="text-gray-500 text-sm mt-0.5">{events.length} events</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM) }}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">{message}</div>}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Event' : 'Add Employee Event'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Employee No *</label>
              <input required value={form.empNo} onChange={(e) => setForm({ ...form, empNo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Event Type *</label>
              <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value as any })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="BIRTHDAY">Birthday</option>
                <option value="LONG_SERVICE">Long Service Award</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Event Date *</label>
              <input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 text-sm bg-pink-600 hover:bg-pink-700 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-1 mb-4">
        {['ALL', 'BIRTHDAY', 'LONG_SERVICE'].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${typeFilter === t ? 'bg-pink-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            {t === 'ALL' ? 'All' : t === 'BIRTHDAY' ? '🎂 Birthdays' : '🏆 Long Service'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-xl border h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="text-3xl mb-3">🎂</p>
          <p>No events. Add employee birthdays and long service awards.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-pink-50 border-b border-pink-100">
                <th className="text-left text-xs font-semibold text-pink-800 uppercase px-4 py-3">Employee</th>
                <th className="text-left text-xs font-semibold text-pink-800 uppercase px-4 py-3 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-pink-800 uppercase px-4 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-pink-800 uppercase px-4 py-3 hidden lg:table-cell">Department</th>
                <th className="text-right text-xs font-semibold text-pink-800 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ev) => (
                <tr key={ev.id} className="hover:bg-pink-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${ev.eventType === 'BIRTHDAY' ? '' : ''}`}>
                        {ev.eventType === 'BIRTHDAY' ? '🎂' : '🏆'}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{ev.name}</p>
                        <p className="text-xs text-gray-500">{ev.empNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.eventType === 'BIRTHDAY' ? 'bg-pink-50 text-pink-700' : 'bg-amber-50 text-amber-700'}`}>
                      {ev.eventType === 'BIRTHDAY' ? 'Birthday' : 'Long Service'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(ev.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{ev.department || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(ev)} className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                      <button onClick={() => handleDelete(ev.id)} className="text-xs px-3 py-1.5 border border-red-200 rounded hover:bg-red-50 text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
