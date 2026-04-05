"use client";

type Props = {
  label: string;
  value: string;
};

export default function CalendarStatCard({ label, value }: Props) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#101321] px-4 py-3">
      <p className="text-[11px] text-[#6e7691]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
