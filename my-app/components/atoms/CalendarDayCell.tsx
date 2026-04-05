"use client";

import { SubscriptionItem } from "@/types/subscription";

type Props = {
  date: Date | null;
  isSelected: boolean;
  isToday: boolean;
  items: SubscriptionItem[];
  onSelect: () => void;
};

export default function CalendarDayCell({
  date,
  isSelected,
  isToday,
  items,
  onSelect,
}: Props) {
  if (!date) {
    return <div className="min-h-[112px]" />;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`min-h-[112px] rounded-2xl border p-3 text-left transition ${
        isSelected
          ? "border-[#3f43c8] bg-[#1a1d4a] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_14px_34px_rgba(54,60,200,0.18)]"
          : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-sm font-semibold ${
            isSelected
              ? "bg-white/12 text-white"
              : isToday
                ? "bg-[#5347ff] text-white"
                : "text-[#8d96b3]"
          }`}
        >
          {date.getDate()}
        </span>
        {items.length > 0 && (
          <span className="text-[10px] text-[#7e86a3]">{items.length}</span>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-6 space-y-2">
          {items.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 text-[10px] ${
                isSelected ? "text-[#c9cdf8]" : "text-[#77809c]"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: item.brandColorHex || "#7c84a1" }}
              />
              <span className="truncate">{item.serviceName}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
