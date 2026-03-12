"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: number;
  title: string;
  content: string;
  site_id: number | null;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  site: { name: string } | null;
}

interface Site {
  id: number;
  name: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    title: "",
    content: "",
    site_id: "",
    is_active: true,
    expires_at: "",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [annRes, siteRes] = await Promise.all([
      fetch("/api/announcements?all=true"),
      fetch("/api/sites"),
    ]);
    setAnnouncements(await annRes.json());
    setSites(await siteRes.json());
    setLoading(false);
  };

  const openEdit = (ann: Announcement) => {
    setEditing(ann);
    setForm({
      title: ann.title,
      content: ann.content,
      site_id: ann.site_id?.toString() || "",
      is_active: ann.is_active,
      expires_at: ann.expires_at ? ann.expires_at.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      site_id: form.site_id ? parseInt(form.site_id) : null,
      expires_at: form.expires_at || null,
    };

    const res = editing
      ? await fetch(`/api/announcements/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="btn-primary text-sm"
        >
          + New Announcement
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit Announcement" : "New Announcement"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Content</label>
              <textarea
                className="input-field h-32 resize-none"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Site (leave empty for all sites)</label>
                <select
                  className="input-field"
                  value={form.site_id}
                  onChange={(e) => setForm({ ...form, site_id: e.target.value })}
                >
                  <option value="">All Sites</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Expires At</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">Save</button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Site</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Created</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {announcements.map((ann) => (
                <tr key={ann.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{ann.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{ann.content}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {ann.site?.name || "All Sites"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ann.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {ann.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(ann.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(ann)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {announcements.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No announcements yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
