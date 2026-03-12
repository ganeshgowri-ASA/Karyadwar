'use client'

import { useState, useEffect } from 'react'

interface CarouselImage {
  id: string
  imageUrl: string
  linkUrl?: string | null
  siteId: string
  sortOrder: number
  isActive: boolean
  site?: { name: string }
}

interface Site { id: string; name: string; code: string }

const EMPTY_FORM = { imageUrl: '', linkUrl: '', siteId: '', sortOrder: 0, isActive: true }

export default function AdminCarouselPage() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = () => {
    Promise.all([
      fetch('/api/carousel').then((r) => r.json()).catch(() => []),
      fetch('/api/sites').then((r) => r.json()).catch(() => []),
    ]).then(([imgs, siteData]) => {
      if (Array.isArray(imgs)) setImages(imgs.filter((i: any) => i.siteId))
      if (Array.isArray(siteData)) setSites(siteData)
      setLoading(false)
    })
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, linkUrl: form.linkUrl || null, ...(editId ? { id: editId } : {}) }
    const res = await fetch('/api/carousel', {
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
    } else setMessage('Error saving.')
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this carousel image?')) return
    await fetch(`/api/carousel?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Carousel Images</h1>
          <p className="text-gray-500 text-sm mt-0.5">{images.length} images in database</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...EMPTY_FORM, siteId: sites[0]?.id || '' }) }}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : '+ Add Image'}
        </button>
      </div>

      {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">{message}</div>}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Image' : 'Add Carousel Image'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-700 block mb-1">Image URL *</label>
              <input required value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Link URL (on click)</label>
              <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Site *</label>
              <select required value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Select site...</option>
                {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="px-4 py-2 text-sm bg-purple-700 hover:bg-purple-800 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
          {form.imageUrl && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img src={form.imageUrl} alt="Preview" className="h-32 w-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/600/200' }} />
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-200 h-44 animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="text-3xl mb-3">🖼️</p>
          <p>No carousel images. Add your first one!</p>
          <p className="text-xs mt-1 text-gray-400">Default placeholder images are shown when no images are configured.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative h-36">
                <img src={img.imageUrl} alt="Carousel" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/err/600/200' }} />
                {!img.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-600 truncate">{img.imageUrl}</p>
                {img.site && <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full mt-1 inline-block">{img.site.name}</span>}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setForm({ imageUrl: img.imageUrl, linkUrl: img.linkUrl || '', siteId: img.siteId, sortOrder: img.sortOrder, isActive: img.isActive }); setEditId(img.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className="flex-1 text-xs py-1.5 border border-gray-300 rounded hover:bg-gray-50">Edit</button>
                  <button onClick={() => handleDelete(img.id)}
                    className="flex-1 text-xs py-1.5 border border-red-200 rounded hover:bg-red-50 text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
