"use client";

import CalendarDayCell from "../atoms/CalendarDayCell";
import { SubscriptionItem } from "@/types/subscription";

type Props = {
  monthDays: Array<Date | null>;
  renewalsByDate: Record<string, SubscriptionItem[]>;
  selectedDateKey: string | null;
  todayKey: string;
  toDateKey: (date: Date) => string;
  onSelectDate: (key: string) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({
  monthDays,
  renewalsByDate,
  selectedDateKey,
  todayKey,
  toDateKey,
  onSelectDate,
}: Props) {
  return (
    <div className="rounded-[1.75rem] border border-white/6 bg-[#0d101b] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="mb-5 grid grid-cols-7 gap-3 px-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#59617d]">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {monthDays.map((date, index) => {
          if (!date) {
            return <CalendarDayCell key={`empty-${index}`} date={null} isSelected={false} isToday={false} items={[]} onSelect={() => {}} />;
          }

          const key = toDateKey(date);

          return (
            <CalendarDayCell
              key={key}
              date={date}
              isSelected={selectedDateKey === key}
              isToday={key === todayKey}
              items={renewalsByDate[key] ?? []}
              onSelect={() => onSelectDate(key)}
            />
          );
        })}
      </div>
    </div>
  );
}
