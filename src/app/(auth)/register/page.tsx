"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Site {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    domain_id: "",
    password: "",
    confirm_password: "",
    site_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then(setSites)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          domain_id: form.domain_id || undefined,
          password: form.password,
          site_id: form.site_id || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      // Redirect to login with success message
      router.push("/login?registered=1");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full mb-3 shadow-lg">
            <span className="text-2xl font-bold text-blue-800">K</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Karyadwar</h1>
          <p className="text-blue-200 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                className="input-field"
                value={form.name}
                onChange={set("name")}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="label">Email Address *</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={set("email")}
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="label">
                Domain ID{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                className="input-field"
                value={form.domain_id}
                onChange={set("domain_id")}
                placeholder="e.g. jsmith"
              />
            </div>

            <div>
              <label className="label">Default Site</label>
              <select
                className="input-field"
                value={form.site_id}
                onChange={set("site_id")}
              >
                <option value="">— Select your site —</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Password *</label>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={set("password")}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div>
              <label className="label">Confirm Password *</label>
              <input
                type="password"
                className="input-field"
                value={form.confirm_password}
                onChange={set("confirm_password")}
                placeholder="Repeat your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">
          &copy; {new Date().getFullYear()} Manufacturing Division. All rights reserved.
        </p>
      </div>
    </div>
  );
}
