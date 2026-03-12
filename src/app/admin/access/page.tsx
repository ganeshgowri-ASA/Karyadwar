"use client";

import { useState, useEffect } from "react";

interface AdminAccess {
  id: number;
  user_id: number;
  permission_level: string;
  site_id: number | null;
  user: { email: string; nick_name: string | null; emp_no: string | null };
  site: { name: string; code: string } | null;
}

interface User {
  id: number;
  email: string;
  nick_name: string | null;
}

interface Site {
  id: number;
  name: string;
}

export default function AdminAccessPage() {
  const [accessList, setAccessList] = useState<AdminAccess[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const emptyForm = { user_id: "", permission_level: "CONTENT_MANAGER", site_id: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [accessRes, userRes, siteRes] = await Promise.all([
      fetch("/api/admin/access"),
      fetch("/api/admin/users"),
      fetch("/api/sites"),
    ]);
    setAccessList(await accessRes.json());
    setUsers(await userRes.json());
    setSites(await siteRes.json());
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: parseInt(form.user_id),
        permission_level: form.permission_level,
        site_id: form.site_id ? parseInt(form.site_id) : null,
      }),
    });
    if (res.ok) {
      setShowForm(false); setForm(emptyForm); fetchData();
    }
  };

  const levelColors: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-700",
    SITE_ADMIN: "bg-orange-100 text-orange-700",
    CONTENT_MANAGER: "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Access Management</h1>
        <button onClick={() => { setShowForm(true); setForm(emptyForm); }}
          className="btn-primary text-sm">
          + Grant Access
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Grant Admin Access</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">User</label>
                <select className="input-field" value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })} required>
                  <option value="">Select user...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nick_name || u.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Permission Level</label>
                <select className="input-field" value={form.permission_level}
                  onChange={(e) => setForm({ ...form, permission_level: e.target.value })}>
                  <option value="CONTENT_MANAGER">Content Manager</option>
                  <option value="SITE_ADMIN">Site Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="label">Site (leave empty for all)</label>
                <select className="input-field" value={form.site_id}
                  onChange={(e) => setForm({ ...form, site_id: e.target.value })}>
                  <option value="">All Sites</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">Grant Access</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
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
                <th className="text-left px-4 py-3 text-gray-600 font-medium">User</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Permission Level</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Site Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accessList.map((access) => (
                <tr key={access.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {access.user.nick_name || access.user.email}
                    </div>
                    <div className="text-xs text-gray-500">{access.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[access.permission_level] || "bg-gray-100 text-gray-500"}`}>
                      {access.permission_level.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {access.site ? `${access.site.name} (${access.site.code})` : "All Sites"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {accessList.length === 0 && (
            <div className="text-center py-10 text-gray-400">No admin access records.</div>
          )}
        </div>
      )}
    </div>
  );
}
