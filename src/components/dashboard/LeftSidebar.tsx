"use client";

import { useState } from "react";
import Link from "next/link";

interface Application {
  id: number;
  name: string;
  url: string;
  category: string;
  letter_index: string;
  description: string | null;
}

interface Favorite {
  id: number;
  app_id: number | null;
  custom_link_name: string | null;
  custom_link_url: string | null;
  application: Application | null;
}

interface LeftSidebarProps {
  favorites: Favorite[];
  enterpriseApps: Application[];
  localApps: Application[];
  userId: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function LeftSidebar({
  favorites,
  enterpriseApps,
  localApps,
  userId,
}: LeftSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    favorites: true,
    enterprise: false,
    local: false,
  });
  const [enterpriseFilter, setEnterpriseFilter] = useState<string>("");
  const [localFilter, setLocalFilter] = useState<string>("");

  const toggle = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredEnterprise = enterpriseFilter
    ? enterpriseApps.filter(
        (app) =>
          app.letter_index.toUpperCase() === enterpriseFilter.toUpperCase()
      )
    : enterpriseApps;

  const filteredLocal = localFilter
    ? localApps.filter(
        (app) =>
          app.letter_index.toUpperCase() === localFilter.toUpperCase()
      )
    : localApps;

  const enterpriseLetters = new Set(
    enterpriseApps.map((a) => a.letter_index.toUpperCase())
  );
  const localLetters = new Set(
    localApps.map((a) => a.letter_index.toUpperCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* My Favorites */}
      <div>
        <button
          onClick={() => toggle("favorites")}
          className="w-full flex items-center justify-between px-4 py-3 bg-blue-700 text-white hover:bg-blue-800 transition-colors"
        >
          <span className="text-sm font-semibold flex items-center gap-2">
            ⭐ My Favorites
          </span>
          <span className="text-xs">{openSections.favorites ? "▲" : "▼"}</span>
        </button>

        {openSections.favorites && (
          <div className="p-3 bg-blue-50 border-b border-gray-200">
            {favorites.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-2">
                No favorites yet. Click the star on any app to add.
              </p>
            ) : (
              <ul className="space-y-1">
                {favorites.map((fav) => {
                  const name =
                    fav.custom_link_name ||
                    fav.application?.name ||
                    "Unknown";
                  const url =
                    fav.custom_link_url || fav.application?.url || "#";
                  return (
                    <li key={fav.id}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <span className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center text-xs">
                          ⭐
                        </span>
                        <span className="truncate">{name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Enterprise Applications */}
      <div>
        <button
          onClick={() => toggle("enterprise")}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 text-white hover:bg-gray-800 transition-colors"
        >
          <span className="text-sm font-semibold flex items-center gap-2">
            🌐 Enterprise Applications
          </span>
          <span className="text-xs">{openSections.enterprise ? "▲" : "▼"}</span>
        </button>

        {openSections.enterprise && (
          <div className="border-b border-gray-200">
            {/* A-Z Filter */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-wrap gap-0.5">
                <button
                  onClick={() => setEnterpriseFilter("")}
                  className={`px-1.5 py-0.5 text-xs rounded ${
                    enterpriseFilter === ""
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() =>
                      setEnterpriseFilter(
                        enterpriseFilter === letter ? "" : letter
                      )
                    }
                    className={`px-1.5 py-0.5 text-xs rounded ${
                      enterpriseFilter === letter
                        ? "bg-blue-600 text-white"
                        : enterpriseLetters.has(letter)
                        ? "text-gray-700 hover:bg-gray-200"
                        : "text-gray-300 cursor-default"
                    }`}
                    disabled={!enterpriseLetters.has(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {filteredEnterprise.length === 0 ? (
                <li className="px-4 py-3 text-xs text-gray-400 text-center">
                  No applications found.
                </li>
              ) : (
                filteredEnterprise.map((app) => (
                  <AppListItem key={app.id} app={app} userId={userId} />
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Local Applications */}
      <div>
        <button
          onClick={() => toggle("local")}
          className="w-full flex items-center justify-between px-4 py-3 bg-green-700 text-white hover:bg-green-800 transition-colors"
        >
          <span className="text-sm font-semibold flex items-center gap-2">
            🏭 Local Applications
          </span>
          <span className="text-xs">{openSections.local ? "▲" : "▼"}</span>
        </button>

        {openSections.local && (
          <div>
            {/* A-Z Filter */}
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-wrap gap-0.5">
                <button
                  onClick={() => setLocalFilter("")}
                  className={`px-1.5 py-0.5 text-xs rounded ${
                    localFilter === ""
                      ? "bg-green-600 text-white"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    onClick={() =>
                      setLocalFilter(localFilter === letter ? "" : letter)
                    }
                    className={`px-1.5 py-0.5 text-xs rounded ${
                      localFilter === letter
                        ? "bg-green-600 text-white"
                        : localLetters.has(letter)
                        ? "text-gray-700 hover:bg-gray-200"
                        : "text-gray-300 cursor-default"
                    }`}
                    disabled={!localLetters.has(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {filteredLocal.length === 0 ? (
                <li className="px-4 py-3 text-xs text-gray-400 text-center">
                  No local applications for your site.
                </li>
              ) : (
                filteredLocal.map((app) => (
                  <AppListItem key={app.id} app={app} userId={userId} />
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function AppListItem({
  app,
  userId,
}: {
  app: Application;
  userId: string;
}) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_id: app.id }),
      });
      if (res.ok) {
        setIsFav(!isFav);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 group">
      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
        {app.letter_index.toUpperCase()}
      </div>
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0 text-xs text-gray-700 hover:text-blue-700 truncate"
        title={app.description || app.name}
      >
        {app.name}
      </a>
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`opacity-0 group-hover:opacity-100 text-xs transition-opacity ${
          isFav ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
        }`}
        title={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        ⭐
      </button>
    </li>
  );
}
