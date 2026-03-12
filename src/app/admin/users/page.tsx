"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface User {
  id: number;
  emp_no: string | null;
  domain_id: string | null;
  nick_name: string | null;
  email: string;
  default_site: number | null;
  login_method: string;
  role: string;
  site: { name: string } | null;
  created_at: string;
}

interface Site {
  id: number;
  name: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    emp_no: "", domain_id: "", nick_name: "", email: "",
    default_site: "", login_method: "EMAIL", role: "USER", password: "",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [userRes, siteRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/sites"),
    ]);
    setUsers(await userRes.json());
    setSites(await siteRes.json());
    setLoading(false);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({
      emp_no: user.emp_no || "", domain_id: user.domain_id || "",
      nick_name: user.nick_name || "", email: user.email,
      default_site: user.default_site?.toString() || "",
      login_method: user.login_method, role: user.role, password: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      default_site: form.default_site ? parseInt(form.default_site) : null,
      password: form.password || undefined,
    };

    const res = editing
      ? await fetch(`/api/admin/users/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      : await fetch("/api/admin/users", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

    if (res.ok) {
      setShowForm(false); setEditing(null); setForm(emptyForm); fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchData();
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-700",
    SITE_ADMIN: "bg-orange-100 text-orange-700",
    USER: "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="btn-primary text-sm">
          + New User
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Edit User" : "New User"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email *</label>
                <input type="email" className="input-field" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label">Display Name</label>
                <input className="input-field" value={form.nick_name}
                  onChange={(e) => setForm({ ...form, nick_name: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Employee No.</label>
                <input className="input-field" value={form.emp_no}
                  onChange={(e) => setForm({ ...form, emp_no: e.target.value })} />
              </div>
              <div>
                <label className="label">Domain ID</label>
                <input className="input-field" value={form.domain_id}
                  onChange={(e) => setForm({ ...form, domain_id: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Default Site</label>
                <select className="input-field" value={form.default_site}
                  onChange={(e) => setForm({ ...form, default_site: e.target.value })}>
                  <option value="">No site</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input-field" value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="USER">User</option>
                  <option value="SITE_ADMIN">Site Admin</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label className="label">Login Method</label>
                <select className="input-field" value={form.login_method}
                  onChange={(e) => setForm({ ...form, login_method: e.target.value })}>
                  <option value="EMAIL">Email</option>
                  <option value="DOMAIN">Domain ID</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">{editing ? "New Password (leave blank to keep)" : "Password *"}</label>
              <input type="password" className="input-field" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editing} />
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
                <th className="text-left px-4 py-3 text-gray-600 font-medium">User</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Emp No.</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Site</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Login</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{user.nick_name || user.email}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.emp_no || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{user.site?.name || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] || "bg-gray-100 text-gray-500"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{user.login_method}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(user)} className="text-blue-600 text-xs font-medium hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 text-xs font-medium hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-10 text-gray-400">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}
