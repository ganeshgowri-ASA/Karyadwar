"use client";

interface TickerBarProps {
  items: Array<{ id: number; content: string }>;
}

export function TickerBar({ items }: TickerBarProps) {
  if (!items || items.length === 0) return null;

  const text = items.map((item) => item.content).join("   •   ");

  return (
    <div className="bg-blue-800 text-white py-1.5 overflow-hidden">
      <div className="flex items-center">
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 mr-3 whitespace-nowrap z-10">
          UPDATES
        </span>
        <div className="ticker-container flex-1">
          <span className="ticker-content text-sm">{text}</span>
        </div>
      </div>
    </div>
  );
}
