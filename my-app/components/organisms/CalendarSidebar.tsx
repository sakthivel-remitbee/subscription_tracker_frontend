"use client";

import CalendarRenewalListItem from "../molecules/CalendarRenewalListItem";
import CalendarSelectionSummary from "../molecules/CalendarSelectionSummary";
import CalendarSelectedDayCard from "../molecules/CalendarSelectedDayCard";
import { SubscriptionItem } from "@/types/subscription";

type Props = {
  currentMonthLabel: string;
  isLoading: boolean;
  loadError: string | null;
  monthRenewals: SubscriptionItem[];
  selectedDateItems: SubscriptionItem[];
  selectedDateCount: number;
  selectedDateKey: string | null;
  selectedLabel: string | null;
  formatShortDate: (date: Date) => string;
  onSelectDate: (key: string) => void;
  parseApiDate: (value: string) => Date;
};

export default function CalendarSidebar({
  currentMonthLabel,
  isLoading,
  loadError,
  monthRenewals,
  selectedDateItems,
  selectedDateCount,
  selectedDateKey,
  selectedLabel,
  formatShortDate,
  onSelectDate,
  parseApiDate,
}: Props) {
  return (
    <aside className="space-y-4">
      <CalendarSelectedDayCard items={selectedDateItems} label={selectedLabel} />
      <CalendarSelectionSummary count={selectedDateCount} label={selectedLabel} />

      <div className="rounded-[1.75rem] border border-white/6 bg-[#0d101b] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">
            {currentMonthLabel} Renewals
          </h3>
          {isLoading && <span className="text-xs text-[#6f7895]">Loading...</span>}
        </div>

        {loadError ? (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {loadError}
          </p>
        ) : monthRenewals.length === 0 ? (
          <p className="mt-4 text-sm text-[#707896]">
            No renewals scheduled for this month.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {monthRenewals.map((item) => (
              <CalendarRenewalListItem
                key={`${item.id}-${item.nextRenewal}`}
                item={item}
                dateLabel={formatShortDate(parseApiDate(item.nextRenewal))}
                isActive={selectedDateKey === item.nextRenewal}
                onClick={() => onSelectDate(item.nextRenewal)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
