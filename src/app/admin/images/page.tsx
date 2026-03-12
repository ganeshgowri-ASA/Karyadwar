"use client";

import { useState, useEffect } from "react";

interface CarouselImage {
  id: number;
  image_url: string;
  link_url: string | null;
  site_id: number;
  sort_order: number;
  is_active: boolean;
  site: { name: string };
}

interface Site {
  id: number;
  name: string;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CarouselImage | null>(null);
  const [loading, setLoading] = useState(true);

  const emptyForm = { image_url: "", link_url: "", site_id: "", sort_order: "0", is_active: true };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [imgRes, siteRes] = await Promise.all([
      fetch("/api/carousel"),
      fetch("/api/sites"),
    ]);
    setImages(await imgRes.json());
    setSites(await siteRes.json());
    setLoading(false);
  };

  const openEdit = (img: CarouselImage) => {
    setEditing(img);
    setForm({
      image_url: img.image_url, link_url: img.link_url || "",
      site_id: img.site_id.toString(), sort_order: img.sort_order.toString(),
      is_active: img.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      site_id: parseInt(form.site_id),
      sort_order: parseInt(form.sort_order),
      link_url: form.link_url || null,
    };

    const res = editing
      ? await fetch(`/api/carousel/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : await fetch("/api/carousel", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

    if (res.ok) {
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/carousel/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Carousel Images</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="btn-primary text-sm">
          + Add Image
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Image" : "Add Image"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Image URL</label>
              <input className="input-field" value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })} required
                placeholder="https://example.com/image.jpg" />
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="mt-2 h-24 w-auto rounded object-cover" />
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Link URL (optional)</label>
                <input className="input-field" value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
              </div>
              <div>
                <label className="label">Site</label>
                <select className="input-field" value={form.site_id}
                  onChange={(e) => setForm({ ...form, site_id: e.target.value })} required>
                  <option value="">Select site...</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Sort Order</label>
                <input type="number" className="input-field" value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="img_active" checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              <label htmlFor="img_active" className="text-sm text-gray-700">Active</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">Save</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img src={img.image_url} alt="Carousel" className="w-full h-40 object-cover" />
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{img.site.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    img.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {img.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Order: {img.sort_order}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(img)} className="text-blue-600 text-xs hover:underline">Edit</button>
                  <button onClick={() => handleDelete(img.id)} className="text-red-600 text-xs hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-400">No carousel images yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
