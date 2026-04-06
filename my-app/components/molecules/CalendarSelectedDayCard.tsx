"use client";

import { SubscriptionItem } from "@/types/subscription";

type Props = {
  items: SubscriptionItem[];
  label: string | null;
};

export default function CalendarSelectedDayCard({ items, label }: Props) {
  return (
    <div className="rounded-[1.5rem] border border-white/6 bg-[#11131f] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {label ?? "Select a date"}
        </h3>
        <button
          type="button"
          className="text-sm text-[#707896] transition hover:text-white"
        >
          ×
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[#707896]">
          Choose a renewal date to see the focused card.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.nextRenewal}`}
              className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3"
            >
              <div
                className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-semibold text-white"
                style={{ backgroundColor: item.brandColorHex || "#f4a63f" }}
              >
                {item.serviceName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {item.serviceName}
                </p>
                <p className="text-xs text-[#727a97]">{item.category}</p>
              </div>

              <p className="text-sm font-semibold text-white">{item.cost}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
