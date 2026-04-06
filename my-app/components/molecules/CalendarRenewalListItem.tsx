"use client";

import { SubscriptionItem } from "@/types/subscription";

type Props = {
  item: SubscriptionItem;
  dateLabel: string;
  isActive?: boolean;
  onClick?: () => void;
};

export default function CalendarRenewalListItem({
  item,
  dateLabel,
  isActive = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
        isActive
          ? "border-[#3438b8] bg-[#171a38]"
          : "border-white/6 bg-transparent hover:border-white/10 hover:bg-white/[0.02]"
      }`}
    >
      <div
        className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-semibold text-white"
        style={{ backgroundColor: item.brandColorHex || "#3f4764" }}
      >
        {item.serviceName.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {item.serviceName}
        </p>
        <p className="text-xs text-[#727a97]">{dateLabel}</p>
      </div>

      <p className="text-sm font-semibold text-[#d6dcf2]">{item.cost}</p>
    </button>
  );
}
