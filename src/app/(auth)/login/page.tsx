"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"EMAIL" | "DOMAIN">("EMAIL");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        loginMethod,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold text-blue-800">K</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Karyadwar</h1>
          <p className="text-blue-200 mt-1">Manufacturing Intranet Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign In</h2>

          {/* Login Method Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1 mb-6 bg-gray-50">
            <button
              type="button"
              onClick={() => setLoginMethod("EMAIL")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                loginMethod === "EMAIL"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("DOMAIN")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                loginMethod === "DOMAIN"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Domain ID Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                {loginMethod === "EMAIL" ? "Email Address" : "Domain ID"}
              </label>
              <input
                type={loginMethod === "EMAIL" ? "email" : "text"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  loginMethod === "EMAIL"
                    ? "Enter your email"
                    : "Enter your domain ID"
                }
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field"
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
              className="w-full btn-primary py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            For IT support, contact helpdesk@company.com
          </p>
        </div>

        <p className="text-center text-blue-200 text-sm mt-4">
          &copy; {new Date().getFullYear()} Manufacturing Division. All rights reserved.
        </p>
      </div>
    </div>
  );
}
