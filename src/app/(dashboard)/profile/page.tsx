"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/utils";

interface Site {
  id: number;
  name: string;
}

interface Profile {
  id: number;
  emp_no: string | null;
  domain_id: string | null;
  nick_name: string | null;
  email: string;
  default_site: number | null;
  login_method: string;
  role: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nick_name: "",
    default_site: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, sitesRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/sites"),
      ]);
      const profileData = await profileRes.json();
      const sitesData = await sitesRes.json();
      setProfile(profileData);
      setSites(sitesData);
      setForm((prev) => ({
        ...prev,
        nick_name: profileData.nick_name || "",
        default_site: profileData.default_site?.toString() || "",
      }));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.new_password && form.new_password !== form.confirm_password) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nick_name: form.nick_name,
          default_site: form.default_site ? parseInt(form.default_site) : null,
          current_password: form.current_password || undefined,
          new_password: form.new_password || undefined,
        }),
      });

      if (res.ok) {
        setSuccess("Profile updated successfully.");
        setForm((prev) => ({
          ...prev,
          current_password: "",
          new_password: "",
          confirm_password: "",
        }));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="text-center py-20 text-gray-400">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {getInitials(profile.nick_name || profile.email)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {profile.nick_name || profile.email}
            </h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                profile.role === "ADMIN"
                  ? "bg-red-100 text-red-700"
                  : profile.role === "SITE_ADMIN"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {profile.role}
              </span>
              {profile.emp_no && (
                <span className="text-xs text-gray-400">Emp: {profile.emp_no}</span>
              )}
            </div>
          </div>
        </div>

        {/* Read-only info */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
          <div>
            <p className="text-xs text-gray-500">Login Method</p>
            <p className="text-sm font-medium text-gray-700">{profile.login_method}</p>
          </div>
          {profile.domain_id && (
            <div>
              <p className="text-xs text-gray-500">Domain ID</p>
              <p className="text-sm font-medium text-gray-700">{profile.domain_id}</p>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Display Name</label>
            <input
              className="input-field"
              value={form.nick_name}
              onChange={(e) => setForm({ ...form, nick_name: e.target.value })}
              placeholder="Your preferred name"
            />
          </div>

          <div>
            <label className="label">Default Site</label>
            <select
              className="input-field"
              value={form.default_site}
              onChange={(e) => setForm({ ...form, default_site: e.target.value })}
            >
              <option value="">No default site</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <hr className="border-gray-200" />
          <p className="text-sm font-medium text-gray-700">Change Password</p>

          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              className="input-field"
              value={form.current_password}
              onChange={(e) => setForm({ ...form, current_password: e.target.value })}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                className="input-field"
                value={form.new_password}
                onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                className="input-field"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
