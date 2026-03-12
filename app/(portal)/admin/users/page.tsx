'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  empNo: string
  domainId: string
  nickName?: string | null
  email: string
  role: string
  defaultSiteId?: string | null
  loginMethod: string
  createdAt: string
  defaultSite?: { name: string } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, role: newRole }),
    })
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u))
      setMessage('User role updated!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchesSearch = !search ||
      u.empNo.toLowerCase().includes(search.toLowerCase()) ||
      u.domainId.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.nickName || '').toLowerCase().includes(search.toLowerCase())
    return matchesRole && matchesSearch
  })

  const roleColor: Record<string, string> = {
    user: 'bg-gray-100 text-gray-700',
    admin: 'bg-amber-100 text-amber-700',
    superadmin: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 text-sm mt-0.5">{users.length} registered users</p>
      </div>

      {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg">{message}</div>}

      <div className="flex gap-3 mb-5 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, emp no, email..."
          className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <div className="flex gap-1">
          {['ALL', 'user', 'admin', 'superadmin'].map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors ${roleFilter === role ? 'bg-indigo-700 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {role === 'ALL' ? 'All' : role}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 h-48 animate-pulse" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-50 border-b border-indigo-100">
                  <th className="text-left text-xs font-semibold text-indigo-800 uppercase px-4 py-3">Employee</th>
                  <th className="text-left text-xs font-semibold text-indigo-800 uppercase px-4 py-3 hidden md:table-cell">Domain ID</th>
                  <th className="text-left text-xs font-semibold text-indigo-800 uppercase px-4 py-3 hidden lg:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-indigo-800 uppercase px-4 py-3 hidden md:table-cell">Site</th>
                  <th className="text-left text-xs font-semibold text-indigo-800 uppercase px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-indigo-800 uppercase px-4 py-3 hidden xl:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                          {(user.nickName || user.domainId)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{user.nickName || user.domainId}</p>
                          <p className="text-xs text-gray-500">{user.empNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 hidden md:table-cell font-mono">{user.domainId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{user.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600">{user.defaultSite?.name || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 focus:ring-1 focus:ring-indigo-400 cursor-pointer ${roleColor[user.role] || 'bg-gray-100 text-gray-700'}`}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden xl:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">No users found.</div>}
          </div>
        </div>
      )}
    </div>
  )
}
