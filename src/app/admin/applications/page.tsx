"use client";

import { useState, useEffect } from "react";

interface Application {
  id: number;
  name: string;
  url: string;
  category: string;
  letter_index: string;
  description: string | null;
  contact_func: string | null;
  contact_tech: string | null;
  is_active: boolean;
  sort_order: number;
  site_id: number | null;
  site: { name: string } | null;
}

interface Site {
  id: number;
  name: string;
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const emptyForm = {
    name: "", url: "", category: "enterprise", letter_index: "A",
    site_id: "", description: "", contact_func: "", contact_tech: "",
    is_active: true, sort_order: "0",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [appRes, siteRes] = await Promise.all([
      fetch("/api/applications"),
      fetch("/api/sites"),
    ]);
    setApps(await appRes.json());
    setSites(await siteRes.json());
    setLoading(false);
  };

  const openEdit = (app: Application) => {
    setEditing(app);
    setForm({
      name: app.name, url: app.url, category: app.category,
      letter_index: app.letter_index, site_id: app.site_id?.toString() || "",
      description: app.description || "", contact_func: app.contact_func || "",
      contact_tech: app.contact_tech || "", is_active: app.is_active,
      sort_order: app.sort_order.toString(),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      site_id: form.site_id ? parseInt(form.site_id) : null,
      sort_order: parseInt(form.sort_order),
    };

    const res = editing
      ? await fetch(`/api/applications/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : await fetch("/api/applications", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

    if (res.ok) {
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this application?")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    fetchData();
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="btn-primary text-sm"
        >
          + New Application
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["all", "enterprise", "local"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Edit Application" : "New Application"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input className="input-field" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">URL</label>
                <input className="input-field" value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Category</label>
                <select className="input-field" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="enterprise">Enterprise</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div>
                <label className="label">Letter Index (A-Z)</label>
                <input className="input-field" value={form.letter_index} maxLength={1}
                  onChange={(e) => setForm({ ...form, letter_index: e.target.value.toUpperCase() })} required />
              </div>
              <div>
                <label className="label">Sort Order</label>
                <input type="number" className="input-field" value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Site (for local apps)</label>
                <select className="input-field" value={form.site_id}
                  onChange={(e) => setForm({ ...form, site_id: e.target.value })}>
                  <option value="">All Sites / N/A</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <input className="input-field" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Functional Contact</label>
                <input className="input-field" value={form.contact_func}
                  onChange={(e) => setForm({ ...form, contact_func: e.target.value })} />
              </div>
              <div>
                <label className="label">Technical Contact</label>
                <input className="input-field" value={form.contact_tech}
                  onChange={(e) => setForm({ ...form, contact_tech: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="app_active" checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              <label htmlFor="app_active" className="text-sm text-gray-700">Active</label>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Site</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{app.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{app.url}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      app.category === "enterprise"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {app.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{app.site?.name || "All"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      app.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {app.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(app)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">No applications found.</div>
          )}
        </div>
      )}
    </div>
  );
}
