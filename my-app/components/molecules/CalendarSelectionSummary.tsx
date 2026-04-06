"use client";

type Props = {
  count: number;
  label: string | null;
};

export default function CalendarSelectionSummary({ count, label }: Props) {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#0d101b] px-4 py-4 text-sm text-[#707896]">
      {label && count > 0
        ? `${count} renewal${count > 1 ? "s" : ""} on ${label}`
        : "Click on a day to see renewals"}
    </div>
  );
}
