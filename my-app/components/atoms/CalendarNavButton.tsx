"use client";

type Props = {
  direction: "prev" | "next";
  onClick: () => void;
};

export default function CalendarNavButton({ direction, onClick }: Props) {
  const path = direction === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-[#9098b4] transition hover:border-white/15 hover:text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </button>
  );
}
