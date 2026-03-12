"use client";

import { useState, useEffect } from "react";

interface EmergencyNumber {
  id: number;
  name: string;
  landline_no: string | null;
  mobile_no: string | null;
  other_no: string | null;
  site_id: number;
  sort_order: number;
  site: { name: string };
}

interface Site {
  id: number;
  name: string;
}

export default function AdminEmergencyNumbersPage() {
  const [numbers, setNumbers] = useState<EmergencyNumber[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EmergencyNumber | null>(null);
  const [loading, setLoading] = useState(true);

  const emptyForm = { name: "", landline_no: "", mobile_no: "", other_no: "", site_id: "", sort_order: "0" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [numRes, siteRes] = await Promise.all([
      fetch("/api/emergency-numbers"),
      fetch("/api/sites"),
    ]);
    setNumbers(await numRes.json());
    setSites(await siteRes.json());
    setLoading(false);
  };

  const openEdit = (num: EmergencyNumber) => {
    setEditing(num);
    setForm({
      name: num.name, landline_no: num.landline_no || "",
      mobile_no: num.mobile_no || "", other_no: num.other_no || "",
      site_id: num.site_id.toString(), sort_order: num.sort_order.toString(),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      site_id: parseInt(form.site_id),
      sort_order: parseInt(form.sort_order),
      landline_no: form.landline_no || null,
      mobile_no: form.mobile_no || null,
      other_no: form.other_no || null,
    };

    const res = editing
      ? await fetch(`/api/emergency-numbers/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : await fetch("/api/emergency-numbers", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

    if (res.ok) {
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this emergency number?")) return;
    await fetch(`/api/emergency-numbers/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Emergency Numbers</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="btn-primary text-sm">
          + Add Number
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Number" : "Add Number"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Name / Department</label>
                <input className="input-field" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Landline</label>
                <input className="input-field" value={form.landline_no}
                  onChange={(e) => setForm({ ...form, landline_no: e.target.value })} />
              </div>
              <div>
                <label className="label">Mobile</label>
                <input className="input-field" value={form.mobile_no}
                  onChange={(e) => setForm({ ...form, mobile_no: e.target.value })} />
              </div>
              <div>
                <label className="label">Other (extension etc.)</label>
                <input className="input-field" value={form.other_no}
                  onChange={(e) => setForm({ ...form, other_no: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Sort Order</label>
              <input type="number" className="input-field w-24" value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
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
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Site</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Landline</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Mobile</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Other</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {numbers.map((num) => (
                <tr key={num.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{num.name}</td>
                  <td className="px-4 py-3 text-gray-600">{num.site.name}</td>
                  <td className="px-4 py-3 text-gray-600">{num.landline_no || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{num.mobile_no || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{num.other_no || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(num)} className="text-blue-600 text-xs font-medium hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(num.id)} className="text-red-600 text-xs font-medium hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {numbers.length === 0 && (
            <div className="text-center py-10 text-gray-400">No emergency numbers yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
