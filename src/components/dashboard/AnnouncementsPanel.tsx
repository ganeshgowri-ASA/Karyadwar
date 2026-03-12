"use client";

import { formatDate } from "@/lib/utils";

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  expires_at: string | null;
}

interface AnnouncementsPanelProps {
  announcements: Announcement[];
}

export function AnnouncementsPanel({ announcements }: AnnouncementsPanelProps) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        No announcements at this time.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className="border-l-4 border-blue-600 pl-3 py-1"
        >
          <h4 className="text-sm font-semibold text-gray-800">{ann.title}</h4>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-3">
            {ann.content}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(ann.created_at)}
            {ann.expires_at && (
              <span> · Expires: {formatDate(ann.expires_at)}</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
