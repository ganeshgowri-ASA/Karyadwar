"use client";

import { useState } from "react";

interface EmployeeEvent {
  id: number;
  emp_no: string;
  event_type: "birthday" | "long_service";
  event_date: string;
  department: string | null;
  email: string | null;
  photo_url: string | null;
}

interface EmployeeEventsPanelProps {
  events: EmployeeEvent[];
}

export function EmployeeEventsPanel({ events }: EmployeeEventsPanelProps) {
  const [activeTab, setActiveTab] = useState<"birthday" | "long_service">(
    "birthday"
  );

  const birthdayEvents = events.filter((e) => e.event_type === "birthday");
  const longServiceEvents = events.filter(
    (e) => e.event_type === "long_service"
  );

  const currentEvents =
    activeTab === "birthday" ? birthdayEvents : longServiceEvents;

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-3">
        <button
          onClick={() => setActiveTab("birthday")}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "birthday"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🎂 Birthdays ({birthdayEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("long_service")}
          className={`flex-1 py-2 text-xs font-medium transition-colors ${
            activeTab === "long_service"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          🏆 Long Service ({longServiceEvents.length})
        </button>
      </div>

      {currentEvents.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-xs">
          No {activeTab === "birthday" ? "birthdays" : "long service awards"} today or upcoming.
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                {activeTab === "birthday" ? "🎂" : "🏆"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  Emp #{event.emp_no}
                </p>
                {event.department && (
                  <p className="text-xs text-gray-500">{event.department}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
