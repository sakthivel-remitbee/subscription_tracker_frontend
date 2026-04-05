"use client";

import CalendarNavButton from "../atoms/CalendarNavButton";
import CalendarStatCard from "../atoms/CalendarStatCard";

type Props = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  monthLabel: string;
  monthTotal: string;
  onNext: () => void;
  onPrev: () => void;
  renewalDaysCount: number;
};

export default function CalendarMonthHeader({
  hasNextPage,
  hasPrevPage,
  monthLabel,
  monthTotal,
  onNext,
  onPrev,
  renewalDaysCount,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {hasPrevPage && <CalendarNavButton direction="prev" onClick={onPrev} />}
        <h2 className="min-w-[132px] text-2xl font-semibold tracking-tight text-white">
          {monthLabel}
        </h2>
        {hasNextPage && <CalendarNavButton direction="next" onClick={onNext} />}
      </div>

      <div className="flex gap-3">
        <CalendarStatCard
          label="Renewals"
          value={`${renewalDaysCount} days`}
        />
        <CalendarStatCard label="Month Total" value={monthTotal} />
      </div>
    </div>
  );
}
